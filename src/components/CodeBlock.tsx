import { useState, type ReactNode } from 'react';
import { codeHref, type Guide } from '../model';
import { Icon } from './Icons';

const keywords = new Set(['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'import', 'from', 'as', 'with', 'lambda', 'yield', 'try', 'except', 'finally', 'raise', 'pass', 'break', 'continue', 'global', 'nonlocal', 'assert', 'del']);
const builtins = new Set(['list', 'dict', 'set', 'tuple', 'int', 'str', 'bool', 'float', 'range', 'len', 'enumerate', 'max', 'min', 'sum', 'sorted', 'abs', 'print', 'ord', 'chr', 'zip', 'map', 'filter', 'any', 'all', 'Counter', 'defaultdict', 'deque', 'TreeNode', 'ListNode', 'heappush', 'heappop']);
const pattern = /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(?:def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|with|lambda|yield|try|except|finally|raise|pass|break|continue|global|nonlocal|assert|del)\b|\b(?:list|dict|set|tuple|int|str|bool|float|range|len|enumerate|max|min|sum|sorted|abs|print|ord|chr|zip|map|filter|any|all|Counter|defaultdict|deque|TreeNode|ListNode|heappush|heappop)\b|\b\d+(?:\.\d+)?\b|([A-Za-z_]\w*)|(\s+)|([^\s\w])/g;

function highlight(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(line))) {
    if (match.index > cursor) nodes.push(line.slice(cursor, match.index));
    const value = match[0];
    let className = '';
    if (match[1]) className = 'token-comment';
    else if (match[2]) className = 'token-string';
    else if (keywords.has(value)) className = 'token-keyword';
    else if (builtins.has(value)) className = 'token-builtin';
    else if (/^\d/.test(value)) className = 'token-number';
    else if (match[3]) className = 'token-name';
    else if (match[4]) className = 'token-operator';
    nodes.push(<span className={className} key={`${match.index}-${value}`}>{value}</span>);
    cursor = match.index + value.length;
  }
  if (cursor < line.length) nodes.push(line.slice(cursor));
  return nodes;
}

async function copyText(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('copy failed');
}

export function CodeBlock({ guide }: { guide: Guide }) {
  const lines = guide.code.split('\n');
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const selectKey = (index: number) => {
    const key = guide.keyLines[index];
    setActiveKey(index);
    document.getElementById(`code-line-${key.start}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  };

  const copy = async () => {
    try {
      await copyText(guide.code);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2200);
    } catch {
      setCopyState('error');
    }
  };

  return (
    <div className="code-block">
      <div className="code-toolbar"><div><span className="language-dot" />Python3 <small>{guide.displayLanguage === 'Python3' && guide.adapted ? '教学版' : '实际提交'}</small></div><div><a href={codeHref(guide)} download><Icon name="download" size={16} />下载 .py</a><button type="button" onClick={copy}><Icon name={copyState === 'copied' ? 'check' : 'copy'} size={16} />{copyState === 'copied' ? '已复制' : copyState === 'error' ? '复制失败，请选择代码' : '复制完整代码'}</button></div></div>
      <div className="keyline-nav" aria-label="关键代码行"><span>定位关键行</span>{guide.keyLines.map((key, index) => <button type="button" key={`${key.start}-${key.end}-${index}`} className={activeKey === index ? 'is-active' : ''} aria-pressed={activeKey === index} aria-controls="python-code" onClick={() => selectKey(index)}>L{key.start}{key.end !== key.start ? `–${key.end}` : ''}</button>)}</div>
      <div className="code-scroll" id="python-code" tabIndex={0} role="region" aria-label="带行号的 Python3 代码"><pre>{lines.map((line, index) => {
        const lineNumber = index + 1;
        const inKey = guide.keyLines.some((key) => lineNumber >= key.start && lineNumber <= key.end);
        const selected = guide.keyLines[activeKey ?? -1];
        const isSelected = selected && lineNumber >= selected.start && lineNumber <= selected.end;
        return <div id={`code-line-${lineNumber}`} className={`code-line ${inKey ? 'is-keyline' : ''} ${isSelected ? 'is-selected' : ''}`} key={lineNumber}><span className="line-number" aria-hidden="true">{lineNumber}</span><code>{highlight(line) || ' '}</code></div>;
      })}</pre></div>
      <div className="code-footnote"><span>行号与展示代码一致 · 不会在浏览器执行</span><span>{lines.length} 行</span></div>
      <span className="sr-only" role="status">{copyState === 'copied' ? '完整 Python3 代码已复制到剪贴板。' : ''}</span>
    </div>
  );
}
