---
name: quiz
description: Run a tier knowledge quiz that verifies what the learner has studied — the knowledge-verification variant of /grilling.
disable-model-invocation: true
argument-hint: "Which subject/tier should be quizzed? (e.g. /quiz agent-harness/1)"
---

Quiz the learner on one subject or tier. Invoke as `/quiz <subject>` (whole subject) or `/quiz <subject>/<tier>` (one tier). This is a knowledge-verification variant of `/grilling`: it keeps the one-question-at-a-time, back-and-forth, grade-per-question rhythm, but replaces design questions with verification of claims the learner has studied. It never writes a file — every quiz is generated fresh in-session and graded in-session.

This is separate from the `quiz` blocks embedded in step articles. Those are static questions rendered by course-app; this skill is a live conversation and writes nothing.

Run the whole quiz in the subject's `language` from `MEMORY.md`. Questions and explanations are learner-facing; the step labels below are the chrome.

1. **Resolve the scope.** Read `learn/<subject>/MEMORY.md` (for `language`) and `learn/<subject>/ROADMAP.md` (for the tier → node-id mapping). `/quiz <subject>` scopes the whole subject; `/quiz <subject>/<tier>` scopes the nodes in that tier. If the subject or tier does not exist, say so and stop.
2. **Plan the quiz yourself.** 不要向使用者詢問任何設定，自行決定並在開場一句話宣告：(a) 型態 — 選擇題 / 簡答題 / 混合，依範圍與內容選；(b) 題數 — 一個 tier 約 3–5 題，整個 subject 約 5–10 題，依可考的獨立概念數縮放；(c) 通過門檻 — 預設全對。決定後直接開始，不要等待確認。
3. **Read the scope.** Read each node's `goal` and `## Lesson`, every step article, the edges touching those nodes, and the digest L2 ranges behind the cited sources — per `docs/reference/source-reading.md`. Digest and articles only, never raw sources; use sub-agent pulls for a source slice the digest lacks.
4. **Generate one question at a time.** Present each as **Qn/N**, one question, then wait for the answer. Each question targets a claim, mechanism, or relationship the learner must have met: a step article's explanation, a node's goal or `## Lesson`, an edge's comparison, or a cited source range. Paraphrase rather than copy an article sentence verbatim. Every question carries its `[[sources/<subject>/<file>.txt#Lx-Ly]]` locator. For 選擇題, give four options with distractors drawn from the subject's real concepts — never invented words.

   ```
   **Q1/5** · 選擇題 · 概念：harness 的邊界
   下列哪一項屬於 harness，而不是 LLM？
   - A) 權重
   - B) memory 與 tool 權限
   - C) tokenizer
   - D) 注意力機制
   〔來源: [[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L12-L25]]〕
   ```

5. **Grade per question.** After each answer, grade immediately: correct or not, then a short explanation of why — the key claim, what a good answer includes, and where it lives in the source. On a wrong answer, offer 重試 (answer again after the explanation) or 重抽 (draw a fresh question on the same concept); if the learner declines both, count the question as failed and continue. A passed 重試 counts as passed; 重抽 resets the question.
6. **Threshold.** When the answered count reaches 題數, report the score (passed/total) and whether it meets the threshold set in step 2. The app has no unlock or progress state; nothing is recorded.
7. **On failure.** Summarize the concepts to review, each with its source locator, and offer a fresh quiz (same or different 型態 / 題數) or spot-retry of the failed questions.

Completion: every question was graded with an explanation, the score met or missed the threshold is stated, and no file was written.
