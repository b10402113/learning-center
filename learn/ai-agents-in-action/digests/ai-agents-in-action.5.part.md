# Chapter 5 — Agent reasoning and planning

## Overview (L1)
- Chapter 5 — The second tenet of effective agents: how LLMs decompose problems and plan, from basic CoT and ReAct patterns to advanced ToT and Reflexion, and how the sequential thinking MCP server gives agents an external reasoning scratchpad. It moves from pure prompting techniques (5.1) to embedding them in agents (5.2), to advanced patterns and selection (5.3), to the ST MCP server as a working-memory reasoning tool (5.4). Section 5.5 holds five hands-on exercises (CoT numbering, CoT→ReAct with tools, ST server integration with trace inspection, ToT branching/pruning, Reflexion retry loop), noted here but not expanded as an L2 section.

## Sections (L2)
### 5.1 Understanding LLM reasoning and planning
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1]]`
- Summary: Distinguishes decomposition (breaking a task into subproblems) from planning (choosing sequence, dependencies, and approach), then contrasts non-reasoning LLMs (single forward pass, prone to short-circuiting) with reasoning models (explicit deliberation phase, extra tokens/latency). Introduces CoT and ReAct as the two dominant practitioner patterns and positions explicit planning as a third layer that lives outside the model.
- Key claims: Decomposition and planning are distinct and fail independently, so the fix depends on which broke; CoT prompting surfaces intermediate steps but adds no new capability — it helps strong models more than weak ones; reasoning models make deliberation explicit at the cost of latency and tokens; evaluation of reasoning is a practical question of reliability, cost, and gain over CoT prompting, not a binary; reasoning patterns shape and bias probabilistic models but never control them; model gaps stem from scale, compute, data, and post-training, not reasoning infrastructure alone.
- Learner-relevant: Foundational vocabulary and mental model for diagnosing why an agent fails (decomposition vs planning) and for choosing between prompting and reasoning-native models.

### 5.1.1 Chain-of-thought reasoning
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1.1]]`
- Summary: CoT prompting instructs an LLM to reason step by step, producing a visible chain of intermediate reasoning before the final answer. Demonstrated with a time-travel riddle (correct answer 26 days) where a reusable six-step CoT strategy is appended to the prompt (listings 5.1–5.2, figure 5.2).
- Key claims: CoT improves performance on complex multistep goals by forcing breakdown into steps; if a model still struggles, tune the steps to that model's grammar/style rather than abandoning CoT; benefits are inspectable thought processes and structured reasoning, costs are extra tokens, latency, and output; CoT alone has limited control over the final output.
- Learner-relevant: First, cheap technique for adding reasoning to prompts; teaches the inspectable-thought property that later patterns build on.

### 5.1.2 Reasoning, acting, observing: The ReAct paradigm
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1.2]]`
- Summary: ReAct interleaves thought steps, tool actions, and observation of results in a closed feedback loop (figure 5.3). The orchestration loop — call model, execute action, return observation, call model again — lives in the agent framework, not inside the model.
- Key claims: The feedback loop is what separates ReAct from CoT, not the presence of tool calls; ReAct is reactive and step-at-a-time, not plan-driven, letting agents recover from wrong moves and adapt mid-task; ReAct is the structural foundation of most production and multi-agent systems because it connects deliberation to external action.
- Learner-relevant: Core pattern for tool-using agents; the architecture of the reason–act–observe loop is the key design fact for building agents that gather information dynamically.

### 5.1.3 Planning with LLMs
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.1.3]]`
- Summary: Planning extends reasoning to higher-level, longer-horizon strategic outlines that coordinate multiple CoT/ReAct loops. Shown via an SF itinerary plan and its revision when real-world feedback arrives (listings 5.3–5.4).
- Key claims: CoT reasons inside a single pass, ReAct decides one step at a time, but planning produces an explicit plan stored outside the model (memory, scratchpad, or context); because LLMs have no persistent state or world model, the global view is a property of the architecture; planning-executing-observing-revising is the ReAct loop applied at plan scale, executed by the human here and by agents next.
- Learner-relevant: Establishes that plans must be made explicit and reread on each step — the design rationale behind scratchpad/external-memory architectures used later.

### 5.2 Instructing agents to reason and plan
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.2]]`
- Summary: Defines an agent as a system built around an LLM (tools, memory, orchestration, environment) in which the LLM is the reasoning component, and shows how to inject reasoning into agents through instructions rather than raw prompts.
- Key claims: The LLM supplies reasoning; everything else in the agent turns that reasoning into world-affecting work; agent instructions are the lever for injecting reasoning patterns.
- Learner-relevant: Bridges chapter 4's agent framework (Agent, Runner) to reasoning — the jump from prompting a raw model to instructing an agent.

### 5.2.1 Applying CoT to an agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.2.1]]`
- Summary: A minimal agent (listing 5.5, `02_CoT_agent.py`) achieves CoT by instructing the agent to "work out the solution step by step, then give the final answer", returning the numbered thought chain in `final_output`.
- Key claims: A few words in agent instructions define the thinking process; the step-by-step thought process appears in the agent's output, making it inspectable and debuggable.
- Learner-relevant: Simplest way to add reasoning to an existing agent; pattern for turning reasoning policy into instruction text.

### 5.2.2 Implementing ReAct with agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.2.2]]`
- Summary: Extends the CoT agent with `travel_back`/`travel_forward` function tools and instructions to think step by step, use tools when needed, and reflect after each tool call (listing 5.6). The agent solves a three-jump time problem, outputting only the final year.
- Key claims: ReAct needs tools so the act step has something to invoke and the observation step something to interpret; the trade-off is that the step-by-step thought process is no longer visible in the final output — recovering it needs logging and tool traces (later chapters).
- Learner-relevant: First complete reason–act–observe agent implementation; motivates observability/tracing as a follow-on concern.

### 5.3 Advanced reasoning patterns with agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3]]`
- Summary: Notes that simple single-step agents need no explicit reasoning structure; patterns earn their cost when tasks require multiple decisions, depend on intermediate results, or exceed a single forward pass. Points to tree-of-thought (ToT) and Reflexion for harder goals.
- Key claims: CoT and ReAct cover most reasoning cases; ToT and Reflexion are worth reaching for as agentic systems tackle harder goals.
- Learner-relevant: A decision gate: when to skip reasoning patterns entirely vs when to escalate to advanced ones.

### 5.3.1 Tree-of-thought
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3.1]]`
- Summary: ToT is a deliberate search over candidate reasoning paths: generate initial thoughts, expand branches in parallel, evaluate leaves, prune low-potential branches, and terminate on a satisfactory or best-scoring solution (figure 5.4). A partial implementation uses generator and evaluator agents (listing 5.7).
- Key claims: ToT differs from CoT by branching, evaluating, pruning, and backtracking rather than a single linear chain; it fits planning, puzzles, and games where exploration matters; it cannot be fully invoked by one prompt — pruning and backtracking require external orchestration (e.g. LangGraph); each branch evaluation makes it token- and time-heavy.
- Learner-relevant: Breadth-oriented alternative to CoT; clarifies the orchestration-code boundary between prompting and framework-level reasoning.

### 5.3.2 Reflexion
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3.2]]`
- Summary: Reflexion is a self-critique loop: a solver agent produces an answer, a critic agent critiques it with a hint, and the hint is injected back into the solver's context via dynamic instructions (figure 5.5, listing 5.8). Improvement comes from conditioning on richer context, never from weight updates.
- Key claims: There is no training or learning in Reflexion — only better output from critique-augmented context; it is cheaper than ToT because it refines one path at a time (depth vs ToT's breadth); it requires knowing the correct answer to critique, a real limitation, though validated hints can be stored and reused across a problem collection.
- Learner-relevant: Solver–critic two-agent architecture and dynamic-instruction pattern; concrete design for iterative self-improvement without retraining.

### 5.3.3 Selecting the right pattern for your agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.3.3]]`
- Summary: Table 5.1 maps the four strategies to best-fit use cases: CoT for logic puzzles/math (low cost, not for simple factual queries), ReAct for knowledge-intensive tasks (medium, not when no external tools), ToT for complex planning/games (high, not for time-sensitive apps), and Reflexion for iterative improvement (medium-high, not one-shot questions).
- Key claims: The four strategies cover most problems but all depend on simple LLM, CoT, or ReAct at their base, which can limit implementations; choosing is experience-driven, guided by the table's task/cost/avoidance mapping.
- Learner-relevant: A practical selection rubric for matching reasoning strategy to task characteristics and cost budget.

### 5.4 Utilizing the sequential thinking MCP server
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4]]`
- Summary: Introduces Anthropic's sequential thinking (ST) MCP server as a working-memory scratchpad for reasoning and planning: agents store intermediate thoughts that subsequent steps reread and build on, enabling strategic, revisable plans.
- Key claims: The name is misleading — the server does no thinking, it only provides external storage the agent rereads each step; storing thoughts lets agents create, review, and revise high-level strategic plans across tasks.
- Learner-relevant: The scratchpad architecture pattern that operationalizes section 5.1.3's "plan lives outside the model" claim.

### 5.4.1 Unchaining the sequential thinking server
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4.1]]`
- Summary: Shows how to attach the ST server to an agent via `MCPServerStdio` (npx `@modelcontextprotocol/server-sequential-thinking`) and list the tools it exposes (listing 5.9), including the agent's internal `multi_tool_use.parallel` and the `SequentialThinking` tool. Details the full tool description the agent sees (listing 5.10): thought, next_thought_needed, thought_number, total_thoughts, is_revision, revises_thought, branch_from_thought, branch_id, needs_more_thoughts, plus guidance to revise, branch, backtrack, and verify.
- Key claims: The single ST tool takes JSON describing operations; the tool does not reason itself — it is a scratch pad and thought tracker (other ST implementations do use LLMs to think); with the right instructions, ST supports ReAct and ToT reasoning/execution strategies.
- Learner-relevant: Concrete MCP integration mechanics and the exact tool contract an agent sees, which shapes how instructions must be written.

### 5.4.2 Revisiting time travel problems with sequential thinking
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4.2]]`
- Summary: Rebuilds the hard time-travel riddle agent (listing 5.11) combining the ST MCP server with `travel_back`/`travel_forward` tools and `max_turns=25`. The Traces page (figure 5.6) reveals the internal reason–act–observe rhythm: each ST call is a reasoning step, followed by a tool action, observations, then another thinking call to decide completion.
- Key claims: Each sequential-thinking call is a reasoning step inside the ReAct loop; traces make the otherwise hidden reasoning visible; the answer can still be wrong depending on model — ST is a reasoning aid, not a correctness guarantee.
- Learner-relevant: How to observe an agent's internal reasoning via traces, and that external tools + scratchpad still interleave in the ReAct pattern.

### 5.4.3 Advanced reasoning with sequential thinking
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#5.4.3]]`
- Summary: Combines every pattern in one agent (listing 5.12): CoT for planning, ReAct and ToT for execution/evaluation and branching, and Reflexion via a `how_correct_is_answer` tool that checks against the known 26-day answer. A Reflexion-generated correct plan can then be injected as an example into future prompts (listing 5.13).
- Key claims: Combining patterns is best reserved for complex, ambiguous tasks, not low-latency ones; ToT plus Reflexion is computationally expensive and token-heavy, and results vary strongly with the underlying model; Reflexion again requires knowing the correct answer, but a validated plan can seed future prompts.
- Learner-relevant: The full-stack reasoning recipe and its cost/reliability trade-offs; pattern composition as a design skill rather than a single default.