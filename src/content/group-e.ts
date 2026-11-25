import type { Guide } from '../types';

export const guides: Record<string, Guide> = {
  '200': {
    id: 200,
    title: '岛屿数量',
    slug: 'number-of-islands',
    difficulty: '中等',
    category: '图论',
    summary: '把上下左右相连的陆地看作一座岛，统计字符网格中互不连通陆地块的数量。斜角相接的陆地属于不同岛。',
    input: '字符串二维数组 grid，元素为 "1"（陆地）或 "0"（水）。常规约束为 1 <= m,n <= 300；代码另保留空网格判断。',
    output: '整数岛屿数量；grid 中的陆地在遍历结束后会被原地改成整数 0。',
    core: '按行扫描，遇到尚未处理的 "1" 就将答案加一，并用 DFS 把整座相连岛屿全部改成 0。',
    walkthrough: '以示例网格为例，左上角四格陆地通过上下左右连接成第一座岛。DFS 从 (0,0) 出发，先下到 (1,0)，再右到 (1,1)，最后向上补掉 (0,1)。四格都变成 0 后，扫描继续。单独的 (2,2) 是第二座岛；右下角 (3,3)、(3,4) 连成第三座岛，因此答案为 3。',
    pitfalls: [
      '只统计上下左右相邻；把斜角陆地也算进同一岛会得到错误结果。',
      'DFS 必须先标记当前格再递归。若标记太晚，相邻分支可能绕回当前格。',
      '输入陆地是字符串 "1"，访问标记却使用整数 0；比较时不要误写成整数 1。',
      'DFS 内重新赋值 nr、nc 只是局部变量遮蔽，不会破坏外层已经创建的 range 迭代器。'
    ],
    observation: '一座岛只需要在扫描第一次碰到它时计数。随后把整座岛抹成水，后续格子就不会重复计数。',
    mechanism: '这份 Python3 教学版保持历史算法不变，无需增加导入。dfs 先把 grid[r][c] 置为整数 0，再依次检查上、下、左、右。函数内的 nr、nc 只服务本次调用；外层循环的边界在进入 DFS 前已确定，因此局部覆盖无害。',
    invariant: '每次 DFS 开始时，当前格是尚未访问的陆地；递归过程中，当前连通块内已访问格都变成 0，未访问格仍为 "1"。',
    termination: 'DFS 只向值为 "1" 的相邻格递归，每次递归前都会把该格永久改成 0，所以单座岛最多处理其全部格子。外层双重 for 有限递增，最终扫描完全部网格。',
    counterexample: 'grid=[["1","0"],["0","1"]] 的答案是 2。若按八方向 flood fill 就会把两个斜角格子连成一座岛，错误得到 1。',
    naive: '每发现一个未访问陆地就新建 visited 集合并做 BFS，能正确计数，但额外保存 O(mn) 个访问标记；本提交直接复用输入网格。',
    time: 'O(mn)',
    timeNote: '外层恰好检查 mn 格；每格陆地只会触发一次 DFS，每次检查四个方向。递归总工作为 O(mn)，最终返回整数只需 O(1)。',
    space: 'O(mn)',
    spaceNote: '最坏情况整片网格都是陆地，递归栈深度达到 mn；输入被原地修改，不需要额外 visited。答案是单个整数，没有答案复制成本。超深连通块还需注意 Python 递归深度限制。',
    keyLines: [
      { start: 3, end: 7, text: `        grid[r][c] = 0
        nr, nc = len(grid), len(grid[0])
        for x,y in [(r -1, c), (r+1, c), (r, c-1), (r, c+1)]:
            if 0 <= x < nr and 0 <= y < nc and grid[x][y] == "1":
                self.dfs(grid, x, y)` },
      { start: 19, end: 23, text: `        for r in range(nr):
            for c in range(nc):
                if grid[r][c] == "1":
                    num_island += 1
                    self.dfs(grid, r, c)` }
    ],
    challenge: {
      question: '如果要求不能修改 grid，怎样保留同样的 O(mn) 时间？',
      hint: '把“访问过”的信息从输入格子转移到独立结构。',
      answer: '使用 m×n 的布尔 visited，进入 DFS 时标记，递归结束后不撤销；或者用显式栈做迭代遍历。两者都需要 O(mn) 辅助空间。'
    },
    similar: [
      { id: 695, title: '岛屿的最大面积', slug: 'max-area-of-island', role: '同类巩固', reason: '同样从陆地起点做四方向 DFS，但把整座岛的面积返回并取最大值。' },
      { id: 130, title: '被围绕的区域', slug: 'surrounded-regions', role: '进阶挑战', reason: '从边界 O 出发做反向填充，区分与边界连通和内部被包围的区域。' },
      { id: 1020, title: '飞地的数量', slug: 'number-of-enclaves', role: '同类巩固', reason: '从边界陆地开始消除能离开网格的连通块，再统计剩余陆地。' }
    ],
    viz: {
      family: 'grid',
      data: {
        grid: [
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1']
        ]
      },
      frames: [
        { title: '从左到右扫描', detail: '尚未发现陆地，num_island=0。active=[-1,-1] 表示没有当前 DFS 格子。', state: { grid: [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [-1,-1], count: 0, note: '扫描起点是 (0,0)。' } },
        { title: '发现第一座岛', detail: '外层看到 (0,0) 为 "1"，先执行 num_island += 1，再调用 DFS。', state: { grid: [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [0,0], count: 1, note: '计数已加一，当前格还没有被 dfs 修改。' } },
        { title: '访问 (0,0)', detail: 'dfs 第一件事把当前陆地改成整数 0，然后按上、下、左、右检查邻居。', state: { grid: [['0','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [0,0], count: 1, note: '(0,0) 已访问；下一步检查下方 (1,0)。' } },
        { title: '访问 (1,0)', detail: '下方格子仍是陆地，递归进入并把 (1,0) 改成 0。', state: { grid: [['0','1','0','0','0'],['0','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [1,0], count: 1, note: '第一座岛已访问两格。' } },
        { title: '访问 (1,1)', detail: '(1,0) 的右侧是陆地，继续递归并标记 (1,1)。', state: { grid: [['0','1','0','0','0'],['0','0','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [1,1], count: 1, note: '当前格上方 (0,1) 仍是陆地。' } },
        { title: '补访问 (0,1)', detail: '从 (1,1) 向上访问 (0,1)，四格岛屿全部变成 0。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [0,1], count: 1, note: '第一座岛处理完毕，递归开始返回。' } },
        { title: '第一座岛完成', detail: '递归返回外层，后续扫描看到第一座岛的位置全是 0，不会重复计数。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [-1,-1], count: 1, note: '接下来会找到 (2,2)。' } },
        { title: '发现第二座岛', detail: '(2,2) 是新的未访问陆地，计数变为 2。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']], active: [2,2], count: 2, note: '这座岛只有一格。' } },
        { title: '访问 (2,2)', detail: 'DFS 将单格岛改成 0；四个邻居都不是陆地。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','1','1']], active: [2,2], count: 2, note: '第二座岛完成。' } },
        { title: '发现第三座岛', detail: '扫描到 (3,3)，计数变为 3。右下角还有相连的 (3,4)。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','1','1']], active: [3,3], count: 3, note: '开始处理最后一座岛。' } },
        { title: '访问 (3,3)', detail: '当前格置 0，右侧 (3,4) 仍为陆地。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','1']], active: [3,3], count: 3, note: '沿右方向继续。' } },
        { title: '访问 (3,4)', detail: '最后一块陆地被置 0，第三座岛也处理完毕。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0']], active: [3,4], count: 3, note: '所有陆地都已变成 0。' } },
        { title: '返回 3', detail: '外层扫描结束，num_island 保持为 3。', state: { grid: [['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0'],['0','0','0','0','0']], active: [-1,-1], count: 3, note: '答案 3；输入网格已被原地修改。' } }
      ]
    }
  },
  '207': {
    id: 207,
    title: '课程表',
    slug: 'course-schedule',
    difficulty: '中等',
    category: '图论',
    summary: '判断先修关系组成的有向图是否存在环。每门课程都能在它的先修课程之后学习，等价于图中没有有向环。',
    input: '课程总数 numCourses，课程编号 0 到 numCourses-1；先修数组 prerequisites，每项 [dest,src] 表示先学 src 才能学 dest。',
    output: '布尔值：全部课程都能安排则返回 true，存在循环依赖则返回 false。',
    core: '用 Kahn BFS 不断学习入度为 0 的课程，并把它指向的后续课程入度减一；最后比较已学课程数与总课程数。',
    walkthrough: '示例 edges=[[1,0],[2,0],[2,1],[3,1]] 建边后，入度为 [0,1,1,1]，队列从 [0] 开始。学习 0 后，1 和 2 的入度各减一；学习 1 后，2 的入度再从 0 减到 -1（它已经入队，不会重复入队），3 的入度降到 0。随后学习 2、3，learned_course=4，返回 true。',
    pitfalls: [
      '先修对 [dest,src] 的边方向是 src → dest；反向建边会得到错误的入度。',
      '只有 indegree[next_course] 降到 0 时才入队；每门课程不能重复入队。',
      '判断依据是最终已学课程数是否等于 numCourses，不是队列是否曾经非空。',
      'Python3 教学版需要 from collections import defaultdict, deque。return 之后的三色 DFS 只是不可达注释，不是当前算法。'
    ],
    observation: '入度记录尚未处理的入边数量，可用于判断一门课何时首次解锁。课程可能先因一条入边归零而入队，之后另一条入边才被处理，使入度继续变成负数；负数不影响它已经解锁的状态。把所有可解锁课程逐步消去后，若仍有剩余，剩余部分必然含环。',
    mechanism: 'Python3 教学版只在历史代码前补上 defaultdict、deque 的导入，Kahn BFS 保持不变。graph[src] 保存 src 可以解锁的课程；queue 用 popleft 做 FIFO。执行到 return learned_course == numCourses 后函数立即结束，下面的旧 DFS 注释不会运行，也不贡献递归空间。',
    invariant: '每完整处理一门课程后，indegree[v] 等于其初始入度减去已经处理的入边数；队列保存所有已经解锁且尚未学习的课程。已入队课程的入度可能随后变成负数，但不会再次入队。',
    termination: '每门课程只会在入度首次降到 0 时入队一次，出队次数最多 V。每条边只被其起点课程遍历一次，因此队列最终清空；环内课程永远不会归零。',
    counterexample: 'numCourses=4、prerequisites=[[1,0],[0,1]]。0 与 1 构成环，初始队列只有孤立的 2、3；最多学习两门，learned_course=2，返回 false。',
    naive: '反复扫描全部课程，删除当前入度为 0 的课程并更新其他入度，最坏需要 O(V(V+E))。三色 DFS 也能判环，但它只是本提交末尾的旧注释方案。',
    time: 'O(V + E)',
    timeNote: 'V=numCourses，E=prerequisites 长度。建图与初始队列为 O(V+E)，BFS 中每门课程出队一次、每条边遍历一次。返回布尔值只需 O(1)，没有答案数组复制。',
    space: 'O(V + E)',
    spaceNote: '邻接表保存 E 条边，indegree 与队列各需要 O(V)。当前实现是迭代 BFS，递归栈为 O(1)；不可达的注释 DFS 不计入实际空间。',
    keyLines: [
      { start: 1, end: 1, text: `from collections import defaultdict, deque` },
      { start: 10, end: 14, text: `        graph = defaultdict(list)
        indegree = [0] * numCourses
        for dest, src in prerequisites:
            graph[src].append(dest)
            indegree[dest] += 1` },
      { start: 15, end: 15, text: `        queue = deque([i for i in range(numCourses) if indegree[i] == 0])` },
      { start: 17, end: 24, text: `        while queue:
            course = queue.popleft()
            learned_course += 1
            for next_course in graph[course]:
                indegree[next_course] -= 1
                if indegree[next_course] == 0:
                    queue.append(next_course)
        return learned_course == numCourses` },
      { start: 25, end: 50, text: `        # edges = defaultdict(list)
        # visited = [0] * numCourses
        # result = list()
        # self.valid = True

        # for info in prerequisites:
        #     edges[info[1]].append(info[0])
        
        # def dfs(u):
        #     visited[u] = 1
        #     for v in edges[u]:
        #         if visited[v] == 0:
        #             dfs(v)
        #             if not self.valid:
        #                 return
        #         elif visited[v] == 1:
        #             self.valid = False
        #             return
        #     visited[u] = 2
        #     result.append(u)
        
        # for i in range(numCourses):
        #     if self.valid and not visited[i]:
        #         dfs(i)
        
        # return self.valid` }
    ],
    challenge: {
      question: '如果还要求返回一个可行的学习顺序，循环依赖时又该返回什么？',
      hint: '队列的出队顺序本身就是当前实现已经计算出的信息。',
      answer: '新增 order 列表，每出队一门课就 append。队列清空后若长度等于 numCourses 就返回 order，否则返回 []；这正是课程表 II 的核心扩展。'
    },
    similar: [
      { id: 210, title: '课程表 II', slug: 'course-schedule-ii', role: '同类巩固', reason: '复用完全相同的 Kahn BFS，把出队顺序收集成可行的学习顺序。' },
      { id: 310, title: '最小高度树', slug: 'minimum-height-trees', role: '进阶挑战', reason: '用入度思维从无向图叶子逐层剥离，理解拓扑消去在其他图问题中的变体。' },
      { id: 802, title: '找到最终的安全状态', slug: 'find-eventual-safe-states', role: '进阶挑战', reason: '在有向图中判断哪些节点最终不会进入环，可使用反向图与拓扑排序。' }
    ],
    viz: {
      family: 'graph',
      data: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]] },
      frames: [
        { title: '建图并初始化入度', detail: '边按 src → dest 存储。初始队列只包含没有先修课程的 0。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: -1, queue: [0], indegree: [0,1,1,1], learned: 0, answer: '待判断', note: 'indegree=[0,1,1,1]，queue=[0]。' } },
        { title: '出队课程 0', detail: 'popleft 取出 0，已学计数加一；此时还没有更新后继入度。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 0, queue: [], indegree: [0,1,1,1], learned: 1, answer: '待判断', note: '课程 0 已学，准备遍历边 0→1、0→2。' } },
        { title: '处理边 0→1', detail: '课程 1 的入度从 1 减到 0，立即进入队列。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 0, queue: [1], indegree: [0,0,1,1], learned: 1, answer: '待判断', note: 'queue=[1]。' } },
        { title: '处理边 0→2', detail: '课程 2 的入度从 1 减到 0，也进入队列。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 0, queue: [1,2], indegree: [0,0,0,1], learned: 1, answer: '待判断', note: '课程 0 的所有出边处理完毕。' } },
        { title: '出队课程 1', detail: 'FIFO 取出 1，已学计数变为 2。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 1, queue: [2], indegree: [0,0,0,1], learned: 2, answer: '待判断', note: '准备处理 1→2、1→3。' } },
        { title: '处理边 1→2', detail: '课程 2 已经解锁，入度仍从 0 减到 -1；indegree[next_course] == 0 不成立，不会重复入队。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 1, queue: [2], indegree: [0,0,-1,1], learned: 2, answer: '待判断', note: '负数表示这条入边在课程 2 入队之后才被处理。' } },
        { title: '处理边 1→3', detail: '课程 3 的入度归零，进入队尾。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 1, queue: [2,3], indegree: [0,0,-1,0], learned: 2, answer: '待判断', note: '所有课程的先修约束都已满足。' } },
        { title: '出队课程 2', detail: '课程 2 没有出边，出队后已学计数为 3；它的入度仍保持 -1。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 2, queue: [3], indegree: [0,0,-1,0], learned: 3, answer: '待判断', note: '队列还剩课程 3。' } },
        { title: '出队课程 3', detail: '最后一门课程出队，队列变空，已学计数达到 4。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: 3, queue: [], indegree: [0,0,-1,0], learned: 4, answer: '待判断', note: 'while 即将结束。' } },
        { title: '返回 true', detail: 'learned_course == numCourses，所有课程都能完成。', state: { nodes: 4, edges: [[1,0],[2,0],[2,1],[3,1]], active: -1, queue: [], indegree: [0,0,-1,0], learned: 4, answer: 'true', note: '4 == 4；后面的注释 DFS 不会执行。' } }
      ]
    }
  },
  '46': {
    id: 46,
    title: '全排列',
    slug: 'permutations',
    difficulty: '中等',
    category: '回溯',
    summary: '给定互不相同的数字，逐层选择一个尚未使用的数字，收集所有长度为 n 的排列。',
    input: '不含重复整数的数组 nums，1 <= n <= 6。',
    output: '二维数组，包含全部 n! 个排列；每个排列保留原数组中的数字。',
    core: '用 used 标记已选下标，curr 保存当前排列；递归返回后同时撤销 curr 末尾和 used 标记。',
    walkthrough: 'nums=[1,2,3] 时先选 1，再选 2，最后选 3，得到 [1,2,3]。撤销 3 后，2 也已使用，当前层没有其他选择，于是再撤销 2，改选 3，随后选 2，得到 [1,3,2]。第一数字为 1 的分支结束后撤销 1，转而在顶层选择 2、3。',
    pitfalls: [
      '递归返回后必须同时执行 curr.pop() 和 used[j]=False，漏一个都会污染下一分支。',
      '写入答案必须用 curr[:]；直接保存 curr 引用会让所有结果最终变成同一个列表。',
      'used 记录的是下标而不是值；本题数字虽互不相同，也不能把两种标记概念混用。',
      '题目保证 nums 无重复；若出现重复值，这套实现会产生重复排列。'
    ],
    observation: '每一层做的决定只有“下一个位置选哪个未使用数字”。当路径长度达到 n，所有决定已经完成。',
    mechanism: 'dfs(i) 的 i 表示当前路径长度。for j 扫描全部下标，只对 used[j]=False 的分支执行“标记、追加、递归、弹出、撤销”。ans 只在叶子节点接收当前路径的副本。',
    invariant: '进入 dfs(i) 时，curr 长度恰为 i，元素互不相同；used[j]=True 当且仅当 nums[j] 已出现在 curr 中。',
    termination: '每次递归使 i 增加 1，达到 n 立即记录并返回。每层 for 最多扫描 n 个下标，所有分支都会在返回前撤销本次选择。',
    counterexample: '若把 ans.append(curr[:]) 改成 ans.append(curr)，三个叶子可能依次写入同一个列表；继续弹出后，ans 中会留下被清空或反复变化的对象。',
    naive: '枚举所有长度为 n 的数字序列再过滤重复，需要检查 n^n 个候选，明显大于实际需要的 n! 条路径。',
    time: 'O(n · n!)',
    timeNote: '共有 n! 个叶子，每个叶子复制长度 n 的 curr；内部节点扫描候选的总工作也由 O(n·n!) 控制。递归深度为 n，已包含在上述分析中。',
    space: 'O(n) 辅助空间；输出 O(n · n!)',
    spaceNote: 'used、curr 与递归栈均为 O(n)。ans 保存 n! 个长度为 n 的列表，答案复制需要 O(n·n!) 空间。',
    keyLines: [
      { start: 5, end: 15, text: `        def dfs(i):
            if i == n:
                ans.append(curr[:])
                return
            for j in range(n):
                if not used[j]:
                    used[j] = True
                    curr.append(nums[j])
                    dfs(i + 1)
                    curr.pop()
                    used[j] = False` }
    ],
    challenge: {
      question: '如果 nums 可能出现重复值，怎样在保留这套选择框架的同时去掉重复排列？',
      hint: '同一层中，相同数字不需要在相同历史下重复选择。',
      answer: '先排序 nums，并在每层记录上一个尝试的值；若当前值与上一个相同就跳过。仍须在递归后正确撤销 used 与 curr。'
    },
    similar: [
      { id: 47, title: '全排列 II', slug: 'permutations-ii', role: '同类巩固', reason: '在相同回溯框架上增加同层去重，处理重复数字。' },
      { id: 77, title: '组合', slug: 'combinations', role: '前置练习', reason: '同样维护路径和已选状态，但只从后面的候选继续，忽略排列顺序。' },
      { id: 31, title: '下一个排列', slug: 'next-permutation', role: '进阶挑战', reason: '不枚举整棵回溯树，而在字典序意义上直接计算下一个排列。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: [1,2,3] },
      frames: [
        { title: '空路径开始', detail: 'dfs(0) 尚未选择任何数字，used 三个位置均为 False。', state: { values: [1,2,3], path: [], chosen: [], removed: [], active: -1, answer: '[]', note: '从下标 j=0 开始扫描。' } },
        { title: '顶层选择 1', detail: '标记下标 0，把 1 追加到路径，进入 dfs(1)。', state: { values: [1,2,3], path: [1], chosen: [1], removed: [], active: 0, answer: '[]', note: '1 已使用，下一层只能从 2、3 中选。' } },
        { title: '第二层选择 2', detail: '选择尚未使用的下标 1，路径变为 [1,2]。', state: { values: [1,2,3], path: [1,2], chosen: [2], removed: [], active: 1, answer: '[]', note: '只剩数字 3。' } },
        { title: '第三层选择 3', detail: '路径达到长度 3，三个数字互不相同。', state: { values: [1,2,3], path: [1,2,3], chosen: [3], removed: [], active: 2, answer: '[]', note: '下一次调用会进入叶子条件。' } },
        { title: '记录第一个排列', detail: 'i==n，ans 接收 curr 的副本 [1,2,3]。', state: { values: [1,2,3], path: [1,2,3], chosen: [], removed: [], active: 2, answer: '[[1,2,3]]', note: '复制完成后立即 return。' } },
        { title: '撤销 3', detail: '叶子返回后，第三层把 3 弹出并恢复下标 2 为未使用。', state: { values: [1,2,3], path: [1,2], chosen: [], removed: [3], active: 2, answer: '[[1,2,3]]', note: '当前层已没有其他未使用数字。' } },
        { title: '撤销 2', detail: '第二层也撤销 2，回到路径 [1]。', state: { values: [1,2,3], path: [1], chosen: [], removed: [2], active: 1, answer: '[[1,2,3]]', note: '第二层继续扫描 j=2。' } },
        { title: '改选 3', detail: '在下标 2 处选择 3，路径变为 [1,3]。', state: { values: [1,2,3], path: [1,3], chosen: [3], removed: [], active: 1, answer: '[[1,2,3]]', note: '下一层改选尚未使用的 2。' } },
        { title: '补选 2', detail: '路径 [1,3,2] 再次达到长度 n。', state: { values: [1,2,3], path: [1,3,2], chosen: [2], removed: [], active: 1, answer: '[[1,2,3]]', note: '准备记录第二个排列。' } },
        { title: '记录第二个排列', detail: 'ans 新增 [1,3,2]，然后开始撤销。', state: { values: [1,2,3], path: [1,3,2], chosen: [], removed: [], active: 1, answer: '[[1,2,3],[1,3,2]]', note: '随后逐层弹出，以 1 开头的分支才会结束。' } },
        { title: '连续撤销 2、3', detail: '第三层撤销 2，第二层撤销 3，路径回到 [1]。', state: { values: [1,2,3], path: [1], chosen: [], removed: [3], active: 1, answer: '[[1,2,3],[1,3,2]]', note: 'used 恢复为只有下标 0 被标记。' } },
        { title: '撤销 1', detail: '第一层撤销 1，顶层路径清空。', state: { values: [1,2,3], path: [], chosen: [], removed: [1], active: 0, answer: '[[1,2,3],[1,3,2]]', note: '顶层继续 j=1。' } },
        { title: '顶层改选 2', detail: '新的根分支选择 2，后续候选按 1、3 的顺序继续。', state: { values: [1,2,3], path: [2], chosen: [2], removed: [], active: 1, answer: '[[1,2,3],[1,3,2]]', note: '中间分支 [2,1,3]、[2,3,1] 在后续帧中省略。' } },
        { title: '到达最后一个叶子', detail: '省略中间同级分支后，展示最后一条完整路径 [3,2,1]。', state: { values: [1,2,3], path: [3,2,1], chosen: [1], removed: [], active: 0, answer: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2]]', note: '这是实际 DFS 顺序中的第六个排列；active=0 对应当前选择的候选下标。' } },
        { title: '六个排列全部写入 ans', detail: '最后一个叶子也复制到 ans，答案数量达到 3!=6。', state: { values: [1,2,3], path: [3,2,1], chosen: [], removed: [], active: 0, answer: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', note: '每个答案都是独立列表。' } },
        { title: '撤销到根并返回', detail: '剩余调用依次弹出路径元素，dfs(0) 最终返回 ans。', state: { values: [1,2,3], path: [], chosen: [], removed: [3], active: -1, answer: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', note: 'used 恢复全 False。' } }
      ]
    }
  },
  '78': {
    id: 78,
    title: '子集',
    slug: 'subsets',
    difficulty: '中等',
    category: '回溯',
    summary: '对每个独立元素分别决定“选入当前子集”或“跳过”，收集所有可能结果，包括空集。',
    input: '元素互不相同的整数数组 nums，1 <= n <= 10。',
    output: '二维数组，包含 2^n 个子集；顺序任意，但同一子集不能重复。',
    core: 'dfs(i) 先选 nums[i] 并递归到 i+1，撤销后再不选 nums[i] 并递归到 i+1；只在 i==n 时复制路径。',
    walkthrough: 'nums=[1,2,3] 先走全选分支得到 [1,2,3]。撤销 3 后，在 i=2 处走不选分支，得到 [1,2]。再撤销 2 并选 3，得到 [1,3]。这一支结束后得到 [1]。顶层不选 1 后，继续用同样规则处理 2、3，最终还会得到 []。',
    pitfalls: [
      '不选分支也必须调用 dfs(i+1)，否则会停在同一元素上形成无限递归。',
      '选入分支返回后要先 curr.pop()，再进入不选分支，否则两个分支共享错误路径。',
      '记录答案用 curr[:]，避免后续 pop 修改已经保存的子集。',
      '空集也是合法子集；只记录非空路径会漏掉一个答案。'
    ],
    observation: 'n 个互异元素对应 n 次独立的二选一，因此完整决策树恰有 2^n 个叶子，每个叶子就是一个子集。',
    mechanism: '当前实现采用“选在前、不选在后”的深度优先顺序。每次递归前 i 增加 1，所以一条根到叶路径只会对每个下标作出一次决定。ans 只在叶子接收路径副本。',
    invariant: '进入 dfs(i) 时，nums[0..i-1] 的选择已经确定，curr 恰好包含其中被选中的元素；这些元素按原数组顺序排列。',
    termination: '两条递归分支都严格增加 i；i==n 时记录并停止。每层返回前，选入分支追加的元素都会被 pop。',
    counterexample: 'nums=[1,2] 若只递归“选入”分支，会漏掉 []、[2]；若不选分支仍传 dfs(i)，则同一层反复不选，无法结束。',
    naive: '枚举 0 到 2^n-1 的位掩码，再按二进制位构造子集，也能得到全部结果；回溯写法把“构造过程”直接展示成决策树。',
    time: 'O(n · 2^n)',
    timeNote: '共有 2^n 次叶子调用，每次最多复制长度 n 的 curr；内部递归节点总数为 O(2^n)。复制答案的成本已经包含，递归深度为 n。',
    space: 'O(n) 辅助空间；输出 O(n · 2^n)',
    spaceNote: 'curr 与递归栈为 O(n)。ans 中 2^n 个子集平均长度 n/2，所有内层列表共保存 O(n·2^n) 个元素引用。',
    keyLines: [
      { start: 4, end: 12, text: `        def dfs(i):
            if i == n:
                ans.append(curr[:])
                return
            curr.append(nums[i])
            dfs(i + 1)
            curr.pop()
            dfs(i + 1)
        dfs(0)` }
    ],
    challenge: {
      question: '如果 nums 含重复值，怎样让同一组相同元素只产生一个子集？',
      hint: '相同值可能在不同下标、不同“是否选入”历史下到达同一状态。',
      answer: '先排序，并在叶子用 tuple(curr) 组成集合去重；若要保留剪枝，应改成从 start 枚举候选的循环框架，只在同一层跳过重复值。不能直接在固定下标的 include/exclude 框架中加一个局部 prev：例如 [1,1] 会连只含一个 1 的子集也漏掉。'
    },
    similar: [
      { id: 90, title: '子集 II', slug: 'subsets-ii', role: '同类巩固', reason: '需要排序后按候选起点枚举并在同层去重，或对生成结果去重；固定下标的二选一框架不能只靠局部 prev。' },
      { id: 77, title: '组合', slug: 'combinations', role: '前置练习', reason: '只收集固定长度 k 的子集，并增加剩余位置数量剪枝。' },
      { id: 216, title: '组合总和 III', slug: 'combination-sum-iii', role: '进阶挑战', reason: '把子集选择与长度、目标和约束组合起来，继续使用路径回溯。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: [1,2,3] },
      frames: [
        { title: '从空集开始搜索', detail: 'dfs(0) 还没有对任何元素作出决定。', state: { values: [1,2,3], path: [], chosen: [], removed: [], active: -1, answer: '[]', note: '先走选入 1 的分支。' } },
        { title: '选入 1', detail: 'curr=[1]，递归到 i=1。', state: { values: [1,2,3], path: [1], chosen: [1], removed: [], active: 0, answer: '[]', note: '0 号元素已决定选入。' } },
        { title: '选入 2', detail: 'curr=[1,2]，递归到 i=2。', state: { values: [1,2,3], path: [1,2], chosen: [2], removed: [], active: 1, answer: '[]', note: '只剩 3 尚未决定。' } },
        { title: '选入 3', detail: '路径达到 [1,2,3]，下一次调用 i=3。', state: { values: [1,2,3], path: [1,2,3], chosen: [3], removed: [], active: 2, answer: '[]', note: '先走全选分支。' } },
        { title: '记录全子集', detail: 'i==n，复制 [1,2,3] 到 ans。', state: { values: [1,2,3], path: [1,2,3], chosen: [], removed: [], active: 2, answer: '[[1,2,3]]', note: '第一个叶子。' } },
        { title: '撤销 3', detail: '选入分支返回后 pop，路径回到 [1,2]。', state: { values: [1,2,3], path: [1,2], chosen: [], removed: [3], active: 2, answer: '[[1,2,3]]', note: '接着走 i=2 的不选分支。' } },
        { title: '不选 3，记录 [1,2]', detail: 'dfs(3) 复制当前路径，得到第二个子集。', state: { values: [1,2,3], path: [1,2], chosen: [], removed: [3], active: 2, answer: '[[1,2,3],[1,2]]', note: '不选分支不追加元素。' } },
        { title: '撤销 2', detail: '回到 i=1 后 pop 2，路径只剩 [1]。', state: { values: [1,2,3], path: [1], chosen: [], removed: [2], active: 1, answer: '[[1,2,3],[1,2]]', note: 'i=1 改走不选 2。' } },
        { title: '选入 3', detail: '不选 2 后到达 i=2，再选 3，路径为 [1,3]。', state: { values: [1,2,3], path: [1,3], chosen: [3], removed: [], active: 2, answer: '[[1,2,3],[1,2]]', note: '每个下标仍只决定一次。' } },
        { title: '记录 [1,3]', detail: '叶子复制 [1,3]。', state: { values: [1,2,3], path: [1,3], chosen: [], removed: [], active: 2, answer: '[[1,2,3],[1,2],[1,3]]', note: 'ans 已有三个子集。' } },
        { title: '撤销 3', detail: '路径回到 [1]，准备在 i=2 不选 3。', state: { values: [1,2,3], path: [1], chosen: [], removed: [3], active: 2, answer: '[[1,2,3],[1,2],[1,3]]', note: '随后会记录单元素子集。' } },
        { title: '记录 [1]', detail: '不选 3 的叶子复制路径 [1]。', state: { values: [1,2,3], path: [1], chosen: [], removed: [3], active: 3, answer: '[[1,2,3],[1,2],[1,3],[1]]', note: 'i==n，记录当前子集 [1]。' } },
        { title: '撤销 1', detail: '顶层选入分支返回，pop 1，路径清空。', state: { values: [1,2,3], path: [], chosen: [], removed: [1], active: 0, answer: '[[1,2,3],[1,2],[1,3],[1]]', note: '现在走顶层不选 1。' } },
        { title: '不选 1，选入 2', detail: 'i=1 时路径仍为空，随后选 2。', state: { values: [1,2,3], path: [2], chosen: [2], removed: [], active: 1, answer: '[[1,2,3],[1,2],[1,3],[1]]', note: '继续处理 3。' } },
        { title: '选入 3', detail: '路径变为 [2,3]，即将进入叶子。', state: { values: [1,2,3], path: [2,3], chosen: [3], removed: [], active: 2, answer: '[[1,2,3],[1,2],[1,3],[1]]', note: '后续同层分支会补全答案。' } },
        { title: '收齐八个子集', detail: '后续依次记录 [2,3]、[2]、[3]、[]；最后一次弹出的是 3，随后根层不选 1 的分支直接返回。', state: { values: [1,2,3], path: [], chosen: [], removed: [3], active: -1, answer: '[[1,2,3],[1,2],[1,3],[1],[2,3],[2],[3],[]]', note: '2^3=8；顺序与代码的“先选后不选”一致。' } }
      ]
    }
  },
  '17': {
    id: 17,
    title: '电话号码的字母组合',
    slug: 'letter-combinations-of-a-phone-number',
    difficulty: '中等',
    category: '回溯',
    summary: '把每个数字映射到电话按键上的字母，为每个数字选一个字母，组合出所有可能字符串。',
    input: '只含数字 2-9 的字符串 digits，常规约束为 1 <= 长度 <= 4；代码额外处理空字符串。',
    output: '字符串数组；空输入返回 []，其余每个结果长度等于 digits 长度。',
    core: 'dfs(i) 为 digits[i] 枚举 phone 中的字母，追加到 cur 后递归处理下一位，返回时弹出。',
    walkthrough: 'digits="23" 时，先为 2 选 a，再为 3 依次选 d、e、f，得到 ad、ae、af。撤销 3 的选择并撤销 a 后，为 2 改选 b，重复上述过程得到 bd、be、bf。最后以 c 开头得到 cd、ce、cf。',
    pitfalls: [
      '空字符串要直接返回 []；若照常进入 dfs(0)，会错误生成一个空字符串结果。',
      '电话按键 7 和 9 都有四个字母，映射表不能只按三个字母处理。',
      '每次递归返回都要 cur.pop()，否则下一字母会接在旧前缀后面。',
      'ans 保存的是 join(cur) 生成的新字符串，不是会继续变化的 cur 列表。'
    ],
    observation: '每位数字的选择互不影响，答案数量等于各按键字母数的乘积；深度固定为 digits 的长度。',
    mechanism: 'phone 是固定映射表。dfs(i) 在 i==len(digits) 时用 "".join(cur) 生成完整字符串；否则遍历当前数字对应字母，每次只追加一个字符并进入下一位。',
    invariant: '进入 dfs(i) 时，cur 恰好包含 digits[0..i-1] 已选字母，顺序与原数字一致；剩余数字还没有任何字符进入路径。',
    termination: '每次递归严格增加 i，最多调用 d+1 层。每层 for 遍历有限字母表，返回后弹出当前追加字符。',
    counterexample: 'digits="" 的正确答案是 []。如果去掉开头的 if not digits，dfs(0) 会命中叶子并返回 [""]，与题目定义不符。',
    naive: '按输入长度手写多层嵌套循环，短输入尚可，但无法自然扩展到任意长度，而且容易漏掉七键、九键的第四个字母。',
    time: 'O(d · P)',
    timeNote: 'd=len(digits)，P=∏各数字对应字母数。共有 P 个叶子，每个叶子 join 并复制长度 d 的字符串；内部节点工作为 O(P)，递归深度 d，已包含在总界中。',
    space: 'O(d) 辅助空间；输出 O(d · P)',
    spaceNote: 'cur 与递归栈为 O(d)，phone 大小固定。ans 保存 P 个长度 d 的字符串，答案字符复制需要 O(d·P)。',
    keyLines: [
      { start: 3, end: 15, text: `        if not digits:
            return []
        phone = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
        ans, cur = [], []
        def dfs(i):
            if i == len(digits):
                ans.append(''.join(cur))
                return
            for ch in phone[digits[i]]:
                cur.append(ch)
                dfs(i + 1)
                cur.pop()
        dfs(0)` }
    ],
    challenge: {
      question: '如果 digits 可能包含 0 或 1，你希望怎样定义它们的组合行为？',
      hint: '这两个按键没有字母，需要明确是跳过、阻断还是报错。',
      answer: '若沿用电话映射语义，可把 0、1 映射为空字符串并跳过，结果长度会小于 digits；若要求每位必须产生一个字母，则遇到 0、1 应直接返回 []。实现前先固定规则。'
    },
    similar: [
      { id: 22, title: '括号生成', slug: 'generate-parentheses', role: '同类巩固', reason: '同样逐层追加字符、递归、弹出，但候选由计数条件动态限制。' },
      { id: 784, title: '字母大小写全排列', slug: 'letter-case-permutation', role: '同类巩固', reason: '每个字母可能有一个或两个选择，继续使用字符路径回溯。' },
      { id: 77, title: '组合', slug: 'combinations', role: '前置练习', reason: '先练习从候选集合按固定长度选择路径，再理解笛卡尔积式的逐位枚举。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: ['2','3'] },
      frames: [
        { title: '准备处理第一位', detail: 'digits="23"，cur 为空，先为数字 2 选字母。', state: { values: ['2','3'], path: [], chosen: [], removed: [], active: -1, answer: '[]', note: '2 对应 a、b、c。' } },
        { title: '2 选择 a', detail: '追加 a，进入 dfs(1) 处理数字 3。', state: { values: ['2','3'], path: ['a'], chosen: ['a'], removed: [], active: 0, answer: '[]', note: '当前前缀 a。' } },
        { title: '3 选择 d', detail: '追加 d，路径长度达到 2。', state: { values: ['2','3'], path: ['a','d'], chosen: ['d'], removed: [], active: 1, answer: '[]', note: '准备生成第一个字符串。' } },
        { title: '记录 ad', detail: '叶子执行 join(cur)，ans 新增 "ad"。', state: { values: ['2','3'], path: ['a','d'], chosen: [], removed: [], active: 1, answer: '["ad"]', note: '字符串与 cur 列表相互独立。' } },
        { title: '撤销 d', detail: '数字 3 的循环返回后弹出 d，前缀恢复为 a。', state: { values: ['2','3'], path: ['a'], chosen: [], removed: ['d'], active: 1, answer: '["ad"]', note: '下一个字母是 e。' } },
        { title: '3 改选 e', detail: '路径变为 a、e。', state: { values: ['2','3'], path: ['a','e'], chosen: ['e'], removed: [], active: 1, answer: '["ad"]', note: '再次到达叶子。' } },
        { title: '记录 ae', detail: 'ans 新增 "ae"。', state: { values: ['2','3'], path: ['a','e'], chosen: [], removed: [], active: 1, answer: '["ad","ae"]', note: '继续枚举 f。' } },
        { title: '撤销 e', detail: '弹出 e，回到前缀 a。', state: { values: ['2','3'], path: ['a'], chosen: [], removed: ['e'], active: 1, answer: '["ad","ae"]', note: '3 的最后一个字母是 f。' } },
        { title: '3 选择 f', detail: '路径变为 a、f。', state: { values: ['2','3'], path: ['a','f'], chosen: ['f'], removed: [], active: 1, answer: '["ad","ae"]', note: 'af 即将入栈。' } },
        { title: '记录 af', detail: '以 a 开头的三个组合全部收集。', state: { values: ['2','3'], path: ['a','f'], chosen: [], removed: [], active: 1, answer: '["ad","ae","af"]', note: '接着撤销 f 和 a。' } },
        { title: '撤销到空前缀', detail: '先弹出 f，再弹出 a，cur 恢复为空。', state: { values: ['2','3'], path: [], chosen: [], removed: ['a'], active: 0, answer: '["ad","ae","af"]', note: '数字 2 改选 b。' } },
        { title: '2 选择 b', detail: '新根分支以前缀 b 开始。', state: { values: ['2','3'], path: ['b'], chosen: ['b'], removed: [], active: 0, answer: '["ad","ae","af"]', note: '继续枚举 3 的 d、e、f。' } },
        { title: '3 选择 d', detail: '路径 b、d 达到完整长度。', state: { values: ['2','3'], path: ['b','d'], chosen: ['d'], removed: [], active: 1, answer: '["ad","ae","af"]', note: '下一帧记录 bd。' } },
        { title: '记录 bd', detail: 'ans 新增 "bd"。', state: { values: ['2','3'], path: ['b','d'], chosen: [], removed: [], active: 1, answer: '["ad","ae","af","bd"]', note: '其余 b、c 分支继续同层枚举。' } },
        { title: '继续枚举剩余分支', detail: '实际顺序接着是 be、bf、cd、ce、cf；每步都重复追加、递归、弹出。', state: { values: ['2','3'], path: ['c','f'], chosen: [], removed: [], active: 1, answer: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', note: '展示最后一个叶子写入后的状态，随后会弹出 f。' } },
        { title: '返回九个组合', detail: '所有分支撤销完毕，ans 包含 3×3=9 个字符串。', state: { values: ['2','3'], path: [], chosen: [], removed: [], active: -1, answer: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', note: '每个数字恰好贡献一个字母。' } }
      ]
    }
  },
  '39': {
    id: 39,
    title: '组合总和',
    slug: 'combination-sum',
    difficulty: '中等',
    category: '回溯',
    summary: '从互异正整数中可重复选取数字，找出和为目标值的全部组合；同一组合内数字顺序不产生新的方案。',
    input: '无重复正整数数组 candidates 与目标 target；候选值可无限重复使用。',
    output: '二维数组，每个组合之和等于 target；题面保证不同组合少于 150 个。',
    core: '先排序，dfs(i,res) 表示从下标 i 起凑出剩余和 res；选 candidates[i] 时保留 i，不选时进入 i+1。',
    walkthrough: 'candidates=[2,3,6,7]、target=7 排序后，先连续选 2。路径 [2,2,2] 的剩余和为 1，2>1 触发剪枝；撤销一个 2 后选 3，得到 [2,2,3]。之后候选 6 已超过剩余和 3，也直接剪枝。撤销根部的 2 并跳过 2、3、6 后，单独选 7，得到 [7]。',
    pitfalls: [
      '代码实际执行的是 return 之前的 include/exclude 递归；下面带 for 的 start/res 版本只是不可达旧注释。',
      'candidates.sort() 会原地修改输入；candidates[i]>res 的剪枝依赖数组已经有序。',
      '选当前数字时必须继续调用 dfs(i,res-candidates[i])，才能允许同一数字重复使用。',
      'res==0 应立即复制并返回，避免继续添加正整数破坏当前组合。'
    ],
    observation: '排序后，剩余和小于当前最小候选时，后续更大的候选也不可能凑出答案；允许重复但只向前选，则不会生成排列重复。',
    mechanism: '每个状态有两条分支：选当前值，i 不变、res 减少；不选当前值，i 增加、res 不变。cur 在两条分支之间通过 pop 恢复。代码没有备忘录，相同 (i,res) 若由不同路径到达仍会分别搜索。',
    invariant: '进入 dfs(i,res) 时，cur 中候选下标非递减，cur 的元素和等于 target-res，i 是下一次可选的最小下标。',
    termination: '选分支使正整数 res 至少减少 1，不选分支使 i 增加 1；因此递归深度不超过 target/min(candidates)+n。res==0、i==n 或候选值超过 res 都会停止。',
    counterexample: 'candidates=[5,2]、target=4 若不先排序，根处 5>4 会触发 break，后面的 2 根本没有机会被检查，错误漏掉 [2,2]。排序成 [2,5] 后才能正常发现它。',
    naive: '枚举所有长度不超过 target/min(candidates) 的重复序列，再检查和并排序去重，会产生大量排列重复和无效前缀。',
    time: 'O(n log n + B + R · K)',
    timeNote: 'n 为候选数，排序需要 O(n log n)。B 是剪枝后实际访问的 dfs 调用数，每次调用只做常数工作；R 个答案每个最多复制 K=floor(target/min(candidates)) 个元素。没有备忘录，B 不能简单等同于 n·target；递归与答案复制均已计入。',
    space: 'O(n + K) 辅助空间；输出 O(R · K)',
    spaceNote: '排序临时空间最坏 O(n)，cur 与递归栈为 O(K+n)。ans 保存 R 个长度不超过 K 的组合，答案列表复制需要 O(R·K)。',
    keyLines: [
      { start: 4, end: 15, text: `        candidates.sort()
        def dfs(i, res):
            if res == 0:
                ans.append(cur[:])
                return
            if i == len(candidates) or candidates[i] > res:
                return
            cur.append(candidates[i])
            dfs(i, res - candidates[i])
            cur.pop()
            dfs(i + 1, res)
        dfs(0, target)` },
      { start: 17, end: 19, text: `        # candidates.sort()
        # ans, cur = [], []
        # def dfs(start, res):` }
    ],
    challenge: {
      question: '如果每个候选最多使用一次，状态转移需要怎样调整？',
      hint: '重复使用与最多一次的区别，就在选当前值后的下标。',
      answer: '选当前值时调用 dfs(i+1,res-candidates[i])，不选时仍调用 dfs(i+1,res)。若候选含重复值，还要增加同层去重。'
    },
    similar: [
      { id: 40, title: '组合总和 II', slug: 'combination-sum-ii', role: '同类巩固', reason: '候选可能有重复且每个只能用一次，需要同时处理同层去重和下标推进。' },
      { id: 216, title: '组合总和 III', slug: 'combination-sum-iii', role: '同类巩固', reason: '保持组合回溯，但把候选范围、选取个数与目标和一起约束。' },
      { id: 377, title: '组合总和 Ⅳ', slug: 'combination-sum-iv', role: '进阶挑战', reason: '目标从“列出组合”变成“计数顺序”，适合用动态规划比较不同状态定义。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: [2,3,6,7] },
      frames: [
        { title: '排序后从 target=7 开始', detail: 'dfs(0,7) 尚未选择候选，i=0 指向最小值 2。', state: { values: [2,3,6,7], path: [], chosen: [], removed: [], active: 0, answer: '[]', note: '候选已按升序排列。' } },
        { title: '选 2，剩余 5', detail: '追加 2，并用相同的 i=0 递归，允许继续选 2。', state: { values: [2,3,6,7], path: [2], chosen: [2], removed: [], active: 0, answer: '[]', note: 'dfs(0,5)。' } },
        { title: '再选 2，剩余 3', detail: '路径 [2,2]，进入 dfs(0,3)。', state: { values: [2,3,6,7], path: [2,2], chosen: [2], removed: [], active: 0, answer: '[]', note: '仍可继续选 2。' } },
        { title: '第三次选 2，剩余 1', detail: '路径 [2,2,2]，res=1。', state: { values: [2,3,6,7], path: [2,2,2], chosen: [2], removed: [], active: 0, answer: '[]', note: '当前最小候选已经超过剩余和。' } },
        { title: '剪枝：2 > 1', detail: 'res 不为 0，但 candidates[0]>res，直接返回，不记录答案。', state: { values: [2,3,6,7], path: [2,2,2], chosen: [], removed: [], active: 0, answer: '[]', note: '这条前缀不可能凑出 7。' } },
        { title: '撤销一个 2', detail: '返回后 pop，路径恢复 [2,2]，进入不选分支 dfs(1,3)。', state: { values: [2,3,6,7], path: [2,2], chosen: [], removed: [2], active: 0, answer: '[]', note: 'i 即将推进到 1。' } },
        { title: '选 3，剩余 0', detail: '在 i=1 选 3，路径 [2,2,3] 的和正好是 7。', state: { values: [2,3,6,7], path: [2,2,3], chosen: [3], removed: [], active: 1, answer: '[]', note: 'dfs(1,0) 将命中答案条件。' } },
        { title: '记录 [2,2,3]', detail: 'res==0，复制当前路径到 ans 并立即返回。', state: { values: [2,3,6,7], path: [2,2,3], chosen: [], removed: [], active: 1, answer: '[[2,2,3]]', note: '不允许在答案后继续加数。' } },
        { title: '撤销 3', detail: '路径回到 [2,2]，进入 dfs(2,3)。', state: { values: [2,3,6,7], path: [2,2], chosen: [], removed: [3], active: 1, answer: '[[2,2,3]]', note: '下一个候选是 6。' } },
        { title: '剪枝：6 > 3', detail: '剩余和只有 3，当前候选 6 已太大，后续候选更大，也不必检查。', state: { values: [2,3,6,7], path: [2,2], chosen: [], removed: [3], active: 2, answer: '[[2,2,3]]', note: '排序让这次剪枝安全。' } },
        { title: '撤销第二个 2', detail: '返回上层后 pop，路径变为 [2]，进入 dfs(1,5)。', state: { values: [2,3,6,7], path: [2], chosen: [], removed: [2], active: 0, answer: '[[2,2,3]]', note: '尝试用 3 补足剩余 5。' } },
        { title: '选 3 后剩余 2', detail: '路径 [2,3]，但下一个候选仍是 3。', state: { values: [2,3,6,7], path: [2,3], chosen: [3], removed: [], active: 1, answer: '[[2,2,3]]', note: 'dfs(1,2)。' } },
        { title: '剪枝 3 > 2', detail: '无法再选 3；撤销 3 后，i=2 的 6 也大于剩余 5，直接返回。', state: { values: [2,3,6,7], path: [2], chosen: [], removed: [3], active: 1, answer: '[[2,2,3]]', note: '以 2 开头的其他前缀全部结束。' } },
        { title: '撤销 2 并跳到候选 7', detail: '省略根处跳过 2、3、6 的连续不选分支，展示最终选择 7 的状态。', state: { values: [2,3,6,7], path: [7], chosen: [7], removed: [], active: 3, answer: '[[2,2,3]]', note: '7 单独凑出 target。' } },
        { title: '记录 [7]', detail: 'res==0，ans 加入第二个组合。', state: { values: [2,3,6,7], path: [7], chosen: [], removed: [], active: 3, answer: '[[2,2,3],[7]]', note: '随后撤销 7 并走到 i=4。' } },
        { title: '返回两个组合', detail: 'i==len(candidates)，搜索结束，答案按实际 DFS 顺序输出。', state: { values: [2,3,6,7], path: [], chosen: [], removed: [7], active: 4, answer: '[[2,2,3],[7]]', note: '[3,2,2] 等排列不会重复出现。' } }
      ]
    }
  },
  '22': {
    id: 22,
    title: '括号生成',
    slug: 'generate-parentheses',
    difficulty: '中等',
    category: '回溯',
    summary: '生成由 n 个左括号和 n 个右括号组成的全部合法字符串，任何前缀中右括号数都不能超过左括号数。',
    input: '整数 n，1 <= n <= 8。',
    output: '长度为 2n 的字符串数组，包含卡特兰数个合法括号组合。',
    core: 'left<n 时才能加左括号；right<left 时才能加右括号。每次递归返回都弹出刚加的括号。',
    walkthrough: '用 n=2 演示。路径 "((" 时左括号已用完，只能加 ")"，形成 "(()"；再加 ")" 得到 "(())"。撤销这一支后回到 "("，在 right<left 时加 ")" 得到 "()"；随后加 "(" 和 ")" 得到 "()()"。两个结果分别是 "(())"、"()()"。',
    pitfalls: [
      '右括号条件必须写 right<left；只限制总数会生成 ")(" 这样的非法前缀。',
      '左括号也不能无限添加，left<n 用于保证最终恰好 n 对。',
      '递归返回后要 curr.pop()；两条成功分支之间必须恢复同一前缀。',
      '答案通过 join(curr) 生成长度 2n 的新字符串，复制成本不能忽略。'
    ],
    observation: '合法括号串的前缀始终满足 left>=right；只要守住这个条件，最后左右各 n 个时一定合法。',
    mechanism: 'dfs(left,right) 按顺序检查两个 if：先尝试左括号，再尝试右括号。两个条件并不互斥，同一状态可能两支都执行，分别探索两种子树。叶子用 "".join(curr) 保存结果。',
    invariant: '每次调用时 curr 是合法前缀，left、right 分别是其中左右括号数量，且 0<=right<=left<=n。',
    termination: '每次递归使 left+right 增加 1，达到 2n 立即记录。每层两个 if 都只产生有限分支，返回前撤销本次追加。',
    counterexample: 'n=2 若允许 right<left 之外的其他时机加右括号，就可能先得到 ")("；它的第一个前缀右括号比左括号多，已经无法补救。',
    naive: '枚举全部 2^(2n) 个括号序列，再用栈逐个检查合法性，时间和常数都更大；当前写法在生成过程中直接排除非法前缀。',
    time: 'O(n · C_n)',
    timeNote: 'C_n=1/(n+1)·binom(2n,n) 是合法结果数。每个叶子 join 并复制长度 2n 的字符串，内部合法前缀节点总工作为 O(n·C_n)，递归深度 2n 已计入。',
    space: 'O(n) 辅助空间；输出 O(n · C_n)',
    spaceNote: 'curr 与递归栈为 O(n)。ans 保存 C_n 个长度 2n 的字符串，答案字符复制需要 O(n·C_n)。',
    keyLines: [
      { start: 4, end: 15, text: `        def dfs(left, right):
            if left + right == 2 * n:
                ans.append(''.join(curr))
                return
            if left < n:
                curr.append('(')
                dfs(left + 1, right)
                curr.pop()
            if right<left:
                curr.append(')')
                dfs(left, right + 1)
                curr.pop()` }
    ],
    challenge: {
      question: '如果只要求返回合法括号串的数量，能否避免保存所有字符串？',
      hint: '你仍然需要知道每条前缀的左右括号计数，但不必保留完整答案数组。',
      answer: '在 dfs 外定义 total，并在 dfs 内声明 nonlocal total；保留同样的递归和计数条件，把叶子处的 ans.append 改成 total += 1。auxiliary 空间可降到 O(n)，时间仍与访问的合法前缀数同阶。'
    },
    similar: [
      { id: 20, title: '有效的括号', slug: 'valid-parentheses', role: '前置练习', reason: '先用栈判断一个括号串是否合法，再反向理解生成时的前缀约束。' },
      { id: 17, title: '电话号码的字母组合', slug: 'letter-combinations-of-a-phone-number', role: '同类巩固', reason: '共享追加、递归、弹出的字符路径框架，但候选分支由按键映射变成计数规则。' },
      { id: 241, title: '为运算表达式设计优先级', slug: 'different-ways-to-add-parentheses', role: '进阶挑战', reason: '同样按区间拆分枚举结构并合并子问题，但目标从合法字符串变成计算结果集合。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: ['(',')'] },
      frames: [
        { title: 'n=2，空前缀', detail: 'left=right=0，cur 为空。演示使用两对括号以展示完整搜索。', state: { values: ['(',')'], path: [], chosen: [], removed: [], active: -1, answer: '[]', note: 'left<2，先加左括号；active 指向 values 中的候选。' } },
        { title: '加第一个左括号', detail: '路径 "("，left=1、right=0。', state: { values: ['(',')'], path: ['('], chosen: ['('], removed: [], active: 0, answer: '[]', note: '下一层仍可加左括号。' } },
        { title: '加第二个左括号', detail: '路径 "(("，left=2、right=0；左括号已经用完。', state: { values: ['(',')'], path: ['(','('], chosen: ['('], removed: [], active: 0, answer: '[]', note: 'left<2 为假，只检查右括号条件。' } },
        { title: '加第一个右括号', detail: 'right=0<left=2，路径变为 "(()"。', state: { values: ['(',')'], path: ['(','(',')'], chosen: [')'], removed: [], active: 1, answer: '[]', note: 'left=2、right=1。' } },
        { title: '生成 (())', detail: 'right=1<left=2，再加 ")"，长度达到 4。', state: { values: ['(',')'], path: ['(','(',')',')'], chosen: [')'], removed: [], active: 1, answer: '[]', note: '第一个合法叶子。' } },
        { title: '记录 (())', detail: '叶子 join 当前路径，ans 新增 "(())"。', state: { values: ['(',')'], path: ['(','(',')',')'], chosen: [], removed: [], active: 1, answer: '["(())"]', note: '随后开始撤销。' } },
        { title: '撤销最后一个右括号', detail: '路径回到 "(()"，left=2、right=1。', state: { values: ['(',')'], path: ['(','(',')'], chosen: [], removed: [')'], active: 1, answer: '["(())"]', note: '这一层已没有其他选择。' } },
        { title: '再撤销一个右括号', detail: '路径回到 "(("，left=2、right=0。', state: { values: ['(',')'], path: ['(','('], chosen: [], removed: [')'], active: 1, answer: '["(())"]', note: 'dfs(2,0) 的右括号分支结束。' } },
        { title: '撤销第二个左括号', detail: '返回 dfs(1,0) 后 pop，路径回到 "("。', state: { values: ['(',')'], path: ['('], chosen: [], removed: ['('], active: 0, answer: '["(())"]', note: '现在 left=1、right=0。' } },
        { title: '改加右括号', detail: 'right<left，路径变为 "()"。', state: { values: ['(',')'], path: ['(',')'], chosen: [')'], removed: [], active: 1, answer: '["(())"]', note: 'left=1、right=1。' } },
        { title: '加新的左括号', detail: 'left<2，路径变为 "()("。', state: { values: ['(',')'], path: ['(',')','('], chosen: ['('], removed: [], active: 0, answer: '["(())"]', note: 'left=2、right=1。' } },
        { title: '生成 ()()', detail: 'right<left，再加右括号，得到第二个完整结果。', state: { values: ['(',')'], path: ['(',')','(',')'], chosen: [')'], removed: [], active: 1, answer: '["(())"]', note: 'left+right=4。' } },
        { title: '记录 ()()', detail: 'ans 新增 "()()"，两个叶子都已收集。', state: { values: ['(',')'], path: ['(',')','(',')'], chosen: [], removed: [], active: 1, answer: '["(())","()()"]', note: '结果顺序与先左后右的 DFS 一致。' } },
        { title: '撤销到空路径', detail: '剩余调用依次 pop，最后根层弹出左括号，路径清空。', state: { values: ['(',')'], path: [], chosen: [], removed: ['('], active: 0, answer: '["(())","()()"]', note: '根处 right<left 为假，搜索结束。' } }
      ]
    }
  },
  '79': {
    id: 79,
    title: '单词搜索',
    slug: 'word-search',
    difficulty: '中等',
    category: '回溯',
    summary: '从网格任意格出发，按上下左右相邻路径拼出单词；同一格不能在一条路径中重复使用。',
    input: 'm×n 字符网格 board 与字符串 word，1<=m,n<=6，1<=word.length<=15。',
    output: '布尔值：存在一条合法路径返回 true，所有起点都失败返回 false。board 在搜索结束后恢复原样。',
    core: 'dfs(i,j,k) 先检查边界和字符；匹配且不是最后字符时把当前格标成 "#"，按固定方向顺序递归，最后恢复字符。',
    walkthrough: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]、word="ABCCED"。从 (0,0) 的 A 开始，向下 S 不匹配，于是向右到 B，再向右到 C，向下到第二个 C，再向下到 E，最后向右到 D，六个字母按顺序拼成 ABCCED。沿途祖先格用 "#" 防止重复使用。',
    pitfalls: [
      '边界检查与 board[i][j] 访问必须放在同一短路条件中，否则越界坐标会先触发 IndexError。',
      '最后一个匹配字符在 k==len(word)-1 时直接返回 True，不写 "#"；祖先仍会在返回后恢复。',
      '每次递归返回都要执行 board[i][j]=word[k]，失败分支也不能漏恢复。',
      'any(...) 按行优先顺序尝试起点，找到 True 后立即停止，不会继续搜索其他起点。'
    ],
    observation: '当前格标记为 "#" 后，路径就不能绕回来重复使用同一格；递归返回时恢复，则不妨碍另一条分支重新使用它。',
    mechanism: 'dfs 的边界或字符不匹配会直接 False。匹配最后字符时 True；否则写 "#"，按下、上、右、左顺序用 or 短路调用，恢复当前格后返回 found。or 会在第一个成功方向停止。',
    invariant: '在递归探索邻居期间，当前路径已使用且尚未返回的祖先格都为 "#"；它们对应 word 的一个前缀，当前格也已在探索前匹配 word[k]。',
    termination: '每次递归使 k 增加 1，最多到 len(word)-1；越界或不匹配立即返回。每个起点调用有限，any 遍历 mn 个起点后结束。',
    counterexample: 'board=[["A","B"],["C","D"]]、word="ABA"。唯一路径是 A→B→A，但第二个 A 会重复使用 (0,0)；正确结果是 false。去掉 "#" 标记会错误返回 true。',
    naive: '从每个起点枚举所有长度 L 的简单路径，最后才整体比较字符串，会产生大量早已在前缀处就能排除的路径。',
    time: 'O(mn · 4^L)',
    timeNote: 'N=mn，L=len(word)。每个起点最多探索四叉、深度 L 的路径；实际字符检查会剪掉大量分支，但最坏仍为 O(N·4^L)。递归深度 L 已包含在该枚举中，返回布尔值只需 O(1)。',
    space: 'O(L)',
    spaceNote: '递归栈深度为 L；访问标记直接写在 board 中，不需要额外路径或 visited 数组。答案是布尔值，没有答案复制。',
    keyLines: [
      { start: 4, end: 13, text: `        def dfs(i, j, k):
            if not(0 <= i < m and 0 <= j < n) or board[i][j] != word[k]:
                return False
            if k == len(word) - 1:
                return True
            board[i][j] = '#'
            found = (dfs(i + 1, j, k + 1) or dfs(i - 1, j, k + 1) or dfs(i, j + 1, k + 1) or dfs(i, j-1, k+1))
            board[i][j] = word[k]
            return found
        return any(dfs(i,j,0) for i in range(m) for j in range(n)) ` }
    ],
    challenge: {
      question: '如果要同时搜索很多单词，怎样避免每个单词都独立重复遍历网格？',
      hint: '把多个单词的公共前缀合并成一棵树，并让网格 DFS 沿这棵树前进。',
      answer: '用 Trie 保存所有单词，在格子 DFS 中同时沿 Trie 子节点匹配；找到单词后记录并删除对应终端，可显著共享公共前缀搜索。'
    },
    similar: [
      { id: 212, title: '单词搜索 II', slug: 'word-search-ii', role: '进阶挑战', reason: '在相同网格回溯上加入 Trie，一次搜索多个单词并共享前缀。' },
      { id: 130, title: '被围绕的区域', slug: 'surrounded-regions', role: '同类巩固', reason: '同样在网格上标记、四方向递归、恢复状态，但目标是连通块而不是字符串路径。' },
      { id: 489, title: '扫地机器人', slug: 'robot-room-cleaner', role: '进阶挑战', reason: '在未知网格中执行 DFS 回溯，重点转向方向状态与访问标记的生命周期。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: ['A','B','C','C','E','D'], board: ['ABCE','SFCS','ADEE'] },
      frames: [
        { title: '从 (0,0) 尝试 A', detail: 'any 的第一个起点是 A，恰好匹配 word[0]。', state: { values: ['A','B','C','C','E','D'], board: ['ABCE','SFCS','ADEE'], path: [], chosen: [], removed: [], active: 0, answer: '搜索中', cursor: [0,0], note: '入口先检查边界和字符，再决定是否标记。' } },
        { title: '匹配 A', detail: '当前格通过检查，path 记录 A；它不是最后字符，下一步会写成 "#"。', state: { values: ['A','B','C','C','E','D'], board: ['ABCE','SFCS','ADEE'], path: ['A'], chosen: ['A'], removed: [], active: 0, answer: '搜索中', cursor: [0,0], note: 'word[0]=A。' } },
        { title: '标记 A，向下失败', detail: '按代码顺序先试下方 (1,0)，S 不等于 word[1]=B。', state: { values: ['A','B','C','C','E','D'], board: ['#BCE','SFCS','ADEE'], path: ['A'], chosen: [], removed: ['S'], active: 1, answer: '搜索中', cursor: [1,0], note: '不匹配分支没有修改 S 所在格。' } },
        { title: '向右匹配 B', detail: '上方越界后继续试右方 (0,1)，B 匹配并标记。', state: { values: ['A','B','C','C','E','D'], board: ['##CE','SFCS','ADEE'], path: ['A','B'], chosen: ['B'], removed: [], active: 1, answer: '搜索中', cursor: [0,1], note: 'path=AB。' } },
        { title: '向下 F 不匹配', detail: '从 B 向下检查 (1,1)，F 不等于 word[2]=C。', state: { values: ['A','B','C','C','E','D'], board: ['##CE','SFCS','ADEE'], path: ['A','B'], chosen: [], removed: ['F'], active: 2, answer: '搜索中', cursor: [1,1], note: '继续尝试右方。' } },
        { title: '向右匹配第一个 C', detail: '(0,2) 的 C 匹配 word[2]，路径变为 ABC。', state: { values: ['A','B','C','C','E','D'], board: ['###E','SFCS','ADEE'], path: ['A','B','C'], chosen: ['C'], removed: [], active: 2, answer: '搜索中', cursor: [0,2], note: '当前 C 已标记，防止再次使用。' } },
        { title: '向下匹配第二个 C', detail: '(1,2) 的 C 匹配 word[3]，路径为 ABCC。', state: { values: ['A','B','C','C','E','D'], board: ['###E','S#CS','ADEE'], path: ['A','B','C','C'], chosen: ['C'], removed: [], active: 3, answer: '搜索中', cursor: [1,2], note: '两个 C 来自不同格子。' } },
        { title: '向下匹配 E', detail: '(2,2) 的 E 匹配 word[4]，路径为 ABCCE。', state: { values: ['A','B','C','C','E','D'], board: ['###E','S#CS','AD#E'], path: ['A','B','C','C','E'], chosen: ['E'], removed: [], active: 4, answer: '搜索中', cursor: [2,2], note: 'word[5]=D；下方越界、上方为已标记格，接下来检查右方。' } },
        { title: '向右匹配最后字符', detail: '(2,3) 的 D 匹配 word[5]，k 已到最后一位，直接返回 True。', state: { values: ['A','B','C','C','E','D'], board: ['###E','S#CS','AD#E'], path: ['A','B','C','C','E','D'], chosen: ['E'], removed: [], active: 5, answer: 'true', cursor: [2,3], note: '最后格不会写成 "#"；or 短路停止其他方向。' } },
        { title: '恢复棋盘并返回', detail: '祖先调用逐层执行 board[i][j]=word[k]，所有 "#" 恢复成原字符；any 收到 True。', state: { values: ['A','B','C','C','E','D'], board: ['ABCE','SFCS','ADEE'], path: ['A','B','C','C','E','D'], chosen: [], removed: [], active: 5, answer: 'true', cursor: [-1,-1], note: 'path 仅展示成功路线；实际提交没有路径列表。成功路线为 A(0,0)→B(0,1)→C(0,2)→C(1,2)→E(2,2)→D(2,3)。' } }
      ]
    }
  },
  '131': {
    id: 131,
    title: '分割回文串',
    slug: 'palindrome-partitioning',
    difficulty: '中等',
    category: '回溯',
    summary: '把字符串切成若干非空子串，使每一段都是回文，并返回所有不同切割方案。',
    input: '小写英文字母字符串 s，1 <= len(s) <= 16。',
    output: '二维字符串数组；每个内层数组按顺序拼接后等于 s，且每段正读反读相同。',
    core: 'dfs(i) 从 i 开始枚举右端点 j；s[i:j+1] 是回文就追加并递归到 j+1，否则跳过，返回后弹出。',
    walkthrough: 's="aab" 时，先切出开头 "a"，再从剩余 "ab" 切出 "a"，最后切 "b"，得到 ["a","a","b"]。回到开头改切 "aa"，剩余只有 "b"，得到 ["aa","b"]。"ab" 与 "aab" 都不是回文，因此不会产生更多方案。',
    pitfalls: [
      '切片右端点必须写 j+1；漏掉 1 会少取一个字符。',
      '单字符也是回文，不能把长度 1 误判为不可选。',
      '非回文片段只跳过，不进入递归；进入递归后仍需 cur.pop() 恢复。',
      '叶子用 cur[:] 复制列表；直接保存 cur 会被后续弹出破坏。'
    ],
    observation: '切割位置是逐个决定的。当前前缀已经由若干回文段组成后，只需在剩余后缀中继续寻找第一个回文段。',
    mechanism: 'for j 从 i 枚举到 n-1，每次构造 piece=s[i:j+1]，用 piece==piece[::-1] 判断回文。只有通过检查的片段才进入 cur 和下一层 DFS。',
    invariant: '进入 dfs(i) 时，cur 中每段都是回文，且按顺序拼接恰好等于 s[:i]；i 是尚未处理的后缀起点。',
    termination: '递归调用总是把 i 更新为更大的 j+1；i==n 时记录答案。每层 j 严格递增，所有已选片段在返回前弹出。',
    counterexample: 's="ab" 的正确答案是 [["a","b"]]：虽然整串不是回文，但两个单字符都是回文段。只检查整串再输出会错误地给出 []。',
    naive: '枚举 n-1 个间隙的 2^(n-1) 种切割，再逐段检查回文，可行但会构造大量含非回文段的候选。',
    time: 'O(n² · 2^n)',
    timeNote: 'n=len(s)。搜索树有 O(2^n) 个节点；在长度为 m 的后缀上，代码会构造并反转 O(m) 个总长度 O(m²) 的候选片段，所有节点合计最坏 O(n²·2^n)。答案复制为 O(n·2^n)，已包含在该界中；递归深度 n 也已计入。',
    space: 'O(n) 辅助空间；输出 O(n · 2^n)',
    spaceNote: 'cur、各层当前切片与递归栈合计 O(n)。ans 保存所有分割列表，答案中的回文片段总字符数为 O(n·2^n)，并另有列表引用开销。',
    keyLines: [
      { start: 5, end: 14, text: `        def dfs(i):
            if i == n:
                ans.append(cur[:])
                return 
            for j in range(i,n):
                piece = s[i:j+1]
                if piece == piece[::-1]:
                    cur.append(piece)
                    dfs(j + 1)
                    cur.pop()` }
    ],
    challenge: {
      question: '如果只要求最少切几刀，怎样把“枚举所有方案”改成求最优值？',
      hint: '同一后缀可能被很多前缀重复到达，适合保存子问题答案。',
      answer: '预处理回文表，再定义 dp[i] 为 s[i:] 的最少段数，枚举回文片段做最小值转移；这属于分割回文串 II 的动态规划思路。'
    },
    similar: [
      { id: 132, title: '分割回文串 II', slug: 'palindrome-partitioning-ii', role: '进阶挑战', reason: '保留回文片段枚举，但目标从收集所有方案变成最小化切割次数。' },
      { id: 647, title: '回文子串', slug: 'palindromic-substrings', role: '前置练习', reason: '练习中心扩展法枚举回文，可用来预处理本题所有回文片段。' },
      { id: 5, title: '最长回文子串', slug: 'longest-palindromic-substring', role: '同类巩固', reason: '同样围绕回文边界判断，但只保留最长片段而不是枚举全部分割。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: ['a','a','b'] },
      frames: [
        { title: '从 i=0 枚举片段', detail: 'dfs(0) 尚未切割，先检查 s[0:1]="a"。', state: { values: ['a','a','b'], path: [], chosen: [], removed: [], active: 0, answer: '[]', note: '单字符 a 是回文。' } },
        { title: '切出开头 a', detail: '追加 "a"，递归到 i=1。', state: { values: ['a','a','b'], path: ['a'], chosen: ['a'], removed: [], active: 0, answer: '[]', note: '已处理前缀 s[:1]。' } },
        { title: '切出第二个 a', detail: 'i=1 时枚举 j=1，片段 s[1:2]="a"，递归到 i=2。', state: { values: ['a','a','b'], path: ['a','a'], chosen: ['a'], removed: [], active: 1, answer: '[]', note: '剩余后缀只有 b。' } },
        { title: '切出 b', detail: 'i=2 选择 s[2:3]="b"，路径覆盖整串。', state: { values: ['a','a','b'], path: ['a','a','b'], chosen: ['b'], removed: [], active: 2, answer: '[]', note: '下一次调用 i=3。' } },
        { title: '记录第一种分割', detail: 'i==n，ans 复制 ["a","a","b"]。', state: { values: ['a','a','b'], path: ['a','a','b'], chosen: [], removed: [], active: 2, answer: '[["a","a","b"]]', note: '第一片分支结束。' } },
        { title: '撤销 b', detail: '叶子返回后 pop，路径回到 ["a","a"]。', state: { values: ['a','a','b'], path: ['a','a'], chosen: [], removed: ['b'], active: 2, answer: '[["a","a","b"]]', note: 'i=2 已无其他右端点。' } },
        { title: '撤销第二个 a', detail: '返回 i=1 后 pop，路径只剩开头的 a。', state: { values: ['a','a','b'], path: ['a'], chosen: [], removed: ['a'], active: 1, answer: '[["a","a","b"]]', note: '继续枚举 i=1 的 j=2。' } },
        { title: '剪枝 ab', detail: 's[1:3]="ab" 不等于反转 "ba"，跳过，不递归。', state: { values: ['a','a','b'], path: ['a'], chosen: [], removed: [], active: 1, answer: '[["a","a","b"]]', note: '以首段 a 开头的方案只有已记录的一种。' } },
        { title: '撤销开头 a', detail: '返回 dfs(0) 后 pop，路径清空。', state: { values: ['a','a','b'], path: [], chosen: [], removed: ['a'], active: 0, answer: '[["a","a","b"]]', note: '根层继续 j=1。' } },
        { title: '改切 aa', detail: 's[0:2]="aa" 是回文，追加后递归到 i=2。', state: { values: ['a','a','b'], path: ['aa'], chosen: ['aa'], removed: [], active: 0, answer: '[["a","a","b"]]', note: '剩余后缀为 b。' } },
        { title: '切出剩余 b', detail: '选择 s[2:3]="b"，路径 ["aa","b"] 覆盖整串。', state: { values: ['a','a','b'], path: ['aa','b'], chosen: ['b'], removed: [], active: 2, answer: '[["a","a","b"]]', note: '第二个叶子。' } },
        { title: '记录第二种分割', detail: 'ans 新增 ["aa","b"]。', state: { values: ['a','a','b'], path: ['aa','b'], chosen: [], removed: [], active: 2, answer: '[["a","a","b"],["aa","b"]]', note: '所有合法方案已找齐。' } },
        { title: '撤销 b', detail: 'pop 后路径恢复 ["aa"]。', state: { values: ['a','a','b'], path: ['aa'], chosen: [], removed: ['b'], active: 2, answer: '[["a","a","b"],["aa","b"]]', note: 'i=2 的循环结束。' } },
        { title: '撤销 aa', detail: '返回根层后 pop，路径清空。', state: { values: ['a','a','b'], path: [], chosen: [], removed: ['aa'], active: 0, answer: '[["a","a","b"],["aa","b"]]', note: '根层还剩 j=2。' } },
        { title: '剪枝 aab', detail: 's[0:3]="aab" 不是回文，根层循环结束。', state: { values: ['a','a','b'], path: [], chosen: [], removed: [], active: 0, answer: '[["a","a","b"],["aa","b"]]', note: '没有其他可递归片段。' } },
        { title: '返回两种方案', detail: 'dfs(0) 返回 ans，每个内层列表互不共享可变路径。', state: { values: ['a','a','b'], path: [], chosen: [], removed: [], active: 3, answer: '[["a","a","b"],["aa","b"]]', note: 'active=3 表示已处理到字符串末尾。' } }
      ]
    }
  },
  '51': {
    id: 51,
    title: 'N 皇后',
    slug: 'n-queens',
    difficulty: '困难',
    category: '回溯',
    summary: '在 n×n 棋盘上每行放一个皇后，使任意两个皇后都不共列、不共主对角线、不共副对角线，并返回全部摆法。',
    input: '整数 n，1 <= n <= 9。',
    output: '二维字符串数组；每个解包含 n 行，"Q" 表示皇后，"." 表示空位。',
    core: '逐行回溯，用 cols 记录已用列，d1 记录 r-c，d2 记录 r+c；三个集合都不冲突才放置。',
    walkthrough: 'n=4 时第一行若放 c=0，第二行 c=0 共列、c=1 共对角线，只能试 c=2；但第三行随后四列都被冲突挡住，只能撤销。改试第二行 c=3 后，第三行放 c=1，最后一行仍无合法位置，继续撤销。完整搜索最终得到列序列 [1,3,0,2] 和 [2,0,3,1]。',
    pitfalls: [
      '同一列冲突用 c 判断；两条对角线分别用 r-c、r+c 判断，三个集合缺一不可。',
      '递归返回后必须同时 pop 皇后并从 cols、d1、d2 删除对应值，漏删会污染后续分支。',
      '每行只放一个皇后，因此不需要额外的行集合；r 本身就是当前行。',
      '生成答案会创建 n 个长度为 n 的新字符串，答案复制空间不能按 O(1) 计算。'
    ],
    observation: '同一行天然不会互相攻击，所以问题缩小为每行选择一个列。对角线在 (r,c) 上分别由 r-c 和 r+c 唯一标识。',
    mechanism: 'dfs(r) 枚举当前行 c，若 c、r-c、c+r 任一在集合中就 continue；否则把列号加入 queens 并更新三个集合，递归下一行后全部撤销。叶子把 queens 的每列转换成字符串行。',
    invariant: '进入 dfs(r) 时，queens 保存第 0..r-1 行已选列，长度恰为 r；三个集合恰好记录这些皇后占据的列与两种对角线。',
    termination: '每次放置递归使 r 增加 1，r==n 时生成答案并停止；当前行 n 列试完后返回。每层撤销保证搜索树能完整回退。',
    counterexample: '若只检查 cols，(0,0) 与 (1,1) 不共列却共主对角线，会被错误接受。d1 中两者都对应 r-c=0，因此能提前剪枝。',
    naive: '枚举每行的 n 个列，共 n^n 个摆法，再两两检查皇后是否攻击，搜索和验证成本都远大于逐行剪枝。',
    time: 'O(n! + n² · S)',
    timeNote: 'n 行各选一列且列互异的搜索树节点总数不超过 ∑n!/(n-k)!=O(n!)，集合操作按平均 O(1)。S 是解数；每个解构造 n 个长度 n 的字符串，答案生成需 O(n²·S)。递归深度 n 已包含。',
    space: 'O(n) 辅助空间；输出 O(n² · S)',
    spaceNote: 'queens 与三个集合各 O(n)，递归栈 O(n)。ans 保存 S 个棋盘，每个棋盘 n² 个字符，答案字符串复制需 O(n²·S)，另加列表引用开销。',
    keyLines: [
      { start: 5, end: 20, text: `        def dfs(r):
            if r == n:
                ans.append(['.'*c + 'Q' + '.'*(n - c- 1) for c in queens])
                return 
            for c in range(n):
                if c in cols or r-c in d1 or c+r in d2:
                    continue
                queens.append(c)
                cols.add(c)
                d1.add(r - c)
                d2.add(r + c)
                dfs(r + 1)
                queens.pop()
                cols.remove(c)
                d1.remove(r-c)
                d2.remove(r+c)` }
    ],
    challenge: {
      question: '如果只要求解的数量，怎样避免为每个解构造棋盘字符串？',
      hint: '搜索与冲突判断完全相同，变化只发生在叶子。',
      answer: '在 dfs 外定义 total，并在 dfs 内声明 nonlocal total；把叶子处的 ans.append([...]) 改成 total += 1，保留 queens 与三个集合。辅助空间仍为 O(n)，省去全部答案字符串。'
    },
    similar: [
      { id: 52, title: 'N 皇后 II', slug: 'n-queens-ii', role: '同类巩固', reason: '复用完全相同的行列对角线冲突集合，只把叶子输出改成计数。' },
      { id: 37, title: '解数独', slug: 'sudoku-solver', role: '进阶挑战', reason: '同样逐格放置并在失败后撤销，但约束扩展到行、列和九宫格。' },
      { id: 36, title: '有效的数独', slug: 'valid-sudoku', role: '前置练习', reason: '练习用集合编码行、列、宫格约束，为更复杂的回溯搜索打基础。' }
    ],
    viz: {
      family: 'backtrack',
      data: { values: [0,1,2,3], board: ['....','....','....','....'] },
      frames: [
        { title: '第 0 行开始', detail: '三个冲突集合为空，从 c=0 试起。', state: { values: [0,1,2,3], path: [], chosen: [], removed: [], active: 0, answer: '0 个解', board: ['....','....','....','....'], cursor: [0,0], note: 'n=4。' } },
        { title: '第 0 行放 c=0', detail: 'cols={0}、d1={0}、d2={0}，进入第 1 行。', state: { values: [0,1,2,3], path: [0], chosen: [0], removed: [], active: 0, answer: '0 个解', board: ['Q...','....','....','....'], cursor: [1,0], note: 'c=0 共列，c=1 共对角线。' } },
        { title: '第 1 行放 c=2', detail: '前两个候选被剪枝，c=2 合法，path=[0,2]。', state: { values: [0,1,2,3], path: [0,2], chosen: [2], removed: [], active: 1, answer: '0 个解', board: ['Q...','..Q.','....','....'], cursor: [2,0], note: 'd1 当前含 0、-1；d2 含 0、3。' } },
        { title: '第 2 行四列全冲突', detail: 'c=0、2 共列，c=1 共副对角线，c=3 共主对角线。', state: { values: [0,1,2,3], path: [0,2], chosen: [], removed: [], active: 2, answer: '0 个解', board: ['Q...','..Q.','....','....'], cursor: [2,3], note: '没有可放置位置，必须回退。' } },
        { title: '撤销第 1 行的 2', detail: '弹出 c=2，并从 cols、d1、d2 删除对应值。', state: { values: [0,1,2,3], path: [0], chosen: [], removed: [2], active: 1, answer: '0 个解', board: ['Q...','....','....','....'], cursor: [1,3], note: '第 1 行继续试 c=3。' } },
        { title: '第 1 行改放 c=3', detail: 'c=3 合法，path=[0,3]。', state: { values: [0,1,2,3], path: [0,3], chosen: [3], removed: [], active: 1, answer: '0 个解', board: ['Q...','...Q','....','....'], cursor: [2,0], note: '进入第 2 行。' } },
        { title: '第 2 行放 c=1', detail: 'c=0 共列，c=1 合法，path=[0,3,1]。', state: { values: [0,1,2,3], path: [0,3,1], chosen: [1], removed: [], active: 2, answer: '0 个解', board: ['Q...','...Q','.Q..','....'], cursor: [3,0], note: '检查最后一行。' } },
        { title: '第 3 行仍被封锁', detail: 'c=0 共列，c=1 共列，c=2 共主对角线，c=3 共副对角线。', state: { values: [0,1,2,3], path: [0,3,1], chosen: [], removed: [], active: 3, answer: '0 个解', board: ['Q...','...Q','.Q..','....'], cursor: [3,3], note: '继续撤销第 2 行。' } },
        { title: '撤销 c=1', detail: 'path 回到 [0,3]，三个集合同步删除 c=1 的约束。', state: { values: [0,1,2,3], path: [0,3], chosen: [], removed: [1], active: 2, answer: '0 个解', board: ['Q...','...Q','....','....'], cursor: [2,2], note: 'c=2 共主对角线，继续试 c=3。' } },
        { title: '第 2 行剪枝 c=3', detail: '撤销 c=1 后，c=2 与 (0,0) 共主对角线，c=3 又与 (1,3) 共列。', state: { values: [0,1,2,3], path: [0,3], chosen: [], removed: [], active: 2, answer: '0 个解', board: ['Q...','...Q','....','....'], cursor: [2,3], note: '两个候选都直接 continue，不会写入 queens。' } },
        { title: '撤销第 1 行 c=3', detail: '第 2 行已试完，返回第 1 行并删除 c=3。', state: { values: [0,1,2,3], path: [0], chosen: [], removed: [3], active: 1, answer: '0 个解', board: ['Q...','....','....','....'], cursor: [1,3], note: '第 1 行也没有其他候选。' } },
        { title: '返回第 0 行', detail: '第 1 行循环结束，根路径仍保留 c=0，准备尝试下一个根候选。', state: { values: [0,1,2,3], path: [0], chosen: [], removed: [3], active: 0, answer: '0 个解', board: ['Q...','....','....','....'], cursor: [0,1], note: '从第 1 行正常返回，没有留下额外约束。' } },
        { title: '撤销第 0 行 c=0', detail: '根路径清空，三个集合全部恢复为空。', state: { values: [0,1,2,3], path: [], chosen: [], removed: [0], active: 0, answer: '0 个解', board: ['....','....','....','....'], cursor: [0,1], note: '顶层继续试 c=1。' } },
        { title: '到达第二个叶子', detail: '第一个解已记录但省略展示；当前第二条完整路径的列序列为 [2,0,3,1]。', state: { values: [0,1,2,3], path: [2,0,3,1], chosen: [1], removed: [], active: 3, answer: '1 个解', board: ['..Q.','Q...','...Q','.Q..'], cursor: [3,1], note: '叶子即将执行 ans.append；第一个解是 [1,3,0,2]。' } },
        { title: '生成第二个棋盘', detail: 'r==n，queens 的每个列号转换成一行字符串并复制到 ans。', state: { values: [0,1,2,3], path: [2,0,3,1], chosen: [], removed: [], active: 3, answer: '2 个解', board: ['..Q.','Q...','...Q','.Q..'], cursor: [3,1], note: '两个解分别是 [1,3,0,2] 与 [2,0,3,1]。' } },
        { title: '撤销到根并返回', detail: '剩余调用逐层恢复集合，最终返回两个独立棋盘。', state: { values: [0,1,2,3], path: [], chosen: [], removed: [2], active: 4, answer: '2 个解：列序列 [1,3,0,2]、[2,0,3,1]', board: ['....','....','....','....'], cursor: [-1,-1], note: 'queens、cols、d1、d2 均已清空；最后弹出的是根层候选 c=2。' } }
      ]
    }
  }
};

export const SOURCES = [
  'https://leetcode.cn/problems/number-of-islands/',
  'https://leetcode.cn/problems/course-schedule/',
  'https://leetcode.cn/problems/permutations/',
  'https://leetcode.cn/problems/subsets/',
  'https://leetcode.cn/problems/letter-combinations-of-a-phone-number/',
  'https://leetcode.cn/problems/combination-sum/',
  'https://leetcode.cn/problems/generate-parentheses/',
  'https://leetcode.cn/problems/word-search/',
  'https://leetcode.cn/problems/palindrome-partitioning/',
  'https://leetcode.cn/problems/n-queens/',
  'https://leetcode.cn/problems/max-area-of-island/',
  'https://leetcode.cn/problems/surrounded-regions/',
  'https://leetcode.cn/problems/number-of-enclaves/',
  'https://leetcode.cn/problems/course-schedule-ii/',
  'https://leetcode.cn/problems/minimum-height-trees/',
  'https://leetcode.cn/problems/find-eventual-safe-states/',
  'https://leetcode.cn/problems/permutations-ii/',
  'https://leetcode.cn/problems/combinations/',
  'https://leetcode.cn/problems/next-permutation/',
  'https://leetcode.cn/problems/subsets-ii/',
  'https://leetcode.cn/problems/combination-sum-iii/',
  'https://leetcode.cn/problems/letter-case-permutation/',
  'https://leetcode.cn/problems/combination-sum-ii/',
  'https://leetcode.cn/problems/combination-sum-iv/',
  'https://leetcode.cn/problems/valid-parentheses/',
  'https://leetcode.cn/problems/different-ways-to-add-parentheses/',
  'https://leetcode.cn/problems/word-search-ii/',
  'https://leetcode.cn/problems/robot-room-cleaner/',
  'https://leetcode.cn/problems/palindrome-partitioning-ii/',
  'https://leetcode.cn/problems/palindromic-substrings/',
  'https://leetcode.cn/problems/longest-palindromic-substring/',
  'https://leetcode.cn/problems/n-queens-ii/',
  'https://leetcode.cn/problems/sudoku-solver/',
  'https://leetcode.cn/problems/valid-sudoku/'
] as const;
