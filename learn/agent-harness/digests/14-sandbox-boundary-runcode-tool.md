---
source: 14-sandbox-boundary-runcode-tool
source_type: pdf
source_lines: 302
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 14-sandbox-boundary-runcode-tool

## Overview (L1)

- New sandbox module — A `sandbox` file is created inside the harness folder, importing from Node's `vm` module and pulling in the sandbox result and sandbox API types from the notes.
- runInSandbox signature — `runInSandbox(code, api, options)` accepts a code string, the sandbox API (a map of functions the sandbox may use), and options carrying `timeoutMs` defaulting to 2 seconds, plus a logs array.
- Context construction — `vm.createContext` builds the isolated environment, injecting the API as `tools` and a console whose `log` maps arguments to strings and pushes them onto the captured logs array.
- Async wrapper — Because the AI may want top-level `await`, the code is wrapped in an immediately-invoked async function expression before execution.
- Timeout-safe execution — `vm.runInContext` runs the wrapped code, and a `withTimeout` helper uses `Promise.race` between the code promise and a rejecting timer; results return `{ ok: true, result, logs }` or `{ ok: false, error }`, with the explicit ok flag chosen because the AI reads the result.
- Sandbox API — A `charge`-focused use case: `getCharges(customerId)` and `searchKnowledgeBase(query)`, with `searchKB` abstracted out of the bottom of the tools file so both callers share it, backed by placeholder fake charges.
- run_code tool and tool switching — A `runCode` tool is defined (description: run a JavaScript async function body with `await tools.getCharges` / `tools.knowledgeBase` and `console.log`/`return`) and handled in the `runTool` switch, alongside cases for `getCharges` and `searchKnowledgeBase`; adding tools is always "define the tool, handle the tool".

## Sections (L2)

### sandbox-module-setup

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#sandbox-module-setup]]`
- Summary: Creates a new `sandbox` file in the harness folder and imports the Node `vm` module plus sandbox result and sandbox API types.
- Key claims: The `vm` import may fail on older Node versions; types are brought in from the notes; the module is described as building a custom sandbox.
- Learner-relevant: The file-level starting point and runtime prerequisite for the sandbox implementation.

### run-in-sandbox-signature

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#run-in-sandbox-signature]]`
- Summary: Defines `runInSandbox`, establishing its three inputs: the code string, the sandbox API, and optional configuration including timeouts.
- Key claims: The function executes a string of code in a sandbox; the API is the map of functions the sandbox can call; options carry `timeoutMs` (default 2 seconds) and come in milliseconds; logs are tracked as an array of strings.
- Learner-relevant: The boundary contract of the sandbox — what goes in and what configuration is available.

### context-tools-and-console

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#context-tools-and-console]]`
- Summary: Creates the VM context, exposing the API as `tools` and a custom console that captures `console.log` calls into the logs array.
- Key claims: `vm.createContext` produces the sandbox environment; the injected API is what the sandbox is permitted to use; captured console arguments are stringified if needed and joined with spaces before being pushed to logs; the arguments type is `unknown[]`.
- Learner-relevant: Shows the capability-injection pattern — the sandbox only sees the tools explicitly granted.

### async-iife-wrapper

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#async-iife-wrapper]]`
- Summary: Wraps the model's code in an immediately-invoked async function so top-level `await` works.
- Key claims: The wrapper is an IIFE with `async` at the top; this lets generated code use `await` and other async constructs without the model writing the wrapper itself; convenience only, no security bearing.
- Learner-relevant: Explains how the sandbox accommodates async model code.

### execution-timeout-result

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#execution-timeout-result]]`
- Summary: Runs the wrapped code with `vm.runInContext` and races it against a timeout using a `withTimeout` helper, returning an explicit ok/error result.
- Key claims: `vm.runInContext` receives the wrapped code, the context, and the timeout; the pending promise is not awaited directly — it is passed with the timeout to `withTimeout`, which does `Promise.race` so the timer or the code wins; success returns `{ ok: true, result, logs }`; failure returns `{ ok: false, error }`; the `ok` boolean exists so the AI can plainly tell success from failure.
- Learner-relevant: The isolation-and-timeout boundary that makes running model code survivable.

### sandbox-api-charges-kb

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#sandbox-api-charges-kb]]`
- Summary: Builds the sandbox API object with `getCharges(customerId)` and `searchKnowledgeBase(query)`, sharing a `searchKB` helper with the existing tools, and seeds placeholder charges.
- Key claims: The API defines exactly which functions the sandbox may call; `getCharges` filters the fake charges by customer ID; `searchKnowledgeBase` delegates to `searchKB` (extracted into its own helper so both the old code and the sandbox use it); charges are placeholder data for the demo.
- Learner-relevant: A concrete, minimal capability set for a billing use case, and a refactor example for code reuse.

### run-code-tool-and-switch

- Locator: `[[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#run-code-tool-and-switch]]`
- Summary: Defines the `runCode` tool exposed to the agent and adds handling for it (and `getCharges`, `searchKnowledgeBase`) to the `runTool` switch.
- Key claims: The tool description instructs the model to write a JavaScript async function body with `await tools.getCharges`, `await tools.knowledgeBase`, `console.log`, and `return` of any JSON value; the input schema is the code string; the switch's `runCode` case returns `runInSandbox`, and options are optional so two arguments are valid; the repeatable process for new tools is "define the tool, handle the tool".
- Learner-relevant: The complete extension point — how new sandboxable capabilities are added to the agent.

