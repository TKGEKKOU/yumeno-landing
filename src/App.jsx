import React from 'react';
import AsciiSweep from './components/AsciiSweep';
import PeelReveal from './components/PeelReveal';
import Waveform from './components/Waveform';
import './App.css';

const repo = 'https://github.com/TKGEKKOU/yumeno';
const releases = `${repo}/releases`;

const experiences = [
  { number: '01', title: '角色', text: '把设定、语气和习惯放进一个可以长期相处的角色里。' },
  { number: '02', title: '声音', text: '从自己的音视频素材开始，做出可以试听、保存和绑定的声音。' },
  { number: '03', title: '记忆', text: '重要的对话与偏好留在本地，下一次相遇不必从零开始。' },
  { number: '04', title: '知识', text: '给角色一套独立的资料空间，让回答有依据，也知道什么时候应该说不知道。' },
  { number: '05', title: '行动', text: '复杂任务交给合适的能力处理，敏感操作先停下来等你确认。' },
];

const deploymentModes = [
  { title: '轻量云端', tag: '快速开始', text: '使用 OpenAI-compatible 服务完成对话与检索，适合快速体验。' },
  { title: '本地混合', tag: '推荐', text: '对话接入云端，语音与资料保留在本地，兼顾体验和控制力。' },
  { title: '完全离线', tag: '最大掌控', text: '使用 Ollama、本地 Embedding 与 GPT-SoVITS，适合不希望数据离开设备的场景。' },
];

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="YUMENO 首页"><span className="brand-mark">Y</span> YUMENO</a>
        <nav className="site-nav" aria-label="页面导航">
          <a href="#experience">体验</a>
          <a href="#voice">声音工坊</a>
          <a href="#runtime">它如何工作</a>
          <a href="#start">开始使用</a>
        </nav>
        <a className="header-link" href={releases}>下载 <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <AsciiSweep style={{ width: '100%' }}>
          <section className="hero section-shell" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="section-kicker">PERSONA WORKSPACE / 001</div>
              <h1 id="hero-title">让角色拥有<br /><em>声音、记忆</em>与行动力。</h1>
              <p className="hero-lead">YUMENO 是一个放在自己设备上的角色工作台。创建一个角色，给它声音、知识和记忆，然后从一次真实的对话开始。</p>
              <div className="hero-actions">
                <a className="button button-primary" href={releases}>下载 YUMENO <span aria-hidden="true">↗</span></a>
                <a className="button button-quiet" href="#experience">看看它能做什么 <span aria-hidden="true">↓</span></a>
              </div>
              <div className="hero-note"><span className="status-dot" />本地优先 · 不需要注册 · Windows</div>
            </div>

            <PeelReveal className="hero-peel" reveal={(
              <div className="reveal-map">
                <div className="reveal-label">THE SPACE BETWEEN</div>
                <div className="reveal-title">你和<br />角色之间。</div>
                <div className="reveal-lines">
                  <span><b>01</b> 角色设定</span><span><b>02</b> 本地记忆</span><span><b>03</b> 专属知识</span><span><b>04</b> 可以行动</span>
                </div>
                <div className="reveal-stamp">OPEN<br />YOUR<br />WORLD</div>
              </div>
            )}>
              <div className="hero-sheet">
                <div className="sheet-top"><span>YUMENO / ROLE FILE</span><span>NO. 001</span></div>
                <div className="sheet-orbit" aria-hidden="true"><span /><span /><span /></div>
                <div className="sheet-copy">
                  <div className="sheet-symbol">◒</div>
                  <div className="sheet-label">A PLACE FOR YOUR PERSONA</div>
                  <h2>把想象<br />留在身边。</h2>
                  <p>不是一个回答问题的工具，而是一个可以被你慢慢定义的角色空间。</p>
                </div>
                <div className="sheet-footer"><span>MOVE TO REVEAL</span><span className="sheet-arrow">→</span></div>
              </div>
            </PeelReveal>
          </section>
        </AsciiSweep>

        <section id="experience" className="experience-section section-shell">
          <div className="section-intro"><div className="section-kicker">THE EXPERIENCE / 02</div><h2>从一个角色开始，<br /><span>慢慢长出一整个世界。</span></h2><p>它可以只是陪你聊天，也可以帮你整理资料、记住重要的事，或者用你熟悉的声音回应。</p></div>
          <div className="experience-grid">
            {experiences.map((item) => <article className="experience-card" key={item.number}><span className="card-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><span className="card-line" /></article>)}
          </div>
        </section>

        <section id="voice" className="voice-section section-shell">
          <div className="voice-visual"><div className="voice-orbit" aria-hidden="true"><span /><span /></div><div className="voice-caption"><span>VOICE STUDIO</span><span>LISTEN / CREATE / BIND</span></div><Waveform /></div>
          <div className="voice-copy"><div className="section-kicker">VOICE STUDIO / 03</div><h2>先听见它，<br /><em>再认识它。</em></h2><p>把一段视频或音频变成角色可以使用的声音。每一步都看得见：提取人声、分离、切片、试听、保存，再绑定到角色。</p><div className="voice-steps"><span><b>01</b>素材</span><span><b>02</b>处理</span><span><b>03</b>试听</span><span><b>04</b>绑定</span></div><a className="text-link" href={repo}>查看项目源码 <span aria-hidden="true">↗</span></a></div>
        </section>

        <section id="runtime" className="runtime-section section-shell">
          <div className="section-intro"><div className="section-kicker">UNDER THE SURFACE / 04</div><h2>它为什么能记得，<br /><span>也为什么值得信任。</span></h2><p>复杂的部分藏在表面之下：每个角色拥有自己的资料空间，任务由合适的能力完成，重要动作会交还给你决定。</p></div>
          <div className="runtime-board">
            <div className="runtime-top"><span>YUMENO / RUNTIME MAP</span><span>LOCAL WORKSPACE</span></div>
            <div className="runtime-flow"><div className="flow-node flow-user"><small>YOU</small><strong>一句话</strong><span>你的请求</span></div><div className="flow-connector"><i /><i /><i /></div><div className="flow-node flow-supervisor"><small>PERSONA SUPERVISOR</small><strong>角色中枢</strong><span>理解 · 分派 · 表达</span></div><div className="flow-connector"><i /><i /><i /></div><div className="flow-workers"><div><b>知识</b><span>查资料</span></div><div><b>记忆</b><span>记住重要的事</span></div><div><b>声音</b><span>回应你</span></div><div><b>行动</b><span>完成任务</span></div></div></div>
            <div className="runtime-bottom"><span><i className="tiny-dot red" />敏感操作需要确认</span><span><i className="tiny-dot" />每次过程可以恢复</span><span><i className="tiny-dot" />资料按角色隔离</span></div>
          </div>
          <div className="proof-grid"><div><strong>85%</strong><span>自适应 RAG 准确率</span></div><div><strong>14%</strong><span>评测集幻觉率</span></div><div><strong>85%</strong><span>Recall@3</span></div><div><strong>107</strong><span>核心单元测试通过</span></div></div>
          <p className="data-note">以上为项目当前资料中的内部评测数据，不代表第三方认证。</p>
        </section>

        <section className="deployment-section section-shell"><div className="section-intro compact"><div className="section-kicker">YOUR WAY / 05</div><h2>放在哪里，<br /><span>由你决定。</span></h2><p>从快速体验到完全离线，YUMENO 适应你的设备、网络和隐私边界。</p></div><div className="deployment-grid">{deploymentModes.map((mode, index) => <article className={`deployment-card ${index === 1 ? 'is-featured' : ''}`} key={mode.title}><div className="deployment-number">0{index + 1}</div><span className="deployment-tag">{mode.tag}</span><h3>{mode.title}</h3><p>{mode.text}</p><span className="card-line" /></article>)}</div></section>

        <section id="start" className="start-section section-shell"><div className="start-panel"><div><div className="section-kicker">READY WHEN YOU ARE / 06</div><h2>从一次对话<br />开始。</h2><p>下载发行包，配置你的模型服务，然后打开属于你的角色空间。</p></div><div className="start-actions"><a className="button button-light" href={releases}>前往 Releases <span aria-hidden="true">↗</span></a><a className="button button-outline-light" href={`${repo}#readme`}>阅读文档 <span aria-hidden="true">↗</span></a></div><div className="start-meta"><span>主项目公开仓库</span><span>本地数据 · 可控部署 · 持续更新</span></div></div></section>
      </main>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">Y</span> YUMENO</a><div className="footer-links"><a href={repo}>GitHub</a><a href={releases}>Releases</a><a href={`${repo}/issues`}>反馈</a></div><p>© 2026 YUMENO Project</p></footer>
    </div>
  );
}

export default App;
