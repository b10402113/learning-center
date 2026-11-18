# 放手讓 AI 寫程式：implement-spec 如何用 worktree 與 merger 平行實作

讓 AI agent 處理大型功能時，最理想的狀態不是盯著它一行行改程式碼。給定規格與任務清單後，就能放著讓它自己執行，幾個小時後直接回來看成果。

這正是 `implement-spec` 的運作方式。它把整批 tickets 整理成有前後依賴關係的 task graph。接著透過多個獨立的 worktree 與 merger agent，逐步且平行地推進實作。

## 第一階段：探索原型與建立基底

在真正動手寫功能前，系統需要先釐清現有的程式碼狀況。`implement-spec` 會先探索 NOC 原型，仔細檢查所有相關檔案。接著它會產出一份 exploration notes，存成第 0 批次筆記（cohort 0 of 5 notes）。

<!--image:1-->

有了前期理解後，orchestrator 會指派第一個 implementer agent。這個 agent 會在獨立分支上完成第一塊基礎實作並合併，接著再做第二塊。這時所有的推進都在功能分支（例如 `feature/notifications`）上進行。

## 自我修正：動態排除 worktree 造成的干擾

在初期推進 tracer bullet（探路彈）時，orchestrator 展現了動態調整的能力。它注意到前一個實作代理人留下的問題：執行測試時，測試工具抓到了 Claude 各個 worktree 資料夾內的測試檔，導致測試數量重複計算，出現偽陽性。

<!--image:2-->

orchestrator 隨即把這個資訊往下傳，要求後續的 agent 修改 Vitest 設定檔（VTest config），把暫存資料夾排除在外。接著，下一個 implementer agent 順利做出乾淨的 tracer bullet，再由專門的 merger agent 將變更併回 `feature/notifications`。

## 平行推進：五個 ticket 同時動工

打通核心路徑後，系統便能展開大規模的平行推進。這時 task graph 的前緣（frontier）已經拉開，多個互不衝突的 ticket 可以同時進行。

<!--image:3-->

以通知功能為例，系統一次開出五個 worktree 同時實作：

* 動態摘要的完整行為（feed full behavior）
* 討論區問題（discussion questions）
* 退款通知（refund notifications）
* 權利認領（seek claim）
* 其他相依項目

這些分支各自在獨立的 worktree 內平行開發與測試。

## 誰先好就先併：merger agent 的整合節奏

當多個分支同時在跑，merger agent 採取的策略是「誰先完成，就先合併誰」。

<!--image:4-->

只要某個 ticket 跑完且通過驗證，merger agent 就會立刻把該分支併回主功能分支。其他陸續完成的分支也會依序合併進來。全部整合完畢後，再把整批成果併入 integration branch。

在驗證環節，agent 會自動測試與檢查它能處理的邏輯細節。例如呼叫分頁游標（after cursor），或是確認已讀狀態（seen）不會顯示為紅色。少數仍需肉眼確認的畫面互動，才留給開發者在瀏覽器端做最後把關。這種自動推進與自動合併的流程，免去了開發者逐步盯場的負擔。
