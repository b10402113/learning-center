---
source: sources/js-mastery-engineer/20261107/course/036 - Demo- Running -audit.en.txt
source_type: text
source_lines: 147
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Explains the missing-context problem: once real code exists, nothing tells later skills the project's commands, stack, and conventions, so each run would re-discover or guess them.
- Introduces the `audit` skill, which writes the `AGENTS.md` file that every later skill and AI tool reads first, in plain language with technical terms explained.
- Shows audit entering "gap fill" mode on a project with an existing but nearly empty AGENTS.md, scanning the code and proposing only the missing sections.
- Details what the resulting AGENTS.md carries: stack, build approach, commands, rules, and a list of agent skills, with `CLAUDE.md` reduced to a pointer.
- Covers the optional coding pattern question (functional immutable recommended here) and other rules audit can add such as git account, type strictness, folder strategy, and linting.
- Emphasizes that audit absorbs decisions already made in the architecture spec and living scope, and reports conflicts rather than silently choosing a winner.
- Explains nested AGENTS.md files for distinct areas with lasting conventions, and why a single monolithic root file would be heavy and expensive to load.
- Notes the file is agent-agnostic (AGENTS.md vs CLAUDE.md, Cursor, Copilot) and that a long generic file can degrade agent performance, so audit keeps it short and evidence-based.

# L2 detail

- `#L1-L19` — States the missing-context problem and that the AGENTS.md is the one file read before anything else.
- `#L20-L35` — Introduces audit's job: write a shared instruction file; greenfield asks for standards, existing code triggers a scan.
- `#L36-L47` — Audit detects gap-fill mode, reports what the root AGENTS.md lacks, and confirms the additions before editing.
- `#L48-L63` — Shows the updated AGENTS.md contents (stack, build approach, commands, rules, skills) and the CLAUDE.md pointer.
- `#L64-L75` — Explains the coding-pattern question and selecting functional immutable, plus other rules audit can add.
- `#L76-L95` — Explains the deliberately short output, that audit absorbs existing decisions, and that reruns report differences in both files.
- `#L96-L119` — Guidance on when to rerun audit and how nested AGENTS.md files serve distinct areas without overloading the root.
- `#L120-L137` — Agent-agnostic instruction files, deduplication via AGENTS.md, and the risk of long generic files hiding real rules.
- `#L138-L147` — Recap of audit's call modes, and that develop, check, test, and sync all read the shared AGENTS.md.
