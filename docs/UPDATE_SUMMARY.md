# Update Summary

## Updated on

2026-05-21

## What changed

MerchantFix has moved from a working dashboard shell into a working product import + first scanner rule checkpoint.

The dashboard now imports real Shopify product/variant data and flags active variants that are missing barcode / GTIN data.

## Confirmed progress

- Shopify dev store works.
- Shopify Admin dev preview works.
- Embedded app loads inside Shopify Admin.
- Starter Shopify app template screen was replaced with a MerchantFix dashboard shell.
- Run Scan is no longer only a placeholder.
- Run Scan imports real Shopify product variants through Shopify Admin GraphQL API.
- Imported variants are grouped into product snapshots.
- The dashboard displays imported products, imported variants, active variants scanned, and debug table data.
- The missing barcode / GTIN scanner rule is implemented.
- The dashboard displays real issue counts.
- The dashboard displays a first readiness score.
- Draft and archived products are imported for visibility but skipped from issue counts.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-05-21:

- Scan status: Scan complete
- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- Missing barcode / GTIN issues: 24
- Critical issues: 24
- Affected products: 15
- Affected variants: 24
- Readiness score: 0 / 100
- More variants after debug limit: No

## Next checkpoint

Before pushing:

1. Run `npm run typecheck`.
2. Review `git diff`.
3. Commit the product import + missing barcode scanner checkpoint.
4. Push to GitHub.

After pushing, continue with the next deterministic scanner rule: missing vendor / brand.
