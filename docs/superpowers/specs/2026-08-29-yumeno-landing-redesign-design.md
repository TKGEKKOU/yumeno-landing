# YUMENO Landing redesign design

**Date:** 2026-08-29

## Goal

把独立展示页从“技术能力清单”改造成“先让普通访客理解角色体验，再向下解释工程可信度”的双层产品页，同时使用撕页揭示和声音波形两种效果建立品牌记忆。

## Audience and message

首页标题、副标题不出现 LangGraph、RAG、Multi-Agent 等术语；第一屏只表达角色、声音、记忆和行动。技术术语只在后半页的架构、可信回答和部署区域出现。

## Information architecture

1. Sticky header：品牌、体验/能力/架构/下载锚点。
2. Hero：通俗标题、下载 CTA、撕页交互主视觉。表层是角色宣言，揭示层是声音/记忆/知识/行动的产品地图。
3. Experience：五张产品能力卡，覆盖角色、声音、记忆、知识、行动。
4. Voice studio：素材到音色的可视化五步流程，配动态波形。
5. Runtime：用简化节点解释 Supervisor、knowledge、Memory、Voice 和工具的关系；保留技术细节但使用短句。
6. Trust：准确率、幻觉率、Recall@3、测试等真实项目资料，注明为项目评测数据。
7. Deployment：云端、混合、离线三种模式，避免虚构下载大小。
8. Quick start：下载、配置、启动三步。
9. Footer：主项目、版本、文档和反馈入口。

## Visual system

浅色纸张底、黑墨线条、朱红色强调、深蓝运行时面板；直角/轻圆角卡片、编号、细网格、工程标注。动效使用 CSS/React，提供 `prefers-reduced-motion` 降级；撕页是 CSS 叠层，不依赖实验性的 HTML-in-canvas，以保证自有服务器上的现代浏览器稳定运行。

## Content accuracy

采用主项目当前资料：Supervisor-centric 混合图由 1 个对外 Supervisor、1 个 knowledge Planner 子图和 5 个受限 LLM Worker 组成；工具数 29；HITL 覆盖敏感操作；项目 README 的基准数据为准确率 85%、幻觉率 14%、Recall@3 85%、107 个单元测试。所有数字显示“项目评测/当前仓库资料”语境，不包装为第三方认证。

## Acceptance criteria

- `npm run build` 成功。
- 首页第一眼无技术术语，CTA 可到 Releases 和快速开始。
- 鼠标悬停/聚焦 Hero 的撕页卡会揭示底层内容，触摸和 reduced-motion 下仍可阅读。
- 声音波形有轻微循环动画，reduced-motion 下静止。
- 架构、声音工坊、可信度和部署内容均来自主项目资料且与当前架构一致。
- 页面在移动宽度下不横向溢出，键盘焦点可见。
