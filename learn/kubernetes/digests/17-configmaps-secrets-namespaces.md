---
source: sources/kubernetes/20261031/17-configmaps-secrets-namespaces.txt
source_type: text
source_lines: 190
status: absorbed
absorbed_at: 2026-10-31
supplements:
  - fem-kubernetes-main.1.part.md#L452-L460
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Why ConfigMaps and Secrets exist — inline Pod environment variables cannot be shared across many Deployments, so a ConfigMap holds non-secret values (hosts, ports, database names) that map into env vars, and a Secret holds the sensitive ones.
- Split is by sensitivity, not mechanism — both are unencrypted values; namespaces are the app or tooling boundary, created with `kubectl create namespace app` and listed via `kubectl get ns`.
- Secrets are base64, not encrypted — demo runs `kubectl create secret generic DB secret -N app --from-literal DB password="Demo is not a secret"`, then a `--dry-run=client -o yaml` variant to render the manifest instead of applying it.
- Reading and scoping — `kubectl get secrets -N app`, `kubectl describe secret`, and a `kubectl get ... -o json` path followed by base64 decode to pull one value; closes on why secrets must not live in git.

# L2 detail

- `#L1-L34` — Sets up the problem after Pods, Deployments and Services: environment variables set directly on a Pod cannot be shared, so a single configuration value reused by several Deployments needs something else — that is what ConfigMaps and Secrets provide.
- `#L35-L61` — Defines each object: ConfigMap as a literal map of non-secret configuration mapped into Deployment env vars (hosts, ports, database names), Secret as sensitive values handled with more care, Namespace as the app boundary; stresses the difference is sensitivity, not mechanism, since neither is encrypted.
- `#L62-L78` — Creates the app namespace in the demo, shows it in the namespaces view and via `kubectl get ns`/`namespaces` created 15 seconds ago, and notes namespaces are mostly a logical separator.
- `#L79-L123` — Addresses the base64 pitfall directly — secrets are base64 encoded, not encrypted — then runs `kubectl create secret generic DB secret --namespace/-N app --from-literal DB password=...`, shows the `--dry-run=client -o yaml` (and JSON) route to render the manifest, then re-runs the real create.
- `#L124-L159` — Demonstrates namespace scoping: `kubectl get secrets` shows nothing until `-N app` is added; then `kubectl describe secret DB secret` reveals stored data, followed by a kubectl "magic" one-liner that fetches `data.db password` as JSON and base64-decodes it back to the original value.
- `#L160-L190` — Answers a question about command-line env vars by agreeing: ConfigMaps may be committed to the repo, but secrets should not be ad hoc applied or stored in git, with encrypted-at-rest repo tooling named as the intended future workflow.
