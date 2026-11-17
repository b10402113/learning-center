---
source: sources/real-engineer/20261116/course/071 Verifying Frontend Apps.en.txt
source_type: text
source_lines: 45
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.5.part.md#L1-L393
---

# L1 overview

- 上一課證明接上新資料源很強大，這課再接一個：agent-browser。
- `AGENTS.md` 新增 agent-browser 區塊；它可從終端機驅動真實瀏覽器。
- agent-browser 本質上是 Playwright 的薄包裝，提供 `open`、`snapshot`、`click`、`fill`、`get text`、`screenshot` 等指令。
- 加進 repo 等於給 agent 眼睛：能看見頁面內容、驗證自己的成果。
- 對前端應用而言，有無這項能力差距「誇張地大」；作者形容像換了更強的模型。
- 設定刻意做成「AGENTS.md 裡的 context pointer」指向詳細文件，而非直接丟官方 docs，好處是可寫入本專案專屬知識，也讓 retro 有地方沉澱經驗。
- 要修的舊 bug：切換使用者後，選單面板不會關閉，點面板外也關不掉，只能回到 switch user 關。
- 這類細微的視覺互動幾乎無法從程式碼判斷，在瀏覽器裡點一下卻很明顯；等於讓 agent 更能同理使用者。
- 練習要求：修好並開 PR，且 PR 必須附上修復前後的截圖作為 evidence。

# L2 detail

- `#L1-L11` — 接上第二個資料源：`AGENTS.md` 中的 agent-browser 區塊，可從終端機驅動真實瀏覽器；它是 Playwright 的薄包裝，提供 `open`、`snapshot`、`click`、`fill`、`get text`、`screenshot`；等於給 agent 眼睛，讓它能看頁面、驗證工作。
- `#L12-L25` — 對前端應用而言差異極大，作者形容像換了模型；設定方式是在 `AGENTS.md` 放一個指向詳細文件的 context pointer，讓 agent 使用前先讀，好處是能寫入專案專屬知識，也讓 retro 有地方沉澱 agent-browser 的經驗。
- `#L26-L37` — 要修的老 bug：切換使用者後面板不關閉，點面板外也關不掉，只能回到 switch user；這類細微視覺互動幾乎無法從程式碼看出，在瀏覽器操作卻很明顯，因此等於給 agent 更好的使用者同理。
- `#L38-L45` — 計畫：描述 bug 讓 agent 修（可能用也可能不用 diagnosing-bugs），並要求開 PR；PR skill 要求 evidence，可用截圖呈現修復前後，讓人一眼看出已修好，同時強迫 agent 自我驗證並降低 human review 負擔。
