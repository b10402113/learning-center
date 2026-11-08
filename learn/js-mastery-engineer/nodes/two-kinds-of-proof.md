---
id: two-kinds-of-proof
title: "兩種證明與第二顆腦袋"
subject: js-mastery-engineer
tier: 4
order: 10
status: written
goal: "能依序用 `/check verify`、`/test`、`/check review`、`/document` 完成四層驗證。"
digests:
  - 039 - Walkthrough Prove it Runs.en.md
  - 040 - Two Kinds of Proof.en.md
  - 041 - Demo- Running -check verify.en.md
  - 042 - Demo- Running -test.en.md
  - 043 - Why a Second Mind Matters.en.md
  - 044 - Demo – Running -check review.en.md
  - 054 - Use Check-Verify command for Data Model.en.md
  - 055 - Review the Data Model Audit.en.md
  - 056 - Use Document SKILL for Data Model.en.md
  - skills.md
  - 072 - Walkthrough Prove it Runs.md
  - 073 - Two Kinds of Proof pdf.md
  - 074 - Two Kinds of Proof.md
  - 075 - Demo- Running -check verify pdf.md
  - 076 - Demo- Running -check verify.md
  - 077 - Demo- Running -test pdf.md
  - 078 - Demo- Running -test.md
  - 079 - Challenge- Make It Lie to You Prove it Runs.md
  - 080 - Why a Second Mind Matters.md
  - 081 - Demo - Running -check review pdf.md
  - 082 - Demo - Running -check review.md
  - 083 - document- The Record That Travels With Your Code.md
  - 084 - Challenge- Three Reviewers One Feature.md
  - 103 - Use Check-Verify command for Data Model.md
  - 104 - Review the Data Model Audit.md
  - 105 - Use Document SKILL for Data Model.md
prerequisites:
  - learn/js-mastery-engineer/nodes/develop-and-audit.md
steps:
  - id: two-questions-two-skills
    author: "google/gemini-3.8-flash"
    title: "兩種證明：今天能用與以後不被改壞"
    purpose: "能分清「今天能用」與「以後不被改壞」兩種證明，並說明 verify 必須先於 test。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/040 - Two Kinds of Proof.en.txt#L1-L11]]"
      - "[[sources/js-mastery-engineer/20261107/course/040 - Two Kinds of Proof.en.txt#L12-L23]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/073 - Two Kinds of Proof pdf.txt#L5-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/073 - Two Kinds of Proof pdf.txt#L25-L34]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/073 - Two Kinds of Proof pdf.txt#L35-L52]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/074 - Two Kinds of Proof.txt#L5-L9]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/074 - Two Kinds of Proof.txt#L10-L14]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/074 - Two Kinds of Proof.txt#L15-L18]]"
  - id: run-check-verify
    author: "google/gemini-3.8-flash"
    title: "用 `/check verify` 逐條驗收功能"
    purpose: "能用 `/check verify` 依 verify.md 逐條驗收，並分辨四種結果與阻擋原因。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/039 - Walkthrough Prove it Runs.en.txt#L1-L19]]"
      - "[[sources/js-mastery-engineer/20261107/course/039 - Walkthrough Prove it Runs.en.txt#L20-L41]]"
      - "[[sources/js-mastery-engineer/20261107/course/039 - Walkthrough Prove it Runs.en.txt#L42-L63]]"
      - "[[sources/js-mastery-engineer/20261107/course/039 - Walkthrough Prove it Runs.en.txt#L64-L87]]"
      - "[[sources/js-mastery-engineer/20261107/course/041 - Demo- Running -check verify.en.txt#L1-L22]]"
      - "[[sources/js-mastery-engineer/20261107/course/041 - Demo- Running -check verify.en.txt#L23-L44]]"
      - "[[sources/js-mastery-engineer/20261107/course/041 - Demo- Running -check verify.en.txt#L45-L69]]"
      - "[[sources/js-mastery-engineer/20261107/course/041 - Demo- Running -check verify.en.txt#L70-L99]]"
      - "[[sources/js-mastery-engineer/20261107/course/041 - Demo- Running -check verify.en.txt#L100-L111]]"
      - "[[sources/js-mastery-engineer/20261107/course/054 - Use Check-Verify command for Data Model.en.txt#L1-L16]]"
      - "[[sources/js-mastery-engineer/20261107/course/054 - Use Check-Verify command for Data Model.en.txt#L17-L31]]"
      - "[[sources/js-mastery-engineer/20261107/course/054 - Use Check-Verify command for Data Model.en.txt#L32-L59]]"
      - "[[sources/js-mastery-engineer/20261107/course/054 - Use Check-Verify command for Data Model.en.txt#L60-L77]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/072 - Walkthrough Prove it Runs.txt#L5-L12]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/072 - Walkthrough Prove it Runs.txt#L13-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L5-L43]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L44-L56]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L57-L61]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L62-L74]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L75-L79]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L80-L84]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt#L85-L90]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/076 - Demo- Running -check verify.txt#L5-L9]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/076 - Demo- Running -check verify.txt#L10-L15]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/076 - Demo- Running -check verify.txt#L16-L20]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/103 - Use Check-Verify command for Data Model.txt#L1-L9]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/103 - Use Check-Verify command for Data Model.txt#L10-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/check/SKILL.md#L1-L52]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/check/modes/verify.md#L1-L173]]"
  - id: run-test
    author: "google/gemini-3.8-flash"
    title: "用 `/test` 把驗收成果變成回歸測試"
    purpose: "能用 `/test` 把已證明的驗收條件變成回歸測試，並在失敗時守住紅燈。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/042 - Demo- Running -test.en.txt#L1-L19]]"
      - "[[sources/js-mastery-engineer/20261107/course/042 - Demo- Running -test.en.txt#L20-L32]]"
      - "[[sources/js-mastery-engineer/20261107/course/042 - Demo- Running -test.en.txt#L33-L49]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L1-L25]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L26-L31]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L32-L35]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L36-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L58-L64]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L65-L71]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L72-L77]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/077 - Demo- Running -test pdf.txt#L78-L84]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/078 - Demo- Running -test.txt#L5-L8]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/078 - Demo- Running -test.txt#L9-L14]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/078 - Demo- Running -test.txt#L15-L19]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/079 - Challenge- Make It Lie to You Prove it Runs.txt#L1-L6]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/079 - Challenge- Make It Lie to You Prove it Runs.txt#L7-L17]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/079 - Challenge- Make It Lie to You Prove it Runs.txt#L18-L41]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/079 - Challenge- Make It Lie to You Prove it Runs.txt#L42-L56]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/test/SKILL.md#L1-L216]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/test/agent-prompt.md#L1-L62]]"
  - id: run-check-review
    author: "google/gemini-3.8-flash"
    title: "用 `/check review` 進行非作者模型審查"
    purpose: "能用 `/check review` 讓非作者模型從乾淨起點審查，並讀懂嚴重度與結論。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/043 - Why a Second Mind Matters.en.txt#L1-L13]]"
      - "[[sources/js-mastery-engineer/20261107/course/043 - Why a Second Mind Matters.en.txt#L14-L33]]"
      - "[[sources/js-mastery-engineer/20261107/course/044 - Demo – Running -check review.en.txt#L1-L18]]"
      - "[[sources/js-mastery-engineer/20261107/course/044 - Demo – Running -check review.en.txt#L19-L31]]"
      - "[[sources/js-mastery-engineer/20261107/course/044 - Demo – Running -check review.en.txt#L32-L59]]"
      - "[[sources/js-mastery-engineer/20261107/course/055 - Review the Data Model Audit.en.txt#L1-L8]]"
      - "[[sources/js-mastery-engineer/20261107/course/055 - Review the Data Model Audit.en.txt#L9-L16]]"
      - "[[sources/js-mastery-engineer/20261107/course/055 - Review the Data Model Audit.en.txt#L17-L21]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/080 - Why a Second Mind Matters.txt#L5-L9]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/080 - Why a Second Mind Matters.txt#L10-L13]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/080 - Why a Second Mind Matters.txt#L14-L18]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L1-L22]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L23-L41]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L42-L48]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L49-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L58-L61]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L62-L69]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt#L70-L77]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/082 - Demo - Running -check review.txt#L5-L11]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/082 - Demo - Running -check review.txt#L12-L17]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/082 - Demo - Running -check review.txt#L18-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/084 - Challenge- Three Reviewers One Feature.txt#L1-L6]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/084 - Challenge- Three Reviewers One Feature.txt#L7-L20]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/084 - Challenge- Three Reviewers One Feature.txt#L21-L29]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/084 - Challenge- Three Reviewers One Feature.txt#L30-L78]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/084 - Challenge- Three Reviewers One Feature.txt#L79-L87]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/084 - Challenge- Three Reviewers One Feature.txt#L88-L103]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/104 - Review the Data Model Audit.txt#L1-L10]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/104 - Review the Data Model Audit.txt#L11-L20]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/check/modes/review.md#L1-L146]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/check/review-guide.md#L1-L133]]"
  - id: document-the-change
    author: "google/gemini-3.8-flash"
    title: "用 /document 寫出可追溯的變更紀錄"
    purpose: "能用 `/document` 依 diff、spec、review 與測試寫出可追溯的變更紀錄。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/056 - Use Document SKILL for Data Model.en.txt#L1-L14]]"
      - "[[sources/js-mastery-engineer/20261107/course/056 - Use Document SKILL for Data Model.en.txt#L15-L27]]"
      - "[[sources/js-mastery-engineer/20261107/course/056 - Use Document SKILL for Data Model.en.txt#L28-L45]]"
      - "[[sources/js-mastery-engineer/20261107/course/056 - Use Document SKILL for Data Model.en.txt#L46-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L1-L10]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L11-L43]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L44-L52]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L53-L83]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L84-L98]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L99-L115]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L116-L128]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L129-L134]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L135-L143]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt#L144-L156]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/105 - Use Document SKILL for Data Model.txt#L1-L9]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/105 - Use Document SKILL for Data Model.txt#L10-L22]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/document/SKILL.md#L1-L121]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/document/agent-prompt.md#L1-L57]]"
created: 2026-11-07
updated: 2026-11-07
---

# 兩種證明與第二顆腦袋

## Lesson

證明有兩層：今天能不能用，以及下週會不會被改壞；前者靠 `check verify`，後者靠 `test`。之後還要換一顆沒寫過這段程式的腦袋來 review，最後用 `document` 把為什麼與風險留在磁碟上。

## Steps

1. [兩種證明：今天能用與以後不被改壞](two-kinds-of-proof/two-questions-two-skills.md)
2. [用 `/check verify` 逐條驗收功能](two-kinds-of-proof/run-check-verify.md)
3. [用 `/test` 把驗收成果變成回歸測試](two-kinds-of-proof/run-test.md)
4. [用 `/check review` 進行非作者模型審查](two-kinds-of-proof/run-check-review.md)
5. [用 /document 寫出可追溯的變更紀錄](two-kinds-of-proof/document-the-change.md)
