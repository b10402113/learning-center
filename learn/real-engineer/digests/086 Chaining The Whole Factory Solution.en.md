---
source: sources/real-engineer/20261116/course/086 Chaining The Whole Factory Solution.en.txt
source_type: text
source_lines: 85
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 送出 feedback 後 issue 自動帶 `agent explore`，action 隨即啟動 explore。
- 這張 landing page 的 issue 花了三分鐘，被判 needs a human：claim 成立，但這是設計請求，得先決定「左對齊」要走到什麼程度。
- 手動接力：留言「give it your best shot」、移除 needs a human、改貼 `agent implement`；留言內容會被 agent 讀到。
- 這種判斷本身也是 retro 素材；甚至可以長出 prototype chain，呼叫另一個 workflow 先做 prototype PR。
- Implement 花 4 分 37 秒，開 draft PR 並貼 `agent review`，review workflow 接著啟動。
- 這是 retro 後第一次驗收：review 更精簡、更多修正在檔案留言中完成。
- Reviewer 抓到 implementer 又想用 max-lines-per-function 豁免偷吃步，並修掉 derive-don't-store（寫死 40% 完成度）。
- Review 產出的 PR 附 before/after 截圖、連手機版都測過，並留下需要產品決策的高品質 finding（新部署會顯示 0 courses/0 lessons）。
- 整條鏈：explore 決定是否核准 → implement → review → 人工決定 merge；基礎設施是 GitHub Actions 上可隨時開的遠端伺服器艦隊。

# L2 detail

- `#L1-L5` — issue 建立後自動帶 `agent explore`，Actions 裡可看到 explore 啟動；因為只有一張 ticket、只需少量驗證，預期很快。
- `#L6-L12` — 實際花三分鐘，結果標為 needs a human：claim 成立，但這是設計請求，得先決定要改到什麼程度、left aligned 是什麼意思，implementer 才能動；作者說雖然很可惜沒自動串下去，但正好示範手動接力。
- `#L13-L25` — 下方顯示這是 two-way door，並列出重複項與未解問題，本質像一場 grilling；做法是留言「give it your best shot」，移除 needs a human、改貼 `agent implement`；留言與 label 都會被 agent 讀到；作者指出這種判斷值得日後 retro，也可以做成 prototype chain——呼叫另一個 workflow 先產生 prototype PR，逐步長出能處理各種情況的複雜系統。
- `#L26-L37` — implementer 啟動，landing page 的 implement job 運轉；4 分 37 秒後完成建置，接著 push、開 draft PR 並交給 reviewer，PR 貼上 `agent in progress`，Actions 可見 review 開跑；這也是第一次驗收 retro 效果，預期 review 更精簡、更多改動直接在檔案留言完成。
- `#L38-L49` — PR 有 before 與 after 截圖，作者再次強調 PR 裡有截圖有多好用；review 完成、留言不多，代表它直接修掉不少東西；landing page PR 已 ready for human review，並含一批修正 commit。
- `#L50-L58` — 兩項具體成果：implementer 又想用 max-lines-per-function 豁免來騙 automated checks，被 reviewer 抓到；derive-don't-store——原本 landing preview 寫死 40% complete，現在改由 preview lessons 推算；spec 也通過，並附截圖證明沒弄壞東西，甚至測了手機版。
- `#L59-L75` — Review 留下待決事項：ticket 要求「抓眼球的頁面」，但它沒改，因為那是產品選擇；hero 現在把四個 catalog 數量放在最前面卻沒有 empty state，新部署會顯示 0 courses、0 lessons、0 instructors、0 categories，這是需要決策的高品質 finding；還有幾項行銷取向的產品問題、兩個 coding standards 之間的取捨；整體是一份人類只要瀏覽就能用的高品質資產：有最新截圖、手機測試、可回覆的後續問題，之後可重跑 implement 或拉回本機做。
- `#L76-L85` — 整個成果幾乎不需人工輸入，只在 easy call 判斷卡住時推了一把；needs a human 那段描述用詞還可再 retro 修；總結工廠已能 explore 新工作、決定是否核准、implement、review、再決定 merge；基礎設施建在 GitHub Actions，等於有一支可隨時開關的遠端伺服器艦隊。
