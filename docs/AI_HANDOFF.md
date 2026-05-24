# AI Handoff

You are helping build MerchantFix, a Shopify embedded app that scans a merchant's product catalog for Google Shopping / Merchant Center readiness issues.

## Important context

- This is a Shopify embedded admin app.
- It is not a storefront extension.
- It is not a checkout extension.
- MVP is a diagnostic scanner, not a full feed manager.
- Core flow: install app -> fetch products/variants -> run scanner rules -> show issues -> export report later.
- Scanner logic should be deterministic.
- AI is only used later for explanations and rewrite suggestions.
- We are using TypeScript, React Router Shopify template, Shopify Admin GraphQL API, Prisma, and Shopify Billing later.

## Current phase

Phase 3 product import is working.

Phase 4 scanner work now has three deterministic scanner rules connected:

1. Missing barcode / GTIN.
2. Missing vendor / brand.
3. Missing product image.

The dashboard imports real Shopify product variants, groups them into product snapshots, runs the scanner rules, calculates a readiness score across the active catalog, and displays real issue counts.

## Current implementation

Primary route:

- `app/routes/app._index.tsx`

App wrapper route:

- `app/routes/app.tsx`

Product import helper:

- `app/lib/shopify/product-import.server.ts`

Scanner files:

- `app/lib/scanner/types.ts`
- `app/lib/scanner/run-scan.server.ts`
- `app/lib/scanner/rules/missing-barcode.server.ts`
- `app/lib/scanner/rules/missing-vendor.server.ts`
- `app/lib/scanner/rules/missing-image.server.ts`

Current dashboard includes:

- Page heading: MerchantFix
- Primary action: Run scan
- Google Shopping readiness scanner intro
- Current phase card
- Readiness score based on active product checks for missing barcode / GTIN, missing vendor / brand, and missing product image
- Scan status card
- Imported catalog debug cards
- Real issue summary cards for missing barcode / GTIN, missing vendor / brand, and missing product image
- Active scanner checks list
- Imported product variant debug table with issue column
- MVP scope sidebar
- Next build steps sidebar

## Current scanner behavior

- Imports up to 100 variants for the debug scan.
- Groups variants into product snapshots.
- Runs the missing barcode / GTIN rule.
- Runs the missing vendor / brand rule.
- Runs the missing product image rule.
- Counts issues only for active products.
- Imports draft and archived products for visibility, but skips them from issue counts.
- Calculates a readiness score based on active product/variant checks currently implemented.
- Marks active variants missing barcode / GTIN as critical issues.
- Marks active products missing vendor / brand as warning issues.
- Marks active products missing featured image as critical issues.

## Last confirmed working scan

Confirmed in the Shopify development store on 2026-05-24 at approximately 16:53 local time:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- More variants after debug limit: No
- Missing barcode / GTIN issues: 24
- Missing vendor / brand issues: 0
- Missing product image issues: 1
- Total issues: 25
- Critical issues: 25
- Affected products: 15
- Affected variants: 24
- Readiness score: 54 / 100

This is considered successful because the current dev store's active variants are missing barcode / GTIN values, active products have vendor / brand values, and exactly one active product (`The Minimal Snowboard`) is missing a product image. Draft and archived products appeared in the debug table but were not counted as scanner issues.

## Current known issues

- Short title rule is not implemented yet.
- Short description rule is not implemented yet.
- Duplicate title rule is not implemented yet.
- Missing product category rule is not implemented yet.
- Suggested deterministic fixes are not implemented yet.
- Readiness score weighting is still simple and should become more nuanced as more rules are added.
- Shopify Billing is not implemented yet.
- CSV export is not implemented yet.
- AI suggestions are not implemented yet.
- Google Merchant Center API integration is intentionally not being built yet.

## Development notes

- If Shopify Admin shows `Example Domain` or a dead Cloudflare tunnel, open the app using the Preview URL printed by `shopify app dev` / `npm run dev`, or press `p` in the running Shopify CLI terminal.
- The app needs `read_products` scope for product import.
- The current debug import reads up to 100 variants.
- `npm warn Unknown project config "shamefully-hoist"` has appeared and has not blocked development.

## Next task

Run typecheck, review the diff, commit and push the missing image scanner checkpoint.

Then start the next product/report step:

1. Add issue detail UI with deterministic suggested fixes.
2. Improve readiness score weighting across multiple rules.
3. Then continue with the next scanner rule, likely short title or short description.

Do not start billing, AI features, storefront widgets, checkout extensions, or Google Merchant Center API integration yet.
