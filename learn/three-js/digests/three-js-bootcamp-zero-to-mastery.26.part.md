---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 26
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 26)

## Overview (L1)

- 0139. Terrain and Assigning Materials — Build blocky low-poly terrain from cubes; use loop cuts to split a mesh and assign separate dirt/grass materials to different faces; create light/dark material variants for color contrast.
- 0140. Adding Trees — Model low-poly trees from 6-sided cones; use inset + extrude to add a trunk; assign wood and leaf materials; move the object origin to the base so scaling doesn't sink the tree into the ground; organize assets into collections.
- 0141. Adding Extra Objects — Populate the scene with bushes, rocks, and stairs made from scaled cubes; use collections to transform many objects at once (e.g., nudging all bushes slightly into the ground).
- 0142. Adding Portals — Model Stonehenge-style gates from scaled/rotated cubes; add glowing portal planes using emissive materials; set up gates and portals collections so the 3JS code can reference interactive objects on export.

## Sections (L2)

### 0139

- Locator: `[[sources/three-js/20260907/0139. Terrain and Assigning Materials.srt#0139]]`
- Summary: Create the first terrain block from a scaled cube, snap it to the ground, then use loop cuts (Command+R) in edit mode to split the mesh horizontally so the top can receive a grass material and the bottom a dirt material. Duplicate blocks (Shift+D), snap them to the ground, and arrange a staircase layout. Create light/dark variants of dirt and grass materials by duplicating the material slot, enabling per-block color contrast.
- Key claims: Loop cuts let you split a single mesh into face groups that can each hold a different material; changing a shared material updates every object that uses it, so duplicated material slots are needed for independent colors; snapping to a face and then turning off snap lets you reposition along a single axis without losing ground alignment.
- Learner-relevant: Anchors multi-material assignment on a single mesh, material-slot duplication for independent styling, and block-duplication workflow for modular level layout.

### 0140

- Locator: `[[sources/three-js/20260907/0140. Adding Trees.srt#0140]]`
- Summary: Create a low-poly tree from a cone with 6 vertices (set before clicking away from the creation menu). In edit mode, select the bottom face, inset (I) to create an inner hexagon, then extrude (E) downward to form a trunk. Assign a leaf material to the cone and a wood material to the trunk. Move the object origin to the base by selecting all faces in edit mode and translating them to the bottom, so later scaling grows the tree upward instead of sinking it. Place trees across the terrain with snap on, then vary scale and rotation for a less uniform look.
- Key claims: Cone vertex count must be set at creation time and cannot be changed later; inset + extrude is the standard way to add geometric detail like trunks; relocating the object origin to the base prevents scaling artifacts when placing objects on the ground.
- Learner-relevant: Anchors edit-mode mesh modeling (inset/extrude), multi-material assignment on a single mesh, and the practical trick of origin placement for instanced/scaled environment props.

### 0141

- Locator: `[[sources/three-js/20260907/0141. Adding Extra Objects.srt#0141]]`
- Summary: A fast-paced pass adding bushes, rocks, and stairs from scaled cubes to fill out the scene. Stairs are just cubes scaled to the right proportion so the player can walk up them. Rocks are scaled cubes with slight non-uniform scaling for variety. Using a collection for all bushes allows selecting and translating them together so they sit slightly embedded in the ground.
- Key claims: Simple primitives (cubes) scaled and rotated are enough to read as rocks, stairs, and bushes in a low-poly aesthetic; collections let you batch-transform many objects at once.
- Learner-relevant: Anchors the idea that environment dressing is iterative reuse of primitives, and that collections are an organizational tool for grouped transforms.

### 0142

- Locator: `[[sources/three-js/20260907/0142. Adding Portals.srt#0142]]`
- Summary: Build a Stonehenge-style gate from cubes: scale and rotate a cube for the body, add a wider rotated top beam, and keep the proportions slightly imperfect for the desired aesthetic. Create a separate plane, rotate it upright, and place it inside the gate as the portal surface. Assign a marble-like material to the gate and an emissive (glowing) material to the portal plane so it reads as a luminous doorway in 3JS. Duplicate the gate+portal pair across the scene, keeping all gates in one collection and all portals in another so the 3JS code can reference them for player interaction triggers.
- Key claims: Emissive materials on a plane create a glow effect that does not respond to scene light, making it suitable for a portal look; organizing gates and portals into separate collections preserves referenceability after export to glTF/3JS.
- Learner-relevant: Anchors emissive materials for glowing effects, the gate-as-trigger-object pattern for later 3JS interactivity, and collection-based scene prep for code-side object lookup.
