# Update Summary

## Updated on

2026-05-24

## What changed

MerchantFix has moved from a two-rule deterministic scanner checkpoint into a three-rule scanner checkpoint.

The dashboard now imports real Shopify product/variant data and flags:

1. Active variants missing barcode / GTIN data.
2. Active products missing vendor / brand data.
3. Active products missing product image data.

The latest scan found one missing product image issue: `The Minimal Snowboard`.

## Confirmed progress

- Shopify dev store works.
- Shopify Admin dev preview works.
- Embedded app loads inside Shopify Admin.
- Starter Shopify app template screen was replaced with a MerchantFix dashboard shell.
- Run Scan imports real Shopify product variants through Shopify Admin GraphQL API.
- Imported variants are grouped into product snapshots.
- The dashboard displays imported products, imported variants, active variants scanned, and debug table data.
- The missing barcode / GTIN scanner rule is implemented.
- The missing vendor / brand scanner rule is implemented.
- The missing product image scanner rule is implemented.
- The dashboard displays real issue counts for all three implemented rules.
- The dashboard displays a readiness score based on implemented active catalog checks.
- Draft and archived products are imported for visibility but skipped from issue counts.
- The debug table can show multiple issues on the same product/variant row.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-05-24:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- Missing barcode / GTIN issues: 24
- Missing vendor / brand issues: 0
- Missing product image issues: 1
- Total issues: 25
- Critical issues: 25
- Affected products: 15
- Affected variants: 24
- Readiness score: 54 / 100
- More variants after debug limit: No

## Interpretation

The missing product image rule is working as expected:

- The issue summary shows `1` missing product image issue.
- The debug table shows `The Minimal Snowboard` as active with `Image: Missing`.
- The same product already has a missing barcode / GTIN issue, so the total issue count increased from 24 to 25 while affected products stayed at 15.
- The missing vendor / brand issue count remains `0` because active products in the current dev store all have vendor values.

## Next checkpoint

Before pushing:

1. Run `npm run typecheck`.
2. Review `git status`.
3. Review `git diff`.
4. Commit the missing image scanner checkpoint.
5. Push to GitHub.

After pushing, continue with issue detail UI and deterministic suggested fixes.
