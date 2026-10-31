---
source: sources/kubernetes/20261031/45-wrapping-up.txt
source_type: text
source_lines: 112
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Production recap — closes the course by listing what the cloud stage added: auto-scaling (HPA and cluster autoscaler would work unchanged on Amazon even though it was not tested there), readiness-gated safe rollouts with undo, drain survival via pod disruption budgets plus replicas, and least privilege through a scoped service account role and role binding.
- Git-driven cloud — covers GitOps with Argo CD for reconcile and self-heal, sealed secrets that decrypt inside the cluster, and the EKS migration that reused the same base with overlays changing only about four lines; one cluster was created and torn down clean with nothing left billing.
- What carried over — the same PVC bound to local-path on Kind and EBS on EKS, the same Gateway/HTTPRoute behind NGINX on Kind and an ALB on Amazon, and the same customized base via overlays; the takeaway is that the resource is the contract and the controller behind it is the environmental part.
- Learning arc and closing — the climb went foundations → proof of concept → stable → production-ready on laptops → EKS in the cloud, with one app riding from a bare pod to auto-scaled GitOps on a real cluster; points to the Kubernetes, CloudNativePG, Argo CD, and sealed-secrets docs, says to ignore stage branches, and ends with the instructor's blog/GitHub links and the Vorl project.

# L2 detail

- `#L1-L16` — Opens the final wrap-up and answers what production added: everything a cloud provider offers, starting with auto-scaling (many nodes; HPA and autoscaler would behave as in earlier chapters on Amazon) and readiness-gated safe rollouts with undo, now reachable by the whole world.
- `#L17-L32` — Continues the recap with drain survival via pod disruption budgets plus replicas so the app keeps serving through a drain, and least privilege via a scoped service account role and role binding.
- `#L33-L49` — Covers making the app cloud-native and git-driven: GitOps with Argo CD to reconcile and self-heal, sealed secrets that decrypt inside the cluster, and the EKS migration that reused the same base with only about four changed lines, making base-plus-overlay customization powerful.
- `#L50-L67` — Notes one cluster at a time was created and torn down clean with nothing billing, then traces the theme end to end: same PVC on local-path (Kind) vs EBS (EKS), same Gateway and HTTPRoute behind NGINX vs ALB, same customized base via overlays for any environment; reframes "route was the contract" as resource is the contract and the controller behind it is environmental.
- `#L68-L98` — Recaps the two-day climb — foundations, proof of concept, stable, production-ready on laptops, then Amazon EKS — with one app going from bare pod to auto-scaled GitOps on a real cloud cluster, where the diff between stages is the workshop; points to the Kubernetes, CloudNativePG, Argo CD, and sealed-secrets docs, tells viewers to disregard the stage branches, and says the hands-on experience is now a base for learning from docs.
- `#L99-L112` — Closes personally: the instructor builds on the internet, invites viewers to the blog, both GitHubs, Twitch, Twitter, and YouTube, asks for a star on the Vorl project used during the workshop, and thanks viewers for watching.
