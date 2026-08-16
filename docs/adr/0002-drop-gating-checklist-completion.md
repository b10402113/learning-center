# Drop tier gating; completion is a derived checklist

Status: proposed

We remove the boss-battle gating system — tier unlocking, `progress.tiers`, the tower view, and the associated lock/boss UI — and define completion as a pure checklist: the learner manually marks each element complete, and a node is complete automatically once every item in its list is complete (its taught elements plus its main article; a node with no elements requires only its main article). The site keeps the Roadmap and Nebula views.

## Considered Options

- **Keep gating.** The prior PRD's tier gates (beat a tier boss to unlock the next) and the tower view. Rejected: the learner wants a frictionless read-and-check model with no unlock mechanics.
- **Manual node marking with derived auto-completion.** Kept `progress.nodes` as an override for unwritten content. Rejected: node completion should be fully derived; there is no manual node state anymore.

## Consequences

- `progress.nodes` and `progress.tiers` disappear from stored state; only element completion remains.
- Tier unlock thresholds, boss states, and the `TowerMap`/`RoadMap` lock rendering are deleted.
- The interactive `/quiz` skill is no longer a gate; quizzes become `question` elements inside a node's list that must be answered correctly before being checked off.
