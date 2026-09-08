---
source: 27-datalayer.md
source_hash: 14ba76b3a2b48467702b043cebecb0736ace746b4927013517cc180431593048
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 27-datalayer.md

## Overview (L1)

- Problem: app has amnesia — data disappears on restart, no persistence
- Connecting FastAPI to a real PostgreSQL database using Docker
- Introduction to SQLModel ORM by the same author as FastAPI
- Defining data schemas as blueprints for both database and Pydantic validation
- Setting up Alembic for database migrations
- Creating a seed script to populate the database with sample records

## Sections (L2)

### Why PostgreSQL and Docker
- Locator: [[sources/pro-python/completed/20260903_27-datalayer.md#why-postgresql-and-docker]]
- Summary: PostgreSQL is the industry standard for production web apps and works very well with Python. Running it in Docker avoids native installation difficulties and provides pinning, easy teardown, and per-project isolation.
- Key claims: Native Postgres installation on macOS is challenging; Docker containers give pinned versions, named data volumes, and one-command teardown; `docker-compose.yml` defines the Postgres service with port mapping and volume configuration.
- Learner-relevant: Docker-based databases are the professional standard for local development — no pollution of the host system.

### SQLModel ORM
- Locator: [[sources/pro-python/completed/20260903_27-datalayer.md#sqlmodel-orm]]
- Summary: SQLModel is created by the same author as FastAPI, so they integrate seamlessly. It combines Pydantic validation with SQLAlchemy database capabilities in a single model definition.
- Key claims: SQLModel inherits from both Pydantic and SQLAlchemy; setting `table=True` tells SQLModel to create a database table; the same class serves as both validation schema and database model.
- Learner-relevant: SQLModel eliminates the ORM/Pydantic mismatch problem that plagued earlier FastAPI projects.

### Alembic Migrations
- Locator: [[sources/pro-python/completed/20260903_27-datalayer.md#alembic-migrations]]
- Summary: Alembic tracks and applies database schema migrations over time, enabling schema evolution as the project grows without losing existing data.
- Key claims: Alembic generates migration scripts from model definitions; `alembic revision --autogenerate` detects model changes; `alembic upgrade head` applies pending migrations; migrations are version-controlled and reversible.
- Learner-relevant: Migrations are essential for team development and production deployments — they let you evolve the database schema safely.

### Seed Data Script
- Locator: [[sources/pro-python/completed/20260903_27-datalayer.md#seed-data-script]]
- Summary: A script populates the new database with sample project records so the developer has something to see and test against immediately after setup.
- Key claims: Seed scripts insert initial data for development; they run after migrations to populate tables; sample data makes API testing tangible from the start.
- Learner-relevant: Seed data accelerates the feedback loop — you can immediately see your API working with real database records.
