---
id: shared-conversation-history
title: Shared History（共享歷史）
label: Shared History
subject: ai-agent-workflows
type: concept
status: draft
summary: 所有 peer agent 共讀共寫的同一份對話紀錄，接手的人能看到先前的完整脈絡。
aliases: []
prerequisites: []
related:
  - peer-to-peer-topology
  - handoff-tool
  - compaction
sources:
  - '[[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L39-L89]]'
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Shared History（共享歷史）

## 定義

Shared history 是 peer-to-peer 系統中的單一對話紀錄，由所有 agent 共同讀取與寫入。每個 agent 執行時，會把自己的 system prompt 接在這份共享歷史前面；它產生的內容、工具結果與交接說明，也都寫回同一份歷史。因此任何 agent 接手時，都看得到先前發生過的事。

## 為什麼重要

沒有共享歷史，交接就等於把任務重新描述一次，容易遺漏細節；有了它，接手者可以直接沿用前面的推理與工具結果。這也是 peer-to-peer 能讓 agent 直接對話、而不需要中央轉述的基礎。

## 如何運作

1. 系統建立一份 history，初始只有使用者輸入。
2. Active agent 執行一步時，訊息陣列為「自己的 system prompt + 整份 history」。
3. Agent 的輸出附加回 history，並標記是哪個 agent 寫的。
4. 工具結果以 observation 形式寫回。
5. 交接時，把「已轉交給誰、交接者留下的 note」也寫進 history，下一個 agent 才看得到。

<!-- derived -->
```javascript
// 節錄：一個 agent 的一步，讀寫同一份 history
const messages = [{ role: "system", content: systemPrompt() }, ...history];
const llmOutput = await callLLM(name, messages);
history.push({ role: "assistant", name, content: llmOutput });
// 交接時
history.push({ role: "user", content: `Observation: Transferred to ${tool.handoffTo}. Note from ${name}: ${toolInput}` });
```

## 例子

趨勢 agent 分析完市場後，把對話交給教育 agent，note 寫著「請依這三個職涯挑選課程」。教育 agent 接手時，歷史裡已包含使用者的原始需求、職涯顧問的分析與趨勢 agent 的市場結論，不需要再問一次。

## 邊界與常見誤解

- **共享不等於同步**：它是一份逐步累積的 log，不是所有 agent 同時在跑。
- **歷史會快速膨脹**：每一次交接都帶著全部內容，token 成本隨輪數上升。
- **錯誤也會共享**：前面 agent 的誤解會原封不動傳給後面的人，甚至被當成前提。
- **不是隱私邊界**：所有 peer 都看得到全部內容，敏感資料不應任意寫入。

## 進階

它是 [[peer-to-peer-topology]] 能運作的關鍵，搭配 [[handoff-tool]] 完成換手。歷史過長時的處理方式，見 [[compaction]]。
