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

Reason: The button confirmed the dashboard action was wired without mixing dashboard work with product import or scanner logic.

## Navigation decision

Decision: Do not add app navigation yet.

Reason: The current MVP has only one page. An attempted `s-app-nav` block caused an unsupported tag error in this setup, so navigation should wait until there are multiple working routes.

## Development preview decision

Decision: Use the Shopify CLI dev preview URL or press `p` in the running CLI to open the embedded app during local development.

Reason: The Shopify Admin sidebar app link can sometimes point to a stale or incorrect tunnel during development, causing `Example Domain` or Cloudflare tunnel errors.

## Product import decision

Decision: Use Shopify Admin GraphQL `productVariants` as the first import path instead of querying products first.

Reason: The first scanner rule was variant-level missing barcode / GTIN, so importing variants first gives the scanner the exact data it needs while still returning associated product data.

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

Decision: Start with a simple readiness score based on active variant and active product checks.

Reason: A simple score is enough during scanner validation. Score weighting should become more nuanced after the first scanner set is complete.

## Missing vendor / brand scanner decision

Decision: Implement missing vendor / brand as the second deterministic scanner rule.

Reason: Vendor / brand data is product-level catalog data and is useful for Google Shopping readiness. It also validates that the scanner supports product-level issues, not only variant-level issues.

## Product-level issue model decision

Decision: Support product-level issues separately from variant-level issues.

Reason: Missing vendor, missing image, short title, short description, duplicate title, and missing product category are product-level checks. They should not be forced into fake variant issues.

## Missing image scanner decision

Decision: Implement missing product image as the third deterministic scanner rule.

Reason: Product images are important for merchant product listings and easy to validate from the imported featured image field.

## Fix checklist UI decision

Decision: Add a deterministic fix checklist before adding more advanced AI or billing features.

Reason: The product needs to explain what merchants should fix, not only count scanner issues. Rule-based fixes are reliable and keep the MVP useful without AI.

## Short product title scanner decision

Decision: Implement short product title as the fourth deterministic scanner rule.

Reason: Title quality is an important product data quality signal and can be checked deterministically before adding AI rewrite suggestions.

## Short title threshold decision

Decision: Flag active product titles shorter than 20 characters as warning-level short title issues.

Reason: Short titles are not always disqualifying, but they are often less useful for Google Shopping because they may lack product type, brand, model, size, color, or other distinguishing details. The initial threshold is intentionally simple and can be refined later.

## Short product description scanner decision

Decision: Implement short product description as the fifth deterministic scanner rule.

Reason: Descriptions help merchants provide purchase-relevant product detail. A deterministic minimum-length check catches empty or very thin product descriptions before adding AI rewrite suggestions.

## Short description threshold decision

Decision: Flag active product descriptions shorter than 100 characters as warning-level short description issues.

Reason: The threshold is intentionally simple for the MVP. It catches empty or thin descriptions while avoiding claims that a short description guarantees Google disapproval.

## Duplicate product title scanner decision

Decision: Implement duplicate product title as the sixth deterministic scanner rule.

Reason: Duplicate product titles can make catalog review and merchant fixes harder, and they can reduce product listing clarity. This is a deterministic product-level check that fits the current scanner roadmap.

## Duplicate title normalization decision

Decision: Normalize titles by trimming, lowercasing, and collapsing repeated whitespace before checking duplicates.

Reason: This catches obvious duplicate titles even if casing or spacing differs, while keeping the first version simple and explainable.


## Missing product category scanner decision

Decision: Implement missing product category as the seventh deterministic scanner rule.

Reason: Product category is important catalog metadata for product classification and listing readiness. The Shopify Admin GraphQL product category field gives a deterministic first-pass check without connecting to Google Merchant Center.

## Product category import decision

Decision: Import Shopify product category ID, name, and full category name/path from the product data returned with product variants.

Reason: The scanner only needs to know whether a product has a category for the first MVP rule, while the dashboard benefits from displaying a human-readable category value when present.

## Product category severity decision

Decision: Treat missing product category as a warning-level product issue.

Reason: Missing category is important catalog quality data, but it should not be treated as the same severity as missing GTINs or missing product images in the first scanner weighting.

## Phase 4 scanner set completion decision

Decision: After missing product category, consider the first deterministic scanner rule set complete and shift focus to Phase 5 report UI polish.

Reason: The scanner now covers the core first-pass MVP checks from the roadmap. The next highest-leverage work is making the report easier to understand, filter, and act on before adding monetization or AI.

## CEO-friendly report UI decision

Decision: Shift Phase 5 report UI toward a store-owner/CEO-friendly scan report instead of a developer/debug-first dashboard.

Reason: Merchants need to understand store health, critical blockers, and the next best action quickly. Raw scanner/debug detail is useful, but it should be lower priority than the health summary and fix order.

## Color-coded health state decision

Decision: Use color-coded health states after scan: red for critical fixes, yellow for cleanup/warnings, green for clear/healthy, blue for informational context, and gray for not scanned yet.

Reason: Store owners should be able to understand the state of the store subconsciously before reading every line of copy.

## Skeleton loading decision

Decision: Use skeleton loading states while a scan is running.

Reason: Skeletons make the embedded dashboard feel more stable and polished than blank loading text, especially when merchants are waiting for a scan result.

## Fix order action plan decision

Decision: Add a numbered Fix order / action plan above the detailed checklist.

Reason: The detailed checklist explains scanner output, but the merchant also needs a simple prioritized sequence of what to fix first.

## Action / Why / Done when copy decision

Decision: For priority issue groups, show Action, Why, and Done when guidance.

Reason: This gives merchants enough information to act without adding fluffy explanations or requiring them to interpret scanner terminology.

## Catalog details filtering decision

Decision: Add simple catalog details filters: Needs fixes, Critical, Warnings, Clear, Active, and All.

Reason: The imported product/variant table can become noisy. Filters let merchants focus on the rows that matter while preserving full visibility for debugging and validation.
