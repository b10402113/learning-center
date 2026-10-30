---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、teach-agent 讀素材設計 teaching plan、publisher 依計畫直接寫目標語言原稿與配圖清單、wrapper 插入 <!--image:N--> marker、publish 回寫，最後由 polish 潤飾。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--no-continuity]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--no-continuity]`.

這是一個 thin shell，依序派三個 subagent 完成一個 node：

```
prepare ─→ teach-agent ─→ publisher ─→ publish ─→ verify
            teaching-plan     原稿＋配圖
```

`src/article-cli.mjs` 只負責切片、保護 code、回寫與 verify。這條流程不呼叫圖片模型，也不建立 `<step>-assets/`。

- publisher 直接用 MEMORY 的 `language` 寫 teaching plan 與原稿；wrapper 只保護 code、插入 marker，不改散文。
- publish 之後跑 polish，文章品質在那一階段收斂。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 有 `root`、`nodeFile`、`teachingPlan`、`articleMode`；`steps[]` 每筆有 `id`、`title`、`purpose`、`index`、`material`、`original`、`plan`、`command`。`skipped[]` 是已有正文的 step，帶 `id`、`title`、`purpose`、`status`、`path`、`article`。

   `--force` 連已有正文的 step 也重做，並清掉該 step 的舊執行結果與舊 plan。

   完成標準：`steps.length + skipped.length` 等於 node 的 step 數。

3. **Teach：一個 node 派一次**

   派一個 `teach-agent`，給 `nodeFile`、`MEMORY.md`、`teachingPlan`、MEMORY 的 `language`，每個 ready step 的 `id`、`title`、`purpose`、`material`，以及 `skipped[]` 的 `article`。指示它用 skill tool 載入 `teach` skill，從 `MEMORY.md` 與 node goal 對齊學習者的 mission 與最近發展區，逐 step 讀完 material 的每個 slice，決定每一步的文章型別、概念順序、每節的讀者問題與帶行號引用的事實、例子、retrieval checkpoint、交棒，寫成一份 teaching plan。

   不要讓它問使用者問題或寫文章。完成標準：teaching plan 依 node 的 steps 順序，一步一節，Spine 與 steps 一致；每節的事實都有 `[[sources/…#Lx-Ly]]` 引用。

4. **Publisher：一個 node 派一次**

   派一個 `publisher` subagent，一次處理整個 node。不要逐篇派。

   派工給：

   - `root`、`nodeFile`、`nodeTitle`、`nodeGoal`、`teachingPlan`、MEMORY 的 `language`
   - `steps[]` 與 `skipped[]` 的完整內容
   - 一句：「用 skill tool 載入 `sepia-write` skill，綁定 `write` 操作；文章型別走 technical article，照 plan 的章節寫每一篇原稿。」
   - 一句：「依 `steps` 順序，先讀該 step 的 material 與 teaching plan 對應章節，再寫原稿與 1–5 項配圖清單，每篇寫完就執行該篇 `command`，再讀它回報的 `article` 路徑寫下一篇。」
   - 一句：「事實只能來自 material 與 plan 引用的事實；章節順序照 teaching plan，不自行增刪或重排。」
   - 一句：「`material`、`original`、`plan` 是絕對路徑，照字串使用，不要自己拼路徑。`anchor` 必須逐字出現在原稿裡。」
   - 一句：「原稿直接用 MEMORY 的 language 寫；配圖清單的 `heading`、`prompt` 也用同一語言。wrapper 只插 marker、不動散文。」
   - 一句：「依 teaching plan 的 Spine 與 `skipped[]` 的既有文章處理跨篇連貫；`--no-continuity` 時各篇獨立寫。」
   - 一句：「只處理這個 node，不讀其他 node 的內容。」

   帶 `--no-continuity` 時，把最後第二句換成「各篇獨立寫，不承接上一篇、不交棒給下一篇」。

   完成標準：`steps[]` 每一篇的 `command` 都回報 `status: completed`，而且每篇的 marker 數量等於該篇 plan 長度；`steps[]` 裡有 `index` 1 的那篇時，它要有前言章節。失敗就停，留在 `learn/<subject>/output/jobs/`。

5. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>] [--force]
   ```

   帶 `--force` 時，publish 也要一起帶，這樣成功寫入後才會清掉舊狀態。

   它還原被保護的 code block、把 H1 對齊 node plan、保留 `<!--image:N-->` marker、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有正文才把 node 標成 `written`，最後跑 verify。

   帶 `--force` 且寫入成功後，它會清掉該 step 舊的 `image-N.webp` 與 polish 紀錄。

   完成標準：`verify.pass` 為 `true`，而且 `step.md` 裡的 marker 還在。

6. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   `publish` 已經跑過一次；這裡是硬門檻。verify 沒過就回頭修 node 的 sources 或 purpose 再重跑，不要改生成物掩蓋問題。

7. **Report**：teaching plan 的 step 數與型別、每個 step 的 publish 狀態、publisher 回報的完成篇數與 marker 數量、verify 結果。

**不要手寫文章；不要手動加減 marker，也不要手動補圖片。**

Completion：每個該有文章的 step 都有 teaching plan 對應章節、H1 與 node plan 一致、每個新產的 step 都有正式 plan 且 marker 數量等於 plan 長度、新寫的 `index` 1 step 有前言章節、`node scripts/verify.mjs --node <subject>/<node>` exit 0。沒有圖片行是正常的。
