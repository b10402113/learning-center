---
source: sources/kubernetes/20261031/20-migrating-to-manifests.txt
source_type: text
source_lines: 351
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- From imperative CLI to declarative manifests — clears the POC deployments and services (no cluster rebuild), then follows `stable.md` to write `deployment.yaml`, a Postgres deployment and a two-service manifest through heredoc-style copy-paste that creates the file and runs `kubectl apply` in one command.
- Diff and idempotency as the real payoff — `kubectl diff` shows everything being added before apply and nothing after, re-applying reports `unchanged`, and the same manifest can live in git for PRs and approvals.
- Manifest operations — `kubectl run --dry-run=client -o yaml` to generate a starting manifest, the `---` document separator for multi-resource files, grouping by resource type, and verifying results in K9s with `:` search for namespace/service/deploy/pods.

# L2 detail

- `#L1-L32` — goal of the `stable.md` segment: keep the cluster but delete the app and Postgres deployments plus services; deleting many resources in one command, and the Docker `ps -a | rm -f` piping analogy.
- `#L33-L82` — kubectl piping and list-then-delete cleanup at scale, K9s `Control+E` to hide the header and `?` for the keybinding list, ending at the same empty state as a fresh cluster.
- `#L83-L126` — Kubernetes resources are segmented, so you can return a cluster to zero without wiping it; the cloud-provider parallel, and deployments, pods, services, gateways and HTTPRoutes as "off the shelf" pieces you add and delete freely.
- `#L127-L198` — creating the first deployment from a manifest using bash heredoc (writes `deployment.yaml` and applies it), `--dry-run=client -o yaml` to render a manifest from the CLI (image is the one required field), and the shift from `create` to declarative `apply`.
- `#L199-L252` — `kubectl diff` before applying (whole manifest added), applying it, diffing again to show nothing, the git/PR/approval argument for manifests, and the idempotency discussion ending in the `unchanged` output.
- `#L253-L279` — the Postgres deployment manifest copied from `stable.md` in one heredoc-plus-apply command, producing `deployment.apps/postgres created` and a `postgres` file next to `deployment.yaml`.
- `#L280-L312` — the service manifests: the `---` separator between documents, two services in one file, and the convention of grouping by resource type rather than one file per resource.
- `#L313-L351` — verifying in K9s via `:` search for namespace, service, deploy and pods (app service keeps NodePort with a new random port), the equivalent `kubectl get deploys pods services`, and the optional commit of the manifests.
