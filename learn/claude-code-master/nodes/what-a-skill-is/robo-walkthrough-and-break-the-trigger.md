# /robo：ROBO 視覺風格

三條叫法都會把 body 拉進 session，但只有其中一條能讓你看清楚它進場的那一瞬間。

你已經知道一個 skill 就是資料夾裡的一個 Markdown 檔。檔頭有 name 和 description，下面一整段是 body。

但你可能還沒看過 body 真的被塞進一個 session 的樣子。

這一篇跟著課程的 `/robo` 示範走一遍。開頭先看 session 一開始拿到什麼，接著看打 `/robo` 之後 body 怎麼進場。文章後半把 description 拿掉，換你體驗 skill 不再被觸發。

## session 一開始只看到一小段

課程裡，講者在一個全新的 session 問 Claude：這個 session 已經預載了哪些 skills，預載的原文是什麼。

回答分兩段。第一部分是真正預載的 memory 檔，整份文字都在 session 裡。第二部分列出 workspace 裡 180 個 skills，但只有名字。

講者把界線說得很清楚：Claude 現在看得到每一個 skill 的 name、description，還有 trigger phrases，其他都沒有。

這就是每個新對話一開始載入的那一小段，不多也不少。

<!--image:1-->

對照 `/robo` 的 `SKILL.md`，這一小段就是檔頭：

<!-- source: sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md#L1-L4 -->
```yaml
---
name: robo
description: The ROBO visual style - static, infographic-heavy design with dot-matrix (halftone) art, a paper-white / black / orange palette, and Outfit + Doto type. Use for slides, decks, one-pagers, simple web UI, and any visual where you want a clean, printed, professional look. Triggers on "/robo", "robo style", "robo slides", "robo design", "make it robo".
---
```

name 是 robo。description 講它做什麼：靜態、資訊圖表、點陣半色調、紙白／黑／橘三色、Outfit 加 Doto。最後一串是觸發詞。

## body 不在 session 裡，它在檔案裡

檔頭下面就是 body。`/robo` 這一份把整套風格寫在裡面：鎖定的色票、鎖定的字體權重與字距、點陣半色調的畫法與亮度函式、卡片規格、像素圖示的畫法。

講者說，這個 body 不會自動載入 session。只在 skill 被呼叫的那一刻，它才進來。

這也是這份檔案可以寫得這麼長的原因：它是為簡報設計調出來的，又不佔每次開對話的成本。

## 打 /robo，body 進場

示範很短。講者在輸入框打 `/`，列出所有指令，自己的 skills 和 Claude Code 預設的都在一起。接著打 robo，直接呼叫這個 skill。

然後是一句很普通的 prompt：做一張 one-slider 的樣張，跟這門課的觀眾說聲 hi。

按送出之後，Claude 找到這個 skill，讀 `SKILL.md`，把整份文字注入 session。講者的說法是 inject this whole context、this whole text file。

於是這個 session 有了這套簡報設計的知識。

<!--image:2-->

產出就是驗收。字體是 skill 指定的那一套，視覺是 skill 裡寫的點陣設計，顏色和字型樣式也照著做。

不是 Claude 猜的。是剛剛被塞進來的那份檔案規定的。

## description 是判斷的依據

回到檔頭那行 hover 提示。它說：description 會被加進每一個 request，用來讓 agent 決定什麼時候載入這個 skill。

把這句話和前面的觀察接起來。session 一開始只有 name、description、trigger phrases。Claude 決定要不要打開這個 skill，靠的就是這一小段。

body 寫得再完整，它在一開始是看不到的。

所以 description 唯一的讀者是 Claude，它決定要不要打開這個 skill，靠的就是這一行。

## 弄壞它：把 description 拿掉

現在換你動手。複製一份 `SKILL.md`，把 description 這一行的值清空，只留 `name`。

<!-- derived -->
```yaml
---
name: robo
description:
---
```

然後開一個全新的 session。用同樣的說法要一張 robo 風格的樣張，這次不要打 `/robo`，讓 Claude 自己決定。

差別會出現在開頭。原本那串「static, infographic-heavy, dot-matrix, paper-white / black / orange」和五個觸發詞都不在了。

name 還在。body 也還躺在檔案裡。但 session 開頭沒有任何材料告訴 Claude 這個 skill 是做什麼的、什麼時候該用。

結果就是 skill 不被觸發。

它靜靜待在資料夾裡，你以為它壞了，其實只是你把它的門牌拆了。

<!--image:3-->

再把那一行寫回去，重開 session，同樣的 prompt 又會命中。兩個方向都試一次，你對「觸發」這件事的手感就會留下來。

## 這一刀換到什麼

一個 skill 有三層，出現的時機不同：

<!--image:4-->

- name 和 description：每個 session 一開始就在。
- trigger phrases：跟 description 一起，用來對上你講的話。
- body：被呼叫的那一刻才注入。

所以檢查一個沒生效的 skill，順序要反過來。先看 description 有沒有寫清楚它能做什麼，再看觸發詞對不對得上你講的話，最後才去讀 body。

你在 `/robo` 身上做的這一刀，之後可以套在每一個自己寫的 skill 上。改壞一次，比讀十遍規格有用。
