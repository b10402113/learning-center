---
id: capacitance-esr-and-controlled-esr
title: "需要多少電容、ESR 模型與受控 ESR"
subject: principle-pi
tier: 5
order: 15
status: draft
goal: "從 target 反推 bulk 電容，並用 ESR 與受控 ESR 壓低並聯峰。"
digests:
  - Principles of power integrity for PDN design -- simplified robust and cost effective design for high speed digital products.8.part.md
prerequisites:
  - learn/principle-pi/nodes/cap-rlc-and-parallel-resonance.md
steps: []
created: 2026-11-11
updated: 2026-11-11
---

# 需要多少電容、ESR 模型與受控 ESR

## Lesson

「需要多少電容」的誠實答案要靠時域模擬，但一階估算可以從 VRM 失效的頻率反推 bulk 值。這一節也拆解 ESR 的兩個損耗機制，並解釋受控 ESR 為什麼能壓低並聯峰而不影響高頻。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
