---
source: sources/real-engineer/20261116/course/060 Pruning CODING_STANDARDS.md Solution.en.txt
source_type: text
source_lines: 81
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L25
  - cohort-005-project.2.part.md#L1-L2264
---

# L1 overview

- 對 bloated 的 `CODING_STANDARDS.md` 下 prompt：每條規則只有「刪掉」或「轉成 automated check」兩條路，不看歷史 session。
- 盤點結果共有六個發現：沒有檢查、沒有 linter、規則過時／矛盾／重複、schema 規則可變 Vitest、流程規則放錯位置、no-ops。
- 第一項：repo 完全沒有 guardrails——沒有 pre-commit hook、沒有 CI，Prettier 有設定卻從沒執行。
- 第二項：沒有 linter，而約 30 條機械規則可以轉成 lint 規則，例如 `no-explicit-any` 與 `no-non-null-assertion`。
- 第三項：有些規則已 stale、互相矛盾、或重複，直接刪除即可。
- 第四項：schema 規則是對 schema 與 Drizzle 的確定性事實，適合寫成一支 Vitest 測試，而不是 lint 規則。
- 第六項的 no-ops 是指 steering file 裡刪掉也不會改變任何輸出的句子；最後保留的是一批太模糊、無法機械化的散文規則。
- 檔案從 421 行縮到約 111 行，lint 規則清單存成 secret gist 供後續課程使用。

# L2 detail

- `#L1-L7` — 下 prompt 掃描整份 standards，每條只做刪除或轉 automated check；agent 先盤點 repo 現有 guardrails、可機械化的規則，並統計現有違規數。
- `#L8-L15` — 發現一：完全沒有 automated checks、沒有 pre-commit hook、沒有 CI；Prettier 有設定但從未執行（formatter 的價值是格式一致、diff 乾淨）；建議把 format check 加進 pre-commit 執行的 `npm run check`。
- `#L16-L23` — 發現二：沒有 linter，約 30 條機械規則可轉成自動檢查，例如「不要寫 any」「不要寫驚嘆號」對應 `no-explicit-any`、`no-non-null-assertion`；其餘規則也都有現成 lint 規則可用。
- `#L24-L33` — 發現三：有些規則 stale、矛盾或重複，應直接刪；例子包括引用不存在的 progress cache（程式改了規則沒跟上）、interface vs type 兩條互斥（L187 與 L326），以及 N+1 與「不要在迴圈讀 DB」其實是同一條。
- `#L34-L37` — 發現四：部分 schema 規則是關於 schema 與 Drizzle 的確定性事實，適合改寫成 Vitest 單元測試，不必變成 lint 規則。
- `#L38-L41` — 發現五：有些是流程規則，跟 reviewer 要看的 diff 無關，不屬於 code review 檔案。
- `#L42-L49` — 發現六：no-ops——steering file 中刪掉也不會改變輸出的行，通常是模型本來就會做、或太模糊無法執行（例如 measure before you optimize、mobile first、debounce keystrokes）；同時列出該留下的規則（thrown response、arrange test through module under test、交易包住相關寫入）。
- `#L50-L65` — 實作：要求 agent 把 standards 砍到建議大小，並把建議的 lint 規則存成 secret gist 供下個 session 使用；並說明可只用 skill 的參考資料而不走它的步驟（retro 的兩半結構），這是合法用法。
- `#L66-L81` — 結果：`CODING_STANDARDS.md` 從 421 行降到約 111 行；留下的都是太模糊、難以自動化的規則（thrown response、schema 驗證邊界輸入、action 內檢查權限），lint 規則清單已存成 gist，作為後續幾個強化 automated checks 的靈感。
