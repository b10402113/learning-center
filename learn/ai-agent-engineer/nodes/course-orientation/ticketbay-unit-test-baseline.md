# 安裝並執行 unit tests（不需 Docker）

工具都裝好之後，先確認 TicketBay 能否在自己的環境正常執行，不必先架設 Docker。先把專案 fork 到自己的 GitHub 帳號並 clone 下來，再依照專案指定的 Node.js 版本安裝依賴並執行單元測試。

## Fork 並 clone TicketBay

Fork 是把專案複製到自己的 GitHub 帳號；之後可以在自己的副本推送分支或開 Pull Request。以下指令會建立工作目錄，並 fork、clone TicketBay：

<!--image:1-->

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L181-L183 -->

```bash
mkdir -p <DEV_DIR> && cd <DEV_DIR>
gh repo fork dmoka/ticket-bay --clone
cd ticket-bay
```

請將 `<DEV_DIR>` 換成要存放專案的資料夾路徑。完成後，確認遠端設定：

<!-- derived -->

```bash
git remote -v
```

使用 `gh repo fork` 時，`origin` 應指向自己的 `github.com/<你的帳號>/ticket-bay`，`upstream` 則指向 `dmoka/ticket-bay`。如果資料夾已經存在，就不必再次 clone；直接查看該資料夾的遠端設定即可。如果已經有 TicketBay 的 fork，`gh repo fork` 會沿用它並 clone。

## 切換到 Node.js 22

在專案目錄中使用 nvm，依照 `.nvmrc` 切換 Node.js 版本：

<!--image:2-->

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L197-L198 -->

```bash
nvm use
```

第一次使用這個版本時，先執行：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L198-L198 -->

```bash
nvm install
```

TicketBay 指定使用 Node.js 22。如果找不到 `.nvmrc`，你的 fork 可能早於 2026 年 9 月 29 日；請先從上游更新：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L199-L199 -->

```bash
git pull upstream main
```

## 安裝依賴並執行單元測試

在 `<DEV_DIR>/ticket-bay` 目錄執行：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L204-L205 -->

```bash
npm ci
npm run test:unit
```

`npm ci` 會依照 `package-lock.json` 安裝指定版本的依賴，通常需要一兩分鐘。若看到 npm 提醒有新版，或出現 `npm audit` 通知，先忽略即可；不要更新 npm，也不要執行 `npm audit fix`，以免改動專案使用的 lock file。

## 確認測試通過

當 `npm run test:unit` 結束時，摘要應顯示每個測試檔都已通過，且沒有 `failed`。這就是第一個可重現的綠燈 baseline。

<!--image:3-->

如果出現看起來不尋常的語法錯誤或程式崩潰，先確認 Node.js 版本：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L212-L212 -->

```bash
node --version
```

版本應為 22。若 `npm ci` 表示 lock file 與 `package.json` 不一致，可能是 `package.json` 被改過；可以還原這兩個檔案：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L213-L213 -->

```bash
git checkout package.json package-lock.json
```

有了這個綠燈 baseline，最後一步是把課程要用的 skills 裝進這個專案。
