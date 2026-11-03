# Apollo.io Skill Kit

> **By RoboLabs** — Give this file to your AI agent (Claude Code, etc.) so it has deep knowledge of Apollo.io for finding and enriching B2B leads. Your agent can then build targeted prospect lists, verify emails, and export contacts ready for outreach.

---

## What This Is

This is a knowledge file for AI agents. When your agent has this loaded, it can:

- Search Apollo's database of 275M+ contacts by job title, industry, company size, and location
- Enrich contacts with verified email addresses and company data
- Build and export targeted lead lists for your outreach campaigns
- Advise on credit usage so you don't waste money on bad data
- Manage your Apollo sequences and contacts via API
- Format exports for import into cold email tools like Instantly.ai

**How to use:** Add this file to your Claude Code project, or paste it into your agent's context. Then describe who you want to reach and let it build your list.

---

## The Apollo Workflow

```
1. DEFINE your target (industry, role, company size, location)
2. SEARCH for companies that match your criteria (free, no credits)
3. SEARCH for people at those companies (free, no credits)
4. ENRICH only the qualified prospects (costs 1 credit per email)
5. EXPORT your list as CSV or push to your cold email tool
```

The key insight: **searching is free.** You only spend credits when you reveal someone's email address. So filter aggressively before enriching.

---

# GETTING STARTED

## Creating Your Account

1. Go to apollo.io and click "Sign Up Free"
2. No credit card needed for the free plan
3. You get immediate access to the full 275M+ contact database
4. Go to Settings > Integrations > API to create your API key
5. Toggle **"Set as master key"** if you want full access (required for sequences)

## What You Get on the Free Plan

| Feature | Limit |
|---------|-------|
| Data credits | 100/month (1,200/year) |
| Export credits | 10/month |
| Mobile credits | 5/month |
| Active sequences | 2 |
| API calls | 600/day, ~50/minute |
| Email sending | ~250/day (fair use) |
| Email provider | Gmail only |

The free plan is enough to test everything. Once you're sending for real, paid plans start at $49/month with 5,000 credits/year and unlimited sequences.

## Connecting Your Agent

Set this environment variable so your agent can access the Apollo API:

```
APOLLO_API_KEY=your-api-key-here
```

Your agent can also install the Apollo MCP server for a more integrated experience:

```
npm install -g @thevgergroup/apollo-io-mcp
```

Either way works. The API key is the important part.

---

# FINDING LEADS

## Step 1: Define Your Target

Before searching, get specific about who you're looking for. The more specific you are, the better your results.

**Questions to answer:**
- What industry are they in? (marketing, real estate, dental, SaaS, etc.)
- What's their job title? (owner, CEO, marketing director, ops manager)
- How big is their company? (1-10 employees? 10-50? 50-200?)
- Where are they located? (city, state, country)
- What's your budget for credits?

**Good target:** "Dental clinic owners in Sydney with 5-20 employees"
**Bad target:** "Businesses that might need AI"

## Step 2: Search for Companies

Apollo lets you search by:

| Filter | What It Does | Example |
|--------|-------------|---------|
| Industry/Keywords | Match companies by what they do | "marketing agency", "dental clinic" |
| Employee count | Filter by company size | 5-20 employees |
| Location | Company HQ location | Sydney, Australia |
| Revenue range | Annual revenue bracket | $1M-$10M |
| Technologies used | What tools they use (1,500+ tracked) | "WordPress", "Shopify", "HubSpot" |

**API endpoint:** `POST https://api.apollo.io/api/v1/mixed_companies/search`

**What to ask your agent:**
- "Search Apollo for marketing agencies in Sydney with 5-20 employees"
- "Find SaaS companies in the US with 50-200 employees using HubSpot"
- "Look for dental clinics in Melbourne"

## Step 3: Search for People

Once you have companies, find the decision-makers inside them.

**People filters:**

| Filter | What It Does | Example |
|--------|-------------|---------|
| Job title | Match by title (fuzzy matching available) | "owner", "CEO", "marketing director" |
| Seniority | Level in the org | owner, founder, c_suite, vp, director, manager |
| Location | Where the person is based | "New York", "London" |
| Email status | Only get verified emails | verified, likely_to_engage |
| Company domains | Search within specific companies | Up to 1,000 domains per search |

**API endpoint:** `POST https://api.apollo.io/api/v1/mixed_people/api_search`

**Important:** People search is FREE. No credits consumed. But it returns names and titles without email addresses. You need to enrich to get the email.

**Employee count format quirk:** Apollo uses comma-separated ranges, not dashes. So "5 to 20 employees" is written as `"5,20"` not `"5-20"`. Your agent should know this.

**What to ask your agent:**
- "Search Apollo for owners and founders at those companies"
- "Find marketing directors at agencies with 5-20 employees in the US"
- "Get me the decision-makers at these 50 companies" (pass a list of domains)

## Step 4: Enrich (Get Email Addresses)

This is where you spend credits. Each business email costs 1 credit. Phone numbers cost 8 credits.

**What enrichment returns:**
- Verified business email address
- Email status (verified, unverified, likely_to_engage, unavailable)
- Employment history
- Location details
- Company information

**API endpoint:** `POST https://api.apollo.io/api/v1/people/match`

You can also do bulk enrichment - up to 10 people per request:
**API endpoint:** `POST https://api.apollo.io/api/v1/people/bulk_match`

**What to ask your agent:**
- "Enrich the top 50 prospects from that search - get their emails"
- "Only enrich people with verified email status"
- "How many credits will it cost to enrich this list?"

### Credit Conservation Tips

Your agent should follow these rules to avoid wasting credits:

1. **Always search first (free), enrich second (costs credits).** Never enrich without filtering.
2. **Only enrich verified contacts.** Filter by `contact_email_status=verified` in your search.
3. **Cache results.** If you enriched someone last month, don't enrich them again. Data doesn't change that fast.
4. **Use bulk enrichment.** 10 people per request is more efficient than one at a time.
5. **Credits are charged even for bad data.** Apollo doesn't refund credits if the email turns out to be wrong or outdated.
6. **Credits expire monthly.** No rollover. Use them or lose them.

---

# EXPORTING YOUR LIST

## To CSV

Apollo can export your contacts to a CSV file. On the free plan you get 10 exports/month.

**Via the UI:**
1. Go to your saved list in Apollo
2. Select the contacts you want
3. Click Export > Download CSV

**Via the API:** Your agent can pull contact data programmatically and format it as CSV.

## To Instantly.ai (Cold Email)

If you're using Instantly for cold email, here's how the fields map:

| Apollo Field | Instantly Field |
|-------------|----------------|
| email | email (recipient) |
| first_name | first_name |
| last_name | last_name |
| title | custom_variables.title |
| organization_name | company_name |
| linkedin_url | custom_variables.linkedin |
| city | custom_variables.city |

**What to ask your agent:**
- "Export my Apollo list and format it for Instantly"
- "Push these 100 leads to my Instantly campaign"
- "Create a CSV from my Apollo search results with columns for Instantly import"

## To Other Tools

Apollo exports work with any tool that accepts CSV:
- **Smartlead** - same CSV import, similar field mapping
- **Lemlist** - CSV import with custom variable support
- **HubSpot/Salesforce** - native CRM integrations on paid plans
- **Google Sheets** - for manual review before importing elsewhere

---

# MANAGING CONTACTS & SEQUENCES

## Creating Contacts in Apollo

When you save a prospect, always use deduplication:

**API endpoint:** `POST https://api.apollo.io/api/v1/contacts`

**Critical setting:** Always set `run_dedupe: true` when creating contacts. Apollo does NOT automatically deduplicate. Without this, you'll end up with the same person saved multiple times, which wastes credits and creates confusion.

## Adding to Sequences

Apollo has built-in email sequences (like a simpler version of Instantly). On the free plan you get 2 active sequences.

**API endpoint:** `POST https://api.apollo.io/api/v1/emailer_campaigns/{sequence_id}/add_contact_ids`

**Safety settings your agent should always use:**
- `sequence_no_email: "do_not_add"` - skip contacts with no email
- `sequence_unverified_email: "do_not_add"` - skip unverified emails
- `sequence_active_in_other_campaigns: "do_not_add"` - don't double-message people

**What to ask your agent:**
- "Add these 20 contacts to my Apollo sequence"
- "Create a new sequence called 'Dental Outreach Round 1'"
- "Remove contacts who bounced from my active sequence"

---

# COMPLIANCE & SAFETY

## Email Rules

- **CAN-SPAM (US):** Include your physical address and an unsubscribe link in every email. Honor opt-outs within 10 business days.
- **GDPR (EU/UK):** Apollo automatically blocks personal emails in GDPR-regulated regions. Document your legitimate interest basis for reaching out. Apollo provides a Data Processing Agreement (DPA).
- **Australia (Spam Act):** Commercial emails need consent or an existing business relationship. Include sender identity and opt-out.

## Domain Safety

- Never send cold emails from your primary business domain
- Buy separate domains for outreach (variations like TryYourBrand.com, GetYourBrand.com)
- Set up SPF, DKIM, and DMARC records on every sending domain
- Warm up new email accounts for 2-4 weeks before sending campaigns

## Data Quality

- Only send to contacts with **verified** or **likely_to_engage** email status
- Bounce rates above 5% trigger spam filters at Gmail and Outlook
- Bounce rates above 10% can get your domain blacklisted
- Consider running emails through a secondary verification service (ZeroBounce, NeverBounce) for high-volume campaigns

---

# WHAT TO ASK YOUR AGENT

Here are ready-to-use prompts for common tasks:

**Building a lead list:**
> "I want to find [job title] at [industry] companies with [size] employees in [location]. Search Apollo, filter for verified emails only, enrich the top [number], and give me a CSV I can import into Instantly."

**Researching a specific company:**
> "Look up [company name] on Apollo. Who are the decision-makers? What's the company size, industry, and tech stack?"

**Enriching a list you already have:**
> "Here's a list of 30 company domains. Find the owner or CEO at each one, enrich their contact info, and export as CSV."

**Checking your credit usage:**
> "How many Apollo credits have I used this month? How many do I have left?"

**Setting up a sequence:**
> "Create an Apollo sequence with 3 steps: intro email, follow-up in 4 days, break-up email in 10 days. Add these contacts to it."

---

# PRICING QUICK REFERENCE

| Plan | Monthly | Credits/Year | Exports/Month | Sequences |
|------|---------|-------------|---------------|-----------|
| Free | $0 | 1,200 | 10 | 2 |
| Basic | $49 | 5,000 | 1,000 | Unlimited |
| Professional | $79 | 10,000 | 2,000 | Unlimited |
| Organization | $119 | 15,000 | 4,000 | Unlimited |

**Credit costs:** 1 credit per business email, 8 credits per phone number. Overage: $0.20/credit (minimum purchase 250 credits).

**Recommendation for beginners:** Start on the free plan. When you're ready to send at scale, the Basic plan at $49/month gives you enough credits for about 400 enriched contacts per month.

---

# API REFERENCE (FOR YOUR AGENT)

Your agent needs these details to make API calls on your behalf.

**Base URL:** `https://api.apollo.io/api/v1`
**Auth header:** `x-api-key: YOUR_API_KEY`
**Docs:** https://docs.apollo.io/reference/

### Key Endpoints

| Action | Method | Endpoint | Credits |
|--------|--------|----------|---------|
| Search people | POST | /mixed_people/api_search | Free |
| Search companies | POST | /mixed_companies/search | Credits |
| Enrich person | POST | /people/match | 1/email, 8/phone |
| Bulk enrich people | POST | /people/bulk_match | 1/email each |
| Enrich company | GET | /organizations/enrich?domain=x | Credits |
| Create contact | POST | /contacts | Free |
| Search sequences | POST | /emailer_campaigns/search | Free |
| Add to sequence | POST | /emailer_campaigns/{id}/add_contact_ids | Free |
| Remove from sequence | POST | /emailer_campaigns/remove_or_stop_contact_ids | Free |
| Check usage | POST | /usage_stats/api_usage_stats | Free |

### Rate Limits

| Plan | Requests/Minute | Daily Limit |
|------|----------------|-------------|
| Free | ~50 | 600 |
| Basic | ~100/5min | 2,000 |
| Professional | Higher | 2,000 |
| Organization | 200 | 2,000 |

### Search Pagination

Max 50,000 records per search (100 per page x 500 pages). If your search returns more than 50,000, narrow your filters.

---

*Built by RoboLabs — researched and compiled from Apollo.io API documentation, MCP integration guides, and B2B prospecting best practices (2025-2026).*
