---
source: sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt
source_type: text
source_lines: 2972
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
part: 2
---

# L1 overview

- Chapter 1 defines the book's core vocabulary: an **LLM application** is the whole software product, while the **LLM agent** is the LLM-driven component inside it that reasons, calls tools, and produces output; the book evaluates the agent level, not the surrounding UI, database, or deployment.
- The opening cautionary case is **Moffatt v. Air Canada (2024)**: a support chatbot hallucinated a retroactive bereavement-fare policy, the airline was held liable after arguing the chatbot was a "separate legal entity," and the chatbot was removed because nobody caught the failure before a customer relied on it. Evaluation is then split into **prelaunch evaluation** and **production monitoring**, which catch different failures since real-world input distributions shift.
- LLM evaluation differs from traditional software testing and traditional ML because outputs are nondeterministic, there is no formal specification, and errors can be "vibes off," plausible-but-wrong, or hard to describe. In traditional ML, outputs are well defined and ground-truth labels support accuracy/F1.
- **Evaluation** is defined as the systematic process of understanding and measuring quality, combining qualitative analysis of failure patterns with quantitative measurement of their frequency. It enters an application four ways: **monitoring**, **guardrails** (in the critical path, able to block/retry/fall back), **improvement mechanisms** (labeled examples, few-shot examples, architectural changes), and **model migration** comparisons.
- The **LLM lifecycle** has three evaluation regimes: **pretraining** (intrinsic, perplexity, scaling laws), **post-training** (supervised fine-tuning, preference pairs, **DPO**, **process reward models**, **RLVR** for long chains of thought, per DeepSeek-AI 2025), and the **application** stage, where the development team owns the definition of success and the metrics.
- The **Three Gulfs** framework (adapted from Shankar et al. 2025, inspired by Norman 1988) names three breakdown points: **Gulf of Comprehension** (developer vs. data), **Gulf of Specification** (developer's intent vs. the instructions given to the LLM), and **Gulf of Generalization** (the data vs. how the LLM actually generalizes to it).
- Each gulf requires a different remedy: comprehension → characterize inputs and outputs at scale; specification → make expectations explicit and tighten prompts/agent logic; generalization → measure failure frequency and apply stronger interventions (more examples, better retrieval, fine-tuning). Stakes and user agency (coding assistant vs. personal stylist) set how much rigor each gulf needs.
- The **Analyze–Measure–Improve** lifecycle is the book's organizing framework: read **traces** and talk to users/domain experts to list failure modes (Analyze), build **evaluators** (code-based rules or LLM-as-judge) to quantify rates (Measure), then fix by source of error (Improve).
- Chapter 2 builds the running example of an **email summarizer** (extract sender name, summarize key requests) using **LiteLLM** as the unified API, and walks components in increasing complexity: single LLM call → conversations → retrieval → tools → agent loops, with autonomy as the cross-cutting design choice.
- Message roles are **system**, **user**, **assistant**, and **tool**; every major provider supports the tool role as of 2026. Nondeterminism is handled by setting `temperature=0` or sampling multiple runs with confidence intervals.
- Retrieval covers **BM25** keyword search (transparent baseline, strong on stable vocabulary like support tickets) and **embedding-based** semantic search, with **hybrid search** using **reciprocal rank fusion (RRF; Cormack et al. 2009)** as the production default; vector databases named are Pinecone, Weaviate, and Qdrant.
- Tools are functions described by name, description, and JSON-schema arguments, and **MCP (Model Context Protocol)** standardizes tool discovery and invocation but introduces new eval problems because tool schemas can change between calls and permission scoping must be verified. Agent loops repeat decide-act-observe steps; **ReAct** (Yao et al. 2023) is the Thought → Action → Observation pattern now largely internal to tool-calling APIs, with **LangChain, LlamaIndex, AutoGPT** as frameworks, and loops must be bounded by max steps and timeouts.
- Prompting fundamentals are role, objective, instructions, context, reasoning, output format, examples, and delimiters, organized into version-controlled **prompt templates**; newer reasoning models (OpenAI o-series, DeepSeek R1) can be hurt by explicit "think step by step" instructions.
- Evaluation setups split into **absolute evaluation** (is it good enough to ship?) — **reference-based** (ground truth; expensive, penalizes valid alternatives) versus **reference-free** (format/completeness/factuality criteria, rules or LLM judge) — and **comparative evaluation** (which is better?): **pairwise comparison**, **ranking/leaderboards** (e.g., LMArena), and statistically rigorous **A/B testing** for production changes. The book focuses on reference-free methods, recommending 50–100 human-labeled "golden" examples as validation.

# L2 detail

- `#L140-L146` — EPUB ch01 header; Chapter 1 introduction; defines LLM application vs. LLM agent and why the agent/application distinction matters for evaluation.
- `#L147-L149` — The Air Canada / Jake Moffatt bereavement-fare hallucination case and tribunal ruling; prelaunch evaluation vs. production monitoring.
- `#L150-L155` — Why LLM applications differ from traditional software and traditional ML (nondeterminism, no formal spec, "vibes off"); the core challenge; chapter learning objectives.
- `#L156-L168` — What Is Evaluation: qualitative + quantitative definition, travel-planning metric example, the four integration modes (monitoring, guardrails, improvement mechanisms, model migration).
- `#L169-L181` — Evaluation throughout the LLM lifecycle: pretraining (tokens, perplexity, scaling laws), post-training (SFT, preference data, DPO, process reward models, RLVR, headline benchmarks), and the application stage.
- `#L182-L190` — Evaluation in Applications: three recurring difficulties (vague objectives, instruction gaps, behavior changes on new data) and the turn to the Three Gulfs.
- `#L191-L195` — The Three Gulfs of LLM Application Development: provenance (Shankar et al. 2025; Norman 1988), the email-processing running example, Figure 1-1.
- `#L196-L200` — The Gulf of Comprehension (developer vs. data): messy production emails, failure patterns visible only at scale, strategy of characterizing inputs and outputs at scale.
- `#L201-L207` — The Gulf of Specification (developer vs. LLM agent): the "extract the sender's name" instruction leaving format, identity, and implicitness unstated; making expectations explicit.
- `#L208-L211` — The Gulf of Generalization (data vs. LLM agent): the model returning a public figure's name instead of the header sender; errors unavoidable and only visible on real-world variety.
- `#L212-L215` — Applying the Three Gulfs to customer support chatbots and code generation assistants; evaluation strategy depends on the primary gulf.
- `#L216-L223` — Why LLM Agent Evaluation Is Challenging: bridging all three gulfs per application, the shared-vocabulary note, coding assistant vs. personal stylist (user agency and stakes).
- `#L224-L227` — The LLM Evaluation Lifecycle: Analyze–Measure–Improve as the framework bridging the Three Gulfs (Figure 1-2).
- `#L228-L231` — Analyze: reading traces, talking to users/domain experts, identifying failure modes rather than quantifying them; email signature/quoted-thread example.
- `#L232-L235` — Measure: quantifying generalization issues, designing evaluators (code-based rules or LLM-as-judge), the 8% boilerplate-leakage example.
- `#L236-L242` — Improve: specification fixes (tighten prompt/agent logic) vs. generalization fixes (more examples, retrieval, fine-tuning); the three-bullet-points and sender-metadata examples.
- `#L243-L252` — Putting It Together: diagnostic questions per gulf, the repeatable Analyze–Measure–Improve loop, and the handoff to building a prototype in Chapter 2.
- `#L253-L254` — Footnote 1: traditional ML's well-defined outputs and ground-truth metrics vs. open-ended, unstructured, subjective LLM output.
- `#L255-L268` — EPUB ch02 header; Chapter 2 objectives; introduces the two evaluation modes, absolute ("correct enough to ship") and comparative (A/B, pairwise, ranking, leaderboards).
- `#L269-L274` — Components of LLM Agents: the broad definition of agent (single call is the degenerate case), the autonomy design choice, and LiteLLM as the unified API library.
- `#L275-L286` — LLM API message objects: system, user, assistant, and tool roles; single-request vs. multi-turn message lists; the email summarizer running example.
- `#L287-L314` — Single LLM Call: LiteLLM `completion` example with gpt-4o-2024-08-06, sample output, nondeterminism/temperature guidance, and why richer components add failure modes.
- `#L315-L353` — Conversations: multi-turn dialogue example, appending assistant replies, and the new design choices around history length, context limits, and cross-turn consistency.
- `#L354-L415` — Retrieval: RAG definition, keyword (BM25) vs. embedding approaches, cosine-similarity embedding code with text-embedding-3-small, and combining retrieved context with the prompt.
- `#L416-L485` — Tools: `normalize_phone` tool definition and tool-call round trip, the security warning on validating inputs, retrieval-as-tool, and MCP's schema/permission evaluation challenges.
- `#L486-L526` — Agent Loops: state → decide → act → observe repetition, the capped `range(10)` loop code, LangChain/LlamaIndex/AutoGPT framing, the max-step/timeout note, and multi-agent evaluation.
- `#L527-L548` — Fundamentals of Prompting: role, objective, instructions, context, reasoning (and why explicit step-by-step can hurt reasoning models), output format, examples, delimiters, prompt templates.
- `#L549-L585` — Example 2-1 email-summarizer prompt template (role/objective/instructions/context/reasoning/format/example), template refinement benefits, and the version-control/logging tip.
- `#L586-L613` — Retrieval Fundamentals: start with BM25 for interpretability, rank_bm25 code example, then embedding or hybrid search with reciprocal rank fusion (RRF) and native support in Pinecone, Weaviate, Qdrant.
- `#L614-L636` — Tools and Agents: OpenAPI-style tool specs and precision of descriptions, the normalize_phone JSON schema, extending the prompt template with a tools section, and the ReAct loop definition.
- `#L637-L695` — Example 2-2: full ReAct-style agent prompt (Thought → Action → Observation, ambiguity policy choices a/b, output and step-format examples) and the autonomy design decision.
- `#L696-L707` — Evaluation Setups and Absolute Evaluation: reference-based (ground truth, exact match/overlap/semantic similarity, expensive, multiple valid outputs) vs. reference-free (format/completeness/factuality criteria); the 50–100 golden-example recommendation.
- `#L708-L714` — Comparative Evaluation: pairwise comparison, ranking and leaderboards (LMArena, internal leaderboards), and when to use pairwise vs. statistically rigorous A/B testing in production.
- `#L715-L718` — Putting It Together: the assembled component and evaluation vocabulary, the prototype problems to expect, and the handoff to systematic error analysis and specification vs. generalization failures.
- `#L719-L721` — Footnotes 1 and 2: pinned model versions for reproducibility, and why reference-based evaluation matters more for long-running multi-step agents (Chen et al. 2021; Jain et al. 2025; Yang et al. 2025).
- `#L722-L725` — EPUB part02 header and "Part II. The Analyze Phase" title.
