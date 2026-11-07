---
source: sources/js-mastery-engineer/20261107/supplement/103 - Use Check-Verify command for Data Model.txt
source_type: text
source_lines: 24
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson runs the check verify command to verify the data model, which requires all necessary environment variables to be configured correctly.
- The absence of the .env.local file blocks commands such as pmmp db-migrate and pmmp db-seed.
- Supabase variables including the database URL and direct URL must be added to .env.local.
- Credentials are retrieved from the Supabase dashboard and configured in .env.local.
- A common developer mistake is mixing up the different URLs.
- Verification succeeded after configuration, with zero blockers or failures, and the next lesson covers the second part of the check skill.

# L2 detail

- `#L1-L9` — the goal of check verify and the environment variables it needs.
- `#L10-L24` — the missing .env.local, the required Supabase variables, the URL mix-up pitfall, and the successful zero-blocker result.
