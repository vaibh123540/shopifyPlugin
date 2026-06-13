# Roadmap

## Phase 1: Repo and app skeleton

- [x] Create Shopify app
- [x] Add project memory docs
- [x] Connect Shopify dev environment
- [x] Confirm Shopify dev store appears in admin
- [x] Confirm embedded app UI loads from Shopify admin through dev preview
- [x] Commit initial repo setup / working dashboard checkpoint

## Phase 2: MerchantFix dashboard shell

- [x] Replace starter Shopify app screen with MerchantFix dashboard
- [x] Add scan status card
- [x] Add readiness score placeholder
- [x] Add issue summary placeholder
- [x] Add product issue table placeholder
- [x] Add MVP scope sidebar
- [x] Add next build steps sidebar
- [x] Keep Run Scan as placeholder action only

## Phase 3: Product import

- [x] Fetch products from Shopify Admin GraphQL API
- [x] Fetch variants from Shopify Admin GraphQL API
- [x] Handle debug import limit up to 100 variants
- [x] Create product snapshot type
- [x] Render imported product count on dashboard
- [x] Render imported variant count on dashboard
- [x] Render product data in dashboard table for debugging
- [x] Add `read_products` scope for catalog import

## Phase 4: Scanner

- [x] Missing barcode / GTIN rule
- [x] Missing vendor / brand rule
- [x] Missing image rule
- [x] Short title rule
- [x] Short description rule
- [x] Duplicate title rule
- [ ] Missing product category rule
- [x] Basic readiness score calculation for scanner rules
- [x] Issue severity categories
- [x] Product-level and variant-level scanner issues
- [x] Skip draft and archived products from issue counts

## Phase 5: Report UI

- [x] Real issue summary cards for missing barcode / GTIN
- [x] Real issue summary cards for missing vendor / brand
- [x] Real issue summary cards for missing product image
- [x] Real issue summary cards for short product title
- [x] Real issue summary cards for short product description
- [x] Real issue summary cards for duplicate product title
- [x] Product issue table flags affected variants
- [x] Scan status shows imported variants and issue count
- [x] Debug table shows product, vendor, status, variant, description length, SKU, barcode, issue, price, and image
- [x] Suggested deterministic fixes shown in dedicated fix checklist UI
- [x] Fix checklist shows affected examples
- [ ] Empty states
- [ ] Loading states
- [ ] Error states
- [ ] Better issue grouping/filtering
- [ ] Product-level issue drilldown
- [ ] CSV/report preview

## Phase 6: Monetization

- [ ] Free scan limit
- [ ] Shopify Billing setup
- [ ] CSV export behind paid plan

## Later / not MVP

- [ ] AI rewrite suggestions
- [ ] Google Merchant Center API integration
- [ ] Automatic appeals
- [ ] Bulk product editing
- [ ] Agency dashboard
- [ ] Theme extension
- [ ] Checkout extension
- [ ] Background scans
- [ ] Persistent scan history
