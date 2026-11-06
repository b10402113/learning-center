---
id: skill-lazy-loading
title: "Skill 延遲載入（Lazy Loading）"
label: "Skill 延遲載入"
subject: ai-agent-workflows
type: concept
status: draft
summary: "只有 skill 的 metadata 常駐 context，指示與綁定資訊在被呼叫或真正需要時才載入。"
aliases: []
prerequisites: []
related:
  - skill
  - skill-bundled-scripts
sources:
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L180-L188]]"
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L225-L242]]"
created: 2026-11-06
updated: 2026-11-06
---

# Skill 延遲載入（Lazy Loading）

## 定義

Skill 延遲載入是一種分層載入策略：skill 的名稱與簡短描述（metadata）一直留在 context，完整指示與綁定資訊則延後到 agent 呼叫該 skill、或真正需要某份資料時才載入。

## 為什麼重要

Context 是 agent 最珍貴也最有限的資源。把所有規則、工具定義與文件全時段塞進 prompt，會很快擠掉真正處理任務的空間。延遲載入讓幾十個 skill 同時存在，也不會造成負擔。

## 如何運作

第一層 metadata 常駐，依 Anthropic 的估算每個 skill 約 100 tokens；第二層指示通常建議控制在 5,000 tokens 以內，只有被呼叫時才進入 context；第三層綁定資訊可以多層巢狀，未真正讀取前成本為零。即使 skill 已啟動，只會載入當下需要的那一塊。

## 例子

一個涵蓋前後端規範的全端 skill，當 agent 只處理前端時，後端相關的綁定文件完全不會被載入，也不佔 context。

## 邊界與常見誤解

延遲載入的前提是 metadata 足夠準確，模型才能在對的時機想起這個 skill。metadata 太模糊，skill 再完整也不會被叫用。

## 進階

把多層綁定與 context 預算一起規劃：用少量 metadata 換取可發現性，再用按需載入換取深度，兩者兼顧。
