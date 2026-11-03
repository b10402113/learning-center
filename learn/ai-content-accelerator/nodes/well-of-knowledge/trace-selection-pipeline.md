# 主題研究 runbook

你打一次 `/latest`，幾十秒後拿到一份點子清單。畫面上只有一段話和幾個連結，中間其實停了六站：先確認有哪些來源活著，再把主題寫成查詢計畫，接著平行抓取、本地打分、融合、重排，最後才排版。

這條流值得拆開看。點子不對時，你要知道是哪一站壞了。是來源沒開、計畫寫壞、抓取失敗，還是排序把好東西壓下去。每一站的輸出長得不一樣，修的動作也不一樣。

## 先看整條管線

一次執行可以畫成這樣：

diagnose → query plan → 平行抓取 → 本地訊號 → RRF 融合 → rerank → render

每一站都留下痕跡：`--diagnose` 的 JSON、stderr 的 planner 摘要、footer 的來源統計，以及最後那份給模型讀的證據區塊。

<!--image:1-->

## 第一站：diagnose 決定這次有哪些來源

第一個動作不是搜尋，是問「現在有什麼可以用」。

`--diagnose` 會印出一份 JSON，裡面有 `available_sources`。這份清單是引擎解析完憑證後算出來的，不是猜 `.env` 裡寫了什麼。憑證可能來自 process environment、`.env`、macOS Keychain，只看設定檔會低估可用的來源。

這份 JSON 還帶了幾個會用到的欄位：`providers` 是哪些推理供應商可用，`local_mode` 在沒有任何外部供應商時為 true，另外還有 `x_backend`、`has_scrapecreators`、`browser_cookies`、`external_commands`（`yt-dlp`、`gh` 這類指令在不在 PATH 上）、`local_writes`，以及最後的 `permission_preflight`。

`--diagnose`、`doctor`、`--preflight` 這幾條路要維持不碰網路。`safe=True` 的時候，X 的可用性只從本地證據回答，不做探測。

來源清單決定後面計畫能指派誰。X 不在清單裡，planner 就不能把 X 寫進 subquery。

## 第二站：query plan 是你寫的，不是引擎猜的

有具名實體的主題，計畫要自己寫，再用 `--plan` 把檔案路徑傳進去。理由很直白：host 上的推理模型看得到使用者的上下文，引擎看不到。引擎收到外部計畫會先驗證，再清洗。

驗證要求四個欄位：`intent`、`freshness_mode`、`cluster_mode`、`subqueries`。每個 subquery 要有 `search_query`、`ranking_query`，還有一個非空的 `sources` 陣列。

清洗會做幾件事。`intent` 不在允許清單就重新推斷。`sources` 只能從這次可用的來源裡挑。權重會正規化。quick 深度只留第一個 subquery。

`search_query` 寫成關鍵字，像平台上內容的標題。不要放時間詞，例如 last 30 days、月份、年份；也不要放 news、updates 這類 meta 字眼。`ranking_query` 寫成一句自然語言問題，重排時會用到。主要 subquery 的權重是 1.0，次要 0.6 到 0.8，邊緣角度 0.3 到 0.5。

沒有 `--plan` 時，引擎會在 stderr 印一行提醒：你是 host 的推理模型，你就是 planner。接著它走確定性的 fallback。fallback 是 headless 或 cron 的路，不是一般使用者的路。比較型主題抓到兩個以上實體時，也會強制走確定性計畫。

計畫裡的 `freshness_mode` 決定新鮮度怎麼算。breaking news 和 prediction 用 `strict_recent`；concept 和 how_to 用 `evergreen_ok`；其他用 `balanced_recent`。

## 第三站：每個 subquery 與 source 的組合是一條流

計畫裡的每個組合都送進 thread pool。預設深度最多 16 個 worker；comparison 的子執行最多 4 個，避免多路比較把 thread 數放大。

每條流抓回來的東西先經過本地打分，不呼叫模型。`signals.annotate_stream` 算三個訊號：local relevance、freshness、engagement，再合成一個 `local_rank_score`：

0.65 × local_relevance ＋ 0.25 ×（freshness ÷ 100）＋ 0.10 ×（engagement ÷ 100）

打分完先排序，再過 `prune_low_relevance`。預設門檻 0.15。社群來源完全沒有互動時，門檻拉高到 1.5 倍。TikTok 和 Instagram 低於 1000 次觀看會被剔除，除非那是這批唯一的來源。第一方帳號發的文不受這條限制，因為貼文很少提到自己的名字。有 transcript 的 YouTube 也直接放行。

來源本身有品質分。Grounding 是 1.0 的基準，YouTube 0.85、Hacker News 0.8、X 0.68、Reddit 0.6。這個分數後面的加權還會再用一次。

抓取有預算。整個階段最多等 180 秒，卡住的 stream 記成 TIMEOUT，不會拖住整輪。暫時性的 5xx 會重試一次，但預算用完就不重試。遇到 429，其他還在排隊的 stream 會直接跳過這個來源。

每條流截到多長看深度。quick 是每流 6 筆、池子 15、重排 12；default 是 12、40、40；deep 是 20、60、60。jobs 是例外，它不截，因為招聘頁的價值就在完整。

## 第四站：RRF 把很多排名合成一個池子

每條流都有自己的名次。RRF 不看分數大小，只看名次。平滑常數 K 是 60，出自 Cormack 等人 2009 年的做法。

一條流的權重等於 subquery 權重乘上來源權重，單筆得分是：

<!-- source: sources/ai-content-accelerator/20261103/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/last30days/scripts/lib/fusion.py#L357-L360 -->
```python
weight = subquery.weight * plan.source_weights.get(source, 1.0)
score = weight / (RRF_K + rank)
```

同一個 URL 從不同流出現時，分數相加，較豐富的 enrichment 留下。之後套一層每位作者的上限，避免同一個帳號佔滿池子。池子還會留位置給每個合格來源至少兩筆，Reddit 另外保留 2 到 4 個給互動最高的討論。

時間窗優先。窗外的證據排序時一律排在窗內之後，不管它多相關。這是「last 30 days」這個承諾的底線。

<!--image:2-->

## 第五站：rerank 決定誰排前面

融合完的池子交給 rerank。前 `rerank_limit` 筆進 LLM 評審，一次拿回 relevance 0 到 100 和一句理由。剩下的候選，以及沒有供應商的時候，走確定性的 fallback。

評審提示裡有一條硬規則：候選的標題或摘要完全沒提到主要實體，最高只能拿 30 分。第一方貼文例外，因為本人不會在自己的貼文裡寫自己的名字。

之後還有幾個補救。第一方貼文有分數地板。高互動但文字不吻合的會被救回來。第一方回覆別人的貼文會被拉進可見區間，並標記成互動訊號。

最後的分數是加權：

<!-- source: sources/ai-content-accelerator/20261103/3-Wk2 - Content Ideation/5-Module 11 - Idea Sources/resources/latest/skills/last30days/scripts/lib/rerank.py#L826-L840 -->
```python
base = (
    0.60 * rerank_score
    + 0.20 * normalized_rrf
    + 0.10 * candidate.freshness
    + 0.05 * (candidate.source_quality * 100.0)
    + 0.05 * min(engagement_val * 6.0, 100.0)
)
```

重排分數低於 20 的，整筆再乘 0.3。窗外的乘 0.35。私人的 corpus 一律用本地 fallback 計分，它的標題和摘要不會進到外部模型的 prompt。

<!--image:3-->

## 第六站：render 把證據包成模型讀得懂的樣子

`render_compact` 的輸出是給模型看的，不是給你看的。它的順序固定。

badge 一行、標題、日期區間、來源清單。有新鮮度問題就加一段 Freshness，有警告就加 Warnings。具名實體的主題卻沒帶任何 pre-research 參數時，會多一段 DEGRADED RUN 警告。

接著打開 `EVIDENCE FOR SYNTHESIS` 區塊。裡面有排序後的 cluster、Stats、Best Takes、Top Community Comments、Source Coverage。這段是素材，模型要把它改寫成 `What I learned:` 的散文，不能原樣貼出去。

區塊關起來之後，才是要原樣傳遞的東西：新鮮度的核對結果，以及 `PASS-THROUGH FOOTER`。footer 裡有每個來源的筆數和互動。

最後還有一關。`freshness.verify_report` 會把報告裡的具體數字重新抓一次。抓得到而且數字一致就標 current，數字變了就標 stale，抓不到（包含網路關閉）標 unsupported。這一步不影響排序，但它讓「這句話一個月後還成不成立」有答案。

<!--image:4-->

## 把這條流對回自己的選題

下次 `/latest` 給的十個點子不順眼，先別急著重跑。打開 stderr，看 planner 印出的 subquery 和來源。

如果來源清單很短，問題在第一站。如果 subquery 只是把主題照抄一遍，問題在第二站。如果某個來源整段 TIMEOUT，問題在第三站。如果好東西抓到了卻排在後面，問題在第四站和第五站。

挑一個你已經有的點子，把它背後的 subquery 寫出來。寫不出來，就代表你還不知道自己在找什麼。
