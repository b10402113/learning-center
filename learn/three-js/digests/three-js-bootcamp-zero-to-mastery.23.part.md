---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 23
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 23)

## Overview (L1)

- 0124. Ready Player Me — 介绍 ReadyPlayerMe 平台，用它上传自拍生成个人风格化的 3D 化身，并下载为 GLB 文件供后续动画使用。
- 0125. Preparing Assets for Mixamo — 讲解 Mixamo 自动绑定动画的行业标准背景，演示用 Blender 将 GLB 转换为 FBX 并嵌入纹理的完整流程。
- 0126. Adding Mixamo Animations — 在 Mixamo 上传 FBX、挑选并下载跑步/空闲动画，再回 Blender 合并动画到单个 GLB 资产。
- 0127. Previewing Our Animations — 使用 three.js 官方编辑器预览导出的 avatar.glb，确认空闲与跑步动画正确绑定。
- 0128. Setting Up Our Code — 在项目中配置 Asset Loader 加载 avatar.glb，新增 assetsReady 状态，并用 unsubscribe 解决重复创建角色的问题。

## Sections (L2)

### 0124

- Locator: `[[sources/three-js/20260907/0124. Ready Player Me.srt#0124]]`
- Summary: 教师演示用 ReadyPlayerMe 网站创建个人风格化 3D 化身：选择体型、上传自拍自动生成头像，可自定义发型/服饰/配饰，最后下载为 GLB 文件。
- Key claims: ReadyPlayerMe 对非商业项目完全免费；GLB 是 3D 模型的标准 Web 资源格式；下载的 GLB 本身不含动画，需要后续添加。
- Learner-relevant: 让学习者获得第一个可复用的个人化角色资产，理解 GLB 作为 Web 3D 通用交换格式的地位，为后续 Mixamo 动画绑定提供输入。

### 0125

- Locator: `[[sources/three-js/20260907/0125. Preparing Assets for Mixamo.srt#0125]]`
- Summary: 解释 Mixamo 能跨来源使用动画的行业标准原因，演示在 Blender 中清理场景、导入 GLB、解压纹理、导出 FBX 并嵌入纹理的完整流程。
- Key claims: Mixamo 需要 FBX 格式而非 GLB；Blender 是免费开源的 3D 软件；导出 FBX 前必须先保存 .blend 文件并解压资源到当前目录，否则纹理无法正确嵌入。
- Learner-relevant: 让学习者掌握 GLB→FBX 的格式转换管线，理解"行业标准"如何降低跨工具协作成本，并学会用 Blender 做资产预处理。

### 0126

- Locator: `[[sources/three-js/20260907/0126. Adding Mixamo Animations.srt#0126]]`
- Summary: 在 Mixamo 上传 FBX、浏览动画库、挑选"原地跑步"与"空闲"动画并分别下载；回到 Blender 用 Nonlinear Animation 编辑器将跑步动画合并到空闲 FBX 上，最终导出含双动画的 GLB。
- Key claims: 必须勾选"In Place"否则角色会跑出场景；下载时建议保留皮肤（With Skin）避免错误；导出 GLB 时启用 Draco 压缩和动画优化可显著减小文件体积。
- Learner-relevant: 让学习者掌握"下载多个动画→合并到单一资产→导出 GLB"的完整工作流，理解 Draco 压缩对 Web 交付的必要性。

### 0127

- Locator: `[[sources/three-js/20260907/0127. Previewing Our Animations.srt#0127]]`
- Summary: 使用 three.js 官方编辑器导入 avatar.glb，添加环境光后通过动画下拉菜单切换空闲/跑步动画，验证导出结果是否正确。
- Key claims: three.js 官方编辑器可用于快速预览带动画的 GLB；模型默认使用 MeshStandardMaterial，无光时不可见，需添加环境光才能看到。
- Learner-relevant: 让学习者获得一个轻量级验证手段，在写代码前就能确认动画资产是否正确，减少调试成本。

### 0128

- Locator: `[[sources/three-js/20260907/0128. Setting Up Our Code.srt#0128]]`
- Summary: 在 Asset Loader 中注册 avatar.glb（id/path/type），新增 assetsReady 状态；在 world.js 中等待 physicsReady && assetsReady 同时满足后再创建角色，并用 unsubscribe 防止重复创建。
- Key claims: 角色类已被拆分为独立文件；AppStateStore 的 subscribe 在任意状态变化都会触发，因此必须同时检查所有依赖状态或及时 unsubscribe；预加载器（preloader）在真正有资产加载时必须恢复。
- Learner-relevant: 让学习者理解多异步依赖下的初始化顺序管理，掌握"状态就绪 + 取消订阅"模式，避免角色/环境被重复实例化。
