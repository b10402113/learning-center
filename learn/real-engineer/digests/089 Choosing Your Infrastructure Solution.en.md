---
source: sources/real-engineer/20261116/course/089 Choosing Your Infrastructure Solution.en.txt
source_type: text
source_lines: 229
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 示範用「站在學員位置」的假設：tracker 用 Linear、git host 用 GitHub 不變，其餘三塊開放討論；作者點出這其實是 Wayfinder 的典型場景（不知道終點、需要研究與 prototyping），但這裡先當 grilling 處理。
- 第一件事是語彙對齊：agent 一開始用「control plane」「接收 webhook」等自創說法，提醒它使用 skill 定義的軟體工廠語彙後才對上。
- orchestrator 的三個選項（durable workflow 產品／自建 server／與 runner 同一家廠商）本質上是「要給廠商多少控制權」的取捨；最後選 Inngest，因為它天生處理 dedup、timeout、retry、concurrency 與狀態查詢。
- 關鍵發現：Inngest 不執行你的程式碼，它只是大腦與記憶，function code 要自己 host，因此 orchestrator 變成「Inngest + 一個小 function host（Fly.io connect worker）」，因為需要 git 與檔案系統。
- 決策結果：Linear（tracker）＋ GitHub（git host）＋ Inngest + Fly.io worker（orchestrator）＋ Daytona（runner）＋ LangFuse（observability），另加一個「沒人回報就結束 run」的 timeout 擁有者與 Linear agent app 身分。
- 反覆出現的實務洞見：deploy 會殺掉正在等待的 run、ephemeral sandbox 會把 agent log 一起刪掉讓 retro 失效、以及「一次一題」的 grilling 會退化成連續簡單題，需要改成「ask in rounds」。
- 最終產出一份可貼成 ticket 的 spec：把 software factory 從 GitHub Actions 搬到 Linear + Inngest + Daytona + LangFuse，程式碼放新的 private repo。

# L2 detail

- `#L1-L14` — 開場設定：先補背景資料再開 grill；作者想像自己站在學員立場（有偏好的 tracker 與 git host，其他三塊未知），並指出這種「不知道終點、要大量研究與 prototyping」其實是 Wayfinder 的典型案例，只是本片用 grilling 示範。
- `#L15-L28` — 語彙問題與 orchestrator 選項：agent 讀完四個 GitHub workflow 後理解現況，卻用「control plane／接收 webhook」等自創詞，提醒「use the language here」後才改用 skill 語彙；orchestrator 給出三個選項——durable workflow 產品、自建 server、或由同一家 sandbox 廠商同時包 orchestrator 與 runner。
- `#L29-L38` — 決策本質是控制權分配：選 C 等於綁定 sandbox 廠商，選 B 則要自己承擔 server + database 的複雜度；作者坦承還無法判斷，要求更多 pros/cons，並指出一次只問一題的好處正是「先做那個其他決定都會往下流的關鍵決策」。
- `#L39-L54` — orchestrator 必須做對的事：捕捉每個觸發（Linear webhook）、處理重複觸發（Linear 與 GitHub 都會重送，需 deduplication）、處理 agent 停止或 runner 死亡（timeout 後決定是否 retry）、控制併發避免無限迴圈、並能查看當前狀態；因此建議 durable workflow 產品，例如 Inngest。
- `#L55-L70` — 自建方案的缺點與 Inngest 的選擇：自建是 server + Postgres，等於自己扛 uptime、hung run、沒有 UI 只能靠 SQL 加觀測，最痛的是「deploy 中途會孤兒化還在等 runner 的 run」；作者選 Inngest 部分原因是合夥人 Joel 曾任其 dev rel（明言沒有贊助），並追問定價、免費額度與「怎麼跟 Inngest 溝通」。
- `#L71-L100` — Inngest 的運作模型與價格：免費額度每月 5 萬次 execution、log 只留 24 小時（可接受，因為會外接觀測）；關鍵是 Inngest 不跑你的程式碼，它只是 orchestrator 的大腦與記憶，function code 要自己 host（serve 或 connect），GitHub token、Linear API key、webhook secrets 也放在那裡；因此用 Fly.io 的 connect worker，因為需要 git 與檔案系統，Vercel／Cloudflare serverless 不適合。
- `#L101-L160` — runner 的選擇與實作問題（含後續細節）：候選有 Vercel Sandbox、Daytona、Fly.io，Sandcastle 0.12 已支援這些 provider，且 model token 成本遠高於機器（有 Claude 訂閱時 compute 每次 run 只要幾美分）；真正的問題是「run 怎麼上 runner」——在 worker 上跑 Sandcastle 會因 deploy 而中斷 60 分鐘的 run、可丟棄 runner 則需要 write token，「bundled agent platform」是第三條路；作者選 B 並強調 deploy 頻繁時 run 絕不能被 deploy 殺掉。 之後轉向實作細節：commit 回 GitHub 的方式、runner 廠商最後選 Daytona（有剩餘 credits）、誰負責結束不回報的 run、金鑰與憑證存放；Linear 的亮點是可以把 issue delegate 給 agent，讓 agent 成為系統裡的一級「人」，取代 GitHub 上略顯拼裝的 label 機制。
- `#L161-L181` — observability：來源包含 Linear agent session、Inngest dashboard、Daytona；這些資料極珍貴，因為 retro 要靠它改進 agent；預設 Daytona 的沙箱是 ephemeral，run 一結束 agent log 就被刪掉，retro 等於無效；因此選 LangFuse（hobby 每月 5 萬 units、30 天歷史，約每天 5–8 次 run，價格吃緊），也可自架或把 transcript 倒進既有的 Datadog／Grafana／Honeycomb。
- `#L182-L212` — 收尾的 grilling 與教訓：feedback button 怎麼開票進 Linear、Claude Code 憑證、是否用 Linear 的 GitHub integration、worker 是否 stateless、長效 secret 放哪、工廠程式碼是否與專案同 repo（作者認為應獨立，且一個工廠要能拉多個 repo 進單一沙箱）；也提醒 grilling 會退化成「一次一題的簡單題連發」，改用「ask in rounds」一次掃完；最後把所有服務決策收斂成完整設計，直接開票。
- `#L213-L229` — 產出與收束：ticket 為「Move the software factory off GitHub Actions onto Linear, Inngest, Daytona and LangFuse」，解法是在新的 private repo 重建服務、GitHub 當 host、Linear 當 tracker；可再做一個 wizard 協助 provision；作者強調這份 spec 的價值在於把「服務之間怎麼接」這種難以想像的細節先想清楚。
