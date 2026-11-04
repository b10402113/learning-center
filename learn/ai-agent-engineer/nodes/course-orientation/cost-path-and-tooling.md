# 你的機器、你的帳號、測試全綠

知道要跑哪些模組檔案之後，開始實作前還有兩個問題：不清楚哪些費用是必要的，也不確定電腦、帳號和工具是否都已準備妥當。先選好要使用的範圍，再依序設定，最後逐項檢查環境。

## 先選費用路徑

費用會變動，選方案前請查看官方價格頁面。價格核對日期為 2026 年 9 月 29 日。

<!--image:1-->

| 路徑 | 適用範圍 | 需要準備 |
|---|---|---|
| **Minimum** | Modules 1–7 | Claude Pro 或以上訂閱。Claude Code、skills、hooks、subagents、MCP servers、auto mode、cloud sessions、routines 和 Gmail connector 都包含在內。 |
| **Full** | Modules 1–8 | Minimum 的全部項目，另需一台可持續開機的機器，以及 Hermes 使用的模型登入方式。 |
| **Free** | 免費工具與服務 | GitHub、Git、Node、GitHub CLI、所需套件，以及指定的測試帳號或服務。免費路徑無法取代 Modules 1–7 所需的 Claude 訂閱。 |

Claude Pro 的使用量有 5 小時時段限制和每週限制，claude.ai 與 Claude Code 共用額度；subagents 和 routines 也會計入用量。Claude Code 在 Pro 上預設使用 Opus，日常工作可以輸入 `/model sonnet` 改用 Sonnet，輸入 `/usage` 查看用量。

遇到額度限制時，可以等候額度重設、啟用用量點數，或升級到 Max 5x。Fable 不需要準備。

Full 路徑的 Hermes 模型登入方式包括透過 Codex 使用 ChatGPT 計畫登入、使用 API key，或使用免費模型。

若要使用第 8.3 課的備援模型鏈，還需要 OpenRouter 點數。付費開源模型只會在主要模型失效時使用，而且可以設定每把 key 的點數上限。一次購買 10 美元點數，也會把免費模型的每日請求上限從 50 提高到 1,000。

Free 路徑所需的服務包括：第 7 課使用的 Gmail 測試信箱、第 7–8 課使用的個人 Discord 伺服器，以及第 8 課可供非商業用途使用的 Tailscale Personal 免費方案。

Docker Desktop 對個人和小型公司免費；較大型公司需要付費方案。Linux 上的 Docker Engine 免費。

第 3 課的 QuickE2E 是選修項目，在 Apple Silicon Mac 上可用本機模型免費執行。其他環境需要 OpenRouter key，每次執行費用低於 0.1 美分。

## 先確認作業系統和專案位置

macOS 需要 13 或更新版本。Linux 的測試環境為 Ubuntu 22.04 以上或 Debian 12 以上。Windows 請使用 WSL 2 搭配 Ubuntu，並在 WSL 裡執行所有工具，包括 Claude Code。

Windows 使用者請把專案放在 WSL 的 Linux 檔案系統，例如 `~/dev`，不要放在 `/mnt/c`；放在 Linux 檔案系統裡速度快得多。完成後，`uname -s` 應顯示 `Darwin` 或 `Linux`。另外，確認 Windows 使用者的 `uname -r` 含有 `microsoft` 或 `WSL2`。

先選好專案位置；預設位置是 `~/dev`。也可以 fork TicketBay，在 GitHub 建立自己的副本。後續的 pull request 會開在你的副本上。

## 安裝 Git、Python 和 jq

macOS 可以執行 `xcode-select --install` 安裝開發工具，也可以用 Homebrew 安裝 Git：`brew install git`。Linux 和 WSL 可執行 `sudo apt-get install -y git curl ca-certificates unzip`。

Git 需要設定提交者姓名和電子郵件。先查看 `git config --global user.name` 和 `git config --global user.email`；如果顯示空白，就設定這兩項資料。若不想在提交紀錄中公開個人信箱，可以使用 GitHub 的 no-reply 地址。

第 5 課的 brain skills 需要 Python 3。用 `python3 --version` 確認版本；Linux 或 WSL 若尚未安裝，可執行 `sudo apt-get install -y python3`。Windows 本身沒有 `python3`，請在 WSL 裡使用。

hooks 會用 jq 讀取輸入。若沒有 jq，hooks 會以「jq is missing」阻擋命令。用 `jq --version` 檢查；Linux 或 WSL 可執行 `sudo apt-get install -y jq`。較新的 macOS 通常已包含 jq，若沒有，可用 `brew install jq` 安裝。

## 安裝 Node 22

TicketBay 使用 Node 22，其他主要版本未經測試。建議用 nvm 管理版本，安裝後執行 `nvm install 22`；也可以從 nodejs.org 安裝 22 版。若使用 nvm，TicketBay 的 `.nvmrc` 會在後續步驟指定專案版本。

如果剛安裝 nvm 後出現 `nvm: command not found`，或接著出現 `node: command not found`，通常是因為 nvm 只會在新的互動式 shell 載入，而代理程式執行的命令不一定使用互動式 shell。可以重新啟動工作階段，或在每個 Node／npm 命令前加上 `. "$HOME/.nvm/nvm.sh" &&`。若 `node --version` 仍顯示其他版本，可執行 `nvm alias default 22`，再開啟新的 shell。

<!--image:2-->

檢查時，`node --version` 應顯示 `v22.…`，`npm --version` 應顯示版本號。

## 安裝並啟動 Docker

Docker 會執行 TicketBay 的資料庫、整合測試，以及開發容器 `./box`。

macOS 和 Windows 請安裝 Docker Desktop，開啟一次並接受使用條款，之後保持執行。Windows 還要在設定中啟用 WSL 2 backend，並開啟 Ubuntu 發行版的 WSL integration。

Linux 請從 Docker 官方 apt 套件庫安裝 Docker Engine。若要不加 `sudo` 執行 Docker，可將使用者加入 docker 群組：`sudo usermod -aG docker $USER`。登出再登入，或重新啟動 WSL／虛擬機，讓群組設定生效；之後也要重新啟動代理程式。

若出現 `Cannot connect to the Docker daemon`，先確認 Docker Desktop 正在執行；Linux 可用 `sudo systemctl start docker` 啟動服務。若看到 `permission denied … /var/run/docker.sock`，通常表示群組權限尚未生效。登出再登入，並用 `id -nG` 確認輸出包含 `docker`。

<!--image:3-->

最後執行 `docker info`，確認沒有錯誤；再執行 `docker run --rm hello-world`，看到 `Hello from Docker!` 就表示基本測試通過。

## 登入 GitHub 和 Claude

安裝 GitHub CLI，命令是 `gh`。macOS 可用 `brew install gh`；Linux 或 WSL 請依 GitHub CLI 官方安裝頁面的方式設定 apt 套件庫後安裝。還沒有 GitHub 帳號的話，可到 github.com/signup 免費建立。

接著在第二個終端機由你親自執行：

<!--image:4-->

`gh auth login --hostname github.com --git-protocol https --web`

命令會顯示一次性代碼並等待核准。打開 `https://github.com/login/device` 輸入代碼並完成核准，然後告訴代理程式已完成。登入後執行 `gh auth setup-git`，再用 `gh auth status` 確認已登入 github.com。

Claude Code 請從官方頁面安裝，建議使用會自動更新的原生安裝程式。若目前使用的代理程式就是 Claude Code，不必重新安裝，只要確認登入狀態。

在終端機輸入 `claude`，選擇 claude.ai 帳號並完成瀏覽器登入。需要使用 Pro 或以上方案。若在 WSL 或 SSH 環境登入，瀏覽器可能會顯示一組代碼，將代碼貼回終端機即可。

如果安裝後出現 `claude: command not found`，請開啟新的終端機，或執行安裝程式提示的 `export PATH=…` 命令。完成後，`claude --version` 應顯示版本；`claude auth status` 應顯示 `"loggedIn": true`，而且 `"authMethod": "claude.ai"`。

## 最後逐項驗收

任何檢查失敗時，先停下來處理，不要跳過。預期結果如下：

| 檢查 | 預期結果 |
|---|---|
| `git --version && git config --global user.email` | 顯示 Git 版本和電子郵件 |
| `node --version` | `v22.…` |
| `python3 --version` | `Python 3.…` |
| `jq --version` | `jq-1.…` |
| `docker run --rm hello-world` | 顯示 `Hello from Docker!` |
| `gh auth status` | 顯示已登入 github.com |
| `claude auth status` | 顯示 `"loggedIn": true` |

環境全部驗收通過後，就可以把 TicketBay 抓下來，跑出第一個綠燈 baseline。
