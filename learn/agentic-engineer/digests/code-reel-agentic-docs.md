---
source: sources/agentic-engineer/20261030/reel-agentic_engineering
source_type: codebase
source_lines: 4200
language: Markdown
file_count: 35
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `docs/adr` — 十篇 ADR 是「先決策、後實作」的決策紀錄，固定用 Context / Options considered / Decision / Rationale / Consequences 結構；0002–0007 各有一份 `verify.md`，把驗收條件（AC）翻成可勾選的驗證步驟。整套流程讓 agent 在動工前先被決策、選項與驗收條件約束。
- `docs/roadmap` — 十三個 feature 排成有序 slice，採 Tracer Bullet：每個 slice 端到端可跑。表格標 status 與 weight（`full` 需 design review + `/harden`），每項有 Done-when 與逐條 AC-tagged 任務，是 agent 判斷「下一個做什麼」與「何時算完成」的唯一排序來源。
- `docs/hardening` — 對 ADR 0006 的 systems-level review，依 severity 列 should-harden / watch / already-covered，每條附 `file:line`、scenario、impact、mitigation、verify-with。它把「可以上線」變成一張可稽核、可轉成測試的風險清單。
- `supabase/migrations` — 六支 timestamp 命名、每個 slice 一支的 migration：7 張表 + RLS、catalog 欄位、OAuth trigger、pgvector、feed RPC、vibe RPC。migration 就是資料契約，順序與內容不可重排，後續 feature 只能 additive 疊上去。
- `root` — `AGENTS.md` 是每次都會被載入的 agent context（stack、指令、rules、tooling），`CLAUDE.md` 只做轉接；`design.md` 是 UI token 的唯一來源；其餘設定檔（`package.json`、`next.config.ts`、`tsconfig.json`、`vitest.config.ts`、`test-preferences.json`、`skills-lock.json`）把工具鏈、型別、測試與 skill 版本固定住，讓 agent 不必猜。

# L2 detail

- `#L1-L153` — `docs/adr/0001-stack-and-architecture.md` — 定案單一 full-stack Next.js（App Router）+ Supabase（Postgres/pgvector/Auth/RLS）+ Vercel + Claude；明確比較 monolith、pgvector 與 Node runtime，並把 Supabase 耦合、serverless 時限、service-role 例外寫進 Consequences。教學重點：決策必須連同 tradeoff 與 follow-up 一起留檔，後續 agent 不得重開已決定的題目。
- `#L1-L298` — `docs/adr/0002-data-model/0002-data-model.md` — 定案七張表（profiles/movies/ratings/taste_profiles/watchlist_items/searches/imports）與其關係，RLS、cascade、text+CHECK enum、`SECURITY DEFINER` 的 `handle_new_user`；向量欄位刻意延後。教學重點：invariant 儘量交給資料庫（unique / FK / CHECK / RLS），而不是靠每個查詢記得寫 `where user_id = ...`。
- `#L1-L22` — `docs/adr/0002-data-model/verify.md` — 把 AC-1..AC-7 拆成 structural（實際查 DB：7 表、23 policies、5 triggers、尚無 vector 欄位）與 behavioral（待 auth/import 上線再跑）。教學重點：verify.md 是「這個 slice 真的滿足了契約」的證據，且刻意區分已證實與待驗。
- `#L1-L181` — `docs/adr/0003-movie-catalog-validation/0003-movie-catalog-validation.md` — 定案 catalog 的混合填充（可重跑 seed + cache-through）與「constrained generation + validateMovieIds backstop」；resolver 失敗一律 fail closed 回 `no-match`，永不捏造電影。教學重點：no-fabrication 要當成 pipeline 的結構性質，而不是事後清理。
- `#L1-L21` — `docs/adr/0003-movie-catalog-validation/verify.md` — 以真實 TMDB 與雲端 DB 逐條確認：`resolveByTmdbId(27205)` 命中 Inception、假標題回 no-match、seed 可重跑不重複。教學重點：verify 記錄的是實際跑過的輸入與輸出，不是「應該可以」。
- `#L1-L268` — `docs/adr/0004-design-system-ui-foundation/0004-design-system-ui-foundation.md` — 定案 Tailwind v4 CSS-first `@theme`、Radix copy-in primitives、Fraunces + Inter、dark-first、WCAG AA；`design.md` 為單一視覺來源，四大 product shell 先以 presentational 形式落地。教學重點：UI 只能使用 token，元件只收 typed props、不抓資料，讓後續 feature 直接站上已驗證的表面。
- `#L1-L21` — `docs/adr/0004-design-system-ui-foundation/verify.md` — build 與 Biome 自動通過，鍵盤／螢幕閱讀器／reduced-motion 則標成手動待驗。教學重點：自動化能證明的與只能人工證明的要分開列，避免把「build 過」誤當成「a11y 過」。
- `#L1-L217` — `docs/adr/0005-accounts-auth/0005-accounts-auth.md` — 定案 Google-only OAuth + `@supabase/ssr` cookie session + adaptive `/`；三個 user-scoped client、`getUser()` 而非 `getSession()`、middleware 只是 UX fast-path、真正的邊界是每個 authed surface 自己的 `getUser()`。教學重點：安全邊界要寫成「每個入口都必須自查」，而非依賴一層中介。
- `#L1-L21` — `docs/adr/0005-accounts-auth/verify.md` — 自動驗證包含 `/preview` 未登入回 307、callback 無 code 也回 307；完整 Google roundtrip 因 dashboard 設定而手動待驗。教學重點：把外部前置條件（Google Cloud/Supabase 設定）顯式列為 blocker，agent 才不會誤判失敗原因。
- `#L1-L256` — `docs/adr/0006-csv-import-taste-profile/0006-csv-import-taste-profile.md` — 定案 taste profile：瀏覽器解析 CSV、100 列一批的可續傳 import、寫入時才 embed、rating-weighted centroid 與零變異 fallback、`MIN_RATINGS_FOR_PROFILE = 20`。教學重點：貴且 model-dependent 的 derived value 才值得快取，而且「半成品 profile」永遠不可寫入。
- `#L1-L32` — `docs/adr/0006-csv-import-taste-profile/verify.md` — 先列 operator prerequisites（`OPENAI_API_KEY`、套 migration、backfill），再列 build 指令與逐狀態 UI 檢查。教學重點：verify 把環境前置與功能驗收分開，讓「跑不起來」與「做錯了」不會混為一談。
- `#L1-L240` — `docs/adr/0007-recommendation-feed-reasons/0007-recommendation-feed-reasons.md` — 定案 feed：cosine 檢索 + popularity 近分 tiebreak、`recommendations` 快取、一次 batched Sonnet 寫 10 條理由、transactional `replace_recommendations` 原子替換、失敗保留舊 feed。教學重點：selection 是 deterministic SQL，所以不需要 `validateMovieIds`；只有理由文字是 AI，風險被限縮在文字層。
- `#L1-L32` — `docs/adr/0007-recommendation-feed-reasons/verify.md` — 要求「reload 不得發出 Anthropic 請求」、以壞 key 注入失敗確認舊 feed 保留、heavy rater 只顯示真實少量 picks。教學重點：把「省錢」與「fail closed」寫成可觀察的斷言，而不是形容詞。
- `#L1-L197` — `docs/adr/0008-onboarding-genres-swipe.md` — 定案 onboarding 只是「用既有引擎產生 ratings」：genre 篩 deck、like=100/dislike=0、達 20 才 `computeTasteProfile`，無新表、無 AI。教學重點：新功能優先找「既有引擎的新輸入」，並修正 roadmap 的 15 次 swipe 與 20 筆 floor 衝突。
- `#L1-L216` — `docs/adr/0009-natural-language-vibe-search.md` — 定案 vibe search：Haiku 解析 → OpenAI embed → `match_vibe_candidates` cosine（0.7 query + 0.3 taste）→ Sonnet 從 shortlist 選 3–5 並寫理由 → `validateMovieIds` 兜底。教學重點：連 SQL function 都要注意 `set search_path = ''` 下必須寫 `operator(public.<=>)`；no-fabrication 靠 shortlist 結構而非 prompt。
- `#L1-L189` — `docs/adr/0010-secondary-recommendation-rows.md` — 定案首頁主題列：重用 `match_feed_candidates` 取一個大 pool，再按低 popularity／高 popularity／top genre 切片並跨列去重，理由用 `groundedReason`（不呼叫 Claude）。教學重點：把 premium surface（feed 的 Claude 理由）與 cheap browse surface（templated 理由）分層，避免把昂貴路徑擴散到每次載入。
- `#L1-L188` — `docs/roadmap/roadmap.md` — 13 個 feature 的分期與狀態、每個 Done-when、逐條 AC-tagged 任務、`ADR <n> · code in <path>` 指標行，以及 Deferred 清單。教學重點：agent 依這份順序取「第一個未勾選項」當下一步，且未經 ADR 與 verify 不得把 feature 標成 done。
- `#L1-L50` — `docs/hardening/2026-07-05-csv-import-taste-profile.md` — 對 import feature 的系統級審查：duplicate movie 讓整個 chunk 永久失敗（已修）、server 不信任 client rows、unmatched jsonb 的 O(n²) 重寫、缺 OpenAI timeout；每條都有 severity、`file:line`、scenario/impact/mitigation/verify-with。教學重點：review 的產出要能直接變成 regression test 或待辦，而不是一般評論。
- `#L1-L286` — `supabase/migrations/20260704173914_init_schema.sql` — 建 7 張表、`on delete cascade`、`updated_at` trigger、`handle_new_user`（SECURITY DEFINER）、以及逐 operation 的 RLS policy（含 ratings 的 INSERT + UPDATE 以支援 upsert）。教學重點：資料契約與權限在同一個檔案落地，schema 的每個 invariant 都有對應 SQL。
- `#L1-L19` — `supabase/migrations/20260704181325_add_catalog_columns.sql` — 對 `movies` additive 加 8 欄（imdb_id、directors、top_cast、keywords、vote_average、vote_count、popularity、synced_at），加 partial unique index 與 popularity index。教學重點：新 feature 只加欄不破壞舊欄，讓 0002 的 schema 保持穩定。
- `#L1-L20` — `supabase/migrations/20260705062903_update_handle_new_user_from_oauth.sql` — 以 `create or replace` 改寫 trigger function，從 `raw_user_meta_data` 抄 `full_name/name` 與 `avatar_url/picture`；trigger 綁定不變。教學重點：用 replace function 演進行為，避免動到已存在的表與 trigger 契約。
- `#L1-L31` — `supabase/migrations/20260705120000_add_taste_vectors.sql` — 啟用 `vector` extension，加 `movies.embedding vector(1536)` 與 `taste_profiles.vector vector(1536)`（皆 nullable），建 HNSW cosine index（m=16, ef_construction=64）。教學重點：null 代表「尚未 embed、排除於匹配之外」；向量以 L2-normalized 儲存，讓 cosine 與 inner product 一致。
- `#L1-L119` — `supabase/migrations/20260705130000_add_recommendations.sql` — 建 `recommendations` 表 + owner-only RLS，並定義兩個 RPC：`match_feed_candidates`（security invoker、anti-join ratings、`set local hnsw.ef_search`）與 `replace_recommendations`（單一 transaction 先刪後插）。教學重點：把「檢索調參」與「原子替換」放進 DB function，讓 app 層無法繞過 RLS 或寫出半套 feed。
- `#L1-L61` — `supabase/migrations/20260705140000_add_vibe_search.sql` — 新增 `match_vibe_candidates`，以 query vector 排序、同時回傳 query/taste distance，並在 SQL 內過濾 year 與 runtime；運算子寫成 `operator(public.<=>)` 以在空 `search_path` 下解析。教學重點：同一種向量檢索可以重用 index，但 facet 與排序語意不同時應開新 RPC，而非硬改舊 RPC。
- `#L1-L200` — `supabase/config.toml` — 本地 Supabase 專案的 api/db/pooler/migrations/seed/realtime/studio/storage 設定（`project_id = "movies"`、pooler transaction mode、seed 路徑）。教學重點：本地環境要與雲端對齊，migration 與 seed 的開關決定 `db reset` 行為。
- `#L201-L414` — `supabase/config.toml` — auth 段：site_url、redirect allow-list、JWT 與 refresh rotation、signup 開關、rate limit、email/sms/MFA、external providers（Google 在此仍 disabled，實際在 dashboard 設定）、edge runtime/analytics/experimental。教學重點：OAuth 這類外部設定不在版控內，程式正確也不等於能登入，這是 verify 必須列 operator step 的原因。
- `#L1-L81` — `scripts/seed-movies.ts` — 從 TMDB popular/top-rated/trending 收集 id，逐部 `resolveByTmdbId` upsert，再以 `embedMissingByIds` 分批 embed；可重跑且不重複、不重複花錢。教學重點：操作型工作放在獨立 script，不混進 request surface，且 idempotent 讓重跑安全。
- `#L1-L56` — `scripts/backfill-embeddings.ts` — 分頁掃 `embedding is null` 的電影、分批 embed，並用 `offset += skipped.length` 跳過永遠無法 embed 的列以保證終止。教學重點：backfill 的續傳邏輯要處理「永遠不符合條件的資料」，否則會無限迴圈。
- `#L1-L75` — `AGENTS.md` — 永遠載入的 agent context：stack、指令、Tracer Bullet、rules（RLS 必須用 user-scoped client、`getUser()`、UI 只用 token、依需求即時安裝依賴、TMDB attribution）、tooling 與測試。教學重點：這是把 ADR 決策壓縮成「每次都要遵守」的常駐約束層，agent 不需重讀每篇 ADR 也不會違規。
- `#L1-L6` — `CLAUDE.md` — 只有六行，指向 `AGENTS.md` 並用 `@AGENTS.md` import。教學重點：多個 AI 工具共用同一份 context，避免兩套規則漂移。
- `#L1-L36` — `README.md` — 仍是 `create-next-app` 樣板（還提到已被替換的 Geist），未反映 Reel 的 stack。教學重點：真正可信的專案說明在 `AGENTS.md` 與 ADR；README 是 scaffold 遗留，agent 不應以它為依據。
- `#L1-L157` — `design.md` — 由 ADR 0004 衍生的 token 表（color/type/spacing/radius/elevation/motion）與元件慣例、Do/Don't、responsive 規則。教學重點：這是 UI 的硬契約，禁止硬編 hex 或自創 spacing，並要求每個互動元素有可見 focus 與鍵盤路徑。
- `#L1-L53` — `package.json` — 實際 scripts（dev/build/lint/format/check/seed:movies/backfill:embeddings/test）與 pinned 依賴（Next 16.2.10、React 19.2.4、Tailwind 4、Biome、Vitest、三種 AI/Supabase SDK）。教學重點：版本決定行為（例如 Next 16 的 proxy 改名），agent 不應憑訓練資料假設 API。
- `#L1-L17` — `next.config.ts` — 只設定 `next/image` 的 TMDB `remotePatterns`，並以 `dangerouslyAllowSVG` + CSP/sandbox/attachment 限制 SVG。教學重點：放寬圖片來源時要同時收緊內容處置與 CSP，安全設定與功能設定一起寫。
- `#L1-L34` — `tsconfig.json` — `strict: true`、`moduleResolution: bundler`、`@/*` 指向 `src/*`。教學重點：型別嚴格度是規則（AGENTS.md 也重申 no implicit any），不是可選項。
- `#L1-L18` — `vitest.config.ts` — jsdom 環境、globals、只收 `src/**/*.test.ts`、`@` alias 與 `vitest.setup.ts`。教學重點：測試與 app 用同一 alias、同一個 co-located 慣例，讓 agent 新增測試時不需要另創結構。
- `#L1-L8` — `test-preferences.json` — 機器可讀的測試偏好：vitest、jsdom、e2e none、co-located、`*.test.ts`、npm。教學重點：把「這個專案怎麼測」變成資料，agent 與工具都能直接讀，不必每次詢問。
- `#L1-L77` — `skills-lock.json` — 以 source repo + `skillPath` + `computedHash` 鎖定 architect/audit/debug/develop/document/harden/review/roadmap/status/sync/test/verify 等 skills。教學重點：agent 工作流本身也被版本化，skill 更新可重現、可稽核。
