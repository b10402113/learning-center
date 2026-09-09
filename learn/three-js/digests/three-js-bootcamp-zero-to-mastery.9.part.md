---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 9
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 9)

## Overview (L1)

- 0051. Height Map — Introduces height/displacement maps as the first texture that physically moves mesh vertices rather than faking light response; contrasts with normal maps and notes the geometry cost.
- 0052. AO Map — Explains ambient occlusion maps as baked shadow data that adds depth to crevices; requires a second UV set and uses `aoMap` + `aoMapIntensity` on the material.
- 0053. Putting it All Together! — Consolidates all PBR textures (roughness, metalness, normal, displacement, AO) on the boulder and spaceship, demonstrating how each map affects only its encoded regions.
- 0054. Introduction and Ambient Light — Begins the lighting module; ambient light provides uniform scene fill with no direction, and color can be set via hex, RGB string, or HSL.
- 0055. Hemisphere Light — A cheap, two-color light split by surface normal direction (up vs. down), useful for warm-sky / ground-bounce color contrast.
- 0056. Directional Light — Models sunlight: infinite parallel rays from a position, configurable via `position` or `target`, with a helper to visualize origin and direction.
- 0057. pointLight — A finite, omnidirectional light (bulb analog) with `distance` and `decay` parameters controlling falloff from brightest point to dark.

## Sections (L2)

### 0051

- Locator: `[[sources/three-js/20260907/0051. Height Map.srt#0051]]`
- Summary: Explains that a height map (called displacement map in three.js) physically displaces mesh vertices to create real geometric depth, unlike roughness/metalness/normal maps that only simulate light response. The instructor demonstrates applying `displacementMap` with a small `displacementScale` (e.g. 0.1) and notes that while it adds true depth, it is expensive and can introduce artifacts, which is why normal maps are usually preferred.
- Key claims: Displacement maps change actual surface topology rather than faking it; normal maps exist because they are much cheaper than real geometry modification; displacement should be used sparingly because it moves real geometry and can look wrong.
- Learner-relevant: Anchors the distinction between "fake" lighting textures and true geometric modification; supports later steps on material texture selection and performance trade-offs.

### 0052

- Locator: `[[sources/three-js/20260907/0052. AO Map.srt#0052]]`
- Summary: Covers ambient occlusion maps as baked shadow information that darkens crevices and contact areas to add depth. The key technical requirement is a second UV set (`uv2`) because three.js's `MeshStandardMaterial` reads AO from the second UV channel. The instructor shows how to copy the default UV array into a new `BufferAttribute` with itemSize 2 and assign it via `geometry.setAttribute('uv2', ...)`, then apply `aoMap` and `aoMapIntensity`.
- Key claims: AO maps are baked and static — they do not react to scene lights; AO requires a second set of UV coordinates; `aoMapIntensity` controls how strongly the baked occlusion darkens the surface.
- Learner-relevant: Reinforces UV concepts and `BufferAttribute` manipulation; gives a concrete reason why geometry attributes matter for advanced materials.

### 0053

- Locator: `[[sources/three-js/20260907/0053. Putting it All Together!.srt#0053]]`
- Summary: A capstone demonstration loading all boulder and spaceship textures and wiring GUI controls so the learner can toggle each map's influence. The instructor highlights that metalness/roughness maps only affect the regions encoded in the texture (e.g. non-metal parts stay non-metal regardless of the slider), displacement changes real topology while normal maps only fake depth, and AO adds subtle shadow in crevices.
- Key claims: Texture-mapped PBR properties are non-uniform across the surface; normal maps create a depth illusion that survives even when displacement is zero; combining all maps yields the most realistic result.
- Learner-relevant: Provides a mental model for how the previous texture lessons compose together; good anchor for a "materials" element that compares map types.

### 0054

- Locator: `[[sources/three-js/20260907/0054. Introduction and Ambient Light.srt#0054]]`
- Summary: Introduces three.js lighting by adding `AmbientLight` to a previously black scene. The instructor explains that ambient light has no direction and uniformly illuminates every surface, making it ideal as fill light. Color is specified via hex (`0xffffff`), named string (`'white'`), RGB string, or HSL, and a GUI color picker is wired to `ambientLight.color` for live iteration.
- Key claims: Ambient light is not a real-world physical light; it uniformly lights the scene so shapes are visible but flat; lights are Object3D instances and must be added to the scene with `scene.add()`; color can be controlled live via a GUI using a `color` parameter type.
- Learner-relevant: Establishes the lighting module's baseline; gives the first concrete example of adding a light to the scene and controlling its color.

### 0055

- Locator: `[[sources/three-js/20260907/0055. Hemisphere Light.srt#0055]]`
- Summary: Demonstrates `HemisphereLight` with two colors (sky/ground) that blend based on surface normal orientation rather than world up/down. The instructor shows that a cube's vertical sides appear as a 50/50 blend (purple from red+blue) because their normals are parallel to the ground, while curved surfaces show a smooth gradient. The light is described as cheap and useful for warm/cool color contrast.
- Key claims: Hemisphere light colors are split by surface normal direction, not by the mesh's vertical position; it is a performance-cheap way to add color contrast; useful for simulating sky warmth and ground bounce.
- Learner-relevant: Introduces surface normals as a lighting factor; supports later elements on light selection and color temperature.

### 0056

- Locator: `[[sources/three-js/20260907/0056. Directional Light.srt#0056]]`
- Summary: Models sunlight with `DirectionalLight`: infinite parallel rays whose angle is set by the light's `position` (default pointing down). The instructor shows how to move the light with `position.set()`, visualize it with `DirectionalLightHelper`, and optionally redirect it by setting `target.position`. A subtle fill `AmbientLight` is recommended so the unlit side is not pure black.
- Key claims: Directional light is position-dependent but distance-independent (infinite rays); direction can be controlled via `position` or `target`; a helper is essential for debugging; combining directional + ambient light yields more natural results.
- Learner-relevant: Gives the primary tool for shaping scene mood with angle and color; anchors the concept of fill vs. key lighting.

### 0057

- Locator: `[[sources/three-js/20260907/0057. pointLight.srt#0057]]`
- Summary: Introduces `PointLight` as a finite, omnidirectional source (bulb analog). The instructor demonstrates `distance` (max range) and `decay` (falloff sharpness) parameters, showing how a low decay creates a visible circle at the distance boundary. A `PointLightHelper` visualizes the light's position. The default decay of 2 is noted as physically reasonable.
- Key claims: Point light is the first finite light (unlike ambient/hemisphere/directional); `distance` caps the lit range; `decay` controls how sharply brightness drops from near to far; default decay ≈ 2 is physically plausible.
- Learner-relevant: Completes the core light-type vocabulary; supports elements on light selection, falloff, and performance.
