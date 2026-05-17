# Roadmap

## Phase 1: Repo and app skeleton

- [x] Create Shopify app
- [x] Add project memory docs
- [x] Connect Shopify dev environment
- [x] Confirm Shopify dev store appears in admin
- [x] Confirm embedded app UI loads from Shopify admin through dev preview
- [ ] Commit initial repo setup / working dashboard checkpoint

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

- [ ] Fetch products from Shopify Admin GraphQL API
- [ ] Fetch variants from Shopify Admin GraphQL API
- [ ] Handle pagination
- [ ] Create product snapshot type
- [ ] Render imported product count on dashboard
- [ ] Render product data in dashboard table for debugging

## Phase 4: Scanner

- [ ] Missing barcode / GTIN rule
- [ ] Missing vendor / brand rule
- [ ] Missing image rule
- [ ] Short title rule
- [ ] Short description rule
- [ ] Duplicate title rule
- [ ] Missing product category rule
- [ ] Basic readiness score calculation
- [ ] Issue severity categories

## Phase 5: Report UI

- [ ] Real issue summary cards
- [ ] Product issue table with affected products
- [ ] Suggested deterministic fixes
- [ ] Empty states
- [ ] Loading states
- [ ] Error states

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
