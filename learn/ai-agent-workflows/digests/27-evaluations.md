---
source: sources/ai-agent-workflows/20261105/course/27-evaluations.txt
source_type: text
source_lines: 463
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Benchmarks and leaderboards usually show one scorecard column, reliability, and hide cost and context; a 98% model costing five times a 97% model may not actually be better.
- pass@k measures the chance of at least one success in k tries and rises with k; it matters for coding, where one correct attempt counts.
- pass^k measures the probability that all k tries succeed and falls as k grows (0.75^3 ≈ 42%); it matters for customer-facing agents that must be reliable every time.
- Benchmarks increasingly inspect trajectories as well as final answers, but trajectory checks can become too rigid and punish valid routes the designer never imagined.
- Benchmark results shift with the harness, environment, scoring method, endpoint, and model provider; even OpenAI ran only 477 of 500 SWE-bench Verified problems for O3/O4 mini because of infrastructure.
- Environments can introduce critical errors or let an agent "hack the eval" by discovering what the test wants instead of solving the problem.
- Build your own evals starting from 20-50 simple tasks drawn from real manual tests, bugs, and user feedback, with clear pass/fail criteria and tests for both when a behavior should and should not occur.
- LLM-as-judge has pitfalls: it prefers answers from its own lab/family, prefers confident answers, and is sensitive to the order in which answers are presented.

# L2 detail

- `#L1-L15` — Framing: benchmarks are common but often unhelpful; example of trying a new model and finding reality does not match the benchmark; legitimate reasons exist, and the first question is what benchmarks actually cover.
- `#L16-L52` — Final-answer benchmarking: only checking whether the answer was correct and how often; the 98% vs 97% example where the better model costs five times more; a leaderboard shows one scorecard column and lets reliability, cost, and context considerations disappear.
- `#L53-L73` — Evals as a scorecard instrument: adding up the day's observations (tools cost context, RAG buys some back, supervisor buys context expensively, dispatcher lowers cost) instead of relying on "I think it worked better."
- `#L74-L107` — Single-run evals and pass@k: some benchmarks give one attempt; pass@k is the likelihood of at least one correct solution in K attempts and rises with K; 50% pass@1 means half the tasks succeed first try; commonly used for coding models where first-try success matters.
- `#L108-L160` — pass^k: the probability that all K trials succeed, which falls as K rises because consistency is demanding; 0.75^3 ≈ 42%; important for customer-facing agents, illustrated by a refund request that must follow policy every time; choice depends on product requirements.
- `#L161-L183` — Career-product example: pass@k is not very useful because only the one user who gets the right answer benefits, while pass^k at 97% starts to mean something but still leaves 3 out of 100 users with a wrong recommendation.
- `#L184-L201` — Trajectory evaluation: benchmarks increasingly look at how the answer was reached; rigid trajectory checks can reject a valid route the agent discovered, which contradicts building the agent for flexibility.
- `#L202-L250` — Why consistent quality is hard: the company's eval harness matters (a CloudStack harness cannot run OpenAI models), harness prompts/guardrails/rules change behavior, Epic AI described the work of creating and maintaining environments, and OpenAI ran only 477/500 SWE-bench Verified problems for O3/O4 mini due to infra.
- `#L251-L260` — Environment failure modes: environments can introduce critical errors or allow agents to hack the eval by figuring out what the evaluation is trying to answer instead of solving the problem correctly.
- `#L261-L294` — Scoring methods: GPQA Diamond uses regex parsing to handle varied answer formats; SWE-bench Verified uses a test suite against model-generated code; TauBench uses a second LLM to simulate the user, and the judge LLM's identity materially affects the score.
- `#L295-L312` — Endpoint effects: chat completions is widely supported, but OpenAI reports better evals on its responses endpoint, Anthropic exposes only a subset of features on chat completions, and MiniMax reported a 23% TauBench difference when using its API over chat completions.
- `#L313-L335` — Provider effects: Epic AI averaged open models on GPQA Diamond across Fireworks and Cerebras and found accuracy differences, rate-limit errors, empty responses, and lower-than-advertised max tokens; newer models sometimes scored worse than established ones because bugs get fixed over time.
- `#L336-L359` — Practical stance: still use public benchmarks but experiment yourself; harnesses quietly do much of the work, so the same model can feel completely different under a different harness.
- `#L360-L393` — Building your own evals: start immediately with 20-50 simple tasks (Anthropic-endorsed), write down every early change and evaluate it, begin from what you already test manually (bugs, user feedback, QA), and prefer tasks with clear pass/fail over vague rubrics.
- `#L394-L427` — Coverage and cleanliness: test both where a behavior should occur and where it should not (for example, tool use in expected and unexpected situations); evals need their own harness and clean environments that resemble production while adding as little extra configuration as possible.
- `#L428-L463` — LLM-as-judge pitfalls and close: judges prefer their own lab/family, prefer confident answers even when wrong, and are sensitive to answer order, so swap order across runs; the theme is plan and experiment, then tear it down and try again.
