---
source: sources/background-agents/20261027/16-when-to-wait-for-input.md
source_type: text
source_lines: 67
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **本課目標是「未解決的 incident」** — agent 察覺有狀況但資訊不足，選擇繼續觀察而非硬做。
- **世界不會等 agent** — event 是門鈴而非房間快照；agent 醒來應重讀服務狀態，而不是把 payload 當全貌。
- **等待的兩種來源** — 一種是 harness 強制（如人類核准），一種是 agent 依 context 自行推理出的等待。
- **測試設計** — 之後用 30 秒後自動恢復的 dependency fault，驗證 agent 會選擇等待或求助。
- **多實例與事件合併** — 同一 workflow 可開上千個 instance；建議先做 event triage/合併，避免多個 run 各看一部分。

# L2 detail

- `#L1-L9` — 定義本課成果：agent 遇到資訊不足的 incident 時，可以選擇等待更多事件。
- `#L10-L19` — 目前沒有 run book；完整系統可提供 run book 或把處理流程寫成 workflow 作為 context。
- `#L20-L27` — 世界不會等 loop 跑完；event 像門鈴，agent 醒來要重新讀 checkout process 的現況。
- `#L28-L39` — 有些等待由 harness 決定（approval），有些必須由 agent 自行判斷；等待與求助是非破壞性權限。
- `#L40-L49` — 測試規劃：dependency fault 於 30 秒後恢復，可能出現 throttle header，使「等待」成為唯一合理動作。
- `#L50-L63` — 同一 workflow 可同時跑多個 instance；建議用 LLM triage 合併同根因事件，再交給同一個 run。
- `#L64-L67` — system prompt 可改為從啟動 workflow 的資料傳入，讓同一 harness 支援不同 agent 行為。
