---
id: repeatable-eval-harness
title: "把一次性 eval 變成可重跑的 harness"
subject: ai-eval
tier: 4
order: 15
status: draft
goal: "能用一個 config、一個指令重跑整套 eval，並把它接進 CI 與固定的 eval 節奏。"
digests:
  - lesson7.en.md
  - AI_Evals_Week4_Deck.md
  - lesson6.en.md
  - lesson8.en.md
prerequisites:
  - learn/ai-eval/nodes/retrieval-vs-generation.md
  - learn/ai-eval/nodes/is-the-improvement-real.md
  - learn/ai-eval/nodes/multi-turn-tool-calls-and-ab.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 把一次性 eval 變成可重跑的 harness

## Lesson

前面所有東西要收成一個別人能重現的 harness：一個 config、一個指令、一份帶 n 與區間的報告。這條節點處理 eval 的節奏——哪些跑在 PR、哪些跑在模型更換、哪些只做線上抽樣——以及為什麼 eval 應該是既有 QA 的一部分，而不是一個獨立的中心。最後用 CLI 與 UI 結果不一致的案例，說明可重跑為什麼是信任的前提。

## Steps

<!-- /nodes fills this ordered list - one link per step entry. -->
