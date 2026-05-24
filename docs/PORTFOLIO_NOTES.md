# Portfolio Notes

## Portfolio direction

The portfolio remains:

1. Shopify Merchant Center Fixer / MerchantFix.
2. Discord Paid Role Drift Auditor.
3. Roblox Economy / Quest Balancer.

MerchantFix is the flagship product and remains the current build focus.

## Priority

| Priority | Niche | Product | Customer | Pain | Monetization |
| ---: | --- | --- | --- | --- | --- |
| 1 | Shopify | MerchantFix / Google Merchant Center Fixer | Shopify merchants | Products disapproved or not showing on Google | $29-$99/mo |
| 2 | Discord | Paid Role Drift Auditor | Paid communities | Members lose access or keep roles after canceling | $19-$99/mo |
| 3 | Roblox | Economy / Quest Balancer Plugin | Roblox devs | Hard to balance progression, rewards, quests | $19-$49 one-time + templates |

## Shopify product wedge

MerchantFix should stay focused on this wedge:

> Product-level feed issue scanner for Shopify stores with messy catalogs.

The MVP should not become a full feed manager.

## Current Shopify implementation checkpoint

Updated on 2026-05-24.

MerchantFix remains the flagship product in the portfolio.

The Shopify app has progressed beyond the dashboard shell:

- Embedded Shopify Admin dashboard is working.
- Product and variant import is working through Shopify Admin GraphQL API.
- Product variants are grouped into product snapshots.
- The first deterministic scanner rule is working: missing barcode / GTIN.
- The second deterministic scanner rule is working: missing vendor / brand.
- The third deterministic scanner rule is working: missing product image.
- The dashboard now shows a readiness score and real issue counts across implemented scanner rules.

Last confirmed Shopify dev-store scan:

| Metric | Value |
| --- | ---: |
| Imported products | 17 |
| Imported variants | 26 |
| Active variants scanned | 24 |
| Missing barcode / GTIN issues | 24 |
| Missing vendor / brand issues | 0 |
| Missing product image issues | 1 |
| Total issues | 25 |
| Critical issues | 25 |
| Affected products | 15 |
| Affected variants | 24 |
| Readiness score | 54 / 100 |

This confirms the flagship Shopify idea has moved further into a working technical MVP path.

Next Shopify build step:

> Add issue detail UI with deterministic suggested fixes.

Discord and Roblox remain later portfolio ideas. Do not start them until the Shopify scanner MVP has more complete scanner coverage and report UI.
