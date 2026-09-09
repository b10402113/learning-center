---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 25
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 25)

## Overview (L1)

- 0135. Cleaning Up The Controller — Refactors the three.js animation controller into a reusable `playAnimation` method that handles crossfade between animations, tracks the current action, and fixes a bug where changing direction reset the running animation.
- 0136. Blender Introduction — Introduces Blender as 3D editing software for creating models used in three.js; covers viewport navigation (orbit/zoom/pan), the Z-up coordinate system, and basic transforms (move/rotate/scale) via both GUI gizmos and keyboard shortcuts.
- 0137. Edit Mode — Explains Blender's Edit Mode for manipulating mesh geometry at the vertex, edge, and face level; covers selection modes (1/2/3), component-level transforms, and the conceptual difference between object-mode transforms and edit-mode vertex changes.
- 0138. Starting Our Scene — Begins building a three.js-ready scene in Blender by importing an avatar for scale reference, creating a floor mesh with axis-excluded scaling, and assigning a base-color material that maps back to three.js `MeshStandardMaterial` via the GLTF loader.

## Sections (L2)

### 0135

- Locator: `[[sources/three-js/20260907/0135. Cleaning Up The Controller.srt#0135]]`
- Summary: Refactors scattered animation-switching logic into a single `playAnimation(name)` method on the animation controller. It looks up the action by name, resets and plays it, then crossfades from the previously stored `currentAction`. An early-return guard prevents resetting when the requested animation is already playing, fixing a bug where direction changes interrupted the run cycle.
- Key claims: A centralized `playAnimation` method makes the controller scalable to many animations; storing `currentAction` enables crossfade between arbitrary animation pairs; comparing `currentAction` to the requested animation avoids redundant resets.
- Learner-relevant: Gives the learner a reusable animation-state pattern and a concrete example of how crossfade logic depends on tracking prior state — a pattern transferable to any state-machine-style controller.

### 0136

- Locator: `[[sources/three-js/20260907/0136. Blender Introduction.srt#0136]]`
- Summary: Provides a first formal introduction to Blender for three.js developers. It covers opening a new project, saving the `.blend` file, navigating the viewport with the 3D gizmo and mouse/keyboard shortcuts (middle-mouse orbit, scroll zoom, shift+middle-mouse pan, with Alt/Option fallbacks for trackpads). It highlights Blender's Z-up convention versus three.js's Y-up and notes the export setting that flips axes. Basic transforms — grab/move (G), rotate (R), scale (S) — are demonstrated with axis locking (e.g., G then Z) and contrasted between GUI gizmo interaction and keyboard-driven workflows.
- Key claims: Most production 3D models are authored in external DCC tools like Blender, not coded directly in three.js; Blender's Z-up system is arbitrary and can be flipped on export; keyboard shortcuts (G/R/S + axis key) are faster than gizmo manipulation once learned.
- Learner-relevant: Establishes the Blender-to-three.js pipeline mindset and gives the learner enough navigation and transform vocabulary to follow subsequent scene-building lessons.

### 0137

- Locator: `[[sources/three-js/20260907/0137. Edit Mode.srt#0137]]`
- Summary: Demonstrates Blender's Edit Mode (Tab), where the mesh itself can be edited rather than the object as a whole. It covers the three selection modes — vertex (1), edge (2), face (3) — and how to multi-select with Shift. Component-level transforms use the same G/R/S shortcuts as object mode, but they modify vertex positions rather than object properties. The section contrasts object mode (changes scale/rotation properties) with edit mode (changes underlying geometry), and introduces subdivision as a way to add new vertices for more complex shapes.
- Key claims: Edit Mode changes vertex positions; object mode changes transform properties — visually similar results but semantically different data; subdividing a face introduces new geometry that can be shaped into more complex forms.
- Learner-relevant: Gives the learner the mental model for when to edit geometry directly versus when to transform the object, and introduces subdivision as a gateway to more complex modeling.

### 0138

- Locator: `[[sources/three-js/20260907/0138. Starting Our Scene.srt#0138]]`
- Summary: Starts building a three.js-compatible environment in Blender. The instructor deletes the default cube/camera/light, then imports `avatar.glb` as a scale reference. It reviews viewport shading modes (solid, material preview, rendered, wireframe) and selects material preview for the best balance of information and performance. A floor is created from a cube scaled along X and Y only (Shift+Z excludes the Z axis), snapped to the ground plane, and renamed. A new material named "Floor Material" is created with a blue base color, and the section explains that Blender material base colors map to three.js `MeshStandardMaterial` through the GLTF loader.
- Key claims: Importing the avatar early provides real-world scale reference for environment modeling; Shift+axis excludes that axis from the transform, enabling planar scaling; Blender material base colors are preserved when exported to GLTF and imported into three.js.
- Learner-relevant: Connects Blender scene-building decisions directly to three.js import behavior, reinforcing why scale and material choices in the DCC tool matter at runtime.
