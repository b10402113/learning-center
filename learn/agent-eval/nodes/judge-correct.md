---
id: judge-correct
title: "Correct & quantify the judge: Rogan-Gladen + bootstrap CI"
subject: agent-eval
tier: 2
order: 4
status: draft
goal: "De-bias an observed pass rate with the Rogan-Gladen estimator, wrap it in a bootstrap 95% CI, and decide ship/hold from interval width vs. threshold."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# Correct & quantify the judge: Rogan-Gladen + bootstrap CI

## Lesson

Here the judge becomes a measuring instrument: you correct its imperfect TPR/TNR with the Rogan-Gladen estimator and put a bootstrap confidence interval around the result. The payoff is the course's core judgment — deciding to ship or hold from the interval width against a threshold, not from a single point estimate.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
