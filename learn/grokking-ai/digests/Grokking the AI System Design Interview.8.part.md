---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.8.part.txt
source_type: text
source_lines: 1313
part: 8
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 24 — Design Harmful Content Detection — Fraud's judging shape plus multimodal input, non-monetary costs, and huge benign volume. A four-stage risk funnel (hashes/rules, fast classifier, heavy multimodal models, human review) passes 200M daily items down to ~2M and ~200K, measured by prevalence from sampled views. Thresholds are policy, appeals are labels, and reach-aware routing defends against the viral miss.
- Lesson 25 — Capstone: People You May Know — A two-sided recommendation over a 900M-member graph: the ranker scores P(send) × P(accept), candidates come from triangle closing, contacts, affiliations, and embeddings, and a privacy filter runs at retrieval and fails closed. Precomputed nightly in an idempotent batch, kept fresh by a streaming job, and measured with accepted invites, guardrails, and a weeks-later north star.

# L2 detail

- `#L1-L30` — Lesson 24 vocabulary: harmful content, policy, Trust and Safety, multimodal, classifier, missed harm, wrongful removal, prevalence, perceptual hash, risk funnel, pass rate, action ladder, review queue, active learning, appeal, reach.
- `#L31-L79` — Part 1: frame — one post is one item, so it is a judging question; adds three complications (multimodal input, costs that are not dollars, huge benign volume under 1%); context decides meaning (reclamation vs harassment); 200M posts a day; one classifier cannot afford to be good on everything.
- `#L80-L106` — Part 2: define success — measure prevalence (share of views on violating content), not uploads, because a viral miss dwarfs an unseen one; estimate from a random sample of view logs per category and report an error bar.
- `#L107-L144` — Part 2 continued: false-removal rate is the guardrail, from sampled audits plus overturned appeals; per-stage offline metrics — fast classifier on recall at its pass rate, heavy model on precision and recall, human review on reviewer agreement; also track time to action.
- `#L145-L165` — Part 3: labels from reviewer decisions (high quality, hours) and appeal outcomes (the false-positive labels); user reports are evidence, not labels; active learning sends uncertain items first while keeping a random sample, and each label stores its guideline version.
- `#L166-L215` — Part 3 continued: four evasion tricks — leetspeak, homoglyphs, text in images, harm split across posts — and their defenses (normalize, map look-alikes, OCR, account/thread features); four feature groups: content, context, account, reach.
- `#L216-L225` — Part 3 features: content, context, account, and reach groups, illustrated on the 900,000-follower meme whose image text comes from OCR and caption from context.
- `#L226-L234` — Part 4: baseline is hash matching, keyword rules, and reports to review; cheap but misses new harm (a new image matches no hash), so every model must beat it.
- `#L235-L291` — Part 4: the risk funnel — hashes/rules, then a fast classifier per modality (~1% pass), then heavy multimodal models including an LLM classifier, then human review (~0.1%); it filters for risk, not relevance, and only a strong hash match or very high heavy score removes before review.
- `#L292-L367` — Part 4: the action ladder — auto-allow, reduce or age-gate (borderline "lawful but awful"), human review, auto-remove; two thresholds per harm category plus a borderline score; thresholds set with Trust and Safety and Legal per region.
- `#L368-L376` — Part 4: thresholds are policy, not statistics — no dollar figure exists, the precision-recall curve only shows the trade-off, and a policy engine stores each threshold as category/region configuration.
- `#L377-L424` — Part 5: when each check runs (hashes/classifier before live, heavy models seconds after, review from the queue); the review queue orders by uncertainty × reach and reserves capacity for prevalence sampling, appeals, and old low-reach items.
- `#L425-L491` — Part 5: follow the meme — hashes miss it, the fast classifier flags harassment and the post goes live but reduced, the heavy model scores 0.6 (between thresholds), the queue promotes it, and a reviewer removes it at 7:40 PM; appeals and reviewer decisions become labels.
- `#L492-L501` — Part 5: reach-aware routing — re-score with heavy models at view tiers (10K, 100K, 1M); uncertain high-reach posts jump the queue; measure time to action since the model can miss twice.
- `#L502-L513` — Part 5: appeals are an ethical and legal requirement and the best false-positive labels; fail open or fail closed per category and surface, chosen in advance.
- `#L514-L530` — Part 6: keep it working — daily label feeds, weekly retraining with extra weight on recent evasion, hashes updated in minutes; three gates (backtest, shadow, canary); a flag drop is treated as a possible attack.
- `#L531-L547` — Part 6: a brand-new harm carried by rules and review, with LLM-classifier policy text updated without retraining; a batch job re-scores old posts when policy changes; reviewer care limits graphic exposure and checks consistency with seeded test items.
- `#L548-L579` — Part 7: costs — the funnel costs ~11 units versus ~1,000 for one heavy model on everything (heavy is 1,000x per item and runs on 1%); the fast-stage pass rate is the compute knob; human review at 0.1% is 200,000 decisions/day, about 800 shifts; failure ledger (viral miss, over-removal, evasion wave, outage).
- `#L580-L597` — In the interview: the 30-second answer plus follow-ups on catching a viral post, a never-seen harm, and why the heavy LLM classifier stays affordable.
- `#L598-L605` — Same design, other questions: spam detection for DMs (behavioral and graph signals) and review abuse in a food-delivery app (smaller scale, one text classifier plus review).
- `#L606-L624` — Common mistakes: one big classifier over everything, counting uploads instead of views, yes-or-no decisions, letting engineering set the lines, and forgetting appeals.
- `#L625-L636` — Key takeaways: three complications on top of fraud, prevalence with a false-removal guardrail, the risk funnel and policy thresholds, uncertainty × reach queue, and the pass rate/headcount/viral-miss trio.
- `#L637-L658` — Lesson 25 vocabulary: connection graph, mutual connection, topology, triangle closing, affiliation, imported contacts, impression discounting, idempotent, fail soft/closed.
- `#L659-L668` — The exercise: design People You May Know for a 900M-member professional network in about 40 minutes using the seven framework steps; reference answer follows with the viewer Ana.
- `#L669-L690` — Part 1: frame — a recommendation where items are people; the funnel transfers, but two things make it harder (a two-sided goal, and a bad suggestion can be a privacy incident); social-cost asymmetry named unprompted; scope excludes email, job, and invite flows.
- `#L691-L702` — Part 2: the trap in acceptance rate — it can be gamed by easy, low-value reconnections that never lead to messages, so it hides an empty network gain.
- `#L703-L744` — Part 2: three metric layers — primary is accepted invites per member, guardrails are ignore/report (receivers) and dismiss (viewers), north star is downstream network value weeks later; 200 ms load target and ~1,700 requests/s.
- `#L745-L750` — Part 2: latency and scale — ~300M members active in 30 days, ~150M module loads a day, a KV store absorbing the load.
- `#L751-L787` — Part 3: topology is the strongest signal — triangle closing suggests two members sharing mutual connections; strength is not just the count, since a hub with 30,000 connections is weak evidence.
- `#L788-L845` — Part 3: the four candidate sources — triangle closing (strong, heavy), imported contacts (highest precision, heaviest privacy), affiliations (works with no graph, weak alone), embeddings (finds what others miss); ~500 candidates for Ana.
- `#L846-L867` — Part 3: the imported-contacts tradeoff (strict consent, deletion, never revealing a number, never suggesting two members only because they uploaded the same third number); labels arrive at different delays and the ranker waits a 14-day window; privacy state is read by the filter, not used for prediction.
- `#L868-L921` — Part 4: baseline is triangle closing ranked by mutual connections; the ranker predicts P(send) × P(accept), so both must be calibrated; the worked case shows a former teammate (0.10 × 0.60) beating a chief executive (0.30 × 0.05); features are the pair, the viewer, and the candidate, typically two gradient-boosted trees.
- `#L922-L992` — Part 4: the rule layer (impression discounting, exposure caps, source variety); the whole funnel — four sources to ~500 candidates, privacy filter before ranking, ~10 suggestions on screen, top 200 stored.
- `#L993-L1068` — Part 5: precompute — a nightly job ranks and stores the top 200 per active member in a KV store, a streaming job applies dismissals, blocks, connections, and uploads within seconds; batch fails soft (yesterday's lists) while the privacy filter fails closed.
- `#L1069-L1108` — Part 5: one request step by step — one KV lookup, the privacy filter, impression discounting and caps, then names/photos/headlines, about 60 ms inside the 200 ms target.
- `#L1109-L1128` — Part 5: dismissals removed within seconds and added to a lasting "never suggest again" list; new members get a starter list from contacts and affiliations; the privacy filter runs at retrieval (both nightly and per request) and logs every exclusion for audits.
- `#L1129-L1159` — Part 5: fail soft vs fail closed explained (a blank module beats a degraded one); capping friends-of-friends (100 strongest connections, 30-day activity scope, sample hubs); making the nightly job idempotent with date-keyed writes, a fixed graph snapshot, and a fixed seed.
- `#L1160-L1198` — Part 6: keep it working — rich-get-richer traps (exposure caps, honest exploration), segregation amplification (monitor cross-cluster rate), A/B tests that guardrail both senders and receivers with a holdback group, and weekly retraining behind offline, shadow, and A/B gates.
- `#L1199-L1234` — Part 7: costs — the nightly graph pipeline (~50,000 paths × 300M members ≈ 15 trillion steps) dominates, plus streaming, ~1 TB KV per run, weekly training, privacy logs, and cheap serving lookups; the 30-day scope keeps it sane.
- `#L1235-L1262` — Part 8: what the capstone reused — the funnel, cold start, and feedback loop (recommendations), guarded primary metric, multiplied calibrated probabilities (ads), fail-closed filtering and honest exploration (fraud); the new part is the two-sided goal and privacy rules.
- `#L1263-L1280` — Part 9: what each level sounds like — mid-level (friends-of-friends, acceptance rate, cache), senior (four sources, batch plus streaming, privacy at retrieval, P(send) × P(accept) unprompted), staff (sequencing, network risks, cost in the nightly job).
- `#L1281-L1298` — Part 10: follow-ups — compute friends-of-friends at 900M scale, A/B test without hurting the network, prove a blocked member never appears, what a brand-new member sees, and adapting to CRM contact suggestions.
- `#L1299-L1313` — Key takeaways (both members must want the edge, accepted invites with guardrails, precompute plus stream, privacy at retrieval and fail closed), then the chapter break into "LLM Serving & Inference".
