---
id: debug-sync-and-legacy
title: "修復：三種壞法、/debug 與遺留程式碼"
subject: js-mastery-engineer
tier: 5
order: 11
status: written
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
steps:
  - id: classify-three-kinds-of-broken
    author: "google/gemini-3.8-flash"
    title: "程式壞掉時先別急著修：面對三種不同的「壞掉」"
    purpose: "能在動手前判斷壞掉的是普通 bug、AI 特有的錯，還是 agent 已經走偏。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/046 - The Three Kinds of Broken.en.txt#L1-L51]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/087 - The Three Kinds of Broken pdf.txt#L1-L88]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/088 - The Three Kinds of Broken.txt#L1-L23]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/093 - Debugging Code You Didnt Write.txt#L1-L124]]"
  - id: run-the-debug-loop
    author: "google/gemini-3.8-flash"
    title: "用單一假設的六步迴圈追查根因"
    purpose: "能給 /debug 觀察、預期與重現步驟，並用單一假設的六步迴圈修到根因。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/047 - The Method That Works on Any Code.en.txt#L1-L21]]"
      - "[[sources/js-mastery-engineer/20261107/course/048 - Demo- Running -debug.en.txt#L1-L65]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/089 - The Method That Works on Any Code pdf.txt#L1-L149]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/090 - The Method That Works on Any Code.txt#L1-L19]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/091 - Demo- Running -debug pdf.txt#L1-L89]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/092 - Demo- Running -debug.txt#L1-L20]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/debug/SKILL.md#L1-L100]]"
  - id: recover-a-stuck-session
    author: "google/gemini-3.8-flash"
    title: "救回原地打轉的 AI Session"
    purpose: "能認出原地打轉的 session，並依序用停手、追問、縮小、回滾、清掉救回來。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/046 - The Three Kinds of Broken.en.txt#L14-L32]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/094 - Recover a Broken Session.txt#L1-L192]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/095 - Challenge- Diagnose a Session.txt#L1-L55]]"
  - id: change-legacy-code-safely
    author: "google/gemini-3.8-flash"
    title: "在既有專案裡先建立地圖，再用最小安全修改交付功能"
    purpose: "能在別人的 codebase 上先 audit 出地圖，再用 scope→architect→develop 做最小安全修改。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/049 - Demo- Running -audit on a Real Open-Source Project.en.txt#L1-L129]]"
      - "[[sources/js-mastery-engineer/20261107/course/050 - Demo- Your First Change in Legacy Code.en.txt#L1-L153]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/096 - Nobody Starts from Scratch.txt#L1-L90]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/097 - Demo- Running -audit on a Real Open-Source Project.txt#L1-L31]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/098 - Demo- Your First Change in Legacy Code.txt#L1-L26]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/099 - Challenge- Audit a Project You Inherited.txt#L1-L90]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/audit/SKILL.md#L1-L108]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/develop/SKILL.md#L1-L144]]"
  - id: sync-and-close-the-loop
    author: "google/gemini-3.8-flash"
    title: "用 /sync 對齊專案狀態，以人的判斷為開發迴圈收尾"
    purpose: "能用 /sync 對齊 AGENTS.md、scope 與 spec，並用人的判斷收尾整個迴圈。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/037 - sync- Understand It Then Automate It.en.txt#L1-L79]]"
      - "[[sources/js-mastery-engineer/20261107/course/045 - The Loop Youll Actually Run.en.txt#L1-L7]]"
      - "[[sources/js-mastery-engineer/20261107/course/064 - Final Pro Tip.en.txt#L1-L11]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/069 - sync- Understand It Then Automate It.txt#L1-L80]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/070 - sync- Understand It Then Automate It.txt#L1-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/085 - The Loop Youll Actually Run pdf.txt#L1-L133]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/086 - The Loop Youll Actually Run.txt#L1-L17]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/113 - Final Pro Tip.txt#L1-L33]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/sync/SKILL.md#L1-L146]]"
created: 2026-11-07
updated: 2026-11-07
---

# 修復：三種壞法、/debug 與遺留程式碼

## Lesson

修之前先分類：是一般 bug、AI 特有的錯，還是 agent 已經走偏。分類對了才知道該改程式碼、補決策，還是清掉 session；同一套紀律也用在不是你寫的 legacy codebase 上，只做最小安全修改。

## Steps

1. [程式壞掉時先別急著修：面對三種不同的「壞掉」](debug-sync-and-legacy/classify-three-kinds-of-broken.md)
2. [用單一假設的六步迴圈追查根因](debug-sync-and-legacy/run-the-debug-loop.md)
3. [救回原地打轉的 AI Session](debug-sync-and-legacy/recover-a-stuck-session.md)
4. [在既有專案裡先建立地圖，再用最小安全修改交付功能](debug-sync-and-legacy/change-legacy-code-safely.md)
5. [用 /sync 對齊專案狀態，以人的判斷為開發迴圈收尾](debug-sync-and-legacy/sync-and-close-the-loop.md)
