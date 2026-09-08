---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 24
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 24)

## Overview (L1)

- **0129. Adding Avatar to the Scene** — Imports a loaded avatar from the AssetStore, adds it to the scene, fixes scale/color-space issues, attaches it to the character controller's mesh, and implements smooth rotation toward movement direction using `Math.atan2` and Quaternion SLerp. Also adjusts collider size and adds position lerp for stair-climbing smoothness.
- **0130. Removing the Hitbox** — Hides the debug wireframe collision box by setting `visible = false`, leaving only the avatar mesh visible in the scene.
- **0131. Introduction to Animations** — Introduces the Three.js animation system: AnimationClips (from the GLB), AnimationMixer (the "conductor" that orchestrates playback), and AnimationActions. Accesses `avatar.animations` array containing idle and run clips from Mixamo. Explains the architecture with an orchestra analogy (clips = sheet music, avatar = musicians, mixer = conductor).
- **0132. Playing an Animation** — Creates an `instantiateAnimations` method, instantiates `AnimationMixer` with `avatar.scene`, calls `clipAction()` to obtain AnimationActions, and plays them. The mixer's `update(deltaTime)` must be called in the render loop for frame-rate-independent playback.
- **0133. Animation Action Map** — Replaces hardcoded index-based animation access with a `Map` keyed by clip name. Iterates `avatar.animations` to build the map, enabling clean `this.animations.get('idle').play()` style access.
- **0134. Transitioning Between Animations** — Subscribes to InputStore to switch idle/run based on movement keys. Introduces `action.stop()` to prevent animation mixing, then `crossFadeTo` for smooth crossfade transitions with a configurable duration. Requires `action.reset()` before playback. Notes scalability and stutter issues with direction changes.

## Sections (L2)

### 0129

- Locator: `[[sources/three-js/20260907/0129. Adding Avatar to the Scene.srt#0129]]`
- Summary: Loads the avatar from `AssetStore`, adds it to the scene, and fixes visual/behavioral issues (scale, color space, rotation, collider sizing, ground alignment). Implements smooth rotation toward movement direction using `Math.atan2` + Quaternion SLerp, and smooth position via lerp.
- Key claims: `this.avatar = this.assetStore.loadedAssets.avatar` retrieves the loaded asset; `avatar.scene` is what gets added to the Three.js scene; `THREE.sRGBEncoding` on `renderer.outputEncoding` fixes color mismatch between model textures and renderer; `avatar.rotation.y` uses `Math.atan2(x, z)` to derive the facing angle from a movement vector; `Quaternion.setFromAxisAngle` + `slerp` provides smooth rotation interpolation; movement vector length check (`movement.length > 0`) gates angle updates to prevent snapping when idle.
- Learner-relevant: Anchors to 3D model loading, color-space concepts, vector-to-angle math, and smooth interpolation patterns — all prerequisites for animation work.

### 0130

- Locator: `[[sources/three-js/20260907/0130. Removing the Hitbox.srt#0130]]`
- Summary: Sets the wireframe hitbox mesh's `visible` property to `false` to hide the debug collider box while keeping the avatar mesh visible.
- Key claims: `mesh.visible = false` hides the object from rendering without removing it from the scene graph; the collider still functions even when invisible.
- Learner-relevant: Quick cleanup step before animation work — debug visualization is useful during development but should be hidden in the final product.

### 0131

- Locator: `[[sources/three-js/20260907/0131. Introduction to Animations.srt#0131]]`
- Summary: Introduces the Three.js animation pipeline: AnimationClips (embedded in the GLB model), AnimationMixer (orchestrates playback and crossfading), and AnimationActions (playable instances of clips). Explains that clips live at `avatar.animations` (one level above `avatar.scene`), not on the scene object itself.
- Key claims: Three.js animation system was rewritten to mirror Unreal Engine's approach; clips are static data (like sheet music), actions are runtime-playable instances, and the mixer coordinates everything; `new THREE.AnimationMixer(avatar.scene)` takes the avatar scene graph as its root; the mixer supports crossfading between actions like a DJ blending tracks.
- Learner-relevant: Foundational mental model for the entire animation subsystem — understanding the clip → mixer → action chain is essential before writing any animation code.

### 0132

- Locator: `[[sources/three-js/20260907/0132. Playing an Animation.srt#0132]]`
- Summary: Implements the first playable animation by creating an `instantiateAnimations` method, building a mixer from `avatar.scene`, extracting clips by index from `avatar.animations`, calling `mixer.clipAction(clip)` to get an action, and calling `action.play()`. The mixer must be updated with `mixer.update(deltaTime)` in the render loop.
- Key claims: `avatar.animations` is an array — index 0 is idle, index 1 is run; `mixer.clipAction(clip)` returns a reusable AnimationAction; calling `action.play()` alone does nothing without `mixer.update(deltaTime)` in the loop; delta time ensures frame-rate-independent animation speed.
- Learner-relevant: First working animation — the minimal three-step pattern (create mixer → get action → play + update loop) is the foundation for all subsequent animation work.

### 0133

- Locator: `[[sources/three-js/20260907/0133. Animation Action Map.srt#0133]]`
- Summary: Replaces brittle index-based clip access (`animations[0]`, `animations[1]`) with a `Map` keyed by clip name. Iterates `avatar.animations` to build `this.animations`, passing each clip through `mixer.clipAction()` so the map stores ready-to-play actions.
- Key claims: `this.animations = new Map()` + `set(clip.name, mixer.clipAction(clip))` builds a name-to-action lookup; `this.animations.get('idle').play()` is cleaner and more maintainable than array indexing; the map should be built after mixer instantiation to ensure actions are properly bound.
- Learner-relevant: A practical code-quality pattern — using named keys instead of magic indices makes animation code self-documenting and resilient to clip order changes.

### 0134

- Locator: `[[sources/three-js/20260907/0134. Transitioning Between Animations.srt#0134]]`
- Summary: Connects animations to player input by subscribing to InputStore. When any movement key is pressed, plays the run action; otherwise plays idle. Introduces `action.stop()` to prevent simultaneous playback, then `crossFadeTo(targetAction, duration)` for smooth transitions. Calls `action.reset()` before play to avoid unexpected starting positions. Identifies two remaining issues: lack of scalability for more states and stuttering when changing direction mid-run.
- Key claims: The InputStore subscription fires only on state changes (not repeatedly while held) due to the default event listener behavior; `crossFadeTo` takes a target action and a duration (in seconds) — higher values mean smoother but slower transitions; `action.reset()` must be called before `play()` to start from the beginning; the current approach does not scale well to three or more states and causes stutter on direction changes because the input callback re-triggers crossfade unnecessarily.
- Learner-relevant: Establishes the input→animation wiring pattern and introduces crossfading as the key technique for smooth animation transitions, while explicitly noting its limitations (sets up the next lesson's improvement).
