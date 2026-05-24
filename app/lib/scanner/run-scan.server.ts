import {
  fetchProductSnapshots,
  type ProductImportResult,
} from "../shopify/product-import.server";
import { findMissingBarcodeIssues } from "./rules/missing-barcode.server";
import { findMissingImageIssues } from "./rules/missing-image.server";
import { findMissingVendorIssues } from "./rules/missing-vendor.server";
import { findShortTitleIssues } from "./rules/short-title.server";
import {
  getScannableProducts,
  type ProductIssue,
  type ScanSummary,
} from "./types";

type ShopifyAdminClient = Parameters<typeof fetchProductSnapshots>[0];

export type CatalogScanResult = ProductImportResult & {
  issues: ProductIssue[];
  summary: ScanSummary;
};

export async function runCatalogScan(
  admin: ShopifyAdminClient,
  options: {
    maxVariants?: number;
  } = {},
): Promise<CatalogScanResult> {
  const importResult = await fetchProductSnapshots(admin, options);
  const issues = [
    ...findMissingBarcodeIssues(importResult.products),
    ...findMissingVendorIssues(importResult.products),
    ...findMissingImageIssues(importResult.products),
    ...findShortTitleIssues(importResult.products),
  ];
  const summary = buildScanSummary(importResult, issues);

  return {
    ...importResult,
    issues,
    summary,
  };
}

function buildScanSummary(
  importResult: ProductImportResult,
  issues: ProductIssue[],
): ScanSummary {
  const scannableProducts = getScannableProducts(importResult.products);
  const scannedVariants = scannableProducts.reduce(
    (total, product) => total + product.variants.length,
    0,
  );

  const affectedProductIds = new Set(
    issues.map((issue) => issue.productId),
  );
  const affectedVariantIds = new Set(
    issues
      .map((issue) => issue.variantId)
      .filter((variantId): variantId is string => Boolean(variantId)),
  );

  const criticalIssues = issues.filter(
    (issue) => issue.severity === "critical",
  ).length;
  const warningIssues = issues.filter(
    (issue) => issue.severity === "warning",
  ).length;
  const infoIssues = issues.filter((issue) => issue.severity === "info").length;
  const missingBarcodeIssues = issues.filter(
    (issue) => issue.ruleId === "missing_barcode_gtin",
  ).length;
  const missingVendorIssues = issues.filter(
    (issue) => issue.ruleId === "missing_vendor_brand",
  ).length;
  const missingImageIssues = issues.filter(
    (issue) => issue.ruleId === "missing_product_image",
  ).length;
  const shortTitleIssues = issues.filter(
    (issue) => issue.ruleId === "short_product_title",
  ).length;

  return {
    readinessScore: calculateReadinessScore({
      failedChecks:
        missingBarcodeIssues +
        missingVendorIssues +
        missingImageIssues +
        shortTitleIssues,
      totalChecks: scannedVariants + scannableProducts.length * 3,
    }),
    totalIssues: issues.length,
    criticalIssues,
    warningIssues,
    infoIssues,
    missingBarcodeIssues,
    missingVendorIssues,
    missingImageIssues,
    shortTitleIssues,
    affectedProducts: affectedProductIds.size,
    affectedVariants: affectedVariantIds.size,
    scannedProducts: scannableProducts.length,
    scannedVariants,
    skippedProducts: importResult.productCount - scannableProducts.length,
  };
}

function calculateReadinessScore({
  failedChecks,
  totalChecks,
}: {
  failedChecks: number;
  totalChecks: number;
}): number {
  if (totalChecks === 0) {
    return 0;
  }

  const issueRatio = failedChecks / totalChecks;

  return Math.max(0, Math.min(100, Math.round(100 - issueRatio * 100)));
}
