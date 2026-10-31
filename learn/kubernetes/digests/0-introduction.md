---
source: sources/kubernetes/20261031/0-introduction.txt
source_type: text
source_lines: 205
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Course framing — Erik Reinert introduces himself and the course's "one app, two days, three scenarios" structure, promising a simple Bun/TypeScript API backed by Postgres as the thing to host.
- Learning path — the three scenarios are proof of concept, stable (declarative manifests handed to a teammate), and production (auto-scaling with GitOps on a real EKS cluster); day one is Kubernetes on a laptop, day two is Kubernetes in the cloud.
- No commands yet — the lesson is purely orientation: why people love or hate Kubernetes, why foundations come before the first cluster, and why learners should pick something to host.

# L2 detail

- `#L1-L42` — Instructor introduction: Erik Reinert ("Black Glasses"), senior software engineer, diagram/flowchart artist; career progression frontend (2 years) → backend (2 years) → full stack → DevOps/platform engineering, plus his open-source build system Vorl.
- `#L43-L86` — Promotes his existing course catalog as a curated DevOps learning path, explaining which course fits which interest (high-scale/terraform enterprise cloud, backend architecture, etc.).
- `#L87-L119` — Course introduction framing: why Kubernetes is so hard to introduce; the polarization where people either adopt it everywhere or try it once, hate it, and complain to those who use it; assertion that it is a very powerful platform.
- `#L120-L151` — The core premise "one app, two days, three scenarios": a simple Bun TypeScript API plus Postgres, deliberately meaningless as an application; advice for DevOps beginners to just find something to host (his own first host was Apache web server, then NGINX).
- `#L152-L179` — Defines the three maturity scenarios: "proof of concept" showing how most people first get comfortable (and fail on purpose), "stable" using declarative manifests stored and shared, and "production" tomorrow with auto-scaling and GitOps on a real Amazon cluster.
- `#L180-L205` — Shape of both days: day one covers foundations first (with a driving-a-car analogy for learning concepts before use), then proof of concept, then stable; day two builds a production-esque platform on the laptop and moves it to EKS, climbing one maturity stage at a time.
