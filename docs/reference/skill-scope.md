# Skill scope and batching

Shared by skills that operate over a subject's nodes by scope. A skill points here instead of restating the parsing, so the rules have one home. `/batch-nodes` is the current consumer.

## Parse the arguments

The first positional argument is the **subject**. Flags may appear anywhere after it. `-max-subagents N` (default 3) sets the batch width. The remaining positional arguments are the **scope**, one of:

- **tier** — an argument matching `tier<N>` (for example `tier1`, `tier3`). Read `learn/<subject>/ROADMAP.md`, find the `### Tier <N> — ...` heading, and take node ids from the standard Markdown links `[<title>](nodes/<node-id>.md)` under it until the next `### Tier` heading or the end of the file.
- **explicit node ids** — positional arguments that are neither `tier<N>` nor a flag. Use them as written.
- **all** — no scope arguments. Take every node id from the `nodes/<node-id>.md` links in `ROADMAP.md`, in tier order.

Validate every resolved node id has a container at `learn/<subject>/nodes/<node-id>.md`. A missing container or tier fails the run before any work starts. Do not infer the subject from a node name or from the conversation.

## Decide work by state, not scope

Scope selects which nodes the run may touch; node frontmatter and the files on disk decide what each phase actually does. Read each node's `status` and `steps`:

- `status: draft`, or `steps: []` — the Nodes phase must build the plan, even when a draft carries stale step entries.
- A `confirmed` or `written` node with a plan — the Nodes phase is skipped; the Article phase writes only steps without a body.
- A step already has a body — the Article phase skips it unless the skill's force flag is set.
- A step has a plan — it is eligible for Humanize and Generate; a step without a plan is an existing article and stays untouched.
- A `<step>.quiz.json` exists — the Quiz phase skips it unless the skill's force flag is set.

A force flag regenerates generated content. It must not rebuild a node's step plan; that belongs to `/nodes` or `/reset-nodes`.

## Batch the work

Partition the resolved work items into batches of `max-subagents`. Process batches sequentially; items within a batch run in parallel. For each batch launch one `task` subagent per item — all calls in a single message, with the `subagent_type` the skill names. Wait for every subagent to return before starting the next batch, and show a progress line after each batch.

The unit depends on the phase:

- **Nodes** — one subagent per node.
- **Article** — one `publisher` per step; publishers from different nodes may share a batch.
- **Humanize** — one `humanize-article` per step; steps from different nodes may share a batch.
- **Generate** — no subagent: one render CLI call per node, in roadmap order.
- **Quiz** — one `quiz-agent` per step; steps from different nodes may share a batch.

Do not exceed `max-subagents` total parallel subagents in one batch, even when a node contributes several steps.

## Report

At the end, report per phase: succeeded, failed, and skipped, with a reason for each skip and the error for each failure. Point at the next command — rerun the batch for the failed items, run `/generate-images <subject>/<node>` for an image repair, run `/humanize-article <subject>/<node>` for a text pass, or run `/edges` on completed nodes.
