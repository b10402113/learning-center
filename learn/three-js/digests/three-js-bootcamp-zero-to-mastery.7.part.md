---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 7
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 7)

## Overview (L1)

- 0039 — Introduction to Material Types, classifying Three.js materials into two main categories: non-environment-reactive (e.g., MeshBasicMaterial, MeshMatcapMaterial, MeshDepthMaterial) and environment/light-reactive, which form a spectrum from cheap/less physically accurate (Lambert, Phong) to expensive/highly accurate (Standard, Physical).
- 0040 — Deep dive into MeshBasicMaterial, covering color (string vs. new THREE.Color vs. hex), transparency/opacity, side visibility (THREE.DoubleSide vs. FrontSide), fog integration, and the trade-off between visual simplicity and performance.
- 0041 — Mesh Lambert and Mesh Phong materials as the cheapest light-reactive options; Lambert shows flat diffuse shading with visible banding, while Phong adds a shininess property for specular highlights, demonstrated with ambient and point lights plus a torus knot.
- 0042 — Mesh Standard and Mesh Physical materials as implementations of PBR (Physically Based Rendering); Standard introduces roughness and metalness aligned with industry-standard workflows (Unity, Blender, Maya), and Physical extends Standard with clearcoat and reflectivity for non-metallic reflective surfaces.
- 0043 — Setup lesson bridging materials to textures; practices creating sphere and cylinder geometries, assigning mesh properties after instantiation, rotating multiple objects via scene.children iteration vs. groups, and introduces the upcoming texture-mapping unit.

## Sections (L2)

### 0039

- Locator: `[[sources/three-js/20260907/0039. Material Types.srt#0039]]`
- Summary: Classifies Three.js materials into two main buckets: non-environment-reactive materials that ignore light (MeshBasicMaterial, MeshMatcapMaterial, MeshDepthMaterial) and light-reactive materials that form a spectrum from cheap/less accurate to expensive/physically accurate.
- Key claims: Non-reactive materials can be mixed with reactive ones in the same scene; MeshStandardMaterial and MeshPhysicalMaterial expose physically-meaningful properties like roughness and metalness, whereas MeshLambertMaterial cannot.
- Learner-relevant: Establishes a mental map of the material family so the learner understands when to choose a cheap material for performance versus a PBR material for realism.

### 0040

- Locator: `[[sources/three-js/20260907/0040. MeshBasicMaterial.srt#0040]]`
- Summary: Walks through MeshBasicMaterial properties: color (string, hex, new THREE.Color), transparent/opacity, side (THREE.FrontSide, THREE.DoubleSide), fog (scene.fog + material.fog), and scene.background.
- Key claims: Setting a color string after construction requires new THREE.Color or the material renders black; MeshBasicMaterial ignores lights, so it is performant but unrealistic; material.fog=false disables scene fog per object.
- Learner-relevant: Teaches the foundational material API (constructor options vs. post-instantiation property assignment), THREE constants, and fog/background workflow that carries over to all other materials.

### 0041

- Locator: `[[sources/three-js/20260907/0041. Mesh Lambert and Mesh Phong Materials.srt#0041]]`
- Summary: Introduces the cheapest light-reactive materials: MeshLambertMaterial (flat diffuse shading, visible banding) and MeshPhongMaterial (adds shininess for specular highlights), demonstrated with ambient + point lights on a torus knot.
- Key claims: Lambert materials cannot express roughness or metalness; Phong adds a shininess parameter to control specular highlight intensity; both still inherit color and other base material properties.
- Learner-relevant: Shows how adding a light reveals depth on reactive materials, and motivates the jump to PBR materials by exposing Lambert/Phong's inability to represent roughness and metalness.

### 0042

- Locator: `[[sources/three-js/20260907/0042. Mesh Standard and Mesh Physical Materials.srt#0042]]`
- Summary: Explains PBR (Physically Based Rendering) as the industry-standard approach used by Unity, Blender, Maya, etc.; covers MeshStandardMaterial (roughness, metalness) and MeshPhysicalMaterial (adds clearcoat and reflectivity).
- Key claims: PBR simulates real light/surface interaction via roughness and metalness; MeshPhysicalMaterial extends Standard with clearcoat (a wax-like reflective layer) and reflectivity (to make non-metallic surfaces reflective); high metalness absorbs less light and appears darker without higher light intensity.
- Learner-relevant: Gives the learner the vocabulary and parameter intuition (roughness/metalness/clearcoat/reflectivity) needed to author realistic materials and to export/import PBR content between Three.js and other 3D tools.

### 0043

- Locator: `[[sources/three-js/20260907/0043. Setup.srt#0043]]`
- Summary: Transitional setup lesson that creates sphere and cylinder geometries, practices post-instantiation mesh property assignment, rotates objects via scene.children iteration vs. THREE.Group, and previews the upcoming texture unit.
- Key claims: Meshes can be created empty and have geometry/material assigned later; scene.children can be looped to animate many objects, but filtering by instanceof Mesh avoids rotating lights; grouping is more performant than iterating a long children array.
- Learner-relevant: Reinforces core Three.js patterns (geometry creation, mesh construction variants, scene graph traversal, groups) that the learner needs before textures are introduced.
