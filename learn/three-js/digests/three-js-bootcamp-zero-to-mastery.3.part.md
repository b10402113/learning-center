---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 3
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 3)

## Overview (L1)

- **0015. Near and Far** — PerspectiveCamera 的近/远裁剪面属性；物体在 near 之前或 far 之外不可见；过大的 near/far 范围会导致 Z-fighting；材质单面设置会影响"看穿"物体的效果。
- **0016. Orbit Controls** — 从 three/addons 引入 OrbitControls；需要传入 camera 和 canvas DOM 元素初始化；仅当启用 damping 或 autoRotate 时才需在渲染循环中调用 update()。
- **0017. Renderloop** — 用 requestAnimationFrame 创建与屏幕刷新率同步的渲染循环；替代 setInterval/while 循环；在循环中先更新控件再渲染，类比"做动作—拍照片"的黏土动画流程。
- **0018. Orthographic Camera** — OrthographicCamera 无透视，物体大小不随距离变化；参数为 left/right/top/bottom/near/far；需将左右乘以屏幕宽高比以避免图像拉伸。
- **0019. Other Controls** — 概览 FlyControls、FirstPersonControls、PointerLockControls、TrackballControls、DragControls 等附加控件及其典型用例。

## Sections (L2)

### 0015

- Locator: `[[sources/three-js/20260907/0015. Near and Far.srt#0015]]`
- Summary: 讲解 PerspectiveCamera 的 near 与 far 属性如何决定可见范围；通过具体数值示例（物体在 5m 处，far 设为 3 即可隐藏）帮助理解；解释 Z-fighting 现象及避免方法；讨论材质 side 属性对观察内部的影响。
- Key claims: near 与 far 定义了相机可见的最近和最远距离；过大的 near/far 差异会导致 GPU 深度精度问题（Z-fighting）；物体表面到相机的实际距离可能小于其中心点距离，因此 near 值需小于表面最小距离才能看到物体；单面材质可能导致"一眼看穿"物体内部。
- Learner-relevant: 掌握相机裁剪面的实际调优方法，避免渲染异常；理解材质与相机属性对视觉表现的共同影响。

### 0016

- Locator: `[[sources/three-js/20260907/0016. Orbit Controls.srt#0016]]`
- Summary: 介绍如何从 three.js 示例和文档中找到 OrbitControls 的导入路径；演示初始化 `new OrbitControls(camera, canvas)`；说明 controls.update() 仅在启用 damping 或 autoRotate 时才需要；指出当前场景因只调用一次渲染而无法体现控件效果。
- Key claims: OrbitControls 位于 `three/addons/controls/OrbitControls.js`，随 three 包一起安装但不属于核心库；初始化必须传入相机和 DOM 元素（此处为 canvas）；damping 属性可使旋转更平滑；仅调用一次 render() 会导致控件无法实时响应。
- Learner-relevant: 学会从 three.js 官方示例中提取 addon 导入路径；理解控件初始化与渲染循环的依赖关系。

### 0017

- Locator: `[[sources/three-js/20260907/0017. Renderloop.srt#0017]]`
- Summary: 对比 setInterval、while 循环与 requestAnimationFrame 三种方案；解释设备刷新率（60/120/240Hz）与渲染帧率同步的重要性；实现递归调用 requestAnimationFrame 的渲染循环；在循环中先调用 controls.update() 再调用 renderer.render()。
- Key claims: 设备有帧率上限，渲染循环应与屏幕刷新率匹配以避免无效计算；setTimeout/setInterval 无法精确匹配刷新率；while 递归会导致调用栈溢出；requestAnimationFrame 由浏览器在每次重绘前调用，实现帧率自适应；启用 damping 时必须每帧调用 controls.update()。
- Learner-relevant: 掌握 requestAnimationFrame 的标准渲染循环模式；理解"先更新状态，再渲染画面"的帧流程。

### 0018

- Locator: `[[sources/three-js/20260907/0018. Orthographic Camera.srt#0018]]`
- Summary: 对比 OrthographicCamera 与 PerspectiveCamera 的视觉差异；解释正交相机参数 left/right/top/bottom 定义的是相机中心到可视盒子边缘的距离；演示因正方形视口被拉伸到矩形屏幕导致的变形问题；通过将左右参数乘以屏幕宽高比解决。
- Key claims: 正交相机无透视，物体大小不随距离变化；参数 left/right/top/bottom 是距离值而非角度；使用 -1,1,-1,1 会在矩形屏幕上产生拉伸；乘以 `window.innerWidth/innerHeight` 可使可视盒子匹配屏幕宽高比。
- Learner-relevant: 理解正交投影在等距视图、UI 叠加、技术可视化中的用途；掌握根据屏幕宽高比校正正交相机的方法。

### 0019

- Locator: `[[sources/three-js/20260907/0019. Other Controls.srt#0019]]`
- Summary: 概览多种 three.js 附加控件：FlyControls（鼠标指向 + WASD 飞行）、FirstPersonControls（指针锁定 + 移动/跳跃）、PointerLockControls（文档可查）、TrackballControls（自由旋转无垂直限位）、DragControls（拖拽场景对象）。
- Key claims: FlyControls 实现飞机式第一人称飞行；FirstPersonControls 使用指针锁定并支持跳跃；TrackballControls 比 OrbitControls 旋转更自由；DragControls 允许直接拖拽场景中的物体；所有控件均可通过 three.js 官方示例查看实现。
- Learner-relevant: 了解不同导航控件适用的交互场景（飞行模拟、FPS、物体操作），为后续项目选型提供参考。
