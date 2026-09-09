---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 5
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 5)

## Overview (L1)

- 0027. Transforming Scale — Scale is a Vector3 property like position; set per-axis (`mesh.scale.y = 2`) or all-at-once via `scale.set(x, y, z)`.
- 0028. Scene Hierarchy — Three.js uses parent-child relationships via `Group`; children inherit their parent's transforms, and local position/scale are relative to the parent's coordinate system.
- 0029. Rotation — Introduces rotation with wireframe materials and `AxisHelper` to visualize how meshes spin around their own axes versus world axes.
- 0030. Rotation — Rotation is stored as Euler angles (radians); `MathUtils.degToRad` converts degrees, and Euler order matters — reorder with `.reorder('YXZ')` when default XYZ gives wrong results.
- 0031. Animating Meshes — Animation is just dynamic transforms inside the render loop; the claymation analogy (change → render → change → render) maps directly to per-frame updates.
- 0032. Animating Meshes — The `Clock` class provides `getElapsedTime()` and frame-to-frame `delta`; multiplying transforms by `delta` makes animation frame-rate independent.
- 0033. Other Animations — Linear `+=` animation grows unbounded; `Math.sin(time)` oscillates between −1 and 1, giving bounded pulsing/scaling without drifting off-screen.
- 0034. Introduction — Course recap (camera → renderer → scene → meshes → transforms → hierarchy → animation); next topic is geometry — built-in primitives vs. custom `BufferGeometry`.

## Sections (L2)

### 0027

- Locator: `[[sources/three-js/20260907/0027. Transforming Scale.srt#0027]]`
- Summary: Explains that `scale` is a `Vector3` property on every mesh, so it can be manipulated exactly like `position` — either per-axis (`mesh.scale.y = 2`) or all three axes at once with `scale.set(x, y, z)`.
- Key claims: `scale` is a `Vector3`; per-axis assignment multiplies that dimension; `scale.set()` overwrites x, y, and z in one call.
- Learner-relevant: Gives the learner the third transform pillar (scale) alongside position and rotation, completing the basic mesh-transform vocabulary.

### 0028

- Locator: `[[sources/three-js/20260907/0028. Scene Hierarchy.srt#0028]]`
- Summary: Demonstrates parent-child relationships using `Group` — an empty 3D object that acts as a holder for child meshes. Children inherit the parent's transforms, and their local position/scale are interpreted relative to the parent, not world space.
- Key claims: `Group` is an invisible container; `scene.add(group)` then `group.add(mesh)` nests transforms; setting a child's `position.y = -1` moves it one unit below the parent, not necessarily below the world origin; `scale.setScalar(v)` applies the same value to all three axes.
- Learner-relevant: Anchors the mental model that local transforms compose with parent transforms — essential for building solar systems, character rigs, or any nested motion.

### 0029

- Locator: `[[sources/three-js/20260907/0029. Rotation.srt#0029]]`
- Summary: Kicks off the rotation topic by switching the material to `wireframe: true` so the mesh edges stay visible while spinning, and introduces `AxisHelper` to make the rotation axis legible.
- Key claims: `wireframe: true` on `MeshBasicMaterial` reveals the mesh's wireframe; `AxisHelper` is a 3D object that can be added to the scene or attached to a mesh; moving a mesh does not move a scene-level `AxisHelper`.
- Learner-relevant: Teaches the learner to set up visual debug aids (wireframe + axis helper) before experimenting with rotation — a reusable workflow for any transform debugging.

### 0030

- Locator: `[[sources/three-js/20260907/0030. Rotation.srt#0030]]`
- Summary: Deep dive into the `rotation` property: it is an `Euler` with x/y/z in radians; `Math.PI` is a half-turn; `MathUtils.degToRad()` converts degrees for readability; Euler application order defaults to XYZ and can be changed with `.reorder()`.
- Key claims: `rotation` is an `Euler`, not a `Vector3`; values are radians (`Math.PI` = 180°); `MathUtils.degToRad(90)` is the readable equivalent of `Math.PI / 2`; changing one axis tilts the others (Euler coupling); default order is XYZ regardless of code order; `mesh.rotation.reorder('YXZ')` changes application order.
- Learner-relevant: Demystifies why rotating X then Y looks different from Y then X, and gives the learner the `.reorder()` tool to fix it — a common stumbling block in Three.js.

### 0031

- Locator: `[[sources/three-js/20260907/0031. Animating Meshes.srt#0031]]`
- Summary: Defines animation as transforms applied dynamically inside the render loop; uses the claymation analogy (deform → capture → deform → capture) to explain why per-frame updates produce motion.
- Key claims: Animation = dynamic transforms; the render loop is the mechanism; keyframes map to per-frame property changes; enough frames per second yields smooth motion.
- Learner-relevant: Connects the previously static transform lessons to the render loop, giving the learner the conceptual bridge from "move once" to "move every frame."

### 0032

- Locator: `[[sources/three-js/20260907/0032. Animating Meshes.srt#0032]]`
- Summary: Implements frame-rate independent animation using the `Clock` class: `getElapsedTime()` gives total time, and `delta = currentTime - previousTime` gives the frame gap; multiplying speed by `delta` keeps motion consistent across 30/60/120 Hz displays.
- Key claims: `new THREE.Clock()` tracks elapsed time; `delta` is the time since last frame; `previousTime = currentTime` after computing delta sets up the next frame; `transform += speed * delta` is frame-rate independent.
- Learner-relevant: Gives the learner the standard Three.js animation timing pattern — a reusable recipe for any per-frame motion.

### 0033

- Locator: `[[sources/three-js/20260907/0033. Other Animations.srt#0033]]`
- Summary: Contrasts linear animation (unbounded, drifts off-screen) with sine-wave animation: `Math.sin(time)` oscillates between −1 and 1, so assigning it to scale or position produces bounded pulsing; adding a base value and multiplying by amplitude tunes the range.
- Key claims: `position += 0.1 * delta` grows without bound; `Math.sin(x)` returns values in [−1, 1]; negative scale flips the mesh; adding a base (e.g., `+1`) shifts the range to [0, 2]; multiplying by amplitude stretches the oscillation.
- Learner-relevant: Expands the learner's animation toolkit beyond linear drift to bounded oscillation — the foundation for breathing, bobbing, and orbiting effects.

### 0034

- Locator: `[[sources/three-js/20260907/0034. Introduction.srt#0034]]`
- Summary: Course-positioning recap: the curriculum has moved top-down from camera/renderer/render loop through scene, meshes, Object3D transforms, hierarchy, and animation; the next layer down is geometry (this lesson) and materials (next lesson). Geometry can be built-in primitives or custom `BufferGeometry`, though custom geometry is verbose and real projects usually import from Blender/Maya.
- Key claims: Course structure is top-down, not bottom-up; geometry and materials are the next depth layer; Three.js provides primitives (boxes, spheres, etc.); custom geometry uses `BufferGeometry`; hand-typing geometry is rare outside learning because of boilerplate.
- Learner-relevant: Orients the learner before the geometry deep dive, explaining why the course is shifting from "how to move meshes" to "what meshes are made of."
