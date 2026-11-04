# box 就是邊界，像攻擊者那樣檢查它

想讓 agent 半夜自動執行，第一個念頭通常是：「保留權限提示不就好了？」但這行不通。每做一件事都問你一次，你最後只會一路按同意，提示也就失去作用。

另一種做法，是把邊界設在 box 外面，讓裡面的 agent 全速執行，不必再詢問你。

`./box` 的運作方式就是如此。它會建立一個 dev container，只掛載這個 repo，並且只開放少數白名單上的外連。接著在裡面啟動 Claude Code，並帶上 `--dangerously-skip-permissions`。安全性由 box 本身負責，不是靠你按下同意。

## box 負責兩件事，另外兩件得自己處理

四個邊界中，box 只負責檔案和網路。檔案方面，它只能看到這個 repo。網路方面，它只能連到白名單上的位置。剩下兩件事得由你自己處理。

秘密方面，只提供 agent 完成工作所需的 token。token 效期要短，scope 也只開一個 repo。

重置方面，如果它把東西弄壞了，可以用 git 還原檔案，也可以依照 recipe 重建 box。這就是使用 dev container、而不是手動調整過的機器的原因。重新開始的成本應該接近零。

<!--image:1-->

## 白名單只有五個 host，其他一律封鎖

`init-firewall.sh` 的規則很簡單，一眼就能看完。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L1-L10 -->
```bash
# Claude Code (API + sign-in) and the npm registry. Nothing else.
for domain in \
"api.anthropic.com" \
"claude.ai" \
"claude.com" \
"platform.claude.com" \
"registry.npmjs.org"; do
...
iptables -P OUTPUT DROP
iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT
```

第一行是註解，說明白名單的範圍：只包含 Claude Code 的 API 和登入服務，以及 npm registry，沒有其他項目。前四個 host 提供 API 與登入服務，第五個是 npm。

關鍵是後面兩行。`iptables -P OUTPUT DROP` 將 OUTPUT 鏈的預設政策設為 DROP。沒有被後續規則明確允許的外連封包，都會被丟棄。

下一行只允許目的地位於 `allowed-domains` 這個集合中的封包。這不只是擋掉部分連線，而是在 policy 層級設定預設規則：沒有列入白名單的連線，根本無法連出去。

<!--image:2-->

因此，白名單要保持精簡，只有工具真的需要時才加入 host。每多一個 host，agent 就多一個可以向外傳送資料的地方。

如果某個 MCP server 會在 box 裡下載東西，也必須把它使用的 host 加進白名單。否則，這個 server 只是換個方式失敗。

## 像攻擊者一樣檢查 box

要確認的不是「box 有沒有啟動」，而是「邊界有沒有真的擋住連線」。檢查時，要像攻擊者一樣進到 box 裡，試著向外取得東西。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L19-L42 -->
```bash
./box bash

# a shell inside the box

whoami

# node

ls ~/.ssh/id_*

# No such file or directory: no private keys

ls /Users

# your Mac's home folders are not there

curl https://example.com

# blocked by the firewall

npm ping

# PONG: npm is on the allowlist
```

逐項檢查：

- `whoami` 回傳 `node`。你不是 root，也不是你在 Mac 上使用的帳號。
- `ls ~/.ssh/id_*` 回傳 `No such file or directory`。裡面沒有私鑰可以偷，因為私鑰根本不在裡面。
- `ls /Users` 找不到你 Mac 的家目錄。檔案邊界確實有效，不能只換個路徑就繞過去。
- `curl https://example.com` 被防火牆擋下。這項最容易被忽略。網頁看起來無害，但它能證明任何未列入白名單的 host 都無法連出去。
- `npm ping` 回傳 `PONG`。允許的連線必須能通，否則 agent 連套件都裝不了，你可能就會開始亂加 host。

<!--image:3-->

這些項目可以擴充成八項檢查表。Node 版本必須是 v22，unit test 必須通過。`./box claude auth status` 必須是 `"loggedIn": true`。`.claude/skills` 必須列出十個 skill，並包含 `debug-runbook`。`ls ~/.ssh/id_*` 必須失敗，`curl https://example.com` 也必須失敗。`npm ping` 必須回傳 PONG。`git ls-remote` 連到 GitHub 時，必須回傳一個 commit hash。

第八項看起來和「白名單要短」矛盾，其實遵循的是同一個原則。白名單不是固定不變，而是依照工具需求增補。這個 repo 的 box 需要 git，所以白名單中有一個 host 是為 git 加入的。你的 repo 需要什麼，白名單就列出什麼；但每一項都要能說明是哪個工具需要它。

第五項還有一個註記。如果 box 之後會唯讀掛載 brain 的 deploy key 資料夾，`ls ~/.ssh` 可能會成功。判斷標準不是「這個目錄不存在」，而是「它永遠不會列出 `id_*`」。

驗證必須做到這個程度。否則，你可能把正常的 mount 誤判成漏洞，也可能把漏洞當成正常狀況。

## 在引擎那一層也設防

`./box --docker` 使用同一套 box，但改用另一個 engine。它會啟動一臺 Colima VM，只分享這個 repo 和唯讀的 brain 設定。這種做法只適用於 macOS，而且需要 Colima。

多加這一層，是為了處理 socket。box 裡如果能存取 Docker socket，就能在 VM 上啟動新的 container。那些 container 不會繼承 box 自己的 iptables 規則。看起來人在防火牆裡，實際上已經繞過防火牆。

因此，VM 本身也要執行一次 `init-firewall.sh --engine`。每次 VM 開機，或 box 的 IP 改變時，都要再執行一次。在 `DOCKER-USER` 這條鏈上，把來自這個 box 的流量交給 `box-egress` 那組位址判斷。

如此一來，防護範圍就從「container 的 OUTPUT 鏈」擴大到「離開 VM 的每一條路」。Docker socket 也就無法繞過這道邊界。

<!--image:4-->

## box 擋不住什麼

box 不是萬能的。box 裡的 prompt injection 一樣可能成功。惡意 repo 也能偷走 container 裡的任何東西，包括憑證。

box 能做的是限制損害範圍。即使 agent 受騙，能拿走的也只有這個 repo 裡的東西，以及白名單允許它連線的位置。

因此，另外兩條規則很重要：秘密留在 box 外面，而且只在信得過的 repo 上執行這個 box。放進去的每一個 token，都可能在邊界內被拿走。

還有一條：不要把 approval prompt 當成邊界。你需要的是「只設一次邊界，然後讓 box 裡的 agent 全權執行」，而不是「每次執行都問你一次」。前者可以完整驗證；後者只會讓你一路按同意。

## 把驗證清單當成 gate

四條規則都在處理同一件事：

- 邊界只設一次，box 裡就給 full permissions。
- 白名單保持精簡，只有工具確實需要時才加入 host。
- 秘密不放進 box，而且只在信得過的 repo 上執行。
- approval prompt 不是邊界。

每次修改 box 設定，例如新增 host、新增 mount 或修改 Dockerfile，都要重新執行那五個指令。`curl` 如果突然連得通，或 `ls /Users` 突然看得到東西，就不是巧合，而是你剛在邊界上開了一個洞。

這個 gate 不需要 CI。只要在決定「今晚讓它自己跑」之前，花三十秒檢查就好。
