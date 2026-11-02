# Step Zero：讓 skill 先叫用另一個 skill

上一篇停在這個念頭：某個前置動作每次都得先做，乾脆寫成 step zero。這一篇從一次跑歪的 /robo 講起，看那個步驟實際上長在哪裡。

你叫了 /robo，它馬上開工。等投影片產出來，你才發現方向不對。設計、簡報這類工作很吃 token，重來一次就再燒一輪。

問題通常不在 skill 寫壞了，而是它太乖：你一叫，它就直接開工，該問的問題一個都沒問。

這篇只動一件小事：在 SKILL.md 的步驟前面加一段 step zero，讓它每次啟用時先叫用另一個 skill。

## skill 不是一個 markdown 檔

先講一個常見的誤解：skill 不是只有一份 markdown 檔，它可以比那複雜得多。

兩三行的 skill 當然也能運作得很好。但真正複雜的工作，通常會是一個資料夾。

作者固定在用的 /last30days 就是例子：它要在八個不同來源裡抓過去 30 天的資訊。點進那個 skill 資料夾，裡面不只有那份給 agent 的指示——像一張食譜卡——還有幫你抓資料的 script 和程式碼、說明 brief 該長什麼樣子的 reference，以及幾個輔助達成目標的檔案。

<!--image:1-->

建議讓這些東西自然長出來。建 skill 的過程中，Claude Code 如果建議你產生某些檔案，讓它做就好。

## 有一行是它自己加的

Robo 這個 skill 的資料夾底下有一個 brandbook.html。用瀏覽器打開，它是這個 skill 專屬的簡報與網頁設計風格參考。

這件事沒有特別規劃。作者做 design system 時，順手做一份 brandbook 很自然；後來請 Claude Code 更新這個 skill，它就自己補上一行，把 brandbook 叫進來，之後每次用到這個 skill，都有視覺風格可以對照。

這一點值得記住：Claude Code 會主動把「這個 skill 執行時該參考什麼」寫進 SKILL.md。順著同一條線往下問，就是：那 skill 能不能叫用另一個 skill？

## 加一段 step zero

可以。

假設你希望 Robo 每次被叫用時，都先用 align skill 把問題問清楚。理由很實際：設計與簡報工作吃 token，先跟 agent 對齊再讓它動手，比較不會白做。

做法是直接送一個 prompt 給 Claude Code，說明你要的行為。它會先想過這個問題，再去改對應的 skill（在這裡是 Robo 的 skill.md），把那一行加進去。

改完後，Robo 的流程最前面會多一段 step zero：

<!-- derived -->
```markdown
## Step Zero

Before any Robo work, always invoke the align skill directly.
```

重點在位置：它卡在所有 Robo 工作前面。做完才補問，就沒用了。在任何 Robo 工作之前，一律直接叫用 align skill。

<!--image:2-->

## 中間那些編輯畫面，不用逐字讀

如果你不是開發者，看到 Claude Code 在畫面上即時跳出大量編輯，會有點壓力。

把它想成一個比你預期更囉嗦的員工就好。它其實是在把想法講出來，順手把步驟替你寫下來。

你是管理者。員工的每個念頭不用都讀完，你只看他最後交出來的東西。

## 生效的方式

回到 Robo，你看到的差別就是那段 step zero。

實際運作很直順：這個 skill 每次被叫用，那段指示就進到這次 session，它會自己去找 align skill 來讀。

<!--image:3-->

你不用記得先打 /align。只要叫 Robo，對齊那一步自己會發生。

想確認沒改錯，就把那段 step zero 拿掉，再叫一次 Robo，它又會直接開工。這一段就是在這裡管事。
