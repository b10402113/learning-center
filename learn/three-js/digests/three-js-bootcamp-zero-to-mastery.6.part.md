---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 6
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 6)

## Overview (L1)

- 0035. Buffer Geometry — Vertex data stored in binary arrays; BufferAttribute wraps typed arrays (Float32Array) with itemSize to feed position data into BufferGeometry; walks through manually building a 2D triangle vertex-by-vertex.
- 0036. Primitives — three.js ships built-in geometries (Box, Sphere, Plane, Torus, IcoSphere); segment parameters trade smoothness for performance; all primitives now use BufferGeometry under the hood.
- 0037. Extra Tweakpane — TweakPane GUI library for live parameter tweaking; `pane.addInput(obj, 'prop', {min, max, step})` binds sliders to mutable properties; `onChange` callback required to regenerate geometry when constructor args change; folders organize growing menus.
- 0038. Materials vs. Textures — Geometry sets shape, material sets surface appearance; texture is a sub-component of material that adds pattern while material controls physical properties like reflectivity, gloss, and matte finish (car-wrap analogy).

## Sections (L2)

### 0035

- Locator: `[[sources/three-js/20260907/0035. Buffer Geometry.srt#0035]]`
- Summary: Explains that BufferGeometry stores vertex data in binary arrays; introduces BufferAttribute as the bridge between JavaScript typed arrays (Float32Array) and three.js; demonstrates creating a 2D triangle by specifying x/y/z positions in a flat array and setting the geometry's position attribute.
- Key claims: BufferGeometry is more memory-efficient and faster than older geometry implementations; all modern primitives (Box, Sphere, etc.) now use BufferGeometry by default; itemSize tells three.js how many array elements belong to one vertex (3 for position: x, y, z); vertex order in the array is flexible but each vertex's coordinate order (x, y, z) is fixed.
- Learner-relevant: Demystifies what happens inside three.js primitives; gives the mental model for custom geometry creation and the typed-array → BufferAttribute → BufferGeometry pipeline.

### 0036

- Locator: `[[sources/three-js/20260907/0036. Primitives.srt#0036]]`
- Summary: Surveys three.js built-in geometries; BoxGeometry takes width/height/depth plus segment counts; SphereGeometry uses radius + widthSegments + heightSegments; PlaneGeometry is a 2D surface; TorusGeometry and IcoSphereGeometry round out the set; segment counts control tessellation smoothness at a performance cost.
- Key claims: Increasing segments subdivides faces into more triangles, improving round/curved surfaces but lowering performance; BoxGeometry segments are less visually impactful than SphereGeometry segments; IcoSphereGeometry often looks more pleasing than the default SphereGeometry.
- Learner-relevant: Provides the vocabulary and parameter intuition for choosing and configuring primitives without hand-coding vertices.

### 0037

- Locator: `[[sources/three-js/20260907/0037. Extra Tweakpane.srt#0037]]`
- Summary: Introduces TweakPane as a live-debugging GUI; install via `npm install tweakpane`; instantiate with `new Pane()`; bind inputs with `pane.addInput(object, 'property', {min, max, step})`; mutable properties (scale, position) update live, but geometry constructor args are read-only after creation and require an `onChange` callback that rebuilds the geometry and reassigns it to the mesh; folders keep menus organized.
- Key claims: `addInput` first arg is the target object, second arg is the property name as a string, third arg is an options object with min/max/step; `onChange` receives an event object whose `.value` holds the new slider value; changing `geometry.parameters.width` does nothing because three.js ignores post-construction arg edits — you must create a new geometry.
- Learner-relevant: Gives a reusable workflow for experimenting with three.js values in real time; clarifies the critical distinction between mutable mesh properties and immutable geometry constructor arguments.

### 0038

- Locator: `[[sources/three-js/20260907/0038. Materials vs. Textures.srt#0038]]`
- Summary: Distinguishes materials from textures: geometry defines shape, material defines surface appearance (color, gloss, reflectivity, pattern); texture is a layer inside the material that contributes pattern/image while the material itself governs physical light response; illustrated with a car-wrap analogy where the skull design is the texture and the matte vs. gloss finish is the material property.
- Key claims: A material can exist and look correct without any texture; texture only adds detail/pattern on top of the material's base properties; the same texture can be applied to a matte material or a glossy material to produce different final looks.
- Learner-relevant: Establishes the conceptual boundary that prevents conflating "what is drawn" (texture) with "how it reacts to light" (material); sets up the next lesson on loading and applying textures.
