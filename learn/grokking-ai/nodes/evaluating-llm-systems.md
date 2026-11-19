---
id: evaluating-llm-systems
title: "評估 LLM 系統"
subject: grokking-ai
tier: 4
order: 25
status: draft
goal: "說出評估金字塔、judge 怎麼校準，以及 golden set 為何要像 CI 一樣跑。"
digests:
  - "32. Evaluating LLM Systems.en.md"
prerequisites:
  - learn/grokking-ai/nodes/llm-at-interview-altitude.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 評估 LLM 系統

## Lesson

生成型系統失去了免費的評估：一則客服回覆沒有唯一正解，兩個都好的答案可能幾乎沒有共同字詞。所以評估本身要設計成一個系統——程式檢查在最底層跑每一次，LLM judge 讀評分規準，人類看小樣本——而三者之間要靠校準串起來。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
