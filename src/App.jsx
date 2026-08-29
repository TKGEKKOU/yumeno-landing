import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import mortisImage from './assets/images/mortis.png';
import referenceAudio from './assets/audio/reference-segment.wav';
import yunoVoiceAudio from './assets/audio/yuno1-voice.wav';

const repo = 'https://github.com/TKGEKKOU/yumeno';
const releases = `${repo}/releases`;

const pillars = [
  {
    index: '01',
    eyebrow: 'PERSONA',
    title: '角色',
    summary: '先从一个人开始。',
    body: '设定性格、语气、习惯和边界，让每个角色都有自己的相处方式。',
    detail: '独立的人设 · 独立的会话 · 独立的空间',
  },
  {
    index: '02',
    eyebrow: 'MEMORY',
    title: '记忆',
    summary: '重要的事，不必再说一遍。',
    body: '对话中的偏好、约定与片段可以留在本地，下一次相遇自然接得上。',
    detail: '本地保存 · 可查看 · 可管理',
  },
  {
    index: '03',
    eyebrow: 'KNOWLEDGE',
    title: '知识',
    summary: '让回答有来处。',
    body: '把资料放进角色自己的知识空间，在需要时检索，并在没有依据时明确说不知道。',
    detail: '文档 · 表格 · 网页 · 独立隔离',
  },
];

const architecture = [
  { key: 'character', label: '角色', sub: '表达与相处' },
  { key: 'memory', label: '记忆', sub: '保留重要片段' },
  { key: 'knowledge', label: '知识', sub: '查找可靠资料' },
  { key: 'voice', label: '声音', sub: '听见角色回应' },
  { key: 'action', label: '行动', sub: '需要时交给工具' },
];

const docs = [
  {
    id: 'about',
    label: 'YUMENO 是什么',
    title: '让角色成为一种长期关系',
    paragraphs: [
      'YUMENO 是一个本地优先的角色 AI 工作台。它不是把所有功能塞进一个聊天窗口，而是让角色拥有自己的设定、资料、记忆、声音与会话。',
      '你可以从一个角色开始，慢慢补充它的世界，也可以只把它当作一个安静、可靠的桌面工具。',
    ],
  },
  {
    id: 'voice',
    label: '声音工坊',
    title: '从一段素材，到角色的声音',
    paragraphs: [
      '声音工坊支持从视频或音频素材中提取人声，进行分离、切片、挑选参考片段，再保存为可试听、可绑定的角色声音。',
      '本地运行时可接入 GPT-SoVITS 等语音模型。素材和生成结果默认留在自己的设备上。',
    ],
  },
  {
    id: 'runtime',
    label: '运行方式',
    title: '在自己的 Windows 电脑里',
    paragraphs: [
      'YUMENO 面向 Windows 桌面使用，不需要注册和登录。角色、会话、记忆等应用数据保存在本地。',
      '模型服务可以按需要连接 OpenAI-compatible 接口，也可以配置本地语音、向量和推理服务。',
    ],
  },
  {
    id: 'privacy',
    label: '关于数据',
    title: '你的角色，留在你的空间里',
    paragraphs: [
      '角色资料、会话和记忆使用本地存储；每个角色拥有独立的知识空间，避免不同角色之间互相串用资料。',
      '涉及写入、修改或训练的操作，可以在执行前等待你的确认。',
    ],
  },
];

function AudioSample({ label, title, note, src, accent }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onTime = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    const onEnd = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd); };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); return; }
    try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
  };

  const seek = (event) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (Number(event.target.value) / 100) * audio.duration;
    setProgress(Number(event.target.value));
  };

  return (
    <article className={`audio-card ${accent ? 'audio-card-accent' : ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="audio-card-top">
        <span className="audio-number">{label}</span>
        <span className="audio-format">WAV · 本地样本</span>
      </div>
      <div className="audio-card-main">
        <button type="button" className="play-button" onClick={toggle} aria-label={`${playing ? '暂停' : '播放'}${title}`}>
          <span className={playing ? 'pause-glyph' : 'play-glyph'} />
        </button>
        <div className="audio-copy"><h3>{title}</h3><p>{note}</p></div>
      </div>
      <div className="audio-progress-row">
        <input type="range" min="0" max="100" value={progress} onChange={seek} aria-label={`${title}播放进度`} style={{ '--progress': `${progress}%` }} />
        <span>{playing ? '试听中' : '试听'}</span>
      </div>
    </article>
  );
}

function DocDrawer({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="doc-drawer" role="dialog" aria-modal="true" aria-labelledby="doc-title">
        <div className="drawer-head"><span>YUMENO / 文档</span><button type="button" className="close-button" onClick={onClose} aria-label="关闭文档">×</button></div>
        <div className="drawer-body"><p className="drawer-label">{doc.label}</p><h2 id="doc-title">{doc.title}</h2>{doc.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="drawer-foot"><span>站内阅读</span><span>ESC 关闭</span></div>
      </aside>
    </div>
  );
}

function App() {
  const [activeDoc, setActiveDoc] = useState(null);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setActiveDoc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openDoc = (id) => setActiveDoc(docs.find((doc) => doc.id === id) ?? docs[0]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="YUMENO 首页"><span className="brand-mark">Y</span><span className="brand-name">YUMENO</span></a>
        <nav className="site-nav" aria-label="主导航">
          <a href="#world">角色</a><a href="#voice">声音</a><a href="#structure">结构</a><button type="button" onClick={() => openDoc('about')}>文档</button>
        </nav>
        <div className="header-actions"><a className="github-link" href={repo} target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a className="header-download" href={releases} target="_blank" rel="noreferrer">下载</a></div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="kicker"><span className="kicker-line" />一个属于你的角色空间</p>
            <h1>让一个角色，<br /><em>慢慢成为</em><br />你熟悉的存在。</h1>
            <p className="hero-lede">YUMENO 把角色、声音、记忆和资料放在一起。<br />在自己的电脑里，建立一段可以持续的相处。</p>
            <div className="hero-actions"><a className="primary-button" href={releases} target="_blank" rel="noreferrer">下载 YUMENO <span>↓</span></a><a className="text-link" href="#world">看看它能做什么 <span>↘</span></a></div>
            <div className="hero-meta"><span>WINDOWS 优先</span><span>无需注册</span><span>本地保存</span></div>
          </div>
          <div className="hero-art" aria-label="YUMENO 角色视觉">
            <div className="art-caption"><span>01 / 角色</span><span>建立自己的相处方式</span></div>
            <div className="art-frame"><img src={mortisImage} alt="YUMENO 角色 Mortis" /><div className="art-wash" /><span className="art-corner art-corner-tl" /><span className="art-corner art-corner-br" /></div>
            <div className="art-side-note">YUMENO<br /><span>PERSONA WORKSPACE</span></div>
          </div>
        </section>

        <section className="manifesto-section" id="world">
          <div className="section-rule"><span>01</span><span>从一个角色开始</span><span>YUMENO / 2026</span></div>
          <div className="manifesto-grid"><p className="section-label">角色<br />不是头像</p><div><h2>它有自己的<br /><span>世界。</span></h2><p className="manifesto-copy">每个角色都可以拥有独立的人设、记忆、知识和声音。你不需要一次准备好一切，先从一句话开始就够了。</p></div><div className="manifesto-aside"><span className="aside-mark">◒</span><p>把设定放进去，<br />把时间留出来。</p></div></div>
          <div className="pillar-grid">{pillars.map((pillar) => <article className="pillar-card" key={pillar.index}><div className="pillar-top"><span>{pillar.index}</span><span>{pillar.eyebrow}</span></div><div><h3>{pillar.title}</h3><p className="pillar-summary">{pillar.summary}</p><p className="pillar-body">{pillar.body}</p></div><p className="pillar-detail">{pillar.detail}</p></article>)}</div>
        </section>

        <section className="voice-section" id="voice">
          <div className="section-rule dark-rule"><span>02</span><span>声音工坊</span><span>从素材，到回应</span></div>
          <div className="voice-intro"><div><p className="section-label light-label">听见<br />它的声音</p><h2>一段声音，<br /><em>靠近</em>一个角色。</h2></div><p className="voice-lede">从音频或视频素材中选出合适的片段，整理、试听，再把它放进角色里。这里展示的是 YUMENO 项目中的真实样本。</p></div>
          <div className="audio-stage"><div className="audio-stage-head"><span>VOICE STUDIO / SAMPLE</span><span>真实素材试听</span></div><div className="audio-grid"><AudioSample label="SOURCE 01" title="参考人声片段" note="从素材中提取的清晰人声" src={referenceAudio} /><AudioSample label="VOICE 02" title="YUNO1 角色声音" note="保存后的参考音色，可绑定角色" src={yunoVoiceAudio} accent /></div><div className="voice-pipeline"><span>上传素材</span><i>→</i><span>提取人声</span><i>→</i><span>试听保存</span><i>→</i><strong>绑定角色</strong></div></div>
        </section>

        <section className="structure-section" id="structure">
          <div className="section-rule"><span>03</span><span>里面如何工作</span><span>不必先懂技术</span></div>
          <div className="structure-intro"><p className="section-label">简单的<br />关系</p><div><h2>让不同的能力，<br /><span>各自做好一件事。</span></h2><p>角色负责表达，知识负责查找，记忆负责保留，声音负责回应。需要行动时，再把事情交给合适的工具。</p></div></div>
          <div className="architecture-board"><div className="board-top"><span>YUMENO / PERSONA WORKSPACE</span><span>LOCAL FIRST</span></div><div className="arch-diagram"><div className="arch-center"><span className="center-orbit orbit-one" /><span className="center-orbit orbit-two" /><strong>角色</strong><small>PERSONA</small><span className="center-dot" /></div><div className="arch-lines" aria-hidden="true"><i className="line line-a" /><i className="line line-b" /><i className="line line-c" /><i className="line line-d" /><i className="line line-e" /></div>{architecture.filter((item) => item.key !== 'character').map((item) => <div className={`arch-node node-${item.key}`} key={item.key}><span className="node-index">0{architecture.indexOf(item) + 1}</span><strong>{item.label}</strong><small>{item.sub}</small></div>)}</div><div className="board-foot"><span>每个角色拥有独立的会话与知识空间</span><span>可连接本地或兼容服务</span></div></div>
        </section>

        <section className="docs-section" id="docs">
          <div className="section-rule"><span>04</span><span>继续了解</span><span>站内文档</span></div>
          <div className="docs-layout"><div><p className="section-label">把问题<br />留在这里</p><h2>不必离开<br /><span>当前页面。</span></h2></div><div className="docs-list">{docs.map((doc, index) => <button type="button" className="doc-row" key={doc.id} onClick={() => setActiveDoc(doc)}><span>0{index + 1}</span><strong>{doc.label}</strong><span className="doc-arrow">↗</span></button>)}</div></div>
        </section>

        <section className="download-section">
          <div className="download-panel"><div><p className="section-label light-label">现在开始</p><h2>把它带回<br /><em>自己的电脑。</em></h2></div><div className="download-side"><p>YUMENO 面向 Windows 桌面运行。下载后，从一个角色开始。</p><div className="download-actions"><a className="light-button" href={releases} target="_blank" rel="noreferrer">前往下载 <span>↓</span></a><button type="button" className="light-text-button" onClick={() => openDoc('runtime')}>查看运行方式 <span>↗</span></button></div></div><div className="download-index">YUMENO<br /><span>YOUR SPACE, YOUR STORY</span></div></div>
        </section>
      </main>

      <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">Y</span><span className="brand-name">YUMENO</span></a><p>角色、声音、记忆与知识，留在你的空间里。</p><div className="footer-links"><a href={repo} target="_blank" rel="noreferrer">源码 ↗</a><a href={releases} target="_blank" rel="noreferrer">发布 ↗</a><button type="button" onClick={() => openDoc('privacy')}>数据说明 ↗</button></div></footer>
      <DocDrawer doc={activeDoc} onClose={() => setActiveDoc(null)} />
    </div>
  );
}

export default App;
