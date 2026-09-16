---
source: kubernetes-course-transcripts
source_type: pdf
source_lines: 12431
status: absorbed
absorbed_at: 2026-09-10
created: 2026-09-10
updated: 2026-09-10
---

# Digest — kubernetes-course-transcripts

## Overview (L1)

- 0 Introduction — Course overview: one app (Bun/TypeScript API + Postgres), two days, three scenarios (POC → Stable → Production). Instructor Erik Reinert introduces the progression from imperative CLI on a local Kind cluster to declarative manifests, then to EKS with GitOps.
- 1 The Kubernetes Loop — The reconciliation loop (desired state → actual state → reconcile forever) is the core of Kubernetes. Every resource is governed by this loop; it makes the platform debuggable and highly scalable compared to imperative tools like Ansible.
- 2 Local vs Cloud Clusters — Kubernetes is a standard, not a place: one API for every environment (laptop, cloud, on-prem). Same manifests travel across environments; the definition stays, the location changes. Multi-cloud becomes trivial.
- 3 Getting Started with Kind — Installing Kind, creating a default cluster, verifying with `kubectl get pods --all-namespaces`. The kube-system namespace runs core components (CoreDNS, etcd, kindnet, API server, controller, proxy, scheduler). Out-of-box clusters lack Ingress — custom config is needed.
- 4 Create a Cluster from a Config — Building a multi-node Kind cluster via a custom config manifest (1 control-plane + 2 workers). Nodes are just containers-in-containers; Kubernetes doesn't care what underlies a node. Port 30080 is exposed for future Ingress traffic.
- 5 Running & Deleting an App — Running a bare pod imperatively with `kubectl run`. Pods are the smallest unit (abstraction around containers). Namespaces are organizational only (no security/networking isolation by default). Pods without a controller disappear when deleted.
- 6 Creating Deployments — Deployments wrap pods with lifecycle management. Self-healing demonstrated: deleting a pod triggers instant recreation. The deployment owns the pod; you change the deployment, not the pod directly.
- 7 Scaling Deployments — `kubectl scale` changes replica count. Pods are distributed across nodes. K9s TUI introduced for cluster visualization. Kubernetes does initial distribution but has no built-in rebalancing.
- 8 Self-Healing Reconciliation Loop — Setting env vars on a failing Postgres deployment; the reconciliation loop detects the fix and self-heals without manual restart. The loop retries forever — alerts and backoff must be added explicitly.
- 9 Recreating a Cluster from Scratch — Deleting and recreating the entire cluster and all deployments from scratch to build muscle memory with the CLI workflow.
- 10 Exposing Pods with Services — Services give pods internal network identity (ClusterIP). CoreDNS provides service discovery. Pod IPs are ephemeral and virtual; the cluster network is isolated from the host. Without a service, pods cannot communicate.
- 11 Using NodePort vs Port Forwarding — Three access methods: Ingress (standardized), NodePort (random host port, crude), kubectl port-forward (CLI-only proxy). NodePort assigns a random port per expose; Ingress provides consistent route-based routing.
- 12 Testing Postgres Persistence — Deleting the Postgres pod loses all data because there is no volume. Recap of POC sins: nothing in git, no health probes, no resource limits, ephemeral data, plaintext passwords.
- 13 Raft Consensus Algorithm — Imperative vs declarative mental model shift. Eventual consistency explained. Kubernetes uses the Raft consensus algorithm (leader election, quorum) for reliable distributed state. Gossip protocol mentioned as an alternative.
- 14 Manifests — Manifests are desired state written down: reviewable, diffable, recreatable, stored in git. Every manifest has apiVersion, kind, metadata, spec. `kubectl --dry-run=client -o yaml` generates manifests from CLI commands.
- 15 Deployment Manifest & Labels — Deployment manifest structure (replicas, containers, labels). `kubectl apply` vs `kubectl create`: apply is declarative and tracks last-applied configuration for rollbacks. Labels and selectors are the wiring — services find pods via label matching.
- 16 Readiness, Liveness & Startup Probes — Three health probes: startup (has the app booted?), readiness (should it get traffic?), liveness (is it stuck?). Without probes, Kubernetes cannot distinguish running from working. Requests are for scheduling, limits are for protection.
- 17 ConfigMaps, Secrets & Namespaces — ConfigMaps hold non-secret config; Secrets hold base64-encoded (not encrypted) sensitive values. Namespaces are logical separators. Creating a namespace, secret, and retrieving secret values via kubectl JSONPath.
- 18 Gateway API — Gateway API replaces legacy Ingress with a standardized, portable routing model. The route is the contract; the controller is per-environment. NGINX Gateway Fabric installed as the controller. Ingress NGINX is retired.
- 19 Rebuilding the Cluster with API Gateway — Full rebuild: cluster creation, imperative pod/deployment/service walkthrough, describe/logs/exec debugging commands, NodePort access, port-forwarding services, data-loss demonstration. POC phase complete.
- 20 Migrating to Manifests — Deleting imperative resources and recreating everything declaratively with YAML manifests. `kubectl apply` is idempotent. Multi-resource YAML files separated by `---`. K9s navigation tips.
- 21 Health Checks — Applying probes to the deployment manifest. Without probes applied, a killed process keeps running. After applying, liveness probe failure triggers automatic restart. ConfigMap changes do not trigger rollout — deployment changes do.
- 22 Service, ConfigMap & Secret — Creating namespace, ConfigMap (env vars auto-mounted via envFrom), Secret (base64 for safe transport, not encryption). Deployment updated to reference ConfigMap and Secret. Resources cannot be moved between namespaces — must redeploy.
- 23 Configuring the Gateway API — Gateway API deep dive: gateway sets up the listener, HTTPRoute defines path-to-service mapping. Controller installed (NGINX Gateway Fabric). Helm discussed and discouraged in favor of raw manifests. Operators introduced as the preferred alternative.
- 24 Patching the Control Plane — Taints and tolerations explained (Kind-specific fix for scheduling on control-plane node). Gateway and HTTPRoute manifests created. Traffic flow: user → gateway → HTTPRoute → service → deployment → pod.
- 25 Installing the CloudNativePG Operator — Operators and CRDs: a CRD teaches the API server a new Kind; an operator is the control loop that reconciles it. CloudNativePG operator installed — it manages pods, PVCs, backups, failover, credentials (like Amazon RDS).
- 26 Durable Postgres with CloudNativePG — Declaring a Postgres cluster via a few lines of YAML; the operator handles init, storage, read-only/read-write services, credential generation. Pod deletion test proves data survives (durability). Cascading dependency: app waits for operator-generated secret.
- 27 Organizing Manifests with Kustomize — Kustomize merges YAML manifests via a kustomization.yaml entry point. `kubectl apply -k` applies the merged result. Namespace inheritance from kustomization root. Functionally identical to individual applies — Kustomize adds templating.
- 28 Stable Phase Review — Recap: every POC sin fixed — declarative manifests, Kustomize base, probes, resource bounds, real Ingress, durable Postgres. Remaining gaps: manual scaling, no safe rollouts, over-permissioned service account, no node-drain story, still local only.
- 29 Autoscaling with HPA — Horizontal Pod Autoscaler dynamically adjusts replica count based on CPU target. Metrics Server must be installed first (not included in Kind). Live load test with BusyBox demonstrates scale-up and scale-down. HPA can scale on custom metrics beyond CPU.
- 30 Safe Rollouts & Rollbacks — Rolling update strategy: maxSurge/maxUnavailable, minReadySeconds, readiness-gated promotion. Breaking the image on purpose — old pods keep serving. `kubectl rollout undo` reverts to last good deployment using last-applied configuration.
- 31 PodDisruptionBudgets & Node Drains — Voluntary vs involuntary disruption. PDB sets a minimum replica floor during maintenance. `drain` cordons + evicts (honoring PDB); `uncordon` re-enables scheduling. DaemonSets survive drains. No built-in rebalancing after drain.
- 32 RBAC Least Privilege — Service accounts, roles, and role bindings (analogous to AWS IAM). Default service account is over-permissioned. Disabling automount of service account token. `kubectl auth can-i` tests permissions in real time.
- 33 GitOps with Argo CD — GitOps = git as the source of truth (a database). Argo CD drives the cluster to match git forever. One Argo CD per cluster. Installing Argo CD, retrieving admin password, accessing the web UI via port-forward.
- 34 Synchronizing Manifests — Creating an Argo CD Application resource pointing to a git repo + path. Sync policy: automated with prune and self-heal, or manual (human clicks sync). Deleting Argo CD applications can get stuck if dependent resources block deletion.
- 35 Create a Cluster on EKS — Sealed secrets introduced (encrypt secrets for git). EKS cluster creation begins in background via `eksctl create cluster -f`. EKS = managed control plane ($75/mo flat) + you pay for worker nodes. eksctl wraps CloudFormation.
- 36 Sealed Secrets — Sealed secrets operator decrypts sealed secret resources into managed secrets. `kubeseal` CLI encrypts a plain secret against the controller's key. Sealed secrets are safe to commit to git. One encryption key per cluster.
- 37 Exploring the EKS Cluster — EKS provides managed control plane, UI, add-ons (metrics server, CoreDNS, kube-proxy, VPC CNI). Worker nodes are real EC2 instances. Storage classes use EBS (GP2/GP3) instead of local paths. Same kubectl commands, different infrastructure underneath.
- 38 Cluster Storage — EBS CSI Driver — PVC is a claim over a physical volume; the provisioner is environmental (Kind → local path, EKS → EBS CSI). EBS CSI driver installed as a managed add-on. GP3 storage class created and set as default. Sealed secrets can integrate with AWS KMS; SOPS mentioned as a modern alternative.
- 39 Cloud Networking — AWS Load Balancer Controller replaces NGINX for EKS. Same gateway API manifests, but the controller creates a real ALB. Setup requires IAM policy, OIDC provider, service account, cert-manager, gateway API CRDs, and LB controller CRDs.
- 40 Exposing the Cluster — Deploying app manifests to EKS: ConfigMap, CNPG operator, Postgres cluster (with storage class adjustment), deployment, service. Gateway creates a real ALB in AWS. End-to-end test: curl through ALB → service → pod → database. Same manifests, different infrastructure.
- 41 Environment Overlays with Kustomize — Overlays patch the base for environment-specific values (Kind: NGINX class, low replicas; EKS: ALB class, high replicas, different hostnames). `kubectl kustomize` previews the merged output. Only the differences are in overlay files.
- 42 GitOps on EKS — Sealed secrets installed on EKS (one key per cluster). Secret sealed against EKS controller. Argo CD deployed on EKS. Application resource created pointing to EKS overlay path — auto-sync deploys 4 replicas immediately.
- 43 Platform Observability — Built-in signals: `kubectl top`, `kubectl events`, `kubectl rollout status`. CloudWatch observability add-on available but optional. Prometheus/Grafana/Loki have operators but are their own undertaking — reach for them when built-in signals are insufficient.
- 44 Deleting Cloud Resources — Cleanup is operational discipline. Order matters: delete Argo CD app first (stop self-healing), delete gateway (deprovisions ALB), verify ALB is gone, then `eksctl delete cluster`. Check for orphan volumes, security groups, and load balancers by tag.
- 45 Wrapping Up — Production phase recap: autoscaling, safe rollouts, drain survival, RBAC, GitOps, sealed secrets, EKS migration with same base + overlays. The entire climb: foundations → POC → stable → production. Same PVC, same gateway, same Kustomize base across both environments.

## Sections (L2)

### 0-introduction

- Locator: `[[sources/kubernetes/20260910/0-introduction.txt]]`
- Summary: Course introduction and structure. One Bun/TypeScript API + Postgres, progressed through POC (imperative CLI), Stable (declarative manifests), and Production (EKS + GitOps) over two days.
- Key claims: The course uses a single app to climb maturity stages; Day 1 is foundations + POC + stable on laptop; Day 2 is production hardening + EKS migration
- Learner-relevant: Sets expectations for the three-phase learning progression; the same app serves as the vehicle for all concepts

### 1-the-kubernetes-loop

- Locator: `[[sources/kubernetes/20260910/1-the-kubernetes-loop.txt]]`
- Summary: The reconciliation loop (desired state → actual state → reconcile) is the core of Kubernetes. It runs for every resource (containers, volumes, IPs, load balancers) and makes the platform debuggable.
- Key claims: The loop is the only truly consistent component in Kubernetes; it is analogous to cruise control, an oven thermostat, or a restaurant kitchen; it is more scalable than imperative tools like Ansible because each node self-reconciles
- Learner-relevant: Understanding the loop is the single most important takeaway — it explains self-healing, debugging, and why Kubernetes works at scale

### 2-local-vs-cloud-clusters

- Locator: `[[sources/kubernetes/20260910/2-local-vs-cloud-clusters.txt]]`
- Summary: Kubernetes is a standard, not a place. One API for every environment (laptop, cloud, on-prem). Same manifests travel across environments.
- Key claims: Kubernetes enables multi-cloud with minimal friction; the definition stays while the location changes; Kubernetes can run on phones, edge devices, and Raspberry Pis
- Learner-relevant: Removes the fear that learning Kubernetes is tied to a specific cloud provider; local learning transfers directly to production

### 3-getting-started-with-kind

- Locator: `[[sources/kubernetes/20260910/3-getting-started-with-kind.txt]]`
- Summary: Installing Kind, creating a default cluster, and verifying with kubectl. The kube-system namespace contains core components. Default clusters lack Ingress.
- Key claims: Kind runs Kubernetes entirely in Docker containers; `kubectl get pods` shows nothing but `--all-namespaces` reveals system pods; cluster config must be planned upfront (port exposure, node roles)
- Learner-relevant: First hands-on experience; establishes that local Kubernetes is viable and that cluster configuration matters from the start

### 4-create-a-cluster-from-a-config

- Locator: `[[sources/kubernetes/20260910/4-create-a-cluster-from-a-config.txt]]`
- Summary: Creating a multi-node Kind cluster from a custom config manifest with 1 control-plane and 2 worker nodes. Nodes are containers-in-containers; Kubernetes abstracts the underlying implementation.
- Key claims: Kubernetes doesn't care what underlies a node (container, VM, bare metal); port 30080 is pre-configured for future Ingress; cluster configuration is a manifest just like any other resource
- Learner-relevant: Demonstrates that cluster setup is declarative and portable; the same config pattern applies to cloud providers

### 5-running-deleting-an-app

- Locator: `[[sources/kubernetes/20260910/5-running-deleting-an-app.txt]]`
- Summary: Running a bare pod imperatively with `kubectl run`. Pods are the smallest Kubernetes unit (abstraction around containers). Namespaces are organizational only. Pods without controllers disappear when deleted.
- Key claims: CLI commands generate manifests under the hood; imperative approach is for debugging, not deployment; namespaces provide organization but no security or networking isolation by default; RBAC exists but is not enabled by default
- Learner-relevant: Establishes the pod as the atomic unit; shows why bare pods are insufficient for real workloads

### 6-creating-deployments

- Locator: `[[sources/kubernetes/20260910/6-creating-deployments.txt]]`
- Summary: Deployments wrap pods with lifecycle management and self-healing. Deleting a pod managed by a deployment triggers instant recreation with a new identity.
- Key claims: The deployment owns the pod — you change the deployment, not the pod; self-healing happens in milliseconds; after a power outage, Kubernetes brings everything back up (but may deadlock if too many pods start simultaneously)
- Learner-relevant: First experience with the controller pattern; demonstrates the core value of managed workloads

### 7-scaling-deployments

- Locator: `[[sources/kubernetes/20260910/7-scaling-deployments.txt]]`
- Summary: `kubectl scale` changes replica count. Pods are distributed across nodes. K9s TUI introduced. Kubernetes does initial distribution but has no built-in rebalancing.
- Key claims: Nodes are just where pods are allocated — they can be containers, VMs, or bare metal; Kubernetes can orchestrate VMs via KubeVirt; there is no rebalancing — pods stay where they land after a failure
- Learner-relevant: Scaling is a single command; understanding node allocation helps with capacity planning

### 8-self-healing-reconciliation-loop

- Locator: `[[sources/kubernetes/20260910/8-self-healing-reconciliation-loop.txt]]`
- Summary: Setting an env var on a failing Postgres deployment; the reconciliation loop detects the fix and self-heals without manual restart. The loop retries forever.
- Key claims: The loop keeps trying indefinitely — without backoff or alerts, failures go unnoticed; fixing the desired state is enough — no restart command needed; Kubernetes is a black box that needs signal connections (Slack, Discord, etc.)
- Learner-relevant: Demonstrates the power of declarative state — fix the config, the loop does the rest; highlights the need for alerting

### 9-recreating-a-cluster-from-scratch

- Locator: `[[sources/kubernetes/20260910/9-recreating-a-cluster-from-scratch.txt]]`
- Summary: Deleting and recreating the entire cluster and all deployments from scratch to build CLI muscle memory.
- Key claims: Kind clusters are cheap to create and destroy; the full cycle (cluster → deployments → services) can be repeated quickly
- Learner-relevant: Builds confidence in the create/destroy cycle; shows that starting over is painless

### 10-exposing-pods-with-services

- Locator: `[[sources/kubernetes/20260910/10-exposing-pods-with-services.txt]]`
- Summary: Services give pods internal network identity (ClusterIP). CoreDNS provides service discovery. The cluster network is virtual and isolated from the host.
- Key claims: Without a service, pods cannot communicate; ClusterIP addresses are virtual (not on the host network); VPN-in-cluster is a valid access pattern; Cloudflare Tunnel can replace Ingress for private access
- Learner-relevant: Services are the networking primitive that enables inter-pod communication; understanding virtual IPs is key to debugging

### 11-using-nodeport-vs-port-forwarding

- Locator: `[[sources/kubernetes/20260910/11-using-nodeport-vs-port-forwarding.txt]]`
- Summary: Three access methods compared: Ingress (standardized, route-based), NodePort (random host port, crude), kubectl port-forward (CLI-only proxy). Networking layers: pod → service → ingress.
- Key claims: NodePort gives a random port each time — not suitable for production; port-forward doesn't need a service; Ingress syncs with health cycles and waits for readiness; services use IP-based load balancing, Ingress uses Layer 7
- Learner-relevant: Clarifies when to use each access method; NodePort is for quick testing, Ingress is for production

### 12-testing-postgres-persistence

- Locator: `[[sources/kubernetes/20260910/12-testing-postgres-persistence.txt]]`
- Summary: Deleting the Postgres pod loses all data — no volume means no durability. POC phase recap: nothing in git, no probes, no resource limits, ephemeral data, plaintext passwords.
- Key claims: Pods are ephemeral by design; without a volume, data dies on restart; the POC phase intentionally did everything wrong to show what to avoid
- Learner-relevant: Volumes are the next required primitive; establishes the list of production requirements

### 13-raft-consensus-algorithm

- Locator: `[[sources/kubernetes/20260910/13-raft-consensus-algorithm.txt]]`
- Summary: Imperative vs declarative mental model. Eventual consistency explained. Kubernetes uses Raft consensus (leader election, quorum) for reliable distributed state. Gossip protocol as alternative.
- Key claims: Declarative systems have eventual consistency — the cluster is in limbo until reconciled; Raft requires quorum (majority) to elect a leader; with 3 nodes, losing 2 causes deadlock; gossip protocol trades reliability for simpler bootstrapping
- Learner-relevant: Explains why Kubernetes sometimes appears stuck; quorum explains the recommendation for odd node counts (3, 5)

### 14-manifests

- Locator: `[[sources/kubernetes/20260910/14-manifests.txt]]`
- Summary: Manifests are desired state written down: reviewable, diffable, recreatable, stored in git. Every manifest has apiVersion, kind, metadata, spec. CLI can generate manifests.
- Key claims: Manifests eliminate the need to give developers cluster access — they read git instead; `kubectl --dry-run=client -o yaml` bootstraps manifests from CLI commands; spec is validated against the kind+version schema
- Learner-relevant: The shift from imperative to declarative; manifests are the foundation of everything that follows

### 15-deployment-manifest-labels

- Locator: `[[sources/kubernetes/20260910/15-deployment-manifest-labels.txt]]`
- Summary: Deployment manifest structure. `kubectl apply` is declarative and tracks last-applied configuration for rollbacks. Labels and selectors are the wiring — services find pods via label matching.
- Key claims: Apply is idempotent — running it 100 times changes nothing; last-applied configuration enables rollbacks; labels are like "go fish" — the service asks "who has this label?"; selectors work across any resource type (pods, VMs)
- Learner-relevant: Labels are the universal discovery mechanism; understanding apply vs create is critical for operational maturity

### 16-readiness-liveness-startup

- Locator: `[[sources/kubernetes/20260910/16-readiness-liveness-startup.txt]]`
- Summary: Three health probes: startup (has the app booted?), readiness (should it get traffic?), liveness (is it stuck?). Without probes, Kubernetes only knows if a process is running, not if it's working.
- Key claims: You cannot have high availability without readiness/liveness probes; probes enable zero-downtime deployments by waiting for new pods before shifting traffic; requests are for scheduling, limits are for protection
- Learner-relevant: Health checks are non-negotiable for production; they are the bridge between "running" and "working"

### 17-configmaps-secrets-namespaces

- Locator: `[[sources/kubernetes/20260910/17-configmaps-secrets-namespaces.txt]]`
- Summary: ConfigMaps hold non-secret config; Secrets hold base64-encoded (not encrypted) sensitive values. Creating namespace, secret, and retrieving values via kubectl JSONPath.
- Key claims: Secrets are base64 encoded for safe transport of special characters, not for security; ConfigMaps can be stored in git, secrets should not be; the split between ConfigMap and Secret is about sensitivity, not mechanism
- Learner-relevant: Separating config from code; understanding that secrets are not encrypted by default is a critical security awareness point

### 18-gateway-api

- Locator: `[[sources/kubernetes/20260910/18-gateway-api.txt]]`
- Summary: Gateway API replaces legacy Ingress with standardized, portable routing. The route is the contract; the controller is per-environment. NGINX Gateway Fabric installed. Ingress NGINX is retired.
- Key claims: Gateway API lets you swap controllers without changing route definitions; Ingress NGINX was retired in March; the controller is installed once, then all routing is done via Kubernetes-native resources
- Learner-relevant: Forward-looking routing standard; learning Gateway API avoids deprecated patterns

### 19-rebuilding-cluster-with-api-gateway

- Locator: `[[sources/kubernetes/20260910/19-rebuilding-cluster-with-api-gateway.txt]]`
- Summary: Full cluster rebuild with imperative walkthrough: pod, deployment, service, NodePort, port-forwarding, data-loss demo. Debugging commands: describe, logs, exec. POC phase complete.
- Key claims: `kubectl describe` shows events which are the fastest way to diagnose issues; `kubectl exec -it` lets you shell into a pod for connectivity testing; the POC phase is what a developer would do when exploring — not how you deploy
- Learner-relevant: Consolidates all POC skills; establishes debugging workflow (describe → logs → exec)

### 20-migrating-to-manifests

- Locator: `[[sources/kubernetes/20260910/20-migrating-to-manifests.txt]]`
- Summary: Deleting imperative resources and recreating everything declaratively. `kubectl apply` is idempotent. Multi-resource YAML files separated by `---`. Kubernetes is idempotent.
- Key claims: Apply is idempotent — applying the same manifest twice yields "unchanged"; `kubectl diff` shows what will change before applying; grouping resource types in files is a common organizational pattern
- Learner-relevant: The transition point from imperative to declarative; establishes the apply/diff/apply-again workflow

### 21-health-checks

- Locator: `[[sources/kubernetes/20260910/21-health-checks.txt]]`
- Summary: Applying probes to the deployment manifest. Without probes, a killed process keeps running. After applying, liveness failure triggers automatic restart. ConfigMap changes don't trigger rollout.
- Key claims: Probes add overhead (constant health check requests); ConfigMap updates do not trigger deployment rollouts — you must trigger manually or use file-watching; health checks should test dependencies (database connectivity) not just return 200
- Learner-relevant: Probes must be in the manifest to take effect; understanding the ConfigMap/deployment lifecycle disconnect prevents a common gotcha

### 22-service-configmap-secret

- Locator: `[[sources/kubernetes/20260910/22-service-configmap-secret.txt]]`
- Summary: Creating namespace, ConfigMap (envFrom auto-mount), Secret (base64 for safe transport). Deployment updated to reference both. Resources cannot be moved between namespaces.
- Key claims: envFrom loads all ConfigMap keys as env vars; valueFrom picks a single key from a Secret; resources cannot be copied between namespaces — you must redeploy; manifests without a namespace field default to "default"
- Learner-relevant: Practical wiring of config and secrets into deployments; namespace gotcha (default namespace trap)

### 23-configuring-the-gateway-api

- Locator: `[[sources/kubernetes/20260910/23-configuring-the-gateway-api.txt]]`
- Summary: Gateway API deep dive. Gateway sets up the listener; HTTPRoute defines path-to-service mapping. NGINX Gateway Fabric controller installed. Helm discussed and discouraged. Operators introduced.
- Key claims: Helm is a template engine — export raw manifests and use kubectl apply instead; operators are preferred over Helm charts because they are Kubernetes-native and self-managing; a controller can make any resource (even your app) a first-class Kubernetes citizen
- Learner-relevant: Understanding the controller pattern; Helm vs operators decision framework

### 24-patching-the-control-plane

- Locator: `[[sources/kubernetes/20260910/24-patching-the-control-plane.txt]]`
- Summary: Taints and tolerations for Kind-specific scheduling. Gateway and HTTPRoute manifests created. Full traffic flow: user → gateway → HTTPRoute → service → deployment → pod.
- Key claims: Taints/tolerations control which pods schedule on which nodes; the gateway opens a port, the HTTPRoute defines routing rules — hundreds of apps can share one port via different hostnames/routes; API versions with "k8s" are official Kubernetes resources
- Learner-relevant: Complete mental model of traffic flow; understanding taints/tolerations for real-world scheduling

### 25-installing-the-cloudnativepg-operator

- Locator: `[[sources/kubernetes/20260910/25-installing-the-cloudnativepg-operator.txt]]`
- Summary: Operators and CRDs explained. A CRD teaches the API a new Kind; an operator is the control loop. CloudNativePG operator installed — manages pods, PVCs, backups, failover, credentials.
- Key claims: Operators are preferred over Helm for complex systems; CloudNativePG is like Amazon RDS — a few lines of YAML become a full database cluster; `kubectl get clusters` becomes as real as `get pods` once the CRD is installed
- Learner-relevant: Operators are the pattern for running complex stateful systems in Kubernetes; CRDs extend the API

### 26-durable-postgres-with-cloudnativepg

- Locator: `[[sources/kubernetes/20260910/26-durable-postgres-with-cloudnativepg.txt]]`
- Summary: Declaring a Postgres cluster via YAML; the operator handles init, storage, read-only/read-write services, credential generation. Pod deletion test proves data survives. Cascading dependency: app waits for operator-generated secret.
- Key claims: Durable means the whole ecosystem (backups, failover, disaster recovery), not just volumes; StatefulSets handle persistence but not the full durable story; operators wrap StatefulSets and add management; eventual consistency means the app will come online once Postgres resolves
- Learner-relevant: Durability is achievable in Kubernetes with the right tools; dependency ordering matters in declarative deployments

### 27-organizing-manifests-with-kustomize

- Locator: `[[sources/kubernetes/20260910/27-organizing-manifests-with-kustomize.txt]]`
- Summary: Kustomize merges YAML manifests via kustomization.yaml. `kubectl apply -k` applies the merged result. Namespace inheritance from kustomization root.
- Key claims: Kustomize is just YAML merging — functionally identical to individual applies; namespace at the kustomization root overrides all child manifests; apply -k is idempotent — no change if manifests match cluster state
- Learner-relevant: Kustomize enables reusable manifest bases; namespace inheritance is a gotcha to watch

### 28-stable-phase-review

- Locator: `[[sources/kubernetes/20260910/28-stable-phase-review.txt]]`
- Summary: Recap of stable phase: every POC sin fixed. Remaining gaps: manual scaling, no safe rollouts, over-permissioned service account, no node-drain story, still local only.
- Key claims: The learner has completed half the climb; the stable cluster is a viable development platform; production hardening adds autoscaling, RBAC, GitOps, and cloud migration
- Learner-relevant: Checkpoint assessment — what's been achieved and what remains

### 29-autoscaling-with-hpa

- Locator: `[[sources/kubernetes/20260910/29-autoscaling-with-hpa.txt]]`
- Summary: HPA dynamically adjusts replica count based on CPU target. Metrics Server must be installed first. Live load test demonstrates scale-up and scale-down.
- Key claims: Kind ships no metrics — Metrics Server is a prerequisite; HPA scales based on CPU request percentage; on a laptop, scaling distributes across cores, not physical hosts; HPA can scale on custom metrics beyond CPU (queue size, request count)
- Learner-relevant: Autoscaling is a manifest, not magic; understanding the metrics pipeline (Metrics Server → HPA) is essential

### 30-safe-rollouts-rollbacks

- Locator: `[[sources/kubernetes/20260910/30-safe-rollouts-rollbacks.txt]]`
- Summary: Rolling update strategy: maxSurge/maxUnavailable, minReadySeconds, readiness-gated promotion. Breaking the image — old pods keep serving. `kubectl rollout undo` reverts.
- Key claims: A stalled rollout is the guard rail working, not a failure; with limited cluster capacity, rollouts can deadlock (old pods won't release resources, new pods can't schedule); rollbacks use the last-applied configuration annotation
- Learner-relevant: Safe rollouts prevent downtime during bad deploys; understanding deadlock scenarios prevents production incidents

### 31-poddisruptionbudgets-node-drains

- Locator: `[[sources/kubernetes/20260910/31-poddisruptionbudgets-node-drains.txt]]`
- Summary: Voluntary vs involuntary disruption. PDB sets minimum replica floor. Drain cordons + evicts (honoring PDB). Uncordon re-enables scheduling. DaemonSets survive drains.
- Key claims: PDB ensures a minimum number of pods stay available during maintenance; drain respects PDB — it will refuse to evict if it violates the budget; there is no Kubernetes rebalancing after drain; DaemonSets run on every host and cannot be moved
- Learner-relevant: Production clusters need PDBs for safe maintenance; understanding drain/uncordon/cordon vocabulary

### 32-rbac-least-privilege

- Locator: `[[sources/kubernetes/20260910/32-rbac-least-privilege.txt]]`
- Summary: Service accounts, roles, and role bindings (analogous to AWS IAM). Default service account is over-permissioned. Token automount disabled. `kubectl auth can-i` tests permissions.
- Key claims: Every pod gets a JWT token that can talk to the Kubernetes API — if compromised, an attacker could create pods; RBAC restricts what that token can do; disabling automountServiceAccountToken forces per-request authorization
- Learner-relevant: Security hardening — pods should have minimum necessary permissions; `auth can-i` is a fast way to verify RBAC

### 33-gitops-with-argo-cd

- Locator: `[[sources/kubernetes/20260910/33-gitops-with-argo-cd.txt]]`
- Summary: GitOps = git as the source of truth. Argo CD drives the cluster to match git forever. One Argo CD per cluster. Installation, admin password retrieval, web UI access.
- Key claims: GitOps needs no pipeline — just files in a repo; Argo CD is the reconciliation loop applied to git; the web UI is accessible via port-forward; Argo CD generates its own admin password as a secret
- Learner-relevant: GitOps is the deployment model for production; Argo CD makes it visual and auditable

### 34-synchronizing-manifests

- Locator: `[[sources/kubernetes/20260910/34-synchronizing-manifests.txt]]`
- Summary: Creating an Argo CD Application resource pointing to a git repo + path. Sync policy: automated (prune + self-heal) or manual (human clicks sync). Deleting applications can get stuck.
- Key claims: The Application CRD is a CRD from argoproj.io; sync policy with automated + prune + selfHeal means every commit triggers deployment; disabling sync gives manual deploy control; deleting Argo CD apps can deadlock if gateway resources block
- Learner-relevant: Argo CD sync policy is the key decision — auto vs manual; understanding deletion ordering prevents stuck resources

### 35-create-a-cluster-on-eks

- Locator: `[[sources/kubernetes/20260910/35-create-a-cluster-on-eks.txt]]`
- Summary: EKS cluster creation via eksctl. Sealed secrets introduced. EKS = managed control plane ($75/mo) + you pay for worker nodes. eksctl wraps CloudFormation.
- Key claims: EKS control plane is fully managed — you never SSH into it; the $75/mo is for the API layer only; worker nodes are your cost; eksctl uses CloudFormation under the hood; sealed secrets encrypt values for git
- Learner-relevant: EKS migration is straightforward when manifests are portable; understanding the cost model (control plane + workers)

### 36-sealed-secrets

- Locator: `[[sources/kubernetes/20260910/36-sealed-secrets.txt]]`
- Summary: Sealed secrets operator decrypts sealed resources into managed secrets. `kubeseal` CLI encrypts against the controller's key. One key per cluster. Sealed secrets are safe to commit.
- Key claims: The sealed secret controller manages the secret lifecycle — if the sealed secret changes, the managed secret changes; one encryption key per cluster means secrets must be re-sealed for each cluster; never commit the unencrypted secret alongside the sealed one
- Learner-relevant: Git-safe secret management; the per-cluster key model has operational implications for multi-cluster setups

### 37-exploring-the-eks-cluster

- Locator: `[[sources/kubernetes/20260910/37-exploring-the-eks-cluster.txt]]`
- Summary: EKS provides managed control plane, UI, add-ons. Worker nodes are real EC2 instances. Storage uses EBS (GP2/GP3). Same kubectl commands, different infrastructure.
- Key claims: EKS API endpoint is public by default (can be made private via VPC); add-ons (metrics server, CoreDNS, kube-proxy) are one-click installs; storage classes use real EBS volumes; the same kubectl commands work identically
- Learner-relevant: The portability promise delivered — same commands, same resources, real cloud infrastructure

### 38-cluster-storage-ebs-csi

- Locator: `[[sources/kubernetes/20260910/38-cluster-storage-ebs-csi.txt]]`
- Summary: PVC is a claim over a physical volume; the provisioner is environmental. EBS CSI driver installed as managed add-on. GP3 storage class created as default. Sealed secrets can integrate with KMS; SOPS mentioned.
- Key claims: PVC is the contract, provisioner is environmental (Kind → local path, EKS → EBS); GP3 offers better baseline performance than GP2 with decoupled IOPS; "wait for first consumer" binds the volume where the pod lands; SOPS is a modern alternative to sealed secrets for KMS integration
- Learner-relevant: Storage is portable via PVCs — the underlying volume type is an implementation detail

### 39-cloud-networking

- Locator: `[[sources/kubernetes/20260910/39-cloud-networking.txt]]`
- Summary: AWS Load Balancer Controller replaces NGINX for EKS. Same gateway API manifests create a real ALB. Setup requires IAM policy, OIDC, service account, cert-manager, CRDs.
- Key claims: The route is the contract, the controller is environmental — on Kind it's NGINX, on EKS it's an ALB; EKS requires explicit IAM wiring (OIDC provider, IAM policy, service account) for the LB controller to create AWS resources; this IAM complexity is why people find EKS frustrating
- Learner-relevant: Cloud networking requires provider-specific IAM setup, but the gateway manifests remain portable

### 40-exposing-the-cluster

- Locator: `[[sources/kubernetes/20260910/40-exposing-the-cluster.txt]]`
- Summary: Deploying app manifests to EKS. Gateway creates a real ALB. End-to-end test: curl through ALB → service → pod → database. Storage class adjustment needed (Kind-specific → EKS-compatible).
- Key claims: Creating a gateway on EKS produces a real ALB in AWS; the same HTTPRoute manifest works on both Kind and EKS; storage class names differ between environments ( Kind's local-path vs EKS's GP3) — overlays handle this
- Learner-relevant: The portability proof — same app, same manifests, different cloud, working end-to-end

### 41-environment-overlays-with-kustomize

- Locator: `[[sources/kubernetes/20260910/41-environment-overlays-with-kustomize.txt]]`
- Summary: Overlays patch the base for environment-specific values. Kind overlay: NGINX class, low replicas. EKS overlay: ALB class, high replicas, different hostnames. Only differences are in overlay files.
- Key claims: Overlays are just patches against the base — the base stays untouched; a kustomization.yaml in the overlay imports the base and lists patch files; `kubectl kustomize` previews the merged output for diffing between environments
- Learner-relevant: Multi-environment management with minimal duplication; the base+overlay pattern scales to any number of environments

### 42-gitops-on-eks

- Locator: `[[sources/kubernetes/20260910/42-gitops-on-eks.txt]]`
- Summary: Sealed secrets installed on EKS (one key per cluster). Secret sealed against EKS controller. Argo CD deployed. Application resource auto-syncs from EKS overlay path.
- Key claims: Each cluster has its own sealed secrets key — secrets must be re-sealed per cluster; Argo CD on EKS works identically to Kind; auto-sync immediately reconciles the cluster to match git
- Learner-relevant: GitOps on EKS is the same pattern as local — the learner now has a fully git-driven production cluster

### 43-platform-observability

- Locator: `[[sources/kubernetes/20260910/43-platform-observability.txt]]`
- Summary: Built-in signals: `kubectl top`, events, rollout status. CloudWatch add-on available. Prometheus/Grafana/Loki have operators but are a separate undertaking.
- Key claims: `kubectl top` works without any additional install (with Metrics Server); CloudWatch observability is a click-to-install add-on; Prometheus/Grafana/Loki are their own operational burden — reach for them only when built-in signals are insufficient
- Learner-relevant: Start with built-in observability; don't over-invest in monitoring stacks prematurely

### 44-deleting-cloud-resources

- Locator: `[[sources/kubernetes/20260910/44-deleting-cloud-resources.txt]]`
- Summary: Cleanup is operational discipline. Order: delete Argo CD app → delete gateway (deprovisions ALB) → verify ALB gone → eksctl delete cluster → check for orphans.
- Key claims: Argo CD will recreate deleted resources if the app still exists — delete the Argo CD app first; deleting the gateway triggers the controller to delete the ALB in AWS; orphan resources (volumes, security groups) must be checked by tag; a forgotten cluster is a bill you didn't budget for
- Learner-relevant: Cloud cleanup requires ordered teardown; verification prevents surprise bills

### 45-wrapping-up

- Locator: `[[sources/kubernetes/20260910/45-wrapping-up.txt]]`
- Summary: Production phase recap: autoscaling, safe rollouts, drain survival, RBAC, GitOps, sealed secrets, EKS migration with same base + overlays. The entire climb: foundations → POC → stable → production.
- Key claims: The same PVC bound to local path on Kind binds to EBS on EKS; the same gateway/HTTPRoute ran behind NGINX on Kind and behind ALB on EKS; the Kustomize base + overlay pattern works across any environment; resource is the contract, controller is environmental
- Learner-relevant: The full journey is complete — the learner has gone from bare pods to auto-scaled, git-driven production on a real cloud cluster
