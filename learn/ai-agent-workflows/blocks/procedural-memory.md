---
id: procedural-memory
title: "Procedural Memory（程序記憶）"
label: "Procedural Memory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "agent 知道事情該怎麼做的技能，來自模型權重、system prompt、工具定義與程式碼。"
aliases: []
prerequisites: []
related:
  - working-memory
  - semantic-memory
  - memory-retrieval
sources:
  - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L263-L302]]"
created: 2026-11-06
updated: 2026-11-06
---

# Procedural Memory（程序記憶）

## 定義

Procedural memory（程序記憶）是技能，回答的是「事情該怎麼做」。它涵蓋 agent 完成任務所需的步驟、規則與操作方式，不涉及具體事實或過去經歷。

## 為什麼重要

Agent 能讀寫與推理，某種程度上是因為這些能力已內建在模型權重裡。但光靠權重不夠：怎麼使用工具、遵循什麼流程、遇到特定任務要走哪條路，都需要額外提供。程序記憶就是把「會思考」變成「會做事」的那一層。

## 如何運作

程序記憶有兩個來源。一部分來自模型訓練完成的權重，這是它具備基本語言與推理能力的原因。剩下的部分由 agent 的開發者提供，包括：

- system prompt 中規範的工作流程
- 工具的定義與呼叫規範
- 專為特定任務撰寫的控制邏輯程式碼

有些進階 agent 甚至能為自己編寫新技能，把成功做法存下來重複使用。

## 例子

在 Minecraft 環境中運作的自主 agent，能把打造鐵劍的動作序列寫成程式碼保存；日後遇到相同需求，直接重複呼叫這項新技能，不必每次重新摸索。

## 邊界與常見誤解

- **程序記憶不是事實**：知道退款政策內容是語意記憶，知道怎麼執行退款流程才是程序記憶。
- **它不是過去事件**：上次退款發生什麼事屬於情節記憶。
- **不只是模型內建**：開發者提供的 prompt、工具定義與程式碼同樣是程序記憶。
- **技能可以被寫出來**：部分 agent 能自行新增並重用技能，不限於初始設定。

## 進階

程序記憶決定 agent 的行動能力，工作記憶則決定它當下記得什麼，兩者相輔相成。與事實、經歷的對照見 [[semantic-memory]] 與 [[episodic-memory]]；如何把記憶帶回 context 見 [[memory-retrieval]]。
