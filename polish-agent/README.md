# polish-agent

把文章交給 LLM 潤飾，修正奇怪文法、錯字、不自然的用詞與前後不一致的名詞，然後把文章原樣還給你。

只做一件事：**進文章、出文章**。不改寫、不擴寫、不翻譯、不加圖。

## 安裝

需要 Node.js 22+。零依賴，不用 `npm install`。

```bash
cp .env.example .env
```

如果你已經設好 `../article-agent/.env`，可以直接沿用：

```bash
cp ../article-agent/.env .env
```

`.env` 需要這三個值：

```
TEXT_API_KEY=你的金鑰
TEXT_BASE_URL=https://你的-openai-相容端點/v1
TEXT_MODEL=模型名稱
```

## 用法

```bash
# 從檔案讀文章，潤飾後印到 stdout
node --env-file=.env src/cli.mjs article.md

# 存成檔案
node --env-file=.env src/cli.mjs article.md --out polished.md

# 從 stdin
cat article.md | node --env-file=.env src/cli.mjs -

# 直接給字串
node --env-file=.env src/cli.mjs --text "這段話的文法很奇怪。"

# 這次想特別要求（會附加到潤飾規則後面）
node --env-file=.env src/cli.mjs article.md --instruction "「機器學習模型」統一寫成「模型」"
```

潤飾結果只會出現在 stdout，其他訊息在 stderr，所以可以直接再接管道：

```bash
node --env-file=.env src/cli.mjs article.md > polished.md
```

## 它會做什麼

- 修正文法、語序、贅字、錯別字、標點與中英文空白。
- 修掉機翻痕跡，例如「進行一個…的動作」。
- 統一奇怪或前後不一致的名詞與術語。
- 保留原意、事實、數字、引用、段落順序、語氣與 Markdown 結構。
- 只輸出文章本身，不會加前言或說明。

規則寫在 `prompts/polish.txt`，想調整潤飾口味就改那個檔案。

## 每次執行的紀錄

預設會在 `output/polish_YYYYMMDD_HHmmss_主題/` 留下：

- `original.md`：你給的原文
- `polished.md`：潤飾後的文章
- `manifest.json`：模型、用量、請求次數、狀態與錯誤

不想留紀錄就加 `--no-save`。

## 設定

| 變數 | 說明 |
| --- | --- |
| `TEXT_API_KEY` | 必填，文字模型金鑰 |
| `TEXT_BASE_URL` | OpenAI 相容端點；留空用 OpenAI 官方 |
| `TEXT_MODEL` | 模型 ID |
| `POLISH_TEMPERATURE` | 選填，預設 `0.3`，越低越保守 |
| `POLISH_TIMEOUT_MS` | 選填，單次請求逾時，預設 10 分鐘 |

429 與 5xx 會自動重試 3 次；其他錯誤直接失敗。

## 測試

```bash
npm test
```

測試用 mock API，不會花錢。
