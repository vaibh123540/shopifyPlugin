# Architecture

## Stack

- Shopify embedded app
- React Router Shopify app template
- TypeScript
- Shopify Admin GraphQL API
- Shopify App Bridge
- Shopify Polaris web components / Shopify app UI components
- Prisma
- SQLite for local development
- Postgres later for production
- Shopify Billing later
- Optional AI layer later for explanations and rewrite suggestions

## Current app structure

Current dashboard route:

- `app/routes/app._index.tsx`

Current embedded app wrapper:

- `app/routes/app.tsx`

Current embedded app wrapper behavior:

- Authenticates admin request in the loader.
- Reads `SHOPIFY_API_KEY` from environment.
- Wraps embedded app UI in `AppProvider`.
- Renders child routes through `Outlet`.
- Does not include app navigation yet because there is only one dashboard page and `s-app-nav` caused an unsupported tag error in the current setup.

Product import helper:

- `app/lib/shopify/product-import.server.ts`

Scanner files:

- `app/lib/scanner/types.ts`
- `app/lib/scanner/run-scan.server.ts`
- `app/lib/scanner/rules/missing-barcode.server.ts`
- `app/lib/scanner/rules/missing-vendor.server.ts`
- `app/lib/scanner/rules/missing-image.server.ts`
- `app/lib/scanner/rules/short-title.server.ts`

## Main flow

1. Merchant installs app through Shopify OAuth.
2. App stores shop/session data.
3. Merchant opens MerchantFix inside Shopify Admin.
4. Merchant clicks Run Scan.
5. Backend fetches product variants through Shopify Admin GraphQL API.
6. Product variant records are normalized into product snapshots.
7. Scanner runs deterministic rules against product snapshots.
8. Issues are returned to the dashboard.
9. Dashboard displays score, issue categories, affected products, affected variants, deterministic fixes, and a debug table.
10. Paid users can export CSV and unlock full report later.

## Current implemented flow

1. Merchant opens MerchantFix through Shopify CLI dev preview.
2. Embedded dashboard loads inside Shopify Admin.
3. Merchant clicks Run Scan.
4. The action authenticates the admin request.
5. The app fetches up to 100 product variants from Shopify Admin GraphQL API.
6. The importer groups variants into product snapshots.
7. The scanner runs four deterministic rules:
   - Missing barcode / GTIN
   - Missing vendor / brand
   - Missing product image
   - Short product title
8. The dashboard shows imported product count, imported variant count, active variants scanned, issue summary, readiness score, fix checklist, and a debug table.

## Shopify access scopes

The app should include product read access for import:

- `read_products`

The current development config may also include:

- `write_products`

`write_products` is not required for the current scanner-only import, but it may already be present from the Shopify template setup.

## Product import implementation

The first import path uses Shopify Admin GraphQL `productVariants` rather than querying products first.

Reason:

- The first scanner rule was variant-level missing barcode / GTIN.
- Querying variants gives direct access to barcode, SKU, price, and associated product data.
- Product snapshots can be built by grouping variants by parent product.

Current imported fields include:

- Product ID
- Product title
- Product handle
- Product vendor / brand field
- Product description
- Product status
- Product featured image
- Variant ID
- Variant title
- Variant SKU
- Variant price
- Variant barcode / GTIN

## Product snapshot model

Product snapshots are in-memory normalized objects used by scanner rules.

Current shape is conceptually:

```ts
export type ProductSnapshot = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  description: string;
  status: string;
  featuredImageUrl: string | null;
  variants: ProductVariantSnapshot[];
};

export type ProductVariantSnapshot = {
  id: string;
  title: string;
  sku: string;
  barcode: string;
  price: string;
};
```

The exact source of truth is `app/lib/shopify/product-import.server.ts`.

## Scanner implementation

Scanner rules should remain deterministic first.

Current scanner behavior:

- Runs missing barcode / GTIN rule.
- Runs missing vendor / brand rule.
- Runs missing product image rule.
- Runs short product title rule.
- Flags active variants with missing barcode / GTIN.
- Flags active products with missing vendor / brand.
- Flags active products with missing featured image.
- Flags active products with titles shorter than the current threshold.
- Skips draft and archived products from issue counts.
- Still imports draft and archived products for dashboard debug visibility.
- Produces issue severity values.
- Calculates a readiness score using active variant and active product checks.

## Current rules

### Missing barcode / GTIN

- Variant-level rule.
- If an active variant barcode is empty or missing, create a critical issue for that product variant.

### Missing vendor / brand

- Product-level rule.
- If an active product vendor field is empty or missing, create a warning issue for that product.

### Missing product image

- Product-level rule.
- If an active product has no featured image URL, create a critical issue for that product.

### Short product title

- Product-level rule.
- If an active product title is shorter than 20 characters, create a warning issue for that product.
- Current confirmed example: `Gift Card`.

## Fix checklist implementation

The dashboard now groups scanner issues by issue type and shows deterministic suggested fixes.

Current checklist supports:

- Missing barcode / GTIN
- Missing vendor / brand
- Missing product image
- Short product title

Only issue groups with at least one current issue appear in the checklist.

## Current debug limits

The embedded dashboard debug scan currently fetches up to 100 variants per scan.

Reason:

- Keep the embedded app fast during development.
- Validate scanner behavior before building full pagination, persistence, or background jobs.

## Core areas planned

- `app/lib/shopify`: Shopify API access and import helpers
- `app/lib/scanner`: deterministic scanner rules
- `app/lib/reports`: CSV and report generation
- `app/lib/billing`: Shopify Billing logic
- `app/components`: reusable UI components

## Not in architecture yet

- Google Merchant Center API integration
- Storefront widgets
- Checkout extensions
- Bulk editing
- Agency dashboard
- Background scan jobs
- Persistent scan history
