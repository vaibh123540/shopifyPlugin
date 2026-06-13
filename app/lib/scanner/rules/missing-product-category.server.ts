import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

export function findMissingProductCategoryIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  return getScannableProducts(products)
    .filter((product) => !product.categoryId)
    .map(
      (product): ProductIssue => ({
        id: `missing_product_category:${product.id}`,
        ruleId: "missing_product_category",
        severity: "warning",
        title: "Missing product category",
        message:
          "This active product does not have a Shopify Standard Product Taxonomy category assigned. Category data helps Shopify and connected sales channels classify products consistently.",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productStatus: product.status,
        variantId: null,
        variantTitle: null,
        field: "category",
        suggestedFix:
          "Assign the most specific product category available in Shopify's product details. Use the standardized Shopify product taxonomy category that best matches what the item is, not a broad marketing collection.",
      }),
    );
}
