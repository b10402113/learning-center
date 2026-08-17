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