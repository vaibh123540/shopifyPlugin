# Tasks

## Done

- [x] Create Shopify app skeleton
- [x] Connect Shopify dev environment
- [x] Confirm Shopify dev store appears in Shopify admin
- [x] Open embedded app through Shopify Admin dev preview
- [x] Replace starter Shopify app screen with MerchantFix dashboard shell
- [x] Add Run Scan placeholder button
- [x] Add readiness score placeholder
- [x] Add scan status placeholder
- [x] Add issue summary placeholder
- [x] Add product issue table placeholder
- [x] Remove unsupported `s-app-nav` from `app/routes/app.tsx`
- [x] Confirm dashboard shell renders inside Shopify Admin
- [x] Fetch product variants from Shopify Admin GraphQL API
- [x] Group imported variants into product snapshots
- [x] Add product snapshot type
- [x] Display imported product and variant counts
- [x] Display active variants scanned
- [x] Display imported product variant debug table
- [x] Add issue column to debug table
- [x] Add description length column to debug table
- [x] Add category column to debug table
- [x] Implement missing barcode / GTIN scanner rule
- [x] Skip draft and archived products from issue counting
- [x] Display real issue summary counts for missing barcode / GTIN
- [x] Calculate first basic readiness score
- [x] Confirm Run Scan imports 17 products and 26 variants in the dev store
- [x] Confirm Run Scan finds 24 missing barcode / GTIN issues in the dev store
- [x] Implement missing vendor / brand scanner rule
- [x] Confirm missing vendor / brand returns 0 issues in the dev store
- [x] Implement missing product image scanner rule
- [x] Confirm missing product image finds 1 issue in the dev store
- [x] Add fix checklist UI with deterministic suggested fixes
- [x] Implement short product title scanner rule
- [x] Confirm short product title finds 1 warning issue in the dev store
- [x] Confirm readiness score is 62 / 100 after short title rule
- [x] Implement short product description scanner rule
- [x] Confirm short product description finds 15 warning issues in the dev store
- [x] Confirm readiness score is 51 / 100 after short description rule
- [x] Implement duplicate product title scanner rule
- [x] Confirm duplicate product title finds 0 issues in the dev store
- [x] Confirm readiness score is 59 / 100 after duplicate title rule
- [x] Implement missing product category scanner rule
- [x] Confirm missing product category finds 14 warning issues in the dev store
- [x] Confirm readiness score is 52 / 100 after product category rule
- [x] Add color-coded store health state
- [x] Add store-owner friendly top summary
- [x] Add skeleton loading state for scans
- [x] Add numbered Fix order / action plan cards
- [x] Add Action / Why / Done when guidance for priority fixes
- [x] Add catalog details filters: Needs fixes, Critical, Warnings, Clear, Active, All
- [x] Add color-coded issue states in catalog details

## Now

- [ ] Run `npm run typecheck`
- [ ] Fix any TypeScript or route errors from typecheck
- [ ] Review `git diff`
- [ ] Commit action-plan UI checkpoint
- [ ] Push changes to GitHub

## Next

- [ ] Add empty states
- [ ] Add error states
- [ ] Improve product-level issue drilldown
- [ ] Refine readiness score weighting across multiple rules
- [ ] Improve report copy and hierarchy after user testing

## Later

- [ ] CSV export
- [ ] Shopify Billing
- [ ] AI rewrite suggestions
- [ ] Google Merchant Center API integration
