# 依 Diff 大小選擇開發流程：One-shot、Grill with Docs 與 Wayfinder

完整的 Wayfinder 流程非常厚重。

前期的準備包含嚴格探問（grilling）、製作原型（prototyping）、技術調研（research）、拆解任務（tasks）與整理規格書（spec），最後才會進到實作規格。

獨自操作時，因為不需要向旁人解說，速度會快一些。但在 AI Agent 動手寫 code 前，依然需要大量的探問對話、原型嘗試，以及事前縝密的思考。

面對新需求時，該選擇 Grill with docs 還是 Wayfinder？

其實還有第三個選項：完全不需要 Grill with docs，直接「One-shot」讓 Agent 一步到位把程式碼寫出來。

## 第一道判斷題：這次的 Diff 很小嗎？

開啟一個全新的工作階段（session）時，要做的第一道判斷是：**即將產生的程式碼變更（diff）是不是極小？**

<!--image:1-->

常見的例子包括：
- 修改按鈕顏色
- 讓失敗的測試（failing test）通過
- QA 階段的常見微調，例如更換圖示、修改文案、調整過大的邊界（margin）或尺寸等 UI 細節

如果要審查（review）的範圍極小，就完全不必擔心與 Agent 認知不一致（misalignment）的問題。

Grill me 或 Grill with docs 的核心價值，是避免 Agent 寫出龐大 diff 後才發現方向完全錯誤，白白浪費大量 token 與時間在無效產出上。

如果 diff 本身非常小，就算第一次產出的內容完全不能用也無所謂。因為試錯成本極低，Agent 隨時能以極快的速度重做一次。

遇到這類微小變更，不需要事前反覆確認。直接交給 Agent 處理，完成後再 review 即可。

這類情境使用 One-shot 的比例，實際上可以比想像中更高。

## 只要 Diff 不是極小，一律從 Grill with Docs 起手

只要變更達到中等程度、不再屬於極小的範圍，Grill with docs 就非常合適。

<!--image:2-->

實務上，只要不是打算 One-shot 的任務，**一律直接從 Grill with docs 開始，不要一開始就開 Wayfinder**。

這項策略的關鍵在於隨時能從 Grill with docs「升級（graduate）」成 Wayfinder。

在進行 Grill with docs 的過程中，如果發現事情開始進入難以掌握的混亂地帶（dumb zone），規模比預期大得多、迷霧（fog）遠超想像，隨時可以在同一個 session 裡直接對 Agent 說：「好，我們把這些討論轉成一張 Wayfinder 地圖。」

這讓初始決策變得非常單純：一開始永遠只需要在「One-shot」和「Grill with docs」之間二選一。

## 為什麼不一開始就開 Wayfinder？

如果起手就選 Wayfinder，最後發現任務其實很單純，代價會非常高。

<!--image:3-->

這代表已經走完了一整套繁複的儀式，畫好了龐大地圖，產出許多複雜的規劃資產，才意識到問題根本不複雜。這種沉沒成本很難優雅地收場與復原。

較穩健的決策路徑是：
1. **極小 Diff**：直接 One-shot，節省前期溝通成本。
2. **中型以上或不確定大小**：先用 Grill with docs 摸清輪廓。
3. **發現迷霧過多、複雜度失控**：把 Wayfinder 當成升級的逃生門（escape hatch），在對話中直接切換為完整地圖與規格流程。

不必對每一項任務都做 Grill with docs，更不需要動輒動用 Wayfinder。

面對小變更，大膽提高 One-shot 的使用頻率。只有在 Grill with docs 遇到真正龐大複雜的情境時，再升級到 Wayfinder 即可。
