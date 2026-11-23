---
name: article
description: 產生一個 node 的 step 文章：prepare 素材包、逐篇派 publisher 策展 material 並寫配圖清單、CLI compose 呼叫文字模型產 original.md、CLI mark 依 plan 插 <!--image:N--> marker、CLI 一次潤飾整個 node（連貫、去重、統一術語）、publish 回寫。當使用者要產生、重寫或補齊某個 node 的文章時使用。
disable-model-invocation: true
argument-hint: "<subject>/<node> [--step <id>] [--force] [--skip-polish]"
---

Invoke as `/article <subject>/<node> [--step <id>] [--force] [--skip-polish]`.

這是一個 thin shell：文章散文由 CLI 呼叫文字模型產生。`publisher` 一篇一篇策展 material（挑選、裁切來源文字與程式碼），標題由 `article-cli compose` 的模型依 `purpose` 決定，publisher 不傳也不選標題；`article-cli compose` 讀策展後的 material 寫出 `original.md`，publisher 讀 `original.md` 寫配圖清單，`article-cli mark` 依 plan 把 `<!--image:N-->` marker 插進文章。所有 step 的原稿都寫好後，`polish-article.mjs node` 把整個 node 一次送進文字模型：一次潤飾全部文章、讓它們互相連貫、刪掉重複內容、統一術語，順便潤飾每篇的配圖清單，再把 H1 寫回 node。`src/article-cli.mjs` 只負責寫文章、插 marker、回寫與 verify。這條流程會呼叫文字模型（compose 與 node polish），但不呼叫圖片模型，也不建立 `<step>-assets/`。

1. **Resolve the target.** 參數是 `subject/node`，在 repo root 執行。不要從敘述推測 subject 或 node。

2. **prepare**

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   輸出 JSON 的 `steps[]` 每筆有 `id`、`purpose`、`material`、`original`、`polish`、`plan`、`composeCommand`、`markCommand`；沒有 `title`，標題由 `composeCommand` 的模型決定。`composeCommand` 呼叫模型寫 `original.md`，`markCommand` 依 plan 插 marker。最外層還有 node 級的 `polishNodeCommand`（`node scripts/polish-article.mjs node --subject <s> --node <n>`；帶 `--skip-polish` 時字串結尾是 ` --copy`）。`skipped[]` 是已有內容的 step，含 `id`、`title`、`purpose`、`status`、`path`、`article`。
   `--force` 連已有內容的 step 也重做：清掉舊的 `original.md`、`polish.md`、`result.json`、`blocks.json`、`request.json`，讓舊 run 不能 publish；plan 保留，由 publisher 重寫。

   完成標準：`steps.length + skipped.length` 等於節點 step 數。publisher 會執行 `composeCommand`，主 agent 會執行 `polishNodeCommand`，所以 repo root 的 `.env` 需要 `TEXT_API_KEY`（或 `OPENAI_API_KEY`）。

3. **publisher：一個 step 派一次**

   依 `index` 順序，每個 step 各派一個新的 `publisher` subagent。不要一次把整個 node 交給同一個 agent。

   每次派工只給這幾項：

   - `id`、`purpose`、`material`、`original`、`polish`、`plan`、`composeCommand`、`markCommand`
   - 一句：「`material` 的 `purpose` 是這篇的主旨；用 Read 讀完 `material.course`、`material.supplement`（舊格式是 `material.sources`）裡的每個完整來源檔，`locator` 只是引用範圍，不是閱讀範圍。把策展結果覆寫回 `material`（每項保留 `path` 與 `locator`、確認或改正 `type`（`article`／`code`／`formula`）、加上 `text`；`course` 的散文要放引用範圍的完整文字，`course` 的程式碼與 `supplement` 可挑選裁切；`code` 只留約 10–25 行關鍵片段，中間用單獨一行 `...` 省略，每一行仍與來源一字不差；`formula` 只放 LaTeX 本身）。不要放 `title`，標題由 CLI 決定。然後執行 `composeCommand`——文章散文由它呼叫模型寫出 `original.md`，你不要自己寫。再讀 `original.md` 把 1–5 項配圖清單寫成 JSON 陣列到 `plan`（每項 `heading`、可選 `anchor`、`prompt`），執行 `markCommand` 插 marker，然後就結束。」
   - 一句：「`composeCommand` 會把 `material` 餵給文字模型產生 `original.md`，由模型依 `purpose` 決定 H1，不放任何 `<!--image:N-->` marker。`type: code` 與 `type: formula` 的內容由 CLI 用 placeholder 插入；程式碼會節選，太長時只留頭尾、中間以 `...` 省略。模型漏用 placeholder 時 compose 會帶著上一次草稿與漏掉的清單重試；三次仍缺就寫出草稿並回報 `status: draft`（`compose.json` 的 `missing` 列出漏掉的來源），不是失敗。遇到 `draft` 可讀 `original.md` 與 `missing`，必要時縮短素材重跑 `composeCommand`，否則直接沿用草稿繼續；不要自己改寫散文或手動編輯 `original.md`。」
   - 一句：「`markCommand` 依 `plan` 把 marker 插進 `original.md`；它不呼叫模型。」
   - 一句：「只寫這一篇，不要管其他 step。潤飾與連貫由主 agent 在整個 node 的原稿都寫好後統一處理，不要自己潤稿、不要改 node。」

   不要給其他 step 的內容。publisher 寫出來的就是一篇獨立的原稿。

   publisher 的完成標準：`composeCommand` 回報 `composed` 或 `draft`、`markCommand` 回報 `marked`，而且文章裡的 marker 數量等於 plan 長度。只有 compose 回報 `failed` 才停，留在 `learn/<subject>/output/<node>/<step>/`，不要進下一個 step。

4. **node polish**

   所有 publisher 回來後，跑一次 node 級的潤飾：

   ```bash
   node scripts/polish-article.mjs node --subject <subject> --node <node>
   ```

   它把這次 `prepare` 產出的每個 `original.md` 與配圖清單一起送進文字模型一次（太大時自動對半切包，切點只在 step 邊界）：一次改寫全部文章，讓每篇接住上一篇、刪掉重複的定義、統一術語，並潤飾 plan 的 `heading`／`prompt`。它寫入各步的 `polish.md`、必要時更新 plan、把 H1 寫回 node 的 step entry 與 `## Steps`，文章有變動就刪掉該步的 `<step>.quiz.json`。

   只改這次 prepared 的 step；已發布的鄰居只當唯讀上下文（node manifest 加前後相鄰那篇的頭尾摘錄），不會被寫入。已有 `polish.md` 的 step 會跳過，除非帶 `--force`。

   模型回覆的某篇沒通過驗證時，會退回單篇潤飾救援（最多兩次）；救援也失敗就把 `original.md` 原樣寫成 `polish.md`（`fallback: true`），`publish` 照常跑得完。回報的 `steps[]` 以 `status: polished` 或 `copied` 表示結果，`rescued: true` 表示走過救援，`fallback: true` 表示保底複製。

   帶 `--skip-polish` 時 `polishNodeCommand` 會是加上 `--copy` 的版本：它不呼叫模型，直接把每步的 `original.md` 原樣寫成 `polish.md`、plan 不動、H1 照樣回寫。

   完成標準：每個 prepared step 都有 `polish.md`，而且 node 的 step entry 與文章 H1 一致。

5. **publish**

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>] [--force]
   ```

   帶 `--force` 時，publish 也要一起帶，這樣成功寫入後才會清掉舊狀態。

   它讀 `polish.md`、把模型的 H1 寫回 node 的 step title、保留 `<!--image:N-->` marker、寫入 `learn/<subject>/nodes/<node>/<step>.md`，全部 step 有內容才把 node 標成 `written`，最後跑 verify。node 的 step title 以文章最終 H1 為準。它不呼叫圖片同步；非 `--force` 時不改動圖片檔。

   帶 `--force` 且寫入成功後，它會清掉該 step 舊的 `image-N.webp`（新文章只有 marker，舊圖已經對不上）、`<step>.quiz.json` 與 polish／humanize 紀錄；寫入失敗時，舊圖與紀錄都保留。publish 不會刪掉 publisher 剛寫好的 plan。

   完成標準：`verify.pass` 為 `true`，而且 `step.md` 裡的 marker 還在。

6. **verify**

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   `verify` 沒過就回頭修 node 的 sources 或 purpose 再重跑，不要改生成物掩蓋問題。

7. **Report**：把 prepare、publish、node polish 的 JSON 原樣整理給使用者，附上 verify 結果與走過救援或保底的 step。

**不要手寫文章；不要手動加減 marker，也不要手動補圖片。連貫與去重一律交給 `polish-article.mjs node`。**

Completion：每個該有文章的 step 都有、每一篇都先經過 `composeCommand`（模型寫出 `original.md`）、整個 node 跑過一次 `polishNodeCommand`（每篇都有 `polish.md`，plan 與 marker 未增減）、H1 與 step entry 一致、每個新產的 step 都有正式 plan 且 marker 數量等於 plan 長度、`node scripts/verify.mjs --node <subject>/<node>` exit 0。沒有圖片行是正常的。
