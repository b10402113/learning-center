---
id: worker-context-isolation
title: "Worker Context Isolation（子 agent 上下文隔離）"
label: "Worker Context Isolation"
subject: ai-agent-workflows
type: concept
status: draft
summary: "每個子 agent 從乾淨的 context 開始，只看得到 supervisor 這次寫給它的任務。"
aliases: []
prerequisites: []
related:
  - subagents-as-tools
  - supervisor
  - multi-agent-context-advantage
sources:
  - "[[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L111-L171]]"
created: 2026-11-06
updated: 2026-11-06
---

# Worker Context Isolation（子 agent 上下文隔離）

## 定義

Worker context isolation 是指：在 supervisor 架構中，每個子 agent 每次被委派時都從一份新的 context 開始，只包含它自己的 system prompt 與 supervisor 交辦的那段任務文字。它不會自動看到使用者的原始訊息、其他子 agent 的輸出，或先前的對話歷史。

## 為什麼重要

隔離讓子 agent 的任務變得非常窄，因而更容易做對；也讓每個子 agent 可以使用較小、較便宜的模型。相對地，隔離把「要給什麼背景」的責任全部推回 supervisor：漏給資訊，worker 就只能靠猜。

## 如何運作

1. Supervisor 決定要呼叫哪個 worker。
2. Supervisor 把 worker 完成任務所需的一切寫進任務字串。
3. 系統用該 worker 自己的 system prompt 加上這段任務，建立全新的訊息陣列。
4. Worker 在自己的迴圈裡推理、呼叫工具、產出 Final Answer。
5. 答案回到 supervisor，worker 的 context 即結束，下次再用時重新開始。

## 例子

在職涯系統中，Roadmap Advisor 被要求「說明如何成為野生動物生物學家：學校、證照、經驗與時間表」。它不會知道使用者先前說過喜歡動物、討厭久坐；如果這些偏好會影響回答，supervisor 就必須一併寫進任務。同樣地，Job Market Analyst 的市場分析結果也不會自動傳給 Roadmap Advisor，必須由 supervisor 決定是否轉述。

## 邊界與常見誤解

- **隔離不等於安全邊界**：它只是 context 不共享，不是權限或隱私機制。
- **不是愈隔離愈好**：需要跨步驟累積線索的任務，過度隔離會讓 worker 缺少關鍵背景。
- **每次委派都重新付 context 成本**：同樣的背景若要不斷轉述，token 成本會上升。
- **Supervisor 的 system prompt 決定隔離程度**：開發者可以規定「派研究任務時務必附上先前文件」，否則模型會自行判斷要給多少。

## 進階

這種隔離是 [[subagents-as-tools]] 能運作的前提。整體角色安排見 [[supervisor]]；它換來的窄 context 好處，見 [[multi-agent-context-advantage]]。
