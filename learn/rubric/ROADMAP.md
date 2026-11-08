---
subject: rubric
status: draft
path: concept-first
created: 2026-11-08
---

# ROADMAP — rubric

## Goal

建立 RUBRIC 這套 AI agent 工作系統的心智模型，並能實際操作 Agentic OS、Second Brain 與 Console。

## Learning path

概念先行（concept-first）：先建立「agent 很會做事，但不會展示成果」這個問題，以及 RUBRIC 用 Agentic OS／Second Brain／Console 三層回應它的方式；再學 ARMS 四層架構與 Second Brain 的記憶機制，把規則內化；最後才進到 Console 分頁與創作工具，用同一套「釘點留言、複製給 agent、套用」的模式實作。Tier 1 是心智模型，Tier 2 是操作規則，Tier 3 是實踐。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型

1. **[RUBRIC：一套幫你跟 AI agent 合作得更好的工具](nodes/what-is-rubric.md)**
   - Goal: 用「agent 會做事、不會展示」解釋 RUBRIC 的三個部分與各自解決的問題。

2. **[Agentic OS v2 與 ARMS：agent 工作區的四層架構](nodes/agentic-os-and-arms.md)**
   - Goal: 說出 ARMS 四層與「dashboard 只佔 20–30%」的主張，並解釋為何由 Skills 往上學。

3. **[Second Brain：整份 workspace 的活地圖](nodes/second-brain.md)**
   - Goal: 解釋節點圖如何由掃描重建，以及把檢索移出模型為何能省 token。

### Tier 2 — 操作規則

4. **[Console：AI agent micro app 的指揮中心](nodes/rubric-console.md)**
   - Goal: 說明 terminal-only 問題、scaffold 的可插拔結構，並完成安裝、客製與排錯。

5. **[Console 進階分頁：額外、選用的 tabs](nodes/console-advanced-tabs.md)**
   - Goal: 說出 Generations、Docs、Links、Sprint、References、Tailscale 各解決什麼，並挑自己要裝的。

### Tier 3 — 實踐

6. **[Elements 與 Editor：可重用影片元素與 agent 初剪](nodes/creator-video-pipeline.md)**
   - Goal: 用 /cut 與 Editor 走完「agent 先剪、人類複審、留言回訓」的流程。

7. **[Scripts：把腳本審稿搬出聊天視窗](nodes/script-review-pipeline.md)**
   - Goal: 走完 /rubricscripts → 三個 hook → 留言購物車 → 回訓 /tone 的閉環。

8. **[Storyboards 與 Carousels：還在分鏡與卡片時就修好](nodes/visual-review-pipeline.md)**
   - Goal: 用同一套釘點留言 → 複製給 agent → 套用的模式審查影片分鏡與 IG 輪播。

9. **[Recos：agent 稽核自己的設定](nodes/recos.md)**
   - Goal: 說明 /recos 如何依 ARMS 產出有證據的排序建議，並把留言套回設定。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
