---
source: sources/real-engineer/20261116/course/088 Choosing Your Infrastructure.en.txt
source_type: text
source_lines: 47
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 這一課不 provision 任何東西，只在合理範圍內先「選定」要用的工具或第一個嘗試的選項，好讓後面畫 diagram 時心裡有具體的服務。
- 沿用上一課的優先順序：tracker 與 git host 通常已經有偏好，runner、orchestrator、observability 多半還沒有。
- 透過 `npm run cherry-pick add software-factory` skill 取得共用語彙（run、runner、ticket tracker、git host、orchestrator、observability platform）。
- 該 skill 附帶 reference 文件整理各類產品（CI runner、microvm API、bundled agent platform、bring your own worker），但明言資料不保證最新，只能拿來定位，實際決策仍要主動查證。
- 決策方法是開一場 grilling session，並且要求一次只問一題，因為這種開放題很容易發散。
- 題目設定：tracker 與 git host 已定，只討論 runner、orchestrator、observability；要認真看 pricing 與使用頻率，做出真實水準的決定。

# L2 detail

- `#L1-L12` — 承接上一課的五塊基礎設施，這一課由學習者自己填格子；本節之後都在談工廠「可以做什麼」，所以先把會用到的服務定下來，diagram 才會具體；這一課本身不 provision，只做選擇。
- `#L13-L30` — 沿用「tracker／git host 已有、其他三個還沒有」的優先順序；用 cherry-pick skill 的 software-factory 參考 skill 建立共同語彙，裡面有 git host、observability、runner、ticket tracker 的範例與分類（CI runner、microvm API、bundled agent platform、bring your own worker），並註明資料可能過時，需自行上網確認。
- `#L31-L47` — 實作練習：請 agent「grill me about creating a new /software-factory」，說明要從 GitHub Actions 搬到新基礎設施、先不談新任務只談服務；因為題目太過開放，要求一次只問一題以保持提問精準；solution 會先確定 tracker 與 git host，再推出 runner、orchestrator、observability，並要求把 pricing、使用頻率等真實決策變數帶進來。
