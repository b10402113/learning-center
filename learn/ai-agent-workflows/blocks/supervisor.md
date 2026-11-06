---
id: supervisor
title: Supervisor（監督者）
label: Supervisor
subject: ai-agent-workflows
type: concept
status: draft
summary: 由一個主 agent 接收需求、拆解任務、派給子 agent，再回收結果決定是否繼續。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L1-L25]]'
created: 2026-11-06
updated: 2026-11-06
---

# Supervisor（監督者）

## 定義

Supervisor 是一種多代理拓撲：一個主 agent 負責接收使用者需求，把查詢拆成子任務，分派給其他子 agent，並把子 agent 的輸出收回來。子 agent 不需要知道彼此的存在，只有 supervisor 需要掌握每個成員的職能。

## 為什麼重要

它把「規劃」從流程裡獨立出來，變成一個專門的 agent。當任務無法事先切成固定步驟時，supervisor 可以在 runtime 根據目前拿到的結果決定下一步要問誰，因此比固定 workflow 更能應付開放式需求。

## 如何運作

1. Supervisor 接收使用者查詢，現場拆解出子問題。
2. 它把每個子任務交給對應的專門 agent，並等待結果。
3. 結果回到 supervisor 後，它判斷資訊是否足夠：不夠就追加子任務，足夠就統整成單一回應。
4. 只有 supervisor 與使用者互動；子 agent 之間不直接對話。

這個結構可以層層嵌套：一個 supervisor 子 agent 本身也可以是其他 agent 的 supervisor，像公司裡一層管一層的主管。

## 例子

以職涯諮詢為例，supervisor 先拆出「適合的職涯」，交給職涯 agent；拿到結果後再拆出「需要哪些培訓」，交給培訓 agent；最後拆出「如何負擔學費」，交給資金 agent。三個子 agent 各自只做一件窄任務，最後由 supervisor 把三份答案合成一份建議。

## 邊界與常見誤解

- **Supervisor 不是平行處理**：平行處理的子任務由程式碼事先固定；supervisor 的子任務是每次輸入時動態決定的。
- **不是所有任務都適合**：子任務高度相依、需要共享 context 的工作（例如寫程式）很難拆給互不相識的 agent。
- **成本高**：supervisor 需要足以拆解任務與管理子 agent 的模型，多層 supervisor 會讓成本再放大。
- **子 agent 的輸出品質取決於 supervisor 給的任務描述**：supervisor 沒把必要資訊放進任務，子 agent 就只能憑片段作答。

## 進階

實作上最常見的手法是把子 agent 包成 supervisor 的工具，見 Subagents as Tools。Supervisor 的拆解方式與固定流程的差別，見 Dynamic Decomposition；採用前該算的成本，見 Supervisor Cost。
