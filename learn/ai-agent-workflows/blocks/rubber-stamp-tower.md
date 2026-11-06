---
id: rubber-stamp-tower
title: "Rubber-Stamp Tower（橡皮圖章塔）"
label: "Rubber-Stamp Tower"
subject: ai-agent-workflows
type: concept
status: draft
summary: "多層 supervisor 在缺乏事實反思時，會互相為彼此的幻覺背書，形成假把關。"
aliases: []
prerequisites: []
related:
  - supervisor
  - verification-gap
  - external-signal
sources:
  - "[[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L233-L281]]"
created: 2026-11-06
updated: 2026-11-06
---

# Rubber-Stamp Tower（橡皮圖章塔）

## 定義

Rubber-stamp tower 是 supervisor 架構的一種失敗模式：當多層 supervisor 疊在一起，而沒有一套針對具體事實的有效反思機制時，上層主管容易對下層主管的輸出自信地點頭背書。每一層看起來都審查過了，實際上只是把同一個幻覺往上蓋章。

## 為什麼重要

分層審查看起來像品質保證，但如果審查沒有接觸到可驗證的事實，它就只是增加層數與成本，並沒有增加正確性。這種失敗特別隱蔽，因為系統外觀完整、每層都有「主管」，錯誤卻一路被確認到最終輸出。

## 如何運作

1. 下層 agent 產生一份看似合理的結果。
2. 中層 supervisor 讀到結果，沒有工具或事實可核對，只能根據文字流暢度判斷。
3. 中層把結果往上送，並附上自己的認可。
4. 上層看到「已被審查」的訊號，更傾向相信。
5. 層數越多，錯誤被重複確認的次數越多，修正的機會反而越少。

能力較強的主管模型有時能察覺「哪裡怪怪的」，提供部分護欄；但這不是保證，尤其當好幾層都使用類似模型、類似盲點時。

## 例子

一個三層的職涯顧問系統，最底層誤判某職涯的學歷要求；中層主管沒有查證工具，只確認文字通順；上層主管看到中層已核可，便直接採信。最後使用者拿到的建議，每一層都「審過」，但事實從未被查核。

## 邊界與常見誤解

- **不是 supervisor 本身有問題**：單層 supervisor 若搭配事實查核，仍能有效把關。
- **加一層不會自動修好**：沒有外部訊號時，加層只是加更多橡皮圖章。
- **高階模型不是萬靈丹**：它降低機率，但不能取代針對具體事實的反思。
- **表面共識不是驗證**：多個 agent 都說對，不代表它們查過同一件事。

## 進階

要打斷這個循環，需要把審查接上可驗證的訊號，見 [[external-signal]]。它與多代理「沒有人查核」的結構性問題相關，見 [[verification-gap]]；角色安排本身見 [[supervisor]]。
