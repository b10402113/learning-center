---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、逐篇派 publisher 寫原稿與配圖清單、command 依 anchor 插入 <!--image:N--> marker、publish 回寫、主 agent 補連續性。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--no-continuity]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--no-continuity]`.

這是一個 thin shell：文章由 `publisher` 一篇一篇寫原稿，配圖位置直接放 `<!--image:N-->` marker，並寫出對應的配圖清單；先跑 `polish-article.mjs draft` 潤飾原稿與 plan（marker 保留），再由 `run-article-agent.mjs --markers-only`（direct mode）驗證 marker 與 plan 的數量、順序一致；主 agent 最後補上 step 之間的連續性。`src/article-cli.mjs` 只負責切片、保護 code、回寫與 verify。這條流程會呼叫文字模型（polish），但不呼叫圖片模型，也不建立 `<step>-assets/`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 的 `steps[]` 每筆有 `id`、`title`（尚未寫文章時是 `null`）、`purpose`、`material`、`original`、`plan`、`polishCommand`、`command`、`titleCommand`；`polishCommand` 潤飾原稿與配圖清單，`command` 已帶 `--markers-only`。`skipped[]` 是已有內容的 step，只會有 `id`、`title`、`status`、`path`。
   `--force` 連已有內容的 step 也重做，並清掉該 step 的舊執行結果與舊 plan。

   完成標準：`steps.length + skipped.length` 等於節點 step 數。publisher 會執行 `polishCommand`，所以 repo root 的 `.env` 需要 `TEXT_API_KEY`（或 `OPENAI_API_KEY`）。

3. **publisher：一個 step 派一次**

   依 `index` 順序，每個 step 各派一個新的 `publisher` subagent。不要一次把整個 node 交給同一個 agent。

   每次派工只給這幾項：

   - `id`、`title`、`purpose`、`material`、`original`、`plan`、`polishCommand`、`command`、`titleCommand`
   - 一句：「`material` 的 `purpose` 是這篇的主旨；用 Read 讀完 `material.sources` 的每個完整來源檔，`locator` 只是引用範圍，不是閱讀範圍。把原稿寫到 `original`，需要配圖的地方直接放 `<!--image:N-->` marker（單獨一行、前後空行、從 1 依序編號），把對應的 1–5 項配圖清單寫成 JSON 陣列到 `plan`（每項只有 `heading` 與 `prompt`，順序對應 marker），先執行 `polishCommand`，再執行 `command`。`title` 是 `null` 時，自己從來源裡實際出現的標題或句子選一個當 H1，不要發明。」
   - 一句：「`polishCommand` 會潤飾原稿與 plan 的 `heading`／`prompt`，並保留 H1、marker、code 與連結；marker 數量與位置不變。它失敗就停，不要自己改寫檔案繞過。」
   - 一句：「`command` 成功後執行 `titleCommand`，把 H1 寫回 node 的 step entry 與 `## Steps` 標籤；不要用其他方式改 node。」
   - 一句：「只寫這一篇，不要管其他 step。」

   不要給其他 step 的內容、不要給上下課關係。publisher 寫出來的就是一篇獨立的文章。

   publisher 的完成標準：`polishCommand` 回報 `status: polished`、`command` 回報 `status: completed`、`titleCommand` 回報 `updated` 或 `unchanged`，而且文章裡的 marker 數量等於 plan 長度。失敗就停，留在 `learn/<subject>/output/jobs/`，不要進下一個 step。

4. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>] [--force]
   ```

   帶 `--force` 時，publish 也要一起帶，這樣成功寫入後才會清掉舊狀態。

   它還原被保護的 code block、用 publisher 回寫到 node 的 step title 對齊 H1、保留 `<!--image:N-->` marker、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有內容才把 node 標成 `written`，最後跑 verify。若 plan 原本沒有 title，publish 會把文章的最終 H1 寫回 node。它不呼叫圖片同步；非 `--force` 時不改動圖片檔。

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

Completion：每個該有文章的 step 都有、每一篇都先經過 `polishCommand`（原稿與 plan 都已潤飾、marker 未增減）、publisher 已把標題寫回 node 且 H1 與 step entry 一致、每個新產的 step 都有正式 plan 且 marker 數量等於 plan 長度、連續性已處理（或依旗標跳過）、`node scripts/verify.mjs --node <subject>/<node>` exit 0。沒有圖片行是正常的。
