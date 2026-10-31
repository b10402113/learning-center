---
source: sources/kubernetes/20261031/32-rbac-least-privilege.txt
source_type: text
source_lines: 290
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- RBAC least privilege — explains that RBAC only answers "what may I do inside the cluster", maps Role/RoleBinding onto AWS IAM policies and attachments, and warns that every pod gets a mounted JWT service-account token that could be used against the API if someone got into the container. The demo creates a ServiceAccount for the app, patches it with `automountServiceAccountToken: false`, creates a tightly scoped Role (`get`, `list`), binds it, and points the Deployment at the new ServiceAccount.
- Verification — uses `kubectl auth can-i` to prove the identity can read ConfigMaps in its namespace and cannot read Secrets, which is the whole grant.

# L2 detail

- `#L1-L35` — Positions RBAC as the least-adopted topic and narrows its scope: RBAC is only about permissions inside the cluster (create pods, list pods), unlike cloud IAM. Gives the work example of granting AWS roles time-boxed, auditable `kubectl` access for migrations, and concludes that teams with no multi-tenant or API-access concern may not need RBAC at all.
- `#L36-L59` — Core vocabulary: give a workload its job and nothing more; until now the app has run under the namespace's broad `default` ServiceAccount. A Role is the set of allowed verbs (`list`, `get`, `delete`) on resources, and a RoleBinding ties a Role to a subject. Draws the IAM analogy: Role ≈ policy, RoleBinding ≈ attaching that policy to a user or another pod.
- `#L60-L119` — Least privilege in concrete terms: this app only reads its own ConfigMap, and RBAC can make sure it can never touch anything else, for security, data sovereignty, and audit reasons. Explains that every pod receives a JWT token on its filesystem so it can call the API for its own information; if an attacker reached a shell and installed `kubectl`, that token would let them create pods. RBAC plus not mounting the token closes that path.
- `#L120-L168` — Starts the build: creates a ServiceAccount in the app namespace, describing it as the pod's equivalent of a user account. Argues for disabling the automounted token since the app never calls the API and each use would otherwise have to be re-minted/authorized. Runs `kubectl patch serviceaccount` with `automountServiceAccountToken: false`.
- `#L169-L213` — Creates a narrow Role with `kubectl create role sample-app -n app --verb=get,list`, and pauses to show that any `create` command can be echoed back as YAML (`-o yaml`) because everything is a manifest. Then creates the RoleBinding that both grants the ServiceAccount use of the Role and limits the Role to specific resources.
- `#L214-L258` — Wires the Deployment to the new ServiceAccount; notes in K9s under namespaces → app → SA that `default` always exists and is always used until you say otherwise, so an unused ServiceAccount grants nothing. After `kubectl set serviceaccount`, a new pod rolls out and its YAML shows `serviceAccountName: sample-app`. Mentions that pulling private images from a cloud registry also resolves through a ServiceAccount.
- `#L259-L290` — Proves it with `kubectl auth can-i get configmaps -n app --as=system:serviceaccount:...`, which answers yes, then `kubectl auth can-i get secrets`, which answers no. Calls this the easiest live RBAC check compared with manually using a token.
