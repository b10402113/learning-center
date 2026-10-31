---
source: sources/kubernetes/20261031/34-synchronizing-manifests.txt
source_type: text
source_lines: 268
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Argo CD Application and sync — the installed Argo CD is bare until an `Application` CRD (`argoproj.io/v1`) points at a repoURL, branch, and path. The lesson applies a `sample-app` Application at the default project against the course repo's `manifest-day-1-k8s-base` path, explains that `syncPolicy` `automated` + `prune` + `selfHeal` is what made it deploy and stay correct, and reframes deploying as syncing manifests rather than pushing a deployment.
- Gating and pitfalls — deleting an Application can hang on a resource Argo CD does not own (the same trap as a CloudFormation delete blocked by a security group), and removing `syncPolicy` disables automation so the Sync button becomes a human-approval deploy button.

# L2 detail

- `#L1-L53` — From the slides: the namespace and manifests are applied but Argo CD manages nothing yet. Introduces the `Application` kind applied with `kubectl apply -f`, whose `source` is a repo URL — it knows which branch to check out and which directory in that branch holds the manifests. Notes the sync will follow the instructor's repo, and that the directory `path` (k8s-base ad hoc vs manifest-day-one in the course) is why: path lets one repo hold many applications and clusters.
- `#L54-L95` — Confirms the `Application` kind is a CRD, identifiable by API group `argoproj.io/v1`, and copies the manifest from the guide rather than the slides. Opens a second terminal tab so the running port-forward/UI stays alive, then applies the new Application. Pro tip: the same name can be reused across resource types (an Application and a Deployment both named `sample-app`) because uniqueness is per kind.
- `#L96-L131` — The applied Application: name `sample-app`, project `default` (Argo CD's analogue of a namespace), source repo the public course repo, branch `main`, path `manifest-day-1-k8s-base`. On apply it begins syncing and ends Healthy, creating everything for the app. Notes yellow/degraded status means the loop is stuck.
- `#L132-L169` — Reframes the mental model: you are not pushing a deployment, you are changing manifests and letting the cluster update from them — this is syncing. Points at the manifest's `syncPolicy` with `automated`, `prune`, and `selfHeal` as the reason the whole app came up on commit, with prune removing objects dropped from the repo.
- `#L170-L225` — Tries to clean up by deleting the Application and edit out `syncPolicy`, and the delete hangs in "deleting" forever. Diagnoses it as a dependant resource outside Argo CD's ownership ordering (analogous to CloudFormation failing to delete because a security group still references the resource); once the blocking gateway is removed, the Application disappears and the namespace is clean again.
- `#L226-L268` — Re-adds the Application with `syncPolicy` removed entirely: Argo CD now only reads the directory and reports what it sees, deploying nothing. Explains this as the opt-in mode for teams that want a push/approval feel — update the manifest, then click Sync (which becomes the deploy button) to reconcile. Contrasts with auto-sync, where every commit ships immediately.
