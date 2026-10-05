---
source: loop-engineer
source_type: text
source_lines: 33675
part: 7
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 7)

## Overview (L1)

- Claude Code as an Agentic Execution Environment — Places the agent inside the repo, with full working surface (files, terminal, tests, VCS), which upgrades the job from code suggestion to agentic execution. The read-plan-act-verify loop is the mental model; behavior is shaped by surrounding files and services (CLAUDE.md, codebase map, settings, MCP, LSP). Treat it as a junior executor with strong tooling and limited authority.
- Guide Agent Behavior with Project Instructions — Project instructions turn a general coding agent into a repo-aware teammate by supplying durable, repository-specific guidance before work begins. Components include coding standards, repo map, tool policy, verification rules, memory boundaries, and escalation rules. Quality matters more than length; specific, executable rules beat vague directives like "follow best practices."
- Use Skills for Repeatable Procedures — Skills encode repeatable engineering procedures as packages with trigger conditions, an ordered procedure, required tools, and a validation checklist. They sit inside the normal agent loop (intent → skill selection → execution → validation → result), reducing hidden assumptions and making behavior inspectable and teachable. Treat every skill as improvable; unstated context eventually surprises you.
- Extend Capabilities with Plugins and MCP — Extending an agent changes what it can read, modify, and trigger, so capability expansion must be designed as part of the loop. MCP gives tools a shared communication protocol (schemas, permissions, common messages) instead of one-off adapters. The key design question is what capability contract to expose, with documented inputs, scope, outputs, and error/audit behavior.
- Create Specialized Sub-Agents — Sub-agents separate work with a clear purpose, predictable shape, and repeatable output, while the orchestrator retains the overall goal and final integration. The spec is a compact contract: one role, input context, tool limits, intentional memory, and a structured output contract. Apply least privilege and a design check before adding one; strong designs are boring—clear responsibility, limited power, predictable output, validation.
- Isolate Parallel Work with Git Worktrees — Git worktrees give each branch its own physical directory while sharing one object store, so parallel agents stop colliding in the same working directory. Workflow: start from a clean main, create a worktree per feature/fix, work and validate inside it, then open a PR, merge, or discard. Isolation covers filestate, branch state, agent context, and tool settings; it complements (not replaces) review and CI.
- Use Hooks and Automations — A hook is a controlled reaction to an event (file changed, tool requested, test finished, run failed); an automation is the repeatable action attached to it. Hooks turn the agent loop observable and governable: trigger → context → guardrail → bounded action → recorded evidence. Separate pre-run, tool-use, post-change, and failure hooks; start small and deterministic, and give each automation a contract.
- Manage Permissions and Dangerous Operations — Permissions are runtime guardrails deciding what runs automatically, what needs a human checkpoint, and what is never available. Classify each request by intent/scope and risk class (read-only low, shell/package medium, deletes/secrets/infra high), then allow, ask, or deny. Dangerous operations should be turned into controlled workflows: preview/dry-run, constrain with path allow lists and rollback, require approval, execute, then verify with logs and audit.
- Claude Code Loop Engineering (quiz) — Ten-question assessment covering project instructions, skills, worktrees, hooks, MCP, sub-agents, dangerous-operation controls, idempotent automations, plugin trust boundaries, and verification before completion.
- Lab Build an Issue-to-Verified-Change Workflow — Hands-on Python lab converting a structured issue (issue.json contract) into a scoped, verified code change. Builds a change agent that validates scope, reproduces the defect, applies one controlled line replacement, checks file hashes for scope, runs regression tests, rolls back on failure, and writes change_report.json with terminal states VERIFIED / VERIFIED_NO_CHANGE / ESCALATED / ROLLED_BACK / FAILED.

## Sections (L2)

### claude-code-as-an-agentic-execution-environment

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/42. Claude Code as an Agentic Execution Environment.en.srt#claude-code-as-an-agentic-execution-environment]]`
- Summary: Explains Claude Code as a controlled execution environment that gives the model the developer's working surface (project files, terminal commands, tests, version control), changing the task from code suggestion to agentic execution.
- Key claims: The execution loop is read context → plan → edit and run checks → verify → move to approval; most failed agent runs skip context, act without a plan, or declare success without proof; behavior is shaped by CLAUDE.md (instructions), codebase map (structure), settings.json (tool permissions/limits), MCP (external tools), and LSP (code intelligence); human approval keeps responsibility clear; treat the agent like a junior executor with strong tooling and limited authority, and write lessons back into project guidance.
- Learner-relevant: Anchors the whole part—gives the mental model (read-plan-act-verify) and the "design the environment, don't just rewrite the prompt" principle used by every later section.

### guide-agent-behavior-with-project-instructions

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/43. Guide Agent Behavior with Project Instructions.en.srt#guide-agent-behavior-with-project-instructions]]`
- Summary: Shows how project instruction files (CLAUDE.md, codebase map md, settings) turn a general coding agent into a repo-aware teammate by supplying durable, repository-specific knowledge before the loop starts.
- Key claims: Instructions influence every later decision (what the agent opens, changes, avoids, and how it proves results); core components are coding standards, repo map, tool policy, verification rules, memory boundaries, and escalation rules; specific executable rules (e.g. tests required before final response) beat vague ones like "follow best practices"; good instructions prevent drift and micromanagement, are grounded in the real repo, and are lightweight control infrastructure under governance gates, audits, and rollback plans.
- Learner-relevant: Supports lesson content on writing CLAUDE.md and the context-vs-action boundary; gives concrete traits of good instructions and the two failure modes they prevent.

### use-skills-for-repeatable-procedures

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/44. Use Skills for Repeatable Procedures.en.srt#use-skills-for-repeatable-procedures]]`
- Summary: Defines a skill as a reusable, explicitly-specified procedure the agent selects and executes inside its normal loop, reducing the ordinary failures of inconsistent steps, tool choices, and forgotten validation rules.
- Key claims: A skill contains trigger conditions (when to use / not use), an ordered procedure, required tools, and a validation checklist; directionality is intent → skill selection → execution → validation → result — skipping validation makes a skill incomplete and unscoped tools make it unsafe; supporting context comes from CLAUDE.md, codebase map md, and settings.json; skills should live with the repository and be treated as controlled, improvable procedures with permissions, audit, approval, and rollback in the governance lane.
- Learner-relevant: Provides a review checklist (are inputs explicit, tools scoped, failure path defined, output verified) and the "document assumptions, boundaries, checks" rule for building reliable skills.

### extend-capabilities-with-plugins-and-mcp

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/45. Extend Capabilities with Plugins and MCP.en.srt#extend-capabilities-with-plugins-and-mcp]]`
- Summary: Argues that adding plugins and MCP changes what the agent can reach, read, modify, and trigger, so capability expansion must be designed into the loop with guardrails rather than bolted on.
- Key claims: Every request leaves the agent through a defined boundary and returns in a reason-able form; plugin calls follow detect-need → select best-fit plugin → validate inputs against schema → run → verify result before trusting it, with guardrails known before the call; MCP provides a shared protocol (messages, schemas, permission boundaries) so integrations do not become one-off adapters; a capability contract names the action, defines input schema, limits permission scope, specifies output shape, and explains errors/auditability; enterprise expansion is layered into agent workspace / capability layer / control layer, and a production agent is one that calls the right capability with the right scope at the right time.
- Learner-relevant: Supports lessons on MCP, tool schemas, and capability contracts; gives the deliberate "what exactly are we exposing as a capability" design question.

### create-specialized-sub-agents

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/46. Create Specialized Sub-Agents.en.srt#create-specialized-sub-agents]]`
- Summary: Explains specialization as controlled responsibility: the orchestrator keeps the goal, context, and integration while narrow sub-agents receive focused tasks, use only needed tools, and return structured results.
- Key claims: Start from a task boundary, not a tool choice—pick repeatable work with clear inputs/outputs, define responsibility in a project instruction file, apply least privilege, keep memory intentional, and add validation for correctness/consistency/safety/tool-use/usability; the sub-agent spec is a compact contract naming one role, input context, limited tools (MCP/LSP/search/read/validation), a structured output contract with fields/constraints/examples, and failure/out-of-scope behavior; a pre-add design check asks whether the job is specific, inputs known, tools minimal, uncertainty/out-of-scope behavior defined, and an output review path exists.
- Learner-relevant: Anchors lessons on writing sub-agent specs, choosing planner/researcher/verifier/test-writer/security-reviewer roles, and avoiding fragile "agent sprawl."

### isolate-parallel-work-with-git-worktrees

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/47. Isolate Parallel Work with Git Worktrees.en.srt#isolate-parallel-work-with-git-worktrees]]`
- Summary: Presents Git worktrees as the mechanism for parallel agents: each branch gets its own physical directory while sharing one repository history and object store, so agents stop overwriting the same checked-out working directory.
- Key claims: Workflow is clean baseline → create worktree (typically a sibling dir) → agent works and validates inside it → open a PR, merge through review, or discard; isolation must cover four kinds of state—file state, branch state, agent context (per-task CLAUDE.md / codebase map), and scoped tool settings (settings.json, MCP config, LSP); multi-agent pattern is one lane per agent (refactor / test / docs) with no cross-lane edits without an explicit contract; guardrails include clean baseline, descriptive branch names, care with dependency/lock files, testing locally and in CI, and pruning stale worktrees (`git worktree list/remove/prune`); worktrees complement review and CI, not replace them.
- Learner-relevant: Supplies the concrete workflow and the four-state isolation model for teaching parallel agent setups and cleanup discipline.

### use-hooks-and-automations

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/48. Use Hooks and Automations.en.srt#use-hooks-and-automations]]`
- Summary: Explains hooks as controlled reactions to events and automations as the repeatable actions attached to them, making the agent loop observable and governable instead of a black box.
- Key claims: A useful hook lifecycle is trigger → context (task, changed files, permissions, run knowledge) → guardrail (policy rule, schema validator, test, lint, human approval) → bounded action (allow / block / repair / escalate) → recorded evidence; avoid vague hooks—"something changed, do something" is unreliable, while "validate, allow tools, record result" is reliable; hook types are pre-run, tool-use, post-change, and failure, and separating them prevents one giant unpredictable automation; in enterprise setups a hook router is the control layer deciding which approved events leave the workspace, returning evidence (test output, ticket status, approval/failure records) to inform the next step; start small and deterministic, give each automation a contract (name, trigger, context read, permitted action, evidence written).
- Learner-relevant: Supports lessons on hook types, idempotency (avoiding duplicate issues/actions), and the "small control surfaces" framing.

### manage-permissions-and-dangerous-operations

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/49. Manage Permissions and Dangerous Operations.en.srt#manage-permissions-and-dangerous-operations]]`
- Summary: Covers permissions as runtime guardrails that decide which actions run automatically, which need human approval, and which are never allowed—since granting read/edit/shell/tool access increases the blast radius of a bad decision.
- Key claims: CLAUDE.md gives project-level human-readable rules while settings.json makes operational policy explicit (allowed tools, default permission mode, before/after tool-use hooks, denied patterns), with directory scope and audit logging; classify each request by intent/scope into risk classes—read-only low, shell/package medium, deletes/secrets/infra/deploy high—then allow, ask, or deny to prevent quiet escalation; dangerous operations use a controlled pattern (preview/diff/dry-run, constrain with path allow lists and environment locks and rollback, require approval with evidence, execute, then verify with logs/tests/audit); secret exfiltration, destructive deletion, and production deployment require explicit human approval every time; final rule is least privilege—smallest useful permission set, escalate only with evidence, scope, and approval.
- Learner-relevant: Provides the risk-classification decision procedure and the dangerous-operation safety pattern for teaching permission design.

### claude-code-loop-engineering-quiz

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/7. Claude Code Loop Engineering.html#claude-code-loop-engineering-quiz]]`
- Summary: A 10-question multiple-choice assessment titled "Claude Code Loop Engineering," scored client-side, testing the part's extension mechanisms and controls.
- Key claims: Project instruction files provide persistent repository-specific guidance and constraints; a repeatable procedure invoked on demand with supporting instructions is best implemented as a skill; Git worktrees give independent branches, clearer integration boundaries, reduced file-edit collisions, and separate working directories; deterministic hooks are preferred when a required validation must run reliably at a known lifecycle event; MCP exposes external tools/resources through a defined protocol (not eliminating permissions or guaranteeing trust); a specialized security reviewer needs a scoped sub-agent; dangerous operations are governed by human approval where risk warrants, tool restrictions, explicit permissions, and repository boundaries; a nightly automation opening duplicate issues is missing idempotent state tracking for previously processed findings; plugins may add instructions, tools, or integrations that expand the trust boundary; before declaring completion an issue-to-verified-change workflow should run the specified verification and confirm acceptance criteria.
- Learner-relevant: Serves as check-question material for the part; its distractors highlight common misconceptions (unlimited permissions, automatic correctness, prompt-only warnings, duplicate worktrees).

### lab-build-an-issue-to-verified-change-workflow

- Locator: `[[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/50. Lab Build an Issue-to-Verified-Change Workflow.html#lab-build-an-issue-to-verified-change-workflow]]`
- Summary: A 50–65 minute Python 3.10+ lab that converts a structured issue into a scoped, verified code change using a controlled change agent, with no cloud resources, paid services, external packages, or API keys.
- Key claims: The issue is a contract (`issue.json`) defining issue_id, problem, target_file, `allowed_files` (exactly one), acceptance_criteria, targeted_test, and full_test_file; the agent validates the issue (missing fields, target outside allowed scope, more than one file, missing file, or no acceptance criteria → ESCALATED), snapshots Python file SHA-256 hashes, reproduces the defect with the targeted failing test, applies one exact source-line replacement that must match exactly once, detects changed files by hash diff, runs the full regression suite, rolls back on failure or unexpected scope, and writes `change_report.json`; terminal states are VERIFIED, VERIFIED_NO_CHANGE, ESCALATED, ROLLED_BACK, FAILED; a second run returns VERIFIED_NO_CHANGE; the lab also tests invalid scope (→ ESCALATED) and forced verification failure (→ ROLLED_BACK) and includes a troubleshooting cheatsheet and completion checklist.
- Learner-relevant: The hands-on application of the chapter; maps each part concept to a concrete artifact (issue contract, scope check, hashing evidence, rollback, evidence report) for a "build the workflow" lesson.
