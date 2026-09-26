---
subject: vibe-coding-fengjianyingyue
status: draft
path: problem-driven
created: 2026-09-26
---

# ROADMAP — vibe-coding-fengjianyingyue

## Goal

只用白話提示詞，把任何產品點子從一句話推進到可交付的完整產品，走完 PRD → UI 原型 → 前端 + 後端 + DB → 企業級後端 → 後台 → 跨端 App → 測試 → 交付 → 內容運營 → 資料視覺化 → 文案推廣，並把整套流程沉澱成可重複的 12 階段 playbook，搬到自己的知識視頻生成 agent 與公司平台上。

## Learning path

**問題驅動（problem-driven）** — 依「vibecoder 實際會撞到的問題」排序，每個節點就是一個真實會遇到的問題與它的解法。它最佳化「遇到問題時可查、即學即用」，並讓節點順序與真實交付遇到的困難順序一致：先建立心智模型與環境（Tier 1），再讓點子變成規格與畫面（Tier 2），接著把網頁全端做起來（Tier 3），然後擴到其他客戶端（Tier 4），最後處理品質、交付與變現（Tier 5–6）。

## How to use

依序讀節點。每個節點是一個 step-DAG。先跑 `/probe vibe-coding-fengjianyingyue/<node-id>` 量測掌握度（硬性關卡），再跑 `/nodes vibe-coding-fengjianyingyue/<node-id>` 確認並開始該節點的工作。

## Nodes

### Tier 1 — 心智模型與起手式

1. **[[learn/vibe-coding-fengjianyingyue/nodes/what-is-vibe-coding|什麼是 vibe coding？何時白話快跑、何時該升級成 SDD]]**
   - Goal: 能分辨「白話快跑的 vibe coding」與「工程化 SDD」兩種模式，並在正確時機選對。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/AGENTS.md]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/功能点梳理.txt#home-spec]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/测试提示词.txt#message-1-analyze-and-plan]]

2. **[[learn/vibe-coding-fengjianyingyue/nodes/toolchain-setup|工具鏈就緒：Claude Code / Node / git / JDK+Maven]]**
   - Goal: 能在新機器從零把 Claude Code、Node、git 與 JDK/Maven 裝好並逐項驗證。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/安装Claude Code.txt#prerequisites]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/JDK与Maven环境.txt#configure-env-vars]]

3. **[[learn/vibe-coding-fengjianyingyue/nodes/version-control-safety-net|版本控制與 MCP：讓每次 AI 編輯都可回復]]**
   - Goal: 能用白話讓 agent 初始化 repo、存檔、查歷史、回退，並接上 GitHub MCP。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/git.txt#init-and-commit]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/git.txt#history-and-rollback]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/git.txt#github-mcp]]

4. **[[learn/vibe-coding-fengjianyingyue/nodes/project-skeleton-and-agent-config|專案骨架與 agent 說明書：角色化資料夾 + AGENTS.md/CLAUDE.md]]**
   - Goal: 能為新產品搭出角色化資料夾骨架，並寫出讓 agent 不亂搞的 AGENTS.md/CLAUDE.md。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/CLAUDE.md]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/skills-lock.json]]

### Tier 2 — 把點子變成可開工的規格與畫面

5. **[[learn/vibe-coding-fengjianyingyue/nodes/one-liner-to-prd|一句話怎麼變成 PRD？]]**
   - Goal: 能把一句話點子寫成含範圍、功能清單、成功指標的 PRD（含增量版與後台版）。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家PRD-V1.0.md]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家PRD-V1.0.1.md]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家后台管理系统PRD.md]]

6. **[[learn/vibe-coding-fengjianyingyue/nodes/data-model-first|先把資料模型定死：帳戶／分類／交易／使用者]]**
   - Goal: 能在開工前先定出帳戶、分類、交易、使用者的資料模型。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/001.产品PRD（产品经理）/财务管家PRD-V1.0.md#prd-v1]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/功能点梳理.txt#home-spec]]

7. **[[learn/vibe-coding-fengjianyingyue/nodes/ai-ui-prototype|沒有設計師的 UI：用 AI 生成原型與設計系統]]**
   - Goal: 能用 AI 生成工具（Stitch）生出多頁 UI 原型與 design token 系統。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/002.产品UI原型（美术设计）/UI原型/financial_manager_system/DESIGN.md]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/002.产品UI原型（美术设计）/UI原型/dashboard/code.html]]

8. **[[learn/vibe-coding-fengjianyingyue/nodes/prototype-to-code-handoff|從原型到程式：1:1 copy2code 與素材進場]]**
   - Goal: 能看懂 AI 原型碼並 1:1 轉成專案頁面，正確放進 icon 等素材。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/002.产品UI原型（美术设计）/1比1原型copy2code/1.html]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/底部图标/home.png#tabbar-icons]]

### Tier 3 — 讓它有資料與邏輯（網頁全端）

9. **[[learn/vibe-coding-fengjianyingyue/nodes/frontend-architecture|前端多頁架構與頁面職責]]**
   - Goal: 能規劃多頁前端的頁面職責、共用層與設計 token。
   - Sources:
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/js/app.js]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/styles/design-tokens.js]]
     - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/README.md]]

10. **[[learn/vibe-coding-fengjianyingyue/nodes/frontend-api-integration|前端怎麼接上後端：REST 對接與 token]]**
    - Goal: 能讓前端頁面透過 REST + token 吃到真實後端資料。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/dashboard.html]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/login.html]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/frontend/pages/add_record.html]]

11. **[[learn/vibe-coding-fengjianyingyue/nodes/node-rest-backend|Node/Express 後端與 API 設計]]**
    - Goal: 能設計並實作一致的 Node/Express REST API、回傳封裝與 JWT 驗證。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/backend/server.js]]

12. **[[learn/vibe-coding-fengjianyingyue/nodes/mysql-schema-and-logic|資料庫落地：schema、view、stored procedure、trigger、seed]]**
    - Goal: 能把資料模型落成含 schema、view、stored procedure、trigger、seed 的 MySQL 庫。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/004.数据库脚本（数据库管理员DBA）/finance_manager.sql]]

13. **[[learn/vibe-coding-fengjianyingyue/nodes/natural-language-ui-fixes|用白話修 AI 的 UI bug]]**
    - Goal: 能用白話提示詞診斷並修掉 AI 生成的 UI bug（icon ligature、圖表回歸、間距、樣式不一致）。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/前端页面调整自然语言文字内容.txt#icon-ligature-bug]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/前端页面调整自然语言文字内容.txt#chart-regression]]

### Tier 4 — 同一產品的其他客戶端

14. **[[learn/vibe-coding-fengjianyingyue/nodes/enterprise-java-rewrite|企業級重寫：為什麼換 Spring Boot + MyBatis、怎麼分層]]**
    - Goal: 能說出為何把 Express 換成 Spring Boot + MyBatis，並看懂 controller/service/mapper/entity 分層。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/pom.xml]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/java/com/finance/manager/service/impl/UserServiceImpl.java]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/resources/mapper/TransactionMapper.xml]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/Java开发规范.md]]

15. **[[learn/vibe-coding-fengjianyingyue/nodes/admin-console|營運後台：另一組 API 與 admins 表]]**
    - Goal: 能為營運受眾長出獨立後台（另一組 API、admins 表與靜態頁面）。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/server.js]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/init_admin.js]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/frontend/pages/dashboard.html]]

16. **[[learn/vibe-coding-fengjianyingyue/nodes/crossplatform-uniapp|跨端 App：uni-app 與 web 的差異]]**
    - Goal: 能用 uni-app 把 web app 一碼多端，處理 pages.json、uni.request、canvas 圖表等差異。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/App.vue]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages.json]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/js/api.js]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/007.跨端APP应用（移动端开发工程师）/uniapp-project/pages/statistics/statistics.vue]]

### Tier 5 — 品質與交付

17. **[[learn/vibe-coding-fengjianyingyue/nodes/test-strategy-per-client|測什麼、怎麼分層：per-client 測試計畫與風險]]**
    - Goal: 能在寫測試前先為每個客戶端規劃分層測試計畫與風險。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试计划/backend测试计划.md]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试计划/frontend测试计划.md]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试计划/uniapp测试计划.md]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/测试提示词.txt#message-1-analyze-and-plan]]

18. **[[learn/vibe-coding-fengjianyingyue/nodes/real-assertions-and-reports|讓測試不假綠：真斷言、失敗截圖、報告]]**
    - Goal: 能寫出有真斷言、失敗可追、產出 HTML 報告的測試，避開假綠。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试报告/backend核心业务测试报告.html]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/008.项目测试（测试工程师）/测试工程配置/README.md]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/003.前端代码（前端工程师）/backend/tests/test-core-business.js]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/测试提示词.txt#message-3-run-and-report]]

19. **[[learn/vibe-coding-fengjianyingyue/nodes/delivery-and-manual|交付：產品說明書與上線文件]]**
    - Goal: 能產出可交付的產品說明書與上線文件。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/009.交付与上线（交付经理和运维人员）/产品说明书.md]]

### Tier 6 — 成長與變現

20. **[[learn/vibe-coding-fengjianyingyue/nodes/data-visualization|把產品數據變成儀表板與報告]]**
    - Goal: 能用同一份產品資料生出視覺化儀表板與營運報告。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/index.html]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/chart_data.json]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/011.数据可视化/个人记账APP运营分析报告.docx]]

21. **[[learn/vibe-coding-fengjianyingyue/nodes/promo-copy-and-video|文案與宣傳影片：AI 生成推廣素材]]**
    - Goal: 能生出推廣文案與 AI 旁白宣傳影片（Remotion + edge-tts）。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/财务管家推广文案.md]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/src/Root.tsx]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/generate_video.py]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/012.文案推广/finance-promo/generate_audio.py]]

22. **[[learn/vibe-coding-fengjianyingyue/nodes/content-ops-and-pitch|內容運營：用同一套流程生 PPT／路演／運營手冊]]**
    - Goal: 能把同一套流程複製到非工程內容（PPT、路演、運營手冊、量化說明書）。
    - Sources:
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/无锡三日游v2.pptx]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/财务管家A轮融资路演.pptx]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运营）/项目运营手册.pdf]]
      - [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/010.内容运营（自媒体与运维）/半导体领航者说明书.pdf]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
