---
source: sources/claude-code-master/20261031/7-Volume F - Taste and Design/5-Module F5 - -tweak/5-Module_F5_-_-tweak.en.vtt
source_type: text
source_lines: 304
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- The tweaking problem — with a scaffold in hand, final client work means confirming the copy is exactly right and removing unneeded elements.
- Chat-only limitation — agentic platforms are chat-based, so people prompt every tiny visual change; this is token heavy and agents still do not know your visual taste.
- `/tweak` skill — adds a tweak panel on the right side of the page, requested with at least 15 sliders.
- Slider controls — drag to resize body text or labels and adjust the page to taste; complex builds can request more or more specific sliders.
- Inline edit mode — click edit, then change text directly on the page (e.g. prepend "FAQ" to a heading, change "honest metrics" to "honest pricing upfront").
- Remove tool — click remove, point at any element (e.g. FAQ questions six and four), and delete it from the page.
- Bake changes — click copy all to put a prompt on the clipboard, paste it into Claude, and the accumulated edits are applied to the final front-end design.
- When to use — best for final-stage visual taste work, replacing repeated prompt cycles with direct manipulation.

# L2 detail

- `#L1-L48` — The post-scaffold problem: real client delivery requires verifying the copy and trimming elements you do not need.
- `#L49-L99` — Why chat-based prompting for every small visual change is wasteful: token heavy, and the agent cannot infer visual taste; introduces the `/tweak` skill and the 15-slider request.
- `#L100-L155` — The slider panel in action: adjusting text and label sizes, and scaling the number or specificity of sliders for more complex builds.
- `#L156-L210` — Edit mode: changing text inline, including adding "FAQ" to a heading and replacing "honest metrics" with "honest pricing upfront".
- `#L211-L265` — The remove tool: pointing at elements such as FAQ questions six and four to delete them, then copy all to capture the changes as a prompt.
- `#L266-L304` — Baking the prompt back into Claude, verifying the larger text and new headline, and the rule that final-stage taste tweaks are better done in the panel than through repeated prompts.
