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

## Product import decision

Decision: Use Shopify Admin GraphQL `productVariants` as the first import path instead of querying products first.

Reason: The first scanner rule is variant-level missing barcode / GTIN, so importing variants first gives the scanner the exact data it needs while still returning associated product data.

## Product read scope decision

Decision: Add `read_products` to the Shopify app access scopes for the product import phase.

Reason: MerchantFix must read product and variant data from Shopify Admin GraphQL API before it can scan the catalog.

## Debug import limit decision

Decision: Limit the embedded dashboard debug scan to 100 variants for now.

Reason: This keeps Run Scan fast during development. Full pagination, persistence, and background scan behavior can be added after the scanner rules prove useful.

## Active product scan decision

Decision: Import draft and archived products for debug visibility, but count scanner issues only for active products.

Reason: Draft and archived products are useful to see in development, but they should not lower the merchant's Google Shopping readiness score in the first MVP scanner pass.

## First scanner rule decision

Decision: Implement missing barcode / GTIN as the first deterministic scanner rule.

Reason: Google Shopping readiness often depends on product identifiers. This rule is easy to validate from Shopify variant data and directly supports the product's core promise.

## Readiness score decision

Decision: Start with a simple readiness score based on implemented active catalog checks.

Reason: A simple score is enough while scanner rules are still being added. Score weighting should become more nuanced only after multiple scanner rules are implemented.

## Product-level issue decision

Decision: Allow scanner issues to be product-level or variant-level.

Reason: Missing barcode / GTIN is a variant-level issue, but missing vendor / brand is a product-level issue. The issue model should support both instead of forcing every rule into a variant shape.

## Second scanner rule decision

Decision: Implement missing vendor / brand as the second deterministic scanner rule.

Reason: Brand/vendor data is a common catalog readiness signal. The current product import already includes Shopify's product vendor field, making this a low-risk next rule after barcode / GTIN.

## Next scanner rule decision

Decision: Implement missing image as the next deterministic scanner rule.

Reason: The current dev store has at least one active product with a missing image, so the rule can be validated immediately from the existing dashboard debug data.
