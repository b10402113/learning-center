---
source: sources/real-engineer/20261116/course/064 Writing A Custom Lint Rule.en.txt
source_type: text
source_lines: 47
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L57
---

# L1 overview

- lint 規則清單以 oxlint 實作（比 eslint 快很多），設定在 `oxlintrc.json` 並由 lint-staged 執行。
- `CODING_STANDARDS.md` 的修剪到此閉環：大檔案變成一批 automated checks。
- 本課重點不在設定，而在擴張「automated checks 能做什麼」的想像。
- 應用裡有一個嚴重的安全性漏洞，而 `npm run check` 抓不到、測試全綠。
- 具體漏洞：seed 了四門公開課與一門非公開的 Kubernetes 課，正常搜尋找不到，但塞入特製字元就能搜出——這是 SQL injection。
- 來源在 `courses.tsx`：有搜尋字串時使用了 `sql.raw`；Drizzle 通常會擋這類錯誤，但 `sql.raw` 不做跳脫。
- `sql.raw` 本身有正當用途（傳入不含動態內容的原始 SQL），但字串插值或拼接就危險，而 oxlint 無法設定成只抓這種情況。
- 因此要 agent 寫一條自訂 lint 規則：不要全面禁止 `sql.raw`，只禁止傳入動態字串，同時修掉現有漏洞。

# L2 detail

- `#L1-L11` — lint 規則改用 oxlint（更快、符合前課時間預算），透過 lint-staged 在 JS/TS 檔案上執行 `oxlint oxlintrc.json`；`oxlintrc.json` 收進 gist 裡想要的規則，也讓先前修剪 standards 的工作形成閉環。
- `#L12-L23` — 本課要擴張對 automated checks 的想像：應用中存在嚴重安全漏洞，但 `npm run check` 與測試都抓不到；seed 後有四門公開課與一門非公開的 Kubernetes 課，正常搜尋找不到，卻能用奇怪字元組合搜出，這就是 SQL injection——用自寫 SQL 看到不該看的資料。
- `#L24-L37` — 漏洞位置在 `courses.tsx` 的 `sql.raw`；Drizzle 通常會防止這類錯誤，但 `sql.raw` 不做一般的跳脫；`sql.raw` 傳靜態 SQL（如引號）是合理的，但一旦有字串插值或拼接就危險，而 oxlint 再怎麼設定也無法只針對這種情況。
- `#L38-L47` — 作法：用 agent + retro，要求三件事——修掉現有的安全漏洞、不要全面禁止 `sql.raw`、只阻止 `sql.raw` 搭配動態字串；retro 需先查如何建立 lint 規則再動手；作者強調 agent 寫 lint 規則非常擅長且快速。
