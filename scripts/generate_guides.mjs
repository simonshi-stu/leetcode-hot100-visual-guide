import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const families = {
  hash: '哈希表',
  twoPointer: '对撞双指针',
  slidingWindow: '滑动窗口',
  prefix: '前缀和',
  windowHeap: '单调队列',
  windowCounts: '窗口计数',
  array: '原地数组',
  linked: '链表指针',
  tree: '二叉树递归',
  grid: '网格搜索',
  graph: '图与拓扑排序',
  backtrack: '回溯搜索',
  binary: '二分查找',
  stack: '栈',
  heap: '堆',
  greedy: '贪心',
  dp: '动态规划',
  trick: '位运算与技巧',
};

async function loadTypeScriptModule(filename) {
  let source = fs.readFileSync(filename, 'utf8');
  source = source
    .replace(/^import (?:type )?\{[^\n]+\} from ['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^import (?:type )?Guide from ['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^export \{ SOURCES \};?\s*$/gm, '');
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}#${encodeURIComponent(path.basename(filename))}`;
  return import(url);
}

const asArray = (value) => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    return value.match(/[^。！？]+[。！？]?/g)?.map((item) => item.trim()).filter(Boolean) ?? [value];
  }
  return value == null ? [] : [String(value)];
};

const compact = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const unique = (items) => [...new Set(items.map(compact).filter(Boolean))];

const metadataModule = await loadTypeScriptModule(path.join(src, 'data.ts'));
const problems = metadataModule.problems;
if (!Array.isArray(problems) || problems.length !== 88) {
  throw new Error(`Expected exactly 88 problems, received ${problems?.length ?? 'invalid data'}.`);
}
const byId = new Map(problems.map((problem) => [problem.id, problem]));
const bySlug = new Map(problems.map((problem) => [problem.slug, problem]));
const guides = [];
const rawSources = [];
const contentDir = path.join(src, 'content');

for (const filename of fs.readdirSync(contentDir).filter((name) => /^group-[a-h]\.ts$/.test(name)).sort()) {
  const module = await loadTypeScriptModule(path.join(contentDir, filename));
  if (Array.isArray(module.SOURCES)) rawSources.push(...module.SOURCES);
  for (const [key, raw] of Object.entries(module.guides)) {
    const problem = byId.get(Number(raw.id ?? key));
    if (!problem) throw new Error(`Guide ${key} in ${filename} has no matching problem metadata.`);
    if (raw.slug && problem.slug !== raw.slug) throw new Error(`Slug mismatch for problem ${problem.id}.`);
    if (!raw.viz || !Array.isArray(raw.viz.frames) || raw.viz.frames.length === 0) {
      throw new Error(`Guide ${problem.id} has no visualization frames.`);
    }
    const required = ['summary', 'input', 'output', 'core', 'observation', 'mechanism', 'invariant', 'termination', 'naive', 'time', 'timeNote', 'space', 'spaceNote'];
    for (const field of required) {
      if (!compact(raw[field])) throw new Error(`Guide ${problem.id} is missing ${field}.`);
    }
    const challenge = typeof raw.challenge === 'string'
      ? {
          question: raw.challenge,
          hint: '先说明新增约束会改变哪一个状态，再检查旧结论是否仍然成立。',
          answer: raw.observation,
        }
      : raw.challenge;
    if (!challenge?.question || !challenge?.hint || !challenge?.answer) {
      throw new Error(`Guide ${problem.id} has an incomplete challenge.`);
    }
    const normalized = {
      ...problem,
      examples: Array.isArray(problem.examples) ? problem.examples : [],
      constraints: asArray(problem.constraints),
      adaptation: problem.adaptation || '展示代码与历史提交逐字一致。',
      family: raw.viz.family,
      familyZh: families[raw.viz.family] ?? raw.viz.family,
      summary: raw.summary,
      input: raw.input,
      output: raw.output,
      core: raw.core,
      walkthrough: asArray(raw.walkthrough),
      pitfalls: asArray(raw.pitfalls),
      observation: raw.observation,
      mechanism: raw.mechanism,
      invariant: raw.invariant,
      termination: raw.termination,
      counterexample: asArray(raw.counterexample),
      naive: raw.naive,
      time: raw.time,
      timeNote: raw.timeNote,
      space: raw.space,
      spaceNote: raw.spaceNote,
      keyLines: (raw.keyLines ?? []).map((line) => ({
        start: Math.max(1, Number(line.start ?? line.line ?? 1)),
        end: Math.max(1, Number(line.end ?? line.line ?? 1)),
        text: String(line.text ?? ''),
      })),
      challenge,
      similar: (raw.similar ?? []).map((item) => {
        const numericId = Number(item.id);
        const known = (Number.isFinite(numericId) && byId.has(numericId) ? byId.get(numericId) : undefined) ?? bySlug.get(item.slug);
        return {
          id: known?.id ?? null,
          title: String(item.title ?? known?.title ?? item.slug),
          slug: String(item.slug),
          role: item.role ?? '同类巩固',
          reason: String(item.reason ?? ''),
          externalUrl: `https://leetcode.cn/problems/${item.slug}/`,
        };
      }),
      viz: raw.viz,
      keywords: unique([
        problem.category,
        families[raw.viz.family] ?? raw.viz.family,
        raw.viz.family,
        problem.title,
        problem.titleEn,
        raw.core,
        raw.observation,
      ]),
    };
    guides.push(normalized);
  }
}

if (guides.length !== 88 || new Set(guides.map((guide) => guide.id)).size !== 88) {
  throw new Error(`Expected 88 unique merged guides, received ${guides.length}.`);
}
const order = new Map(problems.map((problem, index) => [problem.id, index]));
guides.sort((a, b) => order.get(a.id) - order.get(b.id));
const actualFamilies = new Set(guides.map((guide) => guide.family));
for (const family of Object.keys(families)) {
  if (!actualFamilies.has(family)) throw new Error(`Visualization family ${family} is not implemented in content.`);
}

const sources = [...new Map(rawSources.map((source) => {
  const value = typeof source === 'string' ? { url: source } : source;
  const url = String(value.url);
  return [url, {
    url,
    license: String(value.license && value.license !== '见原内容许可说明' ? value.license : '仅引用 LeetCode 公开题号、标题和链接；教学文字原创。'),
    note: String(value.note ?? ''),
    checked: typeof value.checked === 'boolean' ? (value.checked ? '已核验' : '未标记') : String(value.checked ?? ''),
  }];
})).values()];

fs.writeFileSync(path.join(src, 'guides.json'), JSON.stringify({ guides, sources }, null, 2) + '\n');
console.log(`Generated ${guides.length} merged guides, ${Object.keys(families).length} visualization families, and ${sources.length} sources.`);
