---
source: sources/real-engineer/20261116/course/040 The _code-review Skill.en.txt
source_type: text
source_lines: 39
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L89
  - cohort-005-project.6.part.md#L1-L25
---

# L1 overview

- 多數團隊 automated review 做得不夠；它是省人力的高 token 效率手段。
- 品質階梯：automated checks → automated review → human review，每階都提升，到人面前時程式該已經很棒。
- 為什麼不要求 implementer 一次做對：implement 要探索、實作、除錯，工作太多。
- 清空 context 後只審 diff，code review agent 不必找 diff、不必探索、也不必改檔，可以塞進大量指示。
- 實務上 code review 由 implement 內部呼叫，並以 sub-agent 形式跑在新 context window。
- 規則來源是 `CODING_STANDARDS.md`：想被自動審查抓到的規範都放這裡。
- 刻意不把標準推給 implementer：implement 負責「讓它能動」，code review 負責「讓它變好」。

# L2 detail

- `#L1-L8` — 轉入 automated review：作者認為多數團隊做得不足，它省人力的 token 效率極高；並重申品質階梯——工作從 automated checks 推進到 automated review 再到 human review，每階段品質上升，理想上人到場時程式已盡善盡美，不該浪費人力審垃圾碼。
- `#L9-L23` — 回答「為何不讓 implementer 一次做對」：implement 同時要探索 code base、實作、除錯，負擔太重；反之清掉 context 只對 diff 做 review 時，review agent 不必找 diff、不必探索（位置已明確）、沒有檔案要改，因此可以承載大量指令與「找出並移除這些 pattern」之類的要求；實際運作常是在 implement session 中呼叫 code review，讓它以 sub-agent 取得當下的新 context window。
- `#L24-L30` — 如何「餵」這個 review agent：標準來源看 `CODING_STANDARDS.md`，想被自動審查辨識的規範都放這裡；此階段 repo 已有若干標準（例如禁止 `any`、禁止 `!` 以杜絕 TypeScript 作弊、以 throw 而非回傳值表示失敗、未受信任輸入要走 schema），這些模型狀態好時本來就會做，但自動審查是多一層防線。
- `#L31-L39` — 為何不把標準放進 `AGENTS.md`：那樣每個 agent 都會讀到；作者寧可對 implementer 隱藏或至少不主動推送標準，讓 implementer 自由產出粗略草稿，再由擁有 `CODING_STANDARDS.md` 額外資訊的 code review 打磨——implement 讓它能動，code review 讓它變好；也預告下一課要實際用 code review 改善這個 PR。
