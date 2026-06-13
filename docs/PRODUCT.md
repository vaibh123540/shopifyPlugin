# Product

We are building a Shopify embedded app called MerchantFix.

MerchantFix scans a Shopify store and detects product/catalog/store issues that may cause Google Shopping or Google Merchant Center readiness problems.

The first version is not a full feed manager. It is a diagnostic scanner and fix checklist.

## Core promise

Find why your Shopify products might not be ready for Google Shopping.

## Target users

Shopify merchants running Google Shopping, Performance Max, or free product listings.

The UI should be designed for busy store owners and CEOs: quick to understand, color-coded, action-oriented, and light on developer/debug noise.

## MVP features

- Shopify OAuth install
- Import products and variants
- Scan catalog for common readiness issues
- Show store readiness score
- Show color-coded store health state
- Show issue list by severity
- Show affected products
- Show deterministic fix checklist / action plan
- Show filtered catalog details
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
- Show a color-coded store health state after scan.
- Show scan status and last scanned timestamp.
- Show imported product count.
- Show imported variant count.
- Show active variants scanned.
- Show issue summary counts.
- Show active scanner checks.
- Show a deterministic fix checklist with affected examples.
- Show a numbered Fix order / action plan with Action, Why, and Done when guidance.
- Show skeleton loading while a scan is running.
- Show a filtered catalog details table with Needs fixes, Critical, Warnings, Clear, Active, and All filters.
- Show product description length and product category status in the catalog details table.

## Current scanner rules

Implemented:

- Missing barcode / GTIN
- Missing vendor / brand
- Missing product image
- Missing product category
- Short product title
- Short product description
- Duplicate product title

The first deterministic scanner rule set is complete.

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

The scanner currently ignores draft and archived products for issue counting, but those products still appear in the catalog details table for visibility.

## Current report promise

The dashboard should help a store owner quickly answer:

1. Is my store in a critical, warning, or healthy state?
2. What should I fix first?
3. Why does it matter?
4. When is that fix considered done?
5. Which products or variants need action?

The report currently includes:

- Color-coded store health.
- Readiness score.
- Critical/warning/affected product counts.
- Numbered Fix order cards.
- Rule-based fix checklist.
- Filtered catalog details.
- Skeleton loading while the scan is running.

## Next product milestone

Continue Phase 5 report UI:

- Empty states
- Error states
- Product-level issue drilldown
- Readiness score weighting refinement
- CSV/report preview later

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
