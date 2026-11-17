---
source: sources/real-engineer/20261116/course/076 Running Your Own Coding Agent.en.txt
source_type: text
source_lines: 53
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L21
---

# L1 overview

- 工廠選擇哪個 agent 的單一設定點是 `.sandcastle/common.ts`。
- 該檔指定 `sandcastle.claudeCode`、模型與環境，並被 build、explore、implement 等所有 workflow 共用。
- Sandcastle 支援 Copilot、Claude Code、Codex、OpenCode、Pi 等 harness。
- 換 harness 的四步流程：確認環境變數、改 `common.ts`、改 workflow 安裝步驟、換 workflow 的 key，最後更新 repo secrets。
- 例如改用 API 計費，就把 `claude_code_oauth_token` 全面換成 `anthropic_api_key`；改用 Codex 則改 `sandcastle.codex` 並把安裝步驟改裝 OpenAI Codex。
- 從此之後用 `npm run cherry pick` 而非 `npm run reset`，因為這些設定是要在課程間保留的。
- 完成標準：`common.ts` 指向你要的 agent、workflow 用對環境變數、secrets 有 `factory_pat` 與你的 agent token。

# L2 detail

- `#L1-L6` — 若已用 Claude Code 訂閱並設好 OAuth token 可跳過；本節對象是不用 Claude Code 或用 API 計費的人，要說明工廠在哪裡挑 agent、怎麼改、怎麼換 key。
- `#L7-L11` — 設定的源頭在 `.sandcastle/common.ts`，此處指定 `sandcastle.claudeCode` 並傳入模型與環境；這個 Claude agent 被 build、explore、implement 等多處使用，是唯一需要改 model 與 harness 的地方；Sandcastle 支援 Copilot、Claude Code、Codex、OpenCode、Pi。
- `#L12-L16` — 改成 API 計費的 Claude Code：把 `claude_code_oauth_token` 改成 `anthropic_api_key`，且每個 workflow 都要換；再回 repo secrets 把 secret 換成 `anthropic_api_key` 即可。
- `#L17-L24` — 改用 Codex：把 harness 換成 `sandcastle.codex` 並換成你用的模型；workflow 目前會安裝 Claude Code，要把所有「install Claude Code」步驟改成安裝 OpenAI Codex，並把 `claude_code_oauth_token` 全部換成 OpenAI API key；最後回 repo secrets 加入 OpenAI API key。
- `#L25-L32` — 每個 harness 的流程都一樣：先確認需要哪些環境變數，再改 `common.ts` 的 harness，修 workflow 安裝正確 harness，再修 workflow 使用正確的 key；若 Sandcastle 不支援你要的 agent，可以送 PR 或自行實作 agent provider，穩定且相容就會併入 main。
- `#L33-L36` — 影片下方附上各大 harness 與模型供應商的設定說明；找不到自己的設定就到 Discord 請作者補。
- `#L37-L46` — 接下來改的 repo 設定是要在課程間保留的，所以改用 `npm run cherry pick`：reset 會清掉整個 repo 與既有變更（回到 Claude），cherry pick 只挑該 branch 最新變更並保留現有工作；遇到衝突就請 agent 解 merge conflict。
- `#L47-L53` — 本節結束時應達成：`common.ts` 指向你要的 agent、所有 workflow 用正確環境變數、repo 內不該再出現 `claude_code_oauth_token`（除非你確實用它）、repo secrets 有 `factory_pat` 與你使用的 agent token。
