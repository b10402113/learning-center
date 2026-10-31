---
source: sources/kubernetes/20261031/31-poddisruptionbudgets-node-drains.txt
source_type: text
source_lines: 343
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- PodDisruptionBudget and node drains — distinguishes voluntary disruption (planned maintenance you own) from involuntary disruption (a crash you heal from), then defines a PDB as a floor of available replicas. Scales the app to 3, creates a PDB selecting pods by label (`get pdb`), discovers the Postgres operator already shipped one (`minAvailable: 2`, one allowed disruption), then drains `kind-worker` and watches evictions proceed until one is refused with a PDB violation while the app stays reachable.
- Drain vs cordon vs uncordon — daemonsets are not evicted, `drain` implies cordon plus eviction, `uncordon` only re-allows scheduling, and Kubernetes has no automatic rebalancing, so moving pods back is your job.

# L2 detail

- `#L1-L81` — Reframes PDBs and drains as optional operational tools. Voluntary disruption means maintenance — you volunteer for it by draining a node so an involuntary outage never happens. Frames the distinction as how much ownership of uptime you want: controlling planned downtime versus healing from crashes. Concludes that thinking in voluntary terms produces safer clusters because it forces you to design against the involuntary ones.
- `#L82-L124` — PDB semantics: "never fewer than n app pods available", effectively a minimum replica count at any time (lose 50, keep at least 5), which also constrains autoscalers and rollouts — a percentage-based rollout cannot go below the PDB floor. Notes PDBs select by label, so they are not tied to Deployments. Defines drain as cordon plus polite eviction that honors the PDB.
- `#L125-L155` — Setting it up: scales the deployment to 3 replicas to leave wiggle room, then creates a PDB in the sample-app namespace using a label selector (rather than a direct name) so anything carrying that label falls under the budget, and confirms it with `kubectl get pdb`.
- `#L156-L183` — Observes the operator-provided PDB for Postgres primary: `minAvailable: 2` with 3 total pods means only one may be lost at a time, and the allowed-disruptions count reads 1. Uses this to argue that operators deliver a management standard, not just object scaffolding.
- `#L184-L252` — Draining the worker that does not host Postgres (`kind-worker`, since `kind-worker2` runs the primary). Uses the K9s nodes view to watch the node go unschedulable and the app pods terminate. Explains why some pods keep running: they are daemonsets, node-level agents (logging, proxying) pinned to every host, confirmed in K9s as "controlled by daemonset".
- `#L253-L297` — The drain reports an eviction error: the pod cannot be evicted because doing so would violate the PodDisruptionBudget, so one pod stays while the other two are evicted. Curling the app still works. Contrasts with an involuntary loss of that node, where at least one replica would be rescheduled elsewhere and the rest provisioned back toward the desired count.
- `#L298-L343` — Confirms this is production-grade practice, then uncordons the node (accidentally the wrong one first) and shows it return to Ready and accept pods. Clarifies the vocabulary: cordon blocks scheduling only, drain cordons and evicts, uncordon just re-allows scheduling. Ends by repeating that Kubernetes does not rebalance — after a drain you must move workloads back yourself.
