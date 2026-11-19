---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.23.part.txt
source_type: text
source_lines: 1686
part: 23
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 62 · System Design of an AI Meeting Assistant — Three subsystems with different latency regimes sharing one data spine (the meeting record): a real-time streaming-ASR lane for captions in 1–2 seconds, an async queued workflow for the post-call summary and action items within 10 minutes, and a RAG archive lane answering past-meeting questions in about 2 seconds. The design puts consent machinery in scope as a hard product gate, names the signature embarrassment as an action item with the wrong owner, and grades each lane separately (WER and speaker attribution; a judge plus a human anchor offline and edit-rate online; owner accuracy and reassignment-rate; retrieval recall and faithfulness). It follows a 90-minute meeting: device streams give speakers free while only the shared room mic needs diarization, map-reduce handles long transcripts in about 10-minute chunks, action items link back to their source moment, the post-call path is a fixed workflow rather than an agent, one access rule built from attendance serves both delivery and search, the queue absorbs the comb-shaped load so late never means wrong, and transcription minutes (about $1 million a week) dominate the bill.

- Lesson 63 · System Design of a Text-to-Image Product at Scale — The image job queue with cost moved to the front because the interviewer says "I care about the bill". The clock shifts the fleet math to minutes 3–7: about 2 million images a day (about 25 a second, about 250 busy GPUs, about 500 at peak, roughly $45,000 a day once headroom and warm pool are counted). Success is three product numbers (images kept per session, wait time by tier, safety incident rate) plus utilization as the fleet number; data is a short prompt rewritten by an enhancer, a replayable job record, and the four-image grid as free but noisy preference labels. The design picks a four-model portfolio by tier and surface at enqueue time, runs a prompt gate before enqueue and an image gate before display (both fail closed), makes the queue do three jobs (pricing model, autoscaling signal, wait-time UX), sets the free promise from leftover capacity, uses long-lived workers, idempotency keys, a dead-letter queue, and pulls cost levers in order (batching, warm pools, quality dials, free-tier queue stretch).

# L2 detail

- `#L1-L36` — Lesson 62 vocabulary and the question: 5 million meetings a week, live captions, post-call summary, questions across past meetings.
- `#L37-L174` — Part 1: three clocks in one question, the three-subsystem recognition sentence, the subsystems' known systems and changes, and the data spine with its ACL, retention, and consent fields.
- `#L175-L208` — Part 2: scope and parked features (live translation and coaching), consent as a hard gate per jurisdiction, and the signature embarrassment (an action item with the wrong owner).
- `#L209-L309` — Part 3: per-lane metrics — WER with a worked 3-in-7 example and speaker attribution by slice, a judge plus human anchor and edit-rate, owner accuracy and reassignment-rate, retrieval recall versus faithfulness, and the comb-shaped load (about 200 endings a second at a spike).
- `#L310-L407` — Part 4: what the platform already owns (streams, participant list, calendar), device streams versus diarization for a room mic, the label table with delays and costs, and the two free behavioral labels plus privacy rules.
- `#L408-L466` — Part 5: hosted streaming ASR baseline with a custom vocabulary, small-to-mid summary model with map-reduce, structured action items linked to source moments with owner guards, workflow not agent, and archive RAG.
- `#L467-L664` — Part 6: the 90-minute meeting followed through consent, captions, the ended event, the queued job, final transcript, map-reduce, action items and checks, delivery and indexing, then a question three weeks later; the per-arrow table; the queue absorbing the comb; and the two caching rules.
- `#L665-L700` — Part 7: offline gates per lane, online edit-rate and reassignment-rate feeding evals and the summary fine-tune, safe rollout by shadow then canary, and drift signs.
- `#L701-L824` — Part 8: the five-failure ledger (wrong owner, poor audio, backlog, a leak to non-attendees, deletion) with responses, the one access rule shared by delivery and search, tombstone-and-propagate, and the cost ledger where transcription is the volume cost.
- `#L825-L916` — Parts 9–11 plus mistakes and takeaways: follow-ups on live translation, missing decisions, where the money goes, two companies on one call, and a CEO aggregation query; the three levels; three variations; six mistakes; the summary.
- `#L917-L940` — Lesson 63 vocabulary: fleet, tier, scheduler, p90, prompt enhancer.
- `#L941-L1064` — Part 1: the recognition move (image job queue, cost first), why the work must be asynchronous, and the revised clock that moves fleet math to minutes 3–7.
- `#L1065-L1116` — Parts 2 and 3: scope and numeric assumptions, then the four-step fleet math to about 250 busy GPUs, about 500 at peak, and roughly $45,000 a day including headroom and a warm pool.
- `#L1117-L1189` — Parts 4 and 5: the three product numbers and utilization, then data — the prompt enhancer, the replayable job record, and the grid as a free label machine with position bias.
- `#L1190-L1250` — Part 6: diffusion in two sentences (cost grows with steps and resolution), the one-model baseline, the four-model portfolio, and one decision at enqueue time by tier and surface.
- `#L1251-L1463` — Part 7: the request path before any GPU work, priority queues as pricing model and autoscaling signal and wait-time UX, the four-step free-promise calculation, the scheduler, long-lived workers, crash handling with idempotency keys and a dead-letter queue, and the priced arrow table.
- `#L1464-L1511` — Part 8: the prompt gate then image gate order, a gate outage stopping only its lane, the feedback loop on selection data, the red-team suite, false-block tracking, and the fleet dashboard.
- `#L1512-L1595` — Part 9: the four cost levers in order, storage lifecycle rules, the CDN, and the free-queue backlog failure.
- `#L1596-L1686` — Parts 10–12 plus mistakes and takeaways: follow-ups on the free tier, a new model at triple the GPU-seconds, celebrity likenesses, and storage creeping; the three levels; three variations; five mistakes; the summary.
