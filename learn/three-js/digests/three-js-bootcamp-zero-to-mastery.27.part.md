---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 27
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 27)

## Overview (L1)

- 0143. Exporting GLB — Prepare a Blender scene for three.js by cleaning up collections, renaming meshes to match parent collections, applying transforms (rotation/scale normalized, origin set to geometry), and exporting as a compressed GLB with Draco and +Y up.
- 0144. Code — Return to three.js with a starter pack: camera repositioned for a top-down view, avatar scaled down to default, colliders resized, movement speed reduced, and a GUI pane added for live scene positioning.
- 0145. Importing Our Scene — Load environment.glb from the asset store, add the Blender scene to the three.js world, then use a GUI to tweak position/rotation/scale; add per-mesh physics via traverse and remove the placeholder ground.
- 0146. Targeting Scene Objects — Move away from blanket physics; inspect the scene's top-level children, distinguish meshes from groups (multi-material objects become groups), and use a keyword array + `some()` to selectively add only named objects (trees, terrain, rocks, stairs, portals, floor, bushes) to the physics world.

## Sections (L2)

### 0143

- Locator: `[[sources/three-js/20260907/0143. Exporting GLB.srt#0143]]`
- Summary: Walks through preparing a Blender scene for export to three.js — deleting unused hierarchy (Avatar), renaming every mesh to match its parent collection (Floor, Trees, Bushes, Rocks, Stairs, Portals) so they can be referenced by name in three.js, scaling the floor for a better background ratio, applying all transforms (Command/Ctrl + A) to bake rotation/scale into the mesh while keeping origins at geometry for Rapier physics, then exporting as a Draco-compressed GLB with +Y up and selected-only enabled.
- Key claims: Renaming meshes to match parent collections lets you find them by name in three.js; applying transforms normalizes rotation/scale to defaults so further three.js scaling is intuitive; origins are reset to geometry (not world origin) to avoid weird physics offsets; GLB packs everything into one file and Draco compression keeps size small; +Y up reconciles Blender's Z-up with three.js's Y-up.
- Learner-relevant: Establishes the Blender→three.js export pipeline and the naming convention that later steps rely on to target objects; teaches why transform application matters for physics engines like Rapier.

### 0144

- Locator: `[[sources/three-js/20260907/0144. Code.srt#0144]]`
- Summary: Reviews starter-pack changes made before importing the environment: camera offset/target adjusted for a more top-down, near-orthographic perspective; avatar scaled back down to default (removing the ×3 multiplier); box collider resized to fit the smaller avatar; character movement speed reduced; and a new GUI pane instantiated in the app constructor and passed to the environment for live positioning.
- Key claims: The camera is still perspective but positioned to feel more top-down; avatar scale is reset so the environment is built to the avatar's real size; collider and speed changes match the smaller avatar; the GUI pane is shared via `this.pane` so any class can use it.
- Learner-relevant: Shows how to re-calibrate an existing three.js project when switching from a placeholder scene to a real modeled environment; introduces the GUI tool used to position the imported scene without hardcoding values.

### 0145

- Locator: `[[sources/three-js/20260907/0145. Importing Our Scene.srt#0145]]`
- Summary: Loads environment.glb from the asset store, pulls the scene out of `loadedAssets.environment.scene`, and adds it to the three.js scene. A GUI is wired to the environment scene's position, rotation (radians), and a uniform scale placeholder so the whole model can be repositioned live. Physics is added by traversing every mesh in the scene and registering it as a fixed collider; the placeholder ground is then removed so the avatar runs on the real Blender floor.
- Key claims: `assetstore.loadedAssets.environment` contains the parsed GLB with its full object hierarchy; `this.pane.addInput` on a vector property gives a three-axis GUI; uniform scaling is achieved by linking a scalar placeholder to `environmentScene.scale.set()`; `scene.traverse` + `object.isMesh` registers every mesh as a physics collider.
- Learner-relevant: Demonstrates the standard GLB import pattern, GUI-driven scene alignment, and the naive "add physics to everything" approach that the next section refines.

### 0146

- Locator: `[[sources/three-js/20260907/0146. Targeting Scene Objects.srt#0146]]`
- Summary: Replaces blanket physics with selective object targeting. The top-level children of the imported scene are logged, revealing that some are meshes and others are groups (multi-material objects like terrain and trees become groups because three.js maps one material per mesh). A `physicsObjects` string array defines which named objects should collide; a `for...of` loop over top-level children uses `some()` + `name.includes()` to test membership, then traverses matching groups to add their child meshes to the physics world. Steps and portals are intentionally excluded.
- Key claims: Multi-material Blender objects import as groups, not meshes, so `traverse` is needed to reach child meshes; `physicsObjects.some(keyword => child.name.includes(keyword))` cleanly filters top-level children by name; excluding certain objects (steps, portals) avoids performance issues and sets up later shadow-casting control.
- Learner-relevant: Teaches how to read an imported GLB's hierarchy, why groups appear, and how to use a keyword array to selectively apply physics — a pattern reused later for lighting and shadow configuration.
