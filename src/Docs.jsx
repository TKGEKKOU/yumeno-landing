import { useEffect, useMemo, useState } from 'react'

const sections = [
  { id: 'quick-start', label: '快速开始', kicker: '先让第一个角色工作起来' },
  { id: 'requirements', label: '系统要求', kicker: '运行前需要准备什么' },
  { id: 'usage', label: '使用方法', kicker: '角色、记忆与知识空间' },
  { id: 'architecture', label: '角色化 Agent 架构', kicker: 'Supervisor 如何协调 Worker' },
  { id: 'voice-studio', label: '声音工坊', kicker: '从素材到角色声音' },
  { id: 'live2d', label: 'Live2D', kicker: '让角色出现在工作台里' },
  { id: 'extensions', label: 'Skill / MCP / Tool', kicker: '扩展角色的能力边界' },
  { id: 'deployment', label: '部署', kicker: '从本地运行到服务化' },
  { id: 'privacy', label: '数据与隐私', kicker: '数据存在哪里、谁能访问' },
  { id: 'faq', label: '常见问题', kicker: '遇到问题时先看这里' },
]

const workerCards = [
  { name: 'knowledge subgraph', title: '知识执行图', detail: '由 Planner、检索与策略化 fallback 组成，处理 RAG、SQL 或联网路径。', accent: 'violet' },
  { name: 'memory worker', title: '记忆 Worker', detail: '整理长期记忆、会话状态与需要确认的记忆写入。', accent: 'cyan' },
  { name: 'document worker', title: '资料 Worker', detail: '处理文档导入、预览、确认和入库任务。', accent: 'cyan' },
  { name: 'profile worker', title: '人设 Worker', detail: '管理角色档案、行为设定与角色化表达所需的信息。', accent: 'pink' },
  { name: 'voice clone worker', title: '声音 Worker', detail: '衔接参考音频、音色训练和角色声音绑定。', accent: 'pink' },
  { name: 'config worker', title: '配置 Worker', detail: '处理 Provider、模型和运行配置等受限操作。', accent: 'violet' },
]

const faqItems = [
  { question: 'YUMENO 需要注册账号吗？', answer: '不需要。YUMENO 面向本地单人使用，角色、会话、记忆和知识空间都以本地工作区为中心。' },
  { question: '必须联网才能使用吗？', answer: '不一定。对话可以连接 OpenAI-compatible 服务；Embedding、联网搜索和语音服务都可以按需要选择云端或本地方案。完全离线部署需要自行准备本地模型及相关基础设施。' },
  { question: '第一次使用应该先配置什么？', answer: '先启动 YUMENO，再到提供商配置中填写 Chat 模型的接口地址、API Key 和模型名。之后创建角色即可开始对话；Embedding、Reranker、GPT-SoVITS 等能力可以在需要时再配置。' },
  { question: '多 Agent 是多个角色在群聊吗？', answer: '不是。当前架构由 persona_supervisor 统一对外表达，Worker 只处理受限领域任务。Worker 的结果经过 finalize_* 合同校验后回到 Supervisor，再由角色化的 Supervisor 结合人设回复。' },
  { question: '声音克隆一定需要 GPU 吗？', answer: '声音功能依赖 GPT-SoVITS 等本地服务时，GPU 会明显影响速度，但具体要求取决于模型、音频长度和运行方式。只使用已有音频或云端 TTS 时，可以不启用本地语音链路。' },
  { question: '数据会被上传到服务器吗？', answer: 'YUMENO 的应用数据默认保存在本地。只有在你主动配置云端模型、Embedding、联网搜索或其他外部服务时，相应请求才会按服务商接口发送；API Key 应保存在自己的配置环境中。' },
]

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return <button className="copy-button" type="button" onClick={copy} aria-label="复制代码">{copied ? '已复制' : '复制'}</button>
}

function CodeBlock({ children, language = 'powershell' }) {
  const value = String(children).trim()
  return <div className="code-block"><div className="code-toolbar"><span>{language}</span><CopyButton value={value} /></div><pre><code>{value}</code></pre></div>
}

function SectionHeading({ eyebrow, title, summary }) {
  return <div className="section-heading"><p className="section-eyebrow">{eyebrow}</p><h2>{title}</h2><p className="section-summary">{summary}</p></div>
}

function StatusTag({ children, tone = 'default' }) {
  return <span className={`status-tag status-${tone}`}>{children}</span>
}

function Docs() {
  const [activeId, setActiveId] = useState(() => {
    const hash = window.location.hash.slice(1)
    return sections.some((section) => section.id === hash) ? hash : sections[0].id
  })
  const [query, setQuery] = useState('')
  const visibleSections = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return sections
    return sections.filter((section) => `${section.label} ${section.kicker}`.toLowerCase().includes(normalized))
  }, [query])

  useEffect(() => {
    const elements = sections.map((section) => document.getElementById(section.id)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveId(visible.target.id)
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0.08, 0.3, 0.6] })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (sections.some((section) => section.id === hash)) setActiveId(hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goToSection = (id) => {
    window.location.hash = id
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
  }

  return (
    <div className="docs-page">
      <header className="docs-header">
        <a className="brand-mark" href="./index.html#home" aria-label="返回 YUMENO 首页"><span className="brand-dot" aria-hidden="true" /><span>YUMENO</span></a>
        <div className="header-context"><span className="header-line" aria-hidden="true" /><span>角色化 Agent 工作台 · 文档</span></div>
        <a className="back-link" href="./index.html#agents">返回展示页 <span aria-hidden="true">↗</span></a>
      </header>

      <div className="docs-shell">
        <aside className="docs-sidebar" aria-label="文档目录">
          <div className="sidebar-intro">
            <p className="sidebar-label">DOCUMENTATION</p>
            <h1>把系统<br /><em>讲清楚。</em></h1>
            <p>从第一次启动，到角色化 Agent 如何协作，这里是 YUMENO 的站内说明。</p>
          </div>
          <label className="docs-search"><span className="search-icon" aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索章节" aria-label="搜索文档章节" /></label>
          <nav className="docs-nav">
            {visibleSections.map((section, index) => <a className={activeId === section.id ? 'active' : ''} href={`#${section.id}`} key={section.id} onClick={() => setActiveId(section.id)}><span className="nav-index">{String(index + 1).padStart(2, '0')}</span><span><strong>{section.label}</strong><small>{section.kicker}</small></span></a>)}
          </nav>
          {visibleSections.length === 0 && <p className="empty-search">没有匹配的章节。</p>}
          <div className="sidebar-footnote"><span className="signal-mark" aria-hidden="true" /><span>本页为独立静态文档，不需要登录。</span></div>
        </aside>

        <main className="docs-content">
          <div className="mobile-doc-nav"><label htmlFor="mobile-section-select">跳转章节</label><select id="mobile-section-select" value={activeId} onChange={(event) => goToSection(event.target.value)}>{sections.map((section) => <option value={section.id} key={section.id}>{section.label}</option>)}</select></div>
          <div className="docs-hero"><div><p className="hero-label">YUMENO / GUIDE</p><h2>一个角色，<br /><span>一套协作系统。</span></h2></div><div className="hero-note"><span className="note-line" aria-hidden="true" /><p>YUMENO 不是把功能堆在一起，而是让一个角色拥有记忆、知识、声音和可控的行动能力。</p></div></div>

          <section className="doc-section" id="quick-start">
            <SectionHeading eyebrow="QUICK START" title="三步开始第一次对话" summary="YUMENO 优先服务于 Windows 本地工作区。安装基础环境后，先配置一个对话模型，再创建角色。" />
            <div className="steps-grid"><article className="step-card"><span>01</span><h3>准备环境</h3><p>安装 Python 3.11 与 Docker Desktop，并从系统托盘启动 Docker 引擎。</p></article><article className="step-card"><span>02</span><h3>启动工作台</h3><p>运行启动脚本，等待本地服务和基础设施就绪。</p></article><article className="step-card"><span>03</span><h3>创建角色</h3><p>打开工作台，配置 Chat Provider，创建第一个角色并开始对话。</p></article></div>
            <CodeBlock>{String.raw`.\scripts\start.ps1
# 只启动服务，不自动打开浏览器
.\scripts\start.ps1 -NoBrowser

# 服务启动后访问
http://127.0.0.1:17000/static/index.html`}</CodeBlock>
            <div className="callout callout-cyan"><strong>第一次启动提示</strong><p>Docker Desktop 需要先在后台运行。首次启动可能会创建虚拟环境、安装依赖并初始化基础设施，之后会复用已有环境。</p></div>
          </section>

          <section className="doc-section" id="requirements">
            <SectionHeading eyebrow="REQUIREMENTS" title="按需准备，不必一次装全" summary="对话、知识检索和声音链路可以分开配置。只有启用对应能力时，才需要安装或启动相应服务。" />
            <div className="requirements-table-wrap"><table className="requirements-table"><thead><tr><th>项目</th><th>基础使用</th><th>启用相关能力时</th></tr></thead><tbody><tr><th>操作系统</th><td>Windows 本地环境</td><td>—</td></tr><tr><th>运行时</th><td>Python 3.11</td><td>—</td></tr><tr><th>基础设施</th><td>Docker Desktop</td><td>Milvus、etcd、MinIO 等容器</td></tr><tr><th>对话模型</th><td>OpenAI-compatible Chat 接口</td><td>也可以改为本地 LLM</td></tr><tr><th>知识检索</th><td>按需配置 Embedding</td><td>Milvus、Reranker、本地模型</td></tr><tr><th>声音</th><td>可不启用</td><td>ffmpeg、GPT-SoVITS、ASR / VAD 等</td></tr></tbody></table></div>
            <div className="split-note"><div><StatusTag tone="cyan">推荐起步</StatusTag><p>先使用云端 Chat 与 Embedding，确认角色、人设和会话流程，再逐步增加本地知识和声音能力。</p></div><div><StatusTag tone="violet">完全离线</StatusTag><p>需要准备本地 LLM、Embedding、Reranker、Milvus 与 GPT-SoVITS，硬件和磁盘占用会明显增加。</p></div></div>
          </section>

          <section className="doc-section" id="usage">
            <SectionHeading eyebrow="HOW TO USE" title="先理解角色，再给它资料" summary="YUMENO 把角色、人设、会话、记忆与知识空间分开管理，方便每个角色拥有自己的上下文。" />
            <div className="usage-list"><article><span className="usage-mark">A</span><div><h3>创建角色</h3><p>为角色设置名称、头像、人设和表达方式。角色是对外沟通的主体，也是 Agent 协作最后统一表达的出口。</p></div></article><article><span className="usage-mark">B</span><div><h3>建立会话</h3><p>每个会话保存自己的轮次和状态。中断后的任务可以从检查点恢复，而不是重新开始整条流程。</p></div></article><article><span className="usage-mark">C</span><div><h3>补充记忆与知识</h3><p>长期事实适合进入记忆，参考资料适合进入知识空间。CSV / XLSX 会进入隔离 SQLite，文档资料可经过预览和确认后入库。</p></div></article><article><span className="usage-mark">D</span><div><h3>配置 Provider</h3><p>在设置中填写 Chat、Embedding、TTS 或联网搜索服务。不同能力可以使用不同供应商，不必绑定为一套服务。</p></div></article></div>
          </section>

          <section className="doc-section architecture-section" id="architecture">
            <SectionHeading eyebrow="ROLE-BASED AGENTS" title="角色化 Agent 的核心：由一个角色统筹多个专长" summary="YUMENO 的多 Agent 不是群聊。persona_supervisor 负责理解请求、选择路径并保持角色口吻；领域 Worker 只执行自己被允许处理的任务。" />
            <div className="agent-map" aria-label="YUMENO 角色化 Agent 数据流">
              <div className="agent-map-topline"><span>用户请求</span><i aria-hidden="true" /><span>persona_supervisor</span><i aria-hidden="true" /><span>统一回复</span></div>
              <div className="supervisor-node"><span className="node-pulse" aria-hidden="true" /><small>对外角色</small><strong>PERSONA<br />SUPERVISOR</strong><em>理解 · 选择 · 表达</em></div>
              <div className="worker-grid">{workerCards.map((worker) => <article className={`worker-card worker-${worker.accent}`} key={worker.name}><span className="worker-connector" aria-hidden="true" /><p>{worker.name}</p><h3>{worker.title}</h3><span>{worker.detail}</span></article>)}</div>
              <div className="finalize-bar"><span>领域结果</span><b>finalize_*</b><span>合同校验 / 交接</span><i aria-hidden="true" /><strong>回到 Supervisor</strong></div>
            </div>
            <div className="architecture-columns"><div><h3>知识问题走确定性管线</h3><p>knowledge subgraph 先由 planner 决定需要哪类能力，再进入 retrieve、fallback 等节点。RAG 使用 Dense + BM25 + RRF；结构化表格进入隔离 SQLite；联网搜索按策略决定。</p></div><div><h3>写入与训练可以暂停</h3><p>记忆、文档、人设、配置和音色等敏感操作支持 HITL / checkpoint。系统可以等待确认，之后从原来的状态继续。</p></div></div>
            <CodeBlock language="flow">{String.raw`用户请求
  ↓
persona_supervisor
  ├─ 直接回答
  ├─ knowledge subgraph → planner → retrieve / fallback
  ├─ memory worker
  ├─ document worker
  ├─ profile worker
  ├─ voice_clone worker
  └─ config worker
          ↓
      finalize_*
          ↓
persona_supervisor → 结合角色人设表达`}</CodeBlock>
            <div className="callout callout-pink"><strong>边界很重要</strong><p>Worker 不直接对用户说话，也不互相自由调用。它们返回结构化结果，由 Supervisor 统一组织成角色化回复。</p></div>
          </section>

          <section className="doc-section" id="voice-studio">
            <SectionHeading eyebrow="VOICE STUDIO" title="把一段素材变成角色的声音" summary="声音工坊把素材处理拆成可以检查的步骤。每一步都能看到结果，必要时可以从已有处理文件继续。" />
            <div className="pipeline"><span>视频 / 音频</span><i>→</i><span>提取转换</span><i>→</i><span>人声分离</span><i>→</i><span>切片选择</span><i>→</i><span>拼接试听</span><i>→</i><span>保存绑定</span></div>
            <div className="feature-pair"><article><StatusTag tone="cyan">素材处理</StatusTag><h3>从任意阶段继续</h3><p>支持视频和音频素材；视频单文件上限约 400MB，音频单文件上限约 200MB。中途可以插入已处理文件，减少重复处理。</p></article><article><StatusTag tone="violet">音色库</StatusTag><h3>试听、管理、绑定</h3><p>处理好的参考音频可以保存到音色库，查看元信息、试听、删除，并绑定到指定角色的语音输出。</p></article></div>
            <div className="callout callout-cyan"><strong>本地依赖</strong><p>启用完整声音链路时，需要准备 ffmpeg 与 GPT-SoVITS。相关草稿位于 <code>data/voice_studio/sessions</code>，训练音色位于 <code>data/gpt_sovits/voices</code>。</p></div>
          </section>

          <section className="doc-section" id="live2d">
            <SectionHeading eyebrow="CHARACTER DISPLAY" title="Live2D 是角色的外在，不是系统的全部" summary="角色可以通过 Live2D 出现在工作台中，但它和 Agent 编排是两个层次：一个负责表现，一个负责理解与行动。" />
            <div className="live2d-panel"><div className="live2d-art"><span className="scan-line" aria-hidden="true" /><span className="art-corner corner-tl" /><span className="art-corner corner-br" /><p>CHARACTER / MORTIS</p></div><div className="live2d-copy"><StatusTag tone="pink">可选能力</StatusTag><h3>角色状态可以与对话联动</h3><p>YUMENO 通过 Live2D 资源、PIXI.js 与 Cubism 运行时呈现角色。展示站只使用轻量真实素材，不把静态图伪装成完整动作系统。</p><ul><li>角色资源位于主项目的 <code>data/live2d</code> 目录</li><li>工作台通过 Live2D 资源接口加载模型</li><li>完整动作、模型和纹理由实际资源决定</li></ul></div></div>
          </section>

          <section className="doc-section" id="extensions">
            <SectionHeading eyebrow="EXTENSIONS" title="Skill、MCP 与 Tool，给角色增加可控能力" summary="扩展能力不是把所有权限交给模型，而是通过注册表、策略和确认边界，把能力接到角色身上。" />
            <div className="extension-grid"><article><span className="extension-symbol">✦</span><h3>Skill</h3><p>可安装、加载和复用的能力模块，用来扩展角色在特定任务中的工作方式。</p></article><article><span className="extension-symbol">⌁</span><h3>MCP</h3><p>连接外部工具和服务的运行时协议，方便把新的数据源或操作能力接入系统。</p></article><article><span className="extension-symbol">□</span><h3>Tool</h3><p>具体可执行动作。工具注册表统一描述权限、是否修改数据以及是否需要确认。</p></article></div>
            <p className="body-note">当前项目还包含 B 站、QQ / OneBot / NapCat 等接入方向。启用前请单独配置对应服务，并确认数据和权限边界。</p>
          </section>

          <section className="doc-section" id="deployment">
            <SectionHeading eyebrow="DEPLOYMENT" title="本地优先，也可以组合部署" summary="YUMENO 主应用是后端工作台；本展示站是独立的静态站点。两者可以分开部署，不依赖 GitHub Pages。" />
            <div className="deployment-grid"><article><StatusTag tone="cyan">本地开发</StatusTag><h3>启动 FastAPI 工作台</h3><CodeBlock>{String.raw`.\.venv\Scripts\python.exe -B main.py
# 浏览器访问
http://127.0.0.1:17000/static/index.html`}</CodeBlock></article><article><StatusTag tone="violet">展示站部署</StatusTag><h3>上传 Vite 产物</h3><p>在展示站项目中执行构建，把 <code>dist/</code> 目录上传到已有服务器。主站和 <code>docs.html</code> 都是静态入口，可由 Nginx、Caddy 或其他静态文件服务器提供。</p><div className="mini-flow"><span>npm run build</span><i>→</i><span>dist/</span><i>→</i><span>你的域名</span></div></article></div>
            <div className="callout callout-violet"><strong>标准 / 离线方案</strong><p>按需组合 Docker Compose、Milvus、Ollama、本地 Embedding、Reranker 与 GPT-SoVITS。依赖越完整，离线能力越强，但首次安装、模型下载和硬件要求也越高。</p></div>
          </section>

          <section className="doc-section" id="privacy">
            <SectionHeading eyebrow="DATA & PRIVACY" title="角色的数据，留在自己的工作区" summary="本地优先意味着数据边界由你的机器和配置决定。云端服务只在你选择并调用时参与。" />
            <div className="privacy-list"><article><strong>01</strong><div><h3>角色隔离</h3><p>请求从角色路径解析工作区和知识空间，Milvus 的写入、删除与查询都会携带作用域过滤，避免跨角色串扰。</p></div></article><article><strong>02</strong><div><h3>本地存储</h3><p>应用数据默认写入本地 SQLite 与 data 目录，包括角色、会话、声音草稿和本地配置。</p></div></article><article><strong>03</strong><div><h3>敏感操作确认</h3><p>写记忆、改文档、改人设、改配置和训练音色可以经过 HITL / checkpoint，先停下来等待人工确认。</p></div></article></div>
            <CodeBlock language="text">{String.raw`data/
├─ yumeno.db                    # 角色、会话、记忆与状态
├─ local_settings.json          # 本地 Provider 配置
├─ voice_studio/sessions/       # 声音工坊草稿
├─ gpt_sovits/voices/           # 保存的训练音色
└─ live2d/                      # 角色模型资源`}</CodeBlock>
            <p className="body-note">使用云端 Chat、Embedding、搜索或其他外部服务时，请同时阅读对应服务商的隐私政策，并自行管理 API Key 和备份。</p>
          </section>

          <section className="doc-section faq-section" id="faq">
            <SectionHeading eyebrow="FAQ" title="常见问题" summary="这里先回答开始使用时最容易遇到的问题。" />
            <div className="faq-list">{faqItems.map((item, index) => <details key={item.question} open={index === 0}><summary><span>{item.question}</span><b aria-hidden="true">＋</b></summary><p>{item.answer}</p></details>)}</div>
          </section>

          <footer className="docs-footer"><a href="./index.html#home">YUMENO</a><span>角色化 Agent 工作台</span><a href="https://github.com/TKGEKKOU/yumeno" target="_blank" rel="noreferrer">主项目源码 ↗</a></footer>
        </main>
      </div>
    </div>
  )
}

export default Docs

