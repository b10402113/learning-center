---
source: loop-engineer
source_type: text
source_lines: 33675
part: 1
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 1)

## Overview (L1)

- What Is Loop Engineering — Loop engineering designs the repeated plan–act–observe–improve cycle that makes a system feel agentic. It covers what the model can see, which tools it may call, how state is tracked, and which guardrails prevent unsafe or wasteful actions. The agent is a controlled executor: the model reasons, tools act, memory preserves continuity, validation keeps it grounded. Practical promise: controlled autonomy inside a measurable engineering workflow.
- Single LLM Call vs. Agentic Loop — Contrasts a one-shot prompt/response with a managed execution loop that keeps a goal active, calls tools, observes results, updates state, and repeats until a stop condition. A single call wins for self-contained tasks (faster, cheaper, easier to test/explain); the loop is justified when work cannot be done in one pass. Warns against over-engineering every request into a loop.
- Goal–Act–Observe–Evaluate — Presents the core control cycle: Goal defines success, Act uses a capability, Observe captures real evidence, Evaluate compares evidence to the goal and decides continue/stop. Stresses that stopping matters as much as continuing, each step needs an explicit contract, and the frame must be observable, bounded (permissions, timeouts, step limits, retries), and auditable.
- Models, Harnesses, Tools, and Execution Environments — Decomposes an agent into four layers with explicit contracts: model (reasoning/output), harness (state, retry, evaluation, loop control), tools (MCP, LSP, APIs, databases), and execution environment (sandbox, terminal, secrets, logs). Reliability comes from boundaries—least privilege, logs, cost limits, recovery behavior—not from trusting intelligence alone.
- When to Use an Agent—and When Not To — Explains the decision criteria: agents fit problems with unclear paths, external tool use, intermediate observation, and judgment-driven next actions (code navigation, research, ops troubleshooting, multi-step tool work). Prefer single calls or deterministic workflows when steps are known, compliance is strict, or work is high-volume/repetitive. Recommends starting narrow, measuring, and expanding only when evidence supports it.
- Loop Engineering Foundations (quiz) — An interactive multiple-choice quiz page (score board, reset, per-option feedback, expandable overall explanation) intended to test chapter foundations. The embedded `quizData.questions` array is currently empty, so the page renders no question cards.
- Lab: Map an Agent Loop from Goal to Completion — A hands-on Python lab that builds an expense-claim agent loop and traces it from goal to controlled completion. Learners implement state, tools, action selection, evaluation, and a bounded loop, then run approval, escalation, failure, and limit-exhaustion paths.

## Sections (L2)

### what-is-loop-engineering

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/1. What Is Loop Engineering.en.srt#what-is-loop-engineering]]`
- Summary: Defines loop engineering as designing the repeated decision cycle (plan → act → observe → improve) that makes a system agentic, and lays out the stack of controls around the model.
- Key claims: A single LLM call is fine for simple self-contained tasks, but production problems (debugging a repo, preparing a PR, validating config, collecting multi-system evidence) need repeated action and feedback; the loop engineering stack is prompt/policy, context (e.g. CLAUDE.md, codebase-map.md), tools (MCP servers, APIs, shell, editors), memory/state, validation (tests, business rules, LSP), and control (budgets, approvals, stop rules, escalation); reliability gates confirm tools are safe before acting, compare results to the goal after acting, and request human approval on low confidence or high impact.
- Learner-relevant: Establishes the course's central definition and vocabulary, and motivates why agent quality comes from designing the surrounding layers, not the model alone.

### single-llm-call-vs-agentic-loop

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/2. Single LLM Call vs. Agentic Loop.en.srt#single-llm-call-vs-agentic-loop]]`
- Summary: Compares single-call execution with an agentic execution loop and gives criteria for choosing the smallest reliable mechanism.
- Key claims: A single call sends a prompt and gets one response with no continued inspection of the world; an agentic loop keeps a goal active, decides the next step, calls tools, observes results, updates state, and repeats until a stop condition; observations matter as much as actions (confirmation, missing context, errors, guardrail triggers); production loops need clear limits/stop rules tied to validation, policy, cost, or human approval; context, memory, tools, validation, guardrails, and human approval are distinct loop layers; over-engineering simple requests adds latency, cost, and failure modes.
- Learner-relevant: Gives the core decision heuristic ("smallest reliable mechanism") and the layer vocabulary later steps and labs build on.

### goal-act-observe-evaluate

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/3. Goal–Act–Observe–Evaluate.en.srt#goal-act-observe-evaluate]]`
- Summary: Explains the four-stage control cycle behind agentic systems and the contract each stage must satisfy.
- Key claims: Goal = desired outcome plus success criteria; Act = choose and run a capability (MCP tool, LSP query, repository command, code edit, API); Observe = capture real evidence (outputs, diagnostics, test results, state changes) rather than assuming success; Evaluate = compare observation to the goal, weigh risk, and decide continue/adjust/stop; stopping is as important as continuing—exit on goal met, limits reached, or human review required; guardrails (permissions, timeouts, step limits, bounded retries, audit logging, human approval) should be designed in from the start.
- Learner-relevant: The canonical mental model the lab implements and the decision frame used to inspect, bound, and improve any loop.

### models-harnesses-tools-execution-environments

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/4. Models, Harnesses, Tools, and Execution Environments.en.srt#models-harnesses-tools-execution-environments]]`
- Summary: Separates an agent into four cooperating layers—model, harness, tools, execution environment—each with an explicit contract.
- Key claims: The model provides reasoning and language; the harness builds prompts from instructions/context/constraints/history, keeps state, enforces policy, and decides whether to continue; tools (MCP, LSP, APIs, databases) supply real capabilities; the environment is the isolated sandbox/terminal where actions run with resource controls, secrets boundaries, and logs; each layer should define what it may do, what it must return, and how failures are handled; repository files (CLAUDE.md, codebase-map.md, ClaudeSession.json) make contracts and boundaries visible; reliability comes from boundaries, not from assuming correct model behavior.
- Learner-relevant: Supplies the architectural decomposition for reasoning about and designing each component's responsibilities and failure handling.

### when-to-use-an-agent-and-when-not-to

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/5. When to Use an Agent—and When Not To.en.srt#when-to-use-an-agent-and-when-not-to]]`
- Summary: Provides selection criteria for when agentic execution is warranted versus simpler alternatives, plus a safe enterprise rollout pattern.
- Key claims: Ask "does this problem require deciding what to do next after seeing a result?"—not "can we make this agentic?"; agents fit unclear paths, external tools, intermediate observation, and judgment-driven next actions (code navigation, research/synthesis, operational troubleshooting, multi-step tool work), all sharing uncertainty, observation, tool use, and iteration; prefer single calls (one-shot answers), deterministic workflows (fixed steps), rules/human review (strict compliance), or batch/services (high-volume repetitive) otherwise; agents add planning overhead, latency, variable behavior, and test burden; start narrow with intake, policy checks, risk triage, permissions, harness coordination, logs/traces, evaluation, and audit/feedback—expanding only after trust is earned.
- Learner-relevant: The course's design-judgment anchor: teaches deliberate, evidence-based adoption rather than defaulting to agentic builds.

### loop-engineering-foundations-quiz

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/1. Loop Engineering Foundations.html#loop-engineering-foundations-quiz]]`
- Summary: An interactive multiple-choice quiz page for chapter foundations with a score board (score/correct/wrong/remaining), reset, per-option feedback, image zoom, and an expandable overall explanation.
- Key claims: The page is a reusable single-file quiz harness driven by a `quizData` object; its `questions` array is currently empty, so no question cards are generated and all counters start at 0.
- Learner-relevant: Documents the quiz UI/harness format and flags that this particular file carries no content to mine for lesson material.

### lab-map-an-agent-loop

- Locator: `[[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/6. Lab Map an Agent Loop from Goal to Completion.html#lab-map-an-agent-loop]]`
- Summary: A 30–40 minute, dependency-free Python 3.10+ lab that builds an expense-claim agent loop and traces goal → completion, with no cloud services, packages, or API keys required.
- Key claims: Path A builds `agent_loop.py` with sample `CLAIMS`/`EXPENSE_POLICY` data, a `ToolResult` and `AgentState` (goal, turn, `max_turns=5`, status, evidence, trace), `fetch_claim`/`fetch_policy`/`check_eligibility` tools, `select_action()`, `execute_action()`, `evaluate_observation()`, and a bounded `run_agent()` loop; Path B verifies four outcomes—`APPROVED` (CLM-1042, 4 turns), `ESCALATED` (CLM-2048: missing receipt + over limit), `FAILED` (unknown claim CLM-9999 stops safely after one failed tool), and `LIMIT_REACHED` (`max_turns=2`); approvals require claim exists, allowed category, receipt present, amount within the 1000.00 auto-approval limit, and supporting evidence.
- Learner-relevant: The concrete executable artifact for the chapter—maps every abstract loop element (goal, state, action selection, tool execution, observation, evaluation, evidence, completion criteria, terminal states, execution limit, trace) to code.
