---
subject: ai-coding-crash-course
status: draft
created: 2026-08-19
---

# ROADMAP — ai-coding-crash-course

## Goal
用 AI 編碼代理（Claude Code 或同類），在一份真實程式碼上端到端交付一個有份量的功能——跑完 grilling → spec → tickets → implement → review 的完整流程，全程不需要人盯。

## How to use
照順序讀每個 node。每個 node 都是一個 step-DAG。對每個 node 先跑 `/probe <subject>/<node-id>` 測量熟悉度，再跑 `/nodes <subject>/<node-id>` 確認並開始撰寫該 node。

## Nodes

### Tier 1 — 心智模型：AI 編碼代理是什麼
1. **[[learn/ai-coding-crash-course/nodes/agent-anatomy|代理的構成：模型、外殼與環境]]**
   - Goal: 能說出並追蹤「跑一個代理」時實際發生的事——model / harness / environment 的界線、next-token 預測與非決定性、turn 的內部結構、session 的累積。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab]]
2. **[[learn/ai-coding-crash-course/nodes/agent-thinking-and-cost|代理如何思考與燒錢]]**
   - Goal: 能解釋代理何時聰明何時笨、以及錢花在哪——attention 退化、smart/dumb zone、statelessness、token 計費與快取、幻覺類型、effort 旋鈕。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ac]]

### Tier 2 — 操作規則：動手熟練
3. **[[learn/ai-coding-crash-course/nodes/setup-playground|打造你的代理練功場]]**
   - Goal: 搭出一個乾淨的代理環境（付費訂閱、VS Code/git/Node、source-vs-database 的遷移與種子資料、清空 config、request logger），並能親眼看到自己送給模型提供者的流量。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_aa]]
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ab]]
4. **[[learn/ai-coding-crash-course/nodes/claude-code-basics|在 CLI 外殼裡熟練操作]]**
   - Goal: 能日常順手使用一套 CLI harness——指令、進階提示技巧、IDE diff 管理、rewind/resume、bash 模式。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ad]]
5. **[[learn/ai-coding-crash-course/nodes/operating-the-agent|操作代理：Bash、權限與自動模式]]**
   - Goal: 能控制代理能碰什麼、不能碰什麼，並安全地放手——bash 管理、permissions / settings、auto mode 與安全分類器。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae]]

### Tier 3 — 上下文掌握：課程深層主題
6. **[[learn/ai-coding-crash-course/nodes/context-hygiene|上下文衛生：讓代理保持在聰明區]]**
   - Goal: 能透過管理代理的上下文把它留在 smart zone——重置 harness、刪掉 system prompt 的贅肉、在狀態列接上 token 計數器、探索全新 session 對 repo 知道多少。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ae]]
7. **[[learn/ai-coding-crash-course/nodes/align-before-build|先對齊再動手：Grilling、壓縮與交接]]**
   - Goal: 能在代理寫任何程式前先跟它把設計談清楚，並讓工作跨 session 繼續而不掉出聰明區——plan mode 的盲點、grilling、compaction、handoff。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_af]]
8. **[[learn/ai-coding-crash-course/nodes/steering-across-sessions|跨階段引導：指標、文件與技能]]**
   - Goal: 能在 session 之間引導代理，讓它持續照你的意圖做事——phase boundary 的五個選項、auto-compaction 的危險、push-vs-point 引導、agents.md、doc+pointer、skills 的放置與修剪。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ag]]
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah]]

### Tier 4 — 交付大型工作：實作練習
9. **[[learn/ai-coding-crash-course/nodes/ship-with-specs-and-tickets|用 Specs 與 Tickets 交付大型工作]]**
   - Goal: 能把大型功能拆成 agent 大小的區塊，並用五步流程交付——spec/tickets、implement 迴圈、code review 與 QA、存檔 spec、改道重談（re-grill）、coding-standards。
   - Sources:
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ah]]
     - [[sources/ai-coding-crash-course/AI Coding Crash Course.srt#part_ai]]

## Status
- [x] Roadmap 與 nodes 已提出並確認（baseline 9 / proposed 9）
- [ ] Step articles 已撰寫
- [ ] Edges 已撰寫
