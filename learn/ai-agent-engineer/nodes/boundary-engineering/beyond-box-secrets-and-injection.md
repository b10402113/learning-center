# 盒子沒有做的事

知道盒子怎麼限制檔案與網路之後，還要看清它的極限。

把 AI 程式代理放進隔離的開發環境後，它就能不必每一步都等你批准。這時很容易以為，有了盒子，裡面發生的事就都安全了。

但盒子只劃出一道有限的邊界。它主要限制代理能看到哪些檔案，以及能連到哪些網路位置。盒子外還有幾件事，得由你把關。

## 盒子管得到檔案和網路

在盒子裡，代理可以對工作目錄執行命令，但不應該看得到你電腦上的其他資料。舉例來說，檢查 `~/.ssh/id_*` 時，應該找不到 SSH 私鑰；列出電腦上的使用者家目錄時，也不應該看到你的 Mac 家目錄。

<!--image:1-->

網路連線則由允許清單限制。未列入清單的網站可能無法連線，但工作需要的服務可以放行。例如，測試連到 `example.com` 會被防火牆擋下，`npm ping` 則能連線，因為 npm 在允許清單內。

所以，盒子不是「完全斷網」，而是只允許連到指定的網路位置。允許清單應保持精簡，需要哪個工具時，再加入相應的主機。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/box#L1-L77 -->

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
set -euo pipefail

# Compose v5 builds with buildx bake, which stops at the generated Dockerfile and asks for --allow=fs.read: skip that check.
export BUILDX_BAKE_ENTITLEMENTS_FS=0

CLI="@devcontainers/cli@0.89.0"   # pinned devcontainer CLI
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
config=()

if [ "${1:-}" = "--docker" ]; then
  shift
  [ "$(uname -s)" = Darwin ] || { echo "box --docker: runs on macOS only. On Linux or WSL, run Claude Code outside the box for this task: Testcontainers then uses your own Docker Engine." >&2; exit 1; }
  repo_root="$(cd "$repo_root" && pwd -P)"   # the path the VM shares: no symlinks
  command -v colima >/dev/null || { echo "box --docker: needs Colima. Install it: brew install colima" >&2; exit 1; }
  profile="${BOX_DOCKER_PROFILE:-ticketbay-box}"
  # The brain settings folder (module 5) the box mounts read-only: the VM shares it read-only too.
  mkdir -p "${BOX_BRAIN_CONFIG:-$HOME/.config/brain}"
  BOX_BRAIN_CONFIG="$(cd "${BOX_BRAIN_CONFIG:-$HOME/.config/brain}" && pwd -P)"
  export BOX_BRAIN_CONFIG
  if ! colima status "$profile" >/dev/null 2>&1; then
    echo "box: starting the Colima VM '$profile' (shares only $repo_root, and $BOX_BRAIN_CONFIG read-only)..." >&2
    # --activate=false and --ssh-config=false: your default Docker context and ~/.ssh/config stay as they are.
    if ! vm_log="$(colima start "$profile" --vm-type vz --cpus 4 --memory 4 --disk 40 \
      --mount "$repo_root:w" --mount "$BOX_BRAIN_CONFIG" --mount-inotify --activate=false --ssh-config=false 2>&1)"; then
      echo "$vm_log" >&2
      echo "box: could not start the Colima VM (see the log above)." >&2
      exit 1
    fi
  fi
  export DOCKER_CONTEXT="colima-$profile"
  "$repo_root/.devcontainer/docker/check-engine.sh"
  BOX_DOCKER_GID="$(colima ssh -p "$profile" -- stat -c %g /var/run/docker.sock)"
  export BOX_DOCKER_GID
  config=(--config "$repo_root/.devcontainer/docker/devcontainer.json")
fi

if ! docker info >/dev/null 2>&1; then
  echo "box: Docker is not running. Start Docker Desktop (or your Docker daemon) and try again." >&2
  exit 1
fi

# Start the box (fast no-op when it is already running). Output only on failure.
if ! up_log="$(npx --yes "$CLI" up --workspace-folder "$repo_root" ${config[@]+"${config[@]}"} 2>&1)"; then
  echo "$up_log" >&2
  echo "box: could not start the dev container (see the log above)." >&2
  exit 1
fi

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

if [ "$#" -eq 0 ]; then
  set -- claude --dangerously-skip-permissions
fi
exec npx --yes "$CLI" exec --workspace-folder "$repo_root" ${config[@]+"${config[@]}"} "$@"
```

## 盒子不會替你保管秘密

API token、部署金鑰等憑證，不會因為代理在盒子裡執行，就自動受到保護。只要盒子裡的代理或程式讀得到憑證，惡意內容就可能利用它們。

<!--image:2-->

因此，只提供完成工作所需的憑證，並盡量使用短效、權限限定在單一儲存庫的 token。也只在你信任的程式碼儲存庫中執行代理。

有些環境會在盒子裡登入代理服務。這時要記得，登入憑證也在盒子的範圍內，不能把盒子當成秘密保險箱。

## 盒子不會替你復原所有變更

如果代理改壞工作檔案，可以用 Git 還原；如果開發環境本身出問題，可以依照環境設定重新建立盒子。這就是盒子提供的復原方式。

<!--image:3-->

但復原環境不等於撤回所有外部影響。盒子裡如果有可用的憑證，惡意程式碼仍可能碰到它們。因此，還原檔案和重建盒子都不能取代憑證管理。

## Prompt injection 仍然會進來

Prompt injection（提示注入）是藏在文字或程式碼中的指令，試圖讓代理忽略原本的要求，改做別的事。盒子不會自動辨認或消除這類指令，代理仍可能讀到它們。

<!--image:4-->

盒子的作用，是限制代理在環境內能接觸的檔案和網路，不是保證代理不會受騙。惡意儲存庫也可能利用盒子裡已有的憑證。代理在盒子內擁有完整權限，只代表它能在盒子劃定的範圍內自由操作，並不代表風險消失。

因此，應先用檔案與網路隔離建立安全邊界，再讓代理在邊界內工作。不要把每次跳出的核准提示當成主要防線。盒子外的憑證、使用哪個儲存庫，以及出問題後如何復原，仍要由你負責。
