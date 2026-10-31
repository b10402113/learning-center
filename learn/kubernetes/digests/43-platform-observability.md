---
source: sources/kubernetes/20261031/43-platform-observability.txt
source_type: text
source_lines: 118
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Platform observability — a short reminder section on watching the platform just deployed: observability is a choice between Grafana/Loki and CloudWatch-style managed metrics, and the lesson deliberately demonstrates only the built-in signals before a metric stack "earns its weight."
- Built-in signals demo — runs `kubectl top` (correcting to `kubectl top node`) to show per-node CPU/usage with no install, uses `kubectl events` and `kubectl rollout status` for cluster and deploy state, then points at the EKS CloudWatch observability add-on as the platform option available from the add-ons page but intentionally not installed to avoid extra billing.
- When to escalate — argues Prometheus/Grafana/Loki must be run, scaled, secured, and paid for, so reach for them only when built-in and platform signals stop being enough; notes Prometheus, Grafana, and Loki operators exist and install as easily as the other controllers in the course.

# L2 detail

- `#L1-L29` — Opens the final section as a reminder of other considerations, starting with built-in and platform observability; notes the course deployed a lot without watching metrics, and that Grafana with the Loki stack or CloudWatch (Amazon) are equally valid choices, with the lesson sticking to out-of-the-box options.
- `#L30-L47` — Advises getting far with built-in signals before adopting a metric stack and runs `kubectl top` (then `kubectl top node`) to show current node usage on Amazon with nothing installed.
- `#L48-L59` — Shows `kubectl events` for cluster events and `kubectl rollout status` for whether a deployment has completed.
- `#L60-L91` — Describes CloudWatch Container Insights as the platform metrics option, frames EKS add-ons as an easy up-sell, and says the EKS CloudWatch observability add-on could be installed from "get more add-ons" and integrated with CloudWatch, but is deliberately skipped to avoid accidental charges.
- `#L92-L118` — Closes with the stopping point rationale: Prometheus, Grafana, and Loki are their own thing to run, scale, secure, and pay for and should be reached for only when built-in and platform signals are insufficient; if Amazon metrics suffice, use them, and otherwise operators for Prometheus, Grafana, and Loki make deployment as easy as the earlier controllers — the decision is the learner's.
