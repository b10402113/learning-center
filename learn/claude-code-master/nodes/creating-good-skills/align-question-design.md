# 對齊：動手之前先把意圖問清楚

上一段把 `/align` 整張卡片攤開，看它由哪些欄位和步驟組成；這一篇只盯住其中最容易做壞的那一段，也就是問句本身怎麼寫。

你請 agent 寫一封上線通知信。它交出一封給全體訂閱者的長信，還把語氣催得更急。你要的其實是給試用用戶的三行短訊。東西不差，方向錯了，於是整份重來。

`/align` 這個 skill 就是為這個場景寫的。它的 description 講得很直接：任何任務開始之前，先用簡短、有編號的問題問清楚方向，別把力氣花在錯的地方。它要抓的是**開始之前**的沒對齊，不是做完之後才發現的沒對齊。

這是一個故意製造摩擦的動作。你先付一點問答的成本，換掉後面整段重工。

<!--image:1-->

## 它只在你要它的時候出現

`/align` 有三種進場方式。單獨打 `/align`，它對齊的是這段對話裡最近一個還沒被處理的請求。打 `/align [task]`，或直接寫 `align [task]`，它對齊的是你點名的那個任務。在一輪對話開頭打純文字 `align`，行為跟上面一樣。

它不會自己安安靜靜地跑起來。原文寫得很清楚：這個 skill 只在使用者要求時觸發，不要自作主張。

第一步永遠是認出目標。目標不明時，它只問一句「align on what?」，然後停住。不要在猜錯的任務上問五個問題，那是最貴的浪費。

## 五題上限，但至少一題

規則裡最硬的一條是：第一輪最多五題。挑**最承載重量的那幾題**，標準是「假設錯了、會浪費最多工」。

另一條一樣硬：永遠至少一題。就算任務看起來很清楚，也要強迫自己問一題基本檢查。`/align` 的重點就是刻意摩擦，一題都不問等於沒對齊。

<!--image:2-->

只有一個方向可以突破上限：使用者自己要更多。「Give me more」就展開超過五題。

問法要短、要白話，不要術語，一句話問完一題最好。順序也有預設優先級：scope 先於 format，format 先於 audience，audience 先於 constraints，constraints 先於 nice-to-haves。先問「做多大」，再問「長什麼樣」，再問「給誰看」，最後才是限制與加分項。

## 選項只在它比開放式快的時候出現

當選項比開放式回答更快時，就把 A/B/C 直接寫進題目裡。但選項要短，每個一行、一行為限。

也不要每題都做成選擇題，有些事真的需要開放回答，混著用才對。

題組的骨架長這樣：

<!-- source: sources/claude-code-master/20261031/3-Volume B - Skills/2-Module B2 - Creating Good Skills/resources/align/align-SKILL.md#L44-L50 -->
```
Aligning on [one-line restatement of the task].

1. [Question]?
2. [Question] - A) ... B) ... C) ...?
3. [Question]?
```

套進一個真實任務，就會長成這樣：

<!-- source: sources/claude-code-master/20261031/3-Volume B - Skills/2-Module B2 - Creating Good Skills/resources/align/align-SKILL.md#L90-L101 -->
```
User: `/align write a launch email for our new feature`

Aligning on a launch email for the new feature.

1. Who is it going to - existing customers, trial users, or your full list?
2. Goal - A) drive upgrades B) book demos C) just inform?
3. Length - A) short 3-line note B) full email with sections C) subject line + teaser only?
4. Tone - same as your recent emails, or pushing harder on urgency this time?
5. Any specific result or number from the feature you want featured?
```

第一題是開放式，因為受眾清單只有你知道。第二、三題給選項，因為把三種可能攤開比等人自由回答快。第四、五題又回到開放式，因為語氣和想強調的數字沒有標準答案。

## 使用者只回一次，剩下的交給你判斷

問完就等，而且只等一輪。使用者會在一個訊息裡回覆，然後可能出現四種情況。

全部照號碼回答。或只回一部分：沒有回答的題目，就用最好的判斷往下走。或直接說「do whatever you recommend」，那就全部交給你的判斷。或在他回答之外又補了新的方向，那就一併吃進去。

<!--image:3-->

除非使用者明講要更多對齊，不要開第二輪追問。預設就是一輪。

## 重述兩行，然後直接開工

收到答案後，用一到兩行把鎖定的方向重述一次。重點是哪些地方使用者的回答**推翻了你原本的預設假設**。這些是最高風險的反轉，漏掉它們，前面五題就白問了。

格式是這樣：一句「Got it」加上精簡重述，再列出從預設改掉的地方，最後直接開始動工。講完就開始做，不需要再確認一次。

## 六個不要做的事

第一，第一輪不要超過五題，除非使用者自己要求。

第二，不要問答案已經寫在 context 或 memory 裡的問題。

第三，每一題都必須承載重量，不要用「還有什麼想法？」這類填充題把名額補滿。

<!--image:4-->

第四，不要長篇重述，一到兩行就夠，講完就走。

第五，不要一直問，一輪結束就去做事。

第六，不要自己主動對一般任務啟用 align。要不要付這個摩擦成本，由使用者決定。

## 這個 skill 只對齊一件事

`/align` 的範圍是單一任務。它對齊當下這個任務，然後結束，不會替整個 session 打開一個持續的「對齊模式」。要再對齊一次，就再叫一次。

這條界線讓 `/align` 的成本看得見：你每次按下去，都知道自己買的是哪一次任務的保險。
