---
source: 15-updating-the-system-prompt
source_type: pdf
source_lines: 223
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 15-updating-the-system-prompt

## Overview (L1)

- Advertising run_code in the system prompt — The system prompt is edited to tell the agent it can use the `run_code` tool for arithmetic by writing JavaScript in an async wrapper, mentioning the available `getCharges` and `searchKB` helpers; the exact wording is left open as there is no wrong answer.
- Demo prompt and run — A billing prompt ("find a duplicate charge and tell them the exact refund amount in dollars") is submitted, and the agent classifies it and invokes `run_code`, generating a program that awaits `tools.getCharges`, logs data, and computes duplicates.
- Verified result — The agent wrote real code, returned the charges, found duplicates for the same customer on the same day, consulted the refund policy via the knowledge base, and produced the exact refund amount of $49, far faster than reasoning across many tool calls.
- Why code beats inference — LLMs are strong at writing code and poor at counting; arithmetic done through inference hallucinates because it is probabilistic, and dates in particular are often wrong, whereas code with forced inputs is deterministic and repeatable.
- Timeout control Q&A — A timeout can be set at the runtime or call level: `timeoutMs` can be passed in options when calling `runInSandbox`, and `withTimeout` races the code against a rejecting timer so a hung program cannot loop on the server.

## Sections (L2)

### system-prompt-run-code

- Locator: `[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#system-prompt-run-code]]`
- Summary: Updates the system prompt to inform the agent about the `run_code` tool for arithmetic, written in a JavaScript async wrapper function.
- Key claims: There is no single correct prompt phrasing; the added instruction says to use `run_code` when arithmetic is needed and to run JavaScript in an async wrapper; the prompt may mention available helpers such as `getCharges` and `searchKB`; copy-paste samples are offered but wording is left to the learner.
- Learner-relevant: The prompt-engineering step that makes a tool discoverable to the agent, with the lesson that tool descriptions in prompts can be free-form.

### duplicate-charge-demo

- Locator: `[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#duplicate-charge-demo]]`
- Summary: Runs a billing prompt asking the agent to find a duplicate charge and report the exact refund amount, after reinstalling and restarting the dev app.
- Key claims: The sample billing prompt is added to the app; the prior prompt may cause issues because it was already attempted; the request is chosen specifically to test whether the agent reaches for `run_code`.
- Learner-relevant: A reproducible scenario for evaluating whether the system prompt successfully directs tool use.

### run-code-output-verified

- Locator: `[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#run-code-output-verified]]`
- Summary: The agent classifies the request, calls `run_code`, and the generated program awaits `tools.getCharges`, logs the data, finds duplicates, and returns them along with the computed refund.
- Key claims: The agent "went crazy" and wrote genuine code rather than faking output; the refund amount comes from the returned result rather than the logs; the identified refund was exactly $49, verified against the fake charges showing the same customer charged twice on the same day for $49; the agent also searched the knowledge base for the refund policy; this was much faster than reasoning over search-and-arithmetic tool calls.
- Learner-relevant: Direct evidence that code mode produces verifiable, correct results and reduces tool-call count.

### why-code-beats-inference

- Locator: `[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#why-code-beats-inference]]`
- Summary: Discusses why writing and executing code is more reliable than letting the model do arithmetic during inference.
- Key claims: The model sometimes treats any given number as a template and substitutes random values; arithmetic via inference will hallucinate at some point because the process is probabilistic; dates are especially unreliable inside LLM calls because of the number of digits; forcing inputs through code yields consistent results; LLMs are far better at writing code than at counting, so let them write code.
- Learner-relevant: The conceptual justification for code mode as an accuracy and cost optimization, and a warning about numeric inference limits.

### timeout-configuration

- Locator: `[[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#timeout-configuration]]`
- Summary: Answers how to bound a runaway run_code call so it cannot hang or loop on the server, walking through the timeout plumbing.
- Key claims: A default of 2 seconds exists but is currently unused; options with `timeoutMs` can be passed where `runInSandbox` is called in the switch; `withTimeout` creates a new promise rejecting when the timer expires and races it against the code promise; whichever finishes first wins, and a timeout rejection falls through to the error path.
- Learner-relevant: A concrete safeguard for a real operational risk (agent code hanging the server) and a review of the Promise.race timeout mechanic.
