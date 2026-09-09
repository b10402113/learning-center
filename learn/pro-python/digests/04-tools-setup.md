---
source: 04-tools-setup.md
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 04-tools-setup.md

## Overview (L1)

- Tech check: verify Docker, Git, VS Code, UV, and Python 3.14 are installed
- Clone the course repo (`NNJA/python-4-pros`) via SSH or HTTPS
- `uv sync` creates the virtual environment so VS Code can detect the correct Python version
- VS Code extensions: Python, Pylance, Ruff, Docker, GitLens
- Ruff is configured via `ruff.toml` for code formatting
- Open VS Code from the terminal with `code .` so it picks up the .venv

## Sections (L2)

### Tool Verification
- Locator: [[sources/pro-python/completed/20260903_04-tools-setup.md#tool-verification]]
- Summary: Verify Docker, Git, VS Code, UV, and Python 3.14 are installed via CLI commands
- Key claims: If VS Code CLI is not found, use "Install code command in PATH" from VS Code; uv manages both Python and virtual environments
- Learner-relevant: Ensures all prerequisites are met before starting course exercises

### VS Code Setup
- Locator: [[sources/pro-python/completed/20260903_04-tools-setup.md#vs-code-setup]]
- Summary: Install required extensions, clone the repo, run `uv sync`, and open with `code .`
- Key claims: Extensions include Python, Pylance, Ruff, Docker, GitLens; Ruff handles auto-formatting; opening from terminal ensures .venv is detected
- Learner-relevant: Proper VS Code setup prevents common issues with Python interpreter selection and linting
