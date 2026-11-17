# 建置 Cadence 專案：從 Clone、建立自己的 Public Repo 到啟動開發伺服器

開始進入課程前，我們需要把課程專案倉庫（Cohort005project）放到自己的電腦中，並在 GitHub 上轉成屬於自己的版本。

即使你在先前的速成課程（crash course）中操作過類似流程，也不要跳過這個步驟。這次使用的是完全不同的儲存庫（repository）與演練場。

## 複製專案並開啟編輯器

首先將專案 clone 到本機。在專案頁面上複製 HTTPS 網址（若習慣也可以使用 SSH，這裡以 HTTPS 為主），在終端機執行：

<!-- derived -->
```bash
git clone https://github.com/ai-hero-dev/cohort-005-project.git
cd cohort-005-project
```

進入資料夾後，直接輸入 `code .` 在 VS Code 中開啟專案。課程中使用 VS Code，但你也可以自由選擇偏好的 IDE 或單純使用終端機。

## 用 CLI 建立自己的公開儲存庫

接著我們要在 GitHub 上建立自己的版本。這不只是為了拿到程式碼，更重要的是你需要有屬於自己的 Issues 與 Pull Requests，後續我們會用它們作為任務追蹤系統（ticket tracker）。

![第 1 段配圖](./fork-cadence-assets/image-1.webp)

專案提供了一道簡化流程的指令：

<!-- derived -->
```bash
npx aihero-cli fork
```

終端機會詢問是否安裝指定版本的 `aihero-cli`，確認後它會要求輸入儲存庫名稱。你可以自訂名稱，例如輸入專案名稱加上後綴。

執行時終端機會提示以下動作：
- 將目前資料夾的 Git 歷史記錄重設，替換成單一筆全新的 commit。
- 在你的 GitHub 帳號下建立一個新的公開（public）儲存庫。
- 將檔案推送到該儲存庫並設為 `origin`。

本地 Git 歷史被重設看起來有點嚇人，但這只影響這個專案，而且專案內有自訂指令連回原始專案的 upstream，因此完全重置歷史記錄正是我們想要的結果。在提示出現時按下 `Y` 確認，完成後你的公開儲存庫就準備就緒了。

這裡務必將儲存庫設為公開。課程後續會高度依賴 GitHub Actions 來執行自動化工作，GitHub 對於公開儲存庫提供免費的 GitHub Actions 額度；如果設為私有（private），免費額度相當有限，公開儲存庫才是最適合練習的環境。

## 安裝相依套件並啟動開發伺服器

這個專案建構在熟悉的 Cadence 線上課程平台架構之上。沿用相同的架構，是為了讓你把精力專注在吸收新知識，而不是重新理解一個全新的演練系統。

先在專案目錄下安裝相依套件：

<!-- derived -->
```bash
npm install
```

安裝過程中如果看到一些棄用警告（deprecation warnings）或安全性弱點（vulnerabilities），暫時不用擔心，直接忽略即可。

安裝完成後不要急著啟動應用程式，請先執行資料庫植入指令，建立本機的 SQLite 資料庫資料：

![第 2 段配圖](./fork-cadence-assets/image-2.webp)

<!-- derived -->
```bash
npm run db:seed
```

資料庫植入完成後，啟動本機開發伺服器：

<!-- derived -->
```bash
npm run dev
```

終端機會顯示伺服器運行在 `http://localhost:5175`。在瀏覽器打開這個網址，就能看到熟悉的 Cadence 平台介面。

## 後續課程需要用到的第三方服務

完成基本環境建置後，有兩項服務會在後續章節使用到，可以先記下來：

1. **Knock**：後續實作通知系統時會用到。只需要註冊免費開發者帳號，輸入電子信箱即可，不需要填寫信用卡資料或付費。
2. **tldraw**：課程後半段進行白板討論與架構繪製時會使用這款線上畫布工具，直接使用 Google 帳號登入即可使用。

如果在安裝或啟動過程中遇到任何問題，可以先到專屬的 Discord 發問，或參考文末常見問題排解段落的更新說明。
