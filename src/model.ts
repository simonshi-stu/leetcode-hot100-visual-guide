import rawData from './guides.json';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Role = '前置练习' | '同类巩固' | '进阶挑战';
export type VizState = Record<string, any>;

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Frame {
  title: string;
  detail: string;
  state: VizState;
}

export interface Viz {
  family: string;
  data: VizState;
  frames: Frame[];
}

export interface KeyLine {
  start: number;
  end: number;
  text: string;
}

export interface Similar {
  id: number | null;
  title: string;
  slug: string;
  role: Role;
  reason: string;
  externalUrl: string;
}

export interface Challenge {
  question: string;
  hint: string;
  answer: string;
}

export interface Guide {
  id: number;
  title: string;
  titleEn: string;
  slug: string;
  category: string;
  difficulty: Difficulty;
  difficultyZh: string;
  url: string;
  submittedAt: string;
  historicalLanguage: 'python3' | 'python';
  displayLanguage: 'Python3';
  code: string;
  codeFile: string;
  originalHash: string;
  displayHash: string;
  adapted: boolean;
  adaptation: string;
  examples: Example[];
  constraints: string[];
  family: string;
  familyZh: string;
  summary: string;
  input: string;
  output: string;
  core: string;
  walkthrough: string[];
  pitfalls: string[];
  observation: string;
  mechanism: string;
  invariant: string;
  termination: string;
  counterexample: string[];
  naive: string;
  time: string;
  timeNote: string;
  space: string;
  spaceNote: string;
  keyLines: KeyLine[];
  challenge: Challenge;
  similar: Similar[];
  viz: Viz;
  keywords: string[];
}

export interface ContentSource {
  url: string;
  license: string;
  note: string;
  checked: string;
}

interface ContentData {
  guides: Guide[];
  sources: ContentSource[];
}

const data = rawData as unknown as ContentData;
export const guides = data.guides;
export const sources = data.sources;
export const guideById = new Map(guides.map((guide) => [guide.id, guide]));
export const categories = [...new Set(guides.map((guide) => guide.category))];
export const difficultyCounts = guides.reduce<Record<Difficulty, number>>(
  (counts, guide) => ({ ...counts, [guide.difficulty]: counts[guide.difficulty] + 1 }),
  { Easy: 0, Medium: 0, Hard: 0 },
);

export const problemHref = (id: number) => `./?p=${id}`;
export const codeHref = (guide: Guide) => `${import.meta.env.BASE_URL}${guide.codeFile}`;

export function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  }).format(date);
}

export function searchText(guide: Guide) {
  return [guide.id, guide.title, guide.titleEn, ...guide.keywords].join(' ').toLocaleLowerCase();
}
