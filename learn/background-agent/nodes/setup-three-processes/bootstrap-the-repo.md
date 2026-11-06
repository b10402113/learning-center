# 環境設定

拿到專案程式庫準備開始實作時，最怕遇到本機環境缺漏、資料庫版本不對，或是金鑰設定錯誤導致程式跑到一半直接中斷。在啟動背景 Agent 與相關服務前，只要依照標準流程準備好環境變數、完成資料庫推版，並透過檢查指令驗證，就能確保後續程序有穩定的運作基礎。

本機只需要準備好 Node.js LTS、npm、Git、程式碼編輯器，以及一組可用的大語言模型（LLM）API 金鑰。你不需要在自己的電腦安裝 PostgreSQL 資料庫，也不需要申請 Inngest 雲端帳號。

### 下載套件與建立環境變數檔

進入專案目錄後，先切換至第一課的分支，安裝相依套件，並從範本複製出環境變數檔：

<!-- derived -->
```bash
git switch lesson-1
npm install
cp .env.example .env
```

接著開啟 `.env`，準備填入資料庫連線字串與模型金鑰。

### 取得免安裝的資料庫與模型設定

專案需要一個 PostgreSQL 資料庫。如果不打算在本機安裝，可以直接前往 neon.new 網頁建立一個免費的暫時性資料庫。

在瀏覽器點選試用後，系統會直接產生一組連線字串。請將完整的資料庫連線網址（包含結尾的 SSL 參數）複製下來，貼到 `.env` 的 `DATABASE_URL` 中。請注意複製的是資料庫連線網址，不是認領網址。若未登入認領，該暫存資料庫約在 72 小時後過期；之後若要繼續練習，重新申請一組連線字串即可。

![第 1 段配圖](./bootstrap-the-repo-assets/image-1.webp)

接著填入模型相關設定：

<!-- derived -->
```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
OPENAI_API_KEY=your-key
OPENAI_MODEL=your-available-model
# 選填：相容於 OpenAI 規格的閘道位址，例如 Command Code
# OPENAI_BASE_URL=https://api.commandcode.ai/provider/v1
```

預設情況下，程式會連向官方 OpenAI 端點。如果你使用的是其他相容 OpenAI 規格的服務（例如 Command Code），請在 `OPENAI_API_KEY` 填入該服務的金鑰、在 `OPENAI_MODEL` 指定可用模型（如 `deepseek/deepseek-v4-flash`），並取消註解 `OPENAI_BASE_URL`。

設定完成後請妥善保存 `.env`，切勿將包含金鑰的檔案提交進 Git 版本控制。

### 推送資料庫結構與執行預檢

有了連線字串後，需要把專案定義的資料表結構同步到資料庫中，並透過內建的預檢腳本確認各項設定是否到位：

![第 2 段配圖](./bootstrap-the-repo-assets/image-2.webp)

<!-- derived -->
```bash
npm run db:push
npm run preflight
npm run db:seed
```

執行 `npm run db:push` 會將 schema 推送到資料庫。如果是第一次推送，指令執行完成後會提示結構已同步。

專案提供的 `preflight` 指令負責在真正啟動服務前做嚴格把關：

<!-- source: sources/background-agent/20261105/scripts/preflight.mjs#L1-L54 -->

```javascript
import 'dotenv/config'
import postgres from 'postgres'

const problems = []
const major = Number(process.versions.node.split('.')[0])
if (major < 22) problems.push('Use Node.js 22 or newer (an LTS release is recommended).')

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key-here') {
  problems.push('Set OPENAI_API_KEY in .env to a working key.')
}
if (!process.env.OPENAI_MODEL || process.env.OPENAI_MODEL === 'choose-an-available-model') {
  problems.push('Set OPENAI_MODEL in .env to a model available to your key.')
}
const baseURL = process.env.OPENAI_BASE_URL?.trim()
if (baseURL) {
  try {
    const parsed = new URL(baseURL)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol')
  } catch {
    problems.push('OPENAI_BASE_URL must be a valid http(s) URL, or leave it unset for OpenAI.')
  }
}

const url = process.env.DATABASE_URL?.trim()
if (!url) {
  problems.push(
    'Set DATABASE_URL in .env to the PostgreSQL connection string from https://neon.new/.',
  )
} else {
  let sql
  try {
    const parsed = new URL(url)
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol) || !parsed.hostname) {
      throw new Error('Invalid PostgreSQL URL')
    }
    sql = postgres(url, { max: 1, connect_timeout: 10 })
    const [row] = await sql`select to_regclass('public.labs') as labs`
    if (!row.labs)
      problems.push('Database is reachable, but the schema is missing. Run npm run db:push.')
  } catch {
    problems.push(
      'Cannot connect with DATABASE_URL. Check the full Neon connection string in .env; if the temporary database expired, create a new one at https://neon.new/.',
    )
  } finally {
    if (sql) await sql.end({ timeout: 1 })
  }
}

if (problems.length) {
  for (const problem of problems) console.error(`✗ ${problem}`)
  process.exitCode = 1
} else {
  console.log('✓ Node, database schema, and OpenAI configuration are ready for real-model runs.')
}
```

這段檢查腳本會驗證三件事：
1. 本機 Node.js 版本是否為 22 以上。
2. `.env` 是否已提供有效的模型金鑰與模型名稱，以及選填的 Base URL 格式是否正確。
3. 資料庫是否能連線，且先前的 `db:push` 是否已順利建立資料表（檢查 `public.labs` 是否存在）。

預檢通過並顯示綠色打勾後，再執行 `npm run db:seed` 寫入初始資料。到這個階段，資料庫與執行環境就已經完全就緒，可以放心啟動後續的本機應用與排程服務。
