---
id: benchmark-leaderboard
title: Benchmark Leaderboard（評測排行榜）
label: Benchmark Leaderboard
subject: ai-agent-workflows
type: concept
status: draft
summary: 把模型在公開 benchmark 上的分數排成一名單，通常只呈現可靠性，隱藏成本與 context。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L16-L73]]'
  - >-
    [[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L383-L406]]
created: 2026-11-06
updated: 2026-11-06
---

# Benchmark Leaderboard（評測排行榜）

## 定義

Benchmark leaderboard 是把多個模型或 agent 在公開基準測試上的分數排成順序的一份名單。它回答的通常是「這個模型在這些題目上答對了多少比例」，而不是「這個模型適不適合你的產品」。

## 為什麼重要

它是多數人挑模型的第一步，因為分數看起來直接、可比。問題是排行榜幾乎只展示成績單的其中一欄：可靠性。另外兩欄，成本與 context，往往被完全藏起來。

## 如何運作

排行榜彙總的是 benchmark 的計分結果。有些 benchmark 只看最終答案是否正確；有些也開始看 agent 如何得到答案，也就是 trajectory。也有些 benchmark 只讓模型跑一次。這些設計都會影響榜上的名次，但榜單本身通常不會把這些差異攤開給你看。

## 例子

榜上第一名答對率 98%，第二名 97%，看起來只差 1%。但若第一名每次呼叫的成本是第二名的五倍，這 1% 是否值得，取決於你的預算與產品對一致性的要求。單看名次無法回答這個問題。

## 邊界與常見誤解

排行榜不是錯的，也不是廠商故意造假；它只是把一個多維問題壓成單一分數。看到名次時，先問它顯示的是哪一欄、跑了幾次、只看最終答案還是也看過程。把榜單當成起點，而不是選型結論。

## 進階

更有用的做法，是把排行榜當成候選名單：先從榜上挑幾個模型，再用自己從手動測試長出來的 eval 比較。真正要放進產品的決策，應該由你自己的題目、你的成本結構與你的 context 限制來決定。
