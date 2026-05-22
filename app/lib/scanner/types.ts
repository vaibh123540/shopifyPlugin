import type { ProductSnapshot } from "../shopify/product-import.server";

export type IssueSeverity = "critical" | "warning" | "info";

export type ProductIssue = {
  id: string;
  ruleId: "missing_barcode_gtin";
  severity: IssueSeverity;
  title: string;
  message: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  productStatus: string;
  variantId: string;
  variantTitle: string;
  field: "barcode";
  suggestedFix: string;
};

export type ScanSummary = {
  readinessScore: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  missingBarcodeIssues: number;
  affectedProducts: number;
  affectedVariants: number;
  scannedProducts: number;
  scannedVariants: number;
  skippedProducts: number;
};

export function getScannableProducts(
  products: ProductSnapshot[],
): ProductSnapshot[] {
  return products.filter((product) => product.status === "ACTIVE");
}
