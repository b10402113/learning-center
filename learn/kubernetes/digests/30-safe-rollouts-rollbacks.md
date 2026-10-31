---
source: sources/kubernetes/20261031/30-safe-rollouts-rollbacks.txt
source_type: text
source_lines: 238
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Rolling updates gated by probes — explains `maxSurge` / `maxUnavailable` as the capacity formula for a rollout, that the readiness probe is the interlock so a new pod counts only once it is ready, and that a stalled rollout is the guardrail working rather than a failure. It then breaks the deployed image on purpose, shows the old replica keeps serving because the bad pod never entered rotation, and recovers with `kubectl rollout undo deployment/<name>`, which reads the last-applied manifest.
- Strategy mechanics — the default `RollingUpdate` strategy, `minReadySeconds` as an extra soak before traffic, and the 25% maxUnavailable arithmetic that can deadlock a small cluster when no capacity exists to schedule new pods (fix: autoscale, or drain a node).

# L2 detail

- `#L1-L46` — Framing the lesson: a rolling update gated by probes. Introduces `maxSurge` over `maxUnavailable` as the formula for capacity to keep at any moment, the readiness probe as an interlock so a never-ready new version cannot proceed, and the point that a failed rollout leaves the previous ReplicaSet serving. A stalled rollout is described as the guardrail doing its job, not as a failure.
- `#L47-L122` — Inspecting the current `RollingUpdate` strategy and defining a rolling update as slow incremental replacement (about 25% at a time). Explains `minReadySeconds` as extra time before a ready pod joins rotation, and that 25% maxUnavailable means a share may be lost at once. Details the deadlock: when a rollout needs more pods than hosts allow, the old pods hold the resources the new pods need, so the rollout stalls; remedies are autoscaling or draining a node to free capacity.
- `#L123-L156` — Breaking the deployment image on purpose. The autoscaler has already dropped the app to its oldest single replica, which keeps answering. The new (broken) pod stays out of rotation because of the readiness probe plus the rollout strategy, so `curl` against the Service still works even though the deployment is bad — the rollout simply sits there broken until fixed.
- `#L157-L196` — Recovery with the `kubectl rollout undo deployment/<name>` subcommand, which reverts the last rollout. Explains that this works because applying manifests preserves the last-applied configuration, which is what rollback reads. After the undo the deployment returns to three stable replicas and the rollout reports success.
- `#L197-L238` — Recap: the bad image was held back, the old version kept answering, the change was undone. Closing reflection on how the building blocks now compose — the HPA constantly tracking cluster resource usage, scheduling and removing pods on the fly, as an example of how much Kubernetes does underneath.
