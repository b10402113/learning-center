---
source: sources/real-engineer/20261116/course/001 Where We're Going.en.txt
source_type: text
source_lines: 47
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- Agent 的中心承諾是速度，但真正的難題是「怎麼建立足夠的信任，讓 agent 真的能替你出貨」，以及信任建立後如何加速而不撞牆。
- 整門課用「加速器 vs 煞車」的框架組織：先裝煞車，再踩油門。
- 第一週全部在講煞車：review（人工與自動）、code-based design、domain language、用 Wayfinder 規劃大塊工作。
- 第二週前半繼續煞車（自動檢查、回饋迴圈、data source，讓 agent 能自行驗證錯誤），後半才加速：software factory part 1 給具體範例，part 2 談自己的基礎設施。
- 工具門檻只有兩個：能在 terminal 執行的 agent，以及會用 skills；示範用 Claude Code。
- 目標是把「手動照顧 1–5 個 agent」推進到「同時舒服地跑 50 個 agent」，靠的是傳統軟體工程基本功，不是放任。

# L2 detail

- `#L1-L5` — 開場與課程命題：agent 承諾的是更快出更多程式碼，但多數團隊卡在「如何對 agent 建立信任到敢讓它出貨」，以及「信任有了之後怎麼踩油門而不炸掉」。
- `#L6-L11` — 課程形狀：現在在 before we start 區段，crash course 已可存取，是需要基礎的人該先去的地方。
- `#L12-L18` — 先修概念清單：context window、smart zone、steering，以及 grilling 和作者 skills 的基本用法；上過的人回頭複習，沒上過的一定要走一遍。
- `#L19-L29` — 兩週路線圖：把 software factory 想成有加速器與煞車，第一週專攻煞車——review（人工與自動）、code-based design、domain language 對齊、用 Wayfinder 規劃大塊工作；第二週延伸到自動檢查、回饋迴圈、data source 讓 agent 自我驗證，然後加速：part 1 給具體 factory 範例，part 2 開始 provisioning 自己的基礎設施。
- `#L30-L37` — 工具需求與終點：任何「跑在 terminal + 會用 skills」的 agent 都行，示範用 Claude Code；成果是為自己的基礎設施需求設計出大型 flow，把可信任的 agent 從手動管 1–5 個擴張到同時跑 50 個，並用煞車（傳統軟體基本功）確保不出垃圾。
- `#L38-L47` — 收尾：強調這些是貨真價實的工程原則（作者會搬出實體書來佐證），並希望過程本身是快樂、有 flow 的，不必每天都被 AI 榨乾。
