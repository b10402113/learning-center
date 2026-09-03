---
source: 03-creating-a-project-with-uv.md
source_hash: 4458de7e1862e5c2f3baf9e1497c0ed13c2d2bd1eb2c308ab0fa358704df7e92
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
---

# Digest — 03-creating-a-project-with-uv.md

## Overview (L1)

- `uv init` creates a new project with git repo, pyproject.toml, main.py, and Python version pinning
- Specifying Python version (>=3.14) is critical because system Python is often outdated (3.9 or older)
- pyproject.toml holds project metadata: name, version, description, Python version requirement, dependencies
- `.python-version` file enforces Python version across shells; IDEs like PyCharm may or may not respect it
- `.gitignore` is auto-generated to exclude .venv and other artifacts

## Sections (L2)

### Creating a Project with UV
- Locator: [[sources/pro-python/completed/20260903_03-creating-a-project-with-uv.md#creating-a-project-with-uv]]
- Summary: Demonstrates `uv init` to scaffold a Python project with proper version pinning
- Key claims: System Python is often very outdated; uv manages virtual environments and Python versions; pyproject.toml is the central project config
- Learner-relevant: Essential setup step before writing any code — ensures modern Python features are available

### Python Version Management
- Locator: [[sources/pro-python/completed/20260903_03-creating-a-project-with-uv.md#python-version-management]]
- Summary: .python-version file and uv enforce the correct Python version; IDE integration varies
- Key claims: uv sync creates the virtual environment; IDEs may not always respect .python-version automatically
- Learner-relevant: Avoids "works on my machine" issues by pinning Python version in the project
