---
source: sources/kubernetes/20261031/8-self-healing-reconciliation-loop.txt
source_type: text
source_lines: 193
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- A failing deployment — runs `kubectl create deployment postgres`, watches it hit CrashLoopBackOff in K9s, and inspects it with `kubectl get pods` and `kubectl logs` because the Postgres password environment variable was never set.
- Fixing by changing desired state — `kubectl set env deployment postgres POSTGRES_PASSWORD=...` replaces the old pod with a working one; the presenter flags pasting a real database password into the CLI as something you should not normally do.
- The reconciliation loop — the deployment's desired state keeps being compared against reality, so one config edit heals the pod without restarting anything; the loop retries forever with no exponential backoff and no alerting unless you add it.
- Operating around the loop — because Kubernetes is a black box, you must wire signals out (Slack/Discord webhooks, time- or event-based alerts) and add backoff yourself; batteries included, not required.

# L2 detail

- `#L1-L45` — Any Docker image works, not just the sample app: `kubectl create deployment postgres`, then K9s shows the pod entering CrashLoopBackOff. Diagnoses with `kubectl get pods` and `kubectl logs`, noting these Docker-like commands are for experimentation, not how you manage deployments.
- `#L46-L98` — Root cause is the missing Postgres password. Fixes it with `kubectl set env deployment postgres` to add the environment variable, with an explicit red-flag warning about putting database secrets in CLI history. The old pod disappears and a fixed one takes over.
- `#L99-L156` — Walkthrough of what happened: desired state said "Postgres running with these env vars"; the value was absent, so every start failed; adding the variable let the next reconcile succeed with no manual pod restart. Discussion of the loop's weakness — it retries forever with no exponential backoff and no alerting unless configured.
- `#L157-L193` — No built-in backoff means you must add it; event- or time-based checks ("reconciling for over an hour") should fire alerts through Slack/Discord webhooks, since Kubernetes will not signal outward on its own. Closing point: one small change beats a chain of redeploy steps because the loop keeps checking.
