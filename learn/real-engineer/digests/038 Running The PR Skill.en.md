---
source: sources/real-engineer/20261116/course/038 Running The PR Skill.en.txt
source_type: text
source_lines: 29
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 練習用 `npm run create PR` 依某個 commit 建出 draft PR。
- PR 有 base branch（要合併進去的目標）與 PR branch（帶入額外 commit），也列得出 files changed。
- 剛建好的 PR 沒有 body，所以要拿 PR 編號請 agent 依 diff 重寫 PR body。
- 要確認 agent 讀得到 PR skill 的 md 檔，通常會自動被撿起、不必手動 invoke。
- 驗收重點：能否用 pseudocode 讀懂 diff、證據是否證明改動有效、Merge Danger 是 one-way 還是 two-way。
- PR skill 是作者自己的偏好版本，鼓勵學員依自身流程調整。

# L2 detail

- `#L1-L7` — 執行 `npm run create PR`，會依 commit 建 PR；示範時已存在而詢問是否覆蓋，同意後得到「seed bookmarks notes diff」的 draft PR。
- `#L8-L14` — 說明 PR 的結構：新建的 base branch 是合併目標，PR branch 帶著要合入的額外 commit；files changed 可像真實 repo 的 PR 一樣檢視。
- `#L15-L21` — 目前缺 PR body；請學員抄下 PR 編號（示範為 34），到 agent 裡要求依 diff 重寫 body，並確認 PR skill 的 md 檔可被讀到。
- `#L22-L29` — 驗收清單：用生成的 pseudocode 與描述理解 diff、檢查 evidence 是否證明有效、看 Merge Danger 判斷 one-way 或 two-way door，再思考如何替自己的流程改進；強調目標是速度與判斷需要多少 review。
