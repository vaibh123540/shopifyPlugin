import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

export function findMissingImageIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  return getScannableProducts(products)
    .filter((product) => !product.featuredImageUrl)
    .map(
      (product): ProductIssue => ({
        id: `missing_product_image:${product.id}`,
        ruleId: "missing_product_image",
        severity: "critical",
        title: "Missing product image",
        message:
          "This active product does not have a featured product image. Google Shopping listings need clear product images so shoppers can understand what is being sold.",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productStatus: product.status,
        variantId: null,
        variantTitle: null,
        field: "featuredImage",
        suggestedFix:
          "Add a clear featured image to the product in Shopify. Use a product-focused image with good lighting, accurate colors, and minimal distracting text or overlays.",
      }),
    );
}
