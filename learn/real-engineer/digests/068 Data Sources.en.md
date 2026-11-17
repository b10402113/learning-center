---
source: sources/real-engineer/20261116/course/068 Data Sources.en.txt
source_type: text
source_lines: 39
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.5.part.md#L1-L393
---

# L1 overview

- data sources 是先前沒談的一塊：讓 agent 取得自身環境的資訊，以驗證自己的工作。
- agent 運作的環境遠不只 codebase，而是充滿可汲取資訊的各式資料源。
- 有些資料源隨時可用，有些要花點工夫才能接上。
- 常見狀況是環境裡明明有資訊，agent 卻拿不到（例如 read-only production DB 的憑證）。
- agent 可能連 production 日誌、deployment 平台、dev server 日誌、browser console 都看不到。
- 只給檔案系統與測試的 agent 基本上「是盲的」；資料豐富的環境才是高生產力環境。
- 可接的資料源清單：dev server logs、production logs、實際操作前端、本機資料庫、read-only production 資料庫、issue tracker、bug reporter（如 Sentry、Bugsnag）、以及把客戶會議逐字稿做成 wiki。
- 這些都屬於 feedback loop：agent 從環境收集回饋再據以行動。

# L2 detail

- `#L1-L11` — 回顧本段已談的 lint 規則與 mutation testing，指出測試與 automated checks 貫穿整門課；接著引入 data sources：讓 agent 獲得自身環境的資訊以驗證工作，並回頭看「agent 在環境中運作」的舊圖——環境遠不只是 codebase。
- `#L12-L27` — 有些資料源隨時可用、有些要額外設定；常見問題是環境有資訊但 agent 無法存取，例如沒有 read-only production DB 憑證、沒有 production 日誌或部署平台的存取，甚至連 dev server 日誌或 browser console 都拿不到；只靠檔案系統與測試的 agent 等於是盲的，資料豐富的環境才高生產力。
- `#L28-L39` — 可接入的資料源清單：dev server logs、production logs、實際點擊操作前端、本機資料庫、read-only production 資料庫、issue tracker、bug reporter（Sentry / Bugsnag），以及把與客戶的會議逐字稿整理成 wiki；這些都歸在 feedback loop 之下——agent 從環境蒐集回饋並行動，本段將提供一批可用的資料源。
