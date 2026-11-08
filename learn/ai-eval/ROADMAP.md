---
subject: ai-eval
status: draft
path: course order
created: 2026-11-08
---

# ROADMAP — ai-eval

## Goal

把 AI evals 從概念走到可運作的 harness：能為 agent 建立 trace 與 failure taxonomy、設計並驗證 LLM judge、red-team 與 guardrail、建 golden dataset、用統計判斷進步，最後把整套 eval 接進 CI。

## Learning path

**Course order**：照課程四週的原順序走，每一週是一層。Tier 1（Week 1）建立「AI 產品不是 deterministic」的心智模型，並用 error analysis 把失敗變成可數的東西；Tier 2（Week 2）把判斷自動化，設計並驗證 LLM judge；Tier 3（Week 3）換成敵意假設，做 red-team 與 guardrail；Tier 4（Week 4）補上資料、RAG 與統計，最後收成可重跑的 harness。Office hours 與 assignment 併入所屬的那一週，不另開節點。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — Week 1：從 deterministic QA 到 error analysis

1. **[AI 產品為什麼需要 eval](nodes/why-ai-products-need-evals.md)**
   - Goal: 能解釋 deterministic QA 為何在 AI 產品上失效，並用 eval 回答「該發生什麼、不能發生什麼、能不能 ship」。
2. **[AI 產品品質的六個維度](nodes/six-quality-dimensions.md)**
   - Goal: 能用 model quality、product behavior、safety、reliability、cost、latency 評估一個 AI 產品，而不是只看 accuracy。
3. **[每個 eval 都是 task、dataset、scorer](nodes/task-dataset-scorer.md)**
   - Goal: 能把任何 eval 拆成 task／dataset／scorer 三塊，並說出 eval 是 build→test→monitor 的迴路。
4. **[從 trace 到 failure taxonomy](nodes/trace-to-failure-taxonomy.md)**
   - Goal: 能為 agent 建立可追蹤的 run，讀完整 trace、標註 pass/fail，聚類成可數且可排序的 failure codes。

### Tier 2 — Week 2：讓判斷可以自動化

5. **[四種 evaluator 類型](nodes/evaluator-types.md)**
   - Goal: 能依 failure mode 選對 code／LLM judge／human／user feedback，並說出傳統 metrics 為何在 LLM 輸出上失效。
6. **[寫出 binary judge rubric](nodes/binary-judge-rubric.md)**
   - Goal: 能用五個元素寫出單一判準、輸出格式固定的 binary judge prompt。
7. **[用真人標籤驗證 judge](nodes/validate-the-judge.md)**
   - Goal: 能用 agreement matrix、Cohen's κ 與 false-pass quadrant 判斷一個 judge 能不能上線。
8. **[多輪對話、tool call 與 A/B](nodes/multi-turn-tool-calls-and-ab.md)**
   - Goal: 能評分多輪對話與 tool call，並用 per-metric delta 做一次誠實的 A/B ship/no-ship 決策。

### Tier 3 — Week 3：安全、red-team 與 guardrail

9. **[Agent 的攻擊面與五類威脅](nodes/attack-surface-and-threats.md)**
   - Goal: 能畫出 agent 的攻擊面，並辨認 injection、jailbreak、leakage、harmful content 與 bias。
10. **[用 Promptfoo 做 red-team 掃描](nodes/promptfoo-red-team.md)**
    - Goal: 能跑一次 baseline scan、讀 failing traces，並用 frequency×severity 排出要修的風險。
11. **[Guardrail scorecard：catch rate 與 over-block rate](nodes/guardrail-scorecard.md)**
    - Goal: 能為 top risks 建 regex／judge／hybrid guardrail，並用 catch rate 與 over-block rate 兩個數字計分。

### Tier 4 — Week 4：資料、統計與可重跑的 harness

12. **[值得信任的 eval dataset](nodes/trustworthy-eval-datasets.md)**
    - Goal: 能建出 representative、diverse、correctly labeled、versioned 的 golden set，並安全地生成與驗證 synthetic cases。
13. **[把 retrieval 與 generation 分開量](nodes/retrieval-vs-generation.md)**
    - Goal: 能用 context precision／recall 與 faithfulness／answer relevance 判斷壞在 retrieval 還是 generation。
14. **[判斷進步是不是真的](nodes/is-the-improvement-real.md)**
    - Goal: 能用 paired test 與 bootstrap confidence interval 判斷一次進步是真的還是噪音。
15. **[把一次性 eval 變成可重跑的 harness](nodes/repeatable-eval-harness.md)**
    - Goal: 能用一個 config、一個指令重跑整套 eval，並把它接進 CI 與固定的 eval 節奏。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
