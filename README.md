# YUMENO Landing

YUMENO 的独立展示页，用于介绍一个可以长期相处的角色工作台：创建角色，给它声音、记忆和自己的资料空间，从一次对话开始慢慢形成属于你的相处方式。

本项目与主仓库解耦，不包含主项目的数据、模型、日志、数据库或密钥。展示页本身是纯静态前端，不使用 GitHub Pages。

## 当前展示内容

- 角色工作台首页与实用侧边工具栏
- 角色、声音、记忆、知识和行动的体验说明
- ASCII Sweep 状态切换效果
- 可点击的浏览器声音试听演示和动态波形
- 本地工作方式与资料放置选择
- 项目当前资料中的内部评测数据（页面已注明不代表第三方认证）
- 下载、源码、文档与反馈入口

## 技术栈

- React 19 + Vite
- 原生 CSS 设计系统
- Web Audio API（仅用于用户点击后触发的短暂演示音）
- 无后端依赖，构建产物可部署到任意静态服务器

## 开发

```bash
npm install
npm run dev
```

默认访问：`http://127.0.0.1:17000/`。

## 构建与自托管部署

```bash
npm run build
```

构建产物位于 `dist/`。将 `dist/` 目录内容上传到自己的 Web 服务器站点目录，并将域名指向对应站点即可。本项目不使用 GitHub Pages。

如需本地预览构建产物：

```bash
npm run preview
```

## 发布前检查

```bash
npm run build
```

检查首页、侧边 Peel、状态 tab、声音播放/暂停、资料放置选择器、响应式布局和页脚链接；确认页面无控制台错误。

## 相关链接

- 主项目：[TKGEKKOU/yumeno](https://github.com/TKGEKKOU/yumeno)
- 版本下载：[Releases](https://github.com/TKGEKKOU/yumeno/releases)
- 展示页仓库：[TKGEKKOU/yumeno-landing](https://github.com/TKGEKKOU/yumeno-landing)

## 数据与安全说明

- 本仓库只包含公开展示内容，不包含主项目 `data/`、日志、模型文件、数据库、API Key 或私有服务器信息。
- 示例内容中的角色、记忆和声音均为展示用 mockup。
- 主项目中的敏感操作、知识空间隔离和本地部署能力以主项目文档为准。
