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
- Export CSV
- Paid unlock through Shopify Billing

## Current product status

MerchantFix now has a working embedded dashboard inside Shopify Admin.

The dashboard can:

- Run a real catalog scan from the embedded app UI.
- Import product and variant data from Shopify Admin GraphQL API.
- Group imported variants into product snapshots.
- Run the first deterministic scanner rule: missing barcode / GTIN.
- Show a first readiness score.
- Show scan status and last scanned timestamp.
- Show imported product count.
- Show imported variant count.
- Show active variants scanned.
- Show issue summary counts.
- Show a product variant debug table with issue status.

## Last confirmed scan result

Confirmed in the Shopify development store on 2026-05-21:

- Imported products: 17
- Imported variants: 26
- Active variants scanned: 24
- Missing barcode / GTIN issues: 24
- Critical issues: 24
- Affected products: 15
- Affected variants: 24
- Readiness score: 0 / 100
- More variants after debug limit: No

The 0 / 100 score is expected for the current seed catalog because every active variant in the debug import is missing barcode / GTIN data.

## First scanner promise

The first real scanner rule identifies active product variants with missing barcode / GTIN data.

The rule currently ignores draft and archived products for issue counting, but those products still appear in the imported debug table for visibility.

## Next product milestone

Add the next deterministic scanner rule: missing vendor / brand.

After that, add missing product image and improve issue detail UI with deterministic fix suggestions.

## Not building yet

- Full feed manager
- Google Merchant Center API integration
- Automatic appeals
- Bulk product editing
- Agency dashboard
- Theme extension
- Checkout extension
- AI rewrite suggestions
