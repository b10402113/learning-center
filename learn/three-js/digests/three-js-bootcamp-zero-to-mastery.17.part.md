---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 17
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 17)

## Overview (L1)

- 0096. Putting it All Together! — Wire up the preloader UI in JavaScript: query overlay/loading/start-button DOM elements, subscribe to progress events to update a percentage label, fade out the loader and reveal the start button at 100%, add a click listener on the start button that fades out the overlay and removes elements after the transition.
- 0097. Introduction to Physics and Rapier — Explain the two-world architecture behind 3D physics: Three.js handles rendering while a physics library computes object positions via a hidden mathematical copy; introduce Rapier as a modern, Rust+WebAssembly-based engine chosen over Cannon/Ammo for performance; outline the four-step integration pattern (create physics world → create 3D meshes → create rigid bodies + colliders → copy physics transforms back to meshes each frame).
- 0098. Getting Started — Bootstrap the physics module with a pre-built starter: new `Environment` and `Physics` classes imported into `World.js`, Vite configured with `@vitejs/plugin-wasm` and `top-level-await` for WebAssembly support; Rapier loaded dynamically via `import().then()` inside the constructor, then a physics world is instantiated with Earth gravity `{ x: 0, y: -9.81, z: 0 }` and stored as `this.world` for the render loop.
- 0099. Dynamic Object — Implement a falling cube as a full physics integration example: create a `BoxGeometry` + `MeshStandardMaterial` mesh, define a **dynamic** rigid body via `RigidBodyDesc.dynamic()` and add it to the world, attach a **cuboid collider** using half-extents (`0.5, 0.5, 0.5` for a 1-unit box), guard the loop with an `rapierLoaded` flag so `world.step()` runs only after async init, then read `rigidbody.translation()` and `rigidbody.rotation()` each frame to drive the mesh position and quaternion.

## Sections (L2)

### 0096

- Locator: `[[sources/three-js/20260907/0096. Putting it All Together!.srt#0096]]`
- Summary: Connect the preloader HTML/CSS to JavaScript by selecting `.overlay`, `.loading`, and `.start` elements with `querySelector`; subscribe to the `ProgressManager` events and update a `#progressPercentage` label with `Math.trunc(this.progress * 100)`; when progress reaches 100, fade out the loader and reveal the start button using CSS classes; attach a one-time `click` listener to the start button that fades the overlay and button, then removes them from the DOM after a short timeout.
- Key claims: Real-time percentage feedback is better than an indeterminate spinner; the `once: true` option on `addEventListener` prevents the start handler from firing multiple times; `setTimeout` is used to delay removal until after the CSS fade completes.
- Learner-relevant: Demonstrates a reusable asset-loading template with DOM-to-class wiring, progress subscription, fade transitions, and guarded one-time event listeners — a pattern portable to any Three.js project that needs a preloader.

### 0097

- Locator: `[[sources/three-js/20260907/0097. Introduction to Physics and Rapier.srt#0097]]`
- Summary: Frame physics integration as a two-world pattern: a visible Three.js scene and an invisible physics world that mirrors it mathematically. Rapier receives a copy of each object, integrates forces like gravity, and the engine writes the resulting transforms back to the meshes every frame. Compare Rapier to Cannon/Ammo, noting Rapier's Rust/WebAssembly foundation for better performance. Introduce the four-step recipe and the rigid-body type spectrum (fixed, dynamic, position/velocity-based kinematic) plus collider shapes (cuboid, sphere, capsule, trimesh) that approximate the visible mesh geometry.
- Key claims: Three.js has no built-in physics — rendering and simulation are separate; Rapier is chosen because it is modern, performant, and accessible via JavaScript bindings over WebAssembly; colliders should mimic the visible mesh shape (e.g., a box mesh uses a cuboid collider); the integration loop runs every frame inside the existing render loop.
- Learner-relevant: Establishes the mental model for all subsequent physics nodes — world duplication, rigid-body types, collider geometry, and the per-frame sync pattern.

### 0098

- Locator: `[[sources/three-js/20260907/0098. Getting Started.srt#0098]]`
- Summary: Walk through the pre-configured starter: `Environment` class holds lights and meshes, empty `Physics` class is where Rapier will be wired, both are imported and instantiated in `World.js`; Vite config adds `@vitejs/plugin-wasm` and `top-level-await` to support Rapier's WebAssembly module. Rapier is loaded dynamically inside the `Physics` constructor via `import('@dimforge/rapier3d').then((rapier) => { ... })`; inside the callback, a gravity vector `{ x: 0, y: -9.81, z: 0 }` is defined, then `new rapier.World(gravity)` creates and stores the physics world as `this.world`.
- Key claims: Rapier cannot be a top-level static import because it relies on WebAssembly; dynamic `import().then()` ensures the module is ready before world creation; the world instance must be a class property so the render loop can call `world.step()` each frame.
- Learner-relevant: Provides the concrete setup scaffolding (boilerplate, Vite plugin config, async import, world instantiation) needed before any rigid bodies or colliders can be created.

### 0099

- Locator: `[[sources/three-js/20260907/0099. Dynamic Object.srt#0099]]`
- Summary: Build a complete dynamic-body example from scratch: create a `BoxGeometry` and `MeshStandardMaterial`, add the mesh to the scene; define `RigidBodyDesc.dynamic()` and call `this.world.createRigidBody(rigidBodyDesc)` to register it; define `ColliderDesc.cuboid(0.5, 0.5, 0.5)` and attach it to the rigid body via `this.world.createCollider(colliderDesc, rigidBody)`. In the loop, guard execution with `if (!this.rapierLoaded) return` and call `this.world.step()` only after async init; read `this.rigidbody.translation()` to set `cubeMesh.position` (and `rigidbody.rotation()` to set `cubeMesh.quaternion`) so the visible mesh follows the physics simulation.
- Key claims: Rapier colliders take **half-extents**, not full dimensions — a 1×1×1 box needs `0.5, 0.5, 0.5`; the loop must be guarded because Rapier loads asynchronously; rotation comes back as a quaternion, so the mesh must use `.quaternion.copy()` rather than `.rotation.set()`.
- Learner-relevant: First end-to-end physics integration — every subsequent physics feature (fixed bodies, colliders, floors, character control) builds on this exact create-body → create-collider → step → sync pattern.
