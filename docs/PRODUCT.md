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

The MerchantFix dashboard shell is now visible inside Shopify Admin through the development preview.

The dashboard currently communicates the product direction and includes placeholders for:

- Readiness score
- Scan status
- Issue summary
- Product issues
- MVP scope
- Next build steps

The app does not scan real products yet. The next product milestone is importing products and variants from Shopify Admin GraphQL API.

## First scanner promise

The first real scanner rule should identify variants with missing barcode / GTIN data.

## Not building yet

- Full feed manager
- Google Merchant Center API integration
- Automatic appeals
- Bulk product editing
- Agency dashboard
- Theme extension
- Checkout extension
- AI rewrite suggestions
