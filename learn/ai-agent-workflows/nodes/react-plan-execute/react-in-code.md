# 一個 LLM 在迴圈裡跑

把 thought／action／observation 寫成程式，才會看見它為什麼會停不下來、為什麼會把 context 撐爆。當我們想讓語言模型不只回答問題，還能自己決定下一步要查什麼資料、呼叫什麼工具時，往往不能只做一次性的提示詞呼叫。先前的工作流程可能由我們的程式寫死步驟（例如先呼叫模型 A，經過檢查點，再呼叫模型 B）。但若是讓「同一個 LLM」在迴圈裡不斷執行、自己決定何時呼叫工具、何時給出最終結論，這就是 ReAct 架構的核心。

## 工具與自主呼叫的設計

在建立職涯推薦系統時，我們同樣要處理資料匹配。舉例來說，「國家公園巡邏員」（park ranger）這個職業可能帶有幾組標籤：喜歡戶外健行、動物與大自然。如果只用純文字關鍵字去比對，我們必須手動建立很多標籤；但若使用者輸入了類似卻不完全相同的詞彙，文字比對就會失效。這也是為什麼使用語意嵌入向量（embedding vectors）查詢會比文字比對好得多，因為它能找出所有與「健行」和「戶外」語意相關的延伸內容。

除了職業列表、進修途徑、學校類型與時間線之外，ReAct 代理人最關鍵的新要素就是「工具」（tools）。以往的工作流程不是不能呼叫外部 API，也不是模型不能要求外部資訊；差別在於，現在工具是由背後的程式碼自主執行，不需要我們手動為每一次 LLM 呼叫寫死特定的黏合程式。

我們可以提供兩套工具：
1. **職涯搜尋工具（search careers）**：針對使用者的喜好打分，每符合一項喜好加 1 分、符合一項排斥就減 1 分，並將最適合的結果排在最前面。
2. **查詢特定職業條件工具**：用來查閱進入某個職業需要哪些學歷、證照或經驗。

在工具設計上有一個重要細節：當工具執行出錯時，必須把錯誤當成一般文字回傳給模型。因為代理人是在迴圈中接收「觀察結果」（Observation），只要錯誤資訊能被放回上下文，模型就能讀到錯誤、自行分析（例如「是不是我剛才呼叫工具的格式寫錯了？」），並在下一個回合重新嘗試。

## 用 System Prompt 教會模型 ReAct 規範

模型本身並不知道自己是一個 ReAct 代理人，我們必須透過系統提示詞（system prompt）把這套規則主動「教」給它。在原始 ReAct 論文中，提示詞裡通常會附上一到兩組完整的軌跡範例（trajectory），也就是少樣本提示（few-shot prompting）。當模型看到具體的示範時，模仿這些格式並穩定輸出的成功率會大幅提升。

<!--image:1-->

系統提示詞的核心指令長這樣：
- 指派角色：「你是一位職涯顧問，請為使用者推薦一個最適合的職業，並解釋如何進入該領域。」
- 明確規範互動模式：「請交錯使用 **Thought（思考）**、**Action（行動）** 與 **Observation（觀察）** 來解決這個問題。」
- 解釋各步驟的職責：
  - **Thought**：根據目前為止得知的資訊進行推理，決定下一步該做什麼。
  - **Action**：只能從提供的工具清單中選擇一個工具來呼叫。
  - 格式限制：模型每一次只能輸出一組 Thought 與 Action，接著必須**停下來**，等待外部程式執行工具並回傳 Observation。收到 Observation 後，模型才會展開下一輪思考。

## 對話紀錄就是代理人的記憶

語言模型本身是無狀態（stateless）的。要讓它在迴圈裡持續工作，就必須仰賴對話紀錄（transcript）。

<!--image:2-->

在每一輪迴圈中，我們呼叫 LLM 函式時，傳入的不再只是單純的使用者輸入，而是「系統提示詞」加上「目前為止的整份對話紀錄」。這份紀錄包含了最初的問題，以及後續每一輪由程式依序附加的 Thought、Action 與 Observation。

如果我們使用的是測試用的模擬腳本（scripted model），它可能只是讀取紀錄中的問題與觀察結果，用粗糙的關鍵字比對寫出下一輪輸出；但在真實模型中，LLM 會對整份上下文重新進行推理。

假設使用者的輸入是：「我喜歡戶外健行、動物與大自然，不喜歡整天坐在辦公室。」模型讀取紀錄後，就會在第一回合推論出可以呼叫搜尋工具，並根據觀察結果鎖定國家公園巡邏員或野生動物生物學家等職業。

## 迴圈運作與保護上下文視窗

ReAct 的完整執行迴圈包含幾個關鍵階段：

1. **推論（Reason）**：LLM 讀取累積至今的對話紀錄，輸出 Thought 與 Action。
2. **解析與執行（Act）**：主程式解析模型輸出的文字。如果解析出工具名稱與參數，就執行對應工具；如果找不到對應工具，則回傳格式錯誤訊息讓模型修正。
3. **觀察（Observe）**：主程式把執行結果包裝成 `Observation: ...`，追加回對話紀錄中，進入下一輪。
4. **結束條件（Stop Condition）**：如果模型輸出了 `Final Answer:`，代表它認為資訊已經足夠，代理人工作完成；或者，當迴圈次數達到預設的上限（例如 5 次）時，強制中斷，避免無窮迴圈。

在整個迴圈中，除了設定最大迴圈次數這種防護機制外，我們對模型實際會轉幾圈並沒有絕對的控制權。只要還沒達到結束條件，模型就會依據自己的推理持續嘗試。

<!--image:3-->

這也帶來了一個必須特別注意的問題：**上下文視窗的膨脹**。對話紀錄是代理人的唯一記憶，每一輪迴圈都把先前的問題、思考、呼叫與觀察結果全部疊加進去。即使這還只是一個單代理人（single-agent）系統，都還沒進到多代理人架構，上下文的用量就會隨著輪數快速飆升。因此在設計工具輸出與紀錄時，精簡回傳內容、保護上下文視窗是維持系統穩定度與成本控制的重要關鍵。

以下是一個完整的單代理人 ReAct 實作範例，展示了如何將系統提示詞、工具表、模擬 LLM 呼叫與帶有最大輪數上限的迴圈整合在一起：

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerReActAgent.js#L1-L146 -->

```javascript
// =============================================================================
// Career Path — single ReAct AGENT
// -----------------------------------------------------------------------------
// This is an AGENT, not a workflow (compare with careerPromptChainWorkflow.js):
//   - In the workflow, OUR CODE fixed the steps: LLM #1 -> gate -> LLM #2.
//   - Here, ONE LLM runs in a loop and decides what happens next itself.
//
// ReAct = "Reason + Act" (Yao et al., 2022). Each turn of the loop the LLM:
//   Thought:     reasons about the situation           (Reason)
//   Action:      picks a tool + input to call           (Act)
//   Observation: our code runs the tool, feeds result back to the LLM
// ...and repeats until the LLM writes "Final Answer:".
//
// For this task the agent's run looks like this:
//   Loop 1 (LLM): Thought -> decides the career, then Action: look up requirements
//          (code): runs the tool -> Observation: schooling/certs/experience
//   Loop 2 (LLM): Thought -> has enough info, so Final Answer: how to get there
//
// Run with:  node single-agents/careerReActAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: load your real key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"
const MAX_LOOPS = 5; // Safety limit so the agent can't loop forever.

// --- TOOLS (the "Act" part of ReAct) -----------------------------------------
// The agent can call these tools. The LLM picks the tool by name and our code
// runs it. To give the agent new abilities, add another entry here.
const tools = {
  get_career_requirements: {
    description: "Looks up the schooling, certifications, and experience needed for a career. Input: a career name.",
    run: async (career) => {
      // REPLACE: call a real data source (web search API, O*NET API, your own DB...).
      // FAKE: a tiny hard-coded "database".
      const fakeDb = {
        "wildlife biologist":
          "Education: Bachelor's in Biology, Zoology, or Wildlife Science (4 yrs); Master's for research roles (+2 yrs). " +
          "Certifications: Associate Wildlife Biologist (The Wildlife Society); First Aid/CPR. " +
          "Experience: seasonal field technician jobs, internships, refuge volunteering.",
      };
      return fakeDb[career.toLowerCase()] ?? `No data found for "${career}".`;
    },
  },
};

// --- SYSTEM PROMPT: teaches the LLM the ReAct format --------------------------
// The tool list is generated from the `tools` object so the prompt stays in sync.
const SYSTEM_PROMPT = `You are a career advisor. Pick the ONE career that best fits the user's
likes and dislikes, then explain how to get there (school, certifications, experience, timeline).

You run in a loop of Thought, Action, Observation.
Available tools:
${Object.entries(tools).map(([name, tool]) => `- ${name}: ${tool.description}`).join("\n")}

To use a tool, respond EXACTLY like this, then stop and wait for the Observation:
Thought: <your reasoning>
Action: <tool name>
Action Input: <tool input>

When you have enough information, respond EXACTLY like this:
Thought: <your reasoning>
Final Answer: <the career, why it fits, and step-by-step how to get there>`;

// --- FAKE LLM CALL -----------------------------------------------------------
// Takes the whole conversation so far and returns the LLM's next Thought/Action.
async function callLLM(messages) {
  // REPLACE this whole block with a real API call. Example (OpenAI-style):
  //   const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
  //     body: JSON.stringify({
  //       model: MODEL,
  //       messages,
  //       stop: ["Observation:"], // Stops the LLM from making up its own tool results.
  //     }),
  //   });
  //   const data = await res.json();
  //   return data.choices[0].message.content;

  // FAKE: before any tool result arrives, decide a career and call the tool.
  // After the tool result arrives, give the final answer.
  const hasObservation = messages.some((m) => m.content.startsWith("Observation:"));
  if (!hasObservation) {
    return [
      "Thought: The user loves animals and science but dislikes desk work. Outdoor fieldwork studying animals",
      "fits best, so I'll choose Wildlife Biologist. Next I should look up what it takes to become one.",
      "Action: get_career_requirements",
      "Action Input: Wildlife Biologist",
    ].join("\n");
  }
  return [
    "Thought: I now have the requirements and can answer the user.",
    "Final Answer: Career: Wildlife Biologist",
    "Why: It combines animals and science with outdoor fieldwork instead of desk work.",
    "How to get there:",
    "1. School: Bachelor's in Biology, Zoology, or Wildlife Science (4 yrs). A Master's helps for research roles (+2 yrs).",
    "2. Certifications: Associate Wildlife Biologist (The Wildlife Society); First Aid/CPR for fieldwork.",
    "3. Experience: Seasonal field technician jobs, internships, volunteering at refuges.",
    "4. Timeline: About 4–6 years to become an entry-level wildlife biologist.",
  ].join("\n");
}

// --- THE REACT LOOP: the LLM decides each step; our code only runs tools ------
async function runCareerAgent(userInput) {
  // The conversation is the agent's memory. Every Thought/Action/Observation is added to it.
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userInput },
  ];

  for (let loop = 1; loop <= MAX_LOOPS; loop++) {
    // REASON: the LLM looks at everything so far and writes its next Thought + Action.
    const llmOutput = await callLLM(messages);
    messages.push({ role: "assistant", content: llmOutput });
    console.log(`--- Loop ${loop} ---\n${llmOutput}`);

    // DONE? If the LLM wrote a Final Answer, the agent has decided to stop.
    const finalAnswer = llmOutput.match(/Final Answer:\s*([\s\S]*)/);
    if (finalAnswer) return finalAnswer[1].trim();

    // ACT: read which tool the LLM chose, run it, and record the result.
    const action = llmOutput.match(/Action:\s*(.+)\s*Action Input:\s*(.+)/);
    const tool = action && tools[action[1].trim()];
    const observation = tool
      ? await tool.run(action[2].trim())
      : "Invalid action. Use one of the listed tools with the exact format."; // Lets the LLM fix its own mistake.

    // OBSERVE: feed the tool result back so the LLM can reason about it next loop.
    messages.push({ role: "user", content: `Observation: ${observation}` });
    console.log(`Observation: ${observation}\n`);
  }
  throw new Error(`Agent did not finish within ${MAX_LOOPS} loops.`);
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

console.log(`User input: ${userInput}\n`);
runCareerAgent(userInput)
  .then((answer) => console.log(`\n=== FINAL ANSWER ===\n${answer}`))
  .catch((err) => console.error("Agent failed:", err.message));
```
