---
subject: pro-python
created: 2026-09-03
updated: 2026-09-03
---

# Mastery — pro-python

## 03-first-fastapi

probe skipped via /nodes pro-python/03-first-fastapi skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| FastAPI positioning and framework comparison | unknown |
| Route definition and dev server | unknown |
| Path parameters and type validation | unknown |
| Pydantic response models | unknown |

## 06-pydantic-models

probe skipped via /nodes pro-python/06-pydantic-models skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| BaseModel definition with typed fields | unknown |
| Runtime validation and ValidationError | unknown |
| Response models in FastAPI | unknown |
| Testing Pydantic validation | unknown |

## 05-type-hints-variables

probe skipped via /nodes pro-python/05-type-hints-variables skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Variable type annotation syntax | unknown |
| Generic collection types (list/dict/tuple) | unknown |
| Union operator and Optional | unknown |
| Type hints not enforced at runtime | unknown |

## 04-type-hints-functions

probe skipped via /nodes pro-python/04-type-hints-functions skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Type hint syntax for parameters and return types | unknown |
| Runtime behavior — hints don't validate | unknown |
| Keyword-only arguments via `*` separator | unknown |

## 07-pytest-basics

probe skipped via /nodes pro-python/07-pytest-basics skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Installing pytest as a dev dependency | unknown |
| Pytest auto-discovery convention | unknown |
| Writing assertion-based tests | unknown |
| Running pytest via uv | unknown |

## 08-testclient

probe skipped via /nodes pro-python/08-testclient skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Setting up pytest and TestClient | unknown |
| Asserting status codes and response body | unknown |
| Testing error responses (404 via HTTPException) | unknown |
| Evolving tests alongside API changes | unknown |

## 09-docker-postgres

probe skipped via /nodes pro-python/09-docker-postgres skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Docker benefits for local database development | unknown |
| compose.yaml configuration (volumes, healthchecks, ports, env vars) | unknown |
| Running and verifying the Postgres container | unknown |
| SQLModel as ORM for FastAPI + Postgres | unknown |

## 11-alembic-migration

probe skipped via /nodes pro-python/11-alembic-migration skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Alembic installation and project initialization | unknown |
| Configuring env.py and script.py.mako for SQLModel | unknown |
| Migration revision structure (upgrade/downgrade) | unknown |
| Generating and applying the first migration | unknown |
| Wiring SQLModel into the API | unknown |

## 13-write-endpoints

probe skipped via /nodes pro-python/13-write-endpoints skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Write endpoint implementation (POST/PATCH/DELETE) | unknown |
| Slug generation | unknown |
| Soft vs hard deletion | unknown |
| session.refresh() usage | unknown |
| CRUD operations | unknown |

## 10-sqlmodel-models

probe skipped via /nodes pro-python/10-sqlmodel-models skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| SQLModel table inheritance (table=True) | unknown |
| Field definitions with Annotated and StringConstraints | unknown |
| Database constraints (unique=True) vs app-level validation | unknown |
| Auto-generated fields (id, timestamps, slug) | unknown |
| Base/table split pattern for read/write schemas | unknown |

## 14-crud-refactor

probe skipped via /nodes pro-python/14-crud-refactor skip-probe on 2026-09-03

| Strand | Mastery |
| --- | --- |
| Separation of HTTP and database concerns | unknown |
| Extracting CRUD functions into crud.py | unknown |
| Transaction boundaries in CRUD layer | unknown |
| Verifying refactors with existing tests | unknown |
| Custom dependencies with Annotated | unknown |
| Global exception handling for IntegrityError | unknown |

## 15-dependency-injection

probe skipped via /nodes pro-python/15-dependency-injection skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Why dependency injection matters — manual session lifecycle, resource cleanup | unknown |
| How Depends() resolves and injects values before the route runs | unknown |
| Annotated[T, Depends(...)] syntax and type composition | unknown |
| Composing dependencies — session depth and dependency chains | unknown |

## 16-dry-dependencies

probe skipped via /nodes pro-python/16-dry-dependencies skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Identifying the lookup-or-404 boilerplate pattern | unknown |
| Building get_project_or_404 dependency function | unknown |
| Annotated type alias for dependency composition | unknown |
| Simplifying routes with ProjectDep | unknown |

## 18-apirouter

probe skipped via /nodes pro-python/18-apirouter skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| 單體 main.py 的成長痛與 APIRouter 定位 | unknown |
| 建立 routers 套件與移動端點 | unknown |
| 註冊路由器並驗證重構 | unknown |
| FastAPI 官方 Bigger Applications 參考 | unknown |

## 19-logging-basics

probe skipped via /nodes pro-python/19-logging-basics skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| print vs logging distinction in production | unknown |
| basicConfig setup and limitations | unknown |
| Logger hierarchy via getLogger(__name__) | unknown |
| Log levels and filtering behavior | unknown |
| Lazy formatting with %s vs f-strings | unknown |

## 17-exception-handling

probe skipped via /nodes pro-python/17-exception-handling skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| IntegrityError origin and default 500 behavior | unknown |
| FastAPI exception_handler decorator | unknown |
| HTTP 409 Conflict semantics vs 400/404 | unknown |
| Testing duplicate POST returns 409 | unknown |

## 20-structured-logging

probe skipped via /nodes pro-python/20-structured-logging skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Middleware basics and execution order | unknown |
| Request timing middleware implementation | unknown |
| Programmatic logging configuration | unknown |
| Environment-controlled log levels and .env | unknown |

## 23-protecting-endpoints

probe skipped via /nodes pro-python/23-protecting-endpoints skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| OAuth2PasswordBearer setup and token extraction | unknown |
| get_current_user dependency implementation | unknown |
| Protecting routes with dependency injection | unknown |
| Full auth flow integration and common errors | unknown |

## 24-task-api

probe skipped via /nodes pro-python/24-task-api skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Task router setup with imports and dependencies | unknown |
| CRUD method and endpoint mapping | unknown |
| SQL query patterns: where, join, selectinload | unknown |
| Conditional filter logic with keyword-only args | unknown |
| Database fixtures with in-memory SQLite | unknown |

## 21-password-hashing

probe skipped via /nodes pro-python/21-password-hashing skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Risks of storing plaintext passwords | unknown |
| How cryptographic hashing and salting work | unknown |
| Using pwdlib with Argon2id | unknown |
| Implementing hash on registration and verify on login | unknown |

## 25-db-fixtures

probe skipped via /nodes pro-python/25-db-fixtures skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Isolated test databases per test via fixtures | unknown |
| override_dependency to swap production session for test session | unknown |
| SQLite vs Postgres trade-offs (speed vs behavior differences) | unknown |
| Static pool pattern for connection reuse | unknown |
| Fixture chain to pre-populate sample data | unknown |
| Writing endpoint tests against fixture data | unknown |

## 22-jwt-tokens

probe skipped via /nodes pro-python/22-jwt-tokens skip-probe on 2026-09-04

| Strand | Mastery |
| --- | --- |
| Why JWT for identity in stateless HTTP | unknown |
| JWT structure (header, payload, signature) | unknown |
| Common claims (sub, exp) and encoded vs encrypted | unknown |
| Token generation and verification | unknown |
| Secret key security | unknown |