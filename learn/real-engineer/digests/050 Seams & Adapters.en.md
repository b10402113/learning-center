---
source: sources/real-engineer/20261116/course/050 Seams & Adapters.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L57
  - cohort-005-project.3.part.md#L1-L38
---

# L1 overview

- seam 一詞出自 Michael Feathers《Working Effectively with Legacy Code》；作者把 vibe coded codebase 直接視為 legacy code。
- seam 的定義有兩層：module 呼叫另一個 module 的位置，也就是 module interface 所在之處；也是「不編輯該處就能改變行為」的地方。
- `access.server.ts` 直接呼叫 database，因此要執行它就得用真資料庫——在 production 上跑測試會刪掉真實資料，所以必須在兩者之間插入 seam。
- adapter 是「在 seam 上滿足某個 interface 的具體實作」：真資料庫與測試資料庫就是同一個 seam 的兩個 adapter；adapter 一詞取自 ports and adapters。
- Feathers 的實務主張：legacy codebase 通常 seams 不足，接手後第一件事就是為要改的 module 補上 seams。
- 用 `daysSince(iso, now)` 示範：把 `now` 變成參數就是加了一個 seam，函式不再直接讀 `Date.now`，測試可傳入假時間而不必動 fake timers。

# L2 detail

- `#L1-L6` — 承接前課輸出：agent 說 `access.server.ts` 沒有測試檔、而且難測，因為它自己讀 session cookie、呼叫 `resolveCountryRequest`、使用全域 database。現有詞彙不足以描述「難測試」，於是補上新詞。
- `#L7-L20` — 這詞就是 seam，由 Michael Feathers 在《Working Effectively with Legacy Code》提出（作者抱怨模型在 Opus 4.8–5 時期突然對這個詞著迷，但他早就在用）。定義：modules 之間會互相呼叫，呼叫發生的位置就是 seam，也就是 module interface 所在之處。同時點出這本書的書名也很貼切，因為 vibe coded codebase 就是 legacy code。
- `#L21-L32` — 以現況說明為何需要 seam：loader 呼叫 `access.server.ts`，後者呼叫 database；要執行 `access.server.ts` 就得連真資料庫，而對 production 資料庫跑測試會刪掉真實資料。因此必須在 `access.server.ts` 與 database 之間放一個 seam，讓實機能接 live database、測試能接 test database。seam 的好處正是「可以替換背後的東西」；live 與 test 這兩種實作就叫 adapter——在 seam 上滿足 interface 的具體實作。seam 取自 Feathers，adapter 取自 ports and adapters。
- `#L33-L43` — 語言可以因地制宜（團隊既有詞彙就用團隊的），但本課往後固定用這套。Feathers 的實務主張：legacy codebase 往往 seams 不足，所以接手後第一件事，是找出即將修改的 module 並在其周圍補上 seams；在 `access.server.ts` 就是要找到能依情況插入 live 或 test database adapter 的點。
- `#L44-L62` — 用程式示範 seam 的長相：`daysSince(iso)` 內部呼叫 `Date.now`，得靠 fake timers、設定系統時間、測後重置才測得動；改成 `daysSince(iso, now)` 把「現在時間」當參數傳入，這個參數就是 seam，測試只需定義 `now` 再傳進去。圖示對應：`daysSince` 內的 seam 可餵真時間或假時間。
- `#L63-L71` — 對照 agent 的提案：它提議把 `getAccess` 拆成 thin request adapter，並把 database 傳進 `resolveAccess`。它會這樣做正是因為懂 seam。重申定義：seam 是不編輯該處就能改變行為的位置、module interface 所在之處；adapter 是在 seam 上滿足 interface 的具體物。至此 glossary 全部講完，下一課開始實際搶救 legacy codebase。
