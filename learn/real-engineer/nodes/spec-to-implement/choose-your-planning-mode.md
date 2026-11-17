# 依 Diff 大小選擇開發流程：One-shot、Grill with Docs 與 Wayfinder

完整的 Wayfinder 流程非常厚重。從一開始的嚴格探問（grilling）、做原型（prototyping）、技術調研（research）、拆解任務（tasks）、整理成規格書（spec），最後才進到實作規格。

自己實際操作時，因為不需要邊做邊對旁人解說，速度會快一些，但事前依然包含大量的探問對話、原型嘗試，以及在 AI Agent 動手寫 code 前的縝密思考。

面對一個新需求，何時該用 Grill with docs？何時該用 Wayfinder？其實還有第三個選項：什麼時候根本不需要 Grill with docs，直接「One-shot」請 Agent 一步到位把程式碼寫出來？

## 第一道判斷題：這次的 Diff 很小嗎？

開啟一個全新的工作階段（session）時，要做的第一道判斷是：**即將產生的程式碼變更（diff）是不是極小？**

<!--image:1-->

舉例來說：
- 修改一個按鈕的顏色
- 讓一個失敗的測試（failing test）通過
- QA 階段常見的微調：更換圖示、修改文案、修正太大的邊界（margin）或尺寸等 UI 細節

如果你要審查（review）的內容非常小，就完全不用擔心與 Agent 認知不一致（misalignment）的問題。

Grill me 或 Grill with docs 的核心價值，是避免 Agent 寫出龐大的 diff 後，你才發現方向完全錯誤，白白浪費大量 token 與時間在毫無價值的產出上。但如果 diff 本身非常小，就算第一次做出來完全不能用也無所謂，因為成本極低，Agent 隨時能以極快的速度重新做一次。

遇到這類微小變更，不需要事前做一堆確認，直接告訴 Agent「去做吧，做完我再 review」即可。這類情境採用 One-shot 的比例其實可以比想像中更高。

## 只要 Diff 不是極小，一律從 Grill with Docs 起手

只要變更達到中等程度、不再屬於極小的範圍，Grill with docs 就非常合適。

<!--image:2-->

在實務上，只要不是打算 One-shot 的任務，**一律建議直接從 Grill with docs 開始，不要一開始就開 Wayfinder**。

之所以這樣設計，是因為你隨時可以從 Grill with docs「升級（graduate）」成 Wayfinder：

在進行 Grill with docs 的過程中，如果你發現事情開始進入難以掌握的混亂地帶（dumb zone），規模比預期大得多、迷霧（fog）遠超想像，你隨時可以在同一個 session 裡直接對 Agent 說：「好，我們把這些討論轉成一張 Wayfinder 地圖。」

這個策略讓你的初始決策變得非常單純：你永遠只需要在「One-shot」和「Grill with docs」兩者之間二選一。

## 為什麼不一開始就開 Wayfinder？

如果起手就選 Wayfinder，最後發現任務其實很單純，代價會非常高。

<!--image:3-->

你已經完成了一整套繁複的儀式，畫好了龐大的地圖，產出了一堆複雜的規劃資產，結果才意識到問題根本沒那麼複雜。這種沉沒成本很難優雅地收場與復原。

因此，比較穩健的決策路徑是：
1. **極小 Diff**：直接 One-shot，節省前期溝通成本。
2. **中型以上或不確定大小**：先用 Grill with docs 摸清輪廓。
3. **發現迷霧過多、複雜度失控**：把 Wayfinder 當成升級的逃生門（escape hatch），在對話中無縫轉移成完整地圖與規格流程。

你不必對每一項任務都 Grill with docs，更不需要為每件事都動用 Wayfinder。大膽增加 One-shot 的使用頻率，並在 Grill with docs 遇到真正龐大複雜的情境時，再升級到 Wayfinder 即可。
