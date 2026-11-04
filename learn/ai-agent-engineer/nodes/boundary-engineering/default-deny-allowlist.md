# 像攻擊者那樣檢查 box

box 的邊界由幾個檔案拼起來，其中網路那一段可以直接讀規則來驗證。

執行 AI coding agent 時，你可能會想保留每一步的確認提示。

但如果 agent 在 box 裡已經有完整的操作權限，真正的安全邊界就不是提示，而是 box 能讀取哪些檔案、能連上哪些網路，以及裡面有哪些憑證。

檢查 box 時，可以先問自己：如果裡面的程式不照預期行動，它實際上能碰到什麼？

## 先看網路的預設規則

`default-deny` 的意思是預設拒絕所有對外連線，再明確放行工作所需的網域。

`init-firewall.sh` 的規則會先列出白名單，再把輸出流量的預設政策設為 `DROP`。只有目的地符合白名單的流量才能通過。

<!--image:1-->

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

白名單應該盡量精簡。

工具確實需要連到某個主機時，再把該主機加入白名單。

不要因為一次連線失敗，就開放整個網路。

## 用幾個實際測試確認邊界

在 box 裡開啟 shell：

<!-- derived -->

```text
./box bash
```

接著檢查檔案和網路。這些測試無法證明 box 絕對安全，但能確認幾項重要限制確實生效：

<!--image:2-->

- 執行 `whoami`，確認目前使用的身分。
- 執行 `ls ~/.ssh/id_*`，確認找不到私密金鑰。
- 執行 `ls /Users`，確認 box 看不到 Mac 上的使用者家目錄。
- 執行 `curl https://example.com`，預期連線會被防火牆阻擋。
- 執行 `npm ping`，預期會收到 `PONG`，表示 npm registry 在白名單內。

這些結果表示，box 可以連到工作需要的服務，但不應因此能任意連上外部網路，也不應直接讀取主機上的私密金鑰或家目錄。

有一個例外需要留意：某些設定可能會刻意把額外資料以唯讀方式掛載到 box，例如供 agent 使用的 deploy key 資料夾。

因此，檢查時不能只看 `~/.ssh` 是否存在，也要確認裡面沒有不該交給 agent 的私密金鑰。

## box 有權限，不代表它能使用主機的所有權限

box 的設計是先劃出邊界，再讓 Claude Code 在邊界內免除逐步核准。agent 使用 `--dangerously-skip-permissions`，安全性依靠的是 box 的檔案與網路限制，而不是每次操作前跳出的確認提示。

<!--image:3-->

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/box#L1-L9 -->

```bash
#!/usr/bin/env bash
# box: work inside the sandbox (.devcontainer/) from the terminal, no editor needed.
#   ./box                  start the box if needed, then run Claude Code inside it
#   ./box <command...>     run any command inside the box, e.g. ./box npm run test:unit
#   ./box --docker [...]   the same box on its own Docker engine (a Colima VM that shares only
#                          this repo, and your brain settings read-only), so Testcontainers and
#                          the UI tests run inside it. macOS only: the VM uses Apple's virtualization.
# Inside the box Claude Code runs with --dangerously-skip-permissions: the box is the safety
# (only this repo, default-deny network). See .devcontainer/README.md for what it does not do.
```

因此，驗證時要檢查限制本身，而不只是確認程式有沒有詢問你。

提示注入仍可能影響 agent 的行為。

如果 repo 本身有惡意內容，也可能竊取容器內能取得的資料，包括你放進容器的憑證。

憑證需要另外管理：只提供這次工作需要的 token，限制用途與 repo 範圍，並盡量使用短效憑證。

不要因為東西放在 box 裡，就認為可以把所有祕密都放進去。

## 使用 Docker 時，還要檢查外層

如果 box 能透過 Docker socket 啟動其他容器，新的容器可能繞過 box 自己的防火牆。

因此，還要確認承載 box 的引擎 VM 是否也設有網路限制：腳本會在 VM 的 `DOCKER-USER` 鏈上，針對 box 的 IP 套用 `box-egress` 集合。

<!--image:4-->

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/box#L58-L72 -->

```bash
# The engine VM's own firewall (init-firewall.sh --engine), once per VM boot or box IP: with the
# socket, the box can start containers that skip the box's firewall, so the VM limits them all.
if [ -n "${profile:-}" ]; then
  app="$(docker ps -q --filter "label=devcontainer.local_folder=$repo_root" --filter "label=devcontainer.config_file=$repo_root/.devcontainer/docker/devcontainer.json")"
  box_ip="$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$app")"
  if ! colima ssh -p "$profile" -- sudo iptables -C DOCKER-USER -s "$box_ip" -m set --match-set box-egress dst -j RETURN 2>/dev/null; then
    image="$(docker inspect --format '{{.Config.Image}}' "$app")"
    if ! fw_log="$(docker run --rm --network host --cap-add NET_ADMIN --cap-add NET_RAW --user root \
      --entrypoint /usr/local/bin/init-firewall.sh "$image" --engine "$box_ip" 2>&1)"; then
      echo "$fw_log" >&2
      echo "box: could not set the engine VM's firewall (see the log above)." >&2
      exit 1
    fi
  fi
fi
```

這是額外一層防護，不代表可以忽略 box 本身的設定。

使用 `./box --docker` 時，應確認相關引擎防火牆能成功設定。

如果設定失敗，腳本會顯示錯誤並停止，不會默默繼續。

最後，box 的檔案與網路限制只是整體安全邊界的一部分。

工作出錯時，可以用 Git 還原檔案，再依照原本設定重建 box。

選擇 repo 也很重要：只在信任的專案上執行 agent，並且不要帶入不必要的憑證。

檢查完 box 做得到的事，最後要看它做不到的事。
