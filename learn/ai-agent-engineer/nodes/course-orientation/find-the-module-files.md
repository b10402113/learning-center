# kit 裡有什麼

知道 course kit 是四種材料之一後，準備重跑課程中的某個步驟時，常會遇到兩個問題：該找哪個檔案？手上的版本是不是已經過期？可以先用 kit 的 `README.md` 找到模組檔案，再查看 `CHANGELOG.md` 和檔案中的驗證日期。

## 先用 README 找檔案

README 的「What's in the kit」表格列出模組、檔案、用途，以及目前是否收錄。kit 目前列出的項目如下：

<!--image:1-->

| 模組 | 檔案 | 用途 |
|---|---|---|
| M0 | `m0/setup-guide.md` | 準備工具、登入帳號、TicketBay fork 與課程 skills |
| M1 | `m1/map.md` | 一頁查看課程的七個層次，以及各模組的對應內容 |
| M1 | `m1/reset-rules.md` | 四個 context 習慣 |
| M1 | `m1/box-setup.md` | 啟動 TicketBay 的開發容器 `./box`，並執行檢查 |
| M2 | `m2/five-hooks/README.md` | Claude Code 與 Hermes 使用的五個 hooks 和兩個 bonus hooks |
| M6 | `m6/add-mcp-server/` | 替自己的 app 新增 MCP server 的 skill |
| M7 | `m7/routine-guide.md` | 用 Claude Code 建立從 email 到 pull request 的例行流程 |
| M8 | `m8/hermes-guide.md`、`m8/config-pack/` | Hermes 指南與設定檔套件 |

清單沒有列出 M3、M4、M5 的 kit 檔案，因此不要只憑模組編號推測檔案路徑。kit 會隨工具變動更新；要取得新版，請到課程頁下載新的 ZIP。

## 重跑前，比對兩個日期線索

找到目標檔案後，先看該指南或 skill 裡的 **Last verified** 欄位，可用來確認最後驗證日期與工具版本。這個日期比整份 kit 的更新日期更能對應到要重跑的內容。

<!--image:2-->

接著打開 `CHANGELOG.md`，從最新的項目往下找目標檔案。CHANGELOG 最新紀錄的日期是 **2026-10-21**。例如，這次更新記錄了 M8 Hermes 指南依 Hermes v0.22.3 檢查後的調整，也更新了 M0 設定指南、M2 hooks 和 M8 config pack 的內容。

CHANGELOG 的最新日期不代表每個檔案都在那一天重新驗證。先核對目標檔案自己的 Last verified 日期與工具版本，再查看後續是否有相關變更紀錄；如果有，就依新版指南重跑。

檔案找到、版本也確認過後，接著要決定花多少錢、並把機器上的工具裝齊。
