# Chapter 7 — Building robust agents with evaluation and feedback

## Overview (L1)
- ch7 — Evaluation and feedback make agent robustness measurable and improvable. The chapter maps evaluation forms (deterministic tests, LLM/agent evaluators, humans), introduces test-driven agent development (TDAD) with benchmark-based iteration, covers grounding/critic/evaluation agent patterns plus rubric-based critics, and uses Arize Phoenix for tracing, metadata, experiments, and annotations. Section 7.5 provides five hands-on exercises (baseline benchmarks, refactor, typed evaluator, grounding guardrail, Phoenix tracing).

## Sections (L2)
### 7.1 Introducing agent evaluation and feedback
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.1]]`
- Summary: Maps the external evaluation and feedback systems around an agent — red team testing, benchmark testing, human feedback, grounding agents, and evaluation/critic agents — and the two feedback paths (in-loop back to the agent, or into an evaluation database for analysis).
- Key claims: Evaluation takes three forms suited to different correctness: deterministic test cases, LLM/agent evaluators, and human evaluators; feedback can flow back to the agent in-loop or into an evaluation database that a specialized feedback agent reviews for reports/alerts; grounding is a general technique (source + output → is output supported) with the grounding agent as its RAG implementation; raw human feedback is noisy and needs statistical aggregation, outlier detection, stratified sampling, and flagged-output review; multi-agent governance must counter collusion (use different evaluator models/personas, periodic human review, authority hierarchy, logging, escalation rules).
- Learner-relevant: Frames the whole chapter's vocabulary — where each evaluation pattern belongs in the development lifecycle, and why evaluation is a fifth layer rather than an afterthought.

### 7.2 Implementing test-driven agent development
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2]]`
- Summary: Introduces test-driven agent development (TDAD): define what "good" looks like (goals/benchmarks with expected and known-bad answers) before building the agent, expect initial failure, run each test multiple times, then make the minimum prompt/tool/model change to pass and refactor iteratively.
- Key claims: "What good looks like" for agents is expressed as rubrics rather than unit tests; a complete test observes tools selected, reasoning steps, grounding, step count, latency/cost, and failure behavior — not just final output; LLMs are variable so each test must be run multiple times (≥3) for consistency, unlike TDD; change escalates from a word, to a clause, to a sentence, to a section, to a tool, to the model; when benchmarks conflict, decide whether all must pass, whether to add a specialized agent (with routing overhead), or whether to refactor the agent from first principles.
- Learner-relevant: Gives a concrete, repeatable workflow the learner can apply when building any agent — including the specific RAG example developed through the chapter.

### 7.2.1 Exploring TDAD in practice
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.1]]`
- Summary: Walks through creating a single-agent RAG system with TDAD: the agent breaks a question into searchable terms, searches its knowledge base, answers from retrieved context (or says nothing found), and an evaluator compares against expected and incorrect answers from benchmarks.
- Key claims: Benchmarks pair each question with an expected answer and a known-bad (wrong) answer; the evaluator determines pass/fail from those three inputs; accuracy is the percentage of benchmark questions answered correctly.
- Learner-relevant: The concrete architecture (agent + retrieval + simple evaluator) that all later chapter patterns build on.

### 7.2.2 Coding and testing the RAG agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.2]]`
- Summary: Shows the minimal code — a fictional knowledge DB, a benchmark table, a keyword search tool, a bare-bones RAG agent, and a loop that runs each benchmark with string matching — and the expectation that the agent fails every test initially.
- Key claims: TDAD builds the minimal instruction set and minimal tool set to pass benchmarks; the initial agent fails as expected; passing tests must be rerun (≈3 times) to confirm consistency because LLM output is variable; the number of iterations correlates with output variability.
- Learner-relevant: Establishes the "fail first" baseline and the multi-run consistency rule that grounds all later refactoring decisions.

### 7.2.3 Refactoring the agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.3]]`
- Summary: Iterates the agent toward passing benchmarks: first instructing single-word answers and query breakdown, then diagnosing from trace output that the agent accepts empty retrieval results without query refinement, and fixing by clarifying the tool (rename + docstring) rather than bloating the prompt.
- Key claims: Formatting and tool-use instructions belong outside the prompt (tool metadata/docstrings, strongly typed output), keeping prompts lean and adaptable; strict equality on natural-language output is too brittle — evaluator normalization (lowercase, strip punctuation/whitespace) or LLM-as-judge is needed; the minimum change rule prefers tool description fixes over prompt changes (unless on MCP-hosted tools where prompts are forced); pinning the model keeps behavior consistent.
- Learner-relevant: Teaches the diagnostic loop — reading trace output to find the real failure and choosing the smallest correct fix — plus the common evaluation-bug trap of strict string equality.

### 7.2.4 Extending evaluation with an agent evaluator
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.2.4]]`
- Summary: Replaces brittle string matching with an evaluation agent that scores complex, natural-language output via a strongly typed pass/fail result plus feedback.
- Key claims: The evaluator agent uses a typed output model (is_correct, feedback) and instructions to pass/fail on presence of the expected key term; input is packaged as a dictionary (cleaner than raw JSON for the LLM); this lets the same benchmarks run without rewriting them while the RAG agent responds naturally; scores reach ~80–100% but correct answers may include extra, non-grounded information — motivating grounding agents.
- Learner-relevant: The bridge from simple evaluators to agent-based evaluation, and the motivation for grounding to stop hallucination.

### 7.3 Employing grounding, critic, and evaluation agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3]]`
- Summary: Compares three agent patterns for evaluating output: grounding agents (RAG-specific, verify output is grounded in retrieved context), critic agents (score generated content against a rubric, block/regenerate), and evaluation agents (judge complex output).
- Key claims: Critics require a retry ceiling that is an architectural decision — fallback response, human escalation (high stakes), best-of with confidence flag, or explicit failure — chosen by context (user-facing vs internal pipelines vs high-stakes); grounding agents may regenerate, block with static output, or pass grounded feedback forward; combining feedback with complex output lets users judge quality themselves.
- Learner-relevant: The decision map for choosing the right evaluation pattern per use case, and the real consequence of the retry threshold.

### 7.3.1 Reviewing the grounding agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.1]]`
- Summary: Reviews grounding as verifying an answer is supported by context/citations, and shows the architecture where the retrieved context is passed to both the RAG agent and a grounding guardrail agent.
- Key claims: Grounding applies beyond RAG (e.g., to critic patterns); both agents receive the same context, the RAG agent generates from it and the grounding agent verifies against it; post-grounding options include sending feedback back for regeneration, blocking with a static answer, or passing grounding results along with the final answer — and options can be combined (e.g., reject three times then block).
- Learner-relevant: The mental model of grounding as a shared-context verification step rather than a single tool.

### 7.3.2 Grounding the RAG agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.2]]`
- Summary: Builds a concrete grounding agent: a tool that retrieves the last context, a strongly typed GroundedAnswer output (is_answer_grounded, feedback), and a benchmark loop that checks grounding per question.
- Key claims: The grounding agent is kept generic so it can be reused across knowledge agents; grounding output can be combined with the final answer to gauge effectiveness; TDAD can later refine the grounding agent itself.
- Learner-relevant: A reusable template for a typed grounding agent plus the loop pattern for testing it against benchmarks.

### 7.3.3 Implementing grounding agents as guardrails
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.3]]`
- Summary: Operationalizes grounding with the OpenAI Agents SDK output guardrail: a decorated guardrail function runs the grounding agent, sets tripwire_triggered on failure, and a try/except main loop catches the trip to emit a static fallback.
- Key claims: Ungrounded output should generally be blocked (regenerate or static answer); the guardrail decorator converts the grounding check into agent-monitoring; on trip the loop prints guardrail info and falls back to a static response; this gives constant evaluation that answers stay grounded — critical when invalid/incorrect/dangerous answers are unacceptable.
- Learner-relevant: The concrete SDK pattern for making evaluation a hard enforcement layer rather than a review step.

### 7.3.4 Understanding the role of rubrics in evaluation
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.4]]`
- Summary: Explains when rubrics replace numerical metrics: structured outputs use accuracy/precision/recall/F1, while open-ended natural-language output needs rubrics, LLM-as-judge, or human review; then walks the eight-step process for defining a rubric.
- Key claims: Choosing the evaluation method per output piece is design work — wrong defaults add complexity or produce brittle measures; a rubric itself must be validated against human judgment or it scores consistently wrong; eight steps: objectives, criteria, scale, descriptions, apply, total score, consistency, review/iterate; four concepts anchor the practice — rubrics, evaluation, scoring (record/track scores), and logging (capture inputs/outputs/intermediate steps including evaluator agents, or failures become un-debuggable complaints).
- Learner-relevant: The framework for designing evaluation systems for mixed-output agents, and why logging evaluators matters as much as logging the agent.

### 7.3.5 Building a rubric critic agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.3.5]]`
- Summary: Applies rubric evaluation to image generation: an image-generation agent guided by style guidelines, plus a critic agent that scores the image against the rubric (with a vision tool) and passes/fails it, looping regeneration until pass or retry ceiling.
- Key claims: A critic is a specialized evaluator scoring output against the full rubric (criteria + scale); the pass threshold is a critical production decision — too low ships bad output, too high starves/escalates responses — calibrated by scoring samples and comparing to human labels; criteria should cover behavior (hallucination rate, reasoning quality, tool-use correctness, error handling) beyond surface quality; strongly typed critic output (image_pass, feedback) drives the generate-critique loop.
- Learner-relevant: A working rubric + critic loop that transfers to any high-variance output (images, reports, graphs), plus the threshold-calibration principle.

### 7.4 Phoenix for evaluation and feedback
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4]]`
- Summary: Introduces Arize Phoenix, an open-source observability platform (cloud or Docker/self-host) built on OpenTelemetry, for tracing, tracking, and evaluating agents; notes alternatives (Langfuse, LangSmith, W&B Weave, OTLP backends).
- Key claims: Phoenix tracks projects, sessions, token usage/cost, tool usage, latency, metrics, and agents, and is invaluable for diagnosing complex agent bugs — without trace-level observability, debugging agent flows at scale is nearly impossible; captured activity becomes datasets for experiments and evaluators; observability is nonnegotiable for production agents.
- Learner-relevant: The tool layer that makes the chapter's evaluation and feedback patterns observable and improvable in production.

### 7.4.1 Connecting to Phoenix
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.1]]`
- Summary: Shows the basic setup: set the PHOENIX_COLLECTOR_ENDPOINT, clear default OpenAI trace processors, register a tracer with auto_instrument and a project name, and wrap agent runs in a named trace; Phoenix runs locally via Docker.
- Key claims: Phoenix uses OpenTelemetry tracing that OpenAI Agents use by default, so setup is quick though prone to package-conflict/docs issues (LLMs help resolve); one or more agents can sit inside the trace function to track workflows; the dashboard (localhost:6006) exposes Traces, Sessions, Metrics, and Config with per-span latency, token usage, and raw LLM responses.
- Learner-relevant: The exact wiring needed to get agent traces flowing into Phoenix for the chapter's exercises.

### 7.4.2 Adding metadata and session tracking
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.2]]`
- Summary: Shows attaching session and metadata context (using_session, using_metadata) around the agent trace so all internal traces inherit them, then filtering the dashboard by metadata fields.
- Key claims: Metadata (e.g., run_id, env, customer_tier, model) is defined as a dict and wraps the agent trace in a with block, keeping the workflow trace innermost; the Metadata column in Phoenix enables filtering traces by value or expression — powerful for cohort analysis but dependent on configuring metadata per use case.
- Learner-relevant: How to make traces filterable and comparable, enabling the cohort and A/B evaluation patterns of 7.4.3.

### 7.4.3 Experimenting with evaluators
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.3]]`
- Summary: Demonstrates Phoenix's experiment/evaluation flow: select spans, add them to a dataset, then Run Experiment to generate evaluator code that runs over all spans in the dataset — the "outer loop" of TDAD.
- Key claims: Turning real traces into datasets, running evaluators, and feeding results back into prompts/tools/policies is TDAD's outer loop; generated experiment code evaluates LLM responses (or tool calls, handoffs, custom spans); evaluation runs on the whole dataset at once.
- Learner-relevant: The loop that connects production traces back to prompt/tool iteration, closing the evaluation feedback cycle.

### 7.4.4 Providing feedback with annotations
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#7.4.4]]`
- Summary: Shows how to create annotation types in Phoenix and attach them to spans, converting informal human judgment (tool misselection, "needs review") into structured, queryable labels.
- Key claims: Annotations stored with trace data become queryable signals, letting developers cross-reference quality labels against latency/cost/token metrics to find correlated failures; flagged spans across sessions accumulate into a regression test set that can be rerun after prompt changes; without annotation, the same observations stay in Slack threads and never become reusable evaluation material.
- Learner-relevant: The mechanism for turning human review into durable, reusable evaluation data — the production rule being to never promote agents without active evaluation, feedback, benchmarks, grounding/guardrails, critics with rubrics, tracing, and monitored KPIs.