# Chapter 10 — Exploring the cognitive agent

## Overview (L1)
- Chapter 10 — Defines agent cognition and metacognition as engineering concepts, maps the mind (Minsky's society of mind, Baars' global workspace, Kahneman's system 1/2) into a cognitive agent architecture built on a shared Pydantic workspace plus six modules (perception, planning, execution, evaluation, attention, memory), assembles and runs the full agent over the agentic loop with MCP servers, implements metacognitive monitoring patterns (confidence gating, stagnation detection, knowledge boundary awareness), and closes with a diagnostic framework and metrics for measuring cognitive capability. Section 10.5 Exercises offers five hands-on exercises (workspace, evaluation, attention router, full agent with memory, calibration measurement).

## Sections (L2)
### 10.1 Understanding agent cognition and metacognition as engineering concepts
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1]]`
- Summary: Motivates the chapter by explaining why stacking reasoning patterns (CoT, ReAct, ToT, Reflexion) makes agents more complicated without making them smarter; defines cognition and metacognition in observable, engineerable terms and introduces three cognitive-science frameworks as the architectural blueprint.
- Key claims: A collection of reasoning patterns is a toolbox with no craftsman to choose tools; reasoning patterns yield better answers to well-defined problems, cognition figures out what the problem is, and metacognition knows when the agent has or has not figured it out; the fixes for agent failure modes are structural components, not prompting tricks.
- Learner-relevant: Establishes the vocabulary and diagnostic map (cognition = quality of internal task model; metacognition = thinking about own thinking) that organize the whole chapter.

### 10.1.1 The five failure modes of capable-but-not-cognitive agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.1]]`
- Summary: Enumerates the five production failure modes of agents that can reason but cannot think — confident wrong answer, broken record, rigid plan, overcommitted guess, shallow composition — each mapped to a missing cognitive/metacognitive capability and the architectural component that fixes it.
- Key claims: The confident wrong answer comes from missing evidence evaluation (fixed by the evaluation module); the broken record comes from missing stagnation awareness (fixed by the attention module); the rigid plan comes from missing model updating (fixed by planning-in-replanning-mode triggered by evaluation signals); the overcommitted guess comes from missing knowledge boundary detection (fixed by the confidence gate); the shallow composition comes from missing compositional reasoning (fixed by perception + planning modules); these are default behaviors of reason-but-not-think agents, not edge cases.
- Learner-relevant: The failure-mode-to-module mapping is the diagnostic map reused by the 10.4 test suite; anchors any debugging of real production agents.

### 10.1.2 From reasoning primitives to cognitive architecture
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.2]]`
- Summary: Distinguishes reasoning patterns as cognitive primitives (individual skills) from cognitive architecture (which selects, composes, and monitors primitives dynamically based on the problem).
- Key claims: None of the reasoning patterns answers "when should an agent use which one"; a simple lookup needs no ToT, a complex troubleshooting problem should not get a single CoT pass, ambiguous queries need exploration before planning; the key difference is the feedback loop — the evaluation component detects ambiguity/contradiction and flows control back to the attention mechanism, whereas static reasoning commits to a pattern to completion.
- Learner-relevant: Reframes prior-chapter reasoning patterns as selectable primitives inside a broader architecture; connects to the reasoning chapter.

### 10.1.3 Defining cognition for agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.3]]`
- Summary: Defines agent cognition as the quality of the agent's internal model of a task and lists four capabilities that define cognitive agents, mapped to supporting primitives in table 10.1.
- Key claims: Cognition is four capabilities — task decomposition (break novel problems into subtasks, supporting primitive CoT/planning), dependency reasoning (sequence steps respecting dependencies, ToT/sequential thinking), compositional tool use (chain tools in novel configurations, ReAct), and model updating (revise understanding as new information arrives, Reflexion/replanning); each capability's absence produces the observable failures of section 10.1.1.
- Learner-relevant: The four capabilities and their present/absent behaviors give a checklist for judging any agent's cognitive depth.

### 10.1.4 Defining metacognition for agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.4]]`
- Summary: Defines metacognition as the agent's ability to think about its own thinking, comprising three capabilities: confidence calibration, stagnation detection, and knowledge boundary awareness.
- Key claims: Confidence calibration means internal signals (token probabilities, retrieval scores, evidence consistency) predict correctness — research (Wang et al. 2025, DMC framework) shows implicit token-likelihood confidence predicts correctness better than verbal confidence expressions; stagnation detection lets the agent pivot after ~2 iterations instead of retrying to the iteration limit; knowledge boundary awareness is needed because models give confident answers even when the correct option is absent (MetaMedQA, Nature Communications 2025); the implicit–explicit confidence gap is exploitable architecturally.
- Learner-relevant: Frames metacognition as the most practically important capability for production agents; motivates the metacognitive monitoring patterns of section 10.3.

### 10.1.5 Three theoretical foundations
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.1.5]]`
- Summary: Introduces the three cognitive-science frameworks the architecture borrows from, each mapped to a concrete architectural component.
- Key claims: Minsky's society of mind — intelligence emerges from interacting specialized modules (build separate understanding/planning/execution/evaluating modules, not one monolithic agent, and not loose message-passing multi-agent systems); Baars' global workspace theory — a shared stage broadcasts the most important signal to all processes (the cognitive workspace is a shared state object all modules read/write, not a message queue); Kahneman's system 1/system 2 — not every query deserves full cognitive treatment, so the attention module routes simple queries straight to response and complex ones through the full cycle; this is as much an efficiency argument (tokens, latency) as a capability one.
- Learner-relevant: Provides the theoretical grounding for the workspace, module, and attention designs; connects to earlier agent-loop and reasoning chapters.

### 10.2 Mapping the mind into a cognitive agent architecture
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2]]`
- Summary: Presents each component of the architecture with code (listings 10.1–10.7), starting from the shared workspace and moving through each specialized agent module, so the reader collects all pieces to assemble in section 10.3.
- Key claims: The architecture centers on a shared cognitive workspace with five modules operating around it (perception, planning, execution, evaluation, attention) plus a memory module beside it; no single module is intelligent, but interaction through the shared workspace produces behavior none could produce alone — the society of mind in code.
- Learner-relevant: All chapter code builds directly on the OpenAI Agents SDK and MCP servers used in earlier chapters; the module-by-module structure maps to the node's step-DAG.

### 10.2.1 Architecture overview
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.1]]`
- Summary: Lays out the full architecture (figure 10.4): the cognitive workspace at the center holding six categories of state, five specialized modules around it, and the memory module beside it, with the agentic loop from chapter 9 wrapping the whole system.
- Key claims: The workspace holds task representation, active hypotheses, intermediate results, confidence state, execution history, and attention signals; perception populates task representation, planning proposes strategy, execution calls tools via MCP servers, evaluation assesses quality and updates confidence, attention reads signals and decides the next module; the memory module connects to the official MCP memory server (modelcontextprotocol/server-memory), proactively retrieving before planning and recording after evaluation.
- Learner-relevant: This diagram is the reference for how each code listing fits into the whole; anchors later debugging and the 10.3 walkthrough.

### 10.2.2 The cognitive workspace
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.2]]`
- Summary: Details the cognitive (global) workspace as the shared, structured Pydantic state (listing 10.1: CognitiveWorkspace with TaskType, StrategyType, AttentionSignal, Finding) that modules use to communicate, going beyond the agentic loop's ResearchState.
- Key claims: The workspace is not a conversation history or scratchpad but a structured model of the agent's own reasoning process (beliefs, confidence, contradictions, progress); it extends ResearchState by tracking confidence in findings, contradictions, and strategy progress; the active_signal field is the broadcast mechanism — any module can raise a signal (e.g., CONTRADICTION) and the attention module decides the response.
- Learner-relevant: The workspace fields (complexity_estimate, confidence, active_signal, memory_hits) are the inputs every later metacognitive pattern reads; core data structure for the node.

### 10.2.3 The perception module
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.3]]`
- Summary: Describes the perception module as triage on the raw user query (listing 10.2): classifying the task type, extracting entities, flagging ambiguities, and estimating complexity — never answering the question.
- Key claims: The complexity_estimate routes processing depth — below 0.3 can trigger the system-1 fast path (skip planning/evaluation, go straight to execution), above 0.7 triggers the full cognitive cycle; this is Kahneman's dual-process theory as a routing decision; structured output (output_type=TaskRepresentation) guarantees typed, parseable results.
- Learner-relevant: Shows how to classify queries and estimate complexity — directly reusable for deciding processing depth in any agent.

### 10.2.4 The planning module
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.4]]`
- Summary: Describes the planning module (listing 10.3) which selects a strategy from multiple options based on the perception output and any memory hits, diverging from the single-approach standard agent.
- Key claims: Strategy selection is a decision tree (figure 10.5) driven by task type and complexity — DIRECT for simple lookups (<0.3), DECOMPOSE for multi-step, EXPLORE for ambiguous, HYPOTHESIS_TEST only when contradictions are flagged; memory hits inform but do not replace planning (past experience accelerates it); this is the architecture responding to the problem's specific nature rather than applying a one-size-fits-all approach.
- Learner-relevant: Demonstrates strategy selection conditioned on task classification — reusable decision rule for adaptive agent planning.

### 10.2.5 The execution module
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.5]]`
- Summary: Describes the execution module (listing 10.4) as the simplest component — it runs the current plan step via tools through MCP servers and wraps results in annotated Finding objects.
- Key claims: The module operates in a richer context where results are evaluated before reaching the user; the key design choice is result annotation — each result is wrapped in a Finding with content, source, relevance_score, and quality_note, which is what the evaluation module uses to judge whether the step advanced the task; a retrieval returning metadata instead of content should get a low relevance score and an honest quality note.
- Learner-relevant: The Finding metadata format is reused by evaluation, stagnation detection, and knowledge boundary awareness later.

### 10.2.6 The evaluation module
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.6]]`
- Summary: Describes the evaluation module (listing 10.5) as the metacognitive core — it thinks about the thinking, producing a progress assessment, consistency check, confidence delta, contradictions, and a recommendation after each execution step.
- Key claims: Evaluation addresses three of the five failure modes — evidence quality assessment catches the confident wrong answer, stagnation detection catches the broken record, contradiction flagging catches the rigid plan — all before the user sees anything; recommendations are CONTINUE / REPLAN / ESCALATE / TERMINATE; low-relevance or metadata findings must not increase confidence; evaluation is real-time monitoring during execution, distinct from Reflexion which is post-hoc correction after a response completes.
- Learner-relevant: The EvaluationResult fields and recommendation vocabulary feed the attention routing and confidence gate; anchors the "not reflection" distinction from the reasoning chapter.

### 10.2.7 The attention module
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.7]]`
- Summary: Describes the attention module (listing 10.6) — the component that makes this a cognitive architecture rather than a multi-agent pipeline — which reads workspace signals and deterministically decides which module runs next.
- Key claims: In the default case it follows the perceive-plan-execute-evaluate cycle but can break it on signals; a system-1 fast path returns straight to a response when complexity < 0.3 and relevant memory hits exist, saving latency and tokens in production; routing handles TASK_COMPLETE → RESPOND, STAGNATION → META_PLAN (recording the failed strategy), CONTRADICTION → replan with HYPOTHESIS_TEST, LOW_CONFIDENCE → ESCALATE below confidence 0.2 else PLAN, KNOWLEDGE_GAP → MEMORY; the routing is entirely code-controlled, so it is deterministic; hardcoded thresholds represent static cognitive settings/personality and are best left static until experience with the architecture solidifies.
- Learner-relevant: The routing decision tree (figure 10.6) is the debugging map for unexpected agent behavior; core of the node's attention concept.

### 10.2.8 The memory module and the MCP memory server
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.2.8]]`
- Summary: Describes the memory module (listing 10.7) layered on the official MCP reference memory server (modelcontextprotocol/server-memory), which implements a local knowledge graph with entities, relations, and observations persisted to a JSON file.
- Key claims: The knowledge graph maps naturally to the agent's own experience — problem types become entities, strategies that worked become observations, relations connect related problem types and failure modes, becoming the agent's institutional memory; the module adds three proactive behaviors on top (figure 10.7): proactive retrieval before planning, experience recording after evaluation (always recording successes and failures), and relation building across problem types sharing strategies; a knowledge graph is preferred over a vector store because structural relationships matter more than surface similarity for cognition — vector stores find similar, knowledge graphs find structurally related; community servers (mcpmem0, mcp-memory-service) can be swapped in since the MCP interface is the same.
- Learner-relevant: Connects to the chapter 5 memory-and-knowledge material; the entity/relation/observation primitives ground the compounding-learning claims in 10.3 and 10.4.

### 10.3 Building and running the cognitive agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3]]`
- Summary: Assembles all modules into a working system (listings 10.8–10.11), runs it on a real contradictory scenario, and implements the metacognitive monitoring patterns that make the architecture production-ready.
- Key claims: The assembled system connects the official memory server and a filesystem server for domain tools, initializes the workspace, and runs the cognitive loop on concrete queries; metacognitive monitoring (confidence gating, stagnation detection, knowledge boundary awareness) is what prevents confidently wrong answers in production.
- Learner-relevant: Converts the chapter's components into runnable code the learner can execute and trace via OpenAI dashboard traces.

### 10.3.1 The cognitive loop
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.1]]`
- Summary: Shows how the cognitive architecture meets the chapter 9 agentic loop: the outer agentic loop handles iteration, convergence, and exit conditions, while the inner cognitive cycle handles quality of processing, with the attention module mediating between them.
- Key claims: The inner cognitive cycle can run multiple times within one agentic iteration — evaluation signals (stagnation, contradiction, low confidence) route to replanning or re-execution within the same iteration, and control returns to the agentic loop for convergence checking only when a step completes without raising a signal; run_cognitive_loop (listing 10.8) caps the inner cycle (max_cognitive_steps), implements the system-1 fast path, resets the signal after processing to prevent infinite signal loops, and always records the outcome in the knowledge graph.
- Learner-relevant: Extends the chapter 9 agentic loop, replacing its internal loop with the cognitive loop and layering attention routing on top.

### 10.3.2 A complete cognitive agent with MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.2]]`
- Summary: Reviews the fully composed cognitive architecture spanning listings 10.1–10.8, runnable end to end with two MCP servers (memory + filesystem) on a concrete query.
- Key claims: All module code from section 10.2 assembles into one working system; running it and inspecting the OpenAI dashboard traces reveals how the modules cooperate through the workspace.
- Learner-relevant: Gives the learner the complete runnable artifact for the node; starting point for the chapter's exercises.

### 10.3.3 Walkthrough: Watching the cognitive cycle in action
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.3]]`
- Summary: Traces a nine-step run of the cognitive agent on a contradictory query — an intermittent deployment-pipeline failure under high traffic where the standard timeout fix already failed — showing why a flat ReAct agent gets it wrong and the cognitive agent gets it right.
- Key claims: Perception classifies the task as CONTRADICTORY with complexity 0.75 and extracts entities; the attention module routes to MEMORY before planning, which surfaces a past entity (connection_pool_exhaustion) with a relevant observation; planning selects HYPOTHESIS_TEST and generates three hypotheses; execution + evaluation iterate with relevance-scored findings and confidence moving 0.5 → 0.65; the final response acknowledges the user's tried-and-failed fix and ranks connection pool exhaustion as the likely cause; memory records the new entity and builds a "shares_strategy_with" relation so future similar queries start with higher confidence.
- Learner-relevant: The step-by-step trace is a worked example of the whole architecture in action and the target behavior to reproduce in exercises.

### 10.3.4 Confidence-gated execution
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.4]]`
- Summary: Describes confidence gating (listing 10.9) as the simplest and most useful metacognitive pattern — a structural check against the workspace confidence state before presenting any response.
- Key claims: Hard threshold — never present below 0.3 (SIGNAL_UNCERTAINTY); soft threshold — between 0.3 and 0.6, gather more if iteration budget remains, else signal uncertainty; unresolved CONTRADICTION signals force GATHER_MORE; three consecutive confidence drops in the trend force GATHER_MORE; the check is structural, not a verbal "I think" hedge.
- Learner-relevant: Directly implements the overcommitted-guess fix from 10.1.1; reusable gate for any agent that must not present uncertain results as facts.

### 10.3.5 Stagnation detection and strategy pivoting
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.5]]`
- Summary: Describes stagnation detection (listing 10.10) as the "broken record" fix — detecting when the agent iterates without progress via content overlap or a confidence plateau, then routing to META_PLAN.
- Key claims: More than 70% word overlap between the last two findings signals stagnation (content_overlap); confidence moving less than 0.05 across three steps signals a plateau (confidence_plateau); on detection the attention module routes to META_PLAN, where the planning module receives the constraint "previous approach failed" plus the workspace's failed_approaches list, preventing the planner from proposing the same strategy again.
- Learner-relevant: Concrete algorithm for detecting wasted iterations; anchors the broken-record failure mode and the attention module's routing.

### 10.3.6 Knowledge boundary awareness
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.6]]`
- Summary: Describes knowledge boundary awareness (listing 10.11) as the "knowing what you don't know" pattern — assessing whether the agent is within, at the edge of, or outside its knowledge and shifting into graceful degradation when outside.
- Key claims: The boundary assessment combines average retrieval relevance, memory coverage (memory hits signal related experience), and confidence into an averaged signal — above 0.6 is WITHIN, above 0.3 is EDGE, below that raises LOW_CONFIDENCE and returns OUTSIDE; no findings at all is a strong outside-knowledge signal; metacognition is the most valuable production feature because users tolerate "I don't know" but not confidently wrong answers.
- Learner-relevant: Fixes the overcommitted-guess failure mode; ties to 10.4's knowledge boundary accuracy metric.

### 10.3.7 Emergent behaviors
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.3.7]]`
- Summary: Describes four behaviors — curiosity, adaptive persistence, selective depth, and graceful degradation — that are not programmed into any single module but emerge from module interaction through the shared workspace and accumulating knowledge graph.
- Key claims: Curiosity — a KNOWLEDGE_GAP signal when low confidence meets no memory hits broadens search or generates exploratory subgoals the agent was not asked for; adaptive persistence — failed strategies recorded and routed to META_PLAN with a "do not repeat" constraint, learning from failure within and across sessions; selective depth — the fast path completes simple queries 3x–5x faster and on 3x–5x fewer tokens with no measurable quality loss (Kahneman's system 1); graceful degradation — the confidence gate prevents presenting uncertain results as facts, presents partial information with explicit uncertainty, and records boundary encounters so future queries trigger earlier uncertainty signals; these embody Minsky's society-of-mind thesis.
- Learner-relevant: Demonstrates the payoff of the architecture — observable behaviors that arise without explicit programming; supports judging whether an implementation is genuinely emergent.

### 10.4 Measuring cognitive capability and looking ahead
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4]]`
- Summary: Provides a practical diagnostic framework rather than a formal benchmark — five test categories, each corresponding to a failure mode from 10.1.1, with specific test cases and pass/fail criteria (table 10.2), plus production metrics and a path toward more general agents.
- Key claims: The five tests are evidence evaluation, stagnation awareness, model updating, knowledge boundaries, and compositional reasoning; if an agent fails more than two tests the cognitive architecture gives measurable improvement, while passing all five may mean the individual reasoning patterns from the previous chapter suffice.
- Learner-relevant: Gives a concrete, runnable evaluation plan for any agent — directly reusable as the node's measurement step.

### 10.4.1 Cognitive efficiency metrics
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4.1]]`
- Summary: Defines four production metrics for a cognitive agent: cognitive efficiency, metacognitive calibration, adaptation rate, and knowledge boundary accuracy.
- Key claims: Cognitive efficiency — steps taken relative to the optimal for the task type (a simple lookup taking six steps signals fast-path tuning needed); metacognitive calibration — correlation between confidence and correctness over time (a well-calibrated agent plots a diagonal line on confidence-vs-accuracy); adaptation rate — iterations between stagnation detection and a successful pivot (lower is better); knowledge boundary accuracy — rate of false positives (flagging uncertainty on easy questions) and false negatives (presenting hallucinated answers with confidence).
- Learner-relevant: The four metrics define what to track in production and are the measurable outcome of the metacognitive patterns.

### 10.4.2 Before and after: Measuring the effect
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4.2]]`
- Summary: Proposes two comparative measurements — the cognitive agent vs a standard ReAct agent on identical queries, and the cognitive agent with an empty knowledge graph vs one after 20 completed tasks.
- Key claims: Compare answer correctness, confidence calibration, graceful degradation rate, and average tokens consumed; the empty-vs-populated graph comparison demonstrates compounding returns from recording experience — the experienced agent should show higher confidence calibration, faster resolution of familiar problem types, and fewer stagnation events.
- Learner-relevant: Operationalizes how to validate the architecture's claims and quantify the value of persistent memory.

### 10.4.3 The road to more general agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#10.4.3]]`
- Summary: Argues the architecture is domain-agnostic and that the practical path to more general agents is architectural (modular cognition) rather than parametric (bigger models, more data).
- Key claims: Swapping the perception module's classifications, the execution module's MCP servers, and the planning module's strategy descriptions ports the same infrastructure to a different domain; generalization is compositional — ARC-AGI-2 tests exactly this kind of compositional generalization; intelligence emerges from the composition of capabilities, not from the scale of any single capability; reasoning, monitoring, memory, and adaptation are separate concerns that can be independently improved and recombined.
- Learner-relevant: Frames the cognitive agent as a reusable pattern beyond the book's troubleshooting examples; positions the node within the broader agent-generalization discussion.