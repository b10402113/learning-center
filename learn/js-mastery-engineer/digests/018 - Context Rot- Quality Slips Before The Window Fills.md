---
source: sources/js-mastery-engineer/20261107/supplement/018 - Context Rot- Quality Slips Before The Window Fills.txt
source_type: text
source_lines: 79
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The context window starts behaving differently before it is full, and this has been measured across major models.
- A 2025 study of 18 frontier models found output quality dropped as more tokens went in, in every single model.
- Degradation does not wait for the window to nearly fill; a 200,000-token window can degrade measurably at 50,000 tokens.
- The advertised number is the technical ceiling, not the point where quality starts to slip.
- Positional degradation follows a U-shape: information at the very start or end is used well, buried middle content is used 20 to 30 points worse in controlled tests.
- Length degradation is separate from position: reasoning accuracy fell from 92% to 68% as input grew, and reworded facts dropped most models below half their short-context accuracy by around 32,000 tokens.
- The lesson therefore warns against both burying information in the middle and assuming more room means more reliability.

# L2 detail

- `#L1-L12` — Cliffhanger recap: the window behaves differently before it fills, and the effect has been measured repeatedly.
- `#L13-L26` — The 2025 18-model study, quality decline for every model, and early degradation at a quarter of the window.
- `#L27-L37` — Rule of thumb: context rot starts well before the window is full and is continuous rather than a cliff.
- `#L38-L50` — Positional degradation and the U-shape, including the 20 to 30 point penalty for middle-buried information.
- `#L51-L58` — Length degradation: accuracy falling from 92% to 68% and the 32,000-token result for reworded facts.
- `#L59-L69` — The dual warning about burial and volume, and a transition to the next, quieter problem.
- `#L70-L79` — Footnotes citing the Chroma context-rot study and Liu et al. on lost-in-the-middle.
