# YUMENO Landing

YUMENO 的独立展示页：用真实角色视觉、声音样本和站内文档，介绍这个本地优先的角色工作台。

## 本地开发

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 17000
```

打开 `http://127.0.0.1:17000/`。

## 构建

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 17000
```

## 内容说明

- `src/assets/images/mortis.png`：来自 YUMENO 本地数据的角色视觉样本。
- `src/assets/audio/reference-segment.wav`：声音工坊提取的人声片段。
- `src/assets/audio/yuno1-voice.wav`：已保存的 `yuno1` 参考音色样本。
- 页面文档使用站内抽屉展示，源码与发布下载入口才会链接到 GitHub。

## 发布

这是一个静态 Vite 项目，不使用 GitHub Pages。部署时将 `dist/` 内容上传到已有服务器或通过 Nginx/Apache 提供静态文件服务即可。

源码仓库：[TKGEKKOU/yumeno-landing](https://github.com/TKGEKKOU/yumeno-landing)
主项目：[TKGEKKOU/yumeno](https://github.com/TKGEKKOU/yumeno)
