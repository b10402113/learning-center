---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 21
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 21)

## Overview (L1)

- 0112. Controlling Our Mesh — Connects the input controller to the character mesh, mapping forward/back/left/right to z/x axis increments on the mesh position. A rough first pass that ignores camera rotation.
- 0113. Moving Dynamic Bodies — Introduces dynamic rigid bodies driven by physics methods: addForce (constant push), applyImpulse (one-time acceleration), addTorque/applyTorqueImpulse (rotation). Shows how forces keep applying per-frame and how dynamic bodies can be knocked around unpredictably.
- 0114. Moving Kinematic Bodies — Covers kinematic velocity-based (setLinvel) and position-based (setNextKinematicTranslation) rigid bodies. Kinematic bodies respond to user input but are not pushed by other forces; the section shows how to combine axes for diagonal movement and how to reset velocity each frame so the body stops on key release.
- 0115. Comparing Character Controllers — Compares dynamic vs kinematic trade-offs: dynamic bodies obey physics but are unpredictable; kinematic bodies give full control but lack gravity, stairs, and fixed-body collision out of the box. Introduces Rapier's dedicated Character Controller as the solution.
- 0116. Introduction — Introduces the Rapier Character Controller (added Feb 2023). It is not a rigid body but a "computer" that takes a desired movement vector, checks the scene (colliders, walls, stairs), and returns a corrected vector so the character respects obstacles, snaps to ground, and auto-steps stairs.

## Sections (L2)

### 0112

- Locator: `[[sources/three-js/20260907/0112. Controlling Our Mesh.srt#0112]]`
- Summary: Maps input controller properties (forward, backward, left, right) to mesh position changes: forward = -z, backward = +z, left = -x, right = +x. Acknowledges this is a rough approach that breaks when the camera rotates.
- Key claims: Forward maps to negative z because the camera looks down -z; left/right map to negative/positive x respectively.
- Learner-relevant: Establishes the input-to-mesh pipeline that later sections replace with physics-driven movement.

### 0113

- Locator: `[[sources/three-js/20260907/0113. Moving Dynamic Bodies.srt#0113]]`
- Summary: Adds a dynamic rigid body to the physics world and exposes it from the physics class so the update loop can call methods on it. Demonstrates addForce (continuous push while key held), applyImpulse (acceleration with slide-to-stop), addTorque (continuous rotation), and applyTorqueImpulse (one-time rotational kick). Explains the `wake` parameter must be true so sleeping bodies still respond.
- Key claims: addForce applies constant velocity per frame (like constant wind); applyImpulse applies acceleration that decays due to friction; torque methods mirror force methods but affect rotation. Dynamic bodies can be knocked off course by other dynamic objects, which is undesirable for a player character.
- Learner-relevant: Shows the Rapier rigid-body API (addForce, applyImpulse, addTorque, applyTorqueImpulse) and the sleep/wake optimization that can silently disable collisions.

### 0114

- Locator: `[[sources/three-js/20260907/0114. Moving Kinematic Bodies.srt#0114]]`
- Summary: Extends the physics helper to support kinematic velocity-based and position-based rigid bodies. Velocity-based bodies use setLinvel with a per-frame reset to zero so the body stops when input releases; combining axes requires accumulating x/y/z into a single vector before calling setLinvel. Position-based bodies read the current translation, add the movement delta, and pass it to setNextKinematicTranslation to avoid teleport-style glitches.
- Key claims: Kinematic bodies are not affected by gravity or other forces, so they won't be knocked around. Velocity-based and position-based approaches yield the same practical result; the difference is whether you hand Rapier a velocity or an absolute next position. Directly setting a rigid body's position teleports it and can cause physics bugs, so setNextKinematicTranslation is preferred.
- Learner-relevant: Provides the kinematic controller pattern (reset velocity → accumulate input → apply) that gives precise player control, while flagging that kinematic bodies still pass through fixed bodies and need manual gravity/stair handling.

### 0115

- Locator: `[[sources/three-js/20260907/0115. Comparing Character Controllers.srt#0115]]`
- Summary: Contrasts dynamic and kinematic approaches. Dynamic bodies get physics for free but are unpredictable around other bodies. Kinematic bodies give full control but lack gravity, cannot climb stairs cleanly, and ignore fixed bodies (walking through walls). The section concludes that neither is ideal and introduces Rapier's Character Controller, which respects fixed bodies, auto-steps stairs, and snaps the character to the ground.
- Key claims: Kinematic bodies do not collide with fixed bodies by design; stairs and slopes require custom raycast solutions that are brittle. Rapier's Character Controller is a newer abstraction that handles these cases so developers don't have to reimplement them.
- Learner-relevant: Motivates why the course is moving from raw rigid bodies to the higher-level Character Controller API.

### 0116

- Locator: `[[sources/three-js/20260907/0116. Introduction.srt#0116]]`
- Summary: Introduces the Rapier Character Controller starter code. Explains that the Character Controller is not a rigid body (Rapier still only has four body types) but a "computer" that takes a desired movement vector, queries the scene's colliders, and returns a corrected vector. Uses the analogy of telling a driver to accelerate vs pressing the pedal yourself — the controller decides whether the move is legal. The starter creates a kinematic-position-based rigid body and collider, then will feed a movement vector into the controller each frame.
- Key claims: The Character Controller does not exist as a body type; it wraps a kinematic-position-based body. It corrects the movement vector based on scene context (e.g., zeroing it if a wall blocks the path). It enables auto-stepping stairs and ground snapping out of the box.
- Learner-relevant: Sets up the implementation pattern — build a movement vector from input, pass it to the controller, apply the corrected vector — that the next lessons will flesh out.
