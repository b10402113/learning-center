# Evaluator-Optimizer：生成、批評、再生成，直到停止條件

分類只挑一條既有 lane；當產出需要來回修改，就得讓 evaluator 進場。在建構 AI 應用時，單次生成的品質往往不夠穩定。我們很自然會想到一個直覺的解法：讓一個模型負責寫，另一個模型負責審查；只要審查不通過，就退回重寫。

這種架構通常被稱為 **Evaluator-Optimizer**，在文獻與實務上也常被叫做 **Reflection**、**Self-Refine** 或 **Critic**。在多 Agent 系統中，這不是單純多發幾次 Prompt，而是由兩個獨立的 Agent 分工協作：一個是負責解決問題的生成者（Optimizer），另一個則是負責驗證並提出修改意見的審查者（Evaluator）。兩者各自具備獨立的推理能力與工具，形成一個持續改進的封閉迴圈。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js#L1-L31 -->

```javascript
// =============================================================================
// Career Path — EVALUATOR-OPTIMIZER MULTI-AGENT system
// -----------------------------------------------------------------------------
// How this differs from the other files:
//   - careerEvaluatorOptimizerWorkflow.js: the generator and evaluator are single LLM CALLS.
//   - careerSequentialMultiAgent.js: agents run once each, in a fixed order, and never go back.
//   - THIS FILE: TWO AGENTS, each with its own role, tools, and ReAct loop, take turns in a loop:
//                the WRITER agent produces a draft, the REVIEWER agent checks it, and the
//                reviewer's feedback goes back to the writer for another try.
//
// Because both are agents, they can use tools. The writer researches careers, and the
// reviewer can VERIFY claims against data instead of just trusting the draft.
// (This is the "generate and review" + "iterative refinement" pattern from Google ADK,
// where a LoopAgent repeats until a checker says the result passes or the loop hits its limit.)
//
// Plain code (the orchestrator), NOT an LLM, runs the loop:
//   - It runs the writer, then the reviewer, and passes results through a shared `state` object.
//   - It reads the reviewer's verdict and decides to stop or go another round.
//   - It enforces the round limit.
// The reviewer only reports a verdict. It never decides whether the loop continues.
//
//   [User input] -> Agent 1: Career Writer   --state.draft-->
//                        ^   Agent 2: Career Reviewer --state.review--> PASS? --yes--> [Final output]
//                        |                                             |
//                        +------------ feedback (code loop) -----------+ no (and rounds left)
//
// Inside each agent, the LLM decides its own steps (Thought -> Action -> Observation
// -> ... -> Final Answer). That's what makes each one an AGENT, not just an LLM call.
//
// Run with:  node multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================
```

## 運作流程：帶著軌跡與回饋持續修正

在 Evaluator-Optimizer 架構中，系統的推進方式非常直觀：

<!--image:1-->

1. **生成階段**：Optimizer 根據任務目標，產出初步解答或草稿。
2. **評估階段**：Evaluator 檢視這份解答，給出具體的批評與修改建議。
3. **回饋循環**：如果審查未達標準，系統會將這份批評意見，連同上一輪的執行軌跡（trajectory）一併交還給 Optimizer，明確要求「根據這些缺點進行修改」。
4. **終止檢查**：Optimizer 改出新版本後再次送審，直到 Evaluator 滿意，或者觸發預設的停止條件為止。

以科技職涯諮詢為例：使用者提出想轉換跑道進入科技業，希望了解相關路徑、培訓計畫與補助資金。

- **第一輪**：Optimizer 產出初步方案，列出三種可能的職涯方向與培訓。
- **審查回饋**：Evaluator 檢查後指出：「部分選項過於空泛，請換成具體的培訓課程，並補上預估花費。」
- **第二輪**：Optimizer 帶著上一輪的內容與這份具體要求重新搜尋、補充細節，再次交給 Evaluator。
- **最終產出**：Evaluator 確認方案具體且包含費用估算，判定合格，系統隨即輸出完整的職涯規劃與下一步行動建議。

這種讓 Agent 帶著回饋自我修正的機制，能讓最終產出的穩定度顯著高於單次直出的系統。

## 最重要的生命線：嚴格的停止條件

在所有常見的 Agent 架構中，Evaluator-Optimizer 是最容易陷入無窮迴圈（infinite loop）的模式。

<!--image:2-->

審查者永遠能挑出毛病，生成者也可能始終達不到理想標準。如果沒有強制踩煞車的機制，系統就會在「檢查、批評、修改」之間無限空轉。

每一次重跑 Reflection 迴圈，都代表著額外的模型呼叫與 Token 開銷。可靠性與成本在這裡直接掛鉤——跑越多次，檢查越仔細，花費的成本就呈線性甚至指數級飆升。

因此，為系統設置硬性的停止條件（stop condition）是絕對必要的安全防線。常見的做法包含：

- **最大迭代次數上限（Max Iteration Cap）**：限制最多只能修改幾輪（例如最多 3 到 5 輪）。
- **超時時間（Timeout）**：設定整體執行的時間上限。

更關鍵的是，決定「要不要繼續跑下一輪」的決策點，必須是外層確定的程式邏輯（Deterministic Code），而不是交給 LLM 自己決定要不要停下來。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js#L223-L247 -->

```javascript
// --- GATE: plain code (NOT an LLM) reads the reviewer's verdict --------------
// Only a verdict that starts with exactly "PASS" ends the loop early. Anything else, including
// a malformed answer, counts as "not good enough" instead of silently accepting a bad draft.
function passed(review) {
  return /^PASS\b/.test(review.trim());
}

// --- EVALUATOR-OPTIMIZER ORCHESTRATOR: plain code, a bounded loop, no LLM ----
// Runs the writer, then the reviewer, and repeats until the reviewer passes the draft
// or MAX_ROUNDS is reached.
async function runEvaluatorOptimizer(writer, reviewer, state) {
  for (let round = 1; round <= MAX_ROUNDS; round++) {
    console.log(`\n========== Round ${round}: ${writer.name} ==========\n`);
    state[writer.outputKey] = await writer.run(state);

    console.log(`\n========== Round ${round}: ${reviewer.name} ==========\n`);
    state[reviewer.outputKey] = await reviewer.run(state);

    // DONE? Code decides, based on the verdict.
    if (passed(state[reviewer.outputKey])) return { state, rounds: round, approved: true };
  }

  // Ran out of rounds: return the latest draft, but be honest that it never passed.
  return { state, rounds: MAX_ROUNDS, approved: false };
}
```

## 為什麼 Coding Agent 行得通？外部訊號的價值

許多工程師都體驗過寫程式的 Coding Agent：Agent 寫出程式碼、執行測試、發現測試失敗、閱讀報錯訊息、修改程式碼，然後再次執行測試，直到所有測試通過為止。

這正是標準的 Evaluator-Optimizer 流程，而且成效往往非常顯著。然而，這個模式之所以可靠，並不是因為模型具備多麼厲害的自省能力，而是因為它依賴了**外部訊號（External Signal）**——測試通過或報錯資訊是確定且客觀的外部事實。

<!--image:3-->

如果只是讓模型看著自己產生的文字，並在 Prompt 裡問它：「你覺得這段文字好不好？哪裡需要改進？」，這種純靠模型自我反思的可靠性非常低。與其花大把時間打磨華麗的審查 Prompt（fancy critique prompt），不如為 Evaluator 配備能夠核對事實的工具、測試腳本或外部資料庫，讓評估建立在具體且確定（tangible and deterministic）的反饋之上。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js#L193-L221 -->

```javascript
// --- AGENT 2: Career Reviewer (the "evaluator") ------------------------------
// Job: judge the draft against explicit criteria, using a tool to check facts.
// The explicit criteria are what make this pattern work. Vague criteria give vague feedback.
const careerReviewer = createAgent({
  name: "Career Reviewer",
  role:
    "You are a strict reviewer of career recommendations. Check the draft against the user's input:\n" +
    "1. It fits at least one of the user's LIKES.\n" +
    "2. It does NOT conflict with any of the user's DISLIKES. Verify this with your tool; do not guess.\n" +
    "3. It includes a realistic roadmap: schooling, certifications, experience, and timeline.\n" +
    "Your Final Answer must start with exactly PASS or NEEDS_IMPROVEMENT, then a colon and your feedback. " +
    "If NEEDS_IMPROVEMENT, the feedback must say exactly what to fix.",
  task: (state) => `User input: ${state.userInput}\n\nDraft to review:\n${state.draft}`, // <- reads the writer's output
  outputKey: "review",
  tools: {
    get_work_environment: {
      description: "Looks up where and how a career's work is typically done. Input: a career name.",
      run: async (career) => {
        // REPLACE: call a real source (O*NET work context data, your own DB...).
        // FAKE: a tiny hard-coded "database".
        const fakeDb = {
          "lab researcher": "Lab Researcher: mostly indoors; bench and computer work; about 70% of time at a desk.",
          "wildlife biologist": "Wildlife Biologist: mostly outdoor fieldwork; about 30% of time at a desk for reports.",
        };
        return fakeDb[career.toLowerCase()] ?? `No data found for "${career}".`;
      },
    },
  },
});
```

## 記分卡權衡：Context 膨脹與壓縮策略

在架構權衡上，Evaluator-Optimizer 的優缺點非常極端：

- **可靠性（Reliability）極高**：擁有獨立的批評步驟反覆核對，比起讓單一 Agent「自信交卷」，能攔截下絕大多數明顯瑕疵與邏輯漏洞。
- **成本與上下文（Context）負擔沉重**：這是此架構最大的痛點。每一輪迭代，系統都必須把前一輪嘗試的完整內容、工具呼叫記錄，再加上 Evaluator 的批評意見全部塞進上下文視窗。上下文隨著輪數迅速膨脹，不僅大幅增加 Token 消耗，也容易讓模型在冗長的歷史記錄中迷失注意力。

<!--image:4-->

當遇到 Context 膨脹的問題時，常見的上下文壓縮（Compaction）策略有幾種：

1. **獨立摘要模型**：呼叫另一個較輕量的 LLM 來精簡歷史軌跡。在 Prompt 中明確規範哪些關鍵資訊（如已被驗證的事實、明確指出的缺陷）必須保留，哪些冗長的嘗試細節可以直接剔除，整理成精簡摘要後再傳入下一輪。
2. **快取機制（Cache）**：將中間產物或工具查詢結果存入外部儲存，只在需要時調取，避免全文常駐在 Context 內。

使用另一個 LLM 進行結構化摘要，能在不增加過多外部系統依賴的前提下，有效控制上下文長度，讓迴圈在有限的資源預算內順利完成修訂。
