# Plan 是一級公民，而且只規劃一次

我們前面提到的 plan 是一級公民（first-class），也就是說，它需要明確的資料結構。監督者的工作，其實就是回答兩個問題：這裡需要調查員嗎？以及，我的 plan 是什麼？

為了產生這份 plan，監督者不會要求模型輸出文字，而是要求它回傳一個結構化物件。

這就是 `generateText` 和 `generateObject` 的差別。`generateText` 回傳文字；`generateObject` 則回傳符合 schema 的 JSON 物件。換句話說，模型產生的 JSON 一定會遵循你提供的 schema。

結構化輸出的強大之處，在於它背後有 schema 作為規範。你可能看過有人讓 agent 即時產生 UI：先定義 React 元件的 schema，再要求模型產生符合規範的 UI，最後直接把每個項目對應到元件上。這樣得到的是一個天氣元件，而不是一段寫著「以下是天氣資訊」的文字。

<!--image:1-->

較新的模型都針對 JSON 輸出做過微調，因此這件事是在模型層級完成的。它不是以前 LangChain 那種做法：不斷迴圈，反覆解析 JSON，再拿結果和 schema 比對，直到格式終於正確為止。

補充一點：SDK 後來已經將 `generateObject` 標記為 deprecated，建議改用 `generateText` 的 output 設定。不過課程裡仍然使用 `generateObject`；兩者的核心概念相同，都是要求模型回傳結構化結果，而不是一段散文。

因此，我們要替 plan 定義一個 schema。plan 是一個 `steps` 陣列，而每個 step 都包含 `id`、`agent` 和 `objective`。

<!--image:2-->

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L8-L31 -->
```ts
// The PLAN is a first-class artifact: a structured object the supervisor emits,
// the inspector renders, the synthesis step reads, and that survives a crash.
const PlanSchema = z.object({
  steps: z.array(
    z.object({
      id: z.string().describe("short id, e.g. 'billing'"),
      agent: z.enum(["billing", "technical", "sales"]),
      objective: z.string().describe("what this investigator should find out"),
    }),
  ),
});
type Plan = z.infer<typeof PlanSchema>;

async function makePlan(task: string): Promise<Plan> {
  const { object } = await generateObject({
    model,
    schema: PlanSchema,
    system:
      "Decompose a customer escalation into independent sub-tasks — one per area the message actually raises (billing / technical / sales). Only include relevant areas.",
    prompt: task,
  });
  return object;
}
```

這裡有兩個細節值得注意。第一，`agent` 是 enum，而不是任意字串；每個 step 只能指定三名調查員中的一名。第二，`z.infer` 會把 schema 轉成 TypeScript 型別，因此我們可以直接取得型別為 `Plan` 的定義。

`makePlan` 是 plan 誕生的地方。它接收一段任務字串，並回傳一個 `Plan`。system prompt 會告訴模型：把客戶的問題拆成數個子任務，每個實際提到的領域各分配一個子任務，而且只納入相關領域。至於 `prompt`，就只是那段任務內容。

例如，客戶一次提出帳務、技術和銷售問題。plan 就會把這封訊息拆成三個彼此獨立的子任務。

關於 `makePlan`，還有一件事，而且是最重要的一件事：你要在哪裡呼叫它？

`makePlan` 必須包在 DBOS step 裡。如果把 `makePlan` 放在 workflow 本體中，每次 workflow 重新評估時，它都會重新執行。可是，我們只希望每個 workflow instance 建立一次 plan，所以應該把它放進 step。這樣 plan 就會被持久保存，也更加安全：即使程序關閉後重新啟動，系統也不會再次執行 `makePlan`、重新規劃一次。

<!--image:3-->

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L48-L62 -->
```ts
// THE SUPERVISOR. Plan → dispatch sub-agents in parallel → fan in → synthesize.
// Unlike a handoff, the supervisor keeps control the whole time.
async function supervisorWorkflow(task: string): Promise<string> {
  const workflowId = DBOS.workflowID ?? "unknown";
  await DBOS.runStep(
    () => emit({ type: EventType.WorkflowStarted, workflowId, input: task }),
    { name: "started" },
  );

  // PLAN.
  const plan = await DBOS.runStep(() => makePlan(task), { name: "plan" });
  await DBOS.runStep(
    () => emit({ type: EventType.PlanCreated, workflowId, steps: plan.steps }),
    { name: "plan-emit" },
  );
```

workflow 會先取得自己的 ID，接著在一個 step 中發出 `WorkflowStarted` 事件，再於另一個名為 `plan` 的 step 裡建立 plan。完成後，它會發出 `PlanCreated`，讓 UI 能夠顯示 plan 中的各個 step。

這些事件就是 checkpoint。每個事件都記錄 workflow 在某個時間點進行到哪裡；因此，無論發生什麼狀況，你都能找出目前的進度。

現在，plan 已經是一個具備型別、可持久保存的物件，裡面也列出了三名調查員。接下來的問題是：究竟由誰來執行這些 objective？答案是 sub-agent——但它是一種非常特別、只能讀取資料的 sub-agent。下一步，我們就來建立它。
