---
source: sources/real-engineer/20261116/course/051 Making Legacy Code Testable.en.txt
source_type: text
source_lines: 19
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.2.part.md#L1-L1944
---

# L1 overview

- 在動 authorization 之前先處理「不可測的 date 依賴」：checkout 到 `untestable-date-dependency` 分支，目標是 instructor analytics 頁面。
- 病灶是一個 2,000 行檔案裡的 loader：loader 本身 300 行、零測試、直接呼叫 database、內部還注入 `new Date()`，幾乎沒有把實作拆成函式，全 inline 成一個巨大函式。
- 直接在 loader 上寫測試行不通：它只收 request 與 URL 兩個參數，沒有地方注入 database 與日期。
- 偏好解法是把 loader 縮到極小，把功能外派給 `getInstructorAnalyticsData(database, instructorId, range, tab, selectedCourseId, isAdmin)` 這樣的 module（作者標明是 pseudocode）。
- 本課要真的改 code，目標是提高此區測試覆蓋，讓日後改動更安全。

# L2 detail

- `#L1-L6` — 在修 authentication、把 `access.server.ts` 變深之前先做另一件事：reset 到 `untestable-date-dependency` 分支。問題出在 instructor analytics 頁面：它位在 2,000 行檔案中，loader 本身 300 行、完全沒有測試，而且明顯難測——直接呼叫 database、有一堆本該外移成 deep module 的東西、幾乎沒有拆出函式，全 inline 在一個巨大函式裡。
- `#L7-L13` — 直接在 loader 上寫測試不可行：它需要 request 與 URL 兩個參數，卻沒有地方注入 database；而且它還注入了 `new Date()` 造成的日期依賴（與前一課 `daysSince` 的例子相同）。作者偏好的做法是把 loader 縮到極小、把功能外包給類似 `getInstructorAnalyticsData` 的 module，接受 database、instructorId、range、tab、selectedCourseId、是否 admin——並註明這是 pseudocode，尚未逐一核對參數。
- `#L14-L19` — 任務：用 codebase design 讓 `instructorAnalytics.tsx` 的 loader 可測試，關鍵是加上能注入正確依賴的 seams——可傳入測試 database，也能傳入當前日期；這次要真的編輯程式碼，目標是拉高此區覆蓋率、讓後續改動更安全。作者說這正是他接手 vibe coded codebase 時會做的事。
