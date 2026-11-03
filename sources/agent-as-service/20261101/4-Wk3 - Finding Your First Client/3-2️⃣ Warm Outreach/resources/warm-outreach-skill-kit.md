# Warm Outreach Skill Kit

> **By RoboLabs** — Give this file to your AI agent (Claude Code, etc.) so it has deep knowledge of warm outreach best practices across LinkedIn, phone/SMS, and email.

---

## What This Is

This is a knowledge file for AI agents. When your agent has this loaded, it can:

- Help you export and organize your contact lists
- Write personalized outreach messages for each contact
- Advise on timing, cadence, and follow-up strategy
- Keep you within platform safety limits
- Draft messages that sound like you, not a bot

**How to use:** Add this file to your Claude Code project, or paste it into your agent's context. Then ask it to help you with warm outreach.

---

## The Warm Outreach Workflow

```
1. EXPORT your contacts (LinkedIn, phone, email)
2. CLEAN & PRIORITIZE your list (remove junk, tier by warmth)
3. WRITE personalized messages (AI helps here)
4. SEND in controlled batches (respect platform limits)
5. FOLLOW UP (2x max, then stop)
```

---

# CHANNEL 1: LinkedIn

## Exporting Your LinkedIn Connections

1. Log into LinkedIn → click your profile picture (top-right)
2. Select **Settings & Privacy**
3. Go to **Data Privacy** in the left sidebar
4. Click **Get a copy of your data**
5. Select **Connections** only
6. Click **Request archive**
7. Wait for LinkedIn's email (usually 10-15 minutes for connections only)
8. Download the ZIP → extract → open **Connections.csv**

### What You Get in the CSV

| Column | Notes |
|--------|-------|
| First Name | Always included |
| Last Name | Always included |
| Email Address | Only if connection shared it — many will be blank |
| Company | Current company |
| Position | Current job title |
| Connected On | Date you connected |

No phone numbers, no LinkedIn URLs, no mutual connection count. Export capped at 10,000 per day.

### Prioritizing Your List

Sort your CSV into tiers:

- **Tier 1 (message first):** Recent connections (last 6-12 months) + relevant role + you've interacted with their content. These people remember you.
- **Tier 2 (warm up first):** Relevant role but no recent engagement. Like/comment on their posts for a week before messaging.
- **Tier 3 (re-engagement needed):** Old connections you haven't spoken to. Needs a different message approach.

**Quick filter:** Sort by "Connected On" date (newest first), then filter by job title keywords relevant to your offer.

## LinkedIn Message Best Practices

### Length

- **Under 300 characters gets the best response rates.** Messages under 400 characters get 22% higher response rates than longer ones.
- LinkedIn allows up to 8,000 characters — using more than 500 actively hurts you.
- **Rule of thumb:** If it's longer than a text you'd send a friend, it's too long.

### What Gets Replies vs What Gets Ignored

**Gets replies:**
- First line is personalized (references something specific about them)
- Short and scannable
- No pitch in the first message
- Your profile looks active and credible (photo, headline, recent posts)
- They've seen your name before (you've engaged with their content)

**Gets ignored:**
- Generic opener ("I came across your profile...")
- Long paragraphs
- Immediate pitch or calendar link
- Template-feeling language
- No clear reason why you're messaging THEM specifically

### Opening Lines That Work

**Reference their recent post:**
> "Your post about [topic] hit home — especially the point about [specific detail]. Been thinking about that in my own work."

**Mutual connection:**
> "Noticed we're both connected to [Name] — how do you know them?"

**Their job change:**
> "Congrats on the move to [Company]. Curious what pulled you there."

**Direct warm outreach:**
> "Hey [Name], wanted to let you know I've started helping [who] with [what]. If you know anyone who might benefit, I'd appreciate a point in their direction. No pressure at all."

### What NOT to Say

1. **No "Pitch Slap"** — Don't connect and immediately send a sales pitch. No pricing, no calendar links, no product descriptions in the first message.
2. **No "I came across your profile and was impressed"** — Dead giveaway of a script.
3. **No "Would love to pick your brain"** — Asks for their time without offering anything.
4. **No leading with credentials** — "I'm the CEO of... We've helped 500+ companies..." Nobody cares yet.
5. **No copy-paste templates** — LinkedIn's algorithm detects structural similarity across messages (not just identical text). This triggers spam flags.
6. **No daily messaging** — Creates pressure and feels desperate.
7. **No "Just following up" with no new value** — Each touchpoint needs to offer something new.

### How to Personalize

Spend 60 seconds on their profile. Look for:

- **Recent posts or comments** — Reference a specific point they made
- **Role + company context** — "Running product at a Series B is a different beast..."
- **Mutual connections** — Name-drop shared contacts naturally
- **Career moves** — New role, promotion, company change
- **Company milestones** — Funding rounds, product launches, hiring
- **Shared groups or interests** — Industry groups, causes, hobbies in their About section

### Voice Notes (Powerful & Underused)

- **30-40% lift in reply rates** compared to text-only messages
- Most people receive almost zero voice notes on LinkedIn — they stand out
- Optimal length: **30-45 seconds** (60 seconds max)
- Only works via the **mobile app** to **1st-degree connections**
- Best used as a **follow-up** (message 2 or 3), not the opener
- Voice notes paired with visual elements (screenshots, whiteboard images) can drive **4x higher response rates**

## LinkedIn Timing & Cadence

### Best Days & Times

- **Best days:** Tuesday, Monday, Wednesday, Thursday
- **Best time windows:** 9am-12pm, 12pm-3pm, 3pm-6pm (recipient's local time)
- **Worst days:** Weekends (marginal difference though — only ~0.5% lower reply rates)
- **Key insight:** Message quality matters far more than timing. Don't overthink this.

### Daily Volume Limits

| Account Type | Safe Daily Volume | Weekly Cap |
|-------------|-------------------|------------|
| Free | ~20 new outreach messages | ~100/week |
| Premium | ~30 new outreach messages | ~150/week |
| Sales Navigator | ~30 new outreach messages | ~150/week |

- LinkedIn monitors on a **rolling weekly basis**, not strict daily caps
- Follow-up messages to existing conversations count less strictly
- **Safe ceiling:** Stay under 50 new outreach messages per day on any account type

### Follow-Up Sequence (14-Day, 4-Touch)

| Touch | When | What to Do |
|-------|------|------------|
| 1 | Day 1 | Connection accepted → thank + personalize. Wait 2-4 hours after acceptance (instant = bot-like) |
| 2 | Day 4 | Value-first message — share something useful (article, insight, resource) |
| 3 | Day 9 | Low-friction ask — "Would a 10-min call help, or prefer I send a case study?" |
| 4 | Day 14 | Graceful exit — "Last note from me. Door's always open." |

**Rules:**
- Space follow-ups **3-5 business days** apart minimum
- Each follow-up must add **new value** — not just "bumping this"
- Sequenced follow-ups improve conversions by **49%** over single messages
- **Stop after 3 unreturned messages.** No exceptions.

## LinkedIn Safety

### What Triggers Restrictions

- Sending 100+ near-identical messages (algorithm detects structural patterns)
- High volume + low reply rate
- Rapid-fire sending (many messages in a short burst)
- High connection request rejection rate
- Using detectable automation tools
- Getting reported or marked as spam

### Penalties

- **Mild:** 24-hour messaging block
- **Moderate:** Multi-day restrictions
- **Severe:** Account suspension
- **Repeated:** Permanent restrictions

### How to Stay Safe

1. Vary your message text meaningfully — not just swapping names
2. Keep daily volume under 50 new outreach messages
3. Spread activity throughout the day, not in bursts
4. Maintain a healthy reply rate by targeting well
5. Keep your profile active with posts and engagement (signals legitimacy)

---

# CHANNEL 2: Phone Contacts (SMS/Text)

## Exporting Your Phone Contacts

### iPhone

**Method 1 — SA Contacts app (fastest):**
1. Download "SA Contacts" from the App Store (free)
2. Open → tap "Export" → choose CSV
3. Grant contacts permission
4. Tap "Share" → email, AirDrop, or Save to Files

**Method 2 — iCloud (no app needed):**
1. Go to icloud.com/contacts on a computer
2. Sign in with your Apple ID
3. Select All → gear icon → "Export vCard"
4. Convert .vcf to CSV using csvjson.com/vcard-to-csv
5. Download your CSV

### Android / Google Contacts

1. Go to contacts.google.com
2. Click "Export" in the left sidebar
3. Select "Google CSV" format
4. Click "Export" → CSV downloads instantly

**Gotcha:** Only exports contacts synced to Google (not SIM-only or device-only). Fix: Settings → Accounts → Google → ensure Contacts sync is on.

### Cleaning Your List

- Use Google Contacts' built-in "Merge & fix" to deduplicate automatically
- In your spreadsheet: sort by name, remove entries with no phone number, delete junk (businesses, delivery drivers, old doctors)
- Keep: First name, last name, phone number, email (if available), notes on how you know them

### Prioritizing Who to Message

- **Tier 1 (first):** Close friends, family, people you talk to regularly. They will respond and probably share for you.
- **Tier 2:** Former colleagues, uni friends, people you haven't spoken to in under 2 years. Still warm, just dormant.
- **Tier 3:** Acquaintances, people from old jobs, loose connections. They know your name but the message needs more context.
- **Skip entirely:** People you wouldn't recognize in the street, strained relationships, anyone who'd find it inappropriate.

**Quick test:** Would this person reply if you texted "Hey, how are you?" with no agenda? If yes, they're warm enough.

## SMS Message Best Practices

### Length

- **Under 160 characters** (one SMS segment) is ideal
- Messages under 100 characters get **2-5x higher response rates**
- You're starting a conversation, not delivering a pitch
- Aim for **50-150 characters** for the initial text

### Example Messages

**Tier 1 (close contacts):**
> Hey [Name]! Quick one — I just launched [business/service]. Would love to tell you about it when you have 2 mins. Can I call you this week?

**Tier 2 (former colleagues/friends):**
> Hey [Name], hope you're doing well! Haven't caught up in ages. Wanted to let you know I started [business] — helping [who] with [what]. If you know anyone who might be interested, I'd appreciate a point in their direction. No pressure at all!

**Tier 3 (acquaintances):**
> Hi [Name], it's [Your Name] from [context — old job/event/mutual friend]. Hope you're well! I recently started [business] and I'm letting people know. Happy to chat about it if you're curious — if not, no worries at all.

### What NOT to Do

- Don't copy-paste the exact same message to everyone (people compare notes)
- Don't lead with "I have an amazing opportunity" (MLM alarm bells)
- Don't send links in your first message (looks like spam, carriers may filter it)
- Don't use ALL CAPS or excessive exclamation marks
- Don't pretend you're just "catching up" when you clearly want something — be upfront
- Don't add people to group chats about your business. Ever.
- Don't send a follow-up 20 minutes later if they haven't responded

### Text vs Call

**Text when:** Reaching out to many people, not a close contact, making initial contact after a long gap.

**Call when:** Close friend/family, they've responded positively and want to know more, you need back-and-forth.

**Best approach:** Text first to warm up, then transition to a call for anyone who shows interest.

## SMS Timing & Cadence

### Best Times

- **Primary window:** 9am-12pm (recipient's local time) — people are settled, checking messages
- **Secondary window:** 5pm-7pm — after work, more receptive to personal messages
- **Avoid:** Before 8am (intrusive), after 9pm (many anti-spam laws prohibit this), during lunch (12-1pm, messages get buried)

### Best Days

- **Best:** Tuesday, Wednesday, Thursday
- **Good:** Friday (good mood, may be winding down)
- **Worst:** Monday (inbox overload), Sunday (personal/family time)

### Daily Volume

- **Sweet spot: 10-20 texts per day** — lets you personalize each one
- Sending 200+ texts/day from a personal number risks getting flagged by carriers
- Watch your **incoming-to-outgoing ratio** — carriers monitor this. If you send 3x more than you receive, you look like a spammer.

### Follow-Up Cadence

- **First follow-up:** 3-5 days after initial text
- **Second follow-up:** 7-10 days after first follow-up
- **Then stop.** Two follow-ups maximum for warm contacts. Three feels pushy.
- **Monthly limit:** No more than 3-5 texts per month to any single contact

### Follow-Up Examples

**Follow-up 1 (3-5 days):**
> Hey [Name], no worries if you missed my last text. Just wanted to make sure it came through! Hope you're having a good week.

**Follow-up 2 (7-10 days):**
> Hey [Name], last one from me on this! If you ever want to chat about [topic], I'm always around. Otherwise totally understand — hope you're well!

## SMS Safety & Regulations

### Key Rules by Region

**United States (TCPA):**
- One-to-one personal texts to people you know are generally fine — the TCPA targets automated/mass messaging
- No texts before 8am or after 9pm in recipient's time zone
- Must honor opt-out requests
- Penalties: $500-$1,500 per violation

**Australia (Spam Act 2003):**
- An existing personal/business relationship constitutes implied consent
- Messages must identify who's sending and include an opt-out mechanism
- A one-off personal text about your new business to genuine contacts is not spam under the Act

**UK (PECR + UK GDPR):**
- "Soft opt-in" exception: If someone gave you their number during a business relationship, you can text about similar services
- Must identify your business and include opt-out instructions

**EU (GDPR + ePrivacy):**
- Explicit consent required for electronic marketing. Legitimate interest may apply for existing contacts.

**Practical takeaway:** If you're personally texting people who know you, from your own phone, one at a time — you're not in the danger zone. These laws target automated mass messaging.

### What Gets Your Number Flagged

- Sending 200+ texts/day from a personal number
- High outgoing-to-incoming ratio (3x more sent than received)
- Including links (especially shortened URLs like bit.ly)
- Using identical message text repeatedly
- Multiple recipients reporting you as spam
- Sending to disconnected numbers (high bounce rate)

### Personal Number vs Business Number

- **Use your personal number** for Tier 1-2 contacts (they know it, higher open rates)
- **Consider a second number** (Google Voice, separate SIM) for Tier 3 contacts — protects your main number if flagged

---

# CHANNEL 3: Email via Gmail

## Exporting Your Email Contacts

### From Google Contacts

1. Go to contacts.google.com
2. Select contacts (or select all)
3. Click **More actions → Export**
4. Choose **Google CSV** format
5. Click **Export** → CSV downloads

### Finding "Hidden" Contacts

Google Contacts only stores people you've explicitly saved. But Gmail keeps an "Other Contacts" section with people you've emailed but never saved:

- In Google Contacts, look for the **"Other Contacts"** label in the sidebar
- Export this separately — it often has hundreds of people you've corresponded with
- Also search Gmail with `from:me to:@` or `in:sent` to surface old conversations

### Organizing Your List

In Google Sheets:
- **Remove duplicates:** Data → Remove duplicates
- **Add a "Relationship" column:** Tag each contact (friend, ex-colleague, client, industry contact)
- **Add a "Priority" column:** Rate 1-3 based on how well they know you + how relevant your offer is
- **Remove:** Competitors, people you haven't spoken to in 10+ years with no context, anyone inappropriate
- **Verify:** Bounce a test email off anyone you're unsure about

## Gmail Tools for Sending

### GMass (Recommended)

A Chrome extension that turns Gmail into a mail merge tool. Everything happens inside Gmail — no new interface to learn.

**Pricing:**
- Standard: $25/month — unlimited emails, personalization, tracking, sequences
- Premium: $35/month — advanced features
- Professional: $55/month — everything

**Setup:**
1. Install GMass from Chrome Web Store
2. Open Gmail — GMass button appears next to Send
3. Create a Google Sheet with columns: FirstName, LastName, Email, Company (no spaces in headers)
4. In Gmail, click the GMass spreadsheet icon → connect your sheet
5. Compose your email normally
6. Use merge fields: type `{FirstName}` and it auto-fills per recipient
7. Add fallback values: `{FirstName|there}` shows "there" if no first name exists
8. Click the GMass button (not Send) to launch

**Tracking:** GMass tracks opens (invisible pixel), clicks (trackable links), and replies. Dashboard shows who opened, clicked, replied.

**Follow-ups:** GMass can auto-send follow-ups in the same thread if someone doesn't reply. Set it up once.

### Alternatives

- **Yet Another Mail Merge (YAMM):** Google Sheets add-on. Simpler but no automated follow-ups, basic analytics deleted after 10 days. Good for one-time simple sends.
- **Google Apps Script (free DIY):** Create a Gmail draft with placeholders, run a script to send. Completely free but requires comfort with code. No tracking or follow-ups.

**Verdict:** GMass at $25/month is the clear winner for non-technical people.

## Email Message Best Practices

### Length

**100-150 words total.** 2-3 short paragraphs max. This isn't a newsletter — it's a personal note.

### Subject Lines

**Rules:**
- 50 characters or fewer (longer gets cut off on mobile)
- Include their name or a shared reference
- State the purpose clearly — no clickbait

**Examples:**
- `Quick update + something I think you'd like`
- `[FirstName], started something new`
- `Been a while — wanted to share this with you`
- `Something I built that made me think of you`

**Avoid:** ALL CAPS, excessive punctuation (!!!), words like "free", "urgent", "act now", "limited time" — these trigger spam filters.

### Format

**Plain text wins decisively for warm outreach:**
- HTML emails have a bounce rate 652% higher than plain text
- Plain text generates 21-42% more clicks
- Plain text feels like a real email from a real person
- Save HTML for newsletters to opted-in subscribers

### What NOT to Do

- **No HTML templates with images/logos** — looks like marketing, triggers spam filters
- **No more than 1 link** in the body (2 maximum). Multiple links = spam signal
- **No attachments** in the first email. Mention you have something and offer to send it
- **No link shorteners** (bit.ly etc.) — major spam trigger
- **No mass BCC** — use a proper merge tool so each email is individually addressed

### Example Warm Outreach Email

```
Subject: [FirstName], started something new

Hey [FirstName],

Hope you're doing well! It's been a while since [shared context — old job, project, event].

Wanted to let you know I've started helping [who] with [what — keep it one sentence].

Do you know anyone who might benefit from something like this? Happy to chat if you want to know more. Either way, hope things are great on your end.

[Your name]
```

### Framing the Ask

- Don't sell. Inform and invite.
- "I wanted to let you know what I've been working on"
- "If this is relevant to you, I'd love to chat"
- "No pressure — just wanted you to hear it from me first"
- One clear, low-friction CTA: reply, book a 15-min call, or check one link
- Make them feel like insiders, not targets

## Email Timing & Cadence

### Best Days & Times

- **Best days:** Tuesday, Wednesday, Thursday
- **Best time:** 9-10am in the recipient's timezone
- **Secondary peak:** 2pm (post-lunch email check)
- **Evening peak:** 8-9pm (people act on saved emails — highest click rates)
- **Avoid weekends** for professional contacts

### Gmail Sending Limits

| Account Type | Daily Limit |
|-------------|-------------|
| Free Gmail (@gmail.com) | 500 emails/day |
| Google Workspace (custom domain) | 2,000 emails/day |

**But:** Even though limits are 500/2000, send no more than **50-100 per day** to protect your sender reputation. Gmail's spam AI triggers well before official limits.

- Send in batches of **20-50 per hour**
- GMass has built-in sending speed controls for this
- Spread a 200-person list over 2-3 days

### Warm-Up Ramp

Even for warm outreach, ramp up gradually:
- **Week 1:** 10-30 emails per day
- **Week 2:** 50-75 per day
- **Week 3+:** Up to 100-150 per day if engagement is good

### Follow-Up Sequence

| Email | When | What |
|-------|------|------|
| 1 | Day 1 | Initial outreach |
| 2 | Day 4-5 | "Just bumping this up in case it got buried" |
| 3 | Day 10-14 | Final — add new value or a different angle |

**3 emails total is the max for warm outreach.**

- Reply in the **same thread** for follow-ups (shows context, doesn't clutter inbox)
- GMass can automate this — follow-ups appear as replies in the same thread
- After 3 emails with no response: stop. Wait 2-3 months before trying a different angle.

### Follow-Up Examples

**Follow-up 1 (Day 4-5):**
> Hey [Name], just wanted to make sure this didn't get lost in the shuffle. Would love to hear what you think — even a quick "not for me" is totally fine.

**Follow-up 2 (Day 10-14):**
> Last one from me on this, [Name]. If the timing isn't right, no worries at all. Just didn't want you to miss it since I thought it might be relevant to [specific thing about them]. Either way, hope you're doing well.

## Email Deliverability

### Why Warm Email Has an Advantage

You're emailing people who know you. Many have previous email threads with you. Gmail's algorithm sees this history and is far more likely to deliver your email to their inbox. This is why warm outreach has dramatically better deliverability than cold email.

### What Triggers Spam Flags

- Spam complaint rate above 0.1%
- Multiple links, link shorteners, or redirect URLs
- Misleading subject lines
- Large attachments
- HTML-heavy emails with images
- Sudden volume spikes (going from 5 emails/day to 200)
- Words like "free", "guarantee", "act now", "limited offer", "click here"

### SPF/DKIM — Do You Need to Worry?

- **Personal Gmail (@gmail.com):** No. Google handles authentication automatically.
- **Google Workspace (custom domain):** Verify SPF, DKIM, and DMARC are set up in your domain's DNS. Usually configured by default if your domain was set up properly.

---

# AI-ASSISTED MESSAGE WRITING

## The Power Move

The biggest time-saver isn't automating the sending — it's automating the writing.

**Workflow:**
1. Export your contacts to a CSV
2. Give the CSV to your AI agent
3. Ask: "Write a personalized warm outreach message for each person based on their name, company, and role"
4. Review the messages (edit anything that doesn't sound like you)
5. Send manually or via GMass/Dux-Soup

**What to ask your agent:**
- "Write 50 personalized LinkedIn messages for my connections. Reference their company and role. Keep each under 300 characters. Tone: casual but professional."
- "Write warm outreach texts for these phone contacts. I know them from [context]. Keep under 160 characters."
- "Draft personalized emails for these contacts. Plain text, under 150 words, subject line under 50 characters."

**What makes AI-written messages good:**
- Each message is genuinely different (not a template with name-swaps)
- References real details from the CSV (company, role, connection date)
- Stays within platform character/word limits
- Sounds conversational, not corporate

**What to watch for:**
- Remove any AI-sounding phrases before sending
- Make sure each message sounds like YOUR voice
- Double-check that personalization details are accurate
- Don't let the AI add links, emojis, or corporate jargon you wouldn't use

---

# QUICK-REFERENCE: SAFE LIMITS BY PLATFORM

| Platform | Daily Send Limit | Follow-Up Max | Message Length | Biggest Risk |
|----------|-----------------|---------------|----------------|-------------|
| LinkedIn | 20-50 new messages | 3 unreturned, then stop | Under 300 characters | Identical messages flagged by algorithm |
| SMS/Text | 10-20 texts | 2 follow-ups, then stop | Under 160 characters | Carrier flagging if outgoing >> incoming |
| Gmail | 50-100 emails | 2 follow-ups, then stop | 100-150 words | Volume spikes trigger spam AI |

---

# UNIVERSAL RULES

1. **Never pitch in the first message.** Lead with warmth, personalization, or value.
2. **Keep it short.** Every platform rewards brevity.
3. **Personalize genuinely.** Reference something specific about them — not just their name.
4. **Follow up twice, then stop.** Persistence is good. Harassment is not.
5. **Spread your sends across days.** Never blast your entire list at once.
6. **Plain text beats HTML.** Always. For warm outreach, formatted emails look like marketing.
7. **Text first, call second.** Open the door with a message, deepen with a conversation.
8. **Be honest about what you want.** Don't pretend to "catch up" when you have an agenda. People respect directness.
9. **Each follow-up must add new value.** Never send "just following up" with nothing else.
10. **The goal is a conversation, not a conversion.** Your message opens the door. Everything else happens after.

---

*Built by RoboLabs — researched and compiled from 40+ sources across LinkedIn, SMS, and email outreach best practices (2025-2026).*
