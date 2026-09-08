---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 10
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 10)

## Overview (L1)

- **0058. spotLight** — Introduces `THREE.SpotLight` as the Three.js equivalent of a real-world stage spotlight or flashlight. Covers constructor params (color, intensity), `SpotLightHelper` for visualization, and key properties: `angle` (cone width, in radians), `penumbra` (edge softness), `decay` (intensity falloff rate), and `distance` (maximum range; 0 = infinite). Notes that `angle` must be in radians and requires `MathUtils.degToRad` for degree input.
- **0059. Setting spotLight Target** — Explains how to aim a spotlight at a specific object by setting `spotLight.target.position`. Unlike directional lights whose position alone determines direction, spotlights require explicit target positioning because they are local (non-infinite). The target is a full 3D object with its own `.position` vector.
- **0060. Rect Area Light** — Covers `THREE.RectAreaLight`, analogous to panel lights in photography studios and film sets. Demonstrates creation with color, intensity, width, and height; the `RectAreaLightHelper` (imported from `three/addons/helpers`, not core); and the universal `.lookAt()` method for orienting any 3D object including lights.
- **0061. Putting it All Together!** — A consolidation exercise that provides a complete playground combining all light types (ambient, directional, point, spot, rect area) with metallic/roughness material sliders. Sets up the next topic by observing that objects do not cast shadows despite occluding light, foreshadowing the shadows chapter.
- **0062. Exercise Imposter Syndrome** — A brief motivational interlude addressing imposter syndrome in learning. Encourages learners to teach or help others on Discord as a learning technique, reinforcing that explaining what you've learned prevents remaining a beginner. Not a technical lesson but a pedagogical break.
- **0063. Introduction (to Shadows)** — Introduces the four-step process for enabling shadows in Three.js: (1) `renderer.shadowMap.enabled = true`, (2) set `castShadow = true` on specific lights, (3) set `castShadow = true` on objects that should block light, (4) set `receiveShadow = true` on surfaces that should display shadows. Explains why shadows require explicit opt-in: performance cost and the absence of real ray-tracing in Three.js.
- **0064. Adding Shadows** — Hands-on implementation of the four-step shadow process in a scene with a red directional light, blue spotlight, and green point light. Enables shadows on directional and spotlight, sets castShadow on box/sphere/torusKnot, and receiveShadow on the ground circle. Notes that spotLight's `distance` parameter must be large enough to reach shadow-receiving objects.
- **0065. How Shadows Work** — Explains the internal mechanism: Three.js uses a camera (from the light's perspective) to render a depth/shadow map, which is then projected onto receiving surfaces. Introduces the `CameraHelper` to visualize what the shadow camera sees. Shadow quality is controlled by two avenues: the shadow camera's properties (near, far, fov) and the shadow map's resolution and filtering settings.

## Sections (L2)

### 0058

- Locator: `[[sources/three-js/20260907/0058. spotLight.srt#0058]]`
- Summary: Introduces the SpotLight class with its unique cone-shaped light emission, distinguishing it from PointLight by adding directional focus. Walks through creating a SpotLight with color and intensity, adding a SpotLightHelper, then explores the four tunable properties (angle, penumbra, decay, distance) via GUI sliders. Demonstrates that angle controls cone width, penumbra controls edge softness, decay controls falloff rate, and distance (default 0 = infinite) controls maximum range.
- Key claims: SpotLight emits light in a cone, analogous to a stage spotlight or flashlight; `angle` is in radians and requires `MathUtils.degToRad` for degree input; `distance = 0` means infinite range (all objects receive same intensity regardless of distance); penumbra controls the softness of the light cone edge; decay default is 2 for physically accurate falloff.
- Learner-relevant: Builds on PointLight knowledge by adding directional focus; the angle/penumbra/decay/distance parameters are unique to SpotLight and essential for stage-lighting and flashlight effects; understanding radians vs degrees for angle is a practical debugging concern.

### 0059

- Locator: `[[sources/three-js/20260907/0059. Setting spotLight Target.srt#0059]]`
- Summary: Explains that unlike directional lights (whose position determines direction toward origin), spotlights need explicit target control via `spotLight.target.position.set()`. The target is a 3D Object with its own position vector, so both the light's position and its target's position are independently controllable. Demonstrates by aiming the spotlight at a specific torus knot.
- Key claims: SpotLight is local (not infinite), so both position and target must be set independently; `spotLight.target` is a full 3D Object with `.position`; changing `target.position` redirects the spotlight without moving the light source itself; this two-point control (source + target) gives precise aiming.
- Learner-relevant: Critical for any scene where a spotlight must track or illuminate a specific object (e.g., stage lighting on a character); understanding the distinction between light position and target position prevents a common beginner confusion.

### 0060

- Locator: `[[sources/three-js/20260907/0060. Rect Area Light.srt#0060]]`
- Summary: Covers `THREE.RectAreaLight`, which emits light from a rectangular surface — like a softbox in photography or a panel light on a film set. Demonstrates creation with color (hex), intensity, width, and height. Shows that the helper comes from `three/addons/helpers/RectAreaLightHelper` (not core Three.js). Introduces the `.lookAt()` method as the universal way to orient any 3D object including lights, and shows how adjusting width/height creates strip-light or panel-light effects.
- Key claims: RectAreaLight is the closest Three.js equivalent to studio panel lights; its helper is imported from addons, not core Three.js; `.lookAt(x, y, z)` aligns any object's Z-axis toward a target point (works on cameras, lights, meshes); adjusting width and height changes the light's shape from square to strip, affecting the illumination pattern on surfaces.
- Learner-relevant: Completes the light type repertoire; understanding `.lookAt()` is broadly useful for cameras, lights, and any 3D object orientation; the addon import pattern is a practical detail that differs from core Three.js helpers.

### 0061

- Locator: `[[sources/three-js/20260907/0061. Putting it All Together!.srt#0061]]`
- Summary: A consolidation exercise providing a complete starter package that combines all light types (ambient, directional, point, spot, rect area) with metallic and roughness material sliders in a GUI. Encourages experimentation with light interactions and material properties. Observes that objects occluding light do not produce shadows, setting up the transition to the shadows chapter.
- Key claims: Combining multiple light types with material parameters (metalness, roughness) produces diverse visual effects; current lighting setup lacks shadows because Three.js does not compute them by default; shadows require a separate, explicit setup process (next chapter); the playground package is meant for self-directed experimentation.
- Learner-relevant: Bridges the lighting chapter to the shadows chapter; the observation about missing shadows provides motivation for learning the shadow system; the playground encourages hands-on exploration of light-material interactions.

### 0062

- Locator: `[[sources/three-js/20260907/0062. Exercise Imposter Syndrome.srt#0062]]`
- Summary: A motivational break addressing imposter syndrome — the feeling of not being good enough compared to experts. Frames it as a normal symptom of learning, not a flaw. Recommends a concrete exercise: pause the lecture and help another student on Discord, using the "teach what you learn" technique to reinforce understanding and combat the beginner mindset.
- Key claims: Imposter syndrome is a natural part of learning, not a sign of inadequacy; teaching or explaining concepts to others solidifies understanding more than passive study; the Discord community is a safe space for questions (everyone is a beginner); "if you never teach, you'll always remain a beginner."
- Learner-relevant: Addresses the psychological barrier that commonly arises mid-course; the teaching exercise is a proven pedagogical technique (Feynman method); recognizing imposter syndrome as a positive signal reframes the discomfort as evidence of growth.

### 0063

- Locator: `[[sources/three-js/20260907/0063. Introduction.srt#0063]]`
- Summary: Introduces the shadow system in Three.js, explaining why shadows require explicit configuration unlike lights. Lays out the four-step process: (1) enable `renderer.shadowMap.enabled`, (2) set `castShadow = true` on lights, (3) set `castShadow = true` on objects, (4) set `receiveShadow = true` on surfaces. Explains that Three.js fakes shadows (no ray-tracing) for performance, and selective shadow casting/receiving is necessary because shadow map rendering is computationally expensive.
- Key claims: Shadows in Three.js are not automatic; `renderer.shadowMap.enabled = true` must be set explicitly (default is false for performance); each light, caster, and receiver must be individually opted in; the four-step process is: renderer flag → light castShadow → object castShadow → object receiveShadow; ray-tracing libraries exist but are too expensive for real-time web experiences.
- Learner-relevant: Establishes the conceptual framework before implementation; understanding why explicit opt-in exists (performance) helps with debugging and scene optimization; the four-step mental model is essential for any shadow-using scene.

### 0064

- Locator: `[[sources/three-js/20260907/0064. Adding Shadows.srt#0064]]`
- Summary: Hands-on implementation of shadows in a scene with three lights (red directional, blue spotlight, green point). Walks through all four steps: enables `renderer.shadowMap.enabled`, sets `castShadow` on directional and spot lights, sets `castShadow` on box/sphere/torusKnot, and `receiveShadow` on the ground circle. Demonstrates that shadows appear but at low quality, and that the spotLight's `distance` parameter must be large enough to reach shadow-receiving objects.
- Key claims: Practical implementation follows the exact four-step process; not all lights need to cast shadows (point light skipped for demonstration); ground plane uses `receiveShadow` only (nothing below it to cast onto); spotLight's `distance` must exceed the distance to shadow receivers or shadows won't appear; initial shadow quality is low and needs further tuning (next lesson).
- Learner-relevant: Concrete implementation of the four-step model; the troubleshooting insight about spotLight distance is a common gotcha; seeing shadows appear confirms the theory from 0063 and sets up quality tuning in 0065.

### 0065

- Locator: `[[sources/three-js/20260907/0065. How Shadows Work.srt#0065]]`
- Summary: Explains Three.js's internal shadow rendering mechanism: a camera positioned at the light source renders a depth map of the scene from the light's perspective, then this shadow map texture is projected onto receiving surfaces. Introduces the `CameraHelper` (using `spotLight.shadow.camera`) to visualize what the shadow camera sees. Identifies two control surfaces for shadow quality: the shadow camera's properties (near, far, fov — identical to any perspective camera) and the shadow map's own settings (resolution, filtering).
- Key claims: Three.js shadows use a camera from the light's perspective to generate a shadow map (depth texture); this texture is projected onto receiving surfaces; `CameraHelper` can visualize the shadow camera's frustum; shadow quality is controlled by (a) shadow camera properties (near, far, fov — same as regular camera) and (b) shadow map properties (resolution, bias, filtering); fewer casters and receivers mean less computation.
- Learner-relevant: Understanding the camera-based shadow mechanism explains why shadow quality varies and how to tune it; the CameraHelper is a practical debugging tool; knowing that shadow cameras have the same properties as regular cameras (near, far, fov) connects to earlier camera lessons.
