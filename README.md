# YUMENO Landing

YUMENO 的独立展示站：用真实角色视觉、声音样本和一套角色化 Agent 系统，介绍这个本地优先的角色工作台。

## 本地开发

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 17000
```

打开：

- 主展示页：`http://127.0.0.1:17000/`
- 站内文档：`http://127.0.0.1:17000/docs.html`

主展示页使用全屏章节舞台，可通过鼠标滚轮、触摸、键盘或 hash 导航切换：

```text
#home       首页
#operator   角色
#voice      声音
#agents     角色化 Agent
#docs       文档入口
```

## 构建

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 17000
```

构建结果位于 `dist/`，包含 `index.html` 和 `docs.html`。这是纯静态产物，不依赖 GitHub Pages；可以直接上传到已有服务器，或交给 Nginx / Apache / IIS 提供静态文件服务。

## 内容来源

- `src/assets/images/mortis.png`：来自 YUMENO 本地数据的角色视觉样本。
- `src/assets/audio/reference-segment.wav`：声音工坊提取的人声片段。
- `src/assets/audio/yuno1-voice.wav`：已保存的 `yuno1` 参考音色样本。

展示页中的 Agent 架构按 YUMENO 当前代码口径整理：`persona_supervisor` 负责意图理解、路径选择和最终表达；5 个受限 Worker 与 1 条知识执行子图负责领域任务；结果经过 `finalize_*` 返回 Supervisor；受策略保护的变更可通过 HITL / checkpoint 暂停、确认和恢复。

## 发布链接

- 展示站源码：[TKGEKKOU/yumeno-landing](https://github.com/TKGEKKOU/yumeno-landing)
- YUMENO 主项目：[TKGEKKOU/yumeno](https://github.com/TKGEKKOU/yumeno)
- YUMENO 发布版本：[GitHub Releases](https://github.com/TKGEKKOU/yumeno/releases)

## 约束

此项目只展示和说明 YUMENO，不在 landing 页面中运行完整后端、完整 Live2D runtime 或在线聊天服务。详细的系统要求、使用方式、架构、声音工坊、部署和 FAQ 请查看 `docs.html`。
