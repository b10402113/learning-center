---
source: sources/kubernetes/20261031/36-sealed-secrets.txt
source_type: text
source_lines: 241
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- The mechanism — a SealedSecret custom resource goes to the sealed secrets controller, which holds the decryption key, decrypts the payload, and creates a managed Secret the cluster can use; this is a controller managing a Secret the way a Deployment manages pods.
- Why it helps GitOps — the SealedSecret is encrypted and therefore safe to commit; when Argo CD reads the manifests it finds the encrypted object and the controller turns it into the expected Secret.
- The demo — installs the controller (into `kube-system`), creates a plaintext `kubectl create secret generic db-extra --from-literal=password=...`, then pipes that YAML through `kubeseal --controller-namespace kube-system --format yaml` into `sealed-db-extra.yaml`.
- Result — the original file holds base64 data, the sealed file holds an encrypted value under `SealedSecret`; the plaintext file is deleted, the sealed one is applied, and `kubectl get secrets` shows the controller-created `db-extra`.
- Caveats — SealedSecrets must exist before the workloads that need them, and sealing is per cluster: one key per cluster, so another cluster requires resealing against that cluster's controller.

# L2 detail

- `#L1-L36` — Defines "sealing" as encrypting an already base64-encoded Secret; a SealedSecret resource is handed to the controller, which decrypts it and creates a managed Secret, so the encrypted object can live in the repo and Argo CD can apply it.
- `#L37-L64` — Installs the sealed secrets controller following the workshop guide and notes it lands in `kube-system` by default; explains that a dedicated namespace is equally valid and that the install brings a Deployment and Service.
- `#L65-L83` — Creates a normal Secret locally with `kubectl create secret generic db-extra --from-literal=password=...`; stresses this is still an ordinary Secret, not yet a SealedSecret.
- `#L84-L106` — Installs the `kubeseal` CLI from the project's GitHub releases, or via Brew/MacPorts/Nix, and confirms the binary works.
- `#L107-L135` — Walks the kubeseal invocation: `kubeseal --controller-namespace kube-system --format yaml`, stdin from `db-extra-secret.yaml`, output to `sealed-db-extra.yaml`; the controller namespace is how it finds the key to seal with.
- `#L136-L171` — Compares the two resulting files: the original has base64 password data, the sealed file has an encrypted value whose kind is `SealedSecret` and is safe to commit; mentions piping JSON directly into kubeseal to skip the temp file.
- `#L172-L185` — Deletes the unencrypted Secret YAML from disk before committing anything, then applies the SealedSecret.
- `#L186-L206` — Shows `kubectl get sealedsecret` as a CRD rather than the real Secret, then `kubectl get secrets` reveals `db-extra` created by the controller with the unwrapped value; SealedSecret changes propagate to the Secret.
- `#L207-L241` — Warns that SealedSecrets must be created before the applications that consume them or the Deployment stalls; answers a question on cross-cluster decryption: one key per cluster, so a SealedSecret for another cluster must be sealed for that cluster.
