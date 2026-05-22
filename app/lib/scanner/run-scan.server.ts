import {
  fetchProductSnapshots,
  type ProductImportResult,
} from "../shopify/product-import.server";
import { findMissingBarcodeIssues } from "./rules/missing-barcode.server";
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
  const issues = findMissingBarcodeIssues(importResult.products);
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
    issues.map((issue) => issue.variantId),
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

  return {
    readinessScore: calculateReadinessScore({
      issueCount: missingBarcodeIssues,
      scannedVariants,
    }),
    totalIssues: issues.length,
    criticalIssues,
    warningIssues,
    infoIssues,
    missingBarcodeIssues,
    affectedProducts: affectedProductIds.size,
    affectedVariants: affectedVariantIds.size,
    scannedProducts: scannableProducts.length,
    scannedVariants,
    skippedProducts: importResult.productCount - scannableProducts.length,
  };
}

function calculateReadinessScore({
  issueCount,
  scannedVariants,
}: {
  issueCount: number;
  scannedVariants: number;
}): number {
  if (scannedVariants === 0) {
    return 0;
  }

  const issueRatio = issueCount / scannedVariants;

  return Math.max(0, Math.min(100, Math.round(100 - issueRatio * 100)));
}
