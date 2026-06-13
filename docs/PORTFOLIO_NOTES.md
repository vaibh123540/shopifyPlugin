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

Discord and Roblox remain later portfolio ideas. Do not start them until the Shopify scanner MVP has more complete scanner coverage and report UI.

## Shopify current checkpoint

Updated on 2026-06-13.

MerchantFix has progressed beyond the dashboard shell and initial product import. It now has:

- Embedded Shopify Admin dashboard.
- Real product and variant import through Shopify Admin GraphQL API.
- Product snapshots grouped from imported variants.
- Six deterministic scanner rules:
  - Missing barcode / GTIN
  - Missing vendor / brand
  - Missing product image
  - Short product title
  - Short product description
  - Duplicate product title
- Basic readiness score.
- Issue summary cards.
- Active scanner checks list.
- Fix checklist with deterministic suggested fixes and affected examples.
- Imported variant debug table.
- Description length shown in the debug table.

Last confirmed Shopify dev-store scan:

| Metric | Value |
| --- | ---: |
| Imported products | 17 |
| Imported variants | 26 |
| Active variants scanned | 24 |
| Missing barcode / GTIN issues | 24 |
| Missing vendor / brand issues | 0 |
| Missing product image issues | 1 |
| Short product title issues | 1 |
| Short product description issues | 15 |
| Duplicate product title issues | 0 |
| Total issues | 41 |
| Critical issues | 25 |
| Warning issues | 16 |
| Affected products | 15 |
| Affected variants | 24 |
| Readiness score | 59 / 100 |

This confirms the Shopify flagship has moved from concept into a working scanner MVP path with multiple deterministic rules and a merchant-facing fix checklist.

## Next Shopify build step

Add the next deterministic scanner rule:

> Missing Google product category rule.

After that, improve readiness score weighting, report filtering, and product-level issue detail UI.

Do not start Discord or Roblox until the Shopify MVP scanner and report UI are stronger.
