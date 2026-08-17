# Node is a step-DAG; steps are articles, elements are keywords

Status: accepted

We restructure the teaching model. A node is no longer a single 10–15 minute article; it is a **step-DAG** — a container whose teaching process is a set of **steps** that branch and merge through their deps. Each step is a first-class file (`learn/<subject>/nodes/<node-id>/<step-id>.mdx`) and is written as an article (e.g. "Writing good prompts"). An **element** is a keyword-style concept page — a dictionary entry (e.g. "Prompt") that steps reference; it keeps its existing structure and gains no teaching process. The node file holds only the DAG (all step ids + deps), the reading order, and the main lesson.

## Considered Options

- **Single-article node (status quo).** One lesson article per node, `elements` as a flat ordered list. Rejected: teaching is a single unbreakable line; there is no plan to confirm before writing, and probe-based depth calibration has nothing granular to act on.
- **Step as a sub-section of the node article.** Rejected: steps must be addressable (`/tackle <step-id>`, pruning, DAG rendering), which requires files, not headings.
- **Step-DAG with per-step files (kept).** Steps are addressable, the DAG is a plan the learner confirms before the lesson is written, and mastery calibration can target individual steps.

## Consequences

- `elements` is no longer a flat list in node frontmatter; the DAG centralizes step ids and deps in the node file, and each step file lists the elements it teaches.
- The `/nodes` skill first generates the step-DAG and gets learner confirmation before writing step articles.
- tune-scope changes from `nodes` to `steps` (steps are the article carriers).
- `prepares/` is deprecated — the pre-lesson "what's coming" role is taken by the step-DAG confirmation.
- Site rendering must consume step files and the node-level DAG (see `docs/site-migration-memo.md`).
