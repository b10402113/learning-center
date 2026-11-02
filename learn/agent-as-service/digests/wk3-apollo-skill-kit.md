---
source: "sources/agent-as-service/20261101/4-Wk3 - Finding Your First Client/4-3️⃣ Cold Outreach/resources/apollo-skill-kit.md"
source_type: text
source_lines: 340
status: absorbed
absorbed_at: 2026-11-01
created: 2026-11-01
updated: 2026-11-01
---

# L1 overview

- RoboLabs knowledge file for AI agents covering Apollo.io: searching its 275M+ contact B2B database, enriching contacts with verified emails, exporting lead lists formatted for Instantly.ai, managing sequences via API, and conserving credits.
- Core economics: searching is free, enrichment costs credits (1 per email, 8 per phone number, no refunds, monthly expiry), so filter aggressively before enriching and use bulk endpoints.
- Includes compliance rules (CAN-SPAM, GDPR, Australia Spam Act), domain safety (never send from your primary domain; warm up 2–4 weeks), bounce-rate thresholds, agent prompt examples, pricing tables, and a full API reference with rate limits.

# L2 detail

- `#L1-L33` — Header and workflow: agent capabilities (search by title/industry/size/location, enrich with verified emails, build and export lists, advise on credits, manage sequences via API, format exports for Instantly); the 5-step workflow with the key insight that searching is free and only revealing emails costs credits.
- `#L34-L77` — Getting started: free signup without a credit card, full 275M+ database access, API key creation in Settings > Integrations > API with "Set as master key" toggle; free-plan limits table (100 credits/month, 10 exports/month, 5 mobile credits, 2 active sequences, 600 API calls/day ~50/min, ~250 emails/day via Gmail only); paid plans from $49/month; `APOLLO_API_KEY` env var and the optional `@thevgergroup/apollo-io-mcp` MCP server install.
- `#L78-L169` — Finding leads, steps 1–4: define the target (good: "Dental clinic owners in Sydney with 5-20 employees"; bad: "Businesses that might need AI"); company search filters (industry/keywords, employee count, location, revenue, 1,500+ tracked technologies) with the `mixed_companies/search` endpoint; people search filters (fuzzy job titles, seniority levels, email status, up to 1,000 domains) with the `mixed_people/api_search` endpoint — free but returns no emails; the employee-count format quirk (comma-separated `"5,20"`, not `"5-20"`); enrichment via `people/match` and `bulk_match` (10 per request) — 1 credit per email, 8 per phone; six credit-conservation rules (search first, verified-only filter, cache results, bulk enrich, no refunds on bad data, monthly expiry with no rollover).
- `#L170-L241` — Exporting and managing: CSV export (10/month free) via UI or API; the Apollo→Instantly field-mapping table (title and linkedin_url and city become `custom_variables`); other export targets (Smartlead, Lemlist, HubSpot/Salesforce, Google Sheets); contact creation with the critical `run_dedupe: true` setting because Apollo does not auto-dedupe; built-in sequences (2 active on free) via `emailer_campaigns` endpoints with three safety settings (`sequence_no_email: "do_not_add"`, `sequence_unverified_email: "do_not_add"`, `sequence_active_in_other_campaigns: "do_not_add"`).
- `#L242-L301` — Compliance, safety, and pricing: CAN-SPAM (physical address + unsubscribe, honor opt-outs within 10 business days), GDPR (Apollo auto-blocks personal emails in regulated regions, DPA provided), Australia Spam Act (consent or existing relationship); domain safety — never the primary domain, buy variations (TryYourBrand.com), SPF/DKIM/DMARC on every sending domain, 2–4 week warmup; data quality — verified/likely_to_engage only, >5% bounce triggers spam filters, >10% can blacklist your domain, ZeroBounce/NeverBounce for high volume; five ready-to-use agent prompts (build a lead list, research a company, enrich 30 domains, check credit usage, set up a 3-step sequence); pricing table (Free $0/1,200 credits/year, Basic $49, Professional $79, Organization $119) with overage $0.20/credit and the beginner recommendation to start free then move to Basic (~400 enriched contacts/month).
- `#L302-L340` — API reference for the agent: base URL `https://api.apollo.io/api/v1`, auth header `x-api-key`, docs link; endpoint table marking which actions cost credits vs are free (people search free, company search costs credits, enrich 1/8 per email/phone, contacts and sequence operations free); rate limits by plan (Free ~50/min and 600/day up to Organization 200/min and 2,000/day); search pagination cap of 50,000 records (100 per page × 500 pages); footer: compiled from Apollo API docs, MCP guides, and prospecting best practices (2025–2026).
