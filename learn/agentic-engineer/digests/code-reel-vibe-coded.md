---
source: sources/agentic-engineer/20261030/reel-vibe_coded
source_type: codebase
source_lines: 2434
language: TypeScript
file_count: 31
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `app` — 九個檔案撐起整個前端：root layout、login、onboarding、feed、search、picks 與一個小 client 元件。味道最重的一層：onboarding 把「把使用者答案組裝成 taste_summary 散文」放在 client component 裡，一個 428 行的檔同時管三條流程；server page 對 `user` 用 `!` 斷言而不處理未登入，資料庫查詢普遍只讀 `data` 不讀 `error`。
- `api` — 六個 route handler（import、movies/search、picks、profile、recommendations、vibe）。每個都重複同一段五行驗證開場，沒有共用的 `requireUser()`；handler 同時做驗證、寫 SQL、呼叫模型、裁剪輸出，等於把 service 層壓進 HTTP 邊界，所以「排除已看過的片」「取前 18 名」這種業務規則只存在於某個 route 裡。
- `lib` — engine（Claude）、tmdb（驗證層）、csv、types、三個 Supabase client。全 repo 唯一有明確架構主張的地方（`Candidate` 不得直接渲染），但同一份領域知識被寫了三次：TS interface、Zod schema、SQL 欄位；`validateCandidates` 用無上限 `Promise.all`，並以 `catch { return null }` 讓「TMDB 故障」與「這部片不存在」無法區分。
- `components` — `MovieCard` 與 `Nav`。收藏是 optimistic UI：`fetch` 的回應完全不看，HTTP 500 照樣把按鈕切成 Saved；`initiallySaved` 沒有任何呼叫端傳值，所以已收藏的片在 feed 仍顯示「Save」。
- `supabase` — 一份 `schema.sql`：三張表、RLS policy、`updated_at` trigger。這是全案最有紀律的一層（三條 RLS policy 寫對），但 `ratings` 沒有 `(user_id, title)` 唯一鍵、也沒有 title 索引，正確性靠「先 delete 再 insert」——中途失敗就留下半套資料。
- `config` — next/tsconfig/postcss/package/README。`package.json` 只有 dev/build/start/lint，沒有 test、沒有 typecheck script；README 宣稱「No hallucinations, by construction」，而那道保證實際上只做到「標題對得上 TMDB」，年份不符時仍會回傳最熱門的同名片。

# L2 detail

- `#L1-L36` — `src/app/layout.tsx` — 全域外殼：兩套 Google 字型變數、metadata、滿版 grain 疊層。缺陷：grain 是 `position: fixed; z-index: 50` 蓋在所有內容上，只靠 `pointer-events: none` 補救；沒有 error boundary、沒有 Suspense，於是每個 client page 只能自己重寫載入與錯誤狀態。
- `#L1-L23` — `src/app/page.tsx` — 根路由分流：有 profile 去 `/feed`，否則去 `/onboarding`。缺陷：查 `profiles` 只解構 `data` 不看 `error`，資料庫一出錯就靜默把人送去 onboarding（等於用一次讀取失敗覆寫既有 profile）；`if (!user)` 是第二道門，但整個 App 的安全性都建立在「middleware 一定先跑過」這個隱性假設上。
- `#L1-L109` — `src/app/globals.css` — Tailwind 4 的 `@theme` 色票與字型、body 漸層、`.grain`、`.rule`、`.stagger`。缺陷：`.stagger` 硬寫到第 9 個子元素、之後共用同一個延遲，是「先讓畫面好看」的即興參數；`input:focus-visible` 用 `!important` 蓋掉元件樣式，代表樣式權重已經失控。
- `#L1-L137` — `src/app/login/page.tsx` — 登入／註冊雙模式表單，直接呼叫 browser Supabase client。缺陷：`CONFIGURED` 在 module 載入時就固定，`process.env` 被 build 期內聯；`createClient()` 每次提交都新建 client；未設定環境變數的路徑只在 UI 顯示提示，沒有任何建置期檢查。
- `#L1-L220` — `src/app/onboarding/page.tsx`（前半） — 三條 onboarding 路徑、五個 quiz step、chip 元件、收藏片 autocomplete 與 debounce。缺陷：`GENRES`／`MOODS`／`DISLIKES` 是硬寫在前端的字彙表，與 `engine.ts` 的 prompt、`schema.sql` 的欄位各說各話；`FavPick` 是臨時定義的第四種電影型別；`quizSteps` 把 JSX 與驗證規則塞進陣列，讓元件無法拆。
- `#L221-L428` — `src/app/onboarding/page.tsx`（後半） — 完成 quiz 時在前端拼出 `taste_summary` 字串，POST `/api/profile` 後直接 `router.push("/feed")`。缺陷：`await fetch(...)` 的 `res` 完全沒檢查，儲存失敗照樣進 feed，使用者看到的是「沒有 profile」的 409；把「如何描述品味」這種產品邏輯寫在 view 層，是 logic-coupled-to-UI 的教科書案例。
- `#L1-L100` — `src/app/feed/page.tsx` — client component 用 `POST /api/recommendations` 抓資料，處理 409 導向 onboarding，附 skeleton 與錯誤重試。缺陷：明明可以是 server component 卻走 client fetch，首屏多一次往返；`movies` 為 `null` 與空陣列沒有區分；`data.movies` 直接信任形狀，沒有任何 runtime 驗證。
- `#L1-L142` — `src/app/search/page.tsx` — vibe 搜尋頁：輸入、範例 chip、loading／empty／error 三態。缺陷：`search()` 靠 `loading` 布林擋重入，但沒有 `AbortController`，較慢的舊請求仍可覆寫新結果；錯誤只顯示 `data.error`，沒有狀態碼分類；`EXAMPLES` 是文案硬寫，跟引擎能力沒有任何耦合驗證。
- `#L1-L100` — `src/app/picks/page.tsx` — server component 讀 `saved_picks` 並渲染 grid。缺陷：`user!.id` 用 non-null assertion 直接取代未登入分支；`const { data } = await …` 吞掉 `error`；`data as SavedPick[]` 用型別斷言假裝資料已被驗證；`select("*")` 讓畫面與資料表欄位永久綁死。
- `#L1-L25` — `src/app/picks/RemovePickButton.tsx` — 刪除收藏的小 client 元件。缺陷：`await fetch(...)` 不看回應就 `router.refresh()`，刪除失敗時畫面刷新後按鈕又出現，使用者只會覺得「點了沒用」；`busy` 失敗路徑沒重設（靠 refresh 掩蓋）。
- `#L1-L57` — `src/app/api/import/route.ts` — CSV → `parseRatingsCsv` → 分批寫 `ratings` → 呼叫引擎產生 profile。缺陷：先 `delete` 全部舊 ratings 再迴圈 insert，沒有交易，任何一批失敗就永久損失歷史；`let ratings;` 是隱性 any 的溫床；沒有檔案大小或列數上限；整份 CSV 以 JSON 字串塞進 request body；沒有 idempotency key，重送等於重跑昂貴的模型呼叫。
- `#L1-L24` — `src/app/api/movies/search/route.ts` — onboarding 收藏片的 TMDB autocomplete，取前 6 筆。缺陷：每個字都打一次外部 API（debounce 只在 client），沒有快取或 rate limit；回傳 `poster_path` 給一個根本不顯示海報的畫面；`m.release_date.slice(0,4)` 直接假設欄位存在。
- `#L1-L77` — `src/app/api/picks/route.ts` — `saved_picks` 的 GET／POST／DELETE。缺陷：POST 直接信任 client 送來的 `title`／`year`／`poster_path`／`reason` 寫進「已驗證」的表，等於繞過整個 `Candidate → Movie` 保證；同檔三段重複驗證開場；DELETE 的 `Number(tmdbId)` 遇到非數字會變 `NaN`，查無資料仍回 `{ ok: true }`。
- `#L1-L47` — `src/app/api/profile/route.ts` — 讀寫 taste profile。缺陷：`body as Partial<TasteProfile>` 沒有任何長度、數量或內容驗證，使用者可以把任意字串陣列直接灌進下一輪 prompt（成本與 prompt injection 同時失守）；`loved_keywords` onboarding 永遠送空陣列，欄位存在卻從未使用。
- `#L1-L51` — `src/app/api/recommendations/route.ts` — profile → `generateFeedCandidates` → `validateCandidates` → 取 18 筆。缺陷：排除清單只用電影「標題」字串，同名重拍或譯名不同就漏掉；只拿前 400 筆 ratings 且以 rating 排序，排除邏輯因此不完整；`profile as TasteProfile` 是無驗證的型別斷言；`slice(0, 18)` 把產品規則寫死在 handler。
- `#L1-L38` — `src/app/api/vibe/route.ts` — 自然語言搜尋 → 引擎 → 驗證 → 取 12 筆。缺陷：`query` 沒有長度上限就進 prompt；每次搜尋都是 Opus 呼叫卻沒有任何快取或費用防護；與 recommendations 是同一段流程的複製貼上，兩邊的 `18`／`12` 各自硬寫。
- `#L1-L78` — `src/lib/csv.ts` — PapaParse 解析，用表頭形狀分辨 Letterboxd／IMDb，IMDb 的 10 分制除以 2。缺陷：`name && year` 這種表頭啟發法會誤判任何有這兩欄的 CSV；`Number(x) || null` 把合法的 `0` 也變成 `null`；沒有列數上限；Letterboxd 空評分靜默變 `null`，使用者不會知道有多少筆被丟掉。
- `#L1-L167` — `src/lib/engine.ts` — 三個 Claude 呼叫：feed 候選、vibe 候選、從評分蒸餾 profile；`zodOutputFormat` 做結構化輸出。缺陷：`MODEL = "claude-opus-4-8"` 硬寫在原始碼；`ProfileSchema` 與 `types.ts` 的 `TasteProfile`、`schema.sql` 的欄位是三份真話；兩個 generate 函式幾乎逐字重複；`buildProfileFromRatings` 的 `slice(0,300)` 加 `slice(-100)` 在總數少於 400 時重疊，同一部片會在 prompt 出現兩次；沒有 timeout、retry、rate limit。
- `#L1-L178` — `src/lib/tmdb.ts` — 全案唯一的正確性關卡：搜尋、標題正規化、`matchCandidate` 的三年規則、批次驗證、`posterUrl`。缺陷：標題精確但年份不符時 fallback 到「最熱門」，會把重拍版當成原版放行；`Promise.all` 一次打出所有候選的搜尋（最多約 2×N 個請求），沒有併發上限或 429 處理；`catch { return null }` 讓 TMDB 掛掉與「片不存在」同樣表現為空 feed；`res.json()` 是 any，靠 `as TmdbMatch[]` 自我安慰。
- `#L1-L86` — `src/lib/types.ts` — 領域型別與註解寫得最好的一檔：`Candidate`（未驗證）與 `Movie`（已驗證）的界線清楚。缺陷：`Candidate.year?` 是 optional，但 `engine.ts` 的 Zod schema 要求必填，兩者不一致；`SavedPick` 有 `id`／`created_at`，`picks` POST 卻另外手寫一份 body 形狀；型別只存在於編譯期，執行期沒有任何 schema 檢查。
- `#L1-L9` — `src/lib/supabase/client.ts` — browser client 的三行包裝。缺陷：`process.env.NEXT_PUBLIC_*!` 用 non-null assertion 假裝變數一定存在；每次呼叫都新建 client，沒有 module-level 單例，login 頁每次提交就重建一次。
- `#L1-L69` — `src/lib/supabase/middleware.ts` — 登入牆：刷新 session cookie、未登入一律導向 `/login`、已登入者擋掉 `/login`。缺陷：`PUBLIC_PATHS` 含一個 repo 裡不存在的 `/auth`（死路徑）；`getUser()` 的例外被 `catch` 吞成「未登入」，暫時性故障會被誤判成登出；整個授權模型只靠這一個函式，handler 內的重複檢查反而變成裝飾。
- `#L1-L32` — `src/lib/supabase/server.ts` — Server Component／Route Handler 用的 cookie-based client。缺陷：同樣用 `!` 斷言環境變數；`setAll` 的 `catch` 直接忽略錯誤並以註解帶過，是真實需求但也讓失敗完全不可觀測；沒有集中處理「Supabase 未設定」的情況。
- `#L1-L15` — `src/middleware.ts` — 把 `updateSession` 掛上 matcher，排除靜態資源。缺陷：matcher 沒排除 `/api`，所以每個 API 請求都先付一次 `getUser()` 往返，進入 handler 後再 `getUser()` 一次，等於每次請求驗證兩次。
- `#L1-L109` — `src/components/MovieCard.tsx` — 推薦卡：海報、類型、reason、簡介與收藏切換。缺陷：`toggleSave` 完全不看 `res.ok`，失敗也把 `saved` 設為 true，是典型的 optimistic UI 缺錯誤回滾；`initiallySaved` 沒有呼叫端使用，導致已收藏狀態無法呈現；送出的 payload 是手寫物件，與 `picks` API 的 body 形狀無型別連結。
- `#L1-L57` — `src/components/Nav.tsx` — sticky 導覽、active 狀態、登出。缺陷：`pathname.startsWith(href)` 讓 `/feed-archive` 之類路徑也亮起來；`signOut()` 不看錯誤就跳轉；登出後只靠 `router.refresh()` 期待 middleware 補位。
- `#L1-L85` — `supabase/schema.sql` — 三張表（`profiles`、`ratings`、`saved_picks`）、RLS、`touch_updated_at` trigger。缺陷：`ratings` 缺 `(user_id, title)` 唯一鍵與 title 索引，重複匯入或分批失敗都會累積重複列；`rating numeric(2,1)` 沒有 0–5 的 check constraint；`saved_picks` 只存標題與海報路徑，卻沒有 `vote_average`／`genres`，逼得 feed 與 picks 兩邊對同一部片有不同欄位集合。
- `#L1-L15` — `next.config.ts` — 只設定了 `image.tmdb.org` 的 `remotePatterns`。缺陷：Next 的 image optimizer 是唯一被設定的基礎設施，其餘（headers、redirects、`images.qualities`）全空；這也說明圖片來源是唯一被事先想到的外部依賴。
- `#L1-L27` — `tsconfig.json` — Next 預設的 strict TS 設定與 `@/*` 路徑別名。缺陷：`strict: true` 寫得很漂亮，但整個 codebase 靠 `!`、`as`、`res.json()` 的 any 與 `let ratings;` 把它抵銷掉，型別嚴格度只存在於設定檔。
- `#L1-L5` — `postcss.config.mjs` — Tailwind 4 的 PostCSS 外掛註冊。缺陷：沒有缺陷，正是全案最短、最不需要判斷的檔案，可當「設定檔該長什麼樣」的對照組。
- `#L1-L30` — `package.json` — 依賴清單與四個 script（dev／build／start／lint）。缺陷：沒有 `test`、沒有 `typecheck`、沒有 format，所以「有沒有壞」只能靠人開瀏覽器看；`lint: next lint` 在 Next 15.5 已棄用；`@anthropic-ai/sdk` 與 `next` 都用 caret range，重現性靠 lockfile 一支獨撐。
- `#L1-L78` — `README.md` — 產品說明、架構圖、Supabase／金鑰／啟動步驟、CSV 匯入來源。缺陷：文件把 `Candidate → Movie` 說成「by construction」的防幻覺保證，但 `picks/route.ts` 讓 client 直接寫入未驗證的電影資料，保證只在單一路徑成立；完全沒有提到測試、併發上限、成本或失敗模式。
