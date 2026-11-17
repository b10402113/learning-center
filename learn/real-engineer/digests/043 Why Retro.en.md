---
source: sources/real-engineer/20261116/course/043 Why Retro.en.txt
source_type: text
source_lines: 53
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L16
---

# L1 overview

- human review 的第三個目的（前兩個是速度與優先度）：順便改進「產出程式的系統」。
- 核心準則：不要對同一個問題留第二次評論——每則評論都該沉澱進系統。
- 因此 human review 同時改進程式、automated review 與 automated checks（本節先做 automated review）。
- 安裝用 `npm run cherry-pick add retro skill`（用 cherry pick 而非 reset，避免丟掉 PR 裡的好東西）。
- Retro skill 是對 coding session 做 retrospective，替 agent 環境提出改進建議。
- 檢視面向：coding standards（含 `CODING_STANDARDS.md` 與全域 `AGENTS.md` 的精簡）、tool economy、automated checks、navigation。
- 可針對單一 session，也可「看最近 25 個 session」；harness 會把 session 存成本機檔案供回溯。
- agent 通常默默承受糟糕的環境，定期 retro 常讓人訝異環境有多差。

# L2 detail

- `#L1-L6` — 承接前面兩個 lens（速度、優先度），點出第三件事：做 human review 時不只要確認程式做對，也要思考如何改進產出程式的系統，而這也有對應 skill。
- `#L7-L19` — 核心心法：翻 diff 時要找「下次可以事先提醒 agent」的模式，並想著喜歡什麼、不喜歡什麼；理想是「絕不對同一個問題留第二次評論」，每則評論都回饋進系統；因此 human review 要同時改善程式、automated review 與 automated checks，本節先聚焦 automated review。
- `#L20-L31` — 安裝指令 `npm run cherry-pick add retro skill`（刻意用 cherry pick，不用 reset，以免丟掉 PR 中的成果）；產出 retro/skill.md，描述為「對 coding session 做 retrospective，替 coding agent 環境提出改進建議」；它會依分類尋找改進候選，首先看 coding standards——哪些能變成標準、如何改善。
- `#L32-L44` — 具體檢視範圍：`CODING_STANDARDS.md` 與全域 `AGENTS.md`（能否精簡）、tool economy（agent 用的自訂基礎設施能否簡化）、automated checks 與 navigation（課程後面會談）；可用於單一 session，也可要求看最近 25 個 session；原理是 harness 會把 session 寫成本機檔案，retro 讀取 agent 當時看到的原始內容找改進點。
- `#L45-L53` — agent 通常默默忍受糟糕的設定、不會主動抱怨，所以需要定期檢視並判斷哪些有用、哪些該改；作者說定期跑 retro 常讓他驚訝自己的 agent 環境有多糟、機會有多少，並預告馬上實作。
