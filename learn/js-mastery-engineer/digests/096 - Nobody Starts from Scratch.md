---
source: sources/js-mastery-engineer/20261107/supplement/096 - Nobody Starts from Scratch.txt
source_type: text
source_lines: 90
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Real professional work usually means joining a system that has run for years, designed by people who have left, with users depending on it: changing an existing system without breaking what works.
- Many people conclude AI cannot handle real software, but the actual problem is that the agent has no map: it reads what the code says, not why three versions of a service exist or why one strange line prevents a production failure.
- On a real codebase there are two risks: what the agent puts in (insecure code, an exposed secret, a weakened access rule, an unapproved decision) and what you give it (source, credentials, customer data and private logic leaving the organisation).
- That makes AI on a real codebase a business and security decision, not only a coding decision.
- /audit creates the map — architecture, conventions, commands, boundaries, and rules the agent cannot safely invent — and you give the agent the map plus only the small part the current task needs.
- /architect reads the existing implementation before deciding, /develop reads before writing and follows existing patterns, /check verify proves the change in the real app, and /check review gives the code to another model.
- The workflow controls how the agent works; your provider, account settings, policies and security requirements control what may leave the organisation.
- Two jobs in order: understand it with /audit, then change it safely with /architect, /develop and /check — the smallest correct change.

# L2 detail

- `#L1-L29` — the reality of inherited codebases and why the missing map, not the model, is the problem.
- `#L30-L67` — how the workflow supplies the map, boundaries, evidence and review while your settings govern what data leaves.
- `#L68-L90` — the two jobs in order: understand first, then touch.
