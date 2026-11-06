---
id: reflection-memory
title: "Reflection Memory（反思記憶）"
label: "Reflection Memory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把每輪失敗檢討以自然語言存進 context 或長期記憶，讓後續嘗試能讀到並避開同樣的錯。"
aliases: []
prerequisites: []
related:
  - reflexion
  - reflexion-roles
  - in-context-learning
  - episodic-memory
sources:
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L284-L300]]"
  - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L133-L151]]"
created: 2026-11-06
updated: 2026-11-06
---

# Reflection Memory（反思記憶）

## 定義

Reflection memory 是把每一輪反思寫成的自然語言文字保存下來，並在後續嘗試時放回 context 的機制。它存的不是完整軌跡，而是「哪裡錯了、下次該怎麼做」這種可讀、可攜帶的教訓。

## 為什麼重要

Reflexion 之所以能跨嘗試改進，靠的就是這份累積。到第三次嘗試時，agent 若只看得到上一輪結果，就可能重複前兩輪的錯；若看得到前兩輪寫下的檢討，就能主動避開已知的坑。它也是把當次經驗帶到未來任務的橋樑。

## 如何運作

1. 一次嘗試失敗後，reflection 模型寫下一段白話檢討。
2. 這段文字被 append 到 context，或存進外部記憶。
3. 下一次嘗試時，agent 在 prompt 中讀到這些檢討，據此調整行動。
4. 任務結束後，可把摘要整理進向量資料庫等長期記憶，供未來任務檢索。

## 例子

第一輪的檢討是：「我漏掉資金選項，下次除了貸款，也要搜尋獎學金與補助金。」第二輪 agent 讀到這句話，於是在工具呼叫中主動加入獎學金查詢，補齊先前的缺漏。

## 邊界與常見誤解

- **不是永久記憶**：只存在 context 時，視窗清空就消失；要跨 session 必須外部化。
- **不是越多越好**：反思文字會佔用 context，累積太多反而擠掉真正重要的資訊。
- **錯誤會被放大**：若某一輪檢討寫錯，後續嘗試會沿著錯誤方向修正。
- **需要更新與淘汰**：過時或已被推翻的教訓應該移除，不能無限堆疊。

## 進階

把反思記憶想成一種 [[episodic-memory]]：它記錄「這次發生了什麼」。實務上要搭配 [[context-window]] 管理與摘要策略，才能既保留教訓又不壓垮 prompt。
