---
source: sources/real-engineer/20261116/course/065 Writing A Custom Lint Rule Solution.en.txt
source_type: text
source_lines: 29
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- prompt 明確要求：找出 `courses.tsx` 的漏洞、防止再犯、但不禁止 `sql.raw` 本身。
- 要的是一條高度針對性的 lint 規則：禁止把動態字串傳進 `sql.raw`。
- agent 很快找到漏洞，並在 lint rules 資料夾建立自訂規則。
- 規則程式碼看似複雜（要分辨 literal、template literal、member expression、identifier 等 AST 節點），但實際極短、token 效率很高。
- 這次只花了 38k tokens 就完成規則。
- `npm run lint` 會標出違規，訊息很實用：`sql.raw` 只接受靜態字串，動態值請走會參數化的 SQL template tag。
- 修掉漏洞後，正常搜尋 Kubernetes 仍失敗（正確），而注入字串也不再能撈出隱藏課程。
- 結論：只要問題能「光看程式碼就偵測」，自訂 lint 規則就非常適合。

# L2 detail

- `#L1-L9` — 下 prompt：`courses.tsx` 有安全漏洞，要防止再犯、不禁止 `sql.raw`，而是寫一條高度針對性的規則禁止動態字串傳入；agent 找到漏洞並在 lint rules 資料夾建立規則。
- `#L10-L19` — 規則程式碼複雜（需理解 literal / template literal / member expression / identifier 等差異），但撰寫起來極精簡、token 效率高；這次花 38k tokens；`npm run lint` 會標示違規，錯誤訊息為「`sql.raw` only accepts a static string, pass dynamic values through the SQL template tag, which parameterizes them」。
- `#L20-L29` — 請 agent 修掉漏洞：正常搜尋 Kubernetes 依然找不到（正確），注入字串也不再能繞出隱藏課程；自訂 lint 規則最適合「光看程式碼就能偵測」的問題，而 retro 很擅長判斷某規則該留在 automated review 還是能轉成這種創意型 automated check。
