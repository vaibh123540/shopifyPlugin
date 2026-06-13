# Current Status

## Last updated

2026-06-13

## Current focus

Phase 4's first deterministic scanner set is complete. Phase 5 report UI is now in progress.

The latest UI checkpoint shifts the dashboard from a developer-style debug report toward a store-owner/CEO-friendly scanner report. The report is now more glanceable, color-coded, and action-oriented.

## What works

- Shopify Partner/dev setup is working.
- MerchantFix development store is visible in Shopify admin.
- Shopify CLI dev preview is working through Cloudflare tunnel.
- Embedded app opens inside Shopify Admin through the dev preview URL.
- MerchantFix dashboard shell renders inside Shopify Admin.
- Run Scan calls the authenticated Shopify Admin GraphQL API.
- Product variants are imported from Shopify.
- Product category data is imported from Shopify when present.
- Imported variants are grouped into product snapshots.
- Missing barcode / GTIN scanner rule is implemented.
- Missing vendor / brand scanner rule is implemented.
- Missing product image scanner rule is implemented.
- Missing product category scanner rule is implemented.
- Short product title scanner rule is implemented.
- Short product description scanner rule is implemented.
- Duplicate product title scanner rule is implemented.
- Issue summary shows real counts for implemented scanner rules.
- A readiness score is calculated from implemented scanner checks.
- Draft and archived products are imported for visibility but skipped from issue counting.
- The dashboard shows a color-coded store health state after scan.
- The dashboard uses red/yellow/green/blue/gray states to make scan status easier to understand quickly.
- The dashboard shows a store-owner friendly top summary.
- The dashboard shows a numbered Fix order / action plan.
- Fix order cards include Action, Why, and Done when guidance.
- The dashboard includes skeleton loading while a scan is running.
- The catalog details table includes filters: Needs fixes, Critical, Warnings, Clear, Active, and All.
- The catalog details table shows product description length and product category status.
- The catalog details table color-codes issue state.
- The deterministic fix checklist is still available with affected examples.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-06-13 11:10:55 local time:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- More variants after debug limit: No
- Missing barcode / GTIN issues: 24
- Missing vendor / brand issues: 0
- Missing product image issues: 1
- Missing product category issues: 14
- Short product title issues: 1
- Short product description issues: 15
- Duplicate product title issues: 0
- Total issues: 55
- Critical issues: 25
- Warning issues: 30
- Affected products: 15
- Affected variants: 24
- Readiness score: 52 / 100

The current result is expected because:

- Active variants are missing barcode / GTIN values.
- All active products have vendor / brand values.
- `The Minimal Snowboard` is missing a product image.
- 14 active products are missing a Shopify product category.
- `Gift Card` has category `Gift Cards`, so it passes the product category rule.
- `Gift Card` is shorter than the current short-title threshold.
- 15 active products have descriptions shorter than the current short-description threshold.
- No active product titles currently collide after duplicate-title normalization.

## Most recent UI checkpoint

The CEO-friendly report UI and action-plan pass is working visually.

Confirmed by user review:

- The color-coded dashboard direction looks good.
- The next UI phase added a numbered Fix order.
- The catalog details table now supports quick filters.
- Skeleton loading is included for scan runs.

## What is not implemented yet

- Empty states are not polished yet.
- Error states are not polished yet.
- Product-level issue drilldown is not implemented yet.
- Readiness score weighting is still early and should be refined now that the first scanner set is complete.
- CSV export is not implemented yet.
- Shopify Billing is not implemented yet.
- AI rewrite suggestions are not implemented yet.
- Google Merchant Center API integration is not implemented and is intentionally out of MVP scope.

## Known development notes

- If Shopify Admin shows `Example Domain` or a dead `trycloudflare.com` page, the dev preview is likely stale or pointing to the wrong URL.
- The reliable way to open the current embedded app preview is to run `npm run dev` or `shopify app dev`, then press `p` in the Shopify CLI terminal or use the printed Preview URL.
- The direct sidebar app link may not always load the newest dev preview URL during local development.
- `npm warn Unknown project config "shamefully-hoist"` appeared during development but did not block the app from running.
- The app needs `read_products` scope to import Shopify product and variant data.
- The current debug scan reads up to 100 variants per run.

## Next 3 tasks

1. Run `npm run typecheck` after applying the action-plan UI and docs updates.
2. Commit and push the action-plan UI checkpoint.
3. Continue Phase 5 report UI polish with empty/error states or product-level issue drilldown.

## Suggested commit message

```bash
git add .
git commit -m "Improve scanner action plan UI"
git push
```

## Notes for next session

Do not start billing, AI features, storefront widgets, checkout extensions, CSV export, or Google Merchant Center API integration yet.

The next build step should continue improving the scanner/report experience for busy store owners.
