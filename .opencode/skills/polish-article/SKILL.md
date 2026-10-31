---
name: polish-article
description: 對一個 node 有配圖清單的 step 文章做潤飾：遮罩結構、呼叫文字模型、還原後驗證，通過才寫回並留下 hash 紀錄。當使用者要潤稿、修文法錯字或重跑某個 node 的潤飾時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>]"
---

Invoke as `/polish-article <subject>/<node> [--step <id>] [--force]`.

這是一個 thin shell：`scripts/polish-article.mjs` 挑 step、遮罩受保護結構、呼叫模型、還原與驗證、寫回，並記錄文章 hash。沒有 subagent，也不改配圖清單。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **Run**

   ```bash
   node scripts/polish-article.mjs run --subject <subject> --node <node> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>]
   ```

   輸出 JSON 有 `nodeTitle`、`steps[]`、`skipped[]`、`failed[]`：

   - `steps[]` 每筆有 `id`、`title`、`status: polished`、`changed`、`attempts`、`path`、`record`。
   - `skipped[]` 的 `status` 是 `skipped-no-article`、`skipped-no-plan`、`skipped-not-published` 或 `skipped-record`。
   - `failed[]` 每筆有 `id` 與 `error`。

   只有 `steps[]` 真的改了文章。`skipped-record` 代表文章 hash 與上次紀錄相符；`--force` 才會重做。

   完成標準：`steps.length + skipped.length + failed.length` 等於 node 的 step 數。

3. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   verify 沒過就回報，不要改生成物掩蓋問題。

4. **Report**：列出 `polished`（含 `changed` 與 `attempts`）、各 skip 原因、`failed` 的 step 與錯誤、verify 結果。重跑時已處理的 step 應該全部是 `skipped-record`。

**它會做什麼：**

- 前後遮罩 H1、fenced code、provenance 註解、`<!--image:N-->`、既有圖片行與 caption、quiz block、行內 code 與連結。
- 呼叫模型潤飾散文，保留事實、數字與段落順序。
- 還原後和備份比對；不符就重試一次，仍不符則該篇 `failed`，正式檔不動。
- 成功才寫回文章，寫 `learn/<subject>/output/polished/<node>/<step>.json`（時間、文章 sha256、`changed`、模型），最後跑 verify。
- 文章有改動時刪除該 step 的 `<step>.quiz.json`，讓 `/quiz-gen` 重新出題。

**不做的事：**

- 不改配圖清單（`heading`、`prompt`、`anchor` 都不動）。
- 不改 H1、marker、既有圖片行、code、provenance、quiz、相對連結。
- 不刪圖、不改圖片檔、不重新渲染。
- 不幫沒有 plan 的既有文章補 plan 或 marker。
