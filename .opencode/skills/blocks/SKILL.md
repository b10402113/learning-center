---
name: blocks
description: 把 written step 文章萃取成獨立 block：一個 node 一份共享 concept audit，確認一次（或用 -skip-check 跳過），CLI 直接讀相關 step 文章以 ELI5 寫 block、直接拿 concept markdown 生圖，最後 check 結束。
disable-model-invocation: true
argument-hint: "<subject> [--node <id> | --step <node>/<step>] [--audit] [--write] [--images] [--max-parallel <n>] [-skip-check] [--report] [--check] [--force]"
---

Invoke as `/blocks <subject> [--node <id> | --step <node>/<step>] [--audit] [--write] [--images] [--max-parallel <n>] [-skip-check] [--report] [--check] [--force]`.

把一個 subject 的已發布 step 文章萃取成 `learn/<subject>/blocks/` 下的獨立知識點。一個 block 是一個陌生讀者不讀 step 也能看懂的具名概念；step 仍是教學敘事，透過 `steps[].blocks` 連到 block。

## 預設流程

```text
audit → 確認一次 → write → images → apply → check → 結束
```

- 無 flag：跑完整流程。
- `--audit`：只做到 audit 表格。
- `--write`：做到 write，不產圖。
- `--images`：只補缺圖。
- `--max-parallel <n>`：生圖同時數量，預設 3。
- `-skip-check`：跳過人工確認，直接照 audit 寫。
- `--report`、`--check`：唯讀。
- `--force`：重寫既有 draft block 的本文與圖，不動 reviewed block 的散文。

只處理 `status: written` 且 step 文章有本文的 node。CLI 負責找檔案、coverage、drift；`block-agent` 只負責概念判斷與寫 audit。不要手寫 `coverage.json`、step 的 `blocks:` 或 block 本文。

## 1. Audit

```bash
node scripts/blocks.mjs audit --subject <subject> [--node <id>] [--step <node>/<step>] --json
```

看 manifest 的 eligible node/step、既有 `blocks[]`、以及 `skipped[]`，先回報數量和略過的項目。

每個 eligible node 派一個 `block-agent`（`subagent_type: block-agent`），只給它：

- subject、node id、mode `audit`。
- 該 node 的 `steps[]`（id、article、title、purpose、sources、現有 blocks）。
- subject 既有 `blocks[]`（含 `file` 路徑）。**先讀這份清單，close match 就打開 `file` 比對本文。**
- audit 路徑：`learn/<subject>/output/blocks/<node>.audit.json`。
- 一行：**一個 node 一份共享 concept 清單，最多 5 個 concept，不要按 step 分開列。**
- 一行：每個 concept 用 `steps: [...]` 記錄它由哪些 step 支撐；label 是名詞，句子放 `summary`。
- 一行：sources 必須是相關 step 有引用的 `[[sources/...#Lx-Ly]]`。
- 一行：**先看既有 block；能復用就 `reuse`，同義或涵蓋範圍相近就 `reuse`／`merge`，不要造 `tool-use` 這種和 `tool-calling` 差不多的新 block。**
- 一行：用 id／aliases／正規化 label 去重；撞到既有 id／alias／label 一律不得 `new`，真的說不準才標 `fuzzy`。
- 一行：只寫 audit 檔，然後跑 `node scripts/blocks.mjs audit --subject <subject> --node <node> --check` 到沒有 `[fail ...]`；這是它唯一能跑的指令。

Audit JSON：

```json
{
  "node": "tools-are-the-runbook",
  "concepts": [
    {
      "slug": "tool-calling",
      "label": "Tool Calling",
      "type": "concept",
      "summary": "模型透過結構化介面呼叫外部工具，再由 harness 執行。",
      "steps": ["classify-item-and-draft-reply"],
      "sources": ["[[sources/agent-harness/20260915/course/notes.txt#L40-L60]]"],
      "match": { "kind": "new" },
      "note": ""
    }
  ]
}
```

`match.kind` 是 `new | reuse | merge | fuzzy`。`reuse`／`merge` 要填 `match.block`。`fuzzy` 在確認時由人決定。

全部 audit 寫完後驗證：

```bash
node scripts/blocks.mjs audit --subject <subject> --check --json
```

有 fail 就把錯誤原文丟回同一個 node 的 agent 重寫。

## 2. 確認（`-skip-check` 可跳過）

讀 audit，依 node 分組印一張表：

| node / concept | label | type | steps | match | block |
| --- | --- | --- | --- | --- | --- |
| tools-are-the-runbook / tool-calling | Tool Calling | concept | classify-item… | reuse | tool-calling |
| tools-are-the-runbook / grounded-generation | Grounded Generation | concept | draft-reply | new | (new) |

表上方印：eligible steps、concept 數、new/reuse/merge/fuzzy 數、每個 node 超過 5 個而被延後的 concept。表下方列每個 fuzzy 與 merge，附一行建議。

請學習者確認整張表一次。`-skip-check` 直接略過。若被退回，修 audit 後重印，不要開始寫。

規則：**能復用一律先用既有 block**；同 id／alias／正規化 label 只能是 `reuse`，標成 `new` 會被 `audit --check` 擋下；兩個既有 block 同義才提 `merge`；fuzzy 不自動合併；同一概念出現在多個 step 只寫一個 block。

## 3. Write

對每個確認的 concept 呼叫一次，**不用 prepare、不用 material**：

```bash
node src/blocks-cli.mjs write --subject <subject> --node <node> --block <slug>
```

- 只讀 audit 裡 `steps` 指到的 step 文章，直接用 ELI5 方式寫成該 type 的固定章節。
- block 不存在時自動建立 draft frontmatter；已存在且有本文時只補 `steps[].blocks`，加 `--force` 才重寫。
- `reuse`／`merge` 的 concept 只連結既有 block，不重建。
- `reviewed` block 的散文永不改寫。

## 4. Images

把已發布的 concept markdown 直接交給生圖 CLI。**一個 node 呼叫一次**，CLI 會並行生成該 node 的 block，預設同時 3 張：

```bash
node src/blocks-cli.mjs image --subject <subject> --node <node> --max-parallel 3
```

例如 node 有 5 個新 block，會以 3 個 worker 跑完（3 → 2）。單一 block 用 `--block <slug>`，整個 subject 用 `--all-drafts`。

`image` 讀整篇 block markdown，生成 `blocks/<slug>-assets/image-1.webp`，插在 H1 後、第一個 `##` 前。一個 block 恰好一張圖；已有圖就重用，`--force` 才重畫。`--images` 只跑這一步。

## 5. Apply & check

```bash
node scripts/blocks.mjs apply --subject <subject>
node scripts/blocks.mjs check --subject <subject>
node scripts/verify.mjs --subject <subject>
```

`apply` 從 audit＋step `blocks:` 重建 `coverage.json`。`check` 印 drift（step 比 block 新、block 來源已不被引用、未覆蓋概念、孤兒 block、壞掉的 prerequisite）。有問題就回報，不要手改 `coverage.json`。完成後結束。

## 完成條件

- 每個 eligible node 有一份 node 級 audit，concept 數 ≤ 5，且每個 concept 都有非空的 `steps`。
- 表格確認過一次，或用了 `-skip-check`。
- 每個 `new` concept 有 draft block，`reuse` concept 連到既有 block，step `blocks:` 與 audit 一致。
- 每個 draft block 有本文、H1 等於 `title`、一張 hero 圖；reviewed block 未被重寫。
- `apply`、`check`、`verify` 都跑過且 verify 退出 0。
