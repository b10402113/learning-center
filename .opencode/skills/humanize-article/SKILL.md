---
name: humanize-article
description: 對有正式配圖清單的 step 文章去 AI 味，在備份工作區改文章與 plan 的 heading／prompt，驗證通過才寫回並留下 hash 紀錄。當使用者要潤稿、去 AI 味或同步修改配圖清單時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force]"
---

Invoke as `/humanize-article <subject>/<node> [--step <id>] [--force]`.

這是一個 thin shell：`scripts/humanize-article.mjs` 只負責挑 step、建立工作區、驗證與寫回；每一篇的改寫由一個新的 `humanize-article` subagent 在工作區完成。沒有 plan 的既有文章完全不動。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node scripts/humanize-article.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 有 `steps[]`、`skipped[]`、`failed[]`：

   - `steps[]` 每筆有 `id`、`title`、`status: ready`、`article`、`plan`、`workArticle`、`workPlan`。
   - `skipped[]` 的 `status` 是 `skipped-no-article`、`skipped-no-plan`、`skipped-not-published` 或 `skipped-record`。
   - `failed[]` 是 plan 格式錯誤等無法開始的情況。

   只有 `steps[]` 需要派工。`skipped-record` 代表文章與 plan 的 hash 都和上次紀錄相符；`--force` 才會重做。

3. **humanize subagent：一個 step 派一次**

   依 `steps[]` 順序，每個 step 各派一個新的 `humanize-article` subagent。不要一次把整個 node 交給同一個 agent。

   每次派工只給這幾項：

   - `title`、`workArticle`、`workPlan`
   - 一句：「載入 `speak-human-tw`，用非互動模式直接改工作區的兩個檔案，最後把摘要寫到同一個資料夾的 `summary.txt`。」
   - 一句：「只改散文與 plan 的 `heading`／`prompt`；不要碰 H1、marker、圖片行、code、provenance、quiz、相對連結或 `anchor`。」

   不要給其他 step 的內容，也不要給 node plan。

   subagent 完成標準：`workArticle` 與 `workPlan` 已被改寫，`summary.txt` 存在；不要自己寫回正式檔。

4. **apply**

   每個 step 的 subagent 完成後，執行：

   ```bash
   node scripts/humanize-article.mjs apply --subject <subject> --node <node> --step <step> [--summary <text>]
   ```

   `apply` 會拿工作區和備份比對，硬性檢查：

   - 文章非空，第一行 H1 與原檔完全相同。
   - 所有 fenced code block、provenance 註解的數量與內容完全相同。
   - `<!--image:N-->` 的數量、順序完全相同。
   - 既有圖片行的數量、alt、路徑完全相同。
   - `quiz` block 的內容、數量完全相同。
   - plan 是合法 JSON 陣列，長度與 `index` 序列相同。
   - 每個 `anchor` 完全相同；`heading`、`prompt` 非空。

   驗證通過才寫回文章與 `learn/<subject>/output/image-plans/<node>/<step>.json`，並寫 `learn/<subject>/output/humanized/<node>/<step>.json`（時間、兩個 sha256、`changed`、`summary`），最後刪除工作區。

   驗證失敗時正式檔不動、不寫紀錄，工作區保留供檢查；回報 `failed` 與原因，不要手動改正式檔或重試同一個 subagent。

5. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   `apply` 已經跑過一次 verify；這裡是硬門檻。verify 沒過就回報，不要改生成物掩蓋問題。

6. **Report**：列出 `humanized`、`skipped-record`、`skipped-no-plan`、`skipped-not-published`、`failed` 的 step、每篇的 `changed` 與 `summary`、verify 結果。重跑時已處理的 step 應該全部是 `skipped-record`。

**不做的事：**

- 不改 plan 的 `anchor`、不改 plan 長度或 `index`。
- 不改 H1、`<!--image:N-->`、既有圖片行與 caption、code block、provenance、quiz、相對連結。
- 不刪圖、不改圖片檔、不重新渲染。
- 不幫沒有 plan 的既有文章補 plan 或 marker。

Completion：每個有 plan 且需要處理的 step 都 `humanized` 或 `skipped-record`，正式文章與 plan 已寫回，紀錄存在，`node scripts/verify.mjs --node <subject>/<node>` exit 0。
