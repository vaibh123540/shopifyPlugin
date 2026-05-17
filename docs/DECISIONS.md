# Decisions

## Initial decision

Decision: Build MerchantFix as a Shopify embedded admin app.

Reason: The problem lives inside the merchant's product/catalog workflow, not the storefront.

## MVP scope

Decision: MVP will be a diagnostic scanner, not a full feed manager.

Reason: This keeps the product small, useful, and easier to validate.

## Scanner logic

Decision: Scanner rules should be deterministic first, AI second.

Reason: Product readiness checks need to be reliable and explainable.

## Dashboard shell decision

Decision: Replace the starter Shopify template screen with a MerchantFix dashboard shell before building product import or scanner rules.

Reason: This confirms the embedded app route, Shopify Admin preview, and UI structure work before adding backend logic.

## Run Scan placeholder decision

Decision: Keep the Run Scan button as a placeholder action during Phase 2.

Reason: The button confirms the dashboard action is wired without mixing dashboard work with product import or scanner logic.

## Navigation decision

Decision: Do not add app navigation yet.

Reason: The current MVP has only one page. An attempted `s-app-nav` block caused an unsupported tag error in this setup, so navigation should wait until there are multiple working routes.

## Development preview decision

Decision: Use the Shopify CLI dev preview URL or press `p` in the running CLI to open the embedded app during local development.

Reason: The Shopify Admin sidebar app link can sometimes point to a stale or incorrect tunnel during development, causing `Example Domain` or Cloudflare tunnel errors.
