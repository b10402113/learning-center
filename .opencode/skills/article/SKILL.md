---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、逐篇派 publisher 寫原稿與配圖清單、article-agent 改寫並留下 <!--image:N--> marker、publish 回寫、主 agent 補連續性。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--no-continuity]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--no-continuity]`.

這是一個 thin shell：文章由 `publisher` 一篇一篇寫原稿並決定配圖位置，`article-agent` 用一次 rewrite 把配圖位置換成 `<!--image:N-->` marker；主 agent 最後補上 step 之間的連續性。`src/article-cli.mjs` 只負責切片、保護 code、回寫與 verify。這條流程不呼叫圖片模型，也不建立 `<step>-assets/`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 有 `root`（絕對路徑）；`steps[]` 每筆有 `material`、`original`、`plan`、`command`，前三個都是絕對路徑，`command` 已帶絕對路徑、`--root` 與 `--markers-only`。`skipped[]` 是已有內容的 step，只會有 `id`、`title`、`status`、`path`。
   `--force` 連已有內容的 step 也重做，並清掉該 step 的舊執行結果與舊 plan。

   完成標準：`steps.length + skipped.length` 等於節點 step 數。

3. **publisher：一個 step 派一次**

   依 `index` 順序，每個 step 各派一個新的 `publisher` subagent。不要一次把整個 node 交給同一個 agent。

   每次派工只給這幾項：

   - `root`、`title`、`purpose`、`material`、`original`、`plan`、`command`
   - 一句：「`material`、`original`、`plan` 是絕對路徑，照字串使用，不要自己拼路徑。把原稿寫到 `original`，把 1–5 項的配圖清單寫成 JSON 陣列到 `plan`，再執行 `command`。`anchor` 必須逐字出現在原稿裡。」
   - 一句：「只寫這一篇，不要管其他 step。」

   不要給其他 step 的內容、不要給上下課關係。publisher 寫出來的就是一篇獨立的文章。

   publisher 的完成標準：`command` 回報 `status: completed`，而且文章裡的 marker 數量等於 plan 長度。失敗就停，留在 `learn/<subject>/output/jobs/`，不要進下一個 step。

4. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>] [--force]
   ```

   帶 `--force` 時，publish 也要一起帶，這樣成功寫入後才會清掉舊狀態。

   它還原被保護的 code block、把 H1 對齊 node plan、保留 `<!--image:N-->` marker、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有內容才把 node 標成 `written`，最後跑 verify。它不呼叫圖片同步；非 `--force` 時不改動圖片檔。

   帶 `--force` 且寫入成功後，它會清掉該 step 舊的 `image-N.webp`（新文章只有 marker，舊圖已經對不上）與 humanize 紀錄；寫入失敗時，舊圖與紀錄都保留。

   完成標準：`verify.pass` 為 `true`，而且 `step.md` 裡的 marker 還在。

5. **連續性編修（主 agent）**

   只有一個 step、或帶 `--no-continuity` 時跳過。否則依 node plan 的順序讀完全部文章，直接編修 `learn/<subject>/nodes/<node>/<step>.md`：

   - 第一篇的開頭不用改；之後每一篇的開頭要接住上一篇留下的問題或結論。
   - 每一篇的結尾把下一個問題交給下一篇；最後一篇收在自己的結論。
   - 同一個術語只在第一次出現的那一篇完整解釋，之後統一用詞，重複的定義刪掉。
   - 同一個例子或情境延續使用，前後稱呼一致。
   - 不要新增素材沒支持的事實、數字或引述。
   - 只改散文。H1、code fence 與 provenance 註解、`<!--image:N-->` 行、既有圖片行與 caption、`quiz` block 一律原封不動，也不要搬動段落順序。

   完成標準：任取相鄰兩篇，上一篇的結尾與下一篇的開頭讀得懂彼此的關係，而且沒有重複解釋同一個術語。

6. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   連續性編修後一定要重跑。`verify` 沒過就回頭修 node 的 sources 或 purpose 再重跑，不要改生成物掩蓋問題。

7. **Report**：把每一步的 JSON 原樣整理給使用者，附上連續性改了哪些地方與 verify 結果。

**除了第 5 步的連續性編修，不要手寫文章；不要手動加減 marker，也不要手動補圖片。**

Completion：每個該有文章的 step 都有、H1 與 node plan 一致、每個新產的 step 都有正式 plan 且 marker 數量等於 plan 長度、連續性已處理（或依旗標跳過）、`node scripts/verify.mjs --node <subject>/<node>` exit 0。沒有圖片行是正常的。
