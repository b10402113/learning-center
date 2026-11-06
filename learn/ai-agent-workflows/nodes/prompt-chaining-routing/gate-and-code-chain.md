# 難的是讓程式碼流程跑起來

知道 chain 是開發者寫死的控制流之後，下一步是把它真的寫出來。很多人在剛接觸 AI 代理或工作流程開發時，常以為最困難的是串接大語言模型（LLM）的 API，或是寫出神奇的提示詞。但實際上，最核心且最具挑戰性的工作，是把程式碼本身的控制流程架構好。

只要程式碼的流程跑得順，要把 LLM 放進去其實非常簡單。相反地，如果一開始就讓模型不確定性的輸出干擾開發，你很難分清到底是程式邏輯寫錯，還是模型發揮失常。

因此，在搭建這套提示詞鏈（Prompt Chaining）的工作流程時，我們可以先用假呼叫（fake calls）來替代真實的 API 請求，並在程式碼中明確註記未來替換 API 的位置。讓整個流程盡可能保持確定性（deterministic），能讓我們清楚看見工作流程的骨架有多單純；一旦驗證了整套程式碼的流轉邏輯，最後只要把假呼叫換成真正的 API 呼叫即可。

## Prompt Chaining 的架構核心

這套設計遵循 Anthropic 在《Building Effective Agents》中對 Prompt Chaining 的定義：

1. **固定的步驟序列**：整個任務被拆解成不可隨意變動的連續步驟。
2. **前後相扣的資料流**：每一次 LLM 呼叫，都以前一次呼叫的輸出作為輸入。
3. **純程式碼關卡（Code Gates）**：在步驟之間設置純程式碼檢查，一旦中間輸出不符合預期，就立刻中斷鏈條。

<!--image:1-->

在這樣的架構中，LLM 完全沒有自主決定下一步要走哪裡的權力。模型接收文字輸入、吐出文字輸出，而資料接著該往哪裡送、流程何時該結束，完全由我們的程式碼牢牢掌控。這也是為什麼它被稱為「由 LLM 驅動的工作流程」（LLM-powered workflow），而不是自主代理（agent）。

## 為什麼要在步驟間加入關卡（Gate）

LLM 非常擅長從日常的自然語言句子中，抽取出使用者的喜好與厭惡。使用者不需要在制式表單上一格格填寫「喜歡走路、討厭面對電腦」，只要隨意聊幾句，模型就能理解。但要將這項能力安全地放進流程裡，就必須在關鍵位置設置關卡：

<!--image:2-->

* **避免無謂花費**：如果使用者根本沒有提供任何輸入，工作流程就應該在最前端直接擋下，不要浪費錢發出 API 請求。關卡在第一時間就能保護你的錢包與系統。
* **阻止錯誤累積（Error Compounding）**：如果第一步產生的內容殘缺或格式錯誤，直接傳給下一步只會讓模型在垃圾資訊上繼續胡說八道。
* **利用結構化 JSON 進行確定性檢查**：第一步要求模型挑選出最適合的職業，並且「只能」回傳包含職業與原因的 JSON 物件。要求 JSON 的好處，是讓第二步之前的關卡可以直接用程式碼進行精確驗證，而不是靠猜測。模型有時會在 JSON 外面額外包裹 Markdown 語法或多餘文字，純程式碼關卡就是專門用來捕捉這些異常狀況的地方。

當第一步的 JSON 輸出通過關卡檢驗後，流程才會進入第二步：傳入該職業與推薦理由，呼叫第二個 LLM 提示詞，請它為使用者規劃達成該職業的學習與實習路徑。

整套工作流程的實作程式碼如下：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerPromptChainWorkflow.js#L1-L104 -->

```javascript
// =============================================================================
// Career Path — PROMPT CHAIN WORKFLOW
// -----------------------------------------------------------------------------
// This is a WORKFLOW, not an agent:
//   - The steps and their order are hard-coded by US (the developer).
//   - The LLM never decides what to do next, never picks tools, never loops.
//   - Each LLM call does ONE small job, and its output is passed as the input
//     to the next LLM call. That's what "prompt chaining" means.
//
//   [User likes/dislikes] -> LLM #1 (pick career) -> GATE (plain code check)
//                         -> LLM #2 (roadmap for that career) -> [Final output]
//
// Run with:  node workflows/careerPromptChainWorkflow.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: in a real app, load your key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"

// --- PROMPTS (one per step in the chain) -------------------------------------
// Step 1 prompt: ONLY decides a career. Asks for JSON so our code can check it.
const CAREER_PROMPT = `You are a career counselor. Based on the user's likes and dislikes,
choose the ONE best-fit career. Respond ONLY with JSON: {"career": "...", "reason": "..."}`;

// Step 2 prompt: ONLY explains how to reach the career chosen in step 1.
const ROADMAP_PROMPT = `You are a career advisor. Given a career, explain how to get there:
required schooling, certifications/licenses, experience, and a rough timeline.`;

// --- FAKE LLM CALL -----------------------------------------------------------
// A single helper that every step uses to talk to the LLM.
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

  // FAKE: choose a canned response based on which step's prompt was used.
  const fakeResponses = {
    [CAREER_PROMPT]: JSON.stringify({
      career: "Wildlife Biologist",
      reason: "Combines a love of animals and science with outdoor fieldwork instead of desk work.",
    }),
    [ROADMAP_PROMPT]: [
      "1. School: Bachelor's in Biology, Zoology, or Wildlife Science (4 yrs). A Master's helps for research roles (+2 yrs).",
      "2. Certifications: Associate Wildlife Biologist (The Wildlife Society); First Aid/CPR for fieldwork.",
      "3. Experience: Seasonal field technician jobs, internships, volunteering at refuges.",
      "4. Timeline: About 4–6 years to become an entry-level wildlife biologist.",
    ].join("\n"),
  };
  return fakeResponses[systemPrompt];
}

// --- STEP 1: LLM picks a career ----------------------------------------------
async function chooseCareer(likesAndDislikes) {
  const raw = await callLLM(CAREER_PROMPT, likesAndDislikes);
  return JSON.parse(raw); // -> { career, reason }
}

// --- GATE: plain code (NOT an LLM) checks step 1 before continuing -----------
// Prompt chains often include "gates": cheap code checks that stop the chain
// early if an intermediate output is bad, instead of passing junk forward.
function gate(step1Output) {
  if (!step1Output?.career?.trim()) throw new Error("Step 1 did not return a career. Stopping chain.");
  return step1Output;
}

// --- STEP 2: LLM explains how to get to that career --------------------------
// Note the input here is the OUTPUT of step 1. This is the "chain".
async function buildRoadmap({ career, reason }) {
  return callLLM(ROADMAP_PROMPT, `Career: ${career}\nWhy it fits the user: ${reason}`);
}

// --- THE WORKFLOW: fixed order, decided by code, not by the LLM ---------------
async function runCareerWorkflow(likesAndDislikes) {
  const careerChoice = gate(await chooseCareer(likesAndDislikes)); // Step 1 + gate
  const roadmap = await buildRoadmap(careerChoice);                // Step 2
  return { ...careerChoice, roadmap };
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

runCareerWorkflow(userInput)
  .then(({ career, reason, roadmap }) => {
    console.log(`User input: ${userInput}\n`);
    console.log(`Suggested career: ${career}\nWhy: ${reason}\n`);
    console.log(`How to get there:\n${roadmap}`);
  })
  .catch((err) => console.error("Workflow failed:", err.message));
```

當你執行這段程式碼時，無論帶入範例文字還是空字串，系統都能如預期運作或正確攔截。在整個兩步驟執行結束後，所有內部的推理邏輯都已經封裝在各自的步驟內，最終程式碼只會呈現乾淨的結果。掌握這個由程式碼把關、LLM 只負責單一步驟轉換的模式，就是建立穩定 AI 工作流程的起點。
