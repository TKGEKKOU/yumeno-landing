# YUMENO Agent 舞台展示站重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 YUMENO 独立展示页重构为以“角色化 Agent 协作系统”为核心的全屏章节展示站，并提供独立的站内文档页。

**Architecture:** 继续使用 Vite + React 19 的静态多页面结构。首页由 `App.jsx` 管理 hash 驱动的全屏章节舞台，章节容器通过 `translate3d` 自动对齐；`docs.html` 使用独立 React 入口和独立 CSS 承载长文档。产品事实集中在内容常量中，视觉由 CSS 变量、线路图和真实素材驱动，不引入新的 UI 框架或后端。

**Tech Stack:** React 19、ReactDOM、Vite 6、原生 CSS、HTML5 Audio、CSS transitions/transforms。

## Global Constraints

- 主站章节 hash 必须为 `#home`、`#operator`、`#voice`、`#agents`、`#docs`。
- 页面中文标题使用“角色化 Agent”，不再使用 `#world` 或“World”作为章节命名。
- 首页必须极简，不放装饰性编号、技术指标或大段说明。
- 多 Agent 系统是主站最重要的展示内容，必须独立占据完整章节。
- 必须准确表达 `persona_supervisor`、受限 Worker、`finalize_*`、HITL/checkpoint；不得宣传成无限并行自由聊天。
- 主配色为黑、白、青蓝；紫色和粉色只做线条或状态点缀。
- 不引入随机漂移、假波形、Peel 或 ASCII Sweep 等与产品事实无关的效果。
- Live2D 只使用轻量真实素材展示；没有完整 motion 资源时不得伪造真实动作。
- 详细文档必须在 `/docs.html` 站内页面中，主站不再用抽屉承载全文。
- 不使用 GitHub Pages；构建结果必须可直接上传服务器。
- 所有动画支持 `prefers-reduced-motion`。

## 文件结构与职责

- Modify: `vite.config.js` — 配置 `docs.html` 的多页面构建入口。
- Modify: `index.html` — 更新主题色、标题、描述和入口元信息。
- Modify: `src/main.jsx` — 保持首页 React 入口，移除不必要的 StrictMode 噪声（若影响音频事件则保留并处理）。
- Rewrite: `src/App.jsx` — 首页章节状态、hash 导航、滚轮/键盘/触摸控制、音频播放器、角色状态、Agent 舞台和文档入口。
- Rewrite: `src/App.css` — 黑白青蓝视觉系统、全屏章节舞台、线路式 Agent 图、响应式和 reduced-motion。
- Rewrite: `src/index.css` — 全局 reset、字体、滚动/焦点可见性和基础可访问性。
- Create: `docs.html` — 独立文档页面入口。
- Create: `src/docs-main.jsx` — 文档 React 入口。
- Create: `src/Docs.jsx` — 文档目录、章节正文、站内锚点和返回主站。
- Create: `src/Docs.css` — 文档页阅读布局、代码块、表格、响应式目录。
- Keep: `src/assets/images/mortis.png`、`src/assets/audio/reference-segment.wav`、`src/assets/audio/yuno1-voice.wav` — 真实展示素材。
- Review only: `src/components/AsciiSweep.*`、`PeelReveal.*`、`Waveform.*` — 若重构后无引用则保留本次提交之外的清理，避免误删历史素材。
- Update: `README.md` — 说明主站、`docs.html`、本地运行、静态部署和真实素材来源。

---

### Task 1: 配置多页面入口与页面元信息

**Files:**
- Modify: `vite.config.js`
- Modify: `index.html`
- Create: `docs.html`

**Interfaces:**
- Produces Vite build entries `dist/index.html` 和 `dist/docs.html`。
- `docs.html` 必须加载 `/src/docs-main.jsx`。

- [ ] **Step 1: 扩展 Vite input**

在 `vite.config.js` 保留 `base: './'` 和现有输出目录，并加入：

```js
import { resolve } from 'node:path'

build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      docs: resolve(__dirname, 'docs.html'),
    },
  },
}
```

如果当前 ESM 配置下 `__dirname` 不可用，使用 `fileURLToPath(import.meta.url)` 计算项目根目录，不改变其他构建选项。

- [ ] **Step 2: 更新 `index.html`**

将主题色改为近黑色，标题和描述改成通俗、简短、突出角色化 Agent 的版本，例如：

```html
<meta name="theme-color" content="#070b10" />
<meta name="description" content="YUMENO：一个让角色拥有记忆、知识、声音和行动能力的本地工作台。" />
<title>YUMENO · 角色化 Agent 工作台</title>
```

- [ ] **Step 3: 创建 `docs.html`**

使用与首页相同的中文语言和主题色：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#070b10" />
    <meta name="description" content="YUMENO 文档：系统要求、使用方法、多 Agent 架构、声音工坊与部署说明。" />
    <title>YUMENO 文档 · 角色化 Agent 工作台</title>
  </head>
  <body>
    <div id="docs-root"></div>
    <script type="module" src="/src/docs-main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: 运行构建验证入口**

Run: `npm run build`
Expected: `dist/index.html` 与 `dist/docs.html` 均生成，且无 Rollup 输入错误。

- [ ] **Step 5: Commit**

```bash
git add vite.config.js index.html docs.html
git commit -m "feat: add static docs page entry"
```

### Task 2: 重写首页章节舞台和交互状态

**Files:**
- Rewrite: `src/App.jsx`
- Rewrite: `src/index.css`

**Interfaces:**
- `App` 根据 `window.location.hash` 维护 `activeSection`。
- `SECTION_IDS` 固定为 `['home', 'operator', 'voice', 'agents', 'docs']`。
- `AudioSample` 接收 `{ title, note, src, tone }` 并提供播放、暂停、进度拖动。
- 所有章节导航统一调用 `goToSection(id)`，由它更新 hash 与舞台索引。

- [ ] **Step 1: 写出章节状态的可验证行为清单**

实现前先在组件内部明确以下行为：

```text
首次无 hash        => home
首次带未知 hash    => home，并替换为 #home
点击导航 agents    => URL 变为 #agents，舞台移动到第 4 个章节
hashchange         => 舞台移动到对应章节
ArrowDown/PageDown => 下一章节，最后一章不再前进
ArrowUp/PageUp     => 上一章节，第一章不再后退
wheel/touch        => 每次手势最多移动一个章节
过渡期间再次输入   => 忽略，避免跳过场景
```

- [ ] **Step 2: 实现 `useSectionStage` 逻辑**

在 `src/App.jsx` 内实现 `goToSection(id, { replace = false } = {})`，用 `history.pushState`/`replaceState` 写 hash，并在 `popstate` 与 `hashchange` 时同步状态。用 `isTransitioningRef` 锁住约 700ms 的切换窗口。

滚轮逻辑使用累计阈值而不是每个 `wheel` 事件切换：单次手势达到正负 55 后调用一次 `goToIndex`，切换期间忽略事件；触摸记录 `touchstart`，在 `touchend` 根据 45px 阈值切换。

- [ ] **Step 3: 编写首页 JSX 章节结构**

章节顺序固定：

```jsx
<section id="home">...</section>
<section id="operator">...</section>
<section id="voice">...</section>
<section id="agents">...</section>
<section id="docs">...</section>
```

首页文本控制为品牌名、短句和按钮；`agents` 章节必须在页面结构和视觉面积上最突出。

- [ ] **Step 4: 实现真实音频播放器**

使用 `audioRef` 订阅 `timeupdate`、`loadedmetadata`、`ended`，用真实播放进度驱动进度线；两个播放器之间通过共享 `activeAudioId` 保证一次只播放一个。

- [ ] **Step 5: 实现角色状态反馈**

状态固定为 `idle`、`thinking`、`replying`。状态切换只改变真实可信的 UI 状态：状态标签、青蓝/紫粉轮廓线、轻微位移和短提示，不将其描述为完整 Live2D 动作。

- [ ] **Step 6: 运行构建验证首页代码**

Run: `npm run build`
Expected: 两个入口均能通过 JSX/CSS 编译。

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: build hash driven section stage"
```

### Task 3: 重做首页视觉与角色化 Agent 系统舞台

**Files:**
- Rewrite: `src/App.css`

**Interfaces:**
- `App.jsx` 使用的 class 名称必须在 CSS 中有对应规则。
- Agent 线路节点使用 `data-tone="cyan|violet|pink"` 控制点缀色。

- [ ] **Step 1: 建立 CSS 变量和舞台基础**

定义以下变量并以它们为唯一主色来源：

```css
:root {
  --ink: #070b10;
  --ink-soft: #0d141d;
  --paper: #f4f8fb;
  --muted: #8c9aa9;
  --line: rgba(183, 216, 235, .22);
  --cyan: #70e7ff;
  --cyan-strong: #17c8ee;
  --violet: #a992ff;
  --pink: #ff8fca;
}
```

实现固定视口、`stage-track` 的 transform 过渡、章节进入动画、导航和键盘焦点样式。

- [ ] **Step 2: 实现极简首页与章节导航**

首页大标题不超过两行，按钮使用线框样式；导航只显示短标签：

```text
首页 / 角色 / 声音 / 角色化 Agent / 文档
```

不出现 `01`、`03`、`里面如何工作` 等装饰性小字。

- [ ] **Step 3: 实现小型角色展台**

使用 `mortis.png` 作为 `operator` 章节的真实图片，限制图片最大宽度，不让其占据整个首页；通过裁切、边框、细线和状态光环形成展台。

- [ ] **Step 4: 实现 Agent 系统线路图**

使用 HTML/SVG 或 CSS 线路绘制中央 Supervisor 和六个 Worker 节点。中央节点文本至少包含：

```text
PERSONA SUPERVISOR
理解意图 · 选择路径 · 统一表达
```

节点文本至少包含：

```text
KNOWLEDGE PLANNER
检索 / RAG / SQL / web

MEMORY WORKER
长期记忆

DOCUMENT WORKER
资料导入与处理

PROFILE WORKER
角色设定

VOICE CLONE WORKER
参考音频与声音

CONFIG WORKER
Provider 与运行配置
```

用线路标注 `finalize_*` 返回 Supervisor，并单独标记 `HITL / CHECKPOINT`。

- [ ] **Step 5: 实现移动端布局**

桌面端使用中央地图；宽度小于 760px 时将 Worker 节点改为可滚动/纵向列表，中央 Supervisor 固定在上方，线路变为简短的竖向连接。

- [ ] **Step 6: 实现 reduced-motion**

在 `@media (prefers-reduced-motion: reduce)` 中将过渡时间缩短为 `1ms`，禁用线路流动和角色漂移，但保留可见状态变化。

- [ ] **Step 7: 运行构建验证样式**

Run: `npm run build`
Expected: 构建通过，CSS 无语法错误。

- [ ] **Step 8: Commit**

```bash
git add src/App.css
git commit -m "feat: make role agent system the visual core"
```

### Task 4: 创建独立文档子网页

**Files:**
- Create: `src/docs-main.jsx`
- Create: `src/Docs.jsx`
- Create: `src/Docs.css`

**Interfaces:**
- `src/docs-main.jsx` 从 `#docs-root` 挂载 `<Docs />`。
- `Docs` 使用固定文档章节 id：`quick-start`、`requirements`、`usage`、`architecture`、`voice-studio`、`live2d`、`extensions`、`deployment`、`privacy`、`faq`。
- 文档页所有主站内链接使用 `./index.html#...`，不依赖服务器 rewrite。

- [ ] **Step 1: 建立文档目录和正文数据**

正文必须清晰覆盖：

```text
快速开始：下载、解压/安装、启动、创建第一个角色
系统要求：Windows、本地磁盘、模型/语音服务按需配置
使用方法：角色、人设、会话、记忆、知识空间、Provider
多 Agent 架构：Supervisor、Knowledge Subgraph、Worker、finalize、HITL/checkpoint
声音工坊：素材、分离、切片、拼接、试听、保存、绑定
Live2D：资源位置、展示边界、运行时说明
扩展能力：Skill、MCP、Tool、B站/QQ/OneBot/NapCat
部署：本地启动、服务配置、静态展示站部署边界
数据与隐私：本地目录、角色隔离、敏感操作确认
FAQ：是否需要登录、是否必须联网、模型如何配置、声音依赖、数据位置
```

每段文案以本地项目事实为准；不把“可选”写成“默认已启用”。

- [ ] **Step 2: 实现阅读布局**

桌面端使用左侧 sticky 目录和右侧正文，正文宽度控制在 760px 左右；移动端目录变为顶部横向滚动导航或折叠列表。

- [ ] **Step 3: 实现代码块、表格和提示块**

至少提供安装命令代码块、Agent 数据流代码块、系统要求表格、注意事项提示块，并保证手机端代码可横向滚动。

- [ ] **Step 4: 运行构建验证文档入口**

Run: `npm run build`
Expected: `dist/docs.html` 与其静态资源生成，主站点击文档可打开文档页。

- [ ] **Step 5: Commit**

```bash
git add src/docs-main.jsx src/Docs.jsx src/Docs.css
git commit -m "feat: add in-site yumeno documentation"
```

### Task 5: 更新项目说明并进行浏览器验证

**Files:**
- Modify: `README.md`
- Review: `dist/index.html`, `dist/docs.html`

**Interfaces:**
- README 命令必须与实际 Vite 端口和入口一致。
- 交付前不得在 README 或页面中留下作者侧过程说明。

- [ ] **Step 1: 更新 README**

说明主站与文档页入口、开发命令、构建命令、静态服务器部署方式、主项目/Release 链接和真实素材来源。明确不需要 GitHub Pages。

- [ ] **Step 2: 构建并检查输出**

Run: `npm run build`
Expected: exit code 0；`dist/index.html`、`dist/docs.html` 存在；素材引用路径可解析。

- [ ] **Step 3: 启动本地服务**

Run: `npm run dev -- --host 127.0.0.1 --port 17000`
Expected: Vite 在 `http://127.0.0.1:17000/` 监听；`/docs.html` 返回文档页。

- [ ] **Step 4: 进行桌面端交互验证**

验证清单：

```text
打开 /                 => home
点击角色               => #operator
点击角色化 Agent       => #agents
滚轮一次               => 只切换一个章节并自动对齐
ArrowDown/ArrowUp      => 正确切换且不越界
直接打开 #agents       => 进入 Agent 章节
打开 /docs.html        => 文档目录和正文正常显示
点击返回主站           => 回到 index.html
```

- [ ] **Step 5: 进行移动端布局验证**

使用 390x844 和 768x1024 视口检查：无横向溢出、Agent 节点可读、音频控件可操作、文档目录不遮挡正文。

- [ ] **Step 6: 清理无引用组件并再次构建**

只有在确认 `AsciiSweep`、`PeelReveal`、`Waveform` 已无引用且不再承担展示功能后，才删除它们；否则保留。再次运行 `npm run build`。

- [ ] **Step 7: Commit**

```bash
git add README.md src vite.config.js index.html docs.html
git commit -m "chore: document and verify yumeno landing site"
```

## 自检结果

- 规格中的 `#world` 已替换为 `#agents`，中文展示名称为“角色化 Agent”。
- 多 Agent 架构在 Task 3 作为独立核心舞台实现，并在 Task 4 的文档中完整解释。
- 首页极简、真实音频、Mortis 展示、独立文档、静态部署和移动端均有对应任务。
- 未引入没有必要的新依赖或后端。
- 未使用 TODO、TBD、占位描述；每个实现步骤都给出了文件、接口、命令或可执行内容。

