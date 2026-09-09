---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 18
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 18)

## Overview (L1)

- 0100. Fixed Objects — Create ground geometry and a fixed rigid body in Rapier; sync Three.js mesh position/rotation with the rigid body so the physics engine respects initial transforms; demonstrate the tedious manual workflow of adding multiple dynamic objects.
- 0101. Physics Helper Functions — Refactor repetitive physics setup into a `physics.add(mesh)` helper that creates rigid bodies and colliders; store mesh–rigid-body associations in a `Map`; introduce an app state store to gate environment creation until Rapier finishes async loading.
- 0102. Auto Compute Cuboid Dimensions — Replace hardcoded cuboid half-extents with auto-computed dimensions from the geometry's bounding box; handle mesh scaling via `getWorldScale`; abstract the logic into a reusable `computeDimensions` function.

## Sections (L2)

### 0100

- Locator: `[[sources/three-js/20260907/0100. Fixed Objects.srt#0100]]`
- Summary: Builds the ground mesh and a fixed rigid body so dynamic cubes land on it; shows that the rigid body is the source of truth, so mesh position/rotation must be copied into the rigid body via `setTranslation` and `setRotation`; walks through the verbose manual steps needed to add a second dynamic cube.
- Key claims: A fixed rigid body does not respond to gravity but still collides with dynamic bodies; mesh transforms are overwritten each frame by the rigid body unless synced at creation; every new mesh requires its own rigid body, collider, and per-frame sync code.
- Learner-relevant: Establishes why a physics helper layer is needed and what problem it must solve — eliminating per-object boilerplate while keeping Three.js meshes in lockstep with Rapier bodies.

### 0101

- Locator: `[[sources/three-js/20260907/0101. Physics Helper Functions.srt#0101]]`
- Summary: Moves mesh creation out of the physics class into the environment; adds a `physics.add(mesh)` method that creates a rigid body, sets its transform from the mesh, builds a cuboid collider, and registers the body in the world; stores mesh↔rigid-body pairs in a `Map` so the update loop can sync all meshes automatically; introduces an `appStateStore` with a `physicsReady` flag so the environment waits for Rapier's async load before instantiating.
- Key claims: Centralizing physics setup behind an `add` method decouples Three.js scene code from Rapier internals; a `Map` lets the update loop iterate over every mesh–body pair without manual per-object references; an app state store is the coordination primitive for async module readiness.
- Learner-relevant: Gives the learner a reusable pattern for wrapping a physics engine behind a clean API, plus a concrete example of async-load gating in a Three.js + Rapier app.

### 0102

- Locator: `[[sources/three-js/20260907/0102. Auto Compute Cuboid Dimensions.srt#0102]]`
- Summary: Replaces hardcoded collider half-extents with dimensions auto-computed from the geometry's bounding box; calls `geometry.computeBoundingBox()` then `boundingBox.getSize(tempVec)` to read world-space dimensions; multiplies by `mesh.getWorldScale(tempVec)` so scaled meshes still produce correct colliders; wraps the logic in a `computeDimensions(mesh)` helper so it can be reused for spheres and trimesh colliders later.
- Key claims: `Box3.getSize()` requires a pre-allocated `Vector3` argument that it mutates in place; `getWorldScale` (not `getScale`) returns the absolute scale needed for physics; bounding-box computation works for any geometry type (box, cylinder, custom), making cuboid colliders a cheap approximation for complex shapes.
- Learner-relevant: Teaches the learner how to derive physics shapes from visual geometry automatically, a foundational technique for scalable physics integration.
