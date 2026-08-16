---
name: quiz
description: Run a tier boss-battle knowledge quiz that verifies what the learner has studied — the knowledge-verification variant of /grilling.
disable-model-invocation: true
argument-hint: "Which subject/tier should be quizzed? (e.g. /quiz ai-agents-in-action/1)"
---

Quiz the learner on one subject or tier. Invoke as `/quiz <subject>` (whole subject) or `/quiz <subject>/<tier>` (one tier). This is a knowledge-verification variant of `/grilling`: it keeps the one-question-at-a-time, back-and-forth, grade-per-question rhythm, but replaces the design tree with verification of claims the learner has studied. It never writes a file — every quiz is generated fresh in-session and graded in-session.

The quiz decides nothing in the app. The app only records an unlock that the learner presses by hand; this skill tells them when and which button to press after they pass. Correct answers never leave this conversation, so the static site stays answer-free.

Run the whole quiz in the subject's `language` from `MEMORY.md`. Questions and explanations are learner-facing; the step labels below are the chrome.

1. **Resolve the scope.** Read `learn/<subject>/MEMORY.md` (for `language`) and `learn/<subject>/ROADMAP.md` (for the tier → node-id mapping). `/quiz <subject>` scopes the whole subject; `/quiz <subject>/<tier>` scopes the nodes in that tier. If the subject or tier does not exist, say so and stop.
2. **Ask before quizzing.** One question at a time, wait for each answer: (a) 型態 — 選擇題 / 簡答題 / 混合; (b) 題數 — how many questions; (c) optional 通過門檻 — pass threshold, default 全對 (all correct). Do not generate questions before these are set. The learner can quiz any unlocked tier at any time; nothing here checks or records progress.
3. **Read the scope.** Read the tier's node articles (goal + Lesson), the full text of every element in their `elements:` arrays, the edges touching those nodes, and the digest L2 sections behind the referenced sources — per `docs/reference/source-reading.md`. Digest only, never raw sources; use sub-agent pulls for section detail the digest lacks.
4. **Generate one question at a time.** Present each as **Qn/N**, one question, then wait for the answer. Each question targets a claim, mechanism, or relationship the learner must have met: an element's Problem Statement / How it works / Practical use / Questions, a node's goal or a claim from its Lesson, or an edge / Connections comparison. Paraphrase rather than copy an element's `Questions` verbatim. Every question carries its `[[sources/<subject>/<file>#<section>]]` locator. For 選擇題, give four options with distractors drawn from the subject's real concepts — never invented words.

   ```
   **Q1/5** · 選擇題 · 概念：SPAL 循環
   下列哪個階段負責決定「下一步該做什麼」？
   - A) Sense
   - B) Plan
   - C) Act
   - D) Learn
   〔來源: [[sources/ai-agents-in-action/AI Agents in Action, Second Edi - Micheal Lanham.pdf#1.1.2]]〕
   ```

5. **Grade per question.** After each answer, grade immediately: correct or not, then a short explanation of why — the key claim, what a good answer includes, and where it lives in the source. On a wrong answer, offer 重試 (answer again after the explanation) or 重抽 (draw a fresh question on the same concept); if the learner declines both, count the question as failed and continue. A passed 重試 counts as passed; 重抽 resets the question.
6. **Threshold and unlock.** When the answered count reaches 題數, report the score (passed/total). Passed = score meets the threshold set in step 2. If passed, instruct the learner to unlock the tier in the app: press 「頭目戰 · 解鎖」 on the tier's floor, or 「頭目戰 · 解鎖此層」 in the node's DetailPane. The gate only appears once every node in the tier is charted — if it is not visible yet, the learner finishes charting the tier first, then presses it. Unlocking tier N records the boss as beaten and opens tier N+1. For a subject-wide quiz, tell the learner which tiers passed and to unlock each via its gate.
7. **On failure.** Summarize the concepts to review, each with its source locator, and offer a fresh quiz (same or different 型態 / 題數) or spot-retry of the failed questions.

Completion: every question was graded with an explanation, the score met or missed the threshold is stated, the unlock instruction is given on pass, and no file was written.
