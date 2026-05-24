# Update Summary

## Updated on

2026-05-24

## What changed

MerchantFix has moved from product import + first scanner rule into a two-rule deterministic scanner checkpoint.

The dashboard now imports real Shopify product/variant data and flags:

1. Active variants missing barcode / GTIN data.
2. Active products missing vendor / brand data.

The latest scan found no missing vendor / brand issues because the active products in the current dev store all have vendor values.

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
- The dashboard displays real issue counts for both implemented rules.
- The dashboard displays a readiness score based on implemented active catalog checks.
- Draft and archived products are imported for visibility but skipped from issue counts.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-05-24:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- Missing barcode / GTIN issues: 24
- Missing vendor / brand issues: 0
- Critical issues: 24
- Affected products: 15
- Affected variants: 24
- Readiness score: 38 / 100
- More variants after debug limit: No

## Interpretation

The missing vendor / brand rule is working as expected:

- The issue summary shows `0` missing vendor / brand issues.
- The debug table shows active products with vendor values such as `MerchantFIx`, `Snowboard Vendor`, `Hydrogen Vendor`, and `Multi-managed Vendor`.
- The readiness score improved from the previous barcode-only score because vendor / brand checks are passing.

## Next checkpoint

Before pushing:

1. Run `npm run typecheck`.
2. Review `git status`.
3. Review `git diff`.
4. Commit the missing vendor / brand scanner checkpoint.
5. Push to GitHub.

After pushing, continue with the next deterministic scanner rule: missing image.
