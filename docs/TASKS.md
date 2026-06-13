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
- [x] Implement duplicate product title scanner rule
- [x] Confirm duplicate product title finds 0 warning issues in the dev store
- [x] Confirm readiness score is 59 / 100 after duplicate title rule

## Now

- [ ] Run `npm run typecheck`
- [ ] Fix any TypeScript or route errors from typecheck
- [ ] Review `git diff`
- [ ] Commit duplicate title scanner checkpoint
- [ ] Push changes to GitHub

## Next

- [ ] Add missing Google product category rule
- [ ] Improve readiness score weighting across multiple rules
- [ ] Improve issue detail UI and filtering
- [ ] Add empty states
- [ ] Add loading states
- [ ] Add error states

## Later

- [ ] Product-level issue drilldown
- [ ] CSV export
- [ ] Shopify Billing
- [ ] AI rewrite suggestions
- [ ] Google Merchant Center API integration
