---
source: sources/kubernetes/20261031/15-deployment-manifest-labels.txt
source_type: text
source_lines: 425
status: absorbed
absorbed_at: 2026-10-31
supplements:
  - fem-kubernetes-main.1.part.md#L574-L584
  - fem-kubernetes-main.1.part.md#L533-L550
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Deployment YAML anatomy — `kind: Deployment`, `metadata.labels`, `spec.replicas` (1, raise to 50 for more pods) and `spec.template`, whose `containers` block is byte-identical to a bare Pod's, because a Deployment manages Pods.
- `kubectl diff` and create vs apply — diff shows desired vs live state and a new generation; `create` produces a manifest, `apply` is the real deploy command and the missing `kubectl.kubernetes.io/last-applied-configuration` annotation is the tell that a resource was created imperatively.
- Reconciliation and rollback — repeated applies are idempotent, and the stored last-applied record is what lets Kubernetes show diffs and roll back later.
- Labels and selectors as the wiring — a Service's `spec.selector` (`app: sample-app`) must match the Pod template's `metadata.labels`, which is why a Service finds Pods (or even VMs) by tag rather than by ID, and why `kubectl get` can filter by label.

# L2 detail

- `#L1-L22` — Opens `deployment.yaml`: top-level `kind: Deployment`, `metadata` with the new `labels` block, and `spec.replicas`; replicas means how many copies run, currently one, and 50 would just be a value change.
- `#L23-L73` — Compares the first Pod ever created (`kubectl run ... -o yaml`) against the Deployment: `spec.containers` appears immediately in a Pod, while the Deployment nests the same containers schema under `spec.template`; Kubernetes reuses and nests the Pod schema so the containers block could be copied straight down.
- `#L74-L123` — Introduces `kubectl diff` on the manifest: it prints current state versus proposed desired state, shows the new generation Kubernetes creates per change, and surfaces the added environment variables along with unchanged ports.
- `#L124-L170` — Contrasts `kubectl create` (makes the manifest once) with `kubectl apply` (the real deploy command that reconciles against the cluster); the first apply reports a missing last-applied configuration, meaning the object was created manually, and a second apply clears the warning.
- `#L171-L227` — Reads the `kubectl.kubernetes.io/last-applied-configuration` annotation as the record that enables diffing and rollback; emphasises that imperative create loses this, that repeated declarative applies change nothing, that `kubectl diff` returns empty afterwards, and that editing a password value makes the diff reappear.
- `#L228-L320` — Explains labels and selectors as the discovery and routing layer: a Service's `spec.selector: app: sample-app` matches Pod labels instead of pod IDs, selectors work across resource types (his home setup points a Service at VMs), and deleting the label breaks Service-to-app discovery.
- `#L321-L397` — Clarifies the layering after a question about load balancers: load balancer fronts Services, Services front Pods, and the label lives behind the load balancer; uses the "go fish" card analogy where a Service asks who has the matching label and routes to anyone who answers.
- `#L398-L425` — Puts the two halves side by side — Pod `spec.template.metadata.labels` versus Service `spec.selector`, both `app: sample-app` — and shows label-based lookup with `kubectl get` returning the matching Deployment and Pod, illustrating labels as organisation as well as routing.
