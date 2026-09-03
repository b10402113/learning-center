---
source: 49-Authentication.md
source_hash: 78cbc93d75191025a088317d06507f9e4c638fd93ddaf3b0bfd1ebcbecc81662
source_lines: 1
created: 2025-09-03
updated: 2025-09-03
---

# Digest — 49-Authentication.md

## Overview (L1)

- The API is currently wide open: anyone with the URL can create, modify, or delete data; authentication is needed.
- This chapter introduces password-based authentication: users sign up, log in, and receive a JWT token for authenticated requests.
- Covers password hashing (storing hashes, not plaintext), JWT structure (header, payload, signature), and protecting endpoints with `get_current_user` dependency.
- Brief overview only — deep authentication topics have dedicated Frontend Masters courses.

## Sections (L2)

### The Problem: Open API
- Locator: [[sources/pro-python/completed/20260903_49-Authentication.md#open-api-problem]]
- Summary: Explains that the current API is completely unprotected and needs authentication to prevent unauthorized access.
- Key claims: Anyone with the URL can create projects, change task status, or delete data; even intranet apps need logging and access control.
- Learner-relevant: Authentication is a fundamental requirement for any non-trivial API; understanding the problem motivates the solution.

### Authentication and Authorization Overview
- Locator: [[sources/pro-python/completed/20260903_49-Authentication.md#auth-overview]]
- Summary: Briefly distinguishes authentication (who are you?) from authorization (what can you do?) and notes this is a deep topic with dedicated courses.
- Key claims: This chapter provides an overview, not a deep dive; password-based auth with JWT is the approach covered.
- Learner-relevant: Knowing the boundary of this coverage helps learners know where to seek deeper knowledge.

### Chapter Roadmap
- Locator: [[sources/pro-python/completed/20260903_49-Authentication.md#chapter-roadmap]]
- Summary: Outlines the chapter's progression: password hashing, JWT tokens, protecting endpoints, and a registration exercise.
- Key claims: The chapter covers password hashing with a Python library, JWT generation and verification, endpoint protection via dependencies, and a registration endpoint exercise.
- Learner-relevant: The progression from hashing to tokens to endpoint protection builds authentication incrementally.
