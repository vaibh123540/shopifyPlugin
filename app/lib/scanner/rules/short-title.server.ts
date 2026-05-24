import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

const MIN_RECOMMENDED_TITLE_LENGTH = 20;

export function findShortTitleIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  return getScannableProducts(products)
    .filter((product) => product.title.trim().length < MIN_RECOMMENDED_TITLE_LENGTH)
    .map(
      (product): ProductIssue => ({
        id: `short_product_title:${product.id}`,
        ruleId: "short_product_title",
        severity: "warning",
        title: "Short product title",
        message:
          "This active product has a very short title. Short titles can make it harder for shoppers and product listing systems to understand exactly what is being sold.",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productStatus: product.status,
        variantId: null,
        variantTitle: null,
        field: "title",
        suggestedFix:
          "Expand the product title with the product type, brand, model, material, size, color, or other useful distinguishing details. Keep it readable and avoid keyword stuffing.",
      }),
    );
}
