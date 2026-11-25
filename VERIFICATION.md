# 验证报告

日期：2026-11-25。以下结果来自本地实际执行；历史 Accepted 不等同于本次重新判题。

## 内容与代码覆盖

| 检查 | 结果 |
| --- | --- |
| 数据集题目 | 恰好 88 道，ID 唯一，分类与顺序保留 |
| 教学内容 | 88/88 题具有拆解、机制、不变量、终止条件、反例、复杂度、思考题与相似题 |
| 公开示例 | 220/220 显示 |
| 算法图示 | 18 类，866 个状态帧 |
| 相似题 | 240 条，2～4 条/题；165 个在线核验来源 |
| 占位内容 | 未发现 TODO、待补充或空题解章节 |
| Python3 语法 | 88/88 展示代码通过 `ast.parse` |
| 原始代码一致性 | 86 份 Python3 逐字一致；第 200 题原样；第 207 题仅增加标准库导入 |
| 原始 SHA-256 | 88/88 与 `references.jsonl` 一致 |

提交到 Git 后再次读取 blob 验证：88/88 展示哈希一致；87 份与原始哈希一致（86 份 Python3 加第 200 题）；第 207 题仅导入适配。`.gitattributes` 固定文本换行为 LF。

`src/data.ts` 保存原始哈希与展示哈希；可下载文件位于 `public/code`。复制按钮使用同一份展示代码，不附加行号或教学标记。

## Python3 适配

- **200 岛屿数量**：历史语言字段为 `python`。现有算法与注释可在 Python3 运行，未改写。`dfs` 内重新赋值 `nr/nc` 只影响局部变量，不改变外层扫描维度。页面标为“Python3 教学版”。
- **207 课程表**：历史语言字段为 `python`。展示文件仅补充 `from collections import defaultdict, deque`。当前算法是 Kahn 拓扑排序；文件末尾不可达的旧 DFS 注释保留并在讲解中区分。页面标为“Python3 教学版”。

适配版没有冒充历史 Python3 通过提交，也没有新的提交时间。

## 本地公开样例执行

命令：

```bash
PYTHONDONTWRITEBYTECODE=1 py scripts/check_examples.py
```

结果：**88/88 题、220/220 个公开样例通过，0 失败，0 跳过**。测试命名空间补充标准库导入、ListNode/TreeNode 和必要的设计类字段；支持链表对象身份、环、树序列化、原地修改、多合法答案顺序与浮点容差。

机器记录：`.tmp/example-validation.json`。范围仅为固定公开输入，没有隐藏测试，没有向 LeetCode 重新提交。

## 构建与类型检查

```bash
npm run data
npm run typecheck
npm run build
```

结果：全部通过。`generate_guides.mjs` 确认 88 题、18 类图示和来源合并；TypeScript 无错误；Vite 生成 `dist`。Vite 提示主内容 chunk 大于 500 kB，这是已知加载体积限制，不是构建失败。

## 浏览器交互与响应式

命令：`node scripts/browser-check.mjs`，使用 Playwright 打开生产预览 `http://127.0.0.1:4173/`。

检查项：

- 首页恰好 88 行；题号搜索返回 1 行；回溯分类返回 8 行；困难难度返回 10 行。
- 1、200、94、25、76 题直接打开并刷新；对应图示 family 正确。
- 每题可视化下一步改变帧、重置回到首帧；无桌面横向溢出。
- 完成标记写入本机并在刷新后保留。
- 207 显示适配说明和补充导入；剪贴板内容与 `0207-course-schedule.py` 逐字一致。Windows 剪贴板会把 LF 标准化为 CRLF，比较时只统一换行符。
- 首页、链表题、窗口题在 390×844 手机视口无横向溢出。
- 浏览器 `pageerror` 与 console error 均为 0。

结果记录：`.tmp/browser-validation.json`。截图保存于 `public/screenshots/`：

- `home-desktop.png`、`home-mobile.png`
- `hash-desktop.png`
- `grid-desktop.png`
- `tree-desktop.png`
- `linked-desktop.png`、`linked-mobile.png`
- `window-desktop.png`、`window-mobile.png`

人工查看截图确认米白背景、近黑粗体、电光蓝重点、横向分隔线、充分留白、黑灰算法结构，代码与图示在桌面和手机可读。手机截图使用完整页面输出，避免无头浏览器对粘性页首视口截图出现合成伪影。

## 内容复核

全部 88 题均由独立复核流程对照原始 Python 代码检查教学机制、`keyLines`、复杂度和固定输入的可视化状态。复核中发现并修正了指针方向、窗口计数、树遍历返回、链表指针语义、堆窗口表述、DP 表意义等问题。讲解保持逐题差异，没有使用统一空泛段落填充。

## 发布

发布状态将在实际推送和 Pages 检查后更新。未完成在线检查前，不声称网站已上线。

## 已知限制

- 完整题面与第三方示意图未公开转载；页面提供独立摘要、公开示例、约束和原题链接。
- 可视化是固定示例的状态序列，不执行用户输入或任意 Python 代码。
- 本地公开样例通过不能替代 LeetCode 隐藏测试。
- 当前静态内容包较大，首次加载存在体积成本。
