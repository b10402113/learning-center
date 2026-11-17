---
source: sources/real-engineer/20261116/course/Day 1, Afternoon _ Office Hours.en.txt
source_type: text
source_lines: 505
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- TDD 還該用嗎？red-green-refactor 是為人類有限的工作記憶設計的；agent 工作記憶更大、限制不同，所以不必強求 RGR，保留 TDD 只因為它是讓 agent 在意測試最省 token 的說法。
- grilling 一直問出顯而易見的問題怎麼辦？差別在初始 prompt 有沒有給「why」；給了背景與問題陳述，agent 才敢自己判斷，而且使用者才是 grilling 的主導者。
- 怎麼信任 agent 寫的測試？用 fully verifiable：給足資料來源、必要時給真實服務的 key，讓它真的把東西跑起來；測試本身從來不是唯一證據。
- retro 的學習怎麼沉澱成工具？retro 本來就會把教訓轉成 lint、type check 等 deterministic checks，這些以後不花 token，只要別讓 CI 變慢。
- legacy 遷移怎麼套 factory？用 ratchet：新舊兩套 linter 並行，把錯誤數鎖住，每輪還一點債，最後刪掉舊的。
- glossary 什麼時候該 prune？170 個術語、732 行已超過人腦負荷；把 spec 砍成一行定義、刪掉常識條目。
- ADR 要留嗎？留在 repo，因為它解釋非顯而易見的決策；功能整個刪掉時 ADR 也刪，新決策矛盾就標 superseded 或寫 counter-ADR。
- 30 年 legacy codebase 從哪開始？先弄清每個 Chesterton's fence 為何存在，知道 why 之後 retro、自動檢查、deepen module 才有意義。
- 150K smart zone 還成立嗎？重點不是到點就懸崖式變笨，而是 faithfulness hallucination、cache 過期重複計費與延遲變慢。

# L2 detail

- `#L1-L46` — 問 TDD 還是不是對的做法：red-green-refactor 是為了讓人被打斷、去泡咖啡後還能接上，本質是補償人類極小的工作記憶；agent 短期記憶更大，所以 RGR 對它不是重點。作者保留 TDD 的理由只有一個：這兩個字很省 token 地讓 agent 在意測試。
- `#L47-L79` — 問 grilling 為何老是問出顯而易見的問題：同一個 harness、模型，差別在初始 prompt 有沒有交代「為什麼」。作者用 admin analytics 的例子說明，給了痛點與來由，agent 就能自己收掉一部分問題；同時提醒你才是主持人，可以直接叫它自己想答案。
- `#L80-L120` — 問怎麼信任 agent 寫的測試：提出 fully verifiable，也就是給 agent 足夠的好資料與服務存取（Sandcastle 的例子是補上 Modal、Vercel、E2B 的 key），讓它把改動驗到極致；單靠測試覆蓋從來不夠，而 agent 並非惡意，它只是照你釋放的訊號最佳化。
- `#L121-L147` — 問 retro 的學習怎麼轉成 deterministic tooling：retro 看歷史 session、做回顧，會把教訓變成 lint、type check 這類自動檢查，未來不再消耗 token；判斷標準只有一個——不要讓 CI 或 pipeline 變太長，不用再加一層理論。
- `#L148-L160` — 問上完課能不能做出開發者品質的產品：可以，但順序是先品質再速度。agent 會把整個 codebase 當成輸入並延續現狀，它不會想革命；codebase 爛，產出就更爛。
- `#L161-L218` — 問 30 年 legacy（.NET 4.7 升 .NET 10、新舊必須同步改）怎麼做：先問「這個 codebase 是否 factory ready」，能否進 sandbox 是關鍵。遷移其實是 factory 的好題目，作法叫 ratchet：ESLint（lint legacy）與 OXLint（lint new）並行，把 200 個錯誤鎖成靜態數字，每輪修五個慢慢還債，歸零後刪掉舊的。
- `#L219-L300` — 用自家的 course video manager 示範 prune glossary：732 行、170 個術語、25 個小節，已經沒人記得住；把 job、background work 這種寫成規格的條目砍回一行定義，刪掉常識項（global search、local only command），必要時重跑 domain modeling skill。作者認為單人專案只需一份 glossary，多份是給不同人類語言分工用的。
- `#L301-L346` — 問 ADR 的壽命與衝突處理：ADR 該留在 repo，因為它記錄非顯而易見的事（例如 recorder service 閒置十分鐘就關掉，不知道的人會以為是 bug）；功能整個刪掉時 ADR 一起刪，新決策與舊 ADR 矛盾就標 superseded 或寫 counter-ADR。glossary 最後從 732 行砍到 531 行，再砍成 bare bones，並對照 diagram、diagram snapshot 這些「健康」條目。
- `#L347-L386` — 問 graphify、code graph 這類工具值不值得：有 graph 不等於好導航，好 graph 與壞 graph 差很多；Claude Code 團隊試過各種 semantic search，結論是不如直接用檔案系統。把 codebase 轉成 graph 有索引成本，而 codebase 一直在變，靠 navigation pointer 與更好的檔案結構就夠。
- `#L387-L444` — 問 150K smart zone 還成不成立：SmartZone / DumbZone 常被誤讀成到點就墜崖；作者在意的是 dumb zone 的 faithfulness hallucination（忘記你給的資訊）、cache 過期後重新計費、以及延遲變慢。機械性任務在 dumb zone 還能做，但他仍把 150K 當成該拆工作的警訊。
- `#L445-L477` — 問 30 年桌面版 legacy、文件極少、幾乎沒測試的企業怎麼開始：核心是 Chesterton's fence，先弄清楚每段程式為何存在（可能要請退休的人回來），知道 why 之後 retro、自動檢查、deepen module 才有意義；文件不足與沒測試都是「不知道 why」的症狀。推薦 Working Effectively with Legacy Code。
- `#L478-L505` — 問課程怎麼在團隊情境練習：直接在真實工作裡套用，domain language 最該先做，即使只是換一種問法；Wayfinder 也適合；grilling 尤其該搬到團隊原本的 Slack / Discord，而不是 terminal。結尾是對史上最大一屆 cohort 的感謝，屬閒聊。
