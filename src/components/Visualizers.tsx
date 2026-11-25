import type { CSSProperties, ReactNode } from 'react';
import type { VizState } from '../model';

type RendererProps = { state: VizState; data: VizState; id: number };

const list = (value: unknown): any[] => Array.isArray(value) ? value : [];
const text = (value: unknown) => value == null ? '∅' : typeof value === 'object' ? JSON.stringify(value) : String(value);
const flatValues = (value: unknown): any[] => {
  const items = list(value);
  return items.length === 1 && Array.isArray(items[0]) ? items[0] : items;
};
const svgProps = (label: string) => ({ role: 'img' as const, 'aria-label': label });

function ArrayStrip({ values, active = [], window, excluded = [], markers = [] }: {
  values: any[]; active?: (number | null | undefined)[]; window?: [number, number]; excluded?: number[]; markers?: string[];
}) {
  return (
    <div className="array-strip" style={{ '--cell-count': Math.max(values.length, 1) } as CSSProperties}>
      {values.map((value, index) => {
        const inWindow = window ? index >= window[0] && index <= window[1] : false;
        return <div className={`array-cell ${active.includes(index) ? 'is-active' : ''} ${inWindow ? 'in-window' : ''} ${excluded.includes(index) ? 'is-excluded' : ''}`} key={index}><small>{index}</small><strong>{text(value)}</strong></div>;
      })}
      {markers.length > 0 && <div className="array-markers">{markers.map((marker, index) => <span key={`${marker}-${index}`}>{marker}</span>)}</div>}
    </div>
  );
}

function TokenRow({ items, active = [], tone = 'default' }: { items: any[]; active?: number[]; tone?: string }) {
  return <div className={`token-row tone-${tone}`}>{items.map((item, index) => <span className={active.includes(index) ? 'is-active' : ''} key={index}>{Array.isArray(item) ? item.map(text).join(' → ') : text(item)}</span>)}</div>;
}

function Variables({ state }: { state: VizState }) {
  const excluded = new Set(['values', 'secondValues', 'note', 'table', 'grid', 'board', 'next', 'pointers', 'prefix', 'counts', 'queue', 'stack', 'heap', 'heapEntries', 'leftHeap', 'rightHeap', 'stream', 'path', 'chosen', 'removed', 'active', 'visited', 'water', 'bits']);
  const entries = Object.entries(state).filter(([key, value]) => !excluded.has(key) && value !== undefined);
  if (!entries.length) return null;
  return <dl className="variable-list">{entries.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{text(value)}</dd></div>)}</dl>;
}

function HashViz({ state, data }: RendererProps) {
  const values = flatValues(state.values ?? data.values);
  const index = Number(state.index ?? -1);
  const current = values[index];
  const target = Number(data.target ?? 0);
  const need = target - Number(current);
  return <div className="viz-stack"><ArrayStrip values={values} active={[index]} /><div className="viz-label"><span>目标 target = {target}</span><span>{index >= 0 ? `need = ${target} − ${current} = ${need}` : '尚未读取元素'}</span></div><div className="hash-table"><div className="table-title"><span>HASH TABLE</span><small>key → value</small></div>{list(state.table).length ? list(state.table).map(([key, value], row) => <div className={String(key) === String(need) && index >= 0 ? 'hash-hit' : ''} key={row}><code>{text(key)}</code><span>→</span><strong>{text(value)}</strong>{String(key) === String(need) && index >= 0 && <small>命中</small>}</div>) : <p className="empty-inline">表为空</p>}</div></div>;
}

function TwoPointerViz({ state, id }: RendererProps) {
  const values = flatValues(state.values).map(Number);
  const left = Number(state.left ?? 0);
  const right = Number(state.right ?? values.length - 1);
  if (id === 42 || state.leftLevel != null) {
    const width = Math.max(480, values.length * 58 + 80);
    const max = Math.max(...values, Number(state.leftLevel ?? 0), Number(state.rightLevel ?? 0), 1);
    const scale = 150 / max;
    const waterTop = 215 - Math.min(Number(state.leftLevel ?? 0), Number(state.rightLevel ?? 0)) * scale;
    return <svg className="bar-svg" viewBox={`0 0 ${width} 270`} {...svgProps('左右指针、历史最高柱与当前水位')}><defs><pattern id="water-pattern" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 8 0" stroke="#2d35ee" strokeWidth="1" opacity=".3" /></pattern></defs><line x1="35" x2={width - 25} y1="215" y2="215" stroke="#141716" strokeWidth="2" />{values.map((value, index) => { const x = 48 + index * 58; const height = value * scale; const active = index === left || index === right; return <g key={index}><rect x={x} y={215 - height} width="34" height={height} fill={active ? '#2d35ee' : index < left || index > right ? '#c9c8be' : '#141716'} /><text x={x + 17} y="238" textAnchor="middle" className="svg-index">{index}</text><text x={x + 17} y={205 - height} textAnchor="middle" className="svg-value">{value}</text>{active && <text x={x + 17} y={205 - height - 20} textAnchor="middle" className="svg-pointer">{index === left ? 'L' : 'R'}</text>}</g>; })}{left < right && <rect x={48 + left * 58 + 34} y={waterTop} width={Math.max(0, (right - left) * 58 - 34)} height={215 - waterTop} fill="url(#water-pattern)" stroke="#2d35ee" />}<text x="48" y="25" className="svg-caption">leftLevel {text(state.leftLevel)} · rightLevel {text(state.rightLevel)} · water {text(state.water)}</text></svg>;
  }
  return <div className="viz-stack"><div className="pointer-legend"><span><i className="legend-left" />left = {left}</span><span><i className="legend-right" />right = {right}</span></div><ArrayStrip values={values} active={[left, right]} /><div className="range-line"><span style={{ left: `${(left / Math.max(values.length - 1, 1)) * 100}%` }}>L</span><span style={{ left: `${(right / Math.max(values.length - 1, 1)) * 100}%` }}>R</span></div></div>;
}

function WindowViz({ state, counts = false }: RendererProps & { counts?: boolean }) {
  const values = flatValues(state.values);
  const left = Number(state.left ?? 0);
  const right = Number(state.right ?? -1);
  const entries = list(state.counts);
  return <div className="viz-stack"><div className="pointer-legend"><span>left = {left}</span><span>{counts ? 'right' : 'right（开边界）'} = {right}</span><span>窗口长度 = {Math.max(0, right - left + (counts ? 1 : 0))}</span></div><ArrayStrip values={values} active={counts ? [right] : []} window={[left, right]} />{entries.length > 0 && <div className="count-grid">{entries.map(([key, value], index) => <div className={Number(value) > 0 ? 'is-active' : ''} key={index}><strong>{text(key)}</strong><span>{text(value)}</span></div>)}</div>}</div>;
}

function PrefixViz({ state }: RendererProps) {
  const values = flatValues(state.values);
  const entries = Object.entries(state.prefix ?? {});
  const index = Number(state.index ?? -1);
  return <div className="viz-stack"><ArrayStrip values={values} active={[index]} /><div className="prefix-chain">{entries.map(([key, value], position) => <span className={position === entries.length - 1 && index >= 0 ? 'is-active' : ''} key={key}><small>{key}</small><strong>{text(value)}</strong>{position < entries.length - 1 && <i>→</i>}</span>)}</div><p className="diagram-note">当前前缀位置与原始数组下标相差 1：P{index + 1} 由前 {index + 1} 个元素累加得到。</p></div>;
}

function QueueViz({ state, data, id, counts = false }: RendererProps & { counts?: boolean }) {
  const values = flatValues(state.values);
  const queue = list(state.queue).map(Number);
  if (counts) return <WindowViz state={state} data={data} id={id} counts />;
  return <div className="viz-stack"><ArrayStrip values={values} active={[state.index, state.right]} window={[state.left, state.right]} /><div className="queue-diagram"><span className="diagram-label">单调队列 / 存下标</span><div>{queue.map((index, position) => <span className={position === 0 ? 'queue-front is-active' : 'queue-front'} key={`${index}-${position}`}><small>[{index}]</small><strong>{text(values[index])}</strong>{position < queue.length - 1 && <i>→</i>}</span>)}{!queue.length && <em>队列为空</em>}</div></div></div>;
}

function ArrayViz({ state }: RendererProps) {
  const values = flatValues(state.values);
  return <div className="viz-stack"><ArrayStrip values={values} active={[state.index]} markers={list(state.markers).map(String)} /><div className="index-slots" aria-label="目标槽位">{values.map((_, index) => <span key={index}>槽 {index} ← 值 {index + 1}</span>)}</div></div>;
}

function LinkedViz({ state }: RendererProps) {
  const values = list(state.values);
  const pointers = state.pointers ?? {};
  const next = state.next ?? {};
  const cols = Math.min(6, Math.max(values.length, 1));
  const rows = Math.ceil(values.length / cols);
  const width = Math.max(620, cols * 140 + 60);
  const height = rows * 105 + 30;
  const pos = (index: number) => ({ x: 50 + (index % cols) * 140, y: 30 + Math.floor(index / cols) * 105 });
  const active = new Set(Object.values(pointers).filter((value): value is number => typeof value === 'number'));
  return <div className="viz-stack"><svg className="linked-svg" viewBox={`0 0 ${width} ${height}`} {...svgProps('链表节点身份、next 箭头与当前指针')}><defs><marker id="linked-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0 7 3 0 6Z" fill="#62645d" /></marker></defs>{values.map((_, index) => { const target = next[String(index)]; if (typeof target !== 'number') return null; const a = pos(index); const b = pos(target); const sameRow = a.y === b.y; return <path key={index} d={sameRow ? `M${a.x + 100} ${a.y + 25} H${b.x - 8}` : `M${a.x + 100} ${a.y + 25} C${a.x + 135} ${a.y + 25}, ${b.x - 35} ${b.y + 25}, ${b.x} ${b.y + 25}`} fill="none" stroke="#62645d" strokeWidth="1.7" markerEnd="url(#linked-arrow)" />; })}{values.map((value, index) => { const p = pos(index); const on = active.has(index); return <g key={index}><rect x={p.x} y={p.y} width="100" height="50" rx="2" fill={on ? '#2d35ee' : '#efeee5'} stroke={on ? '#2d35ee' : '#141716'} strokeWidth={on ? 2.5 : 1.5} /><text x={p.x + 12} y={p.y + 19} className="svg-index">ID {index}</text><text x={p.x + 50} y={p.y + 39} textAnchor="middle" className={`svg-node-value ${on ? 'inverse' : ''}`}>{text(value)}</text></g>; })}</svg><div className="pointer-chips">{Object.entries(pointers).map(([name, value]) => <span className={typeof value === 'number' ? 'is-active' : ''} key={name}><code>{name}</code><strong>{typeof value === 'number' ? `ID ${value} · 值 ${text(values[value])}` : 'null'}</strong></span>)}</div></div>;
}

function TreeViz({ state }: RendererProps) {
  const values = list(state.values);
  const active = list(state.active).map(String);
  const visited = list(state.visited).map(String);
  const nodes = values.map((value, index) => ({ value, index })).filter((node) => node.value != null);
  const depth = nodes.length ? Math.max(...nodes.map((node) => Math.floor(Math.log2(node.index + 1)))) : 0;
  const width = Math.max(620, 2 ** (depth + 1) * 70);
  const height = (depth + 1) * 105 + 30;
  const pos = (index: number) => { const level = Math.floor(Math.log2(index + 1)); const slot = index - (2 ** level - 1); return { x: ((slot + 0.5) / 2 ** level) * width, y: 35 + level * 105 }; };
  return <div className="viz-stack"><svg className="tree-svg" viewBox={`0 0 ${width} ${height}`} {...svgProps('二叉树节点、递归活动节点与已访问节点')}><defs><marker id="tree-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 6 3 0 6Z" fill="#62645d" /></marker></defs>{nodes.map(({ index }) => [index * 2 + 1, index * 2 + 2].filter((child) => values[child] != null).map((child) => { const a = pos(index); const b = pos(child); return <path key={`${index}-${child}`} d={`M${a.x} ${a.y + 27} L${b.x} ${b.y - 29}`} stroke="#62645d" strokeWidth="1.5" markerEnd="url(#tree-arrow)" />; }))}{nodes.map(({ value, index }) => { const p = pos(index); const on = active.includes(String(value)); const seen = visited.includes(String(value)); return <g key={index}><circle cx={p.x} cy={p.y} r="27" fill={on ? '#2d35ee' : seen ? '#d8d7ce' : '#efeee5'} stroke={on ? '#2d35ee' : '#141716'} strokeWidth={on ? 2.5 : 1.5} /><text x={p.x} y={p.y + 6} textAnchor="middle" className={`svg-node-value ${on ? 'inverse' : ''}`}>{text(value)}</text><text x={p.x + 34} y={p.y + 4} className="svg-index">[{index}]</text></g>; })}</svg><div className="tree-state-row"><div><span>active / 当前调用</span><TokenRow items={active} active={active.map((_, index) => index)} /></div><div><span>visited / 已处理</span><TokenRow items={visited} /></div>{list(state.queue).length > 0 && <div><span>queue / 队列</span><TokenRow items={list(state.queue)} /></div>}{list(state.path).length > 0 && <div><span>path / 路径</span><TokenRow items={list(state.path)} /></div>}{state.dp && <div><span>dp / 子问题答案</span><TokenRow items={Object.entries(state.dp).map(([key, value]) => [key, value])} /></div>}</div></div>;
}

function GridViz({ state }: RendererProps) {
  const grid = list(state.grid);
  const cols = Math.max(...grid.map((row) => list(row).length), 1);
  const cell = Math.min(74, 480 / Math.max(cols, 1));
  const width = cols * cell + 50;
  const height = grid.length * cell + 45;
  const active = list(state.active).map(Number);
  return <svg className="grid-svg" viewBox={`0 0 ${width} ${height}`} {...svgProps('岛屿网格、当前 DFS 格子与已访问陆地')}><defs><pattern id="grid-water" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 8 0" stroke="#c9c8be" strokeWidth="1" /></pattern></defs>{grid.map((row, r) => list(row).map((value, c) => { const on = active[0] === r && active[1] === c; const land = String(value) === '1'; return <g key={`${r}-${c}`}><rect x={30 + c * cell + 2} y={20 + r * cell + 2} width={cell - 4} height={cell - 4} fill={on ? '#2d35ee' : land ? '#141716' : 'url(#grid-water)'} stroke="#efeee5" strokeWidth="2" /><text x={30 + c * cell + cell / 2} y={20 + r * cell + cell / 2 + 5} textAnchor="middle" className={land || on ? 'svg-node-value inverse' : 'svg-index'}>{text(value)}</text></g>; }))}<text x="20" y="13" className="svg-caption">islands = {text(state.count)}</text></svg>;
}

function GraphViz({ state }: RendererProps) {
  const count = Number(state.nodes ?? 0);
  const edges = list(state.edges);
  const cols = count <= 4 ? count : Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const width = Math.max(480, cols * 120 + 60);
  const height = rows * 105 + 30;
  const pos = (node: number) => ({ x: 60 + (node % cols) * 120, y: 45 + Math.floor(node / cols) * 105 });
  const queue = list(state.queue).map(Number);
  const indegree = list(state.indegree).map(Number);
  return <div className="viz-stack"><svg className="graph-svg" viewBox={`0 0 ${width} ${height}`} {...svgProps('课程依赖有向图、当前节点、入度和可学习队列')}><defs><marker id="graph-arrow" markerWidth="8" markerHeight="8" refX="31" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#62645d" /></marker></defs>{edges.map(([dest, src], index) => { const a = pos(Number(src)); const b = pos(Number(dest)); return <path key={index} d={`M${a.x + 28} ${a.y} L${b.x - 33} ${b.y}`} fill="none" stroke="#62645d" strokeWidth="1.6" markerEnd="url(#graph-arrow)" />; })}{Array.from({ length: count }, (_, node) => { const p = pos(node); const on = Number(state.active) === node; const ready = queue.includes(node); return <g key={node}><circle cx={p.x} cy={p.y} r="28" fill={on ? '#2d35ee' : ready ? '#efeee5' : '#d8d7ce'} stroke={on || ready ? '#2d35ee' : '#141716'} strokeWidth={on || ready ? 2.5 : 1.5} /><text x={p.x} y={p.y + 6} textAnchor="middle" className={`svg-node-value ${on ? 'inverse' : ''}`}>{node}</text><text x={p.x} y={p.y + 45} textAnchor="middle" className="svg-index">入度 {indegree[node] ?? '—'}</text></g>; })}</svg><div className="queue-diagram"><span className="diagram-label">可学习队列</span><TokenRow items={queue} tone="blue" /></div></div>;
}

function BacktrackViz({ state }: RendererProps) {
  const board = list(state.board);
  const cursor = list(state.cursor).map(Number);
  return <div className="viz-stack"><ArrayStrip values={flatValues(state.values)} active={[state.active]} />{board.length > 0 && <div className="board-wrap"><div className="search-board" style={{ '--board-cols': Math.max(...board.map((row) => String(row).length)) } as CSSProperties}>{board.map((row, r) => [...String(row)].map((value, c) => <span className={`${cursor[0] === r && cursor[1] === c ? 'is-active' : ''} ${value !== '.' && value !== '#' ? 'has-value' : ''}`} key={`${r}-${c}`}>{value === '.' || value === '#' ? '' : value}</span>))}</div></div>}<div className="backtrack-state"><div><span>path / 已选路径</span><TokenRow items={list(state.path)} tone="blue" /></div><div><span>chosen / 本轮选择</span><TokenRow items={list(state.chosen)} tone="blue" /></div><div><span>removed / 撤销约束</span><TokenRow items={list(state.removed)} /></div></div></div>;
}

function BinaryViz({ state, data }: RendererProps) {
  const values = flatValues(state.values).map(Number);
  const second = list(state.secondValues).map(Number);
  const all = second.length ? values : values;
  const width = Math.max(500, all.length * 62 + 90);
  const drawRow = (items: number[], y: number, offset = 0) => <g>{items.map((value, index) => { const x = 45 + (index + offset) * 62; const excluded = list(state.excluded).includes(index + offset); const mid = Number(state.mid) === index + offset; return <g key={`${offset}-${index}`}><rect x={x} y={y} width="56" height="48" fill={mid ? '#2d35ee' : excluded ? '#d8d7ce' : '#efeee5'} stroke={mid ? '#2d35ee' : '#141716'} strokeWidth="1.4" /><text x={x + 28} y={y + 30} textAnchor="middle" className={`svg-node-value ${mid ? 'inverse' : ''}`}>{value}</text><text x={x + 28} y={y + 65} textAnchor="middle" className="svg-index">{index + offset}</text></g>; })}</g>;
  const split = list(state.partitionLines).map(Number);
  return <svg className="binary-svg" viewBox={`0 0 ${width} ${second.length ? 265 : 185}`} {...svgProps(second.length ? '两个有序数组的二分切分线' : '二分查找候选区间与中点')}><text x="45" y="20" className="svg-caption">{second.length ? `nums1 · phase=${text(state.phase)}` : `target=${text(state.target ?? data.target)} · 闭区间 [${text(state.left)}, ${text(state.right)}]`}</text>{drawRow(values, 42)}{second.length && <><text x="45" y="128" className="svg-caption">nums2</text>{drawRow(second, 145)}{split.map((position, index) => { const y = index === 0 ? 37 : 140; const x = 45 + position * 62; return <g key={index}><line x1={x} x2={x} y1={y} y2={y + 64} stroke="#2d35ee" strokeWidth="3" /><text x={x + 5} y={y - 7} className="svg-pointer">切分 {position}</text></g>; })}<text x="45" y="245" className="svg-caption">al={text(state.al)} · ar={text(state.ar)} · bl={text(state.bl)} · br={text(state.br)}</text></>}</svg>;
}

function StackViz({ state }: RendererProps) {
  const values = flatValues(state.values);
  const stack = list(state.stack);
  const pairs = list(state.pairs);
  return <div className="viz-stack"><ArrayStrip values={values} active={[state.index]} /><div className="stack-layout"><div className="stack-diagram"><span className="diagram-label">栈顶 ↑</span><div>{[...stack].reverse().map((value, reverseIndex) => { const index = stack.length - 1 - reverseIndex; return <span className={index === stack.length - 1 ? 'is-active' : ''} key={index}><small>[{index}]</small><strong>{text(value)}</strong></span>; })}{!stack.length && <em>空栈</em>}</div></div>{pairs.length > 0 && <div className="pair-list"><span className="diagram-label">已匹配下标对</span>{pairs.map(([a, b], index) => <span key={index}>{text(a)} <i>↔</i> {text(b)}</span>)}</div>}</div></div>;
}

function HeapTree({ values, label, signed = false }: { values: any[]; label: string; signed?: boolean }) {
  if (!values.length) return <div className="heap-tree empty"><span>{label}</span><em>空堆</em></div>;
  const depth = Math.floor(Math.log2(values.length));
  const width = Math.max(300, 2 ** (depth + 1) * 62);
  const height = (depth + 1) * 82 + 20;
  const pos = (index: number) => { const level = Math.floor(Math.log2(index + 1)); const slot = index - (2 ** level - 1); return { x: ((slot + 0.5) / 2 ** level) * width, y: 28 + level * 82 }; };
  return <svg className="heap-tree" viewBox={`0 0 ${width} ${height}`} {...svgProps(label)}><text x="8" y="14" className="svg-caption">{label}</text>{values.map((_, index) => [index * 2 + 1, index * 2 + 2].filter((child) => child < values.length).map((child) => { const a = pos(index); const b = pos(child); return <line key={`${index}-${child}`} x1={a.x} y1={a.y + 22} x2={b.x} y2={b.y - 22} stroke="#62645d" />; }))}{values.map((value, index) => { const p = pos(index); const display = signed ? -Number(value) : value; const entry = Array.isArray(value) ? value : null; return <g key={index}><rect x={p.x - 26} y={p.y - 22} width="52" height="44" rx="22" fill={index === 0 ? '#2d35ee' : '#efeee5'} stroke={index === 0 ? '#2d35ee' : '#141716'} strokeWidth="1.5" /><text x={p.x} y={p.y + 5} textAnchor="middle" className={`svg-node-value ${index === 0 ? 'inverse' : ''}`}>{entry ? `${text(entry[1])}×${text(entry[0])}` : text(display)}</text></g>; })}</svg>;
}

function HeapViz({ state }: RendererProps) {
  const counts = list(state.counts);
  const entries = list(state.heapEntries);
  const hasTwo = list(state.leftHeap).length > 0 || list(state.rightHeap).length > 0;
  return <div className="viz-stack"><ArrayStrip values={flatValues(state.values)} active={[state.index]} />{hasTwo ? <div className="dual-heap"><HeapTree values={list(state.leftHeap)} label="leftHeap · 逻辑最大值取负" signed /><HeapTree values={list(state.rightHeap)} label="rightHeap · 最小堆" /></div> : <HeapTree values={entries.length ? entries : list(state.heap)} label={entries.length ? '频率元组最小堆（值 × 次数）' : '堆数组的树形布局'} />}{counts.length > 0 && <div className="count-grid">{counts.map(([value, count], index) => <div key={index}><strong>{text(value)}</strong><span>×{text(count)}</span></div>)}</div>}{list(state.stream).length > 0 && <div className="stream-row"><span>已读入数据流</span><TokenRow items={list(state.stream)} /></div>}</div>;
}

function GreedyViz({ state }: RendererProps) {
  const values = flatValues(state.values);
  const index = Number(state.index ?? -1);
  const reach = Number(state.reach ?? 0);
  const best = Number(state.best ?? 0);
  const max = Math.max(reach, best, index, values.length, 1);
  return <div className="viz-stack"><ArrayStrip values={values} active={[index]} /><div className="greedy-metrics"><div><span>best / 当前保留值</span><strong>{text(state.best)}</strong></div><div><span>reach / 当前边界</span><strong>{text(state.reach)}</strong></div></div><div className="reach-track"><span style={{ width: `${Math.max(0, Math.min(100, (reach / max) * 100))}%` }} /><i style={{ left: `${Math.max(0, Math.min(100, (index / max) * 100))}%` }}>index {index}</i></div></div>;
}

function DpViz({ state }: RendererProps) {
  const rows = list(state.table);
  const active = list(state.active).map(Number);
  const dependency = list(state.dependency).map(Number);
  return <div className="viz-stack"><ArrayStrip values={flatValues(state.values)} active={[state.index]} /><div className="dp-table-wrap"><table className="dp-table"><thead><tr><th>状态</th>{rows[0]?.map((_: unknown, index: number) => <th key={index}>{index}</th>)}</tr></thead><tbody>{rows.map((row: any[], rowIndex: number) => <tr key={rowIndex}><th>{rows.length > 1 ? (rowIndex === 0 ? 'mx / a' : 'mn / b') : 'dp'}</th>{row.map((value: unknown, colIndex: number) => <td className={`${active.includes(colIndex) ? 'is-active' : ''} ${dependency.includes(colIndex) ? 'is-dependency' : ''}`} key={colIndex}>{text(value)}</td>)}</tr>)}</tbody></table></div>{dependency.length > 0 && <p className="diagram-note">蓝框单元格是本轮读取的前驱状态。</p>}</div>;
}

function TrickViz({ state }: RendererProps) {
  const values = flatValues(state.values);
  const index = Number(state.index ?? -1);
  const hasBits = state.bits != null;
  const bits = Number(state.bits ?? 0);
  const low = Number(state.low ?? -1);
  const high = Number(state.high ?? -1);
  return <div className="viz-stack"><ArrayStrip values={values} active={[index, ...(Number.isInteger(low) && low >= 0 && low < values.length ? [low] : []), ...(Number.isInteger(high) && high >= 0 && high < values.length ? [high] : [])]} />{hasBits ? <div className="bit-register"><span>异或寄存器 / 8 位</span><div>{Array.from({ length: 8 }, (_, position) => { const bitIndex = 7 - position; return <span className={(bits >> bitIndex) & 1 ? 'is-active' : ''} key={bitIndex}><small>{bitIndex}</small><strong>{(bits >> bitIndex) & 1}</strong></span>; })}</div><code>ans = {bits}</code></div> : <div className="pointer-legend"><span>low = {text(state.low)}</span><span>index = {text(state.index)}</span><span>high = {text(state.high)}</span></div>}</div>;
}

const renderers: Record<string, (props: RendererProps) => ReactNode> = {
  hash: HashViz,
  twoPointer: TwoPointerViz,
  slidingWindow: (props) => <WindowViz {...props} />,
  prefix: PrefixViz,
  windowHeap: (props) => <QueueViz {...props} />,
  windowCounts: (props) => <QueueViz {...props} counts />,
  array: ArrayViz,
  linked: LinkedViz,
  tree: TreeViz,
  grid: GridViz,
  graph: GraphViz,
  backtrack: BacktrackViz,
  binary: BinaryViz,
  stack: StackViz,
  heap: HeapViz,
  greedy: GreedyViz,
  dp: DpViz,
  trick: TrickViz,
};

const legends: Record<string, string[]> = {
  hash: ['蓝色：正在检查的元素', '蓝行：目标补数'], twoPointer: ['蓝色：当前指针', '灰色：已排除候选'],
  slidingWindow: ['蓝框：当前窗口', '计数：窗口内出现次数'], prefix: ['蓝色：最新前缀位置', 'Pᵢ：前 i 项之和'],
  windowHeap: ['蓝框：当前窗口', '队首：窗口极值候选'], windowCounts: ['蓝框：当前窗口', '0：该字符已不在窗口'],
  array: ['蓝色：当前下标', '槽位：值应归位的位置'], linked: ['蓝色：指针所在节点', 'ID：对象身份'],
  tree: ['蓝色：当前调用节点', '灰色：已处理节点'], grid: ['蓝格：当前 DFS 位置', '黑格：尚未访问陆地'],
  graph: ['蓝节点：当前课程', '蓝圈：入度为 0'], backtrack: ['蓝格：当前搜索位置', '路径：已做选择'],
  binary: ['蓝色：本轮中点', '灰格：已排除下标'], stack: ['蓝色：输入扫描位置', '栈顶：最近未结算项'],
  heap: ['蓝色：堆顶', '圆形：父子关系'], greedy: ['蓝色：当前扫描位置', '横线：可达边界'],
  dp: ['蓝格：当前状态', '蓝框：读取的前驱'], trick: ['蓝色：当前考察位置', '置位：异或结果中的 1'],
};

export function FamilyRenderer({ family, state, data, id }: RendererProps & { family: string }) {
  const renderer = renderers[family];
  if (!renderer) return <p className="empty-state">暂不支持的可视化类型：{family}</p>;
  return <div className={`family-renderer renderer-${family}`}><div className="diagram-legend">{legends[family]?.map((item) => <span key={item}><i />{item}</span>)}</div>{renderer({ state, data, id })}<Variables state={state} /></div>;
}
