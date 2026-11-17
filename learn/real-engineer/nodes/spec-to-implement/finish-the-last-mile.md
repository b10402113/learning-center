# 收尾無人看管的實作 Run：從 Review 修復、補足工具 Skill 到真實帳號 QA

當自動化實作流程跑完、所有工作票（tickets）都順利合併後，任務其實只完成了一半。真正的收尾工作，是要確保程式碼符合標準、把手動操作收攏為可重用的工具與 Skill，並用真實帳號走過端到端的實際驗證。

## 檢查 Review 結果並派遣 Agent 修復

合併完成後，系統會自動執行 Code Review，包含規格審查（spec review）與規範審查（standards review）。

<!--image:1-->

在這次的執行結果中，審查工具抓到了兩項違反 Coding Standards 與術語表（glossary.md）的硬性問題：

- 新增的文案使用了術語表明確標註應避免的用詞。
- 測試輔助函式（test helper）中出現了 `add learner`，且 `seekclaimserver.ts` 的錯誤訊息中包含了 `coupon` 與 `code`。
- 其餘還包含部分程式碼異味（smells）以及些微的規格差異。

審查完成後，指派一位修復 Agent（fix agent）進去處理。它順利修正了全部 15 項審查回報的問題，同時精準保留了原本要求保留的 5 項實作細節。

## 避免重複手動操作：以 API 與 CLI 取代 UI 精靈

修復完成後，系統需要設定通知服務（以 Knock 為例）。原本的標準流程需要手動操作 Knock 的網頁精靈，建立並提交開發環境中的 8 個工作流程（workflows）、將討論回覆（discussion reply）移入獨立分類，接著還要執行 `npm run nocksync users` 為既有使用者套用預設偏好設定。

<!--image:2-->

如果不想每次都要手動點過一遍網頁介面，可以改查 Knock 是否支援程式化設定。事實上，Knock 提供 Management API 與 CLI，能直接讀取 JSON 檔案來建立與提交工作流程。

在切換到這項新工作前，先對目前的對話進行壓縮（compact）。這樣做能保留 PR 的關鍵成果與記憶，同時清除先前與各個子 Agent 來回傳遞的大量細節訊息，讓後續操作能在乾淨的上下文（context）中繼續進行。

## 補齊自動化工具並為 Agent 撰寫 Skill

確認 Management API 能涵蓋網頁精靈的所有功能後，即可把工作流程寫入程式碼，並透過腳本部署：

<!--image:3-->

1. **設定金鑰**：到 Knock 後台的帳號設定（Settings → Cadence settings → Service tokens）新增一組名為 `local agent` 的 Token，並填入 `.env` 檔案的 `KNOCK_SERVICE_TOKEN`。
2. **新增部署指令**：建立 `npm run knock:push workflows` 腳本，讓程式碼能直接推送工作流程。
3. **為 Agent 寫入 Skill**：利用現有的寫作規範（writing for agents），讓 Agent 產生一份約 25 行的 `knock-workflows` Skill。內容清楚說明憑證設定、操作步驟，以及觸發時機（新增通知類型、變更範本或分類、或是觸發通知卻回傳 404 時使用）。

第一次執行 `npm run knock:push workflows` 時遇到錯誤，提示缺少 `action URL` 等必要欄位。直接把錯誤訊息交給 Agent，讓它在「擁有完整資訊」且「能安全自行執行驗證」的封閉迴圈中修正問題。這種自我修正（hill climbing）的過程，能讓 Agent 迅速排除缺少欄位的錯誤，順利建立並提交開發環境中的全部 8 個工作流程。

## 使用真實帳號進行端到端 QA

後端與通知流程就緒後，最後一步是開啟瀏覽器，用真實的使用者情境進行 QA。

<!--image:4-->

以線上課程平台為例，測試流程如下：

1. **檢查講師端初始狀態**：以講師 Marcus Johnson（開課名稱為 *Building REST APIs with Node*）登入。點擊左上角通知鈴鐺，確認顯示「已全部讀取完畢」（We're all caught up），並能點擊設定圖示進入通知偏好頁面（包含課程註冊、討論提問、討論回覆等項目）。
2. **學生提問**：切換至已修課的學生 Emma Wilson 帳號，進入某一堂課程單元，在討論區留言提問：「Why is this course so cool?」。
3. **驗證即時通知與跳轉**：切回 Marcus Johnson 帳號。通知鈴鐺立刻收到「Emma Wilson 提出了一則討論問題：Why is this course so cool?」。點擊通知後，頁面確實直接跳轉至對應留言位置。
4. **講師回覆與頭像檢查**：Marcus 在留言下方點擊回覆。切回 Emma Wilson 帳號，確認她收到回覆通知，且通知列表正確顯示頭像，版面完全符合原型（prototype）的設計。
5. **測試偏好設定邊界**：讓 Emma 進入設定頁，關閉「討論回覆」的通知。Marcus 再次回覆一則留言，確認 Emma 這次確實沒有收到任何通知。

## 前期規劃的實質效益

收尾階段之所以能如此順暢，關鍵在於前期規劃時對規格細緻度的拿捏：

- **高保真規劃（High Fidelity）**：像是通知列與鈴鐺介面，前期就提供了精確的原型與反饋，Agent 便能分毫不差地還原所有視覺細節與互動。
- **低保真規劃（Low Fidelity）**：像通知設定與動態摘要（feed）頁面，前期僅透過對話釐清邏輯，讓 Agent 自行發揮創意補齊結構。

透過審查工具修復細節、將繁瑣的手動操作固化為 Agent 可用的工具與 Skill，最後再以多角色帳號走完真實邊界測試，才能確保自動化產出的功能真正達到上線標準。
