# 工具 · MCP

你請 agent 加一個功能，它照著記憶寫出 API 呼叫，卻用錯了套件版本；或者它說頁面應該正常，實際打開瀏覽器卻發現畫面跑版。問題在於，agent 只靠 repo 裡的程式碼和既有資訊，未必知道外部系統現在的狀態。

MCP（Model Context Protocol，模型上下文協定）讓 agent 連上 repo 以外的系統，例如瀏覽器、套件文件、資料庫或 GitHub。MCP server 提供工具，agent 可使用的工具會列給模型；模型選擇呼叫工具後，再由執行環境負責執行。

MCP 是開放標準，同一個 server 可以用在 Claude Code、Codex 和 Cursor。對 agent 來說，差別在於它不必憑記憶猜：它可以查到你使用的套件版本文件、檢查網頁實際呈現的樣子，或讀取瀏覽器主控台中的錯誤。

## 讓 agent 看見實際狀態

不同 MCP server 能提供不同資訊。例如：

- **Context7**：取得專案所用套件版本的文件，降低 agent 寫出舊版 API 用法的機會。
- **Playwright**：操作瀏覽器、點擊頁面、填寫表單並截圖，讓 agent 檢查頁面是否正常呈現。
- **Chrome DevTools**：連接正在執行的瀏覽器，讀取主控台錯誤與頁面結構。

這些工具補上的，是 agent 原本看不到的「現在」。它不只是根據程式碼推測頁面，而是能實際操作瀏覽器；也不只是從印象中拼湊 API，而是能查閱對應版本的文件。

<!--image:1-->

## 把專案共用的 server 設定留下來

如果某個 MCP server 是專案成員都會用到的，可以用專案範圍設定，讓設定寫入 repo 根目錄的 `.mcp.json`。把檔案提交後，其他人複製 repo 時也會取得相同設定。Claude Code 會在新增專案 server 時要求一次核准。

<!--image:2-->

例如，加入 Playwright server 的指令如下：

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L347-L349 -->

```shell
./box claude mcp add --scope project playwright -- \
npx @playwright/mcp@0.0.83 --browser chromium
```

設定會記錄在 `.mcp.json`：

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L355-L365 -->

```json
{
"mcpServers": {
"playwright": {
"type": "stdio",
"command": "npx",
"args": ["@playwright/mcp@0.0.83", "--browser", "chromium"],
"env": {}
}
}
}
```

## 工具不是越多越好

每個 server 都會把工具名稱加入每次工作階段。完整工具定義則會等 agent 使用時才載入；但相似工具一多，模型更容易選錯。因此，只連接專案實際會用到的 server。

也要依照需求選工具：

<!--image:3-->

- 需要一套操作流程或專案知識，例如「如何部署」：用 **skill**。
- 需要操作的系統有好用的命令列工具，例如 GitHub、雲端服務或 Kubernetes：用 **CLI**，讓 agent 在 shell 裡執行。
- 需要讀取即時狀態，但沒有合適的 CLI，例如瀏覽器、SaaS API，或使用受管理驗證的資料庫：用 **MCP server**。

若 server 會在隔離環境中下載內容，也要把下載所需的主機加入該環境的允許清單。知道 MCP 補上的是「現在」之後，下一個問題是：一個專案最常接上哪幾個 server？
