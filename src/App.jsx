import React from 'react';
import AsciiSweep from './components/AsciiSweep';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div className="logo">YUMENO</div>
          <nav>
            <a href="#capabilities">能力</a>
            <a href="#deployment">部署</a>
            <a href="#architecture">架构</a>
            <a href="#quickstart">快速开始</a>
            <a href="#comparison">对比</a>
          </nav>
        </div>
      </header>

      <AsciiSweep style={{ width: '100%' }}>
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-left">
                <h1>工程化<br />Multi-Agent RAG 平台</h1>
                <p className="tagline">
                  以 LangGraph 为核心的对话式工作流平台：确定性意图路由、自适应 RAG、受控工具、本地语音、会话检查点与前端过程可观测。
                </p>
              <div className="hero-actions">
                <a href="https://github.com/TKGEKKOU/yumeno/releases" className="cta">立即下载</a>
                <a href="#quickstart" className="secondary-cta">查看快速开始</a>
              </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">6</div>
                  <div className="metric-label">专业 Worker 智能体协同编排</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">+31%</div>
                  <div className="metric-label">RAG 准确率提升（内部评测）</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">10</div>
                  <div className="metric-label">层 SQL 安全防护机制</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">584</div>
                  <div className="metric-label">单元测试当前通过</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AsciiSweep>

      <section id="deployment" className="deployment-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">三种部署模式</h2>
            <p className="section-subtitle">根据合规要求、性能需求和基础设施灵活选择</p>
          </div>

          <div className="deploy-cards">
            <div className="deploy-card">
              <h3>云端模式</h3>
              <div className="deploy-size">~50 MB</div>
              <ul className="deploy-features">
                <li><strong>LLM:</strong> OpenAI API</li>
                <li><strong>向量:</strong> text-embedding-3</li>
                <li><strong>语音:</strong> 不支持</li>
                <li><strong>场景:</strong> 快速验证</li>
              </ul>
            </div>

            <div className="deploy-card featured">
              <div className="deploy-badge">推荐</div>
              <h3>标准模式</h3>
              <div className="deploy-size">~500 MB</div>
              <ul className="deploy-features">
                <li><strong>LLM:</strong> OpenAI API</li>
                <li><strong>向量:</strong> bge-reranker-v2-m3</li>
                <li><strong>语音:</strong> GPT-SoVITS 本地</li>
                <li><strong>场景:</strong> 混合部署</li>
              </ul>
            </div>

            <div className="deploy-card">
              <h3>离线模式</h3>
              <div className="deploy-size">~3 GB</div>
              <ul className="deploy-features">
                <li><strong>LLM:</strong> Ollama (qwen2.5:7b)</li>
                <li><strong>向量:</strong> bge-m3 本地</li>
                <li><strong>语音:</strong> GPT-SoVITS 本地</li>
                <li><strong>场景:</strong> 完全离线</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="capability-section">
        <div className="container-wide">
          <div className="section-header">
            <h2 className="section-title">能力矩阵</h2>
            <p className="section-subtitle">从请求理解到执行、确认、恢复与展示的完整链路</p>
          </div>
          <div className="capability-grid">
            <article className="capability-card">
              <h3>确定性意图路由</h3>
              <p>音色克隆、记忆、文档、档案与配置等强意图直达 Worker，模糊请求才进入 Supervisor，减少多余模型调用。</p>
            </article>
            <article className="capability-card">
              <h3>自适应标准 RAG</h3>
              <p>混合检索、查询改写、证据引用、质量门与有界纠错；结构化数据进入只读 SQL 沙箱，限制函数、表范围与结果集。</p>
            </article>
            <article className="capability-card">
              <h3>Codex 式过程流</h3>
              <p>阶段节点、当前步骤、失败原因与最终回复分层展示；正文到达后过程自动折叠，思考内容不会混入语音输出。</p>
            </article>
            <article className="capability-card">
              <h3>安全工具执行</h3>
              <p>变更操作使用 HITL 确认，LangGraph checkpoint 保存上下文，服务重启或中断后可恢复；能力按角色与作用域授权。</p>
            </article>
            <article className="capability-card">
              <h3>本地语音工作流</h3>
              <p>聊天内上传素材，复用声音工作坊会话；质量检测、训练、试听与绑定在后台推进，节点状态回传对话页。</p>
            </article>
            <article className="capability-card">
              <h3>Web-first 控制台</h3>
              <p>原生 JS 与 Vue 混合前端覆盖角色、知识、Provider、能力扩展、评测与设置；hash 路由保留状态并支持切页不断线。</p>
            </article>
          </div>
        </div>
      </section>

      <section id="architecture" className="architecture-section">
        <div className="container-wide">
          <div className="section-header">
            <h2 className="section-title">核心技术架构</h2>
            <p className="section-subtitle">基于 LangGraph 1.2.9 的多智能体编排系统</p>
          </div>

          <div className="bento-grid">
            <div className="bento-item bento-large">
              <div>
                <h3>自适应 RAG 引擎</h3>
                <p>混合检索（向量 + BM25）+ 查询改写 + 答案质量门 + 自动纠错流程，在内部评测集上准确率提升 31%，幻觉率降低 39%。</p>
              </div>
              <span className="bento-metric">+31% 准确率</span>
            </div>

            <div className="bento-item bento-tall">
              <div>
                <h3>多智能体编排</h3>
              <p>1 个对外 Supervisor、1 个 knowledge 规划子图、6 个受限 Worker；Worker 结果统一经过 finalize 合同回 Supervisor。</p>
              </div>
              <span className="bento-metric">6 Workers</span>
            </div>

            <div className="bento-item bento-normal">
              <div>
                <h3>本地语音克隆</h3>
                <p>GPT-SoVITS 5 步自动化工作流，质量门自动拒绝不合格素材。</p>
              </div>
              <span className="bento-metric">5 步流程</span>
            </div>

            <div className="bento-item bento-wide">
              <div>
                <h3>SQL 安全防护</h3>
                <p>递归 CTE、JOIN 深度、子查询深度、表白名单、危险函数、结果集限制、超时保护等由单元测试覆盖。</p>
              </div>
              <span className="bento-metric">10 层防护</span>
            </div>

            <div className="bento-item bento-normal">
              <div>
                <h3>运行时配置</h3>
                <p>Web 界面动态修改参数，HITL 确认防误操作。</p>
              </div>
              <span className="bento-metric">HITL</span>
            </div>

            <div className="bento-item bento-normal">
              <div>
                <h3>向量存储</h3>
                <p>Milvus 3.0，支持混合检索、重排序、元数据过滤。</p>
              </div>
              <span className="bento-metric">Milvus 3.0</span>
            </div>
          </div>
        </div>
      </section>

      <section id="quickstart" className="quickstart-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">快速开始</h2>
            <p className="section-subtitle">三步完成本地验证</p>
          </div>
          <div className="quickstart-steps">
            <article className="step-card">
              <span>1</span>
              <h3>下载发行包</h3>
              <p>从 GitHub Releases 获取 Windows 包，解压后不要修改 <code>data/</code> 目录。</p>
            </article>
            <article className="step-card">
              <span>2</span>
              <h3>配置模型服务</h3>
              <p>在 Provider 页填写 OpenAI-compatible 地址与密钥，Embedding 与本地语音可按需安装。</p>
            </article>
            <article className="step-card">
              <span>3</span>
              <h3>启动并对话</h3>
              <p>运行 <code>main.py</code> 后访问 <code>http://127.0.0.1:17000/static/index.html</code>，进入对话或先导入知识文档。</p>
            </article>
          </div>
        </div>
      </section>

      <section id="comparison" className="comparison-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">专业定位</h2>
            <p className="section-subtitle">为知识密集型、高合规要求场景设计，而非通用聊天</p>
          </div>

          <div className="comparison-wrapper">
            <div className="comparison-col">
              <h3>通用 IM 机器人</h3>
              <ul className="comparison-list">
                <li className="cross">单 Agent 架构</li>
                <li className="cross">简单向量检索</li>
                <li className="cross">不支持语音克隆</li>
                <li className="cross">依赖云端 API</li>
                <li className="cross">无结构化查询防护</li>
                <li className="cross">适用于日常聊天娱乐</li>
              </ul>
            </div>

            <div className="comparison-col">
              <h3>YUMENO</h3>
              <ul className="comparison-list">
                <li className="check">Supervisor + 6 Worker</li>
                <li className="check">自适应纠错 + 评测数据集</li>
                <li className="check">本地 GPT-SoVITS 工作流</li>
                <li className="check">完全本地化（Ollama）</li>
                <li className="check">只读 SQL 沙箱 + 584 项测试</li>
                <li className="check">企业知识库、合规问答</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="https://github.com/TKGEKKOU/yumeno/releases">下载</a>
              <a href="https://github.com/TKGEKKOU/yumeno/blob/main/README.md">文档</a>
              <a href="https://github.com/TKGEKKOU/yumeno/issues">反馈</a>
            </div>
            <p className="copyright">© 2026 YUMENO Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
