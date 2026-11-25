import { chromium } from 'file:///E:/Projects/playwright-kit/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const shots = path.join(root, 'public', 'screenshots');
fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
const errors = [];
page.on('pageerror', error => errors.push(String(error)));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const results = [];
const check = (name, pass, detail = '') => { results.push({ name, pass, detail }); if (!pass) throw new Error(`${name}: ${detail}`); };

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
check('homepage 88 rows', await page.locator('.problem-row').count() === 88);
await page.screenshot({ path: path.join(shots, 'home-desktop.png') });
await page.locator('.search-field input').fill('200');
check('search by id', await page.locator('.problem-row').count() === 1);
await page.locator('.search-field input').fill('');
await page.locator('.select-field select').first().selectOption('回溯');
check('category filter', await page.locator('.problem-row').count() === 8);
await page.locator('.select-field select').first().selectOption('全部');
await page.locator('.difficulty-filter button').filter({ hasText: '困难' }).click();
check('difficulty filter', await page.locator('.problem-row').count() === 10);
await page.locator('.difficulty-filter button').filter({ hasText: '全部' }).click();

const representatives = [
  { id: 1, file: 'hash-desktop', family: '哈希表' },
  { id: 200, file: 'grid-desktop', family: '网格搜索' },
  { id: 94, file: 'tree-desktop', family: '二叉树递归' },
  { id: 25, file: 'linked-desktop', family: '链表指针' },
  { id: 76, file: 'window-desktop', family: '窗口计数' },
];
for (const item of representatives) {
  await page.goto(`http://127.0.0.1:4173/?p=${item.id}`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  check(`direct refresh ${item.id}`, (await page.locator('h1').innerText()) !== '');
  check(`visual family ${item.id}`, (await page.locator('.viz-topline').innerText()).includes(item.family));
  check(`no horizontal overflow ${item.id}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const next = page.getByRole('button', { name: '下一帧' });
  const before = await page.locator('.viz-topline').innerText();
  await next.click();
  const after = await page.locator('.viz-topline').innerText();
  check(`visual next ${item.id}`, before !== after);
  await page.getByRole('button', { name: '重置到第一帧' }).click();
  check(`visual reset ${item.id}`, (await page.locator('.viz-topline').innerText()) === before);
  await page.locator('#visual').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(shots, `${item.file}.png`) });
  await page.getByRole('button', { name: '标记为已完成' }).click();
  check(`completion persisted ${item.id}`, (await page.getByRole('button', { name: '已完成 · 点击撤销' }).count()) === 1);
}

await page.goto('http://127.0.0.1:4173/?p=207', { waitUntil: 'networkidle' });
check('207 adaptation label', await page.getByRole('heading', { name: 'Python3 教学版' }).isVisible());
check('207 import', (await page.locator('.code-block').innerText()).includes('from collections import defaultdict, deque'));
await page.getByRole('button', { name: '复制完整代码' }).click();
const copied = await page.evaluate(() => navigator.clipboard.readText());
const displayed = fs.readFileSync(path.join(root, 'public', 'code', '0207-course-schedule.py'), 'utf8');
check('copy exact displayed Python3', copied.replaceAll('\r\n', '\n') === displayed.replaceAll('\r\n', '\n'));
await page.getByRole('button', { name: '标记为已完成' }).click();
await page.reload({ waitUntil: 'networkidle' });
check('completion survives reload', await page.getByRole('button', { name: '已完成 · 点击撤销' }).isVisible());

await page.setViewportSize({ width: 390, height: 844 });
for (const item of [{ id: 0, file: 'home-mobile' }, { id: 25, file: 'linked-mobile' }, { id: 76, file: 'window-mobile' }]) {
  await page.goto(item.id ? `http://127.0.0.1:4173/?p=${item.id}` : 'http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  check(`mobile no horizontal overflow ${item.id}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: path.join(shots, `${item.file}.png`), fullPage: true });
}

const allProblems = JSON.parse(fs.readFileSync(path.join(root, 'src', 'guides.json'), 'utf8')).guides.map(g => ({ id: g.id, frames: g.viz.frames.length, similar: g.similar.length, keyLines: g.keyLines.length }));
check('88 guides machine readable', allProblems.length === 88);
check('all guides substantive', allProblems.every(g => g.frames >= 7 && g.similar >= 2 && g.keyLines >= 1));
check('no browser errors', errors.length === 0, errors.join('\n'));
fs.writeFileSync(path.join(root, '.tmp', 'browser-validation.json'), JSON.stringify({ results, allProblems, errors }, null, 2));
console.log(JSON.stringify({ checks: results.length, passed: results.filter(r => r.pass).length, errors, screenshots: fs.readdirSync(shots) }, null, 2));
await browser.close();
