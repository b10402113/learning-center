---
source: sources/real-engineer/20261116/course/044 Trying Out Retro.en.txt
source_type: text
source_lines: 27
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 練習：對「促成 PR 34 的所有 session」跑 retro，並額外要求抓下所有 PR 評論。
- 作法是在 GitHub 對實際 diff 留行內評論，讓 retro 能在本機讀到。
- 這是真正的人工審查，但重心在流程而非程式本身。
- 太偏實作細節的評論要刪掉；要找的是能寫進 coding standards、變成規則的點。
- 這對領域專家最有效，但非專家也可藉機讀懂程式，有疑問就問 teach skill。
- 流程：做一輪簡短人工審查 → 留評論 → 跑 retro 讓它吸收全部內容。

# L2 detail

- `#L1-L10` — 設定任務：對所有產生 PR 34 的 session 跑 retro，並加上「grab all the PR comments too」；示範在 GitHub 對 diff 留行內評論（例如把某處改成用 bookmarks），這樣 retro 才能在本機讀到這些意見；強調這是真正的人工審查，但重點在流程。
- `#L11-L21` — 篩選評論：太偏程式與實作細節的留言要刪掉，要找的是能沉澱進 coding standards、變成「不必再留第二次」的規則；這對天天看 code 的領域專家最有幫助，但即使不是專家，也可藉此理解程式在做什麼，遇到疑問就問 crash course 學過的 teach skill。
- `#L22-L27` — 收尾指示：做一次簡短人工審查，挑出 retro 可轉成 coding standards 的評論，再執行 retro，讓它接收所有成果，看看會給出什麼。
