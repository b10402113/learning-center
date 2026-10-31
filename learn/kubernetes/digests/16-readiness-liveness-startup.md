---
source: sources/kubernetes/20261031/16-readiness-liveness-startup.txt
source_type: text
source_lines: 187
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Health checks as the top production failure — the lesson opens by naming health checks and resource management as the biggest gap he sees, since a running Pod is not a working Pod and Kubernetes has no other way to tell.
- Three probes, three questions — readiness asks whether the Pod should receive traffic now, liveness asks whether the Pod is wedged and needs a restart, and startup asks whether the app has finished booting.
- Rollout and downtime consequences — without readiness, the old Pod is torn down the moment the new one is running; with probes, Kubernetes waits for health signals before switching traffic.
- Resource semantics — closing line distinguishes requests (scheduling) from limits (protection).

# L2 detail

- `#L1-L16` — Frames the section: he is teaching a basic car, not a Ferrari, and health checks plus resource management are the single biggest thing people get wrong.
- `#L17-L42` — Audience poll on who has implemented health checks; concedes that during development you focus on business logic, but argues health checks are 100% essential to deployment even though they are not part of the application, calling it interview-worthy.
- `#L43-L92` — Explains what health checks give the orchestrator: a signal for when the app is ready for traffic, because "if it's running does not necessarily mean it's working"; recommends enriching the check with dependency checks such as database connectivity rather than an endpoint that does nothing.
- `#L93-L141` — Defines the three probes: readiness ("should this pod get traffic now") and the startup-time trap of routing traffic immediately without it; liveness ("is this pod wedged and needing a restart") as the frequent "is everything okay" check; both are optional and can expose different criteria on different endpoints.
- `#L142-L174` — Explains startup ordering and rollout behaviour: Kubernetes checks startup first, a Pod with only a startup probe simply turns green, and a Deployment with readiness and liveness briefly runs two Pods so health checks can approve the switch — no high availability without them.
- `#L175-L187` — Answers a horizontal-scaling objection by noting that scaling without probes still cycles blindly, then summarises: startup is always effectively present, readiness and liveness carry the hard work, requests are for scheduling and limits are for protection.
