---
source: sources/kubernetes/20261031/42-gitops-on-eks.txt
source_type: text
source_lines: 152
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Argo CD on EKS — walks through running GitOps inside the EKS cluster itself: one Argo CD per cluster, no external cluster registration or fan-out, reconciling the EKS overlay, and sealed secrets that must be sealed by the EKS cluster's own controller because keys are per cluster.
- Demo path — installs the sealed-secrets controller on EKS and confirms it in k9s, pipes a generated password through `kubeseal` into `manifests/k8s/overlays/eks/sealed-db-thing-extra`, creates the `argocd` namespace and installs Argo CD, commits and pushes `added sealed secret`, applies the Argo `Application`, watches four replicas scale up with auto-sync and self-healing, then logs into the UI via the initial admin secret and a port-forward to 8081.

# L2 detail

- `#L1-L23` — Introduces GitOps on EKS: Argo CD lives in the cluster, EKS gets its own instance just like Kind, one key per cluster means sealed secrets must be sealed while connected to that cluster, and there is no external cluster registration or fan-out; the EKS install reconciles the EKS overlay and seals its own copy.
- `#L24-L51` — Returns to the docs and installs sealed secrets on the EKS cluster as done on Kind, then verifies the controller pod exists at the bottom of the pod list in k9s.
- `#L52-L67` — Uses shell piping with `kubeseal` to generate a password, encrypt it, and write the result to `manifests/k8s/overlays/eks/sealed-db-thing-extra`, then confirms the sealed secret file exists at that path.
- `#L68-L103` — With encryption available, creates the Argo namespace and deploys Argo CD (described as copy-paste YAML ops), commits the new sealed secret as `feature, added sealed secret`, pushes it, and applies the Argo `Application` now that the source is up to date.
- `#L104-L135` — Confirms the Argo application was created and the sample app is running at four replicas, then shows how to reach the UI: read the initial admin secret in the Argo namespace, port-forward the Argo server to `8081`, accept the self-signed certificate warning, log in, and observe that pre-configured auto-sync and self-healing already synced from the repo.
- `#L136-L152` — Concludes that EKS, volumes, Ingress, and Argo CD are all in place and the application is fully GitOps-managed: future commits sync and deploy automatically, Argo CD took control of resources at Application creation, and it otherwise works exactly as it did locally.
