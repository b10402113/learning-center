# /quiz skill：頭目戰出題判答

Type: task
Status: ready-for-agent
Parent: `.scratch/learning-climb/spec.md`

## What to build

新 skill `/quiz <subject>[/<tier>]`——`/grilling` 的知識驗證變體，共用「逐題、來回、判答」節奏，但替換「設計決策樹」為「知識驗證」，不做決策樹、不寫入任何檔案。

流程：出題前先問型態（選擇題／簡答題／混合）與題數 → 讀該 tier 的 path 文章、其 `nodes` 陣列的 node 全文、相關 edges、與對應 digest L2 → 出題（選擇題＋簡答題，每題附 `[[sources/...]]` 溯源）→ 學習者作答 → AI 判答並逐題給解釋 → 達門檻（全對或設定值）即指示學習者在 app 中把該 tier 標為解鎖。範圍可以是單一 tier，學習者隨時可打未鎖定的頭目；未通過的題目可重新嘗試或重抽。

## Acceptance criteria

- [ ] `/quiz <subject>[/<tier>]` 可指定 tier 範圍，也支援不帶 tier（全 subject）
- [ ] 出題前詢問型態（選擇／簡答／混合）與題數
- [ ] 出題範圍 = 該 tier paths + nodes + 相關 edges + digest L2，每題有來源溯源
- [ ] 逐題判答並給解釋；未通過可重試或重抽該題
- [ ] 通過後指示「在 app 中把 tier N 標為解鎖」
- [ ] 不寫入任何檔案（考卷每次即時生成、不落盤）

## Reference files

- [ ] `.claude/skills/grilling/SKILL.md`
- [ ] `docs/reference/source-reading.md`
- [ ] `AGENTS.md`（Skills 段落）
- [ ] `.scratch/learning-climb/spec.md` Implementation Decisions（quiz skill）

## Blocked by

02 — 前端進度 UI：node 完成標記 + tier 鎖定/頭目戰解鎖
