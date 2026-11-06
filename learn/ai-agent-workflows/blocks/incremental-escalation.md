---
id: incremental-escalation
title: "Incremental Escalation（逐級升級）"
label: "Incremental Escalation"
subject: ai-agent-workflows
type: procedure
status: draft
summary: "從純程式碼開始，一次只加一個 LLM 或一層 agent，每步都用 eval 驗證再往右移動。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L92-L127]]"
  - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L128-L211]]"
created: 2026-11-06
updated: 2026-11-06
---

# Incremental Escalation（逐級升級）

## 問題

面對一個新任務，很難一開始就判斷該用純程式碼、LLM workflow、single agent 還是 multi-agent。直接選最複雜的架構，通常換來更高的成本與更差的除錯體驗；選得太簡單，又可能做不出來。

## 前置條件

需要一個可執行的 deterministic baseline，以及一組能明確判定 pass/fail 的 eval。沒有量測，升級就只是猜測。

## 步驟

1. 先寫完全由程式碼控制的版本，不放任何 LLM。
2. 找出一個真的需要自然語言處理、傳統程式碼難以處理的步驟，只在該處加入一個 LLM。
3. 若還有其他步驟需要，再一次加入一個；不要一次把所有步驟都換成 LLM。
4. 若單一 LLM 甚至 frontier model 仍無法達標，把該步驟改成帶 reflection loop 的 single agent。
5. 只有在問題可拆成獨立子問題、且每個子問題都需要大量 context 時，才考慮 multi-agent。
6. 每一次升級都用同一組 eval 比較，確認淨收益值得增加的成本。

## 例子

職涯諮詢系統先做規則式分類與 dispatcher，context 小、成本低。若遇到規則無法處理的模糊輸入，才在分類步驟加入 LLM；若分類仍不穩，才把該步驟升級成 single agent。整個過程不是一次跳到 multi-agent。

## 失敗模式

- 一開始就上 multi-agent，結果成本高、錯誤難追。
- 為不需要自然語言處理的步驟加 LLM，讓系統變貴卻沒有變好。
- 沒有 eval 就升級，無法判斷新版本是否真的改善。
- 把升級當成單向流程，發現更簡單的版本更好時不肯退回。

## 進階

升級的觸發條件應該是量測結果，而不是架構聽起來先不先進。每次升級前先問：這個步驟的失敗，是模型能力不足，還是流程設計有問題？若是後者，換更大的模型也不會解決。
