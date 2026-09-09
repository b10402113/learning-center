---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 13
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 13)

## Overview (L1)

- 0077. Final Touches! — Replaces ambient light with a point light at the sun's position; explains that three.js objects do not naturally block light (shadows are faked). Loads a starry galaxy background via CubeTextureLoader and HDR cube maps so the background responds to camera rotation. Adds more planets to the solar system.
- 0078. GLTF Introduction — Surveys 3D model formats (OBJ, FBX, GLTF) and their loaders in three.js. Argues GLTF is the web-optimized industry standard: smaller file size, faster load, better runtime performance. Notes FBX/OBJ are common in DCC tools but GLTF is the recommended delivery format for the web.
- 0079. Loading the Model — Loads a boombox model with GLTFLoader. Distinguishes standard glTF, binary glb, and draco-compressed variants. Explains why GLTFLoader requires an onload callback (complex models cannot return a placeholder object the way TextureLoader does). Shows that glTF.scene is a Group that can be scaled and added to the scene like any other object.
- 0080. Load Async — Introduces loadAsync as a Promise-based alternative to the onload callback. Demonstrates async/await syntax for cleaner sequential code. Notes the course will stick to callbacks to avoid the added complexity of JavaScript Promises.

## Sections (L2)

### 0077

- Locator: `[[sources/three-js/20260907/0077. Final Touches!.srt#0077]]`
- Summary: Polishes the solar system scene by swapping ambient light for a point light at the sun's location, then loads an HDR cube-map background so the galaxy responds to camera movement.
- Key claims: three.js objects do not naturally occlude light — shadows are a custom faked solution, so a point light at the sun's center still illuminates planets behind it; a plain texture assigned to scene.background stays fixed to the camera, while a cube texture (environment map / HDRI) rotates with the scene; CubeTextureLoader.load expects an array of six paths in the order [+X, -X, +Y, -Y, +Z, -Z].
- Learner-relevant: Anchors the lighting model (no automatic light blocking) and introduces environment maps as a tool for realistic scene backgrounds.

### 0078

- Locator: `[[sources/three-js/20260907/0078. GLTF Introduction.srt#0078]]`
- Summary: Introduces the three major 3D formats and their three.js loaders, then justifies GLTF as the course's focus for web delivery.
- Key claims: OBJ and FBX are common in DCC tools (e.g. Maya uses FBX) but are larger and less web-optimized; GLTF minimizes both asset size and runtime decompression cost, making it the web industry standard; three.js ships OBJLoader, FBXLoader, and GLTFLoader, but only GLTF is fully documented on the official site; models downloaded as FBX/OBJ can be re-exported as GLTF from Blender.
- Learner-relevant: Gives the learner a mental model of where 3D assets come from (Blender / Maya / online) and why GLTF is the interchange format to prefer when bringing them into three.js.

### 0079

- Locator: `[[sources/three-js/20260907/0079. Loading the Model.srt#0079]]`
- Summary: Walks through loading a boombox model from the three.js GLTF example repo, comparing standard glTF, binary glb, and draco variants, and explains the mandatory onload callback.
- Key claims: standard glTF = .gltf + textures; glb = single binary blob containing everything; draco = geometry-compressed variant (can also be applied to glb); GLTFLoader.load requires a callback because a glTF scene is too complex to return a synchronous placeholder — unlike TextureLoader, which can hand back an empty texture that fills in later; glTF.scene is a three.js Group, so it supports .scale, .position, .add(), etc.; imported models are converted to MeshStandardMaterial (PBR) regardless of the source software's material system.
- Learner-relevant: Teaches the concrete loading pattern (loader.load(url, onload)) and the mental model that a loaded glTF is just a Group hierarchy the learner already knows how to manipulate.

### 0080

- Locator: `[[sources/three-js/20260907/0080. Load Async.srt#0080]]`
- Summary: Shows loadAsync as a Promise-based alternative to the onload callback, then explains why the course will continue using callbacks.
- Key claims: gltfLoader.loadAsync(url) returns a Promise and can be used with await inside an async function, yielding the loaded object directly without nesting logic in a callback; wrapping loadAsync in a helper function requires marking the helper async and handling its returned Promise (e.g. with .then); the course deliberately sticks to callbacks to avoid pulling the JavaScript Promise API into scope.
- Learner-relevant: Gives the learner a cleaner option for future projects while keeping the current curriculum focused on three.js rather than async JS patterns.
