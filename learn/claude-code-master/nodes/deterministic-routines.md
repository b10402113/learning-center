---
id: deterministic-routines
title: "不用 token 的 deterministic routine"
subject: claude-code-master
tier: 4
order: 12
status: draft
goal: "用 Modal 建一條不花 token 的 deterministic pipeline，並判斷何時不該讓 LLM 參與。"
digests:
  - 5-Module_D4_-_Deterministic_Routines.md
  - 6-Tip_-_Voice_Dictation_App_I_Use.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# 不用 token 的 deterministic routine

## Lesson

不是所有自動化都需要一個 brain；不需要判斷的流程用 Python + Modal，跑起來幾乎不花 token。這一節要能判斷哪一種 routine 根本不該用 LLM。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
