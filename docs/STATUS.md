# Current Status

## Last updated

2026-06-13

## Current focus

Phase 4 scanner work is nearly complete for the first deterministic scanner set, and Phase 5 report UI has started.

The latest confirmed state is successful. The embedded Shopify dashboard imports real products and variants, runs six deterministic scanner rules, displays issue counts, calculates a readiness score, and shows a deterministic fix checklist.

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
- Dashboard displays product description length in the debug table.
- Missing barcode / GTIN scanner rule is implemented.
- Missing vendor / brand scanner rule is implemented.
- Missing product image scanner rule is implemented.
- Short product title scanner rule is implemented.
- Short product description scanner rule is implemented.
- Duplicate product title scanner rule is implemented.
- Issue summary shows real counts for implemented scanner rules.
- A readiness score is calculated from implemented scanner checks.
- Draft and archived products are imported for debug visibility but skipped from issue counting.
- The debug table shows draft and archived products with no issue when skipped.
- Fix checklist UI is implemented.
- Fix checklist groups issues by rule and shows deterministic suggested fixes.
- Fix checklist shows first affected examples for each issue group.

## Last confirmed scan result

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

The current result is expected because:

- Active variants are missing barcode / GTIN values.
- All active products have vendor / brand values.
- `The Minimal Snowboard` is missing a product image.
- `Gift Card` is shorter than the current short-title threshold.
- 15 active products have descriptions shorter than the current short-description threshold.
- No active product titles currently collide after duplicate-title normalization.

## What is not implemented yet

- Missing Google product category rule is not implemented yet.
- Empty states are not polished yet.
- Loading states are not polished yet.
- Error states are not polished yet.
- Better issue grouping/filtering is not implemented yet.
- Product-level issue drilldown is not implemented yet.
- Readiness score weighting is still early and should be refined after more rules are implemented.
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

1. Run `npm run typecheck` after applying the duplicate-title checkpoint and docs updates.
2. Commit and push the duplicate product title scanner checkpoint.
3. Add the next deterministic scanner rule: missing Google product category.

## Suggested commit message

```bash
git add .
git commit -m "Add duplicate title scanner rule"
git push
```

## Notes for next session

Do not start billing, AI features, storefront widgets, checkout extensions, CSV export, or Google Merchant Center API integration yet.

The next build step is the final scanner rule in the current roadmap set: missing Google product category.
