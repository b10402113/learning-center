---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 19
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 19)

## Overview (L1)

- **0103. Setting Absolute Position** — When Three.js meshes are parented inside groups, their local position/rotation differs from world position. This lesson covers converting between the two using `worldToLocal` for translation and manual `matrixWorld` inversion + quaternion pre-multiplication for rotation, so Rapier rigid bodies spawn at the correct world coordinates regardless of parent transforms.
- **0104. Adding Fixed Objects** — Extends the physics `add()` method with a `type` parameter (`'dynamic'` or `'fixed'`) so the same helper can register both dynamic rigid bodies (spheres, boxes) and static/fixed rigid bodies (ground plane), eliminating the need to manually create colliders for immovable geometry.
- **0105. Auto Compute Ball Collider** — Adds a `collider` parameter to the `add()` method with a switch statement that creates either a box collider or a ball (sphere) collider via Rapier's `ColliderDesc.ball()`. Introduces `computeBallSize`, which extracts the bounding sphere radius from geometry and scales it by the largest world-scale axis to auto-fit the collider to the mesh.

## Sections (L2)

### 0103

- Locator: `[[sources/three-js/20260907/0103. Setting Absolute Position.srt#0103]]`
- Summary: Explains why meshes inside groups don't land where expected — the physics loop copies the mesh's `position` directly, which is in local space, not world space. Demonstrates the fix: call `mesh.getWorldPosition()` to get the world-space position, then use `mesh.parent.worldToLocal()` to reverse the parent transform. For rotation (which lacks an equivalent `worldToLocal` helper), shows how to manually extract the parent's rotation matrix, invert it, build a quaternion via `setFromRotationMatrix`, and pre-multiply the mesh's rotation by that inverse quaternion. Validates the solution with nested groups (group2 > group1 > mesh) to prove `matrixWorld` accumulates all ancestor transforms.
- Key claims: `position` on a mesh is always in its parent's local space; `matrixWorld` stores the combined transform of all ancestors; `worldToLocal()` inverses the parent's full transform for a position vector; quaternion rotation conversion requires manual `Matrix4.extractRotation` → invert → `Quaternion.setFromRotationMatrix` → `premultiply` because no direct `worldToLocal` equivalent exists for rotations
- Learner-relevant: Understands why physics objects spawned inside groups appear at wrong positions, and provides the reusable pattern for syncing Three.js visual transforms with Rapier physics rigid bodies in any parent hierarchy

### 0104

- Locator: `[[sources/three-js/20260907/0104. Adding Fixed Objects.srt#0104]]`
- Summary: Refactors the `add()` method to accept an optional `type` parameter (defaulting to `'dynamic'`). When `type === 'fixed'`, the method creates a `RigidBodyDesc.fixed()` instead of `RigidBodyDesc.dynamic()`. This lets the ground plane and any other immovable geometry use the same `add()` helper rather than requiring separate manual collider creation code. Demonstrates that both dynamic balls and the fixed ground plane now work through the unified API.
- Key claims: Rapier rigid body types are dynamic, fixed, and kinematic; kinematic bodies are typically handled in custom character-controller classes rather than through this generic helper; adding a `type` parameter with a default value keeps backward compatibility
- Learner-relevant: Enables the physics class to handle both dynamic and static scene objects through one interface, reducing boilerplate and preparing for more flexible scene construction in later lessons

### 0105

- Locator: `[[sources/three-js/20260907/0105. Auto Compute Ball Collider.srt#0105]]`
- Summary: Adds a `collider` parameter to `add()` with a switch statement supporting `'box'` and `'ball'` collider types. For ball colliders, calls `ColliderDesc.ball(radius)` where the radius is computed by a new `computeBallSize` function. This function calls `geometry.computeBoundingSphere()`, reads the sphere's `radius`, then multiplies it by `Math.max(scale.x, scale.y, scale.z)` so the collider matches the mesh's widest dimension. Also cleans up the `add()` function body into three clear sections: rigid-body creation, collider creation, and mesh-sync setup.
- Key claims: `ColliderDesc.ball()` takes a single radius argument (unlike `ColliderDesc.cuboid` which takes half-extents x/y/z); `computeBoundingSphere()` populates `geometry.boundingSphere.radius`; scaling the bounding sphere radius by the max world-scale axis ensures the collider fits even non-uniformly scaled meshes; a `switch` statement is preferred over multiple `if` blocks for collider-type dispatch
- Learner-relevant: Completes the collider-type abstraction so the physics class can auto-fit both box and sphere colliders to any mesh geometry, and introduces the pattern that will extend to trimesh colliders in the next lesson for arbitrary geometry
