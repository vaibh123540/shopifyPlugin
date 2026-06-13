# AI Handoff

You are helping build MerchantFix, a Shopify embedded app that scans a merchant's product catalog for Google Shopping / Merchant Center readiness issues.

## Important context

- This is a Shopify embedded admin app.
- It is not a storefront extension.
- It is not a checkout extension.
- MVP is a diagnostic scanner, not a full feed manager.
- Core flow: install app -> fetch products/variants -> run scanner rules -> show issues -> show deterministic fix checklist -> export report later.
- Scanner logic should be deterministic.
- AI is only used later for explanations and rewrite suggestions.
- We are using TypeScript, React Router Shopify template, Shopify Admin GraphQL API, Prisma, and Shopify Billing later.

## Current phase

Phase 4 scanner work is nearly complete for the first deterministic scanner set, and Phase 5 report UI has started.

The dashboard now imports real Shopify product variants, groups them into product snapshots, runs six deterministic scanner rules, calculates a readiness score, and displays a rule-based fix checklist with affected examples.

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
- `app/lib/scanner/rules/short-title.server.ts`
- `app/lib/scanner/rules/short-description.server.ts`
- `app/lib/scanner/rules/duplicate-title.server.ts`

Current dashboard includes:

- Page heading: MerchantFix
- Primary action: Run scan
- Google Shopping readiness scanner intro
- Current phase card
- Readiness score using active variant and active product checks
- Scan status card
- Imported catalog debug cards
- Issue summary cards
- Active scanner checks list
- Fix checklist with deterministic suggested fixes
- Imported product variant debug table with issue column
- Imported product variant debug table with description length column
- MVP scope sidebar
- Next build steps sidebar

## Current scanner behavior

- Imports up to 100 variants for the debug scan.
- Groups variants into product snapshots.
- Counts issues only for active products.
- Imports draft and archived products for visibility, but skips them from issue counts.
- Runs missing barcode / GTIN rule at variant level.
- Runs missing vendor / brand rule at product level.
- Runs missing product image rule at product level.
- Runs short product title rule at product level.
- Runs short product description rule at product level.
- Runs duplicate product title rule at product level.
- Short product title threshold is currently under 20 characters.
- Short product description threshold is currently under 100 characters.
- Duplicate product title normalization trims, lowercases, and collapses repeated whitespace.
- Missing barcode and missing image are critical issues.
- Missing vendor / brand is a warning issue.
- Short product title is a warning issue.
- Short product description is a warning issue.
- Duplicate product title is a warning issue.
- Calculates a readiness score using the implemented scanner checks.
- Shows deterministic suggested fixes in a fix checklist.

## Last confirmed working scan

Confirmed in the Shopify development store on 2026-06-13 11:00:54 local time:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- More variants after debug limit: No
- Missing barcode / GTIN issues: 24
- Missing vendor / brand issues: 0
- Missing product image issues: 1
- Short product title issues: 1
- Short product description issues: 15
- Duplicate product title issues: 0
- Total issues: 41
- Critical issues: 25
- Warning issues: 16
- Affected products: 15
- Affected variants: 24
- Readiness score: 59 / 100

The current issue breakdown is expected because the dev store active variants are missing barcode / GTIN values, one active product is missing a featured image, `Gift Card` is shorter than the short-title threshold, 15 active products have short descriptions, and no active product titles are duplicates.

## Current known issues

- Missing Google product category rule is not implemented yet.
- Suggested fixes exist in the checklist, but detailed filtering/drilldown is still basic.
- Readiness score weighting is still early and should be refined after more rules are implemented.
- Empty states are not polished yet.
- Loading states are not polished yet.
- Error states are not polished yet.
- Shopify Billing is not implemented yet.
- CSV export is not implemented yet.
- AI suggestions are not implemented yet.
- Google Merchant Center API integration is intentionally not being built yet.

## Development notes

- If Shopify Admin shows `Example Domain` or a dead Cloudflare tunnel, open the app using the Preview URL printed by `shopify app dev` / `npm run dev`, or press `p` in the running Shopify CLI terminal.
- The app needs `read_products` scope for product import.
- The current debug import reads up to 100 variants.
- `npm warn Unknown project config "shamefully-hoist"` has appeared before and has not blocked development.

## Next task

Commit and push the duplicate product title scanner checkpoint after running typecheck.

Then start the next deterministic scanner rule:

1. Missing Google product category rule.
2. Improve readiness score weighting.
3. Improve report UI filtering and product-level issue drilldown.

Do not start billing, AI features, storefront widgets, checkout extensions, CSV export, or Google Merchant Center API integration yet.
