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