---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 29
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 29)

## Overview (L1)

- 0151. Final Touches — Fixes portal modal spam by gating open/close on a `previouslyIsNear` flag so each fires once per proximity cycle; adds auto-close on exit and a two-material visual indicator (white when near, cyan when far).
- 0152. Thank You! — Instructor's closing message thanking the learner for their time and investment, congratulating them on finishing, and encouraging them to keep building.

## Sections (L2)

### 0151

- Locator: `[[sources/three-js/20260907/0151. Final Touches.srt#0151]]`
- Summary: The portal modal was firing `openModal` every frame while the player stood near it, so clicks to close were ignored because the open loop kept running. The fix stores a `previouslyIsNear` boolean: open only fires on the rising edge (entering proximity), close only fires on the falling edge (leaving proximity). A `closeModal` call is also added in the else branch so the modal auto-dismisses when the player walks away. Finally, two `MeshBasicMaterial` instances (white `portalOpenMaterial`, cyan `portalFarMaterial`) are swapped on the portal mesh to give a live visual cue of the proximity state.
- Key claims: Per-frame proximity checks cause method spam that blocks user input; a single boolean edge-detector (`previouslyIsNear`) collapses repeated triggers into one event per state change; auto-close on exit removes the need for a manual close click; material swapping is a cheap way to reflect interaction state visually.
- Learner-relevant: Teaches a reusable edge-detection pattern for any "trigger once per entry/exit" interaction in a render loop; shows how to wire `closeModal` to the same state machine; demonstrates using material instances as a visual state indicator for portal/zone-based UX.

### 0152

- Locator: `[[sources/three-js/20260907/0152. Thank You!.srt#0152]]`
- Summary: The instructor closes the course by thanking the learner for spending their limited time and money on a long, hard skill. They note that many start but give up, so reaching the end is worth congratulating. The message frames the course as a foundation, not a finish line, and wishes the learner luck on whatever comes next.
- Key claims: Finishing a long course is an achievement because most learners drop off; the real outcome is the ability to keep learning and building on your own; the course is a starting point, not the end of the journey.
- Learner-relevant: Anchors the emotional payoff of completing the bootcamp and reinforces the mindset that the skills gained are a launchpad for future projects, not a checkbox.
