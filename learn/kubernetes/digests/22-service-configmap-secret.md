---
source: sources/kubernetes/20261031/22-service-configmap-secret.txt
source_type: text
source_lines: 284
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Namespace, ConfigMap and Secret for the app — `kubectl create namespace`, a ConfigMap manifest with capitalized data keys so `envFrom.configMapRef` can load it wholesale, and a Secret created imperatively then read back with `kubectl get secret` and `base64 -d`.
- Secrets are encoded, not encrypted — the discussion of why base64 (multi-line values, special characters, certificates, binary data) and the repeated warning that base64 provides no security.
- Redeploying into the new namespace — the deployment manifest gains `envFrom` for `DB-config` plus `env.valueFrom.secretKeyRef` for `DB-password`; resources cannot be moved between namespaces, so the default-namespace deployments are deleted and re-applied with `-n app`, plus the namespace-agnostic manifest gotcha that silently lands things in `default`.

# L2 detail

- `#L1-L26` — starting the segment 10 section: `kubectl create namespace` for the app because everything so far ran in `default`, plus a short detour into the guide and slides before creating configuration.
- `#L27-L63` — writing the ConfigMap resource (another YAML manifest), why `data` keys are capitalized: `envFrom` auto-loads them as normal environment variables, though lowercase works and is not required.
- `#L64-L73` — applying the ConfigMap, then creating the Secret with a command outside a manifest, which sets up the later explanation.
- `#L74-L131` — `kubectl get secret` to read the manifest and the database password, piping through `base64 -d` to decode; secrets are only base64 encoded, not encrypted, and the encoding exists because values may be multi-line, contain special characters, or hold certificates and binary data.
- `#L132-L172` — updating the deployment to consume both: `envFrom.configMapRef.name: DB-config` loads everything, while `env.valueFrom.secretKeyRef` with `DB-secret`/`DB-password` pulls one value; the contrast between bulk envFrom and targeted env.
- `#L173-L213` — editing the deployment file, deleting the old deployments because they live in `default`, the caveat that resources cannot be copied or moved between namespaces (it means a full redeploy, possibly re-initializing the database), then re-applying with `-n app`.
- `#L214-L254` — namespace fields in manifests are optional, so a manifest can be namespace-agnostic and applied with `kubectl apply -n <ns> -f configmap.yaml`; hard-coding `namespace` risks conflicts; the gotcha that an unset namespace silently means `default`, and why `default` exists at all.
- `#L255-L284` — verifying in K9s that `app` and `default` namespaces now coexist, with both services and both pods running in `app`, confirmed by `kubectl get pods`.
