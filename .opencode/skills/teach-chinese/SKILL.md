---
name: teach-chinese
description: 依節點的步驟 DAG，產生容易理解的繁體中文 HTML 課程，並回填 step MDX。
disable-model-invocation: true
argument-hint: "/teach-chinese <subject>/<node-id> | /teach-chinese -step <step-id>"
---

# 繁體中文教學

把節點尚未完成教學的 step，依相依順序寫成獨立 HTML 課程。輸出位置與 `/teach` 相同，可互換使用。

只支援 `learn/<subject>/nodes/<node-id>.mdx` 存在的節點模式。所有學習狀態與產物放在 `learn/<subject>/`。

## 教學標準：讓讀者跟得上

目標是讓學習者讀完能解釋、判斷或操作，不是把來源壓縮成摘要。

- **從已知走向未知。** 依 `MEMORY.md` 判斷背景；沒有紀錄時，不假設讀者已懂本步術語。缺少的必要先備，用短段落補足。
- **先具體，再抽象。** 從一個具體問題開始，用例子說明，再引入名稱與定義。避免開頭連續堆疊術語。
- **把推理寫出來。** 不只寫「是什麼」，還要補上「為什麼會這樣」。凡是「因此」「只要」「顯然」跨過的關鍵步驟，都要說清楚。
- **沿用同一個例子。** 讓例子隨解說逐步發展，避免每段換情境。需要釐清邊界時，再加入一個容易混淆的反例。
- **先示範，再練習。** 先完整展示一次思考或操作，再讓讀者處理相似問題，最後才換情境。
- **簡單但準確。** 使用台灣繁體中文、短段落與完整句子。類比後要指出對應關係及限制；刪除不影響本步目標的延伸知識。

例如，不要只寫「快取透過重用結果降低延遲」；先說「第一次查資料要等兩秒。如果把結果留著，下次相同查詢就能直接取用」，再介紹「快取」，並補充資料可能過期。

## 前置作業

1. 讀節點 frontmatter 的 `steps`，取得 id、order、deps、type；讀各 step MDX、`MEMORY.md` 與存在時的 `MISSION.md`。
2. 讀各 step `sources` 指向的來源及相關 `digests/`，確認學習目標與來源 locator。
3. 節點 status 已是 `content-written` 時，不重建課程，改進入問答／複習。
4. 依 DAG 拓撲排序；同時可教的 step 依 order 排列。相依缺漏或循環時，回報問題，不自行猜測。
5. 建立 `lessons/assets/`；缺少 `shared.css` 或 `quiz.js` 時，從本 skill 的 `assets/` 複製。第一次寫課程前，讀 `example/lesson.html`。

## 每步的寫法

先讀 `types/<type>.md`；沒有 type 時使用 `concept`。型別決定重點，不應造成艱澀或重複的段落；發生衝突時，優先遵守本檔的教學與可讀性標準。

| 型別      | 解說重點                                                     |
| --------- | ------------------------------------------------------------ |
| concept   | 用具體例子建立理解，再說定義、運作原因與容易混淆的邊界。     |
| procedure | 說明目標與前置條件，示範有序操作、關鍵程式碼及可驗證結果。   |
| decision  | 提出需要取捨的情境，比較選項，用正反例導出可操作的判斷規則。 |
| reference | 先交代查閱用途，再以一致格式列出術語、選項、限制與最小範例。 |

一般課程依下列順序鋪陳，標題可自然調整：

1. **問題與目標：** 讀完能做什麼；第一步以外，先簡短承接前一步。
2. **解說與示範：** 一次引入一個主要概念，緊接例子或可觀察結果。
3. **容易混淆之處：** 解釋一個與目標直接相關的常見錯誤。
4. **小結：** 收斂本步核心，不加入新概念。
5. **測驗：** 至少 5 題，答案都能從課文推得。

純理論課不硬塞程式碼或操作步驟；reference 可用查閱表與最小範例代替連續解說。

## 來源與程式碼

每個實質論點都要能回溯來源；在相關段落或範例旁提供引用。來源讀不到時，在缺口標 `[needs source]`，不補造事實。

所有型別都要檢查：只要內文涉及檔案、函式、API、指令，或來源含程式碼，就呈現與目標相關的真正程式碼。

- 來源已有程式碼：逐字引用所需片段，標 `data-source`；不要悄悄改寫。
- 來源沒有程式碼：可依內容編寫範例，標 `data-provenance="derived"`，並說明是示範。
- 每個程式碼 `<pre><code>` 區塊都要有上述屬性；字幕、逐字稿等非程式碼 `<pre>` 不適用。
- 解說程式碼時，交代輸入、關鍵處理與輸出，不只把語法換句話說。

詳細規範見 `docs/reference/source-reading.md` 的「Source-grounded teaching」。

## HTML 與測驗

寫入 `lessons/<node-id>/<step-id>.html`，版面沿用共用資產：

```html
<!-- head 內 -->
<link rel="stylesheet" href="../assets/shared.css" />

<!-- body 結束前 -->
<script src="../assets/quiz.js"></script>
```

小結必須在測驗之前。每題使用以下格式，選項放在 `.quiz` 內：

```html
<div
  class="quiz"
  data-question="問題文字"
  data-correct="1"
  data-explain="說明正確答案背後的理由。"
>
  <button class="opt">選項一</button>
  <button class="opt">選項二</button>
  <button class="opt">選項三</button>
  <button class="opt">選項四</button>
</div>
```

`data-correct` 從 0 起算，`data-explain` 依共用腳本在答對後顯示。

測驗由理解、套用到辨別錯誤；不要只考名詞記憶。錯誤選項來自合理誤解，長度與語氣盡量一致。後續課程可加入前面已教概念的回想題；題目仍須提供即時回饋。

頁尾前放 `<div class="lesson-nav">`：

- 左格：`← 上一步：<title>`。
- 右格：`下一步：<title> →`。
- 連結使用 `./<step-id>.html`，title 取自各 step MDX。
- 第一步省略左格，最後一步省略右格。

## 逐步完成與驗證

每完成一個 step，先讀回 HTML，檢查：

- 不看來源，只讀課文，能否理解術語、跟上推理並完成測驗？
- 是否有只給結論、未解釋原因的段落？是否有尚未介紹就使用的術語？
- 型別要求、來源引用及程式碼出處是否齊全？
- 小結是否在測驗之前、至少 5 題、答案索引及解說是否正確？
- 共用資產、前後導覽與相對路徑是否正確？

有缺就先修正，再回填 step MDX：

```markdown
## Lesson

一句話總結本步核心觀念。

## Course

[↗ 課程頁面](../../lessons/<node-id>/<step-id>.html)
```

回報「第 X/N 步完成」後，直接處理下一步。保留既有學習紀錄，避免重複插入區段。

所有 step 完成後，把節點 status 更新為 `content-written`，列出完成的 step 與所有 `[needs source]` 缺口，建議逐步執行 `/tackle <step-id>` 驗證理解。

## 單步問答

`/teach-chinese -step <step-id>` 只做問答，不產生 HTML、不回填 mastery。

1. 以檔名或 `id` 搜尋 `learn/` 下的 step MDX。
2. 找不到就回報「找不到 step」；同名多筆時，請使用者提供 `<subject>/<node-id>/<step-id>`。
3. 讀 step、既有課程與相關來源，詢問要釐清之處，再依需求解說或複習。
