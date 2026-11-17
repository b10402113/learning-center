---
source: sources/real-engineer/20261116/course/027 Task Ticket.en.txt
source_type: text
source_lines: 17
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L43
---

# L1 overview

- 下一張是 task ticket：註冊 Knock 並申請開發用金鑰，標籤是 Wayfinder task、未認領。
- task ticket 的定位：決策前必須先完成的人工工作，不是決策本身；產出的是一份可照做的步驟。
- 註冊多家服務再串起來很煩，作者引入 wizard skill：產生互動式 bash wizard，帶人走過只有人能做的步驟（開通基礎設施、設定憑證、CI secret、操作陌生第三方 dashboard、一次性遷移或切換）。
- wizard skill 是 model-invoked，agent 會在對的時機自己拿來用，這個 task 正是典型場景。
- 操作方式與其他 ticket 相同：用 Wayfinder 傳 ticket 編號；但 wizard 必須在獨立終端跑，不能在 agent 的 bash 裡執行。
- 目標是讓環境變數的開通變得極簡，實際流程留到 solution。

# L2 detail

- `#L1-L2` — 下一張是 task ticket：註冊 Knock 並申請開發用金鑰，標籤是 Wayfinder task、未認領、可立即動工。
- `#L3-L11` — task ticket 的定位是決策前必須完成的人工工作，不是決策本身；一次註冊多家服務再串起來很煩，因此引入 wizard skill，它會產生互動式 bash wizard，帶人走過只有人能做的步驟（開通基礎設施、設定憑證與 CI secret、操作陌生第三方 dashboard、一次性遷移或切換），把任務變得無腦。
- `#L12-L17` — wizard 是 model-invoked，agent 會自行在適當時機套用，這個 task 是典型用例；操作仍是用 Wayfinder 傳 ticket 編號產生 wizard，但要開新終端執行（互動式，不能在 agent 的 bash 裡跑）。
