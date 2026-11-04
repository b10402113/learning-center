# 擋下危險指令

`AGENTS.md` 裡最該變成 gate 的規則，通常跟「不要做某件危險的事」有關。你把任務交給程式代理人，回頭一看，它準備執行 `rm -rf`、強制推送，或刪除資料庫。只在 `AGENTS.md` 寫「不要做這些事」不一定管用：文字規則可能被忽略。阻擋型 hook 則是在指令執行前由執行環境自動檢查，符合條件就直接拒絕。

## 在指令執行前攔下它

Claude Code 的 `PreToolUse` 事件會在工具呼叫前觸發。把 hook 設在 `PreToolUse · Bash`，就能在 Bash 指令交給 shell 執行前檢查它。

第一個阻擋型 hook 可以先針對幾種明確的危險操作：`rm -rf`、強制推送，以及刪除資料庫。檢查到符合條件時，hook 以結束碼 `2` 阻擋呼叫，並把理由寫到標準錯誤輸出（stderr）。代理人會讀到這段理由，再改走其他路徑；阻擋不代表代理人當掉了。

<!--image:1-->

理由要說清楚怎麼改，而不只是說「不允許」。例如，攔下刪除操作時，可以要求代理人先確認目標，改用不會直接刪除資料的方式處理。這樣代理人收到的是可採取的下一步，而不是一個沒有解釋的拒絕。

另一個終端代理環境的範例，則用 `exit 2` 和 stderr 理由攔下環境變數輸出、讀取憑證檔案及直接使用網路工具等指令。它不是 Claude Code 的 `block-dangerous.sh`，但可以看出阻擋時如何回傳理由，讓代理人知道哪些替代做法可用。

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

## 安裝並接上 hook

課程套件提供了 `block-dangerous.sh`，負責檢查上述危險指令。安裝時，先把 hook 腳本放進專案的 `.claude/hooks/`，並確認它有執行權限；接著將對應的 `PreToolUse` hook 設定合併到 `.claude/settings.json`。如果專案已經有 hook 設定，保留原有項目，再加入這個 hook。

<!--image:2-->

執行環境需要 `bash`、`jq` 和 `git`。其中 `jq` 用來讀取傳給 hook 的工具輸入；如果缺少它，套件中的阻擋型 hook 會全面阻擋呼叫，並提示 `jq` 不存在。安裝後檢查設定中有 `PreToolUse`，再開啟新的 Claude Code 工作階段，讓 hook 載入。

## 先用測試確認它會阻擋

可以先把一段模擬的工具輸入送給腳本，確認 `rm -rf` 會得到預期的結束碼：

<!--image:3-->

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L42 -->

```bash
   echo '{"tool_input":{"command":"rm -rf build"}}'        | .claude/hooks/block-dangerous.sh;    echo "exit $?"   # expect 2
```

這個測試只確認指定案例能被攔下，不代表所有危險寫法都會被辨識。這類 hook 通常是依照文字樣式比對指令；若代理人把指令組合在變數或檔案裡，可能繞過檢查。因此，把它當成減少常見失誤的關卡，而不是萬無一失的防線，仍要保留人工檢查與 CI 測試。危險指令擋住之後，下一個常見的漏口是 secret。
