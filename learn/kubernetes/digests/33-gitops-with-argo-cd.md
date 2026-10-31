---
source: sources/kubernetes/20261031/33-gitops-with-argo-cd.txt
source_type: text
source_lines: 204
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- GitOps with Argo CD — argues that the cluster is portable because the same manifests move from laptop to EKS, then defines GitOps as "Git is the desired state" and Argo CD as the control loop that syncs the cluster to a repo forever. It installs Argo CD by creating the namespace and applying its manifests from a URL, inspects the resulting controllers (application controller, applicationset controller, dex, notifications, redis, repo server, argocd-server), and retrieves the generated admin password.
- Exploring the UI — port-forwards `argocd-server` to HTTPS localhost:8081, explains the `NET::ERR_CERT_AUTHORITY_INVALID` self-signed certificate warning, and logs in as `admin` to confirm the whole stack is running locally.

# L2 detail

- `#L1-L36` — Sets expectations: EKS is only a handful of Amazon commands plus the same apply. Contrasts this with trying to test autoscaling ten years ago by standing up nine VMs on a laptop. Lists what already runs locally (multiple nodes, ingress, physical volumes, autoscaling) and states that the deliverable is one manifest set moved to the cloud. Announces the goals: what Argo CD is and why GitOps.
- `#L37-L101` — Defines GitOps: Git is the source of truth for desired state, applicable to apps, infrastructure (Terraform), and Ansible. Drastically simplified, Git is just a database of files and needs no pipeline. Argo CD drives the cluster toward that state continuously, the same way Kubernetes reconciles manifests — so there are two sources of truth, inside and outside the cluster. States the chosen topology: one Argo CD per cluster managing its own cluster, versus multi-cluster/multi-Argo CD setups, and the realistic goal of installing, syncing one app, and showing drift.
- `#L102-L145` — Installation: creates the `argocd` namespace (visible in K9s) and applies Argo CD's manifests from a URL, noting some manifest sets are very large. Surveys the pods that appear — application-controller, applicationset-controller, dex-server, notifications-controller, redis, repo-server, argocd-server — and notes the apply is idempotent so rerunning it is safe.
- `#L146-L176` — Checks rollout status to confirm the deployment succeeded, then reads the operator-style generated admin password out of the Secret via the guide's command, warning that any trailing `%` is terminal/URL noise and that the value is base64-derived. Port-forwards the Argo CD server UI to the desktop so it can be opened with that password.
- `#L177-L204` — Walks through the browser warning: the certificate is self-signed, so Chrome shows `NET::ERR_CERT_AUTHORITY_INVALID` even though traffic is TLS-encrypted; proceeding leads to the login. Logs in as `admin` and points out what has been achieved — an app, a database, an ingress controller, and now a full web console developers can use to manage applications.
