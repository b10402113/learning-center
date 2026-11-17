# 放手讓 AI 寫程式：implement-spec 如何用 worktree 與 merger 平行實作

在讓 AI 代理人（agent）處理大型功能時，最理想的狀態不是一步一步盯著它改程式碼，而是給了規格與任務清單後，放著讓它自己執行，幾個小時後再回來看成果。

這正是 `implement-spec` 的運作模式。它將整批待辦工作（tickets）組織成具有先後與依賴關係的任務圖（task graph），透過多個獨立的工作區目錄（worktree）與合併代理人（merger agent），逐步且平行地推進實作進度。

## 第一階段：探索原型與建立基底

在真正動手寫功能前，系統需要先釐清現有的程式碼狀況。`implement-spec` 會先去探索 NOC 原型，仔細檢查所有相關檔案，並產出一份探索筆記（exploration notes），儲存為第 0 批次筆記（cohort 0 of 5 notes）。

<!--image:1-->

有了這層理解後，協調器（orchestrator）會派出第一個實作代理人（implementer agent），在獨立的分支完成第一塊基礎實作並合併進來，接著再完成第二塊。此時所有推進都在功能分支（例如 `feature/notifications`）上進行。

## 自我修正：動態排除 worktree 造成的干擾

在推進初期的「探路彈」（tracer bullet）過程中，協調器展現了動態調整的能力。它注意到前一個實作代理人留下的問題：執行測試時，測試工具不小心抓到了 Claude 各個 worktree 資料夾裡面的測試檔，導致測試數量重複計算、產生偽陽性。

<!--image:2-->

協調器隨即把這項資訊傳遞下去，要求後續的代理人修改 Vitest 設定檔（VTest config），將該暫存資料夾排除在外。緊接著，下一個實作代理人順利打造出乾淨的探路彈，再由專門的 merger agent 將變更合併回 `feature/notifications`。

## 平行推進：五個 ticket 同時動工

打通核心路徑後，系統便能展開大規模的平行推進。這時任務圖的前緣（frontier）已經開展，多個彼此不衝突的 ticket 可以同時進行。

<!--image:3-->

以通知功能為例，它一次開出五個工作區同時實作：

* 動態摘要的完整行為（feed full behavior）
* 討論區問題（discussion questions）
* 退款通知（refund notifications）
* 權利認領（seek claim）
* 其他相依項目

這幾個分支各自在獨立的 worktree 裡平行撰寫與測試。

## 誰先好就先併：merger agent 的整合節奏

當多個分支同時在跑，merger agent 採取的策略是「誰先完成，就先合併誰」。

<!--image:4-->

一旦有某個 ticket 跑完並通過驗證，merger agent 就立刻將該分支併回主功能分支，接著陸續將其他陸續跑完的 extra 分支依序合併進來。全部整合完畢後，再將整批成果合併進整合分支（integration branch）。

在驗證方面，代理人會自動測試並驗證它能處理的細節，例如呼叫分頁游標（after cursor）、檢查已讀狀態（seen）沒有顯示為紅色等邏輯。至於少數仍需人工肉眼確認的畫面互動，則留待開發者回到瀏覽器端做最後把關。這種自動推進與自動合併的流程，讓開發者真正擺脫了逐步監督的負擔。
