---
id: routines-cloud-and-deterministic
title: "筆電關了也要跑——以及什麼時候根本不該用 LLM"
subject: claude-code-master
tier: 5
order: 10
status: draft
goal: "能用 cloud routine（skill 放私有 GitHub repo）與 deterministic／Modal（零 token）自動化，並用「有腦 vs 無腦」判斷該用哪種。"
digests:
  - volume-d-routines.md
prerequisites: []
steps: []
created: 2026-10-28
updated: 2026-10-28
---

# 筆電關了也要跑——以及什麼時候根本不該用 LLM

## Lesson

local routine 一闔上筆電就停，這一課補上兩種更強的做法：cloud routine 跑在 Anthropic 伺服器上，裝置關了照跑，但要先把 skill 放進私有 GitHub repo 並接上 connector；deterministic／Modal 則是把自動化寫成不含 LLM 的程式碼，排程交給 Modal，成本是零 token。核心判斷是一條「有腦 vs 無腦」的界線：需要判斷的用 Claude routine，純確定性的用 Modal。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
