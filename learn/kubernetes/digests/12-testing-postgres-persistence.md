---
source: sources/kubernetes/20261031/12-testing-postgres-persistence.txt
source_type: text
source_lines: 160
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Testing Postgres persistence — a short wrap-up that first debates Ingress plus port-forward versus NodePort (the Plex discovery-protocol exception), then deletes the Postgres pod with `kubectl get pods` / delete and curls the counter endpoint until it reports "database unavailable". The pod self-heals but all data is gone, proving no volume means no durability, and the lesson closes with a proof-of-concept recap of everything built and broken.

# L2 detail

- `#L1-L63` — Student proposes Ingress as the foundation with port-forward for specific access, making NodePort mostly redundant; the Plex counterexample where a discovery/broadcast protocol needs a node-level port.
- `#L64-L117` — `kubectl get pods` shows Postgres and the app; curl returns new counts; deleting the Postgres pod triggers self-repair but data is lost, curl says database unavailable then reconnects at one; no volume, no durability.
- `#L118-L160` — Proof-of-concept recap: nothing in git, all CLI; the many pitfalls; NodePort with no health probes or resource limits and DDoS risk; Postgres data dies on restart; plaintext password insecure by choice.
