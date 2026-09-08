---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe777f77dbd25c38
source_lines: 44849
part: 14
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 14)

## Overview (L1)

- 0081. Changing Loaded Model Properties — Shows that loaded glTF model parts are customized the same way as any other Three.js object; access materials via `glTF.scene.children`, then mutate PBR properties (roughness, metalness, environmentMap) and apply environment maps for fake reflections.
- 0082. Working with Nested Meshes — Loads a GLB model with a deeply nested scene graph and demonstrates the `traverse()` method to visit every descendant; uses `child.isMesh` and `child.name` to selectively target and restyle specific parts like wheels.
- 0083. DRACOLoader — Introduces Draco-compressed models for smaller file sizes (e.g., 71 KB vs 208 KB); walks through importing `DRACOLoader`, copying the decoder into the static folder, setting the decoder path, and wiring it onto the GLTF loader via `setDRACOLoader`.
- 0084. Introduction and Prerequisites — Kicks off Part 2 of the course (portfolio project); lists prerequisites — JavaScript classes, export/import modules, `this` keyword, class vs instance — and explains why modular code is needed as apps grow complex.
- 0085. Exporting and Importing Modules — Teaches ES module syntax: `export default` for the primary class in a file, named `export` for secondary values, and the matching `import` forms including named imports inside braces.
- 0086. Creating Our Classes — Refactors the monolithic scene into a `Camera` class; covers constructor patterns, `this.instance` vs local variables, passing canvas/scene into constructors, and the singleton pattern to avoid circular re-instantiation of the app class.

## Sections (L2)

### 0081

- Locator: `[[sources/three-js/20260907/0081. Changing Loaded Model Properties.srt#0081]]`
- Summary: Explains that a loaded glTF model's materials are reachable through its scene graph (`glTF.scene.children[i].material`) and can be mutated like any `MeshStandardMaterial`. Demonstrates GUI controls for roughness, assigning a cube texture as `material.environmentMap` for fake reflections, tuning `envMapIntensity`, and the scene-level shortcut `scene.environment`. Explains glTF channel packing where metalness = blue channel, roughness = green channel, and AO = red channel of a single texture.
- Key claims: glTF scene becomes a Three.js Group whose children are meshes; environment reflections are fake (cube map lookup, not true scene reflection); `scene.environment` applies the same env map to every material but per-material `envMapIntensity` is lost at scene level.
- Learner-relevant: Gives learners the vocabulary (channel packing, env map, fake reflection) and the access pattern to restyle loaded models so they blend into a custom scene.

### 0082

- Locator: `[[sources/three-js/20260907/0082. Working with Nested Meshes.srt#0082]]`
- Summary: Loads a binary GLB (milk truck) to show a realistic nested scene graph. Uses `model.scene.traverse(callback)` to visit every descendant, filters with `child.isMesh`, and mutates materials in bulk. Shows how to reach a specific named node (e.g., `wheels`) by checking `child.name` inside traverse, then swapping its material to a colored `MeshBasicMaterial`.
- Key claims: GLB and GLTF loaders differ only in URL target; deep nesting makes index-based child access fragile; `traverse()` is the universal tool for walking the scene hierarchy; names assigned in 3D modeling software travel through to `child.name`.
- Learner-relevant: Teaches the traversal pattern learners will use on every complex model — bulk restyling and surgical edits by node name.

### 0083

- Locator: `[[sources/three-js/20260907/0083. DRACOLoader.srt#0083]]`
- Summary: Demonstrates file-size savings with Draco compression (208 KB → 71 KB). Walks through setup: import `DRACOLoader` from the examples path, copy the decoder folder into the project's static folder, call `dracoLoader.setDecoderPath('/draco/')`, then attach it to the GLTF loader with `gltfLoader.setDRACOLoader(dracoLoader)`. Loading otherwise proceeds unchanged.
- Key claims: Draco is recommended once geometry gets complex; the decoder lives in `node_modules/three/examples/jsm/libs/draco/` and must be served statically; `setDRACOLoader` is the correct API (not `setDracoLoader`).
- Learner-relevant: Provides the exact three-step boilerplate learners need to serve optimized assets in a real project.

### 0084

- Locator: `[[sources/three-js/20260907/0084. Introduction and Prerequisites.srt#0084]]`
- Summary: Introduces Part 2 — the portfolio project. Argues that splitting code into classes/modules is necessary once scenes, logic, and assets multiply. Lists prerequisites: JavaScript classes, OOP basics, `export`/`import` syntax, `this`, and class-vs-instance. Advises learners to study these topics externally if unfamiliar.
- Key claims: Monolithic files don't scale with complexity; classes and modules are general web-development concepts, not Three.js-specific; comfort with the listed prerequisites is enough to follow along.
- Learner-relevant: Sets expectations and gives a self-study checklist so learners are not lost when refactor begins.

### 0085

- Locator: `[[sources/three-js/20260907/0085. Exporting and Importing Modules.srt#0085]]`
- Summary: Walks through ES module mechanics with a small standalone example: `export default class App` for the file's main class, `export const namedThing` for secondary exports, and the matching `import App from './app.js'` vs `import { namedThing } from './app.js'` forms. Shows that omitting `default` forces the caller to import by the exported name.
- Key claims: Default exports let the importer choose any name; named exports must be destructured with the exact key; both styles can coexist in one file.
- Learner-relevant: Gives the exact syntax learners will see and write in every class file from here on.

### 0086

- Locator: `[[sources/three-js/20260907/0086. Creating Our Classes.srt#0086]]`
- Summary: Begins refactoring the sample app into a `Camera` class. Shows why local `const camera` must become `this.instance` so other methods can reach it; adds a `setInstance()` and `setControls()` method; passes `canvas` and `scene` into the constructor and promotes them to `this.canvas`/`this.scene`. Introduces a singleton pattern (`if (instance) return instance; instance = this;`) on the `App` class so importing the app does not recursively spawn infinite app→camera→app chains.
- Key claims: Constructor parameters must be assigned to `this.*` to be visible outside the constructor; importing `new App()` inside a child class causes infinite recursion unless the parent class is a singleton; the singleton ensures canvas, scene, and camera are created once and shared by reference.
- Learner-relevant: Teaches the class-authoring patterns and the singleton pattern that the rest of the course's project scaffold depends on.
