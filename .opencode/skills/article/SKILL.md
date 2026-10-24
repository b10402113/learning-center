---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、publisher 寫原稿、article-agent 改寫、publish 回寫並 verify。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--engine agent|legacy] [--images] [--plan-only]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--engine agent|legacy] [--images] [--plan-only]`.

這是一個 thin shell：文章由 `publisher` agent 依素材包寫原稿，再交給 `article-agent` 用它的 `prompts/rewrite.txt` 改寫；`src/article-cli.mjs` 只負責切片、保護 code、回寫與 verify。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**（預設引擎）

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 的 `steps[]` 每筆有 `material`、`original`、`command`；`skipped[]` 是已有內容的 step。
   `--force` 連已有內容的 step 也重做，並清掉該 step 的舊執行結果。

   完成標準：`steps.length + skipped.length` 等於節點 step 數。

3. **publisher**：整個 node 只派 **一次** `publisher` subagent。任務給它 `nodeTitle`、`nodeGoal`、依 `index` 排序的 `steps[]`（每筆有 `index`、`total`、`previous`、`next`、`material`、`original`、`command`），以及 `skipped[]` 裡已寫好的 step 路徑當前後文。

   一個 agent 寫完整個 node，step 之間才有連貫性：術語只解釋一次、例子延續、上下課互相承接。不要一個 step 派一次。

   完成標準：每個 step 的 `command` 都回報 `status: completed`。失敗的 step 留在 `learn/<subject>/output/jobs/`，不要進下一步。

4. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>]
   ```

   它還原被保護的 code block、把 H1 對齊 node plan、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有內容才把 node 標成 `written`，最後跑 verify。

   完成標準：`verify.pass` 為 `true`。

5. **legacy 引擎**：`--engine legacy` 改跑舊路徑，一次 text request 直接由來源切片生成。

   ```bash
   node src/article-cli.mjs article --subject <subject> --node <node> [--step <id>] [--force] [--images]
   ```

6. **圖片**：只有指令帶 `--images` 才跑，而且一定在文章回寫之後（agent 引擎是 publish 之後，legacy 引擎是 `article --images` 本身）。

   ```bash
   node src/article-cli.mjs image --subject <subject> --node <node> [--step <id>] [--force] [--plan-only]
   ```

   `--images` 沒帶就不要呼叫 image 模式，也不要手動補圖。圖片數量由完成文章的正體中文字數決定：<900 → 1、900–1,499 → 2、1,500–2,099 → 3、2,100–2,699 → 4、≥2,700 → 5。

   要讓使用者先審核 plan：加 `--plan-only`，plan 會寫到 `learn/<subject>/output/image-plans/<node>/<step>.json`，這一步只規劃、不生圖，也不改文章。使用者確認或直接編輯該檔後，再跑不帶 `--plan-only` 的 image 就會沿用同一份 plan 生圖；`--plan-only --force` 才是重新規劃。不帶 `--plan-only` 的 `--force` 只重產圖片，沿用現有 plan。既有的圖會重用。

7. **Report**：把每一步的 JSON 原樣整理給使用者，附上 verify 結果。

**不要手寫文章或圖片。** verify 沒過就回頭修 node 的 sources 或 purpose 再重跑，不要改生成物掩蓋問題。

Completion：每個該有文章的 step 都有、H1 與 node plan 一致、`node scripts/verify.mjs --node <subject>/<node>` exit 0；帶 `--images` 時，每個有文章的 step 都已有對應數量的 `image-N.webp`，且 verify 仍通過。
