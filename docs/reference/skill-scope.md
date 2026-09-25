# Skill scope and batching

Shared by the skills that operate over a subject's nodes in batches (`/batch-nodes`, `/to-article`, `/to-image`). A skill points here instead of restating the parsing, so the rules have one home.

## Parse the arguments

The first positional argument is the **subject**. `-max-subagents N` (default 3) sets the batch width. `-skip-ask` (where a skill supports it) skips its confirmation. The remaining arguments are the **scope**, one of:

- **tier** — an arg matching `tier<N>` (e.g. `tier1`, `tier3`). Read `learn/<subject>/ROADMAP.md`, locate the `### Tier <N> — ...` heading, and take node ids from `[[learn/<subject>/nodes/<node-id>|...]]` links under it until the next `### Tier` heading or end of file.
- **explicit slugs** — args that are neither `tier<N>` nor a flag. Use them as-is.
- **all** — no scope args. Take every node id from `[[learn/<subject>/nodes/<node-id>|...]]` links in tier order.

Validate every resolved slug has a container at `learn/<subject>/nodes/<slug>.mdx`.

## Batch the work

Partition the resolved work items — nodes for `/batch-nodes`, steps for the article skills — into batches of `max-subagents`. Process batches sequentially; items within a batch run in parallel. For each batch launch one `task` subagent per item — all calls in a single message, with the `subagent_type` the skill names (`teach-agent` for `/batch-nodes`, `article-agent` for `/to-article` and `/to-image`). Wait for every subagent to return before the next batch, and show a progress line after each batch.

Report at the end: succeeded, failed, and skipped per item, with a reason for each skip and the error for each failure.
