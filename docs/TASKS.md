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
- [x] Implement missing barcode / GTIN scanner rule
- [x] Skip draft and archived products from issue counting
- [x] Display real issue summary counts for missing barcode / GTIN
- [x] Calculate first basic readiness score
- [x] Confirm Run Scan imports 17 products and 26 variants in the dev store
- [x] Confirm Run Scan finds 24 missing barcode / GTIN issues in the dev store
- [x] Implement missing vendor / brand scanner rule
- [x] Support product-level scanner issues
- [x] Display real issue summary count for missing vendor / brand
- [x] Confirm Run Scan finds 0 missing vendor / brand issues in the dev store
- [x] Confirm readiness score is 38 / 100 with barcode and vendor checks active
- [x] Implement missing product image scanner rule
- [x] Display real issue summary count for missing product image
- [x] Confirm Run Scan finds 1 missing product image issue in the dev store
- [x] Confirm total issues increased to 25 after adding image check
- [x] Confirm readiness score is 54 / 100 with barcode, vendor, and image checks active

## Now

- [ ] Run `npm run typecheck`
- [ ] Fix any TypeScript or route errors from typecheck
- [ ] Review `git status`
- [ ] Review `git diff`
- [ ] Commit Phase 4C missing image scanner checkpoint
- [ ] Push changes to GitHub

## Next

- [ ] Add issue detail UI with suggested deterministic fixes
- [ ] Improve readiness score weighting across multiple rules
- [ ] Add short title scanner rule
- [ ] Add short description scanner rule

## Later

- [ ] Duplicate title scanner rule
- [ ] Missing Google product category rule
- [ ] Empty states
- [ ] Loading states
- [ ] Error states
- [ ] CSV export
- [ ] Shopify Billing
- [ ] AI rewrite suggestions
