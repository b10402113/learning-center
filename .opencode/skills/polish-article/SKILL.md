---
name: polish-article
description: 對一個 node 有配圖清單的 step 文章做潤飾：遮罩結構、呼叫文字模型、還原後驗證，通過才寫回文章與配圖清單並留下 hash 紀錄。當使用者要潤稿、修文法錯字或重跑某個 node 的潤飾時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>]"
---

Invoke as `/polish-article <subject>/<node> [--step <id>] [--force]`.

這是一個 thin shell：`scripts/polish-article.mjs` 挑 step、遮罩受保護結構、呼叫模型、還原與驗證、寫回文章與 plan 的 `heading`／`prompt`，並記錄文章 hash。沒有 subagent。`/article` 的 publisher 會在插入 marker 前先跑同一支 CLI 的 `draft` 模式。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **Run**

   ```bash
   node scripts/polish-article.mjs run --subject <subject> --node <node> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>]
   ```

   輸出 JSON 有 `nodeTitle`、`steps[]`、`skipped[]`、`failed[]`：

   - `steps[]` 每筆有 `id`、`title`、`status: polished`、`changed`、`planChanged`、`attempts`、`path`、`plan`、`record`。
   - `skipped[]` 的 `status` 是 `skipped-no-article`、`skipped-no-plan`、`skipped-not-published` 或 `skipped-record`。
   - `failed[]` 每筆有 `id` 與 `error`。

   只有 `steps[]` 真的改了文章或 plan。`skipped-record` 代表文章 hash 與上次紀錄相符；`--force` 才會重做。

   完成標準：`steps.length + skipped.length + failed.length` 等於 node 的 step 數。

3. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   verify 沒過就回報，不要改生成物掩蓋問題。

4. **Report**：列出 `polished`（含 `changed`、`planChanged`、`attempts`）、各 skip 原因、`failed` 的 step 與錯誤、verify 結果。重跑時已處理的 step 應該全部是 `skipped-record`。

**它會做什麼：**

- 前後遮罩 H1、fenced code、provenance 註解、`<!--image:N-->`、既有圖片行與 caption、quiz block、行內 code 與連結。
- 呼叫模型潤飾散文，保留事實、數字與段落順序。
- 另一次呼叫只改寫 plan 每一項的 `heading` 與 `prompt`；長度與順序不變，兩者都必須是非空字串。新 plan 沒有 `anchor`；舊 plan 若有 `anchor`，原樣保留。
- 文章與 plan 都驗證通過才一起寫回；任一失敗則兩份都不動，並重試一次。
- 成功寫回文章與 plan，寫 `learn/<subject>/output/polished/<node>/<step>.json`（時間、文章 sha256、`changed`、模型），最後跑 verify。
- 文章或 plan 有改動時刪除該 step 的 `<step>.quiz.json`，讓 `/quiz-gen` 重新出題。

**不做的事：**

- 不改既有 `anchor`、plan 長度或順序，也不新增 `anchor`。
- 不改 H1、marker、既有圖片行、code、provenance、quiz、相對連結。
- 不刪圖、不改圖片檔、不重新渲染。
- 不幫沒有 plan 的既有文章補 plan 或 marker。
