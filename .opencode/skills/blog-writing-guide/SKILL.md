---
name: blog-writing-guide
description: Write and review the English original of a course step article: technical voice, opening, structure, skimmability, evidence, titles, and AI-writing tells. Use whenever a step original, technical blog post, engineering deep-dive, or tutorial draft is written or reviewed.
---

# Technical article writing

Write the original a senior engineer would forward to their team: specific, direct, and grounded in the facts the step already has.

## Voice

Sound like an engineer explaining the thing at a whiteboard, not like a documentation template. Be precise and opinionated where the facts support it. Humor is welcome when it carries content.

Use "you" for the reader. Use "we" only when the article actually describes a shared action.

## Opening

The first two or three sentences state the problem or the conclusion. Never open with background, definitions, or a preview of the article.

- Good: "A 10 µF capacitor is not 10 µF at 100 MHz. Above its self-resonant frequency it behaves like an inductor, and the PDN starts to look worse the more capacitance you add."
- Bad: "In this article, we will explore the concept of impedance and why it matters."

## Structure

Follow the reader's questions, and follow the teaching plan's outline rather than inventing a new one:

1. What problem does this solve?
2. How does it actually work? This is the bulk.
3. What are the trade-offs or alternatives?
4. What does the reader do with it now?

For an Explanation, step 4 is applying the model to a case. For a Tutorial, it is the next checkable action. For a How-to, it is the expected result.

## Skimmability

- Keep paragraphs to one to three sentences; start a new paragraph at the fourth.
- Break the paragraph where the argument turns: before a "but", "however", or a change of perspective.
- One idea per paragraph. Split a paragraph that covers two.
- No em dashes. Use commas, periods, or a line break.
- Every section heading states something: "Why real capacitors turn inductive above resonance", not "Background".

## Evidence

- Numbers over adjectives. "p99 dropped from 340 ms to 45 ms", not "significantly faster".
- Define a term in full the first time it appears, then reuse the same wording.
- Copy code verbatim inside a fenced block, with `<!-- source: sources/<subject>/<file>.txt#Lx-Ly -->` on the line above the fence; write `<!-- derived -->` for code you assembled yourself.
- Keep the examples and names the teaching plan assigns. Do not introduce a new scenario.
- State limitations and failure modes instead of smoothing them over.

## Banned language

Never use: "we're excited to announce", "best-in-class", "industry-leading", "cutting-edge", "seamless", "empower", "leverage", "unlock", "robust", "streamline", "at the end of the day", "it's worth noting that", "without further ado", "as you might know", "in this article we will explore".

## AI-writing tells

- Staccato fragments: "No errors. No warnings. Everything green." → "There were no errors, no warnings, everything looked fine."
- Bumper-sticker aphorisms: "You can't fix what you can't see." → "Without visibility into the whole request, you're guessing."
- Three-beat reveals: "Not config. Not code. The deploy was stale." → "It wasn't config or code. The deploy was stale."
- Smug simplicity after code: cut "That's it. That's all you need." and explain what the code does.
- Parallel ad copy: "Metrics tell you what's broken. Traces tell you why." → "Metrics show what's broken, but traces are where you find out why."

## Title

The title makes a specific claim or promises a specific payoff. "Your JavaScript bundle has 47% dead code" beats "Improving bundle size". Keep the dispatch's title exactly when one is given; otherwise choose a specific title from the material and write it as the H1.

## Closing

End with something concrete: the result the reader should now see, the next action, or the trade-off they should watch. Never recap the article, never end on hype.

## Language

Write in the output language the dispatch names. The default is the subject's language, so a Chinese subject gets a Chinese original written directly, not an English draft translated afterwards. Do not translate the article yourself.

For Traditional Chinese, keep the same rules: one idea per paragraph, a line break at each turn, short sentences, concrete numbers. Drop stock phrases like 「綜上所述」「不僅如此」「在當今快速變化的時代」 and English-shaped clauses such as 「這是一個可以被用來…的…」.

## Completion

The original is done when:

- every outline section from the teaching plan has a corresponding section in the article
- every claim traces to a fact the teaching plan cites, and every number and quotation has a source
- the opening states the problem or conclusion, and the closing gives the reader a concrete next step
- headings carry information, paragraphs stay at one to three sentences, and no banned phrase appears
- the body is only the article: no source list, no image markers or image lines, no quiz, no closing boilerplate
