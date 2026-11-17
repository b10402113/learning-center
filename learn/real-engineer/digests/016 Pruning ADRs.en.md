---
source: sources/real-engineer/20261116/course/016 Pruning ADRs.en.txt
source_type: text
source_lines: 19
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- 對象從 glossary 換成 ADR：`npm run reset` 到 `seed-adr-pile` commit，會得到一大堆 ADR。
- 判準仍是 domain modeling skill 的三段式檢驗：hard to reverse、surprising、result of a real trade-off，缺一就不該留。
- 處理方式二選一：整份刪掉，或標記為 deprecated（「這個決策已不在程式裡」），後者適合想保留決策歷史又要 ADR 保持最新的情況。
- 做法照舊：開新 session，用 `grill-with-docs` 檢視 ADR 並修剪。

# L2 detail

- `#L1-L4` — 承接 glossary 修剪，換成 ADR 堆：`npm run reset` 選 `seed-adr-pile` commit，得到大量 ADR。
- `#L5-L13` — 用 domain modeling skill 的三段式檢驗逐份檢查：hard to reverse、surprising、result of a real trade-off，不符的就處理；處理方式可整份刪除，也可 deprecate 並標明「此決策已不在程式碼中」，保住「先做 A、後改 B」的歷史。
- `#L14-L19` — 做法照舊：開新 session 啟用 `grill-with-docs`，檢視 ADR 清單並修剪，提醒同時守住三段式檢驗與 delete / deprecate 兩種手段。
