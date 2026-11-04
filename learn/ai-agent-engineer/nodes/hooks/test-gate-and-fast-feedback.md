# Test gate 與 fast feedback

secret 與測試設定擋住之後，還有另一種情況：agent 自認做完了，但測試其實沒過。你可能遇過這種情況：agent 說「測試都通過了」，但它只跑了改動附近的測試，專案其他地方仍亮著紅燈。也可能等到工作快結束，才一次看到一堆型別錯誤。

可以用兩個 hook 把檢查提早接回工作流程：在 agent 要結束時跑測試；每次修改後，立刻回報型別錯誤。這兩個 hook 都在指定事件自動執行，不必再靠 agent 記得文字規則。

## Stop：結束前先過測試門檻

`Stop` hook 會在 agent 表示要完成時執行測試。測試通過，就讓它結束；測試失敗，就把錯誤訊息送回 agent，要求它修正後再試。

<!--image:1-->

在 Claude Code 的 hook 設定中，可以把 `Stop` 事件接到測試腳本：

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L170-L181 -->

```json
"Stop": [
{
"hooks": [
{
"type": "command",
"command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/test-gate.sh",
"timeout": 600
},
...
]
}
]
```

測試門檻應使用夠快、適合反覆執行的測試指令。範例預設是 `npm run test:unit`，也可透過 `TEST_CMD` 換成專案自己的快速測試指令。

失敗時，hook 會把測試輸出的一段內容帶回 agent 的脈絡，並說明不能在測試仍失敗時完成。通過時則不額外回報，避免把不必要的訊息塞進對話。

## 三輪逃脫閥：避免卡在永遠修不好的測試

測試可能因環境問題或其他原因一直無法通過。若每次失敗都無限阻止 agent 結束，它就可能陷入反覆嘗試。

`MAX_ROUNDS` 用來限制紅燈後的重試輪數。預設設為三輪：前三次測試失敗時，hook 把結果送回 agent；達到上限後，允許 agent 停止，並提醒你自行確認測試。這是逃脫閥，不代表測試已通過。

<!--image:2-->

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L185-L200 -->

```bash
TEST_CMD=${TEST_CMD:-"npm run test:unit"}

# your fast test command

MAX_ROUNDS=${MAX_ROUNDS:-3}

# after this many red rounds, let it stop and tell you

...
out=$(bash -c "$TEST_CMD" 2>&1)
if [ $? -eq 0 ]; then rm -f "$counter"; exit 0; fi
...
jq -n --arg t "$(tail -c 3000 <<<"$out")" --arg c "$TEST_CMD" \
'{decision: "block", reason: ("The tests are red (" + $c + "). You may not finish until
they pass. Fix the code. Change a test only if the requirement changed, and say why. ...")}'
```

另一種實作也能在 agent 要結束時執行測試，並將失敗結果送回 agent：

<!-- source: sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/verify-tests.sh#L1-L41 -->

```bash
#!/usr/bin/env bash
# Hermes pre_verify gate for <AGENT_NAME> (course M8: the stop signal it cannot fake).
# Fires when the agent edited code and wants to finish. If the edit is inside a task
# worktree (~/dev/wt/<WT>) of a repo with an `npm run test:unit` script, run that suite
# in the sandbox container. Red -> keep the agent going with the failure tail
# (Hermes caps this at agent.max_verify_nudges, default 3) and keep the worktree.
# Green -> remove the worktree (the branch and the PR stay): the gate owns that cleanup,
# so the worktree still exists when the gate runs. Out of scope -> silent.
# Every run is logged to ~/.hermes/logs/verify-tests.log.
export DOCKER_HOST="${DOCKER_HOST:-unix:///run/user/$(id -u)/docker.sock}"
LOG="$HOME/.hermes/logs/verify-tests.log"
log() { printf '%s %s\n' "$(date '+%F %T')" "$*" >> "$LOG"; }
payload=$(cat)
# Without jq the gate reads no changed path and skips the tests: send the agent back instead
# (plain JSON, no jq needed; Hermes caps the nudges at agent.max_verify_nudges).
command -v jq >/dev/null || { log "unit tests NOT run: jq is missing"; echo '{"action": "continue", "message": "verify-tests: jq is missing on the host: install it (see the setup guide). The unit tests did not run. Tell the human, and do not say the tests pass."}'; exit 0; }
# Only edited SOURCE files count; review notes (.pr-review/) and docs do not.
path=$(jq -r '[.extra.changed_paths[]? | select(test("/\\.pr-review/") | not) | select(test("\\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|java|cs|php|rb)$"))][0] // empty' <<<"$payload")
[ -z "$path" ] && exit 0
path=${path/#\/workspace\/dev/\/home\/agent\/dev}
case "$path" in /home/agent/dev/wt/*/*) ;; *) exit 0 ;; esac
wt=$(cut -d/ -f1-6 <<<"$path")   # /home/agent/dev/wt/<WT>
attempt=$(jq -r '.extra.attempt // 0' <<<"$payload")
# Exit 1 = Hermes logs a WARNING with this text (agent.log, errors.log) and lets the agent finish.
fail() { log "$wt: unit tests NOT run: $1"; echo "verify-tests: $wt: unit tests NOT run: $1" >&2; exit 1; }
[ -d "$wt" ] || fail "the worktree is gone (removed before the final answer?)"
root=$(git -C "$wt" rev-parse --show-toplevel 2>/dev/null) || fail "host git cannot read it (git >= 2.48?)"
jq -e '.scripts["test:unit"]' "$root/package.json" >/dev/null 2>&1 || exit 0
box=$(docker ps -q --filter name=hermes- | head -1)
[ -z "$box" ] && fail "no running sandbox container"
out=$(docker exec "$box" sh -c "cd '$root' && npm run test:unit 2>&1" 2>&1)
if [ $? -eq 0 ]; then
  log "$root: unit tests run: GREEN (attempt $attempt)"
  main=$(git -C "$root" rev-parse --path-format=absolute --git-common-dir)
  git -C "${main%/.git}" worktree remove --force "$root" >/dev/null 2>&1 \
    && log "$root: worktree removed" || log "$root: worktree NOT removed"
  exit 0
fi
log "$root: unit tests run: RED (attempt $attempt), agent sent back"
jq -n --arg t "$(tail -c 2500 <<<"$out")" \
  '{action: "continue", message: ("The unit tests are RED (npm run test:unit). You may not finish until they pass. This is a bug fix, so the existing tests describe the wanted behavior. Fix the code, not the tests. Commit, and push again if the branch is already pushed. Output tail:\n" + $t)}'
```

因此，agent 結束時要分清楚兩件事：測試通過，表示門檻放行；三輪後停止，只表示不再無限重試，仍需要你檢查。

## PostToolUse：每次修改後及早回報型別錯誤

`PostToolUse` hook 可在 agent 使用 `Edit`、`Write` 等工具修改檔案後執行。fast feedback 的做法是立刻跑型別檢查，只整理剛改動檔案相關的錯誤，再把結果交回 agent。

<!--image:3-->

例如，專案可用 `npx tsc --noEmit` 作為預設型別檢查指令，也能透過 `TYPECHECK_CMD` 自訂；若需要，也可設定選用的 `LINT_CMD`。檔案篩選則由 `EXT_RE` 指定。這樣 agent 可以在剛犯錯時修正，而不是累積到最後才面對一大批問題。

## 把兩種回饋接成一個流程

`PostToolUse` 負責修改後的快速檢查，讓型別錯誤及早回到 agent；`Stop` 負責完成前的測試門檻，防止它只憑判斷就宣稱工作完成。

<!--image:4-->

設定時先換成適合專案的快速測試與型別檢查指令，再確認 hook 會把失敗原因送回 agent。三輪逃脫閥則保留人工接手的空間：如果測試一直紅，agent 最多反覆處理三輪，之後由你確認原因；hook 不能取代程式碼審查或 CI。
