# YUMENO Landing Page

YUMENO 项目的独立展示页面，基于 React + Vite 构建。

## 特性

- 响应式 Bento Grid 布局
- ASCII Sweep 视觉效果（自动降级支持）
- 浅色专业设计系统
- 静态文件部署

## 开发

`ash
npm install
npm run dev
`

访问 http://localhost:5173

## 构建

`ash
npm run build
`

构建产物在 dist/ 目录，可直接部署到任何静态文件服务器。

## 部署

### GitHub Pages

1. 构建项目：
pm run build
2. 将 dist/ 目录内容推送到 gh-pages 分支
3. 在仓库设置中启用 GitHub Pages

### 其他静态托管

构建后的 dist/ 目录可部署到：
- Vercel
- Netlify
- Cloudflare Pages
- 任意静态文件服务器

## 浏览器支持

- 现代浏览器（Chrome, Edge, Firefox, Safari 最新版）
- ASCII Sweep 效果需要 Chrome 119+ 且启用实验性功能，否则自动降级为 CSS 动画
- 降级方案在所有浏览器中正常显示

## 目录结构

`
src/
├── components/
│   ├── AsciiSweep.jsx       # ASCII 扫描效果组件
│   └── AsciiSweep.css       # 组件样式
├── App.jsx                   # 主应用
├── App.css                   # 主样式
├── main.jsx                  # 入口
└── index.css                 # 全局样式
`

## 链接

- 主项目：https://github.com/TKGEKKOU/yumeno
- 下载：https://github.com/TKGEKKOU/yumeno/releases
