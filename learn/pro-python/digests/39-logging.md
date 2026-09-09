---
source: 39-logging.md
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 39-logging.md

## Overview (L1)

- Introduction to Python logging vs print statements for production code
- Standard library `logging` module with `basicConfig` for quick setup
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- FastAPI middleware for timing requests and emitting log lines
- Schema evolution: adding a Task model with Alembic migration

## Sections (L2)

### Python logging basics
- Locator: [[sources/pro-python/completed/20260903_39-logging.md#python-logging-basics]]
- Summary: `logging.basicConfig(level=logging.INFO)` is the minimal setup for Python logging. It sends messages at INFO level and above to the console. Print statements are fine for scripts but not production — they can leak secrets and client data.
- Key claims: `import logging; logging.basicConfig(level=logging.INFO)` is the one-line setup; print statements in production are a security risk; production CI/CD often has checks to block print statements; logging supports structured output.
- Learner-relevant: Logging is the professional alternative to print debugging — it's configurable, filterable, and safe for production.

### Log levels
- Locator: [[sources/pro-python/completed/20260903_39-logging.md#log-levels]]
- Summary: Python logging has five levels: DEBUG (detailed), INFO (confirmation), WARNING (unexpected but handled), ERROR (serious problem), CRITICAL (program may not continue). Setting a level shows that level and above.
- Key claims: DEBUG is for development details; INFO confirms normal operation; WARNING flags unexpected conditions; ERROR indicates failures; CRITICAL means the app may stop; the level filter means setting INFO shows INFO, WARNING, ERROR, and CRITICAL.
- Learner-relevant: Choosing the right log level ensures you see what matters without noise — DEBUG in development, INFO or WARNING in production.

### FastAPI middleware for logging
- Locator: [[sources/pro-python/completed/20260903_39-logging.md#fastapi-middleware-for-logging]]
- Summary: Middleware wraps every request and can be used to time requests and emit structured log lines, providing visibility into API performance.
- Key claims: Middleware executes before and after every request; it can measure request duration; structured logging with timestamps and module names enables production monitoring; middleware differs from exception handlers — middleware wraps all requests, exception handlers only catch errors.
- Learner-relevant: Request timing middleware is the foundation of production observability — it tells you how fast your API is and where bottlenecks are.

### Schema evolution with Alembic
- Locator: [[sources/pro-python/completed/20260903_39-logging.md#schema-evolution-with-alembic]]
- Summary: Adding a new Task model and running an Alembic migration to update the database schema without losing existing project data.
- Key claims: New models can be added alongside existing ones; Alembic detects the new table and generates a migration; `alembic upgrade head` applies the migration; existing data in other tables is preserved.
- Learner-relevant: Schema evolution is a normal part of application growth — Alembic makes it safe and reversible.
