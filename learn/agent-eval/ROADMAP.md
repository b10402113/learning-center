---
subject: agent-eval
status: draft # draft → confirmed
path: depth-first
created: 2026-10-29
---

# ROADMAP — agent-eval

## Goal

替一個自己真的在跑的 agent 建出一套可運作的 eval:從真實 trace 建資料集、做 open/axial coding 出 failure taxonomy、把每個 failure mode 寫成 code check 或 LLM-as-judge、用 TPR/TNR 與 bootstrap 信賴區間修正 judge、最後接進 CI 當上線閘門。

判準不是「知道有哪些 metric」,而是:我能指著一份 trace 集說「這版通過率 0.87,區間 [0.81, 0.93],上版是 0.79」,並且能說出這個數字為什麼可信、哪裡還不可信。

## Learning path

**Depth-first** — one thread taken all the way deep before moving to the next. The spine is **LLM-as-judge**: we build it, find its biases, validate it with TPR/TNR, de-bias it with Rogan-Gladen, and put a bootstrap CI on it *before* touching anything else. Only after the judge is genuinely trustworthy do we move to the next thread (where failures come from), then each architecture (multi-turn, RAG, tool calls, agents) taken deep in turn, and finally the production loop.

- **Optimizes for:** genuine mastery of one hard thing end-to-end, rather than a shallow pass over many metrics.
- **Suits:** a procedural learner who hates breadth-first skimming and wants to own a tool completely before adding the next.

Tiers run general → specific: Tier 1 gives the shared map; Tier 2 takes the judge spine deepest; Tier 3 secures the labels the judge depends on; Tier 4 takes each architecture deep in turn; Tier 5 closes the loop in production.

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — Orientation: the shared map

1. **[Eval foundations: three gulfs & the lifecycle](nodes/eval-foundations.md)**
   - Goal: Explain why LLM outputs break normal software testing, and place any eval task on the Three Gulfs / Analyze–Measure–Improve map.

### Tier 2 — Thread 1: the LLM-as-judge spine (deepest)

2. **[Build a judge: rubric → binary Pass/Fail prompt](nodes/judge-build.md)**
   - Goal: Write a single-criterion binary Pass/Fail judge (clear definitions, few-shot examples, structured JSON) for one failure mode, and name the three biases it must survive.
3. **[Validate the judge: TPR, TNR, why precision/recall mislead](nodes/judge-validate.md)**
   - Goal: Measure a judge's TPR/TNR on a labeled dev/test split and explain why those beat precision/recall for estimating a true pass rate.
4. **[Correct & quantify the judge: Rogan-Gladen + bootstrap CI](nodes/judge-correct.md)**
   - Goal: De-bias an observed pass rate with the Rogan-Gladen estimator, wrap it in a bootstrap 95% CI, and decide ship/hold from interval width vs. threshold.
5. **[Judge at scale: bias, stochasticity, group-wise metrics](nodes/judge-ops.md)**
   - Goal: Harden a judge against position/verbosity/self-enhancement bias and run it 3–5× for stability; add Success@k / Precision@k / Recall@k for multi-output cases.

### Tier 3 — Thread 2: failure discovery & reliable labels

6. **[Design the eval dataset: trace sampling & synthetic dimensions](nodes/dataset-design.md)**
   - Goal: Build a representative starting set (~100 traces, run to saturation) using production sampling or dimension→tuple synthetic generation.
7. **[From traces to a failure taxonomy](nodes/error-analysis-taxonomy.md)**
   - Goal: Turn a representative trace set into an open-coded, axial-coded failure taxonomy with prevalence rates.
8. **[Collaborative evaluation: rubrics, Cohen's κ, alignment](nodes/collaborative-agreement.md)**
   - Goal: Run the 9-step labeling workflow, compute Cohen's κ (not percent agreement), and drive a rubric to κ≥0.6 into a consensus gold set.

### Tier 4 — Thread 3: architecture-specific eval (each deep)

9. **[Multi-turn eval: anchoring, coherence, memory](nodes/multiturn-eval.md)**
   - Goal: Evaluate a conversation at session/turn/coherence levels and diagnose anchoring vs. context truncation vs. instruction drift.
10. **[RAG retrieval eval: metrics, chunking, reranking](nodes/rag-retrieval-eval.md)**
    - Goal: Measure stage-1 recall (Recall@k) and stage-2 ranking (NDCG), and tune chunk size/overlap by grid search.
11. **[RAG generation eval: faithfulness & relevance](nodes/rag-generation-eval.md)**
    - Goal: Judge faithfulness against retrieved context and relevance to the question, and debug with context swapping.
12. **[Tool-call eval: the four stages](nodes/tool-call-eval.md)**
    - Goal: Attribute a tool-call failure to selection, argument generation, execution, or output handling and pick the right fix per stage.
13. **[Agentic eval: trace attribution, complex inputs, adversarial](nodes/agentic-eval.md)**
    - Goal: Read a state-transition heatmap to locate cascades, separate input-processing from reasoning errors, and probe prompt injection.

### Tier 5 — Thread 4: closing the loop in production

14. **[Human review & trace data analysis](nodes/human-review-and-eda.md)**
    - Goal: Build a low-friction review UI with smart sampling, and use EDA (clustering, outliers, cross-tabs) to generate hypotheses.
15. **[Ship it: CI/CD gate & improvement strategies](nodes/production-loop.md)**
    - Goal: Wire eval into CI (known unknowns) + CD monitoring (unknown unknowns), and pick the cheapest improvement that moves the number.

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
