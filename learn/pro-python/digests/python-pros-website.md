---
source: python-pros-website
source_hash: scraped-from-netlify
source_lines: 500
created: 2025-09-03
updated: 2025-09-03
---

# Digest — python-pros-website

## Overview (L1)

- Course website for "Python for Professional Developers" by Nina Zakharenko (Master.dev)
- Companion to the transcript source files — structured, edited content with code examples
- 13 chapters covering: Introduction, Fundamentals 1 & 2, Types/Testing, FastAPI Core, Data Layer, Release Tracker v1, Dependencies/Routing, Logging/Schema Evolution, Task API, Authentication, Deployment, Final Project
- Key tools: UV, Ruff, MyPy, pytest, FastAPI, SQLModel, Alembic, Docker, GitHub Actions
- Project: Release Tracker API — full-stack with Postgres, JWT auth, CI/CD

## Sections (L2)

### Chapter 00 — Introduction
- Locator: [[https://python-pros.netlify.app/chapters/00-intro/]]
- Summary: Course overview, why Python (web/data/AI/infra), UV project setup, VS Code configuration, environment validation
- Key claims: Python dominates web (FastAPI/Django/Flask), data science (pandas/numpy), AI (PyTorch/HuggingFace), and infrastructure/automation; LLMs generate outdated Python — learn to critique AI output
- Learner-relevant: Python's breadth means the skills transfer across domains; AI coding requires foundation to validate output

### Chapter 01 — Python Fundamentals Part 1
- Locator: [[https://python-pros.netlify.app/chapters/01-python-fundamentals-1/]]
- Summary: Variables, data types, enums, functions, conditionals, classes/objects
- Key claims: Enums solve typo/state-mismatch bugs; dataclasses vs full classes; functions should return values not print
- Learner-relevant: Foundation — every later chapter builds on these types and patterns

### Chapter 02 — Python Fundamentals Part 2
- Locator: [[https://python-pros.netlify.app/chapters/02-python-fundamentals-2/]]
- Summary: Collections, loops, comprehensions, exceptions, context managers, decorators
- Key claims: Comprehensions over manual loops; catch specific exceptions; context managers for resource cleanup; decorators wrap behavior without modifying the original function
- Learner-relevant: Comprehensions and decorators appear constantly in FastAPI and library code

### Chapter 03 — Types, Pydantic & Testing
- Locator: [[https://python-pros.netlify.app/chapters/03-types-and-testing/]]
- Summary: Type hints (annotations, generics, unions), static type checking (mypy), Pydantic validation, pytest basics
- Key claims: Type hints are for tooling not runtime; built-in generics (list[str]) preferred over typing imports; Pydantic validates at runtime; mypy catches type errors statically
- Learner-relevant: Type hints are the bridge between Python's dynamic nature and production reliability; FastAPI depends on them

### Chapter 04 — FastAPI Core
- Locator: [[https://python-pros.netlify.app/chapters/04-fastapi-core/]]
- Summary: FastAPI basics, async vs sync, routes/parameters, JSON responses, OpenAPI docs, testing with TestClient
- Key claims: FastAPI > Flask in popularity; built on Starlette + Pydantic; automatic Swagger UI/ReDoc; type hints drive validation and docs
- Learner-relevant: FastAPI is the framework the course builds on — understanding its type-driven design is essential

### Chapter 05 — Data Layer Foundations
- Locator: [[https://python-pros.netlify.app/chapters/05-data-layer/]]
- Summary: Docker Postgres setup, SQLModel basics, defining Project model, Alembic migrations
- Key claims: Docker avoids Postgres installation headaches; SQLModel combines SQLAlchemy + Pydantic; Alembic tracks schema changes; alpine images for minimal footprint
- Learner-relevant: Database layer is the backbone of the Release Tracker — SQLModel's dual nature (ORM + validation) is a key pattern

### Chapter 06 — Build Release Tracker v1
- Locator: [[https://python-pros.netlify.app/chapters/06-release-tracker-v1/]]
- Summary: DB-backed read endpoints, VS Code debugging, write endpoints, CRUD refactoring
- Key claims: session.get() for reads; session.add()/commit() for writes; slug generation; soft vs hard delete; CRUD module separation
- Learner-relevant: First real CRUD operations — the pattern repeats in every FastAPI project

### Chapter 07 — Dependencies, Exceptions & Routing
- Locator: [[https://python-pros.netlify.app/chapters/07-middleware-and-routing/]]
- Summary: Annotated dependencies, ProjectDep (DRY lookups), centralized exception handling, APIRouter refactoring
- Key claims: Depends() + Annotated creates reusable dependencies; exception_handler() centralizes error logic; APIRouter splits routes by feature
- Learner-relevant: Dependency injection is FastAPI's superpower — understanding it unlocks clean, DRY code

### Chapter 08 — Logging, Middleware & Schema Evolution
- Locator: [[https://python-pros.netlify.app/chapters/08-database-evolution/]]
- Summary: Python logging basics, structured logging config, FastAPI middleware, adding Task model, Alembic schema evolution
- Key claims: print() ≠ logging; log levels (DEBUG/INFO/WARNING/ERROR); middleware wraps every request; Alembic handles schema changes without data loss
- Learner-relevant: Logging and middleware are production necessities; schema evolution is how real apps grow

### Chapter 09 — Task API & Querying Features
- Locator: [[https://python-pros.netlify.app/chapters/09-task-api/]]
- Summary: Task endpoints, relational queries with join/selectinload, pytest database fixtures
- Key claims: SQLAlchemy query patterns (where, join, selectinload); SQLite vs Postgres for tests; pytest fixtures for DB setup/teardown
- Learner-relevant: Relational queries are where ORM power shows — understanding joins and lazy loading prevents N+1 problems

### Chapter 10 — Authentication
- Locator: [[https://python-pros.netlify.app/chapters/10-authentication/]]
- Summary: Auth intro, password hashing (Argon2id), JWT tokens, protecting endpoints with get_current_user
- Key claims: Auth ≠ authorization; hash before storing; JWT encodes user ID + expiry; OAuth2PasswordBearer + Depends for protected routes
- Learner-relevant: Authentication is a must-know for any API — the pattern (hash → sign → verify) is universal

### Chapter 11 — Deployment Best Practices
- Locator: [[https://python-pros.netlify.app/chapters/11-deployment/]]
- Summary: Quality checks (Ruff/MyPy/pytest/coverage), Dockerizing FastAPI, secrets management, GitHub Actions CI
- Key claims: Pin everything (Python, deps, base images, action versions); slim images for production; .env for dev, secret managers for prod; CI catches issues before main
- Learner-relevant: Deployment is where code meets reality — these practices separate hobby projects from production services

### Chapter 12 — Final Project & Wrap-up
- Locator: [[https://python-pros.netlify.app/chapters/12-final-project/]]
- Summary: Codebase walkthrough, connecting frontend, next steps (authorization, background tasks, observability, async, frontend)
- Key claims: Release Tracker demonstrates production patterns; extend with roles, background jobs, structlog/OpenTelemetry, async, real frontend
- Learner-relevant: The course project is a portfolio piece — extending it shows initiative and deeper understanding
