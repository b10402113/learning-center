---
source: sources/real-engineer/20261116/course/066 Mutation Testing.en.txt
source_type: text
source_lines: 65
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L214
---

# L1 overview

- 測試是核心 automated check：驗證 runtime 行為、抓回歸；問題是如何確保測試本身不腐化。
- 答案之一是 mutation testing：同時看測試套件與程式碼，衡量真正能擋下 bug 的覆蓋程度。
- 運作方式：先跑一次測試取得基準，再「變異」程式（例如把 `===` 反向、`+` 換成 `-`），重跑測試。
- 測試沒變紅＝mutant survived（存活），代表測試沒抓到這個改動；測試變紅＝mutant killed。
- 原則是「殺光所有 mutant」；存活代表測試有缺口。
- 但 mutation testing 非常慢，跑整個 codebase 可能要數小時，因為反覆重跑測試。
- 因此只做 staged 檔案，並且更進一步只變異實際改動的 hunk，速度才可接受（但仍是最慢的檢查）。
- 工具是 Stryker（stryker.js）；command 走 `npm run reset … --unstaged`，讓本地有可測的變更。
- 作者稱它是「對自己測試套件最誠實的評分系統」，agent 很難作弊；因為 agent 一開始看不懂報告，還用 retro 做了一個 mutation testing skill。

# L2 detail

- `#L1-L11` — 測試是必要的 automated check（驗 runtime、抓 regression），但如何維持測試品質？除了 automated review 與 human review，還有 automated check 可用：mutation testing，它同時看測試與程式碼，找出潛在 bug 能否溜過。
- `#L12-L29` — 原理：以 `range` 函式為例，先跑測試取 baseline，再變異程式（`===` 反向、`+` 改 `-`）並重跑；測試沒失敗就是 surviving mutant，代表測試沒覆蓋這個改動；測試失敗則是 killed。目標是殺光所有 mutant。
- `#L30-L41` — mutation testing 極慢，跑整個 codebase 可能數小時；因此只做 staged 檔案，且只變異實際改動的 hunk，兼顧速度（仍可能是最慢的檢查）；但它提供極高價值的資訊，是作者見過對測試套件最誠實的評分方式，agent 很難作弊。
- `#L42-L57` — 實作：`npm run reset … --unstaged` 後 `npm install`；新工具是 Stryker.js；`package.json` 有新的 `test:mutation` script；另加了一個 mutation testing skill 教 agent 讀報告，因為實測時 agent 不知如何處理報告，於是用 retro 生成這個 skill。
- `#L58-L65` — 練習任務：跑 mutation 腳本並修掉所有 surviving mutants，在 ship 到 production 前改善 codebase 與測試品質，最後應該留下一些測試改進。
