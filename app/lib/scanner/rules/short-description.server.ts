import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

const MIN_RECOMMENDED_DESCRIPTION_LENGTH = 100;

export function findShortDescriptionIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  return getScannableProducts(products)
    .filter(
      (product) =>
        product.description.trim().length < MIN_RECOMMENDED_DESCRIPTION_LENGTH,
    )
    .map(
      (product): ProductIssue => ({
        id: `short_product_description:${product.id}`,
        ruleId: "short_product_description",
        severity: "warning",
        title: "Short product description",
        message:
          "This active product has a very short description. Thin descriptions can make it harder for shoppers and product listing systems to understand the product's key details.",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productStatus: product.status,
        variantId: null,
        variantTitle: null,
        field: "description",
        suggestedFix:
          "Add a clear product description with the product type, main benefits, materials, sizing, compatibility, use cases, and other purchase-relevant details. Keep it natural and avoid keyword stuffing.",
      }),
    );
}
