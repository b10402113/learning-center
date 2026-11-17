---
source: sources/real-engineer/20261116/course/052 Making Legacy Code Testable Solution.en.txt
source_type: text
source_lines: 61
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.2.part.md#L1-L1944
---

# L1 overview

- 提示語要求先提出 interface 設計再動手；agent 診斷出 290 行 loader 加 600 行 helper，有三件事阻礙測試：使用全域 database，以及在三處讀 clock。
- 提出新 module `InstructorAnalyticsServer.ts`，只匯出一個函式，收 database、viewer、params 與 `now`；loader 縮到約四行：先確認 instructor 或 admin，再呼叫 `getInstructorAnalytics`。
- agent 主動要求吃 raw `URLSearchParams` 而非已解析值，理由是讓 instructor pinning、course ownership 等安全規則進入測試可及範圍——作者認為這正是在把 module 做深。
- 其他決策：單一函式而非每個 panel 一個（多函式會犧牲 locality）、不假造 database 而沿用既有的 in-memory database、順手移除重複與外移日期注入。
- 結果：檔案從 2,000 行降到約 1,000 行且幾乎全是 JSX，後端邏輯全搬進 `GetInstructorAnalytics`，並新增測試檔與 fixtures。
- 測試極短：以 instructor 或 admin 身分執行，並以 Sam Student 購買 1,000 與 5,000 的兩門課驗證 instructor pinning 只顯示自己的數字。
- agent 自我驗證：逐一植入 12 個 bug，10 個立刻被測出、2 個逃過，於是為那 2 個補測試。

# L2 detail

- `#L1-L8` — 提示語：Instructor Analytics route 有個極難測試的 loader，要「test the wazoo out of it」（作者自嘲英文講錯），因此需要插入 seams，因為目前所有邏輯都 inline 在 loader；並要求先在動手前把 interface 設計給他看。agent 自行讀完 loader 後提出介面。
- `#L9-L19` — 診斷：loader 約 290 行，上方還有約 600 行 helper；三件事阻礙測試——使用全域 database、在三處讀 clock。提案新 module `InstructorAnalyticsServer.ts` 只匯出一個函式，收 database、viewer、params 與 `now`；loader 因此縮到約四行：先要求身分為 instructor 或 admin，再傳入 `getInstructorAnalytics`。agent 也說明函式對呼叫者的承諾，以及它會繼續維持的實作決策。
- `#L20-L35` — agent 請作者確認幾項選擇：吃 raw `URLSearchParams` 而非已解析值，因為這樣 instructor pinning、course ownership 等安全規則才能被測試涵蓋——作者大讚這是在「藏更多秘密、把更多實作拉進來」以加深 module。其他決策同樣被認可：單一函式而非每個 panel 一個（多函式會讓 locality 變差）、不 fake database 而沿用既有的 in-memory database、移除重複並把 `new Date` 注入外移到另一 module。作者回覆「看起來像夢一樣」，並要求邊跑測試邊改。
- `#L36-L48` — 等待後檢視成果：loader 正如承諾變得極小；檔案從 2,000 行降到約 1,000 行，且幾乎全是 JSX——前端留下、後端邏輯全搬進 `GetInstructorAnalytics`，該函式成為 deep module，原本 loader 的邏輯幾乎原樣移入。關鍵是它現在可測：旁邊出現測試檔，頂部有 fixtures 與 seed 的基礎資料（instructor、course、另一位 instructor、admin 與另一門課）。
- `#L49-L61` — 測試內容：提供以 instructor 或 admin 身分執行的輔助函式，每個測試只驗一小段行為，因為 setup 好、module 好測，測試都很短。例：新增 Sam Student，買一門 1,000 的課與另一門 5,000 的課，驗證 instructor pinning——不論 URL 怎麼寫，登入的 instructor 只看得到自己的 1,000、看不到別人的 5,000。agent 還自我驗證：偵測到測試全綠後，逐一植入 12 個故意 bug，10 個立即被抓、2 個漏網，於是補上兩個測試。作者因此對這些測試信心很高，認為未來改 `instructorAnalytics.tsx` 會容易得多。
