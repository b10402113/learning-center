---
source: 34-dependency-injection-with-annotated.md
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 34-dependency-injection-with-annotated.md

## Overview (L1)

- Deep dive into FastAPI's dependency system with `Annotated` syntax
- Understanding session depth and how dependencies compose
- DRY principle: extracting repeated "lookup or 404" pattern into `ProjectDep`
- Custom dependency `get_project_or_404` handles the repeated pattern
- Centralized exception handling for IntegrityError (unique constraint violations)

## Sections (L2)

### Dependency system with Annotated
- Locator: [[sources/pro-python/completed/20260903_34-dependency-injection-with-annotated.md#dependency-system-with-annotated]]
- Summary: FastAPI's dependency injection uses `Annotated` to compose dependencies — `session_dep` provides a database session, and custom dependencies can build on it. Dependencies are called in order, with each receiving the results of its own dependencies.
- Key claims: `Annotated[Session, Depends(get_session)]` creates a typed dependency; dependencies can depend on other dependencies (session depth); `Depends()` in the `Annotated` type tells FastAPI to resolve and inject the value automatically.
- Learner-relevant: Understanding dependency composition is key to building clean, testable FastAPI applications.

### Extracting the lookup-or-404 pattern
- Locator: [[sources/pro-python/completed/20260903_34-dependency-injection-with-annotated.md#extracting-lookup-or-404]]
- Summary: The repeated pattern of "get project by ID, raise 404 if not found" is extracted into a `get_project_or_404` dependency, creating `ProjectDep` as an `Annotated` type that handles the entire lookup.
- Key claims: `get_project_or_404(project_id: int, session: Session)` calls `crud.get_project()` and raises `HTTPException(404)` if None; `ProjectDep = Annotated[Project, Depends(get_project_or_404)]` is the reusable type; routes just declare `project: ProjectDep` and get a validated project.
- Learner-relevant: DRY dependencies eliminate boilerplate across routes — every route that needs a project gets the lookup and 404 handling for free.

### Centralized exception handling
- Locator: [[sources/pro-python/completed/20260903_34-dependency-injection-with-annotated.md#centralized-exception-handling]]
- Summary: SQLAlchemy `IntegrityError` (from unique constraint violations like duplicate project names) currently returns a 500 error. A centralized exception handler catches this and returns a meaningful 409 Conflict response.
- Key claims: `IntegrityError` is raised when unique constraints are violated; FastAPI's `@app.exception_handler(IntegrityError)` catches it globally; returning 409 Conflict is semantically correct for data conflicts; this avoids try/except blocks in every route.
- Learner-relevant: Global exception handlers keep route code clean and ensure consistent error responses across the entire API.
