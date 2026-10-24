---
source: sources/agent-harness/20260915/2-course-project-setup.txt
source_type: text
source_lines: 315
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 課程是 JavaScript／TypeScript 專案；會用 Node、寫過基本 Express 或 React 就能跟上，卡住時可以請 AI 補足語言細節。
- `model` 檔案是唯一需要換 provider 的地方，透過 Vercel AI SDK 支援多種模型；模型選哪個不影響 harness 的學習。
- `runtime` 是 harness 的核心，等同 agent 的遊戲迴圈；目前只有 emit 的空殼，之後大部分時間都在這裡。
- 使用 WebSocket 而非 SSE，是因為 durable execution 是分散式的，需要雙向、fire-and-forget 再把事件推回任何已連線的 client。
- `emit` 的語意是「廣播某件事剛剛發生」，是分散式系統常見的模式。
- 專案結構分成 lessons、server（event bus 與 Express）、shared（事件定義）、web client；UI 已寫好，課程不處理前端。
- AI SDK 只是 inference 與 tool calling 的薄層，換成 Anthropic 或原生 provider SDK 都能沿用同一套 harness 概念。
- 執行 `npm run dev` 會看到「no agent yet」，因為 lesson one 要先用程式碼打造一個脆弱版 agent loop，再由 harness 加固。

# L2 detail

- `#L1-L45` — lesson one 起始狀態與語言門檻：以 JavaScript 授課，不需要進階技巧，但完全沒碰過 JS 會吃力，建議用 AI 或先修 Node 入門課補齊。
- `#L46-L72` — `model` 檔案的角色：AI SDK 支援的模型都能用，替換方式是改 import 與 export 的 provider，講者示範用 GPT-4.5 但強調模型不重要。
- `#L73-L114` — `runtime` 是 harness 的心臟與 agent 的執行環境；目前滿是 emit stub，並解釋為何用 WebSocket 做 transport，以及 emit 在分散式系統中的意義。
- `#L115-L140` — 逐層導覽 repo：lessons 放教材、notes 與 OpenSpec 是本機工具、server 內含 event bus 與 Express，多數底層 WebSocket 細節不需更動。
- `#L141-L166` — 其餘目錄：`shared` 定義 runtime 發出與 client 訂閱的事件，`web` 是現成 client，API key 放在 `.dev.vars`。
- `#L167-L216` — 釐清 AI SDK 與 provider 的關係：同一個 SDK 有二十多個 provider 模組，安裝對應套件後 `streamText`／`generateText` 的寫法不變。
- `#L217-L244` — 回答 Azure AI 的相容性：harness 不依賴 AI SDK 的特殊機制，只用到 inference 與 tool calling，換成原生 OpenAI SDK 也能移植。
- `#L245-L275` — 各大雲平台（AWS agent core、Azure、Cloudflare）都有自己的 harness 服務；先從零實作，才知道每個環節該對應哪個託管能力。
- `#L276-L315` — 啟動 dev server 後尚無 agent，lesson one 要補上脆弱版 agent loop；UI 中尚未實作的功能刻意保持 no-op，避免學員誤判為 bug。
