import { useEffect, useState } from 'react';
import { guideById, problemHref } from './model';
import { Icon } from './components/Icons';

function readProblemId() {
  const value = new URLSearchParams(window.location.search).get('p');
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) ? id : NaN;
}

export function useRoute() {
  const [id, setId] = useState<number | null>(readProblemId);
  useEffect(() => {
    const update = () => setId(readProblemId());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return id;
}

export function usePageTitle(id: number | null) {
  useEffect(() => {
    const guide = id == null ? null : guideById.get(id);
    document.title = guide ? `${guide.id}. ${guide.title} · 算法图解研究` : '算法图解研究 · LeetCode Hot 100';
    if (id != null) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);
}

export function NotFound({ id }: { id: number }) {
  return (
    <section className="not-found page-width">
      <span className="eyebrow">404 / MISSING NOTE</span>
      <h1>这本笔记还没有写进来。</h1>
      <p>链接中的题目编号 {Number.isFinite(id) ? id : '无效'} 不在当前 88 题索引中。</p>
      <a className="text-link" href={problemHref(1)}>从第 1 题开始阅读 <Icon name="arrow" /></a>
    </section>
  );
}
