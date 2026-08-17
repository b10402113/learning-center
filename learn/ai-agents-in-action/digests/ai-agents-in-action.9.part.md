# Chapter 9 — Understanding the agentic loop

## Overview (L1)
- Chapter 9 — Builds from the chapter 1 SPAL (sense-plan-act-learn) loop to looping patterns that extend outside the agent, powering long-horizon, goal-driven agents (deep research, multi-agent orchestration, collaboration). Covers the three agentic loop layers — the internal layer-1 SPAL loop, the layer-2 externalized task loop, and the layer-3 meta loop — then implements each in code using the OpenAI Agents SDK, Pydantic state/plan/output models, and MCP servers (Brave Search). Ends with 9.5 Exercises (six practice builds: basic research loop, layered termination, task loop with retries, parallel processing, orchestrator meta loop, collaboration loop).

## Sections (L2)
### 9.1 Peeling back the three agentic loop layers
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1]]`
- Summary: Introduces the three-layer model of agentic looping: layer 1 is the internal SPAL loop, layer 2 externalizes goal-plan-state-decision outside the agent for long-horizon goals, and layer 3 puts an agent (orchestrator or collaboration) in control of the loop.
- Key claims: Every agentic loop rests on four core elements — goal, plan (iteration strategy), state, and decision (termination condition); an agentic loop differs from a while loop because the agent itself decides each step; layer 2 persists plan/state externally because general-purpose LLMs are not suited to long-running iterations and have context-window limits; layer 3 is controlled by an agent rather than code, giving two subtypes — orchestration (single delegating agent, subagents as tools) and collaboration (agents share state and decide jointly).
- Learner-relevant: Anchors the rest of the chapter; frames the design vocabulary (goal/plan/tool/state/sense-decision) used by every subsequent loop implementation.

### 9.1.1 Layer 1: The inner loop (sense-plan-act-learn)
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1.1]]`
- Summary: Describes the core SPAL cycle — sense current state, plan, act with tools, evaluate, update internal state, and loop until the goal is satisfied or a termination condition fires.
- Key claims: The agent drives the iteration while the developer defines the goal, provides tools, and sets boundaries; internal state accumulates across iterations so each cycle carries more context; getting the four core elements right distinguishes a converging agent from one that runs forever or gives up too early.
- Learner-relevant: Establishes the baseline loop model that layers 2 and 3 extend; ties back to chapter 1's SPAL pattern.

### 9.1.2 Layer 2: The task loop
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1.2]]`
- Summary: Explains externalizing goal-plan-state-decision out of the agent so a single agent can chain short-horizon goals into long-horizon outcomes such as deep research.
- Key claims: Externalizing avoids overwhelming the LLM context window and compensates for general-purpose LLMs being ill-suited to long-running iterations; layer-2 mechanisms are programmatic, deterministic constructs wrapping the agent — planning may be a long-running sequential-thinking server, state lives in process memory or a database, the decision is a check in code, and the tool is the agent itself.
- Learner-relevant: Motivates why state persistence and plan management live in code for research and task loops.

### 9.1.3 Layer 3: The meta loop
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.1.3]]`
- Summary: Defines the meta-agentic loop where an agent or agents control the inner layer-1/layer-2 processes; its placement determines the subtype — orchestration or collaboration.
- Key claims: Layer 2 is directed by code while layer 3 is directed by agents; in orchestration a single delegating agent encapsulates decide/state/plan in its own loop and uses delegation subagents as tools; in collaboration the decision agents join the loop and may or may not share state and plan; the rest of the chapter implements the layer-2 task loop and both meta-loop forms.
- Learner-relevant: Frames the orchestration-vs-collaboration distinction that sections 9.3 and 9.4 implement.

### 9.2 Layer 2: Looping with a deep research agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2]]`
- Summary: Presents the deep research agent as the canonical layer-2 loop implementation — a long-horizon goal flows through external code components that own the state, planning, tools, and decisions.
- Key claims: Every foundation-model provider (Gemini, Claude, ChatGPT) offers some deep research agent; the difference between a good loop and a runaway cost generator comes down to state management between iterations, termination-condition design, and tool connection; the level-2 workflow is code external to the agent that creates, updates, and checks state and plan objects each iteration.
- Learner-relevant: The concrete blueprint for building a converging, budget-safe research loop.

### 9.2.1 Creating the initial state and plan
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.1]]`
- Summary: Walks through listing 9.1's ResearchState and ResearchPlan Pydantic models — external, shared objects that persist state and strategy across loop iterations.
- Key claims: ResearchState is shared memory that accumulates findings, sources, and follow-up questions; ResearchPlan holds sub-topics and strategy notes that update as the agent learns; the to_context method serializes state/plan into a dictionary string for the LLM, letting the developer control what the agent sees per iteration to manage context-window usage; earlier findings may need summarizing rather than being passed raw.
- Learner-relevant: Introduces the pattern of controlling agent visibility per iteration to keep loops focused and context-bounded.

### 9.2.2 Adding the tools
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.2]]`
- Summary: Shows listing 9.2, an internal (STDIO) MCP server setup connecting the agent to Brave Search via npx with a BRAVE_API_KEY from .env.
- Key claims: Any MCP search service works; agents may have multiple tools and MCP sources (external APIs, databases, files) for search, analysis, aggregation, and classification; requires Node installed.
- Learner-relevant: Shows how to wire external search/tool capabilities into a loop agent via MCP.

### 9.2.3 Understanding iteration body output
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.3]]`
- Summary: Explains the strongly typed ResearchIteration output model (listing 9.3) that each agent cycle returns so the loop controller can parse findings, next steps, and completion signals.
- Key claims: The iteration body is typically a single Runner.run() call plus parsing that updates state; the model captures summary_of_findings, sources_used, follow_up_questions, goal_satisfied, confidence, reasoning, plan_updates, and new_sub_topics; strongly typed output is nonnegotiable — free-text parsing of loop control flow is fragile; empty follow_up_questions or goal_satisfied signals termination; with the Agents SDK the output format is passed automatically in instructions, not spelled out in the prompt.
- Learner-relevant: The structured-output contract that makes loop control robust and self-assessed.

### 9.2.4 The termination gate
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.4]]`
- Summary: Details the layered termination conditions evaluated at the end of each iteration: hard limit, budget limit, goal satisfaction, quality threshold, and stagnation detection.
- Key claims: Hard iteration and budget limits are defensive and nonnegotiable — an unconstrained loop is a production incident (token burn, cost, latency); goal satisfaction is the ideal exit but is a biased self-assessment that may need a separate goal agent; quality thresholds may use an external evaluator or quality agent; stagnation detection compares semantic overlap of consecutive summaries (e.g., cosine similarity of embeddings above ~85%) because a stagnating agent returns plausible but unchanged output, which is harder to detect than failure.
- Learner-relevant: Provides the checklist for making any agentic loop production-safe against runaway costs and circular reasoning.

### 9.2.5 Coding the deep research loop
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.5]]`
- Summary: Walks through listings 9.4 and 9.5 — the complete deep research loop: agent instructions that inform the agent it runs in a loop and how to build/update its plan, apply_plan_updates, and the run_research_loop controller.
- Key claims: to_context passes only the last five findings to manage context richness against window pressure; popping questions from the front and appending to the back yields breadth-first exploration (pop from the end for depth-first) — effectively a tree-of-thought search; the loop seeds follow_up_questions with the goal, runs while state.should_continue, and applies goal_satisfied to exit; the MCP server is created inside an async context manager so it is always shut down cleanly — never leave MCP servers running after loop exit (resource leaks, port conflicts).
- Learner-relevant: The end-to-end implementation pattern learners can copy for their own research loops.

### 9.2.6 Synthesizing the final output
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.6]]`
- Summary: Introduces a separate synthesis agent (listing 9.6) that turns accumulated findings into a structured ResearchReport after the loop completes.
- Key claims: Findings from individual iterations overlap, contradict, and leave gaps, so a dedicated synthesis agent compiles a unified, sectioned report using the plan's sub-topics as a structural guide; the synthesis agent receives all findings (not just the last five) because it runs once and has lower context pressure; it also receives final status to caveat early-terminated research; separation of concerns is deliberate — the research agent explores, the synthesis agent compiles, and merging them degrades search quality as agents optimize for report structure mid-exploration.
- Learner-relevant: The clean split between exploration and report generation for polished final output.

### 9.2.7 When to use an agentic loop
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.7]]`
- Summary: Gives criteria for choosing the agentic loop: iterative discovery, progressive refinement, batch processing, conditional branching, and multisource aggregation.
- Key claims: Not every agent needs a loop — single-pass tasks (classification, simple Q&A, format conversion) only add latency and cost without quality gains.
- Learner-relevant: A decision guide for when to apply loops vs. simple agents in learner projects.

### 9.2.8 Building a repetitive task loop agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.2.8]]`
- Summary: Describes the second layer-2 pattern — repetitive task completion, where an agent processes a well-defined work queue (invoices, document transforms, endpoint tests, record migration) one item per iteration.
- Key claims: The agent maintains a task queue, processes each item with MCP tools, records the result, and tracks progress until the queue empties or a stop condition fires; state (queue) and decision flow are external, but no external plan is needed for a well-defined list; the implementation is in 07_task_loop.py using an MCP filesystem and Brave Search server.
- Learner-relevant: A contrasting loop pattern useful for batch/queue-driven agent tasks.

### 9.3 Layer 3: Multi-agent orchestration loops
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.3]]`
- Summary: Implements the orchestration subtype of the meta loop — a single LLM-driven orchestrator agent that decomposes a complex goal, delegates sub-tasks to specialized worker agents via the SDK handoff mechanism, and decides whether to re-plan, delegate, or finalize (listings 9.7, 9.8).
- Key claims: The orchestrator reasons about which subtask to pursue, whether a worker's output is adequate, and whether the plan needs adjustment, making the meta loop adaptive where a hardcoded for loop cannot be; the OrchestratorDecision model drives flow control with next_action (delegate/re_plan/finalize), target_worker, and plan_updates; workers (research worker, analysis worker) are stored in a dictionary for dynamic dispatch; the orchestrator separates strategic reasoning from tactical execution and never touches search tools directly, mirroring human managers; it can dynamically replan mid-loop when a decomposition is revealed incomplete; overhead is real — every orchestrator decision is an LLM call, so reserve the pattern for uncertain decompositions where the plan must evolve.
- Learner-relevant: The adaptive multi-agent pattern for complex, evolving goals; contrasts with the cheaper hardcoded layer-2 dispatch.

### 9.4 Building collaborative agentic loops
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#9.4]]`
- Summary: Implements the collaboration subtype of the meta loop — peer agents sharing a common state object, taking turns in contribution rounds until consensus or a round cap, with a researcher-critic-synthesizer triad (listings 9.9, 9.10, 9.11).
- Key claims: Collaboration suits interdependent subtasks that benefit from multiple perspectives and adversarial validation — the critic catches unsupported claims and gaps a lone agent would gloss over, and the synthesizer resolves surfaced contradictions; a shared CollaborationState tracks contributions, round_number, max_rounds, and a consensus_threshold (0.8) via has_consensus; the loop round-robins agents through contributor-then-critic cycles and may later let agents select the next agent, nesting a layer-2 loop inside a layer-3 collaboration; orchestration is preferred when the goal decomposes into independent specialist subtasks (simpler to debug), collaboration when output quality needs adversarial review — when unsure, start with orchestration.
- Learner-relevant: The peer-loop pattern for higher-quality adversarial output and the orchestration-vs-collaboration decision rule.