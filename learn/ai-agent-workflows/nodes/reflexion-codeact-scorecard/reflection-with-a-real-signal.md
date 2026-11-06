# Reflection 要有真正的訊號告訴模型它錯了

當你讓 AI Agent 制定了一套計畫並開始執行，事情往往不會完全照著劇本走。如果 Agent 缺乏反思（Reflection）環境觀察結果的能力，遇到非預期的變動時就會直接卡死，無法靈活應變。

在典型的 Agent 迴圈中，模型會先評估目前的產出，在結束前修正計畫，再進行下一次嘗試。許多人談到反思時，直覺想到的往往是：只要在 Prompt 裡加上一句「請檢查自己的答案並修正」，模型就會自動變聰明。然而，如果沒有真正的外部訊號告訴它哪裡錯了，這種自我檢查往往只是自我感覺良好，甚至把原本正確的答案改錯。

## 反思的本質只是更多的 Prompting

從實作角度來看，反思其實就是更多次的 Prompting。

<!--image:1-->

這也是許多人剛接觸 Agent 時感到興奮的原因：它非常便宜且容易實驗。如果你想測試一種新的反思邏輯，通常只需要在畫面上修改幾個字，連寫複雜的業務程式碼都不用。不論你是軟體工程師、產品經理（PM）還是專案經理，任何人都能隨時修改、快速上線，團隊審查 Pull Request 時也格外輕鬆。

但這背後有一個常被忽略的成本陷阱。在系統評估的計分卡（Scorecard）上，每一次呼叫反思，都是整個迴圈中的額外請求，而且每一次請求都必須帶著 Agent 先前累積的完整軌跡（Trajectory）——包括前幾輪的所有規劃、工具呼叫與環境回傳紀錄。

因為你在迴圈裡不斷塞入更多的呼叫、更多的思考與更多的規劃，反思是讓 API 帳單意外翻上三倍最快的方式。在透過 Prompt 實作反思時，必須加上嚴格的防護欄（Guardrails）：設定明確的次數上限，例如思考過一次覺得還是錯的就停止，或是最多重試三到五次，避免系統陷入無窮迴圈燒光預算。

## 兩種自我反思方式：Self-Refine 與外部 Reflection

在目前的架構設計中，自我反思主要分為兩種型態：

<!--image:2-->

### 1. 沒有外部訊號的 Self-Refine

第一種是來自 2023 年一篇論文提出的 Self-Refine 機制。在這種模式下，完全沒有外部訊號介入：

1. 模型先生成第一版答案。
2. 系統把該答案丟回給同一個模型，問它：「這段內容有什麼問題？你會怎麼改？」
3. 系統再把原答案與模型自己給的批評意見一起打包，要求模型重寫一次。

整個過程由同一個模型包辦三個角色：生成（Generating）、批評（Critiquing）與精煉（Refining）。迴圈會持續進行，直到觸發防護欄的固定上限，或是模型自己判定「這已經夠好了，可以結束」。

2023 年的論文在七個任務上測試了 Self-Refine，平均比只回答一次獲得約 20% 的成效提升。但要釐清的是，這裡的系統箭頭依然是由開發者畫下的——是由我們決定加入批評步驟、決定讓模型迴圈重試，並定義何時該停下來。

### 2. 依靠真實反饋的 Reflection

另一種則是真正意義上的 Reflection。它與 Self-Refine 最大的差別在於：必須有來自模型外部的環境回饋告訴它失敗了。

例如程式碼編譯失敗、呼叫 API 拿到錯誤代碼、資料庫回傳空結果，或是單元測試沒有通過。外部世界發生了錯誤，模型才會停下來說：「等一下，這樣對嗎？看來不對。」

單純靠模型自我審查的極限，在 Google 2023 年發表的論文《Large Language Models Cannot Self-Correct Reasoning Yet》中被清楚揭露。該研究發現，在缺乏外部訊號、完全只靠模型自身判斷的情況下，推理表現並不總是會提升；有時表現甚至會倒退，因為模型往往會把精力花在「修正」根本沒有寫錯的地方。

這項研究給工程團隊一個非常明確的訊號：不要把時間浪費在撰寫冗長華麗的自我批評 Prompt，而應該把時間花在找出一個客觀、具體且確定性的外部訊號（External Signal），讓 Agent 能對照著反思。

## 在 Agent 迴圈中落實反思

在單一 Agent 系統中，這兩種機制的運作流程截然不同。

<!--image:3-->

如果是 Reflection，必須由外部測試套件或 API 錯誤告知失敗。你也可以讓模型自己寫測試來驗證，但必須注意一個限制：這時反思的品質完全受限於模型剛才寫出的測試水準，可靠度遠不如人類寫的測試案例。當確認失敗後，模型會用白話文記錄下反思：「我想我知道哪裡出錯了」，並把這段經驗文字帶進下一次的執行嘗試中。

如果沒有外部工具，單純採用 Self-Refine，模型就會自己產出、自己檢視、自己批評與修正。這其實非常接近工作流程中的「評估者－優化者」（Evaluator-Optimizer）模式，只是如果把迴圈與終止判斷全交給模型，開發者就等於讓渡了流程的控制權，由模型自己決定何時算達標。

以下面這個職涯規劃 Agent 為例：

1. **嘗試與行動（Action）**：使用者詢問：「我對科技業有興趣，但不確定什麼方向適合我的個性，可以推薦路徑並包含取得資金的方法嗎？」Agent 呼叫工具搜尋相關職涯、教育學程與資金來源。
2. **取得回饋（Evaluate）**：透過外部訊號檢查搜尋結果是否達成目標，這可以是自動化測試、評分函式，或是明確的使用者篩選條件。
3. **進行反思（Reflect）**：如果檢驗失敗（或在 Self-Refine 下模型自認不足），Agent 會明確寫下問題點與改進方向，例如：「我這次漏掉了資金選項，下次除了貸款之外，還必須主動搜尋獎學金與補助金（Scholarships and Grants）。」
4. **重試（Retry）**：帶上這段文字回饋重新執行，不斷重複直到成功通過外部驗證，或撞到最大重試次數的防護上限。

在實際工程落地時，最穩健的做法往往不是讓單一模型在混沌的上下文裡自我糾結，而是用明確的程式碼迴圈限制重試次數，並將生成與評估拆開。以下是一個用確定性程式碼控制迴圈、搭配評估者的工作流程範例：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerEvaluatorOptimizerWorkflow.js#L1-L155 -->

```javascript
// =============================================================================
// Career Path — EVALUATOR-OPTIMIZER WORKFLOW
// -----------------------------------------------------------------------------
// This is a WORKFLOW, not an agent:
//   - The loop structure is hard-coded by US (the developer): generate -> evaluate -> maybe revise.
//   - The LLM never picks tools and never decides whether the loop keeps going.
//     The evaluator only returns a verdict; plain CODE reads it and decides to
//     stop or retry, and CODE enforces the round limit.
//
// How this differs from the other files:
//   - careerPromptChainWorkflow.js: each step runs ONCE, moving forward only.
//   - careerRoutingWorkflow.js / careerParallelWorkflow.js: pick one path / run calls together.
//   - THIS FILE: one LLM call (the generator) writes an answer, a SECOND LLM call
//                (the evaluator) critiques it against clear criteria, and the
//                feedback is fed back to the generator to improve it.
//   - careerReActAgent.js / careerSequentialMultiAgent.js: agents that loop on their own.
//
// Use this pattern when (1) you have clear evaluation criteria and (2) an LLM
// can give feedback that actually makes the next draft better.
//
//   [User input] -> LLM Generator (draft) -> LLM Evaluator (PASS / NEEDS_IMPROVEMENT + feedback)
//                        ^                              |
//                        |------ feedback (code loop) --+   PASS or MAX_ROUNDS -> [Final output]
//
// Run with:  node workflows/careerEvaluatorOptimizerWorkflow.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: in a real app, load your key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"
const MAX_ROUNDS = 3; // Safety limit so the generate/evaluate loop can't run forever or burn money.

// --- PROMPTS -----------------------------------------------------------------
// Generator prompt: ONLY writes (or rewrites) a career recommendation.
const GENERATOR_PROMPT = `You are a career counselor. Based on the user's likes and dislikes,
recommend the ONE best-fit career. Include: the career, why it fits, and a short roadmap
(schooling, certifications, experience, timeline). If you are given feedback on a previous draft,
fix every problem it lists and keep what already worked.`;

// Evaluator prompt: ONLY judges the draft. The explicit criteria are what make
// this pattern work. Vague criteria give vague feedback. Asks for JSON so our code can read the verdict.
const EVALUATOR_PROMPT = `You are a strict reviewer of career recommendations. Check the draft against the user's input:
1. It fits at least one of the user's LIKES.
2. It does NOT conflict with any of the user's DISLIKES.
3. It includes a realistic roadmap: schooling, certifications, experience, and timeline.
Respond ONLY with JSON: {"verdict": "PASS" | "NEEDS_IMPROVEMENT", "feedback": "..."}
If NEEDS_IMPROVEMENT, the feedback must say exactly what to fix.`;

// --- FAKE LLM CALL -----------------------------------------------------------
// A single helper that the generator and evaluator both use to talk to the LLM.
// Right now it returns canned text so the file runs without a key or network.
async function callLLM(systemPrompt, userMessage) {
  // REPLACE this whole block with a real API call. Example (OpenAI-style):
  //   const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
  //     body: JSON.stringify({
  //       model: MODEL,
  //       messages: [
  //         { role: "system", content: systemPrompt },
  //         { role: "user", content: userMessage },
  //       ],
  //     }),
  //   });
  //   const data = await res.json();
  //   return data.choices[0].message.content;

  // FAKE generator: the first draft has a flaw; the revision (which includes feedback) fixes it.
  if (systemPrompt === GENERATOR_PROMPT) {
    if (!userMessage.includes("Feedback on previous draft")) {
      return "Career: Lab Researcher. Why: it involves science and sometimes working with animals. Roadmap: Bachelor's in Biology.";
    }
    return [
      "Career: Wildlife Biologist. Why: it combines animals and science with outdoor fieldwork instead of desk work.",
      "1. School: Bachelor's in Biology, Zoology, or Wildlife Science (4 yrs). A Master's helps for research roles (+2 yrs).",
      "2. Certifications: Associate Wildlife Biologist (The Wildlife Society); First Aid/CPR for fieldwork.",
      "3. Experience: Seasonal field technician jobs, internships, volunteering at refuges.",
      "4. Timeline: About 4–6 years to become an entry-level wildlife biologist.",
    ].join("\n");
  }

  // FAKE evaluator: flags the flawed first draft, passes the fixed one.
  if (userMessage.includes("Lab Researcher")) {
    return JSON.stringify({
      verdict: "NEEDS_IMPROVEMENT",
      feedback:
        "Lab research is mostly indoor desk and bench work, which conflicts with the user's dislike of sitting at a desk. " +
        "The roadmap is also missing certifications, experience, and a timeline.",
    });
  }
  return JSON.stringify({ verdict: "PASS", feedback: "Fits the likes, avoids the dislikes, and has a complete roadmap." });
}

// --- GENERATOR: LLM writes (or rewrites) the recommendation ------------------
// On round 1 it only sees the user's input. On later rounds it also sees its
// previous draft and the evaluator's feedback. That feedback is what makes the next draft better.
async function generate(likesAndDislikes, previousDraft, feedback) {
  const message = previousDraft
    ? `User input: ${likesAndDislikes}\n\nPrevious draft:\n${previousDraft}\n\nFeedback on previous draft: ${feedback}`
    : `User input: ${likesAndDislikes}`;
  return callLLM(GENERATOR_PROMPT, message);
}

// --- EVALUATOR: a SEPARATE LLM call judges the draft -------------------------
// Using a different prompt (and ideally fresh context) keeps the judge from
// just agreeing with the writer.
async function evaluate(likesAndDislikes, draft) {
  const raw = await callLLM(EVALUATOR_PROMPT, `User input: ${likesAndDislikes}\n\nDraft:\n${draft}`);
  return JSON.parse(raw); // -> { verdict, feedback }
}

// --- GATE: plain code (NOT an LLM) checks the evaluator's answer -------------
// Only an exact "PASS" ends the loop early. Anything else, including a malformed
// verdict, is treated as "not good enough" instead of silently accepting a bad draft.
function passed(evaluation) {
  return evaluation?.verdict === "PASS";
}

// --- THE WORKFLOW: a bounded loop, controlled by code, not by the LLM --------
async function runCareerWorkflow(likesAndDislikes) {
  let draft = null;
  let evaluation = null;

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    // OPTIMIZE: write a draft (using the last feedback, if any).
    draft = await generate(likesAndDislikes, draft, evaluation?.feedback);
    console.log(`[Round ${round}] Draft:\n${draft}\n`);

    // EVALUATE: judge the draft against the criteria.
    evaluation = await evaluate(likesAndDislikes, draft);
    console.log(`[Round ${round}] Verdict: ${evaluation.verdict}\nFeedback: ${evaluation.feedback}\n`);

    // DONE? Code decides, based on the verdict.
    if (passed(evaluation)) return { draft, rounds: round, approved: true };
  }

  // Ran out of rounds: return the best we have, but be honest that it never passed.
  return { draft, rounds: MAX_ROUNDS, approved: false };
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

runCareerWorkflow(userInput)
  .then(({ draft, rounds, approved }) => {
    console.log("========== FINAL RESULT ==========");
    console.log(`User input: ${userInput}\n`);
    console.log(`${approved ? "Approved" : "NOT approved (hit round limit)"} after ${rounds} round(s)\n`);
    console.log(draft);
  })
  .catch((err) => console.error("Workflow failed:", err.message));
```

無論是哪種架構，設計反思迴圈的核心原則都一樣：重試次數必須有硬性防護欄，而判斷做對與否的標準，越接近單元測試、編譯器回傳、API 狀態碼或人類確認等真實訊號，系統才越不容易在空轉中浪費 Token。
