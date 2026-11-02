# 一個存在的普通 logo，勝過你永遠沒做出的完美 logo

名稱定了，域名也到手了，假設你手上是 kiva.solutions 這樣的名字。下一個卡住你的東西，通常就是 logo：你是寫程式的人，不會畫圖，直覺反應是去找個設計師。

以前的做法確實是找設計師做 logo。但這次目標不一樣：你要的是夠專業、能讓你的 practice 盡快上線的 logo——專業到可以放上網站和 LinkedIn 檔案，就夠了。標準這麼定，是因為現在的重點是保持速度，先把生意開張，不是拿設計獎。

標準定下來，路有兩條：用 Looka 生成，或是把 prompt 丟給 AI 影像模型。兩條都幾分鐘走得完。

<!--image:1-->

## 路線一：用 Looka 幾分鐘生成

Looka.com 就是為這種場合設計的。輸入你的 practice 名稱，它會帶你跑一個簡短的表單，一路都是選擇題：

- 選產業，例如做技術諮詢就選 technology consulting。
- 挑幾個你看了覺得順眼、看起來不錯的 logo 風格，偏極簡的選項可以直接勾。
- 有偏好的色彩就選，例如藍色加灰階。
- 可以加 slogan，之後再補也行。
- 最後挑幾種字體樣式，哪種對胃口就選哪種。

過程中它會要求註冊，你可以用訪客身分繼續，不用登入。答完這幾題，螢幕上會出現一組外觀乾淨的 logo 提案。這個階段你只要兩個條件：極簡、看起來專業。從中挑一個順眼的就好。

<!--image:2-->

## 把 logo 變成透明背景的 PNG

挑好 logo 只做完一半。Looka 完整的 brand design kit 下載是付費功能，但只要一個 logo，有個更省力的做法：直接截圖。

把截圖傳給 ChatGPT，請它做這件事：

<!-- source: sources/agent-as-service/20261101/2-Wk1 - The Opportunity/4-3️⃣ Your Identity (Naming & Branding)/4-3️⃣_Your_Identity_(Naming_&_Branding).en.vtt#L717 -->
```text
Remove the background of this logo and output it as a high resolution PNG.
```

ChatGPT 的影像模型有一項別家不一定有的能力：輸出背景透明的 PNG 檔。它處理完，你把結果下載下來，就是一張網站和品牌素材可以共用的 logo 資產。

<!--image:3-->

## 路線二：把 prompt 丟給 AI 影像模型

不想用 Looka，也可以完全用 AI 生成：任何影像模型都行，差別只在 prompt 怎麼寫。有兩種用法。

第一種，把這段 prompt 傳給你的 agent，讓它先問你、再幫你寫出能用的影像生成 prompt：

<!-- source: sources/agent-as-service/20261101/2-Wk1 - The Opportunity/4-3️⃣ Your Identity (Naming & Branding)/index.txt#L39 -->
```text
I want to create a professional logo for my AI solutions practice. Ask me numbered questions about my practice name, style preferences, colors, and industry, then write me 3 image generation prompts I can use in any AI image tool.
```

它會用編號的問題問你的 practice 名稱、風格偏好、顏色和產業，然後回給你 3 條能直接丟進任何 AI 影像工具的 prompt。

第二種，直接從基礎模板改。把 [PRACTICE NAME] 換成你的名稱就能發送：

<!-- source: sources/agent-as-service/20261101/2-Wk1 - The Opportunity/4-3️⃣ Your Identity (Naming & Branding)/index.txt#L43 -->
```text
A minimalist tech logo for [PRACTICE NAME]. Clean lines, modern sans-serif font, simple geometric icon. Professional and trustworthy. White background, suitable for website and social media. No gradients, no 3D effects.
```

注意模板最後那幾句：白底、不要漸層、不要 3D 效果、適合網站和社群使用——這些限制就是讓產出「夠專業」的關鍵。模型可以選 Google Gemini 裡的 nano banana，風格想要什麼樣子，就照自己的口味改 prompt。

## Done beats perfect

真正的重點只有一句話：做完勝過完美。logo 現在不需要完美，說實話，它只需要存在。一個做出來、普通但能用的 logo，永遠勝過那個你構想很久、卻永遠沒做出的完美 logo。

而且你隨時可以升級。等營收進來，再找設計師重做一個也不遲；現在你只需要一個看起來專業、至少專業到能放上網站和 LinkedIn 檔案的東西。

所以今天就做這個動作：從兩條路線裡挑一條，幾分鐘生出一個 logo，用 ChatGPT 把它處理成透明背景的高解析度 PNG，放進你的網站或 LinkedIn 檔案。名字、域名、logo 到這裡湊齊了，你就有一個能拿去賣的品牌識別。

不過，這個身分目前只有你自己看過。下一篇，把它發到社群面前。
