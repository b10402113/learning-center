---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、派一個 publisher 依原文語言寫完整個 node（含跨篇連貫）與配圖清單、逐篇翻成繁中並留下 <!--image:N--> marker、publish 回寫。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--mode translate|rewrite] [--force] [--no-continuity]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--mode translate|rewrite] [--force] [--no-continuity]`.

這是一個 thin shell：一個 `publisher` subagent 依 node 的 step 順序寫完每一篇原稿與配圖位置，並在寫作時處理跨篇連貫；wrapper 逐篇插入配圖位置、翻成繁中，留下 `<!--image:N-->` marker。`src/article-cli.mjs` 只負責切片、保護 code、回寫與 verify。這條流程不呼叫圖片模型，也不建立 `<step>-assets/`。

`--mode` 決定原稿怎麼處理：

- `translate`（預設）：publisher 用素材的主要語言寫原稿；wrapper 先依配圖清單插入 `<!--image:N-->`，再用 `prompts/translate.txt` 翻成繁中。素材已是繁中時跳過翻譯。
- `rewrite`：舊行為，publisher 直接寫繁中，article-agent 改寫並自己放 marker。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--mode translate|rewrite] [--force]
   ```

   輸出 JSON 有 `root`、`nodeFile`（node 計畫的絕對路徑）、`articleMode`；`steps[]` 每筆有 `id`、`title`、`purpose`、`material`、`original`、`plan`、`command`，前四項是絕對路徑，`command` 已帶絕對路徑、`--root`、`--mode` 與 `--markers-only`。`skipped[]` 是已有正文的 step，帶 `id`、`title`、`purpose`、`status`、`path`、`article`（已發布文章的絕對路徑）。
   `--force` 連已有正文的 step 也重做，並清掉該 step 的舊執行結果與舊 plan。

   完成標準：`steps.length + skipped.length` 等於 node 的 step 數。

3. **publisher：一個 node 派一次**

   派一個新的 `publisher` subagent，一次處理整個 node。不要逐篇派。

   派工只給這幾項：

   - `root`、`nodeFile`、`nodeTitle`、`nodeGoal`
   - `steps[]` 與 `skipped[]` 的完整內容
   - 一句：「依 `steps` 順序逐篇寫原稿與 1–5 項配圖清單，每篇寫完就執行該篇 `command`，再讀它回報的 `article` 路徑寫下一篇。」
   - 一句：「`material`、`original`、`plan` 是絕對路徑，照字串使用，不要自己拼路徑。`anchor` 必須逐字出現在原稿裡。」
   - 一句：「原稿用素材的主要語言寫，配圖清單的 `heading`、`prompt` 也用同一語言；wrapper 會翻成繁中，原稿不要自己翻。」
   - 一句：「依 `nodeFile` 與 `skipped[]` 的既有文章處理跨篇連貫；`--no-continuity` 時各篇獨立寫。」
   - 一句：「只處理這個 node，不讀其他 node 的內容。」

   帶 `--no-continuity` 時，把第三句換成「各篇獨立寫，不承接上一篇、不交棒給下一篇」。

   完成標準：`steps[]` 每一篇的 `command` 都回報 `status: completed`，而且每篇的 marker 數量等於該篇 plan 長度；`steps[]` 裡有 `index` 1 的那篇時，它要有前言章節。失敗就停，留在 `learn/<subject>/output/jobs/`。

4. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>] [--force]
   ```

   帶 `--force` 時，publish 也要一起帶，這樣成功寫入後才會清掉舊狀態。

   它還原被保護的 code block、把 H1 對齊 node plan、保留 `<!--image:N-->` marker、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有正文才把 node 標成 `written`，最後跑 verify。它不呼叫圖片同步；非 `--force` 時不改動圖片檔。

   帶 `--force` 且寫入成功後，它會清掉該 step 舊的 `image-N.webp`（新文章只有 marker，舊圖已經對不上）與 humanize 紀錄；寫入失敗時，舊圖與紀錄都保留。

   完成標準：`verify.pass` 為 `true`，而且 `step.md` 裡的 marker 還在。

5. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   `publish` 已經跑過一次；這裡是硬門檻。verify 沒過就回頭修 node 的 sources 或 purpose 再重跑，不要改生成物掩蓋問題。

6. **Report**：每個 step 的 publish 狀態、publisher 回報的完成篇數與 marker 數量、verify 結果。連貫問題在 publisher 階段處理，主 agent 不再編輯已發布文章。

**不要手寫文章；不要手動加減 marker，也不要手動補圖片。**

Completion：每個該有文章的 step 都有、H1 與 node plan 一致、每個新產的 step 都有正式 plan 且 marker 數量等於 plan 長度、新寫的 `index` 1 step 有前言章節、`node scripts/verify.mjs --node <subject>/<node>` exit 0。沒有圖片行是正常的。
