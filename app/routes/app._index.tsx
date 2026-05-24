import type { CSSProperties } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

import type {
  ProductImportResult,
  ProductSnapshot,
  ProductVariantSnapshot,
} from "../lib/shopify/product-import.server";
import {
  runCatalogScan,
  type CatalogScanResult,
} from "../lib/scanner/run-scan.server";
import type { ProductIssue, ScanSummary } from "../lib/scanner/types";
import { authenticate } from "../shopify.server";

type ProductDebugRow = {
  productId: string;
  productTitle: string;
  productHandle: string;
  productVendor: string;
  productStatus: string;
  featuredImageUrl: string | null;
  variantId: string;
  variantTitle: string;
  variantSku: string | null;
  variantBarcode: string | null;
  variantPrice: string;
  issueTitle: string | null;
};

type ScanActionResponse =
  | {
      status: "success";
      message: string;
      importedAt: string;
      productCount: number;
      variantCount: number;
      hasMoreVariants: boolean;
      maxVariants: number;
      summary: ScanSummary;
      issues: ProductIssue[];
      debugRows: ProductDebugRow[];
    }
  | {
      status: "error";
      message: string;
    };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ScanActionResponse> => {
  const { admin } = await authenticate.admin(request);

  try {
    const scanResult: CatalogScanResult = await runCatalogScan(admin, {
      maxVariants: 100,
    });
    const issueTitlesByProductAndVariant = buildIssueTitlesByProductAndVariant(
      scanResult.issues,
    );

    return {
      status: "success",
      message: scanResult.hasMoreVariants
        ? `Imported the first ${scanResult.variantCount} variants and found ${scanResult.summary.totalIssues} issue(s). More variants exist and will be handled by a full background scan later.`
        : `Imported ${scanResult.variantCount} variants and found ${scanResult.summary.totalIssues} issue(s).`,
      importedAt: new Date().toISOString(),
      productCount: scanResult.productCount,
      variantCount: scanResult.variantCount,
      hasMoreVariants: scanResult.hasMoreVariants,
      maxVariants: scanResult.maxVariants,
      summary: scanResult.summary,
      issues: scanResult.issues,
      debugRows: buildDebugRows(scanResult, issueTitlesByProductAndVariant),
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown product scan error.";

    return {
      status: "error",
      message,
    };
  }
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const scanResult = fetcher.data;
  const isScanning =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const importedProductCount =
    scanResult?.status === "success" ? scanResult.productCount : 0;

  const importedVariantCount =
    scanResult?.status === "success" ? scanResult.variantCount : 0;

  const productRows: ProductDebugRow[] =
    scanResult?.status === "success" ? scanResult.debugRows : [];

  const summary: ScanSummary | null =
    scanResult?.status === "success" ? scanResult.summary : null;
  const readinessScore = summary
    ? `${summary.readinessScore} / 100`
    : "-- / 100";

  const runScan = () => {
    fetcher.submit({}, { method: "POST" });
  };

  return (
    <s-page heading="MerchantFix">
      <s-button
        slot="primary-action"
        onClick={runScan}
        {...(isScanning ? { loading: true } : {})}
      >
        Run scan
      </s-button>

      <s-section heading="Google Shopping readiness scanner">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            MerchantFix helps Shopify merchants find product catalog issues that
            may affect Google Shopping and Merchant Center readiness.
          </s-paragraph>

          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="small">
              <s-heading>Current phase</s-heading>
              <s-paragraph>
                The first deterministic scanner rules are connected. Run scan now
                imports Shopify variants and flags active products with missing
                barcode / GTIN or vendor / brand data.
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Readiness score">
        <s-stack direction="block" gap="base">
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="small">
              <s-heading>{readinessScore}</s-heading>
              <s-paragraph>
                This first score is based on active product checks for missing
                barcode / GTIN and missing vendor / brand data. More weighting
                will be added as scanner rules are implemented.
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Scan status">
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack direction="block" gap="small">
              <s-heading>{getScanStatusHeading(scanResult)}</s-heading>

              <s-paragraph>
                {scanResult?.message ||
                  "Click Run scan to fetch products and variants from Shopify."}
              </s-paragraph>

              {scanResult?.status === "success" && (
                <s-paragraph>
                  Last scanned at: {new Date(scanResult.importedAt).toLocaleString()}
                </s-paragraph>
              )}
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Imported catalog debug">
        <s-stack direction="block" gap="base">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{importedProductCount}</s-heading>
                <s-paragraph>Imported products</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{importedVariantCount}</s-heading>
                <s-paragraph>Imported variants</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{summary?.scannedVariants ?? 0}</s-heading>
                <s-paragraph>Active variants scanned</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>
                  {scanResult?.status === "success" && scanResult.hasMoreVariants
                    ? "Yes"
                    : "No"}
                </s-heading>
                <s-paragraph>More variants after debug limit</s-paragraph>
              </s-stack>
            </s-box>
          </div>

          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-paragraph>
              This debug scan currently reads up to 100 variants per scan so the
              embedded dashboard stays fast during development. Draft and archived
              products are imported for visibility, but scanner issues are counted
              only for active products.
            </s-paragraph>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Issue summary">
        <s-stack direction="block" gap="base">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{summary?.missingBarcodeIssues ?? 0}</s-heading>
                <s-paragraph>Missing barcode / GTIN</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{summary?.missingVendorIssues ?? 0}</s-heading>
                <s-paragraph>Missing vendor / brand</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{summary?.criticalIssues ?? 0}</s-heading>
                <s-paragraph>Critical issues</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{summary?.affectedProducts ?? 0}</s-heading>
                <s-paragraph>Affected products</s-paragraph>
              </s-stack>
            </s-box>

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="small">
                <s-heading>{summary?.affectedVariants ?? 0}</s-heading>
                <s-paragraph>Affected variants</s-paragraph>
              </s-stack>
            </s-box>
          </div>

          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack direction="block" gap="small">
              <s-heading>Active scanner checks</s-heading>
              <s-unordered-list>
                <s-list-item>Missing barcode / GTIN</s-list-item>
                <s-list-item>Missing vendor / brand</s-list-item>
              </s-unordered-list>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Imported product variants">
        <s-box padding="base" borderWidth="base" borderRadius="base">
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Product</th>
                  <th style={tableHeaderStyle}>Vendor</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Variant</th>
                  <th style={tableHeaderStyle}>SKU</th>
                  <th style={tableHeaderStyle}>Barcode / GTIN</th>
                  <th style={tableHeaderStyle}>Issue</th>
                  <th style={tableHeaderStyle}>Price</th>
                  <th style={tableHeaderStyle}>Image</th>
                </tr>
              </thead>

              <tbody>
                {productRows.length > 0 ? (
                  productRows.map((row) => (
                    <tr key={row.variantId}>
                      <td style={tableCellStyle}>
                        {row.productTitle}
                        <br />
                        <small>{row.productHandle}</small>
                      </td>
                      <td style={tableCellStyle}>{row.productVendor || "—"}</td>
                      <td style={tableCellStyle}>{row.productStatus}</td>
                      <td style={tableCellStyle}>{row.variantTitle}</td>
                      <td style={tableCellStyle}>{row.variantSku || "—"}</td>
                      <td style={tableCellStyle}>
                        {row.variantBarcode || "Missing"}
                      </td>
                      <td style={tableCellStyle}>{row.issueTitle || "—"}</td>
                      <td style={tableCellStyle}>{row.variantPrice}</td>
                      <td style={tableCellStyle}>
                        {row.featuredImageUrl ? "Present" : "Missing"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={tableCellStyle} colSpan={9}>
                      No product data imported yet. Click Run scan to fetch
                      product variants from Shopify.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </s-box>
      </s-section>

      <s-section slot="aside" heading="MVP scope">
        <s-paragraph>
          MerchantFix is currently focused on deterministic product catalog
          checks for Google Shopping readiness.
        </s-paragraph>

        <s-unordered-list>
          <s-list-item>No Google Merchant Center API yet</s-list-item>
          <s-list-item>No Shopify Billing yet</s-list-item>
          <s-list-item>No AI suggestions yet</s-list-item>
          <s-list-item>No storefront or checkout extensions</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Next build steps">
        <s-unordered-list>
          <s-list-item>Add missing vendor / brand scanner rule</s-list-item>
          <s-list-item>Add missing product image scanner rule</s-list-item>
          <s-list-item>Improve readiness score weighting</s-list-item>
          <s-list-item>Add empty, loading, and error states</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

function buildDebugRows(
  scanResult: ProductImportResult,
  issueTitlesByProductAndVariant: Map<string, string[]>,
): ProductDebugRow[] {
  return scanResult.products.flatMap((product: ProductSnapshot) =>
    product.variants.map((variant: ProductVariantSnapshot): ProductDebugRow => {
      const issueTitles = [
        ...(issueTitlesByProductAndVariant.get(product.id) ?? []),
        ...(issueTitlesByProductAndVariant.get(variant.id) ?? []),
      ];

      return {
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productVendor: product.vendor,
        productStatus: product.status,
        featuredImageUrl: product.featuredImageUrl,
        variantId: variant.id,
        variantTitle: variant.title,
        variantSku: variant.sku,
        variantBarcode: variant.barcode,
        variantPrice: variant.price,
        issueTitle: issueTitles.length > 0 ? issueTitles.join(", ") : null,
      };
    }),
  );
}

function buildIssueTitlesByProductAndVariant(
  issues: ProductIssue[],
): Map<string, string[]> {
  const issueTitlesByProductAndVariant = new Map<string, string[]>();

  for (const issue of issues) {
    const key = issue.variantId ?? issue.productId;
    const issueTitles = issueTitlesByProductAndVariant.get(key) ?? [];

    issueTitles.push(issue.title);
    issueTitlesByProductAndVariant.set(key, issueTitles);
  }

  return issueTitlesByProductAndVariant;
}

function getScanStatusHeading(scanResult: ScanActionResponse | undefined) {
  if (!scanResult) {
    return "No scan yet";
  }

  if (scanResult.status === "error") {
    return "Scan failed";
  }

  return "Scan complete";
}

const tableHeaderStyle: CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const tableCellStyle: CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

export const headers: HeadersFunction = (
  headersArgs: Parameters<HeadersFunction>[0],
) => {
  return boundary.headers(headersArgs);
};
