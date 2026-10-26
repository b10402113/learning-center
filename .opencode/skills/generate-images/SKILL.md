---
name: generate-images
description: 把 step 文章裡的 <!--image:N--> marker 依正式配圖清單渲染成 WebP，並換成沒有 caption 的圖片行。只渲染、不規劃、不改散文。當使用者要補圖、重畫或把 marker 變成圖片時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--max-parallel <n>]"
---

Invoke as `/generate-images <subject>/<node> [--step <id>] [--force] [--max-parallel <n>]`.

這是一個 thin shell：`src/render-images.mjs` 讀文章裡的 marker 與 `learn/<subject>/output/image-plans/<node>/<step>.json`，逐張產生或重用 WebP，再把 marker 換成圖片行。它不規劃、不改文章其他內容、不讀 `anchor`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **Render**

   ```bash
   node src/article-cli.mjs render --subject <subject> --node <node> [--step <id>] [--force] [--max-parallel <n>]
   ```

   不需要 `TEXT_API_KEY`，也不需要文字模型；只需要圖片 API key（`IMAGE_API_KEY` 或 `EVOLINK_API_KEY`）。`--max-parallel` 控制同一個 step 內的圖片並行數，預設 2。

3. **Read the per-step status.** 輸出 JSON 的 `steps[]` 每筆有 `id`、`title`、`status`、`markers`、`images`、可能的 `error`：

   | 狀態 | 意義 | 是否失敗 |
   | --- | --- | --- |
   | `rendered` | 至少換了一個 marker；圖片可能重用 | 否 |
   | `already-rendered` | 沒有 marker，但已有圖片行 | 否（跳過） |
   | `no-plan` | 沒有正式配圖清單（既有文章） | 否（跳過） |
   | `no-article` | 沒有文章 body | 否（跳過） |
   | `no-markers` | 有 plan，但文章沒有 marker 也沒有圖片行 | 是 |
   | `failed` | marker 數量／順序不符、圖片 API 失敗、檔案寫入失敗 | 是 |

   `no-markers` 代表文章狀態不對，不要自己補 marker、不要猜位置；回頭檢查 `/article` 的產物。`failed` 時文章保持原狀，已寫入的圖片會保留。

4. **Verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   `render` 已經跑過一次 verify；這裡是硬門檻。verify 沒過就回報，不要改生成物掩蓋問題。

5. **Report**：列出每個 step 的狀態、`markers` 數、每張圖的 `index`／`file`／`reused`、verify 結果與任何錯誤。重跑沒有 `--force` 時應該重用既有圖片，不重複花錢。

**不做的事：**

- 不寫 plan、不重新規劃、不新增或刪除 plan item。
- 不讀 `anchor`、不用 `anchor` 決定位置；位置只看 marker。
- 不改 H1、散文、code block、quiz 或相對連結。
- 不加 `*AI 生成示意圖*` caption。
- 沒有 `--plan-only`；要看 plan 直接開 JSON。

Completion：有 plan 且有 marker 的 step 都有對應 `image-N.webp`，marker 已換成 `![第 N 段配圖](./<step>-assets/image-N.webp)`、沒有 caption，`node scripts/verify.mjs --node <subject>/<node>` exit 0。
