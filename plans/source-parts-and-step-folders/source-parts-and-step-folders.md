# 計畫：長文切分、step 資料夾集中、原稿不可變

把三件互相牽動的改動一次講清楚：長文來源切成 part 檔、每個 step 的執行產物收進同一個資料夾、publisher 的原稿從此不再被覆寫。

決策本身已寫成 ADR：

- [ADR 0008：長文切分與 part-local 行號](../../docs/adr/0008-split-long-sources-into-parts.md)
- [ADR 0009：一個 step 一個資料夾與不可變原稿](../../docs/adr/0009-one-folder-per-step.md)

票券與依賴順序見 [`tickets.md`](tickets.md)。

---

## 1. 現況與三個病灶

### 1.1 長文沒有被切

`sources/principle-pi/20261031/` 裡那本 PDN 書的 `.txt` 有 25,393 行。digest 早已拆成 19 個 `pdn-principles.<n>.part.md`，但每一個 citation 都還是指回那支單一大檔的全域行號。讀一個 part 仍然要開整本書，而行號只在「未切分的原檔」裡有意義。

`docs/reference/source-reading.md` 的 large-source 流程只切 **digest**，從來沒切 **來源**。這是兩套座標的來源。

### 1.2 產物散在六個地方

一個 step 的執行產物目前分佈在：

```text
learn/<subject>/output/
  materials/<node>/<step>.json
  jobs/<node>/<step>/<step>.{original,protected,article,blocks,request,result}.md|json
  image-plans/<node>/<step>.json
  humanize/<node>/<step>.plan.backup.json
  humanized/<node>/<step>.json
  quiz-candidates/<node>/<step>.json
```

刪一個 step 要記得清六個位置，`reset-nodes` 因此自帶一份刪除清單。

### 1.3 原稿被潤飾覆寫

`polish-article draft` 讀 `.original.md`、潤完寫回同一支檔；接著 `run-article-agent --markers-only` 發現 marker 已經在了，就原樣複製成 `.protected.md` 與 `.article.md`；`publish` 再讀 `.article.md`。

實際量測：`transition-curve.original.md`、`.article.md`、`.protected.md` 三者 sha256 完全相同。三份檔案、一個內容，而真正的 publisher 原稿在第一個階段就消失了。

附帶問題：唯一一份正式配圖清單放在被 `.gitignore` 忽略的 `output/image-plans/`，clone 之後就不見了，所以 `batch-nodes` 必須額外留一份 `.plan.backup.json` 才能驗證 humanize 有沒有改壞 plan。

---

## 2. 目標佈局

```text
learn/<subject>/nodes/<node>/
  <step>.md                 # 最終文章
  <step>.plan.json          # 正式配圖清單，進 git
  <step>.quiz.json          # 題目，進 git
  <step>-assets/image-N.webp

learn/<subject>/output/<node>/
  prepare.json
  teaching-plan.md
  <step>/
    material.json           # 素材包
    original.md             # publisher 原稿，永不覆寫
    polish.md               # 文字模型潤飾後
    humanized.md            # 去 AI 味後（施工現場）
    request.json
    result.json
    blocks.json
```

`output/` 仍然不進 git。三份階段文章只在工作區內有意义，clone 後消失是可接受的；正式配圖清單則是重畫圖片必需的輸入，所以搬進 node 目錄。

### 2.1 階段契約

| 階段 | 讀 | 寫 |
| --- | --- | --- |
| publisher | 素材包＋來源 | `original.md`、`<step>.plan.json` |
| polish | `original.md`、plan | `polish.md`、plan 的 `heading`/`prompt` |
| markers-only | `polish.md`、plan | `result.json`（只驗證 marker 與 plan 一致） |
| publish | `polish.md`（經 `result.json`） | `nodes/<node>/<step>.md` |
| 連續性編修 | `step.md` | `step.md`（只改散文） |
| humanize | `step.md` | `humanized.md`，驗證後複製回 `step.md` |
| generate-images | `step.md`、`<step>.plan.json` | 圖片檔，marker 換成圖片行 |

`--force` 分成兩段：`prepare --force` 清掉該 step 的 `polish.md`、`result.json`、`blocks.json`、`request.json`，讓舊的 run 不能 publish；publisher 再重寫 `original.md`、`polish.md` 與 plan。`publish --force` 只在新文章成功寫入後，清除舊圖片、quiz 與 polish／humanize 紀錄；run 失敗時舊文章與舊圖保留。

---

## 3. 長文切分規則

- 只切 `.txt`，門檻 `>3000 行或 >250KB`。
- 以章節標題為邊界；`< ~200` 行的 section 併到下一個，`> ~2000` 行的 section 在子標題或段落邊界再切。
- 檔名 `<stem>.<n>.part.txt`，與現有 `<stem>.<n>.part.md` 對稱，citation 只需把 `.md` 換成 `.txt`。
- 每個 chunk 對應一個 digest part；part digest 的 `source` 指向 chunk，`source_lines` 等於 chunk 實際行數。
- `<stem>.parts.json` 放在 chunk 旁邊：

```json
{
  "text": "sources/<subject>/<date>/<stem>.txt",
  "total_lines": 25393,
  "parts": [
    { "part": 1, "file": "<stem>.1.part.txt", "start": 1, "end": 1200, "lines": 1200 }
  ]
}
```

- 切檔成功後刪除原始 `.txt`；PDF 留在原位。`pdf-backfill` 偵測到 `<stem>.*.part.txt` 就跳過，避免下次 run 又把大檔生回來。
- citation 使用 chunk-local 行號；跨 chunk 的範圍拆成兩筆，digest 的 L2 也拆。
- `learn-init` 與 `ingest` 都必須先跑 `split-sources.mjs --dry-run`、把表格給使用者確認，才可 `--apply`。

---

## 4. 遷移策略

1. **配圖清單**：把 node 的 `steps` 仍列出的 `output/image-plans/<node>/<step>.json` 搬到 `nodes/<node>/<step>.plan.json`；孤兒 plan 隨整個 `output/` 刪除。quiz 已經有正式副本，舊 `jobs/*.original.md` 是被覆寫過的假原稿，兩者都不值得保留。
2. **`principle-pi`**：用 `<stem>.parts.json` 機械換算 19 個 digest 的 L2 與 46 處 citation，跨 chunk 的範圍拆開。文章散文不動，只改 node 的 `sources` 與 digest 的 `source` / `source_lines` / L2。
3. 其餘 subject 目前沒有長文，不用處理。

---

## 5. 風險與取捨

- **行號斷裂**：這是最不可逆的一步。舊 citation 在 repo 外的筆記裡若只寫了全域行號，切檔後無法還原，除非回頭查 `.parts.json`。因此 manifest 是必要的。
- **`sources/` 出現生成檔**：切分違反「sources 不可變」的字面規則，但 chunk 是衍生檔、由 script 產生、由 manifest 記錄，屬於明確且狹窄的例外。
- **`output/` 不進 git**：三份階段文章無法在 clone 後追溯。這是刻意的取捨，換取 repo 乾淨；若之後要長期保存，再另開票券把 `original.md` 搬進 node 目錄。
- **plan 進 git**：node 目錄不再只有文章，`verify`、`reset-nodes`、course-app 資料生成都要知道 `<step>.plan.json` 的存在。
- **一次動十個模組**：以票券切開，每一張都保持測試綠；配圖清單搬遷是第一張，屬 prefactor，使用者行為不變。
