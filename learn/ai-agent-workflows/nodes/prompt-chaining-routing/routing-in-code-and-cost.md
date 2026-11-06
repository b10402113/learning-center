# LLM 分類，程式碼決定路徑

上一段說 routing 是分岔，這裡把它落成可執行的程式碼。當你打造一個職涯諮詢服務時，使用者的問題往往五花八門：

* **職涯方向**：「我不知道自己適合做什麼，但我喜歡這些事物，我的人生該往哪走？」
* **學校與培訓**：「我想成為軟體工程師，該怎麼開始準備？」
* **學費與資助**：「我想去技術學校受訓成為修車技師，這筆學費該怎麼負擔？」

面對多樣化的需求，很多人直覺會想寫一個無所不包的巨大 prompt，把職涯分析、學校資料、學費補助政策全部塞在一起，讓同一個模型一次處理所有狀況。但這種做法不僅讓 context 變得臃腫龐大，模型的回答也容易失焦。

更好的設計是**路由工作流程（Routing Workflow）**：第一步只讓模型專注做分類，產出極簡的標籤，後續走哪條路則全由一般程式碼掌控。

## 路由是分支，而不是序列

在路由工作流程中，流程是一個「分支（Fork）」，而不是「序列（Sequence）」。

使用者的一次回應只會走向其中一條專屬路徑。理論上，分支與序列可以結合嗎？當然可以。你可以在系統產出最終回應後，讓流程重新回到起點展開下一輪互動；但就 routing 本身的結構來說，它是一次性的單選分流：

* **職涯路徑**：調用針對「性格與職涯適配」設計的模型與專門 prompt。
* **培訓路徑**：執行專門的程式碼，可能包含查詢培訓機構或學校清單的 lookup 邏輯。
* **資助路徑**：走專門尋找補助方案與貸款資訊的處理邏輯。

每一次請求只會進入這三條路徑的其中一條，並依據該路徑的聚焦邏輯給出專屬回答。

## 為什麼分流比「單一大 Prompt」更便宜？

單一大 prompt 確實能跑，但拆成多個專案 prompt 會便宜非常多。

<!--image:1-->

假設使用者只是單純想探索適合自己的工作，他完全不在意培訓管道或補助方案。如果用巨大 prompt 處理，模型必須在充滿無關規則的超長 context 裡運算；系統甚至可能為了備齊資訊，預先呼叫一堆無關的外部 API、把資料庫搜尋結果全部拉進 context。

實際上，這位使用者要的可能只是一句簡明建議：「你看起來喜歡用電腦，對數理與學習新知很有熱忱，那你適合成為……」。透過路由分流，系統不需要拉入無關資料，也不需要執行額外的資料庫檢索與 API 請求，省下的 token 與運算成本十分顯著。

## 實作架構：Classifier、Gate 與 Route Table

要安全地實現路由，工作流程通常由三個核心元件組成：

<!--image:2-->

1. **分類器（Classifier）**：使用一個只負責分類的 prompt，要求模型將使用者輸入歸類為特定標籤，並以 JSON 輸出。模型在這一階段不回答使用者的實際問題。
2. **守門邏輯（Fallback Gate）**：LLM 偶爾會輸出預期之外的字串或幻覺類別。這道 gate 是純程式碼（非 LLM），用來檢查分類結果是否合法。若遇到未知的 route，就退回安全的預設路徑（Default Route），避免系統崩潰。
3. **路由表（Route Table）**：用物件或字典對應每個標籤與其專屬處理函式。當需要擴充新的業務分支時，只要在路由表加一個項目，並在分類 prompt 補上一條說明即可，既有邏輯完全不受影響。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L1-L150 -->

```javascript
// =============================================================================
// Career Path — ROUTING WORKFLOW
// -----------------------------------------------------------------------------
// This is a WORKFLOW, not an agent:
//   - The paths and their code are hard-coded by US (the developer).
//   - The LLM never picks tools, never loops, and never decides what to do next
//     beyond ONE job: classifying the input.
//
// How this differs from the other files:
//   - careerPromptChainWorkflow.js: EVERY input goes through the SAME fixed steps, in order.
//   - THIS FILE: an LLM CLASSIFIES the input first, then plain code sends it down
//                ONE of several specialized paths. Each path has its own prompt.
//   - careerReActAgent.js / careerSequentialMultiAgent.js: agents that loop on their own.
//
// Why route? One prompt that tries to handle every kind of user does each job
// poorly. Separate, focused prompts do better, and the user only pays for the
// path they actually need.
//
//                                  +--> "explore"  -> LLM: suggest a career
//   [User input] -> LLM Router ----+--> "roadmap"  -> LLM: step-by-step roadmap   -> [Final output]
//     (classify)    + GATE         +--> "switch"   -> LLM: career-change plan
//
// Run with:  node workflows/careerRoutingWorkflow.js "I love animals and science, hate sitting at a desk"
// Try also:  node workflows/careerRoutingWorkflow.js "How do I become a nurse?"
//            node workflows/careerRoutingWorkflow.js "I'm an accountant and want to move into UX design"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: in a real app, load your key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"

// --- PROMPTS -----------------------------------------------------------------
// Router prompt: ONLY classifies the input. It does not answer the user.
// Asks for JSON so our code can check it. Listing every route and what it
// means is what makes the classification accurate.
const ROUTER_PROMPT = `You are a router for a career advice service. Classify the user's message into exactly ONE category:
- "explore": the user does NOT know what career they want and describes likes, dislikes, or interests.
- "roadmap": the user already names a specific career and wants to know how to get there.
- "switch": the user already has a job or career and wants to change to a different one.
Respond ONLY with JSON: {"route": "explore" | "roadmap" | "switch", "reason": "..."}`;

// One specialized prompt per route. Each is short and focused on a single kind of user.
const EXPLORE_PROMPT = `You are a career counselor. Based on the user's likes and dislikes,
choose the ONE best-fit career and explain why in 2-3 sentences.`;

const ROADMAP_PROMPT = `You are a career advisor. Given a career the user already wants, explain how to get there:
required schooling, certifications/licenses, experience, and a rough timeline.`;

const SWITCH_PROMPT = `You are a career-change coach. The user already works in one field and wants another.
Explain which of their current skills transfer, what gaps they must fill, and a realistic transition plan.`;

// --- FAKE LLM CALL -----------------------------------------------------------
// A single helper that the router and every route use to talk to the LLM.
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

  // FAKE: the router fakes a classification with simple keyword checks.
  // (A real LLM would understand the message; this just lets the demo run.)
  if (systemPrompt === ROUTER_PROMPT) {
    const text = userMessage.toLowerCase();
    if (/\b(i'm an?|i am an?|my job|currently work|switch|change careers?)\b/.test(text) || text.includes("move into")) {
      return JSON.stringify({ route: "switch", reason: "The user already has a job and wants a different one." });
    }
    if (/\b(how (do|can) i become|how to become)\b/.test(text)) {
      return JSON.stringify({ route: "roadmap", reason: "The user named a specific career and asked how to reach it." });
    }
    return JSON.stringify({ route: "explore", reason: "The user described likes and dislikes but named no career." });
  }

  // FAKE: each route returns a canned response.
  const fakeResponses = {
    [EXPLORE_PROMPT]:
      "Wildlife Biologist. It combines a love of animals and science with outdoor fieldwork instead of desk work.",
    [ROADMAP_PROMPT]: [
      "1. School: Bachelor's of Science in Nursing (4 yrs) or an Associate's degree in Nursing (2 yrs).",
      "2. Certifications: Pass the NCLEX-RN exam and get a state nursing license; CPR/BLS certification.",
      "3. Experience: Supervised clinical rotations during school; optional nursing assistant work.",
      "4. Timeline: About 2–4 years to become a registered nurse.",
    ].join("\n"),
    [SWITCH_PROMPT]: [
      "1. Transferable skills: Attention to detail, working with data, and meeting client deadlines.",
      "2. Gaps: Design fundamentals, user research, and a portfolio of real projects.",
      "3. Plan: Take a UX course or bootcamp (3–6 months), build 2–3 portfolio projects, then apply for junior roles.",
    ].join("\n"),
  };
  return fakeResponses[systemPrompt];
}

// --- THE ROUTES: a lookup table from route name -> specialized handler -------
// Adding a new kind of user means adding ONE entry here plus one line in the
// router prompt. Nothing else in the workflow changes.
const ROUTES = {
  explore: (input) => callLLM(EXPLORE_PROMPT, input),
  roadmap: (input) => callLLM(ROADMAP_PROMPT, input),
  switch: (input) => callLLM(SWITCH_PROMPT, input),
};
const DEFAULT_ROUTE = "explore"; // Used when the router's answer is unusable.

// --- STEP 1: LLM router classifies the input ---------------------------------
async function classify(userInput) {
  const raw = await callLLM(ROUTER_PROMPT, userInput);
  return JSON.parse(raw); // -> { route, reason }
}

// --- GATE: plain code (NOT an LLM) checks the router's answer ----------------
// LLMs can return a category we don't have. Instead of crashing or passing junk
// forward, fall back to a safe default route.
function gate(routerOutput) {
  const route = routerOutput?.route?.trim();
  if (route in ROUTES) return { ...routerOutput, route };
  console.warn(`Router returned unknown route "${route}". Falling back to "${DEFAULT_ROUTE}".`);
  return { route: DEFAULT_ROUTE, reason: "Router output was invalid; used default route." };
}

// --- THE WORKFLOW: the LLM classifies, but CODE chooses the path -------------
// Only ONE route runs per input. The LLM never sees the other routes' prompts.
async function runCareerWorkflow(userInput) {
  const { route, reason } = gate(await classify(userInput)); // Step 1 + gate
  const answer = await ROUTES[route](userInput);             // Step 2: the one matching route
  return { route, reason, answer };
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

runCareerWorkflow(userInput)
  .then(({ route, reason, answer }) => {
    console.log(`User input: ${userInput}\n`);
    console.log(`Routed to: ${route}\nWhy: ${reason}\n`);
    console.log(`Answer:\n${answer}`);
  })
  .catch((err) => console.error("Workflow failed:", err.message));
```

在整個流程中，LLM 的角色極為單純：它只在第一步輸出分類標籤，之後由純程式碼依照查表結果執行對應的分支。LLM 從頭到尾不會接觸到其他分支的 prompt，確保了輸入最精簡、成本最低，且輸出始終專注於當下的單一任務。
