---
id: single-run-benchmark
title: "Single-Run Benchmark（單次評測）"
label: "Single-Run Benchmark"
subject: ai-agent-workflows
type: concept
status: draft
summary: "每個任務只給模型或 agent 一次作答機會，因此看不到跨次的一致性與變異。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L74-L160]]"
created: 2026-11-06
updated: 2026-11-06
---

# Single-Run Benchmark（單次評測）

## 定義

Single-run benchmark 是每個任務只跑一次的評測設計：模型或 agent 只有一次機會把題目做對，分數就是那次嘗試的結果。

## 為什麼重要

只跑一次，無法區分「穩定做對」與「剛好猜對」。對需要反覆服務使用者的產品來說，一次成功或一次失敗都不足以描述真實體驗；真正要緊的是同樣的輸入多跑幾次會不會走鐘。

## 如何運作

單次評測等於只觀察 pass@1。它不收集 k 次嘗試之間的成功分布，因此也無法分辨 pass@k（至少成功一次）與 pass^k（每次都要成功）的差別。當系統本身有隨機性或受 prompt、工具回應影響時，單次結果只是眾多可能結果中的一個樣本。

## 例子

一個單次成功率 75% 的系統，連續三次都成功的機率只有約 42%。只跑一次的 benchmark 永遠不會顯示這個落差，因為它從未要求系統連續成功。

## 邊界與常見誤解

單次評測不是一無是處。若產品真的只要求一次成功，例如一次性的程式碼生成或單次工具呼叫，單跑一次仍有參考價值。但把它套到客服、諮詢這類需要一致行為的場景，就會高估系統的可靠性。

## 進階

要讓評測反映真實體驗，至少要把同一題重複跑多次，分別計算「至少一次成功」與「每次都成功」。重複次數不需要一開始就很大，先從三次或五次開始，就能看出單次分數掩蓋了多少變異。
