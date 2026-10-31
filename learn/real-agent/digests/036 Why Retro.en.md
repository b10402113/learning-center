---
source: sources/real-agent/20261030/Retro/036 Why Retro.en.srt
source_type: text
source_lines: 283
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Human review has a third purpose beyond speed and prioritization: improving the system that produced the code.
- The core rule is to never leave the same review comment twice; each comment should become a durable rule.
- The `retro` skill performs a retrospective on an agent session and proposes environment improvements.
- Retro inspects coding standards, global `AGENTS.md`, tool economy, automated checks, and navigation.
- It can review one session or the last 25, reading the raw transcripts harnesses store locally.
- Agents rarely complain about a bad setup, so regular retro runs surface waste that would otherwise stay invisible.

# L2 detail

- `#L1-L39` — Recaps the two prior lenses (speed, prioritization) and introduces the third: review should improve the system that created the code.
- `#L40-L100` — Frames every diff as a source of repeatable patterns; states the theory that the same comment should never be left twice.
- `#L101-L135` — Human review exists to improve automated review and checks; explains `cherry-pick` over `reset` to keep good PR work; installs the skill.
- `#L136-L175` — Defines retro as a retrospective on an agent session and lists improvement categories, starting with coding standards.
- `#L176-L208` — Details what retro inspects: `coding-standards.md`, global `AGENTS.md` pruning, tool economy, automated checks, navigation.
- `#L209-L243` — Scope options: one session or the last 25; explains that harnesses persist session files locally for retro to read.
- `#L244-L275` — Notes that agents suffer silently; reading raw sessions reveals how poor the environment is and where to improve it.
- `#L276-L283` — Closes with the invitation to try retro and transitions to the next lesson.
