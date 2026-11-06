---
id: specialist-agent
title: Specialist Agent（專責代理）
label: Specialist Agent
subject: ai-agent-workflows
type: concept
status: draft
summary: 只負責一個明確子任務、只掛該任務工具的窄職責 agent。
aliases: []
prerequisites: []
related:
  - sequential-multi-agent
  - code-orchestrator
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L133-L145]]
created: 2026-11-06
updated: 2026-11-06
---

# Specialist Agent（專責代理）

## 定義

Specialist agent 是一個職責很窄的 agent：它只處理一個明確子任務，只擁有完成該任務所需的工具、提示詞，通常也只需要較小的模型。它不知道也不需要知道系統裡其他 agent 在做什麼。

## 為什麼重要

專責的 agent 比包山包海的 agent 表現更好。工具與提示詞變少後，模型更容易聚焦，呼叫也更短、更便宜。工具權限本身就是邊界：一個只拿得到教育工具的路徑顧問，不可能越權回頭重選職業。

## 如何運作

系統為每個子任務建立獨立 agent，給它專屬的角色描述、工具清單與輸出欄位。協調器依固定順序呼叫它們，前一個的輸出成為後一個的輸入。因為職責單一，每個 agent 可以使用最適合該任務的模型，而不必全系統共用同一顆模型。

## 例子

職涯管線可拆成 career picker 與 path advisor。前者只掛職業搜尋與職缺展望工具，負責選出一個職業；後者只掛學歷、證照與學程查詢工具，負責規劃怎麼到達那個職業。兩者互不越界。

## 邊界與常見誤解

- **不是切得越細越好**：agent 越多，協調、延遲與成本越高。
- **不是只改 system prompt 就算專責**：工具集與輸出契約也要一起收斂。
- **不是完全獨立**：專責 agent 仍要靠清楚的交接物件與順序串起來。

## 進階

多個專責 agent 需要一個 [[code-orchestrator]] 固定順序，並用 Handoff Gate 檢查交接。若系統刻意讓多個 agent 從不同角度重複解同一題，則可進一步考慮 Model Diversity。
