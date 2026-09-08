---
subject: three-js
status: draft
path: practice-first
created: 2026-09-07
---

# ROADMAP — three-js

## Goal
打造一個 3D IC 可視化編輯器 — 能夠在 3D 場景中操控 die 和 stack，變換座標、調整大小，零延遲，即使在 200 個 die 的場景中也能流暢運作。

## Learning path
**Practice-first（實作優先）：** 從第一秒就寫出可運作的 3D 場景，每次加入新功能都是為了完成一個具體的視覺目標。概念在實作中自然出現，而不是先學完再用。優化於保持動機和成就感，每一個節點都有一個明確的「能做什麼」的實作產出。

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe three-js/<node-id>` to measure a node, then `/nodes three-js/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 建場景，能跑起來

1. **[[learn/three-js/nodes/environment-setup|搭建 Three.js 環境]]**
   - Goal: Vite + TS 起一個能顯示 3D 方塊的頁面
   - Sources:
     - [[sources/three-js/20260907/0001. Three.js Bootcamp.srt#0001]]
     - [[sources/three-js/20260907/0002. Three.js Examples.srt#0002]]
     - [[sources/three-js/20260907/0003. Wait...What is Three.js_.srt#0003]]
     - [[sources/three-js/20260907/0004. Prerequisite Knowledge.srt#0004]]
     - [[sources/three-js/20260907/0005. Three.js Documentation.srt#0005]]
     - [[sources/three-js/20260907/0006. Hacking the Example.srt#0006]]
     - [[sources/three-js/20260907/0007. Three.js Fundamentals.srt#0007]]
     - [[sources/three-js/20260907/0008. Installing Vite.srt#0008]]
     - [[sources/three-js/20260907/0009. Three.js Setup.srt#0009]]

2. **[[learn/three-js/nodes/scene-camera-renderer|場景、攝影機、渲染器]]**
   - Goal: 理解 Scene → Camera → Renderer 管線，第一個 mesh 畫上畫面
   - Sources:
     - [[sources/three-js/20260907/0007. Three.js Fundamentals.srt#0007]]
     - [[sources/three-js/20260907/0010. Scene.srt#0010]]
     - [[sources/three-js/20260907/0011. Camera.srt#0011]]
     - [[sources/three-js/20260907/0012. Renderer.srt#0012]]

3. **[[learn/three-js/nodes/cameras|攝影機類型]]**
   - Goal: 理解 PerspectiveCamera 與 OrthographicCamera（IC 編輯器常用俯視）
   - Sources:
     - [[sources/three-js/20260907/0011. Camera.srt#0011]]
     - [[sources/three-js/20260907/0014. FOV.srt#0014]]
     - [[sources/three-js/20260907/0015. Near and Far.srt#0015]]
     - [[sources/three-js/20260907/0018. Orthographic Camera.srt#0018]]

4. **[[learn/three-js/nodes/controls|視角控制]]**
   - Goal: 加 OrbitControls，理解 damping/autoRotate，能縮放旋轉平移
   - Sources:
     - [[sources/three-js/20260907/0016. Orbit Controls.srt#0016]]
     - [[sources/three-js/20260907/0019. Other Controls.srt#0019]]

5. **[[learn/three-js/nodes/render-loop|渲染迴圈]]**
   - Goal: 用 requestAnimationFrame + Clock 寫出零延遲 render loop
   - Sources:
     - [[sources/three-js/20260907/0017. Renderloop.srt#0017]]

6. **[[learn/three-js/nodes/animation-patterns|動畫模式]]**
   - Goal: 用 sin/cos 做振盪動畫，frame-rate independent
   - Sources:
     - [[sources/three-js/20260907/0031. Animating Meshes.srt#0031]]
     - [[sources/three-js/20260907/0032. Animating Meshes.srt#0032]]
     - [[sources/three-js/20260907/0033. Other Animations.srt#0033]]

7. **[[learn/three-js/nodes/resizing-antialiasing|視窗調整與抗鋸齒]]**
   - Goal: 處理 window resize、devicePixelRatio、antialiasing
   - Sources:
     - [[sources/three-js/20260907/0020. Resizing.srt#0020]]
     - [[sources/three-js/20260907/0021. Antialiasing.srt#0021]]
     - [[sources/three-js/20260907/0022. Antialiasing.srt#0022]]
     - [[sources/three-js/20260907/0023. Antialiasing.srt#0023]]

8. **[[learn/three-js/nodes/coordinate-system|座標系統]]**
   - Goal: 理解 AxesHelper、Vector3、世界座標 vs 本地座標
   - Sources:
     - [[sources/three-js/20260907/0025. Transforming Position.srt#0025]]
     - [[sources/three-js/20260907/0026. Vector3.srt#0026]]

9. **[[learn/three-js/nodes/transforms|物件變換]]**
   - Goal: 能移動/旋轉/縮放物件，理解 Euler 旋轉順序
   - Sources:
     - [[sources/three-js/20260907/0027. Transforming Scale.srt#0027]]
     - [[sources/three-js/20260907/0029. Rotation.srt#0029]]
     - [[sources/three-js/20260907/0030. Rotation.srt#0030]]

10. **[[learn/three-js/nodes/scene-hierarchy|場景層級]]**
    - Goal: 理解父子關係、Group、變換繼承
    - Sources:
      - [[sources/three-js/20260907/0028. Scene Hierarchy.srt#0028]]

### Tier 2 — 讓場景好看

11. **[[learn/three-js/nodes/geometry-primitives|幾何體與內建形狀]]**
    - Goal: 理解 BufferGeometry，能建 Box/Sphere/Torus，用 TweakPane 即時調整
    - Sources:
      - [[sources/three-js/20260907/0035. Buffer Geometry.srt#0035]]
      - [[sources/three-js/20260907/0036. Primitives.srt#0036]]
      - [[sources/three-js/20260907/0037. Extra Tweakpane.srt#0037]]

12. **[[learn/three-js/nodes/materials|材質系統]]**
    - Goal: 能選 Basic/Standard/Physical，理解金屬度/粗糙度
    - Sources:
      - [[sources/three-js/20260907/0038. Materials vs. Textures.srt#0038]]
      - [[sources/three-js/20260907/0039. Material Types.srt#0039]]
      - [[sources/three-js/20260907/0040. MeshBasicMaterial.srt#0040]]
      - [[sources/three-js/20260907/0041. Mesh Lambert and Mesh Phong Materials.srt#0041]]
      - [[sources/three-js/20260907/0042. Mesh Standard and Mesh Physical Materials.srt#0042]]

13. **[[learn/three-js/nodes/textures-uv|紋理與 UV 映射]]**
    - Goal: 能載入紋理、設定 repeat/offset/wrap，理解 UV 映射
    - Sources:
      - [[sources/three-js/20260907/0044. Setup.srt#0044]]
      - [[sources/three-js/20260907/0045. Repeating Texture.srt#0045]]
      - [[sources/three-js/20260907/0046. Texture Offset.srt#0046]]
      - [[sources/three-js/20260907/0047. UV Maps.srt#0047]]
      - [[sources/three-js/20260907/0048. UV Mapping.srt#0048]]

14. **[[learn/three-js/nodes/pbr-maps|PBR 進階紋理]]**
    - Goal: 能用法線/粗糙度/金屬/高度/AO 貼圖
    - Sources:
      - [[sources/three-js/20260907/0049. PBR Maps.srt#0049]]
      - [[sources/three-js/20260907/0050. Normal Map.srt#0050]]
      - [[sources/three-js/20260907/0051. Height Map.srt#0051]]
      - [[sources/three-js/20260907/0052. AO Map.srt#0052]]
      - [[sources/three-js/20260907/0053. Putting it All Together!.srt#0053]]

15. **[[learn/three-js/nodes/lighting|光照系統]]**
    - Goal: 能搭出 Ambient/Hemisphere/Directional/Point/Spot/RectArea 混合光照
    - Sources:
      - [[sources/three-js/20260907/0054. Introduction and Ambient Light.srt#0054]]
      - [[sources/three-js/20260907/0055. Hemisphere Light.srt#0055]]
      - [[sources/three-js/20260907/0056. Directional Light.srt#0056]]
      - [[sources/three-js/20260907/0057. pointLight.srt#0057]]
      - [[sources/three-js/20260907/0058. spotLight.srt#0058]]
      - [[sources/three-js/20260907/0059. Setting spotLight Target.srt#0059]]
      - [[sources/three-js/20260907/0060. Rect Area Light.srt#0060]]

16. **[[learn/three-js/nodes/shadows|陰影]]**
    - Goal: 能開啟陰影、調 shadow map 類型、處理 shadow acne
    - Sources:
      - [[sources/three-js/20260907/0063. Introduction.srt#0063]]
      - [[sources/three-js/20260907/0064. Adding Shadows.srt#0064]]
      - [[sources/three-js/20260907/0065. How Shadows Work.srt#0065]]
      - [[sources/three-js/20260907/0066. Shadow Properties.srt#0066]]
      - [[sources/three-js/20260907/0067. Shadow Properties.srt#0067]]
      - [[sources/three-js/20260907/0068. Shadow Map Types.srt#0068]]

17. **[[learn/three-js/nodes/model-loading|GLTF 模型匯入]]**
    - Goal: 能載入 GLB、訪問巢狀 mesh、用 Draco 壓縮
    - Sources:
      - [[sources/three-js/20260907/0078. GLTF Introduction.srt#0078]]
      - [[sources/three-js/20260907/0079. Loading the Model.srt#0079]]
      - [[sources/three-js/20260907/0080. Load Async.srt#0080]]
      - [[sources/three-js/20260907/0081. Changing Loaded Model Properties.srt#0081]]
      - [[sources/three-js/20260907/0082. Working with Nested Meshes.srt#0082]]
      - [[sources/three-js/20260907/0083. DRACOLoader.srt#0083]]

### Tier 3 — 大量物件，效能先行

18. **[[learn/three-js/nodes/instanced-mesh|InstancedMesh 大量渲染]]**
    - Goal: 200 個 die 用單一 draw call，FPS 穩定 — 編輯器核心
    - Sources:
      - [[sources/three-js/20260907/0035. Buffer Geometry.srt#0035]]
      - [[sources/three-js/20260907/0075. Automating Mesh Generation.srt#0075]]
      - Three.js InstancedMesh 文件（Context7 補足）

19. **[[learn/three-js/nodes/data-driven-scene|資料驅動場景]]**
    - Goal: 用 planet-array 模式把場景物件資料化，從陣列自動生成 mesh
    - Sources:
      - [[sources/three-js/20260907/0069. Introduction.srt#0069]]
      - [[sources/three-js/20260907/0070. Planning Our Project.srt#0070]]
      - [[sources/three-js/20260907/0071. Adding Meshes.srt#0071]]
      - [[sources/three-js/20260907/0072. Planetary Orbit.srt#0072]]
      - [[sources/three-js/20260907/0073. Planet Array.srt#0073]]
      - [[sources/three-js/20260907/0074. Adding Materials.srt#0074]]
      - [[sources/three-js/20260907/0075. Automating Mesh Generation.srt#0075]]
      - [[sources/three-js/20260907/0076. Animating the Planet Array.srt#0076]]

### Tier 4 — 互動：選擇與操控

20. **[[learn/three-js/nodes/raycasting|Raycasting 選取物件]]**
    - Goal: 能點擊選中 die，200 物件下保持流暢
    - Sources:
      - Three.js Raycasting 文件（Context7 補足）

21. **[[learn/three-js/nodes/transform-controls|TransformControls 變換]]**
    - Goal: 能用 gizmo 控制移動/旋轉/縮放，拖拽即時反映
    - Sources:
      - Three.js TransformControls 文件（Context7 補足）

22. **[[learn/three-js/nodes/custom-drag|自訂拖拽控制]]**
    - Goal: 能沿特定平面拖拽 die，零延遲，支援群組拖拽
    - Sources:
      - [[sources/three-js/20260907/0019. Other Controls.srt#0019]]
      - Three.js DragControls 文件（Context7 補足）

23. **[[learn/three-js/nodes/input-controller|輸入控制器]]**
    - Goal: 用 Zustand 管理鍵盤狀態（WASD/快捷鍵），debounce 防抖
    - Sources:
      - [[sources/three-js/20260907/0108. Introduction.srt#0108]]
      - [[sources/three-js/20260907/0109. Input Controller.srt#0109]]
      - [[sources/three-js/20260907/0110. Using Arrow Keys.srt#0110]]
      - [[sources/three-js/20260907/0111. Preventing Unnecessary Updates.srt#0111]]

### Tier 5 — 編輯器整合

24. **[[learn/three-js/nodes/state-management|狀態管理]]**
    - Goal: 用 Zustand 做編輯器狀態（選取、模式、undo stack）
    - Sources:
      - [[sources/three-js/20260907/0089. Zustand and Resizing.srt#0089]]

25. **[[learn/three-js/nodes/die-stack-model|Die 與 Stack 資料模型]]**
    - Goal: 設計 die/stack 的 TypeScript 型別，陣列管理，從資料自動生成場景
    - Sources:
      - [[sources/three-js/20260907/0073. Planet Array.srt#0073]]
      - [[sources/three-js/20260907/0074. Adding Materials.srt#0074]]
      - [[sources/three-js/20260907/0075. Automating Mesh Generation.srt#0075]]
      - [[sources/three-js/20260907/0084. Introduction and Prerequisites.srt#0084]]
      - [[sources/three-js/20260907/0085. Exporting and Importing Modules.srt#0085]]
      - [[sources/three-js/20260907/0086. Creating Our Classes.srt#0086]]

26. **[[learn/three-js/nodes/interactive-panel|互動式 UI 控制面板]]**
    - Goal: TweakPane 做屬性面板，即時調整座標/大小/材質
    - Sources:
      - [[sources/three-js/20260907/0037. Extra Tweakpane.srt#0037]]

27. **[[learn/three-js/nodes/asset-pipeline|資源管線與 Preloader]]**
    - Goal: AssetLoader + AssetStore，進度列，場景就緒才啟動
    - Sources:
      - [[sources/three-js/20260907/0090. Introduction.srt#0090]]
      - [[sources/three-js/20260907/0091. Asset Array.srt#0091]]
      - [[sources/three-js/20260907/0092. Creating the AssetStore.srt#0092]]
      - [[sources/three-js/20260907/0093. Loading Our Assets.srt#0093]]
      - [[sources/three-js/20260907/0094. Preloader Progress.srt#0094]]
      - [[sources/three-js/20260907/0095. Preloader UI.srt#0095]]
      - [[sources/three-js/20260907/0096. Putting it All Together!.srt#0096]]

### Tier 6 — 進階視覺與架構

28. **[[learn/three-js/nodes/environment-lighting|環境貼圖與反射]]**
    - Goal: HDR 環境貼圖做 die 表面反射，CubeTexture 背景
    - Sources:
      - [[sources/three-js/20260907/0077. Final Touches!.srt#0077]]
      - [[sources/three-js/20260907/0081. Changing Loaded Model Properties.srt#0081]]

29. **[[learn/three-js/nodes/post-processing|後製效果]]**
    - Goal: 加 bloom、tone mapping 讓場景更專業
    - Sources:
      - [[sources/three-js/20260907/0023. Antialiasing.srt#0023]]
      - [[sources/three-js/20260907/0147. Adding Shadows.srt#0147]]
      - Three.js PostProcessing 文件（Context7 補足）

30. **[[learn/three-js/nodes/architecture|架構整合]]**
    - Goal: ES modules / 類別重構，把整個編輯器組裝起來
    - Sources:
      - [[sources/three-js/20260907/0084. Introduction and Prerequisites.srt#0084]]
      - [[sources/three-js/20260907/0085. Exporting and Importing Modules.srt#0085]]
      - [[sources/three-js/20260907/0086. Creating Our Classes.srt#0086]]
      - [[sources/three-js/20260907/0087. Creating Our Classes.srt#0087]]
      - [[sources/three-js/20260907/0088. Adding Objects.srt#0088]]
      - [[sources/three-js/20260907/0089. Zustand and Resizing.srt#0089]]

## Status
- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
