---
source: python-for-pros
source_hash: 3c2d3ccd9166202bda55736998b710761d85cd7f8ab607f7af26a93a6a841dc7
source_lines: 78
created: 2025-09-03
updated: 2025-09-03
---

# Digest — python-for-pros

## Overview (L1)

- Starter project scaffold for "Python for Professional Developers" course from Master.dev
- Companion repo at master.dev/courses/pro-python/ with course notes at python-pros.netlify.app
- Project template: minimal main.py with UV, Python 3.14, Ruff linter configured
- Ruff config: line-length 80, lint selects E/F/I rules, excludes alembic/versions

## Sections (L2)

### Project Structure
- Locator: [[sources/pro-python/python-for-pros/README.md#project-structure]]
- Summary: Minimal scaffold — main.py with hello-world, pyproject.toml pinning Python >=3.14,<3.15, ruff.toml for linting
- Key claims: Python 3.14 pinned (not 3.15); UV used as package manager; Ruff configured for code quality
- Learner-relevant: This is the starting point — the course builds a full Release Tracker API from this scaffold

### Tool Configuration
- Locator: [[sources/pro-python/python-for-pros/ruff.toml#tool-config]]
- Summary: Ruff linter configured with line-length 80, E/F/I rule selection, alembic versions excluded
- Key claims: Ruff replaces flake8+isort+pycodestyle; modern Python teams use Ruff for linting
- Learner-relevant: Understanding this config is part of modern Python tooling literacy
