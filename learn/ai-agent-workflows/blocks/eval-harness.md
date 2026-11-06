---
id: eval-harness
title: "Eval Harness（評測框架）"
label: "Eval Harness"
subject: ai-agent-workflows
type: concept
status: draft
summary: "包住待測 agent 的執行框架，內含 prompt、guardrail、規則與環境，會大幅改變評測結果。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L184-L260]]"
created: 2026-11-06
updated: 2026-11-06
---

# Eval Harness（評測框架）

## 定義

Eval harness 是跑評測時包在模型或 agent 外層的執行框架。它包含 prompt 模板、guardrail、流程規則、工具接法與執行環境，決定 agent 在測試中實際看到什麼、能做什麼。

## 為什麼重要

Harness 會大幅改變 agent 的行為。同一個模型放進不同 harness，表現可能完全不同；因此跨 harness 的分數不能直接比較。看到一個漂亮分數時，第一個問題應該是「它是在哪個 harness 裡跑的」。

## 如何運作

Harness 在背後做很多事：組 prompt、限制可用工具、套用防護規則、管理執行環境與計分。這些設定不是中立的背景，而是評測結果的一部分。建立與維護環境本身也是主要工程，環境有漏洞時，分數會失真，甚至讓 agent 有機會繞過真正解題。

## 例子

OpenAI 在 SWE-bench Verified 的 500 道題目上測試 o3 與 o4-mini 時，因為基礎架構限制只跑了 477 題。連擁有資源的實驗室都無法完整跑完，說明 harness 與環境維護本身就是評測難度的一部分。

## 邊界與常見誤解

常見誤解是「同一個模型，分數應該差不多」。實際上 harness 的 prompt、guardrail 與環境都會影響結果。另一個誤解是把 harness 當成可替換的細節；它往往才是分數差異的主要來源。

## 進階

若要用公開分數選型，先確認比較的模型是否在同一個 harness、同一組環境設定下跑。若要自建 eval，則要刻意讓 harness 貼近 production，同時把額外設定降到最低，避免量到 harness 而不是 agent。
