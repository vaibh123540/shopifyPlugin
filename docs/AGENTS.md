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
- Keep the app focused on the current MVP flow: import products/variants -> run scanner rules -> show issues.

## Current working checkpoint

The embedded dashboard can import product variants from Shopify Admin GraphQL API and run two deterministic scanner rules:

1. Missing barcode / GTIN.
2. Missing vendor / brand.

Current key files:

- `app/routes/app._index.tsx`
- `app/routes/app.tsx`
- `app/lib/shopify/product-import.server.ts`
- `app/lib/scanner/types.ts`
- `app/lib/scanner/run-scan.server.ts`
- `app/lib/scanner/rules/missing-barcode.server.ts`
- `app/lib/scanner/rules/missing-vendor.server.ts`

## Before coding

Read:

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/STATUS.md`
- `docs/DECISIONS.md`
- `docs/AI_HANDOFF.md`
- `TASKS.md`

## Current next task

Commit and push the missing vendor / brand scanner checkpoint.

Then add the missing image scanner rule.

Do not start:

- Shopify Billing
- AI suggestions
- Google Merchant Center API
- CSV export
- Storefront widgets
- Checkout extensions

until the deterministic scanner rules and report UI are more complete.

## After coding

Update:

- `docs/STATUS.md`
- `docs/ROADMAP.md`
- `TASKS.md`
- `docs/AI_HANDOFF.md`
- `docs/DECISIONS.md` if a major decision was made
- `docs/UPDATE_SUMMARY.md` after meaningful checkpoints
