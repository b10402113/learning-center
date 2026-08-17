# Probe is node-scoped and gated; amends ADR-0004

Status: accepted (amends ADR-0004)

We move mastery measurement from one whole-subject pass to a per-node pass. **`/probe <subject>/<node-id>`** replaces **`/probe <subject>`**: it runs after `/roadmap` (which now proposes uniform depth) and before `/nodes`, quizzes one node's source scope from shallow to deep, binary-searching each strand, and writes that node's mastery entry into `learn/<subject>/mastery.md` (now keyed by node). Probing a node is a **hard gate** — `/nodes` refuses a node that has not been probed. Node status gains a `probed` state: `draft → probed → confirmed → nodes-written → content-written → edges-written`. **`/tackle`** is unchanged in role but now reads the node's probe mastery and concentrates its questions on the strands rated `unknown`/`partial`, light-touching or skipping `solid` strands.

## Considered Options

- **Whole-subject probe before roadmap (ADR-0004, replaced).** One upfront pass calibrates every node's depth before any node exists, but it is broad, imprecise per node, and runs long before the learner actually meets the material. The learner wanted the measurement to happen right before viewing each node.
- **Node-scoped probe before `/nodes` (kept).** Measurement is fresh and targeted: each node is probed immediately before it is taught, so `/nodes` calibrates step depth from current, node-specific data, and `/tackle` can drill exactly where the probe found weakness. Trade-off accepted: the roadmap loses its upfront calibration and now proposes uniform depth (a missing report is already treated as non-error).

## Consequences

- Pipeline becomes `/learn-init → /roadmap → /probe <subject>/<node-id> → /nodes → /edges`, plus runtime `/tackle`.
- `mastery.md` is keyed by node, not source area; each node holds its strands and their ratings.
- `/nodes` gains a gate: it refuses a `draft` node and requires `probed` first.
- `/tackle` targets weak strands from the probe instead of covering all elements uniformly; its N = 2 L4 gate and mastery write-back stay, but write-back now lands in the step's node entry.
- The roadmap no longer annotates per-node depth; depth is determined at `/nodes` time from the node's probe.
