---
source: sources/real-engineer/20261116/course/069 Diagnosing Bugs.en.txt
source_type: text
source_lines: 35
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.5.part.md#L1-L393
---

# L1 overview

- 診斷 bug 是資料源最關鍵的場合之一；本課引入 `diagnosing-bugs` skill，一套處理難 bug 的紀律。
- 該 skill 的理論是建立 feedback loop，可用 failing test、HTTP script、CLI invocation 等多種形式搭建。
- 這個 loop 成敗的關鍵只有一個：它有沒有拿到對的資料。
- 種下的 bug：頂部 select 打不開（底部可以），左下角的 dark mode toggle 也失效。
- 可查的資料源之一 dev server：agent 自己跑 `npm run dev` 看日誌，但這裡完全沒線索。
- 也可以硬讀程式碼找，但作者明說錯誤其實在 browser console（agent 目前沒有存取權）。
- 練習指示：只描述症狀、假裝不知道原因，並提示去看 browser console；agent 應自動觸發 diagnosing-bugs skill，並在提示下創意地追查。
- 目標是體會「拿到正確資料」有多重要，同時換得一套找 bug 的紀律，順便修好 bug。

# L2 detail

- `#L1-L9` — 診斷 bug 是資料源最關鍵的場景；`diagnosing-bugs` skill 是一套針對難 bug 的紀律，核心是建立 feedback loop，可用 failing test、HTTP script、CLI invocation 等各種方式搭建；但整個 loop 的成敗取決於是否取得正確的資料。
- `#L10-L27` — 種下的 bug：頂部 select 無法開啟（底部正常）、dark mode toggle 失效；可用的資料源之一是 dev server——agent 能自己跑 `npm run dev` 看日誌，但此處毫無可用資訊，也可以硬讀程式碼去找，但線索其實在它尚未能存取的 browser console（右鍵 inspect 可見錯誤）；練習提示只描述症狀、假裝不知原因，並指示往 browser console 找。
- `#L28-L35` — 預期 agent 自動觸發 diagnosing-bugs skill，在提示下創意搜尋；本課要展示正確資料的重要性、提供一套找 bug 的紀律，並順帶修好這個 bug。
