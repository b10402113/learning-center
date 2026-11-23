---
name: polish-article
description: 對一個 node 的 step 文章做潤飾：node 模式一次把整包原稿送進文字模型做連貫、去重與統一術語，再逐篇遮罩、還原與驗證；run 模式對已發布文章逐篇重潤。當使用者要潤稿、修文法錯字或重跑某個 node 的潤飾時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id> ...] [--copy] [--force] [--max-chars <n>] | run <subject>/<node> [--step <id>] [--force]"
---

Invoke as `/polish-article node <subject>/<node> [--step <id> ...] [--copy] [--force]` or `/polish-article run <subject>/<node> [--step <id>] [--force]`.

這是一個 thin shell：`scripts/polish-article.mjs` 挑 step、遮罩受保護結構、呼叫模型、還原與驗證、寫回文章與 plan 的 `heading`／`prompt`。沒有 subagent。

- `node` 模式是 `/article` 與 `/batch-nodes` 用的那一條：一次把整個 node 的原稿與配圖清單送進文字模型，讓文章互相連貫、刪掉重複定義、統一術語，寫出每步的 `polish.md`、潤飾 plan，並把 H1 寫回 node。
- `run` 模式對已發布的 `step.md` 逐篇重潤，靠文章 hash 紀錄跳過沒變的步驟。
- `draft` 模式是 legacy 修復路徑：只潤一個尚未發布的 `original.md`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **Run**

   ```bash
   node scripts/polish-article.mjs node --subject <subject> --node <node> [--step <id> ...] [--copy] [--force] [--max-chars <n>]
   ```

   `node` 模式的輸出 JSON 有 `nodeTitle`、`batches`、`steps[]`、`skipped[]`、`failed[]`：

   - `steps[]` 每筆有 `id`、`status`（`polished` 或 `copied`）、`changed`、`planChanged`、`attempts`，走過救援時帶 `rescued: true`，保底複製時帶 `fallback: true` 與 `error`。
   - `skipped[]` 的 `status` 是 `skipped-no-original`、`skipped-no-plan` 或 `skipped-existing`。
   - `failed[]` 每筆有 `id` 與 `error`。

   只改這次有 `original.md` 的 step；已發布的鄰居只當唯讀上下文。超過 `--max-chars`（預設 180000 或 `POLISH_NODE_MAX_CHARS`）時對半切包、逐包潤飾。`--copy` 不呼叫模型，只把原稿複製成 `polish.md`。

   對已發布文章重潤用 `run`：

   ```bash
   node scripts/polish-article.mjs run --subject <subject> --node <node> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>]
   ```

   `run` 的 `steps[]` 每筆有 `id`、`title`、`status: polished`、`changed`、`planChanged`、`attempts`、`path`、`plan`、`record`；`skipped[]` 的 `status` 是 `skipped-no-article`、`skipped-no-plan`、`skipped-not-published` 或 `skipped-record`。`skipped-record` 代表文章 hash 與上次紀錄相符；`--force` 才會重做。

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
- 文章與 plan 都驗證通過才一起寫回；`node` 模式某篇驗證失敗時退回單篇救援（最多兩次），救援也失敗就把 `original.md` 原樣寫成 `polish.md`（`fallback: true`）。
- `run` 成功寫回文章與 plan，寫 `learn/<subject>/output/polished/<node>/<step>.json`（時間、文章 sha256、`changed`、模型），最後跑 verify。
- `draft` 只寫 `polish.md` 與 plan；`original.md` 的內容與 hash 保持不變。`node` 模式不寫 hash 紀錄，`polish.md` 已存在就跳過（`--force` 覆寫）。
- 文章或 plan 有改動時刪除該 step 的 `<step>.quiz.json`，讓 `/quiz-gen` 重新出題。

**不做的事：**

- 不改既有 `anchor`、plan 長度或順序，也不新增 `anchor`。
- 不改 H1、marker、既有圖片行、code、provenance、quiz、相對連結。
- 不刪圖、不改圖片檔、不重新渲染。
- 不幫沒有 plan 的既有文章補 plan 或 marker。
