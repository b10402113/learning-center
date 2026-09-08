---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 22
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 22)

## Overview (L1)

- 0117. Setting Up Our Body — Builds a kinematic-position-based movement system by reading the rigid body translation each frame, adding a motion vector, and copying the result back to the mesh; introduces vector normalization and scalar multiplication to control speed.
- 0118. Implementing Character Controller — Creates a Rapier `CharacterController` with a small collider offset, then uses `computeColliderMovement` + `computedMovement` to get collision-adjusted motion so the character stops at walls instead of passing through.
- 0119. Factoring in Framerate — Diagnoses frame-rate-dependent movement (faster on 120 Hz, slower on low-power 30 Hz) and fixes it by multiplying the motion scalar by `deltaTime` so speed becomes consistent across devices.
- 0120. Character Controller Properties — Explores controller features: `setApplyImpulsesToDynamicBodies` to push dynamic objects, `enableAutoStep` with max height / min width to climb stairs, `enableSnapToGround` to stick when walking down, and a simple constant downward velocity for gravity.
- 0121. Introduction and First Person Camera — Introduces camera-controller concepts (first-person vs third-person), disables OrbitControls, accesses the character through the world subscription with optional chaining, and copies the rigid-body translation to the camera position to get a first-person view.
- 0122. Basic Third Person Camera — Offsets the camera above and behind the character, uses `camera.lookAt` on a Three.js `Vector3` copy of the rigid-body translation, and shows how to re-enable OrbitControls with `controls.target` for a shoulder-look feel.
- 0123. Cleanup and Lerp — Refactors camera offsets into reusable `cameraOffset` / `targetOffset` vectors, applies quaternion rotation so offsets follow character orientation, and uses `Vector3.lerp` with a smoothing factor to remove jittery camera follow.

## Sections (L2)

### 0117

- Locator: `[[sources/three-js/20260907/0117. Setting Up Our Body.srt#0117]]`
- Summary: Rebuilds the per-frame movement loop on top of the existing Rapier rigid body and collider; reads `rigidBody.translation()`, adds a motion vector built from input axes, writes the result back with `setNextKinematicTranslation()`, and copies the translation to the mesh. Introduces `Vector3` normalization and `multiplyScalar` to turn the raw direction into a controllable speed.
- Key claims: The motion vector must be reset each frame so the character stops when no key is held; `rigidBody.translation()` is not a Three.js `Vector3`, so it must be copied into one before calling `add`; normalizing the motion vector makes it one unit long so the scalar directly maps to speed (e.g. 0.3).
- Learner-relevant: Gives a reusable pattern for kinematic movement that mirrors the physics lesson but lives inside the render loop; anchors vector normalization and scalar speed control as tools reused throughout the character system.

### 0118

- Locator: `[[sources/three-js/20260907/0118. Implementing Character Controller.srt#0118]]`
- Summary: Creates a `CharacterController` via `world.createCharacterController(0.01)`; the offset is a small shape margin low enough to avoid math glitches but not noticeable. After building the motion vector, calls `characterController.computeColliderMovement(collider, motion)` and then `characterController.computedMovement()` to get collision-adjusted displacement that stops at walls.
- Key claims: The character controller does not move the body by itself — it only computes adjusted movement that the caller must apply; passing `computedMovement()` into `setNextKinematicTranslation` makes the character respect collisions with both fixed and dynamic bodies.
- Learner-relevant: Provides the collision-aware layer on top of the raw kinematic motion from 0117; establishes the two-call Rapier pattern (`computeColliderMovement` then `computedMovement`) that later steps extend with auto-step and snap-to-ground.

### 0119

- Locator: `[[sources/three-js/20260907/0119. Factoring in Framerate.srt#0119]]`
- Summary: Points out that the current controller is frame-rate-dependent — a 120 Hz device moves twice as fast as a 60 Hz one, and a low-power 30 Hz device moves half as fast. Fixes it by threading `deltaTime` from the world loop into the character and multiplying the motion scalar by `deltaTime` so the effective speed is consistent.
- Key claims: Frame-dependent motion is a bug because the same input yields different speeds on different hardware; multiplying the speed factor by `deltaTime` makes the experience frame-rate-independent, though the raw number then needs tuning (e.g. ×20) to feel right.
- Learner-relevant: Anchors the universal "multiply by deltaTime" rule for any per-frame movement; gives a concrete example of why frame independence matters for cross-device web games.

### 0120

- Locator: `[[sources/three-js/20260907/0120. Character Controller Properties.srt#0120]]`
- Summary: Walks through controller properties: `setApplyImpulsesToDynamicBodies(true)` lets the character push dynamic objects; `enableAutoStep({ maxHeight, minWidth, ... })` enables climbing stairs where `maxHeight` limits step height and `minWidth` prevents scaling overly steep surfaces; `enableSnapToGround(distance)` keeps the character stuck to the floor when walking down. Gravity is implemented by overwriting `motion.y` with a constant negative value rather than relying on Rapier's built-in gravity.
- Key claims: The controller does not apply gravity by default, giving the developer full control over whether and how gravity behaves; overwriting `motion.y` after normalizing x/z preserves horizontal speed while adding constant downward velocity; constant downward speed is acceptable for most games unless physically accurate acceleration is required.
- Learner-relevant: Gives a menu of ready-to-use controller behaviors (push, step-up, snap, gravity) that can be toggled per game; clarifies that character-controller gravity is a design choice, not a physics default.

### 0121

- Locator: `[[sources/three-js/20260907/0121. Introduction and First Person Camera.srt#0121]]`
- Summary: Introduces first-person vs third-person camera concepts, disables OrbitControls, and accesses the character from the camera loop via `this.application.world.character`. Because the character is wrapped in a physics-ready subscription, it may be undefined for the first few frames; optional chaining (`?.`) prevents errors. Copies the rigid-body translation to `instance.camera.position` to produce a first-person view.
- Key claims: The character is not available immediately because its creation waits on the physics subscription; optional chaining returns `undefined` instead of throwing, so the camera update is simply skipped until the character exists; copying the rigid-body translation directly to the camera yields a first-person perspective.
- Learner-relevant: Shows how to bridge the character system and the camera system through the world singleton; establishes the guard pattern (check character existence before updating camera) reused for third-person offsets.

### 0122

- Locator: `[[sources/three-js/20260907/0122. Basic Third Person Controller.srt#0122]]`
- Summary: Offsets the camera above and behind the character by adding to the rigid-body translation, then uses `camera.lookAt` on a Three.js `Vector3` copy of the translation so the camera looks down at the character. Also demonstrates re-enabling OrbitControls and setting `controls.target` to the character position for a shoulder-look controller.
- Key claims: The camera offset is applied by adding to the rigid-body translation, so the camera follows the character's vertical movement; `camera.lookAt` requires a Three.js `Vector3`, so the Rapier translation must be copied first; OrbitControls can coexist by pointing `controls.target` at the character.
- Learner-relevant: Provides the basic third-person recipe (offset + lookAt) and shows how to layer OrbitControls on top for user-aimable cameras.

### 0123

- Locator: `[[sources/three-js/20260907/0123. Cleanup and Lerp.srt#0123]]`
- Summary: Refactors the camera code into reusable `cameraOffset` and `targetOffset` vectors, applies `applyQuaternion` using the rigid-body rotation so offsets follow character orientation, and uses `Vector3.lerp(target, factor)` to smoothly interpolate the camera toward the desired position instead of snapping to it. A small lerp factor (e.g. 0.05) removes the jittery feel when the character steps or changes direction.
- Key claims: Directly copying the character position makes the camera rigid and jittery; `lerp` with a factor between 0 and 1 introduces lag that feels like the camera is trailing the player; applying the rigid-body quaternion to the offsets ensures the camera stays behind the character even when it rotates.
- Learner-relevant: Gives a clean, reusable camera-follow module (offset vectors + quaternion + lerp) that can be dropped into any third-person project; anchors lerp as the standard smoothing tool for follow cameras.
