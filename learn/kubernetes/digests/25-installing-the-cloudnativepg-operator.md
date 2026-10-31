---
source: sources/kubernetes/20261031/25-installing-the-cloudnativepg-operator.txt
source_type: text
source_lines: 262
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Operator and CRD model — defines a CRD as a new Kind taught to the API server and an operator as the control loop that reconciles it, so `kubectl get clusters` becomes as ordinary as `kubectl get pods`; you install operators rather than write them.
- Why CloudNativePG — answers "how do I run databases in Kubernetes?" with "prefer not to," then recommends an operator over a Helm chart because it is more Kubernetes-native and supported; CNPG is framed as a self-hosted RDS: declare a Postgres cluster, get instances, storage, and initialization.
- Install walkthrough — applies the CNPG operator manifest, reads the stream of `CustomResourceDefinition` objects plus roles, lists what the operator can do (backups, cluster image catalogs, clusters, databases, failover quorums, image catalogs, poolers, publications, scheduled backups, subscriptions), and checks `kubectl get clusters` (empty) and the operator Pod.
- Discussion — Helm versus operators, whether cloud providers run Kubernetes internally, and why the data layer is often best kept outside an ephemeral cluster (migrations, backups, disaster recovery).

# L2 detail

- `#L1-L53` — CRD as a new Kind (possibly your company's own app shape), operator as its control loop; Kubernetes manages its own resources, you manage yours; consuming an operator instead of authoring one.
- `#L54-L97` — Chooses CloudNativePG, advises against running databases in Kubernetes but points to an operator when required, prefers operators over Helm charts, and compares CNPG to Amazon RDS giving you a whole database instance with storage.
- `#L98-L155` — Clarifies that "cluster" here means Postgres resources, not a Kubernetes cluster; Helm bundles manifests while operators provision programmatically through CRDs; side discussion on GKE being literal Kubernetes and cloud vendors funding the project.
- `#L156-L217` — Expanded argument for keeping the data layer external: Kubernetes is meant to be ephemeral, databases are not, and running them means owning migrations, backups, and disaster recovery; distinguishes durability from pure ephemerality and notes PVCs exist; says the answer to distributed databases is Kubernetes plus an operator.
- `#L218-L262` — Applies the operator, points out that everything it installs carries the `CustomResourceDefinition` prefix, enumerates the CRDs (backups, clusters, databases, failover quorums, poolers, publications, scheduled backups, subscriptions), and verifies the controller manager Pod is running before creating a database.
