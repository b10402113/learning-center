---
id: context-window-bloat
title: "Context Window Bloat（上下文膨脹）"
label: "Context Window Bloat"
subject: ai-agent-workflows
type: concept
status: draft
summary: "迴圈每一輪都把整份對話紀錄重新送進模型，context 會隨輪數快速膨脹。"
aliases: []
prerequisites: []
related:
  - transcript-memory
  - stopping-condition
sources:
  - "[[sources/ai-agent-workflows/20261105/course/14-react.txt#L395-L434]]"
created: 2026-11-06
updated: 2026-11-06
---

# Context Window Bloat（上下文膨脹）

## 定義

Context window bloat 指 agent 的對話紀錄在迴圈中不斷變長，而模型每一輪都必須重讀整份紀錄，造成 context 使用量快速上升。它不是多代理系統才有的問題，單一 agent 只要輪數一多就會發生。

## 為什麼重要

Context 直接影響三件事：成本、延遲與可靠度。每一輪都把先前的問題、思考、工具呼叫與觀察結果重新送進模型，token 數會隨輪數累積；當紀錄超過模型能有效處理的長度，重要資訊也可能被淹沒。這是為什麼在設計工具輸出與紀錄格式時，就必須把 context 當成有限預算。

## 如何運作

ReAct 迴圈的每一輪會做三件事：把目前的完整 transcript 送給模型、把模型新產生的 thought／action 附加到 transcript、再把工具結果以 observation 附加回去。下一輪又把更長的 transcript 全部送出。若每次工具都回傳長篇內容，成長速度會更快。

## 例子

一個執行五輪的職涯 agent，第一輪只送出 system prompt 與使用者問題；第二輪多了 thought、action 與 observation；第三輪再把第二輪的內容全部重送一次。即使每一輪只增加幾百字，累積的輸入量仍可能遠超單次問答。

## 邊界與常見誤解

- **不是只有多代理才會爆**：單一 agent、單一 transcript 就足以撐滿 context。
- **不是把模型換大就解決**：視窗變大只延後問題，成本與注意力稀釋仍在。
- **截斷不是免費的**：隨意刪掉前面的紀錄，可能讓模型忘記目標或已完成的步驟。
- **工具輸出也是元兇**：回傳整份文件或完整 JSON，往往比模型的思考更佔空間。

## 進階

控制膨脹的方法包括限制工具輸出長度、只保留必要的觀察摘要、在固定輪數後壓縮紀錄，以及用停止條件限制總輪數。這些作法與 [[transcript-memory]] 的設計直接相關，也需要和 [[stopping-condition]] 一起規劃。
