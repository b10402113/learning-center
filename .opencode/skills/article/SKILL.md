---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、逐篇派 publisher 策展 material 並寫配圖清單、CLI compose 呼叫文字模型產 original.md、CLI mark 依 plan 插 <!--image:N--> marker、publish 回寫、主 agent 補連續性。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--no-continuity]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--no-continuity]`.

這是一個 thin shell：文章散文由 CLI 呼叫文字模型一次產生。`publisher` 一篇一篇策展 material（挑選、裁切來源文字與程式碼），標題由 `article-cli compose` 的模型依 `purpose` 決定，publisher 不傳也不選標題；`article-cli compose` 讀策展後的 material 寫出 `original.md`，publisher 讀 `original.md` 寫配圖清單，`article-cli mark` 依 plan 把 `<!--image:N-->` marker 插進文章，再跑 `polish-article.mjs draft` 產出 `polish.md` 並潤飾 plan，最後 `titleCommand` 回寫標題。主 agent 最後補上 step 之間的連續性。`src/article-cli.mjs` 只負責寫文章、插 marker、回寫與 verify。這條流程會呼叫文字模型（compose 與 polish），但不呼叫圖片模型，也不建立 `<step>-assets/`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 的 `steps[]` 每筆有 `id`、`purpose`、`material`、`original`、`polish`、`plan`、`composeCommand`、`markCommand`、`polishCommand`、`titleCommand`；沒有 `title`，標題由 `composeCommand` 的模型決定。`composeCommand` 呼叫模型寫 `original.md`，`markCommand` 依 plan 插 marker。`skipped[]` 是已有內容的 step，含 `id`、`title`、`purpose`、`status`、`path`、`article`。
   `--force` 連已有內容的 step 也重做：清掉舊的 `original.md`、`polish.md`、`result.json`、`blocks.json`、`request.json`，讓舊 run 不能 publish；plan 保留，由 publisher 重寫。

   完成標準：`steps.length + skipped.length` 等於節點 step 數。publisher 會執行 `composeCommand` 與 `polishCommand`，所以 repo root 的 `.env` 需要 `TEXT_API_KEY`（或 `OPENAI_API_KEY`）。

3. **publisher：一個 step 派一次**

   依 `index` 順序，每個 step 各派一個新的 `publisher` subagent。不要一次把整個 node 交給同一個 agent。

   每次派工只給這幾項：

   - `id`、`purpose`、`material`、`original`、`polish`、`plan`、`composeCommand`、`markCommand`、`polishCommand`、`titleCommand`
   - 一句：「`material` 的 `purpose` 是這篇的主旨；用 Read 讀完 `material.course`、`material.supplement`（舊格式是 `material.sources`）裡的每個完整來源檔，`locator` 只是引用範圍，不是閱讀範圍。把策展結果覆寫回 `material`（每項保留 `path` 與 `locator`、確認或改正 `type`（`article`／`code`／`formula`）、加上 `text`；`course` 的散文要放引用範圍的完整文字，`course` 的程式碼與 `supplement` 可挑選裁切；`code` 只留約 10–25 行關鍵片段，中間用單獨一行 `...` 省略，每一行仍與來源一字不差；`formula` 只放 LaTeX 本身）。不要放 `title`，標題由 CLI 決定。然後執行 `composeCommand`——文章散文由它呼叫模型寫出 `original.md`，你不要自己寫。再讀 `original.md` 把 1–5 項配圖清單寫成 JSON 陣列到 `plan`（每項 `heading`、可選 `anchor`、`prompt`），執行 `markCommand` 插 marker，接著執行 `polishCommand`，最後執行 `titleCommand`。」
   - 一句：「`composeCommand` 會把 `material` 餵給文字模型產生 `original.md`，由模型依 `purpose` 決定 H1，不放任何 `<!--image:N-->` marker。`type: code` 與 `type: formula` 的內容由 CLI 用 placeholder 插入；程式碼會節選，太長時只留頭尾、中間以 `...` 省略。模型漏用 placeholder 時 compose 會帶著上一次草稿與漏掉的清單重試；三次仍缺就寫出草稿並回報 `status: draft`（`compose.json` 的 `missing` 列出漏掉的來源），不是失敗。遇到 `draft` 可讀 `original.md` 與 `missing`，必要時縮短素材重跑 `composeCommand`，否則直接沿用草稿繼續；不要自己改寫散文或手動編輯 `original.md`。」
   - 一句：「`markCommand` 依 `plan` 把 marker 插進 `original.md`；它不呼叫模型。」
   - 一句：「`polishCommand` 讀 `original`、寫 `polish.md`，並潤飾 plan 的 `heading`／`prompt`；保留 H1、marker、code 與連結，marker 數量與位置不變。模型潤飾失敗時會自動把 `original` 原樣寫成 `polish.md`、plan 保持原樣，回報 `copied` 加 `fallback: true`；這不是失敗，繼續跑 `titleCommand`。」
   - 一句：「`titleCommand` 把 H1 寫回 node 的 step entry 與 `## Steps` 標籤；不要用其他方式改 node。」
   - 一句：「只寫這一篇，不要管其他 step。」

   不要給其他 step 的內容、不要給上下課關係。publisher 寫出來的就是一篇獨立的文章。

   publisher 的完成標準：`composeCommand` 回報 `composed` 或 `draft`、`markCommand` 回報 `marked`、`polishCommand` 回報 `status: polished` 或 `copied`、`titleCommand` 回報 `updated` 或 `unchanged`，而且文章裡的 marker 數量等於 plan 長度。只有 compose 回報 `failed` 才停，留在 `learn/<subject>/output/<node>/<step>/`，不要進下一個 step。

4. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>] [--force]
   ```

   帶 `--force` 時，publish 也要一起帶，這樣成功寫入後才會清掉舊狀態。

   它讀 `polish.md`、把模型的 H1 寫回 node 的 step title、保留 `<!--image:N-->` marker、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有內容才把 node 標成 `written`，最後跑 verify。node 的 step title 以文章最終 H1 為準。它不呼叫圖片同步；非 `--force` 時不改動圖片檔。

   帶 `--force` 且寫入成功後，它會清掉該 step 舊的 `image-N.webp`（新文章只有 marker，舊圖已經對不上）、`<step>.quiz.json` 與 polish／humanize 紀錄；寫入失敗時，舊圖與紀錄都保留。publish 不會刪掉 publisher 剛寫好的 plan。

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

Completion：每個該有文章的 step 都有、每一篇都先經過 `composeCommand`（模型寫出 `original.md`）與 `polishCommand`（原稿與 plan 都已潤飾、marker 未增減）、publisher 已把標題寫回 node 且 H1 與 step entry 一致、每個新產的 step 都有正式 plan 且 marker 數量等於 plan 長度、連續性已處理（或依旗標跳過）、`node scripts/verify.mjs --node <subject>/<node>` exit 0。沒有圖片行是正常的。
