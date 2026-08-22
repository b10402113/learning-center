---
subject: vertex-learning-platform
status: draft
created: 2026-08-22
---

# ROADMAP — vertex-learning-platform

## Goal
要能重複「代理式工程（agentic engineering）」的完整工作流：先定義產品與邊界，寫出像 AGENTS.md 這樣能讓 AI 照著執行的操作手冊，走「先寫實作 prompt → 人工批准 → 才寫 code → 跑檢查」的循環，安全地把一個生產級全端應用交給 AI 建出來——以 Vertex 學習平台（Next.js + Sanity + Clerk + PostHog + Sanity Context MCP 智慧搜尋）當作練手載體，而不只是看懂這個 demo。

## How to use
照順序讀每個 node。每個 node 都是一個 step-DAG。對每個 node 先跑 `/probe <subject>/<node-id>` 測量熟悉度，再跑 `/nodes <subject>/<node-id>` 確認並開始撰寫該 node。Tier 1 建立心智模型與可重複的工作流；Tier 2 用 Vertex 全端當載體把每個子系統練出來；Tier 3 收尾到安全與自己跑完整工作流的畢業實作。

## Nodes

### Tier 1 — 心智模型：代理式工程的工作流
1. **[[learn/vertex-learning-platform/nodes/agentic-engineering-workflow|代理式工程的工作流根基]]**
   - Goal: 能說出「為什麼先 plan 再 code」——human 是產品思考者、AI 是實作代理；product-first 讓 stack 自己選定；掌握九步 loop 與 scope 邊界（build only what is listed）。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:9-224]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:225-320]]
     - [[sources/vertex-learning-platform/AGENTS.md#role-and-job]]
     - [[sources/vertex-learning-platform/AGENTS.md#how-to-work]]
     - [[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#mindset]]
     - [[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#method]]
2. **[[learn/vertex-learning-platform/nodes/agents-and-agents-md|Skills 與 AGENTS.md：兩層上下文]]**
   - Goal: 能分辨「工具知識放 skills、專案規則放 AGENTS.md」的分層，並照 15 節結構為自己的專案寫一份 operating manual。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:733-1052]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1053-1648]]
     - [[sources/vertex-learning-platform/AGENTS.md#skills-to-lean-on]]
     - [[sources/vertex-learning-platform/AGENTS.md#decisions]]
     - [[sources/vertex-learning-platform/AGENTS.md#traps]]
     - [[sources/vertex-learning-platform/AGENTS.md#when-in-doubt]]
     - [[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#sections]]
     - [[sources/vertex-learning-platform/AGENTS.md_GUIDE.pdf#calibration]]
3. **[[learn/vertex-learning-platform/nodes/implementation-prompts-and-review|Implementation prompt 與審查迴圈]]**
   - Goal: 能寫出結構完整的 implementation prompt、先取得批准才寫 code，並把每個 feature 走 branch→PR→CodeRabbit 審查→merge。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2101-2248]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8817-8956]]
     - [[sources/vertex-learning-platform/AGENTS.md#checks]]
4. **[[learn/vertex-learning-platform/nodes/design-system-boundary|設計系統：把 AI 的 UI 自由度關進盒子]]**
   - Goal: 能說明為什麼需要 design system（阻止 AI 自行發揮），把設計稿轉成 Tailwind v4 token 與 typed component library，並用 showcase 頁驗證。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:1649-1700]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:1701-2100]]
     - [[sources/vertex-learning-platform/AGENTS.md#ui-rules]]

### Tier 2 — 練手：把 Vertex 全端建出來
5. **[[learn/vertex-learning-platform/nodes/sanity-content-model|Sanity 資料模型與 server-only 讀取層]]**
   - Goal: 能設計 course/module/lesson/instructor/category 模型（embedded vs reference）、架 standalone Studio，並建出只跑在 server 的讀取層與 GROQ。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:321-400]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3401-3552]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3553-3688]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:3689-4140]]
     - [[sources/vertex-learning-platform/AGENTS.md#data-model]]
6. **[[learn/vertex-learning-platform/nodes/seeding-content|種子資料：把空 schema 變成真實資料]]**
   - Goal: 能用 deterministic ids 與 idempotent import 把 141 份文件、120 支真實 YouTube 影片種進 Sanity，並懂為什麼內容品質決定搜尋品質。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_3:4141-4868]]
     - [[sources/vertex-learning-platform/seed.ndjson#content-types]]
     - [[sources/vertex-learning-platform/seed.ndjson#course-shape]]
     - [[sources/vertex-learning-platform/videos.json#schema]]
     - [[sources/vertex-learning-platform/videos.json#coverage]]
7. **[[learn/vertex-learning-platform/nodes/catalog-and-course-pages|首頁、課程總覽與課程頁]]**
   - Goal: 能用 server component + sanityFetch 讀 Sanity 內容，渲染首頁/總覽/詳情頁，並用 GROQ 算 aggregate。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2249-2788]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5101-5216]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5217-5520]]
8. **[[learn/vertex-learning-platform/nodes/lesson-page-and-video|課程頁與影片播放]]**
   - Goal: 能實作 lesson 頁——provider embed（poster→點擊換 iframe）、`?t=` 起播秒數、Portable Text notes、reverse reference 反查父課程與課程表。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6069-6504]]
9. **[[learn/vertex-learning-platform/nodes/clerk-auth-and-boundaries|Clerk 認證與安全邊界]]**
   - Goal: 能接上 Clerk（sign-in/up、middleware）並說清「middleware 是 auth resolver 不是閘門」，以及 token 的 public/secret 分割與 server-only 邊界。
   - Sources:
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:401-488]]
     - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_2:2789-3296]]
     - [[sources/vertex-learning-platform/AGENTS.md#app-structure]]
     - [[sources/vertex-learning-platform/AGENTS.md#tech-stack]]
     - [[sources/vertex-learning-platform/AGENTS.md#traps]]
10. **[[learn/vertex-learning-platform/nodes/posthog-analytics|PostHog：為產品問題而量]]**
    - Goal: 能圍繞產品問題埋事件（watch depth 用誠實的 elapsed-time 估測、lesson_completed 由進度衍生），並懂 server-side capture 與 flush、self-driving 回圈。
    - Sources:
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:489-572]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:5521-6068]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7921-8500]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8501-8660]]
11. **[[learn/vertex-learning-platform/nodes/intelligent-search|智慧搜尋：MCP + grounding + 兩段式時間戳]]**
    - Goal: 能架 Sanity Context MCP + server 端 search API，用「模型只選 ID、Sanity 供事實」的 grounding 讓結果不可能造假，並懂 chapters-first 時間戳解析與 search UI。
    - Sources:
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6505-6800]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:6801-7352]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7661-7916]]
      - [[sources/vertex-learning-platform/AGENTS.md#search-config]]
      - [[sources/vertex-learning-platform/AGENTS.md#search-behavior]]
12. **[[learn/vertex-learning-platform/nodes/video-ingestion-pipeline|影片離線擷取管線]]**
    - Goal: 能建離線 ingestion——把影片轉成 video 文件（章節 + ~45s 時間戳字幕 chunk）、用 YouTube innerTube 抓字幕，並做到 deterministic、resumable、絕不半寫。
    - Sources:
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7353-7660]]
      - [[sources/vertex-learning-platform/AGENTS.md#video-ingestion]]

### Tier 3 — 收尾：安全與自己的實作
13. **[[learn/vertex-learning-platform/nodes/security-review-and-hardening|AI 程式碼的安全審查與加固]]**
    - Goal: 能說出 AI 應用新增的漏洞類（AI-cost DoS、同源 proxy 洩漏 cookie），並用 PR 審查 + CodeRabbit deep scan 作為安全閘門。
    - Sources:
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_1:573-628]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:6801-7352]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8661-8816]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:8957-9124]]
      - [[sources/vertex-learning-platform/AGENTS.md#tech-stack]]
      - [[sources/vertex-learning-platform/AGENTS.md#traps]]
14. **[[learn/vertex-learning-platform/nodes/final-assignments|畢業實作：跑完整工作流]]**
    - Goal: 能自己跑一遍完整工作流完成兩個任務——timestamp deep-linking 與 search tuning——全程 prompt→批准→PR→CodeRabbit，無人盯。
    - Sources:
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:9125-9296]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_6:9297-9439]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_4:6069-6504]]
      - [[sources/vertex-learning-platform/Build and Deploy a Full Stack Learning Platform _ Search Any Video, Jump to the Exact Second.srt#part_5:7353-7660]]

## Status
- [x] Roadmap 與 nodes 已提出並確認（baseline 11 / proposed 14）
- [ ] Step articles 已撰寫
- [ ] Edges 已撰寫
