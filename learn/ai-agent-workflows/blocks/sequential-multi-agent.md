---
id: sequential-multi-agent
title: "Sequential Multi-Agent（循序多代理）"
label: "Sequential Multi-Agent"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把多個完整 agent 串成固定直線，前一個的輸出成為下一個的輸入。"
aliases: []
prerequisites: []
related:
  - prompt-chain-vs-sequential
  - context-isolation
  - linear-latency
sources:
  - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L42-L55]]"
created: 2026-11-06
updated: 2026-11-06
---

# Sequential Multi-Agent（循序多代理）

## 定義

Sequential multi-agent 是把多個完整 agent 串成一條直線的系統：前一個 agent 的輸出直接成為下一個 agent 的輸入，中間沒有分支。文獻裡也叫 prompt chaining、pipeline、chain、waterfall 或 cascade，差別只在命名習慣。

## 為什麼重要

它是最容易掌控的多 agent 起點。因為順序由程式碼固定，開發者保留了 workflow 的確定性，同時讓每一步擁有單一 agent 的規劃、工具與反思能力，不必把所有能力塞進同一個巨大 prompt。

## 如何運作

管線中的每一個節點都是功能完整的獨立 agent，各自擁有 model、system prompt 與 tool set。每個 agent 會先在自己的迴圈裡完成工作，可能失敗、重試、反思，確認輸出後才交給下一棒。agent 之間不需要知道彼此存在，只透過約定的輸出格式銜接。

## 例子

職涯諮詢可拆成三棒：career agent 依興趣選出職業方向，training agent 依該方向規劃學校與課程，funding agent 再依訓練路徑尋找獎學金、貸款與補助。三者依序執行，最終組合成一份完整建議。

## 邊界與常見誤解

- **不是單純的 prompt chaining**：拓撲相同，但每一步是完整 agent，而非一次 LLM 呼叫。
- **不是任何任務都適合**：只有下游嚴格依賴上游成果時，直線串接才合理。
- **不是免費的品質提升**：錯誤會沿鏈累積，延遲也會隨 agent 數量線性增加。

## 進階

設計時要同時處理三件事：用 [[context-isolation]] 控制每個 agent 的上下文、用 [[linear-latency]] 評估等待成本，並用交接驗證避免 [[error-compounding]]。若某一步其實只需要一次轉換，[[prompt-chain-vs-sequential]] 會是更輕的選擇。
