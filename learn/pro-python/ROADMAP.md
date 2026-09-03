---
subject: pro-python
status: draft
path: practice-first
created: 2026-09-03
---

# ROADMAP — pro-python

## Goal
Get hired as a Python developer — master modern Python idioms (type hints, dataclasses, async, FastAPI) so I can pass interviews and contribute on day one.

## Learning path
**Practice-first**: Start building immediately, learn concepts as you need them.

**Angle**: Get something running fast, then layer on complexity. You'll have a working API in the first session, then add validation, persistence, and production patterns incrementally.

**Structure**:
- Tier 1: Get something running (setup, first app)
- Tier 2: Make it correct (type hints, validation, testing)
- Tier 3: Make it real (Docker, database, CRUD)
- Tier 4: Make it production (dependencies, logging, auth, deployment)
- Tier 5: Ship it (Dockerfile, secrets, CI/CD)
- Tier 6: Fill gaps (fundamentals deep-dive)

**Optimizes for**: Fast feedback and visible progress. You see something working before you understand why.

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node's mastery, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — Get Something Running
1. **[[learn/pro-python/nodes/01-course-overview|Course overview and tooling setup]]**
   - Goal: Understand what we're building and install UV, VS Code, Docker
   - Sources:
     - [[sources/pro-python/completed/20260903_01.md]]
     - [[sources/pro-python/completed/20260903_02-why-python.md]]
     - [[sources/pro-python/completed/20260903_04-tools-setup.md]]

2. **[[learn/pro-python/nodes/02-project-setup|Project setup with UV]]**
   - Goal: Initialize a UV project, understand pyproject.toml and .python-version
   - Sources:
     - [[sources/pro-python/completed/20260903_03-creating-a-project-with-uv.md]]
     - [[sources/pro-python/python-for-pros/pyproject.toml]]

3. **[[learn/pro-python/nodes/03-first-fastapi|First FastAPI app]]**
   - Goal: Write a route, run the dev server, see JSON in the browser
   - Sources:
     - [[sources/pro-python/completed/20260903_23-fastapi.md]]
     - [[sources/pro-python/completed/20260903_24-fastapi.md]]

### Tier 2 — Make It Correct
4. **[[learn/pro-python/nodes/04-type-hints-functions|Type hints for functions]]**
   - Goal: Annotate parameters and return types, understand that hints don't validate
   - Sources:
     - [[sources/pro-python/completed/20260903_09-type-hints.md]]

5. **[[learn/pro-python/nodes/05-type-hints-variables|Type hints for variables and generics]]**
   - Goal: Annotate variables, use list/dict/tuple generics, union operator
   - Sources:
     - [[sources/pro-python/completed/20260903_09-type-hints.md]]
     - [[sources/pro-python/completed/20260903_06-types.md]]

6. **[[learn/pro-python/nodes/06-pydantic-models|Pydantic models for validation]]**
   - Goal: Define BaseModel subclasses for request/response validation
   - Sources:
     - [[sources/pro-python/completed/20260903_24-fastapi.md]]
     - [[sources/pro-python/completed/20260903_22.md]]

7. **[[learn/pro-python/nodes/07-pytest-basics|pytest — discovery and first test]]**
   - Goal: Set up pytest, write a test for slugify, run with `uv run pytest`
   - Sources:
     - [[sources/pro-python/completed/20260903_21.md]]

8. **[[learn/pro-python/nodes/08-testclient|Testing API endpoints with TestClient]]**
   - Goal: Use FastAPI's TestClient to test routes, assert status codes and responses
   - Sources:
     - [[sources/pro-python/completed/20260903_25.md]]
     - [[sources/pro-python/completed/20260903_26.md]]

### Tier 3 — Make It Real
9. **[[learn/pro-python/nodes/09-docker-postgres|Docker Postgres setup]]**
   - Goal: Run Postgres in Docker, configure compose.yaml with volumes and healthchecks
   - Sources:
     - [[sources/pro-python/completed/20260903_27-datalayer.md]]

10. **[[learn/pro-python/nodes/10-sqlmodel-models|SQLModel — defining models]]**
    - Goal: Define table models that combine Pydantic validation with SQLAlchemy ORM
    - Sources:
      - [[sources/pro-python/completed/20260903_28.md]]
      - [[sources/pro-python/completed/20260903_27-datalayer.md]]

11. **[[learn/pro-python/nodes/11-alembic-migration|Alembic — initial migration]]**
    - Goal: Set up Alembic, generate and apply the first migration
    - Sources:
      - [[sources/pro-python/completed/20260903_29.md]]
      - [[sources/pro-python/completed/20260903_27-datalayer.md]]

12. **[[learn/pro-python/nodes/12-read-endpoints|Database-backed read endpoints]]**
    - Goal: Query the database with session.get(), return data from Postgres
    - Sources:
      - [[sources/pro-python/completed/20260903_31.md]]
      - [[sources/pro-python/completed/20260903_30.md]]

13. **[[learn/pro-python/nodes/13-write-endpoints|Write endpoints and slug generation]]**
    - Goal: Implement POST/PUT/DELETE, generate slugs, handle soft vs hard delete
    - Sources:
      - [[sources/pro-python/completed/20260903_32.md]]
      - [[sources/pro-python/completed/20260903_31.md]]

14. **[[learn/pro-python/nodes/14-crud-refactor|CRUD refactoring]]**
    - Goal: Extract database operations into a crud.py module, separate concerns
    - Sources:
      - [[sources/pro-python/completed/20260903_33.md]]
      - [[sources/pro-python/completed/20260903_35.md]]
      - [[sources/pro-python/completed/20260903_36.md]]

### Tier 4 — Make It Production
15. **[[learn/pro-python/nodes/15-dependency-injection|Dependency injection with Annotated]]**
    - Goal: Use Depends() and Annotated to inject database sessions
    - Sources:
      - [[sources/pro-python/completed/20260903_34-dependency-injection-with-annotated.md]]
      - [[sources/pro-python/completed/20260903_31.md]]

16. **[[learn/pro-python/nodes/16-dry-dependencies|DRY dependencies with ProjectDep]]**
    - Goal: Extract the lookup-or-404 pattern into a reusable dependency
    - Sources:
      - [[sources/pro-python/completed/20260903_34-dependency-injection-with-annotated.md]]
      - [[sources/pro-python/completed/20260903_35.md]]

17. **[[learn/pro-python/nodes/17-exception-handling|Centralized exception handling]]**
    - Goal: Catch IntegrityError globally, return 409 Conflict
    - Sources:
      - [[sources/pro-python/completed/20260903_34-dependency-injection-with-annotated.md]]
      - [[sources/pro-python/completed/20260903_36.md]]
      - [[sources/pro-python/completed/20260903_15-error-handling.md]]

18. **[[learn/pro-python/nodes/18-apirouter|APIRouter refactoring]]**
    - Goal: Split routes into feature-based routers, use include_router
    - Sources:
      - [[sources/pro-python/completed/20260903_37.md]]
      - [[sources/pro-python/completed/20260903_38.md]]

19. **[[learn/pro-python/nodes/19-logging-basics|Python logging basics]]**
    - Goal: Replace print() with logging, configure log levels
    - Sources:
      - [[sources/pro-python/completed/20260903_39-logging.md]]

20. **[[learn/pro-python/nodes/20-structured-logging|Structured logging and middleware]]**
    - Goal: Add request timing middleware, configure structured JSON logging
    - Sources:
      - [[sources/pro-python/completed/20260903_39-logging.md]]
      - [[sources/pro-python/completed/20260903_40.md]]
      - [[sources/pro-python/completed/20260903_41.md]]

21. **[[learn/pro-python/nodes/21-password-hashing|Password hashing]]**
    - Goal: Hash passwords with Argon2id before storing, verify on login
    - Sources:
      - [[sources/pro-python/completed/20260903_49-Authentication.md]]
      - [[sources/pro-python/completed/20260903_50.md]]

22. **[[learn/pro-python/nodes/22-jwt-tokens|JWT tokens]]**
    - Goal: Understand JWT structure (header, payload, signature), generate and verify tokens
    - Sources:
      - [[sources/pro-python/completed/20260903_49-Authentication.md]]
      - [[sources/pro-python/completed/20260903_51.md]]
      - [[sources/pro-python/completed/20260903_52.md]]

23. **[[learn/pro-python/nodes/23-protecting-endpoints|Protecting endpoints]]**
    - Goal: Use OAuth2PasswordBearer and get_current_user dependency
    - Sources:
      - [[sources/pro-python/completed/20260903_49-Authentication.md]]
      - [[sources/pro-python/completed/20260903_53.md]]
      - [[sources/pro-python/completed/20260903_54.md]]

24. **[[learn/pro-python/nodes/24-task-api|Task API and relational queries]]**
    - Goal: Build task endpoints, use join/selectinload for relational queries
    - Sources:
      - [[sources/pro-python/completed/20260903_44-task.md]]
      - [[sources/pro-python/completed/20260903_45.md]]
      - [[sources/pro-python/completed/20260903_46.md]]

25. **[[learn/pro-python/nodes/25-db-fixtures|Database fixtures with pytest]]**
    - Goal: Set up pytest fixtures for database testing, use SQLite for tests
    - Sources:
      - [[sources/pro-python/completed/20260903_47.md]]
      - [[sources/pro-python/completed/20260903_48.md]]

### Tier 5 — Ship It
26. **[[learn/pro-python/nodes/26-dockerfile|Dockerizing the app]]**
    - Goal: Write a Dockerfile with python:3.14-slim, build and run the container
    - Sources:
      - [[sources/pro-python/completed/20260903_55.md]]
      - [[sources/pro-python/completed/20260903_56.md]]

27. **[[learn/pro-python/nodes/27-secrets|Managing secrets and .env]]**
    - Goal: Use .env for development, understand production secret management
    - Sources:
      - [[sources/pro-python/completed/20260903_57.md]]

28. **[[learn/pro-python/nodes/28-github-actions|GitHub Actions CI]]**
    - Goal: Set up CI to run Ruff, MyPy, pytest, and coverage on every push
    - Sources:
      - [[sources/pro-python/completed/20260903_55.md]]
      - [[sources/pro-python/completed/20260903_58.md]]
      - [[sources/pro-python/completed/20260903_59.md]]

### Tier 6 — Fill Gaps (Fundamentals)
29. **[[learn/pro-python/nodes/29-variables-types|Variables, types, and naming]]**
    - Goal: Understand Python's dynamic typing, variable naming, and None
    - Sources:
      - [[sources/pro-python/completed/20260903_05-variables.md]]
      - [[sources/pro-python/completed/20260903_06-types.md]]

30. **[[learn/pro-python/nodes/30-enums|Enums and the standard library]]**
    - Goal: Use StrEnum for fixed sets of values, auto() for avoiding duplication
    - Sources:
      - [[sources/pro-python/completed/20260903_07-enums.md]]

31. **[[learn/pro-python/nodes/31-functions-conditionals|Functions and conditionals]]**
    - Goal: Define functions with default parameters and keyword-only args, use if/elif/else
    - Sources:
      - [[sources/pro-python/completed/20260903_08-functions.md]]
      - [[sources/pro-python/completed/20260903_10-boolean.md]]

32. **[[learn/pro-python/nodes/32-dataclasses|Dataclasses vs full classes]]**
    - Goal: Use @dataclass for simple containers, __post_init__ for validation, frozen=True
    - Sources:
      - [[sources/pro-python/completed/20260903_11-classes.md]]

33. **[[learn/pro-python/nodes/33-collections-loops|Collections, loops, and comprehensions]]**
    - Goal: Work with tuples, dicts, sets, for loops, list/dict/set comprehensions
    - Sources:
      - [[sources/pro-python/completed/20260903_13-tuples.md]]
      - [[sources/pro-python/completed/20260903_14-looping-through-collections.md]]
      - [[sources/pro-python/completed/20260903_16.md]]
      - [[sources/pro-python/completed/20260903_17.md]]
      - [[sources/pro-python/completed/20260903_18.md]]
      - [[sources/pro-python/completed/20260903_19.md]]
      - [[sources/pro-python/completed/20260903_20.md]]

34. **[[learn/pro-python/nodes/34-error-handling|Error handling and context managers]]**
    - Goal: Raise and catch exceptions properly, use custom exceptions, understand with statements
    - Sources:
      - [[sources/pro-python/completed/20260903_15-error-handling.md]]

## Status
- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
