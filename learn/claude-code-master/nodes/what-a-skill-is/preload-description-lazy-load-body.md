# description 會加進每一次請求，body 等你叫它才載入

開一個全新的 session，游標都還沒動，你心裡那個問題就來了：workspace 裡躺著一堆 skill，這些東西是每次開工就整份塞進 context，還是放在旁邊等？

前一段收在「preload 的是名片，inject 的才是內容」，這裡把那條線講清楚。答案是後者，而且分界線切得很乾淨：一份 SKILL.md 只有最上面那一小段會跟著每一次請求走；下面的 body 留在檔案裡，等你真的叫到它才進來。

先看這份檔案長什麼樣子，後面就都通了。

## 一份 SKILL.md 就是兩層

skill 不用想得太複雜。課程裡的說法是：它是你 agent 收著的一張食譜卡，一份寫好的文件；agent 要做某件事時，就照卡上的指示做。形式就是一個 markdown 檔。

檔案被切兩塊。上面是給 agent 看的「這張卡在講什麼」，下面是「真的動手時照著做什麼」。

<!--image:1-->

我用的 /robo 就是現成例子：你現在讀到的這些簡報，都是它做出來的。它的 SKILL.md 開頭長這樣：

<!-- source: sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md#L1-L4 -->
```yaml
---
name: robo
description: The ROBO visual style - static, infographic-heavy design with dot-matrix (halftone) art, a paper-white / black / orange palette, and Outfit + Doto type. Use for slides, decks, one-pagers, simple web UI, and any visual where you want a clean, printed, professional look. Triggers on "/robo", "robo style", "robo slides", "robo design", "make it robo".
---
```

上半部是 `name` 和 `description`，下面才是那落落長的本體——顏色、字型、點陣技法、卡片與圖示的規格。會這麼長，是因為整份都在講設計，而且還是照那批簡報特別調過的。

## 預載的是上面那一小段

把滑鼠移到那段說明上，介面會直接告訴你這條規則：這個 skill 的 description 會被加進每一次請求，agent 用它來判斷什麼時候該載入這個 skill。

動詞是重點。不是「需要時會被參考」，是「每一次請求都帶著」。

課程裡做了一個很乾脆的測試：開一個完全沒碰過的 session，請它列出這個 session 已經預載了哪些 skill，以及預載的原文到底是什麼。回來的結果分兩類。

第一類是 memory 檔案，那種是真的整份文字都進了 session，這部分留到 memory 的模組再講。第二類是 skill：它列得出來，但也說得很清楚：它現在看得到的，就是每一個 skill 的 name、description 和觸發詞，就這樣，沒有更多。那時候 workspace 裡有 180 個 skill，180 份 body 一份都沒進去。

再追問一次，請它單獨把 /robo 那份秀出來，它回的也正好是 SKILL.md 上面的 name 和 description，跟我們剛剛在檔案裡看到的一模一樣。

所以每一次開新對話，跟著你走的是所有 skill 的名字、說明、觸發詞；不是所有 skill 的內容。

<!--image:2-->

## body 是叫到才載入

那 body 什麼時候才進來？

你 invoke 它的時候。課程的示範是這樣：打字叫出 robo，交代一句「做一張 sample 簡報，跟這門課的觀眾說嗨」。接下來它做的事很具體：找到那個 skill、讀 skill.md 檔、把整份文字檔注入到這個 session。這時候它才真的拿到那套簡報的 design system，然後照著做出來。

那個「注入整個 context」的動作，就是 lazy load。body 沒有事先在你的 session 裡佔位，它是被叫到的那一刻才整份被拉進來。

<!--image:3-->

這也說明 /robo 為什麼可以寫那麼厚：整份都在講設計判斷、色彩紀律、字型權重、點陣怎麼畫，這些東西只有在你真的要做簡報時才有意義。平常它待在那裡，一個字都不花你的 context。

反過來說，你 workspace 裡那 180 個 skill 的 body，只要今天沒被叫到，就一次都沒有進到對話裡。

## 叫它的三種方式

不用每次都在想「到底要怎麼觸發」。至少有三條路。

第一種，說名字。「run the robo skill」這樣講就好，因為那段 description 本來就已經在你的對話裡，agent 認得出你在指哪一個 skill。

第二種，直接打斜線。打 `/` 之後接 skill 名稱，就是明確指定，不用它猜。

第三種，放手讓它挑。你只描述要做的事，讓 Claude 自己從手上那份預載清單裡選。

第三種之所以行得通，靠的正是前一段的預載：它手邊有一份「每個 skill 會做什麼」的目錄，才有辦法把你講的話對到某一個 skill 上。

## 這對 token 成本的意思

把兩層分開，省下的不是一點邊角料。

如果 180 份 body 每次開場都進來，你還沒開始做事，context 就先被吃掉一大塊。實際的設計是：常駐的只有 name、description、觸發詞這種小片段，乘上 skill 的數量；真正肥的 body 在你叫它之前是零。

於是成本模型變成兩段：一段是固定的入場費（所有 skill 的目錄），一段是使用費（你這次真的用到的 skill 的 body）。

<!--image:4-->

這樣算下來，你寫 skill 的直覺會跟著改變。你多寫一個 skill，增加的是目錄裡的一小段，不是一整份文件。你把某個 skill 寫得更長更細，增加的是「未來真的用到它那一次」的費用，而不是每次開場的費用。

## 所以 body 可以放心寫厚

知道這條分界線之後，取捨就變清楚了。

description 是唯一每次都要付錢的地方，所以它要短、要準、要放進真的會出現的觸發詞。它是目錄條目，不是摘要，更不是規格書。body 才是你動手時的說明書，該長就長；但別讓它變成通篇都用不到的裝飾，因為它終究會在某一刻被整份拉進來。

想確認你自己的工作區是不是這樣運作，就照課程那個測試做一次：開一個乾淨的 session，請它列出已經預載的 skill 和預載的原文。你看到的清單有多長、內容有多細，就是你每次開場實際付的那筆錢。
