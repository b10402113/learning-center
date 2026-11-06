---
id: pass-at-k
title: "pass@k（至少成功一次）"
label: "pass@k"
subject: ai-agent-workflows
type: concept
status: draft
summary: "k 次嘗試中至少成功一次的機率，適合只要求拿到一次正確答案的工具情境。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L74-L160]]"
  - "[[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L395-L406]]"
created: 2026-11-06
updated: 2026-11-06
---

# pass@k（至少成功一次）

## 定義

pass@k 衡量的是：在 k 次嘗試中，模型或 agent 至少產出一次正確解答的機率。它不要求每一次都對，只要求其中一次成功。

## 為什麼重要

程式碼生成與工具導向的任務，常常只在意「能不能拿到一個可用的答案」。在這種情境下，多試幾次是合理的，pass@k 正好描述這個使用方式。

## 如何運作

因為只要成功一次就算數，k 越大，pass@k 越高。pass@1 是最嚴格的形式：只給一次機會，分數代表第一次就成功的比例。pass@k 則允許重抽，把「試到對為止」的空間算進成功率。

## 例子

某個 coding benchmark 的 pass@1 是 50%，代表一半的題目第一次就寫對。若允許嘗試三次，pass@3 會明顯高於 50%，因為只要三次中出現一個可執行的版本就算過關。

## 邊界與常見誤解

pass@k 高，不代表系統穩定。它只描述「有機會成功」，不描述「每次都好」。對直接面對使用者的 agent，pass@k 幾乎沒有意義：使用者不會接受「你多問十次就會有一次得到正確的生涯建議」。

## 進階

選擇指標前先問產品允許幾次嘗試。若答案是「使用者只會問一次」，就該看 pass^1 或 pass^k 這類要求一致性的指標；若答案是「工具可以重試」，pass@k 才合理。兩個指標沒有優劣，只有是否符合使用情境。
