# 計畫：把 step 知識點萃取成 block，並在 course-app 顯示知識圖

## 0. 摘要

新增 `/blocks` skill，把 `learn/<subject>` 的 step 文章萃取成獨立、可單獨閱讀的知識點（block），放進 `learn/<subject>/blocks/`。

- 每個 block 是一個有名字的知識點：`Agent`、`Blockchain`、`Bubble Sort`、`Tool Calling`、`Single Responsibility Principle`。
- 陌生人不先讀 step，也能看懂一個 block。
- step 透過 `blocks:` 連到知識點；閱讀 step 時右側顯示本步知識點。
- block 之間用 `prerequisites` / `related` 建立關係，形成 Obsidian 式知識圖。
- 用 `coverage.json` 盤點每個 step 的 concept，量化「還要多少 block 才能 cover 整門課」。
- 退役 `edges`，block 成為唯一的知識關係層。
- course-app 新增 block 詳情頁、block 索引／圖頁，以及 step 頁右側欄。

Phase 1（skill、schema、verify、block 頁、右側欄）與 Phase 2（graph）都在這次範圍內；實作仍照第 13 節順序，先讓內容與右側欄跑通，再接 graph。

---

## 1. 背景與現況

### 1.1 現在的內容結構

- `learn/<subject>/nodes/<node>.md` 是 node 容器，frontmatter 的 `steps` 陣列是教學計畫。
- `learn/<subject>/nodes/<node>/<step>.md` 是 step 文章，無 frontmatter，第一行是 H1。
- step 的 `sources` 指向 `sources/<subject>/<date>/course|supplement/` 的 `.txt` 行號。
- `course-app` 用 `course-app/scripts/build-data.mjs` 預先產生 JSON；step 全文直接塞進 subject JSON。
- step 頁目前只有左側導覽、單欄 1040px，沒有右側欄。
- 現有 graph 只有 roadmap 的手刻 SVG，沒有 graph 函式庫。

### 1.2 現在沒有的東西

- 沒有 `learn/<subject>/blocks/`；`verify.mjs` 目前完全忽略這個目錄（只會擋 `.mdx`）。
- 沒有 block schema、沒有 block 路由、沒有知識圖。
- `edges/` 沒有任何實際檔案；`/edges` skill 只有文件，`verify` 也沒有 edge 檢查。
- `course-app` 沒有 `d3`、`cytoscape`、`react-flow`、`force-graph` 等依賴。

### 1.3 這次要解決的問題

- step 是教學敘事，讀者很難從中抽出「獨立知識點」。
- 同一個概念常散落在多個 step，沒有單一 canonical 條目。
- 沒有量化方法回答「這門課還缺哪些知識點」。
- 概念之間的先備與相關關係沒有地方放。

---

## 2. 已定決策

| # | 決策 | 說明 |
| --- | --- | --- |
| D1 | block 是分型知識點 | `concept` / `procedure` / `principle` / `contrast`；以 `concept` 為主，每個 step 目標 3–6 個；確認後一個 node 最多連結 5 個 block |
| D2 | block 是獨立層 | step 仍是教學主體；block 從 step 與原始碼蒸餾，內容可重複，但必須 standalone |
| D3 | step 端存連結 | node 的 step entry 增加 `blocks: [id]`；build 反推 backlinks |
| D4 | block 內文固定骨架 | 每個 type 有自己的必要 `##` 區塊 |
| D5 | block 有 canonical 名字 | `label` 是名詞／專有名詞，不是句子；`summary` 才是一句話解釋 |
| D6 | 檔案按 subject 分 | `learn/<subject>/blocks/<id>.md`；跨 subject 以 `<subject>/<id>` 識別；v1 graph 只畫單 subject |
| D7 | 用 concept 盤點算 coverage | `blocks/coverage.json` 記錄每個 written step 的 concept 與對應 block |
| D8 | 重複概念合併 | canonical id 不變；舊 id 進 `aliases`；改寫所有參照；模糊合併需人工確認 |
| D9 | 關係只有兩種 | `prerequisites` 有向、`related` 無向；inline `[[block-id]]` 只當導覽 |
| D10 | 退役 edges | 刪 skill 與 active 文件提及；歷史 ADR/spec 保留 |
| D11 | graph 用 d3-force | 只做模擬，畫面沿用現有 SVG 視覺語言 |
| D12 | block 有獨立頁與索引頁 | `/blocks/<id>` 詳情；`/blocks` 清單＋圖 |
| D13 | step 頁有右側欄 | `xl` 以上 sticky 右欄；以下改成文章後的可折疊卡片 |
| D14 | block 可更新但保護人工編輯 | `status: draft | reviewed`；`--force` 只重生 draft；reviewed 要 `--rewrite` |
| D15 | 確認粒度是整個 subject | audit 後彙整成一張 subject 級表格，一次確認；`--yes` 可跳過 |
| D16 | 一個 node 一個 block-agent | 同一個 agent 先 audit 再 write，避免重讀來源 |
| D17 | verify 管格式與連結 | block 格式、section、sources、關係、step `blocks`、coverage 一致性都硬檢查 |
| D18 | coverage.json 進版控 | 放 `learn/<subject>/blocks/coverage.json`；audit 中間檔放 `output/` |
| D19 | 只處理 written step | 沒有文章 body 的 step 跳過；短 step 允許 1–2 個 concept 並註明原因 |
| D20 | 右側欄用 summary | block frontmatter 必填 `summary`（一句話、≤120 字） |
| D21 | block 全文 lazy load | subject JSON 只放 summary 與 graph 邊；全文放 per-block JSON |
| D22 | graph 與右側欄都做 | 不是先後二選一；實作順序仍先 skill／右側欄，再 graph |

---

## 3. 非目標

- 不改 `sources/`，不改既有 step 的散文。
- 不把 step 重構成 block 的排列組合。
- 不做跨 subject graph（資料模型保留）。
- 不合併 block 後做舊 URL redirect。
- 不支援 block 配圖。
- 不讓 coverage 缺口成為 verify 硬失敗。
- 不做 build-time 自動 drift 重生。
- 不改 `legacy/`。

---

## 4. 名詞與檔案位置

```text
learn/<subject>/
├── blocks/
│   ├── <block-id>.md
│   └── coverage.json
├── nodes/<node>.md
│   └── steps[].blocks: [block-id, ...]
└── output/blocks/<node>.audit.json     ← gitignored
```

- block id：英文 kebab-case，例：`agent`、`blockchain`、`bubble-sort`、`tool-calling`。
- 同一 subject 內唯一；跨 subject 以 `<subject>/<id>` 識別。
- `title` 是顯示名稱；英文術語用 `English Term（中文）`。
- `label` 是知識點的名字；必須是名詞／專有名詞。

### 4.1 `label` / `title` / `slug` / `summary` 的職責

- `label`：學界或業界慣用的名詞／專有名詞，1–4 個詞。不得是句子、不得有動詞指令、不得用「如何…」「先…」這種描述。
- `title`：顯示名稱，通常等於 `label`；需要時加中文翻譯。
- `slug`：由英文術語產生的 kebab-case；中文-only 術語用約定英文譯名。
- `summary`：唯一可以放完整句子的地方，一句話解釋這個知識點。

正確例子：

| slug | label | title | type | summary |
| --- | --- | --- | --- | --- |
| `agent` | Agent | Agent | concept | 能感知環境並採取行動以達成目標的系統。 |
| `blockchain` | Blockchain | Blockchain（區塊鏈） | concept | 以密碼學雜湊串接區塊的分散式帳本。 |
| `bubble-sort` | Bubble Sort | Bubble Sort（氣泡排序） | procedure | 反覆比較相鄰元素並交換，直到序列有序。 |
| `tool-calling` | Tool Calling | Tool Calling（工具呼叫） | procedure | 模型透過結構化介面呼叫外部工具的流程。 |
| `single-responsibility-principle` | Single Responsibility Principle | Single Responsibility Principle（單一職責原則） | principle | 一個模組只應該有一個改變的理由。 |
| `tcp-vs-udp` | TCP vs UDP | TCP vs UDP | contrast | 可靠有序與低延遲不可靠之間的傳輸權衡。 |

錯誤例子（不要用）：

- `label: 先固定輸出 schema 讓模型可驗證`：這是句子，應改成 `Structured Output`，句子放 `summary`。
- `label: 如何避免模型亂回答`：這是問題，不是名詞；應改成 `Grounding` 或 `Hallucination`。
- `label: 有依據的草稿`：這是描述；應改成 `Grounded Generation`。

`contrast` 是唯一允許 `A vs B` 形式的 label，但 A、B 本身仍必須是名詞。

---

## 5. Block 檔案格式

### 5.1 Frontmatter

```yaml
---
id: structured-output
title: "Structured Output（結構化輸出）"
subject: agent-harness2
type: concept            # concept | procedure | principle | contrast
status: draft            # draft | reviewed
summary: "先固定輸出 schema，讓模型的行為可被驗證與組合。"
aliases:
  - structured-output-contract
prerequisites:
  - tool-calling
related:
  - json-mode
sources:
  - "[[sources/agent-harness2/20261029/...txt#L20-L30]]"
created: 2026-11-06
updated: 2026-11-06
---
```

規則：

- `id` 必須等於檔名；`subject` 必須等於所在資料夾。
- `type`、`status` 為固定 enum。
- `summary` 必填、一句話、≤120 字。
- `sources` 至少一個；locator 走既有 source／digest 規則；block 的主張必須可追溯。
- `prerequisites` 有向、`related` 無向（build 對稱化）；兩者限同 subject、不得指自己、`prerequisites` 不得成環。
- `aliases` 容納合併後的舊 id 與同義詞；不得和另一個 block 的 `id` 衝突。
- `status` 由人工從 `draft` 改成 `reviewed`；批次流程不會自動改。

### 5.2 內文骨架

每個 type 的必要 `##` 區塊如下；缺一節 verify 失敗。可在最後自行加節。

| type | 必要區塊 |
| --- | --- |
| `concept` | 定義 / 為什麼重要 / 如何運作 / 例子 / 邊界與常見誤解 / 進階 |
| `procedure` | 問題 / 前置條件 / 步驟 / 例子 / 失敗模式 / 進階 |
| `principle` | 主張 / 為什麼成立 / 適用範圍 / 反例 / 進階 |
| `contrast` | A 是什麼 / B 是什麼 / 關鍵差異 / 何時用哪個 / 進階 |

- 內文用繁中、短段落；開頭不假設讀者讀過任何 step。
- 術語要嘛 inline 定義，要嘛用 `[[block-id]]` 連到別的 block，但不強迫跟讀。
- 允許程式碼；code block 沿用文章的 provenance 規則（`<!-- source: ... -->` 或 `<!-- derived -->`）。
- v1 不支援 block 配圖。
- `[[block-id]]` 只當導覽連結，不自動產生 graph 邊；graph 邊只來自 frontmatter。
- inline `[[block-id]]` 必須同 subject；`[[id|label]]` 也支援。

---

## 6. Step entry 與 coverage.json

### 6.1 Step entry

node frontmatter 的 step 增加可選欄位：

```yaml
steps:
  - id: classify-item-and-draft-reply
    purpose: "..."
    sources: [...]
    blocks:
      - tool-calling
      - structured-output
```

- 同 subject 內用裸 id。
- 可選：允許尚未完全覆蓋的 step。
- verify 檢查 id 存在、同 subject、不重複。

### 6.2 coverage.json

只存 step 端的 concept 清單；distinct 統計由 script 推導。

```json
{
  "subject": "agent-harness2",
  "generatedAt": "2026-11-06",
  "steps": {
    "tools-are-the-runbook/classify-item-and-draft-reply": {
      "concepts": [
        {
          "slug": "tool-calling",
          "label": "Tool Calling",
          "sources": ["[[sources/...#L20-L30]]"],
          "block": "tool-calling",
          "note": ""
        },
        {
          "slug": "grounded-generation",
          "label": "Grounded Generation",
          "sources": ["[[sources/...#L32-L45]]"],
          "block": null,
          "note": ""
        }
      ]
    }
  }
}
```

- `block: null` = 尚未覆蓋。
- `block` 必須存在於 `blocks/`。
- 少於 3 個 concept 的短 step 在 `note` 寫原因。
- 只收錄 `written` 且有文章 body 的 step。
- 合併 block 時，所有指向舊 id 的 `block` 一起改寫。
- coverage 有 block 的 concept，該 step 的 `blocks:` 必須包含該 block；反向也必須一致。

### 6.3 audit 中間檔

`learn/<subject>/output/blocks/<node>.audit.json`（`output/` 已被 gitignore）：

```json
{
  "node": "tools-are-the-runbook",
  "steps": {
    "classify-item-and-draft-reply": {
      "concepts": [
        {
          "slug": "tool-calling",
          "label": "Tool Calling",
          "sources": ["[[sources/...#L20-L30]]"],
          "match": { "kind": "reuse", "block": "tool-calling" },
          "note": ""
        }
      ]
    }
  }
}
```

- `match.kind`：`new` / `reuse` / `merge` / `fuzzy`。
- `apply` 讀 confirmed audit 與 step entry，寫出 `coverage.json`。

---

## 7. 關係模型與 graph

### 7.1 邊

- `prerequisites`：有向，表示「先讀這個 block」。
- `related`：無向，build 時對稱化。
- graph 只有這兩種邊；`contrast` 用 block type 表達，不再另建邊。
- inline `[[block-id]]` 是閱讀導覽，不是 graph 邊。
- 同 subject、無自指、prerequisites 無環；verify 硬檢查。

### 7.2 Graph 頁

- 路由：`/learning-center/<subject>/blocks`，清單／圖切換。
- `d3-force` 只做模擬；渲染用 SVG，沿用 `RoadmapCanvas` 的視覺語言。
- 固定 seed，讓每次版面一致。
- 互動：拖曳、縮放、hover 高亮一階鄰居、點擊開 block 頁。
- 篩選：type 篩選、搜尋；v1 不做複雜 filter 面板。
- Node 大小可依 degree；顏色依 type；邊的線型區分 prerequisite 與 related。

---

## 8. 覆蓋率公式

令：

- `P` = 所有 step 的 `(step, concept)` pair，step 內先去重。
- `covered(p)` = 該 concept 的 `block` 非 null。
- `D` = distinct concept slug 集合。

計算：

- **Step coverage** = `|{p ∈ P : covered(p)}| / |P|`
  - 同一個概念被 3 個 step 用到就貢獻 3 次分母；回答「每一步是否被 cover」。
- **Course coverage** = `|{c ∈ D : 至少一個 pair 被 cover}| / |D|`
  - 回答「整門課還缺哪些知識點」。
- **目前 block 數** = coverage.json 中 distinct 非 null `block` id 數。
- **補齊後 projected block 數** = `|D|`；預設 1 concept = 1 block；當一個 block 覆蓋多個 concept slug（例如 `contrast`、不可分割的 `procedure`，或 alias）時，報告扣掉節省量。
- **Reuse factor** = `|P| / |D|`。

範例：

- Step A：`Tool Calling` covered、`Structured Output` covered、`Grounded Generation` null
- Step B：`Tool Calling` covered、`Classification` null

`|P| = 5`、covered pairs = 3 → Step coverage 60%。
`|D| = 4`、covered distinct = 2 → Course coverage 50%。
目前 block 數 = 2；projected = 4；reuse factor = 1.25。

目標：

- 每步至少 3 個 concept；短 step 可 1–2 並註明原因。
- Course coverage 100% 是長期目標。
- v1 只報告、不讓 verify 硬失敗。

---

## 9. `/blocks` skill 與 block-agent

### 9.1 介面

```text
/blocks <subject> [--node <id> | --step <node>/<step>]
         [--audit] [--write] [--report] [--check]
         [--refresh <block-id>] [--rewrite <block-id>]
         [--force] [--yes]
```

沒有 mode flag 時：audit → 確認 → write → report。

### 9.2 流程

1. **Audit**（預設）
   - 每個 node 派一個 `block-agent`。
   - 讀該 node 的 written step 與引用來源。
   - 每步產出 3–6 個 concept（`slug`、`label`、`sources`、候選 `new` / `reuse` / `merge` / `fuzzy`）。
   - 寫入 `output/blocks/<node>.audit.json`；不改任何正式檔。
2. **確認**
   - 主 agent 把所有 node 的 audit 彙整成一張 **subject 級表格**（依 node 分組，只列 new / reuse / merge / uncovered）。
   - 使用者一次確認；`--yes` 跳過。
3. **Write**
   - `block-agent` 建立缺少的 block（`status: draft`）、更新 node 的 step `blocks:`。
   - 主 agent 跑 `node scripts/blocks.mjs apply --subject <s>` 重算 `coverage.json`、改寫合併參照。
   - 跑 `verify`。
4. **Report**
   - `node scripts/blocks.mjs report --subject <s>` 印 Step/Course coverage、目前 block 數、projected、reuse factor、未覆蓋清單。
5. **Check**
   - `node scripts/blocks.mjs check --subject <s>` 印 drift。

### 9.3 重複與合併

- 先比對既有 block 的 `id`、`aliases`、正規化標題；命中就 reuse。
- 模糊候選只列進 audit，人工確認才合併。
- 合併：canonical id 不變；舊 id 進 `aliases`；改寫所有 step `blocks` 與 block `prerequisites` / `related`。
- v1 不做舊 URL redirect。
- 同一 step 內重複 concept 直接去重。

### 9.4 更新與 drift

- `--force`：只重生 `status: draft` 的 block。
- `--rewrite <id>`：重生 `reviewed` block，先顯示 diff 並要求確認。
- `--refresh <id>`：drift 後針對單一 block 重生，先顯示 diff；draft 可直接寫，reviewed 需改用 `--rewrite`。
- build 與 `verify` 不會自動改 block 內容。
- `--check` 報告：
  - step 文章 `updated` 晚於 block。
  - block 的來源已不被該 step 引用。
  - coverage 有 concept 沒 block。
  - block 沒有任何 step 使用。
  - prerequisite 斷鏈或成環。

### 9.5 收錄範圍

- 只處理 `written` 且有文章 body 的 step；其餘跳過並列在報告。
- 每步目標 3–6 個 concept；短 step 允許 1–2 並在 coverage.json 寫 `note`。
- 確認後一個 node 最多連結 5 個 block；被裁到 5 個以下的 step 在 coverage.json 寫 `note` 說明。
- 超過 6 個只取最重要的 6 個並標 `concept-overflow`，不自動拆 step。

### 9.6 `block-agent`

- 定義：`.opencode/agent/block-agent.md`。
- 輸入：node id、step ids、引用來源、既有 block。
- 輸出：`output/blocks/<node>.audit.json`；確認後寫 block `.md` 與 step entry。
- 不得改 step 散文、不得新增來源、不得 invent 事實。
- 必須套用 dedupe 規則；模糊候選留給人確認。
- 所有主張要能追溯到 `sources`。

---

## 10. verify 新增檢查

### 10.1 硬失敗

- block frontmatter 必填、`id` 等於檔名、`subject` 正確。
- `type`、`status` enum；`summary` 非空且 ≤120 字。
- `label` 非空、≤40 字、不含 `。！？；`、不含換行。
- `slug` 符合 `^[a-z0-9]+(-[a-z0-9]+)*$`。
- 各 type 必要 section 存在。
- `sources` 至少一個、locator 合法、digest 覆蓋正確。
- `prerequisites` / `related` 目標存在、同 subject、無自指；prerequisites 無環。
- `aliases` 型別正確，且不與其他 block id 衝突。
- inline `[[block-id]]` 目標存在。
- code block provenance。
- step `blocks` 為字串陣列、id 存在、同 subject、不重複。
- `coverage.json` 存在於有 `blocks` 的 subject；step key 存在且為 written；concept 的 `block` 存在或 null；同 step 無重複 slug；有 block 的 concept 必須反向出現在該 step 的 `blocks`。

### 10.2 只報告、不擋

- Course/Step coverage 缺口。
- 少於 3 個 concept 的 step。
- 沒有被任何 step 使用的 orphan block。

### 10.3 檔案

- 新增 `src/blocks.mjs`：parse frontmatter、validate block、coverage 計算、drift 判斷。
- 新增 `scripts/blocks.mjs`：
  - `apply --subject <s>`：讀 audit + step entries，寫 coverage.json，改寫合併參照。
  - `report --subject <s>`：印 coverage 統計。
  - `check --subject <s>`：印 drift。
- `scripts/verify.mjs` 匯入 `src/blocks.mjs` 的檢查。
- 補 negative fixtures。

---

## 11. course-app

### 11.1 build-data 輸出

`course-app/scripts/build-data.mjs` 新增：

- 讀 `learn/<subject>/blocks/*.md`、`blocks/coverage.json`、node step 的 `blocks:`。
- subject JSON 只放：
  - `blocks`: `{ id, title, summary, type, status, prerequisites, related, steps }`
  - `blockEdges`: `{ from, to, kind: "prerequisite" | "related" }`
  - step 的 `blocks`: 對應的 summary 陣列
- 每個 block 全文另存 `course-app/src/data/blocks/<subject>/<id>.json`：
  - `{ id, title, summary, type, status, aliases, prerequisites, related, sources, bodyMd, steps, backlinks }`
- 生成前清掉對應的 generated 目錄，避免 stale。
- subject JSON 不放 block 全文。

### 11.2 路由

```text
/learning-center/<subject>/blocks          → block 索引 + graph
/learning-center/<subject>/blocks/<id>     → block 詳情
```

- `route.mjs` 目前最多 3 段，這兩個路由剛好符合；但第二段的 `blocks` 要視為保留字，避免和名為 `blocks` 的 node 衝突。
- `SubjectOverview` 增加「知識圖」入口。

### 11.3 元件

- `BlockView.jsx`：標題、type/status badge、summary、Markdown 內文、prerequisites、related、backlinks（哪些 step 用到、哪些 block 指過來）、sources。
- `BlocksIndex.jsx`：清單／圖切換。
- `BlockGraph.jsx`：`d3-force` + SVG；固定 seed；拖曳、縮放、hover 高亮一階鄰居、點擊開 block 頁；type 篩選與搜尋。
- `BlockRail.jsx`：step 頁右側欄。
  - `xl` 以上：sticky 右欄，列出 3–6 張卡（type badge + title + summary）。
  - 不在本步的 prerequisite 加「先備」chip。
  - 點擊導覽到 block 頁。
  - `xl` 以下：文章後、自我檢查前的「本步知識點」可折疊卡片。
- `Markdown.jsx`：
  - 把 `[[block-id]]` 轉成 app 內連結。
  - intercept 內連結走 SPA 導覽，避免整頁重載。
- `StepView.jsx`：加入右側欄；`App.jsx` 加 block 路由與狀態。
- `package.json`：新增 `d3-force`。

### 11.4 版面

- step 頁在 `xl` 變成 `minmax(0, 1fr) 280px` grid；main 最大寬度調到約 1320px，文章欄不得被壓到難以閱讀。
- 右欄 sticky offset 對齊 header + 閱讀進度條（`top-[3.625rem]`）。
- `xl` 以下維持單欄；「本步知識點」卡片放在文章後、自我檢查前。

### 11.5 資料載入

- subject JSON 只含 block summary 與 graph 邊。
- block 全文用 `import.meta.glob("./data/blocks/*/*.json")`，開 block 頁才載。
- 右側欄與 graph 不需要全文。

---

## 12. edges 退役

- 刪 `.opencode/skills/edges/`。
- 移除 `AGENTS.md` / `CLAUDE.md` 的 edge 段與 pipeline 提及；歷史 ADR/spec 保留。
- 目前 `learn/*/edges/` 為 0 個檔案，無內容需要遷移。
- `verify.mjs` 沒有 edge 檢查，無需改 script。
- `README.md` 若有 `/edges` pipeline 描述，一併移除。

---

## 13. 實作順序

Phase 1 與 Phase 2 都在這次範圍；照以下順序落地。

1. **文件與 schema**
   - 更新 `AGENTS.md`：block 格式、step `blocks`、`/blocks` pipeline、退役 edges。
   - 移除 `.opencode/skills/edges/` 與 active 文件提及。
2. **核心模組**
   - 新增 `src/blocks.mjs`：parse、validate、coverage、drift。
   - 新增 `scripts/blocks.mjs`：`apply` / `report` / `check`。
   - 補 `scripts/verify.mjs` 檢查與 negative fixtures。
3. **Skill 與 agent**
   - 新增 `.opencode/skills/blocks/SKILL.md`。
   - 新增 `.opencode/agent/block-agent.md`。
4. **Pilot**
   - 選一個 subject 跑 `/blocks`（本實作用 `ai-agent-workflows`）。
   - 確認 audit 表格、coverage 數字、block 品質。
5. **course-app**
   - 改 `build-data.mjs` 產生 subject summary、block JSON、graph edge。
   - 加 block 路由、`BlockView`、`BlocksIndex`、`BlockGraph`、`BlockRail`。
   - `Markdown.jsx` 支援 `[[block-id]]` 與內連結。
6. **驗收**
   - `node scripts/verify.mjs --subject <subject>`
   - `node scripts/blocks.mjs report --subject <subject>`
   - `node scripts/blocks.mjs check --subject <subject>`
   - `npm --prefix course-app run gen`
   - `npm --prefix course-app test`
   - `npm --prefix course-app run build`
   - 手動看 step 右側欄、block 頁、graph 頁。

---

## 14. 測試與驗收

### 14.1 單元測試

| 測試檔 | 測什麼 |
| --- | --- |
| `src/blocks.test.mjs`（新增） | parse、frontmatter enum、section、sources、relations、coverage 公式、drift |
| `scripts/blocks.test.mjs`（新增） | `apply` 寫 coverage、合併改寫、`report`、`check` |
| `scripts/verify.test.mjs` | block 格式、step `blocks`、coverage 一致性、negative fixtures |
| `course-app/scripts/build-data.test.mjs` | block summary、per-block JSON、graph edge、step.blocks |

### 14.2 手動驗收

1. 對 pilot subject 跑 `/blocks`，確認：
   - audit 表格的 label 都是名詞，不是句子。
   - coverage 有 Step/Course 兩個數字。
   - 每個 block 不讀 step 也看得懂。
2. `verify` 綠。
3. course-app：
   - step 頁 `xl` 有右側欄，點 block 開詳情頁。
   - `xl` 以下有可折疊的「本步知識點」。
   - block 頁有 prerequisites、related、backlinks、sources。
   - `/blocks` 索引頁可切換清單／圖，graph 可拖曳、縮放、hover、點擊。
4. 重跑 `/blocks --check`，確認 drift 報告合理。
5. `--force` 只動 draft block；`--rewrite` 才動 reviewed。

### 14.3 驗收標準

- [ ] 每個 written step 的 audit 有 3–6 個 concept；確認後 node 最多連結 5 個 block，短 step 或被裁減的 step 在 coverage 註明原因。
- [ ] 每個 concept 的 `label` 都是名詞／專有名詞。
- [ ] block 不依賴 step 也能讀懂。
- [ ] step `blocks`、coverage.json、block frontmatter 三邊一致。
- [ ] `prerequisites` 無環、`related` 對稱、目標都存在。
- [ ] coverage 報告能回答「目前 block 數 / 補齊後 block 數 / 兩個 coverage」。
- [ ] step 頁右側欄、block 頁、索引頁、graph 頁都能用。
- [ ] `edges` skill 與 active 文件提及已移除。
- [ ] `verify`、`course-app test`、`course-app build` 全綠。

---

## 15. 風險與防護

| 風險 | 防護 |
| --- | --- |
| label 變成句子 | audit 硬規則＋reviewer rubric；verify 擋長度與句末標點 |
| block 只是 step 摘要 | 固定骨架＋standalone 檢查；block 直接引用來源，不只看文章 |
| 同概念重複建 block | canonical id／alias 比對；模糊候選人工確認 |
| coverage 分母被重複概念灌大 | Course coverage 用 distinct concept；Step coverage 另算 |
| block 被批次流程蓋掉人工編輯 | `status: draft | reviewed`；`--force` 只動 draft |
| 合併後舊連結壞掉 | v1 不改已發布 block id；合併只發生在草稿階段；舊 id 進 aliases |
| 右側欄壓縮文章 | `xl` 才出現；mobile 改折疊卡片 |
| graph 太重 | d3-force 只做模擬；全文 lazy load；graph 只載 summary |
| drift 無聲發生 | `--check` 報告；`--refresh`／`--rewrite` 明確更新 |
| verify 太嚴導致無法漸進 | coverage 缺口只報告；orphan block 不擋 |

---

## 16. 待確認

- Pilot subject：實作用 `ai-agent-workflows`（原預設為 `agent-harness2`）。
- 這份計畫是否定稿。
