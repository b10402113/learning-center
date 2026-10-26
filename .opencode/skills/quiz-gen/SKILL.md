---
name: quiz-gen
description: 為已發布的 step 文章產生 3–8 題單選題 sidecar（quiz.json），course-app 會在文章後渲染。當使用者要出題、補題或重生某個 node 的 step 測驗時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force]"
---

Invoke as `/quiz-gen <subject>/<node> [--step <id>] [--force]`.

這是一個 thin shell。`scripts/quiz.mjs` 只負責選 step、算字數上限、驗 JSON、寫檔；每一篇的題目由一個新的 `quiz-agent` 讀完文章後產生。題目不會合併進 Markdown，course-app 直接讀 `<step>.quiz.json`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node scripts/quiz.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 有 `steps[]`（`article`、`output`、`characters`、`minQuestions`、`maxQuestions`）與 `skipped[]`。`skipped[]` 的 `reason` 是 `article-missing`、`article-empty` 或 `quiz-exists`。

   完成標準：`steps.length + skipped.length` 等於該 node 的 step 數。沒有 `--force` 時，已有 `quiz.json` 的 step 會被跳過，不要自行覆蓋。

3. **quiz-agent：一個 step 派一次**

   依 `steps[]` 順序，每個 step 各派一個新的 `quiz-agent`。不要一次把整個 node 交給同一個 agent，也不要給它其他 step 的內容。

   每次派工只給這幾項：

   - `article`（相對於 repo root）、`title`、`characters`、`minQuestions`、`maxQuestions`
   - 一句：「只讀這篇文章，只回傳 JSON，不要修改任何檔案。」
   - 一句：「至少 `minQuestions` 題、最多 `maxQuestions` 題；每題的正解都要能在文章裡指到一句話；不同題不要重複考同一個概念。」

   不要給 node plan、其他 step、來源檔或課程目標。quiz-agent 只看這一篇。

4. **write：把 agent 的 JSON 存成候選檔，再交給 script 驗**

   先把 agent 最後回覆的 JSON 原樣寫到：

   ```text
   learn/<subject>/output/quiz-candidates/<node>/<step>.json
   ```

   再執行：

   ```bash
   node scripts/quiz.mjs write --subject <subject> --node <node> --step <step> --input learn/<subject>/output/quiz-candidates/<node>/<step>.json [--force]
   ```

   `write` 會再驗一次 schema、3–8 題、以及該文章字數算出的上限；通過才寫入 `learn/<subject>/nodes/<node>/<step>.quiz.json`。

   一篇失敗不要停掉整批：保留候選檔與錯誤訊息，繼續下一篇，最後一起回報。`--force` 只影響已存在的 `quiz.json`，沒帶 `--force` 時 `write` 會拒絕覆蓋。

5. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   這是硬門檻。verify 沒過就回報，不要改生成物掩蓋問題；必要時回頭修 prompt 或重跑該篇。

6. **course-app data**

   course-app 的 `build-data` 只在 `predev` / `prebuild` 跑。新增或重生 `quiz.json` 後執行：

   ```bash
   npm --prefix course-app run gen
   ```

   這會把 `quizzes` 掛進 `course-app/src/data/subjects/<subject>.json`。`npm run dev` 會自動跑 `predev`；已經開著的 dev server 需要重啟才會吃到新資料。

7. **Report**：列出寫入的檔案、每篇題數與字數上限、被跳過的 step 與原因、verify 結果。

**不要手寫題目，不要改文章 Markdown，不要把 quiz block 插回文章。**

Completion：每個目標 step 都有 `<step>.quiz.json`、題數在 3–`maxQuestions`、`node scripts/verify.mjs --node <subject>/<node>` exit 0、course-app data 已重新產生。
