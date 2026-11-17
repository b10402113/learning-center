---
source: sources/real-engineer/20261116/course/013 Writing an ADR Solution.en.txt
source_type: text
source_lines: 189
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L370
  - cohort-005-project.1.part.md#L1-L624
---

# L1 overview

- agent 一讀就抓到三個模型問題：course access 來自 `enrollment` 而非 `purchase`；progress 存在 learner×lesson 而非 enrollment；`admin` 在 schema 有兩種意思。
- 決策：只有 `platform admin` 能決定退款，與 `team admin` 並列（否決單叫 `admin`）；拒絕也在 scope 內。
- 決策：退款核准那一刻 learner 失去課程存取；保留 lesson progress / watch history / quiz attempts；可再買同一門課。
- 決策：退款申請綁在特定 `purchase` 上；`individual purchase` vs `team license`（發 `seat`，分 claimed / unclaimed）；`seat` 在退款申請 open 期間不可被 claim；team 成員（Ben）不能自己申請退款。
- 剪掉的詞：`void seat`（覺得刺耳）與 `access`（太模糊、不需要 mint）。
- 還挖出真 bug：server action 沒檢查 50% 上限（可 curl 繞過）、退款流程可能退到錯的 purchase（取最近一筆而非授予存取的該筆）。
- 第一輪 agent 說不需要 ADR；作者堅持再跑一輪三段檢驗後通過 4 份 ADR。

# L2 detail

- `#L1-L12` — 開場先在 `GLOSSARY.md` 前想清楚用詞（`open refund request`、`refund`、`pending` / `issued refund`）。prompt：目前沒有核准 `open refund request` 的方式，需要管理員登入看到所有 request 與課程進度再決定；核准之後的事列為 out of scope，但要決定何時失去課程存取、是否刪除進度。
- `#L13-L24` — agent 重讀 glossary 與退款程式，指出 `course access` 來自 enrollment 而非 purchase（enrollment 留著就永遠不能再買）、progress 不是存在 enrollment 上而是 per learner × lesson、`admin` 在 schema 有兩種意思、glossary 說「team 核准」但 team 在別處指 team license。還發現課程頁在完成 50% 後隱藏退款入口，但 server action 沒檢查，learner 可以 curl 繞過——是安全性問題。
- `#L25-L44` — 逐題決策：第 1 題誰決定退款 → 只有 `platform admin`，並在 glossary 用 `platform admin` 與 `team admin`（不用單獨的 `admin`）。第 2 題 declining 在 scope 內。第 3 題 learner 在**核准時**失去存取（選 B），因為若拒絕申請仍應保有存取。第 4 題保留 lesson progress、watch history、quiz attempts。
- `#L45-L60` — 第 5 題已退款的 learner 可以再買同一門課。第 6 題 admin 看到的 progress 屬 UI 細節，照建議。第 7 題沿用 50% 觀看上限規則。glossary 新增 people 區塊（platform admins、team admins），其餘 entry 也跟著更新。
- `#L61-L88` — 新的模糊點：team license 被退款時 seat 怎麼辦（10 席、day 3 有人 claim）。作者一遇到難懂的句子就要求 scenario testing。agent 查出程式碼講 `coupon`、退款碼講 `seat`、人講 `team license` 三套詞；access 與授予它的 purchase 沒有連結；退款流程會退到錯的 purchase（永遠取該課程最近一筆）。作者認為這就是該 grill 的點。
- `#L89-L104` — 情境建模：Priya 以 $790 買 10 seats 給 Introduction to TypeScript，自己不佔席次 → 與 Liam 自購 $79 不同類。`purchase` 是通用詞，`individual purchase` 為自己買，`team license` 為他人買並發 `seats`。Priya 後悔且沒人 claim → 退款核准後「void the seats」；作者不喜歡 void seat 這個講法。
- `#L105-L127` — 續：申請 open 期間有人 claim → 建議規則「退款申請 open 時 seats 不能 claim」，於是需要 claimed vs unclaimed seat，且規則有依賴就得進 glossary。Liam 自購後又買 team license → `refund request` 要綁定特定 `purchase`，形成 purchase →（可能是 team license）→ claimed / unclaimed seats 的階層。Ben 用了 Priya 的 seat 想退自己錢 → 不行。Liam 的 individual purchase 退款失去存取、一週後 Priya 給他 seat → 應恢復存取並保留原進度。作者全數同意，並稱讚 mint 出 `individual purchase`、`team license`。
- `#L128-L156` — glossary 一次塞進 purchase、individual purchase、team license、seat、unclaimed seat、claimed seat（都合理），但作者拒絕 `void seat`（grim、念起來糟）與 `access`（太模糊、顯而易見、不需要定義）；agent 照辦移除。後續幾題（team admin 在哪裡對 team license 提申請、platform admin 可否核准違規申請、兩個 admin 同時決策）作者直接全數同意，並指出「覺得溝通變容易」就是語言奏效。
- `#L157-L189` — 第一輪 agent 說沒有 ADR 通過（「都不夠難逆轉又不夠 trade-off」），作者反駁「這是別人的錢」，要求重跑三段檢驗，結果 4 份通過：(1) 核准退款保留 learner 進度（三行 markdown）；(2) 課程「位置」在核准時結束（附 considered options，否決「提出申請時就收回」因被拒者會被白白鎖在外）；(3) team license 退款全有全無、申請 open 期間 seats 凍結（考慮過「允許 claim 但之後只能拒絕」並否決）；(4) 一個 learner 每門課只有一個 place，不論來自 individual purchase 或 claimed seat，且 place 不記錄來源（有 consequences 段，指出會影響程式如何把 request 綁到最新一筆 purchase）。作者滿意全部極短、非顯而易見、值得存在，之後直接實作不逐檔示範。
