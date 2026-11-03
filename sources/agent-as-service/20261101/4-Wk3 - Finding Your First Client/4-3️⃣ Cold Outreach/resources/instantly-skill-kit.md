# Instantly.ai Skill Kit

> **By RoboLabs** — Give this file to your AI agent (Claude Code, etc.) so it has deep knowledge of Instantly.ai for sending cold email at scale. Your agent can then create campaigns, import leads, manage warmup, track deliverability, and run automated follow-up sequences.

---

## What This Is

This is a knowledge file for AI agents. When your agent has this loaded, it can:

- Create and manage cold email campaigns
- Import leads from Apollo.io or any CSV source
- Monitor email deliverability and warmup status
- Set up automated follow-up sequences
- Track open rates, reply rates, and bounces
- Advise on domain setup, warmup timing, and spam avoidance
- Pause campaigns that are underperforming before they damage your reputation

**How to use:** Add this file to your Claude Code project, or paste it into your agent's context. Then describe your campaign and let it handle the setup.

---

## The Instantly Workflow

```
1. SET UP your sending domains and email accounts
2. WARM UP those accounts for 2-4 weeks (Instantly does this automatically)
3. IMPORT your lead list (from Apollo, CSV, or manually)
4. CREATE your campaign (email copy + follow-up sequence)
5. ACTIVATE and monitor (watch bounce rates, reply rates, opens)
6. FOLLOW UP automatically (Instantly handles the timing)
```

The key insight: **deliverability is everything.** The best email in the world doesn't matter if it lands in spam. Instantly's entire value is getting your emails into the primary inbox.

---

# GETTING STARTED

## Creating Your Account

1. Go to instantly.ai and sign up
2. Choose a plan (Growth at $47/month is the entry point for API access)
3. Go to Settings > Integrations > API Keys
4. Create a new key - select scopes or use "all:all" for full access
5. Store your API key securely

## What You Get on Each Plan

| Feature | Growth ($47/mo) | Hypergrowth ($97/mo) | Light Speed ($358/mo) |
|---------|----------------|---------------------|----------------------|
| Emails/month | 5,000 | 100,000 | 500,000+ |
| Active contacts | 1,000 | 25,000 | 100,000+ |
| Email accounts | Unlimited | Unlimited | Unlimited |
| Warmup | Unlimited | Unlimited | Unlimited |
| API access | Yes | Yes | Yes |
| Webhooks | No | Yes | Yes |

All plans include unlimited email accounts and warmup. That's the big selling point - you can connect as many sending accounts as you want without paying extra.

## Connecting Your Agent

Set this environment variable so your agent can access the Instantly API:

```
INSTANTLY_API_KEY=your-api-key-here
```

Instantly also has an official MCP server your agent can use:

```
MCP URL: https://mcp.instantly.ai/mcp/YOUR_API_KEY
```

Either approach works. The API key is the important part.

---

# DOMAIN & EMAIL SETUP

This is the most important section. Skip this and your emails go straight to spam.

## Buying Sending Domains

**Rule #1: Never send cold email from your primary business domain.**

If your business is yourbrand.com, buy separate domains for cold outreach:
- tryyourbrand.com
- getyourbrand.com
- useyourbrand.com
- yourbrandai.com

**How many domains?**
- Starting out: 2-3 domains
- Scaling up: 5-10 domains
- Going aggressive: 20-40 domains

**Math:** Each domain can safely have 3 email accounts. Each account sends ~40 emails/day. So 3 domains = 9 accounts = ~360 emails/day.

## Setting Up Email Accounts

Use real-sounding names, not roles:
- Good: john@tryyourbrand.com, sarah@getyourbrand.com
- Bad: sales@tryyourbrand.com, info@getyourbrand.com, noreply@getyourbrand.com

You can use Google Workspace, Microsoft 365, or any IMAP/SMTP provider. Google Workspace is the most common choice.

## DNS Records (Non-Negotiable)

Every sending domain needs three DNS records. Without these, email providers will reject or spam your messages.

| Record | What It Does | Why It Matters |
|--------|-------------|---------------|
| SPF | Tells email providers which servers can send on your behalf | Without it, your emails look unauthorized |
| DKIM | Adds a digital signature to prove the email wasn't tampered with | Without it, providers can't verify you're real |
| DMARC | Tells providers what to do if SPF/DKIM fail | Protects your domain reputation |

**What to ask your agent:**
- "Help me set up SPF, DKIM, and DMARC for my sending domains"
- "Check if my DNS records are configured correctly"

You also want a **custom tracking domain** - a CNAME record that puts tracking links on your own subdomain instead of Instantly's shared one. This isolates your reputation from other senders.

## Warmup (Critical - Don't Skip This)

Warmup is the process of building trust with email providers before you send real campaigns. Instantly does this automatically - it sends and receives fake conversations between real accounts to build your sender reputation.

### Warmup Schedule

| Week | Daily Volume | What's Happening |
|------|-------------|-----------------|
| Week 1 | 5-10 emails/day | Building initial reputation |
| Week 2 | 20-40/day | Providers starting to trust you |
| Week 3-4 | 40-50/day | Ready for real campaigns |

**Rules:**
- Minimum 2 weeks warmup before any real sending. 4 weeks is safer.
- Never turn off warmup, even between campaigns. Keep it running always.
- For newer accounts, split 70% warmup / 30% cold outreach.
- Check inbox placement - you want 80%+ landing in primary inbox before launching.

**What to ask your agent:**
- "Enable warmup on all my email accounts"
- "Check warmup status - are my accounts ready to send?"
- "What's my inbox placement rate?"

---

# IMPORTING LEADS

## From Apollo.io (Recommended Pipeline)

If you used Apollo to find and enrich leads, here's how the fields map to Instantly:

| Apollo Field | Instantly Field |
|-------------|----------------|
| email | email |
| first_name | first_name |
| last_name | last_name |
| title | custom_variables.title |
| organization_name | company_name |
| linkedin_url | custom_variables.linkedin |
| city | custom_variables.city |

**What to ask your agent:**
- "Take my Apollo export and import it into my Instantly campaign"
- "Format these Apollo leads for Instantly and add them to [campaign name]"

## From CSV

Instantly accepts CSV imports with these standard columns:
- email (required)
- first_name
- last_name
- company_name
- Any additional columns become custom variables you can use in your emails

## Via API (Bulk Add)

Your agent can push up to 1,000 leads per API call directly into a campaign.

**API endpoint:** `POST https://api.instantly.ai/api/v2/leads/bulk`

You must provide either a `campaign_id` or a `list_id` (not both). Instantly automatically validates emails and checks against your block list.

## Lead List Hygiene (Before Importing)

Clean your list before importing. Bad data kills deliverability.

- **Verify all emails** - use Instantly's built-in verification or a third-party tool
- **Remove duplicates** - same person shouldn't get your email twice
- **Remove catch-all domains** - these accept any email address, so you can't tell if it's real
- **Check against your block list** - competitors, existing clients, anyone you don't want to email
- **Target bounce rate: near zero.** If your bounce rate goes above 2%, pause and re-verify your list.

---

# CREATING CAMPAIGNS

## Campaign Structure

A campaign in Instantly is an email sequence - your initial email plus follow-ups, sent automatically on a schedule.

**Recommended structure:** 3 steps total
1. **Email 1:** Initial outreach (lead with value)
2. **Email 2:** Follow-up bump (3-5 days later)
3. **Email 3:** Break-up email (7-10 days after that)

More than 3-4 steps rarely helps for cold outreach. People either respond in the first few touches or they don't.

## Campaign Settings

| Setting | Recommended Value | Why |
|---------|------------------|-----|
| daily_limit | 30-50 per inbox | Higher = spam risk |
| stop_on_reply | true | Don't keep emailing people who responded |
| text_only | true | Plain text performs better than HTML |
| link_tracking | false | Tracking links trigger spam filters |
| open_tracking | true | Useful for data, less risky than link tracking |
| schedule | 9am-5pm Mon-Fri | Send during business hours in recipient's timezone |

**What to ask your agent:**
- "Create a campaign called 'Dental Clinics Sydney Round 1' with a 3-step sequence"
- "Set daily limit to 30 per inbox, text only, stop on reply"
- "Schedule sends for 9am-5pm Monday through Friday"

## Writing Your Emails

### Email 1: Initial Outreach

**Rules:**
- 3-5 sentences maximum
- Lead with value, not a pitch
- Make it about them, not you
- One clear ask (usually "want me to send this over?")

**Example:**
```
Hey {{firstName}},

I ran a quick [audit type] on {{companyName}}.

Found a few things that might help with [specific outcome].

Want me to send over what I found?

No pitch - just thought it might be useful.
```

### Email 2: Follow-Up (3-5 days later)

**Rules:**
- Leave the subject line blank (keeps it in the same thread)
- Even shorter than Email 1
- Add one new piece of value or a different angle

**Example:**
```
Hey {{firstName}}, just bumping this up.

Happy to send over that [audit/report] if useful. No pressure either way.
```

### Email 3: Break-Up (7-10 days later)

**Rules:**
- Let them know this is your last message
- Keep the door open
- No guilt trips

**Example:**
```
Hey {{firstName}}, last note from me on this.

If the timing isn't right, totally understand. If things change down the road, happy to help.

Either way, hope business is going well.
```

### Personalization Variables

Use merge fields from your lead data:
- `{{firstName}}`, `{{lastName}}`, `{{companyName}}`
- Any custom variable: `{{title}}`, `{{city}}`, `{{linkedin}}`

The more personalized, the better. Even adding `{{companyName}}` lifts response rates because it shows you know who you're emailing.

## A/B Testing

Instantly supports variants for testing:
- Test different subject lines (biggest impact on open rates)
- Test different opening lines (biggest impact on reply rates)
- Test different CTAs (biggest impact on conversion)

Run tests with at least 100 sends per variant before drawing conclusions.

---

# MONITORING & PERFORMANCE

## Key Metrics

| Metric | Target | Danger Zone | Action |
|--------|--------|-------------|--------|
| Open rate | 50%+ | Below 30% | Fix subject lines or deliverability |
| Reply rate | 5%+ | Below 1% | Fix email copy or targeting |
| Bounce rate | Under 2% | Above 5% | Pause immediately, re-verify list |
| Spam complaints | Under 0.1% | Above 0.3% | Stop campaign, investigate |

**What to ask your agent:**
- "Check my campaign analytics - how's the open rate?"
- "Is my bounce rate in the safe zone?"
- "Which campaign has the best reply rate?"

## When to Pause

Pause your campaign immediately if:
- Bounce rate goes above 2%
- Spam complaints above 0.1%
- Open rate drops suddenly (deliverability issue)
- An email account gets flagged or suspended

**What to ask your agent:**
- "Pause my campaign - bounce rate is too high"
- "Check all my email accounts - any issues?"

## Campaign Analytics via API

Your agent can pull detailed performance data:

| Endpoint | What It Shows |
|----------|-------------- |
| Campaign analytics | Open rate, reply rate, bounce rate, clicks |
| Daily analytics | Time-series performance data |
| Step-level analytics | How each email in the sequence performs |
| Account analytics | Per-account warmup and sending health |

---

# SENDING BEST PRACTICES

## Volume & Rotation

- Cap at **30-50 emails per inbox per day** (this includes warmup volume)
- Scale by adding more inboxes, not by pushing one inbox harder
- Instantly rotates across your connected accounts automatically
- Send during **business hours** in the recipient's timezone (Mon-Fri, 9am-5pm)
- Keep daily volume consistent - no sudden spikes

## What Gets You Into Spam

| Spam Trigger | Why | Fix |
|-------------|-----|-----|
| HTML-heavy emails | Looks like marketing | Use text-only |
| Multiple links | Spam signal | Max 1-2 links, or none |
| Images | Marketing pattern | No images in cold email |
| Link shorteners (bit.ly) | Associated with spam/phishing | Use full URLs or no links |
| Shared tracking domain | Poisoned by other senders | Set up custom tracking domain |
| Volume spikes | Unnatural sending pattern | Ramp up gradually |
| Spam trigger words | "free", "guaranteed", "act now" | Write naturally, avoid hype |
| No unsubscribe | Required by law | Always include |

## Compliance

### Gmail/Yahoo/Microsoft Rules (2025+)

If you send 5,000+ emails to personal Gmail in 24 hours, you're classified as a "bulk sender" and must:
- Keep spam complaints under 0.3%
- Keep bounces under 2%
- Honor unsubscribe within 2 days
- Have SPF/DKIM/DMARC alignment
- Include one-click unsubscribe headers (RFC 8058)

### Legal Requirements

- **CAN-SPAM (US):** Physical address + unsubscribe in every email. Honor opt-outs within 10 days.
- **GDPR (EU/UK):** Document your legitimate interest. Include unsubscribe. Honor opt-outs immediately.
- **Spam Act (Australia):** Sender identity + unsubscribe mechanism. Commercial emails need consent or existing relationship.

---

# MANAGING EMAIL ACCOUNTS

## Account Health

Your agent can monitor and manage all your sending accounts:

| Action | What It Does |
|--------|-------------|
| List accounts | See all connected email accounts and their status |
| Enable warmup | Start warming up a new account |
| Disable warmup | Pause warmup (not recommended) |
| Pause account | Stop sending from a specific account |
| Check vitals | Test deliverability health |

**What to ask your agent:**
- "List all my email accounts and their warmup status"
- "Enable warmup on the three new accounts I just added"
- "Pause the account that's having deliverability issues"

## Block List Management

Instantly lets you block specific emails or entire domains from all campaigns. Use this for:
- Competitors you don't want to email
- Existing clients (they should get different communication)
- Anyone who's opted out or complained
- Domains you know are irrelevant

**What to ask your agent:**
- "Add competitor.com to my block list"
- "Block these 5 email addresses from all campaigns"

---

# WHAT TO ASK YOUR AGENT

Here are ready-to-use prompts for common tasks:

**Setting up from scratch:**
> "I'm starting cold email outreach. I have 3 new domains ready. Help me connect them to Instantly, enable warmup, and set up the DNS records I need."

**Creating a campaign:**
> "Create a cold email campaign targeting [industry]. 3-step sequence: value-first opener, follow-up bump in 4 days, break-up in 10 days. Text only, 30 emails/day limit, stop on reply. Here's my lead list: [paste or attach CSV]."

**Importing leads from Apollo:**
> "I have an Apollo export with 200 leads. Import them into my [campaign name] campaign. Map the fields correctly."

**Checking performance:**
> "How are my campaigns performing? Show me open rates, reply rates, and bounce rates. Flag anything that needs attention."

**Troubleshooting deliverability:**
> "My open rate dropped from 55% to 20% this week. What's going on? Check my account health and warmup status."

**Scaling up:**
> "I want to go from 100 emails/day to 500/day. How many more domains and accounts do I need? Help me set them up."

---

# INTEGRATION WITH OTHER TOOLS

## Webhooks (Hypergrowth+ Plan)

Instantly can notify external systems when events happen:

| Event | When It Fires |
|-------|--------------|
| email_sent | An email is delivered |
| email_opened | Recipient opens the email |
| email_link_clicked | Recipient clicks a link |
| reply_received | Recipient replies |
| email_bounced | Email bounces |
| lead_unsubscribed | Recipient unsubscribes |
| campaign_completed | All leads in a campaign have been processed |

**What to ask your agent:**
- "Set up a webhook to notify me on Slack when someone replies"
- "Create a webhook for bounced emails so I can clean my list"

## Zapier / Make / n8n

Instantly has native integrations with:
- **Zapier** - triggers and actions for campaigns, leads, and events
- **Make.com** - native Instantly modules
- **n8n** - MCP Client node with HTTP transport

Common automations:
- New reply in Instantly > Create task in CRM
- New lead in Google Sheet > Add to Instantly campaign
- Email bounced > Remove from Apollo list

---

# API REFERENCE (FOR YOUR AGENT)

Your agent needs these details to make API calls on your behalf.

**Base URL:** `https://api.instantly.ai/api/v2`
**Auth:** `Authorization: Bearer YOUR_API_KEY`
**Docs:** https://developer.instantly.ai/
**OpenAPI spec:** https://api.instantly.ai/openapi/api_v2.json

> V1 was deprecated January 19, 2026. Only V2 works. V2 keys are NOT compatible with V1.

### Key Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| List campaigns | GET | /campaigns |
| Create campaign | POST | /campaigns |
| Get campaign | GET | /campaigns/{id} |
| Activate campaign | POST | /campaigns/{id}/activate |
| Pause campaign | POST | /campaigns/{id}/pause |
| Bulk add leads | POST | /leads/bulk |
| List leads | POST | /leads/list |
| Update lead | PATCH | /leads/{id} |
| Move leads | POST | /leads/move |
| List accounts | GET | /accounts |
| Enable warmup | POST | /accounts/{id}/warmup/enable |
| Disable warmup | POST | /accounts/{id}/warmup/disable |
| Campaign analytics | GET | /campaigns/{id}/analytics |
| Verify email | POST | /emails/verify |
| Create webhook | POST | /webhooks |
| Manage block list | POST | /block-list/bulk |

### Rate Limits

- **100 requests/second** (workspace-wide, across all API keys)
- **6,000 requests/minute** (workspace-wide)
- Bulk lead operations: max 1,000 leads per request
- Returns **429** when exceeded

### Bulk Lead Format

```json
{
  "campaign_id": "campaign-uuid",
  "leads": [
    {
      "email": "john@acme.com",
      "first_name": "John",
      "last_name": "Smith",
      "company_name": "Acme Corp",
      "custom_variables": {
        "title": "CEO",
        "city": "Sydney"
      }
    }
  ]
}
```

Must provide `campaign_id` OR `list_id`, not both. Max 1,000 leads per request.

### Campaign Creation Format

```json
{
  "name": "Campaign Name",
  "campaign_schedule": {
    "schedules": [{"from": "09:00", "to": "17:00"}]
  },
  "daily_limit": 30,
  "stop_on_reply": true,
  "text_only": true,
  "link_tracking": false,
  "open_tracking": true
}
```

Note on sequences: The `sequences` field is an array, but only the first element is used. Add all steps to that single array item.

### Error Codes

| Code | Cause | Fix |
|------|-------|-----|
| 401/403 | Wrong key or insufficient scopes | Check API key is V2, has correct scopes |
| 400 | Invalid payload | Check request body format |
| 429 | Rate limit exceeded | Wait and retry, batch operations |

---

# QUICK-REFERENCE: SAFE LIMITS

| Setting | Safe Value | Aggressive Value | Danger Zone |
|---------|-----------|-----------------|-------------|
| Emails per inbox/day | 30 | 50 | 100+ |
| Warmup period | 4 weeks | 2 weeks | Under 1 week |
| Bounce rate | Under 1% | Under 2% | Above 5% |
| Spam complaints | Under 0.05% | Under 0.1% | Above 0.3% |
| Follow-up steps | 3 | 4 | 6+ |
| Links per email | 0 | 1 | 3+ |
| Domains for 500 emails/day | 5-6 | 4 | 2 |

---

*Built by RoboLabs — researched and compiled from Instantly.ai API documentation, MCP server specs, deliverability guides, and cold email best practices (2025-2026).*
