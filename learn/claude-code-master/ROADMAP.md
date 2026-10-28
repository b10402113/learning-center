---
subject: claude-code-master
status: draft # draft → confirmed
path: problem-driven
created: 2026-10-28
---

# ROADMAP — claude-code-master

## Goal

把 Claude Code 從「一個會寫程式的聊天視窗」升級成自己的作業系統：skills、memory、routines、apps 四個層都親手搭起來，讓它替我自動跑重複性的工作，並且能把它接到我真正在用的工具（Gmail、行事曆、YouTube、筆記）上。最後還要用同一套 agent 平台，做出能上線、長得好看的網站／小工具。

判準不是「知道有這個功能」，而是：我能在自己的 workspace 裡指出哪個檔案、哪個 skill、哪條 routine 在替我做事，並且說出它斷掉時會怎樣。

## Learning path

**problem-driven（問題驅動）** — 每個節點都是一個學習者實際會撞到的問題，節點內先看「沒設定會怎樣」的失敗長相，再學對應機制，最後一定綁到一個可操作動作。

- **角度：** 用真實痛點當節點邊界，機制按「這個問題需要什麼」拉進來，而不是按功能清單排列。
- **優化：** 立即適用性——每學完一個節點，就有一件手上的麻煩被解決。
- **如何排 Tier：** Tier 1 先立「同樣的模型、結果為何差這麼多」的心智模型（model／harness／context ＋ ARMS 地圖）；接著 Tier 2 處理 session 內的即時旋鈕；Tier 3–6 依序解掉「重打 prompt（Skills）→ 記不住（Memory）→ 不會自動（Routines）→ 接不上工具（Apps）」四個痛點；Tier 7 解決「做不美、上不了線（Taste & Design）」；Tier 8 收束成第二大腦。每一層都先回答問題、再給機制。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 立框架：為什麼同樣的模型、結果差這麼多

1. **[為什麼同一個模型，別人做得到你做不到](nodes/why-same-model-different-results.md)**
   - Goal: 能用 model／harness／context 三層說出「差異只在 context」，並用 ARMS 四層地圖定位整個 workspace。
2. **[把環境架起來：介面、花費、工具去哪拿](nodes/set-up-the-workspace.md)**
   - Goal: 能在自己的機器上選定介面、開好 workspace、看懂方案與用量、知道從 GitHub 裝工具，並用語音輸入加速。

### Tier 2 — 控場：session 裡的即時旋鈕

3. **[為什麼聊越久它越笨](nodes/why-sessions-get-dumb.md)**
   - Goal: 能解釋 context window、context rot 與 compaction，並判斷何時該壓縮或重開一個 session。
4. **[模型、思考力度、放行程度怎麼調](nodes/tune-model-effort-permissions.md)**
   - Goal: 能依任務選對模型層級、effort 等級與 permission mode，並用換模型在排程上省 token。

### Tier 3 — 別再重打：Skills

5. **[怎麼不再重打同一個 prompt](nodes/stop-retyping-prompts.md)**
   - Goal: 能寫出第一個 skill，並用「兩次法則」把重複的 prompt 或一整段 session 存成可重用的 skill。
6. **[怎麼讓 skill 又強又安全](nodes/make-skills-powerful-and-safe.md)**
   - Goal: 能做出帶腳本／素材、會互相呼叫的進階 skill，並在安裝外部 skill 前先檢查惡意碼、判斷何時該整併。

### Tier 4 — 讓它記住你：Memory

7. **[怎麼給它一個跨 session 的記憶](nodes/give-it-memory.md)**
   - Goal: 能用 CLAUDE.md（員工手冊／兩份）＋ MEMORY.md 索引 ＋ `/init` ＋ 自動記憶，建出跨 session 的記憶。
8. **[怎麼讓它每聊一次就更懂你](nodes/memory-cost-and-calibration.md)**
   - Goal: 能算出兩個記憶檔的 token 成本、判斷健康大小，並用 calibrate skill 把每次修正回寫成記憶與 skill。

### Tier 5 — 讓它自己跑：Routines

9. **[怎麼讓工作在你不在時自己完成](nodes/routines-local.md)**
   - Goal: 能建一條 local routine（排程自寄 prompt ＋ 塞進 skill），檢查第一次跑並用白話優化它。
10. **[筆電關了也要跑——以及什麼時候根本不該用 LLM](nodes/routines-cloud-and-deterministic.md)**
    - Goal: 能用 cloud routine（skill 放私有 GitHub repo）與 deterministic／Modal（零 token）自動化，並用「有腦 vs 無腦」判斷該用哪種。

### Tier 6 — 接上你真正在用的工具：Apps

11. **[怎麼接 Gmail／行事曆／YouTube——MCP、API、CLI 哪個省 token](nodes/connect-apps-mcp-api-cli.md)**
    - Goal: 能比較 MCP／API／CLI 的 token 成本，選對連法把 Gmail、行事曆、YouTube 接上並真正自動化。
12. **[想接的 App 沒有 connector 怎麼辦](nodes/build-your-own-connector.md)**
    - Goal: 能用 Printing Press 把任何 App 變成省 token 的 CLI（HAR→Go CLI→skill），或自己造 app 來掌控連線。

### Tier 7 — 做得好看、真的上線：Taste & Design

13. **[怎麼做出「不像 AI 生成」的網站](nodes/design-with-taste.md)**
    - Goal: 能走完 CRAFT 的 Create 段——抓區塊、`/html` 預覽、建設計系統、UI Sniping、`/tweak`、生圖——做出有品味的頁面。
14. **[怎麼把它真的上線](nodes/rig-audit-deploy.md)**
    - Goal: 能接真表單（Resend）、用 Playwright 自測、部署到 Vercel，並把整段流程存成可重用的建站 skill。

### Tier 8 — 收束

15. **[把整個 workspace 變成你的第二大腦](nodes/second-brain-capstone.md)**
    - Goal: 能走一遍四層（apps／routines／memory／skills）串成的第二大腦，說明它為何更省 token，並用模板套到自己身上。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
