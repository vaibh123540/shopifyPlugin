type ShopifyAdminClient = {
  graphql: (
    query: string,
    options?: {
      variables?: Record<string, unknown>;
    },
  ) => Promise<Response>;
};

type GraphQLError = {
  message: string;
};

type ProductVariantNode = {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: string;
  product: {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    description: string;
    descriptionHtml: string;
    status: string;
    featuredMedia: null | {
      __typename: string;
      alt?: string | null;
      image?: null | {
        url: string;
        altText: string | null;
      };
    };
  };
};

type ProductVariantsQueryResponse = {
  data?: {
    productVariants: {
      nodes: ProductVariantNode[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
  errors?: GraphQLError[];
};

export type ProductVariantSnapshot = {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: string;
};

export type ProductSnapshot = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  status: string;
  featuredImageUrl: string | null;
  featuredImageAltText: string | null;
  variants: ProductVariantSnapshot[];
};

export type ProductImportResult = {
  products: ProductSnapshot[];
  productCount: number;
  variantCount: number;
  hasMoreVariants: boolean;
  maxVariants: number;
};

const PRODUCT_VARIANT_PAGE_SIZE = 50;

const PRODUCT_VARIANTS_QUERY = `#graphql
  query MerchantFixProductVariants($first: Int!, $after: String) {
    productVariants(first: $first, after: $after) {
      nodes {
        id
        title
        sku
        barcode
        price
        product {
          id
          title
          handle
          vendor
          description
          descriptionHtml
          status
          featuredMedia {
            __typename
            ... on MediaImage {
              alt
              image {
                url
                altText
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function fetchProductSnapshots(
  admin: ShopifyAdminClient,
  options: {
    maxVariants?: number;
  } = {},
): Promise<ProductImportResult> {
  const maxVariants = options.maxVariants ?? 100;
  const productMap = new Map<string, ProductSnapshot>();

  let after: string | null = null;
  let hasNextPage = true;
  let importedVariantCount = 0;

  while (hasNextPage && importedVariantCount < maxVariants) {
    const first = Math.min(
      PRODUCT_VARIANT_PAGE_SIZE,
      maxVariants - importedVariantCount,
    );

    const response = await admin.graphql(PRODUCT_VARIANTS_QUERY, {
      variables: {
        first,
        after,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Shopify Admin GraphQL request failed with ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as ProductVariantsQueryResponse;

    if (payload.errors?.length) {
      throw new Error(
        payload.errors.map((error) => error.message).join("; "),
      );
    }

    const connection = payload.data?.productVariants;

    if (!connection) {
      throw new Error("Shopify Admin GraphQL response did not include product variants.");
    }

    for (const variantNode of connection.nodes) {
      importedVariantCount += 1;

      const productNode = variantNode.product;
      const existingProduct = productMap.get(productNode.id);

      const variant: ProductVariantSnapshot = {
        id: variantNode.id,
        title: variantNode.title,
        sku: normalizeNullableString(variantNode.sku),
        barcode: normalizeNullableString(variantNode.barcode),
        price: variantNode.price,
      };

      if (existingProduct) {
        existingProduct.variants.push(variant);
        continue;
      }

      productMap.set(productNode.id, {
        id: productNode.id,
        title: productNode.title,
        handle: productNode.handle,
        vendor: productNode.vendor,
        description: productNode.description,
        descriptionHtml: productNode.descriptionHtml,
        status: productNode.status,
        featuredImageUrl: getFeaturedImageUrl(productNode.featuredMedia),
        featuredImageAltText: getFeaturedImageAltText(productNode.featuredMedia),
        variants: [variant],
      });
    }

    hasNextPage = connection.pageInfo.hasNextPage;
    after = connection.pageInfo.endCursor;
  }

  return {
    products: Array.from(productMap.values()),
    productCount: productMap.size,
    variantCount: importedVariantCount,
    hasMoreVariants: hasNextPage,
    maxVariants,
  };
}

function normalizeNullableString(value: string | null): string | null {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function getFeaturedImageUrl(
  featuredMedia: ProductVariantNode["product"]["featuredMedia"],
): string | null {
  if (featuredMedia?.__typename !== "MediaImage") {
    return null;
  }

  return featuredMedia.image?.url ?? null;
}

function getFeaturedImageAltText(
  featuredMedia: ProductVariantNode["product"]["featuredMedia"],
): string | null {
  if (featuredMedia?.__typename !== "MediaImage") {
    return null;
  }

  return featuredMedia.image?.altText ?? featuredMedia.alt ?? null;
}
