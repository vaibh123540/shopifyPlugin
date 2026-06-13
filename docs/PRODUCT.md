# Product

We are building a Shopify embedded app called MerchantFix.

MerchantFix scans a Shopify store and detects product/catalog/store issues that may cause Google Shopping or Google Merchant Center readiness problems.

The first version is not a full feed manager. It is a diagnostic scanner and fix checklist.

## Core promise

Find why your Shopify products might not be ready for Google Shopping.

## Target users

Shopify merchants running Google Shopping, Performance Max, or free product listings.

## MVP features

- Shopify OAuth install
- Import products and variants
- Scan catalog for common readiness issues
- Show store readiness score
- Show issue list by severity
- Show affected products
- Show deterministic fix checklist
- Export CSV later
- Paid unlock through Shopify Billing later

## Current product status

MerchantFix now has a working embedded dashboard inside Shopify Admin.

The dashboard can:

- Run a real catalog scan from the embedded app UI.
- Import product and variant data from Shopify Admin GraphQL API.
- Group imported variants into product snapshots.
- Run deterministic scanner rules.
- Show a readiness score.
- Show scan status and last scanned timestamp.
- Show imported product count.
- Show imported variant count.
- Show active variants scanned.
- Show issue summary counts.
- Show active scanner checks.
- Show a deterministic fix checklist with affected examples.
- Show a product variant debug table with issue status.
- Show product description length in the debug table.
- Show product category status in the debug table.

## Current scanner rules

Implemented:

- Missing barcode / GTIN
- Missing vendor / brand
- Missing product image
- Missing product category
- Short product title
- Short product description
- Duplicate product title

Not implemented yet:

- No remaining deterministic scanner rule from the current Phase 4 roadmap set.

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

The current result is expected:

- Active variants are missing barcode / GTIN values.
- All active products currently have vendor / brand values.
- `The Minimal Snowboard` is missing a product image.
- 14 active products are missing a Shopify product category.
- `Gift Card` has the category `Gift Cards`, so it passes the product category rule.
- `Gift Card` is shorter than the current short-title threshold.
- 15 active products have descriptions shorter than the current short-description threshold.
- No active products currently have duplicate normalized titles.

## First scanner promise

The first scanner promise is to identify active products and variants with catalog data problems that may affect Google Shopping readiness.

The scanner currently ignores draft and archived products for issue counting, but those products still appear in the imported debug table for visibility.

## Current report promise

The dashboard now includes a rule-based fix checklist.

The checklist tells the merchant:

- What issue exists.
- How many affected products or variants exist.
- Whether the issue is critical or warning-level.
- What deterministic fix to apply.
- First affected examples.

## Next product milestone

Improve Phase 5 report UI:

- Empty states
- Loading states
- Error states
- Better issue grouping/filtering
- Product-level issue drilldown
- Readiness score weighting refinement

After report UI is stronger, move toward CSV/report preview and monetization.

## Not building yet

- Full feed manager
- Google Merchant Center API integration
- Automatic appeals
- Bulk product editing
- Agency dashboard
- Theme extension
- Checkout extension
- AI rewrite suggestions
