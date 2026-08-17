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