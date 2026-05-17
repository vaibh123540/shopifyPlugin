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

Current app wrapper behavior:

- Authenticates admin request in the loader.
- Reads `SHOPIFY_API_KEY` from environment.
- Wraps embedded app UI in `AppProvider`.
- Renders child routes through `Outlet`.
- Does not include app navigation yet because there is only one dashboard page and `s-app-nav` caused an unsupported tag error in the current setup.

## Main flow

1. Merchant installs app through Shopify OAuth.
2. App stores shop/session data.
3. Merchant opens MerchantFix inside Shopify Admin.
4. Merchant clicks Run Scan.
5. Backend fetches products and variants through Shopify Admin GraphQL API.
6. Scanner runs deterministic rules.
7. Issues are saved or returned.
8. Dashboard displays score, issue categories, affected products, and suggested fixes.
9. Paid users can export CSV and unlock full report later.

## Current implemented flow

1. Merchant opens MerchantFix through Shopify CLI dev preview.
2. Embedded dashboard shell loads inside Shopify Admin.
3. Merchant can click Run Scan.
4. Placeholder action returns a message that scanner and product import are not connected yet.

## Core areas planned

- `app/lib/shopify`: Shopify API access
- `app/lib/scanner`: deterministic scanner rules
- `app/lib/reports`: CSV and report generation
- `app/lib/billing`: Shopify Billing logic
- `app/components`: reusable UI components

## Product import plan

Next implementation should fetch:

- Product ID
- Product title
- Product handle
- Product vendor / brand field
- Product description
- Product status
- Product images
- Variant ID
- Variant title
- Variant price
- Variant barcode / GTIN

The product import should be converted into a simple product snapshot type before scanner rules are run.

## Scanner plan

Scanner rules should remain deterministic first. The first rule should be missing barcode / GTIN:

- If a variant barcode is empty or missing, create an issue for that product variant.

## Not in architecture yet

- Google Merchant Center API integration
- Storefront widgets
- Checkout extensions
- Bulk editing
- Agency dashboard
