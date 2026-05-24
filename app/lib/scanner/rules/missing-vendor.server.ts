import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

export function findMissingVendorIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  return getScannableProducts(products)
    .filter((product) => !product.vendor.trim())
    .map(
      (product): ProductIssue => ({
        id: `missing_vendor_brand:${product.id}`,
        ruleId: "missing_vendor_brand",
        severity: "warning",
        title: "Missing vendor / brand",
        message:
          "This active product does not have a vendor / brand value. Google Shopping product data usually performs better when brand information is clear and consistent.",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productStatus: product.status,
        variantId: null,
        variantTitle: null,
        field: "vendor",
        suggestedFix:
          "Add the product brand or manufacturer to the vendor field in Shopify. If this is your own private-label product, use your store or brand name consistently.",
      }),
    );
}
