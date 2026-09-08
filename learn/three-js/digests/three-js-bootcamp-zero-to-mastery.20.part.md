---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 20
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 20)

## Overview (L1)

- 0106. Auto Compute Trimesh Collider — Introduces Trimesh colliders for arbitrary geometry; extracts vertex/index arrays from mesh geometry, scales them by world scale, and explains the performance trade-off vs primitive colliders.
- 0107. Putting it All Together! — Demonstrates the finished Physics class by spawning 100 random objects via a loop, adding them to both the scene and physics engine, and varying collider types (box/sphere).
- 0108. Introduction — Sets up the input controller module: goal is WASD-driven character movement that interacts with the physics world; notes starter-pack changes (InputController import, Character class).
- 0109. Input Controller — Builds the InputController: listens to keydown/keyup, uses event.code for layout-independent keys, stores forward/backward/left/right in a shared store, and subscribes the Character class to those states.
- 0110. Using Arrow Keys — Extends the input controller to also accept arrow keys (ArrowUp/Down/Left/Right) as aliases for WASD, improving accessibility for non-gamer keyboard layouts.
- 0111. Preventing Unnecessary Updates — Fixes key-repeat firing while held: tracks pressed keys in this.keyPressed and early-returns on repeat events so the store only updates on true press/release transitions.

## Sections (L2)

### 0106

- Locator: `[[sources/three-js/20260907/0106. Auto Compute Trimesh Collider.srt#0106]]`
- Summary: Replaces the sphere geometry with a torus knot and builds a Trimesh collider by pulling `mesh.geometry.attributes.position.array` for vertices and `mesh.geometry.index.array` for indices. A helper `computeTrimeshSizes(mesh)` returns `{ vertices, indices }`. Because Trimesh colliders are hollow and expensive, primitive colliders are preferred when shape approximation is acceptable. The section also covers scaling vertices by world scale: first with an explicit step-3 loop, then with a cleaner `vertices.map((v, i) => v * worldScale.getComponent(i % 3))` approach using `Vector3.getComponent` and modulo arithmetic.
- Key claims: Trimesh colliders accept any geometry via vertex/index arrays but cost more than box/sphere colliders; two identical Trimesh colliders at the same position will jitter because they are hollow shells; vertex arrays are flat [x,y,z,x,y,z,…] and must be scaled per-axis using `i % 3` to match world scale.
- Learner-relevant: Supports a node on physics colliders — gives the exact pattern for auto-computing a Trimesh collider from any mesh and scaling it correctly, plus the performance rationale for choosing primitive vs Trimesh colliders.

### 0107

- Locator: `[[sources/three-js/20260907/0107. Putting it All Together!.srt#0107]]`
- Summary: Wraps the physics module by using the `Physics.add(mesh, bodyType, colliderType)` helper inside a for-loop that spawns 100 meshes with random position, scale, and rotation. Demonstrates switching between box and sphere colliders and using `scale.setScalar` for uniform sizing. Confirms the physics class handles mixed dynamic objects without manual per-body setup.
- Key claims: The finished Physics.add method abstracts away collider creation; a single loop can populate both the scene and physics world; random transforms are centered by offsetting `Math.random() * 10 - 5` and dropping objects from `Math.random() + 5 * 10` on Y.
- Learner-relevant: Anchors the "physics integration" step — shows how to batch-add physics bodies and serves as a capstone for the physics section before moving to player input.

### 0108

- Locator: `[[sources/three-js/20260907/0108. Introduction.srt#0108]]`
- Summary: Introduces the input controller section. Two goals: (1) let the user control a character with WASD, and (2) connect that input to physics so the character can interact with the physics world. Notes starter-pack scaffolding: `InputController` imported in `app`, `Character` class added to `World`, and two new methods stubbed in the environment class.
- Key claims: Previous lessons only allowed camera control via mouse/touch; this section adds keyboard-driven character control; the Character class waits for physics to be ready before initializing.
- Learner-relevant: Frames the input-controller node — establishes why input is needed (to drive physics-aware character movement) and what scaffolding is already in place.

### 0109

- Locator: `[[sources/three-js/20260907/0109. Input Controller.srt#0109]]`
- Summary: Implements `InputController.startListening()` with `keydown`/`keyup` listeners. Uses `event.code` (not `event.key`) so WASD maps to physical key positions regardless of keyboard layout (e.g., QWERTZ). A switch statement maps W/A/S/D to `forward/left/right/backward` and writes them into a shared `inputStore` (a simple store with forward/backward/left/right booleans). The Character class subscribes to `inputStore` and copies state into instance properties; a guard ensures `character.loop()` only runs after the character exists. Keyup resets the corresponding direction to false.
- Key claims: `event.code` is layout-independent and preferred for game input; a shared store decouples input from character logic; keyup events are required to reset direction booleans.
- Learner-relevant: Core input-controller implementation — gives the exact store/listener/subscription pattern used to drive character movement.

### 0110

- Locator: `[[sources/three-js/20260907/0110. Using Arrow Keys.srt#0110]]`
- Summary: Adds arrow-key support by stacking `case` labels (`ArrowUp`, `ArrowLeft`, `ArrowDown`, `ArrowRight`) alongside the existing WASD cases in both the keydown and keyup switch statements. This lets users who don't game with WASD still control the character.
- Key claims: Multiple `case` clauses can map to the same branch; arrow keys use `ArrowUp/Down/Left/Right` codes.
- Learner-relevant: Small but practical accessibility extension — shows how to alias multiple physical keys to the same input state.

### 0111

- Locator: `[[sources/three-js/20260907/0111. Preventing Unnecessary Updates.srt#0111]]`
- Summary: Diagnoses key-repeat firing while a key is held: the browser emits repeated `keydown` events, causing the store to re-set the same boolean many times per second and triggering unnecessary subscriber updates. Fixes it by maintaining `this.keyPressed = {}`; on keydown, if `this.keyPressed[event.code]` is already true, return early; otherwise set it true and update the store. On keyup, set it false so the next fresh press is detected again.
- Key claims: Held keys generate repeated `keydown` events; guarding with a pressed-key map prevents redundant store updates; early return does not block other keys because each code is tracked independently.
- Learner-relevant: Important input robustness pattern — prevents store thrash and keeps subscriber callbacks (e.g., character loop) from running unnecessarily.
