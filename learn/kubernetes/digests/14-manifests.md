---
source: sources/kubernetes/20261031/14-manifests.txt
source_type: text
source_lines: 167
status: absorbed
absorbed_at: 2026-10-31
supplements:
  - fem-kubernetes-main.1.part.md#L461-L521
  - fem-kubernetes-main.1.part.md#L316-L341
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Manifest as recorded desired state — the lesson contrasts one-shot imperative `kubectl` commands with a YAML file that lives in git, so the cluster state is reviewable, diffable and recreatable without giving developers cluster access.
- Git repo as the source of truth — a cluster repo mirrors namespaces and deployments, and PR diffs show exactly which ConfigMap or environment variable changed.
- The four universal fields — `apiVersion`, `kind`, `metadata.name`, `spec`; the first three are fixed shape, while `spec` is validated against the specific kind plus API version.
- Bootstrapping YAML from the CLI — the demo ends with `kubectl ... --dry-run=client -o yaml > deployment.yaml`, turning an imperative command into a starting manifest.

# L2 detail

- `#L1-L53` — Defines a manifest as desired state written down rather than stored in your head; lists the payoffs (cluster repo in git, diffs in PRs like Terraform, visible ConfigMap and env-var changes) and why his employer uses Kubernetes so developers never need cluster access.
- `#L54-L100` — Walks the four fields every manifest carries: `apiVersion` (vendor-specific, any value such as an apps/v1-style version), `kind` (deployment, pod, statefulset, volume), `metadata.name` (naming lives under metadata rather than being a primary key, which he calls an efficiency tradeoff), and `spec`.
- `#L101-L125` — Explains that `spec` is entirely derived from kind and API version, that `spec: far` under a Deployment would be rejected because Kubernetes only knows deployment fields, and that this pairing is how validation and extensibility work — "almost like a map".
- `#L126-L167` — Answers "can you generate that from the command line": yes, with a dry run plus YAML output, redirecting into `deployment.yaml` so the CLI bootstraps a manifest; closes by saying imperative CLI work was always writing manifests, just not declaratively.
