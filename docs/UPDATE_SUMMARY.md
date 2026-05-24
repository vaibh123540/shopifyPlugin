# Update Summary

## Updated on

2026-05-24

## What changed

MerchantFix has moved from product import + first scanner rule into a broader deterministic scanner checkpoint.

The dashboard now imports real Shopify product/variant data, runs four scanner rules, displays issue counts, calculates a readiness score, and shows a deterministic fix checklist.

## Confirmed progress

- Shopify dev store works.
- Shopify Admin dev preview works.
- Embedded app loads inside Shopify Admin.
- Starter Shopify app template screen was replaced with a MerchantFix dashboard shell.
- Run Scan imports real Shopify product variants through Shopify Admin GraphQL API.
- Imported variants are grouped into product snapshots.
- Missing barcode / GTIN scanner rule is implemented.
- Missing vendor / brand scanner rule is implemented.
- Missing product image scanner rule is implemented.
- Short product title scanner rule is implemented.
- Dashboard displays imported products, imported variants, active variants scanned, and debug table data.
- Dashboard displays real issue counts.
- Dashboard displays a readiness score.
- Dashboard displays active scanner checks.
- Dashboard displays a fix checklist with deterministic suggested fixes.
- Draft and archived products are imported for visibility but skipped from issue counts.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-05-24 17:17:39 local time:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- More variants after debug limit: No
- Missing barcode / GTIN issues: 24
- Missing vendor / brand issues: 0
- Missing product image issues: 1
- Short product title issues: 1
- Total issues: 26
- Critical issues: 25
- Warning issues: 1
- Affected products: 15
- Affected variants: 24
- Readiness score: 62 / 100

## Most recent checkpoint

The short product title rule is working.

Confirmed behavior:

- `Gift Card` is flagged as a warning-level short product title issue.
- The fix checklist shows a short product title group.
- The debug table shows `Short product title` on all Gift Card variants because the product-level issue is associated with that product.
- Total issue count increased from 25 to 26.
- Critical issue count stayed at 25.
- Warning issue count is now 1.
- Readiness score is now 62 / 100.

## Next checkpoint

Before pushing:

1. Run `npm run typecheck`.
2. Review `git diff`.
3. Commit the short title scanner checkpoint.
4. Push to GitHub.

After pushing, continue with the next deterministic scanner rule: short description.
