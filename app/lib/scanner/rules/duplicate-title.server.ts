import type { ProductSnapshot } from "../../shopify/product-import.server";
import type { ProductIssue } from "../types";
import { getScannableProducts } from "../types";

export function findDuplicateTitleIssues(
  products: ProductSnapshot[],
): ProductIssue[] {
  const productsByNormalizedTitle = new Map<string, ProductSnapshot[]>();

  for (const product of getScannableProducts(products)) {
    const normalizedTitle = normalizeTitle(product.title);

    if (!normalizedTitle) {
      continue;
    }

    const matchingProducts = productsByNormalizedTitle.get(normalizedTitle) ?? [];

    matchingProducts.push(product);
    productsByNormalizedTitle.set(normalizedTitle, matchingProducts);
  }

  const issues: ProductIssue[] = [];

  for (const duplicateProducts of productsByNormalizedTitle.values()) {
    if (duplicateProducts.length < 2) {
      continue;
    }

    for (const product of duplicateProducts) {
      issues.push({
        id: `duplicate_product_title:${product.id}`,
        ruleId: "duplicate_product_title",
        severity: "warning",
        title: "Duplicate product title",
        message:
          "This active product shares the same title as another active product. Duplicate titles can make product listings harder to distinguish in Shopping surfaces and merchant reports.",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productStatus: product.status,
        variantId: null,
        variantTitle: null,
        field: "title",
        suggestedFix:
          "Make the product title unique by adding a useful distinguishing detail such as product type, model, material, color, size, pack count, collection, or use case. Keep it readable and avoid keyword stuffing.",
      });
    }
  }

  return issues;
}

function normalizeTitle(title: string): string {
  return title.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}
