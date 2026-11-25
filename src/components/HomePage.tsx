import { useEffect, useMemo, useState } from 'react';
import { categories, difficultyCounts, guides, problemHref, searchText, sources, type Difficulty, type Guide } from '../model';
import { Icon } from '../components/Icons';

const difficultyLabels: Record<Difficulty, string> = { Easy: '简单', Medium: '中等', Hard: '困难' };
const familyDescriptions: Record<string, string> = {
  hash: '用空间换取一次查找', twoPointer: '两个边界协同排除', slidingWindow: '维护连续区间', prefix: '把区间转成两点之差',
  windowHeap: '单调结构维护窗口极值', windowCounts: '计数驱动窗口收缩', array: '原地交换与索引归位', linked: '用引用改写连接关系',
  tree: '递归分解左右子树', grid: '四方向遍历连通块', graph: '节点、边与入度消去', backtrack: '选择、深入、撤销',
  binary: '每次排除一半候选', stack: '后进先出保存待办', heap: '快速访问当前极值', greedy: '保留当前可达的最好选择',
  dp: '记录子问题答案', trick: '异或、投票与双指针',
};

function initialFilters() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('cat');
  const difficulty = params.get('diff');
  return {
    query: params.get('q') ?? '',
    category: category && categories.includes(category) ? category : '全部',
    difficulty: difficulty && difficulty in difficultyLabels ? difficulty as Difficulty : '全部' as Difficulty | '全部',
  };
}

function ProblemRow({ guide, index, read, completed }: { guide: Guide; index: number; read: boolean; completed: boolean }) {
  return (
    <a className="problem-row" href={problemHref(guide.id)}>
      <span className="problem-number">{String(index + 1).padStart(2, '0')}<small>LC {guide.id}</small></span>
      <span className="problem-name"><strong>{guide.title}</strong><small>{guide.titleEn}</small></span>
      <span className="problem-method">{guide.familyZh}</span>
      <span className={`difficulty difficulty-${guide.difficulty.toLowerCase()}`}><i />{guide.difficultyZh}</span>
      <span className="row-status" aria-label={completed ? '已完成' : read ? '已读' : '未读'}>{completed ? <Icon name="check" size={16} /> : <span className={read ? 'status-read' : ''} />}</span>
      <span className="row-arrow"><Icon name="arrow" /></span>
    </a>
  );
}

export function HomePage({ read, completed }: { read: number[]; completed: number[] }) {
  const [filters, setFilters] = useState(initialFilters);
  const { query, category, difficulty } = filters;

  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (key: string, value: string) => value && value !== '全部' ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    set('q', query.trim()); set('cat', category); set('diff', difficulty);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [query, category, difficulty]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return guides.filter((guide) => {
      const matchesQuery = !needle || searchText(guide).includes(needle);
      return matchesQuery && (category === '全部' || guide.category === category) && (difficulty === '全部' || guide.difficulty === difficulty);
    });
  }, [query, category, difficulty]);

  const visibleCategories = categories.filter((item) => filtered.some((guide) => guide.category === item));
  const reset = () => setFilters({ query: '', category: '全部', difficulty: '全部' });
  const completedSet = new Set(completed);
  const readSet = new Set(read);
  const familyMap = [...new Set(guides.map((guide) => guide.family))].map((family) => {
    const items = guides.filter((guide) => guide.family === family);
    return { family, title: items[0].familyZh, items };
  });

  return (
    <>
      <section className="hero page-width">
        <div className="hero-copy">
          <span className="eyebrow">LEETCODE HOT 100 / VISUAL RESEARCH</span>
          <h1>把算法，<br /><span>看得见。</span></h1>
          <p className="hero-lead">不是背答案。是看清每一次指针移动、每一层递归返回，以及每个状态为什么成立。</p>
          <p className="hero-note">为第一次认真学算法的你，写下 88 篇可以播放的中文图解笔记。</p>
          <a className="primary-link" href="#index">打开题目索引 <Icon name="arrow" /></a>
        </div>
        <aside className="hero-report" aria-label="研究概况">
          <div className="report-heading"><span className="eyebrow">FIELD REPORT / 001</span><span>2026</span></div>
          <div className="hero-stat"><strong>{guides.length}</strong><span>道完整讲解<small>EXACTLY 88 PROBLEMS</small></span></div>
          <div className="report-rule" />
          <dl className="mini-stats">
            <div><dt>主题分类</dt><dd>{categories.length}</dd></div>
            <div><dt>交互图解</dt><dd>{familyMap.length}</dd></div>
            <div><dt>简单 / 中等 / 困难</dt><dd>{difficultyCounts.Easy} / {difficultyCounts.Medium} / {difficultyCounts.Hard}</dd></div>
            <div><dt>本机已完成</dt><dd>{completed.length} <small>/ 88</small></dd></div>
          </dl>
          <p className="report-caption"><span className="blue-dot" />内容来自历史 Python 提交与独立教学整理。200、207 两题明确标注 Python3 教学版。</p>
        </aside>
      </section>

      <div className="ticker" aria-hidden="true"><div>HASH · TWO POINTERS · TREES · GRAPHS · DYNAMIC PROGRAMMING · 88 PROBLEMS · 18 VISUAL FAMILIES · READ SLOWLY, SEE CLEARLY · </div></div>

      <section className="index-section page-width" id="index">
        <div className="section-heading">
          <div><span className="eyebrow">01 / PROBLEM INDEX</span><h2>题目索引</h2></div>
          <p>按原始 Hot 100 数据集顺序排列。搜索题号、中文名、英文名或讲解关键词。</p>
        </div>
        <div className="filter-panel">
          <label className="search-field"><span>检索题目</span><div><Icon name="search" /><input type="search" value={query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="例如：1、两数之和、Two Sum、前缀和" autoComplete="off" />{query && <button type="button" onClick={() => setFilters({ ...filters, query: '' })} aria-label="清空搜索">×</button>}</div></label>
          <label className="select-field"><span>主题分类</span><select value={category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}><option>全部</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <fieldset className="difficulty-filter"><legend>难度</legend><div>{(['全部', 'Easy', 'Medium', 'Hard'] as const).map((item) => <button key={item} type="button" aria-pressed={difficulty === item} onClick={() => setFilters({ ...filters, difficulty: item })}>{item === '全部' ? '全部' : difficultyLabels[item]}</button>)}</div></fieldset>
        </div>
        <div className="index-meta"><span>显示 <strong>{filtered.length}</strong> / {guides.length} 题</span><span>顺序保留 · 状态保存在本机</span></div>
        <nav className="category-nav" aria-label="分类快速筛选">{categories.map((item, index) => <a key={item} href="#index" onClick={() => setFilters({ ...filters, category: item })}><small>{String(index + 1).padStart(2, '0')}</small>{item}<sup>{guides.filter((guide) => guide.category === item).length}</sup></a>)}</nav>
        {filtered.length === 0 ? (
          <div className="empty-state"><span className="eyebrow">NO MATCHES</span><h3>没有找到对应题目。</h3><p>试试更短的关键词，或清除分类与难度条件。</p><button className="secondary-button" type="button" onClick={reset}>重置全部筛选</button></div>
        ) : visibleCategories.map((item) => {
          const items = filtered.filter((guide) => guide.category === item);
          const originalIndex = categories.indexOf(item);
          return (
            <section className="category-section" id={`category-${originalIndex}`} key={item}>
              <div className="category-heading"><span>{String(originalIndex + 1).padStart(2, '0')}</span><h3>{item}</h3><small>{items.length} 题</small></div>
              <div className="problem-list">{items.map((guide) => <ProblemRow key={guide.id} guide={guide} index={guides.indexOf(guide)} read={readSet.has(guide.id)} completed={completedSet.has(guide.id)} />)}</div>
            </section>
          );
        })}
      </section>

      <section className="method-section" id="methods">
        <div className="page-width">
          <div className="section-heading light"><div><span className="eyebrow">02 / METHOD ATLAS</span><h2>方法图谱</h2></div><p>18 类状态结构，对应内容中实际出现的全部图解。点击题号进入逐帧讲解。</p></div>
          <div className="method-grid">{familyMap.map(({ family, title, items }, index) => <article className="method-item" key={family}><div className="method-index">{String(index + 1).padStart(2, '0')}</div><h3>{title}</h3><p>{familyDescriptions[family]}</p><div className="method-links">{items.slice(0, 6).map((guide) => <a key={guide.id} href={problemHref(guide.id)}>{guide.id}</a>)}{items.length > 6 && <span>+{items.length - 6}</span>}</div></article>)}</div>
        </div>
      </section>

      <section className="about-section page-width" id="about">
        <div className="section-heading"><div><span className="eyebrow">03 / RESEARCH NOTES</span><h2>怎样使用这份研究</h2></div><p>先预测，再播放，最后回到代码。每一步都给你留下可以检查的证据。</p></div>
        <div className="about-grid">
          <ol className="reading-steps"><li><span>01</span><div><h3>先读问题，不看代码</h3><p>用自己的话说清输入、输出和一个样例，再对照本题讲解。</p></div></li><li><span>02</span><div><h3>逐帧观察状态</h3><p>使用上一步、下一步或方向键。关注指针、容器和当前变量怎样变化。</p></div></li><li><span>03</span><div><h3>点击关键代码行</h3><p>把图中的动作映射到真实 Python3 代码，检查不变量与终止条件。</p></div></li><li><span>04</span><div><h3>做完挑战再标记</h3><p>展开挑战提示，独立推导后核对答案，再把这题标为已完成。</p></div></li></ol>
          <aside className="source-note"><span className="eyebrow">CONTENT PROTOCOL</span><h3>讲解与代码分开看</h3><p>代码来自 88 份历史提交，保留原始 SHA-256 与提交时间。教学文本说明实际执行的机制，不把注释里的旧方案当成运行代码。</p><p>题干只保留自写摘要、样例和约束，不复制完整题面。链接可回到 LeetCode 中国查看原题。</p><a className="text-link" href="https://leetcode.cn/studyplan/top-100-liked/" target="_blank" rel="noreferrer">查看 Hot 100 学习计划 <Icon name="external" size={16} /></a></aside>
        </div>
        <details className="sources-details"><summary>内容来源与许可记录 <span>{sources.length} 条</span></summary><div className="sources-list">{sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.url.replace('https://', '')}</span><small>{source.license}{source.checked ? ` · ${source.checked}` : ''}</small><Icon name="external" size={14} /></a>)}</div></details>
      </section>
    </>
  );
}
