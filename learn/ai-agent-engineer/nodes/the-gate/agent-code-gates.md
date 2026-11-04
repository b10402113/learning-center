# 給 agent code 的更多 gate

行為測試檢查的是行為，確認 code 能不能跑。
但 agent 留在 code 裡的痕跡，不一定能被行為測試抓到。
例如被壓下來的 `@ts-ignore`、沒人刪掉的死 `console.log`，或明明有現成 util，卻自己手寫 retry。
這些是 pattern，不是 bug，需要用不同的檢查來處理。
以下六種 check 都會在 CI 執行，最後只會得到 pass 或 fail。
因此它們適合放進 gate：agent 不必「記得」規則，紅燈會替它記住。

## 六種 check

**Lint。** 把重複出現的 review comment 寫成 lint rule。
同一件事只要在 PR 上提醒過兩次，就可以寫成規則。
ESLint 用來抓 code pattern；SonarQube、Semgrep、CodeQL 的涵蓋範圍更廣。

**Architecture tests。** Agent 寫的 code 局部看起來沒問題，卻可能破壞整體結構。
這類檢查會檢查命名慣例、禁止放置的位置，以及依賴方向。
例如「controllers 只放在 API 層」或「handlers 只依賴抽象」。
ArchUnitNET 就是這一類工具。

**Type guardrail。** Agent 可能為了讓 code 通過編譯而放寬型別。

**Contract tests。** Architecture test 管的是 codebase 內部的邊界，contract test 管的是系統之間的邊界。
如果外部 API 改了 response，而你的 code 還在等舊的 response，CI 就會亮紅燈。

**Supply-chain guardrail。** Agent 可能很自由地新增依賴。
可以用 audit、Renovate 和 lockfile 紀律，擋下有漏洞、過時或未核准的套件。
也可以加上 package age gate，拒絕剛發布不久的版本。
這能讓生態系有時間發現遭入侵的 release。
三天是實用的預設值。

**Migration linters。** 新增帶有 default 的 `NOT NULL` 欄位的 migration，可能通過所有測試，卻在 production 鎖住一張大表。
原因是 agent 不知道資料表有多大，也不知道寫入有多頻繁。
Squawk 會檢查 Postgres migration，例如沒有 `CONCURRENTLY` 的 index 和危險的 rename。
strong_migrations 對 Rails 做相同的事。
每個碰到 migrations 資料夾的 PR，都應在 CI 執行這些檢查。

<!--image:1-->

## Type guardrail：三步把型別鎖緊

Agent 讓 code 通過編譯最快的方法，就是放寬型別：加一個 `any`、一個 `as unknown as X`，或一個 `@ts-ignore`。
可以分三步把型別鎖緊。

第一步是設定編譯器。
打開 `strict`（TicketBay 的 tsconfig 已經這樣設定），再進一步加入 `noUncheckedIndexedAccess` 和 `exactOptionalPropertyTypes`。

第二步是設定 lint。
把 `@typescript-eslint/no-explicit-any` 和 `@typescript-eslint/ban-ts-comment` 設為 error，讓放寬型別的做法直接亮紅燈。

第三步是調整型別模型本身。
用 discriminated union 取代 boolean flag。
可選的 boolean 可能允許「processing 又 paid」這種不可能的狀態。
union 則讓這種狀態根本無法寫出來。

<!--image:2-->

## 什麼進 gate，什麼交給 review

這些檢查共用一條篩選原則：機器能判定對錯的，就放進 gate；需要判斷的，就交給 review。
一行 `@ts-ignore` 是否存在、index 有沒有 `CONCURRENTLY`、依賴是不是三天內才發布，都有明確答案。
把它們寫成規則後，就不必再靠記性。
「這個抽象切分得對不對」或「這個依賴值不值得加」，都需要判斷。
這些問題難以寫成規則，應留給 review。
gate 的價值就在於這種分工。
規則一旦機器化，就能套用在每個 PR，不論 code 是人還是 agent 寫的。

<!--image:3-->
