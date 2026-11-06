---
id: trajectory-evaluation
title: Trajectory Evaluation（軌跡評測）
label: Trajectory Evaluation
subject: ai-agent-workflows
type: concept
status: draft
summary: 除了最終答案，也檢查 agent 如何一步步得到答案，避免只看結果而誤判過程。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L184-L260]]'
created: 2026-11-06
updated: 2026-11-06
---

# Trajectory Evaluation（軌跡評測）

## 定義

Trajectory evaluation 是一種評測方式：不只看 agent 最終答案對不對，也檢查它中間走了哪些步驟、呼叫了哪些工具、順序是否合理。它評的是「怎麼得到答案」，而不只是「答案是什麼」。

## 為什麼重要

Agent 可能答對但過程完全不合理，也可能答錯但推理方向正確。只看最終答案，會把這兩種情況都壓成同一個分數，讓除錯與選型失去方向。

## 如何運作

評測者會記錄 agent 的執行軌跡，再對照預期的必要步驟或禁止行為。例如預期「先搜尋、再抓取、最後摘要」，就檢查這些動作有沒有出現、順序是否合理。更成熟的作法只要求必要條件成立，不要求唯一路徑。

## 例子

你原本設計 agent 要走「搜尋 → 抓取頁面 → 摘要」，但它在某次任務中改用「直接查快取 → 摘要」，而且結果正確。若 eval 硬性規定前三步，這次會被判失敗；若 eval 只檢查「有沒有取得可靠來源」，它就會通過。

## 邊界與常見誤解

軌跡評測最大的陷阱是過度僵化。我們設計 agent 是為了保留彈性，卻常把 eval 寫成零彈性，於是誤判合理的替代路徑。反過來說，完全不看軌跡也不行，因為最終答案正確可能只是巧合。

## 進階

把軌跡檢查寫成「必要條件」與「禁止條件」的組合：必要的工具或資訊來源必須出現，危險或違規的動作不得出現，其餘路徑留給 agent 發揮。這樣既能抓錯，又不會把創新路徑當成錯誤。
