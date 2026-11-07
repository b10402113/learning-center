---
id: debug-sync-and-legacy
title: "修復：三種壞法、/debug 與遺留程式碼"
subject: js-mastery-engineer
tier: 5
order: 11
status: draft
goal: "能先分類三種壞法，再用 `/debug` 的單一假設迴圈修復，並在 legacy codebase 上做最小安全修改。"
digests:
  - 037 - sync- Understand It Then Automate It.en.md
  - 045 - The Loop Youll Actually Run.en.md
  - 046 - The Three Kinds of Broken.en.md
  - 047 - The Method That Works on Any Code.en.md
  - 048 - Demo- Running -debug.en.md
  - 049 - Demo- Running -audit on a Real Open-Source Project.en.md
  - 050 - Demo- Your First Change in Legacy Code.en.md
  - 064 - Final Pro Tip.en.md
  - skills.md
  - 069 - sync- Understand It Then Automate It.md
  - 070 - sync- Understand It Then Automate It.md
  - 085 - The Loop Youll Actually Run pdf.md
  - 086 - The Loop Youll Actually Run.md
  - 087 - The Three Kinds of Broken pdf.md
  - 088 - The Three Kinds of Broken.md
  - 089 - The Method That Works on Any Code pdf.md
  - 090 - The Method That Works on Any Code.md
  - 091 - Demo- Running -debug pdf.md
  - 092 - Demo- Running -debug.md
  - 093 - Debugging Code You Didnt Write.md
  - 094 - Recover a Broken Session.md
  - 095 - Challenge- Diagnose a Session.md
  - 096 - Nobody Starts from Scratch.md
  - 097 - Demo- Running -audit on a Real Open-Source Project.md
  - 098 - Demo- Your First Change in Legacy Code.md
  - 099 - Challenge- Audit a Project You Inherited.md
  - 113 - Final Pro Tip.md
prerequisites:
  - learn/js-mastery-engineer/nodes/two-kinds-of-proof.md
steps: []
created: 2026-11-07
updated: 2026-11-07
---

# 修復：三種壞法、/debug 與遺留程式碼

## Lesson

修之前先分類：是一般 bug、AI 特有的錯，還是 agent 已經走偏。分類對了才知道該改程式碼、補決策，還是清掉 session；同一套紀律也用在不是你寫的 legacy codebase 上，只做最小安全修改。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
