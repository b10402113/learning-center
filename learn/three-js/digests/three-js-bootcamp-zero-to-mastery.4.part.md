---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 4
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 4)

## Overview (L1)

- 0020. Resizing — Fixing the canvas not filling the screen on resize: updating `renderer.setSize`, `camera.aspect`, calling `camera.updateProjectionMatrix()`, and moving the logic into a `window` resize event listener instead of per-frame calls.
- 0021. Antialiasing — Introducing aliasing: the staircase/jagged edges that appear on cube sides when rotated, caused by the fact that screen pixels are discrete units and cannot render half-pixels.
- 0022. Antialiasing — Two families of solutions: hardware (higher pixel density / Retina-style displays) and software (antialiasing that shades edge pixels to create a smoother gradient illusion).
- 0023. Antialiasing — Implementing antialiasing in code: reading `window.devicePixelRatio`, capping it with `Math.min(devicePixelRatio, 2)`, passing it to `renderer.setPixelRatio()`, and enabling `antialias: true` in the `WebGLRenderer` constructor.
- 0024. Starter Pack — A quick refresher on installing the starter pack: unzip, open in VS Code, `npm install`, then `npm run dev` to start the local server.
- 0025. Transforming Position — First look at mesh transformations through position: units are arbitrary and relative, axes are x (red, right), y (green, up), z (blue, toward camera), and `AxesHelper` makes the coordinate system visible.
- 0026. Vector3 — Deepening the position concept: `position` is a `Vector3` object inherited from `Object3D`, which also provides `rotation` and `scale`; `Vector3` methods like `copy()` and `distance2()` enable vector math such as proximity detection between objects.

## Sections (L2)

### 0020

- Locator: `[[sources/three-js/20260907/0020. Resizing.srt#0020]]`
- Summary: Explains why the canvas does not fill the screen when the window is resized — the renderer was only told the initial size once. Walks through updating `renderer.setSize`, then `camera.aspect`, then calling `camera.updateProjectionMatrix()` so the projection reflects the new aspect ratio. Finally moves all resize logic out of the render loop into a `window.addEventListener('resize', ...)` callback so it only runs when needed.
- Key claims: Changing `camera.aspect` alone does nothing until `camera.updateProjectionMatrix()` is called; putting resize logic in a per-frame loop is wasteful — a resize event listener is the correct pattern; the renderer and camera both need to be updated for the scene to stay centered and correctly proportioned.
- Learner-relevant: Gives the learner the canonical Three.js resize recipe (setSize + aspect + updateProjectionMatrix + event listener) and reinforces the idea that camera parameters require an explicit update after mutation.

### 0021

- Locator: `[[sources/three-js/20260907/0021. Antialiasing.srt#0021]]`
- Summary: Introduces aliasing as the staircase pattern seen on the edges of the cube when it rotates. Explains that physical screen pixels are indivisible units — a pixel is either fully colored or not — so a diagonal or non-aligned edge gets approximated by whole pixels, producing the jagged "staircase" effect.
- Key claims: Aliasing is a well-known computer-graphics phenomenon; the staircase appears because the renderer cannot color half a pixel; the effect is most visible on edges that do not align with the pixel grid.
- Learner-relevant: Gives the learner the mental model for why edges look jagged, which motivates both the hardware and software antialiasing solutions that follow.

### 0022

- Locator: `[[sources/three-js/20260907/0022. Antialiasing.srt#0022]]`
- Summary: Presents two solution families. The hardware solution increases pixel density (e.g. Retina displays) so the staircase becomes finer and less noticeable — but more pixels means more GPU work. The software solution keeps the same pixel grid but shades edge pixels with gradients, creating the illusion of a smoother line.
- Key claims: Higher pixel ratio = more pixels = heavier rendering; antialiasing is a software trick that softens edges by blending colors rather than adding pixels; both approaches trade off visual quality against performance.
- Learner-relevant: Helps the learner understand that antialiasing is not free — it is a quality/performance trade-off — and sets up the practical implementation in the next section.

### 0023

- Locator: `[[sources/three-js/20260907/0023. Antialiasing.srt#0023]]`
- Summary: Implements both solutions in code. Reads `window.devicePixelRatio`, caps it with `Math.min(devicePixelRatio, 2)` to avoid wasting resources on excessively high-density mobile displays, and passes the result to `renderer.setPixelRatio()`. Also shows that `antialias: true` can be passed directly to the `WebGLRenderer` constructor for a software AA pass.
- Key claims: `devicePixelRatio` is often > 1 on modern screens; capping it at 2 prevents unnecessary over-rendering on 4K-class mobile displays; `antialias: true` is a one-line software fallback that smooths edges without changing pixel ratio.
- Learner-relevant: Gives the learner the production-ready pattern: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` plus the `antialias` constructor flag.

### 0024

- Locator: `[[sources/three-js/20260907/0024. Starter Pack.srt#0024]]`
- Summary: A short refresher on bootstrapping the course starter pack: download the zip, extract it, drag it into VS Code, run `npm install` to install dependencies, then `npm run dev` to start the local dev server and open the provided URL.
- Key claims: The starter pack is a pre-configured project; `npm install` installs dependencies; `npm run dev` starts the local server.
- Learner-relevant: Ensures the learner can reliably recreate the working environment before the next set of lessons.

### 0025

- Locator: `[[sources/three-js/20260907/0025. Transforming Position.srt#0025]]`
- Summary: Begins the mesh-transformation unit by setting `cubeMesh.position.y = 1`. Explains that Three.js units are arbitrary and relative — the learner picks a convention (e.g. 1 unit = 1 meter) and keeps it consistent. Introduces `AxesHelper` to visualize the coordinate axes: x = red (right), y = green (up), z = blue (toward the camera). Positive increments move in the axis direction; negative increments move opposite.
- Key claims: Units are arbitrary — consistency matters more than the choice; `AxesHelper` is the quickest way to orient yourself in a scene; the z-axis points toward the camera, so negative z moves away from the camera.
- Learner-relevant: Gives the learner the spatial vocabulary and the axis-color convention they will use for every subsequent transformation lesson.

### 0026

- Locator: `[[sources/three-js/20260907/0026. Vector3.srt#0026]]`
- Summary: Deepens the position concept by revealing that `position` is a `Vector3` object inherited from the `Object3D` base class (which also provides `rotation` and `scale`). Because it is a `Vector3`, it carries useful methods such as `copy()` and `distance2()`. Demonstrates using `distance2(camera.position)` to compute the distance between the mesh and the camera — a building block for proximity-based gameplay logic.
- Key claims: `Mesh` inherits transform properties from `Object3D`; `position` is not a plain object but a `Vector3` instance; `Vector3` methods like `copy()` and `distance2()` enable vector math without manual coordinate arithmetic.
- Learner-relevant: Moves the learner from "set a coordinate" to "use vector methods," unlocking a whole class of spatial operations (copying positions, measuring distances, detecting proximity).
