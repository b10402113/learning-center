---
source: sources/real-engineer/20261116/course/049 Searching For Shallow Modules Solution.en.txt
source_type: text
source_lines: 67
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.2.part.md#L1-L2264
  - cohort-005-project.3.part.md#L1-L202
---

# L1 overview

- 提示語刻意把範圍限在 backend（security 風險最高）並以提升測試覆蓋為目標，因為前端尚無像樣測試套件。
- 第一個候選：`courses.$slug.lessons.$lessonId` 這個 mega file；agent 不只抱怨 any types，還找出真 bug——`submitQuiz` 只檢查是否登入，從未檢查有沒有內容存取權。
- 建議把它 deepen 成 `submitQuizAttempt`，route 只剩兩行：`requireContentAccess` 加上 `submitQuizAttempt`。
- 第二個候選：`access.server.ts` 是 app 最關鍵的 security module，卻零測試、難測試（自己讀 session cookie、呼叫 `resolveCountryRequest`、直接用全域 database），且多數 route 根本沒用它、各自重寫。
- `instructor.$courseId.tsx`、`instructor.$courseId.lessons.$lessonId.quiz.tsx` 的 loader 都自行取 current user id、查 role、判斷非 admin——這是極差 locality：規則一改就得四處追。
- 通過 deletion test 的小 module（如 `lib/notes.ts` 的 `maxNoteLength`，前後端共用）不該刪，因為會把複雜度推回 caller。
- 建議順序：先 quiz 排序與 progress，再做 access core（測試覆蓋回報最大），最後把 instructor routes 搬進 access core。

# L2 detail

- `#L1-L8` — 組出提示語：掃描 codebase、給出可 deletion test 刪除或可 deepen 的 shallow module 候選；特別聚焦後端（security 風險所在）並以逐步提升測試覆蓋為目標，因為此 repo 前端尚無好測試套件。agent 這次沒派 sub-agent，自己探索後就回報清單。
- `#L9-L18` — 候選一：`courses.$slug.lessons.$lessonId` 這個巨大檔案，充斥刻意繞過型別系統的 `any`；agent 順帶找到 bug——`submitQuiz` 只驗證登入、從未檢查內容存取權。建議 deepen 成新 module `submitQuizAttempt`，讓 route 只需 `requireContentAccess` 再 `submitQuizAttempt` 兩行。
- `#L19-L29` — 候選二：`access.server.ts` 被指為全 app 最 security critical 卻沒有測試檔，而且難測（自己讀 session cookie、呼叫 `resolveCountryRequest`、使用全域 database）。更糟的是多數 route 沒用它：`instructor.$courseId` 與 `lessons.$lessonId` 等 route 自己重複同一套步驟——取 current user id、取 user、檢查 role、確認非 admin。
- `#L30-L44` — 舉 `instructor.$courseId.tsx` 與 `instructor.$courseId.lessons.$lessonId.quiz.tsx` 兩個 loader 為證：各自抓 current user id 並完整重寫 authorization。這是極差的 locality——改存取規則得跑遍所有地方。agent 以 deletion test 指出該刪的是這些 inline 副本：複雜度已散在 N 個 caller，漏掉一份就是一個安全洞。
- `#L45-L57` — access 的 deepen 方案：把 `getAccess` 拆成薄的 adapter 與核心函式，核心以 database、user id、course id、當前 country 解析存取。另有清單列出真正通過 deletion test 的小 module，例如 `lib/notes.ts` 的 `maxNoteLength`（前後端共用，刪掉會把複雜度推回 caller）。建議施作順序：quiz 排序與 progress → access core（測試覆蓋回報最大）→ 把 instructor routes 併入 access core。
- `#L58-L67` — 收束：這些是能大幅改善未來 agent run 的實際改進，而找到它們靠的是語言——把「想要的 codebase」描述出來。agent 開始自己找出改進點，代表我們正在 strategic 思考，並把 tactical agent 派去巡 codebase。
