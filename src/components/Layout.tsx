import type { ReactNode } from 'react';
import { guides } from '../model';
import { Icon } from './Icons';

interface HeaderProps {
  problemMode?: boolean;
  completedCount: number;
  focus: boolean;
  onToggleFocus: () => void;
}

export function Header({ problemMode, completedCount, focus, onToggleFocus }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="./" aria-label="算法图解研究首页">
          <span className="brand-mark" aria-hidden="true">A<span>↗</span></span>
          <span className="brand-copy"><strong>算法图解研究</strong><small>ALGORITHM FIELD NOTES</small></span>
        </a>
        <nav className="main-nav" aria-label="主导航">
          <a href="./" aria-current={!problemMode ? 'page' : undefined}>题目索引 <span>88</span></a>
          <a href="./#methods">方法图谱</a>
          <a href="./#about">研究说明</a>
        </nav>
        <div className="header-actions">
          <span className="completed-counter" title="本机已完成题数"><Icon name="check" size={15} /> {completedCount}/88</span>
          {problemMode && <button className="focus-button" type="button" onClick={onToggleFocus} aria-pressed={focus}><Icon name="focus" size={17} /><span>{focus ? '退出聚焦' : '聚焦阅读'}</span></button>}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><a className="brand footer-brand" href="./"><span className="brand-mark" aria-hidden="true">A<span>↗</span></span><span className="brand-copy"><strong>算法图解研究</strong><small>ALGORITHM FIELD NOTES</small></span></a><p>把 88 道 Hot 100 题拆成可观察、可播放、可验证的学习笔记。</p></div>
        <div><span className="eyebrow">INDEX / 索引</span><a href="./">全部题目</a><a href="./#methods">方法图谱</a><a href="./#about">内容与来源</a></div>
        <div><span className="eyebrow">DATA / 数据</span><p>{guides.length} 道题 · 18 类图解</p><p>Python3 教学代码</p><p>学习记录仅保存在本机</p></div>
      </div>
      <div className="footer-bottom"><span>独立教学整理，非 LeetCode 官方产品。</span><span>MADE FOR SLOW, CAREFUL READING.</span></div>
    </footer>
  );
}

export function PageShell({ children, problemMode = false, completedCount, focus, onToggleFocus, readingProgress = 0 }: {
  children: ReactNode;
  problemMode?: boolean;
  completedCount: number;
  focus: boolean;
  onToggleFocus: () => void;
  readingProgress?: number;
}) {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到正文</a>
      {problemMode && <div className="reading-progress" aria-hidden="true"><span style={{ width: `${readingProgress}%` }} /></div>}
      <Header problemMode={problemMode} completedCount={completedCount} focus={focus} onToggleFocus={onToggleFocus} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
