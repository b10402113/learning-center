---
source: "sources/ai-content-accelerator/20261103/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest"
source_type: codebase
source_lines: 72588
language: Python
file_count: 150
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `skills/latest` — `/latest` skill 本體：把一個利基在最近 7 天（可調 14／28 天）的社群討論，變成最多 10 個排序後的內容點子，每個都有工作標題、angle（要說什麼、要展示什麼）、why（為何現在有用）、平台與可點開的真實來源連結，最後開一張可搜尋、可篩選、可加入購物車的結果頁。
- `skills/last30days` — `/latest` 底下的免費研究引擎（v3.27.1，Matt Van Horn，MIT）。`/latest` 依合約「原樣執行、絕不修改」它；所有真正的抓取、評分、叢集與渲染都在這裡。
- 資料來源 — Reddit、X、YouTube、TikTok、Instagram、Hacker News、Polymarket、GitHub、web（grounding），外加可選的 Bluesky、Truth Social、Threads、Pinterest、LinkedIn、Trustpilot、Amazon、Meta Ads、Perplexity、Digg、arXiv、Techmeme、Xiaohongshu、Telegram。
- 無金鑰即可用 — Reddit（keyless）、YouTube（`yt-dlp`）、Hacker News（Algolia）、GitHub（公開 REST）、Polymarket（Gamma）、web（keyless floor）；這條「零成本地板」是課程最值得先跑通的路徑。
- 選用金鑰 — ScrapeCreators（TikTok／Instagram，兼作 Reddit backfill、Meta Ads、Telegram）、X（bearer token、瀏覽器 cookie、`bird`、`xurl`、Grok、Xquik）、OpenAI／Gemini／xAI／OpenRouter（planner 與 rerank）、Brave／Exa／Serper／Parallel（web search）、Perplexity（deep research）。
- `/latest` 工作流 — 解析主題與窗口 → 以 `--days=N --agent` 執行 last30days → 讀完整 raw 檔（不是只讀引擎印出的摘要）→ 選點子 → 依「新、互動強、對觀眾有用、貼合品味」排序 → 寫 results JSON → `fill.py` 產生並開啟頁面 → 用極短回覆收尾。
- 九條 universal rules — 窗口預設、原樣執行引擎、納入使用者自有來源、不轉印 last30days 自己的報告、每個連結都必須來自本次研究、公司發布稿不算點子、發布時間不等於新、未證實的宣稱要標成宣稱、先讀 `taste.md`。
- 研究 runbook — 先分 intent（GENERAL／NEWS／RECOMMENDATIONS／PROMPTING／COMPARISON），再做 query quality pre-flight（5 類 keyword trap），接著 Step 0.5／0.55 解析 X handle、GitHub user/repo、subreddit、TikTok hashtag／creator、IG creator，Step 0.75 由 host model 自己產生 query plan（LAW 7），最後才跑引擎。
- Query plan — 一份 JSON：`intent`、`freshness_mode`、`cluster_mode`、`source_weights`，以及 1–5 個 subquery；每個 subquery 有 `search_query`（關鍵字式）、`ranking_query`（自然語言提問）、`sources`、`weight`。這是把「研究者意圖」轉成「各平台可執行檢索」的核心介面。
- 引擎管線 — `diagnose` 算出可用來源 → `planner` 產生計畫 → 每個 (subquery, source) 平行抓取 → normalize／本地評分 → 去重 → weighted reciprocal rank fusion → LLM 或本地 rerank → 叢集（story／workflow／market／debate）→ `render_compact` 產出證據包與 footer。
- 排序訊號 — RRF 平滑常數 60；來源品質權重（HN 0.8、YouTube 0.85、Reddit 0.6、X 0.68、grounding 1.0）；entity-miss 罰 25 分；first-party 作者加 5 分；超出窗口的證據一律排在窗口內證據之後。
- 輸出契約 — badge、`What I learned:`、粗體開頭的段落、`KEY PATTERNS`、引擎 footer 原樣傳遞、invitation；LAW 1–11 規範引用、禁用 em dash、不得把原始 ranked clusters 直接倒給使用者，comparison 另有專屬模板。
- 結果頁 — 預設深色可切淺色，`/` 搜尋，依平台／來源／「符合你的品味」篩選，依排名／最新／互動排序，卡片可展開，右下角 idea cart 可拖曳排序、寫筆記、`Copy for my agent`、`Download .md`；購物車存在瀏覽器，跨 `/latest` 與 `/outliers` 共用。
- 品味迴圈 — 使用者把 cart 貼回 agent，`taste.py add` 寫入 picks 與 counts，agent 改寫最多 8 行的「What you like」再由 `taste.py like` 寫回；下一次執行會提高貼合點子的排名，並把 angle 調向使用者偏好的格式。
- 安全與驗證 — 不發文、不按讚、不改平台內容；讀瀏覽器 cookie 必須明示同意；金鑰不寫進輸出；本地 corpus 預設不進匯出；URL 不得猜測或重組；發布日期要用 web 結果核對；`--verify-freshness` 會重新抓取來源驗證數字。
- 維運指令 — `doctor`（WORKING／TURNED ON - UNVERIFIED／NOT WORKING／COULD BE ON）、`--diagnose`、`--preflight`、`library feed`／`library search`、`queue list`／`queue cover`、三段式 `--discover` 協議、`--drill`、competitor fanout。
- 檔案結構 — `skills/latest` 放 skill 契約、`fill.py`、`taste.py`、`assets/results.html` 與字型；`skills/last30days` 放 257 行主契約、15 份 references、70 多個 `scripts/lib` 模組，以及 vendored 的 `bird-search` JS 客戶端。
- 課程用途 — 這包示範「研究 → 選題 → 排序 → 互動頁 → 品味回饋」的完整內容點子管線，可直接拆成可重複的選題工作流，也示範如何用規則與驗證把 LLM 的自由發揮壓在可查證的來源上。

# L2 detail

- `#L1-L93` — `README.md` — 套件總覽：`/latest` 做什麼、安裝步驟（Python 3.12、複製兩個 skill、可選 `yt-dlp`、填 YOUR DEFAULTS）、使用方式、品味教學、自有來源、需求與成本表、授權。
- `#L1-L103` — `skills/latest/SKILL.md` — `/latest` 的完整契約：YOUR DEFAULTS 區塊（主題、窗口、受眾、格式、來源、輸出資料夾）、九條 universal rules、七步 workflow、taste loop、locked decisions 與 resources。
- `#L1-L81` — `skills/latest/references/results-page.md` — 結果 JSON 的精確 schema（`kind`、`headline`、`run`、`items`）、欄位語意（`platform`、`date`、`metrics`、`check`、`fit`、`id`）、頁面行為、開啟與否的三種控制方式，以及 `taste.md` 的角色。
- `#L1-L163` — `skills/latest/scripts/fill.py` — 讀 results JSON、驗證必要欄位與 http(s) 連結、把資料塞進 `assets/results.html`、內嵌 woff2 字型使其離線可用、改寫 `<title>`，最後開瀏覽器；`--no-open` 與 `RESULTS_NO_OPEN=1` 可停用開啟。
- `#L1-L169` — `skills/latest/scripts/taste.py` — 品味檔的唯一寫入者：解析貼回的 cart（`Idea cart:` 開頭）、只保留 `From:` 指向本 skill 的 picks、去重後寫入 `## Picks` 與 `## Counts`，並用 `like` 子命令換掉最多 8 行的「What you like」。
- `#L1-L257` — `skills/last30days/SKILL.md` — 研究引擎主契約：reference routing 表、first-run gate、save-directory 解析、輸出 LAW 1–11（badge、禁用標題、禁用 em dash、footer 原樣傳遞、不得輸出原始證據叢集、planner 就是你、引用規則、社群聲音、第一方貼文、discovery 三指令），以及完整的 Security & Permissions 清單。
- `#L1-L165` — `skills/last30days/references/runtime.md` — 執行前必讀：stale-clone 自我檢查、Python 3.12+ 探測與 `uv` fallback、版本閘門錯誤訊息、`LAST30DAYS_NATIVE_SEARCH` 訊號、`--resolve-save-dir` 與設定優先序、hosted backend 路由例外。
- `#L1-L496` — `skills/last30days/references/research-runbook.md` — 研究前半：intent 與 query type 解析、以 `--diagnose` 的 `available_sources` 建 ACTIVE_SOURCES_LIST、5 類 keyword-trap pre-flight、Step 0.5（X／GitHub／Trustpilot／Amazon／Meta Ads）、Step 0.55（subreddit、category peers、TikTok／IG、第一方定位）、Step 0.75 計畫開頭。
- `#L497-L767` — `skills/last30days/references/research-runbook.md` — 研究後半：query plan 的 JSON 形狀與規則（disambiguation、禁用時間詞、intent→freshness／cluster 映射）、Research Execution 前置閘門與 heredoc 寫法、讀完八個資料區塊、2–3 個 WebSearch supplements、把補充結果 append 回 raw 檔的固定格式。
- `#L1-L289` — `skills/last30days/references/synthesis.md` — 合成規則：v3 cluster-first 讀法、multi-source 權重、Polymarket 只看百分比不看金額、X reply cluster、GitHub person／project 模式、受眾 register（exec／dev／creator／eli5）、`What I learned` 模板、pitch-vs-pulse、footer 與 invitation。
- `#L1-L90` — `skills/last30days/references/discovery.md` — trending／discovery 的完整路由：global 與 domain 兩種變體，以及 `--discover --nominate-only` → 由 host 評分 → `--discover --judgments` → `--discover --finalize` 的三指令協議。
- `#L1-L36` — `skills/last30days/references/agent-mode.md` — `--agent` 模式：跳過開場、不問問題、不等待回覆，直接輸出 `## Research Report`；非空 save dir 會自動存 raw 資料，空字串則停用。
- `#L663-L941` — `skills/last30days/scripts/last30days.py` — `build_parser()`：所有 CLI 旗標的權威清單，包含 `--emit`、`--search`、`--quick`／`--deep`、`--days`／`--as-of`、`--plan`、`--subreddits`／`--dedicated-subreddits`、`--x-handle`／`--x-related`、`--github-user`／`--github-repo`、`--tiktok-*`／`--ig-creators`、`--corpus`、`--verify-freshness`、`--store`、`--publish-html` 等。
- `#L3171-L3459` — `skills/last30days/scripts/last30days.py` — `_main()` 的指令派送：`--welcome`、`--resolve-save-dir`、`setup`、`doctor`、`library feed`／`library search`、`queue list`／`queue cover`、`--discover` 與三個 protocol leg 的互斥檢查、`--drill`、cached freshness。
- `#L3460-L3859` — `skills/last30days/scripts/last30days.py` — 一般研究路徑：預設 30 天、`--deep-research` 金鑰檢查、hosted backend 的隱私與相容性分流、`--diagnose`、plan 檔案讀取與 schema 驗證、entity-shaped topic 自動 `--auto-resolve`、subreddit／handle／repo／trustpilot 注入。
- `#L3860-L4349` — `skills/last30days/scripts/last30days.py` — 比較與收尾：competitor fanout、每個 entity 的獨立 auto-resolve 與 `subrun_kwargs_for`、main topic 失敗時拒絕以 competitor 為標題、`pipeline.run()` 呼叫、freshness 驗證、`_write_last_run`、`--store`、quality nudge、`_render_save_and_print`。
- `#L341-L514` — `skills/last30days/scripts/lib/pipeline.py` — `available_sources()`：來源註冊與 gating 的單一真相，說明哪些來源零金鑰、哪些需要 ScrapeCreators／X／GitHub／Bright Data，以及 opt-in 來源（Perplexity、LinkedIn、Trustpilot、Amazon、Meta Ads、Threads、Pinterest、Telegram）為何不能自動開啟。
- `#L2204-L2543` — `skills/last30days/scripts/lib/pipeline.py` — `run()` 前半：日期窗口、corpus 與 exclude 處理、X envelope lane、depth 設定、planner 或 external plan、grounding／jobs／corpus／Perplexity 的安全網、planner trace、first-party handle 集合、GitHub project／person 模式。
- `#L2544-L3113` — `skills/last30days/scripts/lib/pipeline.py` — `run()` 後半：逐 stream 抓取、supplemental searches、thin-source retry、normalize／score／dedupe、RRF fusion、rerank、cluster、source outcome 與最終 `Report` 組裝。
- `#L2002-L2108` — `skills/last30days/scripts/lib/pipeline.py` — `diagnose()`：providers、X backend、bird／xquik 狀態、native web backend、ScrapeCreators／GitHub／Bright Data 可用性、`available_sources`、browser cookie 模式、local writes 與 permission preflight，是 `/latest` 判斷「哪些來源這次真的能跑」的依據。
- `#L345-L411` — `skills/last30days/scripts/lib/planner.py` — `plan_query()`：比較題走 deterministic plan，其餘優先用 reasoning provider；LLM 失敗時退回 deterministic，並在沒有 `--plan` 時明確提醒 host model「你就是 planner」。
- `#L414-L464` — `skills/last30days/scripts/lib/planner.py` — planner prompt：要求 1–5 個 subquery、search／ranking 雙查詢、來源只能取自 available、禁用時間詞與 meta 詞、intent-modifier 要拆成多個改寫查詢，並保留專有名詞。
- `#L165-L217` — `skills/last30days/scripts/lib/planner.py` — `validate_external_plan()`：把 host 傳進來的 `--plan` 當成契約驗證，欄位或型別不對就 fail fast，避免默默退回較弱的內部 planner。
- `#L232-L342` — `skills/last30days/scripts/lib/providers.py` — reasoning provider 與模型 pin 的解析：Gemini／OpenAI／xAI／OpenRouter 的預設模型、deep 模式切換、auto 選擇順序，以及完全沒有金鑰時退回 `local`／`deterministic`／`local-score`。
- `#L307-L394` — `skills/last30days/scripts/lib/resolve.py` — `auto_resolve()`：用 3 個平行 web search 找 subreddit、X handle、GitHub profile，建構新聞 context、推測 official domain，再合併 category peers；這是沒有 host WebSearch 時引擎自己的 Step 0.55。
- `#L789-L948` — `skills/last30days/scripts/lib/render.py` — `render_compact()`：badge、日期與來源、freshness／warnings、DEGRADED RUN 警告、`EVIDENCE FOR SYNTHESIS` 包絡、ranked clusters、stats、best takes、top comments、source coverage、corpus、freshness verdicts、comparison scaffold、原樣傳遞 footer。
- `#L99-L137` — `skills/last30days/scripts/lib/library.py` — `scan_library()`：掃描 `~/Documents/Last30Days` 的 Markdown 與 briefs 目錄的 JSON，容忍手改檔與外來檔，讀不了就記 note 而不是中斷整個 feed。
- `#L419-L566` — `skills/last30days/scripts/lib/freshness.py` — `verify_report()`：從報告抽出可機器驗證的 claim（GitHub stars、status assertion 等），重新抓取來源後給出 contradicted／supported／unsupported 判定；網路停用或來源狀態不佳時降級成 typed verdict，而不是假裝驗證過。
- `#L1-L112` — `skills/last30days/scripts/lib/dedupe.py` — 同來源近重複偵測：正規化、3-gram Jaccard、token Jaccard、hybrid 相似度，預設閾值 0.7，並支援 CJK stopwords。
- `#L1-L79` — `skills/last30days/scripts/lib/query.py` — 共用查詢前處理：剝除 `what are the best`、`how to` 等前缀與 `best practices` 等 suffix，過濾 `latest`、`news`、`trending` 等 meta 噪詞，讓各平台查詢更接近真實標題。
- `#L1-L60` — `skills/last30days/scripts/lib/categories.py` — category-peer 對照表的設計原則：只用手寫、經 code review 的複合詞或領域專有名詞，first-match-wins，避免 `image`、`ai` 這類裸名詞造成誤判。
- `#L253-L289` — `skills/last30days/scripts/lib/categories.py` — `detect_category()` 與 `peer_subs_for()`：把主題分類後回傳優先排序的同類 subreddit，補足品牌專屬社群看不到的跨產品技巧討論。
- `#L1-L45` — `skills/last30days/scripts/lib/fusion.py` — weighted reciprocal rank fusion：`RRF_K = 60`、URL 正規化去重、候選排序鍵把 out-of-window 證據壓在窗口內證據之下。
- `#L1-L45` — `skills/last30days/scripts/lib/rerank.py` — rerank 的核心訊號：LLM relevance、entity-miss 罰 25 分、first-party 作者加 5 分，以及「fallback entity miss」何時仍應可見的門檻。
- `#L1-L30` — `skills/last30days/scripts/lib/signals.py` — 來源品質權重表：grounding 1.0、arXiv 0.9、YouTube 0.85、HN 0.8、Reddit 0.6、X 0.68 等，說明為何社群訊號要折扣、專業來源要加權。
- `#L1-L40` — `skills/last30days/scripts/lib/schema.py` — v3 資料模型入口：`Report`、`SourceItem`、`Candidate`、`Cluster`、`QueryPlan`、`ProviderRuntime` 等 dataclass，以及 `without_sources`、`candidate_out_of_window` 這類供 render 與 fusion 使用的輔助函式。
- `#L1-L30` — `skills/last30days/scripts/lib/doctor.py` — `doctor` 的定位：把 health probes、backend chain、prescriptions、diagnose 與 permission preflight 聚合成一個四狀態健康介面，並保留舊 `--diagnose`／`--preflight` 的凍結 JSON 形狀。
- `#L1-L147` — `skills/last30days/scripts/lib/vendor/bird-search/bird-search.mjs` — vendored 的 X 搜尋客戶端：只建 search-only client，支援 `--whoami`、`--check`、query + `--count` + `--json`，憑證由 `lib/cookies.js` 解析，是 X 在沒有官方 API 金鑰時的重要後備。
- `#L1-L18` — `skills/last30days/scripts/lib/reddit.py` — Reddit 介面：以 ScrapeCreators 搜尋全域與指定 subreddit、抓留言樹，並說明它與 keyless Reddit 路徑的分工。
- `#L1-L18` — `skills/last30days/scripts/lib/x_api.py` — 官方 X API v2 backend：app-only bearer 只放在 Authorization header，full-archive 被拒時退回 recent search 並把窗口壓到 7 天，錯誤字串固定化以避免洩漏 response body。
- `#L1-L12` — `skills/last30days/scripts/lib/youtube_yt.py` — YouTube 介面：用 `yt-dlp` 同時做搜尋與字幕擷取，零 API key，並處理 bot-wall 與 SSH 路由等實務問題。
- `#L1-L12` — `skills/last30days/scripts/lib/tiktok.py` — TikTok 介面：以 ScrapeCreators 依關鍵字搜尋、抓 engagement（views／likes／comments／shares）與字幕，需要 `SCRAPECREATORS_API_KEY`。
- `#L1-L12` — `skills/last30days/scripts/lib/hackernews.py` — Hacker News 介面：用 Algolia 做故事搜尋與留言補充，完全免費、無需認證，是技術類利基的高訊號來源。
- `#L1-L10` — `skills/last30days/scripts/lib/github.py` — GitHub 介面：用公開 Search API 搜 issues／PRs，token 或 `gh auth token` 只影響 rate limit；另有 person／project 模式抓 PR 速度、star 數與 release。
- `#L1-L12` — `skills/last30days/scripts/lib/polymarket.py` — Polymarket 介面：用 Gamma API 找預測市場，免費且讀取限制寬鬆；合成時只看機率與方向，不看金額。
