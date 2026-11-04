# 每個專案的三個 server

上一段說 MCP 讓 agent 看見 repo 外的實際狀態；實際落地時，一個專案通常從三個 server 開始。要請 AI agent 幫忙改網頁時，你可能會遇到兩種問題：它引用了舊版套件的用法，或是猜錯頁面實際呈現的樣子。MCP server 能讓 agent 連上專案以外的工具，讀取文件、操作瀏覽器，或查看頁面錯誤，而不必只靠記憶或你的描述。

server 提供工具給 agent 使用；agent 選擇工具後，由執行環境呼叫它。以下三種 server 分別處理不同需求。

## 三種 server，各自解決一種問題

- **Context7**：查詢你使用的程式庫文件與版本，減少 agent 按照舊版文件寫程式的情況。
- **Playwright**：操作瀏覽器，例如點擊、填寫表單和截圖，方便確認頁面是否正確呈現。
- **Chrome DevTools**：連接正在執行的瀏覽器，讀取主控台錯誤和頁面結構，省去手動複製錯誤訊息的往返。

簡單來說：需要查套件文件時用 Context7，需要操作頁面時用 Playwright，需要查看瀏覽器裡的錯誤或結構時用 Chrome DevTools。

<!--image:1-->

## 用 project scope 加入專案

若要讓同一個專案的協作者使用相同設定，可以用 project scope 加入 server。以 Playwright 為例：

<!-- derived -->
```bash
./box claude mcp add --scope project playwright -- \
npx @playwright/mcp@0.0.83 --browser chromium
```

這種設定會寫入專案根目錄的 `.mcp.json`。把檔案提交到版本控制後，其他人複製專案也能取得相同的 server 設定。Claude Code 會在新增專案 server 時要求核准一次。

<!--image:2-->

## 只加會用到的工具

每個 server 都會把工具名稱加入 agent 的工作環境。工具太多，尤其是功能相似的工具，agent 就更容易選錯。依照專案實際需求選用 Context7、Playwright 或 Chrome DevTools，保持清單精簡即可；但清單該怎麼取捨，值得單獨看一次。
