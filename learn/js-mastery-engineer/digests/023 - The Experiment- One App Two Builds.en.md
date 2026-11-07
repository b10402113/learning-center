---
source: sources/js-mastery-engineer/20261107/course/023 - The Experiment- One App Two Builds.en.txt
source_type: text
source_lines: 35
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Frames the course's central question: does careful engineering still matter when the AI writes the code, or is it old habits slowing you down?
- Describes the controlled experiment: one app, a movie recommendation platform called OneApp, importing Letterboxd ratings or swiping 20 movies to get a personalized feed plus a vibe search for queries like "a slow sci-fi movie for a rainy Sunday".
- Build 1 is pure vibe coding: describe what you want, the agent builds, then say "now add this"; no plan on disk, no written decisions, no tests, and it used the most powerful model available (Fable at recording time).
- Build 2 is the agentic engineering workflow: scope first, every load-bearing decision captured before code, the agent gated from inventing unapproved things, plus tests, migration, and the whole discipline.
- Notes the vibe build produced a working app that would impress in a demo; the real question is what happens at 100 or 5,000 users, or when reopening the code six weeks later.
- Both builds were profiled token by token, both repos are attached, and the viewer is invited to verify everything; the lessons will show one build falling apart in production conditions.
- Sets up watching the vibe build first, warning that how good it feels is exactly the problem.

# L2 detail

- `#L1-L8` — Poses the question of whether careful engineering still matters with AI-written code and introduces the experiment plus the movie recommendation app's features.
- `#L9-L15` — Establishes the controlled conditions (same day, developer, models) and describes build 1 as pure vibe coding with no plan, written decisions, or tests, using the most powerful model.
- `#L16-L20` — Describes build 2 as the agentic engineering workflow: scope first, decisions captured before code, the agent gated from inventing choices, tests, migrations, and discipline.
- `#L21-L26` — Concedes the vibe build produced a working, impressive app, then asks what happens at 100 and 5,000 users or when changing the code weeks later.
- `#L27-L35` — Previews watching both builds, reading both codebases like a senior reviewer, the token profiling, the attached repos, and the warning that the vibe build's good feeling is the problem.
