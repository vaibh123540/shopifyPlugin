# Agent Instructions

## Project

MerchantFix is a Shopify embedded app that scans product catalogs for Google Shopping / Merchant Center readiness issues.

## Rules

- Do not expand scope without asking.
- Do not build storefront widgets.
- Do not build checkout extensions.
- Do not add Google Merchant Center API integration yet.
- Keep scanner rules deterministic.
- Prefer simple code over clever abstractions.
- Use TypeScript.
- Keep database migrations explicit.
- Update docs when architecture, product status, or major decisions change.
- Keep the app focused on the current MVP flow: import products/variants -> run scanner rules -> show issues -> show deterministic fix checklist.

## Current working checkpoint

The embedded dashboard can import product variants from Shopify Admin GraphQL API and run these deterministic scanner rules:

- Missing barcode / GTIN
- Missing vendor / brand
- Missing product image
- Missing product category
- Short product title
- Short product description
- Duplicate product title

The dashboard also shows a deterministic fix checklist with affected examples.

Current key files:

- `app/routes/app._index.tsx`
- `app/routes/app.tsx`
- `app/lib/shopify/product-import.server.ts`
- `app/lib/scanner/types.ts`
- `app/lib/scanner/run-scan.server.ts`
- `app/lib/scanner/rules/missing-barcode.server.ts`
- `app/lib/scanner/rules/missing-vendor.server.ts`
- `app/lib/scanner/rules/missing-image.server.ts`
- `app/lib/scanner/rules/missing-product-category.server.ts`
- `app/lib/scanner/rules/short-title.server.ts`
- `app/lib/scanner/rules/short-description.server.ts`
- `app/lib/scanner/rules/duplicate-title.server.ts`

## Before coding

Read:

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/STATUS.md`
- `docs/DECISIONS.md`
- `docs/AI_HANDOFF.md`
- `docs/TASKS.md`

## Current next task

After committing the missing product category scanner checkpoint, move from scanner coverage into Phase 5 report UI polish.

Recommended next task:

> Add better empty/loading/error states for the scan flow, then improve issue grouping/filtering and product-level issue drilldown.

Do not start:

- Shopify Billing
- AI suggestions
- Google Merchant Center API
- CSV export
- Storefront widgets
- Checkout extensions

until the deterministic scanner report UI is stronger.

## After coding

Update:

- `docs/STATUS.md`
- `docs/ROADMAP.md`
- `docs/TASKS.md`
- `docs/AI_HANDOFF.md`
- `docs/DECISIONS.md` if a major decision was made
- `docs/UPDATE_SUMMARY.md` after meaningful checkpoints
