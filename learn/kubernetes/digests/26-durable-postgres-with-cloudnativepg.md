---
source: sources/kubernetes/20261031/26-durable-postgres-with-cloudnativepg.txt
source_type: text
source_lines: 505
status: absorbed
absorbed_at: 2026-10-31
supplements:
  - fem-kubernetes-main.1.part.md#L561-L573
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Durability versus ephemerality — "durable" means long-lived and persistent, covering backups, restores, and disaster recovery, not just volumes; CNPG manages Pods and PVCs the way a StatefulSet would, and the lesson explains why it teaches operators instead of raw StatefulSets.
- From ephemeral Postgres to a CNPG Cluster — deletes the old Postgres Deployment and Service, removes the old manifest, adds a Postgres Service, and applies a `Cluster` resource under `postgresql.cnpg.io` whose spec carries storage size, `initdb` database/owner, and StatefulSet-level configuration; watches initdb and the running database in k9s.
- Generated Services and Secret — inspects the `r`/read-only/read-write Services, routes app traffic to read-write (and discusses read-only during migrations), and finds all operator-created objects with `-l cnpg`. Replaces the hard-coded env var with `valueFrom.secretKeyRef` on the operator-generated `postgres-app` Secret's `password` key mapped to `DB_PASSWORD`.
- Failure and proof — covers dependency loops and eventual consistency between app and Secret, then deletes the Postgres Pod while hitting the app through Ingress and sees the counter survive (`9`), demonstrating real durability.
- Closing frame — durable versus accessible versus ephemeral clusters, and Kubernetes as a problem-solving tool rather than a goal.

# L2 detail

- `#L1-L30` — Defines durable as persistent and long-lived, tying it to backups, restores, and disaster-recovery processes rather than storage alone.
- `#L31-L104` — Declare a Cluster and the operator does the rest; CNPG manages Pods and PVCs like a StatefulSet; explains the trainer normally keeps databases outside an ephemeral cluster, that StatefulSets only keep data across Pod churn, and that operators wrap StatefulSets to add failover, backups, safe rolling updates, credential generation, and initialization.
- `#L105-L152` — Read-write and read-only Services with automatic app routing and failover; the Cluster YAML is only a handful of lines, uses apiVersion `postgresql.cnpg.io`, and its spec (`storage.size`, `initdb` database name/owner) mirrors familiar Postgres settings; the operator supplies StatefulSet-worth of configuration.
- `#L153-L213` — Deletes the old Postgres Deployment and Service, removes `postgres.yaml` (framing it as a migration), writes the new Cluster manifest, applies it, and watches in k9s as initdb initializes data on the volume before the database starts alongside the app.
- `#L214-L273` — Reviews operator-created Services (ready/read-only/read-write), defaults all traffic to read-write, and outlines using both endpoints during migrations for high availability; `kubectl get cluster postgres` shows healthy, and a label query (`-l cnpg`) lists the Pod, the 1Gi PVC, the three Services, and the auth Secret.
- `#L274-L330` — Operator-generated credentials live in a Secret; the Deployment now uses `secretKeyRef` on `postgres-app` key `password` mapped to uppercase `DB_PASSWORD`; rollout is verified in k9s and via the Pod YAML.
- `#L331-L436` — Trade-off reflections on health checks, routing, and platform blame; the app cannot start until the Secret exists, creating a dependency loop that eventual consistency resolves, or that you avoid by creating the Secret outside the graph; aside on ConfigMap versus Secret naming.
- `#L437-L473` — Deletes the old Secret, hits the app through Ingress to raise the counter, deletes the Postgres Pod, waits for the volume detach and the replacement Pod, then shows the counter still at `9` — durability proven.
- `#L474-L505` — Takeaways: no human authored the database password, durability versus ephemerality changes how much work Kubernetes demands, and the vocabulary of accessible, durable, and ephemeral clusters reduces ingress jargon to recognizable shapes; Kubernetes is a tool for solving problems.
