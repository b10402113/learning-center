# Chapter 4 — Architecting and building multi-agent systems

## Overview (L1)
- 4 — This chapter moves from single-agent systems to multi-agent architectures. It covers the three fundamental patterns (flow, orchestration, collaboration) via the axes of decision-making, control, and communication; communication channels (shared memory, message passing, MCP); coordination strategies (sequential, parallel, hierarchical, debate, voting, role-playing, routing, peer-to-peer); transforming monolithic agents into agent flows with deterministic decision points; handoffs (conversational vs pass-off) with visualization and monitoring; and guardrails for input/output and agent-to-agent validation. Chapter 4.5 Exercises (refactor single agent to two-step flow, insert a deterministic decision point, convert to SDK handoffs, visualize the graph, add output guardrail with retry) are hands-on practice and are not indexed as sections here.

## Sections (L2)
### 4.1 Architecting multi-agent systems
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1]]`
- Summary: Introduces the three fundamental multi-agent architectures (flow/assembly line, orchestration/hub-and-spoke, collaboration/peer-to-peer) and the three axes along which every pattern varies: decision-making (command), control (execution), and communication (what context flows between agents and how).
- Key claims: Decision-making is the authority to commit to the next action; control is the authority to execute — an agent can hold one without the other; communication choices trade coordination against context bloat (open vs closed communication). Multi-agent systems are more potent but costlier, higher-latency, and more unpredictable if not managed. Patterns are mix-and-match building blocks; a reasonable starting point is flows before orchestration or collaboration. Agency and constraint live on a spectrum: higher-stakes work incurs more constraints; start with least agency needed and add it as reliability is demonstrated.
- Learner-relevant: Establishes the vocabulary (DM/control/communication) needed to reason about any agent system design; anchors later discussion of flows, handoffs, and guardrails.

### 4.1.1 Decision-making and control patterns
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1.1]]`
- Summary: Details three command/control strategies — agent flow (no central command, agent-to-agent communication), orchestration (orchestrator delegates to workers), and manager-worker hierarchy (manager passes commands down to submanagers/workers) — and compares their pros and cons.
- Key claims: Flow decomposes one large goal easily and is easy to debug but is all-or-nothing, fragile (one failure kills the flow), and has poor decision-making. Orchestrator handles complex decision-making and partial execution but is complex to build/debug and needs strong evaluation, guardrails, and feedback. Collaboration is robust and good for ambiguous goals but costly with high token usage/latency and hard to evaluate. More complicated patterns provide more control only if you manage the three elements; stick with flow if delegation patterns are hard.
- Learner-relevant: Provides a decision matrix for when to pick flow vs orchestrator vs manager-worker; supports building pattern-choice judgment.

### 4.1.2 Communicating with shared memory, message passing, and MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1.2]]`
- Summary: Explains why limiting agent-to-agent communication matters (cost and selection accuracy) and compares communication patterns: message passing (chained outputs), shared message/conversation thread, and tool exchange over MCP.
- Key claims: Every shared-context token is billed on every LLM call, and irrelevant context degrades selection accuracy ("lost in the middle") — each communication boundary is a deliberate decision about what context earns its place. Message passing filters noise and limits messages to what's needed but is only as good as the prior agent's output. Shared thread keeps all agents aware of prior exchanges but grows the context window and token use. MCP tool exchange is structured and well-defined but adds tool-call overhead. Align on one pattern per codebase, though mixing is possible.
- Learner-relevant: Gives a cost/accuracy rationale for lean communication; underpins the design of concise, typed agent inputs in later flow examples.

### 4.1.3 Channeling multi-agent coordination strategies
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.1.3]]`
- Summary: The fourth C — coordination — defines how agents execute along one path or across parallel paths. Details eight strategies with when-to-use/when-not-to-use guidance: sequential pipeline (agent-to-agent), parallel delegation, hierarchical coordination, iterative debate and refinement, voting/best-of-N (ensemble), role-playing collaboration, conditional routing (branching), and peer-to-peer network.
- Key claims: Sequential pipeline is linear and easiest to reason about but suffers latency (sum of stages), fragility, and no built-in revision; wrap stages in retry-with-backoff. Parallel delegation speeds up independent subtasks but adds synchronization overhead. Hierarchical coordination differs from parallel flow by whether the orchestrator plans differentiated work vs just fan-out/fan-in. Iterative debate has symmetric (peer consensus) and asymmetric (proposer/critic) variants; both need stopping conditions. Voting needs genuine diversity — different models are the highest-leverage diversity, prompting weaker. Critique is one-to-one/hierarchical while debate is many-to-many/peer-based. Conditional routing fits heterogeneous task loads but fails on misclassification. Peer-to-peer is fault-tolerant for distributed decision-making but hard to design/debug and prone to drift or deadlock. Always start with the simplest pattern that works, then refine.
- Learner-relevant: A catalog of coordination options with fit conditions; the primary anchor for comparing multi-agent strategies and choosing among them.

### 4.2 Balancing agents with agentic flows
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2]]`
- Summary: Zooms into the flow pattern as a way to transform a single monolithic agent into a more practical, efficient agentic system; frames flow as breaking down and understanding an agent's behavior.
- Key claims: A flow of agents is more helpful than a single agent for decomposing and understanding behavior; single agents are fine for simple cases but overload as tool use and prompts grow. (Chapter summary adds: flow, orchestration, and manager-worker are the three canonical decision patterns — start with plain flows.)
- Learner-relevant: Motivation section that leads into the concrete transformation code that follows.

### 4.2.1 Transforming agents to agent flows
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2.1]]`
- Summary: Lists the reasons to break one agent into many — overload, specialization, cost/latency — and shows the "before" single-agent code (Listing 4.1) consuming tools from multiple MCP servers with measured degradation as tools/prompt grow.
- Key claims: Overload (including attention overload from overlapping tool descriptions — fix by making tool descriptions distinct), specialization (focused agents perform better), and cost/latency (specialized agents with few tools and lean context are cheaper — tools and context are tokens billed every call) drive decomposition. A single agent with 30 tools / 4,000-token prompt shows measurable drops in selection accuracy vs 8 tools / 1,500 tokens; tool schemas sent per call add roughly $0.02–$0.04 per call in overhead at Claude Sonnet 4.6 rates.
- Learner-relevant: Supplies the concrete signals for when to decompose an agent, and the token-cost intuition behind keeping tool lists tight.

### 4.2.2 Building an agent-to-agent flow
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2.2]]`
- Summary: Shows the conversion of the single agent into a flow of role-based agents (Listing 4.2) — one agent per MCP server — and explains the role-first decomposition rule.
- Key claims: Agent-to-agent flows are like prompt chaining, but agents can make decisions through tool use. Decompose by role: define each agent's limitations and ownership, limiting tools to the role. Think about specializing agents first, then map roles to those specializations. Each agent gets its own MCP server, and the previous agent's final output is passed directly to the next. Transforming to a flow enables multiple steps, more MCP tools, and lets you control decision-making for more deterministic, predictable behavior.
- Learner-relevant: The canonical minimal agent-to-agent flow pattern; direct antecedent to handoffs and guardrail sections.

### 4.2.3 Agency and decision-making in agent flows
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.2.3]]`
- Summary: To make flows deterministic despite LLM non-determinism, pull decision points out of the agent and implement them as external code — effectively guardrails. Shows a random research-source MCP tool (Listing 4.3), a strongly typed output model (ResearchSourcesModel), and a coded decision branch (Listing 4.4).
- Key claims: Agents are not deterministic, so move decision points outside agent control to get repeatable results. Structured output types enforce response shape at the SDK level, avoiding parsing/malformed-response drift. Passing a labeled dictionary of inputs is better than passing full conversation history, which confuses agents and adds token overhead. Always output a consistent format and data type regardless of internal processes.
- Learner-relevant: The bridge between flow mechanics and deterministic control; motivates typed I/O and coded guardrails used throughout 4.3–4.4.

### 4.3 Understanding handoffs in agent flows
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3]]`
- Summary: Presents the three common agent-flow communication patterns (conversational shared thread, pass-off with explicit code control, and enhanced agent handoff with guardrail as in the OpenAI Agents SDK) and their trade-offs.
- Key claims: Conversational flow shares one thread (all agents share context) but adds overhead to every agent. Pass-off gives complete control and lets you interject decisions but is manual and increases code complexity. Enhanced handoff keeps communication filtered and monitored on the main thread while maintaining context and limiting tokens, but restoring the thread is delicate if the handoff breaks.
- Learner-relevant: Frames the pattern choice (conversational for speed, pass-off for fine-grained control) that the chapter summary restates.

### 4.3.1 Agent-to-agent flow with handoffs
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3.1]]`
- Summary: Shows the handoff pattern (Listing 4.5): agents transfer control internally via a handoffs field plus instruction lines naming the next agent, instead of coded transitions.
- Key claims: Handoffs reduce orchestration code but make dependencies implicit in prompts and harder to inspect; agents must know by name which agent to hand off to, so they can no longer live in isolation. Agents assign handoffs (e.g., research_agent.handoffs = [thinking_agent]) and max_turns limits the total LLM calls across the flow.
- Learner-relevant: The minimal handoff setup; the cost of implicit dependencies motivates visualization and monitoring next.

### 4.3.2 Visualizing agent flows
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3.2]]`
- Summary: Uses OpenAI built-in traces and draw_graph() (Listing 4.6) to render the agent-to-agent flow automatically, and the Dashboard Traces page to inspect every call.
- Key claims: Agent names are identifiers used in traces, visualizations, and handoff routing — renaming breaks saved traces/dashboards/hardcoded references; at twenty-plus agents adopt a naming convention (e.g., domain.role.version like research.planner.v2) and beyond that an agent registry (single source of truth) becomes the right pattern. draw_graph documents the process at a glance; Traces reveals all calls for debugging.
- Learner-relevant: Practical observability techniques; naming discipline as a prerequisite for scaling agent counts.

### 4.3.3 Monitoring the handoff
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.3.3]]`
- Summary: Uses the handoff wrapper function with an on_handoff callback and input_type (Listing 4.7) to observe what data passes from one agent to the next and why the handoff was made.
- Key claims: Default handoffs do not show what data transfers between agents; the callback exposes it and can trigger other workflows at the handoff point. Use callbacks to observe and log, but use guardrails when you want to block or correct bad data.
- Learner-relevant: Positions observation vs validation — the setup for the guardrail section.

### 4.4 Validating agent flows with guardrails
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4]]`
- Summary: Guardrails validate data entering/exiting a flow and transfers within it; defines them as semantic circuit breakers that halt execution before a risky action, distinct from output filtering, and lays out a defense-in-depth layering strategy.
- Key claims: LLM-based guardrails run an extra model call per agent step, adding latency/tokens that can rival the agent's cost. Cheaper alternatives come first: regex/schema validation (deterministic but latency-prone), classifier models for toxicity/PII/prompt injection (fraction of LLM cost), and code-based validation (assertions, type checks, business-rule predicates). LLM guardrails earn their cost only for genuinely semantic checks (fuzzy quality bars, emotional appropriateness, tool-call intent). Defense-in-depth: deterministic checks first, classifiers next, LLM guardrails for semantic cases; LLM-validating-LLM can fail in the same direction as the agent, so it must not be the only line of defense.
- Learner-relevant: Cost/benefit framework for guardrail selection — the strategic layer over the SDK implementation that follows.

### 4.4.1 Implementing input and output guardrails
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4.1]]`
- Summary: Implements the OpenAI Agents SDK Guardrail pattern (Listing 4.8): input_guardrail and output_guardrail decorators, GuardrailFunctionOutput with a tripwire flag, and exceptions InputGuardrailTripwireTriggered / OutputGuardrailTripwireTriggered.
- Key claims: Guardrails control input/output and agent-to-agent data in variable systems; any complex logic can sit inside them. Tripwires are triggered by a Boolean flag and raise a typed exception on failure. Guardrails wrap the agent and can validate or correct input; the code shows basic string/length checks, which later get replaced by guardrail agents.
- Learner-relevant: Hands-on guardrail API mechanics (decorators, tripwires, exceptions) in the SDK.

### 4.4.2 Using agents as guardrails
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4.2]]`
- Summary: Replaces string/length checks with guardrail agents that validate via prompts (Listing 4.9), giving natural-language validation policies through typed input/output models.
- Key claims: Writing a prompt for complex validation, annotation, and data handling is powerful — updating validation rules is just editing a prompt — but it is prone to catastrophic failures (robustness patterns come in chapter 5). In the Agents SDK, guardrails were not intended for handoffs (handoffs are treated as tools), but guardrails can still be used for agent-to-agent communication.
- Learner-relevant: The LLM-as-validator pattern and its caution flag; motivates later robustness material.

### 4.4.3 Adding guardrails for pass-off agent flows
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#4.4.3]]`
- Summary: Adds output guardrails to agent-to-agent pass-off flows (Listings 4.10–4.12), with three named failure modes and a retry/recovery loop, plus orchestration-as-tools as a final pattern.
- Key claims: Three handoff failure modes: shape failure (unexpected structure), context leakage (too much history/planning state), and instruction injection (content treated as authoritative instructions — highest stakes, can hijack the receiver). Put guardrails on high-stakes handoffs (writes, sends, irreversible actions), not every handoff. Guardrails are failure points, not decision points; recovery may loop back to retry, bounded with a max-retry count and a clear fallback. Retries cost tokens/latency and may not catch bad output; for transient errors use exponential backoff with jitter to avoid thundering herd. Handoffs build systems quickly; pass-off is better for complex control and external agents; you can mix patterns. The orchestration pattern (agents as tools, Listing 4.12) provides direct control but loses tool-specific output and is less stable — avoid until you have a few successful flows. Improve flows by improving instructions, limiting outputs to structured types, and adding guardrails; keep things simple.
- Learner-relevant: The failure-mode catalog and retry discipline needed to make pass-off flows robust; closes the chapter's practical arc from single agent to guarded multi-agent system.