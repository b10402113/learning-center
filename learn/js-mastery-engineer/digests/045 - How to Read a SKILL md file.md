---
source: sources/js-mastery-engineer/20261107/supplement/045 - How to Read a SKILL md file.txt
source_type: text
source_lines: 23
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Skills are procedures stored in files, similar to a README.
- A skill consists of a `SKILL.md` plus potentially other files such as forms and scripts.
- The description in `SKILL.md` is crucial because it determines when the skill is activated.
- A clear, precise description tells the agent when to use the skill; a poor one makes it fire on irrelevant tasks or miss the right ones.
- The layered architecture lets a skill hold multiple components, including scripts that run only when needed.
- Extra files provide deeper documentation or templates without impacting other tasks, so only what is necessary loads during execution.

# L2 detail

- `#L1-L6` — skill structure overview: procedure files like a README
- `#L7-L15` — the importance of the description as the activation trigger
- `#L16-L23` — layered architecture and loading only what is necessary
