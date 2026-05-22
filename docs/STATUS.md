# Current Status

## Last updated

2026-05-21

## Current focus

Phase 3 product import is working, and Phase 4 has started with the first deterministic scanner rule: missing barcode / GTIN.

The latest confirmed state is successful. The embedded Shopify dashboard imports real products and variants, runs the first scanner rule, and displays real issue counts.

## What works

- Shopify Partner/dev setup is working.
- MerchantFix development store is visible in Shopify admin.
- Shopify CLI dev preview is working through Cloudflare tunnel.
- Embedded app opens inside Shopify Admin through the dev preview URL.
- MerchantFix dashboard shell renders inside Shopify Admin.
- Run Scan calls the authenticated Shopify Admin GraphQL API.
- Product variants are imported from Shopify.
- Imported variants are grouped into product snapshots.
- Dashboard displays imported product count.
- Dashboard displays imported variant count.
- Dashboard displays active variant scan count.
- Dashboard displays whether more variants exist after the debug import limit.
- Dashboard displays a product variant debug table.
- Missing barcode / GTIN scanner rule is implemented.
- Issue summary shows real counts for missing barcode / GTIN, critical issues, affected products, and affected variants.
- A basic readiness score is calculated from the missing barcode / GTIN rule.
- Draft and archived products are imported for debug visibility but skipped from issue counting.
- The debug table shows draft and archived products with no issue when skipped.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-05-21 at approximately 19:49 local time:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- More variants after debug limit: No
- Missing barcode / GTIN issues: 24
- Critical issues: 24
- Affected products: 15
- Affected variants: 24
- Readiness score: 0 / 100

The 0 / 100 score is expected for the current dev store data because every active variant imported in the debug scan is missing barcode / GTIN data.

## What is not implemented yet

- Missing vendor / brand rule is not implemented yet.
- Missing image rule is not implemented yet.
- Short title rule is not implemented yet.
- Short description rule is not implemented yet.
- Duplicate title rule is not implemented yet.
- Missing Google product category rule is not implemented yet.
- Suggested deterministic fixes are not implemented yet.
- Readiness score weighting is still simple and only based on missing barcode / GTIN.
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

1. Run `npm run typecheck` before committing.
2. Commit and push the current product import + missing barcode scanner checkpoint.
3. Add the next deterministic scanner rule: missing vendor / brand.

## Suggested commit message

```bash
git add .
git commit -m "Add product import and missing barcode scanner"
git push
```

## Notes for next session

Do not start billing, AI features, storefront widgets, checkout extensions, or Google Merchant Center API integration yet.

The next build step is expanding deterministic scanner rules. Start with missing vendor / brand, then missing image.
