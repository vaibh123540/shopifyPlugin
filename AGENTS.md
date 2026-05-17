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
- Update docs when architecture or product decisions change.

## Before coding

Read:

- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/ROADMAP.md
- docs/STATUS.md
- docs/DECISIONS.md
- docs/AI_HANDOFF.md

## After coding

Update:

- docs/STATUS.md
- docs/ROADMAP.md
- docs/DECISIONS.md if a major decision was made