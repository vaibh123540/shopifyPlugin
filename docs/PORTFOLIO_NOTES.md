Good. That trio is balanced:

1. **Shopify** = merchants with direct revenue pain
2. **Discord** = creators/community owners with subscription/access pain
3. **Roblox** = creator-tool market with upside and lower corporate friction

I’d run it as a **3-product portfolio**, but with **one main build and two lightweight experiments**.

# The portfolio

| Priority | Niche   | Product                             | Customer          | Pain                                              | Monetization                 |
| -------: | ------- | ----------------------------------- | ----------------- | ------------------------------------------------- | ---------------------------- |
|        1 | Shopify | **Google Merchant Center Fixer**    | Shopify merchants | Products disapproved / not showing on Google      | $29–$99/mo                   |
|        2 | Discord | **Paid Role Drift Auditor**         | Paid communities  | Members lose access or keep roles after canceling | $19–$99/mo                   |
|        3 | Roblox  | **Economy / Quest Balancer Plugin** | Roblox devs       | Hard to balance progression, rewards, quests      | $19–$49 one-time + templates |

My recommendation: **Shopify is the flagship**, Discord is the second SaaS, Roblox is the fun creator-tool bet.

---

# 1. Shopify: Google Merchant Center Fixer

### Product

A Shopify app that scans a store and tells the merchant:

> “Here’s why your products may be disapproved or not showing on Google, and here’s what to fix.”

Google says product data that fails requirements can lead to product or account disapproval, and Shopify’s own help docs mention issues like missing refund policy, insufficient contact information, and misrepresentation problems. ([Google Help][1])

### Exact wedge

Do **not** build a full feed manager at first.

Build:

> **A diagnostic scanner for Google Shopping approval problems.**

There are already apps in this space, like ShieldKit and Get Compliant, which confirms demand but also means you need sharper positioning. ShieldKit focuses on Merchant Center compliance and suspension issues; Get Compliant focuses on scanning product titles/descriptions for Shopping policy risks. ([Shopify App Store][2])

Your wedge should be:

> **“Product-level feed issue scanner for Shopify stores with messy catalogs.”**

### MVP features

* Scan products
* Flag missing GTIN/barcode
* Flag missing brand/vendor
* Flag weak or risky titles
* Flag missing Google product category
* Flag missing shipping/refund/contact trust pages
* Generate a fix checklist
* Export CSV
* AI-generate appeal/review request text
* Weekly monitoring later

### Pricing

Start simple:

* Free: scan 25 products
* $29/month: scan full store
* $79/month: weekly monitoring + CSV export
* $149/month: larger catalog + priority support

Shopify supports app subscription billing through its app billing system, including recurring subscriptions. ([Shopify][3])

### Why this is first

This has the clearest pain-to-money connection.

If Google Shopping is broken, the merchant has a revenue problem. That makes this the best chance of getting paid.

---

# 2. Discord: Paid Role Drift Auditor

### Product

A Discord bot/dashboard that checks whether paid community members have the correct roles.

Positioning:

> “Make sure paying members have access, canceled members lose access, and support tickets stop piling up.”

Discord bots can interact with servers through the Discord API, and role management is possible when the bot has the correct permissions and role hierarchy position. ([Discord Developer Documentation][4])

### Exact wedge

Do **not** build “another paid Discord bot.”

Build:

> **A role audit and repair tool for paid communities.**

Existing products already sync Patreon, Stripe, or other payment platforms to Discord roles. Patreon has its own Discord role integration, and Stripe/Discord tools like PayBot or WardianLabs already exist. ([support.patreon.com][5])

So your wedge should not be “paywall Discord.”

Your wedge should be:

> **“Find and fix role mismatches across Patreon, Stripe, Whop, Ko-fi, Gumroad, and Discord.”**

This is better because many creators already have a payment setup. They need cleanup, visibility, and fewer angry member messages.

### MVP features

Start with **Stripe + Discord** only.

* Connect Discord server
* Connect Stripe
* Map Stripe products/prices to Discord roles
* Daily audit
* Show mismatches:

  * paid but missing role
  * canceled but still has role
  * failed payment but still has access
  * wrong tier role
* “Fix all” button
* Member support lookup
* Basic audit log

Later add:

* Patreon
* Whop
* Ko-fi
* Lemon Squeezy
* Gumroad
* failed payment DMs
* self-service member portal

### Pricing

* Free: audit up to 50 members
* $19/month: 250 members
* $49/month: 1,000 members
* $99/month: multi-platform sync

### Why this is second

This is a real operational pain, especially for creators with paid communities.

But it has more integration risk than Shopify. Discord permissions, payment webhooks, user matching, and support edge cases can get annoying.

Still, it is a strong second product.

---

# 3. Roblox: Economy / Quest Balancer Plugin

### Product

A Roblox Studio plugin that helps devs create balanced progression systems.

Positioning:

> “Generate balanced upgrade costs, quest rewards, rebirth curves, shop prices, and Luau config tables for your simulator or tycoon.”

Roblox officially supports Studio plugins, and the Creator Store allows creators to distribute/sell plugins and models. ([Creator Hub][6]) Roblox’s monetization docs also reference selling plugins/models through the Creator Store, with a 30-day escrow hold for purchases. ([Creator Hub][7])

### Exact wedge

Do **not** build a generic “AI Roblox game maker.”

Build:

> **A balancing tool for Roblox simulators, tycoons, incremental games, and quest systems.**

The pain is specific: small Roblox devs can build mechanics, but progression math is hard.

### MVP features

First version can even be a web app before becoming a Studio plugin.

Inputs:

* Game type: simulator, tycoon, obby, pet game, RPG
* Number of zones/worlds
* Target session length
* Upgrade count
* Currency names
* Rebirth system yes/no
* Expected reward frequency

Outputs:

* Upgrade cost curve
* Reward curve
* Rebirth multipliers
* Daily reward table
* Quest chain
* Shop prices
* Luau ModuleScript export
* CSV export

Later:

* Roblox Studio plugin UI
* quest editor
* NPC dialogue generator
* economy “too grindy / too easy” checker
* template packs

### Pricing

* $29 one-time plugin
* $49 pro version
* $9/month for AI generations, templates, cloud saves

### Why this is third

This has the least obvious revenue, but it has the best “fun/upside” factor.

Also, it keeps you near Roblox without forcing you to make a game immediately.

---

# How I’d structure the whole thing

Do **not** build 3 unrelated full products.

Use one shared stack:

* Next.js app
* Supabase or Postgres
* Stripe billing
* OpenAI/Claude API layer
* Shared dashboard template
* Shared report generator
* Shared email system
* Shared landing page structure
* Shared analytics

Then each product is basically a different connector:

| Product | Connector                | Core output                      |
| ------- | ------------------------ | -------------------------------- |
| Shopify | Shopify Admin API        | Product/feed issue report        |
| Discord | Discord + Stripe APIs    | Role mismatch report             |
| Roblox  | Roblox plugin/web export | Luau config + progression tables |

The common product pattern is:

> **Connect account → scan/analyze → show issues → generate fixes → charge for export/automation.**

That is perfect for vibe coding.

---

# Build order

## Month 1: Shopify MVP

Goal: get one app to “usable beta.”

Build:

* Shopify OAuth
* product import
* scanner rules
* report dashboard
* CSV export
* free scan limit
* paid unlock

Do not overbuild the AI. Most of the value can come from deterministic checks.

---

## Month 2: Discord MVP

Build:

* Discord bot install
* Stripe connect or Stripe API key setup
* role mapping
* mismatch scanner
* fix role button
* daily audit email

This one is more technically annoying, but the MVP is clear.

---

## Month 3: Roblox MVP

Start as a web tool, not a plugin.

Build:

* economy generator form
* output tables
* Luau ModuleScript export
* 5 templates:

  * simulator
  * tycoon
  * pet collector
  * quest RPG
  * daily rewards

Then convert to a Studio plugin after validation.

---

# Validation plan

For each idea, make a landing page with a specific promise.

### Shopify landing page

> “Fix Shopify Google Shopping disapprovals before they kill your ads.”

CTA:

> “Scan my store.”

### Discord landing page

> “Find paid members with broken Discord roles in 60 seconds.”

CTA:

> “Audit my server.”

### Roblox landing page

> “Generate balanced simulator prices, rewards, and quests for Roblox Studio.”

CTA:

> “Generate my economy table.”

Then post/search in places where pain already appears:

| Product | Where to validate                                                                  |
| ------- | ---------------------------------------------------------------------------------- |
| Shopify | Shopify Community, Reddit ecommerce subs, Google Ads communities, Shopify agencies |
| Discord | creator communities, paid Discord owners, Whop/Stripe/Patreon users                |
| Roblox  | Roblox DevForum, Roblox Discords, YouTube dev comments, Creator Store research     |

---

# My recommended focus split

For the next 90 days:

| Product | Time |
| ------- | ---: |
| Shopify |  50% |
| Discord |  30% |
| Roblox  |  20% |

Not equal.

Shopify is most likely to pay. Discord has good recurring revenue potential. Roblox is your exploratory upside bet.

---

# The anti-sprawl rule

Each product gets only **one core promise**.

Shopify:

> “Tell me why my products are not approved on Google.”

Discord:

> “Tell me which paid members have the wrong roles.”

Roblox:

> “Generate balanced progression tables for my game.”

No extra features until someone uses the core promise.

---

# Final decision

I agree with your picks.

Your 3-product portfolio should be:

1. **Shopify Merchant Center Fixer**
   Main revenue bet.

2. **Discord Paid Role Drift Auditor**
   Community monetization/tooling bet.

3. **Roblox Economy / Quest Balancer**
   Creator-tool and Roblox ecosystem bet.

This is a smart spread. Shopify is the serious money play, Discord is the recurring operations play, and Roblox is the asymmetric creator-market play.

[1]: https://support.google.com/merchants/answer/13693497?hl=en&utm_source=chatgpt.com "Fixing Merchant Center disapprovals for product data ..."
[2]: https://apps.shopify.com/shieldkit?utm_source=chatgpt.com "ShieldKit: Google Merchant Fix"
[3]: https://shopify.dev/docs/apps/launch/billing?utm_source=chatgpt.com "About billing for your app"
[4]: https://docs.discord.com/developers/bots/overview?utm_source=chatgpt.com "Discord Bots & Companion Apps - Documentation"
[5]: https://support.patreon.com/hc/en-us/articles/213552323-Setting-up-Discord-for-your-members?utm_source=chatgpt.com "Setting up Discord for your members"
[6]: https://create.roblox.com/docs/studio/plugins?utm_source=chatgpt.com "Studio plugins | Documentation - Roblox Creator Hub"
[7]: https://create.roblox.com/docs/production/monetization?utm_source=chatgpt.com "Monetization | Documentation"
---

# Current Shopify implementation checkpoint

Updated on 2026-05-21.

MerchantFix remains the flagship product in the portfolio.

The Shopify app has progressed beyond the dashboard shell:

- Embedded Shopify Admin dashboard is working.
- Product and variant import is working through Shopify Admin GraphQL API.
- Product variants are grouped into product snapshots.
- The first deterministic scanner rule is working: missing barcode / GTIN.
- The dashboard now shows a real readiness score and real issue counts.

Last confirmed Shopify dev-store scan:

| Metric | Value |
| --- | ---: |
| Imported products | 17 |
| Imported variants | 26 |
| Active variants scanned | 24 |
| Missing barcode / GTIN issues | 24 |
| Critical issues | 24 |
| Affected products | 15 |
| Affected variants | 24 |
| Readiness score | 0 / 100 |

This confirms the flagship Shopify idea has moved from concept into a working technical MVP path.

Next Shopify build step:

> Add missing vendor / brand as the second deterministic scanner rule.

Discord and Roblox remain later portfolio ideas. Do not start them until the Shopify scanner MVP has more complete scanner coverage and report UI.
