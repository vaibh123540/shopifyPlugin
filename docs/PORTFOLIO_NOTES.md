# Portfolio Notes

MerchantFix is the flagship product in the current 3-product portfolio.

## Portfolio

| Priority | Niche | Product | Customer | Pain | Monetization |
| ---: | --- | --- | --- | --- | --- |
| 1 | Shopify | Google Merchant Center Fixer / MerchantFix | Shopify merchants | Products disapproved or not showing on Google | $29-$99/mo |
| 2 | Discord | Paid Role Drift Auditor | Paid communities | Members lose access or keep roles after canceling | $19-$99/mo |
| 3 | Roblox | Economy / Quest Balancer Plugin | Roblox devs | Hard to balance progression, rewards, quests | One-time + templates |

## Current priority

Shopify remains the main build.

Discord and Roblox remain later portfolio ideas. Do not start them until the Shopify scanner MVP has stronger report UI and validation.

## Shopify current checkpoint

Updated on 2026-06-13.

MerchantFix has progressed beyond the dashboard shell and initial product import. It now has:

- Embedded Shopify Admin dashboard.
- Real product and variant import through Shopify Admin GraphQL API.
- Product category import when present.
- Product snapshots grouped from imported variants.
- Seven deterministic scanner rules:
  - Missing barcode / GTIN
  - Missing vendor / brand
  - Missing product image
  - Missing product category
  - Short product title
  - Short product description
  - Duplicate product title
- Basic readiness score.
- Issue summary cards.
- Active scanner checks list.
- Fix checklist with deterministic suggested fixes and affected examples.
- Imported variant debug table.
- Description length and product category shown in the debug table.

Last confirmed Shopify dev-store scan:

| Metric | Value |
| --- | ---: |
| Imported products | 17 |
| Imported variants | 26 |
| Active variants scanned | 24 |
| Missing barcode / GTIN issues | 24 |
| Missing vendor / brand issues | 0 |
| Missing product image issues | 1 |
| Missing product category issues | 14 |
| Short product title issues | 1 |
| Short product description issues | 15 |
| Duplicate product title issues | 0 |
| Total issues | 55 |
| Critical issues | 25 |
| Warning issues | 30 |
| Affected products | 15 |
| Affected variants | 24 |
| Readiness score | 52 / 100 |

This confirms the Shopify flagship has moved from concept into a working scanner MVP path with multiple deterministic rules and a merchant-facing fix checklist.

## Next Shopify build step

Move into Phase 5 report UI polish:

- Empty states
- Loading states
- Error states
- Better issue grouping/filtering
- Product-level issue drilldown
- Readiness score weighting refinement

Do not start Discord or Roblox until the Shopify MVP scanner and report UI are stronger.
