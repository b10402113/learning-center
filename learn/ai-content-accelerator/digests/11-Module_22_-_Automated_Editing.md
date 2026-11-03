---
source: "sources/ai-content-accelerator/20261103/4-Wk3 - Content Creation/11-Module 22 - Automated Editing/11-Module_22_-_Automated_Editing.md"
source_type: text
source_lines: 134
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- 自動剪輯是目前內容創作圈被問最多的主題之一；本課教 agent 自動剪輯原理，並提供 Rubric Editor 做到規模化剪片。
- 先自己剪一兩支影片是好習慣，能抓到剪點（cut）的手感；用 TikTok 與 Instagram 內建剪輯器即可，順便養帳號（warm up）。
- Rubric Editor 與 Rubric Scripts 一樣用 install prompt 安裝，跑在另一個 localhost 網址、由 Claude 在 Chrome 中驅動。
- 附帶 skill slash cut：把錄好的素材（例 MKV）交給 agent，多給上下文能提高第一次就切對的機率。
- 案例：作者對 teleprompter 念約 14 分鐘，錄完 8 支 reels；一個指令就得到可審的 Rubric Editor。
- 介面沿用 Premiere 快捷鍵：Ctrl 在時間軸放大、Shift 左右平移、R 播原始素材、S／D 調速；作者常設 2.1 倍速。
- Claude 判斷剪點的機制：透過檔案路徑取得原始錄影，agent 將影片轉錄（transcribe），並替每個字加上時間戳記，因此知道哪些字留、哪些剪、在哪個位置。
- 轉錄工具：AssemblyAI 一小時影片約 33 秒（作者用，14 分鐘素材不到 10 秒）；Whisper 免費但慢，一小時約 15 分鐘且跑在本地 CPU；ElevenLabs Scribe 速度與 AssemblyAI 相近但較貴，已有訂閱可用。
- 預設規則：開頭若有假開場（false start），保留最後一次 take；slash cut 內建此規則，但每個人的說話方式不同，需訓練微調。
- 在 Rubric Editor 審 clips 即訓練：把 clip 拉長補回、按 C 切開停頓、拖短刪除不要部分；上方有 teach your slash cut skill 與 teach your slash animate skill 開關，按 copy comments for all clips 複製所有未結案項目給 Claude。
- 本質是強化學習（reinforcement learning）的迷你版：越用越懂你的偏好，訓練好後幾乎每次剪出來的 clips 都對。
- 進階動畫用 slash animate（bonus 模組），在素材排好後套用，做出比單人畫面更有動態感的 reels。
- 輸出：叫 Claude render，或用手動 export 按鈕選解析度；成品可直接分發、排程（下週主題）。
- 已有剪輯軟體者（Adobe Premiere、Final Cut Pro、DaVinci Resolve）可讓 Claude Code 透過 MCP connector 操作；MCP connector 是加在 Claude Code 上的外掛，作者長格式影片會在 Premiere Pro 自己審一遍。

# L2 detail

- `#L1-L6` — 自動剪輯主題與 Rubric Editor 預告。
- `#L7-L14` — 先自己剪一兩支：TikTok／Instagram 剪輯器、剪點手感、順便養帳號。
- `#L15-L20` — Rubric Editor 安裝：install prompt、localhost、Claude 在 Chrome 驅動。
- `#L21-L32` — slash cut 用法：MKV 素材、上下文提示、14 分鐘錄 8 支 reels。
- `#L33-L46` — 介面與快捷鍵：Ctrl、Shift、R、2.1 倍速、S／D 調速。
- `#L47-L57` — Claude 如何判斷剪點：檔案路徑與帶時間戳的轉錄。
- `#L58-L68` — 轉錄工具比較：AssemblyAI、Whisper、ElevenLabs Scribe 的速度與成本。
- `#L69-L76` — 預設規則：假開場保留最後一次 take，之後可微調。
- `#L77-L91` — 每人說話方式不同；2 倍速審 clips、拉長、按 C 切開、拖短。
- `#L92-L103` — 強化學習：teach 開關、copy comments for all clips、越用越準。
- `#L104-L111` — 進階動畫 slash animate 與 bonus 模組。
- `#L112-L117` — 輸出：render 或 export 選解析度，成品可直接分發排程。
- `#L118-L129` — 既有剪輯軟體：Premiere、Final Cut Pro、DaVinci 透過 MCP connector 操作。
- `#L130-L134` — 收尾：練順後 Claude 第一次 prompt 就能剪好。
