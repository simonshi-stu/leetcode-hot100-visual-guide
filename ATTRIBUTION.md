# 来源、参考与许可证

核实日期：2026-11-25。

## 教学与代码

- 88 道题的题号、中文标题、分类、难度、公开示例、约束、历史提交时间和代码来自用户提供的本地数据集 `leetcode-hot100-export-20261125`。原始导出目录只读，未修改。
- 86 份 Python3 展示代码与历史提交逐字一致。第 200、207 题的来源和最小适配见题目页与 `scripts/build_data.py`。
- 中文拆解、思路、复杂度、思考题、图示和状态帧为本项目新编写，不声称是用户原有解题心得。
- 没有搬运第三方题解、算法代码、插图或图形。LeetCode 仅作为题目来源、教学组织和技术表达参考。

## 第三方题面与图片

公开页面使用自写题目摘要、输入输出、公开示例、约束和原题链接。没有发布抓取的完整题面 HTML、原始页面快照、数据集压缩包或第三方示意图文件。这样避免把本地抓取误当作公开复用授权。

## 相似题核实

每题 2～4 道相似题，共 240 条推荐。推荐的中文标题、题号与 LeetCode 中国 slug 通过在线题目页面或 GraphQL 核实。机器可读记录位于 `src/guides.json` 的 `sources` 字段；各 `group-*.ts` 的 `SOURCES` 保留分组核实来源。

原题链接示例：<https://leetcode.cn/problems/two-sum/>。这些链接用于来源归属与进一步阅读，不代表 LeetCode 认可或发布本站。

## 实际使用的开源依赖

| 项目 | 用途 | 许可证 | 官方来源 |
| --- | --- | --- | --- |
| React | 页面组件与状态 | MIT | <https://github.com/facebook/react> |
| React DOM | React 渲染 | MIT | <https://github.com/facebook/react/tree/main/packages/react-dom> |
| Vite | 开发服务器与静态构建 | MIT | <https://github.com/vitejs/vite> |
| TypeScript | 类型检查与教学内容转译 | Apache-2.0 | <https://github.com/microsoft/TypeScript> |
| @vitejs/plugin-react | React 构建支持 | MIT | <https://github.com/vitejs/vite-plugin-react> |

2026-11-25 通过 GitHub License API 核实 React、Vite 为 MIT，TypeScript 为 Apache-2.0。依赖的完整声明随 `node_modules` 保存在本地；部署产物不包含这些依赖的源码仓库。

## 设计与图形

页面视觉依据用户提供的文字规范实现：米白纸张、近黑文字、电光蓝重点、英文眉题、横向分隔线与黑灰线条圆点。数组、链表、树、图、栈、堆和填表图均由本项目组件原创绘制，没有复用参考截图中的水印、机构标识或装饰图。
