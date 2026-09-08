---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 15
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 15)

## Overview (L1)

- 0087. Creating Our Classes — Creates the Renderer class and a new Loop utility class; wires camera and renderer updates into a centralized requestAnimationFrame loop, establishing the per-frame update architecture.
- 0088. Adding Objects — Creates the World class, adds a rotating BoxGeometry mesh to the scene, and demonstrates why class instantiation order matters relative to the loop.
- 0089. Zustand and Resizing — Introduces Zustand for global state management; builds a sizes store and Resize utility, then uses store.subscribe() to reactively update camera aspect and renderer dimensions on window resize.
- 0090. Introduction — Previews the asset-loading phase: plans an AssetLoader utility and an Assets store so different parts of the app can subscribe to loading completion.

## Sections (L2)

### 0087

- Locator: `[[sources/three-js/20260907/0087. Creating Our Classes.srt#0087]]`
- Summary: Builds the Renderer class by importing the singleton App to access the canvas, then creates a Loop class inside a new `utils/` folder that runs `window.requestAnimationFrame` recursively. The loop calls `camera.loop()` (to update controls) and `renderer.loop()` (to render the scene), centralizing per-frame updates outside any single feature class.
- Key claims: The render loop is logically separate from the renderer itself because it orchestrates updates across the whole app; each feature class exposes a `loop()` method that the central Loop class invokes every frame; the singleton App pattern lets Renderer, Camera, and Loop all reference the same canvas, scene, and camera instances.
- Learner-relevant: Establishes the architectural pattern — singleton App + per-class `loop()` methods driven by a central Loop utility — that the rest of the course relies on.

### 0088

- Locator: `[[sources/three-js/20260907/0088. Adding Objects.srt#0088]]`
- Summary: Creates a `World` class, instantiates it inside App, and adds a rotating `THREE.Mesh` (BoxGeometry + MeshBasicMaterial) to the scene. Shows that `const` declared inside a method is scoped to that method, so the mesh must be assigned to `this.cubeMesh` to be reusable. Also demonstrates a runtime error that occurs when `world.loop()` is called before `this.world` is instantiated, reinforcing that class creation order in App matters.
- Key claims: `this.cubeMesh` is needed because method-scoped `const` variables are invisible to other methods; the App must create World before the Loop starts calling `world.loop()`, otherwise `this.world` is undefined.
- Learner-relevant: Teaches both the practical gotcha of JS scoping inside classes and the importance of instantiation order in a singleton-driven architecture.

### 0089

- Locator: `[[sources/three-js/20260907/0089. Zustand and Resizing.srt#0089]]`
- Summary: Installs Zustand and creates a vanilla `createStore` holding `width`, `height`, and `pixelRatio`. A new `Resize` utility class attaches a `window.resize` listener that calls `setState` to update the store. Camera and Renderer subscribe to the sizes store via `store.getState().sizes` and `store.subscribe()`, so when the window resizes the camera aspect ratio and renderer size update automatically.
- Key claims: Zustand provides a centralized, subscribe-able global state that avoids prop-drilling or manual event bus wiring; `store.subscribe(callback)` fires whenever `setState` changes the relevant slice, letting distant classes react without direct references to the Resize class.
- Learner-relevant: Introduces reactive state management as the course's mechanism for cross-cutting concerns (sizes, later assets), a pattern reused throughout the bootcamp.

### 0090

- Locator: `[[sources/three-js/20260907/0090. Introduction.srt#0090]]`
- Summary: Outlines the next module: asset loading. Plans two new utilities — an `AssetLoader` class that wraps THREE's TextureLoader and GLTFLoader, and an `Assets` store (Zustand) that holds loaded assets and exposes a subscription so other parts of the app can wait until assets are ready before using them.
- Key claims: Asset loading belongs in a dedicated utility class rather than scattered across World or App; a store is the right place to hold loaded assets because multiple downstream systems (materials, meshes, the render loop) need to know when loading completes.
- Learner-relevant: Sets up the learner to understand why the course centralizes asset access through a store — it decouples loading from consumption and enables reactive "ready" checks.
