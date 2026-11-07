---
source: sources/js-mastery-engineer/20261107/course/022 - Build Your Own Skill.en.txt
source_type: text
source_lines: 131
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Builds a personal "teach-me" skill that asks a learner's level (beginner, medium, pro), explains at that level, asks for a topic when none is given, and verifies current facts on the internet instead of teaching something wrong.
- Installs Anthropic's official Skill Creator as a Claude Code plugin with `cloud-plugin-install skill-creator cloud-plugins-official`, then invokes it by describing the desired behavior in plain English.
- Notes that the description normally auto-triggers the right skill, but typing the skill name manually guarantees it fires; when Skill Creator generates the description, the creation prompt becomes the most important input.
- Shows the resulting skill installed as `teach` in the personal global Claude skills folder, and explains personal skills are for you across all projects while project skills travel with a repo for the whole team.
- Demonstrates the skill on database indexes: it asks the level, verifies on the web, and produces an explanation of indexes as sorted copies of columns, why the sorted word matters, common wrong mental models, mistakes, and next steps.
- Argues making a skill is easy (one conversation, minutes) but making one genuinely good takes iteration, testing, tightening the description, and reshaping instructions.
- Notes the nine workflow skills later installed have already been through research, tuning, and repeated fixes, and that you should build a skill only for a procedure you will repeat and want done the same way every time.
- Points to a case study of the same project built two different ways in the next lesson.

# L2 detail

- `#L1-L9` — Introduces the build and the teach-me skill's desired behavior: ask level, explain at that level, and verify current facts.
- `#L10-L17` — Introduces Anthropic's Skill Creator and the one-line Claude Code plugin install command.
- `#L18-L29` — Explains invoking Skill Creator in plain English, that the description normally auto-triggers it, and quotes its trigger description.
- `#L30-L35` — Gives the exact creation prompt: ask level, ask topic if none, and verify on the internet when unsure or out of date.
- `#L36-L47` — Explains that because Skill Creator writes the description, the creation prompt becomes the most important part; the skill then walks through decisions and asks questions.
- `#L48-L53` — Shows the skill installed as `teach` alongside other skills and matching their house style.
- `#L54-L63` — Reviews the resulting behaviors: ask topic openly when run bare, check level then verify, skip the level question when the user already stated one, and ask topic plus level in one round.
- `#L64-L79` — Explains install location: `teach` sits in the personal global skills folder because it is about how the developer learns, while team conventions belong in a project skills folder that travels with the repo.
- `#L80-L83` — Notes moving a skill to a project repo is just copying the folder and file.
- `#L84-L101` — Demos the teach skill on database indexes: asks level, checks the web, explains indexes as sorted copies of columns kept in sync, unpacks why "sorted" matters, corrects the hash-map mental model, and adds mistakes, proof, and next steps.
- `#L102-L113` — Argues making a skill is quick but making a good one requires iteration and testing whether the level question and teaching quality fire consistently.
- `#L114-L123` — Notes the nine workflow skills already went through research, tuning, and hundreds of description fixes; generating a skill is easy, making one you would stake a project on is hard.
- `#L124-L131` — Concludes you build a skill for a repeated procedure you want done the same way each time, and previews the two-build case study.
