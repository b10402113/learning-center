---
source: sources/js-mastery-engineer/20261107/supplement/089 - The Method That Works on Any Code pdf.txt
source_type: text
source_lines: 149
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- A six-step debugging method that works in any language, on any codebase, held together by two habits: evidence over intuition and suspicion of your own mental model.
- Step 1: reproduce on command, getting a failure that triggers every time; if it is intermittent, make it predictable by finding the exact data, timing, ordering or concurrency.
- Step 2: localise the failure by binary-searching the code to the point where correct input becomes incorrect output, inspecting real values at every boundary.
- Step 3: form one falsifiable hypothesis that describes the cause, not the symptom.
- Step 4: test with the smallest possible experiment, removing failed experiments and writing the real fix only after confirmation.
- Step 5: fix the root cause and nothing else, with no refactoring mixed in.
- Step 6: verify with the original reproduction and surrounding tests, add a regression test that fails without the fix and passes with it, then check for sibling occurrences.
- git bisect applies the same halving idea to your commit history to find the first bad commit; /debug runs the six steps faster, but you need the method to judge whether it proved the cause or just hid the symptom.

# L2 detail

- `#L1-L31` — intro and step 1, reproduce on command, including the /loop vs /goal distinction.
- `#L32-L45` — step 2, localise by binary search and inspect real boundary values.
- `#L46-L57` — step 3, form one falsifiable hypothesis naming the cause.
- `#L58-L68` — step 4, test with the smallest experiment and drop failed ones.
- `#L69-L77` — step 5, fix the root cause only, no refactoring.
- `#L78-L93` — step 6, verify, add a regression test, and check for siblings.
- `#L94-L142` — git bisect for regressions, halving the commit range to the first bad commit.
- `#L143-L149` — why you still need the method when /debug exists.
