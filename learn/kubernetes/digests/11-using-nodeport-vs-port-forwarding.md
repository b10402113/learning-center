---
source: sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt
source_type: text
source_lines: 498
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- NodePort vs port-forward — the lesson wires the sample app to Postgres via `kubectl set env`, then compares three ways in: Ingress (not built today), `kubectl expose deployment` producing a NodePort on a random host port such as 31717 mapped to container port 8080, and `kubectl port-forward` proxying 8080:8080 through the CLI. It closes by curling `localhost:8080` and watching the counter increment to prove the app, the port-forward, and the internal database connection all work end to end.

# L2 detail

- `#L1-L45` — Repeating the Postgres wiring for the sample app; why imperative deploy-then-patch steps are bad practice and why manifests/declarative config exist; CLI for debugging, not for managing.
- `#L46-L80` — Running `kubectl set env`; the secret is handled wrong — plaintext in shell history and on the recording; it should live in a manifest and in git (GitOps).
- `#L81-L124` — The "how do I reach my pod" hurdle; NodePort described as a crude front door; `kubectl expose deployment` then `kubectl get services` shows type NodePort with 8080 and 31717.
- `#L125-L175` — NodePort assigns a random unrecorded host port by default; diagram of pod inside deployment inside cluster with nothing reachable and no pod-to-pod communication.
- `#L176-L253` — Services are what let two pods talk; exposure is inverse by design for security; Ingress sits in front of Services like Legos; deployment-only is not enough.
- `#L254-L300` — Ingress handles incoming traffic and consistent routing; NodePort pokes one literal hole on that host, cannot route to other services, and gets a new random port each time.
- `#L301-L350` — Scaling a deployment to zero breaks the NodePort and also breaks a plain Service; Ingress uses health checks to wait, while a NodePort just hangs or returns connection refused.
- `#L351-L398` — `kubectl port-forward` 8080:8080 compared to NodePort: CLI proxy like SSH forwarding versus an always-open host port; port-forwarding a deployment directly needs no Service.
- `#L399-L456` — Recap of the three options — Ingress (standard), NodePort (Docker-style), port-forward (kubectl helper); unexposed admin panels need no auth because nobody can reach them.
- `#L457-L498` — Curling localhost:8080 hits the app, "handling connection for 8080" appears, the counter goes up, proving the database and the app-to-DB service link work end to end.
