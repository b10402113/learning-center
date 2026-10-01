---
source: scripts
source_type: codebase
source_lines: 601
language: javascript
file_count: 3
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — scripts

## Overview (L1)

- `npm run check` runs `scripts/check-portability.mjs`, a zero-dependency guard that keeps the skill suite cross-tool portable and lean: every `SKILL.md` must declare `allowed-tools`, no hardcoded Claude-only model aliases or tool names, no PowerShell-breaking shell glue, no em/en dashes or prose hyphens, matching OpenAI Codex adapters, and byte-identical shared contract blocks.
- It enforces two size disciplines: per-file byte budgets for skill bodies, support/prompt assets, and frontmatter descriptions, plus aggregate hot-path budgets that model what a real run loads into the main context (router + selected references + one role variant).
- `scripts/analyze-token-usage.mjs` reads a Claude Code session transcript (`.jsonl`) and explains where tokens went: it splits main-thread from subagent cost, breaks raw tokens into fresh input / cache-write / cache-read / output, and reports a billed-equivalent "cost-units" total.
- Together they close the loop: the analyzer shows which loads and turns actually cost money (output and fresh input dominate; cache reads are cheap), and the portability check turns those lessons into budgets that flag creep at 90% before a breach.
- `package.json` wires these as the repo's only scripts, so `npm run check` is also `npm test` — the guard is the test suite.

## Structure (L2)

### scripts/check-portability.mjs

- Locator: `[[sources/jsm-skills/20261001/scripts/check-portability.mjs#check]]`
- Purpose: Portability and convention guard for the skill suite; walks every `.md` under `skills/`, collects violations, and exits 1 on any (non-fatal warnings print too). Run as `node scripts/check-portability.mjs` or via `npm run check`.
- Key rules: Rule 1 `allowed-tools` on every `SKILL.md`; Rule 2 no hardcoded model alias as a spawn directive (use role words like "a fast, low-cost tier"); Rule 3 no naming the subagent tool in prose (capability-first); Rule 4 no non-portable shell glue (`>/dev/null`, `&& BASE=`, `|| BASE=`); Rule 5 per-file byte budgets (skill body 32 KB default, support `.md` 24 KB default, with grandfathered overrides for `architect/agent-prompt.md` and `architect/internal/design-conversation.md`); Rule 6 description under 400 chars; Rule 7 each skill ships `agents/openai.yaml` with `interface`/`display_name`/`short_description`/`default_prompt`; Rule 8 `allowed-tools` names `Agent` not legacy `Task`; Rule 9 marked contract blocks byte-identical across ≥2 skills; Rule 10 no em/en dash anywhere (including description); Rule 11 no hyphens in prose, with `PARSED_LITERALS` (`in-progress`, `gap-fill`, `whole-repo`, `Follow-up`, `pre-flight`) and ALL-CAPS/code/paths exempted by masking `proseOnly`.
- Budgets/limits: `WARN_AT = 0.9`; `SKILL_BYTE_BUDGET = 32 KB`; `SUPPORT_MD_BYTE_BUDGET = 24 KB`; `DESCRIPTION_CHAR_CAP = 400`; `HOT_PATH_BUDGETS` model aggregate reads per run (architect full-design 72 KB, architect subagent write 56 KB, scope plan 48 KB, scope replan/add 25 KB, develop UI 52 KB, audit 26 KB, test setup 26 KB, develop build 51 KB, develop UI full main-thread read 90 KB), each summing `required` files plus the largest of oneOf.
- Learner-relevant: A lesson on "budgets as ratchets, not high-water marks" — a ceiling fitted to the current size fires on every edit, so budgets are set roughly `WARN_AT` above real size and only raised with a stated reason; plus masking-based linting (blank out code/links so only prose is scanned) and the CI gotcha that `process.exitCode = 1` beats `process.exit()` for flushing piped output.

### scripts/analyze-token-usage.mjs

- Locator: `[[sources/jsm-skills/20261001/scripts/analyze-token-usage.mjs#resolveTranscript]]`
- Purpose: Read-only, zero-dependency analyzer for a Claude Code session transcript that answers "where did the tokens go"?; resolves the newest `.jsonl` for the project (or a given file / `--project`), separates main-thread from sidechain cost, and prints a billed-equivalent comparison.
- Key rules: Cost weights `W = { input: 1.0, cacheWrite: 1.25, cacheRead: 0.1, output: 5.0 }` turn raw tokens into one comparable "cost unit" (no dollar quotes). Inputs: positional `.jsonl`, `--top N` (default 12), `--project <encoded-dir-name>`; transcript location is `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl` with `/` encoded as `-`. Outputs: tokens by thread (fresh/cache-write/cache-read/output + raw + cost-units + turns), a READ ME on cache-read share vs output share of the bill, web search/fetch counts, spawned subagents, and the heaviest turns by output tokens. Dedupes streamed rows sharing a `requestId`/`uuid`.
- Learner-relevant: Teaches the token-economics reality that raw resident size overstates cost — cache reads are ~10% of fresh input — so the lever ranking follows cost-units and you cut output and fresh input first (fewer interview rounds, smaller hot-path resident files), which is exactly why the portability guard budgets what loads on each path.

### package.json

- Locator: `[[sources/jsm-skills/20261001/package.json#scripts]]`
- Purpose: Package manifest for `@jsmastery/skills` v2.0.0, an MIT-licensed, ESM (`"type": "module"`, Node ≥18) collection of Agent Skills distributed via `npx skills add JavaScript-Mastery-Pro/skills`.
- Key rules: `scripts`: `check` → `node scripts/check-portability.mjs`, `test` → `npm run check`, `tokens` → `node scripts/analyze-token-usage.mjs`; so `npm run check` is both the portability gate and the test suite, and there are no dependencies.
- Learner-relevant: Shows how a dependency-free skill repo is wired — quality is enforced by a single Node script run as check/test, documentation and rationale live in `docs/conventions.md`, and lean-skill guidance is checked mechanically rather than trusted to review.
