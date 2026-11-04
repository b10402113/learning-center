# 每次 session 開始，就知道現在的位置

前面四個 hook 都在工作進行中把關；最後一個管的是每次工作開始的那一刻。接手一個專案時，你可能先得確認目前改到哪裡、最近做過哪些變更，以及團隊已經定下什麼決策。若每次都靠自己提醒 AI 助理，偶爾漏掉也不意外：寫在 `AGENTS.md` 裡的規則只是文字，模型不一定每次都照做。

可以把「載入專案現況」交給 hook。Hook 是由 harness（執行 AI 助理的工具環境）在特定事件發生時執行的腳本，不必等模型想起來才做。用在 session 開場時，它可以載入 git 狀態、最近幾筆 commit，以及決策檔，讓每次開始工作都有相同的背景資訊。

## 換 harness，要換對事件名

Hook 腳本要掛在 harness 認得的事件上。以 session 開場載入脈絡為例，Claude Code 使用 `SessionStart`；Hermes 則把這項工作掛在 `pre_llm_call`，而且只在第一輪呼叫時執行。

<!--image:1-->

因此，換了 harness，不能只搬腳本，也要檢查事件名稱和觸發時機。下面是 Hermes 的 hook 設定示例：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/hermes/config-hooks.yaml#L1-L29 -->

```yaml
# The same scripts, registered in Hermes. Merge this `hooks:` block into your profile's
# ~/.hermes/config.yaml. Official reference: https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks#shell-hooks
# Copy the scripts to ~/.hermes/agent-hooks/ first (Hermes runs hooks on the host, not in the sandbox;
# on a Docker backend, run the test/typecheck commands inside the sandbox — see the M8 guide).
hooks:
  pre_tool_call:
    - matcher: "terminal"                                # 1 · block dangerous commands
      command: "~/.hermes/agent-hooks/block-dangerous.sh"
      fail_closed: true
    - matcher: "read_file|write_file|patch|terminal"     # 2 · keep secrets out
      command: "~/.hermes/agent-hooks/protect-secrets.sh"
      fail_closed: true
    # bonus A · protect the test config. Off by default: it also blocks the hook, CI and test-config
    # changes you ask for. Uncomment when the setup is done (see "Turn on bonus hook A" in the README).
    # - matcher: "write_file|patch|terminal"
    #   command: "~/.hermes/agent-hooks/protect-test-config.sh"
    #   fail_closed: true
  pre_verify:                                            # fires when the agent edited code and wants to finish
    - command: "~/.hermes/agent-hooks/test-gate.sh"      # 3 · the test gate
      timeout: 300
    - command: "~/.hermes/agent-hooks/fast-feedback.sh"  # 4 · checks the edited files (at finish, not after every edit)
      timeout: 120
  pre_llm_call:
    - command: "~/.hermes/agent-hooks/session-context.sh" # 5 · first turn only (the script checks is_first_turn)
# Bonus B (notify) is not needed: Hermes already reports to your chat.
# Hermes SKIPS a shell hook until you consent to it (a warning in ~/.hermes/logs/errors.log, nothing on screen).
# Approve once, after the model login: hermes chat --accept-hooks -q 'reply with: ok'  (writes ~/.hermes/shell-hooks-allowlist.json;
# without a model login, Hermes exits before it writes it).
# Then check: hermes hooks list shows each hook "✓ allowed". Same as the M8 guide, Step 9.
```

設定完成後，Hermes 的 shell hook 還需要先取得使用者同意；可以用 `hermes hooks list` 檢查 hook 是否顯示為 `✓ allowed`。如果改用 Docker sandbox，也要留意 hook 腳本是在主機上執行，測試與型別檢查則需安排在 sandbox 內執行。

Hermes 也能用 `post_tool_call` hook，在特定工具呼叫後發送通知。以下範例是在領取支援信件後發出通知，屬於另一種用途：

<!--image:2-->

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/notify-picked-up.py#L1-L49 -->

```python
#!/usr/bin/env python3
"""Hermes post_tool_call hook for <AGENT_NAME> (terminal tool; runs on the host, outside the sandbox).
When a run claims a support email with `support-inbox claim-next`, post ONE fixed line to Discord:
"🎫 Picked up a bug report: <subject>. Working on it."
Why a hook: Hermes gives cron agents no messaging tool, so the agent itself cannot post.
The webhook URL lives in ~/.config/agent-notify/webhook (mode 600, never mounted into the sandbox), so the
model can neither read it nor post through it. Only the email's subject leaves, cut to 100 characters.
Never blocks: always exits 0 and prints nothing."""
import json, re, sys, urllib.request
from pathlib import Path

WEBHOOK_FILE = Path.home() / ".config/agent-notify/webhook"
NAME = "<AGENT_NAME>"


def main():
    try:
        p = json.load(sys.stdin)
    except Exception:
        return
    if p.get("tool_name") != "terminal":
        return
    cmd = (p.get("tool_input") or {}).get("command", "")
    if "support-inbox" not in cmd or "claim-next" not in cmd:
        return
    res = (p.get("extra") or {}).get("result", "")
    try:
        out = json.loads(res).get("output", "") if isinstance(res, str) else (res or {}).get("output", "")
    except Exception:
        out = str(res)
    if not re.search(r"^claimed \S+", out, re.M):
        return
    m = re.search(r"^subject\t(.*)$", out, re.M)
    subject = (m.group(1) if m else "a new email").strip()
    subject = re.sub(r"[`*_~|>@]", "", subject)[:100]
    url = WEBHOOK_FILE.read_text().strip()
    body = json.dumps({"content": f"🎫 Picked up a bug report: {subject}. Working on it.",
                       "username": NAME, "allowed_mentions": {"parse": []}}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json",
                                                          "User-Agent": "agent-notify"})
    urllib.request.urlopen(req, timeout=8).read()


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
```

## Pattern guard 有用，但不是防護牆

Hook 也能用來擋住明顯的危險操作，或檢查檔案、測試結果。不過，這類設定常是 pattern check：它能攔下符合特定模式的情況，卻可能被改寫成變數或藏進檔案的指令繞過。

<!--image:3-->

所以，pattern guard 適合縮小出錯的機會，不適合取代人工檢視或 CI 檢查。把 session 開場脈絡交給 hook，則能少靠模型記住提醒，讓每次開始時都先看見專案目前的狀態。
