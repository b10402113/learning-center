---
source: sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt
source_type: text
source_lines: 2972
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
part: 6
---

# L1 overview

- Chapter 8 argues that once agents call external functions and run multi-step loops, errors cascade and end-to-end success alone cannot locate the failure; it offers a four-stage framework, a multi-step trace method, and complex-input handling.
- A tool is any external function the LLM can invoke; tools are defined by a list of function names, descriptions, and parameter schemas, and the LLM emits a structured (usually JSON) call that the system executes and returns.
- The running example is the real estate assistant (Example 3-1) with `query_listings`, `send_email`, and `check_calendar`; the caution is that write tools like `send_email` or `update_listing` are irreversible and deserve closer evaluation than read-only tools.
- The spectrum of agency must be defined before evaluation: a high-agency assistant that repeatedly asks permission is a failure, as is a low-agency one that sends email without confirmation; error analysis asks whether each step's decision was reasonable, goal-directed, appropriately initiative-taking, and loop-free.
- Evaluating Tool Calls decomposes each call into Stage 1 tool selection, Stage 2 argument generation, Stage 3 tool execution, and Stage 4 output handling, because the fix differs per stage (rewrite tool descriptions vs. add schema validation).
- Stage 1 failures include picking `query_listings` for "Are there showings available this weekend?", hallucinating a nonexistent tool, and failing to call `send_email` when asked; the fix is usually rewriting tool names and descriptions, since tool definitions are treated as iterable prompts.
- Stage 2 separates structural validity (e.g. `{"price_max": "700k"}` instead of integer `700000`, missing `recipient_address`) from semantic correctness (wrong date format, injection risk in SQL filters); Pydantic `BaseModel` with `Field` catches type, missing-field, and format violations before execution.
- Stage 3 covers silent failures (`query_listings(property_id="98765")` returning empty because the ID does not exist) and runtime errors (network issues or API timeouts on `search_web`), with logging of error messages and tracebacks recommended.
- Stage 4 covers misreading returned data (`"sqft": 1500` reported as "over 2000 sq ft"), ignoring important details (omitting a "structural issues reported" agent note), and failing to integrate output into the conversation; detection needs human review or LLM-as-judge on semantic consistency.
- Uber's QueryGPT is the worked example of stage-level plus end-to-end measurement: subagents for intent, table selection, and column pruning, measured by intent accuracy, table overlap, execution success, and query similarity (LLM judge vs. handwritten reference SQL).
- Standardized protocols like MCP do not change the four evaluation questions but make logging and traceability easier through structured, parsable records; tool descriptions are prompts too.
- Debugging multi-step traces rests on traceability: log every intermediate step from the start (inputs, outputs, tool arguments and responses, internal reasoning), and combine component-level with end-to-end evaluation.
- To scale beyond manual trace inspection, the book defines discrete states (`ParseReq`, `GenArgs`, `ExecTool`, `HandleOut`, `UpdatePlan`, `DecideNextAction`), labels traces success/failure, attributes each failure to its first failing state, and builds a transition failure heatmap of From State × In State; sample numbers show 12 failures on GenArgs→ExecTool, column totals of ExecTool 12, GenArgs 8, HandleOut 7.
- Complex inputs are handled by separating input-processing errors from LLM reasoning errors: VLM image checks (spatial reasoning, counting, text-in-image, hallucinated objects), text-to-image composition limits ("3 presidents" collapsing into copies), long-document constant-output ("needle-in-a-haystack") vs. variable-output chunking (2,000–4,000 token chunks, three to five ideas per chunk), and PDF extraction errors (OCR noise, broken tables, wrong read order) with a page-image-to-VLM alternative.
- Adversarial evaluation shifts the question to "Can the agent be tricked?" across prompt injection (20–30 known attack patterns), indirect injection (instructions embedded in retrieved documents or emails), and privilege escalation, all run in CI because model updates change susceptibility.
- Chapter 9's opening evidence is the Stanford/Berkeley study (L. Chen et al. 2024): GPT-4 accuracy on identifying prime numbers fell from 84% to 51% between March and June 2023 after a silent API update.
- Table 9-1 splits continuous evaluation into CI (unit tests for known unknowns, run before deployment) and CD (online monitoring for unknown unknowns on live traffic), complementary halves of one loop through a deploy gate.
- Table 9-2 contrasts traditional ML with LLM agents on training data, failure modes (prompt sensitivity, silent model updates, hallucinations, judge drift), subjective multidimensional quality needing custom evaluators, and nondeterminism forcing tolerance or repeated runs.
- The golden dataset is a hand-curated 100–200 example set (starting at 20–50) of core features, past critical failures, edge cases, and component-exercising cases; CI is reference-based, uses pinned judge versions (e.g. `gpt-4o-2024-05-13`), and is a smoke test rather than a production-quality predictor.
- Common CI mistakes: confusing pass rate with production quality, and data leakage where golden examples end up in few-shot or judge prompts; automate a diff of golden inputs against prompt content on every commit.
- Model upgrades are treated as code changes: run CI, then try stripping prescriptive instructions for prompts that pass, distinguish genuine regressions from formatting sensitivity, and rerun error analysis; the Voiceflow intent-classifier case lost about 10 percentage points on a GPT-3.5 swap, and the October 2024 `gpt-4o` alias swap broke function calling for unpinned users.
- CD starts with observability: log inputs and metadata, all LLM calls with reasoning, all tool calls and errors, retrieved documents, final output, user feedback, and evaluator outputs, using tools like LangSmith, Arize Phoenix, W&B Weave, or OpenTelemetry, organized as traces, spans, and sessions.
- Production evaluators typically number five to seven (code-based plus LLM-as-judge) run on 1%–5% sampled traffic asynchronously, with corrected success rates and 95% confidence intervals via bootstrapping.
- Guardrails run in the critical path, so they must be millisecond-fast and near-zero false positive: regex, JSON schema validation, blocklists, length/format checks, `sqlparse`, `ast.parse`; the example `pii_guardrail` regexes SSN and credit-card patterns before `send_email`, and responses to a trip are reject-with-fallback, retry, or fall back to simpler logic.
- Judge drift arises from provider updates to the judge model and from the team's shifting definition of "correct"; the three practices are pin exact versions, revalidate TPR/TNR every few weeks with fresh human labels, and revalidate after any model change.
- The continuous improvement flywheel is deploy → monitor → diagnose via error analysis → improve agent and evaluators → verify in CI → redeploy, illustrated by the "West Berkeley" vs. "Berkeley West" bug that became the new "Directional Location Qualifier Errors" failure mode plus 5–10 golden examples and a code-based neighborhood-name evaluator.
- Closing pitfalls: stale golden datasets, conflicting metrics, disconnected AI and product metrics, and relying only on automated monitoring instead of sampling random production traces.

# L2 detail

- `#L2055-L2059` — Chapter 8 opener: why complex agents make evaluation harder (cascading errors) and the chapter's three-part plan.
- `#L2060-L2068` — What Are Tools and Why Do LLMs Use Them? Definition of a tool, schema-based definition, JSON call cycle, the real estate example, and the read-tool vs. write-tool warning.
- `#L2069-L2079` — The Spectrum of Agency: high- vs. low-agency versions of the same request, why agency level must be specified first, and the four error-analysis questions plus the overreliance-on-outcomes pitfall.
- `#L2080-L2082` — Evaluating Tool Calls: why final-output-only checks cannot localize failure, and the introduction of the four-stage decomposition.
- `#L2083-L2087` — Stage 1: Tool Selection: `check_calendar` vs. `query_listings`, hallucinated tools, omitted calls, and rewriting tool names/descriptions as the usual fix.
- `#L2088-L2108` — Stage 2: Argument Generation: structural vs. semantic failures, injection risk, and the Pydantic `CheckCalendarArgs` example that rejects "next Saturday" before execution.
- `#L2109-L2112` — Stage 3: Tool Execution: silent empty results for nonexistent IDs, runtime/network errors, and logging tracebacks for error analysis.
- `#L2113-L2118` — Stage 4: Output Handling: misquoted square footage, omitted "structural issues reported" note, failure to propose returned calendar slots, and why detection needs judges or humans.
- `#L2119-L2136` — Why Evaluate Each Stage Separately: cascading failures, Uber QueryGPT's intent/table/column-prune subagents and its four metrics, tool descriptions as prompts, and MCP's effect on logging.
- `#L2137-L2144` — Debugging Multi-Step Traces / Traceability: what to record in a trace, why missing reasoning logs block root-cause analysis, log-from-the-start tip, and component-level evaluation.
- `#L2145-L2149` — From Traces to Systemic Patterns: defining states like `GenArgs`/`ExecTool`/`HandleOut`, labeling traces, and attributing failure to the first failing state.
- `#L2150-L2154` — The Transition Failure Heatmap: From State rows vs. In State columns, the four-state real estate heatmap, the 12-instance GenArgs→ExecTool hotspot, and column totals.
- `#L2155-L2158` — Investigating Hotspots: isolating the 12 traces, why From State matters beyond column sums, and the warning that the transition is not automatically the sole cause.
- `#L2159-L2163` — Evolving the Heatmap over Time: expected sparsening after fixes, a success-counting variant for operational patterns, and the note that reading heatmaps is a practiced skill.
- `#L2164-L2165` — Handling Complex Input Data: the principle of separating input processing errors from LLM reasoning errors.
- `#L2166-L2170` — Images: VLM capabilities, spatial/counting/OCR/hallucination failure modes, visual grounding for judges, and text-to-image global constraints like "3 presidents."
- `#L2171-L2177` — Long Documents: accuracy degradation as context grows (N. F. Liu et al. 2024), constant-output needle-in-a-haystack tasks, variable-size output chunking at 2,000–4,000 tokens and three to five ideas, and judge input reduction.
- `#L2178-L2181` — PDF Documents: extraction as the largest error source, OCR/table/read-order problems, page-images-to-VLM alternative, formatting effects, and inspecting extracted content rather than the original PDF.
- `#L2182-L2191` — Adversarial and Security Evaluation: the "can it be tricked" mindset, prompt injection with 20–30 patterns, indirect injection in retrieved data, privilege escalation, and running these tests in CI.
- `#L2192-L2196` — Common Pitfalls: final-output-only evaluation, not testing whether tools are called at all, wrong tool sequencing, and failing to regenerate the heatmap.
- `#L2197-L2208` — Putting It Together: the six-step workflow for tool-using agents, the handoff to Chapter 9, and footnotes on observability platforms and failure funnel analysis (Bischof 2025).
- `#L2209-L2212` — Part IV divider: Production and Improvement.
- `#L2213-L2223` — Chapter 9 opener: the GPT-4 prime-number accuracy drop, why continuous evaluation is needed, the chapter's four learning goals, and the introduction to Table 9-1.
- `#L2224-L2235` — Table 9-1: CI as unit tests for known unknowns vs. CD as online monitoring for unknown unknowns, their complementary loop, and Figure 9-1.
- `#L2236-L2252` — Table 9-2: how CI/CD differs between traditional ML and LLM agents across training data, failure modes, quality measurement, and determinism.
- `#L2253-L2264` — CI: Building a Safety Net Against Regressions: golden dataset definition, assertion-based unit tests, pinned judge versions, the four kinds of examples, 100–200 example size, reference-based checks, and Table 9-3's intro.
- `#L2265-L2282` — Table 9-3 and golden dataset maintenance: tone match via LLM judge, tool argument schema validation, email address existence check, and auditing/retiring stale examples.
- `#L2283-L2289` — Common Mistakes with CI: pass rate mistaken for production quality, data leakage into few-shot or judge prompts, and guidance on starting at 20–50 and growing to 100–200 examples.
- `#L2290-L2302` — Revisiting Prompts When Models Improve: the four-step upgrade process, the Voiceflow intent-classifier regression, the October 2024 `gpt-4o` function-calling break, version lifecycle policy, and API behavioral drift.
- `#L2303-L2314` — CD and Online Monitoring / Observability: what to log per production request, LangSmith/Arize Phoenix/W&B Weave/OpenTelemetry, daily trace review, and the trace/span/session terminology.
- `#L2315-L2322` — Running Automated Evaluators in Production: five to seven evaluators, 1%–5% asynchronous sampling, bootstrapped corrected success rates with 95% confidence intervals, and the real estate dashboard/alert recipe.
- `#L2323-L2358` — Guardrails: in-path latency and false-positive constraints, deterministic checks (`sqlparse`, `ast.parse`, schema, regex), the `pii_guardrail` code example, the <1% false positive bar, common guardrail categories, two layers (inter-step vs. output), nonnegotiable thresholds, and the reject/retry/fallback responses.
- `#L2359-L2368` — Judge Drift: provider updates to the judge model and drifting team criteria, then pin versions, revalidate TPR/TNR every few weeks, and revalidate after any model change.
- `#L2369-L2378` — The Continuous Improvement Flywheel: the deploy→monitor→diagnose→fix→verify loop and the full real estate cycle from the "Location Ambiguity" spike to "Directional Location Qualifier Errors."
- `#L2379-L2388` — Common Pitfalls: stale golden datasets, conflicting metrics, disconnected AI and product metrics, and only looking at automated monitoring.
- `#L2389-L2393` — Putting It Together: CI for known failure modes plus CD for unknown ones, the continuing need for human review, the handoff to Chapter 10, and the flaky-test footnote.
