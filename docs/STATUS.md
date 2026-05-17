# Current Status

## Last updated

2026-05-17

## Current focus

Phase 2 dashboard shell is now working inside the Shopify Admin embedded app preview. The next focus is to commit this working checkpoint, run type checking, and then begin Phase 3 product import from the Shopify Admin GraphQL API.

## What works

- Shopify Partner/dev setup is working.
- MerchantFix development store is visible in Shopify admin.
- Shopify Dev Console is visible.
- Shopify CLI dev preview is working through Cloudflare tunnel.
- Embedded app opens inside Shopify Admin through the dev preview URL.
- Starter Shopify template screen has been replaced with the MerchantFix dashboard shell.
- MerchantFix dashboard currently shows:
  - Page heading: MerchantFix
  - Primary action: Run scan
  - Google Shopping readiness scanner intro card
  - Current phase card
  - Readiness score placeholder
  - Scan status placeholder
  - Issue summary placeholder
  - Product issues table placeholder
  - MVP scope sidebar
  - Next build steps sidebar
- The unsupported `s-app-nav` usage was removed from `app/routes/app.tsx`.
- `app/routes/app.tsx` now wraps the app with `AppProvider` and renders the route through `Outlet`.
- The app route file currently used for the dashboard is `app/routes/app._index.tsx`.
- Repo has been initialized.
- Project memory docs and folder structure have been added.

## What is not implemented yet

- Actual MerchantFix scanner is not implemented yet.
- Product import is not implemented yet.
- Product snapshot type is not implemented yet.
- Missing barcode scanner rule is not implemented yet.
- Dashboard score is not calculated yet.
- Product issue table does not show real product data yet.
- CSV export is not implemented yet.
- Shopify Billing is not implemented yet.
- AI rewrite suggestions are not implemented yet.
- Google Merchant Center API integration is not implemented and is intentionally out of MVP scope.

## Known development notes

- If Shopify Admin shows `Example Domain` or a dead `trycloudflare.com` page, the dev preview is likely stale or pointing to the wrong URL.
- The reliable way to open the current embedded app preview is to run `npm run dev` or `shopify app dev`, then press `p` in the Shopify CLI terminal or use the printed Preview URL.
- The direct sidebar app link may not always load the newest dev preview URL during local development.
- `npm warn Unknown project config "shamefully-hoist"` appeared during development but did not block the app from running.

## Next 3 tasks

1. Commit the working dashboard shell checkpoint.
2. Run `npm run typecheck` and fix any TypeScript issues.
3. Start Phase 3 by fetching products and variants from the Shopify Admin GraphQL API.

## Last confirmed command

```bash
npm run dev
```

Shopify CLI confirmed:

- Dev store: `merchantfix.myshopify.com`
- App: `merchantfix`
- Access scope auto-granted: `write_products`
- App preview was ready and watching for changes.

## Notes for next session

Do not start billing, AI features, storefront widgets, checkout extensions, or Google Merchant Center API integration yet. The next build step is product import, then the first deterministic scanner rule for missing barcode / GTIN.
