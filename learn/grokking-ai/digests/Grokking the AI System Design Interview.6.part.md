---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.6.part.txt
source_type: text
source_lines: 1643
part: 6
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 18 — Introduction: Classic ML Design Questions — The six recurring questions reduce to a ranking funnel (retrieve judged on recall, rank on precision at the top, then rules) or a judging chain (cheap checks, model score, action thresholds). A 50M-video homepage narrows to 20 items in 200 ms before labels train the next ranker.
- Lesson 19 — Design a Recommendation System — Builds the full funnel for 50M videos and 100M daily users: two-tower ANN, co-occurrence, and non-personalized retrieval, a gradient-boosted ranker, and rule re-ranking. Covers the two impression-label flaws, position bias, cold start, the proxy trap, fail-soft serving, and costs (25.6 GB of vectors, ~1.75M scores/s).
- Lesson 20 — Design Feed Ranking — Transfers the funnel to a social feed where candidates are social (fan-in, spillover, suggestions), "good" is plural (multi-task heads plus product-owned value weights), and integrity sits inside ranking. Uses a distilled light ranker, heavy multi-task model, once-per-post integrity scores, push/pull/hybrid fan-out, and ~86,800 ranking calls/s.

# L2 detail

- `#L1-L18` — Lesson 18 vocabulary: funnel, candidate generation, rule layer, precision at the top, impression, position bias, adversary; why the classic questions repeat.
- `#L19-L36` — Part 1: the six questions (recommendations, feed, search, ads, fraud, harmful content) are all predictive systems, so recognize the known design and spend time on what is new; a strong answer opens with scale and time limit.
- `#L37-L123` — Part 2: the two shapes. Ranking is retrieve → rank → rules (recall, then precision at the top); judging is cheap checks → model score → action policy. Both put cheap work first and differ only in input (many items vs one event).
- `#L124-L212` — Part 3: one video home-page request. 50M videos → ~500 candidates in ~35 ms (ANN, co-occurrence, trending) → top ~50 by ~80 ms → 20 shown by ~85 ms; impressions are logged, outcomes arrive minutes later, and nightly jobs retrain the ranker and rebuild the index.
- `#L213-L246` — Part 4: what each design adds — cold start and position bias (recommendations), many goals (feed), the query (search), a price and calibration (ads), an adversary and late labels (fraud), harm in two directions (content), and a two-sided goal (capstone).
- `#L247-L319` — Part 5: maps all seven framework steps onto a ranking example (recommendations) and a judging example (fraud), from framing and success metrics through serving, monitoring, and cost.
- `#L320-L334` — Part 6: what later lessons reuse — the funnel in hybrid search and reranking, the ANN index for text embeddings, and layered guardrail checks from fraud and content safety.
- `#L335-L362` — Part 7: six mistakes — designing from scratch, running one model over every item, judging every stage by one number, treating clicks as truth, forcing yes/no decisions, and quoting accuracy on rare events.
- `#L363-L373` — Key takeaways: name the known design, give scale and time limit, name the shape, and spend most of the time on what is new.
- `#L374-L392` — Lesson 19 vocabulary: recommendation system, catalog, engagement, re-ranking, co-occurrence, Recall@K, AUC; the running user who watched three cooking videos.
- `#L393-L473` — Part 1: frame with 50M videos, 100M daily users, and a ~200 ms budget; one model cannot score everything, so the funnel is 50M → ~500 candidates → ~50 ranked → 20 on screen, illustrated by the hiring analogy.
- `#L474-L535` — Part 2: define success — online truth is watch time and next-day return rate, engagement is the minutes-later proxy; per-stage offline metrics are Recall@K for retrieval, AUC and precision near the top for ranking; offline wins earn an A/B test with guardrails.
- `#L536-L593` — Part 3: map the data — impressions become positive (watched ≥30 s) or negative labels; the two flaws are shown-only coverage and position bias; features split into user, video, and user-video groups with different freshness needs.
- `#L594-L643` — Part 4: baseline is "most popular plus recent"; three candidate sources (two-tower embeddings in an ANN/HNSW index, nightly co-occurrence, non-personalized trends), a gradient-boosted tree ranker, and rules for diversity, freshness, policy, and editorial pins kept outside the model.
- `#L644-L761` — Part 5: serving path with times — user state ~10 ms, user vector ~15 ms, three sources ~35 ms, batched ranker ~80 ms, rules ~85 ms, then logging. Explains why candidates are computed per request, plus fail-soft fallbacks (stale index, popularity order, cached trends).
- `#L762-L852` — Part 6: three update speeds (session seconds, embeddings nightly, ranker daily), cold start for new users and new videos (content features, explore boost, mid-day index insert), two fixes for position bias (position as a fixed serving feature, propensity weighting), the proxy trap, the feedback loop, and shadow testing a fourth source.
- `#L853-L872` — Part 7: costs — 128 floats × 4 bytes × 50M videos ≈ 25.6 GB of raw vectors plus index; 300M requests/day ≈ 3,500 rps average (7,000 peak) and ~1.75M scores/s, plus ~6B impression rows/day.
- `#L873-L893` — Part 8: the 30-second spoken answer plus follow-ups on why not one model, why a feed feels boring when recall is fine, and how the design adapts to "customers also bought".
- `#L894-L910` — Part 9: four mistakes — opening with the model, one metric for the funnel, treating clicks as truth, and putting rules inside the model.
- `#L911-L921` — Key takeaways: scale forces the funnel (500 → 50 → 20), each stage has its own metric, correct impression labels, update at three speeds, and fail soft.
- `#L922-L949` — Lesson 20 vocabulary: feed, fan-in/fan-out, engagement event, dwell time, negative event, P(event), multi-task model, value formula, integrity layer, distillation, micro-batching; the user Maya.
- `#L950-L984` — Part 1: frame — the funnel transfers, so focus on three changes: the candidate pool is social (a few thousand posts), "good" is plural, and integrity sits inside ranking. Scale is 500M users, 5 sessions/day, 3 ranking calls/session, under 200 ms.
- `#L985-L1013` — Part 2: define success — primary metric is daily sessions per user, with hide rate and report rate as vetoing guardrails; daily surveys label P(worthwhile); offline checks are per-head AUC and probability reliability.
- `#L1014-L1074` — Part 3: map the data — candidates come from fan-in (~1,500 for Maya), spillover (~300), and suggestions (~200), about 2,000 total; positive and negative events are listed; negative events are rare and deliberate, so they get extra weight and a rescale after up-weighting.
- `#L1075-L1266` — Part 4: model — baseline is chronological or recency × affinity; a shared body with one head per event beats separate models; the value formula weights positive terms and subtracts P(hide) and P(report); product leadership owns the weights and tunes them by A/B test; a worked comparison shows an angry argument losing to a trip photo.
- `#L1267-L1466` — Part 5: serving path — ~2,000 candidates in ~30 ms, distilled light ranker to 500 in ~20 ms, heavy multi-task model in ~60 ms, value formula, then integrity layer (bait demotion, author caps, variety, lasting "see less"), ~120 ms total. Includes push/pull/hybrid fan-out and computing integrity scores once per post.
- `#L1467-L1539` — Part 6: keep it working — three loop speeds (session seconds, per-post minutes, model daily), ranking a 10-second-old post with author/content features and a fresh boost, the feedback drift toward bait, and four defenses plus holdback groups; tag degraded sessions.
- `#L1540-L1587` — Part 7: costs — 7.5B ranking calls/day ≈ 86,800/s average (174,000 peak), ~43.4M heavy and ~174M light scores/s; three tools (distilled first pass, micro-batching, feature caching) and a failure ledger.
- `#L1588-L1607` — In the interview: the 30-second answer and follow-ups on chronological feeds, 10-second-old posts, and why one metric is not enough.
- `#L1608-L1615` — Same design, other questions: notification ranking (adds a strong P(annoy) term because fatigue dominates) and a "Following" tab (retrieval collapses to fan-in, ranking near-recency).
- `#L1616-L1631` — Common mistakes: rebuilding the funnel from scratch, ranking on one score, hiding the weights inside the model, and treating integrity as someone else's problem.
- `#L1632-L1643` — Key takeaways: the funnel transfers, the model predicts and product owns the weights, weight negative events, and at ~86,800 calls/s use distillation, micro-batching, caching, and once-per-post integrity scores.
