# Update Summary

## Updated on

2026-06-13

## What changed

MerchantFix has moved from the short description checkpoint into the duplicate product title scanner checkpoint.

The dashboard now imports real Shopify product/variant data, runs six scanner rules, displays issue counts, calculates a readiness score, and shows a deterministic fix checklist.

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
- Short product description scanner rule is implemented.
- Duplicate product title scanner rule is implemented.
- Dashboard displays imported products, imported variants, active variants scanned, and debug table data.
- Dashboard displays description length for imported product rows.
- Dashboard displays real issue counts.
- Dashboard displays a readiness score.
- Dashboard displays active scanner checks.
- Dashboard displays a fix checklist with deterministic suggested fixes.
- Draft and archived products are imported for visibility but skipped from issue counts.

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

## Most recent checkpoint

The duplicate product title rule is working.

Confirmed behavior:

- Duplicate product title appears in the current phase copy.
- Duplicate product title appears in the issue summary.
- Duplicate product title appears in active scanner checks.
- The current dev store has 0 duplicate product title issues.
- Total issue count stayed at 41 because no duplicate titles were found.
- Readiness score increased from 51 / 100 after short description to 59 / 100 after duplicate title because the new check passed across active products.
- The fix checklist does not show a duplicate title group when there are no duplicate title issues, which is expected.

## Next checkpoint

Before pushing:

1. Run `npm run typecheck`.
2. Review `git diff`.
3. Commit the duplicate product title scanner checkpoint.
4. Push to GitHub.

After pushing, continue with the next deterministic scanner rule: missing Google product category.
