# 先規劃，再執行

ReAct 邊走邊看，代價是每一輪都要重新想一次。當你請 AI Agent 處理一個複雜的多步驟任務時，最直覺的做法可能是讓它像 ReAct 架構一樣：走一步、看一步，每次拿到工具的輸出後再決定下一步要做什麼。這種方式雖然靈活，但頻繁呼叫大型語言模型（LLM）的成本極高，而且在面對目標明確的任務時，容易產生不必要的回圈。

如果你面對的任務流程大致固定，而且一開始就能清楚拆解步驟，「先規劃，再執行」（Plan-and-Execute）是另一種結構更精準、成本通常更低的單一代理人（single-agent）架構。

## 什麼是 Plan-and-Execute 架構？

Plan-and-Execute 的運作邏輯非常直觀：模型在最一開始就先擬定完整的執行計畫，隨後嚴格依照這個計畫依序執行每一個步驟。

<!--image:1-->

這意味著系統通常會消耗較少的模型呼叫次數，而較少的呼叫次數通常代表花費更便宜。當然，如果你讓一個很小的模型跑 ReAct，卻讓一個超大型模型跑 Plan-and-Execute，費用可能就不是這麼一回事；但只要在相同的條件下，減少決策回圈、並且在執行過程中不再重新編輯計畫，通常能大幅節省開銷。

不過，Plan-and-Execute 的代價就是適應力（adaptability）較差。模型在最前端就決定了計畫，之後它會思考、會呼叫工具採取行動，但它**不會在觀察執行結果後回頭調整計畫**，而是會一路照著既定路徑走到底。

## 什麼時候該用 Plan-and-Execute，什麼時候該用 ReAct？

如果我們在事前就知道一個任務會如何被拆解、需要哪些步驟，那麼 Plan-and-Execute 的效果會非常好。

這裡有一個值得思考的問題：既然我們事前就知道步驟，為什麼不直接寫死一個由 LLM 驅動的工作流程（workflow）就好？這是因為在 Plan-and-Execute 架構中，雖然步驟方向明確，但計畫本身可能包含相當多的步驟，需要 agent 持續處理一段不算短的時間，而讓 LLM 自主拆解步驟仍具備一定的動態彈性。雖然在單一代理人系統中，Plan-and-Execute 算是比較小眾的設計，但只要任務能夠在開頭就乾淨俐落地拆解，它依然是一個極佳的選項。

ReAct 與 Plan-and-Execute 的核心差異，就在於**有沒有能力在事情出錯或不如預期時喊停並修正**：

<!--image:2-->

- **選擇 ReAct 的情境**：如果你在執行過程中，無法確定某個步驟查出來的研究資料是否足夠，或者預期某些步驟的答案可能會出錯，你就必須使用 ReAct。例如撰寫程式碼的 agent，程式碼通常很難一次改對，你需要不斷思考、執行、觀察測試結果，再根據結果改變計畫；這時絕對需要 ReAct。
- **選擇 Plan-and-Execute 的情境**：如果任務非常乾淨，例如只是想在物件中替換幾個變數名稱，這種任務容易拆解、不太會在執行途中發生非預期的轉折，就很適合 Plan-and-Execute。

## 運作流程範例：職涯規劃顧問

假設使用者提出這樣一個需求：

> 「我很有創意，而且喜歡幫助別人。什麼樣的職涯適合我？有哪些進修管道可以幫我達成目標？我該如何負擔相關費用？」

如果是 Plan-and-Execute agent，它的處理流程如下：

1. **前端完整規劃**：代理人在一開始就產出完整計畫，這是它與 ReAct 最關鍵的差別，計畫只在最初建立一次。
2. **執行第 1 步**：呼叫工具，搜尋符合特質的職涯方向。
3. **執行第 2 步**：呼叫工具，針對這些職涯尋找合適的學校、培訓營、大學或線上課程。
4. **執行第 3 步**：呼叫工具，查詢獎學金、補助金或貸款等資金選項。
5. **產出最終回覆**：整合上述所有步驟的結果，向使用者推薦職涯、培訓管道與資金方案。

為什麼會完全按照這個順序執行？因為這就是最一開始拆解出來的計畫。過程中系統沒有任何機制可以說「等等，剛才回傳的資料讓我覺得應該換個方向」，它只是單純地規劃並貫徹執行。

這種架構簡單、運作極其良好，而且比起 ReAct 來說測試起來容易得多。只要你的任務不需要在途中隨機應變，且 LLM 能在一開始就理清所有步驟，這就是一種非常經濟實惠的解法。

## 實作單一 Plan-and-Execute Agent

在程式實作上，這依然屬於「單一代理人」，而不是多代理人系統或寫死的硬編碼工作流程：
- 程式本身沒有寫死步驟，是 LLM 自己寫出計畫。
- 整個過程共用同一份記憶（包含目標、計畫與已完成步驟的結果）。
- 代理人內部承擔三種不同的工作階段：**規劃者（Planner）**、**執行者（Executor）** 與 **回應者（Responder）**。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerPlanAndExecuteAgent.js#L1-L207 -->

```javascript
// =============================================================================
// Career Path — PLAN-AND-EXECUTE single AGENT
// -----------------------------------------------------------------------------
// This is ONE AGENT, not a workflow and not multiple agents:
//   - Unlike the workflows, OUR CODE does not fix the steps. The LLM writes its own plan.
//   - Unlike careerSequentialMultiAgent.js, there is ONE agent with one shared memory
//     (the objective, the plan, and the results of finished steps). The "planner",
//     "executor", and "responder" below are three JOBS this one agent does, not three agents.
//
// How this differs from careerReActAgent.js:
//   - ReAct decides ONE action at a time and calls the LLM after every tool result.
//     It never has to think through the whole task up front.
//   - Plan-and-Execute first writes the WHOLE plan, then works through it step by step.
//     Forcing a full plan up front tends to give better results on multi-step tasks, and
//     the executor can be a smaller, cheaper model since each step is small and focused.
//   - It is LESS FLEXIBLE on purpose: the plan is made ONCE and never revised. If a step
//     turns out badly, the agent does not change course. That is the trade-off for
//     being faster and cheaper than ReAct.
//
// The three jobs:
//   PLANNER:   LLM writes a multi-step plan for the objective, once.
//   EXECUTOR:  LLM handles ONE step at a time, using a tool if the step needs it.
//   RESPONDER: after every step has run, LLM writes the Final Answer from the results.
//
//   [User input] -> PLANNER -> plan: [step 1, step 2, step 3]
//                                        |
//                                        v
//                     EXECUTOR runs each step in order (tools + results saved)
//                                        |
//                                        v
//                     RESPONDER writes the answer -> [Final Answer]
//
// Run with:  node single-agents/careerPlanAndExecuteAgent.js "I love animals and science, hate sitting at a desk"
// =============================================================================

// --- SETUP -------------------------------------------------------------------
// REPLACE: load your real key from an environment variable, e.g.
//   const API_KEY = process.env.OPENAI_API_KEY;   // or ANTHROPIC_API_KEY, etc.
// Never hard-code real keys in source code.
const API_KEY = "FAKE_KEY_FOR_DEMO";
const MODEL = "your-model-name-here"; // REPLACE: e.g. "gpt-4o-mini" or "claude-sonnet-4-5"
const MAX_STEPS = 6; // Safety limit on how many steps the plan may contain.

// --- TOOLS -------------------------------------------------------------------
// The executor can call these tools. The LLM picks the tool by name and our code
// runs it. To give the agent new abilities, add another entry here.
const tools = {
  search_careers: {
    description: "Finds careers that match a list of interests. Input: comma-separated interests.",
    // REPLACE: call a real source (O*NET Interest Profiler API, your own DB...).
    run: async (interests) => `Careers matching "${interests}": Wildlife Biologist, Veterinarian, Park Ranger, Lab Researcher.`,
  },
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

// The tool list is generated from the `tools` object so the prompts stay in sync.
const TOOL_LIST = Object.entries(tools).map(([name, tool]) => `- ${name}: ${tool.description}`).join("\n");

// --- PROMPTS (one per job the agent does) ------------------------------------
// PLANNER: thinks through the WHOLE task up front. Asks for JSON so our code can read the plan.
const PLANNER_PROMPT = `You are a career advisor. Pick the ONE career that best fits the user's likes and
dislikes, then explain how to get there (school, certifications, experience, timeline).
Write a short step-by-step plan (at most ${MAX_STEPS} steps) to accomplish this. Each step must be small and self-contained.
Tools that will be available when the steps are executed:
${TOOL_LIST}
Respond ONLY with JSON: {"plan": ["step 1", "step 2", ...]}`;

// EXECUTOR: handles ONE step. It sees earlier results because later steps depend on them
// (e.g. "look up the chosen career" needs to know which career was chosen).
const EXECUTOR_PROMPT = `You are carrying out ONE step of a career plan. You are given the user's objective,
the results of earlier steps, and the current step. Do ONLY the current step.
Available tools:
${TOOL_LIST}
If the step needs a tool, respond ONLY with JSON: {"tool": "<tool name>", "input": "<tool input>"}
If it needs no tool, respond ONLY with JSON: {"result": "<your result for this step>"}`;

// RESPONDER: runs once, after ALL steps are done. It only writes the answer; it cannot change the plan.
const RESPONDER_PROMPT = `You are a career advisor. You are given the objective and the result of every step
that was carried out. Write the final answer: the career, why it fits, and step-by-step how to get there
(school, certifications, experience, timeline). Use only the information in the step results.`;

// --- FAKE LLM CALL -----------------------------------------------------------
// A single helper that the planner, executor, and responder all use.
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

  // FAKE planner: the whole plan is written up front.
  if (systemPrompt === PLANNER_PROMPT) {
    return JSON.stringify({
      plan: [
        "Search for careers that match the user's interests.",
        "Choose the ONE best-fit career from the matches, avoiding the user's dislikes.",
        "Look up the requirements for the chosen career.",
      ],
    });
  }

  // FAKE executor: reacts to whichever step it was given.
  if (systemPrompt === EXECUTOR_PROMPT) {
    const step = userMessage.split("Current step: ")[1];
    if (step.startsWith("Search")) return JSON.stringify({ tool: "search_careers", input: "animals, science, outdoors" });
    if (step.startsWith("Choose")) {
      return JSON.stringify({ result: "Wildlife Biologist. It combines animals and science with outdoor fieldwork instead of desk work." });
    }
    return JSON.stringify({ tool: "get_career_requirements", input: "Wildlife Biologist" });
  }

  // FAKE responder: writes the final answer from the step results.
  return [
    "Career: Wildlife Biologist",
    "Why: It combines animals and science with outdoor fieldwork instead of desk work.",
    "How to get there:",
    "1. School: Bachelor's in Biology, Zoology, or Wildlife Science (4 yrs). A Master's helps for research roles (+2 yrs).",
    "2. Certifications: Associate Wildlife Biologist (The Wildlife Society); First Aid/CPR for fieldwork.",
    "3. Experience: Seasonal field technician jobs, internships, volunteering at refuges.",
    "4. Timeline: About 4–6 years to become an entry-level wildlife biologist.",
  ].join("\n");
}

// --- PLANNER: LLM writes the whole plan --------------------------------------
async function makePlan(userInput) {
  const { plan } = JSON.parse(await callLLM(PLANNER_PROMPT, `User input: ${userInput}`));
  return limitPlan(plan);
}

// Plain-code check (NOT an LLM): the plan controls how many LLM calls we make, so
// drop empty steps and cap the length instead of trusting the LLM blindly.
function limitPlan(plan) {
  const steps = (Array.isArray(plan) ? plan : []).filter((s) => typeof s === "string" && s.trim()).slice(0, MAX_STEPS);
  if (steps.length === 0) throw new Error("The plan had no usable steps.");
  return steps;
}

// --- EXECUTOR: LLM does ONE step, our code runs the tool it picks ------------
async function executeStep(userInput, step, pastSteps) {
  const history = pastSteps.map((p, i) => `${i + 1}. ${p.step}\n   Result: ${p.result}`).join("\n") || "(none yet)";
  const message = `Objective: ${userInput}\n\nEarlier steps:\n${history}\n\nCurrent step: ${step}`;
  const decision = JSON.parse(await callLLM(EXECUTOR_PROMPT, message));

  if (decision.result) return decision.result; // The step needed no tool.

  const tool = tools[decision.tool];
  return tool
    ? tool.run(decision.input)
    : `Invalid tool "${decision.tool}". Use one of the listed tools.`; // The plan is NOT revised; the responder just sees the failure.
}

// --- RESPONDER: LLM writes the final answer from all the step results --------
async function respond(userInput, pastSteps) {
  const history = pastSteps.map((p, i) => `${i + 1}. ${p.step}\n   Result: ${p.result}`).join("\n");
  return callLLM(RESPONDER_PROMPT, `Objective: ${userInput}\n\nSteps carried out:\n${history}`);
}

// --- THE AGENT: the LLM writes the plan up front, then it runs to the end ----
async function runCareerAgent(userInput) {
  const pastSteps = []; // The agent's memory: every finished step and its result.

  // PLAN: think through the whole task first. This happens ONCE.
  const plan = await makePlan(userInput);
  console.log(`--- Plan ---\n${plan.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n`);

  // EXECUTE: work through the plan in order, with no planner call between steps.
  for (const step of plan) {
    const result = await executeStep(userInput, step, pastSteps);
    pastSteps.push({ step, result });
    console.log(`[Executed] ${step}\n  Result: ${result}\n`);
  }

  // RESPOND: no replanning. Just turn the results into the Final Answer.
  return respond(userInput, pastSteps);
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

console.log(`User input: ${userInput}\n`);
runCareerAgent(userInput)
  .then((answer) => console.log(`=== FINAL ANSWER ===\n${answer}`))
  .catch((err) => console.error("Agent failed:", err.message));
```

在這份程式實作中，你可以清楚看見這個架構的特性：

<!--image:3-->

1. `makePlan`（Planner）只會在最一開始呼叫一次，並藉由一般的程式邏輯限制最多步驟數，避免模型無限發散。
2. `executeStep`（Executor）會循序拿到過去步驟的執行結果，並決定是呼叫工具還是直接給出推論結果。即使某個工具回傳錯誤，它也不會回頭改計畫，而是把錯誤直接記錄下來。
3. `respond`（Responder）在所有步驟走完後，將所有的累積結果整理成最終答案。

如果你的任務允許在出發前就看清全貌，採用這種「先想好再做」的設計，能讓你的 agent 運作得更穩定、更節省預算。
