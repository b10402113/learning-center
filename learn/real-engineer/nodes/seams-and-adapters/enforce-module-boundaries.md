# 用 Dependency Cruiser 守住模組邊界：讓 Deep Module 永遠保持深模組

把程式碼重構成漂亮的 deep module（深模組）後：路由裡的載入器（loader）變得乾淨，背後呼叫的模組架構清楚又容易測試，實際上線的程式碼也跟測試環境高度一致。

接下來會遇到一個現實問題：要怎麼一直維持這個狀態？

當下一個 AI agent 接手時，很可能會重蹈覆轍。例如為了求快，直接在路由檔案裡呼叫資料庫，或是把原本應該留在模組裡面的商業邏輯隨意抽出來。剛建好的 deep module 很快又會退化回 shallow module（淺模組）。

要如何確保特定邏輯只能存在於模組內部，甚至強制禁止特定檔案直接碰資料庫？

## 從人工審查走向自動化檢查

維持程式碼品質有幾個層次。

第一層是人工審查（human review）。在頻繁由 agent 產出程式碼的開發模式下，人工審查的負擔非常重。

第二層是自動化審查（automated review）。例如讓 agent 審查每次的 git diff，確認檔案有沒有從不該匯入的地方匯入。

最理想的狀態，是把檢查規則從人工審查移到自動審查，再進一步固化成「自動化檢查」（automated checks）。自動化檢查的執行成本最低，每次執行的標準都完全一致。

在 TypeScript 專案中，要用自動化檢查守住模組邊界，適合的工具是 Dependency Cruiser（Rust 或 Java 等語言也有類似工具）。

JavaScript 與 TypeScript 預設的模組機制非常寬鬆：只要檔案有 `export`，其他任何檔案都可以隨意 `import`。Dependency Cruiser 的作用，就是替專案立下嚴格的匯入規則，強制所有人遵守。

## 模組的實作細節藏在 lib，只對外暴露 Entry Point

在專案中引入 Dependency Cruiser 後目錄架構可以規範成如下的模組形式（例如放在 `app/modules/`）：

<!--image:1-->

模組內部建立一個 `lib/` 資料夾，所有核心實作細節都放在裡面。

模組外部完全不能直接匯入 `lib/` 裡的東西。

對外唯一開放的窗口，只有模組根目錄的入口檔案，例如 `index.ts`、`index.server.ts` 或 `client.ts`。

以範例模組 `Slugify` 來說：核心演算法寫在 `lib/` 裡面，外部只能從 `index.ts` 匯入公開的 `toSlug` 函式。

重構後的 `instructor-analytics` 模組也是同樣邏輯。入口檔案 `index.server.ts` 只匯出必要的型別，以及一個建立實例的處理函式 `createInstructorAnalytics`。這個函式接受資料庫連線作為參數，並回傳查詢方法。外層的 loader 就不會不小心把資料庫連線代碼打包到前端的 client bundle 裡。

在 `package.json` 中，可以設定一組檢查指令：

<!-- derived -->

```bash
npm run lint:boundaries
```

這段設定背後執行的就是 `depcruise app`。如果一切合規，終端機就會回報沒有任何相依性違規。

如果有人在 `instructor-analytics/lib/` 裡匯出私有的 `parseID` 函式，並在路由檔案裡直接從 `modules/instructor-analytics/lib/...` 匯入，執行檢查時 Dependency Cruiser 就會立刻報錯，阻止外部程式碼刺穿模組邊界。

## 連模組自己的測試，也只能從 Entry Point 匯入

這套架構最關鍵的一點在於：模組自己的測試檔案，也不能直接匯入 `lib/`。

<!--image:2-->

直覺上可能會認為，測試檔案本來就放在模組內部，測自己的私有函式應該沒關係。

但如果允許測試直接存取 `lib/`，測試就會開始綁定內部實作細節，寫出脆弱且難以維護的測試。

在嚴格的 Dependency Cruiser 規則下，即使是 `instructoranalytics.test.ts` 這類模組本身的測試，只要嘗試從 `lib/` 匯入 `parseID`，檢查一樣會判定為違規。

連模組自己的測試，都必須透過公開入口（entry point）來測。

測試唯一能匯入的，就是入口暴露出來的公開介面（例如 `createInstructorAnalytics`）。這個限制直接杜絕了 agent 最常犯的錯誤：繞過公開介面去測內部瑣碎細節。

## 雙向防護：禁止外層路由直接碰資料庫

守住模組邊界不能只防一邊。

除了不讓外部隨意戳進模組內部，還要防止外層檔案（例如路由）越權。

如果路由依然能直接 `import db` 並自行查詢資料庫，路由遲早又會膨脹。

可以在 Dependency Cruiser 設定檔裡新增一條針對路由的自訂規則，例如名為 `instructor-analytics-root-no-db`：

- 說明：`Instructor Analytics` 路由必須透過該模組取得資料，絕不能自己查詢資料庫。
- 規則內使用正規表達式，限制來源路徑（`from`）為該路由檔案，目標路徑（`to`）比對資料庫連線模組。

加上這條規則後，只要有人試圖在該路由中匯入 `db`，執行 `npm run lint:boundaries` 就會直接報錯中斷。

初期為了避免過大的重構成本，可以先針對特定路由設限。長期來看，這套機制可以推廣到所有路由，強制要求所有資料讀取都必須透過 deep module。

## 納入標準流程與第二道防線

建立好邊界檢查後指令需要進一步整合進開發流程中：

<!--image:3-->

1. 將 `lint:boundaries` 加入專案整體的 `npm run check` 之中。
2. 在指示 agent 的規範檔案（例如 `AGENTS.md`）裡，將邊界檢查列為每次提交變更前必跑的驗證步驟。

自動化檢查依然有被 agent 鑽漏洞的風險。agent 在遇到檢查不過時，可能會投機取巧直接把 Dependency Cruiser 的規則註解掉。

因此需要搭配第二道防線：將模組邊界的原則寫進 `coding-standards.md`，並配合自動化審查（由 review agent 檢查 diff 是否更動了規則檔案）。

當自動化檢查與規範審查一起運作，重構出來的 deep module 就能穩固地維持深度，不會輕易退化。
