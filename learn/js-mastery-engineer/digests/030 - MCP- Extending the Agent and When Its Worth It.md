---
source: sources/js-mastery-engineer/20261107/supplement/030 - MCP- Extending the Agent and When Its Worth It.txt
source_type: text
source_lines: 23
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson frames MCP (called Microservice Connection Protocol here) as the bridge connecting agents to external services such as databases outside the repo.
- It demonstrates connecting to a Prisma Postgres database from the terminal, then seeding it with realistic data and verifying the actions through MCP.
- MCP also lets you create projects and manage databases directly from the terminal, streamlining the workflow.
- It warns against over-using MCPs: connect one only when current data from an external source is genuinely needed.
- Every external connection adds dependencies and risk, so adoption should be cautious.

# L2 detail

- `#L1-L9` — lecture title and the framing of MCP's role in application development
- `#L10-L23` — key points: Prisma connection, seeding and verification, terminal-based management, and the warning against over-use
