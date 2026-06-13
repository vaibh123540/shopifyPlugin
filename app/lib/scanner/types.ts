import type { ProductSnapshot } from "../shopify/product-import.server";

export type IssueSeverity = "critical" | "warning" | "info";

export type IssueRuleId =
  | "missing_barcode_gtin"
  | "missing_vendor_brand"
  | "missing_product_image"
  | "short_product_title"
  | "short_product_description";

export type IssueField =
  | "barcode"
  | "vendor"
  | "featuredImage"
  | "title"
  | "description";

export type ProductIssue = {
  id: string;
  ruleId: IssueRuleId;
  severity: IssueSeverity;
  title: string;
  message: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  productStatus: string;
  variantId: string | null;
  variantTitle: string | null;
  field: IssueField;
  suggestedFix: string;
};

export type ScanSummary = {
  readinessScore: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  missingBarcodeIssues: number;
  missingVendorIssues: number;
  missingImageIssues: number;
  shortTitleIssues: number;
  shortDescriptionIssues: number;
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
