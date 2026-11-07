---
source: sources/js-mastery-engineer/20261107/course/018 - What Context Engineering Means.en.txt
source_type: text
source_lines: 61
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Returns to module one's two root causes of AI coding failure — no real plan and no real context — and goes directly at the context half.
- Names the common trap of reaching for prompt engineering whenever output is bad, treating wording as the lever.
- Reframes it: a prompt lands on top of everything the agent already knows (files read, conversation so far, always-on setup), and that whole environment is the context.
- Argues quality depends far more on that environment than on the exact wording; a perfect prompt in an empty context still has to guess, while a rough prompt with the right file, convention, and constraint loaded can get it right first time.
- Defines context engineering as deliberately designing what the agent knows before it reads a prompt — what it always knows, what it reaches for when needed, and what it should never carry.
- Positions prompting as still important but the last and smallest step in the chain; the leverage lives upstream in the context.
- Previews the module: the different kinds of context, why always-on context must stay ruthlessly small, how the files load and the one mistake that loads nothing, and one lesson on structuring code because code is context too.

# L2 detail

- `#L1-L9` — Recaps the machine, the vocabulary from the last module, and returns to module one's two root causes: no real plan and no real context.
- `#L10-L17` — Describes the trap of always reaching for prompt engineering and the belief that phrasing is the lever, then signals the reframe.
- `#L18-L27` — Explains that a prompt lands on top of everything already loaded, that this environment is the context, and that the agent only knows what has been loaded.
- `#L28-L35` — Contrasts a perfect prompt in an empty context (must guess) with a rough prompt in a loaded context (gets it right first time), concluding the difference was the surroundings, not the prompt.
- `#L36-L45` — Defines context engineering as deliberate design of what gets loaded ahead of time, calls it systems architecture, and compares it to an architect setting up what is known before the first brick.
- `#L46-L51` — Says prompting still matters but is the last and smallest step, with leverage upstream in the context and the module teaching that.
- `#L52-L57` — Previews the module's lessons: kinds of context, keeping always-on context small, how files load and the mistake that silently loads nothing, and treating code structure as context.
- `#L58-L61` — Ties every earlier failure back to a context decision someone did not make on purpose, then moves to the three types of context.
