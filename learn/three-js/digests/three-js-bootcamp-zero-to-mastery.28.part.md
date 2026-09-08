---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf921ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 28
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 28)

## Overview (L1)

- 0147. Adding Shadows — Recaps the four-step shadow pipeline (shadow map, castShadow, receiveShadow), then fixes shadow acne via `bias` and `normalBias`, switches to `PCFSoftShadowMap`, and experiments with renderer tone mapping (ACESFilmic, Cineon) and exposure.
- 0148. Introduction and Recap — Introduces the modal/portal interaction system: a `ModalManager` and `ModalContentProvider` are prebuilt in the UI folder; the learner will wire three portals to open modals when the player approaches, using a new `Portal` class instantiated in the environment.
- 0149. Setting up Portals — Shows how to instantiate the `Portal` class three times, retrieve each portal mesh from the scene via `scene.getObjectByName`, and pass modal content (about me, projects, contact) fetched from `ModalContentProvider.getModalInfo` into each portal constructor.
- 0150. Detecting Player Distance — Implements per-frame proximity detection: the portal's `loop` method reads `character.instance.position`, computes `distanceTo` against the portal's world position (`getWorldPosition`), and calls `modalManager.openModal` when the player is within 1.5 units.

## Sections (L2)

### 0147

- Locator: `[[sources/three-js/20260907/0147. Adding Shadows.srt#0147]]`
- Summary: Walks through enabling `instance.shadowMap.enabled`, adding a `DirectionalLightShadowHelper` to visualize the shadow camera frustum, expanding the shadow camera frustum (top/left/bottom/right), then iterating the scene to assign `castShadow` and `receiveShadow` to objects tagged as shadow casters/receivers. Diagnoses shadow acne on the terrain (which both casts and receives) and fixes it by tuning `directionalLight.shadow.bias` and `normalBias`. Switches the shadow map type to `PCFSoftShadowMap` for softer edges. Concludes by demonstrating renderer tone mapping (`ACESFilmicToneMapping`, `CineonToneMapping`) and `toneMappingExposure` to adjust the final look.
- Key claims: Shadow acne occurs when an object both casts and receives shadows due to precision errors; `bias` pushes the shadow away from the object, while `normalBias` accounts for surface normals/angles. `PCFSoftShadowMap` trades a small performance cost for visually softer shadows. Tone mapping remaps HDR to SDR; three.js approximates the look rather than implementing true filmic tone mapping, so the workflow is to try values and keep what looks good.
- Learner-relevant: Gives a repeatable shadow-tuning checklist (enable map → expand frustum → assign casters/receivers → fix acne with bias → pick soft shadows) and introduces tone mapping as a renderer-level aesthetic lever.

### 0148

- Locator: `[[sources/three-js/20260907/0148. Introduction and Recap.srt#0148]]`
- Summary: Sets the goal for the next few lessons: when the player walks near one of three portals, open a corresponding HTML/CSS modal. The instructor prebuilt `ModalManager` (exposes `openModal(title, description)`) and `ModalContentProvider` (exposes `getModalInfo(portalName)`) so the learner can focus on three.js logic rather than UI. Demonstrates attaching `modalManager` to `window` for console testing. Introduces the `Portal` class, to be instantiated in the environment, and notes a refactor that collapsed three scene traversals into one loop checking shadow caster/receiver/physical tags.
- Key claims: The modal UI layer is intentionally prebuilt because the course is not an HTML/CSS course; the learner only needs to call `openModal` from three.js. The `Portal` class encapsulates per-portal detection and modal triggering. Scene traversal was optimized from three passes to one by branching on object tags.
- Learner-relevant: Establishes the interaction architecture (Portal class → ModalManager → ModalContentProvider) and clarifies scope: three.js wiring, not UI authoring.

### 0149

- Locator: `[[sources/three-js/20260907/0149. Setting up Portals.srt#0149]]`
- Summary: Adds an `addPortals` method to the environment, imports the `Portal` class, and instantiates three portals. Each portal receives its mesh (looked up via `scene.getObjectByName('Portal' | 'Portals_001' | 'Portals_002')`) and its modal info (fetched from `ModalContentProvider.getModalInfo` for 'aboutMe', 'projects', 'contactMe'). Logs confirm the three instances and their distinct modal payloads.
- Key claims: A JavaScript class can serve as a template for multiple instances that share behavior but differ by constructor arguments (mesh + modal info). Blender appends `_001`, `_002` to duplicate names, so the lookup strings must match the exported scene. `ModalContentProvider.getModalInfo` centralizes the per-portal title/description content.
- Learner-relevant: Shows how to bridge scene-graph objects (portal meshes) with application data (modal content) by injecting both into a reusable class instance.

### 0150

- Locator: `[[sources/three-js/20260907/0150. Detecting Player Distance.srt#0150]]`
- Summary: Implements the portal `loop` method: reads `this.app.world.character.instance.position`, guards against the character not yet existing (environment loads before character), computes distance via `character.position.distanceTo(portalWorldPosition)`, and opens the modal when distance < 1.5. Emphasizes using `mesh.getWorldPosition(tmpVector3)` instead of `.position` because the environment/scene is moved, so local position would be wrong. Wires the portal loops into the existing update chain by adding an `environment.loop` that calls each portal's loop, called from `world.loop` via the loop utility.
- Key claims: `character.instance` is undefined until the character spawns, so the portal loop must guard for it. `getWorldPosition` is required whenever a mesh's parent has been transformed; `.position` is only local. The loop utility already calls `world.loop`; adding `environment.loop` and `portal.loop` extends the frame update chain without touching the core loop.
- Learner-relevant: Teaches a robust proximity-check pattern (guard → world-space position → distanceTo → threshold) and how to extend an existing frame-loop hierarchy by one layer.
