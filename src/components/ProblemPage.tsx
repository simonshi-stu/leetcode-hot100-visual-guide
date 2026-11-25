import { useEffect, useState } from 'react';
import { codeHref, formatSubmittedAt, guides, problemHref, type Guide } from '../model';
import { CodeBlock } from './CodeBlock';
import { Icon } from './Icons';
import { Visualizer } from './Visualizer';

const toc = [
  { id: 'overview', label: '问题与样例' },
  { id: 'breakdown', label: '思路拆解' },
  { id: 'visual', label: '逐帧图解' },
  { id: 'code', label: '代码与机制' },
  { id: 'complexity', label: '复杂度' },
  { id: 'challenge', label: '进阶挑战' },
  { id: 'similar', label: '同类题目' },
];

function SectionTitle({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description?: string }) {
  return <div className="problem-section-title"><span>{index}</span><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div></div>;
}

export function ProblemPage({ guide, completed, onToggleCompleted, markRead }: {
  guide: Guide;
  completed: boolean;
  onToggleCompleted: (id: number) => void;
  markRead: (id: number) => void;
}) {
  const [activeSection, setActiveSection] = useState('overview');
  const index = guides.findIndex((item) => item.id === guide.id);
  const previous = guides[index - 1];
  const next = guides[index + 1];

  useEffect(() => { markRead(guide.id); }, [guide.id, markRead]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-15% 0px -68% 0px', threshold: 0 });
    toc.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [guide.id]);

  return (
    <article className="problem-page">
      <header className="problem-hero page-width">
        <div className="problem-breadcrumb"><a href="./">题目索引</a><Icon name="chevron" size={13} /><span>{guide.category}</span><Icon name="chevron" size={13} /><span>LC {guide.id}</span></div>
        <div className="problem-hero-grid">
          <div><span className="eyebrow">{guide.category} / {guide.familyZh} / LC {guide.id}</span><h1>{guide.title}</h1><p className="english-title">{guide.titleEn}</p></div>
          <div className="problem-hero-actions"><span className={`difficulty difficulty-${guide.difficulty.toLowerCase()}`}><i />{guide.difficultyZh} · {guide.difficulty}</span><a className="original-link" href={guide.url} target="_blank" rel="noreferrer">查看原题 <Icon name="external" size={16} /></a><button className={`complete-button ${completed ? 'is-complete' : ''}`} type="button" onClick={() => onToggleCompleted(guide.id)} aria-pressed={completed}><Icon name="check" size={18} />{completed ? '已完成 · 点击撤销' : '标记为已完成'}</button></div>
        </div>
        <div className="problem-meta-line"><span>Python3</span><span>{guide.viz.frames.length} 个状态帧</span><span>阅读约 12 分钟</span><span>{completed ? '本机已完成' : '已加入本机阅读记录'}</span></div>
      </header>

      <div className="problem-layout page-width">
        <div className="problem-content">
          <section id="overview" className="problem-section">
            <SectionTitle index="01" eyebrow="PROBLEM / 问题" title="先把问题说清楚" />
            <p className="problem-summary">{guide.summary}</p>
            <p className="summary-disclaimer">本节为独立教学摘要，仅保留输入、输出、样例与约束。完整题面请查看上方原题链接。</p>
            <dl className="io-grid"><div><dt>输入 / INPUT</dt><dd>{guide.input}</dd></div><div><dt>输出 / OUTPUT</dt><dd>{guide.output}</dd></div></dl>
            <div className="examples-block"><h3>示例</h3>{guide.examples.map((example, index) => <div className="example-row" key={index}><span className="example-number">{String(index + 1).padStart(2, '0')}</span><div><span>输入</span><code>{example.input}</code></div><div><span>输出</span><code>{example.output}</code></div>{example.explanation && <p>{example.explanation}</p>}</div>)}</div>
            <div className="constraints-block"><h3>约束</h3><ul>{guide.constraints.map((constraint, index) => <li key={index}><code>{constraint}</code></li>)}</ul></div>
          </section>

          <section id="breakdown" className="problem-section">
            <SectionTitle index="02" eyebrow="BREAKDOWN / 拆解" title="答案是怎样长出来的" description="先建立观察，再检查机制。每一步都要能回答：为什么不会漏解，为什么会结束。" />
            <blockquote className="core-statement"><span>核心动作</span><p>{guide.core}</p></blockquote>
            <div className="walkthrough-block"><h3>沿着样例走一遍</h3>{guide.walkthrough.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
            <div className="mechanism-grid"><div><span className="eyebrow">OBSERVATION</span><h3>关键观察</h3><p>{guide.observation}</p></div><div><span className="eyebrow">INVARIANT</span><h3>不变量</h3><p>{guide.invariant}</p></div><div><span className="eyebrow">TERMINATION</span><h3>终止条件</h3><p>{guide.termination}</p></div><div><span className="eyebrow">NAIVE APPROACH</span><h3>朴素做法</h3><p>{guide.naive}</p></div></div>
            <div className="pitfalls-block"><h3>常见误区</h3><ol>{guide.pitfalls.map((pitfall, pitfallIndex) => <li key={pitfallIndex}><span>{String(pitfallIndex + 1).padStart(2, '0')}</span><p>{pitfall}</p></li>)}</ol></div>
            <div className="counterexample-block"><span className="eyebrow">COUNTEREXAMPLE / 反例检验</span>{guide.counterexample.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
          </section>

          <section id="visual" className="problem-section">
            <SectionTitle index="03" eyebrow="VISUALIZATION / 图解" title="让状态一帧一帧出现" description="点击下一步观察局部变化，也可以连续播放。键盘焦点位于图解内时，使用方向键、空格与 R 控制。" />
            <Visualizer guide={guide} />
          </section>

          <section id="code" className="problem-section">
            <SectionTitle index="04" eyebrow="ACTUAL CODE / 代码" title="把图映射到真实代码" />
            <div className="mechanism-copy"><h3>这份代码实际怎样运行</h3><p>{guide.mechanism}</p></div>
            {guide.adapted && <aside className="adaptation-note"><span className="eyebrow">ADAPTATION NOTE / 改编说明</span><h3>Python3 教学版</h3><p>{guide.adaptation}</p><p>历史语言：{guide.historicalLanguage}；展示语言：{guide.displayLanguage}。复制与下载得到的是同一份展示代码。</p></aside>}
            <CodeBlock guide={guide} />
            <div className="provenance"><h3>提交来源与完整性</h3><dl><div><dt>提交时间（UTC+8）</dt><dd>{formatSubmittedAt(guide.submittedAt)}</dd></div><div><dt>源文件</dt><dd><a href={codeHref(guide)} download>{guide.codeFile}</a></dd></div><div><dt>原始 SHA-256</dt><dd><code>{guide.originalHash}</code></dd></div><div><dt>展示 SHA-256</dt><dd><code>{guide.displayHash}</code></dd></div></dl><p>哈希用于核对代码是否逐字一致。页面只展示代码，不会执行输入代码。</p></div>
          </section>

          <section id="complexity" className="problem-section">
            <SectionTitle index="05" eyebrow="COMPLEXITY / 复杂度" title="速度与空间，分别花在哪里" />
            <div className="complexity-grid"><div><span>TIME / 时间</span><strong>{guide.time}</strong><p>{guide.timeNote}</p></div><div><span>SPACE / 空间</span><strong>{guide.space}</strong><p>{guide.spaceNote}</p></div></div>
            <div className="naive-comparison"><span className="eyebrow">WHY NOT BRUTE FORCE?</span><p>{guide.naive}</p></div>
          </section>

          <section id="challenge" className="problem-section">
            <SectionTitle index="06" eyebrow="CHALLENGE / 挑战" title="合上答案，再往前一步" />
            <details className="challenge-reveal"><summary><span><small>独立推导</small>{guide.challenge.question}</span><i>展开答案 <Icon name="chevron" size={18} /></i></summary><div className="challenge-answer"><div><span className="eyebrow">HINT / 提示</span><p>{guide.challenge.hint}</p></div><div><span className="eyebrow">ANSWER / 参考</span><p>{guide.challenge.answer}</p></div></div></details>
          </section>

          <section id="similar" className="problem-section">
            <SectionTitle index="07" eyebrow="CONNECTIONS / 延伸" title="把同一招放到下一道题" description="本站题目直接进入图解；计划外题目前往 LeetCode 中国。" />
            <div className="similar-list">{guide.similar.map((item) => <article key={`${item.slug}-${item.role}`}><div><span className="eyebrow">{item.role}</span><h3>{item.title}</h3><p>{item.reason}</p></div><div className="similar-links">{item.id != null ? <a href={problemHref(item.id)}>本站图解 <Icon name="arrow" size={16} /></a> : <span className="external-only">计划外题目</span>}<a href={item.externalUrl} target="_blank" rel="noreferrer">原题 <Icon name="external" size={15} /></a></div></article>)}</div>
          </section>

          <nav className="problem-pagination" aria-label="前后题目">{previous ? <a href={problemHref(previous.id)}><small>上一题 / {previous.category}</small><strong><Icon name="arrow" size={20} />{previous.id}. {previous.title}</strong></a> : <span />}{next ? <a className="next" href={problemHref(next.id)}><small>下一题 / {next.category}</small><strong>{next.id}. {next.title}<Icon name="arrow" size={20} /></strong></a> : <a className="next" href="./"><small>已到索引末尾</small><strong>返回全部题目<Icon name="arrow" size={20} /></strong></a>}</nav>
        </div>
        <aside className="toc-aside"><div className="toc-sticky"><span className="eyebrow">ON THIS PAGE</span><nav aria-label="页内目录">{toc.map((item, itemIndex) => <a href={`#${item.id}`} className={activeSection === item.id ? 'is-active' : ''} aria-current={activeSection === item.id ? 'location' : undefined} key={item.id}><span>{String(itemIndex + 1).padStart(2, '0')}</span>{item.label}</a>)}</nav><div className="toc-progress"><span>本机进度</span><button type="button" className={completed ? 'is-complete' : ''} onClick={() => onToggleCompleted(guide.id)} aria-pressed={completed}><Icon name="check" size={15} />{completed ? '已完成' : '标记完成'}</button></div></div></aside>
      </div>
    </article>
  );
}
