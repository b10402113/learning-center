---
source: sources/real-engineer/20261116/course/075 Setting Up Secrets And Permissions.en.txt
source_type: text
source_lines: 79
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L5
---

# L1 overview

- `npm run reset add factory workflows` 把整組 workflow（explore、implement、review、update branch）放進 `.github/workflows`，每個 YAML 內有大量註解說明。
- Workflow 需要兩個 secret：模型供應商的 token，以及 factory PAT（factory personal access token）。
- 必須用 factory PAT 而非預設 GITHUB_TOKEN，因為預設 token 刻意不能觸發另一個 action，而工廠的核心正是 action 串 action。
- Factory PAT 是 fine-grained token，只授權單一 repo，權限給 actions、issues、pull requests、contents、workflows 皆 read and write。
- Secret 名稱必須是 `factory_pat` 與 `claude_code_oauth_token`，大小寫與底線都要完全一致。
- 模型 token 用 `claude setup-token` 取得一年期 token；token 很長，貼上時要避免夾帶換行。
- GitHub workflow 一律從 default branch 執行，測試前要 reset、push 到 main。
- 觸發方式是 label，因此誰能貼 label 就是安全邊界：預設需 triage 以上角色；public repo 建議把 issue 與 PR 建立限為 collaborator。

# L2 detail

- `#L1-L8` — 用 `npm run reset add factory workflows` 拉進工廠所有 workflow，放在 `.github/workflows`；從 explore、implement、review 到 update branch，每個 YAML 內都有大量註解解釋其用途。
- `#L9-L22` — 先設 secret：部分 workflow 需要 claude code oauth token 與 factory pat；以 agent implement 為例，觸發條件是有人在 issue 貼 label，希望 implement 完成後自動觸發 review，而預設 GITHUB_TOKEN 絕對做不到「觸發另一個 action」——GitHub 是刻意防無限迴圈，但那正是工廠要的。
- `#L23-L36` — 到 personal settings → developer settings → personal access tokens → fine-grained tokens → generate new token；命名 cohort factory token、90 天到期、只選 cohort 005 專案；權限給 actions（read/write）、issues、pull requests（皆 read/write）、contents（讓 agent 能 push）、workflows（讓 agent 能改自己的 workflow），其餘 no access。
- `#L37-L40` — 回專案 settings → secrets and variables → actions → repository secrets，新增 `factory_pat`（必須完全一致的底線與大小寫），貼上 token 後 add secret。
- `#L41-L46` — 第二個 secret 是與模型供應商通訊的 token：本機執行時登入即可、狀態留在本機，但遠端伺服器需要環境變數攜帶 token；不同 harness 與供應商做法不同。
- `#L47-L57` — Claude Code 訂閱者執行 `claude setup-token` 取得為期一年的長效 token，照 URL 登入並貼上 code；回傳的 token 極長，可能超出終端寬度，複製時務必避免夾到換行；存成 `claude_code_oauth_token` 後，repo secrets 就有它與 `factory_pat`。
- `#L58-L61` — GitHub workflows/actions 一律從 default branch（此處是 main）執行，測試時要先 reset 到該 branch、push 到 main 再玩。
- `#L62-L76` — 安全提醒：既然靠 label 觸發，就要知道誰能貼 label；預設只有 triage 以上角色能貼，網路上的路人不行；作者對非真開源的 public repo 會把 issue 建立與 PR 建立都限為 collaborators only，避免 stray agent 灌爆 issue 或送出大量爛 PR。
- `#L77-L79` — Repo 設定完成；若不用 Claude Code 訂閱或改用其他 agent，就看下一節。
