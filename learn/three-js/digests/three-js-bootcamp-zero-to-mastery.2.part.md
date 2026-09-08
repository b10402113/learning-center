---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 2
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 2)

## Overview (L1)

- 0008. Installing Vite — Introduces the build-tool pipeline: Node.js as the runtime, npm as the package manager, and Vite as the dev server/bundler. Walks through `npm create vite`, `npm install`, and `npm run dev` to scaffold a vanilla-JS project.
- 0009. Three.js Setup — Cleans out the Vite template boilerplate, verifies `main.js` loads via the browser console, installs the `three` npm package, and imports the entire core library with `import * as THREE from 'three'`.
- 0010. Scene — Creates the scene container (`new THREE.Scene`), builds a mesh from `BoxGeometry` + `MeshBasicMaterial`, and explicitly adds it to the scene with `scene.add()` to establish the parent-child graph.
- 0011. Camera — Adds a `PerspectiveCamera` with FOV, aspect ratio (from `window.innerWidth / innerHeight`), and near/far clipping planes. Moves the camera back on Z (`camera.position.z = 5`) so it sits outside the mesh.
- 0012. Renderer — Wires up the `WebGLRenderer` to a `<canvas class="threejs">` element, calls `renderer.render(scene, camera)`, and uses `setSize(window.innerWidth, window.innerHeight)` to fill the viewport.
- 0013. Starter Pack — Switches to a pre-built starter pack so every lesson starts from an identical state. Covers `npm install` for deps, `npm run dev` to serve, and a two-line CSS reset (`margin: 0; overflow: hidden`) on the body.
- 0014. FOV — Deep dive into field of view: defines FOV as the angular extent captured by the lens, shows how widening the angle reveals more of the world while narrowing it zooms in, and notes common reference values (35°/50° in photography, 75° default in the starter).

## Sections (L2)

### 0008

- Locator: `[[sources/three-js/20260907/0008. Installing Vite.srt#0008]]`
- Summary: Explains why a build tool is needed, then walks through installing Node.js, using npm to scaffold a Vite vanilla-JS project, installing dependencies, and starting the dev server.
- Key claims: Node.js lets JavaScript run outside the browser; npm (Node Package Manager) ships with Node and manages dependencies; Vite provides instant server start, hot module replacement, and optimized builds; the scaffolded project runs via `cd hello-world && npm install && npm run dev`.
- Learner-relevant: Establishes the toolchain every later lesson depends on — understanding what `npm install` and `npm run dev` actually do removes the "magic" from project setup.

### 0009

- Locator: `[[sources/three-js/20260907/0009. Three.js Setup.srt#0009]]`
- Summary: Strips the Vite template down to an empty page, confirms `main.js` loads by logging to the browser console, installs the `three` package, and imports the whole library as `THREE`.
- Key claims: The browser console is reachable via Shift+Cmd+C (Mac) or Shift+Ctrl+C (Win); `import * as THREE from 'three'` pulls the entire core library from `node_modules/three`; logging `THREE` confirms every class is available.
- Learner-relevant: Teaches the canonical `THREE` namespace import pattern and shows how to verify a library is installed before writing any real code.

### 0010

- Locator: `[[sources/three-js/20260907/0010. Scene.srt#0010]]`
- Summary: Instantiates a `THREE.Scene`, builds a red cube from `BoxGeometry` + `MeshBasicMaterial`, and adds it to the scene with `scene.add(cubeMesh)`.
- Key claims: A scene is a container for objects; a mesh combines geometry and material; `scene.add()` is required to parent an object into the graph — creating a mesh alone does not put it in the scene; `MeshBasicMaterial` ignores lighting, so the color appears flat.
- Learner-relevant: Introduces the geometry-material-mesh pattern and the explicit parent-child relationship that governs all later object composition.

### 0011

- Locator: `[[sources/three-js/20260907/0011. Camera.srt#0011]]`
- Summary: Creates a `PerspectiveCamera` with four arguments (FOV, aspect ratio, near, far), derives the aspect ratio from `window.innerWidth / windowInnerHeight`, and pulls the camera back on Z so it frames the cube.
- Key claims: The aspect ratio must match the canvas dimensions or the image distorts; `window.innerWidth / innerHeight` keeps it responsive; near/far clipping planes cull geometry too close or too far; `camera.position.z = 5` moves the camera back because mesh and camera both spawn at the origin.
- Learner-relevant: Shows how to read `window` properties for responsive sizing and establishes the convention that the camera looks down -Z from a positive Z position.

### 0012

- Locator: `[[sources/three-js/20260907/0012. Renderer.srt#0012]]`
- Summary: Adds a `<canvas class="threejs">` to the HTML, retrieves it with `document.querySelector`, passes it to `new THREE.WebGLRenderer({ canvas })`, then calls `renderer.render(scene, camera)` and `renderer.setSize(window.innerWidth, window.innerHeight)`.
- Key claims: The `<canvas>` element is the drawing surface for 2D/3D graphics; the renderer needs `setSize` to know its output dimensions; without `setSize` the render defaults to a small fixed size.
- Learner-relevant: Completes the minimal render pipeline (scene → camera → renderer → canvas) and shows why the canvas must exist in the DOM before the renderer is created.

### 0013

- Locator: `[[sources/three-js/20260907/0013. Starter Pack.srt#0013]]`
- Summary: Introduces a downloadable starter pack so every lesson begins from the same code state. Covers unzipping, running `npm install` to pull Vite + Three.js from `package.json`, running `npm run dev`, and applying a two-line CSS reset on the body.
- Key claims: The starter pack guarantees identical dependency versions across time; `npm install` reads `package.json` and installs all listed deps; `body { margin: 0; overflow: hidden; }` removes the default white margin and prevents scrollbars for a full-screen canvas.
- Learner-relevant: Saves the learner from re-scaffolding each lesson and demonstrates the standard CSS reset used in almost every full-screen WebGL project.

### 0014

- Locator: `[[sources/three-js/20260907/0014. FOV.srt#0014]]`
- Summary: Defines field of view as the angular extent visible through the camera lens, illustrates how widening the FOV reveals more of the scene while narrowing it zooms in, and references common real-world values.
- Key claims: FOV is the angle between the two frustum edges on the vertical axis; a smaller FOV shows less of the world but magnifies what remains because the image still fills the screen; photography commonly uses 35°–50°; the starter default is 75°.
- Learner-relevant: Gives an intuitive, visual model for the first `PerspectiveCamera` argument so the learner can tune FOV deliberately instead of treating it as a magic number.
