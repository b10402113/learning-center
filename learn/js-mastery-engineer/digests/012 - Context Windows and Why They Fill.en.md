---
source: sources/js-mastery-engineer/20261107/course/012 - Context Windows and Why They Fill.en.txt
source_type: text
source_lines: 45
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Defines the context window as a single container with a hard limit holding everything the agent read, everything typed, and everything it responded with.
- Notes some tools offer windows as large as a million tokens, yet they still fill faster than developers expect.
- Walks through the auth question again, itemizing what enters: the question, every search match with surrounding text, and whole files including unrelated imports and comments.
- Highlights that an irrelevant file opened by mistake stays in the window and is never refunded, while the useful answer is a tiny segment at the end.
- Concludes most of a window is the cost of finding the useful part, not the useful part itself.
- Scales the pattern to 30–40 exchanges for one feature and explains that exploration is expensive by nature, so even huge windows fill.
- Frames good structure as a budget saver and previews context rot once the window actually fills.

# L2 detail

- `#L1-L10` — The context window as a hard-limit container and why large windows still fill.
- `#L11-L24` — Line-by-line accounting of the auth question filling the window.
- `#L25-L34` — Most content is exploration cost; scaling to a real 30–40 exchange feature.
- `#L35-L45` — Why structure preserves budget and the preview of context rot.
