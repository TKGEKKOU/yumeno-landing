# YUMENO Landing

YUMENO 的独立展示页，用于呈现 Multi-Agent + RAG 平台的核心能力、部署方式、文档入口与安全边界。项目与主仓库解耦，构建产物为纯静态文件。

## 当前展示内容

- 工程化 Multi-Agent RAG 平台定位
- 确定性意图路由、自适应检索、受控工具与 HITL 确认
- Codex 式对话过程流与本地语音工作流
- 云端 / 标准 / 离线三种部署模式
- 快速开始、下载与文档入口
- 安全说明与 GitHub 上传清单

## 技术栈

- React 19 + Vite
- 原生 CSS 设计系统
- 无后端依赖，构建产物部署到任意静态托管

## 开发

```bash
npm install
npm run dev
```

访问 <http://localhost:5173>。

## 构建

```bash
npm run build
```

产物位于 `dist/`，可直接部署到 Vercel、Netlify、Cloudflare Pages、GitHub Pages 或任意静态服务器。

## 发布前检查

```bash
npm run build
npm run preview
```

检查首页、导航锚点、能力矩阵、部署卡片、快速开始和页脚链接；确认页面无控制台错误。

## 数据与隐私

本仓库只包含公开展示内容，不包含主项目 `data/`、日志、模型文件、数据库、API Key 或私有服务器信息。示例地址仅使用 `127.0.0.1`，外部链接只指向公开 GitHub 位置。

## 相关链接`r`n`r`n- 主项目：[TKGEKKOU/yumeno](https://github.com/TKGEKKOU/yumeno)`r`n- 版本下载：[Releases](https://github.com/TKGEKKOU/yumeno/releases)`r`n- 展示页仓库：[TKGEKKOU/yumeno-landing](https://github.com/TKGEKKOU/yumeno-landing)`r`n`r`nGitHub Pages 由 `.github/workflows/deploy.yml` 自动构建并发布 `dist/`。首次发布前，请在仓库 `Settings -> Pages -> Build and deployment -> Source` 中选择 `GitHub Actions`。`r`n`r`n## 安全说明

- 变更类操作必须经过人工确认。
- 模型、知识库与工具按角色和工作区隔离。
- 结构化查询只读执行，并限制表范围、危险函数、深度与结果集。
- 平台默认绑定本地服务地址，公开部署前应增加认证、HTTPS、速率限制与审计日志。

