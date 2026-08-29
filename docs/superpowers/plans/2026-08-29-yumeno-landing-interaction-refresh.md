# YUMENO Landing Interaction Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 YUMENO 独立展示页重做为浅色现代角色工作台，加入实用的侧边 Peel、受控 ASCII Sweep、可点击声音试听，并把部署方式压缩到工作台内部。

**Architecture:** 保持当前 Vite + React 单页结构，不引入后端、不引入 UI 框架。`App.jsx` 负责页面内容和状态编排；`PeelReveal` 负责侧边工具栏展开；`AsciiSweep` 负责受控的面板切换过渡；`Waveform` 负责声音试听状态的可视化；CSS 文件分别负责全局令牌、页面布局和组件动画。浏览器音频只在用户点击后通过 Web Audio API 启动，静态内容仍可直接构建到 `dist/` 上传服务器。

**Tech Stack:** React 19、React DOM 19、Vite 6、原生 CSS、Web Audio API、Canvas 2D（带 DOM/CSS 降级）。

## Global Constraints

- 页面标题和副标题使用通俗表达，不在首屏堆叠技术术语。
- 页面整体使用浅灰白、深石墨、靛蓝和青绿色，不再使用大面积朱红作为主色。
- Peel 必须用于工作台侧边的实用导航，不再用于 Hero 大块宣传卡片。
- ASCII Sweep 只在用户切换面板时触发，不做全页面无限循环背景动画。
- 声音必须由用户操作触发，不允许自动播放。
- 浏览器试听必须明确是演示音，不得描述为 YUMENO 内置真实角色音频。
- 支持 `prefers-reduced-motion`、键盘操作和移动端点击展开。
- 不新增后端、登录、数据库、统计服务或 GitHub Pages 部署。
- 现有真实项目数据继续标注为项目当前资料中的内部评测数据，不代表第三方认证。
- 构建命令为 `npm run build`；本地服务使用现有 Vite 端口 `17000`。

---

## 文件与职责映射

### 修改

- `E:\yumeno-landing\src\App.jsx`：页面结构、文案、工作台状态、部署方式内嵌选择器、声音试听状态编排。
- `E:\yumeno-landing\src\App.css`：页面布局、浅色视觉令牌、工作台 mockup、状态面板、响应式规则。
- `E:\yumeno-landing\src\index.css`：全局 reset、字体、焦点样式、减少动效基础规则。
- `E:\yumeno-landing\src\components\PeelReveal.jsx`：侧边 Peel 的鼠标、键盘、移动端状态和可访问性。
- `E:\yumeno-landing\src\components\PeelReveal.css`：侧边 Peel 视觉、展开过渡、遮罩与移动端样式。
- `E:\yumeno-landing\src\components\AsciiSweep.jsx`：受控面板切换、Canvas 字符带、降级动画和减少动效处理。
- `E:\yumeno-landing\src\components\AsciiSweep.css`：ASCII 过渡层、内容层和降级样式。
- `E:\yumeno-landing\src\components\Waveform.jsx`：播放/暂停/完成回调、动态波形、进度和键盘操作。
- `E:\yumeno-landing\src\components\Waveform.css`：波形布局、播放状态、进度轨道和状态按钮。

### 不修改

- `E:\yumeno-landing\package.json`：现有依赖足够，不添加音频库或图标库。
- `E:\yumeno-landing\vite.config.js`：继续使用当前静态构建配置。
- `E:\yumeno-landing\index.html`：仅在构建验证发现标题或 meta 需要同步时再调整。

---

### Task 1: 重建页面状态模型和工作台结构

**Files:**
- Modify: `E:\yumeno-landing\src\App.jsx`
- Modify: `E:\yumeno-landing\src\App.css`
- Modify: `E:\yumeno-landing\src\index.css`

**Interfaces:**
- `App` 提供 `workspaceTab`、`deploymentMode`、`voiceStep`、`isVoicePlaying` 等状态给展示区域。
- `WorkspaceStatusPanel` 使用 `activeTab` 和 `onTabChange(tabId)` 接口。
- `DeploymentSwitcher` 使用 `value` 和 `onChange(nextValue)` 接口。
- `Waveform` 后续消费 `isPlaying`、`progress`、`onToggle` 接口。

- [ ] **Step 1: 记录当前构建基线**

运行：

```powershell
npm run build
```

预期：输出 `✓ built successfully`，作为本次重做前的可回归基线。

- [ ] **Step 2: 替换 App 的首页工作台内容**

在 `App.jsx` 中引入 `useState`，建立三个状态面板和部署选项数据，使用以下结构作为实现基准：

```jsx
const [workspaceTab, setWorkspaceTab] = useState('character');
const [deploymentMode, setDeploymentMode] = useState('hybrid');
const [voiceStep, setVoiceStep] = useState('preview');
const [isVoicePlaying, setIsVoicePlaying] = useState(false);

const workspacePanels = {
  character: { label: '角色状态', title: '雾岛澪', text: '正在与你保持一段连续的对话。' },
  voice: { label: '声音状态', title: '声音已准备好', text: '可以试听，也可以继续在声音工坊里调整。' },
  memory: { label: '记忆状态', title: '最近的事还在', text: '重要的对话和偏好保留在当前角色的空间里。' },
};

const deploymentModes = {
  cloud: '先打开 YUMENO，快速感受角色对话和知识能力。',
  hybrid: '对话可以连接服务，声音、资料和角色数据仍然留在自己的设备上。',
  local: '模型、声音、资料和会话都在本地运行，适合更重视隐私和控制力的场景。',
};
```

Hero 的标题使用通俗文案，例如“让一个角色，慢慢成为你熟悉的存在。”；将原先 `hero-peel` 中的大块宣传海报替换为工作台 mockup，并保留下载与向下浏览 CTA。

- [ ] **Step 3: 将部署内容嵌入本地工作方式区域**

删除独立的 `deployment-section` 渲染，改为 `runtime-section` 内的紧凑选择器：

```jsx
<div className="deployment-switcher" role="tablist" aria-label="资料放置方式">
  {Object.entries({ cloud: '快速体验', hybrid: '混合使用', local: '完全本地' }).map(([key, label]) => (
    <button
      key={key}
      type="button"
      role="tab"
      aria-selected={deploymentMode === key}
      className={deploymentMode === key ? 'is-active' : ''}
      onClick={() => setDeploymentMode(key)}
    >
      {label}
    </button>
  ))}
</div>
<p className="deployment-description">{deploymentModes[deploymentMode]}</p>
```

- [ ] **Step 4: 为页面结构补充可访问性关系**

为状态 tab 添加 `role="tablist"`、`role="tab"`、`aria-selected` 和 `aria-controls`；为对应内容添加 `role="tabpanel"`。所有展开、播放、切换操作使用 button，不用不可访问的 div 点击。

- [ ] **Step 5: 构建并提交结构版本**

运行：

```powershell
npm run build
```

预期：构建成功，无 JSX 编译错误。

提交：

```powershell
git add src/App.jsx src/App.css src/index.css
git commit -m "feat: reshape landing page as character workspace"
```

---

### Task 2: 将 Peel 重写为侧边实用工具栏

**Files:**
- Modify: `E:\yumeno-landing\src\components\PeelReveal.jsx`
- Modify: `E:\yumeno-landing\src\components\PeelReveal.css`
- Modify: `E:\yumeno-landing\src\App.jsx`

**Interfaces:**
- `PeelReveal({ children, reveal, side = 'left', className = '' })`：`children` 是工作台主内容，`reveal` 是侧边导航，`side` 当前固定为 `left`。
- `reveal` 内部导航按钮由 `App` 提供，必须保持真实 button 语义。

- [ ] **Step 1: 定义侧边栏状态和指针触发条件**

将组件内部状态改为：

```jsx
const [progress, setProgress] = useState(0);
const [isPinned, setIsPinned] = useState(false);
const [isFocused, setIsFocused] = useState(false);
const open = isPinned || isFocused || progress > 0.06;
```

鼠标在组件左侧 `180px` 区域内时计算展开比例；鼠标离开后回到 0，若已点击固定则保持展开。触摸设备不使用 hover 计算，改由按钮切换 `isPinned`。

- [ ] **Step 2: 实现键盘交互**

组件使用 `tabIndex={0}`，监听：

```jsx
if (event.key === 'Enter' || event.key === ' ') {
  event.preventDefault();
  setIsPinned((value) => !value);
}
if (event.key === 'Escape') {
  setIsPinned(false);
  setProgress(0);
}
```

同时设置 `aria-expanded={open}`，并给移动端按钮设置 `aria-label="打开角色工具栏"` 或 `aria-label="关闭角色工具栏"`。

- [ ] **Step 3: 采用真实侧边栏布局**

`reveal` 层从左侧占据约 `248px`，主内容层默认覆盖在其上；随着 `progress` 增加，主内容使用 `clip-path` 或 `transform` 向右移动，露出完整导航。不要再使用左右两条斜线裁剪来模拟一张纸。

- [ ] **Step 4: 增加移动端点击展开**

在组件中添加固定边缘按钮，仅在 `max-width: 680px` 显示。按钮点击后固定打开/关闭侧边栏，点击导航项后允许关闭。

- [ ] **Step 5: 将真实导航注入 Hero**

在 `App.jsx` 中将 `reveal` 改为角色工具栏：

```jsx
<nav className="peel-nav" aria-label="角色工具栏">
  <p className="peel-nav__eyebrow">当前角色</p>
  <strong>雾岛澪</strong>
  <span className="peel-nav__status">声音已绑定 · 本地工作区</span>
  {['角色', '记忆', '知识空间', '声音工坊', '设置'].map((item) => (
    <button type="button" key={item}>{item}</button>
  ))}
</nav>
```

- [ ] **Step 6: 构建并提交 Peel 版本**

运行：

```powershell
npm run build
```

预期：构建成功，且不会出现旧 `clip-path` 传参或不可用 props。

提交：

```powershell
git add src/components/PeelReveal.jsx src/components/PeelReveal.css src/App.jsx
 git commit -m "feat: turn peel into workspace sidebar"
```

---

### Task 3: 实现受控 ASCII Sweep 面板切换

**Files:**
- Modify: `E:\yumeno-landing\src\components\AsciiSweep.jsx`
- Modify: `E:\yumeno-landing\src\components\AsciiSweep.css`
- Modify: `E:\yumeno-landing\src\App.jsx`

**Interfaces:**
- `AsciiSweep({ panels, index, onSweepStart, onSweepEnd, color, duration, className })`。
- `panels` 是 ReactNode 数组；`index` 是当前面板下标；`onSweepStart(nextIndex)` 和 `onSweepEnd(nextIndex)` 为可选回调。
- 组件在 `index` 未变化时不启动动画，在 index 变化时只执行一次过渡。

- [ ] **Step 1: 建立面板切换测试场景**

在 `App.jsx` 中先接入三个状态面板：

```jsx
<AsciiSweep
  index={['character', 'voice', 'memory'].indexOf(workspaceTab)}
  panels={[
    <WorkspaceCharacterPanel key="character" />,
    <WorkspaceVoicePanel key="voice" />,
    <WorkspaceMemoryPanel key="memory" />,
  ]}
  color="#5657D9"
/>
```

手动验证标准：点击三个 tab 时文本内容确实变化，未点击时不持续替换。

- [ ] **Step 2: 实现受控状态与动画生命周期**

组件内部维护 `displayIndex`、`previousIndex` 和 `isAnimating`：

```jsx
useEffect(() => {
  if (index === displayIndex) return;
  setPreviousIndex(displayIndex);
  setDisplayIndex(index);
  setIsAnimating(true);
  const timer = window.setTimeout(() => {
    setPreviousIndex(index);
    setIsAnimating(false);
    onSweepEnd?.(index);
  }, duration * 1000);
  onSweepStart?.(index);
  return () => window.clearTimeout(timer);
}, [index, duration, displayIndex, onSweepEnd, onSweepStart]);
```

为避免回调函数造成重复 effect，调用方使用稳定函数或组件内部只依赖 `index` 和 `duration`。

- [ ] **Step 3: 实现字符带和降级效果**

保留 Canvas 2D 绘制，使用 `requestAnimationFrame` 在 `0 → 1` 期间绘制字符带；字符颜色使用传入的 `color`，字符密度、透明度和扫过方向固定为轻量参数。检测不到可用 Canvas 时仍渲染普通 DOM 面板，并通过 CSS `::after` 提供一次性渐变扫光。

Canvas 样式必须是 `pointer-events: none`，避免挡住 tab 和面板操作。

- [ ] **Step 4: 支持减少动效**

使用 `matchMedia('(prefers-reduced-motion: reduce)')`；匹配时跳过字符动画，直接在 `requestAnimationFrame` 同一帧显示目标面板，并保留 `onSweepEnd` 回调。

- [ ] **Step 5: 构建并提交 ASCII 版本**

运行：

```powershell
npm run build
```

预期：构建成功；切换 tab 不报错、不重复启动无限动画。

提交：

```powershell
git add src/components/AsciiSweep.jsx src/components/AsciiSweep.css src/App.jsx
 git commit -m "feat: add controlled ascii panel transitions"
```

---

### Task 4: 实现可点击声音试听和动态波形

**Files:**
- Modify: `E:\yumeno-landing\src\components\Waveform.jsx`
- Modify: `E:\yumeno-landing\src\components\Waveform.css`
- Modify: `E:\yumeno-landing\src\App.jsx`
- Modify: `E:\yumeno-landing\src\App.css`

**Interfaces:**
- `Waveform({ bars = 42, isPlaying, progress, onToggle, duration = 4.8, className })`。
- `onToggle()` 只切换 App 层播放状态；音频上下文和计时器由 `App` 或独立 hook 管理。
- `App` 必须维护 `audioContextRef`、`oscillatorRef`、`gainNodeRef` 和 `voiceTimerRef`，并在卸载时停止和关闭资源。

- [ ] **Step 1: 增加播放状态占位和失败路径**

在 `App.jsx` 中先定义：

```jsx
const audioContextRef = useRef(null);
const oscillatorRef = useRef(null);
const gainNodeRef = useRef(null);
const voiceTimerRef = useRef(null);

const stopVoicePreview = () => {
  window.clearInterval(voiceTimerRef.current);
  oscillatorRef.current?.stop();
  oscillatorRef.current?.disconnect();
  gainNodeRef.current?.disconnect();
  oscillatorRef.current = null;
  setIsVoicePlaying(false);
};
```

点击播放时若浏览器没有 `AudioContext`，仍切换视觉播放状态并在界面显示“视觉试听模式”，不能让页面崩溃。

- [ ] **Step 2: 实现用户触发的 Web Audio API 音效**

播放启动代码使用以下行为：

```jsx
const startVoicePreview = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    setIsVoicePlaying(true);
    return;
  }
  const context = audioContextRef.current || new AudioContextClass();
  audioContextRef.current = context;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(220, now);
  oscillator.frequency.exponentialRampToValueAtTime(330, now + 0.5);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 1.45);
  oscillatorRef.current = oscillator;
  gainNodeRef.current = gain;
  setIsVoicePlaying(true);
};
```

音量保持很低，避免打扰；播放按钮仍然是页面的唯一触发点。

- [ ] **Step 3: 实现进度和暂停行为**

播放开始时记录 `voiceStartedAt`，用 `requestAnimationFrame` 或 `setInterval` 更新 `voiceProgress`；达到 `duration` 后调用 `stopVoicePreview()`。暂停时立即停止 oscillator、清除 timer 并保留当前进度或回到 0，最终交互规则需统一为“暂停回到 0”以避免再次播放时状态含糊。

- [ ] **Step 4: 改造 Waveform 输出动态柱体**

`Waveform.jsx` 使用稳定的基础高度数组，并将实时状态映射到 CSS 变量：

```jsx
const level = isPlaying ? 0.78 + Math.sin(index * 0.9 + progress * 18) * 0.2 : 0.18 + (index % 4) * 0.025;
<i style={{ '--wave-height': `${Math.max(0.12, level) * baseHeight}%`, '--wave-delay': `${index * 18}ms` }} />
```

同时渲染进度轨道和 `aria-label`，不要继续把 waveform 整个区域标为 `aria-hidden="true"`。

- [ ] **Step 5: 同步声音工坊步骤状态**

点击“素材 / 处理 / 试听 / 绑定”时更新 `voiceStep`；试听按钮将 `voiceStep` 设置为 `preview` 并根据播放状态显示：

```text
等待试听
试听中
试听已暂停
```

- [ ] **Step 6: 构建并提交声音版本**

运行：

```powershell
npm run build
```

预期：构建成功；没有 `AudioContext` 时仍可使用视觉状态，有 AudioContext 时点击后能听到低音量试听提示音。

提交：

```powershell
git add src/components/Waveform.jsx src/components/Waveform.css src/App.jsx src/App.css
 git commit -m "feat: add interactive voice preview"
```

---

### Task 5: 完成浅色视觉系统与响应式细节

**Files:**
- Modify: `E:\yumeno-landing\src\App.css`
- Modify: `E:\yumeno-landing\src\index.css`
- Modify: `E:\yumeno-landing\src\components\PeelReveal.css`
- Modify: `E:\yumeno-landing\src\components\AsciiSweep.css`
- Modify: `E:\yumeno-landing\src\components\Waveform.css`

**Interfaces:**
- CSS 变量保持与设计文档一致：`--bg`、`--surface`、`--surface-muted`、`--ink`、`--muted`、`--primary`、`--primary-deep`、`--accent`、`--border`、`--warning`。
- 组件状态通过 class 和 CSS custom properties 传递，不新增 CSS-in-JS 依赖。

- [ ] **Step 1: 替换全局颜色令牌**

在 `index.css` 或 `App.css` 中使用：

```css
:root {
  --bg: #f6f7f9;
  --surface: #ffffff;
  --surface-muted: #eef1f5;
  --ink: #1e2430;
  --muted: #6d7685;
  --primary: #5657d9;
  --primary-deep: #3f40a7;
  --accent: #21b8a6;
  --border: #e1e5eb;
  --warning: #e3a33b;
}
```

- [ ] **Step 2: 重建工作台与卡片层级**

确保 `.workspace-shell`、`.workspace-sidebar`、`.workspace-main`、`.status-card`、`.runtime-board` 等类使用白色 surface、浅边框和少量阴影；不保留上一版 `--paper`、`--red` 主导的背景和 Hero 海报视觉。

- [ ] **Step 3: 添加交互状态样式**

为 `.is-active`、`.is-playing`、`.is-pinned`、`.peel-open` 和 `[aria-selected="true"]` 提供明确的颜色、边框和进度反馈；确保文字状态不会只依靠颜色表达。

- [ ] **Step 4: 完成移动端布局**

在 `max-width: 680px` 下：

- 顶部导航隐藏为下载按钮和菜单入口。
- 工作台改为单列。
- Peel 改为固定左侧抽屉，宽度不超过视口的 `82vw`。
- 状态 tab 可横向滚动但不出现页面级横向溢出。
- 声音工坊按钮和波形保持可触摸尺寸，点击区域至少约 `44px` 高。

- [ ] **Step 5: 添加减少动效规则**

在三个组件 CSS 中统一加入：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

同时保留状态、内容切换和播放/暂停功能。

- [ ] **Step 6: 构建并提交视觉版本**

运行：

```powershell
npm run build
```

预期：构建成功，页面在 680px 和桌面宽度下都没有溢出。

提交：

```powershell
git add src/App.css src/index.css src/components/PeelReveal.css src/components/AsciiSweep.css src/components/Waveform.css
git commit -m "style: refresh landing visual system"
```

---

### Task 6: 本地运行、浏览器验收与发布准备

**Files:**
- Modify: `E:\yumeno-landing\README.md`（仅同步本地部署说明，如当前说明过时）
- Verify: `E:\yumeno-landing\dist\`

**Interfaces:**
- 生产构建入口保持 `npm run build`。
- 本地预览入口保持 `http://127.0.0.1:17000/` 或 `http://127.0.0.1:17000/static/index.html`，以当前 Vite 配置实际响应为准。

- [ ] **Step 1: 执行生产构建**

运行：

```powershell
npm run build
```

预期：构建成功，`dist/` 生成最新静态文件。

- [ ] **Step 2: 检查端口并启动本地服务**

运行：

```powershell
Get-NetTCPConnection -LocalPort 17000 -State Listen -ErrorAction SilentlyContinue
```

若没有服务，在项目目录运行：

```powershell
npm run dev -- --host 127.0.0.1 --port 17000
```

预期：服务监听 `127.0.0.1:17000`。

- [ ] **Step 3: 进行页面交互验收**

在浏览器中检查：

```text
http://127.0.0.1:17000/
```

验收：

1. 页面首屏为浅色工作台视觉。
2. 鼠标移动到 Hero 左边缘，Peel 侧边栏展开；导航内容真实可见。
3. 移动端点击按钮可展开 Peel。
4. 点击“角色 / 声音 / 记忆”触发一次 ASCII Sweep 并切换内容。
5. 点击声音试听后能听到低音量提示音，波形和进度变化；点击暂停后停止。
6. 点击“快速体验 / 混合使用 / 完全本地”只替换说明，不出现独立部署大板块。
7. 所有链接仍指向主项目 GitHub 或 Releases。
8. `prefers-reduced-motion` 下仍能切换和播放。

- [ ] **Step 4: 检查构建产物和 Git 状态**

运行：

```powershell
git status --short
Get-ChildItem dist -Recurse | Select-Object FullName, Length
```

预期：没有未预期的临时文件；`dist/` 包含可上传服务器的静态产物。

- [ ] **Step 5: 更新部署说明并提交**

如果 `README.md` 仍写有 GitHub Pages 部署，改为：

```md
## 部署

运行 `npm run build` 后，将 `dist/` 目录内容上传到自己的服务器或域名对应的网站目录即可。
本项目不使用 GitHub Pages。
```

提交：

```powershell
git add README.md dist
git commit -m "docs: finalize self-hosted deployment notes"
```

---

## 计划自检

### 规格覆盖

- 配色刷新：Task 5。
- Hero 工作台：Task 1、Task 5。
- Peel 实用侧边栏：Task 2、Task 5、Task 6。
- ASCII Sweep 受控切换：Task 3、Task 6。
- 可点击声音试听：Task 4、Task 6。
- 部署方式内嵌：Task 1、Task 6。
- 移动端、键盘、减少动效：Task 2、Task 5、Task 6。
- 静态自托管、不用 GitHub Pages：Global Constraints、Task 6。

### 占位符检查

未使用 `TODO`、`TBD`、`待定`、`???` 等未完成占位内容。所有实施步骤包含具体文件、命令、接口或代码基准。

### 类型与接口一致性

- Task 1 定义 `workspaceTab`、`deploymentMode`、`voiceStep` 和 `isVoicePlaying`，后续 Task 2-4 按这些状态接入。
- Task 3 定义 `AsciiSweep({ panels, index, onSweepStart, onSweepEnd, color, duration, className })`，Task 1 的调用方式与该接口一致。
- Task 4 定义 `Waveform({ isPlaying, progress, onToggle })`，Task 1 的页面状态与该接口一致。
- Task 2 的 `PeelReveal` 侧边语义与 Task 1 的 Hero 工作台使用方式一致。

## 执行方式

推荐按 Task 1 到 Task 6 顺序执行，每个 Task 完成后运行构建并提交一次，确保出现问题时可以定位到单个功能版本。
