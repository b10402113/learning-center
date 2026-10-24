---
source: sources/agent-harness/20260915/harness-engineering
source_type: codebase
source_lines: 2489
file_count: 21
language: TypeScript
part: 3
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- `web/src/App.tsx` — 版面只有三件事：一個 socket hook、兩個 pane、連線狀態。整個 inspector 沒有第二個資料來源。
- `web/src/components/TaskPane.tsx` — 把事件流 fold 成聊天 transcript 的 reducer。每一種 turn 角色都對應一組事件，UI 不呼叫模型、也不呼叫工具。
- `web/src/components/InspectorPane.tsx` — 原始事件流面板。可觀測性不是外加的 dashboard，而是同一條 stream 的另一種呈現。
- `web/src/useHarnessSocket.ts` — 一條 WebSocket 同時收事件與送指令；事件只 append、不修改，等於在前端重演 event sourcing。
- `web/src/useTheme.ts` + `web/src/styles.css` — 深色模式只是 `<html>` 上的 `dark` class 與一組 oklch token，沒有執行期主題引擎。
- `web/src/components/ui/tool.tsx` — 工具呼叫卡片。`input-available → output-available / output-error` 的狀態機，正好對應 `tool.requested` / `tool.completed` / `tool.failed`。
- `web/src/components/ui/chain-of-thought.tsx` — 可折疊步驟清單，supervisor 的 sub-agent 樹就是用它畫的。
- `web/src/components/ui/markdown.tsx` — 依 block 切分並 memoize，串流時只重繪變動的那一塊；程式碼區塊交給 Shiki。
- 其餘 `ui/` 元件（button、textarea、avatar、collapsible、tooltip、loader、prompt-input、chat-container、message、code-block）— prompt-kit / shadcn 的現成積木。課程明說學員不寫 UI，所以這些檔案是讀懂「事件如何被呈現」的參考，不是要學員實作的題目。

# L2 detail

- `#L1-L54` — `web/src/App.tsx` — 組合根：`useHarnessSocket` 提供 `events`／`connected`／`send`，`useTheme` 提供主題切換；header 顯示連線狀態，`main` 是兩欄 grid，把同一份 events 分別交給 TaskPane 與 InspectorPane。
- `#L55-L116` — `web/src/components/TaskPane.tsx`（型別）— `Turn` 的七種 role（user、assistant、tool、handoff、supervision、approval、log）就是 harness 七種能力的畫面投影；`SubagentState` 則把 sub-agent 的 pending/started/completed/failed 顯性化。
- `#L117-L249` — `web/src/components/TaskPane.tsx`（`toTranscript`）— 整個 UI 的核心是一個純函式 fold：`ModelDelta` 累積成 streaming 的 assistant turn，`ToolCompleted` 用 `toolCallId` 回頭配對 `ToolRequested`，`ApprovalResolved` 配對 `ApprovalRequested`，`open` 計數決定「還在跑」。
- `#L250-L477` — `web/src/components/TaskPane.tsx`（互動與渲染）— `submit` 送出 `submit_task` 並附上 `mode`；`Clear` 打 `POST /api/clear` 後整頁重載（最簡單的重播重置）；`ApprovalCard` 打 `POST /api/approve/:workflowId`，把人類決定送進暫停中的 workflow；`TurnView` 依 role 分派到 Markdown、Tool 卡、handoff 分隔線、ChainOfThought 樹或 approval 卡。
- `#L478-L544` — `web/src/components/InspectorPane.tsx` — 事件流原樣列出：時間、型別（依 `type` 前綴上色）、去掉 envelope 後的 payload。這是「讓不可見的基礎設施可見」的最小實作，也是每課驗證機制的窗口。
- `#L545-L576` — `web/src/useHarnessSocket.ts` — 寫死 `ws://<host>:8787/ws`；`onmessage` 只做 `setEvents(prev => [...prev, event])`，`send` 把 `ClientMessage` 序列化回去。沒有重連邏輯，因為重新連線時 server 會重播歷史。
- `#L577-L602` — `web/src/useTheme.ts` — 初始值先看 localStorage，再看 `prefers-color-scheme`；切換時同步 `<html>` 的 `dark` class 與儲存值。註解提到 index.html 有 inline script 避免首次繪製閃爍。
- `#L603-L609` — `web/src/lib/utils.ts` — `cn()` = `twMerge(clsx(...))`，解決條件式 className 與 Tailwind 衝突類別。全 repo 的樣式組合都靠這個三行函式。
- `#L610-L619` — `web/src/main.tsx` — React 19 的 `createRoot` + `StrictMode`，掛載 `App` 並載入 `styles.css`。
- `#L620-L730` — `web/src/styles.css` — Tailwind v4 的 `@import` 寫法、`@custom-variant dark`、`@plugin typography`；`:root` 與 `.dark` 各一組 oklch 設計 token，`@theme inline` 把它們映射成 `--color-*` 供 utility 使用。這解釋了為何 `dark:` 與 `prose` 可以直接用。
- `#L731-L797` — `web/src/components/ui/chat-container.tsx` — 包一層 `StickToBottom` 並設 `role="log"`：新訊息進來時自動貼底，往上捲時不會被拉回去。聊天式介面需要的行為都在這個第三方元件裡。
- `#L798-L917` — `web/src/components/ui/message.tsx` — 訊息的基本積木：`Message`（排列）、`MessageAvatar`（Radix Avatar）、`MessageContent`（`markdown` 旗標決定要不要走 Markdown 渲染）、`MessageActions`／`MessageAction`（tooltip 包裝）。
- `#L918-L1027` — `web/src/components/ui/markdown.tsx` — 用 `marked.lexer` 把 markdown 切成 block，每個 block 各自 memo；串流時只有最後一塊在變，所以整段重繪的成本被壓下來。`code` 元件會判斷 inline/block，block 交給 `CodeBlock`。
- `#L1028-L1119` — `web/src/components/ui/code-block.tsx` — `codeToHtml` 是非同步的 Shiki 高亮，還沒 hydrate 前先渲染純文字 `<pre>`，避免空白與版面跳動。
- `#L1120-L1332` — `web/src/components/ui/tool.tsx` — tool call 卡：狀態圖示與 badge 由 `ToolPart.state` 驅動，展開後顯示 input 的每個 key、output（可捲動）、錯誤訊息與 `toolCallId`。這是把「模型要求什麼、harness 回了什麼」攤開給人看的地方。
- `#L1333-L1480` — `web/src/components/ui/chain-of-thought.tsx` — step 清單元件：`ChainOfThought` 用 `React.cloneElement` 標記 `isLast`，靠 CSS 畫出連接線；每一 step 可折疊，trigger 可換 icon。supervisor 的每個 investigator 就是一個 step。
- `#L1481-L1713` — `web/src/components/ui/prompt-input.tsx` — context 化的輸入框：`PromptInput` 提供 value/onSubmit/textareaRef，`PromptInputTextarea` 自動長高、Enter 送出、Shift+Enter 換行，`PromptInputAction` 用 tooltip 包住送出鈕並阻止事件冒泡。
- `#L1714-L2212` — `web/src/components/ui/loader.tsx` — 12 種純 CSS 載入動畫（circular、classic、pulse、dots、typing、wave、bars、terminal、text-shimmer…）。TaskPane 用的是 `TextDotsLoader`，作為「workflow 還在跑」的視覺訊號。
- `#L2213-L2276` — `web/src/components/ui/button.tsx` — `cva` 定義 variant（default/destructive/outline/secondary/ghost/link）與 size，`asChild` 時改用 Radix `Slot`，讓樣式能套在任意元素上。
- `#L2277-L2294` — `web/src/components/ui/textarea.tsx` — 薄薄一層 textarea，套上 border/focus ring 與 `field-sizing-content`；真正的行為（autosize、Enter 送出）在 prompt-input。
- `#L2295-L2403` — `web/src/components/ui/avatar.tsx` — Radix Avatar 的包裝：Root/Image/Fallback 加上 size variant，以及 Badge、Group、GroupCount 等組合元件。本專案只用到最基本的三個。
- `#L2404-L2434` — `web/src/components/ui/collapsible.tsx` — Radix Collapsible 的三個 re-export。tool 卡與 chain-of-thought 都靠它，所以「展開細節」的行為在各處一致。
- `#L2435-L2489` — `web/src/components/ui/tooltip.tsx` — Radix Tooltip 的 Provider/Root/Trigger/Content 包裝，Content 走 portal 並自帶箭頭；App 在最外層給 `delayDuration={300}`。
