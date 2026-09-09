---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 12
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 12)

## Overview (L1)

- **0073. Planet Array** — Replaces manually created planet meshes with a data-driven `planets` array of objects. Each object stores name, radius, distance, speed, material, and a nested `moons` sub-array. This sets the foundation for automating mesh generation and animation.
- **0074. Adding Materials** — Loads image textures via `THREE.TextureLoader` for each celestial body (Earth, Sun, Mars, Mercury, Moon, Venus). Creates `MeshBasicMaterial` for the Sun (unlit) and `MeshStandardMaterial` for all planets/moons (lit by scene lights), mapping each texture to its material.
- **0075. Automating Mesh Generation** — Uses `Array.map()` to iterate over the planets array and programmatically create each planet mesh, set scale/distance, add it to the scene, then loop over each planet's moons sub-array to create and parent moon meshes. The result is a `planetMeshes` array ready for the render loop.
- **0076. Animating the Planet Array** — Animates the generated meshes inside the render loop: self-rotation on the Y axis using each object's `speed` property, orbital revolution via `Math.sin`/`Math.cos` on position X/Z scaled by `distance`, and nested moon orbits by indexing into the original `planets` data array for properties.

## Sections (L2)

### 0073

- Locator: `[[sources/three-js/20260907/0073. Planet Array.srt#0073]]`
- Summary: Demonstrates why manual mesh creation becomes unmanageable as the solar system grows, then introduces a `planets` array where each element is a plain object holding metadata (name, radius, distance, speed, material reference, moons sub-array). Each moon entry mirrors the same shape with its own radius, distance, and speed.
- Key claims: Manual `new THREE.Mesh` calls for every planet/moon lead to tangled, unmaintainable code; data-driven arrays let automation functions consume properties directly; the `moons` sub-array enables nested hierarchies (Earth has 1 moon, Mars has 2); material references are stored but not yet resolved to textures.
- Learner-relevant: Establishes the data-model pattern used throughout the rest of the solar system build — understanding this array shape is prerequisite to the `.map()` automation in 0075 and the indexed animation in 0076.

### 0074

- Locator: `[[sources/three-js/20260907/0074. Adding Materials.srt#0074]]`
- Summary: Introduces `THREE.TextureLoader` to load JPEG texture images from a static folder, then creates materials for each body. The Sun uses `MeshBasicMaterial` (emissive, unaffected by light); all planets and moons use `MeshStandardMaterial` (responds to scene lighting). The color parameter is replaced by the `map` parameter pointing to the loaded texture.
- Key claims: `TextureLoader.load(url)` returns a texture synchronously in practice (logged to confirm); `MeshBasicMaterial` is correct for the Sun because it is the light source; `MeshStandardMaterial` requires scene lights (ambient + directional) to be visible; all moons share a single moon texture since they are too small to distinguish.
- Learner-relevant: Reinforces the distinction between lit and unlit materials and why the Sun differs from planets — a concept that affects every scene with a light-emitting object. Also introduces the texture-loading pipeline reused in all subsequent material work.

### 0075

- Locator: `[[sources/three-js/20260907/0075. Automating Mesh Generation.srt#0075]]`
- Summary: Replaces the `for` loop with `Array.map()` to transform the planets data array into a `planetMeshes` array of `THREE.Mesh` objects. For each planet: creates geometry + material → mesh, sets scale via `setScalar(radius)`, positions at `distance` on the X axis, adds to scene. Then iterates `planet.moons` to create child moon meshes (using a shared moon material) and parents them via `planetMesh.add(moonMesh)`. Finally extracts logic into `createPlanet()` and `createMoon()` helper functions.
- Key claims: `.map()` returns a new array without mutating the original, making it ideal for transforming data into scene objects; moon meshes are children of planet meshes in the Three.js hierarchy, so they inherit parent transforms; an `AmbientLight(0xffffff, 0.5)` is required for `MeshStandardMaterial` objects to be visible; the `planetMeshes` array contains only top-level planet meshes — moons live in each mesh's `.children` array.
- Learner-relevant: Teaches the map-based automation pattern that scales to any number of objects, and the Three.js parent-child hierarchy that makes moons orbit their planet automatically via transform inheritance.

### 0076

- Locator: `[[sources/three-js/20260907/0076. Animating the Planet Array.srt#0076]]`
- Summary: Animates the solar system in the render loop. For self-rotation: increments `mesh.rotation.y` by `planets[i].speed`. For orbital revolution: sets `mesh.position.x = Math.sin(mesh.rotation.y) * distance` and `mesh.position.z = Math.cos(mesh.rotation.y) * distance`, reusing the accumulating rotation value as the angle parameter. Moons are accessed via `planetMesh.children`, and their properties (speed, distance) are read from `planets[planetIndex].moons[moonIndex]`.
- Key claims: The render loop runs at ~120fps, so `rotation.y += speed` accumulates smoothly; using the same rotation value for both self-spin and orbit couples the two (intentional simplification); accessing custom properties requires indexing back into the original `planets` array since `.map()` meshes are plain Three.js objects without custom attributes; moon animation requires a double index (planet index + moon index) because moons are nested arrays inside planets.
- Learner-relevant: Completes the data-driven solar system pipeline — from data array to textured meshes to animated scene. The double-index pattern for nested arrays is a transferable concept for any hierarchical scene graph animation.
