# Dispatcher 多代理系統：一次分類，只走一條 lane

Supervisor 讓主管在 runtime 決定怎麼拆；如果意圖本來就有限，還有一條更便宜的路。當使用者向系統提出需求時，如果每一次都動用功能最強、最昂貴的模型來規劃步驟、拆解任務，不僅回應速度慢，帳單金額也會迅速飆升。事實上，許多應用情境的使用者意圖非常明確，根本不需要複雜的步驟分解，只需要在第一時間將問題分派給正確的專門代理（Agent）處理。

這就是 Dispatcher（分流器）模式的核心價值。它也被稱為路由（Routing）、分診（Triage）或分類器（Classifier／Router）。這套架構是單一工作流程中路由模式的多代理版本：系統先透過一個分類步驟檢視使用者輸入，接著決定交由哪一位專屬代理接手。

## 分流而非分解：一次只走一條 lane

Dispatcher 與 Supervisor（監督者）模式最大的差異，在於它執行的是分流（fork），而不是任務分解（decomposition）。

<!--image:1-->

在 Supervisor 模式中，主管模型會分析需求、拆解工作項目、調度多位下屬，最後回收成果整合回覆。但 Dispatcher 不做任務規劃，也不會連續呼叫多個代理。整個系統擁有一組固定的路徑選單（finite set of routes），針對每一次輸入，系統只會選定其中一條路徑（lane）執行，選定後就全權交由該代理處理並直接回應使用者，Dispatcher 本身功成身退，不會回收結果。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerDispatcherMultiAgent.js#L1-L28 -->

```javascript
// =============================================================================
// Career Path — DISPATCHER MULTI-AGENT system
// -----------------------------------------------------------------------------
// How this differs from the other multi-agent files:
//   - careerSequentialMultiAgent.js: plain CODE runs the agents in a fixed order.
//   - careerParallelMultiAgent.js:   plain CODE runs the agents all at once.
//   - careerSupervisorMultiAgent.js: an LLM calls MANY workers, gets every result BACK,
//                                    and combines them into the final answer.
//   - THIS FILE: a DISPATCHER agent (an LLM) reads the request and hands it to exactly ONE
//                specialist agent. That specialist takes over, does the whole job with its
//                own tools, and answers directly. The dispatcher never gets a result back.
//
// This is the "coordinator / dispatcher" pattern (like Google ADK's transfer_to_agent).
// It's the multi-agent version of careerRoutingWorkflow.js, with two differences:
//   - the dispatcher is an agent choosing a hand-off, not a classifier returning JSON, and
//   - each route is a full AGENT (its own ReAct loop and tools), not a single LLM call.
//
//   [User input] -> DISPATCHER (reads request, picks ONE specialist, then steps aside)
//                      |  transfer to "Career Explorer"     -> Agent 1 (ReAct loop + tools) -> [Final output]
//                      |  transfer to "Roadmap Advisor"     -> Agent 2 (ReAct loop + tools) -> [Final output]
//                      '  transfer to "Career Change Coach" -> Agent 3 (ReAct loop + tools) -> [Final output]
//
// Only the chosen specialist runs. The other two agents are never called.
//
// Run with:  node multi-agent-systems/careerDispatcherMultiAgent.js "I love animals and science, hate sitting at a desk"
// Try also:  node multi-agent-systems/careerDispatcherMultiAgent.js "How do I become a nurse?"
//            node multi-agent-systems/careerDispatcherMultiAgent.js "I'm an accountant and want to move into UX design"
// =============================================================================
```

以生涯諮詢系統為例，使用者的輸入包含個人特質、興趣、職涯目標與問題類型。Dispatcher 的工作就是純粹的分診：

- 使用者想探索適合的職業？轉派給職涯代理（Career Agent）。
- 使用者想尋找進修課程或學校？轉派給培訓代理（Training Agent）。
- 使用者想了解補助與學費支援？轉派給資金代理（Funding Agent）。

選定後，只有該名被指派的代理會啟動自身的 ReAct 迴圈並使用工具，其餘代理完全不會被呼叫。專屬代理產生最終回覆後，該次互動就此結束，等待使用者的下一次輸入。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerDispatcherMultiAgent.js#L211-L262 -->

```javascript
// --- DISPATCHER: an LLM agent whose ONLY job is to pick a specialist ----------
// It has one action, transfer_to_agent, and no domain tools. It never answers the user.
const specialists = [careerExplorer, roadmapAdvisor, careerChangeCoach];
const DEFAULT_SPECIALIST = careerExplorer; // Used when the dispatcher's answer is unusable.

// The specialist list is generated from `specialists` so the prompt stays in sync.
const DISPATCHER_PROMPT = `You are the dispatcher for a career advice service. You do NOT answer the user.
Read the user's message and hand it to the ONE specialist best suited to it.
Specialists:
${specialists.map((s) => `- ${s.name}: ${s.description}`).join("\n")}

Respond EXACTLY like this:
Thought: <why this specialist fits>
Action: transfer_to_agent
Action Input: <the exact specialist name>`;

// One LLM call decides the hand-off. There is no loop: after this, the dispatcher is done.
async function dispatch(userInput) {
  const llmOutput = await callLLM("Dispatcher", [
    { role: "system", content: DISPATCHER_PROMPT },
    { role: "user", content: userInput },
  ]);
  console.log(`[Dispatcher]\n${llmOutput}\n`);

  // GATE: plain code (NOT an LLM) checks the choice. LLMs can name a specialist we don't have,
  // so fall back to a safe default instead of crashing.
  const requested = llmOutput.match(/Action Input:\s*(.+)/)?.[1].trim();
  const chosen = specialists.find((s) => s.name.toLowerCase() === requested?.toLowerCase());
  if (chosen) return chosen;

  console.warn(`Dispatcher picked unknown specialist "${requested}". Falling back to "${DEFAULT_SPECIALIST.name}".\n`);
  return DEFAULT_SPECIALIST;
}

// --- THE SYSTEM: dispatch once, then the chosen specialist owns the request --
// The specialist receives the user's ORIGINAL message (a real hand-off, not a rewritten task),
// and its Final Answer goes straight back to the user.
async function runCareerSystem(userInput) {
  const specialist = await dispatch(userInput);
  console.log(`========== Transferred to ${specialist.name} ==========\n`);
  const answer = await specialist.run(userInput);
  return { specialist: specialist.name, answer };
}

// --- ENTRY POINT -------------------------------------------------------------
// Take user input from the command line, or fall back to a sample input.
const userInput = process.argv[2] || "I love animals and science. I dislike sitting at a desk all day.";

console.log(`User input: ${userInput}\n`);
runCareerSystem(userInput)
  .then(({ specialist, answer }) => console.log(`=== FINAL ANSWER (from ${specialist}) ===\n${answer}`))
  .catch((err) => console.error("System failed:", err.message));
```

在實作上，Dispatcher 的提示詞只需要專注於分類，並透過程式碼防呆（例如比對回傳名稱，遇到非預期輸出則走預設代理），確保控制權順暢轉交給單一代理。

## 成本效益與分類器的轉變

在多代理架構的評分表中，Dispatcher 具有非常鮮明的優缺點：

- **脈絡（Context）表現優秀**：因為不需將所有工具與複雜歷史塞給單一模型，每個專門代理只需要維持自己領域內的小脈絡。
- **成本（Cost）最具優勢**：在所有多代理架構中，Dispatcher 通常是最省錢的一種。

過去構建這類系統時，大家習慣在入口處放一個旗艦級大模型（frontier model）來判斷意圖。但如今許多專門的分類模型（例如近期的 Gemini 分類模型）不僅速度極快、分類精準，費用也極其低廉。原本每次判斷可能需要耗費數美元的呼叫，現在能壓到幾分錢（cents）以內。當系統每天需要處理數百、數千次請求，甚至面對百萬名使用者時，這種成本差異十分巨大。

<!--image:2-->

軟體工程的日常工單也是類似的道理。工程師看工單時，通常會先評估難度：簡單的修改不需要勞師動眾，只有複雜棘手的架構問題才需要長時間投入。在建置多代理系統時，我們同樣不希望盲目地在所有環節都調用旗艦大模型來「過度消耗 Token」（token maxing）。透過 Dispatcher，系統可以先把輸入分類，把簡單的任務分流給輕量模型，將昂貴的旗艦模型保留給真正困難的工作。

## 錯誤路由的代價與恢復策略

雖然 Dispatcher 便宜又快速，但它的可靠性（Reliability）完全取決於入口處的分類器。這也是這套模式最大的弱點：**一旦選錯路徑（bad route），系統極難自行恢復**。

<!--image:3-->

就像工程師評估工單時，有時以為某個任務只要花 1 點故事點數，跳進去才發現踩到大坑，最後整整花了三個星期才解決。人類會誤判，分類模型同樣也會誤判。如果分類器把想問資金補助的使用者送進職涯規劃代理，該代理通常只會根據自己有限的工具與角色設定作答，給出牛頭不對馬嘴的結果。

要在 Dispatcher 模式中建立修復機制（Recovery），常見的做法有兩種：

1. **配置檢查代理（Checker Agent）**：在執行專門路徑時，安排輔助機制檢查當前代理是否陷入困境或走錯方向。
2. **在選單中加入澄清路徑（Clarification Lane）**：給分類器多一個明確的選項——「感到困惑／無法確定」。當輸入模糊、分類器難以抉擇時，不要勉強猜測，而是直接將流程導向澄清代理，由系統向使用者提出引導問題，補足關鍵資訊後再重新分類。

## 策略取捨：Top-down 還是由下而上？

長期以來，業界常見的思維是讓聰明的大模型坐在系統頂層（如 Supervisor 模式），負責統籌分派所有事情。

不過在 2025 年，Anthropic 提出了「顧問策略」（Advisor Strategy）。他們讓輕量級的 Haiku 或 Sonnet 站在第一線負責執行任務與呼叫工具；只有當第一線模型自認無法勝任時，才向上呼叫旗艦級的 Opus 協助推進。這種做法不僅大幅降低成本，整體表現也相當亮眼。

然而，這種模式的核心痛點在於「小模型很難準確判斷自己何時不行」。Cognition 在嘗試類似架構時也發現，較小的模型往往難以察覺何時該升級調用大模型，甚至在升級求助時，也說不清楚自己究竟需要問什麼。

這些架構與取捨沒有絕對的優劣，完全取決於具體的業務情境：

如果今天要上線一個生涯諮詢產品，Dispatcher 往往是首選。因為使用者的意圖很單純，基本上就是找工作、找培訓或找資金這三件事。各個通道的職責邊界清楚，選單數量有限且已知。在這種情況下，若採用 Supervisor 模式，等於花大錢請一個旗艦模型反覆去挑選開發者早已定義清楚的固定選單，反而造成了不必要的資源浪費。只要將分類做好，並搭配模糊時的澄清機制，Dispatcher 就能以最低的成本提供穩定且專注的服務。
