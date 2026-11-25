import type { Guide } from '../types';

type FrameExtra = {
  queue?: number[];
  path?: number[];
  dp?: Record<string, number | string>;
};

function treeFrame(
  values: (number | null)[],
  title: string,
  detail: string,
  active: (number | null)[],
  visited: number[],
  returned: string,
  note: string,
  extra: FrameExtra = {}
) {
  return {
    title,
    detail,
    state: {
      values: [...values],
      active: [...active],
      visited: [...visited],
      queue: extra.queue ?? [],
      returned,
      note: `${note} active=${active.length ? active.join(',') : '[]'} 表示本帧正在检查、返回或拼接的节点；多个值表示同帧涉及的多个调用位置；镜像题中表示一对镜像节点，重复值须结合调用位置区分。`,
      ...(extra.path ? { path: [...extra.path] } : {}),
      ...(extra.dp ? { dp: { ...extra.dp } } : {})
    }
  };
}

export const guides: Record<string, Guide> = {
  '94': {
    id: 94,
    title: '二叉树的中序遍历',
    slug: 'binary-tree-inorder-traversal',
    difficulty: '简单',
    category: '二叉树',
    summary: '递归遍历左子树、访问当前节点、再遍历右子树。实际提交是递归版，并没有采用题目进阶要求的显式栈迭代写法。',
    input: '二叉树的根节点 root，节点值可重复，也可以为空树。',
    output: '按中序顺序排列的整数数组；空树返回空数组。',
    core: '把访问动作夹在两次递归调用之间，使每个非空节点都遵循“左—根—右”。',
    walkthrough: '层序数组 [1,2,3,null,4,null,5] 中，4 是节点 2 的右孩子，5 是节点 3 的右孩子。dfs(1) 先访问左子树：2 的左孩子为空，输出 2，再输出右孩子 4；回到根输出 1；最后进入右子树 3，其左孩子为空，先输出 3，再输出右孩子 5，得到 [2,4,1,3,5]。',
    pitfalls: '不要把“先入栈”当成这份代码的行为；它没有栈。把 append 放在左右递归之前会变成前序。节点值与中序下标不同，重复值也按实际节点处理。',
    observation: 'res 只在当前节点的左子树全部完成之后追加，因此非空节点的输出次序就是中序。',
    mechanism: '递归调用栈保存每个尚未处理完的父节点；子调用返回后，父节点继续执行 append 与右递归。',
    invariant: '每次 dfs(node) 返回时，node 的左子树已完整输出，而 node 及其右子树尚未输出。',
    termination: '每条递归边只向下走一次；空节点直接返回，有限二叉树最终使所有调用返回。',
    counterexample: '对 [1,2,3,null,4,null,5]，若先 append 根会得到前序 [1,2,4,3,5]；本代码按“左—根—右”输出 [2,4,1,3,5]。',
    naive: '逐个枚举节点值再按某种局部父子关系排序，既重复又无法正确恢复中序；直接递归即可，无需另建搜索结构。',
    time: 'O(n)',
    timeNote: '每个非空节点进入一次，空孩子也产生常数次调用；append 均摊 O(1)。',
    space: 'O(h)',
    spaceNote: '不计输出时为递归栈 O(h)，最坏斜树 O(n)；res 本身另占 O(n)。',
    keyLines: [
      { start: 8, end: 17, text: '    def inorderTraversal(self, root: TreeNode | None) -> list[int]:\n        res = []\n        def dfs(node):\n            if not node:\n                return\n            dfs(node.left)\n            res.append(node.val)\n            dfs(node.right)\n        dfs(root)\n        return res' }
    ],
    challenge: {
      question: '如果要求不使用递归，怎样保持与这份提交完全相同的中序结果？',
      hint: '用显式栈保存“以后还要访问”的节点；先一直向左，弹出后才访问并转向右孩子。',
      answer: '这是独立的迭代改写法，不是原提交：栈初始为空，cur=root；cur 非空时压栈并左移，否则弹栈、append、cur=node.right。'
    },
    similar: [
      { id: 144, title: '二叉树的前序遍历', slug: 'binary-tree-preorder-traversal', role: '前置练习', reason: '同样递归，只改变根与左右子树的处理位置。' },
      { id: 145, title: '二叉树的后序遍历', slug: 'binary-tree-postorder-traversal', role: '同类巩固', reason: '比较三种 DFS 中访问当前节点的时机。' },
      { id: 589, title: 'N 叉树的前序遍历', slug: 'n-ary-tree-preorder-traversal', role: '同类巩固', reason: '把二叉递归推广为依次处理多个孩子。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [1, 2, 3, null, 4, null, 5] },
      frames: [
        treeFrame([1,2,3,null,4,null,5], '进入根', 'dfs(1) 尚未输出 1，先调用左孩子 2。', [1], [], '未返回', '根调用等待左子树完成。'),
        treeFrame([1,2,3,null,4,null,5], '进入节点 2', '2 的左孩子为空，空调用返回后准备输出 2。', [2], [], '未返回', '2 已恢复执行。'),
        treeFrame([1,2,3,null,4,null,5], '输出 2', 'res.append(2)，再调用右孩子 4。', [2], [2], '未返回', '2 已输出，调用尚未返回。'),
        treeFrame([1,2,3,null,4,null,5], '进入右孩子 4', 'dfs(4) 的左孩子为空，准备输出 4。', [4], [2], '未返回', '4 是节点 2 的右孩子。'),
        treeFrame([1,2,3,null,4,null,5], '输出 4', 'res.append(4)，右空孩子返回后 dfs(4)、dfs(2) 依次结束。', [4], [2,4], 'dfs(4) 返回 None', '左子树已完整输出。'),
        treeFrame([1,2,3,null,4,null,5], '回到根并输出 1', 'dfs(2) 返回后 append(1)，再进入右孩子 3。', [1], [2,4,1], 'dfs(2) 返回 None', '根的左子树已经完成。'),
        treeFrame([1,2,3,null,4,null,5], '进入节点 3', 'dfs(3) 的左孩子为空，空调用返回后准备输出 3。', [3], [2,4,1], '未返回', '3 已恢复执行。'),
        treeFrame([1,2,3,null,4,null,5], '输出 3', 'res.append(3)，再调用右孩子 5。', [3], [2,4,1,3], '未返回', '3 已输出，调用尚未返回。'),
        treeFrame([1,2,3,null,4,null,5], '进入右孩子 5', 'dfs(5) 的左孩子为空，准备输出 5。', [5], [2,4,1,3], '未返回', '5 是节点 3 的右孩子。'),
        treeFrame([1,2,3,null,4,null,5], '输出 5', 'res.append(5)，右空孩子返回后 dfs(5)、dfs(3)、dfs(1) 依次结束。', [5], [2,4,1,3,5], 'dfs(5) 返回 None', '5 是最后一个输出节点。'),
        treeFrame([1,2,3,null,4,null,5], '全部返回', 'dfs(3)、dfs(1) 依次返回，函数输出 res。', [], [2,4,1,3,5], '[2,4,1,3,5]', '没有活动调用，visited 就是最终输出。')
      ]
    }
  },

  '104': {
    id: 104,
    title: '二叉树的最大深度',
    slug: 'maximum-depth-of-binary-tree',
    difficulty: '简单',
    category: '二叉树',
    summary: '实际执行的是返回子树高度的递归：空树为 0，非空节点为 1 加左右子树高度的较大值。文件前面的 ans/depth 版本只是注释。',
    input: '根节点 root。',
    output: '从根到最深叶子的节点数；空树为 0。',
    core: '高度回推，而不是向下传递深度参数。',
    walkthrough: '叶子 4、5 各返回 1。节点 2 只有右孩子 4，因此返回 1+max(0,1)=2；节点 3 只有左孩子 5，同样返回 2。根节点返回 1+max(2,2)=3。',
    pitfalls: '被注释的 dfs(node,depth) 会维护 ans，并未执行。高度按节点数计，不能把根深度设成 1 后与空树 0 混用。',
    observation: '递归返回值已经包含当前节点，因此父节点只需加 1。',
    mechanism: '左右孩子先返回高度，父节点取最大值后回推。',
    invariant: 'dfs(root) 返回以 root 为根的子树最大节点层数。',
    termination: '空孩子返回 0，否则递归到更小子树，有限树必然结束。',
    counterexample: '只有根 [1] 时答案为 1；若把空树当深度 1，就会错误得到 2。',
    naive: '被注释的方案逐层向下传 depth 并在叶子更新 ans，也能求解，但不是当前运行代码。',
    time: 'O(n)',
    timeNote: '每个节点被访问一次，左右高度计算均为常数合并。',
    space: 'O(h)',
    spaceNote: '活动代码只使用递归栈，最坏斜树 O(n)；没有额外的 ans 全局变量。',
    keyLines: [
      { start: 9, end: 20, text: '        # ans = 0\n        # def dfs(node, depth):\n        #     nonlocal ans\n        #     if not node:\n        #         return\n        #     if not node.left and not node.right:\n        #         ans = max(ans, depth)\n        #         return \n        #     dfs(node.left, depth + 1)\n        #     dfs(node.right, depth + 1)\n        # dfs(root, 1)\n        # return ans' },
      { start: 21, end: 27, text: '        def maxDepth(root):\n            if not root:\n                return 0\n            l = maxDepth(root.left)\n            r = maxDepth(root.right)\n            return 1 + max(l, r)\n        return maxDepth(root)' }
    ],
    challenge: {
      question: '为什么实际代码的内层函数不需要 depth 参数？',
      hint: '观察每个返回值是否已经包含当前节点。',
      answer: '因为 1+max(l,r) 已从孩子高度推得当前高度；深度只是外部观察量，没有必要向下传递。'
    },
    similar: [
      { id: 111, title: '二叉树的最小深度', slug: 'minimum-depth-of-binary-tree', role: '前置练习', reason: '同样递归求高度，但最近叶子的定义不同。' },
      { id: 110, title: '平衡二叉树', slug: 'balanced-binary-tree', role: '进阶挑战', reason: '在求左右高度的同时比较高度差。' },
      { id: 559, title: 'N 叉树的最大深度', slug: 'maximum-depth-of-n-ary-tree', role: '同类巩固', reason: '把左右两路最大值改为所有孩子的最大值。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [1,2,3,null,4,null,5] },
      frames: [
        treeFrame([1,2,3,null,4,null,5], '进入根', '先计算左子树高度，暂不能确定根的高度。', [1], [], '未返回', '根调用等待左结果。'),
        treeFrame([1,2,3,null,4,null,5], '进入节点 2', '节点 2 先调用它的左孩子。', [2], [], '未返回', '当前检查节点 2。'),
        treeFrame([1,2,3,null,4,null,5], '节点 2 的左孩子为空', 'dfs(None) 返回 0，再计算右孩子 4。', [2], [], 'dfs(None) 返回 0', 'l=0，右结果尚未计算。'),
        treeFrame([1,2,3,null,4,null,5], '进入节点 4', '4 是节点 2 的右孩子，先计算它的左高度。', [4], [], '未返回', '4 已进入递归。'),
        treeFrame([1,2,3,null,4,null,5], '节点 4 的左孩子为空', 'dfs(None) 返回 0，再计算右高度。', [4], [], 'dfs(None) 返回 0', '4 已取得左高度。'),
        treeFrame([1,2,3,null,4,null,5], '叶子 4 返回 1', 'r=0，因此 4 返回 1+max(0,0)=1。', [4], [4], '1', '4 完成回推。'),
        treeFrame([1,2,3,null,4,null,5], '节点 2 返回 2', 'l=0、r=1，所以节点 2 返回 1+max(0,1)=2。', [2], [4,2], '2', '左子树高度已经确定。'),
        treeFrame([1,2,3,null,4,null,5], '进入节点 3', '根的左高度为 2，现在计算右孩子 3 的高度。', [3], [4,2], '未返回', '3 尚未访问。'),
        treeFrame([1,2,3,null,4,null,5], '节点 3 的右孩子为空', 'dfs(None) 返回 0，再计算左孩子 5。', [3], [4,2], 'dfs(None) 返回 0', 'l=0，左结果尚未计算。'),
        treeFrame([1,2,3,null,4,null,5], '进入节点 5', '5 是节点 3 的右孩子，先计算它的左高度。', [5], [4,2], '未返回', '同名值 5 是另一个节点。'),
        treeFrame([1,2,3,null,4,null,5], '叶子 5 返回 1', '5 的左右孩子均为空，各贡献高度 0。', [5], [4,2,5], '1', '节点 3 的右高度已经确定。'),
        treeFrame([1,2,3,null,4,null,5], '节点 3 返回 2', 'l=0、r=1，所以节点 3 返回 1+max(0,1)=2。', [3], [4,2,5,3], '2', '3 完成右子树计算。'),
        treeFrame([1,2,3,null,4,null,5], '根返回 3', '根得到 l=2、r=2，返回 1+max(2,2)=3。', [1], [4,2,5,3,1], '3', '根是最后完成的节点。'),
        treeFrame([1,2,3,null,4,null,5], '返回答案', '外层返回 maxDepth(root) 的结果 3。', [], [4,2,5,3,1], '3', '递归已全部结束。')
      ]
    }
  },

  '226': {
    id: 226,
    title: '翻转二叉树',
    slug: 'invert-binary-tree',
    difficulty: '简单',
    category: '二叉树',
    summary: '先递归翻转左右子树，再交换当前节点的两个指针；这是原地修改的后序递归。',
    input: '根节点 root。',
    output: '原地翻转后的根节点；空树返回 None。',
    core: '子问题先完成，再交换指针，避免把已翻转和未翻转的子树混在一起。',
    walkthrough: '叶子 1、3 交换空指针后返回；节点 2 把右子树 3 换到左边。右侧同理，最后根 4 交换 2 与 7。',
    pitfalls: '先交换再按原 left/right 字段递归也可以，但本提交明确是先递归后交换。返回的是原根节点，不是新节点。',
    observation: '指针交换只改变拓扑，不复制节点，因此所有原节点仍然是同一批对象。',
    mechanism: '递归栈保证左右子树各自先成为镜像，再执行元组同时赋值。',
    invariant: 'dfs(node) 返回时，以 node 为根的整棵子树已完成镜像。',
    termination: '空节点直接返回；每次非空调用都把问题缩小到左右子树。',
    counterexample: '单节点 [1] 的数组仍是 [1]，不能说没有翻转；它只是没有非空孩子可换。',
    naive: '为每个节点新建左右副本会改变对象身份并额外占用空间；原提交直接改指针。',
    time: 'O(n)',
    timeNote: '每个节点恰好一次交换，并访问常数个指针。',
    space: 'O(h)',
    spaceNote: '递归栈 O(h)，最坏斜树 O(n)；不计算结果树的新数组。',
    keyLines: [
      { start: 8, end: 14, text: '    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root:\n            return None\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        root.left, root.right = root.right, root.left\n        return root' }
    ],
    challenge: {
      question: '交换发生在后序有什么好处？',
      hint: '比较交换前左右字段指向的子树是否已经完全翻转。',
      answer: '返回时两个子树都已镜像，当前节点只需整体对调，不依赖任何临时保存。'
    },
    similar: [
      { id: 100, title: '相同的树', slug: 'same-tree', role: '前置练习', reason: '练习同时检查一对节点的左右孩子。' },
      { id: 572, title: '另一棵树的子树', slug: 'subtree-of-another-tree', role: '同类巩固', reason: '把单树递归扩展为在主树各节点匹配子树。' },
      { id: 617, title: '合并二叉树', slug: 'merge-two-binary-trees', role: '进阶挑战', reason: '同时递归两棵树并合并对应节点。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [4,2,7,1,3,6,9] },
      frames: [
        treeFrame([4,2,7,1,3,6,9], '进入根', '根先递归左子树，尚未交换指针。', [4], [], '未返回', '根正在等待子调用。'),
        treeFrame([4,2,7,1,3,6,9], '进入节点 2', '节点 2 先处理左孩子 1。', [2], [], '未返回', '当前活动节点为 2。'),
        treeFrame([4,2,7,1,3,6,9], '交换叶子 1', '1 的左右孩子均为空，交换后返回 1。', [1], [1], '1', '1 已完成，值不变。'),
        treeFrame([4,2,7,1,3,6,9], '交换叶子 3', '叶子 3 同样完成并返回。', [3], [1,3], '3', '3 当前完成。'),
        treeFrame([4,2,7,1,3,6,9], '节点 2 完成交换', '把 3 换到左侧、1 换到右侧；层序数组此刻显示 [4,2,7,3,1]。', [2], [1,3,2], '2', '2 正在执行指针交换。'),
        treeFrame([4,2,7,3,1,6,9], '进入节点 7', '右子树尚未翻转，根仍指向未完成的节点 7。', [7], [1,3,2], '未返回', '7 是当前递归入口。'),
        treeFrame([4,7,2,9,6,3,1], '节点 7 完成', '其孩子 6、9 先返回，再交换两者。', [7], [1,3,2,6,9,7], '7', '7 的后序交换刚完成。'),
        treeFrame([4,7,2,9,6,3,1], '根完成交换', '根把已完成的左子树 2 与右子树 7 对调。', [4], [1,3,2,6,9,7,4], '4', '4 是最后交换的根。'),
        treeFrame([4,7,2,9,6,3,1], '返回翻转后的根', '输出仍为原根对象 4，层序值体现翻转结果。', [], [1,3,2,6,9,7,4], '4', '没有活动调用。')
      ]
    }
  },

  '101': {
    id: 101,
    title: '对称二叉树',
    slug: 'symmetric-tree',
    difficulty: '简单',
    category: '二叉树',
    summary: '入口比较 root.left 与 root.right，再以镜像配对方式递归；它不是对单个节点做普通 DFS。',
    input: '根节点 root。',
    output: '布尔值，判断绕根竖轴翻转后是否与原树相同。',
    core: '一对节点 (a,b) 必须值相等，且 a.left 对应 b.right、a.right 对应 b.left。',
    walkthrough: '比较两边的 2，再比较外侧 3 与 3、内侧 4 与 4；所有配对都成功后返回 True。',
    pitfalls: '只递归判断左右孩子各自对称会漏掉跨子树对应关系。入口不调用 mirror(root,root)，而是比较根的左右孩子。and 短路可能使某些右侧调用不发生。',
    observation: '值相同的两个节点可能是不同对象；本例的重复 3、4 正是镜像位置上的独立节点。',
    mechanism: '每次递归把一对对应节点替换为两组交叉配对的子节点。',
    invariant: 'mirror(a,b) 判断的是以 a、b 为根的两子树是否互为镜像。',
    termination: '空配对直接返回；每轮非空比较都下降到更小的子树。',
    counterexample: '[1,2,2,null,3,null,3] 中，左侧 3 是左 2 的内侧右孩子，右侧 3 却是右 2 的外侧右孩子。代码先比较外侧：mirror(None,右侧3) 立即返回 False，内侧两个位置根本没有继续比较。',
    naive: '先复制并翻转整棵树再逐节点比较，需要 O(n) 额外空间；镜像双节点递归可省去复制。',
    time: 'O(n)',
    timeNote: '成功或最终失败前最多检查所有节点；失败可提前短路。',
    space: 'O(h)',
    spaceNote: '递归栈最坏 O(h)，不复制树。',
    keyLines: [
      { start: 8, end: 17, text: '    def isSymmetric(self, root: TreeNode | None) -> bool:\n        def mirror(a, b):\n            if not a and not b:\n                return True\n            if not a or not b:\n                return False\n            if a.val != b.val:\n                return False\n            return mirror(a.left, b.right) and mirror(a.right, b.left)\n        return mirror(root.left, root.right)  ' }
    ],
    challenge: {
      question: '为什么根节点本身不需要再比较值？',
      hint: '镜像轴穿过根，根与自身对应。',
      answer: '入口已经把问题定义为左右子树互为镜像；根与自身天然相等，只需比较它的两个孩子子树。'
    },
    similar: [
      { id: 100, title: '相同的树', slug: 'same-tree', role: '前置练习', reason: '先掌握同位置双节点比较，再改为交叉位置。' },
      { id: 572, title: '另一棵树的子树', slug: 'subtree-of-another-tree', role: '同类巩固', reason: '练习把树匹配嵌入整棵主树。' },
      { id: 617, title: '合并二叉树', slug: 'merge-two-binary-trees', role: '进阶挑战', reason: '同时处理两棵树的对应节点与空节点。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [1,2,2,3,4,4,3] },
      frames: [
        treeFrame([1,2,2,3,4,4,3], '入口比较左右孩子', '调用 mirror(root.left,root.right)，比较两个不同对象但值都为 2 的节点。', [2,2], [], '未返回', '这一对节点共享值 2，必须按左右位置区分。'),
        treeFrame([1,2,2,3,4,4,3], '比较外侧孩子', 'mirror(左2.left,右2.right)，得到两个不同对象的值 3。', [3,3], [], '未返回', '配对方式为外侧交叉。'),
        treeFrame([1,2,2,3,4,4,3], '外侧空孩子', '两个 3 的孩子同时为空，mirror(None,None) 返回 True。', [null,null], [], 'True', '两个 null 表示两侧对应位置都缺失。'),
        treeFrame([1,2,2,3,4,4,3], '外侧 3 配对完成', '左 3 子树返回 True，外层准备比较内侧 4。', [3,3], [3,3], 'True', '恢复的是刚完成的 3 配对。'),
        treeFrame([1,2,2,3,4,4,3], '比较内侧孩子', 'mirror(左2.right,右2.left)，两个 4 值相等。', [4,4], [3,3], '未返回', '配对方式改为内侧交叉。'),
        treeFrame([1,2,2,3,4,4,3], '内侧空孩子', '两个 4 对应孩子都为空，返回 True。', [null,null], [3,3], 'True', '对应空位置也构成镜像。'),
        treeFrame([1,2,2,3,4,4,3], '内侧 4 配对完成', '右侧配对返回 True，and 可以继续返回。', [4,4], [2,2,3,3,4,4], 'True', '当前恢复内侧配对。'),
        treeFrame([1,2,2,3,4,4,3], '两个 2 配对完成', '两组孩子都镜像，mirror(左2,右2) 返回 True。', [2,2], [3,3,4,4,2,2], 'True', '根左右子树已确认镜像。'),
        treeFrame([1,2,2,3,4,4,3], '返回对称结果', '入口直接返回 mirror 的布尔结果。', [], [3,3,4,4,2,2], 'True', '全部配对调用结束。')
      ]
    }
  },

  '543': {
    id: 543,
    title: '二叉树的直径',
    slug: 'diameter-of-binary-tree',
    difficulty: '简单',
    category: '二叉树',
    summary: '递归返回以节点为根的节点数高度，同时用左右高度之和更新边数直径。',
    input: '根节点 root。',
    output: '任意两节点之间最长路径的边数；空树为 0。',
    core: '把“能向上延伸的一侧高度”与“在此转弯的完整直径”分开。',
    walkthrough: '节点 2 的左右高度都是 1，得到候选 l+r=2；根左右高度为 2、1，得到候选 3，因此直径为 3。',
    pitfalls: 'dfs 返回值数的是节点，答案数的是边，两者不能混用。ans 在空节点处不更新，空树保持 0。',
    observation: '每一条路径都在其最高转折节点处被 l+r 考虑一次。',
    mechanism: '后序计算左右高度，先更新全局 ans，再返回 1+max(l,r) 供父节点使用。',
    invariant: 'dfs(node) 返回 node 到其子树最深叶的节点数；ans 是已处理节点的最大边数路径。',
    termination: '空孩子返回 0，非空节点处理更小左右子树。',
    counterexample: '[1,2] 中 dfs(2)=1，dfs(1) 返回 2，但 ans=1；若返回高度当直径会误报 2。',
    naive: '枚举每个节点再分别求左右深度会重复遍历；一次后序同时返回高度即可。',
    time: 'O(n)',
    timeNote: '每个节点只计算一次左右高度。',
    space: 'O(h)',
    spaceNote: '递归栈 O(h)，最坏斜树 O(n)；ans 为 O(1)。',
    keyLines: [
      { start: 8, end: 19, text: '    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        ans = 0\n        def dfs(node):\n            nonlocal ans\n            if not node:\n                return 0\n            l = dfs(node.left)\n            r = dfs(node.right)\n            ans = max(ans, l + r)\n            return 1 + max(l, r)\n        dfs(root)\n        return ans' }
    ],
    challenge: {
      question: '为什么返回给父节点的是 max(l,r)+1，而不是 l+r？',
      hint: '父节点只能接上孩子的一侧，不能同时走完当前节点的左右两支。',
      answer: '返回的一侧高度用于构成父节点为转折点的路径；l+r 是当前节点可转弯的完整直径，只更新 ans。'
    },
    similar: [
      { id: 687, title: '最长同值路径', slug: 'longest-univalue-path', role: '同类巩固', reason: '同样区分可向上延伸的一侧与完整路径。' },
      { id: 124, title: '二叉树中的最大路径和', slug: 'binary-tree-maximum-path-sum', role: '进阶挑战', reason: '在相同后序框架上加入节点权值与负贡献裁剪。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [1,2,3,4,5] },
      frames: [
        treeFrame([1,2,3,4,5], '初始化并进入根', 'ans=0，根先递归左子树。', [1], [], '未返回', '根正在等待左高度。'),
        treeFrame([1,2,3,4,5], '进入节点 2', '节点 2 先进入左孩子 4。', [2], [], '未返回', '2 的左高度未知。'),
        treeFrame([1,2,3,4,5], '叶子 4 返回 1', '空孩子高度为 0，4 返回 1+max(0,0)=1。', [4], [4], '1', '4 完成高度回推。'),
        treeFrame([1,2,3,4,5], '叶子 5 返回 1', '节点 2 的 r=1，准备合并左右高度。', [5], [4,5], '1', '5 是当前完成节点。'),
        treeFrame([1,2,3,4,5], '节点 2 更新直径', 'l=1、r=1，ans=max(0,2)=2；返回高度 2。', [2], [4,5,2], '2；ans=2', '2 正在回推，并已贡献转弯候选。'),
        treeFrame([1,2,3,4,5], '节点 3 返回 1', '节点 3 是叶子，ans 保持 2。', [3], [4,5,2,3], '1', '3 完成右子树。'),
        treeFrame([1,2,3,4,5], '根更新直径', '根得到 l=2、r=1，ans=max(2,3)=3。', [1], [4,5,2,3,1], '未返回；ans=3', '根正在形成候选路径 4→2→1→3。'),
        treeFrame([1,2,3,4,5], '高度与答案分离', '根返回高度 3，但外层最终返回 ans=3 条边。', [], [4,5,2,3,1], 'ans=3', '全部调用结束；返回值与答案语义不同。')
      ]
    }
  },

  '102': {
    id: 102,
    title: '二叉树的层序遍历',
    slug: 'binary-tree-level-order-traversal',
    difficulty: '中等',
    category: '二叉树',
    summary: '用列表 q 保存当前层快照，逐节点收集 row 并生成下一层 nxt，一层结束后整体替换 q。',
    input: '根节点 root。',
    output: '二维数组，每个子数组是一层从左到右的节点值。',
    core: '先固定当前层范围，再把孩子放入另一个列表。',
    walkthrough: '第一层 q=[3] 输出 [3]；第二层按左到右得到 [9,20]；第三层得到 [15,7]。',
    pitfalls: '直接边遍历 q 边 append 孩子，会让同层和新层混在一起。空树要在进入 while 前返回 []。',
    observation: '每轮 nxt 只接收当前 q 中节点的非空左、右孩子，因此天然按层分离。',
    mechanism: 'for 循环遍历一个稳定的当前层列表，while 在完整消费该层后进入下一层。',
    invariant: '每轮开始时，q 恰好包含深度 d 的全部非空节点，且顺序从左到右。',
    termination: '每轮生成更深一层；有限树在叶子层处理后 nxt=[]，while 结束。',
    counterexample: '对 [3,9,20,null,null,15,7]，若把 15、7 追加进正在遍历的 q，会错误地把它们与 9、20 放在同一行。',
    naive: '先按深度分组再逐层扫描，需要额外深度信息；当前快照法更直接。',
    time: 'O(n)',
    timeNote: '每个节点入队、出队各一次，row 的总追加次数为 n。',
    space: 'O(w)',
    spaceNote: 'q、nxt 和 row 的最大宽度为 O(w)，最宽两层可同时存在；不计最终 res。',
    keyLines: [
      { start: 8, end: 22, text: '    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:\n        if not root:\n            return []\n        res, q = [], [root]\n        while q:\n            row, nxt = [], []\n            for node in q:\n                row.append(node.val)\n                if node.left:\n                    nxt.append(node.left)\n                if node.right:\n                    nxt.append(node.right)\n            res.append(row)\n            q = nxt\n        return res        ' }
    ],
    challenge: {
      question: '为什么两层不能共用同一个 row？',
      hint: 'res.append(row) 保存的是列表对象引用，而不是自动复制。',
      answer: '若继续清空或修改同一个 row，已保存的结果也会改变；每轮创建新 row 才能保留各层快照。'
    },
    similar: [
      { id: 107, title: '二叉树的层序遍历 II', slug: 'binary-tree-level-order-traversal-ii', role: '同类巩固', reason: '保留分层机制，只改变最终层序方向。' },
      { id: 103, title: '二叉树的锯齿形层序遍历', slug: 'binary-tree-zigzag-level-order-traversal', role: '进阶挑战', reason: '在每层输出时交替改变方向。' },
      { id: 199, title: '二叉树的右视图', slug: 'binary-tree-right-side-view', role: '同类巩固', reason: '复用层快照，但每层只取最右值。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [3,9,20,null,null,15,7] },
      frames: [
        treeFrame([3,9,20,null,null,15,7], '初始化第一层', 'root 非空，q=[3]，res=[]。', [3], [], '未返回', '队列中的 3 是当前层唯一待处理节点。', { queue: [3] }),
        treeFrame([3,9,20,null,null,15,7], '收集 9', '处理当前层第一个节点 3，row=[3]，nxt 已加入左孩子 9。', [3], [3], '未返回', '3 正被处理；9 只是下一层队列成员，不是活动调用。', { queue: [3] }),
        treeFrame([3,9,20,null,null,15,7], '完成第一层', '处理 3 的右孩子 20，row=[3]，nxt=[9,20]，随后 q=nxt。', [3], [3], '未返回', '3 完成，queue 显示替换后的下一层。', { queue: [9,20] }),
        treeFrame([3,9,20,null,null,15,7], '第二层输出 9', 'q=[9,20] 保持稳定，row 先加入 9，nxt 仍为空。', [9], [3,9], '未返回', '9 是当前出层节点，20 仍在队列中。', { queue: [9,20] }),
        treeFrame([3,9,20,null,null,15,7], '第二层输出 20', 'row=[9,20]，20 的孩子依次加入 nxt=[15,7]。', [20], [3,9,20], '未返回', '20 正生成第三层。', { queue: [9,20] }),
        treeFrame([3,9,20,null,null,15,7], '提交第二层', 'res=[[3],[9,20]]，q 替换为 [15,7]。', [], [3,9,20], '未返回', '本层无活动节点，队列保存下一层。', { queue: [15,7] }),
        treeFrame([3,9,20,null,null,15,7], '第三层处理 15', 'q=[15,7]，先处理 15，row=[15]，nxt 仍为空。', [15], [3,9,20,15], '未返回', '15 是当前出层节点，7 仍在队列中。', { queue: [15,7] }),
        treeFrame([3,9,20,null,null,15,7], '第三层处理 7', '再处理 7，row=[15,7]；两个节点都没有孩子。', [7], [3,9,20,15,7], '未返回', '7 是本层最后一个活动节点。', { queue: [15,7] }),
        treeFrame([3,9,20,null,null,15,7], '队列耗尽', '提交 [15,7] 后 q=[]，while 条件失败。', [], [3,9,20,15,7], '[[3],[9,20],[15,7]]', '没有活动节点，visited 是实际出层顺序。', { queue: [] })
      ]
    }
  },

  '108': {
    id: 108,
    title: '将有序数组转换为二叉搜索树',
    slug: 'convert-sorted-array-to-binary-search-tree',
    difficulty: '简单',
    category: '二叉搜索树',
    summary: '对闭区间 [l,r] 取下中位数作根，再递归左右两段；实际提交不使用切片。',
    input: '严格递增的整数数组 nums。',
    output: '高度尽量平衡的二叉搜索树根节点。',
    core: '用下标边界缩小问题，以 midpoint 一次性确定根与左右区间。',
    walkthrough: 'dfs(0,4) 取 mid=2 的 0；左段 dfs(0,1) 取 mid=0 的 -10，再在 [1,1] 创建其右孩子 -3。右段 dfs(3,4) 取 mid=3 的 5，再在 [4,4] 创建其右孩子 9。最终层序为 [0,-10,5,null,-3,null,9]。',
    pitfalls: '边界是闭区间，所以右段从 mid+1 开始；空区间判定是 l>r。偶数长度时 (l+r)//2 取偏左中位数，结果确定但未必是唯一答案。',
    observation: '创建出的节点只有在父调用执行 root.left=... 或 root.right=... 后才接入 state.values；active 可以指向尚未挂接的新根。',
    mechanism: '先创建当前根，再分别取得左右子树返回值并赋值。',
    invariant: 'dfs(l,r) 只使用 nums[l:r+1]，返回区间的平衡 BST；调用期间 l≤r。',
    termination: '每次递归都移除中点并进入严格更短区间；l>r 时返回 None。',
    counterexample: '若空区间条件写成 l>=r，会漏掉单元素区间；若右段从 mid 开始，会重复使用根值并破坏边界。',
    naive: '每层用 nums[left:right] 切片也能做，但累计复制增加开销；当前代码只传下标。',
    time: 'O(n)',
    timeNote: '每个元素创建一次节点，所有调用合并操作为 O(1)。',
    space: 'O(log n)',
    spaceNote: '平衡时递归栈 O(log n)；另建 n 个 TreeNode。若误用切片则还会有额外复制成本。',
    keyLines: [
      { start: 8, end: 17, text: '    def sortedArrayToBST(self, nums: list[int]) -> TreeNode | None:\n        def dfs(l,r):\n            if l > r:\n                return None\n            mid = (l + r) // 2\n            root = TreeNode(nums[mid])\n            root.left = dfs(l, mid - 1)\n            root.right = dfs(mid + 1, r)\n            return root\n        return dfs(0, len(nums) - 1)' }
    ],
    challenge: {
      question: '为什么这份实现每次选择的是“下中位数”？',
      hint: 'Python 的 // 对非负下标向下取整。',
      answer: '(l+r)//2 在偶数长度时选左侧中间元素，因此平衡树形状确定，不需要额外随机或排序。'
    },
    similar: [
      { id: 109, title: '有序链表转换二叉搜索树', slug: 'convert-sorted-list-to-binary-search-tree', role: '进阶挑战', reason: '在不能随机下标访问的链表上实现类似区间构造。' },
      { id: 889, title: '从前序与后序遍历序列构造二叉树', slug: 'construct-binary-tree-from-preorder-and-postorder-traversal', role: '进阶挑战', reason: '比较两种遍历序列与单有序数组的边界恢复方式。' },
      { id: 700, title: '二叉搜索树中的搜索', slug: 'search-in-a-binary-search-tree', role: '前置练习', reason: '先确认有序数组区间与 BST 左右大小关系。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [0,-10,5,null,-3,null,9] },
      frames: [
        treeFrame([], '建立根区间', 'dfs(l=0,r=4)：mid=2，创建新根 0；它尚未挂到任何父节点。', [0], [], '未返回', 'active 0 是已创建但未接入 values 的新根。'),
        treeFrame([0], '创建左子区间', 'dfs(l=0,r=1)：mid=0，创建新根 -10；root 0 仍在等待左返回值。', [-10], [], '未返回', 'active -10 当前是游离节点。'),
        treeFrame([0], '左段空区间返回', 'dfs(l=0,r=-1)：l>r，返回 None，成为 -10 的左孩子。', [null], [], 'None', 'active null 表示正在检查一个不存在的区间。'),
        treeFrame([0], '创建 -10 的右段', 'dfs(l=1,r=1)：mid=1，创建新根 -3，等待其空孩子计算。', [-3], [], '未返回', 'active -3 当前是游离节点。'),
        treeFrame([0], '-3 的左空区间', 'dfs(l=1,r=0)：l>r，返回 None。', [null], [], 'None', 'active null 是 -3 左侧的不存在节点。'),
        treeFrame([0], '-3 的右空区间', 'dfs(l=2,r=1)：l>r，返回 None；-3 返回给 -10，并接为其右孩子。', [null], [-3], 'None', '-3 已完成，-10 即将取得右返回值。'),
        treeFrame([0,-10,null,-3], '-10 返回并挂接', 'dfs(l=0,r=1) 返回 -10，执行 root.left=dfs(...)，-10 接入 0。', [-10,0], [-3,-10], '-10', '左子树完成，values 显示 -10 的右孩子 -3。'),
        treeFrame([0,-10,null,-3], '进入根右区间', 'dfs(l=3,r=4)：mid=3，创建新根 5，等待其左右孩子。', [5], [-3,-10], '未返回', 'active 5 尚未出现在 values 中。'),
        treeFrame([0,-10,null,-3], '右段的空左孩子', 'dfs(l=3,r=2)：l>r，返回 None，成为 5 的左孩子。', [null], [-3,-10], 'None', 'active null 表示空闭区间。'),
        treeFrame([0,-10,null,-3], '创建右段单点', 'dfs(l=4,r=4)：mid=4，创建新根 9，尚未挂到 5。', [9], [-3,-10], '未返回', 'active 9 是游离新节点。'),
        treeFrame([0,-10,null,-3], '9 的左空区间', 'dfs(l=4,r=3)：l>r，返回 None。', [null], [-3,-10], 'None', 'active null 是 9 左侧的不存在节点。'),
        treeFrame([0,-10,null,-3], '9 的右空区间', 'dfs(l=5,r=4)：l>r，返回 None；9 返回给 5，并接为其右孩子。', [null], [-3,-10,9], 'None', '9 已完成，5 即将取得右返回值。'),
        treeFrame([0,-10,5,null,-3,null,9], '挂接右子树', 'dfs(l=3,r=4) 返回 5，root.right=5；5 的右孩子为 9。', [5,0], [-3,-10,9,5], '5', '5 完成并挂接，0 随后取得右返回值。'),
        treeFrame([0,-10,5,null,-3,null,9], '根区间完成', 'dfs(l=0,r=4) 返回根 0，最终层序数组如 data.values。', [0], [-3,-10,9,5,0], '0', '0 是最后返回的根，调用栈清空。')
      ]
    }
  },

  '98': {
    id: 98,
    title: '验证二叉搜索树',
    slug: 'validate-binary-search-tree',
    difficulty: '中等',
    category: '二叉搜索树',
    summary: '实际提交用中序递归与全局 pre 验证严格递增；它不是只比较每个节点的左右孩子。',
    input: '根节点 root。',
    output: '布尔值；空树视为合法 BST。',
    core: 'BST 中序必须严格递增，所以每访问一个节点都与已经访问的最大值 pre 比较。',
    walkthrough: '示例完整中序为 1、5、3、4、6。访问 1、5 时合法；进入 4 后先递归左孩子 3，检查 3<=pre=5 成立并立即失败，因此 4 本身和右孩子 6 都没有继续检查。',
    pitfalls: '只检查 root.left.val<root.val<root.right.val 会漏掉跨层约束。重复值不合法，因为代码用 <=。pre 在左子树失败时不会回退，验证会立即短路。',
    observation: '本例失败发生在 3，而不是 4：dfs(4) 先进入左孩子，3<=pre=5 已触发短路，4 的比较根本没有执行。',
    mechanism: 'nonlocal pre 跨递归层共享上一次成功访问的值；左子树返回 False 时直接向上返回。',
    invariant: '每次成功访问后，已处理的中序序列严格递增，pre 是其中最后一个值。',
    termination: '空节点返回 True；非空节点进入更小子树，或在不合法时提前失败。',
    counterexample: '[5,1,4,null,null,3,6] 的每个局部父子比较都不足以否定 BST，但完整中序是 1、5、3、4、6；检查 3 时 3<=pre=5，必须返回 False。',
    naive: '显式求出中序数组再检查相邻项也可行，但会使用 O(n) 输出；当前代码边走边比较。',
    time: 'O(n)',
    timeNote: '最坏检查全部节点，失败时可能提前结束；每个成功节点常数操作。',
    space: 'O(h)',
    spaceNote: '递归栈 O(h)，pre 为 O(1)；不额外保存中序数组。',
    keyLines: [
      { start: 8, end: 20, text: '    def isValidBST(self, root: TreeNode | None) -> bool:\n        pre = float("-inf")\n        def dfs(node):\n            nonlocal pre\n            if not node:\n                return True\n            if not dfs(node.left):\n                return False\n            if node.val <= pre:\n                return False\n            pre = node.val\n            return dfs(node.right)\n        return dfs(root)' }
    ],
    challenge: {
      question: '为什么 pre 能表达比“直接父节点”更强的约束？',
      hint: '中序序列里，某节点左边的所有值都恰好排在它前面。',
      answer: '若当前值不大于整个已处理前缀的最大值 pre，就存在某个左侧或祖先节点不满足 BST 顺序；仅看父节点看不到这个全局约束。'
    },
    similar: [
      { id: 700, title: '二叉搜索树中的搜索', slug: 'search-in-a-binary-search-tree', role: '前置练习', reason: '先熟悉利用 BST 大小关系选择左右分支。' },
      { id: 538, title: '把二叉搜索树转换为累加树', slug: 'convert-bst-to-greater-tree', role: '同类巩固', reason: '利用反向中序积累已经处理的信息。' },
      { id: 450, title: '删除二叉搜索树中的节点', slug: 'delete-node-in-a-bst', role: '进阶挑战', reason: '在保持 BST 约束的同时修改树结构。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [5,1,4,null,null,3,6] },
      frames: [
        treeFrame([5,1,4,null,null,3,6], '初始化全局前驱', 'pre=-inf，dfs(5) 先进入左孩子 1。', [5], [], '未返回', '根在等待左子树验证。'),
        treeFrame([5,1,4,null,null,3,6], '进入节点 1', '1 的左孩子为空，dfs(None) 返回 True。', [1], [], '未返回', '1 即将与 pre 比较。'),
        treeFrame([5,1,4,null,null,3,6], '接受 1', '1>-inf，更新 pre=1；右孩子为空后返回 True。', [1], [1], 'True', '1 完成全局前驱更新。'),
        treeFrame([5,1,4,null,null,3,6], '根恢复执行', 'dfs(1) 返回 True，检查 5<=1 为假，更新 pre=5，再进入右孩子 4。', [5], [1,5], '未返回', '5 是当前恢复检查的节点。'),
        treeFrame([5,1,4,null,null,3,6], '进入节点 4', 'dfs(4) 先进入左孩子 3，尚不能检查 4。', [4], [1,5], '未返回', '4 正在等待左子树。'),
        treeFrame([5,1,4,null,null,3,6], '节点 3 的空中孩子', '3 的左孩子为空，返回 True，准备检查 3。', [3], [1,5], '未返回', '3 即将访问。'),
        treeFrame([5,1,4,null,null,3,6], '检查 3 失败', '3<=pre=5 成立，dfs(3) 返回 False，pre 保持 5。', [3], [1,5,3], 'False', '3 是第一个失败节点，4 尚未检查。'),
        treeFrame([5,1,4,null,null,3,6], '失败传回根', 'dfs(4) 返回 False 后，根的 return dfs(node.right) 直接把 False 传回外层。', [5], [1,5,3], 'False', '根不再继续访问其他节点。'),
        treeFrame([5,1,4,null,null,3,6], '提前结束', '节点 4 本身尚未检查，右子树中的 3、6 也未访问，最终结果为 False。', [], [1,5,3], 'False', '调用栈已清空，visited 只含实际检查过的节点。')
      ]
    }
  },

  '230': {
    id: 230,
    title: '二叉搜索树中第 K 小的元素',
    slug: 'kth-smallest-element-in-a-bst',
    difficulty: '中等',
    category: '二叉搜索树',
    summary: '实际提交递归执行中序，用 cnt 倒数并在 ans 非 None 时于函数入口短路；没有提供迭代版。',
    input: 'BST 根节点 root 与正整数 k。',
    output: '中序第 k 个节点值。',
    core: '利用 BST 中序有序性，把第 k 小转换为中序倒数。',
    walkthrough: 'k=3 时依次访问 1、2、3；访问 3 后 cnt=0、ans=3。随后活动祖先 2、3、5 依次恢复，cnt 继续变为 -1、-2、-3；节点 2 的右孩子 4、节点 3 的空右孩子、节点 5 的右孩子 6 都在入口直接返回。',
    pitfalls: 'ans is not None 只在 dfs 入口判断，不能阻止当前已活动调用在递归返回后继续执行 cnt-=1。找到答案后若值是 None 会有歧义，但题目节点值为整数。',
    observation: '答案节点 3 返回后，祖先 2、3、5 都继续执行 cnt-=1，使 cnt 依次变为 -1、-2、-3；随后发起的右孩子调用才被入口守卫拦住。',
    mechanism: '左递归完成后处理当前节点，找到答案便不再进入右子树；外层已开始的每个祖先调用则继续 cnt-=1，再发起一次会被入口守卫拦住的右孩子调用。',
    invariant: '每个成功完成“访问当前节点”的调用使 cnt 减 1；cnt>0 时答案尚未找到。',
    termination: '空节点或 ans 已找到时入口返回；否则递归到更小子树，并在 cnt==0 后设置答案。',
    counterexample: '若找到 3 后就声称所有 cnt 都停止变化，会误读代码：本例活动祖先 2、3、5 仍依次把 cnt 减到 -1、-2、-3。',
    naive: '先递归生成完整中序数组再取 nums[k-1]，正确但即使提前找到答案也会遍历全树。',
    time: 'O(n)',
    timeNote: '最坏为 O(n)。入口守卫会在找到答案后剪掉新子树，但入栈前可能已走过一条很长的左链；提前停止的严格上界是 O(h+k)，不能一概称为 O(k)。',
    space: 'O(h)',
    spaceNote: '递归栈 O(h)，最坏 O(n)；不保存完整中序数组。',
    keyLines: [
      { start: 8, end: 21, text: '    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:\n        cnt, ans = k, None\n        def dfs(node):\n            nonlocal cnt, ans\n            if not node or ans is not None:\n                return\n            dfs(node.left)\n            cnt -= 1\n            if cnt == 0:\n                ans = node.val\n                return\n            dfs(node.right)\n        dfs(root)\n        return ans' }
    ],
    challenge: {
      question: '找到答案后，为什么栈里的祖先仍可能执行 cnt-=1？',
      hint: '入口守卫只能拦住新调用，拦不住一次已经发生的子调用返回。',
      answer: '祖先正停在 dfs(node.left) 之后；子调用设置 ans 并返回后，每个活动祖先都继续执行下一条 cnt-=1，只是它再发起的右孩子调用会被入口守卫拦住。'
    },
    similar: [
      { id: 700, title: '二叉搜索树中的搜索', slug: 'search-in-a-binary-search-tree', role: '前置练习', reason: '先练习 BST 左右分支的选择。' },
      { id: 98, title: '验证二叉搜索树', slug: 'validate-binary-search-tree', role: '同类巩固', reason: '理解中序与 BST 严格有序之间的关系。' },
      { id: 538, title: '把二叉搜索树转换为累加树', slug: 'convert-bst-to-greater-tree', role: '进阶挑战', reason: '比较正向与反向中序的状态累积。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [5,3,6,2,4,null,null,1] },
      frames: [
        treeFrame([5,3,6,2,4,null,null,1], '初始化计数', 'cnt=k=3，ans=None；从根 5 一路向左。', [5], [], '未返回', '根调用正在进入左子树。'),
        treeFrame([5,3,6,2,4,null,null,1], '进入节点 3', '3 也先递归左孩子 2。', [3], [], '未返回', '3 尚未访问。'),
        treeFrame([5,3,6,2,4,null,null,1], '进入节点 2', '2 继续向左到 1。', [2], [], '未返回', '2 尚未访问。'),
        treeFrame([5,3,6,2,4,null,null,1], '访问 1', '1 的空左孩子返回；cnt 从 3 减到 2，ans 仍为 None。', [1], [1], '未返回', '1 已访问但不是答案。'),
        treeFrame([5,3,6,2,4,null,null,1], '访问 2', 'dfs(1) 返回后节点 2 恢复，cnt 从 2 减到 1。', [2], [1,2], '未返回', '祖先 2 继续执行访问动作。'),
        treeFrame([5,3,6,2,4,null,null,1], '访问答案 3', '节点 3 恢复后 cnt 从 1 减到 0，设置 ans=3 并返回。', [3], [1,2,3], '未返回；ans=3', '3 是答案调用，返回后不再进入右子树。'),
        treeFrame([5,3,6,2,4,null,null,1], '祖先 2 仍减计数', 'dfs(3) 返回后，2 恢复并执行 cnt-=1，cnt 从 0 变成 -1。', [2], [1,2,3], '未返回；cnt=-1', '2 是活动祖先，不会被入口守卫阻止。'),
        treeFrame([5,3,6,2,4,null,null,1], '右孩子 4 被守卫拦截', '2 调用 dfs(4)，4 因 ans is not None 在入口直接返回。', [4], [1,2,3], 'None', '4 被调用但未进行中序访问。'),
        treeFrame([5,3,6,2,4,null,null,1], '祖先 3 仍减计数', 'dfs(2) 返回后，3 恢复并执行 cnt-=1，cnt 从 -1 变成 -2；随后调用空右孩子。', [3], [1,2,3], '未返回；cnt=-2', '3 的右孩子为空，dfs(None) 在入口直接返回。'),
        treeFrame([5,3,6,2,4,null,null,1], '祖先 5 仍减计数', 'dfs(3) 返回后，5 恢复并执行 cnt-=1，cnt 从 -2 变成 -3。', [5], [1,2,3], '未返回；cnt=-3', '5 是最后一个活动祖先。'),
        treeFrame([5,3,6,2,4,null,null,1], '右孩子 6 被守卫拦截', '5 调用 dfs(6)，6 在入口直接返回；外层随后返回 ans=3。', [6], [1,2,3], 'ans=3', '6 未访问，递归正在收尾。'),
        treeFrame([5,3,6,2,4,null,null,1], '返回答案', '所有调用返回，最终 ans 保持 3。', [], [1,2,3], '3', '没有活动调用。')
      ]
    }
  },

  '199': {
    id: 199,
    title: '二叉树的右视图',
    slug: 'binary-tree-right-side-view',
    difficulty: '中等',
    category: '二叉树',
    summary: '用当前层列表 q 的最右节点 q[-1] 构成右视图，再按左到右顺序生成下一层。',
    input: '根节点 root。',
    output: '从右侧观察时每层能看到的首个节点值数组。',
    core: '每层先选最右值，再完整遍历当前层生成孩子。',
    walkthrough: '第一层选 1；第二层 q=[2,3] 选 3；第三层 q=[5,4] 选 4。',
    pitfalls: '不能从根一路走右孩子，因为右侧看到的节点可能位于左子树。q[-1] 必须在替换 q 之前取。空树返回 []。',
    observation: '队列仍按从左到右保存整层节点，选末尾只影响输出，不改变孩子生成顺序。',
    mechanism: 'while 每轮 append 当前层末值，然后 for 循环建立 nxt。',
    invariant: '每轮 q 是一整层非空节点，且 q[-1] 是该层最右节点。',
    termination: '叶子层处理完后 nxt=[]，q 变空，while 结束。',
    counterexample: '[1,2,3,4,null,null,5] 的正确右视图是 [1,3,5]。若从根只走右孩子会得到 [1,3]，漏掉位于左子树 2 之下的 5。',
    naive: '先求完整层序再逐行取末值需要保存整棵树的二维结果；本代码只保留答案与两层队列。',
    time: 'O(n)',
    timeNote: '每个节点仍被完整遍历一次以生成孩子。',
    space: 'O(w)',
    spaceNote: '两层队列最宽 O(w)；res 另占 O(h)，不计输出时队列仍可能达到整树宽度。',
    keyLines: [
      { start: 8, end: 21, text: '    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:\n        if not root:\n            return []\n        res, q = [], [root]\n        while q:\n            res.append(q[-1].val)\n            nxt = []\n            for node in q:\n                if node.left:\n                    nxt.append(node.left)\n                if node.right:\n                    nxt.append(node.right)\n            q = nxt\n        return res' }
    ],
    challenge: {
      question: '为什么 q[-1] 不是“最右路径上的节点”？',
      hint: '比较当前层完整列表与单一路径所能提供的信息。',
      answer: '右视图由每一层最右可见节点组成；某层最右节点可能挂在很左边的父节点下，只有完整层序才能确定。'
    },
    similar: [
      { id: 102, title: '二叉树的层序遍历', slug: 'binary-tree-level-order-traversal', role: '前置练习', reason: '先掌握当前层快照与下一层生成。' },
      { id: 107, title: '二叉树的层序遍历 II', slug: 'binary-tree-level-order-traversal-ii', role: '同类巩固', reason: '同样逐层处理，改变结果组织顺序。' },
      { id: 103, title: '二叉树的锯齿形层序遍历', slug: 'binary-tree-zigzag-level-order-traversal', role: '进阶挑战', reason: '在层快照上处理交替方向。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [1,2,3,null,5,null,4] },
      frames: [
        treeFrame([1,2,3,null,5,null,4], '初始化当前层', 'root 非空，res=[]、q=[1]，进入第一轮 while。', [1], [], '未返回', '1 是队列中的待处理节点。', { queue: [1] }),
        treeFrame([1,2,3,null,5,null,4], '第一层选择 1', 'q=[1]，res.append(q[-1].val)=1，再生成 [2,3]。', [1], [], '未返回', '1 是当前层末值，也是唯一节点。', { queue: [1] }),
        treeFrame([1,2,3,null,5,null,4], '生成第二层', '遍历 1 的孩子，q 替换为 [2,3]。', [], [1], '未返回', '本帧无活动节点，queue 是下一层。', { queue: [2,3] }),
        treeFrame([1,2,3,null,5,null,4], '第二层先处理左节点 2', 'q=[2,3]，本层答案已选 3；for 循环处理 2，把左孩子 5 加入 nxt。', [2], [1,2], '未返回', '2 正被遍历，但不是右视图输出节点。', { queue: [2,3] }),
        treeFrame([1,2,3,null,5,null,4], '第二层选择 3', 'q[-1]=3，输出 3；处理 3 时把右孩子 4 加入 nxt，得到 [5,4]。', [3], [1,2,3], '未返回', '3 是本层最右节点。', { queue: [2,3] }),
        treeFrame([1,2,3,null,5,null,4], '生成第三层', '当前层完整处理后 q=[5,4]，注意 5 来自左孩子 2。', [], [1,2,3], '未返回', '队列已切换到第三层。', { queue: [5,4] }),
        treeFrame([1,2,3,null,5,null,4], '第三层选择 4 并处理 5', 'q[-1]=4，输出 4；for 循环先处理 5，它没有孩子，nxt 仍为空。', [4,5], [1,2,3,5], '未返回', '4 是输出节点，5 是当前出层处理节点。', { queue: [5,4] }),
        treeFrame([1,2,3,null,5,null,4], '处理 4 后队列耗尽', '处理 4 也没有孩子，q=[]，while 结束。', [4], [1,2,3,5,4], '[1,3,4]', '4 是最后出层节点，随后调用栈外循环结束。', { queue: [] })
      ]
    }
  },

  '114': {
    id: 114,
    title: '二叉树展开为链表',
    slug: 'flatten-binary-tree-to-linked-list',
    difficulty: '中等',
    category: '二叉树',
    summary: '后序递归分别取得左右子树尾节点，再把左子树插到右侧并接到原右子树之前；外层忽略 dfs 返回的尾节点。',
    input: '根节点 root。',
    output: '原地修改，使所有左指针为空、右指针形成先序链表；函数返回 None。',
    core: '子树内部先展开，父节点只负责拼接左右两个已展开片段。',
    walkthrough: '节点 2 先得到 lt=3、rt=4，改为 2→3→4；节点 5 保持 5→6。根把左侧片段插到右边，再把尾部 4 接到 5，形成 1→2→3→4→5→6。',
    pitfalls: 'dfs 返回的是子树尾节点，不是子树根。递归栈使它成为 O(h) 空间，不能误称 O(1)。中途层序 values 会随指针改变，不能沿用原数组。',
    observation: '节点 2 拼接后，层序快照变为 [1,2,5,null,3,6,null,4]；它与最终右链的数组不同。',
    mechanism: '先保存 l、r，再递归取得 lt、rt；若左子树存在就改当前左右指针并执行 lt.right=r。',
    invariant: 'dfs(node) 返回时，node 子树已全部左空并成为先序右链，返回值是链尾。',
    termination: '空节点返回 None；每个非空节点只递归左右孩子各一次。',
    counterexample: '只有左孩子 [1,2] 时 rt=None、lt=2，执行 lt.right=r 只是把尾右指针设为 None，结果仍是 1→2。',
    naive: '先收集先序值再重建右链会新增节点；本提交直接重接原节点指针。',
    time: 'O(n)',
    timeNote: '每个节点访问一次，指针拼接均为 O(1)。',
    space: 'O(h)',
    spaceNote: '递归栈最坏斜树 O(n)；没有新建节点或先序数组。',
    keyLines: [
      { start: 12, end: 23, text: '        def dfs(node):\n            if not node:\n                return None\n            l, r = node.left, node.right\n            lt = dfs(l)\n            rt = dfs(r)\n            if l:\n                node.right = l \n                node.left = None\n                lt.right = r \n            return rt or lt or node\n        dfs(root)' }
    ],
    challenge: {
      question: '为什么递归右子树时不需要先保存 node.right 的副本？',
      hint: '观察 r 保存的是节点对象引用，而 dfs 只重接该子树内部指针。',
      answer: 'r 已保存原右孩子身份；右子树展开不会替换这个根对象，所以之后 lt.right=r 能正确接上整条右侧链。'
    },
    similar: [
      { id: 116, title: '填充每个节点的下一个右侧节点指针', slug: 'populating-next-right-pointers-in-each-node', role: '前置练习', reason: '练习逐层重接树的横向指针。' },
      { id: 430, title: '扁平化多级双向链表', slug: 'flatten-a-multilevel-doubly-linked-list', role: '同类巩固', reason: '同样保存后续片段并原地展开嵌套结构。' },
      { id: 106, title: '从中序与后序遍历序列构造二叉树', slug: 'construct-binary-tree-from-inorder-and-postorder-traversal', role: '进阶挑战', reason: '对照后序递归中“子树完成后再合并”的顺序。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [1,null,2,null,3,null,4,null,5,null,6] },
      frames: [
        treeFrame([1,2,5,3,4,null,6], '进入根并保存片段', 'dfs(1) 保存 l=2、r=5，先递归左子树；尚未改根指针。', [1], [], '未返回', '根在等待左链尾。'),
        treeFrame([1,2,5,3,4,null,6], '进入节点 2', '保存 l=3、r=4，先递归叶子 3。', [2], [], '未返回', '2 尚未拼接。'),
        treeFrame([1,2,5,3,4,null,6], '叶子 3 返回尾 3', '3 没有孩子，返回自身。', [3], [3], '3', '3 是已完成链的尾。'),
        treeFrame([1,2,5,3,4,null,6], '叶子 4 返回尾 4', 'dfs(4) 返回后，节点 2 的 rt=4。', [4], [3,4], '4', '4 是原右子树的链尾。'),
        treeFrame([1,2,5,null,3,6,null,4], '拼接节点 2', 'lt=3，执行 2.right=3、2.left=None、3.right=4；层序快照随指针改变。', [2], [3,4,2], '4', '2 是当前拼接点，返回值是尾 4。'),
        treeFrame([1,2,5,null,3,6,null,4], '进入节点 5', '根恢复后调用 dfs(5)，5 只有右孩子 6。', [5], [3,4,2], '未返回', '5 正在计算右链尾。'),
        treeFrame([1,2,5,null,3,6,null,4], '叶子 6 返回尾 6', '6 返回自身，节点 5 的 rt=6。', [6], [3,4,2,6], '6', '6 是右侧片段链尾。'),
        treeFrame([1,2,5,null,3,6,null,4], '节点 5 保持右链', '5 的左孩子为空，不进入拼接分支，返回 rt=6。', [5], [3,4,2,6,5], '6', '5 已完成，返回值仍是尾 6。'),
        treeFrame([1,2,5,null,3,6,null,4], '根准备总拼接', '根得到 lt=4、rt=6，即将把左侧已展开片段接到右侧片段前。', [1], [3,4,2,6,5], '未返回', '1 是最后的活动拼接点。'),
        treeFrame([1,null,2,null,3,null,4,null,5,null,6], '根完成右链', '执行 1.right=2、1.left=None、4.right=5，形成先序右链。', [1], [3,4,2,6,5,1], '6', '1 的后序处理完成。'),
        treeFrame([1,null,2,null,3,null,4,null,5,null,6], '忽略尾节点并返回', '外层只调用 dfs(root)，不保存其返回值；flatten 隐式返回 None。', [], [3,4,2,6,5,1], 'None（对外）', '调用栈为空，visited 是后序完成顺序。')
      ]
    }
  },

  '105': {
    id: 105,
    title: '从前序与中序遍历序列构造二叉树',
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    difficulty: '中等',
    category: '二叉树',
    summary: '用 preorder[pl] 作根，从中序位置表 idx 找到分割点，再以 pl+size 计算左右两段的 preorder 闭区间。',
    input: '互不重复的 preorder 与 inorder，且 preorder 是 inorder 的先序排列。',
    output: '还原出的二叉树根节点。',
    core: '中序根位置左侧长度决定先序左子树占多少个元素。',
    walkthrough: '根 3 的中序位置 k=1，左子树大小 size=1，因此先序 [1,1] 构造 9，[2,4] 构造 20。',
    pitfalls: '递归需要 pl,pr,il,ir 四个边界。空条件是 pl>pr；重复值会使 idx 无法区分节点，不符合本题输入。新根创建后可能尚未挂入 values。',
    observation: '每个非空调用创建 preorder[pl]；active 可表示尚未由父调用赋值的游离根。',
    mechanism: 'idx 把值映射到中序下标，size 把中序分段长度转成先序分段终点。',
    invariant: '当前 [pl,pr] 与 [il,ir] 描述同一子树的先序和中序区间；pl<=pr 时长度一致。',
    termination: '每次递归移除根并划分出更短区间；pl>pr 时返回 None。',
    counterexample: '若右段错误地从 pl+size 开始，会重复使用左子树最后一个元素或根；正确右段从 pl+size+1 开始。',
    naive: '每层在中序切片里 index 查找根，会重复扫描并复制；当前 idx 表加边界避免切片。',
    time: 'O(n)',
    timeNote: '建表 O(n)，每个节点一次创建与常数次边界计算。',
    space: 'O(n)',
    spaceNote: 'idx 占 O(n)，递归栈最坏斜树 O(n)；输出树本身另有 n 个节点。',
    keyLines: [
      { start: 8, end: 19, text: '    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:\n        idx = {v: i for i, v in enumerate(inorder)}\n        def dfs(pl, pr, il, ir):\n            if pl > pr:\n                return None\n            root = TreeNode(preorder[pl])\n            k = idx[root.val]\n            size = k - il\n            root.left = dfs(pl + 1, pl + size, il, k - 1)\n            root.right = dfs(pl + size + 1, pr, k + 1, ir)\n            return root\n        return dfs(0, len(preorder) - 1, 0, len(inorder) - 1)' }
    ],
    challenge: {
      question: 'size=k-il 为什么恰好等于左子树的节点数？',
      hint: '中序里 [il,k-1] 的所有节点都位于根的左边。',
      answer: '这些节点构成完整左子树，所以其数量就是左子树在先序区间中需要占据的长度。'
    },
    similar: [
      { id: 106, title: '从中序与后序遍历序列构造二叉树', slug: 'construct-binary-tree-from-inorder-and-postorder-traversal', role: '同类巩固', reason: '保留中序分割，只改变先序根为后序末元素。' },
      { id: 889, title: '从前序与后序遍历序列构造二叉树', slug: 'construct-binary-tree-from-preorder-and-postorder-traversal', role: '进阶挑战', reason: '没有中序定位时只能得到可能的多棵二叉树。' },
      { id: 109, title: '有序链表转换二叉搜索树', slug: 'convert-sorted-list-to-binary-search-tree', role: '进阶挑战', reason: '比较无需 idx 表的区间递归构造。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [3,9,20,null,null,15,7] },
      frames: [
        treeFrame([], '根区间', 'dfs(pl=0,pr=4,il=0,ir=4)：preorder[0]=3，idx[3]=1，size=1；创建游离根 3。', [3], [], '未返回', '3 已创建但尚未挂接。'),
        treeFrame([], '左子树区间', 'dfs(pl=1,pr=1,il=0,ir=0)：取 9 作游离根，k=0、size=0。', [9], [], '未返回', '9 尚未成为 3 的左孩子。'),
        treeFrame([], '9 的左空区间', 'dfs(pl=2,pr=1,il=0,ir=-1)：pl>pr，返回 None。', [null], [], 'None', 'null 表示先序空区间。'),
        treeFrame([], '9 的右空区间', 'dfs(pl=2,pr=0,il=1,ir=0)：pl>pr，返回 None；dfs 返回根 9。', [null], [9], 'None', '9 的两个孩子都为空。'),
        treeFrame([3,9], '挂接左子树', 'dfs(pl=0,pr=4,il=0,ir=4) 恢复，执行 root.left=dfs(...)，9 接入 3。', [9,3], [9], '未返回', '9 完成返回，3 恢复执行赋值。'),
        treeFrame([3,9], '右子树区间', 'dfs(pl=2,pr=4,il=2,ir=4)：取 20，k=3、size=1；创建游离根 20。', [20], [9], '未返回', '20 尚未挂接。'),
        treeFrame([3,9], '20 的左子树区间', 'dfs(pl=3,pr=3,il=2,ir=2)：取 15 作游离根，k=2、size=0。', [15], [9], '未返回', '15 等待空孩子计算。'),
        treeFrame([3,9], '15 的左空区间', 'dfs(pl=4,pr=3,il=2,ir=1)：pl>pr，返回 None。', [null], [9], 'None', '空先序区间对应空左孩子。'),
        treeFrame([3,9], '15 的右空区间', 'dfs(pl=4,pr=2,il=3,ir=2)：pl>pr，返回 None；15 返回后挂为 20.left。', [null], [9,15], 'None', '15 完成，20 即将取得左返回值。'),
        treeFrame([3,9], '20 的右子树区间', 'dfs(pl=4,pr=4,il=3,ir=4)：取 7 作游离根，k=4、size=1。', [7], [9,15], '未返回', '7 尚未挂到 20。'),
        treeFrame([3,9], '7 的两个空区间', '先 dfs(pl=5,pr=4,il=3,ir=3)，再 dfs(pl=5,pr=3,il=4,ir=4)，均 pl>pr；随后 7、20 依次返回。', [null], [9,15,7,20], 'None', 'null 表示 7 的空孩子调用，20 已完成。'),
        treeFrame([3,9,20,null,null,15,7], '挂接右子树并完成根', 'dfs(pl=0,pr=4,il=0,ir=4) 恢复，root.right=20；20.left=15、20.right=7，根返回 3。', [20,3], [9,15,7,20,3], '3', '20 挂接后，3 最后完成并返回。')
      ]
    }
  },

  '437': {
    id: 437,
    title: '路径总和 III',
    slug: 'path-sum-iii',
    difficulty: '中等',
    category: '二叉树',
    summary: 'DFS 维护当前根到节点路径的前缀和 s，并在插入当前前缀之前查询 cnt[s-targetSum]；返回时撤销当前计数。',
    input: '二叉树 root（节点值可为负）与目标和 targetSum。',
    output: '所有向下路径中节点值和等于 targetSum 的路径数量。',
    core: '前缀和差定位路径起点，回溯保证计数只属于当前祖先链。',
    walkthrough: 'target=8 时，5→3、5→2→1、-3→11 三条路径分别命中，ans 最终为 3。路径不必从根开始，也不一定到叶子结束。',
    pitfalls: '必须先查询再 cnt[s]+=1，否则会把长度为 0 的路径算入。返回时 cnt[s]-=1 不能省略，否则左右子树会互相污染。初始 cnt[0]=1 支持从根开始。',
    observation: 'dp 记录当前路径上每个前缀和的出现次数；重复前缀和需要计数而非仅记录存在。',
    mechanism: '进入节点时累积 s，查询差值并插入；离开节点时删除此前缀，恢复父路径状态。',
    invariant: '进入 dfs(node,s) 前，cnt 恰好统计当前已走祖先路径（含空前缀）的前缀和次数。',
    termination: '空节点返回；每个非空节点访问左右孩子后撤销自身，最终回到空前缀状态。',
    counterexample: '[10,5,-3,3,2,null,11,3,-2,null,1] 中若只从根开始数，会漏掉 5→3 与 5→2→1，只能找到 -3→11。',
    naive: '枚举每个起点再向下搜索所有路径会重复扫描；前缀和把起点匹配降到均摊 O(1)。',
    time: 'O(n)',
    timeNote: '每个节点一次进入和撤销，defaultdict 查询均摊 O(1)。',
    space: 'O(h)',
    spaceNote: '递归栈与 cnt 中不同前缀和的数量均为 O(h)；不计答案标量。',
    keyLines: [
      { start: 8, end: 23, text: '    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:\n        cnt = defaultdict(int)\n        ans = 0\n        cnt[0] = 1\n        def dfs(node, s):\n            nonlocal ans\n            if not node:\n                return\n            s += node.val\n            ans += cnt[s - targetSum]\n            cnt[s] += 1\n            dfs(node.left, s)\n            dfs(node.right, s)\n            cnt[s] -= 1\n        dfs(root, 0)\n        return ans' }
    ],
    challenge: {
      question: '为什么左右子树都搜索完后才删除 cnt[s]？',
      hint: '孩子路径需要把当前节点作为合法起点或中间点。',
      answer: '当前前缀必须对左右两个孩子的整段搜索都可见；只有两个孩子都返回后，当前节点才离开祖先路径，才能撤销。'
    },
    similar: [
      { id: 112, title: '路径总和', slug: 'path-sum', role: '前置练习', reason: '先掌握单条根到叶子路径的递归累加。' },
      { id: 113, title: '路径总和 II', slug: 'path-sum-ii', role: '同类巩固', reason: '在路径搜索中加入回溯与结果保存。' },
      { id: 560, title: '和为 K 的子数组', slug: 'subarray-sum-equals-k', role: '进阶挑战', reason: '把树上前缀和回溯对应到数组前缀和计数。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [10,5,-3,3,2,null,11,3,-2,null,1] },
      frames: [
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '空前缀', 'cnt[0]=1，ans=0，dfs(10,0) 开始。', [10], [], '未返回', '根即将进入，dp 只有空前缀。', { path: [], dp: { '0': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '访问 10', 's=10，先查 cnt[2]=0，再插入 cnt[10]=1。', [10], [10], '未返回', '10 是当前路径末端。', { path: [10], dp: { '0': 1, '10': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '访问 5', 's=15，查 cnt[7]=0，插入 cnt[15]=1。', [5], [10,5], '未返回', '5 是当前路径末端。', { path: [10,5], dp: { '0': 1, '10': 1, '15': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '命中路径 5→3', 's=18，先查 cnt[10]=1，ans 变为 1；再插入 cnt[18]=1。', [3], [10,5,3], '未返回；ans=1', '3 是当前路径末端，dp 已记录新前缀。', { path: [10,5,3], dp: { '0': 1, '10': 1, '15': 1, '18': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '访问左侧 3', 's=21，查 cnt[13]=0，插入 cnt[21]=1。', [3], [10,5,3,3], '未返回', '两个 3 是不同节点，当前 active 指左侧孩子。', { path: [10,5,3,3], dp: { '0': 1, '10': 1, '15': 1, '18': 1, '21': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '撤销左侧 3', '左侧 3 返回后 cnt[21] 减为 0，恢复父节点路径。', [3], [10,5,3,3], '未返回', '活动节点恢复为父 3。', { path: [10,5,3], dp: { '0': 1, '10': 1, '15': 1, '18': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '访问并撤销 -2', 's=16，查 cnt[8]=0，插入再删除 cnt[16]；路径从未命中目标和。', [-2], [10,5,3,3,-2], '未返回', '-2 是刚完成回溯的叶孩子。', { path: [10,5,3], dp: { '0': 1, '10': 1, '15': 1, '18': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '父 3 完成撤销', 'cnt[18] 减 1，dfs(3) 返回，路径恢复为 [10,5]。', [3], [10,5,3,3,-2], '未返回', '父 3 正在离开当前路径。', { path: [10,5], dp: { '0': 1, '10': 1, '15': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '访问 2', 's=20，查 cnt[12]=0，插入 cnt[20]=1。', [2], [10,5,3,3,-2,2], '未返回', '2 是当前路径末端。', { path: [10,5,2], dp: { '0': 1, '10': 1, '15': 1, '20': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '命中路径 5→2→1', 's=18，查 cnt[10]=1，ans 变为 2；cnt[18] 再次增加。', [1], [10,5,3,3,-2,2,1], '未返回；ans=2', '1 是当前叶节点。', { path: [10,5,2,1], dp: { '0': 1, '10': 1, '15': 1, '20': 1, '18': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '撤销 1 与 2', '依次删除 cnt[18]、cnt[20]，dfs(2) 返回后路径恢复 [10,5]。', [2], [10,5,3,3,-2,2,1], '未返回', '2 是最后恢复的活动祖先。', { path: [10,5], dp: { '0': 1, '10': 1, '15': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '进入右子树 -3', 'dfs(5) 完成后，根 10 调用自己的右孩子 -3；s=7，查 cnt[-1]=0，插入 7。', [-3], [10,5,3,3,-2,2,1,-3], '未返回', '-3 开始另一条根路径。', { path: [10,-3], dp: { '0': 1, '10': 1, '15': 1, '7': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '命中路径 -3→11', 's=18，查 cnt[10]=1，ans 变为 3，再插入 cnt[18]。', [11], [10,5,3,3,-2,2,1,-3,11], '未返回；ans=3', '11 是第三条命中路径的末端。', { path: [10,-3,11], dp: { '0': 1, '10': 1, '15': 1, '7': 1, '18': 1 } }),
        treeFrame([10,5,-3,3,2,null,11,3,-2,null,1], '全部回溯并返回', '11、-3、5、10 依次撤销前缀，cnt 恢复为 {"0":1}，ans=3。', [], [10,5,3,3,-2,2,1,-3,11], '3', '没有活动节点，dp 已回到初始状态。', { path: [], dp: { '0': 1 } })
      ]
    }
  },

  '236': {
    id: 236,
    title: '二叉树的最近公共祖先',
    slug: 'lowest-common-ancestor-of-a-binary-tree',
    difficulty: '中等',
    category: '二叉树',
    summary: '实际执行的是返回目标节点的 DFS：命中 p 或 q 时立即返回，否则合并左右结果；文件中计数方案只是注释。',
    input: '根节点 root 与树中两个不同节点 p、q。',
    output: 'p、q 的最近公共祖先节点对象。',
    core: '子树返回 None、一个目标或当前公共祖先；左右都非空时当前节点就是答案。',
    walkthrough: 'p=5 在 dfs(5) 入口立即命中并返回，代码不会继续搜索其孩子，因此 q=4 根本不会被访问。根仍完整搜索右子树，再用 L or R 返回 5。',
    pitfalls: '必须用 node is p/node is q 判断对象身份，不能比较值。实际代码不会在左孩子已命中后跳过右孩子。被注释的 cnt==2 方案没有执行。',
    observation: 'q=4 位于 p 的子树中，但 dfs(5) 的提前返回使搜索树不经过它；这与完整计数遍历不同。',
    mechanism: '每个非目标节点先计算 L、R，再按两者是否同时非空选择当前节点或唯一非空结果。',
    invariant: 'dfs(node) 返回 None 表示子树无目标；返回目标表示找到一个；在已处理完成的双目标相遇处返回公共祖先。',
    termination: '空节点返回 None，目标节点立即返回；否则每次递归下降一层。',
    counterexample: '若 p 是 q 的祖先，就像本例 5 是 4 的祖先，则 p 本身就是最近公共祖先，且 dfs(p) 无需搜索后代。',
    naive: '被注释方案统计子树目标数并在 cnt==2 时记录 ans，能求解但会继续遍历；当前方案更短且会短路目标子树。',
    time: 'O(n)',
    timeNote: '最坏访问所有节点；命中目标可剪掉其子树，但不一定剪掉根的另一个孩子。',
    space: 'O(h)',
    spaceNote: '递归栈 O(h)，最坏斜树 O(n)；没有 cnt 数组或 parent 表。',
    keyLines: [
      { start: 10, end: 22, text: '        # ans = None\n        # def dfs(node):\n        #     nonlocal ans\n        #     if not node:\n        #         return 0\n        #     cnt = dfs(node.left) + dfs(node.right)\n        #     if node is p or node is q:\n        #         cnt += 1\n        #     if cnt == 2 and ans is None:\n        #         ans = node\n        #     return cnt\n        # dfs(root)\n        # return ans' },
      { start: 23, end: 31, text: '        def dfs(node, p, q):\n            if not node or node is p or node is q:\n                return node\n            L = dfs(node.left, p, q)\n            R = dfs(node.right, p, q)\n            if L and R:\n                return node\n            return L or R\n        return dfs(root, p, q)' }
    ],
    challenge: {
      question: '为什么左孩子已经返回 p 后，这份代码仍然调用右孩子？',
      hint: 'L 和 R 的赋值是两个顺序语句，中间没有 if L 判断。',
      answer: '它必须区分只有一个目标与左右各有一个目标；只有左右都非空时当前节点才是分叉祖先。'
    },
    similar: [
      { id: 235, title: '二叉搜索树的最近公共祖先', slug: 'lowest-common-ancestor-of-a-binary-search-tree', role: '前置练习', reason: '利用 BST 大小关系选择单一路径。' },
      { id: 1650, title: '二叉树的最近公共祖先 III', slug: 'lowest-common-ancestor-of-a-binary-tree-iii', role: '进阶挑战', reason: '在带父指针的树中寻找公共祖先。' },
      { id: 105, title: '从前序与中序遍历序列构造二叉树', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', role: '同类巩固', reason: '巩固递归返回值表达子树状态的方式。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [3,5,1,6,2,0,8,null,null,7,4] },
      frames: [
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '指定目标并进入根', 'p=5、q=4；dfs(3) 不是目标，先调用左孩子。', [3], [], '未返回', '根正在等待左结果。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '左孩子命中 p', 'node is p 成立，dfs(5) 立即返回 5，不访问 6、2、7、4。', [5], [5], '5', '5 是当前提前返回的目标节点。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '根继续搜索右孩子', 'L=5 后仍执行 R=dfs(1)，因为代码没有左命中短路。', [1], [5], '未返回', '1 是当前右子树入口。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '右子树的左孩子为空', 'dfs(0) 不是目标，其孩子为空，合并 L=None、R=None 后返回 None。', [0], [5,0], 'None', '0 完成并返回空结果。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '右子树的右孩子为空', 'dfs(8) 同样不命中，返回 None；不会访问更深节点。', [8], [5,0,8], 'None', '8 完成搜索并返回。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '节点 1 合并空结果', 'L=None、R=None，节点 1 返回 None。', [1], [5,0,8,1], 'None', '1 是最后返回的右子树节点。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '根合并左右结果', '根得到 L=5、R=None，if L and R 不成立，返回 L or R=5。', [3], [5,0,8,1,3], '5', '3 是最后恢复执行并完成的调用。'),
        treeFrame([3,5,1,6,2,0,8,null,null,7,4], '返回最近公共祖先', 'p 是 q 的祖先，因此答案为 5；visited 不含被剪掉的 q=4。', [], [5,0,8,1,3], '5', '没有活动调用，搜索结束。')
      ]
    }
  },

  '124': {
    id: 124,
    title: '二叉树中的最大路径和',
    slug: 'binary-tree-maximum-path-sum',
    difficulty: '困难',
    category: '二叉树',
    summary: '后序返回可向上延伸的单侧最大增益，同时用 node.val+l+r 更新可转弯的完整路径答案。',
    input: '非空二叉树 root，节点值可能为负数。',
    output: '任意路径的最大节点值和。',
    core: 'ans 与返回值语义不同：前者可以转弯，后者只能从当前节点向一侧延伸。',
    walkthrough: '15、7 分别返回 15、7，节点 20 得到 15+20+7=42；根组合 -10+9+20=19，不能超过 42。',
    pitfalls: '返回 0 的空节点与 max(0,child) 会丢弃负的孩子增益，但不能把负的当前 node.val 也裁成 0。ans 必须初始化为 -inf，不能设 0。',
    observation: '最大路径是 15→20→7；节点 20 返回 20 给父节点，而 ans 保留 42。',
    mechanism: '左右返回值先与 0 取最大值，再用两者之和更新 ans，最后只选较大一侧返回。',
    invariant: 'dfs(node) 返回从 node 开始向下任选一侧的最大增益；ans 是已处理节点能形成的最大完整路径和。',
    termination: '空节点返回 0；每个非空节点处理左右更小子树后回推。',
    counterexample: '单节点 [-3] 中 l=r=0，ans=-3，返回值也是 -3；若初始化 ans=0 会错误输出 0。',
    naive: '枚举每个转折点并重复搜索左右深度会退化；后序一次同时计算两侧最优增益。',
    time: 'O(n)',
    timeNote: '每个节点一次后序合并。',
    space: 'O(h)',
    spaceNote: '递归栈 O(h)，最坏斜树 O(n)；ans 为 O(1)。',
    keyLines: [
      { start: 8, end: 19, text: '    def maxPathSum(self, root: TreeNode | None) -> int:\n        ans = -inf\n        def dfs(node):\n            nonlocal ans\n            if not node:\n                return 0\n            l = max(0, dfs(node.left))\n            r = max(0, dfs(node.right))\n            ans = max(ans, node.val + l + r)\n            return node.val + max(l, r)\n        dfs(root)\n        return ans' }
    ],
    challenge: {
      question: '为什么负孩子可以被忽略，负当前节点却不能？',
      hint: '区分“可以不接的孩子”和“必须作为路径一部分的当前节点”。',
      answer: '路径可以不经过孩子，所以负增益可选 0；但 dfs(node) 定义从 node 开始，node.val 必须计入返回值与候选。'
    },
    similar: [
      { id: 152, title: '乘积最大子数组', slug: 'maximum-product-subarray', role: '前置练习', reason: '比较维护当前段答案与可延伸状态。' },
      { id: 687, title: '最长同值路径', slug: 'longest-univalue-path', role: '同类巩固', reason: '同样合并左右单侧结果并更新全局路径答案。' },
      { id: 543, title: '二叉树的直径', slug: 'diameter-of-binary-tree', role: '同类巩固', reason: '结构相同，但直径按边数而本题按节点权值和。' }
    ],
    viz: {
      family: 'tree',
      data: { values: [-10,9,20,null,null,15,7] },
      frames: [
        treeFrame([-10,9,20,null,null,15,7], '初始化答案', 'ans=-inf，dfs(-10) 先计算左孩子 9。', [-10], [], '未返回', '根正在等待左增益。'),
        treeFrame([-10,9,20,null,null,15,7], '左孩子 9 返回', '9 是叶子，ans=max(-inf,9)=9，返回增益 9。', [9], [9], '9；ans=9', '9 已完成单侧增益。'),
        treeFrame([-10,9,20,null,null,15,7], '进入节点 20', '根得到 l=9 后，dfs(-10) 调用右孩子 20。', [20], [9], '未返回', '20 正在计算左右增益。'),
        treeFrame([-10,9,20,null,null,15,7], '左孩子 15 返回', 'dfs(15)=15，父节点裁剪为 max(0,15)=15。', [15], [9,15], '15', '15 是当前完成的左孩子。'),
        treeFrame([-10,9,20,null,null,15,7], '右孩子 7 返回', 'dfs(7)=7，父节点裁剪为 max(0,7)=7。', [7], [9,15,7], '7', '7 是当前完成的右孩子。'),
        treeFrame([-10,9,20,null,null,15,7], '在 20 转弯得到 42', 'l=15、r=7，ans=max(9,20+15+7)=42；返回 20+max(15,7)=20。', [20], [9,15,7,20], '20；ans=42', '20 同时计算完整路径和单侧增益。', { path: [15,20,7] }),
        treeFrame([-10,9,20,null,null,15,7], '根合并两侧', '根 l=9、r=20，候选 -10+9+20=19，ans 保持 42。', [-10], [9,15,7,20,-10], '未返回；ans=42', '根正在比较完整候选。'),
        treeFrame([-10,9,20,null,null,15,7], '根返回单侧增益', '根返回 -10+max(9,20)=10，但这不是最终答案。', [-10], [9,15,7,20,-10], '10；ans=42', '根的最后回推不覆盖 ans。'),
        treeFrame([-10,9,20,null,null,15,7], '返回最大路径和', '外层返回 ans=42，对应路径 15→20→7。', [], [9,15,7,20,-10], '42', '递归栈清空，答案与单侧返回值分离。')
      ]
    }
  }
};

const SOURCES: { url: string; license: string; note: string }[] = [
  { url: 'https://leetcode.cn/problems/binary-tree-inorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 94「二叉树的中序遍历」与 binary-tree-inorder-traversal。' },
  { url: 'https://leetcode.cn/problems/maximum-depth-of-binary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 104「二叉树的最大深度」与 maximum-depth-of-binary-tree。' },
  { url: 'https://leetcode.cn/problems/invert-binary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 226「翻转二叉树」与 invert-binary-tree。' },
  { url: 'https://leetcode.cn/problems/symmetric-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 101「对称二叉树」与 symmetric-tree。' },
  { url: 'https://leetcode.cn/problems/diameter-of-binary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 543「二叉树的直径」与 diameter-of-binary-tree。' },
  { url: 'https://leetcode.cn/problems/binary-tree-level-order-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 102「二叉树的层序遍历」与 binary-tree-level-order-traversal。' },
  { url: 'https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 108「将有序数组转换为二叉搜索树」与 convert-sorted-array-to-binary-search-tree。' },
  { url: 'https://leetcode.cn/problems/validate-binary-search-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 98「验证二叉搜索树」与 validate-binary-search-tree。' },
  { url: 'https://leetcode.cn/problems/kth-smallest-element-in-a-bst/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 230「二叉搜索树中第 K 小的元素」与 kth-smallest-element-in-a-bst。' },
  { url: 'https://leetcode.cn/problems/binary-tree-right-side-view/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 199「二叉树的右视图」与 binary-tree-right-side-view。' },
  { url: 'https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 114「二叉树展开为链表」与 flatten-binary-tree-to-linked-list。' },
  { url: 'https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 105「从前序与中序遍历序列构造二叉树」与 canonical slug construct-binary-tree-from-preorder-and-inorder-traversal。' },
  { url: 'https://leetcode.cn/problems/path-sum-iii/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 437「路径总和 III」与 path-sum-iii。' },
  { url: 'https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 236「二叉树的最近公共祖先」与 lowest-common-ancestor-of-a-binary-tree。' },
  { url: 'https://leetcode.cn/problems/binary-tree-maximum-path-sum/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 124「二叉树中的最大路径和」与 binary-tree-maximum-path-sum。' },
  { url: 'https://leetcode.cn/problems/binary-tree-preorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 144「二叉树的前序遍历」与 binary-tree-preorder-traversal。' },
  { url: 'https://leetcode.cn/problems/binary-tree-postorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 145「二叉树的后序遍历」与 binary-tree-postorder-traversal。' },
  { url: 'https://leetcode.cn/problems/n-ary-tree-preorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 589「N 叉树的前序遍历」与 n-ary-tree-preorder-traversal。' },
  { url: 'https://leetcode.cn/problems/minimum-depth-of-binary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 111「二叉树的最小深度」与 minimum-depth-of-binary-tree。' },
  { url: 'https://leetcode.cn/problems/balanced-binary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 110「平衡二叉树」与 balanced-binary-tree。' },
  { url: 'https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 559「N 叉树的最大深度」与 maximum-depth-of-n-ary-tree。' },
  { url: 'https://leetcode.cn/problems/same-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 100「相同的树」与 same-tree。' },
  { url: 'https://leetcode.cn/problems/subtree-of-another-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 572「另一棵树的子树」与 subtree-of-another-tree。' },
  { url: 'https://leetcode.cn/problems/merge-two-binary-trees/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 617「合并二叉树」与 merge-two-binary-trees。' },
  { url: 'https://leetcode.cn/problems/longest-univalue-path/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 687「最长同值路径」与 longest-univalue-path。' },
  { url: 'https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 107「二叉树的层序遍历 II」与 binary-tree-level-order-traversal-ii。' },
  { url: 'https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 103「二叉树的锯齿形层序遍历」与 binary-tree-zigzag-level-order-traversal。' },
  { url: 'https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 109「有序链表转换二叉搜索树」与 convert-sorted-list-to-binary-search-tree。' },
  { url: 'https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 889「从前序与后序遍历序列构造二叉树」与 construct-binary-tree-from-preorder-and-postorder-traversal。' },
  { url: 'https://leetcode.cn/problems/search-in-a-binary-search-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 700「二叉搜索树中的搜索」与 search-in-a-binary-search-tree。' },
  { url: 'https://leetcode.cn/problems/convert-bst-to-greater-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 538「把二叉搜索树转换为累加树」与 convert-bst-to-greater-tree。' },
  { url: 'https://leetcode.cn/problems/delete-node-in-a-bst/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 450「删除二叉搜索树中的节点」与 delete-node-in-a-bst。' },
  { url: 'https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 116「填充每个节点的下一个右侧节点指针」与 populating-next-right-pointers-in-each-node。' },
  { url: 'https://leetcode.cn/problems/flatten-a-multilevel-doubly-linked-list/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 430「扁平化多级双向链表」与 flatten-a-multilevel-doubly-linked-list。' },
  { url: 'https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 106「从中序与后序遍历序列构造二叉树」与 construct-binary-tree-from-inorder-and-postorder-traversal。' },
  { url: 'https://leetcode.cn/problems/path-sum/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 112「路径总和」与 path-sum。' },
  { url: 'https://leetcode.cn/problems/path-sum-ii/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 113「路径总和 II」与 path-sum-ii。' },
  { url: 'https://leetcode.cn/problems/subarray-sum-equals-k/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 560「和为 K 的子数组」与 subarray-sum-equals-k。' },
  { url: 'https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 235「二叉搜索树的最近公共祖先」与 lowest-common-ancestor-of-a-binary-search-tree。' },
  { url: 'https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-iii/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取 Plus 页面可见元数据，仅核验 1650「二叉树的最近公共祖先 III」与 slug；未声称读取题面或题解。' },
  { url: 'https://leetcode.cn/problems/maximum-product-subarray/', license: '力扣公开题目元数据；未转载题面或题解。', note: '2026-11-25 实际读取页面，核验 152「乘积最大子数组」与 maximum-product-subarray。' }
];

export { SOURCES };
