---
source: sources/claude-code-master/20261031/3-Volume B - Skills/2-Module B2 - Creating Good Skills/2-Module_B2_-_Creating_Good_Skills.en.vtt
source_type: text
source_lines: 340
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- When to create a skill — the rule of thumb: if you find yourself prompting Claude Code twice or more for the same thing, save it as a skill; skills are cheap to delete, refine, or forget.
- Many skills are an advantage — for power users, a large skill library is more help than harm; the goal is a teammate that learns how you work.
- The `/align` skill — born from a repeated "ask me clarifying questions" prompt; invocation is `/align <number>` and the agent asks that many questions, preferring multiple-choice answers for faster alignment.
- Anatomy of `/align` — its description ("ask short clarifying questions so direction is clear before effort is spent"), usage guidance, step-by-step process, and short layman-language preference.
- Creating a skill — describe it in-session and have Claude save it, or better, save an entire productive work session as a skill ("make a skill called deep research based on this session").
- Refinement loop — end a session by asking for the skill, and run `/align` on the skill-creation prompt so the resulting skill matches your preferences; the agent flags name collisions and asks about intake style and which styles to keep.
- Heuristic — re-run the process for sessions you expect to repeat tomorrow, or sessions where you felt most productive.

# L2 detail

- `#L1-L43` — Lesson scope: principles of creating skills, when to create them, how many is too much, and how to revise them over time. General principle: prompting twice or more means it should become a skill.
- `#L44-L109` — Why not be conservative: deleting, refining, or forgetting a skill is easy, and power users benefit from many skills. Example of a repeated prompt that asks the agent clarifying questions for alignment; the instructor typed it more than twice a day, so made a skill.
- `#L110-L160` — `/align` usage and upgrade: type `/align` plus a number for how many questions to ask; the skill was improved to offer multiple-choice answers when doable. Answering "question number + letter" is much faster to reach alignment before the agent does deep work.
- `#L161-L212` — Inside the align skill: description says to ask short clarifying questions so direction is clear before effort is spent; then usage guidance, a first-step process, and guidance to use short layman language per the author's preference. It is a recipe card followed on invocation. Creating such skills on agentic platforms is very easy.
- `#L213-L260` — Two creation paths: describe the skill yourself and have Claude Code save it; or, more effective and natural, treat a work session as the source — when a conversation is worth saving, turn it into a skill.
- `#L261-L300` — Deep research example: a session where you supplied specs of what you want and do not want, ending with "make a skill called deep research based on this session"; invoking `/align` on that prompt makes the skill as good as possible for your preferences.
- `#L301-L340` — Clarifying questions when building: the agent flags a name collision with an installed skill and asks about intake style and which styles to keep. Final advice: whenever working with Claude Code, note sessions you will need again tomorrow or that felt productive, and have Claude Code create the skill.
