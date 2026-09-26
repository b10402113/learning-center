---
source: git
source_type: pdf
source_lines: 26
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

# Digest — git (vibe-coding prompt playbook: version control)

## Overview (L1)

- `git.txt` — a set of plain-language Chinese prompts a vibecoder pastes into Claude Code to check the environment, initialize a local git repo, commit, view history, roll back, and wire up the GitHub MCP server. Demonstrates prompt-driven version control without knowing git commands.

## Sections (L2)

### env-check

- Locator: `[[sources/vibe-coding-fengjianyingyue/20260926/git.txt#env-check]]`
- Summary: asks the agent to inspect whether git exists and whether the project can be versioned — "只帮我检查，不做其他操作" (check only, do nothing else).
- Key claims: safe exploration is prompted explicitly; the learner does not run the checks themselves.
- Learner-relevant: the "inspect-only" prompt pattern; separation of diagnosis from mutation.

### init-and-commit

- Locator: `[[sources/vibe-coding-fengjianyingyue/20260926/git.txt#init-and-commit]]`
- Summary: prompts to create a local repo and make the first archive; asks the agent to auto-summarize the commit message.
- Key claims: delegation of commit-message authorship to the agent; "存档" (archive) used as the learner's mental model for a commit.
- Learner-relevant: teaching through the learner's own vocabulary; first checkpoint pattern.

### history-and-rollback

- Locator: `[[sources/vibe-coding-fengjianyingyue/20260926/git.txt#history-and-rollback]]`
- Summary: "查看所有 git 存档记录" and "回退 git 版本到 edd05fc" — list history, then roll back to a specific hash.
- Key claims: the learner treats commits as restore points; a hash from `/git log` is reused verbatim in the next prompt.
- Learner-relevant: crash-recovery safety net for AI edits; when to roll back vs. fix forward.

### github-mcp

- Locator: `[[sources/vibe-coding-fengjianyingyue/20260926/git.txt#github-mcp]]`
- Summary: adds the GitHub MCP server to the agent (git-release URL plus a `claude mcp add-json` command with a bearer token), then tests by listing all repos and pushing a workspace project to a target repo.
- Key claims: MCP extends agent capability; install → restart → test is the loop; token-based auth via a JSON header.
- Learner-relevant: MCP server setup and verification; connecting an agent to remote services. Note the token is redacted in the transcript — never commit secrets.

## Sources

- [[sources/vibe-coding-fengjianyingyue/20260926/git.txt]]
