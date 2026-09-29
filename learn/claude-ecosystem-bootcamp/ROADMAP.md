---
subject: claude-ecosystem-bootcamp
status: confirmed
path: practice-first
created: 2026-09-29
---

# ROADMAP — claude-ecosystem-bootcamp

## Goal

從零開始，學會使用整個 Claude 生態系並把重複工作自動化：能在 Claude 的四大介面（Chat、Cowork、Code、Design）之間選對工具，會用 Projects / Artifacts / Skills / Connectors / Plugins，會接 MCP 與第三方工具（Canva、Airtable、Tally、Firecrawl、Slack 等），並能用 routines / 排程 / dispatch 把日常任務自動跑起來。終點是「能自己搭出一條可運作的 AI 工作流」，而不是只會聊天。

## Learning path

**動手優先（practice-first）** — 先用最小的步驟做出真的能用的成果，建立信心，再把背後的概念在「用得到」的當下補上。Tier 1 先註冊、對話、生出第一個 artifact；Tier 2 用 Chat 與 Cowork 做真實日常任務；Tier 3 才把重複做法固化成 skills、接上 connectors/MCP/plugins；Tier 4 讓整條流程自動跑；Tier 5 回頭掌握引擎（用量、模型、context/harness、換 3P 模型）；Tier 6 進入 Claude Code、Design 與各介面整合；Tier 7 用三個旗艦應用把前面全部串起來。

## How to use

依序讀節點。每個節點是一個 step-DAG。先跑 `/probe claude-ecosystem-bootcamp/<node-id>` 量測掌握度（硬性關卡），再跑 `/nodes claude-ecosystem-bootcamp/<node-id>` 確認並開始該節點的工作。

## Nodes

### Tier 1 — 起步：馬上用起來

1. **[[learn/claude-ecosystem-bootcamp/nodes/claude-orientation|Claude 是什麼、生態系長怎樣]]**
   - Goal: 能用自己的話說明 Claude 是什麼、它與聊天機器人的差別，以及 Chat / Cowork / Code / Design 四種工具各在解決什麼問題。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.1. The world has already shifted.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.2. The AI landscape in 2026.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.3. Where does Claude fit in.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.4. Your roadmap.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.5. What is Claude.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.15. Overview.en.srt]]

2. **[[learn/claude-ecosystem-bootcamp/nodes/get-started|註冊、選方案、登入三種介面]]**
   - Goal: 能建立 Claude 帳號、依用量選對 Free / Pro / Max 方案，並在 web、desktop、mobile 任一介面登入開始使用。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.6. Register a new account & pricing.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.7. How to access Claude.en.srt]]

3. **[[learn/claude-ecosystem-bootcamp/nodes/first-win|第一次對話與第一個 Artifact]]**
   - Goal: 能完成一次包含語音、網路搜尋、看圖與延伸思考的對話，並用一句話讓 Claude 生出一個可用的 artifact。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.8. Claude models explained.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.9. A complete walkthrough.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.11. Artifact.en.srt]]

### Tier 2 — 日常主力：Chat 與 Cowork

4. **[[learn/claude-ecosystem-bootcamp/nodes/chat-for-real-work|用 Chat 做真實工作]]**
   - Goal: 能判斷哪些任務該交給 Chat，並用它完成寫作、解釋、腦力激盪與快速分析。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.16. Claude Chat.en.srt]]

5. **[[learn/claude-ecosystem-bootcamp/nodes/cowork-files|Cowork 接手本機檔案]]**
   - Goal: 能讓 Cowork 接手本機資料夾，完成整理 Downloads 與把收據彙整成 Excel 報表這類多步驟任務。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.17. Claude Cowork.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.16. Cowork recap.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.17. Use case  1.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.18. Use case  2.en.srt]]

6. **[[learn/claude-ecosystem-bootcamp/nodes/projects-and-context|專案與三層 context]]**
   - Goal: 能為重複性工作建立 Chat / Cowork 專案，並理解 global / 專案 claude.md / 子資料夾三層 context 的覆蓋規則。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.10. Projects.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.9. When you should use projects.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.10. Create a new project.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.15. Several commom mistakes.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.19. Why Cowork Projects.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.20. How context layers work.en.srt]]

7. **[[learn/claude-ecosystem-bootcamp/nodes/cowork-project-practice|實作兩個 Cowork 專案]]**
   - Goal: 能從零建立「客戶研究報告」與「品牌內容」兩個 Cowork 專案，讓 AI 依專案上下文產出檔案。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.21. Project  1.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.22. Project  2.en.srt]]

### Tier 3 — 接上你的工具、長出能力

8. **[[learn/claude-ecosystem-bootcamp/nodes/skills-basics|Skill 是什麼、安裝一個來用]]**
   - Goal: 能說明 skill 是什麼、何時該用 skill 而非重打提示詞，並安裝一個社群 skill 來用。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.12. Skills.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.1. Open source skill.en.srt]]

9. **[[learn/claude-ecosystem-bootcamp/nodes/build-a-skill|反推做法、做成可重用的 Skill]]**
   - Goal: 能把一套重複做法（風格模仿、簡報生成）固化成可重用的 skill，並把需要的 context 一起打包。
   - Sources:
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.2. Create viral-linkedin-post skill.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.3. Create generate-slide-decks skill.en.srt]]
     - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.26. Package the skill.en.srt]]

10. **[[learn/claude-ecosystem-bootcamp/nodes/built-in-connectors|接上內建 Connector]]**
    - Goal: 能接上內建 connector（Canva、Airtable、Clay、Google Sheets），讓 Claude 直接讀寫這些工具。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.13. Connectors.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.4. Design with Canva.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.5. Social media ideas with Airtable.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.6. Scrape leads with Clay and Google Sheet.en.srt]]

11. **[[learn/claude-ecosystem-bootcamp/nodes/custom-mcp|自訂 MCP 與 Composio 多連接]]**
    - Goal: 能為不在清單中的工具（Tally、Firecrawl）加自訂 MCP，並用 Composio 一次串接多個 app。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.7. Create form with Tally.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.8. Research website with Firecrawl.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.12. Multi connectors with Composio.en.srt]]

12. **[[learn/claude-ecosystem-bootcamp/nodes/plugins|Plugin：角色化的能力包]]**
    - Goal: 能說明 plugin 如何把 skills、connectors 與 sub-agents 打包成職務角色，並知道何時用 plugin 而非單一 skill。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.14. Plugins.en.srt]]

### Tier 4 — 讓它自動跑

13. **[[learn/claude-ecosystem-bootcamp/nodes/live-artifacts|Live Artifact：連著資料的儀表板]]**
    - Goal: 能做出連著資料來源、每次打開都自動更新的 HTML live artifact（儀表板、每日簡報）。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.23. What are live artifacts.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.24. Build  1.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.25. Build  2.en.srt]]

14. **[[learn/claude-ecosystem-bootcamp/nodes/dispatch-and-schedule|Dispatch 派工與排程任務]]**
    - Goal: 能用手機派工給桌機上的 Claude，並設定每天 / 每週自動執行的排程任務。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.27. Dispatch.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.28. Schedule  1.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 02 - Hacker/2.29. Schedule  2.en.srt]]

15. **[[learn/claude-ecosystem-bootcamp/nodes/routines|Routine：雲端自動化]]**
    - Goal: 能建立由排程、API 或 GitHub 事件觸發的雲端 routine，把跨工具流程自動化。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.26. What are routines.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.27. Routine 1.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.28. Routine 2.en.srt]]

### Tier 5 — 掌握引擎：省錢、省時、換腦袋

16. **[[learn/claude-ecosystem-bootcamp/nodes/usage-and-habits|用量限制與省 token 習慣]]**
    - Goal: 能解釋用量為何被切斷，並用五個習慣與 5 小時窗口策略延長可用時間。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.1. Why Claude cuts you off.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.2. 5 Greate habits.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.3. Set it once, use it forever.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.4. Master your usage window.en.srt]]

17. **[[learn/claude-ecosystem-bootcamp/nodes/prompt-context-harness|模型、Prompt、Context 與 Harness]]**
    - Goal: 能分辨模型家族與適用時機，並用 prompt → context → harness 三層心智模型解釋 agent 為何可靠或不可靠。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.26. From prompts to agents.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.27. Prompt engineering.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.28. Context engineering.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.29. AI Harness.en.srt]]

18. **[[learn/claude-ecosystem-bootcamp/nodes/third-party-models|換上 Ollama / OpenRouter / 9Router]]**
    - Goal: 能把 Claude Desktop 換接 Ollama 本機 / 雲端模型、OpenRouter 或 9Router，並在換模型後重建 skills / connectors。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.5. Claude UI is the product.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.6. Ollama local models.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.7. Ollama cloud models.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.8. OpenRouter.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.9. 9Router - free models.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.10. 9Router - paid models.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.11. Install skills, plugins, connectors.en.srt]]

### Tier 6 — Claude Code、Design 與各介面整合

19. **[[learn/claude-ecosystem-bootcamp/nodes/claude-code-surfaces|Claude Code 的三種環境]]**
    - Goal: 能在 terminal、IDE 與 VS Code extension 三種環境安裝並登入 Claude Code，並設定模型與權限。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.18. Claude Code.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.21. Claude Code CLI.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.22. Claude Code in IDE.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.23. Claude Code extension.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.22. Installations.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.29. Terminal.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.30. IDE.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.31. Claude Extension.en.srt]]

20. **[[learn/claude-ecosystem-bootcamp/nodes/claude-code-in-action|跟著做：遊戲、Kanban、Slash commands]]**
    - Goal: 能跟著做完「遊戲」與「Kanban 接 Airtable」兩個專案，並用 slash commands 控制 agent。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.23. Build 1.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.24. Slash commands.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.25. Build 2.en.srt]]

21. **[[learn/claude-ecosystem-bootcamp/nodes/claude-design-studio|Claude Design：從設計系統到交付]]**
    - Goal: 能用白話在 Claude Design 建立設計系統、產出 landing page 與簡報，並交付或匯出。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.19. Claude Design.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.13. What is Claude Design.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.14. Having fun with Claude Design.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.15. Start from scratch.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.16. DESIGN.md.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.17. Create a landing page.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.18. Ship it - two paths.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.19. Mobile app UI.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.20. Component UI.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 03 - Pro/3.21. Pitch decks.en.srt]]

22. **[[learn/claude-ecosystem-bootcamp/nodes/chat-integrations|瀏覽器、Slack 與 Excel 整合]]**
    - Goal: 能把 Claude 接進瀏覽器、Slack 與 Excel，在既有工作環境裡直接使用。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.20. Chrome browser extension.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.24. Slack.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 01 - Fundamental/1.25. Excel.en.srt]]

### Tier 7 — 旗艦應用：把前面全部串起來

23. **[[learn/claude-ecosystem-bootcamp/nodes/second-brain|第二大腦：Obsidian + LLM Wiki]]**
    - Goal: 能建立 Obsidian + LLM Wiki 的第二大腦，把任何素材萃成互相連結、可查詢的 wiki。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.1. Why your AI has amnesia.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.2. Install the stack.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.3. Build your brain OS.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.4. Use case 1- YouTube video.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.5. Use case 2- Web article.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.6. Use case 3- Texts and images.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.7. In action.en.srt]]

24. **[[learn/claude-ecosystem-bootcamp/nodes/content-pipeline|內容產線：生成、發文、排程]]**
    - Goal: 能把內容生成與輪播圖做成 skill，並一鍵發布到 LinkedIn / Instagram、用 Buffer 排程。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.8. Skill for content.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.9. Skill for carousel images.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.10. Running skills.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.11. Post to LinkedIn.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.12. Post to Instagram.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.13. Scheduling with Buffer.en.srt]]

25. **[[learn/claude-ecosystem-bootcamp/nodes/trading-bot|交易機器人：策略、排程、情緒訊號]]**
    - Goal: 能用 Claude Code + Alpaca 紙上交易把交易策略做成可排程執行的 skill，並建出新聞情緒交易機器人。
    - Sources:
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.14. What we are building.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.15. Setting up Alpaca and Claude Code.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.16. Trailing stop strategy.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.17. Turn your strategy to a skill.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.18. News sentiment trading bot.en.srt]]
      - [[sources/claude-ecosystem-bootcamp/20260929/Claude Bootcamp Level 04 - Badass/4.19. Managing your bot and next steps.en.srt]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
