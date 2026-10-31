---
source: sources/kubernetes/20261031/21-health-checks.txt
source_type: text
source_lines: 207
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Adding startup, readiness and liveness probes to the app deployment so Kubernetes can reconcile container state; the demo first proves the negative case — killing the internal health check does nothing because the probe manifest was never applied.
- The probe loop in action — `kubectl diff` shows the probes being added, apply triggers a new pod rollout, probe traffic hits `/healthz` continuously, then a failed check returns 500 and Events report liveness/readiness failures until the container restarts and heals.
- Deployment vs ConfigMap lifecycle — changing a ConfigMap does not roll pods, so you must trigger a rollout or watch the config file; and why probes only mask real causes unless the health check covers dependencies like the database.

# L2 detail

- `#L1-L17` — the goal of the lesson: readiness, liveness and startup probes, and the answer that Kubernetes can then reconcile — know when the app works, take containers out and put them back safely.
- `#L18-L53` — the app running in K9s, the plan to emulate a failing internal health check, and the confession of why it failed before: the deployment manifest was never updated or applied with probes, so there was nothing to detect the failure.
- `#L54-L81` — updating the manifest with startup, readiness and liveness probes; `kubectl diff` showing the probe specs about to be added; restarting the app and running the kill command with no probes yet, so the container keeps running.
- `#L82-L112` — applying the updated deployment rolls a new pod; the follow-up question about ConfigMaps: changing one does not update the deployment because the two resources have separate lifecycles and a many-to-many relation, so you trigger a rollout or watch the config file.
- `#L113-L136` — after the rollout, `/healthz` requests appear in the logs even with no user traffic, roughly every 15 seconds, and the note that every probe adds request overhead to the container.
- `#L137-L157` — killing the internal health check makes Health Z return 500, the app turns red in K9s, Events report liveness and readiness probe failures, and the container is restarted by the deployment, healing itself.
- `#L158-L207` — clarifying that probes cannot fix the app, only restart it; segfaults and persistent transient errors create a fail/restart loop, and adding a database connection check to the endpoint would make the failure reason visible.
