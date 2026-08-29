import React, { useEffect, useRef, useState } from 'react';
import AsciiSweep from './components/AsciiSweep';
import PeelReveal from './components/PeelReveal';
import Waveform from './components/Waveform';
import './App.css';

const repo = 'https://github.com/TKGEKKOU/yumeno';
const releases = `${repo}/releases`;

const experiences = [
  { icon: '◌', title: '角色', text: '把设定、语气和习惯放进一个可以长期相处的角色里。' },
  { icon: '◒', title: '声音', text: '从自己的音视频素材开始，做出可以试听、保存和绑定的声音。' },
  { icon: '✦', title: '记忆', text: '重要的对话与偏好留在本地，下一次相遇不必从零开始。' },
  { icon: '⌘', title: '知识', text: '给角色一套独立的资料空间，让回答有依据，也知道什么时候应该说不知道。' },
  { icon: '↗', title: '行动', text: '复杂任务交给合适的能力处理，敏感操作先停下来等你确认。' },
];

const workspaceTabs = [
  { id: 'character', label: '角色状态' },
  { id: 'voice', label: '声音状态' },
  { id: 'memory', label: '记忆状态' },
];

const deploymentModes = {
  cloud: { label: '快速体验', text: '先打开 YUMENO，快速感受角色对话和知识能力。' },
  hybrid: { label: '混合使用', text: '对话可以连接服务，声音、资料和角色数据仍然留在自己的设备上。' },
  local: { label: '完全本地', text: '模型、声音、资料和会话都在本地运行，适合更重视隐私和控制力的场景。' },
};

const voiceSteps = [
  { id: 'source', label: '素材', note: '选择一段音视频' },
  { id: 'process', label: '处理', note: '提取并整理人声' },
  { id: 'preview', label: '试听', note: '听听它现在的样子' },
  { id: 'bind', label: '绑定', note: '放进角色的声音里' },
];

function WorkspaceCharacterPanel() {
  return (
    <div className="workspace-panel">
      <div className="panel-heading"><span className="panel-label">当前角色</span><span className="panel-live"><i />正在相处</span></div>
      <div className="character-row">
        <div className="character-avatar">澪</div>
        <div><h3>雾岛澪</h3><p>一个安静、会记得细节的角色。</p></div>
        <span className="panel-arrow">↗</span>
      </div>
      <div className="chat-bubble chat-bubble-user">今天也想和你聊一会儿。</div>
      <div className="chat-bubble chat-bubble-ai"><span className="bubble-avatar">澪</span><span>好呀。上次你说到的那件事，我还记得。</span></div>
      <div className="panel-foot"><span><i className="dot dot-accent" />声音已绑定</span><span><i className="dot" />本地记忆正常</span></div>
    </div>
  );
}

function WorkspaceVoicePanel() {
  return (
    <div className="workspace-panel workspace-panel-summary">
      <div className="panel-heading"><span className="panel-label">声音状态</span><span className="panel-live is-accent"><i />已准备</span></div>
      <div className="summary-icon">◒</div>
      <h3>一段声音，正在靠近。</h3>
      <p>来自你的素材，经过整理后成为角色可以使用的声音。</p>
      <div className="mini-wave" aria-hidden="true">{Array.from({ length: 30 }, (_, index) => <i key={index} style={{ height: `${18 + Math.abs(Math.sin(index * 0.72)) * 62}%` }} />)}</div>
      <div className="panel-foot"><span><i className="dot dot-accent" />试听可用</span><span>声音工坊 →</span></div>
    </div>
  );
}

function WorkspaceMemoryPanel() {
  return (
    <div className="workspace-panel workspace-panel-summary">
      <div className="panel-heading"><span className="panel-label">记忆状态</span><span className="panel-live"><i />已保存</span></div>
      <div className="memory-list">
        <div><span className="memory-time">今天 · 09:42</span><strong>你喜欢安静的夜晚</strong></div>
        <div><span className="memory-time">昨天 · 18:20</span><strong>继续读完那本书</strong></div>
        <div><span className="memory-time">上周 · 22:08</span><strong>把重要的事留在这里</strong></div>
      </div>
      <div className="panel-foot"><span><i className="dot dot-accent" />角色空间独立</span><span>查看全部 →</span></div>
    </div>
  );
}

function WorkspaceRail() {
  return (
    <div className="peel-rail-content">
      <div className="rail-brand"><span className="rail-mark">Y</span><span>YUMENO</span></div>
      <div className="rail-current"><span className="rail-eyebrow">当前角色</span><strong>雾岛澪</strong><span className="rail-status"><i />本地工作区</span></div>
      <nav className="peel-nav" aria-label="角色工具栏">
        {['角色', '记忆', '知识空间', '声音工坊', '设置'].map((item, index) => (
          <button type="button" className={index === 0 ? 'is-active' : ''} key={item}><span>{['◌', '✦', '⌘', '◒', '⚙'][index]}</span>{item}<b>›</b></button>
        ))}
      </nav>
      <div className="rail-bottom"><span><i className="dot dot-accent" />资料已隔离</span><small>无需注册 · Windows</small></div>
    </div>
  );
}

function App() {
  const [workspaceTab, setWorkspaceTab] = useState('character');
  const [deploymentMode, setDeploymentMode] = useState('hybrid');
  const [voiceStep, setVoiceStep] = useState('preview');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [audioMessage, setAudioMessage] = useState('点击试听一段浏览器演示音');
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const voiceFrameRef = useRef(null);
  const voiceStartedAtRef = useRef(0);
  const voiceDuration = 4.8;

  const stopVoicePreview = (reset = true) => {
    if (voiceFrameRef.current) cancelAnimationFrame(voiceFrameRef.current);
    try { oscillatorRef.current?.stop(); } catch { /* oscillator may already be stopped */ }
    oscillatorRef.current?.disconnect();
    gainNodeRef.current?.disconnect();
    oscillatorRef.current = null;
    gainNodeRef.current = null;
    setIsVoicePlaying(false);
    if (reset) setVoiceProgress(0);
  };

  const startVoicePreview = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    voiceStartedAtRef.current = performance.now();
    setAudioMessage(AudioContextClass ? '正在播放浏览器演示音' : '当前浏览器使用视觉试听模式');
    setIsVoicePlaying(true);

    const updateProgress = (time) => {
      const next = Math.min(1, (time - voiceStartedAtRef.current) / (voiceDuration * 1000));
      setVoiceProgress(next);
      if (next >= 1) {
        stopVoicePreview();
        setAudioMessage('试听完成，可以再次播放');
        return;
      }
      voiceFrameRef.current = requestAnimationFrame(updateProgress);
    };
    voiceFrameRef.current = requestAnimationFrame(updateProgress);

    if (!AudioContextClass) return;
    const context = audioContextRef.current || new AudioContextClass();
    audioContextRef.current = context;
    if (context.state === 'suspended') context.resume();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, now);
    oscillator.frequency.exponentialRampToValueAtTime(330, now + 0.7);
    oscillator.frequency.exponentialRampToValueAtTime(246, now + 2.7);
    oscillator.frequency.exponentialRampToValueAtTime(392, now + voiceDuration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
    gain.gain.setValueAtTime(0.035, now + 1.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + voiceDuration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + voiceDuration + 0.05);
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gain;
  };

  const toggleVoicePreview = () => {
    if (isVoicePlaying) {
      stopVoicePreview();
      setAudioMessage('试听已暂停，再次点击可以播放');
      return;
    }
    startVoicePreview();
  };

  useEffect(() => () => {
    stopVoicePreview();
    audioContextRef.current?.close();
  }, []);

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="YUMENO 首页"><span className="brand-mark">Y</span><span>YUMENO</span></a>
        <nav className="site-nav" aria-label="页面导航">
          <a href="#experience">体验</a><a href="#voice">声音工坊</a><a href="#runtime">本地工作</a><a href="#start">开始使用</a>
        </nav>
        <a className="header-link" href={releases}>下载 <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />一个属于你的角色空间</div>
            <h1 id="hero-title">让一个角色，<br /><em>慢慢成为</em>你熟悉的存在。</h1>
            <p className="hero-lead">创建角色，给它声音、记忆和自己的资料空间。从一次对话开始，逐渐形成只属于你的相处方式。</p>
            <div className="hero-actions"><a className="button button-primary" href={releases}>下载 YUMENO <span aria-hidden="true">↗</span></a><a className="button button-quiet" href="#experience">看看它能做什么 <span aria-hidden="true">↓</span></a></div>
            <div className="hero-note"><span className="status-dot" />本地优先 · 不需要注册 · Windows</div>
          </div>

          <div className="hero-demo-wrap">
            <PeelReveal reveal={<WorkspaceRail />}>
              <div className="workspace-demo">
                <div className="workspace-topbar"><div className="window-dots"><i /><i /><i /></div><span>我的角色空间</span><span className="workspace-date">今天，星期六</span></div>
                <div className="workspace-grid">
                  <aside className="workspace-mini-sidebar"><div className="mini-logo">Y</div><span className="mini-active">◌</span><span>✦</span><span>⌘</span><span>◒</span><span>⚙</span><div className="mini-user">澪</div></aside>
                  <div className="workspace-main">
                    <div className="workspace-main-head"><div><span className="workspace-kicker">GOOD EVENING</span><h2>和你的角色聊一会儿。</h2></div><span className="workspace-local"><i />本地工作区</span></div>
                    <div className="workspace-tabs" role="tablist" aria-label="角色工作台状态">
                      {workspaceTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={workspaceTab === tab.id} aria-controls={`workspace-panel-${tab.id}`} className={workspaceTab === tab.id ? 'is-active' : ''} onClick={() => setWorkspaceTab(tab.id)}>{tab.label}</button>)}
                    </div>
                    <AsciiSweep index={workspaceTabs.findIndex((tab) => tab.id === workspaceTab)} panels={[<div id="workspace-panel-character" role="tabpanel" key="character"><WorkspaceCharacterPanel /></div>, <div id="workspace-panel-voice" role="tabpanel" key="voice"><WorkspaceVoicePanel /></div>, <div id="workspace-panel-memory" role="tabpanel" key="memory"><WorkspaceMemoryPanel /></div>]} color="#5657D9" duration={0.75} />
                    <div className="workspace-bottom-row"><div><span className="bottom-label">最近一次记忆</span><strong>“留一点时间给真正重要的事。”</strong></div><span className="bottom-link">打开空间 ↗</span></div>
                  </div>
                </div>
              </div>
            </PeelReveal>
            <div className="demo-caption"><span>YUMENO / ROLE WORKSPACE</span><span>靠近左侧边缘，打开工具栏</span></div>
          </div>
        </section>

        <section id="experience" className="experience-section section-shell">
          <div className="section-intro"><div className="section-kicker">你可以从这里开始</div><h2>从一个角色开始，<br /><span>慢慢长出一整个世界。</span></h2><p>它可以只是陪你聊天，也可以帮你整理资料、记住重要的事，或者用你熟悉的声音回应。</p></div>
          <div className="experience-grid">{experiences.map((item, index) => <article className="experience-card" key={item.title}><span className="card-icon">{item.icon}</span><span className="card-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><span className="card-line" /></article>)}</div>
        </section>

        <section id="voice" className="voice-section section-shell">
          <div className="voice-visual">
            <div className="voice-visual-top"><span className="voice-window-label">声音工坊</span><span className="voice-window-state"><i className={isVoicePlaying ? 'is-playing' : ''} />{isVoicePlaying ? '试听中' : '准备好了'}</span></div>
            <div className="voice-visual-center"><div className="voice-disc"><span>澪</span><i className="disc-ring ring-one" /><i className="disc-ring ring-two" /></div><span className="voice-play-label">{isVoicePlaying ? 'LISTENING' : 'VOICE PREVIEW'}</span></div>
            <Waveform isPlaying={isVoicePlaying} progress={voiceProgress} onToggle={toggleVoicePreview} />
            <p className="audio-message">{audioMessage}</p>
          </div>
          <div className="voice-copy"><div className="section-kicker">让它拥有自己的声音</div><h2>先听见它，<br /><em>再慢慢认识它。</em></h2><p>把一段视频或音频变成角色可以使用的声音。每一步都看得见：提取人声、分离、切片、试听、保存，再绑定到角色。</p><div className="voice-steps">{voiceSteps.map((step, index) => <button type="button" className={voiceStep === step.id ? 'is-active' : ''} key={step.id} onClick={() => setVoiceStep(step.id)}><b>0{index + 1}</b><span>{step.label}</span><small>{step.note}</small></button>)}</div><p className="voice-disclaimer">试听按钮播放的是浏览器生成的短暂演示音，不是项目内置的角色音频。</p><a className="text-link" href={repo}>查看项目源码 <span aria-hidden="true">↗</span></a></div>
        </section>

        <section id="runtime" className="runtime-section section-shell">
          <div className="section-intro"><div className="section-kicker">在你自己的空间里</div><h2>重要的事留在身边，<br /><span>也留在你手里。</span></h2><p>每个角色拥有自己的资料空间，任务由合适的能力完成，重要动作会交还给你决定。</p></div>
          <div className="runtime-board">
            <div className="runtime-top"><span>YUMENO / WORKSPACE</span><span>DATA & CONTROL</span></div>
            <div className="runtime-flow"><div className="flow-node flow-user"><small>从你开始</small><strong>一句话</strong><span>你的请求</span></div><div className="flow-connector"><i /><i /><i /></div><div className="flow-node flow-supervisor"><small>角色中枢</small><strong>理解你的意思</strong><span>理解 · 分派 · 表达</span></div><div className="flow-connector"><i /><i /><i /></div><div className="flow-workers"><div><b>知识</b><span>查资料</span></div><div><b>记忆</b><span>记住重要的事</span></div><div><b>声音</b><span>回应你</span></div><div><b>行动</b><span>完成任务</span></div></div></div>
            <div className="runtime-bottom"><span><i className="dot dot-warning" />敏感操作需要确认</span><span><i className="dot dot-accent" />资料按角色隔离</span><span><i className="dot" />每次过程可以恢复</span></div>
          </div>
          <div className="placement-row"><div><span className="placement-kicker">资料放在哪里？</span><strong>由你决定。</strong></div><div className="deployment-switcher" role="tablist" aria-label="资料放置方式">{Object.entries(deploymentModes).map(([key, mode]) => <button key={key} type="button" role="tab" aria-selected={deploymentMode === key} className={deploymentMode === key ? 'is-active' : ''} onClick={() => setDeploymentMode(key)}>{mode.label}</button>)}</div><p className="deployment-description">{deploymentModes[deploymentMode].text}</p></div>
          <div className="proof-grid"><div><strong>85%</strong><span>自适应 RAG 准确率</span></div><div><strong>14%</strong><span>评测集幻觉率</span></div><div><strong>85%</strong><span>Recall@3</span></div><div><strong>107</strong><span>核心单元测试通过</span></div></div><p className="data-note">以上为项目当前资料中的内部评测数据，不代表第三方认证。</p>
        </section>

        <section id="start" className="start-section section-shell"><div className="start-panel"><div><div className="section-kicker">准备好之后</div><h2>从一次对话<br />开始。</h2><p>下载发行包，配置你的模型服务，然后打开属于你的角色空间。</p></div><div className="start-actions"><a className="button button-light" href={releases}>前往 Releases <span aria-hidden="true">↗</span></a><a className="button button-outline-light" href={`${repo}#readme`}>阅读文档 <span aria-hidden="true">↗</span></a></div><div className="start-meta"><span>主项目公开仓库</span><span>本地数据 · 可控部署 · 持续更新</span></div></div></section>
      </main>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">Y</span><span>YUMENO</span></a><div className="footer-links"><a href={repo}>GitHub</a><a href={releases}>Releases</a><a href={`${repo}/issues`}>反馈</a></div><p>© 2026 YUMENO Project</p></footer>
    </div>
  );
}

export default App;

\n