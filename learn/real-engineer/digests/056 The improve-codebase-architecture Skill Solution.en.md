---
source: sources/real-engineer/20261116/course/056 The improve-codebase-architecture Skill Solution.en.txt
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L202
  - cohort-005-project.3.part.md#L1-L125
---

# L1 overview

- 提示語可以極短（「access.server.ts 有點失控，是 deepening 的好候選」）；skill 通常不需指定檔案，隨便跑在任一個 codebase 都行，本課只是為了線性教學才先指定。
- 報告頂部統計很震撼：4 個 route import access server，卻有 25 個 route 重新實作；`getUserById` 有 15 份副本；access.server 零測試。
- 候選一（accepted，列為首要建議）：把 per-course access 收成一個 deep module，核心問「may they」——這個人對這門課可以做什麼；lesson、五個 instructor、course routes 共用同一介面，database 注入，測試用 `createTestDb`。
- 候選二（accepted）：把 request 變成 viewer 的單一 seam——18 個 401 throw、四種措辭，收斂成一個把 request 轉成 viewer 並統一處理錯誤的函式。
- 候選三（accepted，原標「only worth exploring」）：命名並統一 purchase country（PPP）規則——三個 call site 對未知國家規則不一致；得利是規則只在一處、意外差異消失、glossary 補齊。
- 候選四（skipped）：統一 team admin 定義——skill 自己標為 speculative，所以跳過。
- 作者決定三個都做，並提醒 refactor 很吃 token，通常直接走 spec + tickets + implement spec。

# L2 detail

- `#L1-L13` — 跑起來後只給一句提示：`access.server.ts` 有點失控、適合 deepening。skill 已呼叫 codebase design 取得完整 glossary。作者說明這個 skill 一般不需要指定檔案——可以無提示直接跑在任何 codebase 上——本課是因為線性課程要照特定路徑走，才先餵入目標；實務上有時在 human review 看到誇張案例，就會指定該處改善。sub-agent 完成後報告出爐（作者提醒報告是 light mode）。
- `#L14-L29` — 報告內容：標題是 deepening course access module，頂部統計——4 個 route import access server，但 25 個 route 自行重新實作；`getUserById` 有 15 份副本；access.server 零測試。before／after 對照：before 是決策散落在大量 route、直接對 database 說話、大量複製 `getUserId`；after 是單一 module 回答「may they」（授權的巧妙說法）。提案在 course access module 上開一個小介面，供 lesson routes、五個 instructor routes、course routes 共用，database 注入，測試用 `createTestDb`。
- `#L30-L39` — 問題與解法寫得清楚易讀：問題是 module 太淺（只有 4 個 route 使用）、每個 caller 自己算存取導致規則互相矛盾、lesson route 甚至把 lesson 內容送給無權觀看的訪客。解法是把「這個人對這門課可以做什麼」搬進 `app/modules` 的 module，database 依 instructor analytics 的方式注入。得利：locality——所有存取規則只有一處；可刪掉九份重複函式；leverage——單一介面配 15 個 call site，這個 deep module 會變得極其重要。
- `#L40-L54` — 第二個提案：before 是每個 route 自己傳 request、抓 cookie user id、自己 throw；共有 18 個 throw、四種不同措辭的 401。after 是一個把 request 轉成 viewer 的函式。問題陳述：`getCurrentUserId` 是進入 access 的真正入口，卻只是 cookie session 的淺通道，每個 route 又各自加上 401、查 user、查 role。解法是一個小 module 把 request 變成 viewer，並處理錯誤（所有 401 與拒絕存取都收進去），於是處理課程存取時不必再傳 request，只要傳 viewer。
- `#L55-L66` — 第三個提案，原標記為 only worth exploring：命名並統一 purchase country 規則。問題是 glossary 沒有 PPP 條款的名字，三個 call site 用不同規則比較國家（對未知國家的處理不一致），三個地方對如何重算 PPP（purchasing power parity，購買力平價）各有邏輯。得利是 country 規則只存在一處、意外的差異消失，還能補齊 glossary。另有「給 team admin 單一定義」的提案，但被 skill 自評為 speculative，作者直接跳過。總結建議是先做 per-course access 這個 deep module，再做 viewer seam。
- `#L67-L77` — 作者決定三個都做（一、二、三），進入 grilling session：先探索、再 grill。並指出到此階段課程已熟悉 grilling 與 domain modeling 的長相，接著會走 to spec、to tickets、implement spec；refactor 很耗 token，所以他幾乎一律用 spec + tickets。最後強調這套語言的價值：不懂好 codebase 長什麼樣、不懂何謂 deep module，這些圖會讀不懂；鼓勵大家在自己的 codebase 上無提示直接跑一次。
