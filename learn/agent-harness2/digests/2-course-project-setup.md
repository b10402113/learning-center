---
source: sources/agent-harness2/20261029/2-course-project-setup.txt
source_type: text
source_lines: 315
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 課程 repo 的 harness 資料夾是主要工作區，其中 runtime 是整個 harness 的核心，也就是 agent loop 所在。
- 使用 Vercel AI SDK 呼叫模型，任何 AI SDK 支援的 provider 都能替換；模型選擇不影響 harness 教學。
- 傳輸層刻意用 WebSockets 而非 SSE，因為 agent 是 distributed、durable execution，需要雙向、fire-and-forget 再把事件送回任何已連線 client。
- runtime 目前只剩 emit 的 stub；shared 資料夾定義事件，server 有 event bus 與 Express，web client 已預先寫好。
- AI SDK 只負責 inference，不綁定 harness 設計；Azure、AWS agent core、Cloudflare 等平台各有對應元件，但概念可移植。
- lesson one 要先寫出脆弱的 agent loop，再用 harness 包起來；UI 中許多按鈕刻意 no-op。

# L2 detail

- `#L1-L46` — 導覽 repo 與 harness 資料夾；回答 JavaScript 門檻：會基本 Node 或 React 即可，不足時可請 AI 協助，並推薦 intro to Node 課程。
- `#L47-L72` — 說明 model 檔案：使用 Vercel AI SDK，支援清單內的模型都能用，只要換 provider import；示範以 GPT 4.5 為例。
- `#L73-L114` — 介紹 runtime 是 harness 核心與 agent loop；目前是 stub，之後會大量使用 emit，並解釋為何選 WebSockets 而非 SSE。
- `#L115-L140` — 逐一說明 lessons、notes、未使用的 OpenSpec、server 的 event bus 與 Express server。
- `#L141-L166` — shared 資料夾集中定義事件；web 是預先做好的 client，課程幾乎不動；.dev.vars 放 API key。
- `#L167-L216` — 回答 provider 問題：AI SDK 有多個 provider npm module，換成 Anthropic 只需安裝對應套件並改 import，streamText／generateText 用法不變。
- `#L217-L275` — 說明可移植性：AI SDK 只用來做 inference，tool calling 各 SDK 都有；Azure／AWS agent core／Cloudflare 也有現成 runtime，但先從零理解概念才知道何時該用。
- `#L276-L315` — 跑 npm run dev 開伺服器，輸入訊息會顯示 no agent yet；lesson one 要先把 brittle agent loop 寫出來，UI 的 no-op 是刻意的。
