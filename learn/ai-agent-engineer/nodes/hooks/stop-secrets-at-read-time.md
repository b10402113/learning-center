# 把 secret 擋在外面

危險指令是在執行前攔下；還有一種東西一旦被讀到就已經來不及了。你請 AI agent 幫忙除錯，它說想先讀 `.env`，看看資料庫連線設定。這時要先想一件事：檔案一旦被 agent 讀取，內容就會送到 model provider，不能把這一步當成只在自己電腦裡查看。

因此，可以在工具讀取前加一道檢查：拒絕 `.env` 和 `.env.*`，只放行 `.env.example`。範例檔可提供設定欄位的參考，真正的環境變數則留在 agent 讀不到的地方。拒絕時也要告訴 agent 改看 `.env.example`，讓它知道可以採取什麼替代做法。

## 為什麼只設檔案權限不夠

工具權限規則可以禁止某個工具讀取特定檔案，但同一個檔案可能有不同的讀取路徑。例如，禁止檔案工具讀取 `.env`，不代表也禁止透過 shell 執行 `cat .env`。對 agent 來說，這是不同的工具呼叫。

<!--image:1-->

讀取前的 hook（鉤子）則是在工具執行前檢查呼叫內容，符合條件就阻擋並回傳原因。這樣，檢查不只看檔案工具，也能涵蓋透過命令列讀取檔案的情況。阻擋訊息最好指出不能讀取的檔案，並引導 agent 改用 `.env.example`。

同類的 hook 也可以檢查命令列，阻止輸出環境變數或讀取憑證檔。以下是另一個命令列防護範例：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/guard-network.sh#L1-L42 -->

```bash
#!/usr/bin/env bash
# Hermes pre_tool_call guard for <AGENT_NAME> (terminal tool). Ported from <repo>'s
# .claude/hooks/guard-network.sh (course M2/M7). <AGENT_NAME> has no webhook: Hermes
# delivers results itself, so the agent never needs curl/wget. This is the layer that
# does not depend on the model obeying the prompt. Exit 2 = block, stderr = reason.
block() { echo "Blocked by guard-network: $1" >&2; exit 2; }

# Without jq the guard would read an empty command and let everything through: fail closed.
command -v jq >/dev/null || block "jq is not installed on the host (apt install jq)"
cmd=$(jq -r '.tool_input.command // ""')

# 1. No environment dumps.
if grep -Eq '(^|[;&|( ]|\$\()(env|printenv|export -p|set)([ ;&|)]|$)|/proc/[^ ]*/environ' <<<"$cmd"; then
  block "commands that print the environment are not allowed"
fi

# 2. No reading the secrets the sandbox can see (the gh token, the mail password).
if grep -Eq 'hosts\.yml|gh auth token|/opt/secrets|app-password' <<<"$cmd"; then
  block "reading credential files is not allowed"
fi

# 3. No raw network tools: git, gh and npm cover everything the job needs.
if grep -Eq '(^|[;&|( ])(curl|wget|nc|ncat|telnet)( |$)' <<<"$cmd"; then
  block "raw network tools (curl, wget, nc) are not allowed; use git, gh or npm"
fi

# 4. A literal URL only inside a git / gh / npm / npx command.
if grep -Eq 'https?://' <<<"$cmd"; then
  while IFS= read -r seg; do
    if grep -Eq 'https?://' <<<"$seg" && ! grep -Eq '^[[:space:]]*(git|gh|npm|npx)[[:space:]]' <<<"$seg"; then
      block "a literal URL is only allowed in git, gh and npm commands"
    fi
  done < <(sed -E 's/(&&|\|\||;|\|)/\n/g' <<<"$cmd")
fi

# 5. npm and npx only by name: Hermes's package scanner checks commands that start with npm/npx,
#    so `node …/npm-cli.js ci` or a full path to npm's bin folder skips the scan.
if grep -Eq '(npm|npx)-cli\.js|node_modules/npm/bin/' <<<"$cmd"; then
  block "run npm as \`npm …\` (npx as \`npx …\`), not through npm-cli.js or npm's bin folder"
fi

exit 0
```

## 測試設定要用另一道閘門

測試與 CI 設定也值得保護，但它和 secret 的讀取限制不是同一件事。可另外加一個預設關閉的 hook，阻止 agent 修改測試設定、CI 工作流程與 agent 設定檔，並同時檢查檔案工具和 shell 命令。

<!--image:2-->

可以用範例輸入測試 secret 防護是否會阻擋讀取 `.env`：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L43-L43 -->

```bash
   echo '{"tool_input":{"file_path":".env"}}'               | .claude/hooks/protect-secrets.sh;    echo "exit $?"   # expect 2
```

這道閘門適合用在測試與 agent 設定已經就緒、讓 agent 自行處理工作的情況。若任務本身需要修改這些設定，就要先手動關閉它。否則，agent 可能會為了讓測試通過，改動原本要用來檢查它工作的測試環境。

最後要記得，這類 hook 多半依賴模式檢查，能擋住常見疏忽與明顯的繞法，但不是萬無一失的安全牆。仍要檢查 agent 的變更，並保留 CI 檢查。把該擋的擋住之後，下一個問題是：怎麼讓 agent 自己知道測試紅了。
