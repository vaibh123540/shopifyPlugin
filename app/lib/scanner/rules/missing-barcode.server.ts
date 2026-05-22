import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

export function findMissingBarcodeIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  return getScannableProducts(products).flatMap((product) =>
    product.variants
      .filter((variant) => !variant.barcode)
      .map(
        (variant): ProductIssue => ({
          id: `missing_barcode_gtin:${variant.id}`,
          ruleId: "missing_barcode_gtin",
          severity: "critical",
          title: "Missing barcode / GTIN",
          message:
            "This active product variant does not have a barcode / GTIN. Google Shopping commonly uses GTINs to identify commercial products and improve product matching.",
          productId: product.id,
          productTitle: product.title,
          productHandle: product.handle,
          productStatus: product.status,
          variantId: variant.id,
          variantTitle: variant.title,
          field: "barcode",
          suggestedFix:
            "Add the product's valid barcode / GTIN to the variant barcode field in Shopify. If the product is custom-made or does not have a GTIN, document that exception for a later custom-product rule.",
        }),
      ),
  );
}
