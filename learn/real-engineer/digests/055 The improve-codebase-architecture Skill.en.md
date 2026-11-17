---
source: sources/real-engineer/20261116/course/055 The improve-codebase-architecture Skill.en.txt
source_type: text
source_lines: 43
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L202
---

# L1 overview

- 難點在於 codebase design 難以視覺化：講解時能畫圖，實際讀 agent 的原始文字卻沒有圖可循。
- `improve-codebase-architecture` 是作者最受歡迎的 skill 之一，做的是掃描 shallow module，但以視覺化方式呈現。
- 它會明確呼叫 codebase design skill 以取得完整 glossary，因此全程用同一套術語。
- 流程：scope before you scan（先找真正在乎的 hot spot，並讀專案 domain glossary）→ 以 HTML report 呈現候選 → 進入 grill with docs session（呼叫 grilling 與 domain modeling 兩個 skill）。
- domain modeling 之所以必要，是因為併 module、變深時往往得決定命名，順便回饋 glossary。
- 本課已有明確目標：把 `access.server.ts` 當對象跑一次，只看 HTML report 與候選，不改 code；新 module 一律放進 `app/modules`，讓 Dependency Cruiser 守住邊界。

# L2 detail

- `#L1-L13` — 痛點：codebase design 很難視覺化——課堂上作者能畫圖說明，但實際寫 code 或讀 agent 輸出時只有純文字。若能掃描 codebase 時直接看到版面圖會很好。這引出 `improve-codebase-architecture`（作者最愛的 skill 之一、也最受歡迎），它做的是先前找淺 module 的同一件事，但更視覺化；它就放在 main 上。
- `#L14-L28` — skill 內容：它是 user-invocable，用來浮現 architectural friction 並提出 deepening 機會（把 shallow module 變 deep 的 refactor）。它明文要求呼叫 codebase design skill 取得完整 glossary，所以沿用同一套術語；接著探索 codebase，原則是 scope before you scan——先找真正在意的 hot spots，並讀專案的 domain glossary 與一串待答問題。第二步把候選以 HTML report 呈現，讓你視覺化比較後再決定。之後進入 grill with docs session：呼叫 grilling skill 釐清要建什麼，再呼叫 domain modeling skill，因為併 module 時常要決定命名，成果也能回饋 glossary。
- `#L29-L43` — 本課做法：已有明確想法，所以把 improve-codebase-architecture 鎖定在特定 module `access.server.ts`；任務是跑一次、看 HTML report、暫不改 code，只評估選項，或許做點 grilling 與 domain modeling，若有 glossary 變更加以 commit。並提醒所有新 module 都要放進 `app/modules`，因為 deep modules 的邊界已設好，要讓 Dependency Cruiser 發揮作用。
