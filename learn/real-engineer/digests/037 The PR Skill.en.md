---
source: sources/real-engineer/20261116/course/037 The PR Skill.en.txt
source_type: text
source_lines: 109
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L89
---

# L1 overview

- human review 要改兩件事：讓 PR 被理解得更快，以及把 review 時間依風險正確排序。
- Agent 寫 PR description 一直很差，PR body 充滿垃圾會讓人不想審。
- 解方是 Dex Horthy／HumanLayer 的 Show Me skill：跳過前言、精簡散文、用視覺化 pseudocode 解釋器。
- PR skill 就是 PR body 的模板：頂部 Summary 借用 Show Me 的視覺化，先講 why。
- Evidence 段落要求 before／after 實證：screenshots 是 S-tier，執行型證據（console、test 結果）是 A-tier。
- Merge Danger 段落用 door × blast radius 決定審查優先度：one-way door 與大 blast radius 必須嚴審，two-way door 加小 blast radius 甚至可不經人工。

# L2 detail

- `#L1-L6` — 兩個改善目標：一是速度，讓 reviewer 盡快理解 PR；二是優先度，並非所有 PR 都值得同等對待。
- `#L7-L19` — 點出 agent 至今仍寫不好 PR description 的痛點；引入 Show Me skill（Dex Horthy, HumanLayer），指示跳過前言、保持精簡、使用視覺化的 pseudocode explainers。
- `#L20-L31` — 說明 pseudocode explainer 好用在哪：看 UI、檔案職責、元件互動、以 mermaid 描述時序、用 diff 呈現呼叫樹變化；刻意調整成 PR 版本，本質只是 PR body 的模板。
- `#L32-L41` — Summary 段等於 Show Me 的內容，重點是盡快傳達 PR 的 why；但速度還有另一半：要確認「對的改動」被做出來，所以要看到硬證據。
- `#L42-L59` — Evidence 段：before（失敗）與 after（成功），before 用來證明原本真的壞了，對 bug fix 與新功能都必要；skill 內也定義了什麼是好證據，screenshots 是 S-tier、執行型證據是 A-tier，讓 reviewer 對改動有基本信心。
- `#L60-L82` — 為何要談 review 優先度；Merge Danger 段的 door 概念來自 AWS：two-way door 可 merge 也可 revert，one-way door 會造成資料遺失、成本、安全影響、寄信給五萬人或 public library 的 breaking change，因此 one-way door 必須審得更細。
- `#L83-L109` — 再加上 blast radius（出錯時的潛在後果），兩個概念合起來決定 PR 的審查優先度；同一專案內比例會不同（個人專案約 95% 是 two-way door，醫療、金融則多為 one-way door），two-way door 加小 blast radius 甚至可只在 main 上審，但前提是 automated checks 與 automated review 先夠紮實。
