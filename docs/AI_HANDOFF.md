# AI Handoff

You are helping build MerchantFix, a Shopify embedded app that scans a merchant's product catalog for Google Shopping / Merchant Center readiness issues.

## Important context

- This is a Shopify embedded admin app.
- It is not a storefront extension.
- It is not a checkout extension.
- MVP is a diagnostic scanner, not a full feed manager.
- Core flow: install app -> fetch products -> run scanner rules -> show issues -> export report.
- Scanner logic should be deterministic.
- AI is only used later for explanations and rewrite suggestions.
- We are using TypeScript, React Router Shopify template, Shopify Admin GraphQL API, Prisma, and Shopify Billing later.

## Current phase

Phase 2 dashboard shell is working.

The embedded app now opens inside Shopify Admin through the Shopify CLI dev preview URL and shows a MerchantFix dashboard instead of the starter Shopify template page.

## Current dashboard implementation

Primary route:

- `app/routes/app._index.tsx`

App wrapper route:

- `app/routes/app.tsx`

Current dashboard includes:

- Page heading: MerchantFix
- Primary action: Run scan
- Google Shopping readiness scanner intro
- Current phase card
- Readiness score placeholder
- Scan status placeholder
- Issue summary placeholder
- Product issues table placeholder
- MVP scope sidebar
- Next build steps sidebar

The Run Scan button is intentionally only a placeholder action for now. It confirms the action wiring but does not fetch products or run scanner rules yet.

## Recent fix

An attempted `s-app-nav` block caused an error because the tag was not available in this setup. The nav was removed for now. Since the MVP currently has one page, `app/routes/app.tsx` should simply render:

```tsx
<AppProvider embedded apiKey={apiKey}>
  <Outlet />
</AppProvider>
```

## Current known issues

- Actual scanner is not implemented yet.
- Product import is not implemented yet.
- Product snapshot type is not implemented yet.
- Real product issue table is not implemented yet.
- Shopify Billing is not implemented yet.
- AI suggestions are not implemented yet.
- Google Merchant Center API integration is intentionally not being built yet.

## Development note

If Shopify Admin shows `Example Domain` or a dead Cloudflare tunnel, open the app using the Preview URL printed by `shopify app dev` / `npm run dev`, or press `p` in the running Shopify CLI terminal.

## Next task

Commit the working dashboard shell, run typecheck, then start Phase 3:

1. Fetch products from Shopify Admin GraphQL API.
2. Fetch variants.
3. Handle pagination.
4. Create a product snapshot type.
5. Implement the missing barcode / GTIN scanner rule.
