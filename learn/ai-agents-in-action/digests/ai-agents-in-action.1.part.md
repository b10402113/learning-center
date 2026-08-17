# Chapter 1 — The rise of AI agents

## Overview (L1)
- Chapter 1 — Defines what an AI agent is (perceive–decide–act) and the assistant-vs-agent line drawn along the approval/autonomy axis; introduces the sense-plan-act-learn (SPAL) loop, tools and the Model Context Protocol; frames agent building as five functional layers (persona, tools and actions, reasoning and planning, knowledge and memory, evaluation and feedback); and lays out multi-agent patterns (flow assembly line, hub-and-spoke orchestration, collaboration teams). The closing 1.5 "Next steps" section previews the book's arc: each layer gets a chapter, then MCP, multi-agent systems, the agentic loop, and production systems.

## Sections (L2)
### 1.1 Defining agents and agentic thinking
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1]]`
- Summary: Defines an AI agent as software that perceives its environment, decides what to do, and acts to achieve a goal using LLM resources; contrasts agentic systems with reactive assistants and traces the evolution from direct LLM chat through tools to assistants and agents.
- Key claims: An agent perceives, decides, and acts toward a goal; agentic describes systems exhibiting autonomy in that pattern; autonomy and persistence shift a reactive assistant into an active agent; the design space predates LLMs (rule-based, symbolic, BDI, RL, neuro-symbolic), and LLMs expand what one agent can reason about.
- Learner-relevant: Establishes the working vocabulary (agent, agency, agentic) and the assistant/agent spectrum that later chapters build on.

### 1.1.1 Understanding agent, assistant, and LLM patterns
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.1]]`
- Summary: Distinguishes the four LLM interaction patterns — direct LLM chat, tool-augmented LLM, assistant (per-task approval), and agent (goal-level approval) — and frames the assistant-vs-agent boundary as a spectrum along the autonomy axis.
- Key claims: An assistant uses tools on the user's behalf but requires approval at each step; an agent reasons, plans, and executes multistep work against a higher-level goal; production agents use graduated human-in-the-loop controls (low-risk steps autonomous, high-stakes actions like email/purchases gated); the four patterns map to approval model, autonomy level, and example platforms (Table 1.1).
- Learner-relevant: The approval axis is the reusable criterion for classifying any tool-using system as assistant or agent in later analyses.

### 1.1.2 Thinking like agents: Sense-plan-act-learn
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.2]]`
- Summary: Introduces agency as the ability to decide and use tools, and the sense-plan-act-learn (SPAL) loop agents run to complete multi-task goals; goals decompose into tasks, tasks into tool calls with outputs chainable between calls.
- Key claims: SPAL maps to OODA, BDI, and classic sense-plan-act robotics; sense = input/context processing, plan = LLM reasoning, act = tool execution, learn = output evaluation and memory updates; frontier models now carry built-in reasoning, but prompt/structured reasoning still matters for long-horizon tasks and weaker models (returned to in chapter 4).
- Learner-relevant: SPAL is the core mental model behind the agentic loop; supports explaining how any agent turns a goal into tool sequences.

### 1.1.3 Agents act with tools
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.3]]`
- Summary: Explains that tools are extensions of functions (tool functions) registered with the agent via JSON definitions so the agent knows how and when to call them; covers tool failure handling and why per-agent bespoke tool wrappers were unsustainable.
- Key claims: Tools wrap APIs, databases, and external apps and let the agent act outside its codebase; well-built agents treat tool failures as normal control flow (retry, fall back, ask user, abandon) with bounded retries; protocols like MCP shift tooling from bespoke per-agent libraries to a standardized, discoverable ecosystem of external tool servers.
- Learner-relevant: Grounds the "tool plumbing vs agent behavior" cost argument that motivates MCP and the tools-and-actions layer (1.3.2).

### 1.2 Introducing the Model Context Protocol
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.2]]`
- Summary: Introduces MCP — an Anthropic-developed, JSON-RPC 2.0-based open standard released November 2024 that lets agents connect to external tool servers, discover tools via list_tools, and use them without per-integration code.
- Key claims: MCP is the "USB-C for LLMs and agents"; it solves inconsistent tool access, unreliable data responses, fragmented integrations, code-extensibility limits, implementation complexity, and provides easy-to-build servers plus security/trust controls (transport-layer auth, sandboxing, scoped credentials, human-in-the-loop for high-stakes actions); integration work happens once per service, not once per agent; MCP servers should be treated as trusted dependencies (vet source, pin versions, least privilege).
- Learner-relevant: MCP is a major adoption driver for agents and is studied in depth in chapter 3; anchors the whole agents-connect-to-external-tools theme.

### 1.3 Understanding the five functional layers of an agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3]]`
- Summary: Frames agent capability as five functional layers — persona, tools and actions, reasoning and planning, knowledge and memory, and evaluation and feedback — which organize the first half of the book.
- Key claims: Core layers (persona, tools and actions, reasoning and planning) are essential for most agents; the layers are not invoked in a fixed order but interact continuously within the agentic loop; the diagram organizes capabilities, not runtime call order.
- Learner-relevant: The five layers become the organizing scaffold for every later node/step about building agents.

### 1.3.1 The agent persona
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.1]]`
- Summary: Describes the persona layer as the base role and instructions (often the system prompt) that guide how an agent completes tasks, including role, expertise, communication style, domain focus, and constraints.
- Key claims: Personas can be handcrafted, LLM-assisted (one model writes/refines for another), or optimized via data-driven techniques such as evolutionary algorithms; persona shapes reasoning, planning, knowledge access, and how results are communicated.
- Learner-relevant: Basis for writing effective system prompts and for comparing human-formulated vs AI-formulated personas.

### 1.3.2 Agent tools and actions
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.2]]`
- Summary: Covers the tools and actions layer that lets agents interact with and change the external world, powering the higher layers.
- Key claims: Tools categorize into task completion, context retrieval, reasoning and planning, knowledge and memory, and feedback/evaluation; context retrieval tools (search, vector store, file reads, read-only APIs) fetch grounding info without changing external state, distinct from knowledge/memory tools (persistent stores) and task completion tools (world actions); tool use can be driven by planning, memory recall, and evaluation/feedback.
- Learner-relevant: Defines the tool taxonomy used when designing which tools an agent needs per goal.

### 1.3.3 Agent reasoning and planning
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.3]]`
- Summary: Explains when model-native reasoning suffices vs when structured reasoning patterns are worth adding, and introduces single-path vs multipath planning plus external planners.
- Key claims: Model-native reasoning suffices for short-horizon tasks (1–3 steps), small tool surfaces, low-cost reversible errors, frontier models in their strong domains; structured reasoning pays off for long-horizon/branching tasks, many tools, expensive or irreversible errors, out-of-domain tasks, auditability needs, or shallow models; always layer reasoning on top for safety-critical or regulated tasks; single-path is fast/cheap but fragile, multipath (e.g., tree-of-thought) is better for hard tasks but costs more tokens/latency; external planners coordinate step sequencing outside the executing agent; specific patterns (chain-of-thought, ReAct, Reflexion) covered in chapter 5.
- Learner-relevant: Provides the decision rule for when to add reasoning structure — directly reusable when designing any non-trivial agent.

### 1.3.4 Agent knowledge and memory
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.4]]`
- Summary: Distinguishes knowledge (static external info) from memory (dynamic experiential info), covers storage formats, the context-window constraint, and retrieval-augmented generation (RAG) as the surfacing pattern.
- Key claims: Knowledge is curated external material (documents, manuals, schemas, repos), same for all users; memory is dynamic, user/session-scoped experience (conversations, preferences, past decisions); conversational memory splits into short-term (context window) and long-term (persisted, selectively retrieved); context-window management is a central architectural decision — longer contexts cost more, slow inference, and degrade reasoning; RAG (retrieve-then-generate) now underpins knowledge, memory, and hybrid stacks; knowledge typically lives in vector stores/search indexes/graph DBs, memory in session stores/key-value caches/per-user DBs.
- Learner-relevant: The knowledge-vs-memory distinction and context-window tradeoffs anchor later memory architecture and RAG work.

### 1.3.5 Agent evaluation and feedback
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.3.5]]`
- Summary: Presents evaluation and feedback as the hardening layer that improves response accuracy and robustness, including the LLM-as-judge pattern and actor-critic arrangements.
- Key claims: LLM-as-judge uses a separate model to score/critique output against a rubric; internally, evaluation and feedback run in the learn phase of the agent loop; mechanisms include evaluator tools, other agents acting as tools/handoffs, input/output guardrails, and a dedicated critic in an actor-critic arrangement; also enabled by explicit agent workflow forms.
- Learner-relevant: Establishes quality-assurance mechanisms to reuse when judging agent output and designing self-correcting systems.

### 1.4 Advancing to multi-agent systems
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4]]`
- Summary: Motivates multi-agent systems and previews the three main connection patterns — flow assembly line, hub-and-spoke orchestration, and collaboration teams.
- Key claims: Multi-agent systems exist for four reasons — specialization (focused agents outperform an everything-agent), parallelism (concurrent workloads finish faster), context management (each agent holds only its slice of a problem), and inherently multi-agent problems (social simulations, negotiations, red/blue teams).
- Learner-relevant: The four motivations are the reusable justification for choosing multi-agent over single-agent designs.

### 1.4.1 The agent flow assembly line
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4.1]]`
- Summary: Describes the agent flow pattern, where specialized agents are arranged like an assembly line, each passing work along.
- Key claims: Agents coordinate via shared threaded conversation, a blackboard workspace with named keys, or chaining output from one agent to the next; chaining is simplest to implement and reason about and often the right default — more shared context is not always better; the pattern suits well-defined, multistep tasks with designated roles and is ideal when a single agent struggles with a chain of work.
- Learner-relevant: The three coordination styles (threaded/blackboard/chained) are the core vocabulary for designing any sequential multi-agent pipeline.

### 1.4.2 Agent orchestrations (hub-and-spoke)
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4.2]]`
- Summary: Introduces orchestration, where a central hub agent plans and delegates tasks to specialized worker agents, controlling all input and output through one agent.
- Key claims: A single tool-using agent can be transformed into an orchestrator that uses worker agents as tools; benefit is centralized control of input/output; drawback is that workers are tightly restricted and limited to communication through delegation (no free feedback or evaluation).
- Learner-relevant: Hub-and-spoke is the upgrade path when one agent is overloaded or must handle multiple goals; basis for the OpenAI Agents SDK orchestration focus later in the book.

### 1.4.3 Agent collaboration (teams of agents)
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.4.3]]`
- Summary: Describes collaboration teams where agents interact as peers with back-and-forth communication, each with a role and team function, sometimes with a manager agent acting as a user proxy.
- Key claims: Collaboration solves very complex problems and can generate new thoughts and ideas (even via evolutionary algorithms), but is chatty, repetitive, less efficient, and potentially costly; cost/latency/token spend vs capability tradeoffs apply to every pattern — prefer the cheapest pattern that meets the requirement; patterns can be mixed, and the book's focus (OpenAI Agents SDK) handles flow and orchestration well.
- Learner-relevant: Collaboration is the counterpoint to orchestration — peers with feedback vs delegated workers — and grounds cost-aware pattern selection.