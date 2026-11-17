---
source: sources/real-engineer/20261116/course/067 Mutation Testing Solution.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L214
---

# L1 overview

- 第一輪（只做 diff hunk）：`comment-markdown.server.ts` 的 mutation score 從 55.56% 升到 100%，全部 mutant 被殺，含 agent 呼叫只花 51 秒。
- 報告在 `reports/mutation/mutation.html`，可看到變異的檔案、行數與型態。
- 典型 mutant：`&&` 換成 `||`、換成 `true`/`false`、`startsWith` 換成 `endsWith`、字串內容改動。
- 放大到整個檔案後：31 個 surviving、35 個 killed，暴露出真正的測試缺口（comment langs、safe link protocols、getHighlighter）。
- 修完後 mutation score 從 50% 升到 90%，新增的測試包含各語言語法高亮、highlighter 失敗時的處理、`&` 跳脫、保留 HTTP / mailto / 相對連結。
- 這些不是湊數的測試，每個都真的測到行為；甚至發現了原本沒想過的 bug。
- mutation score 的定位是「給 agent 的資訊」，不是 deterministic 閘門；作者沒有追求 100%。
- 若真要設線，可以考慮 90% 或 85% 為下限；執行位置建議放在 agent 自己跑的 verification checks，不佔 pre-commit、不拖慢流程，也有人選擇 100% 加上 CI。

# L2 detail

- `#L1-L9` — 執行 `test:mutation`；mutation skill 只在讀報告時觸發（描述寫明「use after run npm run test:mutation」）；結果全數 mutant 被殺，`comment-markdown.server.ts` 分數 55.56%→100%，51 秒內完成含 agent 呼叫。
- `#L10-L21` — 檢視 `reports/mutation/mutation.html`：可看到被變異的檔案、精確行號，並篩選出 killed；所有變異都在改動的 hunk 內，型態包括 `&&`→`||`、改成 `true`、改成 `false`、`startsWith`→`endsWith`、字串內容變更。
- `#L22-L37` — 為了看更大規模的示範，改對整個檔案跑 mutation：出現 31 個 surviving（comment langs、safe link protocols、getHighlighter 等紅點）與 35 個 killed；報告列出真正缺口，要求修補。
- `#L38-L53` — 修補後分數 50%→90%；新增測試涵蓋語法高亮（多語言）、highlighter 失敗時的處理（原本沒想到的 bug）、`&` 跳脫、保留 HTTP / mailto / 相對連結；作者強調這些是真測試而非垃圾測試，且並未追求 100%。
- `#L54-L71` — 定位：mutation testing 是給 agent 的資訊性輸入（informational input），不是會讓輸出失敗的 deterministic 檢查；若要設門檻可考慮 90% 或 85%；執行時機建議放進 agent 自己的 verification checks，不當 blocker、不佔 pre-commit；也可自行調高到 100% 並放 CI；總結它是改善測試品質的極佳 feedback loop。
