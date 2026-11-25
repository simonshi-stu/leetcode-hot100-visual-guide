# 算法图解研究 · LeetCode Hot 100

面向初学者的中文可视化题解网站，完整覆盖本地数据集中已解决的 **88 道** LeetCode Hot 100 题目。页面采用米白纸张、近黑粗体、电光蓝重点和黑色分隔线的研究报告风格。

## 已交付内容

- 88 道独立题目视图，分享地址为 `/?p=题号`，静态托管下可直接打开和刷新。
- 每题包含自写题目摘要、输入输出、220 个公开示例、约束、拆解、实际代码思路、交互图解、Python3 代码、复杂度、思考题和相似题。
- 18 类算法图示，共 866 个确定性状态帧；支持上一步、下一步、重置、播放、暂停、调速和键盘操作。
- 题号、中英文标题和讲解关键词搜索，分类与难度筛选，页内目录，前后题跳转。
- 本机阅读记录、完成标记、阅读进度和聚焦阅读模式；移动端布局与减少动画偏好支持。
- 240 条相似题推荐，含 165 个在线核验来源。站内题目支持内部跳转，同时保留 LeetCode 中国原题链接。

## 技术栈与目录

React 18、TypeScript、Vite 6。图示由 React/SVG/CSS 绘制，不引入后端、账号、数据库或浏览器端任意代码执行。

```text
src/content/group-a.ts … group-h.ts   88 题教学内容与可视化帧
src/data.ts                          题面元数据、公开代码、哈希与来源
src/guides.json                      构建时生成的合并内容
src/components/Visualizers.tsx       18 类算法图示
src/components/ProblemPage.tsx       题目页结构
public/code/                         88 份可下载的 Python3 展示代码
scripts/build_data.py                 从本地导出数据重建元数据与代码
scripts/generate_guides.mjs           合并并校验教学内容
scripts/check_examples.py             本地公开样例执行检查
scripts/browser-check.mjs             浏览器交互与响应式检查
public/screenshots/                   桌面与手机截图
dist/                                可直接部署的静态网站
```

## 本地运行

需要 Node.js 20+、npm 和 Python 3。所有依赖与缓存应放在本项目或 `E:\Projects` 下。

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run typecheck
npm run build
npm exec vite -- preview --host 127.0.0.1 --port 4173
```

`npm run data` 会检查恰好 88 题、18 类图示和教学内容字段，并生成 `src/guides.json`。常规构建使用已经提交的 `src/data.ts` 与 `public/code`，不依赖原始导出目录。

## 从原始导出数据更新

仅在本地数据集可用时执行以下命令。脚本只读取 `E:\Projects\leetcode-hot100-export-20261125`，不修改历史数据。

```bash
py scripts/build_data.py
npm run data
npm run build
```

脚本逐题核对 `dataset.jsonl`、`references.jsonl` 和 `solutions` 的 `sample_id`、提交 ID、代码与 SHA-256。86 份 Python3 提交逐字保留；第 200 题保持原算法与注释并标为 Python3 教学版；第 207 题仅补充 `from collections import defaultdict, deque`，不可达的旧 DFS 注释保留。

## 维护教学内容

1. 在对应的 `src/content/group-*.ts` 修改题目讲解、`keyLines` 或 `viz`。
2. `keyLines.start/end` 使用实际展示 Python 文件的 1-based 行号；教学标记不写入代码。
3. 可视化帧使用 `{ title, detail, state }`。`state` 必须符合 `Visualizers.tsx` 中相应 family 的字段约定。
4. 用固定小输入推导每一帧，记录指针、队列、路径、填表值等真实状态；不要添加与算法无关的装饰动画。
5. 执行 `npm run data`、`npm run typecheck` 和 `npm run build`。修改算法后重新运行公开样例检查。
6. 新增相似题时在线核对题号、中文标题和 `https://leetcode.cn/problems/<slug>/`，并加入该组的 `SOURCES`。站外题目标为“计划外题目”，不得声称已解决。

## 验证

```bash
py scripts/check_examples.py
node scripts/browser-check.mjs
```

浏览器检查脚本使用本机已有的 `E:\Projects\playwright-kit` Playwright，并假设生产预览运行在 `127.0.0.1:4173`。它检查首页 88 行、搜索筛选、5 类代表题的直达刷新、可视化前后与重置、完成标记、移动端溢出和浏览器错误，并将截图保存到 `public/screenshots`。

公开样例检查只执行固定的本地公开输入，不访问隐藏测试，也不代表新的 LeetCode 判题结果。详细结果见 [VERIFICATION.md](VERIFICATION.md)。

## GitHub Pages 部署

仓库使用 `base: './'`，查询参数路由不依赖服务器重写。`.github/workflows/deploy-pages.yml` 在推送 `main` 时构建并发布 `dist`。首次启用时，仓库管理员需在 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。

```bash
git init
git add .
git commit -m "Build complete 88-problem visual guide"
git branch -M main
git remote add origin https://github.com/<实际账号>/<实际仓库>.git
git push -u origin main
```

只发布网站所需源码、公开代码、文档、截图和构建配置。`.gitignore` 排除 `node_modules`、`.tmp`、原始快照、日志和环境变量文件。详细来源与许可证见 [ATTRIBUTION.md](ATTRIBUTION.md)。

## 已知限制

- 公开题面采用独立教学摘要，不转载完整第三方题面或原始示意图；完整条件通过原题链接查看。
- 866 帧为固定示例的算法状态讲解，不是任意输入执行器。
- 历史 Accepted 来自导出数据；本次仅增加 Python3 语法检查和公开样例本地执行。
- 首次加载需要下载包含全部教学内容的静态包，Vite 会给出大于 500 kB 的 chunk 提示；不影响构建与功能。
