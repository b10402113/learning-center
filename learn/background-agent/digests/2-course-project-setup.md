---
source: sources/background-agent/20261109/course/2-course-project-setup.txt
source_type: text
source_lines: 107
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Lesson checkout — switch to lesson one, npm install, and copy the .env example into your own .env.
- Database — use a free Neon Postgres connection string from neon.new (or local Postgres); no install or credit card needed.
- Model access — an OpenAI API key is required by default, though the AI SDK allows Claude or other models with small code changes.
- Schema and seed — run db:push to sync the schema, preflight to verify Node/schema/key, and db:seed to load starter data.
- Processes — start the agent endpoint, the web app, and the mock checkout service via package.json scripts.
- Branch workflow — code along on the observed branch; solutions live on the next lesson branch, and you may keep your own code.

# L2 detail

- `#L1-L6` — Checkout to lesson one, run npm install, and create a .env from the provided .env example.
- `#L7-L18` — Neon offers a free browser Postgres with a connection string valid for about 72 hours; local Postgres is also acceptable, with a note on Windows support.
- `#L19-L28` — An OpenAI API key is needed; the Claude API works too but requires changing the model name in the code, since the AI SDK is model-agnostic.
- `#L29-L41` — Create a secret key with a name, optional project, and expiration; fund the account minimally (roughly $2 is plenty) and GPT-4o is sufficient.
- `#L42-L44` — You can and should set your preferred model in the code; the instructor was using Llama in his notes.
- `#L45-L50` — Run npm run db:push to push the project schema to your database; expect no "no changes detected" message on a first push.
- `#L51-L59` — Run npm run preflight to verify Node.js, synced schema, and the OpenAI key; it exists to prevent setup failures during the course.
- `#L60-L64` — Run npm run db:seed to load starter data (it may wipe existing data, which is fine).
- `#L65-L73` — Three things to spin up: the agent endpoint (currently a near-empty API route), the web app, and the mock checkout service; all commands are in package.json.
- `#L74-L85` — npm run dev:agent starts the agent API with Inngest; npm run dev starts the web app and Inngest; npm run dev:checkout runs the mock service when needed.
- `#L86-L95` — The checkout service accepts a fault type, alert count, interval, and self-recover flag, enabling scenario testing later in the course.
- `#L96-L107` — Branch workflow: code on the current branch, solution on lesson two; you can continue your own code, check out the next branch, or have a coding agent apply the notes.
