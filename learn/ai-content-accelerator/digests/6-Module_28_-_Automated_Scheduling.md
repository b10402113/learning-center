---
source: "sources/ai-content-accelerator/20261103/5-Wk4 - Content Distribution/6-Module 28 - Automated Scheduling/6-Module_28_-_Automated_Scheduling.md"
source_type: text
source_lines: 172
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- 問題：手動把同一份內容發到每個平台很花時間，要逐一上傳、複製貼上 caption；**排程工具**把這件差事從你身上拿走。
- RoboNuggets 使用的工具是 **Blotato**（由社群友人 Sabrina 開發，提供折扣），可讓一支影片發到 **九個平台**、時間自選。
- Blotato 的關鍵優勢：**可被 AI agent 操作**；用 **Codex** 或 **Claude Code** 告訴 agent 幾點發、發哪些影片與 captions，就會排進行事曆。
- Blotato 連接的九個平台：**Instagram、Facebook、TikTok、YouTube、LinkedIn、Twitter、Threads、Pinterest、Bluesky**。
- 替代方案一 **Postiz**：開源、免費，但門檻高——需自架 **Docker server** 與資料庫（如 **Postgres**），且自建 App 要通過各平台的 **audit process**，有時要數週才通過。
- 替代方案二：**先手動發**，直到你覺得投資排程工具划算為止。
- **/post** skill：作者用來一次排多篇貼文，內建發文時間規則，可改成一天五次或一天一次；預設連到 Blotato，由 agent 處理排程。
- 一次性設定三件事：**Blotato 帳號**、**API key**（在 Blotato 設定裡）、**連接帳號**（single sign-on 逐一授權），最後取得 **account ID**；API key＋account ID 就等於讓 agent 直接發文的能力。
- 實戰流程：在 **Rubric Editor** 剪好素材 → 匯出按 **render all** 把指令複製到剪貼簿 → 貼給 agent → 輸入 **/post** 並下指示（例如「從今天起一天一支，排到七天後，發到 IG、YouTube Shorts、TikTok」）→ 7 支 clips 自動 render 並排程。
- 可在 Blotato 的 **calendar** 分頁檢查排程（範例為連續七天、每天三篇），點進貼文可檢查 caption。
- 想更精細控制：把 clips 先 render，再要求先在 **Rubric Scripts** 檢查 captions；可在 video 分頁播放、看逐字稿與 caption，並停用或增加平台，再把指令複製給 Claude／agent。
- 核心概念：把偏好**寫成 skill**（排程時間、發到哪些帳號、發到哪裡），本質是把指令包成快捷方式；Blotato 另有 auto-DM 等進階功能（超出本課）。
- 發文時間沒有想像中重要：品質（有用）才是重點，應能發多少就發多少以快速迭代；作者設 **9am、1pm、5pm** 只是因為那時他醒著，方便出錯時手動刪文。
- TikTok 有**地區性**：會先把內容推給所在國家（作者新帳號最早觀眾多來自澳洲），這也是排程時間宜設在清醒時段的原因；北極星仍是有用、有品質的內容，靠大量出貨、試 hooks／講法、增加鏡頭自信來達成。

# L2 detail

- `#L1-L12` — 為何需要排程工具：手動逐一上傳與複製 caption 太耗時，排程工具接手。
- `#L13-L24` — Blotato 簡介：RoboNuggets 使用、Sabrina 開發與折扣、一支影片發九平台、可被 Codex／Claude Code 等 agent 操作。
- `#L25-L38` — Blotato 可連接的九個平台清單。
- `#L39-L52` — 替代方案 Postiz：開源免費但需自架 Docker／Postgres，且要通過平台 audit process。
- `#L53-L58` — 替代方案：先手動發，直到值得投資工具。
- `#L59-L73` — /post skill 的用途與可調整的發文頻率（一天五次或一次）。
- `#L74-L91` — 一次性設定：Blotato 帳號、API key、single sign-on 連接帳號、account ID，以及 /post 把偏好寫成程式碼。
- `#L92-L107` — 實戰演練：Rubric Editor render all → 貼指令 → /post → 七天排程範例。
- `#L108-L115` — 在 Blotato calendar 分頁檢查每日排程與 caption。
- `#L116-L135` — 更精細的控制流程：先進 Rubric Scripts 檢查 captions、逐字稿，停用或增加平台。
- `#L136-L143` — 核心概念：把偏好寫成 skill；Blotato 的 auto-DM 等進階功能預告。
- `#L144-L157` — 發文時間的取捨：品質重於時段，作者設 9am／1pm／5pm 是為了清醒時能處理錯誤。
- `#L158-L172` — TikTok 的地區推送特性與排程時段建議，收束回「有用內容＋大量出貨」的北極星。
