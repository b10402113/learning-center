---
id: pass-hat-k
title: "pass^k（每次都要成功）"
label: "pass^k"
subject: ai-agent-workflows
type: concept
status: draft
summary: "連續 k 次嘗試全部成功的機率，適合要求每一次行為都一致正確的對外服務。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L74-L160]]"
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L161-L183]]"
created: 2026-11-06
updated: 2026-11-06
---

# pass^k（每次都要成功）

## 定義

pass^k（也寫成 pass hat k 或 pass power k）衡量的是：連續 k 次嘗試中，每一次都成功的機率。它對一致性的要求比 pass@k 嚴格得多。

## 為什麼重要

對外服務的使用者只會體驗到當次結果，不會知道「多跑幾次就會對」。客服、退款、生涯諮詢這類場景，一次失控就可能造成實際損害，因此需要看每次都能成功的機率。

## 如何運作

因為要求每一次都對，k 越大，pass^k 越低。單次成功率 75% 的系統，連續三次全對的機率是 0.75 的三次方，約 42%。嘗試次數越多，分數下滑得越快。

## 例子

客服 agent 處理退款時，政策不允許退款就不能出現「十次有九次拒絕、一次答應」。即使 pass^k 有 97%，仍然代表每 100 位使用者中有 3 位拿到錯誤結果。百分比要換算成實際受影響的人數，才看得清風險。

## 邊界與常見誤解

pass^k 高不代表完美，只代表失敗比例較低。把 97% 當成「幾乎不會錯」是常見誤解；在大量使用者面前，3% 仍然是每天都會發生的客訴。

## 進階

實務上會同時看 pass@k 與 pass^k：前者回答「有沒有機會成功」，後者回答「能不能穩定成功」。若產品同時有工具型與對外服務型流程，就該分開設定指標，而不是用一個平均分數蓋掉兩種風險。
