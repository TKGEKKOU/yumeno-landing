import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import mortisImage from './assets/images/mortis.png'
import referenceAudio from './assets/audio/reference-segment.wav'
import yunoVoiceAudio from './assets/audio/yuno1-voice.wav'

const REPO_URL = 'https://github.com/TKGEKKOU/yumeno'
const RELEASES_URL = `${REPO_URL}/releases`
const SECTION_IDS = ['home', 'operator', 'voice', 'agents', 'docs']
const SECTION_LABELS = ['首页', '角色', '声音', '角色化 Agent', '文档']

const agents = [
  { id: 'knowledge', tone: 'violet', name: 'KNOWLEDGE SUBGRAPH', label: '知识执行图', detail: 'Planner / RAG / SQL / fallback', kind: 'subgraph' },
  { id: 'memory', tone: 'cyan', name: 'MEMORY WORKER', label: '记忆整理', detail: '保存重要片段' },
  { id: 'document', tone: 'cyan', name: 'DOCUMENT WORKER', label: '资料处理', detail: '导入与结构化' },
  { id: 'profile', tone: 'cyan', name: 'PROFILE WORKER', label: '角色档案', detail: '人设与边界' },
  { id: 'voice', tone: 'violet', name: 'VOICE CLONE WORKER', label: '声音工坊', detail: '参考音频与音色' },
  { id: 'config', tone: 'pink', name: 'CONFIG WORKER', label: '运行配置', detail: 'Provider 与服务' },
]

function getSectionFromHash() {
  const value = window.location.hash.replace('#', '')
  return SECTION_IDS.includes(value) ? value : 'home'
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00'
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

function AudioSample({ id, title, note, src, activeAudioId, setActiveAudioId }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    const onLoaded = () => setDuration(audio.duration || 0)
    const onTime = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
      if (activeAudioId === id) setActiveAudioId(null)
    }
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [activeAudioId, id, setActiveAudioId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || activeAudioId === id) return
    audio.pause()
    setPlaying(false)
  }, [activeAudioId, id])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      setActiveAudioId(null)
      return
    }
    try {
      setActiveAudioId(id)
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
      setActiveAudioId(null)
    }
  }

  const seek = (event) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    audio.currentTime = (Number(event.target.value) / 100) * duration
    setProgress(Number(event.target.value))
  }

  return (
    <article className={`audio-sample ${playing ? 'is-playing' : ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="audio-sample__topline">
        <span className="audio-dot" aria-hidden="true" />
        <span>本地样本</span>
        <span className="audio-sample__time">{formatTime((progress / 100) * duration)} / {formatTime(duration)}</span>
      </div>
      <div className="audio-sample__body">
        <button className="play-button" type="button" onClick={toggle} aria-label={`${playing ? '暂停' : '播放'}${title}`}>
          <span>{playing ? 'Ⅱ' : '▶'}</span>
        </button>
        <div className="audio-sample__copy">
          <h3>{title}</h3>
          <p>{note}</p>
        </div>
      </div>
      <div className="audio-progress">
        <input type="range" min="0" max="100" step="0.1" value={progress} onChange={seek} aria-label={`${title}播放进度`} />
        <span style={{ width: `${progress}%` }} />
      </div>
    </article>
  )
}

function AgentNode({ agent, index, active, onFocus }) {
  return (
    <button className={`agent-node agent-node--${agent.id} ${active ? 'is-active' : ''}`} data-tone={agent.tone} type="button" onClick={() => onFocus(agent.id)}>
      <span className="agent-node__index">0{index + 1}</span>
      <span className="agent-node__name">{agent.name}</span>
      <strong>{agent.label}</strong>
      <small>{agent.detail}</small>
    </button>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState(getSectionFromHash)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeAudioId, setActiveAudioId] = useState(null)
  const [characterState, setCharacterState] = useState('idle')
  const [focusedAgent, setFocusedAgent] = useState('knowledge')
  const wheelAccumulator = useRef(0)
  const transitionTimer = useRef(null)
  const touchStart = useRef(null)

  const activeIndex = Math.max(0, SECTION_IDS.indexOf(activeSection))

  const goToIndex = useCallback((nextIndex, replace = false) => {
    const clamped = Math.min(SECTION_IDS.length - 1, Math.max(0, nextIndex))
    const nextId = SECTION_IDS[clamped]
    if (nextId === activeSection || isTransitioning) return
    setIsTransitioning(true)
    setActiveSection(nextId)
    const method = replace ? 'replaceState' : 'pushState'
    window.history[method]({}, '', `#${nextId}`)
    window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => setIsTransitioning(false), 720)
  }, [activeSection, isTransitioning])

  const goToSection = useCallback((id, replace = false) => {
    const index = SECTION_IDS.indexOf(id)
    if (index >= 0) goToIndex(index, replace)
  }, [goToIndex])

  useEffect(() => {
    const initial = getSectionFromHash()
    if (window.location.hash !== `#${initial}`) window.history.replaceState({}, '', `#${initial}`)
    const onHashChange = () => {
      const next = getSectionFromHash()
      setActiveSection(next)
      setIsTransitioning(false)
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
      window.clearTimeout(transitionTimer.current)
    }
  }, [])

  useEffect(() => {
    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 2) return
      event.preventDefault()
      if (isTransitioning) return
      wheelAccumulator.current += event.deltaY
      if (Math.abs(wheelAccumulator.current) >= 55) {
        const direction = wheelAccumulator.current > 0 ? 1 : -1
        wheelAccumulator.current = 0
        goToIndex(activeIndex + direction)
      }
    }
    const onKeyDown = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        goToIndex(activeIndex + 1)
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        goToIndex(activeIndex - 1)
      }
      if (event.key === 'Home') {
        event.preventDefault()
        goToIndex(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        goToIndex(SECTION_IDS.length - 1)
      }
    }
    const onTouchStart = (event) => { touchStart.current = event.changedTouches[0].clientY }
    const onTouchEnd = (event) => {
      if (touchStart.current === null || isTransitioning) return
      const delta = touchStart.current - event.changedTouches[0].clientY
      touchStart.current = null
      if (Math.abs(delta) >= 45) goToIndex(activeIndex + (delta > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeIndex, goToIndex, isTransitioning])

  const currentAgent = agents.find((agent) => agent.id === focusedAgent) || agents[0]

  return (
    <main className="app-shell">
      <div className="noise" aria-hidden="true" />
      <div className="grid-glow" aria-hidden="true" />

      <header className="topbar">
        <button className="brand" type="button" onClick={() => goToSection('home')} aria-label="返回 YUMENO 首页">
          <span className="brand__mark">Y</span>
          <span>YUMENO</span>
        </button>
        <p className="topbar__context">LOCAL CHARACTER WORKSPACE</p>
        <a className="topbar__github" href={REPO_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <nav className="section-nav" aria-label="章节导航">
        <div className="section-nav__line" aria-hidden="true" />
        {SECTION_IDS.map((id, index) => (
          <button key={id} type="button" className={activeSection === id ? 'is-active' : ''} onClick={() => goToSection(id)} aria-current={activeSection === id ? 'page' : undefined}>
            <span className="section-nav__dot" />
            <span>{SECTION_LABELS[index]}</span>
          </button>
        ))}
      </nav>

      <div className="stage-viewport">
        <div className="stage-track" style={{ transform: `translate3d(0, -${activeIndex * 100}svh, 0)` }}>
          <section className="stage-section stage-section--home" id="home" aria-label="首页">
            <div className="home-layout">
              <div className="home-copy">
                <p className="kicker">YUMENO / CHARACTER AI WORKSPACE</p>
                <h1>让角色拥有<br /><span>自己的世界。</span></h1>
                <p className="home-lede">一个本地优先的角色工作台。记忆、知识、声音与行动，由一组角色化 Agent 协作完成。</p>
                <button className="line-button line-button--bright" type="button" onClick={() => goToSection('operator')}>进入角色 <span>↓</span></button>
              </div>
              <div className="home-mark" aria-hidden="true"><span>Y</span><i /><i /><i /></div>
            </div>
            <div className="stage-hint"><span>滚动 / 滑动</span><span className="stage-hint__arrow">↓</span></div>
          </section>

          <section className="stage-section stage-section--operator" id="operator" aria-label="角色">
            <div className="section-heading">
              <p className="kicker">角色展台</p>
              <h2>先有一个角色，<br /><span>再让它慢慢长出关系。</span></h2>
              <p>角色不是一张头像。它有自己的设定、会话、记忆、知识与声音。</p>
              <div className="operator-flow"><span>角色对话</span><b>→</b><strong>Supervisor</strong><b>→</b><span>多个 Agent</span></div>
            </div>
            <div className={`character-stage character-stage--${characterState}`}>
              <div className="character-stage__halo" aria-hidden="true" />
              <img src={mortisImage} alt="Mortis 角色展示图" />
              <div className="character-stage__caption"><span>MORTIS</span><small>角色视觉样本</small></div>
            </div>
            <div className="character-controls" aria-label="角色状态切换">
              <span className="character-controls__label">状态</span>
              {[["idle", '待机'], ['thinking', '思考'], ['replying', '回应']].map(([id, label]) => <button key={id} type="button" className={characterState === id ? 'is-active' : ''} onClick={() => setCharacterState(id)}>{label}</button>)}
              <span className="character-controls__status">{characterState === 'idle' ? '保持安静' : characterState === 'thinking' ? '正在选择路径' : '准备表达'}</span>
            </div>
          </section>

          <section className="stage-section stage-section--voice" id="voice" aria-label="声音">
            <div className="section-heading section-heading--wide">
              <p className="kicker">声音工坊</p>
              <h2>让角色不只被看见，<br /><span>也能被听见。</span></h2>
              <p>从一段素材开始，经过处理、试听和保存，成为可以绑定到角色的声音。</p>
            </div>
            <div className="audio-layout">
              <div className="audio-samples">
                <AudioSample id="reference" title="参考人声片段" note="从素材中提取的清晰人声" src={referenceAudio} activeAudioId={activeAudioId} setActiveAudioId={setActiveAudioId} />
                <AudioSample id="yuno" title="YUNO1 角色声音" note="保存后的参考音色，可绑定角色" src={yunoVoiceAudio} activeAudioId={activeAudioId} setActiveAudioId={setActiveAudioId} />
              </div>
              <div className="voice-pipeline" aria-label="声音工坊流程">
                {['素材', '分离', '切片', '拼接', '试听', '绑定'].map((step, index) => <div key={step} className="voice-pipeline__step"><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < 5 && <i>→</i>}</div>)}
              </div>
            </div>
          </section>

          <section className="stage-section stage-section--agents" id="agents" aria-label="角色化 Agent">
            <div className="agents-intro">
              <div>
                <p className="kicker">角色化 Agent</p>
                <h2>一个角色的背后，<br /><span>是一组分工明确的协作者。</span></h2>
              </div>
              <p className="agents-intro__copy">YUMENO 不让所有 Agent 无限制地自由聊天。Supervisor 负责理解意图、选择路径、收拢结果，再用角色的方式回应你。这里是 5 个受限 Worker，加上一条确定性的知识执行图。</p>
            </div>
            <div className="agent-system">
              <svg className="agent-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="flow-cyan" x1="0" x2="1"><stop offset="0" stopColor="#70e7ff" stopOpacity=".15" /><stop offset=".5" stopColor="#70e7ff" /><stop offset="1" stopColor="#70e7ff" stopOpacity=".15" /></linearGradient></defs>
                <path d="M500 276 C390 190 245 90 112 74" /><path d="M500 276 C390 240 240 204 86 202" /><path d="M500 276 C380 300 230 324 92 346" /><path d="M500 276 C615 190 760 90 888 74" /><path d="M500 276 C615 240 770 204 914 202" /><path d="M500 276 C620 310 770 340 900 378" />
              </svg>
              <div className="agent-supervisor"><span className="agent-supervisor__pulse" /><p>中心协调</p><strong>PERSONA<br />SUPERVISOR</strong><small>理解意图 · 选择路径 · 统一表达</small></div>
              <div className="agent-nodes">
                {agents.map((agent, index) => <AgentNode key={agent.id} agent={agent} index={index} active={focusedAgent === agent.id} onFocus={setFocusedAgent} />)}
              </div>
              <div className="agent-contract"><span>领域结果</span><b>finalize_*</b><span>回到 Supervisor</span></div>
              <div className="agent-checkpoint"><span className="checkpoint-dot" />HITL / CHECKPOINT <small>敏感写入 · 修改 · 训练，可在执行前确认</small></div>
            </div>
            <div className="agent-detail"><span>{currentAgent.name}</span><strong>{currentAgent.label}</strong><p>{currentAgent.detail}。{currentAgent.kind === 'subgraph' ? '它负责规划与执行知识路径，返回证据和不确定性。' : '它只处理自己的领域，把结构化结果交还给中心协调。'}</p></div>
          </section>

          <section className="stage-section stage-section--docs" id="docs" aria-label="文档">
            <div className="docs-stage">
              <div className="section-heading"><p className="kicker">站内文档</p><h2>想了解更多，<br /><span>留在这里继续看。</span></h2><p>从第一次启动，到多 Agent 架构、声音工坊和部署要求，详细资料都整理在站内文档中。</p><a className="line-button line-button--bright" href="./docs.html#quick-start">打开文档 <span>↗</span></a></div>
              <div className="docs-index"><a href="./docs.html#architecture"><span>01</span><strong>多 Agent 架构</strong><i>↗</i></a><a href="./docs.html#voice-studio"><span>02</span><strong>声音工坊</strong><i>↗</i></a><a href="./docs.html#deployment"><span>03</span><strong>使用与部署</strong><i>↗</i></a><a href="./docs.html#faq"><span>04</span><strong>常见问题</strong><i>↗</i></a></div>
            </div>
            <footer className="stage-footer"><span>YUMENO / LOCAL FIRST</span><span>角色、记忆、知识与声音，留在自己的空间里。</span><div><a href={REPO_URL} target="_blank" rel="noreferrer">源码 ↗</a><a href={RELEASES_URL} target="_blank" rel="noreferrer">发布 ↗</a></div></footer>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
