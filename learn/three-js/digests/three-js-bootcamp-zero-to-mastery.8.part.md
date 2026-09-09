---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 8
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 8)

## Overview (L1)

- **0044. Setup** — Introduces Three.js TextureLoader: creating a loader instance, loading image files via `textureLoader.load(url)`, applying them to materials through the `map` property, and demonstrating that textures are compositional (you can still tint them with `material.color`). Covers freepbr.com as a PBR texture source and the convention of placing static assets in the `public/` folder.
- **0045. Repeating Texture** — Explores `texture.repeat` (a Vector2) for tiling textures across large surfaces, `wrapS`/`wrapT` wrapping modes (RepeatWrapping, MirroredRepeatWrapping, ClampToEdgeWrapping), and the visual tradeoffs of each when textures stretch or tile.
- **0046. Texture Offset** — Covers the `texture.offset` property (also a Vector2) for shifting a texture's position within the UV space, with a dat.gui helper for real-time experimentation on X/Y offset values.
- **0047. UV Maps** — Explains UV mapping as the mechanism that tells Three.js which part of a 2D texture maps to which part of 3D geometry. Uses a Blender ramen-shop model to show how complex geometry with a single texture requires explicit UV coordinates per vertex.
- **0048. UV Mapping** — Compares Blender's UV unwrapping (gift-wrapping analogy) with Three.js's default UV layout for primitives like cubes. Demonstrates that different tools produce different UV maps, so the same model+texture can look different across software.
- **0049. PBR Maps** — Introduces PBR texture channels (roughnessMap, metalnessMap) using MeshStandardMaterial. Shows how grayscale images encode per-pixel material properties — white = more of the property, black = less — enabling spatially varying roughness and metalness instead of a single uniform value.
- **0050. Normal Map** — Explains normal maps as a technique to fake complex surface geometry by encoding per-pixel light-reflection directions. Demonstrates that a normal map makes a flat sphere look like it has grass tufts, avoiding the cost of modeling millions of triangles.

## Sections (L2)

### 0044

- Locator: `[[sources/three-js/20260907/0044. Setup.srt#0044]]`
- Summary: Walks through setting up texture loading from scratch — creating a `THREE.TextureLoader`, loading an albedo image via `.load()`, assigning it to `material.map`, and verifying the result. Also introduces freepbr.com as a free PBR texture library and explains the static-file asset pipeline.
- Key claims: A single `TextureLoader` instance can load any number of textures; `material.map` sets the base-color (albedo) texture; textures are only one component of a material — `material.color` still tints the output; MeshBasicMaterial shows the raw texture one-to-one without lighting influence.
- Learner-relevant: Establishes the texture-loading workflow every subsequent texture lesson depends on; anchors the concept that materials are composites of multiple properties.

### 0045

- Locator: `[[sources/three-js/20260907/0045. Repeating Texture.srt#0045]]`
- Summary: Demonstrates why large-scale geometry (100×100 plane) stretches a single texture, then solves it with `texture.repeat.set(x, y)` to tile the image. Introduces `wrapS` (X-axis) and `wrapT` (Y-axis) wrapping constants: `RepeatWrapping`, `MirroredRepeatWrapping`, and `ClampToEdgeWrapping` (default).
- Key claims: `repeat` is a Vector2 controlling horizontal/vertical tiling count; without proper wrapping, the last pixel of the texture stretches to infinity; `MirroredRepeatWrapping` flips the texture at each tile boundary (0→100, then 100→0), reducing visible seam artifacts; `ClampToEdgeWrapping` is the default and causes stretching at edges.
- Learner-relevant: Gives the learner practical control over texture density on large surfaces; explains the Minecraft-like tiling artifact problem and its Three.js solutions.

### 0046

- Locator: `[[sources/three-js/20260907/0046. Texture Offset.srt#0046]]`
- Summary: Introduces the `texture.offset` Vector2 for shifting the texture's origin within UV space. Shows a dat.gui panel with X/Y sliders for real-time preview, and demonstrates centering a texture by adjusting offset values.
- Key claims: Offset shifts the texture's starting position on the geometry (default is 0,0 = top-left); offset values are in UV-space units (0–1 range maps to the full texture); the GUI approach of passing two objects to `pane.addInput()` allows grouping X/Y controls in one menu item.
- Learner-relevant: Enables precise texture positioning — useful for aligning decals, logos, or specific texture regions on a surface.

### 0047

- Locator: `[[sources/three-js/20260907/0047. UV Maps.srt#0047]]`
- Summary: Explains UV maps as the coordinate system that maps 2D texture space to 3D geometry vertices. Uses a complex Blender model (ramen-shop machines) to show that each vertex carries UV coordinates telling Three.js which texture pixel to sample. Different geometries (plane, cube, torus knot, cylinder, sphere) produce different distortion patterns.
- Key claims: UV coordinates are per-vertex 2D positions in texture space (U = horizontal, V = vertical); Three.js reads UV data the same way it reads vertex positions; primitive geometries come with built-in UV maps; complex models require explicit UV unwrapping in tools like Blender.
- Learner-relevant: Foundational concept for understanding why textures look distorted on non-planar geometry and how to control texture placement on custom 3D models.

### 0048

- Locator: `[[sources/three-js/20260907/0048. UV Mapping.srt#0048]]`
- Summary: Compares Blender's cube UV unwrapping (gift-wrapping analogy — all six faces laid flat) with Three.js's default cube UV layout (each face gets the full texture independently). Demonstrates that changing UV coordinates in Blender and exporting preserves the custom mapping, while Three.js primitives use their own UV convention.
- Key claims: Blender unwraps cubes like gift-wrapping (shared texture space across faces); Three.js maps the full texture onto each cube face independently; UV data is exported with the model file and read by Three.js at import; "Cube Projection" in Blender approximates Three.js's per-face mapping.
- Learner-relevant: Prepares the learner for working with imported 3D models where UV maps created in DCC tools affect how textures appear in Three.js.

### 0049

- Locator: `[[sources/three-js/20260907/0049. PBR Maps.srt#0049]]`
- Summary: Introduces PBR texture maps using MeshStandardMaterial — specifically roughnessMap and metalnessMap. Explains that uniform `roughness`/`metalness` scalar values apply the same property everywhere, while maps encode per-pixel variation via grayscale (white = full effect, black = none). Uses a space-cruiser material to show how different regions can be metallic vs. painted.
- Key claims: PBR maps require MeshStandardMaterial or MeshPhysicalMaterial (not MeshBasicMaterial); roughnessMap controls surface smoothness per-pixel (white = rough, black = smooth); metalnessMap controls metallic response per-pixel; when a map is assigned, the scalar `roughness`/`metalness` property acts as a multiplier but cannot override areas the map marks as zero; a fully-black metalnessMap (e.g., grass) makes the scalar metalness property ineffective.
- Learner-relevant: Core PBR workflow — understanding how multiple texture channels combine to define a realistic material; prevents the common mistake of setting scalar properties when maps already define the spatial variation.

### 0050

- Locator: `[[sources/three-js/20260907/0050. Normal Map.srt#0050]]`
- Summary: Explains normal maps as the solution to flat-looking textured geometry. A normal map encodes per-pixel surface-normal directions so Three.js simulates light reflecting off a more complex surface without adding triangles. Applied to a sphere with grass texture, the normal map creates visible bumps and tufts.
- Key claims: Simple geometry + detailed texture still looks flat because lighting responds to the actual mesh normals; modeling millions of grass blades is prohibitively expensive; a normal map fakes per-pixel surface orientation, making the renderer compute light as if the geometry were more complex; the visual difference is dramatic even on simple primitives.
- Learner-relevant: Completes the PBR texture pipeline — albedo (color) + roughness + metalness + normal = realistic material; the go-to technique for adding perceived detail without polygon cost.
