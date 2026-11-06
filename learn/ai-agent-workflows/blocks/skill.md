---
id: skill
title: Skill（技能）
label: Skill
subject: ai-agent-workflows
type: concept
status: draft
summary: Skill 是給 agent 的具體指示，用檔案封裝名稱、描述、指示與綁定資訊。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L149-L157]]'
created: 2026-11-06
updated: 2026-11-06
---

# Skill（技能）

## 定義

Skill 是傳遞給 agent 的具體指示（instructions），通常以一個檔案定義，內容包含名稱、描述、指示本體，以及可能引用的綁定資訊。它不是工具，也不是外部 API，而是行為準則。

## 為什麼重要

有些需求不是「去外面拿資料」，而是「照這個專案的方式做」。例如優先使用某個套件、一律用 class 語法、只能碰團隊指定的元件庫。這些規範用 skill 直接傳給模型，比硬塞進每次對話更清楚。

## 如何運作

一個 skill 只需要一個定義檔（如 `SKILL.md`），裡面寫好名稱、描述、具體指示，必要時引用其他文件、工具或 skill 作為綁定資訊。Agent 在任務需要時讀取這份指示，照著執行。

## 例子

專案規定前端只能使用團隊元件庫、不能用殘留的舊版元件；或規定整個專案一律採用 class 語法。把這些寫成 skill，模型在對應情境就會遵守。

## 邊界與常見誤解

Skill 不執行外部動作，也不等於 MCP 或 tool。它的價值在提供指示與規範，能力仍在工具與 harness；指示寫得含糊，模型一樣會誤解。

## 進階

Skill 的關鍵設計是延遲載入：把 metadata 常駐、指示與綁定資訊按需載入，才能在提供大量規範的同時不耗盡 context。
