---
source: vertex-build-tutorial
part: 6
created: 2026-08-22
updated: 2026-08-22
---

# Part 6 — Self-driving analytics, security deep scan, assignments & wrap-up

## Overview (L1)

Covers the mature-product phase: the PostHog **self-driving inbox** surfaces a real bug (breadcrumb navigation loop) and opens its own fix PRs. Then everything uncommitted is committed, and **CodeRabbit Security's AI deep scan** runs — finding two architecture-level issues (an AI-cost DoS on the public search API, and a PostHog reverse-proxy trust-boundary leak). The author then hands over the final **assignments**: timestamp deep-linking (open the video at the exact matched second) and search tuning, each done through the full workflow (prompt → review plan → approve → branch → PR → CodeRabbit). Closes with the workflow recap and the deeper "agentic engineering" course pitch.

## Sections (L2)

### PostHog self-driving dashboard & inbox (8501-8660)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8501-8660]]
- Summary: From its own data PostHog generated an overview dashboard (user attention/retention by date, real vs bot traffic, unique visitors by acquisition channel, course popularity, top pages, course discovery vs lesson consumption vs search, traffic + new-user signups over 30 days). The self-driving inbox then surfaced a high-priority issue: breadcrumb exits redirect back to the lesson — anyone on a lesson page gets yanked back within a second (a navigation loop, caught by Replay Vision reviewing the session).
- Key claims: PostHog AI built funnels/dashboards without hand-writing queries. The "trapped in a navigation loop" insight came from session replay scanning; the author deliberately clicked around to show how self-driving works. **PostHog self-driving opened two PRs on its own**: wiring the hero search to the results page + stopping dev-error capture, and filtering third-party `clerk.js` fetch errors from capture — the human just submits/approves. "The agent surfaces the insight and you decide what to build next."
- Learner-relevant: Measure → learn → improve loop running automatically; session replay + AI review converts raw recordings into actionable PRs.

### Committing everything + enabling the AI deep scan (8661-8816)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8661-8816]]
- Summary: The ingestion pipeline, search page, and PostHog tracking were uncommitted, so they're committed and opened as a PR. Since the app now has a server route feeding user input to an LLM with content access, scripts that write to the dataset, and API keys (Sanity, Clerk, OpenAI, PostHog) in env files — every one a place AI code could be insecure — the author turns on **CodeRabbit Security AI deep scan** on top of the normal PR review.
- Key claims: Scope of review now includes runtime attack surface, not just code style. AI deep scan chosen as scan type; usage-based billing (no separate security plan needed); PR was ~49 files changed.
- Learner-relevant: Env keys, LLM-facing server routes, and DB-writing scripts expand the security surface beyond what UI checking catches.

### PR review: high merge risk, 7 findings (8817-8956)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8817-8956]]
- Summary: CodeRabbit rated the PR **high merge risk, level 5 critical, >2 hours review effort** — the largest yet — and produced a detailed walkthrough with specific comments.
- Key claims: Findings included: (1) **major/quick win** — telemetry capture can reject and turn a successful search into a 502; wrap the await in try/catch, log, and still return the response ("never cancel a response if you don't need to"); (2) minor — handle aborted requests before failure analytics; (3) **major** — watch depth is computed from elapsed playback time including the start second, so a learner who deep-links near the end can emit all milestones + lesson completed after one tick; offset position by the start second so percent watched uses elapsed time only; (4) minor — don't render completion state without progress data; (5) minor — remove the assumption every video lesson has an ingested video document; (6) sensitive-data exposure — PostHog can see the text typed into the search bar (author accepts: search queries are just searches); (7) limits for the queue. Author notes CodeRabbit "has to fully understand what our app is all about" to suggest such fixes; fixes applied via the "fix all comments" prompt (off-screen, since the learner's issues may differ).
- Learner-relevant: High-risk PRs against a live LLM/analytics pipeline surface logic bugs (502-on-telemetry-fail, milestone-gaming via deep links) that UI testing can't see.

### AI deep scan: two architecture-level findings (8957-9124)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8957-9124]]
- Summary: The AI deep scan ran ~14 minutes at ~$30 and returned two **medium** findings. Both are architecture-level: every individual line is fine, but the pieces interact unsafely — the class of thing pattern-matching scanners can't catch.
- Key claims: **Finding 1 — AI-cost DoS:** the search API is public; every request spins up an OpenAI call with an MCP tool loop, with no rate limit, concurrency cap, or budget guards. An attacker can make free HTTP calls that become expensive model calls ("they just used the feature faster than I planned for it"). Fixes: rate-limit before the MCP client is created, separate quotas for anonymous vs signed-in users, or a hard spending cap at the provider — the AI opens a fix PR itself. **Finding 2 — sensitive data / trust boundary:** PostHog is configured to send browser traffic to the same origin, which Next.js externally rewrites to PostHog while forwarding incoming request headers (the documented ingest reverse proxy recommended to beat ad blockers); because it's same-origin, the browser attaches every cookie — including the Clerk session cookie — and the rewrite forwards them. Two tools each doing exactly what's documented, combined, cross a trust boundary. Cost justification: finding 1 alone could cost more than $30 in OpenAI charges within an hour; finding 2 is the kind of thing a compliance audit flags. Cheap for a real product; you wouldn't run it weekly on a toy repo; cost estimates are shown before running.
- Learner-relevant: AI applications introduce a new vulnerability class (expensive model calls triggered cheaply); same-origin analytics proxies that forward headers can leak auth cookies; architecture-level reasoning catches what line-level scanners miss.

### Final assignments: timestamp deep-linking + search tuning (9125-9296)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:9125-9296]]
- Summary: Everything major is built, so the learner runs the full workflow themselves on two upgrades. The main assignment: search already finds content, but clicking a result just opens the lesson page — the target is the promise from the video's opening: the result card links to the lesson **with a timestamp** and the video starts playing at the exact second.
- Key claims: Hints: think about chapters-matching vs transcript-only-matching (the video documents from the ingestion lesson already contain everything needed); the author's exact prompt is in the video kit — but try writing your own first. Second assignment: **tune** search, not add a feature — be specific about what content matters, how results rank, and making it faster ("make it better" is too open-ended). Finish by branching, committing, opening a PR, and running CodeRabbit one more time on code the AI wrote without the author watching.
- Learner-relevant: The skill is the workflow (decide → clear prompt → review the plan → approve → test → fix → reviewed PR), applied to both a new feature and a refinement.

### Recap, workflow takeaway & course pitch (9297-9439)
[[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:9297-9439]]
- Summary: Closes by summarizing what was built — a blank Next.js app became a full learning platform with real content, auth, course and lesson pages, analytics, structured video data, and intelligent search that drops you at the exact second a topic is taught — and restates that the workflow is the real takeaway.
- Key claims: The repeatable workflow: give the AI **skills** (tool knowledge), write **AGENTS.md** (project rules), make it **plan before building**, **approve every plan**, **verify every feature**, and put every change through a **reviewed pull request** — "you stayed the engineer the entire time." The same workflow applies to any product (SaaS, marketplace, dashboard, internal tool). For larger/team/production/long-running projects you need more than a single AGENTS.md — a repeatable system for scoping, architecture decisions, auditing the codebase, keeping context updated, and coordinating agents, which is what the author's **agentic engineering course** teaches (the underlying custom agent skills are free and open source on GitHub; took about a year to develop).
- Learner-relevant: Strong-prototype workflow vs production workflow: prototype = one AGENTS.md keeps the AI under control; production = a scoping/architect/audit/sync system.
