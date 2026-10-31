# 升 effort 不會自動給你更好的結果

你在 Claude Code 的 command menu 打開 model，會看到一排 effort 等級：low、medium、high、extra high、max，最下面還有一個 ultra code。手指很自然就往右邊滑，反正「更用力」聽起來不會錯。

但這一段真正要回答的問題是：多花的那 35–40% token，換到的成品有比較好嗎？先看數字，再決定要不要轉這個旋鈕。

## effort 就是「動手前想多久」

白話講，effort 是 Claude 在動作之前願意想多深。

在 harness 底下，它調的是你這一段 prompt 的 reasoning token budget。等級調高，Claude Code 就分給規劃、呼叫工具、實際做事更多 token；等級調低，就壓到它能給的最小值。

<!--image:1-->

六個等級裡，low 到 max 這五個的差別很單純：max 就是每一段 prompt 的 token budget 比較大，low 就是小很多。Anthropic 並沒有公布各級對應的實際數字，所以預設要停在哪一級，比較像口味問題——看你平常做什麼工作。

## 實測：同一個 prompt，low 對 max

課程做了一個對照：左邊 effort 設 low，右邊設 max，送同一段 prompt。

一開始就看得出差別。low 那個 session 已經完成，max 那個還在想、還在建頁面。

<!--image:2-->

再看 thinking time：low 每次只想 1 到 2 秒，max 一次想 5 秒。這就是 effort 全部的意義——給 session 多一點空間，想清楚之後才把結果交出來。

## 多花的 token 換到什麼

用 `/context` 進去看，messages 那塊紫色區域直接對應 agent 的思考時間。low 花了 20,000 tokens，max 花了 27,000 tokens。

<!--image:3-->

換算下來，max 大約多吃 35 到 40%。趨勢很清楚：設 max 就是會用掉更多 token。

那值得嗎？這裡是整段最容易被誤解的地方：effort 不會自動讓結果變好。值不值得，還是回到你手上是哪種工作。

## 兩個版本其實長得很像

講者把兩個成品並排：一個是 low 生的，一個是 max 生的。設計上相當接近。

尤其在做設計、創意，而且不是特別在動 codebase 的時候，low 不會自動比 max 遜色。至於「看起來像 AI 隨手 vibe code 出來的」那種問題，是後面課程要另外處理的事，不是把 effort 拉到 max 就會消失。

## 預設值：mid 就夠，往上調看時機

很多開發者預設 extra high 或 max，因為他們手上的任務真的需要 agent 做比較深的工作。

但如果你主要做的是知識工作，mid 或 high 當預設，對大多數人已經夠用。

課程給的建議更具體：這五級就好，mid 當預設，只有當你發現結果不是你要的時候，再往上調。

## Ultra Code 先別碰

第六級 ultra code 是 Anthropic 最近才加的，屬於進階題目。講者的建議很直白：先不要開，因為它是所有等級裡最耗 token 的。

它跟前面五級的差別不在「想更久」，而在結構。low 到 max，你是在跟一個 agent 講話；切到 ultra code，等於放手讓 agent 去 spawn 一整批 agent，平行處理一個大任務，彼此 cross-check 之後才把結果交回來。

<!--image:4-->

這個模式後面課程會再拆。現在你只要記得：它解決的是「一個大任務」，不是「我想要更好的答案」。

所以把 effort 當旋鈕，別當品質保證。固定在 mid，讓「結果不對」成為你往上轉的觸發條件，比一開始就轉到底實際得多。
