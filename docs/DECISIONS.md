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