# 在固定結構裡選分支，不等於決定結構本身

當我們著手設計 LLM 應用時，常會面臨一個兩難：既希望模型具備反思、檢查與靈活拆解任務的能力，又擔心放手讓它自主決策會導致失控、迴圈跑不停或成本暴增。

很多人以為「反思」和「分工」是 Agent 的專利，但事實上，只要流程的骨架是由工程師在程式碼裡寫死的，無論內部跑了多少次平行呼叫、檢查迴圈或動態拆解，它依然是一個可控的 Workflow（工作流程）。

關鍵的差異只在一件事：流程圖上的方塊與箭頭，究竟是在執行前由程式碼畫好的，還是模型在執行當下自己替自己畫的？

## 平行化：拆分子任務（Sectioning）與多數決（Voting）

在循序鏈結（Prompt Chaining）中，前一步的輸出往往是後一步的輸入，必須一步步排隊等待。但若有些工作彼此沒有相依性，或者我們需要驗證單一推論的穩定性，就可以採用平行化（Parallelization）。

平行化可以在單一 Agent 裡運作，也可以用在多 Agent 架構中。它的做法是一次發出多個 LLM 呼叫，最後再把結果彙整起來。平行化主要有兩種型態：

<!--image:1-->

1. **區塊拆分（Sectioning）**：當一個大任務能乾淨拆解成若干個互不干擾的子任務時，便可以同時呼叫不同的 LLM。例如在職涯諮詢情境中，針對同一個職稱，可以同時平行產生「學習路徑（Roadmap）」、「就業市場前景（Outlook）」以及「日常工作樣貌（Day-to-day）」，最後組裝成一份完整報告。因為彼此不互相依賴，同時發送能大幅降低延遲。
2. **多數決（Voting）**：對同一個任務同時執行多次呼叫，再比對這些結果。當任務難以乾淨拆分成獨立子任務時，Voting 透過冗餘（Redundancy）來提升準確度與信心。

在 Voting 的流程中，同一份使用者資料（例如個性、興趣與職涯目標）會同時發送給三組不同的 LLM 呼叫。這三組呼叫可以是相同的任務搭配不同的提示詞，也可以在底層採用不同的模型。

當這三組模型平行運算並回傳職涯建議時，系統需要一個「綜整（Synthesis）」步驟來處理結果。這個綜整步驟並不一定要呼叫 LLM，用幾行確定性的常規程式碼就能完成。例如在程式碼裡建立一個計數物件，統計各職稱出現的次數（軟體工程師 3 票、UI/UX 設計師 2 票、教師 1 票），並依票數高低決定回傳內容。這種確定性程式碼既快速、便宜又完全可預測。

若希望提供給使用者更自然的對話體驗，也可以把所有模型的原始結果交給另一個 LLM，讓它寫成一段連貫的敘事，說明為什麼某些職業獲得最高共識。

以下程式碼示範了如何在同一個工作流程中結合 Voting（多數決挑出職業）與 Sectioning（平行產出三種面向的說明）：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerParallelWorkflow.js#L1-L154 -->

```javascript
// =============================================================================
// Career Path — PARALLELIZATION WORKFLOW
// -----------------------------------------------------------------------------
// This is a WORKFLOW, not an agent:
//   - The structure is hard-coded by US (the developer).
//   - The LLM never decides what to do next, never picks tools, never loops.
//   - Several LLM calls run AT THE SAME TIME, and plain code combines the results.
//
// How this differs from the other files:
//   - careerPromptChainWorkflow.js: calls run ONE AFTER ANOTHER (each needs the previous output).
//   - careerRoutingWorkflow.js: ONE path is chosen and run.
//   - THIS FILE: independent calls run TOGETHER (Promise.all), then code aggregates.
//   - careerReActAgent.js / careerSequentialMultiAgent.js: agents that loop on their own.
//
// Parallelization has two variations, and this file uses both:
//   1. VOTING:     run the SAME task several times and combine the answers, for
//                  more confidence. (Here: 3 counselors each pick a career, majority wins.)
//   2. SECTIONING: split a task into DIFFERENT independent subtasks that don't
//                  need each other's output. (Here: roadmap, outlook, and day-to-day
//                  life for the winning career are written at the same time.)
//
//                       +--> LLM pick #1 --+
//   [User input] ------>+--> LLM pick #2 --+--> VOTE (code) --> winning career
//                       +--> LLM pick #3 --+                          |
//                                                  +--> LLM: roadmap -+
//                                                  +--> LLM: outlook -+--> AGGREGATE (code)
//                                                  +--> LLM: day-to-day +    --> [Final output]
//
// Run with:  node workflows/careerParallelWorkflow.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: in a real app, load your key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"
const NUM_VOTERS = 3; // How many times the SAME pick-a-career task runs in parallel.

// --- PROMPTS -----------------------------------------------------------------
// VOTING prompt: the same prompt is sent NUM_VOTERS times. Asks for JSON so our code can count votes.
const PICK_CAREER_PROMPT = `You are a career counselor. Based on the user's likes and dislikes,
choose the ONE best-fit career. Respond ONLY with JSON: {"career": "..."}`;

// SECTIONING prompts: each one covers a DIFFERENT aspect of the same career.
// None of them needs another's output, which is why they can run in parallel.
const ROADMAP_PROMPT = `You are a career advisor. Given a career, explain how to get there:
required schooling, certifications/licenses, experience, and a rough timeline.`;

const OUTLOOK_PROMPT = `You are a labor-market analyst. Given a career, summarize typical salary range
and job growth outlook in 2-3 sentences.`;

const DAY_TO_DAY_PROMPT = `You are a working professional in the given career. Describe what a typical
day looks like, including the best and hardest parts, in 2-3 sentences.`;

// --- FAKE LLM CALL -----------------------------------------------------------
// A single helper that every parallel call uses to talk to the LLM.
// Right now it returns canned text so the file runs without a key or network.
let pickCount = 0; // FAKE only: lets the 3 voters give slightly different answers.

async function callLLM(systemPrompt, userMessage) {
  // REPLACE this whole block with a real API call. Example (OpenAI-style):
  //   const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
  //     body: JSON.stringify({
  //       model: MODEL,
  //       temperature: 1, // For voting, keep some randomness so voters can differ.
  //       messages: [
  //         { role: "system", content: systemPrompt },
  //         { role: "user", content: userMessage },
  //       ],
  //     }),
  //   });
  //   const data = await res.json();
  //   return data.choices[0].message.content;

  // FAKE: the voters disagree once, so the majority vote has something to decide.
  if (systemPrompt === PICK_CAREER_PROMPT) {
    const careers = ["Wildlife Biologist", "Veterinarian", "Wildlife Biologist"];
    return JSON.stringify({ career: careers[pickCount++ % careers.length] });
  }

  // FAKE: choose a canned response based on which prompt was used.
  const fakeResponses = {
    [ROADMAP_PROMPT]: [
      "1. School: Bachelor's in Biology, Zoology, or Wildlife Science (4 yrs). A Master's helps for research roles (+2 yrs).",
      "2. Certifications: Associate Wildlife Biologist (The Wildlife Society); First Aid/CPR for fieldwork.",
      "3. Experience: Seasonal field technician jobs, internships, volunteering at refuges.",
      "4. Timeline: About 4–6 years to become an entry-level wildlife biologist.",
    ].join("\n"),
    [OUTLOOK_PROMPT]: "Typical pay is roughly $50k–$85k per year. Jobs are expected to grow about as fast as average, with competition for research roles.",
    [DAY_TO_DAY_PROMPT]: "Days mix outdoor field surveys with data entry and report writing. The best part is working with wildlife; the hardest is long hours in bad weather.",
  };
  return fakeResponses[systemPrompt];
}

// --- VARIATION 1: VOTING -----------------------------------------------------
// Run the SAME task NUM_VOTERS times at once. Promise.all starts every call
// immediately and waits for all of them, so this takes about as long as ONE call.
async function pickCareerByVote(likesAndDislikes) {
  const calls = Array.from({ length: NUM_VOTERS }, () => callLLM(PICK_CAREER_PROMPT, likesAndDislikes));
  const votes = (await Promise.all(calls)).map((raw) => JSON.parse(raw).career?.trim());
  return majority(votes);
}

// --- AGGREGATOR + GATE: plain code (NOT an LLM) counts the votes -------------
// Combining results is done by code, so it's fast, free, and predictable.
function majority(votes) {
  const valid = votes.filter(Boolean);
  if (valid.length === 0) throw new Error("No voter returned a career. Stopping workflow.");

  const tally = {};
  for (const career of valid) tally[career] = (tally[career] || 0) + 1;
  console.log("Votes:", tally);

  // Highest count wins; on a tie, the career that got its first vote earliest wins.
  return Object.keys(tally).reduce((best, career) => (tally[career] > tally[best] ? career : best));
}

// --- VARIATION 2: SECTIONING -------------------------------------------------
// Run DIFFERENT, independent tasks at once. Each gets the same input (the career)
// but has its own prompt, so each prompt can stay short and focused.
async function describeCareer(career) {
  const [roadmap, outlook, dayToDay] = await Promise.all([
    callLLM(ROADMAP_PROMPT, `Career: ${career}`),
    callLLM(OUTLOOK_PROMPT, `Career: ${career}`),
    callLLM(DAY_TO_DAY_PROMPT, `Career: ${career}`),
  ]);
  return { roadmap, outlook, dayToDay };
}

// --- THE WORKFLOW: parallel stages, in an order decided by code --------------
// Sectioning needs the career first, so voting must finish before sectioning
// starts. Parallelism happens INSIDE each stage, never between dependent steps.
async function runCareerWorkflow(likesAndDislikes) {
  const career = await pickCareerByVote(likesAndDislikes); // Stage 1: voting
  const sections = await describeCareer(career);           // Stage 2: sectioning
  return { career, ...sections };
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

runCareerWorkflow(userInput)
  .then(({ career, roadmap, outlook, dayToDay }) => {
    console.log(`User input: ${userInput}\n`);
    console.log(`Suggested career (by majority vote): ${career}\n`);
    console.log(`How to get there:\n${roadmap}\n`);
    console.log(`Job outlook:\n${outlook}\n`);
    console.log(`A typical day:\n${dayToDay}`);
  })
  .catch((err) => console.error("Workflow failed:", err.message));
```

## Evaluator-Optimizer：把「反思」放進固定流程

許多人認為 Agent 比 Workflow 優越，是因為 Agent 具備「規劃（Planning）」與「反思（Reflection）」的能力。但反思完全可以內建在固定結構的 Workflow 中，這就是 Evaluator-Optimizer 模式。

Evaluator-Optimizer 由兩個角色組成：
- **Generator（生成者）**：負責生成第一版草稿或解決方案。
- **Evaluator（評估者）**：獨立檢視該草稿，對照標準進行評估，並回傳評語與修改反饋。

Generator 拿到反饋後重新修改草稿，兩者形成一個循環，直到評估者判定通過（Pass），或者觸發了開發者設定的終止條件（例如達到最大輪數上限）。

<!--image:2-->

這個模式的核心代價是「呼叫次數變多、成本增加以換取更高品質」。它最適合的場景，是評估標準極為具體、清晰且容易捕捉的任務。反思如果只是讓同一個模型自我批判，效果往往有限；反思必須建立在具體、明確、甚至是確定性的檢驗標準之上，才能發揮真正價值。

例如在職涯推薦任務中，使用者要求提供科技領域的職涯路徑、對應培訓計畫與補助管道。Generator 產出第一版後，Evaluator 審查草稿並給出具體反饋：「內容太籠統，請補上具體的計畫名稱與預估費用。」Generator 接到這份反饋摘要後重新生成，再次送交 Evaluator 檢驗，直到達到標準。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerEvaluatorOptimizerWorkflow.js#L97-L142 -->

```javascript
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
```

## 在固定結構裡選分支，不等於決定結構本身

看見 Evaluator-Optimizer 的架構時，很容易讓人產生疑問：既然有 LLM 評估、有迴圈、甚至各步驟還能呼叫外部工具，這難道不是 Agent 嗎？

<!--image:3-->

答案不是。這正是 Workflow 與 Agent 最根本的界線。

在 Evaluator-Optimizer 中，整個流程的結構是開發者在程式碼裡預先寫死的。LLM 確實在此架構內部做出了判斷——決定草稿寫什麼內容、決定是否給予 PASS、決定呼叫工具時要代入什麼參數。但是，**模型從頭到尾都沒有權力改變步驟本身**。

模型不能自行決定跳過 Evaluator；如果某個步驟沒有配置某個工具，模型不能擅自拿來用；模型更不可能憑空在流程後方發明新的步驟。

- 在 **Workflow** 裡，模型只是填滿方塊內容的引擎，方塊與方塊之間的箭頭早已由外圍的程式碼固定。Evaluator 可以回傳通過或不通過，但這只是在工程師畫好的二選一分支中選擇走哪一條路。「在固定結構裡選分支」和「自己決定流程結構」是兩回事。
- 在 **Agent** 裡，流程圖在執行前根本不存在，是模型在執行期（Runtime）根據當前的目標、狀態與工具回傳結果，自己一步一步替自己畫出下一個方塊與箭頭。

## Orchestrator-Workers：游走在邊界上的動態拆解

最後一種常見模式是 Orchestrator-Workers（編排者與工作者）。

在這種架構中，中央有一個 Orchestrator LLM，負責將使用者的總體任務動態分解為多個子任務，並分派給個別的 Worker LLM 處理；最後 Orchestrator 再將所有 Worker 的成果融合成單一最終回覆。

<!--image:4-->

這跟 Prompt Chaining 截然不同：在 Prompt Chaining 中，子步驟與先後順序是由工程師寫死的；而在 Orchestrator-Workers 中，是由 Orchestrator 模型在執行期決定需要哪些子任務。

因此，Orchestrator-Workers 正好踩在 Workflow 與 Agent 的邊界上。

它特別適合「無法在事前預測子任務數量與內容」的情境。例如軟體工程中的程式碼編輯：使用者提出一個需求，有時只需要在單一檔案補上一行 `if` 判斷式，有時卻需要修改 13 個檔案、新增上千行程式碼。開發者無法用靜態流程預測到底要開幾個步驟，這時就適合交由 Orchestrator 進行動態拆解。

在執行職涯推薦時，Orchestrator 接收到使用者的個性與背景後，開始拆解需求：它可能先決定派一個 Worker 去找適合的職業，拿到結果後發現還缺少就學資訊，再派一個學校調查 Worker；接著又規劃需要資金方案 Worker。等所有必要資訊都蒐集齊全，Orchestrator 認定任務已全部完成，才組裝出完整的最終建議。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerOrchestratorWorkersWorkflow.js#L119-L165 -->

```javascript
// --- STEP 1: ORCHESTRATOR LLM plans the subtasks -----------------------------
// The code never says "do a roadmap, then do an outlook". The LLM decides this at runtime.
async function plan(userInput) {
  const raw = await callLLM(ORCHESTRATOR_PROMPT, userInput);
  return JSON.parse(raw).subtasks; // -> [{ type, instruction }, ...]
}

// --- GATE: plain code (NOT an LLM) checks the plan before spending money -----
// The orchestrator's plan controls how many LLM calls we make, so we validate it.
// Drop malformed subtasks and cap the count instead of trusting the LLM blindly.
function gate(subtasks) {
  const valid = (Array.isArray(subtasks) ? subtasks : [])
    .filter((s) => s?.type?.trim() && s?.instruction?.trim())
    .slice(0, MAX_SUBTASKS);
  if (valid.length === 0) throw new Error("Orchestrator returned no usable subtasks. Stopping workflow.");
  return valid;
}

// --- STEP 2: WORKER LLMs each do one subtask ---------------------------------
// Each worker sees the original input (for context) plus ONLY its own subtask.
// The subtasks are independent, so Promise.all runs the workers at the same time.
async function runWorkers(userInput, subtasks) {
  return Promise.all(
    subtasks.map(async ({ type, instruction }) => {
      const result = await callLLM(
        WORKER_PROMPT,
        `User message: ${userInput}\n\nSubtask type: ${type}\nSubtask: ${instruction}`
      );
      console.log(`[Worker: ${type}] ${result}\n`);
      return { type, result };
    })
  );
}

// --- STEP 3: SYNTHESIZER LLM combines the worker results ---------------------
async function synthesize(userInput, workerResults) {
  const combined = workerResults.map(({ type, result }) => `${type}: ${result}`).join("\n");
  return callLLM(SYNTHESIZER_PROMPT, `User message: ${userInput}\n\nSpecialist results:\n${combined}`);
}

// --- THE WORKFLOW: plan -> delegate -> synthesize, in an order set by code ---
async function runCareerWorkflow(userInput) {
  const subtasks = gate(await plan(userInput));                 // Step 1 + gate
  console.log(`Orchestrator planned ${subtasks.length} subtasks: ${subtasks.map((s) => s.type).join(", ")}\n`);
  const workerResults = await runWorkers(userInput, subtasks);  // Step 2
  return synthesize(userInput, workerResults);                  // Step 3
}
```

在實作 Orchestrator-Workers 時，為了防止成本失控，外圍程式碼依然可以加上 Gate 機制（如程式碼中的 `gate` 函式），過濾無效任務並限制子任務總數上限。

透過清楚劃分「由程式碼掌控結構」與「由模型決定內容」，我們就能在需要高可靠度的場景選擇嚴謹的平行化或審查迴圈，在需要彈性的場景引入編排者，排出最符合系統穩定性與成本要求的架構。
