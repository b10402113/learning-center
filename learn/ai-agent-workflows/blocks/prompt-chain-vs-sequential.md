---
id: prompt-chain-vs-sequential
title: Prompt Chain vs Sequential（提示詞鏈與循序多代理）
label: Prompt Chain vs Sequential
subject: ai-agent-workflows
type: contrast
status: draft
summary: 同樣是直線流程，差別在每一步是一次 LLM 呼叫，還是一個完整 agent。
aliases: []
prerequisites: []
related:
  - sequential-multi-agent
  - specialist-agent
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L56-L68]]
created: 2026-11-06
updated: 2026-11-06
---

# Prompt Chain vs Sequential（提示詞鏈與循序多代理）

## A 是什麼

Prompt chain 是一串一次性的 LLM 呼叫：每一步只把提示詞送進模型、拿回文字，再往下傳。步驟裡沒有工具、沒有內部迴圈，也不會在執行途中做決策。

## B 是什麼

Sequential multi-agent 的拓撲看起來一樣，但管線中的每一步都是一個完整獨立的 agent。每個 agent 能規劃、呼叫工具、反思與重試，也可以使用不同的模型、prompt 與工具集。

## 關鍵差異

兩者最實際的差別在失敗之後會發生什麼。Prompt chain 的某一步產出不佳時，錯誤會直接順流而下，下一步只能在壞輸入上繼續；sequential 的 agent 則可以在自己的迴圈裡發現問題、修正後再交棒。代價是每一步多了內部迴圈，延遲與成本都更高。

## 何時用哪個

任務只是單純的文字轉換、步驟少、要求低延遲與低成本時，用 prompt chain 就夠。若下游必須依賴上游成果，而且每一步需要查資料、用工具或自我驗證，才值得升級成 sequential multi-agent。

## 進階

升級與否可以用 Error Compounding 的風險來判斷：如果壞輸出會被下一步照單全收，就該加入 agent 層級的驗證。分工邊界則可參考 [[specialist-agent]]，避免每個 agent 又變成包山包海的單一 agent。
