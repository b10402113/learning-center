---
id: guardrail-scorecard
title: "Guardrail scorecard：catch rate 與 over-block rate"
subject: ai-eval
tier: 3
order: 11
status: draft
goal: "能為 top risks 建 regex／judge／hybrid guardrail，並用 catch rate 與 over-block rate 兩個數字計分。"
digests:
  - lesson5.en.md
  - AI_Evals_Week3_Deck.md
  - lesson6.en.md
prerequisites:
  - learn/ai-eval/nodes/promptfoo-red-team.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# Guardrail scorecard：catch rate 與 over-block rate

## Lesson

每個 guardrail 都要兩個數字：攔下多少攻擊（catch rate）與誤擋多少真人（over-block rate）；只看一個會做出「安全但沒人敢用」的產品。這條節點依 triage 的 top risks 建 regex、judge 或 hybrid guardrail，用 2×2 計分，並處理疊加後對合法使用者的敵意。最後把不該全自動的動作留給 human-in-the-loop。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
