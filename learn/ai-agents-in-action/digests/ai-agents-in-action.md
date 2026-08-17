---
source: ai-agents-in-action
source_hash: fa3c16683caf653472799d4206384b155c8962f449df59625504ef4c9616d02e
source_lines: 20154
created: 2026-08-17
updated: 2026-08-17
---

# Digest — ai-agents-in-action
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
# Chapter 2 — Core components: LLMs, prompting, and agents

## Overview (L1)
- Chapter 2 — Teaches the three foundations of an agent: the LLM as a probabilistic token predictor (tokens, training, sampling parameters), prompt engineering for a reliable agent persona (techniques, thinking like an LLM, pitfalls), and the OpenAI Agents SDK (minimal agent, model/params, typed outputs, tracing). Closes by giving agents agency through internal tools and tracing tool chains. Section 2.5 Exercises (not an L2 section here) offers five hands-on drills: minimal agent, temperature tuning, typed output, prompt refinement, and tool + tracing.

## Sections (L2)
### 2.1 Understanding large language models
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1]]`
- Summary: Frames LLMs as probabilistic token machines: text becomes tokens, the model outputs a probability distribution over the next token, and a separate sampling/decoding step picks the output token. Covers training (next-token prediction, backpropagation) and the alignment phase (RLHF), then explains what a token is and which generation parameters (temperature, top-p, max_tokens, penalties) shape sampling.
- Key claims: LLMs consume and produce text via probabilities of the next token, recomputed from scratch each forward pass through attention/MLP weights, not a lookup table; RLHF teaches instruction-following, not knowledge or reasoning; raw text length does not equal token length (JSON inflates token counts); output tokens cost 2–5× input tokens; generation parameters influence but never strictly control output.
- Learner-relevant: Provides the mental model for why prompts must be written around tokens and probabilities — the anchor for all prompt and agent tuning decisions later.

### 2.1.1 LLMs: Probabilistic token machines
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1.1]]`
- Summary: Explains the full training/inference cycle: tokenization into vocabulary indices, next-token probability prediction, sampling, and generation until an EOS token. Training corrects via loss/backpropagation; alignment via RLHF adds instruction-following without improving reasoning.
- Key claims: The model produces the same distribution for a given input — the decoding strategy (greedy, top-k, nucleus) picks the token; capability lives in learned weights of attention and MLP layers; inference streams tokens quickly, creating the "illusion of intelligence."
- Learner-relevant: Establishes that LLMs must be treated as next-token predictors, motivating token-aware prompting and the sampling controls in 2.1.3.

### 2.1.2 What is a token?
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1.2]]`
- Summary: Defines tokenization and shows via a JSON-vs-text comparison that text length is a poor proxy for token count, since punctuation and structure inflate tokens. Introduces token cost modeling and measurement tools.
- Key claims: Equivalent JSON text can tokenize to ~2× the tokens of plain text; providers price input and output tokens separately, with output 2–5× more expensive; tiktoken measures token counts, and the OpenAI Agents SDK reports per-interaction token counts; more input tokens tend to increase output uncertainty.
- Learner-relevant: Gives a concrete cost/overhead lens for designing prompts and tool descriptions that the reader will apply in 2.4.

### 2.1.3 Tuning temperature, top-p, and more
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.1.3]]`
- Summary: Catalogues the sampling parameters that change model behavior: temperature (scales token probabilities), top-p/nucleus (keeps the smallest token set covering cumulative probability p), max_tokens (hard ceiling), presence_penalty and frequency_penalty (discourage repetition). Notes they are distinct from API settings like auth and retries.
- Key claims: Higher temperature = more creativity/less accuracy, lower = more deterministic/repetitive; temperature 0 reduces but never eliminates variation; parameters influence rather than impose, and temperature and top-p interact unpredictably so providers recommend adjusting only one; seed gives reproducible output for debugging; in practice only temperature (per agent role) and max_tokens are commonly tuned.
- Learner-relevant: Supplies the knob selection rationale used to configure role-specific agents in 2.3.2 (e.g., coder vs. creative writer agents).

### 2.2 Controlling LLMs with prompt engineering (agent persona)
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2]]`
- Summary: Positions prompt engineering as the practical work of building the agent's core functional layer (the persona from chapter 1) — making agents predictable, productive, and cheap. The surface area shrank as models improved, but the core skill of writing clear, well-structured prompts remains.
- Key claims: Prompt engineering is how you make agents predictable and keep costs down; universal techniques exploit shared training patterns so prompts can move across LLMs unchanged; structured, delimited prompts beat unstructured ones in consistency.
- Learner-relevant: Sets up the prompt techniques and pitfalls that shape every agent built later in the book.

### 2.2.1 Applying core prompt techniques
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2.1]]`
- Summary: Walks through ten essential techniques (Table 2.2): clear persona, front-loaded instructions with delimiters, specificity, exact output format, few-shot examples, chain-of-thought, positive instructions, eliminating ambiguity, model/settings choice, and iterate-and-refine. Shows a complete research agent prompt (Listing 2.1) applying most of them, plus a prompt-caching note.
- Key claims: Switching persona strings creates researcher/critic/planner agents without code changes; delimiters add tokens but improve consistency; prompt caching charges a fraction of input rate on cache hits, and putting stable content first can cut input costs up to 90%; structured data improves loss feedback because it is easy to evaluate and critique.
- Learner-relevant: Provides a reusable checklist the learner can apply to write or audit agent prompts.

### 2.2.2 Thinking like an LLM
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2.2]]`
- Summary: Advises writing prompts as if instructing a new hire with no background: avoid assumptions, be specific, and describe the task, constraints, and even full decision workflows the way you want them executed. Shows a search workflow as an agent prompt (Listing 2.2) with personas, decisions, metrics, examples, and consolidated output.
- Key claims: You can describe entire workflows with decision points in a prompt and an LLM will execute them; LLMs often exit described loops within three tries while an agent keeps looping until the goal is complete or unattainable; asking an LLM to help craft prompts is a useful exercise.
- Learner-relevant: Gives a mental stance (instruct like a human novice) for composing prompts the learner will use when building agents.

### 2.2.3 Avoiding common prompt pitfalls
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.2.3]]`
- Summary: Covers Table 2.3's six over-engineering pitfalls: too complicated, contradictory, too simple, inconsistent delimiters, overly explicit, and variable output — each with a solution, such as splitting into role-specific prompts, reading the prompt as the model, consolidating micro-tasks, and adopting one delimiter style.
- Key claims: Over-complicated prompts overwhelm context, raise cost, and create conflicting instructions; temperature 0 only reduces variability — consistency also needs explicit instructions, delimiters, and no contrary rules; break up large prompts into smaller tasks rather than perfecting a "masterpiece" prompt.
- Learner-relevant: Offers a failure-mode checklist to debug unreliable agent behavior before blaming the model.

### 2.3 Building an agent with OpenAI Agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3]]`
- Summary: Introduces the OpenAI Agents SDK as the book's agent framework of choice, noting that protocols like MCP and A2A provide a common foundation for agent-tool and agent-agent interaction. The SDK is described as light, extensible, and flexible, benefiting from lessons of earlier frameworks.
- Key claims: Many agent frameworks exist but share MCP/A2A foundations; the OpenAI Agents SDK will be the pattern for all agents in the book; it handles much prompting automation (e.g., output formats) that raw prompt engineering used to require.
- Learner-relevant: Anchors the learner to the exact tooling stack used in the book's hands-on examples.

### 2.3.1 Building a minimal agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.1]]`
- Summary: Builds the first agent (Listing 2.3): a research planning assistant that outputs a five-step plan via `Agent` + `Runner.run_sync`, with instructions in the prompt and the result printed from `final_output`. Shows expected output (Listing 2.4).
- Key claims: A minimal agent is just an `Agent` with a name and instructions run through the `Runner`; the response adheres to the prompt's constraints (5 tasks, ≤5 words each); code and setup live in the book's GitHub repo.
- Learner-relevant: Gives the learner the minimal working skeleton that all later examples extend.

### 2.3.2 Setting the agent model and other parameters
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.2]]`
- Summary: Shows how to pin a model (`model="gpt-4.1"`) and set `ModelSettings` — temperature 0, max_tokens, top_p, frequency/presence penalties — to make planning consistent across runs. Includes a note that reasoning models expose a reasoning-effort parameter usually best set to none/minimal for routine agent steps.
- Key claims: Temperature 0 picks the highest-probability token, producing near-identical plans across runs; temperature 0 reduces but does not eliminate variation, and longer outputs vary more; without an explicit model, the SDK defaults to the provider's current model; high reasoning effort adds latency and token cost without changing routine answers.
- Learner-relevant: Connects the 2.1.3 sampling knobs to real agent code and role-appropriate model configuration.

### 2.3.3 Controlling inputs and typed outputs
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.3]]`
- Summary: Uses Pydantic `BaseModel` and `output_type` to force the agent to return structured JSON, protecting multi-agent workflows from stochastic response variability. Shows the strict-JSON failure when using `dict[int, str]` and the fix via a `TypedDict` plus `ConfigDict(extra='forbid')`.
- Key claims: Typed outputs feed downstream agents without variability breaking the workflow; strict JSON schema is enabled by default and rejects non-strict types like `dict[int, str]`; the preferred fix is a strict `TypedDict`, avoiding `strict_json_schema=False` which invites hard-to-find bugs; typing removes the need to specify output format in the prompt, simplifying prompts.
- Learner-relevant: Demonstrates the core reliability technique (strong typing) the learner will reuse across agent workflows.

### 2.3.4 Tracing agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.3.4]]`
- Summary: Explains that tracing is on by default with the OpenAI API and shows the Traces dashboard, including per-call inputs, model, tokens, instructions, and output. Shows wrapping execution in `with trace("Deep Research Workflow")` to name workflows. Notes open-source alternatives (LangSmith, Langfuse, Arize Phoenix, W&B Weave) for production or multi-provider setups.
- Key claims: Tracing works out of the box with the OpenAI API and requires it to view results; named `trace` contexts group agent runs for inspection; typed-output agents render as JSON responses in the trace; external tracing layers are usually the right choice for production/regulated/multi-provider environments.
- Learner-relevant: Gives the learner a built-in observability loop for debugging their own agent runs.

### 2.4 Enhancing agents through tool integration
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.4]]`
- Summary: Argues that true agents need agency — the ability to make and execute decisions — and that the easiest way to grant it is tools. Points out that the research planner so far is just a prompt step (prompt chaining), not an agent, until tools are added.
- Key claims: Agents work best with agency; a prompt-only workflow is viable and called prompt chaining; providing tools lets the agent decide when and where to use them.
- Learner-relevant: Frames the step from prompt step to agent that the following sections operationalize.

### 2.4.1 Providing agents with tools
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.4.1]]`
- Summary: Distinguishes tools (capabilities available to an agent) from actions (what the agent does with them) and shows how to expose an internal function with the `@function_tool` decorator and register it via `tools=[...]`, prompting the agent to use it. Details tool cost/complexity trade-offs and failure patterns.
- Key claims: Tools can be code functions, MCP-hosted services (local or remote over HTTP), or handoffs to other agents; registering a tool sends its JSON description on every LLM call whether used or not; tools add overhead, complexity, failure surface, and decision-making power — so limit tools to what the agent needs and plan retries with backoff, structured error returns, fallbacks, and timeouts; never grant tools whose misuse you can't tolerate (e.g., file deletion).
- Learner-relevant: Gives the safety/cost discipline the learner must apply when equipping any agent with capabilities.

### 2.4.2 Tracing agentic tool use
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#2.4.2]]`
- Summary: Extends the agent with a second dependent tool (`get_resource_url`), demonstrating tool chaining, and shows how the OpenAI Traces page exposes every tool call and LLM interaction, including order, timing, inputs, and outputs.
- Key claims: Tool chaining occurs when one tool's output drives another tool's input, often decided by the agent itself; frontier models can issue independent tool calls in parallel within one turn, cutting latency; tracing tracks all agent calls to tools and the LLM, revealing the decision path and performance bottlenecks; using a non-OpenAI API requires registering for the API and a key to view traces.
- Learner-relevant: Teaches the learner how to inspect and debug multi-tool agent behavior in practice.
# Chapter 3 — Actions with Model Context Protocol

## Overview (L1)
- Chapter 3 — Introduces the Model Context Protocol (MCP), the "USB-C for agents and LLMs" that standardizes how agents connect to tools, data sources, and other agents. Covers MCP fundamentals (the standardization problem it solves, its three-part architecture, and its tool/resource/prompt primitives), getting started (coding an MCP server for Claude Desktop, the MCP inspector, STDIO vs SSE transports), using MCP servers with the OpenAI Agents SDK (local, SSE, and standard reference servers), and building MCP servers by converting in-process tools into standalone, reusable servers. The chapter's exercises (3.5) cover installing and inspecting a first MCP server, calling a server from an agent over STDIO, flipping to SSE, wrapping the filesystem server, and packaging an agent as a reusable MCP tool.

## Sections (L2)
### 3.1 Understanding MCP fundamentals for agent development
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1]]`
- Summary: Explains what MCP is, why it exists, and how it changes agent building; describes the pre-MCP pain points, the three-part MCP architecture, the three capability primitives, deployment patterns, and how MCP maps onto the functional agent layers.
- Key claims: MCP is an open Anthropic standard based on JSON-RPC 2.0 for connecting AI systems to external services consistently, securely, and efficiently; pre-MCP agent development suffered from fragmented tool integration, inconsistent data access, complex multi-agent orchestration, and uneven security/control; the ecosystem has three components — client, server, and the underlying service (a term of the authors, not an MCP-defined word).
- Learner-relevant: Provides the "why" and the mental model for every later MCP node (architecture, components, deployment, agent layers), anchoring the tool-work from chapter 2 into a protocol.

### 3.1.1 The standardization problem MCP solves
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.1]]`
- Summary: Walks through the four pre-MCP challenges developers faced when building agents and LLM applications, and states how MCP resolves them.
- Key claims: Fragmented tool integration meant rewriting a tool's JSON schema, parameter typing, result handling, and response-parsing per provider (work scales worse than linearly across providers); inconsistent data access required bespoke per-source interfaces for filesystems, databases, and web APIs; no standard existed for one agent to expose capabilities to another; security and control measures were hard to apply consistently across non-standardized tools. MCP unifies these so agent development becomes assembling standardized components.
- Learner-relevant: Establishes the value proposition that justifies MCP adoption; supports a "why standardize" node comparing MCP to ad-hoc tool integration.

### 3.1.2 MCP architecture: Clients, servers, and services
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.2]]`
- Summary: Draws the USB-C analogy, shows the many-connector problem, and defines the three-component MCP architecture with a client, server, and service.
- Key claims: An agent connects to an MCP server that wraps a service, and the protocol handles integration plumbing — removing per-provider schema and call-format work, though security/authentication, error handling, versioning, and availability remain real production concerns; the client connects to servers and uses discovery to find tools/resources; the server handles requests and returns responses via JSON-RPC 2.0; the service is the underlying application/resource (file ops, DB queries, web search, other agents). Clients include agents, LLM applications, Claude Desktop, and VS Code.
- Learner-relevant: Gives the vocabulary (client/server/service) used throughout the rest of the book; a node can compare MCP's three-part split to direct tool-calling.

### 3.1.3 Core components: Tools, resources, and prompts
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.3]]`
- Summary: Defines the three capability primitives an MCP server can expose, and clarifies who decides when each is used.
- Key claims: Tools are actionable capabilities an agent or LLM invokes for external tasks and are generally the primary component; resources represent external databases, files, configurations, or entities LLMs/agents consume; prompts are pre-defined templates that standardize interactions with workflows. Tools are model-controlled (the agent decides when to invoke), while resources and prompts are user/application-controlled — this is why the three are separate categories; wrapping resource/prompt functionality inside a tool is a workaround, not a substitute. The OpenAI Agents SDK only supports tools, which can take on the roles of the others.
- Learner-relevant: Distinguishes the primitives that recur in MCP usage; a node can anchor the model-controlled vs user-controlled distinction for tool-design judgment.

### 3.1.4 MCP deployment patterns for agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.4]]`
- Summary: Covers the ways MCP servers connect to agents: local (STDIO), remote (SSE over HTTP), and hybrid mixes, including agent-to-agent communication via remote servers.
- Key claims: Local deployment uses STDIO streams (low latency, no network overhead, simple process management, ideal for development); remote deployment uses SSE over HTTP (distributed architectures, shared tool servers, cloud-native scaling, multitenancy, load balancing); hybrid deployments combine local servers for sensitive operations and remote servers for shared services. A single server is either local or remote — "hybrid" means an agent connects to a mix of servers simultaneously, treated uniformly at the protocol level. MCP is not just for agents; LLM applications use it too.
- Learner-relevant: Provides the deployment taxonomy that later nodes reference when choosing STDIO vs SSE for a given agent architecture.

### 3.1.5 MCP powers the functional agent layers
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.1.5]]`
- Summary: Shows how MCP-hosted tools support all four functional agent layers from chapter 1, not just tools and actions.
- Key claims: Tools and actions layer — GitHub, Slack, filesystem servers; reasoning and planning layer — sequential thinking server (canonical), memory-aware and graph-of-thought servers; knowledge and memory layer — Postgres, vector databases (Qdrant, Turbopuffer), Google Drive, memory servers; evaluation and feedback layer — LLM-as-judge, eval frameworks, approval-routing servers for human-in-the-loop.
- Learner-relevant: Links MCP to the chapter-1 functional-layer model, useful for a node that maps capabilities to agent architecture and for choosing servers by layer.

### 3.2 Getting started with MCP servers
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2]]`
- Summary: Introduces Claude Desktop as a teaching environment for MCP, notes the breadth of MCP support by 2026, and sets up the remaining 3.2 subsections that build, install, and inspect a first server.
- Key claims: Claude Desktop is free, matches the web version, and natively connects to MCP servers from the local machine; by 2026 MCP support extends to ChatGPT, Gemini, and major IDEs/frameworks (Cursor, VS Code, Claude Code, Windsurf, Vercel AI SDK) — the protocol transfers across clients while the configuration surface and supported primitives differ.
- Learner-relevant: Positions Claude Desktop as a safe place to run MCP servers and observe LLM tool use before moving to agent code.

### 3.2.1 Coding up an MCP server for Claude
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.1]]`
- Summary: Wraps the chapter-2 `get_research_sources` tool in a FastMCP server, installs it into Claude Desktop with the MCP CLI, and runs it inside a Claude conversation.
- Key claims: `FastMCP("...")` creates a preconfigured server; the `@mcp.tool()` decorator registers a function's signature, docstring, and return type into the tool schema — the signature becomes the parameter list, the docstring becomes the agent-facing description, so docstrings are prompts, not human documentation; `mcp install <file>` adds the server to Claude's config; Claude Desktop prompts the user to allow tool execution (a safety feature agents lack) and the LLM annotates tool output on its own.
- Learner-relevant: The concrete pattern for exposing a tool as an MCP server — a step node can build and run a first server and observe how docstrings drive tool selection.

### 3.2.2 Using the MCP inspector
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.2]]`
- Summary: Presents the MCP inspector as the first debugging tool for MCP servers — it shows live tool schemas, calls tools with arbitrary arguments, and surfaces raw JSON-RPC traffic and initialization errors.
- Key claims: `mcp dev {absolute path}` launches the inspector (proxy on port 6277, UI at http://127.0.0.1:6274); the inspector reveals the live tool list with descriptions, parameters, and return types exactly as the agent sees them, verifies response shapes, and exposes where a call fails; a local server appears as STDIO transport — transport is determined by server configuration, not by uv (the package runner that starts the process).
- Learner-relevant: Debugging skill for verifying that a decorator-generated schema matches intent before wiring agents to a server; anchors tool-validation practice.

### 3.2.3 Understanding MCP transport types
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.3]]`
- Summary: Compares the two MCP transports, STDIO and SSE, in terms of how they work and when each should be used.
- Key claims: STDIO — client launches the server as a subprocess on the same host and exchanges JSON-RPC 2.0 over stdin/stdout pipes; low latency but strictly one-to-one; best for local dev, CLI experiments, interactive containers, and simple process-to-process integration. SSE — server runs as an HTTP service; clients POST to /messages and receive streaming responses over a long-lived text/event-stream connection; half-duplex but network-addressable, multiclient, and firewall-friendly; best for remote/cloud deployments, browser apps needing real-time streaming, reverse proxies, and load balancers.
- Learner-relevant: Decision knowledge for choosing transports in later agent-workflow nodes; the core distinction between subprocess and HTTP hosting.

### 3.2.4 From desktop to agents: The key differences
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.2.4]]`
- Summary: Distinguishes an assistant (Claude Desktop) from an agent, and lays out the security posture required once autonomy and loops enter the picture.
- Key claims: The difference is autonomy and the loop, not permission prompts (a security pattern, not an architectural one) — an assistant takes one request, acts, and stops, while an agent loops through tool calls, observations, and next decisions toward a goal; agency raises tool-design stakes because one wrong tool call can chain into many mistakes; production agents pair MCP with defense-in-depth: tool allowlisting, sandboxing, output validation, rate limiting/budget caps, and human-in-the-loop checkpoints. Rogue-agent risks include destructive actions, data exfiltration, privacy violations, cost runaways, and prompt injection through tool outputs (called the highest-leverage attack on agents in 2026).
- Learner-relevant: Foundational for a node on agent safety/tool governance, and on when agents vs assistants differ in MCP tool execution.

### 3.3 Using MCP servers for agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3]]`
- Summary: Maps the ways agents construct and consume MCP servers (subprocess internal tools, local external tools, remote tools, remote external agents) and weighs the cost of the protocol layer.
- Key claims: MCP servers may run as a subprocess via STDIO, external but same-machine via SSE, or remote/cloud via SSE over HTTP; table 3.2 lists the four use cases (subprocess internal tools, local external tools, remote tools, remote external agents); MCP adds a server process, client connection, and protocol layer — extra latency and a failure mode — so reach for MCP when a tool is genuinely external/shared and prefer in-process calls for internal logic; "internal MCP for everything makes for clean architecture diagrams and noisy production systems."
- Learner-relevant: Provides the cost/benefit rule of thumb for when to adopt MCP vs in-process tool calls in an architecture.

### 3.3.1 Using agents with local MCP servers over STDIO
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3.1]]`
- Summary: Shows launching a Python MCP server as a subprocess from the OpenAI Agents SDK using `MCPServerStdio`, and highlights MCP's language-agnosticism.
- Key claims: `MCPServerStdio(name=..., params=MCPServerStdioParams(command="mcp", args=["run", str(SCRIPT)]))` starts the server as a subprocess for the lifetime of the `async with` block, and the agent consumes it via `mcp_servers=[...]`; lifecycle (startup/shutdown) is managed within the agent service; MCP is language-agnostic at the wire level — a Python agent can consume a Node.js server launched with npx without bindings or cross-language plumbing, making MCP a portable integration layer rather than framework lock-in.
- Learner-relevant: Core consumption pattern for local servers; supports a node on cross-language agent integration via the protocol.

### 3.3.2 Using local MCP servers over SSE with agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3.2]]`
- Summary: Runs a FastMCP server as an HTTP server and connects an agent to it via `MCPServerSse`, showing that transport switching is a near drop-in change.
- Key claims: `mcp run -t sse 01_claude_mcp_server.py` runs the same FastMCP file as an HTTP/SSE server (default is STDIO in-process, SSE when run externally); the agent side swaps `MCPServerStdio` for `MCPServerSse` with a `url` param pointing at the SSE endpoint; keeping the server running lets multiple agents connect; the change is essentially a constructor swap plus a URL.
- Learner-relevant: Establishes the flexibility to move between transports, a theme used when deploying shared servers in later nodes.

### 3.3.3 Connecting to the standard MCP servers
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.3.3]]`
- Summary: Reviews Anthropic's reference MCP servers (Filesystem, Sequential thinking, Google Drive/Calendar, Todoist, Notion, Slack, Brave Search, GitHub, Google Maps, Fetch), installable via npx, and demonstrates consuming the Filesystem server.
- Key claims: Standard servers provide immediately usable tools, run via single `npx` commands; the Filesystem server is a Node.js package (requires Node.js/npm) granting secure read/write file access within a folder; wrapping it with `MCPServerStdio` (command `npx`, args including the server package and folder path) gives the agent file operations — so isolate the folder you expose; always validate and understand what a server can do on the agent's behalf, since an agent may not interpret "help" safely.
- Learner-relevant: A catalog node can map standard servers to use cases and cover the practical safety caveat of filesystem grants.

### 3.4 Building MCP servers for agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.4]]`
- Summary: Introduces a time-tracker agent whose `record_event` and `load_journal` tools use an in-memory journal as scratchpad memory, setting up the conversion to an MCP server in the following subsections.
- Key claims: A scratchpad/journal/memory pattern lets agents record and later retrieve state across fresh invocations, preventing context overload; the module-level in-memory list works for a single agent in a single process but becomes shared state across all agents once hosted on an MCP server over SSE — a deliberate single-agent choice, not the right shape for multi-agent deployments.
- Learner-relevant: Introduces scratchpad memory (linked to chapter 6 memory) and the shared-state caveat that matters when scaling tools to servers.

### 3.4.1 Converting tools to an MCP server
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.4.1]]`
- Summary: Splits the agent and its tools into two files, wrapping the tools in a FastMCP server, and explains the architectural shift this separation creates.
- Key claims: Replacing the `@function_tool` decorator with `@mcp.tool()` moves tools into a standalone MCP server (`mcp.run(transport="sse")` when run on its own); before the rewrite agent and tools shared a module, process, and implementation; after it, they communicate only through the protocol — the agent sees a name, description, schema, and return type and cannot reach the implementation, so the journal could be swapped for Postgres/Redis/API without changing agent code; that interface contract makes tools composable across agents, replaceable across deployments, and shareable across teams.
- Learner-relevant: The canonical "tools to MCP server" conversion pattern and the separation-of-concerns argument for it — reusable in a hands-on node.

### 3.4.2 Consuming MCP servers locally or remotely
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#3.4.2]]`
- Summary: Consumes the converted time-tracker MCP server from an agent both over STDIO (subprocess) and over SSE (separate process), and explains the shared-state behavior that results.
- Key claims: STDIO consumption uses `MCPServerStdio` with the `mcp run` subprocess; SSE consumption runs the server standalone in another terminal and connects via `MCPServerSse` with the URL — otherwise the agent code is identical; running over SSE means the server process persists, so multiple agents (or the same agent repeatedly) share and update the in-memory journal, which can produce duplicate journal entries; MCP thus delivers separation of code, code reuse, and code isolation, and encourages thinking of tools as sets wrapped in servers.
- Learner-relevant: The two consumption modes plus the practical shared-state consequence — a node on concurrency/shared state in server-hosted tools.
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
# Chapter 6 — Working with memory and knowledge (RAG)

## Overview (L1)
- Chapter 6 teaches retrieval-augmented generation (RAG): how agents move beyond their static training data by retrieving external knowledge and memory into context. It covers retrieval fundamentals and RAG basics (6.1), vector databases and semantic similarity search with TF-IDF and embeddings (6.2), building practical vector and hybrid-search RAG agents with grounding and references (6.3), and adding memory to agents via MCP with graph stores, hybrid memory, augmentation, and compression (6.4). A short 6.5 Exercises section (TF-IDF, embeddings, Chroma persistence, and vector/hybrid RAG agent builds) plus a chapter summary close the chapter — it is noted here rather than as a section entry.

## Sections (L2)
### 6.1 Understanding retrieval in AI applications
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1]]`
- Summary: Defines retrieval as the mechanism for pulling knowledge or memories from external, long-lived storage into a bounded per-call context window, and distinguishes knowledge (static documents, DB tables) from memory (conversation threads, user facts, agent experiences) with their storage formats and retrieval mechanisms.
- Key claims: retrieval is the bridge between unbounded external storage and bounded per-call context (context windows ~200K to 1M+ tokens); knowledge and memory are both external sources that rely on retrieval; augmentation is feeding retrieved info into the prompt; combined retrieval + augmentation = RAG.
- Learner-relevant: anchors the "why agents need knowledge" story — training cutoffs, stateless reasoning — that motivates all later RAG and memory nodes.

### 6.1.1 The basics of RAG
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.1]]`
- Summary: Explains the two-phase RAG pipeline (ingestion and retrieval) and the vector database concept. The embedder and the LLM are two different models doing two different jobs: encoding text into vectors for similarity search vs. generating the final response.
- Key claims: RAG = two phases (ingest: load → chunk → embed → store; retrieve: embed query → find similar chunks → augment prompt); vector databases answer "most similar vectors" not "exact row lookups"; dense vectors (384–3,072 floats) pack semantic meaning; popular vector DBs (2026) include Pinecone, Qdrant, Weaviate, Turbopuffer, pgvector; agents with a training cutoff need RAG to answer anything current (prices, weather, recent policy).
- Learner-relevant: establishes the canonical RAG pipeline and vocabulary used throughout the chapter and the subject's later nodes.

### 6.1.2 Delving into semantic search and document indexing
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.2]]`
- Summary: Explains how document indexing makes content semantically recoverable and how semantic search matches by meaning rather than surface keywords, plus three named pitfalls of semantic search.
- Key claims: semantic search eliminates keyword construction and synonym lists; pitfalls: (1) semantic similarity ≠ semantic correctness (retrieval has no view into truth), (2) fixed top-K (typically 5–10) drops rank-11+ relevant content, (3) vector search is approximate (ANN trades accuracy for speed).
- Learner-relevant: supplies the caveats needed to reason about retrieval quality and later justify hybrid search.

### 6.1.3 Applying vector similarity search
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.1.3]]`
- Summary: Walks through TF-IDF vectorization (with worked TF/IDF/TF-IDF calculations), cosine similarity for comparing document vectors, and a first similarity demo with a pairwise cosine-similarity matrix.
- Key claims: TF-IDF measures term importance, not meaning ("vehicles" won't match "cars"); cosine similarity = cosine of the angle between vectors, ignores magnitude, returns –1 to 1 (distance 0–2); cosine works on TF-IDF in practice but suffers false matches on extremely sparse vectors; TF-IDF gives human-readable dimensions vs. learned embedding dimensions.
- Learner-relevant: the concrete, worked math foundation for understanding what embeddings and vector search improve on.

### 6.2 Vector databases and similarity search
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2]]`
- Summary: Shows how vectorized documents are stored and searched: an in-memory vector database replica in Python (TF-IDF vectors + cosine similarity search returning top-n matches), transitioning into the need for embeddings that preserve semantic meaning.
- Key claims: vectorization dictates the measure of semantic similarity; storing document vectors in an array enables ranked cosine search; TF-IDF search matches words/phrases but misses context and meaning, motivating embeddings.
- Learner-relevant: bridges the TF-IDF demo to the embedding-based stores used by all real RAG agents.

### 6.2.1 Demystifying document embeddings
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2.1]]`
- Summary: Explains what embedding networks are, why TF-IDF is still a useful signal, and demonstrates generating and visualizing OpenAI embeddings (1536-dim vectors reduced via PCA to 3D to show semantic grouping).
- Key claims: TF-IDF is fast/predictable for exact terms but can't match by meaning; strongest production retrieval combines TF-IDF/BM25 with semantic embeddings (hybrid); embedding nets learn to encode meaning into geometry by predicting context; embedding dimensions have learned meanings (interpretable via relationships, not individual values); OpenAI embeddings are standard for general semantic similarity; for domain accuracy, evaluate multiple embedding models against your data.
- Learner-relevant: explains the mechanism behind semantic similarity and motivates evaluating embedding choices.

### 6.2.2 Querying document embeddings from Chroma DB
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.2.2]]`
- Summary: A complete local example using Chroma DB: embedding documents, adding them to a collection, and querying with cosine distance scores instead of similarity.
- Key claims: Chroma DB is an excellent local vector store for dev/small-scale projects; Cosine Distance = 1 − Cosine Similarity (0 = most similar, 2 = semantically opposite); querying returns top-n documents ranked by distance; semantic meaning beats keyword matching for retrieval.
- Learner-relevant: first end-to-end vector store workflow the learner can run locally; foundation for the RAG agents in 6.3.

### 6.3 Building practical RAG knowledge agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3]]`
- Summary: Argues that vector search alone is insufficient for practical RAG and introduces combining multiple search techniques; agents add agency by mixing search tools (vector, keyword, hybrid, SQL, graph) per use case.
- Key claims: vector-only retrieval has documented deficiencies (misses exact words/numbers, jargon confusion, near-duplicate crowding, stale facts, restricted-content leaks, ambiguity); practical RAG almost always combines search techniques; choose supplementary techniques by data type and use case; don't rely on search alone to determine RAG context.
- Learner-relevant: the decision framework for choosing retrieval strategies in agent design.

### 6.3.1 Everything begins with search and relevance
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.1]]`
- Summary: Details the deficiencies of vector-only search (Table 6.2) and surveys alternative retrieval methods — keyword, vector, hybrid, relational DB (SQL), and graph — with pros, cons, and typical use cases (Table 6.3).
- Key claims: vector search misses exact tokens/numbers, confuses jargon, lets near-duplicates crowd top-k, returns "feels related but doesn't answer" hits, can't follow relationships, goes stale, mis-handles ambiguous words, and can leak restricted content; fixes range from keyword/hybrid search and MMR/dedup to reranking, SQL/relational filters, graph search, and ACLs; agents can compose these search tools into complex RAG workflows.
- Learner-relevant: the main reference for why and when to use each retrieval method.

### 6.3.2 Building a vector search RAG agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.2]]`
- Summary: Builds a complete RAG agent (Back to the Future script) that chunks a document by token count, embeds chunks into Chroma DB, exposes a search_script tool, and grounds answers with grounding instructions; also covers grounding degrees and verification.
- Key claims: pipeline = load → simple_chunk by token count → embed → populate persistent Chroma collection if empty → tool-backed agent; grounding constrains the model to retrieved context rather than training data, preventing hallucinations; prompt patterns: "answer only from provided context", citation requirements, "quote passages then answer"; grounding spans the whole stack (chunk quality, retrieval relevance, evaluation), not just the prompt; vector search is not granular enough to find exact key terms like "1:15 AM", so it fails the time question.
- Learner-relevant: the canonical minimal RAG agent recipe and the grounding concept that recurs across the subject.

### 6.3.3 Building a hybrid search RAG agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.3.3]]`
- Summary: Extends the RAG agent with both keyword and vector search tools, explains Reciprocal Rank Fusion (RRF) for merging ranked lists, and adds reference/citation requirements to the agent instructions.
- Key claims: keyword and vector scores aren't comparable (BM25 vs. cosine), so a fusion function merges ranked lists; RRF (sum of 1/(k + rank), k ≈ 60) ignores raw scores and uses rank position only — robust across backends and the default in most production hybrid systems; agents can also decide themselves when to call each search tool; enforcing references ([Reference X] markers) plus grounding forces diligence and verifiable answers; hybrid agents can be extended to relational/graph search, and MCP eases this.
- Learner-relevant: the hybrid-search pattern and RRF mechanism the learner can apply in later agent-building nodes.

### 6.4 Adding memory to agents with MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4]]`
- Summary: Introduces agent memory built from databases, vector stores, and context windows, and shows how MCP servers provide out-of-the-box tools to power agent knowledge and memory without custom tool-building complexity.
- Key claims: RAG is powerful but complex beyond simple cases; MCP shines by exposing ready-made memory/knowledge tools to agents; cognitive memory vocabulary (short-term, long-term, episodic, semantic) is a useful shorthand, not a model of agent memory.
- Learner-relevant: frames the memory mechanics that MCP implementations in 6.4.2–6.4.5 depend on.

### 6.4.1 Understanding memory form and agent function
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.1]]`
- Summary: Maps cognitive memory categories onto architectural pieces: context window, external storage, state management, and retrieval mechanisms; covers sensory (multimodal), short-term/working, and long-term (semantic, episodic, procedural) memory and how memories are captured, stored, and augmented.
- Key claims: memory vocabulary is a tool, not a model — labels like "short-term/long-term" obscure the real distinction (bounded by per-call context vs. outside it); agents need to store across sessions, retrieve relevant pieces, and integrate them into the prompt; sensory memory = same embed-and-search mechanics applied to images/audio (multimodal retrieval, e.g., CLIP/OpenCLIP) but less mature; memory differs from knowledge in how it is updated/appended; memories may skip chunking; store form should match what you want to remember (facts/statistics → keyword/relational; social relationships → graph).
- Learner-relevant: the conceptual model of memory that lets learners reason about which store/retrieval pattern fits a need.

### 6.4.2 Attaching a graph database for memory using MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.2]]`
- Summary: Uses the MCP reference memory (graph) server to give an agent long-term memory of entities, relationships, and observations, demonstrated on the Back to the Future script's knowledge graph; covers what the memory server exposes and its limits.
- Key claims: graph DBs model entities as nodes and relationships as edges ("Micheal lives in Calgary" → two nodes + a lives_in edge); the MCP memory server exposes a small toolset (add_observation, add_relationship, query_facts, ...) that the agent decides when to call; graph retrieval is efficient for relationship traversal but struggles with fuzzy matching, requires clean structured-fact extraction, and scales differently than vector stores; the "Doc vs. Doc Brown" example shows why a single store mis-fails to link aliases — motivating hybrid memory.
- Learner-relevant: first MCP-backed memory agent pattern; foundation for hybrid memory.

### 6.4.3 Creating hybrid memory systems with MCP
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.3]]`
- Summary: Combines ChromaDB semantic memory with a knowledge-graph memory via two MCP servers, driving everything through agent instructions that enforce a mandatory hybrid retrieval and dual-storage workflow.
- Key claims: all the hybrid logic lives in agent instructions (semantic search → graph search → hybrid synthesis → dual capture → monitor → respond); the memory agent uses both memory forms for every interaction, unlike the hybrid knowledge agent which lets the agent choose; workflow: user input → semantic search → interpret entities/observations → graph search → update both stores → respond; honest caveats: local stores are ephemeral, MCP is a thin wrapper, production memory needs persistence, access control, observability, eviction, and retrieval-quality evaluation.
- Learner-relevant: the pattern for multi-store memory agents and realistic expectations for production memory.

### 6.4.4 Semantic augmented memory and applications to semantic, episodic, and procedural memory
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.4]]`
- Summary: Explains how semantic, episodic (events), and procedural (steps/processes) memories differ and how episodic/procedural memories fit the relational pattern while also benefiting from semantic augmentation.
- Key claims: episodic memories are about events, procedural about processes/steps, semantic about meaning (can include feelings/emotions); episodic and procedural memories fit relational search but may also be stored in semantic/vector storage for general retrieval; memory augmentation feeds previous experiences into an LLM that generates the questions a user may ask to activate each memory — reverse-engineering meaning for future retrieval.
- Learner-relevant: the augmentation technique that makes memories retrievable by future, paraphrased queries.

### 6.4.5 Uncluttering memory with compression and forgetting
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#6.4.5]]`
- Summary: Covers memory compression (cluster similar memories with k-means, then summarize each cluster into a single memory stored in a fresh vector DB) and forgetting/eviction, with use-case guidance and production/compliance caveats.
- Key claims: compression = semantic augmentation plus a clustering/summarization layer; recommended when clusters are large/unbalanced or stores show repetitive duplicates; verbose prose knowledge benefits more than code; memory benefits from periodic compression, knowledge typically only on first load; multiple compression passes create different levels of expertise; advanced systems blend knowledge and memory or use multiple per-user stores; forgetting suits repetitive memories, compression suits many similar-but-different ones; production memory needs eviction policies, and in regulated industries (healthcare, finance, law) eviction is a compliance question.
- Learner-relevant: the maintenance techniques that keep growing memory/knowledge stores lean and retrieval quality high.
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
# Chapter 8 — Deploying and securing agents

## Overview (L1)
- This chapter covers how agents built with the OpenAI Agents SDK are consumed and productized: embedding agents in the browser, hosting them behind APIs, and containerizing them as microservices. It then distills advanced deployment strategies (runtime choice, communication wires, multi-agent topologies, state/idempotency, release engineering, observability, reliability, and cost control) before walking a production security baseline (threat modeling, identity/access, secrets, tool sandboxing, prompt-injection defenses, and policy enforcement). Chapter examples are deliberately AI-generated ("vibe coded") full deployment scaffolds where architecture matters more than individual lines of code. 8.5 Exercises (not summarized here) provides five hands-on tasks: launching the embedded real-time voice agent, hosting an agent behind a FastAPI, wiring the voice agent to the image API as a tool, Dockerizing the API agent, and orchestrating multi-agent services with Docker Compose (plus optional localtunnel tunneling).

## Sections (L2)
### 8.1 Strategies for consuming agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1]]`
- Summary: Introduces three patterns for consuming/deploying agents — embedded in application code, hosted as microservices accessed through an API, or consumed as a tool by other agents over MCP/A2A — and weighs their tradeoffs via Table 8.1.
- Key claims: Browser-side agent deployment leaks API keys (extractable via dev tools, effectively public), hits CORS restrictions on direct LLM/tool calls, and complicates per-key rate limiting when browsers share one key; embedding fits thin agents over a backend that holds credentials, while customer-facing cost/security-sensitive agents belong in an authenticated backend API; long-running and multi-agent systems are poor fits for the embed pattern; agents are prime containerization candidates because they are self-contained.
- Learner-relevant: Anchors the deploy-vs-consume decision and motivates the rest of the chapter's patterns; supports comparing embedded vs API vs MCP/A2A consumption.

### 8.1.1 Embedding real-time voice agents into web applications
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1.1]]`
- Summary: Walks a vibe-coded, single-file client-only real-time voice agent (01_embedded_agent_speech.html) that uses the OpenAI Agents SDK Realtime package in the browser, with a footer that mints a short-lived client ephemeral key via PowerShell/Bash (production should mint keys server-side after auth).
- Key claims: Real-time voice agents should avoid heavy backend processing to keep latency low; ephemeral keys are demo-grade — production mints them on the backend post-auth; the OpenAI Agents SDK also supports JavaScript so the same agent patterns transfer to web; a variant (01_embedded_agent_speech_mcp.html) shows attaching a remote MCP server with access-token support.
- Learner-relevant: Anchors the "edge/browser embedding" deployment strategy and the ephemeral-key pattern reused later in the chapter.

### 8.1.2 Hosting agents through an API
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1.2]]`
- Summary: Wraps the chapter-7 image generation agent (agent-critic pattern) in a FastAPI service with a typed POST /generate endpoint that returns the image as PNG bytes, run via uvicorn and callable with curl or PowerShell.
- Key claims: POST is used because image requests run long and text can exceed GET limits; the pattern generalizes to wrapping any agent/tool in a POST endpoint returning a clean payload; images are handled as base64 internally and returned as bytes (client could decode base64 instead); curl and PowerShell invocation examples are given.
- Learner-relevant: Anchors the "synchronous API microservice" deployment strategy and the FastAPI + uvicorn scaffolding reused in later sections.

### 8.1.3 Consuming an agent web service in a web application
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.1.3]]`
- Summary: Shows a browser-based real-time voice agent (03_realtime_image_agent.html) that holds a generate_image tool calling the backend FastAPI image agent, letting the user keep chatting while image generation runs asynchronously.
- Key claims: A browser RealtimeAgent can both make tool calls and interact with the user — a reusable pattern for real-time interactivity with long-running background work; real production image generation sits behind a queue (Redis/SQS), GPU worker pools, object storage for finished images, and notification + memory systems to answer "is my image ready yet?"; the chapter treats these production concerns abstractly because agent-side architecture is the lesson.
- Learner-relevant: Anchors frontend-agent-to-backend-tool wiring and names the queue/storage/memory production stack behind async agent tools.

### 8.2 Dockerizing agent systems
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2]]`
- Summary: Makes the case for containerizing agent API apps as microservices — each agent focused on a single task/subgoal — so agents can be swapped, upgraded, added, and removed easily; a browser frontend agent can consume containerized agents via API or as MCP servers.
- Key claims: Microservices architecture hosts small, focused API services in containers, enabling easy upgrades, scalability, security, and accessibility; agents are ideal microservice candidates because they are well isolated and self-contained; containers deploy locally via Docker Desktop or scale to Kubernetes/cloud (Azure, AWS, GCP) — the book covers local Docker only.
- Learner-relevant: Anchors the microservices rationale and the local Docker deployment scope used throughout the section.

### 8.2.1 Containerizing an agent microservice
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2.1]]`
- Summary: Demonstrates generating a Dockerfile for 02_app.py from a coding LLM (listing 8.4: Python 3.11 base, dependency install, port exposure, uvicorn CMD), then building and running the image-generator container with Docker, including a named-container variant manageable in Docker Desktop.
- Key claims: Containerizing used to be complex; today a capable coding LLM (GPT-5.2, Claude Opus 4.5, Gemini) can generate a Dockerfile from the app code; production Docker images should always be evaluated, pruned, and modified; docker build / docker run --rm -p 8000:8000 -e OPENAI_API_KEY=... image-generator:latest serves the agent locally; naming the container (--name image-gen) lets Docker Desktop manage start/stop/logs and even run multiple agent versions.
- Learner-relevant: Anchors hands-on Docker build/run workflow and the "review LLM-generated code before adopting" engineering stance.

### 8.2.2 Orchestrating agentic systems with Docker Compose
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2.2]]`
- Summary: Uses a docker-compose.yaml (listing 8.5, autogenerated by GPT-5) to orchestrate three containers — realtime-voice-web, realtime-image-agent, realtime-web-agent — into a single stack run with `docker compose up --build`, backed by a public GitHub repo (Agents-microservices).
- Key claims: Compose gives one declarative way to start/stop an entire multi-agent stack, with service definitions, env-var placeholders (${VAR:-default}), port mappings, and depends_on wiring; the whole scaffold was AI-generated, showing you can create/extend microservice solutions cheaply and quickly; Compose files do not translate cleanly to most cloud providers, but AI can help find solutions.
- Learner-relevant: Anchors multi-container orchestration and the env-var/port/dependency syntax of a real Compose file.

### 8.2.3 Externalizing local agent microservices
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.2.3]]`
- Summary: Covers tunneling (ngrok, localtunnel) to expose locally running agent containers, with a concrete localtunnel run (`npx localtunnel --port 8000`), and draws the line between tunneling for dev/demos and cloud deployment for production.
- Key claims: Tunnels are for development and debugging (webhooks, integrations, demos), not deployment; risks include publicly reachable endpoints, exposing the local machine to the internet, and relying on the agent's own auth/rate limiting as the only defense, which can leak production data, keys, and sensitive resources if left running; cloud deployment is the right move for customer access or sustained traffic because providers handle security boundaries, networking, scaling, and access control; tunnels suit POCs, demos, and small-group use.
- Learner-relevant: Anchors the dev-vs-production boundary and the security risks of exposing local agent services.

### 8.3 Considering advanced deployment strategies
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3]]`
- Summary: Distills production patterns for choosing where the agent runs, how agents communicate, how state is maintained, and how changes are released — framed by latency requirements as the key indicator.
- Key claims: Deployment choices matter as much as prompts and tools once a system grows beyond a single proof of concept; latency is the deciding indicator for where and how to deploy.
- Learner-relevant: Frames the entire advanced-deployment section around latency-driven decision making.

### 8.3.1 Choosing a runtime: Edge, API, or event-driven
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.1]]`
- Summary: Presents a decision flowchart (figure 8.8) mapping desired latency to one of three runtimes — edge (browser/mobile), synchronous API microservice, or event-driven worker agents.
- Key claims: Edge runs agent logic client-side streaming to a real-time model, best for conversational/voice UX with very low perceived latency (keep tools simple/stateless or proxied, use short-lived server-minted secrets); synchronous API (e.g., FastAPI) suits request/response tasks like image generation, formatting, lookup, summarization; event-driven workers on a queue suit jobs exceeding HTTP timeouts, needing retries, or benefiting from concurrency control; pick the simplest runtime meeting your latency target — start with API, move hot paths to edge, offload heavy tools to workers.
- Learner-relevant: Anchors the core deploy-decisions framework used across section 8.3 and in later security/ops sections.

### 8.3.2 The three "wires" of communication
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.2]]`
- Summary: Distinguishes three communication channels between agents and tools, each with its own latency tradeoff: WebRTC/WebSocket, HTTP + SSE (MCP), and a message bus.
- Key claims: WebRTC/WebSocket gives full-duplex audio/text with minimal overhead, barge-in, streaming TTS, and token-by-token responses — ideal for voice UX; HTTP + SSE is simple request/response with streaming output, easy to proxy/log/cache, ideal for agent tool calls and web clients wanting streamed text; a message bus (Redis/NATS/Kafka) decouples slow tool execution so the user keeps talking while results post back to the session; the wire is dictated by latency and deployment requirements (e.g., MCP servers may connect locally via STDIO instead of HTTP+SSE).
- Learner-relevant: Anchors channel choice per latency profile and connects back to the real-time/FastAPI examples.

### 8.3.3 Practical multi-agent topologies that adapt well
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.3]]`
- Summary: Extends the orchestrator pattern into the "front-door agent" pattern, where a user-facing agent routes to backend worker agents/services that each have their own communication and latency requirements.
- Key claims: The front-door agent pattern adapts to the latency needs of both the front-door agent and the workers behind it; each worker can internally use flow, orchestrator, or collaboration workflows; keep the front-door agent as simple as possible and push work and control into the worker agents.
- Learner-relevant: Anchors the front-door/orchestrator topology referenced by release engineering and cost-routing discussions.

### 8.3.4 State, memory, and idempotency
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.4]]`
- Summary: Distinguishes short-term conversational memory (turns in Redis/PostgreSQL) from long-term knowledge (semantic search over vector stores as dedicated shared services), and makes tool calls idempotent to enable caching and replay, with an idempotent FastAPI tool-proxy example (listing 8.6) deriving SHA-256 cache keys from canonicalized inputs.
- Key claims: Large chatty systems fail most often in this state — keep it simple; idempotent means the same result whether called once or many times with the same inputs (weather lookup is idempotent, sending an email is not); agents retry and replay tool calls across recovery loops, so idempotent tools can be safely cached/replayed without duplicate side effects; event-based workers should use idempotent caching for performance, scalability, and replay/debugging.
- Learner-relevant: Anchors memory-tiering and the idempotent-caching pattern reused in cost control (8.3.8).

### 8.3.5 Release engineering for agents (prompts, tools, models)
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.5]]`
- Summary: Applies standard software release engineering to agents: version everything, promote with gates, and pin model/tool versions.
- Key claims: Agents are software — treat them as such; version prompts, tool schemas, tool servers, safety switches, and model selections (prompts may be versioned separately to optimize outside code changes); promote with gates: offline tests → shadow traffic → miniature canary → full rollout with auto-rollback if SLOs degrade; pin the exact model/tool endpoints used per turn for reproducibility — tracing tools like Phoenix handle this automatically.
- Learner-relevant: Anchors the engineering-discipline layer of agent production and motivates observability next.

### 8.3.6 Observability matters
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.6]]`
- Summary: Recommends OpenTelemetry tracing plus a tool like Phoenix across the whole path (UI > Gateway > Agent > Tools > Model), covering three elements — traces, metrics, and logs — with a Phoenix + OpenAI Agents tracing example (listing 8.7).
- Key claims: You can't fix what you can't see; traces need spans per turn/tool call with correlation IDs (session_id, turn_id, tool_call_id); metrics split into operational (p50/p95 latency, tool success rate, token usage, error rates, cost per session), quality (grounding rate, hallucination rate, evaluator pass rate, user feedback), and product (task completion, escalation-to-human, conversion/resolution, time-to-resolution, KPIs) — operational metrics say the system runs, quality/product say whether running matters; capture structured JSON logs with PII redaction.
- Learner-relevant: Anchors the observability baseline that later feeds audit/traceability in policy enforcement (8.4.6).

### 8.3.7 Reliability patterns: Timeouts, fallbacks, and budgets
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.7]]`
- Summary: Lists reliability best practices for managing failure and cost points: timeouts and budgets, fallbacks, circuit breakers, and graceful degradation.
- Key claims: Give each critical path a time budget enforced at the caller as an SLA (e.g., 1500 ms quick reply, 15–60 s tool calls) and fall back on breach; on failure return a best-effort answer, switch to a smaller model, or omit non-essential decoration; circuit breakers trip on repeated tool failures and shed load gracefully; above all, avoid showing errors to users — fail gracefully (e.g., TTS down → continue as text; slow image tool → return a view-later link); agents that fail away from the user build operational confidence, while error-throwing agents erode trust, usage, and acceptance.
- Learner-relevant: Anchors the resilience behaviors expected of production agents and pairs with cost/routing levers.

### 8.3.8 Cost control and model routing
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.3.8]]`
- Summary: Frames agent cost as relative to value, then details three cost levers — routing by intent, context trimming, and caching — with tradeoffs and measurement guidance.
- Key claims: Cost only makes sense relative to what the agent replaces/produces; the three levers are context trimming (summarizing history, dropping irrelevant tool descriptions, structured outputs — savings real but tight summarization can break multi-turn coherence), multi-layer caching (prompt/response/embedding, 30–80% savings on hot paths, but needs invalidation and can cause stale behavior), and routing to cheaper models (riskiest — a wrong route degrades quality regardless of downstream agent quality, so use a frontier model for routing and treat "small routing model" as an optimization to validate, not a default); instrument cost per session/task/user before optimizing; practical trimming patterns include compressed history, stripping unneeded attachments/tool outputs, role-specific context, and structured outputs; prompt caching favors stable content at the top and dynamic content at the bottom (typical ~1024-token minimum, byte-for-byte match for cache hits, savings up to 90% of input cost); cache deliberately — deterministic, expensive, time-window-stable operations only (exchange rates, weather snapshots, embeddings, idempotent tool results), never user-specific or auth/state-dependent data; because cost tracks tokens, cutting cost usually cuts LLM latency, which determines deployment.
- Learner-relevant: Anchors cost-to-value framing, routing architecture, trimming patterns, and cache-TTL judgment for production agents.

### 8.4 Security, safety, and governance in production
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4]]`
- Summary: Outlines a practical, extensible security baseline for autonomous agents, covering threat modeling, identity/access, secrets, tool sandboxing, prompt-injection defenses, and policy enforcement, with the goal of shipping safely without maze-like complexity.
- Key claims: Agents act autonomously, making security and safety first-class; the baseline should be implementable now and extendable later.
- Learner-relevant: Frames the whole security section as a layering of partial defenses rather than a checklist.

### 8.4.1 A quick threat model for agentic systems
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.1]]`
- Summary: Names the assets worth protecting (API keys/credentials, tool credentials and connection strings, data read, data written, session logs, PII) and maps them to attack surfaces (client, gateway/API, agent runtime, tool servers/MCP, model provider, storage).
- Key claims: Name what you protect before where — the threat model is a surface→asset mapping, more useful than a checklist; client-side embeds put API keys at risk (anything browser-visible is public); a weak gateway exposes every downstream asset; the agent runtime is at risk from prompt injection, jailbreaking, and instruction confusion; compromised tool servers can exfiltrate data or become footholds; review the model provider's licensing on data residency/retention/training; storage needs encryption, access controls, and retention; after mapping surfaces, rank likely risks (prompt injection, token leakage, SSRF via tools, supply-chain attacks, data exfiltration) and address the highest first; prompt injection is the highest-leverage attack in 2026 — direct (user input) and indirect (third-party content the agent reads) variants — with only partial, layered mitigations: input validation, treating tool outputs as untrusted data, output filtering, and human-in-the-loop on high-stakes actions.
- Learner-relevant: Anchors the asset/surface mapping methodology and the prompt-injection threat later revisited in 8.4.5.

### 8.4.2 Identity and access for people, services, and agents
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.2]]`
- Summary: Sets least-privilege and user-scoped access rules: agents acting for users should have the same limited access as those users, auth/z should pass through to all tool and service calls, and browser agents should use ephemeral server-minted secrets.
- Key claims: Never give agents admin/full access to services, tools, or MCP servers; use user authentication/authorization unless the system is fully internal, and pass it to all downstream tool/service calls (in RAG, limit document access by user and global permissions); for real-time browser agents mint ephemeral client secrets on the backend after auth — never ship provider API keys to the browser, keep TTLs short and refresh silently; log user access and usage, e.g., via user objects in tracing (listing 8.7).
- Learner-relevant: Anchors least-privilege and ephemeral-secret patterns echoed in 8.4.3 and the front-door examples.

### 8.4.3 Secrets and configuration management
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.3]]`
- Summary: Applies DevOps secret hygiene to agents: keep secrets out of container images, inject at runtime, grant least privilege, rotate secrets, and avoid sharing secrets with agents/LLMs.
- Key claims: Keep secrets out of container images and inject via environment variables or a secret manager; scope access and grant only least privilege for tools, databases, and services; rotate secrets across all environments; avoid directly sharing secrets with agents and LLMs.
- Learner-relevant: Anchors the concrete secret-handling rules applied in Dockerized and cloud agent deployments.

### 8.4.4 Tool safety: Sandboxing and egress control
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.4]]`
- Summary: Treats tools as the sharpest edges of an agent system and lists sandboxing, filesystem, network, and resource-limit best practices, plus MCP server caution.
- Key claims: Abusive tool use may be an attack or just a hallucinating LLM — always expect tools to fail or be misused; sandbox tools under restricted policies (seccomp/gVisor/Firecracker/container profiles) and never give full access; restrict filesystem access to known paths and prefer ephemeral storage; limit network access to an outbound allowlist and deny egress by default; always limit memory, CPU, and wall-clock time; know the role and security of MCP servers — never assume best practices, access external tools over HTTPS, and enforce auth/z.
- Learner-relevant: Anchors the sandbox/egress model that the example safety prompt (8.4.5) turns into rules.

### 8.4.5 Prompt-injection and data-exfiltration defenses
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.5]]`
- Summary: Gives a concrete defense playbook for direct user input and indirect content: instruction hierarchy, schema-first tools, input/output sanitation, no code execution, and allowlists over denylists, embodied in a full safe/secure system prompt (listing 8.8).
- Key claims: Assume any user input is untrusted and potentially malicious; the instruction hierarchy ranks system prompt > tool contracts > developer instructions > user requests > web/files/tool content, and refuses "ignore previous instructions" injections; schema-first tools use strict JSON Schemas with additionalProperties:false to reject extras; never execute user content (no eval, no shell, no dynamic import) without authenticated/authorized access; prefer allowlists for tools and network egress, deny by default; add post-checks that verify claims (HEAD-request URLs, confirm records) before acting; safety rules consume tokens and attention, so scope them to front-door/user-facing agents and systems touching external tools, and never assume rules work all the time — layer on the other measures in this section.
- Learner-relevant: Anchors the practical prompt-defense template that can seed a reusable security checklist element.

### 8.4.6 Safety and policy enforcement
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#8.4.6]]`
- Summary: Plans policy enforcement across six categories — content safety, data privacy/compliance, audit/traceability, rate limiting/abuse prevention, access control/authorization, and human-in-the-loop — enforced outside the agents themselves for auditable, updatable, independently validated policy.
- Key claims: Policies belong in front of or alongside the agent, not inside its prompt — prompt-embedded policy is fragile (injectable) and unauditable (no record of which policy version was active); content safety filters (self-harm, violence, hate, copyright) can come out of the box (e.g., Azure) with configurable levels; data privacy/compliance covers GDPR/HIPAA/SOX, data residency, consent, right-to-deletion, and not sending sensitive data to providers whose licensing forbids it; audit logs add tamper-resistance and longer retention on top of observability logs; rate limiting per user/session/tenant/key prevents runaway cost, DoS, and detects compromised credentials; misconfigured access control is a common breach path because agents often run with broader permissions than any single user; HITL is load-bearing for high-risk actions and needs more design than a confirmation dialog — decide what triggers a checkpoint (stakes, not every action), what reviewers see (enough context to avoid rubber-stamp approvals), how state persists during wait (async resumption, durable state, timeouts, escalation), and what happens when HITL fails or is bypassed (pair with rate limits, dollar caps, sandboxes, post-hoc audit); policy registry expresses organizational rules machine-enforceably with logged overrides; start applying content/policy safety before production, and understand that agent systems are stochastic and must be contained within a well-defined box.
- Learner-relevant: Anchors the governance layer that turns observability logs into audit/compliance and motivates HITL design decisions.

## Chapter summary notes
- Consumption drives deployment: embed for ultra-low-latency UX, wrap as synchronous API for request/response, run event-driven workers for long/bursty jobs; realtime browser agents (WebRTC/WebSocket) deliver barge-in, token streaming, most responsive UX.
- Containers/microservices standardize runtime and dependencies; Docker Compose stands up multi-agent stacks (UI, workers, tools) with one command; tunneling (localtunnel) is for dev/demos/POCs, not production.
- Choose the wire by latency: WebRTC/WS for realtime, HTTP+SSE for streamed request/response, message bus for decoupled background work; front-door/orchestrator patterns keep a light front door over typed, well-scoped workers.
- Keep short-term chat state separate from long-term knowledge; make tool calls idempotent for caching, replay, resilience; version prompts/tools/models, promote with gates, pin versions, trace UI > Gateway > Agent > Tools > Model, and use timeouts, fallbacks, circuit breakers, and graceful degradation.
- Cut cost by routing by intent, trimming context, and caching deterministic results — measuring cost-to-value first; security is built in: threat-model surfaces, least privilege, secret management, sandboxed tools, schema-first injection defenses, and externally enforced policies.
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
# Chapter 11 — Tips for building agentic systems

## Overview (L1)
- Chapter 11 — Field-tested, production-level tips for building real-world agents and agentic systems, organized first by the five agentic layers (persona, tools and actions, reasoning and planning, knowledge and memory, evaluation and feedback), then by role: customer support agents, RAG agent systems, and deep research agent systems. Each section pairs practical guidelines with a code listing (OpenAI Agents SDK) demonstrating the tips. Ends with a summary checklist; the excerpt range also includes appendix A (setting up the sample code repo) and appendix B (Node.js setup for local MCP servers).

## Sections (L2)
### 11.1 Field-tested tips organized by the five agentic layers
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.1]]`
- Summary: Walks back through the five functional agent layers with practical guidelines per layer, each illustrated by a listing (core persona, tool-using agent, reasoning/planning agent, knowledge/memory agent, evaluation and feedback system).
- Key claims: Persona = API contract, not prose (crisp role/boundaries, explicit "I don't know" off-ramp, narrow scope, structured typed outputs, dynamic runtime instructions); tools = single-responsibility with crisp docstrings and typed params, control when tools run, prefer function tools, plan for failures, and keep tool sets small to avoid "tool bloat" (every tool adds tokens to every LLM call); reasoning = adopt ReAct, plan-then-execute, cap iterations, self-review before final, and consider turning reasoning down for simple one-shot tasks; knowledge/memory = RAG as first-class, sessions vs long-term memory, ANN indexes + metadata filters, hybrid search, deliberate embedding choice, chunking and grounding, data freshness with role/tenant partitioning; evaluation/feedback = trace everything, automate evals (LLM-as-judge), HITL, guardrails/moderation, and AIOps iterate-like-DevOps.
- Learner-relevant: Anchors the chapter's core framework — a reusable checklist for evaluating any agent design across the five layers; foundational for the three role-specific sections that follow.

### 11.2 Tips for building a customer support agent
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.2]]`
- Summary: Maps the five layers onto a support role (persona = support role; tools/action = APIs/lookup/escalation; reasoning/planning = triage logic and HITL; knowledge/memory = RAG over manuals; eval/feedback = logs/HITL) and gives seven guidelines, then shows a triage/escalation agent (Listing 11.5) and a six-agent support workflow (Figure 11.3).
- Key claims: Narrow the charter (start with orders/returns/status); ground every answer with a RAG tool plus grounding agents; HITL as a feature via an escalate_to_human tool and customer feedback; verify identity and use least privilege; engineer resilience (retries, fallbacks, timeouts); cache popular answers and apply rate limits (avoid "store everything"); keep transparent per-conversation traces. A single "support agent" is really multiple cooperating agents: triage > retrieval > grounding > action/guardrail > answer, with thumbs-up/down user feedback.
- Learner-relevant: Concrete template for building or evaluating any support/triage agent; shows how RAG and guardrail agents compose into one system.

### 11.3 Tips for building a RAG agent system
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.3]]`
- Summary: Positions RAG agents as the backbone embedded in larger agentic systems (rarely direct-to-user), with five tips and a single-agent retrieve-and-answer listing (Listing 11.6) plus an expanded multi-source system (Figure 11.4) with grounding, context-ranking, and refinement agents.
- Key claims: Use agents only when needed (skip the orchestrator if a one-shot RAG call works); design modular agents (triage/router > retriever > answerer, optional critic for corrective retrieval/CRAG); optimize retrieval with ANN indexes, metadata filters, domain-tuned embeddings, reranking, and hybrid options; enforce grounding discipline ("use only context", citations, specialized grounding agents); instrument observability and evals — recall, answer accuracy, and "should have said I don't know" cases — because replying "I don't know" beats a confident false answer. An advanced pattern adds a grounding agent before a context-ranking agent; if documents insufficiently answer, a refinement agent modifies and reissues the query, bounded by a loop counter.
- Learner-relevant: Design checklist for RAG workflows and the routing/critique layering that turns bare retrieval into an agentic system.

### 11.4 Tips for building a deep research agent system
- Locator: `[[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#11.4]]`
- Summary: Covers open-ended web-exploration agents that plan, iterate, and synthesize from many sources, with five best practices and a brain/workers example (Listing 11.7) plus the full pattern (Figure 11.5): planner delegates to stateless worker tools, hands results to a critic, and a writer/report agent synthesizes with citations.
- Key claims: Use only when simpler systems can't solve the problem (or build an internal version for KBs/databases); two-tier orchestration — a research planner (brain) delegates to stateless tool-like workers (web searcher, extractor, analyst, summarizer); tool policy controls force facts through retrieval/web tools and forbid unsupported claims; add a critic pass for self-critique and fact checks (coverage, contradictions, missing perspectives) before finalization; stream partial findings and evolving outline for perceived latency and checkpoint approvals; cache repeated queries and set per-run token budgets with alerting, but clear caches periodically to avoid stale data. Whether something is a tool or an agent depends on what decisions it makes — tools that require decision-making are agents that use tools. Requiring citations in the final report provides direct grounding.
- Learner-relevant: Blueprint for planner/critic/writer multi-agent orchestration and the "brain delegates to hands" pattern reusable across research-style agents.
