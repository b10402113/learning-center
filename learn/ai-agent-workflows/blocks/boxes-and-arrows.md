---
id: boxes-and-arrows
title: Boxes and Arrows（盒子與箭頭）
label: Boxes and Arrows
subject: ai-agent-workflows
type: concept
status: draft
summary: 把每個步驟看成盒子、每條控制流看成箭頭，就能用「誰畫箭頭」區分程式碼、workflow 與 agent。
aliases: []
prerequisites: []
related:
  - agent-vs-workflow
  - agent
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L1-L20]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Boxes and Arrows（盒子與箭頭）

## 定義

盒子與箭頭是一種描述系統架構的心智模型。每個步驟都是一個盒子：你寫的函式、一次 API 呼叫、一個 LLM，任何系統零件都裝在各自的盒子裡。箭頭則是連接盒子的控制流，決定下一個要執行哪個盒子。

## 為什麼重要

同一個任務可以用完全不同的方式組裝，差別往往不在盒子裡放了什麼，而在箭頭由誰決定。把控制權拉出來單獨看，才能分清一般程式碼、workflow、single-agent 與 multi-agent 的界線，也才知道自己交出了多少控制權。

## 如何運作

- **一般程式碼**：盒子是你寫的，箭頭也是你寫的。你用函式呼叫與 `if/else` 明確決定 A 之後接 B。
- **Workflow**：箭頭仍由開發者決定，LLM 只是某些盒子裡的運算工具。
- **Single-agent**：你提供幾條可能路徑，讓 agent 自己選下一個箭頭。
- **Multi-agent**：控制權混雜，有時你畫箭頭，有時 agent 自己連箭頭，甚至連下一個盒子都由 agent 產生。

## 例子

一個函式呼叫另一個函式、一段 `if/else` 把請求導向兩條路徑，都是開發者畫好的箭頭。把其中一個盒子換成 LLM，只要箭頭沒變，系統仍然是 workflow。

## 邊界與常見誤解

交出箭頭的控制權不代表系統比較進步。失去控制會換來彈性，但同時要在 context、reliability、cost 上交換代價。盒子與箭頭是分析工具，不是要求你把每個實作細節都畫成圖。

## 進階

實務上要標記每條箭頭是固定還是模型選的。混合系統裡兩者交錯，出事時才能判斷是流程走錯，還是模型自己轉錯彎。
