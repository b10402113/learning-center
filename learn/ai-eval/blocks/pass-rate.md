---
id: pass-rate
title: "Pass Rate（通過率）"
label: "Pass Rate"
subject: ai-eval
type: concept
status: draft
summary: "把品質定義成多次執行中通過的比例，取代單次輸出的相等比對。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L327-L333]]"
  - "[[sources/ai-eval/20261108/supplement/code/README.html#L23-L31]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Pass Rate（通過率）

<!--image:1-->

## 定義

Pass Rate（通過率）是指 AI 系統在多次相同或相似的測試執行中，結果符合預期標準的次數比例。

在傳統軟體測試中，品質通常透過單次輸入與預期輸出的精確比對（exact-match）來檢驗；但大型語言模型與 AI Agent 具有非確定性（non-deterministic），即使輸入完全相同，每次產出的文字也可能不同。Pass Rate 放棄了單次輸出的相等斷言，改將品質定義為多次執行下的統計比率。

<!-- source: sources/ai-eval/20261108/supplement/code/README.html#L23-L31 -->

```html
<section id="s1">
<h2>Week 1 — Live Session (Wed, Oct 7, 5 PM PT)</h2>
<p>Session 1 builds the mental model for the rest of the course. AI systems don't return the same output twice — so quality has to be measured as a rate over many runs, not asserted on a single one. You'll see what happens when teams skip evals (a deleted production database, a chatbot that invented refund policy), why strong benchmark scores don't guarantee a good product, and which parts of traditional QA break once outputs become non-deterministic.</p>
<p>Then we make it concrete with Pronto, a fictional grocery support agent: the six dimensions of AI product quality (model quality, product behavior, safety, reliability, cost, latency), the anatomy of an eval harness, and a tour of the frameworks you'll use across the six weeks.</p>
<p>The second half is hands-on. We trace a real agent, read full traces instead of logs, mark runs pass/fail, and group failures into a countable taxonomy — the exact workflow behind Project 1. The most frequent failure category becomes the starting point for your first eval.</p>
<p><strong>Clone the course repo:</strong>  run make setup, add your API keys — <a href="https://github.com/coachmanjeet/AI-Agent-Evals-Course" target="_blank">github.com/coachmanjeet/AI-Agent-Evals-Course</a>. <br/>No key yet? The <a href="https://coachmanjeet.github.io/AI-Agent-Evals-Course/trace-viewer/" target="_blank">Trace Viewer</a> runs in your browser with zero setup.</p>
<p><strong>By the end of Session 1, you will be able to:</strong></p>
<ul><li>Explain why exact-match testing fails for AI systems — and what replaces it</li><li>Assess an AI product across all six quality dimensions instead of accuracy alone</li><li>Read an agent trace end to end and pinpoint where a run went wrong</li><li>Turn messy failures into a countable failure taxonomy</li><li>Start Project 1: instrument the Pronto agent, trace 30 runs, and ship your first taxonomy (White belt 🥋)</li></ul>
</section>
```

## 為什麼重要

傳統 CI/CD 流程依賴確定性的單元測試：輸入 A，輸出必須恰好是 B。如果把這種測試邏輯直接套用在 AI 應用上，測試會頻繁假警報（false alarm），因為模型換個詞彙表達同一件事就會被判定為失敗。

AI 系統輸出的品質不是單純的對與錯，而是一個連續光譜。只跑一次測試並通過，不代表系統在線上能穩定運作；單次成功很可能只是隨機運氣。唯有透過多次執行並計算 Pass Rate，團隊才能量化系統的可靠度，並評估回答究竟是有 80% 正確、90% 正確，還是出現了幻覺。

## 如何運作

計算 Pass Rate 的核心流程包含三個環節：

1. **定義通過標準**：清楚劃分「應該發生什麼」與「絕對不能發生什麼」。這不比對逐字字串，而是檢查關鍵行為，例如是否呼叫了正確的工具、是否遵守退款政策、輸出格式是否符合結構要求。
2. **多輪批次執行**：針對同一組測試案例，讓模型或 Agent 執行多次（例如 20 次或 30 次），記錄每次執行的完整軌跡（trace）。
3. **標記與統計**：逐一檢視每次執行結果並判定為 Pass 或 Fail。總通過次數除以總執行次數，即為該測試情境的 Pass Rate。

當測試未通過時，團隊會將失敗歸類至具體的錯誤分類（failure taxonomy），作為後續優化 prompt 或流程的依據。

## 例子

以電商客服 Agent 處理「顧客查詢過期訂單並要求退款」為例：

- **傳統測試斷言**：檢查回覆是否完全等於預設字串「抱歉，您的訂單已超過 30 天退款期限。」——只要模型多加了一句禮貌問候，測試就失敗。
- **Pass Rate 評估**：設定通過條件為「回覆必須清楚拒絕退款、說明超過 30 天政策，且不得呼叫退款 API」。對該情境執行 30 次測試，其中 27 次正確拒絕並說明政策，3 次因為被使用者話術繞過而承諾退款。此情境的 Pass Rate 即為 90%（27/30），團隊便能明確知道該漏洞發生率為 10%。

## 邊界與常見誤解

常見的誤解是「只要基準測試（benchmark）分數高，Pass Rate 就會高」。公開基準評測通常衡量模型的通用推理能力，無法反映特定業務情境下的邊界行為與工具呼叫穩定度。

另一個邊界在於，單一的總體 Pass Rate 可能掩蓋致命問題。如果系統在日常問答達到 98% 的通過率，但在涉及刪除資料庫或修改權限的高風險場景中只有 80% 通過率，這個平均數字會帶來虛假的安全感。Pass Rate 必須依據風險層級與場景分類統計。

## 進階

在建置自動化評測體系時，Pass Rate 通常不會單獨觀察，而是搭配六大品質維度共同衡量：模型品質、產品行為、安全性、可靠度、成本與延遲。

此外，Pass Rate 的計算門檻可以分層設定。團隊常會建立評測框架（eval harness），將嚴格判定（所有約束皆需滿足）與寬鬆判定（核心任務完成即可）分開計算，以便在追求高可靠度的同時，精確找出是哪一層約束拉低了系統的穩定性。
