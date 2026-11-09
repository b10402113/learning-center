# 課程環境建置：從分支切換到資料庫初始化

準備開始課程前，需要先備妥執行環境，包括切換專案分支、安裝相依套件、設定資料庫連線與模型金鑰，最後同步資料庫並完成環境檢查。

### 切換分支與安裝相依套件

請先將 Git 分支切換到 `lesson-1`。接著執行安裝指令，並複製一份環境變數範本：

![第 1 段配圖](./prepare-the-lab-assets/image-1.webp)

<!-- derived -->
```bash
npm install
cp .env.example .env
```

專案目錄內已經備好 `.env.example`，複製成 `.env` 後，後續需要填入資料庫連線字串與模型設定。

### 取得免安裝的資料庫連線

這門課需要用到 Postgres 資料庫，但你不需要在本機安裝資料庫軟體，也不需要註冊帳號或綁定信用卡。

瀏覽器開啟 `neon.new` 後點擊「在瀏覽器中試用（try it in a browser）」，畫面就會產生一組免費用戶的連線字串。這組臨時資料庫如果沒有被認領（claim），大約 72 小時後會自動失效，不過課程練習不需要 72 小時，直接取用即可（Neon 後續可能逐步調整這類臨時資料庫的規則，轉為需要認領的形式）。

![第 2 段配圖](./prepare-the-lab-assets/image-2.webp)

拿到連線字串後，將包含 SSL 選項的完整字串貼到 `.env` 中的 `DATABASE_URL`：

<!-- derived -->
```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

如果你本機已經有現成的 Postgres 且習慣使用本機資料庫，也可以自行連線本機。這裡推薦 Neon 是為了避免本機安裝的麻煩，特別是 Windows 系統若遇到資料庫安裝問題，講師本身不使用 Windows，除錯會相對棘手。請記得 `.env` 包含連線資訊，不要提交到 Git 儲存庫。

### 設定模型金鑰與提供者

專案需要呼叫模型，因此必須準備模型 API 金鑰。如果還沒有 OpenAI 帳號，請前往 OpenAI platform 建立新金鑰：

1. 在 API keys 頁面點擊建立新的 Secret key。
2. 設定金鑰名稱、所屬專案（若有），並設定過期日（例如設為一天）。
3. 建立後複製金鑰並妥善保存。

帳號內需要儲值餘額，但課程消耗非常少，放入系統允許的最低儲值額度（通常約 2 美元）就綽綽有餘。除非刻意使用最頂級的 o1 模型大量運算，否則普通的 GPT-4o 就能順暢運作，不需要過度消耗額度。

如果有同學想換用 Anthropic 的 Claude API，做法也是可行的。專案使用的是 AI SDK，底層抽換模型不會影響業務邏輯的程式結構，只要修改程式碼中指定模型名稱與提供者的部分即可。若想搭配 OpenAI 相容的第三方代理閘道（例如 Command Code 支援的 DeepSeek 模型），也可以在 `.env` 中設定 `OPENAI_BASE_URL` 與 `OPENAI_MODEL`：

<!-- derived -->
```dotenv
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4o
# 選填：相容閘道端點
# OPENAI_BASE_URL=https://api.commandcode.ai/provider/v1
```

### 推送資料庫結構與執行預檢

設定好 `.env` 之後，要把專案的資料表結構推送到資料庫中：

<!-- derived -->
```bash
npm run db:push
```

只要連線字串正確，這一步會將專案的 schema 套用到 Neon 資料庫。因為是第一次推送到空資料庫，終端機不會顯示「no changes detected」，而是會出現結構建立成功的相關訊息。

結構推送完成後，執行預檢指令：

<!-- derived -->
```bash
npm run preflight
```

這個檢查指令會驗證三件事：
1. 本機是否正確安裝 Node.js。
2. 資料庫 schema 是否已完成同步。
3. 環境變數中是否存在 OpenAI API 金鑰。

![第 3 段配圖](./prepare-the-lab-assets/image-3.webp)

若缺少其中任何一項，後續應用程式就無法正常啟動。加入這個檢查步驟，是為了避免因為漏掉設定或指示不全，導致大家在起跑點卡關。

### 植入初始資料

所有檢查通過後，最後一步是將測試資料寫入資料庫：

<!-- derived -->
```bash
npm run db:seed
```

執行這行指令會清除現有內容並寫入課程需要的初始資料。完成後，專案所需的資料庫與環境便全數就緒，可以正式進入後續的開發流程。

![第 4 段配圖](./prepare-the-lab-assets/image-4.webp)
