---
source: 直播3：AI 编程能写出复杂的基础架构吗（MQ9）
source_type: pdf
source_lines: 757
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 直播3：AI 编程能写出复杂的基础架构吗（MQ9）

## Overview (L1)

- Route — Five segments: relation (open source · infra · AI coding) → boundary (what AI can/cannot write) → RobustMQ (a real open-source infra project) → MQ9 (Agent communication layer design and vision) → closing (where the individual's opportunity lies). Core judgment: complex infrastructure can and should be written with AI, but as a "high-throughput executor", not "fully automated development"; segment ④ (MQ9) is the focus.
- Relation — Open source is the main birthplace of complex infra (Kafka/Redis/K8s grew from communities); infra is the highest-threshold layer, previously untouchable by individuals; AI coding changes not typing speed but the production mode of this layer, and open source is its most natural carrier and proving ground.
- Core thesis — "Basic software can and should be written with AI; but don't treat it as fully automated development — treat it as a high-throughput executor." The barrier is lowering but hasn't vanished: it has migrated from coding itself to judgment and system ability. Fully-automated development is a fantasy (models can't give you infra error paths and performance trade-offs); high-throughput executor is reality (you set direction/architecture, it produces, the speed gain is real).
- Real talk — This half-year's progress would be impossible without AI: the storage-layer refactors/rewrites, the test backfill, the ISR pitfalls dug out one by one, and the chaos-drills harness all had AI behind them; but "AI makes you fast, it doesn't think for you — speed is AI's gift, stability is yours to guard."
- Boundary · three layers — (1) cannot err (core layer: storage, concurrency control, protocol implementation — human-led, AI assists); (2) can be fast (implementation layer: boilerplate, repetitive refactors, tests, docs, refactor drafts — AI does the bulk); (3) must verify (convergence layer: review, tests, chaos drills — human final acceptance). Who sets boundaries, trades off, and covers production cannot be outsourced.
- AI-good — Docs/blogs/web, SDKs/integrations/plugins, test backfill, repetitive refactors/refactor drafts, reading unfamiliar code/lookup — "except the MQ9 kernel that needs careful polishing, we do almost everything with AI assistance."
- AI-bad — Architecture/design (the soul), storage layer, concurrency control, protocol implementation, performance-critical paths, and hard bug fixes; typical AI symptoms: cloning everywhere, Arc<Mutex> everywhere, unwrap_or_default everywhere. "AI can write 'usable' code, but infrastructure needs 'elegant' code"; it's a responsibility issue — you must be able to explain core code line by line.
- Reverse usage — Don't have it write, have it check: boundary conditions, panic risks, resource release, and dual-model cross-check (one generates tests, another reviews); a tireless reviewer while you keep ownership.
- AI as challenger — More valuable: make AI a skeptic that forces you to speak clearly — a skeptical infra engineer, four roles reviewing one design (infra expert / frontline developer / algorithm expert / another Agent), asking the sharpest questions; it forced out "MQ9's biggest risk isn't technical implementation or competitors, it's timing" — a judgment hard to reach alone; sometimes answers overturn your assumptions.
- Risk — AI is an amplifier, not a replacement; the biggest risk is losing technical intuition from not writing core code long-term, which is fatal in infra (error paths and performance trade-offs depend on intuition); so writing the core oneself is maintaining judgment. Trade-off: use AI for "quantity", keep yourself for "quality".
- RobustMQ — A Rust multi-protocol unified message engine: single binary, zero external dependencies, one unified storage underneath; native protocols MQTT/Kafka/AMQP/NATS with MQ9 as the fifth protocol layer; 0.4.0 had four protocols working and MQ9's first kernel, now 0.4.7; H2 plans semantics interception/audit, Kafka protocol, S3 storage. Ambition: IoT devices → big data platform → AI Agents via one storage, many protocol views.
- Key trade-off — Don't invent a new protocol: MQTT/Kafka/NATS/AMQP are already internalized in LLM training corpora (near-zero adoption cost); inventing a new abstraction is dangerous (nobody knows it, no ecosystem, AI can't write it). MQ9 builds on NATS without new wire protocol commands — any NATS client connects. Text protocol, Subject hierarchical routing, existing ecosystem, AI-native friendliness, official 9-language SDK + 30+ community.
- Architecture — Unified storage + multi-protocol layer; storage in three tiers: Memory (realtime, fastest, no disk), RocksDB (reliable, local persistence), File Segment (replay, large capacity); principle: store-first delivery — persist before push, persistence is the default, not optional.
- Chaos testing — AI-driven closed loop: auto-deploy cluster → inject faults → run multi-language SDK tests → analyze logs → generate report; "no hardcoded execution flow, no Python scheduling logic, AI drives everything", and the system is entirely implemented by Claude Code; 26 scenarios (MQTT 13 + MQ9 13 across basic/fault/client-exception/combination), P0 every 2h / P1 nightly / P2 weekly, first phase compressed from estimated 4–6 weeks to 1–2 weeks; the truly hard part is the scenario library as continuous input — "harder than writing code."
- MQ9 scenario — A research Agent receives a task, splits it into subtasks, dispatches to search Agents; across 3 hours it spawns new tasks, retries failures, and streams partial results; the main Agent mostly waits. What carries this cross-hour, failure-prone, retry, many-to-many communication? HTTP can't, Kafka wasn't designed for it; the hard part is state and identity, not throughput.
- Existing solution gaps — HTTP sync (both must be online, hours → timeout, faults propagate), SSE (disconnects lose data, no redelivery), Webhook (fire-and-forget, no delivery guarantee), raw Kafka/NATS (must assemble topic + consumer group; core abstraction isn't Agent identity); the shared gap: no layer treats "Agent identity + offline reachability + reliable delivery" as the default.
- MQ9 what — The AI Agent communication layer whose core abstraction is mailbox: MQ9 Broker (protocol-agnostic reliable message pipe: durable mailbox, registry, N-to-N topology) and MQ9 SDK (light wrapper supporting A2A and custom protocols); analogy — mem0 fills the memory layer, MQ9 fills the message layer.
- Pipeline vs mailbox — Traditional MQ = pipeline: topic/subject anonymous and neutral, core metric throughput/order, "send to topic, whoever gets it gets it", consumers assumed online. MQ9 = inbox: mailbox belongs to one Agent, mail_address is identity, "A sends to B" with offline delivery as default, core is identity/state not throughput. The intuition: Agent-to-Agent communication should be as simple as email, and email has run for decades on the "inbox" abstraction.
- Protocol design — subject pattern as API: no new wire commands, all carried by NATS PUB/SUB + JSON (borrowing JetStream's $JS.API.* idea); addressing is subject — $mq9.AI.MAILBOX.CREATE, $mq9.AI.MAILBOX.{id}, $mq9.AI.PUBLIC.LIST; mailbox/message (CREATE, SEND/FETCH/ACK, QUERY/DELETE) and registration/discovery (AGENT.REGISTER/UNREGISTER, AGENT.DISCOVER, AGENT.REPORT); any of 8-language NATS clients connect directly and auth reuses NATS (token/JWT/nkey).
- Design trade-offs — Deliberately not done: three priorities (critical/urgent/normal, strictly ordered within, not across), idempotency as capability not promise (dedup_id provided, exactly-once doesn't exist), two-level TTL (mailbox + message expire_at), no message sharding (reject over limit e.g. 10MB), mail_address as credential (multi-tenancy at connection layer, protocol unaware). Logic: simple runs long, complex crushes itself first.
- Registration & discovery — The foundation: AGENT.REGISTER registers identity and capabilities, AGENT.DISCOVER finds on demand; four retrieval modes (key, tag, full-text, semantic/vector); SearchEngine is a new RobustMQ module; LanceDB (pure-Rust embedded, vector + full-text Tantivy BM25), fastembed-rs with default BGE-small (130MB, 384-dim), async indexing so index failure doesn't affect the main write path.
- Three value standards — Light (A2A Agent goes from 60 lines to 15, half-hour closure), stable (no message loss, doesn't drag down the business), open (100% compatible with a2a-sdk, protocol-unbound, coexists with Kafka/RabbitMQ); boundaries clear: enter only four vacuums — Agent discovery, reliable async transport, monitoring/tracing, protocol-neutral infra; don't do protocols, orchestration, frameworks, or an all-in-one suite.
- Shifted assumption — The changed assumption is "endpoint": old endpoints are devices (dumb, cheap, replaceable, stable/deterministic, difficulty in the data plane/throughput); new endpoints are intelligent agents (smart, expensive, ephemeral/uncertain, difficulty in the control plane/order). Two corollaries: the bottleneck moves from moving data on one channel to managing the existence/state/location of massive endpoints (millions, each with tiny traffic); discovery/reliability/tracing/control responsibilities get pushed from the app layer back into infrastructure.
- Four things & status — discovery (Agent finds Agent), durable mailbox (receive offline), correlation (full-chain tracing), identity + interception; first two are foundations, last two are hard because the broker must understand flowing not bytes but "a stateful thing an Agent is doing that needs constraint." Honest note: "every step from endpoint change to these corollaries is still an assumption, not a conclusion; we're betting on direction." Current state: first kernel, registration/discovery, a2a over mq9 exploration, semantic retrieval groundwork exist; usable: 8-language NATS clients, langchain-mq9, demo server; in progress: MCP Server (tech plan), SDK (~2000 lines Python, 4–6 weeks); broker is the main body and moat, SDK is the last link.
- Open-source closing, individual paths, takeaways — AI coding lowers output cost → small teams can finally touch complex infra → open source is the natural carrier/proving ground; "in the AI coding era, more people isn't necessarily an advantage" (more people = more communication/coordination friction); what's scarce is "the drive to figure things out and build." Four realistic individual paths: read one mature component's core path, start with the scenario library (low threshold, high value, harder than code), take ecosystem work (SDK/integration/plugin), then touch the kernel — skipping step 1 usually yields a toy. Takeaways: use AI as high-throughput executor; the three layers; the reverse usage; MQ9's key is inbox not pipeline (identity/state over throughput); the endpoint assumption changed, pushing responsibilities back to infra. Three days connect: Day 1 Agent layer, Day 2 component layer (Loop Engineering/OPC), Day 3 infra layer (MQ9).

## Sections (L2)

### three-things
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#three-things]]`
- Summary: Connects open source (birthplace of complex infra), infrastructure (highest-threshold layer, previously untouchable by individuals), and AI coding (changes the production mode of this layer, not typing speed); open source is the natural carrier and verification ground.
- Key claims: AI coding lowers the cost of output so small teams can finally touch complex infra; tonight covers judgment, boundaries, and a component in progress — not tools.
- Learner-relevant: The framing of the whole session.

### core-thesis
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#core-thesis]]`
- Summary: "Basic software can and should be written with AI, but as a high-throughput executor, not fully automated development"; the barrier hasn't vanished but migrated from coding to judgment and system ability.
- Key claims: Fully-automated development is a fantasy (infra error paths/performance trade-offs aren't model-given); high-throughput executor is reality (you set direction/architecture, it produces).
- Learner-relevant: The session's central stance.

### real-talk
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#real-talk]]`
- Summary: Without AI a small team could not have made this half-year's progress — storage refactors, test backfill, ISR pitfalls, and the chaos-drill harness all had AI behind them.
- Key claims: "AI makes you fast, it doesn't think for you; speed is AI's gift, stability is yours to guard."
- Learner-relevant: A concrete, honest productivity accounting.

### boundary-three-layers
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#boundary-three-layers]]`
- Summary: Three layers: cannot-err core (storage/concurrency/protocol — human-led, AI assists), can-be-fast implementation (boilerplate/refactors/tests/docs — AI bulk), must-verify convergence (review/tests/chaos — human final acceptance).
- Key claims: Who sets boundaries, trades off, and covers production cannot be outsourced.
- Learner-relevant: The division-of-labor model for AI in infra.

### ai-good
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#ai-good]]`
- Summary: In infra projects AI handles docs/blogs/web, multi-language SDKs/integration/plugins, test backfill, repetitive refactors/refactor drafts, and reading unfamiliar code/lookup.
- Key claims: "Except the MQ9 kernel that needs careful polishing, almost everything is done with AI assistance"; these tasks are large but pattern-clear, with drastically lower entry cost to a new domain.
- Learner-relevant: The concrete AI-delegable task set.

### ai-bad
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#ai-bad]]`
- Summary: Must-do-yourself: architecture/design, storage layer, concurrency control, protocol implementation, performance-critical paths, hard bug fixes; typical AI symptoms are clone-everywhere, Arc<Mutex>-everywhere, unwrap_or_default-everywhere.
- Key claims: AI can write "usable" code but infra needs "elegant" code; letting it write the core for speed costs later; it's a responsibility issue — you must explain core code line by line.
- Learner-relevant: What must stay human and why.

### reverse-usage
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#reverse-usage]]`
- Summary: "I don't have AI write code, I have it check code" — boundary conditions, panic risks, resource release, and dual-model cross-check (one generates tests, another reviews).
- Key claims: You keep core-code ownership while gaining a tireless reviewer.
- Learner-relevant: A high-leverage pattern for human-led core code.

### ai-as-challenger
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#ai-as-challenger]]`
- Summary: Make AI a skeptic forcing clarity: a skeptical infra engineer, four roles reviewing one design (infra expert/frontline developer/algorithm expert/another Agent), each poking holes and producing actionable revisions.
- Key claims: It forced out "MQ9's biggest risk isn't technical implementation or competitors, it's timing" — a judgment hard to reach alone; sometimes the answer overturns your assumptions.
- Learner-relevant: Using AI as a design adversary, not just an implementer.

### risk-amplifier
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#risk-amplifier]]`
- Summary: AI is an amplifier, not a replacement; the biggest risk is losing technical intuition from long-term non-writing, which is fatal in infra where error paths and performance trade-offs depend on intuition.
- Key claims: Writing the core oneself is not stubbornness but maintaining judgment; the trade-off is AI for "quantity", yourself for "quality".
- Learner-relevant: The long-term competence risk of over-delegation.

### robustmq-intro
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#robustmq-intro]]`
- Summary: RobustMQ is a Rust multi-protocol unified message engine: single binary, zero external deps, one unified storage; native protocols MQTT/Kafka/AMQP/NATS with MQ9 as the fifth layer; 0.4.0 four protocols working + MQ9 first kernel, now 0.4.7; H2 plans semantics interception/audit, Kafka protocol, S3 storage.
- Key claims: Ambition: IoT devices → big data platform → AI Agents, one storage with multi-protocol views.
- Learner-relevant: The real project context for the AI-coding claims.

### no-new-protocol
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#no-new-protocol]]`
- Summary: Deliberately avoids inventing a new protocol — MQTT/Kafka/NATS/AMQP are already internalized in LLM training corpora (near-zero adoption cost); a new abstraction is dangerous (no one understands it, no ecosystem, AI can't write it); MQ9 builds on NATS without new wire commands so any NATS client connects.
- Key claims: Benefits — text protocol, Subject hierarchical routing, existing ecosystem, AI-native friendliness, official 9-language SDK + 30+ community; in the AI era, "whether models can write your protocol" is itself an ecosystem advantage.
- Learner-relevant: A design principle for protocol-era AI systems.

### architecture
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#architecture]]`
- Summary: Unified storage + multi-protocol layer; storage three tiers — Memory (realtime, no disk), RocksDB (reliable, local persistence), File Segment (replay, large capacity); principle: store-first delivery (persist before push; persistence is the default).
- Key claims: The architecture is chosen so persistence is built in rather than optional.
- Learner-relevant: The storage-tier model behind RobustMQ.

### chaos-testing
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#chaos-testing]]`
- Summary: An AI-driven chaos-testing closed loop (auto-deploy → inject faults → multi-language SDK tests → log analysis → report) with no hardcoded flow or Python scheduling, entirely implemented by Claude Code; 26 scenarios, P0 every 2h/P1 nightly/P2 weekly, first phase compressed from 4–6 weeks to 1–2.
- Key claims: The truly hard part is the scenario library as continuous input — "harder than writing code."
- Learner-relevant: A flagship AI-driven engineering artifact and the value of scenario libraries.

### mq9-scenario
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#mq9-scenario]]`
- Summary: A research Agent splits a task into subtasks dispatched to search Agents; over 3 hours it spawns new tasks, retries failures, and streams partial results while the main Agent mostly waits.
- Key claims: HTTP can't carry this and Kafka wasn't designed for it; the hard part is state and identity, not throughput (each Agent's traffic is tiny).
- Learner-relevant: The motivating use case for an Agent communication layer.

### existing-solutions
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#existing-solutions]]`
- Summary: Four paths each fall short — HTTP sync (both online, hours → timeout, fault propagation), SSE (disconnect loses data, no redelivery), Webhook (fire-and-forget, no guarantee), raw Kafka/NATS (assemble topic + consumer group; core abstraction isn't Agent identity).
- Key claims: The shared gap: no layer treats "Agent identity + offline reachability + reliable delivery" as the default.
- Learner-relevant: The problem statement justifying MQ9.

### mq9-what
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#mq9-what]]`
- Summary: MQ9 is the AI Agent communication layer whose core abstraction is mailbox: MQ9 Broker (protocol-agnostic reliable pipe with durable mailbox, registry, N-to-N topology) + MQ9 SDK (light wrapper supporting A2A and custom protocols).
- Key claims: Analogy — mem0 fills the memory layer, MQ9 fills the message layer, the layer Agent collaboration should have by default.
- Learner-relevant: What MQ9 is in one page.

### pipeline-vs-mailbox
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#pipeline-vs-mailbox]]`
- Summary: Traditional MQ = pipeline (anonymous topics, throughput/order, "whoever gets it gets it", consumers assumed online) vs MQ9 = inbox (mailbox belongs to one Agent, mail_address is identity, "A sends to B" with offline delivery default, identity/state over throughput).
- Key claims: The intuition is that Agent communication should be as simple as email, which has run for decades on the inbox abstraction.
- Learner-relevant: The single most important mental-model page.

### protocol-design
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#protocol-design]]`
- Summary: subject pattern as API — no new wire commands, all carried by NATS PUB/SUB + JSON (borrowing JetStream's $JS.API.*); addressing is subject ($mq9.AI.MAILBOX.CREATE, $mq9.AI.MAILBOX.{id}, $mq9.AI.PUBLIC.LIST); mailbox/message and registration/discovery methods.
- Key claims: Any of 8-language NATS clients connects directly and auth reuses NATS (token/JWT/nkey).
- Learner-relevant: How the "no new protocol" principle becomes a concrete API surface.

### design-tradeoffs
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#design-tradeoffs]]`
- Summary: Deliberately not done: three priorities (critical/urgent/normal, strict order within, not across), idempotency as capability not promise (dedup_id; exactly-once doesn't exist), two-level TTL (mailbox + message expire_at), no sharding (reject over ~10MB), mail_address as credential (multi-tenancy at connection layer).
- Key claims: The logic: simple runs long, complex crushes itself first.
- Learner-relevant: Trade-off reasoning for a new infra component.

### registration-discovery
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#registration-discovery]]`
- Summary: AGENT.REGISTER registers identity/capabilities; AGENT.DISCOVER finds on demand via four modes (key, tag, full-text, semantic vector); SearchEngine is a new RobustMQ module with LanceDB (pure-Rust embedded, vector + Tantivy BM25), fastembed-rs (BGE-small default, 130MB, 384-dim), and async indexing.
- Key claims: Index failure doesn't affect the main write path.
- Learner-relevant: The discovery foundation and its AI-native (semantic) retrieval.

### three-value-standards
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#three-value-standards]]`
- Summary: Light (A2A Agent drops from 60 lines to 15, half-hour closure), stable (no loss, doesn't drag the business), open (100% a2a-sdk compatible, protocol-unbound, coexists with Kafka/RabbitMQ).
- Key claims: Boundaries: enter only four vacuums (Agent discovery, reliable async transport, monitoring/tracing, protocol-neutral infra) and do not do protocols, orchestration, frameworks, or an all-in-one suite.
- Learner-relevant: The value proposition and explicit non-goals.

### shifted-assumption
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#shifted-assumption]]`
- Summary: The changed assumption is "endpoint": devices (dumb, cheap, replaceable, stable; difficulty in the data plane/throughput) → intelligent agents (smart, expensive, ephemeral/uncertain; difficulty in the control plane/order).
- Key claims: Corollaries — the bottleneck moves from moving data to managing existence/state/location of millions of tiny-traffic endpoints, and discovery/reliability/tracing/control get pushed from the app layer back into infrastructure.
- Learner-relevant: The deep thesis explaining why an Agent message layer must exist.

### four-things-status
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#four-things-status]]`
- Summary: Four things MQ9 does: discovery and durable mailbox (foundations), correlation and identity + interception (hard, requiring the broker to understand a stateful constrained thing, not bytes); current state: first kernel, registration/discovery, a2a over mq9 exploration, semantic retrieval groundwork; usable: 8-language NATS clients, langchain-mq9, demo server; in progress: MCP Server, SDK (~2000 lines Python, 4–6 weeks).
- Key claims: Honesty — every step from the endpoint change to these corollaries is still an assumption, not a conclusion; broker is the main body and moat, SDK is the last link.
- Learner-relevant: An honest status snapshot and the "assumption, not conclusion" epistemics.

### open-source-closing
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#open-source-closing]]`
- Summary: AI coding lowers output cost → small teams can finally touch complex infra → open source is the natural carrier and proving ground; "in the AI coding era, more people isn't necessarily an advantage"; what's scarce is "the drive to figure things out and build."
- Key claims: More people means more communication/coordination friction, not necessarily more output.
- Learner-relevant: The opportunity thesis for individuals and small teams.

### individual-paths
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#individual-paths]]`
- Summary: Four realistic paths: read one mature component's core path, start with the scenario library (low threshold, high value, harder than code), take ecosystem work (SDK/integration/plugin), then touch the kernel.
- Key claims: Skipping step 1 and writing the kernel usually produces a toy.
- Learner-relevant: A concrete entry path into complex infra.

### takeaways
- Locator: `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf#takeaways]]`
- Summary: Five takeaways — use AI as a high-throughput executor (not fully automatic); three layers (core human-led, implementation AI-bulk, convergence human-verified); the reverse usage (have AI check, challenge, multi-role review); MQ9's key is inbox not pipeline (identity/state over throughput); the endpoint assumption changed, pushing responsibilities back to infra.
- Key claims: Three days connect as three layers — Day 1 Agent layer, Day 2 component layer (Loop Engineering/OPC), Day 3 infra layer (MQ9).
- Learner-relevant: The compact close and the three-day synthesis.

## Sources

- `[[sources/geek-ai-agent/20260922/直播3：AI 编程能写出复杂的基础架构吗（MQ9）.pdf]]`
