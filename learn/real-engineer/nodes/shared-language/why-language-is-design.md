# 為什麼同一個概念有四個名字會變成程式裡的真 Bug？

自從 2025 年 12 月 AI 寫程式變得切實可行以來，人與 AI 溝通時所使用的語言就成了決定產出品質的關鍵。許多人低估了溝通品質對 Agent 的影響，但不管是定義事物的方式，還是話語是精準緊湊還是冗長含糊，都會直接反映在 Agent 寫出的成果上。

現在的模型常給人一種「很難溝通」的印象。舉個例子，如果你在線上課程平台 Cadence 中詢問 Agent：「學員可以退錢嗎？（can a learner get their money back?）」

Agent 很可能會這樣回答：

> 「reversal eligibility envelope 會由 cancellation gate 進行評估，一旦 entitlement lease 被釋放，就會轉交給 chargeback settlement handler。」

這句話一口氣冒出了四個憑空捏造的名詞：`reversal eligibility envelope`、`cancellation gate`、`chargeback settlement handler` 和 `entitlement lease`。這些名詞在既有的程式碼庫裡根本不存在，全都是 Agent 自己自作主張發明出來的。

Agent 之所以會這麼做，是因為這對它來說具備極高的 Token 效率（token efficient）。當它把大量概念壓縮進一個短詞裡，它就能反覆使用這個詞，省去每次在推理過程中都要向自己解釋一遍的成本。然而對閱讀這段文字的人類使用者來說，如果 Agent 沒事先解釋這些術語到底是什麼意思，這段回覆就會變成一場災難。

## 同一個概念換三個名字，使用者與程式碼都會崩潰

解決這個問題最有效的辦法，就是在使用者與 Agent 之間維護一份共享詞彙表（`glossary.md`）。這聽起來非常簡單，但它對後續的開發與維護影響深遠。

語言不一致的問題往往不會立刻以拋出錯誤的形式出現，而是像一種「不是 Bug 的語言毛病」，卻能帶來連鎖傷害。

以 Cadence 平台上的真實狀況為例：學員 Liam Thompson 登入後，點進「Introduction to TypeScript」課程。如果他在畫面上點擊「取消購買（cancel my purchase）」，系統介面接著會顯示帳戶裡有一筆「待處理扣款爭議（pending charge back）」。與此同時，他在終端機中看到的系統通知信件，標題卻寫著他的「沖正申請處理中（reversal request pending）」。

![第 1 段配圖](./why-language-is-design-assets/image-1.webp)

使用者只是想取消購買，收到的信件寫著沖正（reversal），畫面又跳出扣款爭議（chargeback）。同一個動作在使用者介面與流程裡換了三種說法，這對使用者來說是極差的體驗。在實際專案裡，一件事情叫三個名字可能極端了些，但一件事情有兩個名字卻是屢見不鮮。

更糟糕的是，這種不一致會直接蔓延到程式碼中。在專案裡搜尋 `cancellation`、`reversal` 和 `chargeback`，會發現程式碼庫裡同時並存著：

![第 2 段配圖](./why-language-is-design-assets/image-2.webp)

- `get_cancellation_offer`
- `pending_chargebacks`
- `build_reversal_email`

這正是語言混亂會演變成「真 Bug」的核心原因：當 Agent 需要理解或修改這套退款流程時，它必須在程式碼中四處翻找這些指稱同一件事、名稱卻完全不同的片段。一旦 Agent 以其中一個名詞（例如找 cancellation）去檢索，卻找不到其他形式的實作，它就會誤以為這項功能還不存在，進而重複實作一套一模一樣的邏輯。重複程式碼（code duplication）與邏輯脫鉤的臭蟲，就是這樣悄悄產生的。

## 從 DDD 借鏡：Glossary 必須拉齊的三個面

這個解決思路來自 Eric Evans 在《領域驅動設計》（Domain-Driven Design, DDD）中提出的核心概念：「通用語言」（Ubiquitous Language）。

我們不需要照單全收 DDD 厚重書本裡的所有硬派技術（例如聚合根 Aggregate 或事件溯源 Event Sourcing），只要抓住「Ubiquitous（無所不在）」這個關鍵字就好。這個語言必須在所有出現的地方都完全一致，也就是一份良好的詞彙表（Glossary）必須徹底拉齊以下三個面：

![第 3 段配圖](./why-language-is-design-assets/image-3.webp)

1. **團隊內部討論的語言**：團隊成員溝通、開會、描述手頭正在打造的功能時所使用的詞彙。
2. **產品對外呈現的語言**：真實產品介面上顯示的文字，以及終端使用者在操作產品時所稱呼的名字。
3. **程式碼庫內部的語言**：變數、函式、資料表欄位與類別所使用的命名。

在過去沒有 AI 的軟體專案中，很常看到產品畫面上叫一個名字、程式碼裡叫另一個名字，而團隊私底下聊起來又叫第三個名字。但事實上，當你替正在打造的事物找到精準、唯一且公認的名稱時，這個功能基本上就已經完成了一半——因為你已經知道該如何在對話中精確使用它、如何討論邊界條件，以及如何清楚向 AI 下達指令來建立它。

## 如何在開發流程中定下詞彙？

要落實這套方法，可以在釐清要蓋什麼功能的同時，把該用的語言一起定下來。

做法是將原本單純提問的 `grill me` 技能升級為 `grill with docs`。這項技能以拷問需求為基礎，並在上方疊加一層「領域建模（domain modeling）」技能。

在提問與對焦需求（grilling session）的過程中，領域建模技能會主動挑戰你使用的名詞與說法、拋出邊界情況的情境來檢視定義是否牢靠。一旦專案概念與決策成形，它就會立刻將名詞定義寫入專案的 `glossary.md`，並將決策脈絡記錄在 `docs/ADR`（架構決策紀錄）資料夾中。

在整個工作環境中，其他所有後續介入的 Agent 技能都會主動讀取這份 `glossary.md`。藉由在開工前拉齊團隊口語、產品介面與程式碼三者的名詞，Agent 就不再需要自創代名詞，也不會在程式庫中因為找不到既有實作而反覆造輪子，從根本上杜絕名詞分裂引發的邏輯錯誤。
