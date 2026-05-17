# Architecture

## Stack

- Shopify embedded app
- React Router Shopify app template
- TypeScript
- Shopify Admin GraphQL API
- Shopify App Bridge
- Prisma
- SQLite for local development
- Postgres later for production
- Shopify Billing later
- Optional AI layer for explanations and rewrite suggestions

## Main flow

1. Merchant installs app through Shopify OAuth.
2. App stores shop/session data.
3. Merchant clicks Run Scan.
4. Backend fetches products and variants through Shopify Admin GraphQL API.
5. Scanner runs deterministic rules.
6. Issues are saved or returned.
7. Dashboard displays score, issue categories, affected products, and suggested fixes.
8. Paid users can export CSV and unlock full report.

## Core areas

- app/lib/shopify: Shopify API access
- app/lib/scanner: deterministic scanner rules
- app/lib/reports: CSV and report generation
- app/lib/billing: Shopify Billing logic
- app/components: UI components