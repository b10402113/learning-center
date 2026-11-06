---
id: relation-growth
title: "Relation Growth（關係數成長）"
label: "Relation Growth"
subject: ai-agent-workflows
type: concept
status: draft
summary: "Mesh 中新增一個 agent 要建立 N 條關係，context 隨關係數而非 agent 數成長。"
aliases: []
prerequisites: []
related:
  - peer-to-peer-topology
  - coordination-failure
  - shared-conversation-history
sources:
  - "[[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L137-L208]]"
created: 2026-11-06
updated: 2026-11-06
---

# Relation Growth（關係數成長）

## 定義

Relation growth 描述 peer-to-peer 系統的規模化問題：因為每個 agent 都必須認識其他所有 agent，新增一個 agent 時，不是只多一條連線，而是要讓新成員與原本 N 個 agent 一一建立關係，同時讓原本 N 個 agent 也新增對新成員的認知。context 與維護負擔因此隨「關係數」成長，而不是隨「agent 數」線性成長。

## 為什麼重要

這是 mesh 拓撲在實務上難以擴大的核心原因。Supervisor 只要讓主管認識新成員；peer-to-peer 則是全體都要更新。當 agent 數量增加，每個 agent 的 system prompt、工具清單與同儕認知都會膨脹，成本與出錯機率一起上升。

## 如何運作

1. 系統原本有 N 個 agent，彼此兩兩相連。
2. 加入第 N+1 個 agent。
3. 新 agent 需要知道原本 N 個 agent 的專長。
4. 原本 N 個 agent 也都需要新增對新 agent 的認知與交接工具。
5. 淨效果是新增約 2N 條有向關係，總關係數快速攀升。

以工具實作來看，每個 agent 的工具箱裡都要為所有同儕註冊一個 `transfer_to_*` 工具；新增成員時，這些工具會同時出現在所有人的工具箱裡。

## 例子

系統已有職涯、教育、資金、趨勢四個 agent。再加入一個「證照」agent 時，它要認識四個舊成員，四個舊成員也都要認識它；不是只接上一條線，而是五個節點之間要多出一整組連線。

## 邊界與常見誤解

- **不是單純的 prompt 變長**：除了 context，工具註冊、測試與維護成本也一起增加。
- **Supervisor 不會有同樣的成長**：中央化把關係集中在主管身上，新增成員的邊際成本低得多。
- **少數 agent 時差異不明顯**：兩三個 agent 的 mesh 還可運作，問題在規模化後才浮現。
- **拆成多個小 mesh 也無法根治**：那只不過是把關係數問題切成好幾份。

## 進階

這個成長特性是 [[peer-to-peer-topology]] 的主要代價之一，也直接加劇 [[coordination-failure]]。共享歷史的膨脹會進一步放大成本，見 [[shared-conversation-history]]。
