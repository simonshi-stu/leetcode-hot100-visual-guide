import type { Guide } from '../types';

export const guides: Record<string, Guide> = {
  '1': {
    id: 1,
    title: '两数之和',
    slug: 'two-sum',
    difficulty: '简单',
    category: '哈希',
    summary: '在无序整数数组中寻找两个不同位置，使它们的值相加等于 target，并返回这两个位置的下标。题目保证只有一个有效答案。',
    input: '整数数组 nums 与目标值 target。',
    output: '长度通常为 2 的下标数组；先出现的数放在前面。原提交在无答案时返回空数组。',
    core: '边遍历边把“数值 → 下标”存入 pos；遇到 x 时先查 target - x，再存入 x。',
    walkthrough: '以 nums = [2, 7, 11, 4]、target = 13 为例。检查 2 时需要 11，表中没有，于是记录 2→0。检查 7 时需要 6，仍没有，记录 7→1。检查 11 时需要 2，查到 2 在下标 0，立即返回 [0, 2]。当前元素尚未入表，因此不会拿自己和自己配对。',
    pitfalls: ['先把当前元素入表再查补数，target 为偶数且答案为同一个下标时会误判。', '题目要求的是下标，返回 nums.index(补数) 会误把值当下标。', '哈希表只保存一个下标；若输入出现重复值，后写入的会覆盖旧下标，但本题保证唯一答案。'],
    observation: '每到一个新位置，答案所需的另一个数已经确定，就是 target - x；无需重新扫描整个数组。',
    mechanism: 'for j, x 先计算 need，命中时用 pos[need] 取旧下标；未命中才执行 pos[x] = j。这个顺序保证配对元素来自不同位置。',
    invariant: '处理下标 j 前，pos 恰好保存 nums[0..j-1] 中每个值最后出现的位置。',
    termination: '找到补数立即 return；否则 j 每次递增 1，遍历完 n 个数后返回 []。',
    counterexample: 'nums = [3, 3]、target = 6。若在查询前写入 3→1，第二个 3 会把自己当补数，错误返回 [1, 1]。',
    naive: '枚举所有 i < j 并检查 nums[i] + nums[j]，需要 O(n²) 次配对。',
    time: 'O(n)',
    timeNote: '每个元素只查表、入表各一次；这里按哈希操作平均 O(1) 计算。',
    space: 'O(n)',
    spaceNote: 'pos 最多保存 n 个不同数值，返回数组只占常数空间。',
    keyLines: [
      { start: 5, end: 8, text: '            need = target - x\n            if need in pos:\n                return [pos[need], j]\n            pos[x] = j' }
    ],
    challenge: {
      question: '如果允许重复值且有多个答案，你希望返回第一个找到的下标对，还是全部下标对？',
      hint: '“第一个找到”和“全部找到”需要保存的历史信息不同。',
      answer: '返回第一个找到的下标对仍可用上述代码；要返回全部下标对，应把 pos 的值改成下标列表，并在每个补数列表上枚举所有旧下标。'
    },
    similar: [
      { id: 167, title: '两数之和 II - 输入有序数组', slug: 'two-sum-ii-input-array-is-sorted', role: '前置练习', reason: '把相同目标和问题放到有序数组上，可用对撞双指针省去哈希表。' },
      { id: 560, title: '和为 K 的子数组', slug: 'subarray-sum-equals-k', role: '进阶挑战', reason: '同样先确定 complement，但查询对象变成前缀和，且需要保存出现次数。' }
    ],
    viz: {
      family: 'hash',
      data: { values: [2, 7, 11, 15, 4], target: 13 },
      frames: [
        { title: '准备扫描', detail: 'index=0 表示即将检查 nums[0]；pos 只保存此前已检查的元素。', state: { values: [2, 7, 11, 15, 4], index: 0, table: [], note: 'target=13，查找与入表都还没有开始。' } },
        { title: '2 查不到补数 11', detail: '检查下标 0 的 2，need=13-2=11，空表没有 11。', state: { values: [2, 7, 11, 15, 4], index: 0, table: [], note: '先查询；当前元素还没有写入 pos。' } },
        { title: '记录 2→0', detail: '查询落空后执行 pos[x]=j，把下标 0 的 2 留给后面的元素配对。', state: { values: [2, 7, 11, 15, 4], index: 0, table: [['2', 0]], note: '下标 0 处理完毕，下一次检查 7。' } },
        { title: '7 查不到补数 6', detail: '检查下标 1 的 7，need=6，pos 中只有 2。', state: { values: [2, 7, 11, 15, 4], index: 1, table: [['2', 0]], note: '未命中，不提前返回。' } },
        { title: '记录 7→1', detail: '把 7 与下标 1 存入 pos，供后续位置查找。', state: { values: [2, 7, 11, 15, 4], index: 1, table: [['2', 0], ['7', 1]], note: '历史记录增加一项。' } },
        { title: '11 命中补数 2', detail: '检查下标 2 的 11，need=2，pos 给出旧下标 0。', state: { values: [2, 7, 11, 15, 4], index: 2, table: [['2', 0], ['7', 1]], note: '11+2=13，准备返回 [0,2]。' } },
        { title: '答案 [0, 2]', detail: 'pos[2]=0 与当前 j=2 构成两个不同位置，函数立即返回。', state: { values: [2, 7, 11, 15, 4], index: 2, table: [['2', 0], ['7', 1]], note: '后面的 15 和 4 不再检查。' } }
      ]
    }
  },
  '49': {
    id: 49,
    title: '字母异位词分组',
    slug: 'group-anagrams',
    difficulty: '中等',
    category: '哈希',
    summary: '把只含小写英文字母的字符串数组按字母异位词分组。同一组字符串的字母种类和每种字母的数量都相同。',
    input: '字符串数组 strs；字符串可能为空。',
    output: '二维数组，每个内层数组是一组异位词；组与组内顺序都可以任意。',
    core: '用 26 个字母的出现次数构造元组 key，groups[key] 收集具有相同 key 的字符串。',
    walkthrough: '对 ["eat", "tea", "tan", "ate", "bat"]，eat 的计数是 a1、e1、t1，建立第 0 组。tea 虽顺序不同，计数完全相同，进入第 0 组。tan 是 a1、n1、t1，另建第 1 组。ate 回到第 0 组，bat 因 b1、a1、t1 新建第 2 组。',
    pitfalls: ['直接按原字符串哈希，会把 eat 和 tea 分成不同组。', '原提交用 ord(c)-ord(\'a\') 定位，输入含大写或其他字符会越界或混淆。', 'Python 的 list 不能作字典键；这里必须先转成 tuple(count)。', '空字符串的计数元组全是 0，是一个合法分组键，不应跳过。'],
    observation: '字母排列顺序不影响分组，26 维计数向量却能唯一表示每种小写字母的数量。',
    mechanism: '每处理一个 s 都新建 count，逐字符累加，再把 count 转成不可变元组。defaultdict(list) 对第一次出现的键自动建立空列表。',
    invariant: '每处理完一个字符串，它已经且只存在于对应计数元组的列表中。',
    termination: '外层 for 严格向右遍历 strs；每个内层 for 严格遍历当前字符串，所有字符处理完后返回 groups 的所有值。',
    counterexample: '只比较字母种类会把 "aab" 和 "abb" 误分为一组；两者都有 a、b，但 a 与 b 的数量不同，计数向量并不相等。',
    naive: '枚举未分组字符串，再与其他字符串排序后比较，最坏需要 O(N²·K log K)。',
    time: 'O(NK)',
    timeNote: 'N 为字符串数，K 为最大字符串长度；每个字符串恰好扫描 K 个字符，元组键长度固定为 26。',
    space: 'O(NK)',
    spaceNote: '计数键、groups 中的引用与返回分组共同占用空间；不计输入和输出时，键本身需要 O(26N) 空间。',
    keyLines: [
      { start: 10, end: 14, text: '            count = [0] * 26\n            for c in s:\n                count[ord(c) - ord(\'a\')] += 1\n            key = tuple(count)\n            groups[key].append(s)' }
    ],
    challenge: {
      question: '如果字符可能是任意 Unicode 字符，26 长度数组还能直接使用吗？',
      hint: '固定长度依赖字符集大小与连续编号。',
      answer: '不能。应改用字典或 Counter 记录字符频次，再把计数项排序后转成可哈希的键，同时处理空字符串。'
    },
    similar: [
      { id: 242, title: '有效的字母异位词', slug: 'valid-anagram', role: '前置练习', reason: '先掌握两个字符串计数相等的判断，再扩展到多字符串分组。' },
      { id: 249, title: '移位字符串分组', slug: 'group-shifted-strings', role: '同类巩固', reason: '同样需要设计规范化哈希键，但判断依据从字母计数变成相邻字符的移位差。' }
    ],
    viz: {
      family: 'hash',
      data: { values: ['eat', 'tea', 'tan', 'ate', 'bat'] },
      frames: [
        { title: '建立空哈希表', detail: 'index=0 表示尚未处理任何字符串；表中的 value 是该 key 首次出现时的组序号。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 0, table: [], note: '键 a1e1t1 表示 a、e、t 各出现一次。' } },
        { title: 'eat 建立第 0 组', detail: '扫描 eat 得到 a1e1t1，表里没有此键，自动创建列表并加入 eat。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 1, table: [['a1e1t1', 0]], note: 'index 现在表示已处理完下标 0。' } },
        { title: 'tea 加入第 0 组', detail: 'tea 的字符顺序改变，26 维计数仍是 a1e1t1，因此复用已有组。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 2, table: [['a1e1t1', 0]], note: '组 0 当前为 ["eat","tea"]。' } },
        { title: 'tan 建立第 1 组', detail: 'tan 得到 a1n1t1，与已有键不同，创建新组。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 3, table: [['a1e1t1', 0], ['a1n1t1', 1]], note: 'e 换成 n 后，计数向量改变。' } },
        { title: 'ate 回到第 0 组', detail: 'ate 再次得到 a1e1t1，追加到第 0 组末尾。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 4, table: [['a1e1t1', 0], ['a1n1t1', 1]], note: '组 0 当前为 ["eat","tea","ate"]。' } },
        { title: 'bat 建立第 2 组', detail: 'bat 得到 a1b1t1，新键对应第 2 组。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 5, table: [['a1e1t1', 0], ['a1n1t1', 1], ['a1b1t1', 2]], note: '五个字符串均已完成计数和入组。' } },
        { title: '返回三组', detail: 'index=5 等于数组长度，表示输入处理完毕；按首次出现顺序返回组值。', state: { values: ['eat', 'tea', 'tan', 'ate', 'bat'], index: 5, table: [['a1e1t1', 0], ['a1n1t1', 1], ['a1b1t1', 2]], note: '[["eat","tea","ate"],["tan"],["bat"]]。' } }
      ]
    }
  },
  '128': {
    id: 128,
    title: '最长连续序列',
    slug: 'longest-consecutive-sequence',
    difficulty: '中等',
    category: '哈希',
    summary: '从无序整数数组中找出数值相差 1 的最长序列长度。序列只要求数字连续，元素在原数组中的位置可以不相邻。',
    input: '未排序整数数组 nums，可以为空，也可以包含重复值。',
    output: '最长连续序列的长度；空数组返回 0。',
    core: '集合去重；只从没有 x-1 的 x 开始，向右连续查找 x+1、x+2……。',
    walkthrough: 'nums=[100,4,200,1,3,2] 去重后，从 1 开始，因为 0 不在集合中。依次找到 2、3、4，得到长度 4。处理 100 时向前找不到 99，只能得到长度 1；200 同样如此。其余非起点直接跳过。',
    pitfalls: ['对每个元素都向前后扩展，会把同一段序列重复扫描，退化到 O(n²)。', '把“原数组下标连续”误当成题目要求，会得到错误结论。', '忘记先去重，重复数字会干扰计数或增加无用工作。', '只做排序后扫描虽然可行，但不满足题目要求的 O(n) 时间。'],
    observation: '每条连续序列只有最小值没有前驱；抓住这个唯一起点，就只需把每段序列扫描一遍。',
    mechanism: '外层遍历集合 s；x-1 在集合中时 continue。通过该检查后，y 从 x 开始，只要 y+1 存在就递增，最后用 y-x+1 更新 best。',
    invariant: '当前扩展开始时，x 是某段连续整数的最小值；y 始终是该段中已确认存在的最后一个整数。',
    termination: '内层 y 每次严格加 1，遇到第一个缺失整数停止；外层遍历有限集合后结束。',
    counterexample: 'nums=[1,2,3,4] 若从每个 x 都扩展，会分别扫描长度 4、3、2、1；x-1 的存在性检查让这些计算只发生一次。',
    naive: '排序后线性扫描可做到 O(n log n)；若不排序，枚举每个起点并查数组则可能达到 O(n³)。',
    time: 'O(n)',
    timeNote: '外层对每个不同值检查一次；成功起点的内层总步数不超过不同值的总数。',
    space: 'O(n)',
    spaceNote: '集合保存所有不同数值，best 与 y 只占常数空间。',
    keyLines: [
      { start: 6, end: 11, text: '            if x - 1 in s:\n                continue\n            y = x\n            while y + 1 in s:\n                y += 1\n            best = max(best, y - x + 1)' }
    ],
    challenge: {
      question: '如果要求返回最长序列本身，遇到多个同长度序列时优先返回最小值最小的一段，该怎么改？',
      hint: '保存起点、终点和当前最优比较条件。',
      answer: '长度相同时比较已保存起点与新 x，保留较小者；扩展结束后用 range(x, y+1) 生成序列。'
    },
    similar: [
      { id: 674, title: '最长连续递增序列', slug: 'longest-continuous-increasing-subsequence', role: '前置练习', reason: '先在一段扫描中维护连续长度，再理解本题“数值连续但原下标可打乱”的集合模型。' },
      { id: 220, title: '存在重复元素 III', slug: 'contains-duplicate-iii', role: '进阶挑战', reason: '同样把数组信息放入集合，但还要同时限制数值差与下标距离。' }
    ],
    viz: {
      family: 'hash',
      data: { values: [100, 4, 200, 1, 3, 2] },
      frames: [
        { title: '去重并建立集合', detail: 'index=0 是外层遍历位置；本次 Python 小整数集合迭代从 x=1 开始。table 展示完整集合。', state: { values: [100, 4, 200, 1, 3, 2], index: 0, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: 'best=0，值后的 1 只表示该数存在。' } },
        { title: '从 1 开始，y=1', detail: '0 不在集合，1 是合法起点；while 尚未前进，当前长度 1。', state: { values: [100, 4, 200, 1, 3, 2], index: 0, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: 'best 仍为 0；当前已确认长度 1，内层 while 结束后才会更新 best。' } },
        { title: '找到 2，y=2', detail: 'y+1=2 存在，内层把 y 前进到 2。', state: { values: [100, 4, 200, 1, 3, 2], index: 0, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '从起点 1 已确认两个连续数字。' } },
        { title: '找到 3，y=3', detail: 'y+1=3 存在，继续向右扩展。', state: { values: [100, 4, 200, 1, 3, 2], index: 0, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '当前段为 1、2、3。' } },
        { title: '找到 4，更新答案', detail: 'y+1=4 存在，随后 y+1=5 缺失，结束扩展；y-x+1=4。', state: { values: [100, 4, 200, 1, 3, 2], index: 0, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: 'best=4；这一段不会再从 2、3、4 重复扩展。' } },
        { title: '跳过非起点', detail: 'x=2 时 1 存在，x=3 时 2 存在，两者都 continue；index 已到 x=100 的位置。', state: { values: [100, 4, 200, 1, 3, 2], index: 3, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '这里合并展示两次同类跳过，best 仍为 4。' } },
        { title: '100 是孤立起点', detail: '99 不在集合，100 可以开始；101 也不在集合，长度仅为 1。', state: { values: [100, 4, 200, 1, 3, 2], index: 3, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '较短段不会覆盖 best=4。' } },
        { title: '4 已有前驱', detail: '处理 x=4 时发现 3 在集合中，直接跳过。', state: { values: [100, 4, 200, 1, 3, 2], index: 4, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '它属于已经从 1 扫描过的段。' } },
        { title: '200 是孤立起点', detail: '199 和 201 都缺失，长度仍为 1。', state: { values: [100, 4, 200, 1, 3, 2], index: 5, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '所有集合元素均已检查。' } },
        { title: '返回 4', detail: 'index=6 表示外层遍历结束。', state: { values: [100, 4, 200, 1, 3, 2], index: 6, table: [['1', 1], ['2', 1], ['3', 1], ['4', 1], ['100', 1], ['200', 1]], note: '最长连续序列是 [1,2,3,4]。' } }
      ]
    }
  },
  '283': {
    id: 283,
    title: '移动零',
    slug: 'move-zeroes',
    difficulty: '简单',
    category: '双指针',
    summary: '原地把数组中的全部 0 移到末尾，同时保持所有非零元素的相对顺序。',
    input: '整数数组 nums，至少有一个元素。',
    output: '不返回新数组；nums 本身变为非零段在前、零段在后。原提交末尾的 return nums 不影响原地修改。',
    core: 'i 指向下一个非零数应写入的位置，j 从左到右寻找非零数；找到后交换并前移 i。',
    walkthrough: 'nums=[0,1,0,3,12]。j=0 遇到 0，不改。j=1 的 1 与 i=0 的 0 交换，得到 [1,0,0,3,12]。j=3 时把 3 交换到 i=1，j=4 时把 12 交换到 i=2，最终得到 [1,3,12,0,0]。',
    pitfalls: ['用新数组装非零数再拼接，违反原地要求。', '把非零元素两两交换，会破坏它们的相对顺序。', '把所有值大于 0 当作非零，会漏掉负数；判断必须写 nums[j] != 0。', '只在所有非零数连续时测试，容易误以为可以直接覆盖。'],
    observation: '扫描位置 j 右侧尚未检查，i 左侧已经整理完毕；中间夹着的数都是零。',
    mechanism: '每次 j 前进一格；只有当前值非零时，交换 nums[i] 与 nums[j]，再把 i 前移一格。i=j 时交换自身，仍然保持正确。',
    invariant: '每轮开始前，nums[0..i-1] 是按原顺序排列的已发现非零数，nums[i..j-1] 全为 0。',
    termination: 'j 从 0 严格递增到 n-1；所有元素检查完毕后，剩余位置必为零。',
    counterexample: '对 [1,0,2] 直接交换两个非零数 1 和 2 会得到 [2,0,1]，相对顺序被破坏；扫描指针只与写指针交换则保持 [1,2,0]。',
    naive: '先收集所有非零数，再补零并写回，逻辑简单但需要 O(n) 额外数组。',
    time: 'O(n)',
    timeNote: 'j 恰好扫描 n 个位置，每个位置最多触发一次交换。',
    space: 'O(1)',
    spaceNote: '只使用 i、j、n 三个标量；数组由输入原地修改。',
    keyLines: [
      { start: 8, end: 11, text: '        for j in range(n):\n            if nums[j] != 0:\n                nums[i], nums[j] = nums[j], nums[i]\n                i += 1' }
    ],
    challenge: {
      question: '如果要求尽量减少赋值次数，你会在哪一步跳过交换？',
      hint: '当写指针和扫描指针指向同一位置时，交换没有实际作用。',
      answer: '只有 nums[j] != 0 且 i != j 时才交换；但 i 仍要在遇到非零数时递增。'
    },
    similar: [
      { id: 27, title: '移除元素', slug: 'remove-element', role: '前置练习', reason: '同样用写指针保留符合条件元素，可熟悉写指针边界。' },
      { id: 26, title: '删除有序数组中的重复项', slug: 'remove-duplicates-from-sorted-array', role: '同类巩固', reason: '把保留条件从“非零”换成“与上一个保留值不同”，继续维护有序前缀。' }
    ],
    viz: {
      family: 'twoPointer',
      data: { values: [0, 1, 0, 3, 12] },
      frames: [
        { title: '两个指针就位', detail: 'left=i=0 是写入位置，right=j=0 是当前扫描位置；j 的区间是 [0,n)，right=n 表示扫描结束。', state: { values: [0, 1, 0, 3, 12], left: 0, right: 0, answer: '[]', note: '尚未整理任何非零数。' } },
        { title: '第一个零跳过', detail: 'right=0 的值为 0，不交换，left 保持 0。', state: { values: [0, 1, 0, 3, 12], left: 0, right: 0, answer: '[]', note: 'right 随后前进到 1。' } },
        { title: '把 1 交换到前缀', detail: 'right=1 非零，交换 left=0 与 right=1，left 前进到 1。', state: { values: [1, 0, 0, 3, 12], left: 1, right: 1, answer: '[1]', note: '零被换到刚扫过的位置。' } },
        { title: '中间的零跳过', detail: 'right=2 仍为 0，数组与 left 均不变。', state: { values: [1, 0, 0, 3, 12], left: 1, right: 2, answer: '[1]', note: 'left..right-1 目前全为零。' } },
        { title: '把 3 放到下标 1', detail: 'right=3 非零，交换 nums[1] 与 nums[3]，left 变为 2。', state: { values: [1, 3, 0, 0, 12], left: 2, right: 3, answer: '[1,3]', note: '两个非零数的先后顺序保持不变。' } },
        { title: '把 12 放到下标 2', detail: 'right=4 非零，交换 nums[2] 与 nums[4]，left 变为 3。', state: { values: [1, 3, 12, 0, 0], left: 3, right: 4, answer: '[1,3,12]', note: '尾部已经出现两个零。' } },
        { title: '扫描结束', detail: 'right=5=n 表示右边界已越过末尾；left=3 指向零段起点。', state: { values: [1, 3, 12, 0, 0], left: 3, right: 5, answer: '[1,3,12,0,0]', note: '最终答案就是当前 nums。' } }
      ]
    }
  },
  '11': {
    id: 11,
    title: '盛最多水的容器',
    slug: 'container-with-most-water',
    difficulty: '中等',
    category: '双指针',
    summary: '在垂线数组中选择两条线，与 x 轴组成容器，求能容纳的最大水量。',
    input: '非负整数数组 height，每条线宽度忽略不计。',
    output: '最大面积，即两条线的下标距离乘以较矮线的高度。',
    core: '从最左和最右线开始，每次计算面积，并舍弃较矮的那条线。',
    walkthrough: 'height=[1,8,6,2,5,4,8,3,7]。最初 (0,8) 面积为 8，舍弃左边高度 1。接着 (1,8) 面积为 7×7=49，左线 8 高于右线 7，所以舍弃右边。后续组合宽度变小，即使出现高度 8 也没有超过 49。',
    pitfalls: ['把面积算成 distance × max(高度)，较矮线才是水面上限。', '把接雨水的“中间每格累计”混进容器问题，本题只选两条边。', '只移动较高的指针会丢失可能更优的组合。', 'left=right 时宽度为 0，不应继续当作有效容器。'],
    observation: '固定左右边界后，容器高度由较矮边决定；向中间移动较矮边，是保留其余可能最优解的必要收缩。',
    mechanism: '每轮先算 area=(right-left)*min(height[left],height[right]) 并更新 ans；若左线不高于右线就左移，否则右移。',
    invariant: '尚未检查的候选边界都位于 [left,right] 内；已经被舍弃边界参与的组合不可能优于当前 ans。',
    termination: '每轮 left 或 right 严格向中间移动一格，left<right 最终不成立，最多检查 n-1 个边界对。',
    counterexample: 'height=[1,3,2,1] 在 (0,3) 面积为 1。若错误保留左边 1 并把右边 1 左移，会得到 (0,2) 面积 2，再按错误规则移动右边便结束，漏掉 (1,3) 的面积 3；每次舍弃较矮边才能保留全部可能最优组合。',
    naive: '枚举所有 i<j 并计算面积，需要 O(n²)。',
    time: 'O(n)',
    timeNote: '每次循环至少排除一个边界，总循环次数为 n-1。',
    space: 'O(1)',
    spaceNote: '只保存两个指针与最大面积。',
    keyLines: [
      { start: 6, end: 11, text: '            area = (right - left) * min(height[left], height[right])\n            ans = max(ans, area)\n            if height[left] <= height[right]:\n                left += 1\n            else:\n                right -= 1' }
    ],
    challenge: {
      question: '当 height[left] == height[right] 时，原代码选择左移。为什么不会漏掉最优解？',
      hint: '分别思考保留左边、移动右边，以及保留右边、移动左边所能覆盖的组合。',
      answer: '两条边一样高时，当前面积由共同高度决定。任何包含左边且右边更靠内的组合，都会被保留右边、左移的后续过程覆盖；任何包含右边且左边更靠内的组合，都会被当前左移覆盖。因此只移动一边足够。'
    },
    similar: [
      { id: 167, title: '两数之和 II - 输入有序数组', slug: 'two-sum-ii-input-array-is-sorted', role: '前置练习', reason: '练习根据当前两端状态决定向中间移动哪一侧。' },
      { id: 42, title: '接雨水', slug: 'trapping-rain-water', role: '同类巩固', reason: '同样使用左右高度做决策，但接雨水要累计每格水量，并维护两侧最大值。' },
      { id: 84, title: '柱状图中最大的矩形', slug: 'largest-rectangle-in-histogram', role: '进阶挑战', reason: '从两条边扩展到连续多根柱子的高度上界，需要单调栈维护候选。' }
    ],
    viz: {
      family: 'twoPointer',
      data: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
      frames: [
        { title: '选择最外侧两条线', detail: 'left=0，right=8；两个边界都包含在候选中。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 0, right: 8, answer: '0', note: 'ans 初始为 0。' } },
        { title: '面积 8，舍弃左边', detail: '(8-0)×min(1,7)=8；左线更矮，left 移到 1。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 1, right: 8, answer: '8', note: '所有以原左线 1 为边的组合都已排除。' } },
        { title: '面积 49，舍弃右边', detail: '(8-1)×min(8,7)=49；左线 8 高于右线 7，right 移到 7。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 1, right: 7, answer: '49', note: '当前 ans 达到样例最优值。' } },
        { title: '面积 18，继续右移', detail: '(7-1)×min(8,3)=18；左线仍高于右线，right 移到 6。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 1, right: 6, answer: '49', note: '以原右线 7 为边且右边界更靠内的组合已排除。' } },
        { title: '面积 40，改移左边', detail: '(6-1)×min(8,8)=40；两侧高度相等，按 <= 分支 left 移到 2。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 2, right: 6, answer: '49', note: '当前左右两条线高度都为 8。' } },
        { title: '面积 24，继续左移', detail: '(6-2)×min(6,8)=24；左线较矮，left 移到 3。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 3, right: 6, answer: '49', note: '宽度继续缩小。' } },
        { title: '面积 6，继续左移', detail: '(6-3)×min(2,8)=6；左线较矮，left 移到 4。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 4, right: 6, answer: '49', note: '较矮边换成下标 3 的 2。' } },
        { title: '面积 10，继续左移', detail: '(6-4)×min(5,8)=10；左线较矮，left 移到 5。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 5, right: 6, answer: '49', note: '高度增加仍抵不过宽度减少。' } },
        { title: '面积 4，指针相遇', detail: '(6-5)×min(4,8)=4；左线较矮，left 移到 6。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 6, right: 6, answer: '49', note: 'left<right 不再成立。' } },
        { title: '返回最大面积 49', detail: '所有可能更优的边界对都已被安全排除。', state: { values: [1, 8, 6, 2, 5, 4, 8, 3, 7], left: 6, right: 6, answer: '49', note: '最优组合是下标 1 与 8。' } }
      ]
    }
  },
  '15': {
    id: 15,
    title: '三数之和',
    slug: '3sum',
    difficulty: '中等',
    category: '双指针',
    summary: '在整数数组中找出所有三个不同位置上的数，使它们之和为 0，并返回不重复的三元组。',
    input: '整数数组 nums，可包含负数、零和重复值。',
    output: '三元组列表；每个三元组内部按非递减顺序，结果中不出现重复三元组。',
    core: '先排序；固定 i 后，用左右双指针寻找另外两个数，并在外层和内层跳过重复值。',
    walkthrough: 'nums=[-2,0,0,2,2] 排序后不变。i=0 固定 -2，左右指针得到 0+2，记录 [-2,0,2]。随后跳过与刚使用值相同的 0 和 2，指针相遇。i=1 固定第一个 0，但右侧两个 2 使和过大，右指针最终与左指针相遇。i=2 的 0 与前一个相同，直接跳过；i=3 的 2 大于 0，循环提前结束。',
    pitfalls: ['不排序就无法用和的大小决定左右指针方向。', '只在外层跳过重复 i，仍可能因内层重复值输出相同三元组。', '找到一组后不移动两个指针，会无限循环。', 'i 固定正数时不必继续：排序后其余数更大，三数之和不可能为 0。'],
    observation: '固定 nums[i] 后，原问题变成在有序后缀中寻找两数之和为 -nums[i]；和偏小就左移，和偏大就右移。',
    mechanism: 'sum<0 时 j+=1，sum>0 时 k-=1；sum=0 时先记录，再同时向内移动，最后用两个 while 跳过重复的 j、k 值。',
    invariant: '每轮 j<k，nums[j+1..k-1] 都是按顺序排列的候选中间值；已跳过的重复边界不会再产生新三元组。',
    termination: '每轮 j 或 k 至少移动一格，直到 j>=k；外层 i 每次递增，遇到正数或遍历结束停止。',
    counterexample: 'nums=[0,0,0,0] 若只移动 j 或只移动 k，会反复记录 [0,0,0]；记录后同时内移并跳过重复值，只留下一个三元组。',
    naive: '枚举所有 i<j<k 再排序去重，需要 O(n³)。',
    time: 'O(n²)',
    timeNote: '排序需要 O(n log n)；固定 i 后双指针总共 O(n)，重复跳过也不会增加这一上界。',
    space: 'O(1)',
    spaceNote: '双指针与答案收集只占常数辅助空间，不计返回结果；Python 原地排序最坏可能使用 O(n) 辅助空间。',
    keyLines: [
      { start: 8, end: 9, text: '            if i > 0 and nums[i] == nums[i - 1]:\n                continue' },
      { start: 18, end: 21, text: '                    ans.append([nums[i], nums[j],nums[k]])\n                    j, k = j + 1, k - 1\n                    while j < k and nums[j] == nums[j - 1]: j += 1\n                    while j < k and nums[k] == nums[k + 1]: k -= 1' }
    ],
    challenge: {
      question: '如果要求三元组中必须包含正数和负数，只保留 0,0,0 是否还合法？',
      hint: '检查每个三元组三类数的数量，而不只检查和为 0。',
      answer: '不合法。可以在记录前额外排除三个数全为 0 的情况，也可以检查三元组中是否同时存在 x<0 与 x>0。'
    },
    similar: [
      { id: 16, title: '最接近的三数之和', slug: '3sum-closest', role: '同类巩固', reason: '保留排序和双指针框架，把相等判断改为维护与目标值最接近的三数之和。' },
      { id: 18, title: '四数之和', slug: '4sum', role: '进阶挑战', reason: '再增加一层固定元素与嵌套双指针，去重条件更复杂。' }
    ],
    viz: {
      family: 'twoPointer',
      data: { values: [-2, 0, 0, 2, 2] },
      frames: [
        { title: '排序并准备固定元素', detail: 'left=-1、right=-1 表示尚未建立内层双指针；values 已是 nums.sort() 后的数组。', state: { values: [-2, 0, 0, 2, 2], left: -1, right: -1, answer: '[]', note: '外层 i 将从 0 开始。' } },
        { title: '固定 -2，找到一组', detail: 'i=0、j=1、k=4，三数之和 -2+0+2=0，记录 [-2,0,2]。', state: { values: [-2, 0, 0, 2, 2], left: 0, right: 4, answer: '[[-2,0,2]]', note: 'left 表示固定的 i，right 表示当前 k。' } },
        { title: '向内移动并跳过重复', detail: 'j、k 先变为 2、3；j 处 0 与 nums[j-1] 相同而跳到 3，此后 j<k 已不成立，k 保持 3。', state: { values: [-2, 0, 0, 2, 2], left: 0, right: 3, answer: '[[-2,0,2]]', note: '此时 j=3、k=3，内层搜索停止。' } },
        { title: '固定第一个 0', detail: 'i=1，j=2、k=4；0+0+2=2>0，右指针应左移。', state: { values: [-2, 0, 0, 2, 2], left: 1, right: 4, answer: '[[-2,0,2]]', note: '当前 j=2。' } },
        { title: '和仍过大', detail: 'i=1、j=2、k=3，三数之和仍为 2>0，准备把 k 左移到 2。', state: { values: [-2, 0, 0, 2, 2], left: 1, right: 3, answer: '[[-2,0,2]]', note: '继续收缩右侧候选。' } },
        { title: '第二个 0 的搜索结束', detail: 'j=2、k=2，内层 while 停止。', state: { values: [-2, 0, 0, 2, 2], left: 1, right: 2, answer: '[[-2,0,2]]', note: '没有新的非重复三元组。' } },
        { title: '跳过重复的固定值', detail: 'i=2 的 0 与 nums[1] 相同，执行 continue；right 保留上轮值 2。', state: { values: [-2, 0, 0, 2, 2], left: 2, right: 2, answer: '[[-2,0,2]]', note: '跳过会重复的整个后缀搜索。' } },
        { title: '遇到正数提前结束', detail: 'i=3 的值为 2>0，break；后面的 2 也不可能组成和为 0 的非递减三元组。', state: { values: [-2, 0, 0, 2, 2], left: 3, right: 2, answer: '[[-2,0,2]]', note: '外层搜索结束。' } },
        { title: '返回唯一三元组', detail: 'left=4 仅表示外层已无可处理位置；答案收集完成。', state: { values: [-2, 0, 0, 2, 2], left: 4, right: 2, answer: '[[-2,0,2]]', note: '重复的 0 和 2 没有造成重复输出。' } }
      ]
    }
  },
  '42': {
    id: 42,
    title: '接雨水',
    slug: 'trapping-rain-water',
    difficulty: '困难',
    category: '双指针',
    summary: '给定表示柱高的数组，计算下雨后这些柱子之间能够接住的总水量。每个下标对应宽度为 1 的一格。',
    input: '非负整数数组 height，两端外侧不额外蓄水。',
    output: '所有下标上积水量的总和。',
    core: '左右向中间移动，每次处理较矮的一侧，并用该侧历史最大高度减去当前柱高计算积水。',
    walkthrough: 'height=[4,2,0,3,2,5]。左侧最大高度先变为 4，右侧最大高度为 5。依次处理左端：下标 1 存 4-2=2，下标 2 存 4-0=4，下标 3 存 4-3=1，下标 4 存 4-2=2。指针相遇，总量为 9。',
    pitfalls: ['直接用相邻两根柱子的高度差，会忽略远处更高的边界。', '用当前两侧高度代替历史最大值，遇到 [4,2,0] 会把已有高柱遗忘。', '把 leftMost 更新后继续累加旧 leftMost-current，可能产生负数或重复计算。', '指针相遇后仍处理同一格，会重复加水。'],
    observation: '较矮的一侧当前格，其水量由这一侧已经见过的最高柱确定；另一侧最高柱足以提供不更低的外部上界。',
    mechanism: '每轮先更新 leftMost 与 rightMost；若 height[left]<height[right] 就在左侧加水并左移，否则在右侧加水并右移。',
    invariant: '未处理区间为 [left,right]；leftMost、rightMost 分别是已扫描左右部分的最大高度，ans 已精确累计已处理格的雨水。',
    termination: '每轮至少向内移动一个指针，left<right 最终失败；相遇位置无需再单独计算。',
    counterexample: 'height=[4,2,0,3] 若只用当前左高 4 而不保存最大值，移动到 2 再移动到 0 后可能把上界误降为 0；leftMost=4 保证这两格分别存 2 和 4。',
    naive: '对每格分别向左、向右寻找最大高度，再取两者较小值减当前高度，需要 O(n²)。',
    time: 'O(n)',
    timeNote: '每个下标最多作为左侧或右侧被处理一次。',
    space: 'O(1)',
    spaceNote: '不需要左右最大值数组，只保存两个最大值与累计答案。',
    keyLines: [
      { start: 6, end: 13, text: '            left_most = max(left_most, height[left])\n            right_most = max(right_most, height[right])\n            if height[left] < height[right]:\n                ans += left_most - height[left]\n                left += 1\n            else:\n                ans += right_most - height[right]\n                right -= 1' }
    ],
    challenge: {
      question: '原代码在两侧当前高度相等时处理右侧。改成处理左侧也能得到正确答案吗？',
      hint: '比较两侧已经扫描部分的最大高度，思考哪一侧的上界已经被完全确定。',
      answer: '可以。相等时两侧当前格的有效上界都已由本侧 leftMost/rightMost 确定；选择任一侧累计都不会重复或遗漏。'
    },
    similar: [
      { id: 11, title: '盛最多水的容器', slug: 'container-with-most-water', role: '前置练习', reason: '先理解左右较矮边的取舍，再增加历史最大值和逐格累计。' },
      { id: 84, title: '柱状图中最大的矩形', slug: 'largest-rectangle-in-histogram', role: '同类巩固', reason: '同样关注柱高形成的边界，但目标从逐格积水变成最大矩形面积。' },
      { id: 407, title: '接雨水 II', slug: 'trapping-rain-water-ii', role: '进阶挑战', reason: '把一维左右边界扩展到二维四周边界，通常从最矮边界向内扩展。' }
    ],
    viz: {
      family: 'twoPointer',
      data: { values: [4, 2, 0, 3, 2, 5] },
      frames: [
        { title: '左右边界与水位就位', detail: 'left=0、right=5；leftLevel 与 rightLevel 都是尚未扫描时的 0，water=0。', state: { values: [4, 2, 0, 3, 2, 5], left: 0, right: 5, answer: '0', note: '额外字段 leftLevel、rightLevel 表示两侧历史最高柱。', leftLevel: 0, rightLevel: 0, water: 0 } },
        { title: '下标 0 不存水', detail: '更新 leftLevel=4、rightLevel=5；左柱 4<右柱 5，累加 4-4=0，left 移到 1。', state: { values: [4, 2, 0, 3, 2, 5], left: 1, right: 5, answer: '0', note: '当前左水位为 4，右水位为 5。', leftLevel: 4, rightLevel: 5, water: 0 } },
        { title: '下标 1 存入 2', detail: '左柱 2<右柱 5，累加 leftLevel-height[1]=4-2=2，left 移到 2。', state: { values: [4, 2, 0, 3, 2, 5], left: 2, right: 5, answer: '2', note: '远处下标 0 的 4 仍是左侧有效上界。', leftLevel: 4, rightLevel: 5, water: 2 } },
        { title: '下标 2 存入 4', detail: '左柱 0<右柱 5，累加 4-0=4，left 移到 3。', state: { values: [4, 2, 0, 3, 2, 5], left: 3, right: 5, answer: '6', note: '历史最高柱不能因当前柱变矮而降低。', leftLevel: 4, rightLevel: 5, water: 6 } },
        { title: '下标 3 存入 1', detail: '左柱 3<右柱 5，累加 4-3=1，left 移到 4。', state: { values: [4, 2, 0, 3, 2, 5], left: 4, right: 5, answer: '7', note: '两侧历史水位保持不变。', leftLevel: 4, rightLevel: 5, water: 7 } },
        { title: '下标 4 存入 2', detail: '左柱 2<右柱 5，累加 4-2=2，left 移到 5。', state: { values: [4, 2, 0, 3, 2, 5], left: 5, right: 5, answer: '9', note: '未处理区间已经收缩为空。', leftLevel: 4, rightLevel: 5, water: 9 } },
        { title: '返回总水量 9', detail: 'left=right，while 条件失败；六格积水中只有下标 0 为 0。', state: { values: [4, 2, 0, 3, 2, 5], left: 5, right: 5, answer: '9', note: '逐格水量为 [0,2,4,1,2,0]。', leftLevel: 4, rightLevel: 5, water: 9 } }
      ]
    }
  },
  '3': {
    id: 3,
    title: '无重复字符的最长子串',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: '中等',
    category: '滑动窗口',
    summary: '找出字符串中不含重复字符的最长连续子串，并返回它的长度。',
    input: '字符串 s，可能为空。',
    output: '最长无重复字符子串的长度。',
    core: '右边界尽量向右扩张；每个外层起点删除一个字符，维护当前窗口内无重复。',
    walkthrough: 's="abcabcbb"。i=0 时窗口扩到 "abc"，长度 3，然后删掉 a。i=1 接着扩入 a 得到 "bca"。i=2 再扩入 b 得到 "cab"。i=3 想扩入 b 时发现重复，记录长度 3 并删掉 a；窗口始终无重复，最终最长长度为 3。',
    pitfalls: ['窗口集合只表示字符是否存在，不保存重复次数；加入新字符前必须先判断它是否已在集合中。', '把 j 当作包含边界会算错长度；代码中的窗口是 [i,j+1)，长度 j-i+1。', '重复出现时同时移动左右指针，可能错过当前左边界仍可扩展的情况。', '只扩大窗口却从不删除 s[i]，重复字符会永久挡住右边界。'],
    observation: '右边界 j 在本次扫描中只增不减；当新字符重复时，当前左边界已无法继续扩大，删除它即可考察下一个起点。',
    mechanism: '外层 for i 先让 while 持续加入 s[j+1]，直到右端或遇到重复；随后更新 ans，并删除 s[i] 为下一轮腾出位置。',
    invariant: '每轮更新 ans 前，st 恰好是 s[i..j] 的字符集合，窗口内没有重复字符。',
    termination: 'j 最多从 -1 增到 n-1；外层 i 从 0 增到 n-1，最后一次删除后窗口为空。',
    counterexample: 's="abba"。i=0 时窗口扩到 "ab"；i=1 准备加入 s[2]=b，而窗口 [1,2) 已经含 b。若只移动右边界却不删除 s[i]，窗口会一直卡住；每轮删除左端字符才能继续扫描末尾的 a。',
    naive: '枚举所有子串并用集合检查是否重复，需要 O(n²) 或更差。',
    time: 'O(n)',
    timeNote: '右边界最多加入 n 次，左边界最多删除 n 次；集合操作按平均 O(1) 计算。',
    space: 'O(min(n, |字符集|))',
    spaceNote: 'st 保存当前无重复窗口；ASCII 或有限字符集下可视为常数空间。',
    keyLines: [
      { start: 8, end: 12, text: '            while j < n - 1 and s[j + 1] not in st:\n                st.add(s[j+1])\n                j += 1\n            ans = max(ans, j - i + 1)\n            st.remove(s[i])' }
    ],
    challenge: {
      question: '如果要求返回最长子串本身，并优先保留最早出现的答案，需要记录什么？',
      hint: '长度相同时不要覆盖已经保存的起点。',
      answer: '保存 bestLen 与 bestLeft；只有当前长度严格更大时才更新，最后返回 s[bestLeft:bestLeft+bestLen]。'
    },
    similar: [
      { id: 159, title: '至多包含两个不同字符的最长子串', slug: 'longest-substring-with-at-most-two-distinct-characters', role: '前置练习', reason: '从“不能重复”过渡到“不同字符数量有限”，窗口约束更直观。' },
      { id: 340, title: '至多包含 K 个不同字符的最长子串', slug: 'longest-substring-with-at-most-k-distinct-characters', role: '同类巩固', reason: '继续用左右边界与字符计数维护合法窗口，但收缩条件变成种类数超限。' },
      { id: 209, title: '长度最小的子数组', slug: 'minimum-size-subarray-sum', role: '同类巩固', reason: '同样先扩右边界再缩左边界，可用于对比右开与右闭区间的写法。' }
    ],
    viz: {
      family: 'slidingWindow',
      data: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'] },
      frames: [
        { title: '空窗口', detail: 'right 是右开边界，窗口为 values[left..right)；初始 left=right=0，对应代码 j=-1。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 0, right: 0, counts: [], answer: '0', note: 'counts 是集合 st 中当前字符的展示。' } },
        { title: 'i=0 扩到 abc', detail: '连续加入 a、b、c 后 right=3；下一个 a 已在集合中，窗口长度 3，随后删除 s[0]=a。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 1, right: 3, counts: [['b', 1], ['c', 1]], answer: '3', note: '帧状态显示删除左端后的 [b,c)。' } },
        { title: 'i=1 扩入 a', detail: 'right=3 的 a 不重复，加入后 right=4；下一个 b 在集合中，更新 ans=3，再删除 s[1]=b。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 2, right: 4, counts: [['a', 1], ['c', 1]], answer: '3', note: '删除前窗口为 [b,c,a)。' } },
        { title: 'i=2 扩入 b', detail: 'right=4 的 b 不重复，加入后 right=5；下一个 c 重复，删除 s[2]=c。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 3, right: 5, counts: [['a', 1], ['b', 1]], answer: '3', note: '删除前窗口为 [c,a,b)。' } },
        { title: 'i=3 扩入 c', detail: 'right=5 的 c 不重复，加入后 right=6；right=6 的 b 重复，删除 s[3]=a。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 4, right: 6, counts: [['b', 1], ['c', 1]], answer: '3', note: '删除前窗口为 [a,b,c)，长度 3。' } },
        { title: 'i=4 遇到 b 重复', detail: 'right=6 的 b 已在集合中，while 不执行；窗口 [b,c) 长度 2，删除 s[4]=b。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 5, right: 6, counts: [['c', 1]], answer: '3', note: '右边界保持 6，窗口继续收缩。' } },
        { title: 'i=5 扩入 b 后遇重复', detail: 'right=6 的 b 与 c 不冲突，加入后 right=7；right=7 的 b 重复。删除 s[5]=b。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 6, right: 7, counts: [['b', 1]], answer: '3', note: '删除前窗口为 [c,b)。' } },
        { title: 'i=6 仍遇到 b 重复', detail: 'right=7 的 b 已在集合中，不扩张；窗口只剩一个 b，删除 s[6]=b。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 7, right: 7, counts: [], answer: '3', note: '窗口暂时为空。' } },
        { title: 'i=7 加入最后一个 b', detail: 'right=7 的 b 加入后 right=8=n；长度 1，删除 s[7]=b。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 8, right: 8, counts: [], answer: '3', note: '窗口重新为空，ans 保持 3。' } },
        { title: '返回 3', detail: 'left=right=8=n，全部起点处理完毕。', state: { values: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'], left: 8, right: 8, counts: [], answer: '3', note: '样例中的 "abc" 与 "bca" 长度都为 3。' } }
      ]
    }
  },
  '438': {
    id: 438,
    title: '找到字符串中所有字母异位词',
    slug: 'find-all-anagrams-in-a-string',
    difficulty: '中等',
    category: '滑动窗口',
    summary: '在字符串 s 中找出所有起始下标，使从该下标开始、长度与 p 相同的子串是 p 的字母异位词。',
    input: '小写英文字符串 s 与模式串 p。',
    output: '按起始下标升序排列的整数数组。',
    core: '先建立长度为 m 的计数窗口；每次右移一格，加入新字符并减去移出字符，再比较两个 26 长度数组。',
    walkthrough: 's="cbaebabacd"、p="abc"。初始窗口 s[0..2]="cba"，计数与 p 相同，记录 0。窗口每次向右滑动：下标 1 到 5 都不是异位词。滑到下标 6 时得到 "abc"，记录 6；最后窗口 "bcd" 仍不匹配。',
    pitfalls: ['窗口长度必须固定为 len(p)，不能找到更长或更短的子串。', '原提交使用保留零项的 26 长度数组；若改写成稀疏字典，必须按目标字符检查计数并把缺失键视为 0，不能只比较键集合。', '返回的是起始下标，不是子串内容或结束下标。', 'n<m 时切片会得到一个短窗口，必须先返回空数组。'],
    observation: '相邻两个等长窗口只相差一个移出字符和一个加入字符，因此无需每次重新统计整段。',
    mechanism: 'cnt_s 先统计 s[:m]，cnt_p 统计 p；i 从 1 到 n-m，分别更新 s[i+m-1] 与 s[i-1] 的计数，数组完全相等时把 i 加入 ans。',
    invariant: '每轮比较前，cnt_s[c] 恰好等于当前闭区间 [i,i+m-1] 中字符 c 的出现次数。',
    termination: 'i 每次递增 1，共有 n-m+1 个起点；i=n-m 处理完后循环结束。',
    counterexample: 's="abab"、p="ab"。若只加入新字符而不减旧字符，滑到下标 1 后旧 a 仍在，计数会变成 a1、b2，错误漏掉答案 1。',
    naive: '对每个起点截取长度 m 的子串并重新计数或排序，需要 O((n-m)·m)。',
    time: 'O(n+m)',
    timeNote: '初始化扫描 m 次，之后每个窗口只更新两个计数并比较固定 26 项；字符集固定时比较为 O(1)。',
    space: 'O(1)',
    spaceNote: '两个计数数组固定为 26 项；不计输入输出，答案数组最多需要 O(n) 空间。',
    keyLines: [
      { start: 9, end: 16, text: '        for ch in s[:m]:\n            cnt_s[ord(ch) - 97] += 1\n        ans = [0] if cnt_s == cnt_p else []\n        for i in range(1, n-m+1):\n            cnt_s[ord(s[i + m - 1]) - 97] +=1\n            cnt_s[ord(s[i-1]) - 97] -= 1\n            if cnt_s == cnt_p:\n                ans.append(i)' }
    ],
    challenge: {
      question: '如果 p 也允许任意 Unicode 字符，同时仍要保持每次滑动 O(1)，你会怎么设计计数结构？',
      hint: '固定 26 项数组不再够用，但仍可利用“一进一出”。',
      answer: '用字典维护窗口频次，并用 difference 记录与目标频次不相等的键数量；加入和删除时更新对应差值，difference 为 0 即匹配。'
    },
    similar: [
      { id: 567, title: '字符串的排列', slug: 'permutation-in-string', role: '前置练习', reason: '判断是否存在一个异位词窗口，把本题的收集全部下标改为布尔判断。' },
      { id: 76, title: '最小覆盖子串', slug: 'minimum-window-substring', role: '同类巩固', reason: '同样比较窗口与目标的字符缺口，但窗口长度可变，需要维护有效覆盖状态。' },
      { id: 30, title: '串联所有单词的子串', slug: 'substring-with-concatenation-of-all-words', role: '进阶挑战', reason: '把单字符计数扩展到等长单词计数，并处理多个可能的起点偏移。' }
    ],
    viz: {
      family: 'slidingWindow',
      data: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], pattern: ['a', 'b', 'c'] },
      frames: [
        { title: '建立首个定长窗口', detail: 'left=0、right=2 是包含两端的闭区间 [0,2]，对应子串 "cba"；目标计数 a1、b1、c1。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 0, right: 2, counts: [['a', 1], ['b', 1], ['c', 1]], answer: '[0]', note: '首个窗口直接匹配，答案记录起点 0。' } },
        { title: '滑到起点 1', detail: '加入 right=3 的 e，减去 left-1=0 的 c，窗口 [1,3]="bae"。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 1, right: 3, counts: [['a', 1], ['b', 1], ['e', 1]], answer: '[0]', note: 'e 替代 c，计数不等。' } },
        { title: '滑到起点 2', detail: '加入下标 4 的 b，减去下标 1 的 b，两个操作抵消，窗口 [2,4]="aeb"。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 2, right: 4, counts: [['a', 1], ['b', 1], ['e', 1]], answer: '[0]', note: '计数未变，仍不匹配。' } },
        { title: '滑到起点 3', detail: '加入下标 5 的 a，减去下标 2 的 a，计数再次抵消，窗口 [3,5]="eba"。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 3, right: 5, counts: [['a', 1], ['b', 1], ['e', 1]], answer: '[0]', note: '窗口内容顺序改变不影响异位词判断。' } },
        { title: '滑到起点 4', detail: '加入下标 6 的 b，减去下标 3 的 e，窗口 [4,6]="bab"。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 4, right: 6, counts: [['a', 1], ['b', 2]], answer: '[0]', note: 'b 出现两次，计数不匹配。' } },
        { title: '滑到起点 5', detail: '加入下标 7 的 a，减去下标 4 的 b，窗口 [5,7]="aba"。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 5, right: 7, counts: [['a', 2], ['b', 1]], answer: '[0]', note: '变成 a2、b1、c0，仍不匹配。' } },
        { title: '滑到起点 6，再次匹配', detail: '加入下标 8 的 c，减去下标 5 的 a，窗口 [6,8]="abc"，计数与 p 相同。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 6, right: 8, counts: [['a', 1], ['b', 1], ['c', 1]], answer: '[0,6]', note: '把新起点 6 追加到 ans。' } },
        { title: '滑到起点 7', detail: '加入下标 9 的 d，减去下标 6 的 b，窗口 [7,9]="acd"。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 7, right: 9, counts: [['a', 1], ['c', 1], ['d', 1]], answer: '[0,6]', note: 'b 被 d 替代，不匹配。' } },
        { title: '最后一个窗口检查完毕', detail: 'right=9 是最后包含下标；left=7 是最后一个起点。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 7, right: 9, counts: [['a', 1], ['c', 1], ['d', 1]], answer: '[0,6]', note: '共检查 8 个长度为 3 的窗口。' } },
        { title: '返回 [0, 6]', detail: 'left=8 仅表示没有下一个起点，right 保留最后检查的右边界 9。', state: { values: ['c', 'b', 'a', 'e', 'b', 'a', 'b', 'a', 'c', 'd'], left: 8, right: 9, counts: [['a', 1], ['c', 1], ['d', 1]], answer: '[0,6]', note: '所有答案按左到右顺序收集。' } }
      ]
    }
  }
};

const SOURCES: { url: string; license: string; note: string }[] = [
  { url: 'https://leetcode.cn/problems/two-sum/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 1，中文标题“两数之和”，slug two-sum。' },
  { url: 'https://leetcode.cn/problems/group-anagrams/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 49，中文标题“字母异位词分组”，slug group-anagrams。' },
  { url: 'https://leetcode.cn/problems/longest-consecutive-sequence/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 128，中文标题“最长连续序列”，slug longest-consecutive-sequence。' },
  { url: 'https://leetcode.cn/problems/move-zeroes/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 283，中文标题“移动零”，slug move-zeroes。' },
  { url: 'https://leetcode.cn/problems/container-with-most-water/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 11，中文标题“盛最多水的容器”，slug container-with-most-water。' },
  { url: 'https://leetcode.cn/problems/3sum/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 15，中文标题“三数之和”，slug 3sum。' },
  { url: 'https://leetcode.cn/problems/trapping-rain-water/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 42，中文标题“接雨水”，slug trapping-rain-water。' },
  { url: 'https://leetcode.cn/problems/longest-substring-without-repeating-characters/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 3，中文标题“无重复字符的最长子串”，slug longest-substring-without-repeating-characters。' },
  { url: 'https://leetcode.cn/problems/find-all-anagrams-in-a-string/', license: '题目名称与链接仅作归属；概述为原创，未复制题面或第三方题解。', note: '2026-11-25 GraphQL 核验：ID 438，中文标题“找到字符串中所有字母异位词”，slug find-all-anagrams-in-a-string。' },
  { url: 'https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 167、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/subarray-sum-equals-k/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 560、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/valid-anagram/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 242、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/group-shifted-strings/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 249、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/contains-duplicate-iii/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 220、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/longest-continuous-increasing-subsequence/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 674、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/remove-duplicates-from-sorted-array/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 26、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/remove-element/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 27、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/largest-rectangle-in-histogram/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 84、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/trapping-rain-water-ii/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 407、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/3sum-closest/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 16、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/4sum/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 18、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/longest-substring-with-at-most-two-distinct-characters/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 159、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/longest-substring-with-at-most-k-distinct-characters/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 340、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/minimum-size-subarray-sum/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 209、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/substring-with-concatenation-of-all-words/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 30、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/minimum-window-substring/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 76、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/problems/permutation-in-string/', license: '力扣目录信息，仅用于关联题归属与核验。', note: '2026-11-25 GraphQL question(titleSlug) 核验 ID 567、中文标题与 slug 一致。' },
  { url: 'https://leetcode.cn/graphql/', license: '公开题目目录元数据，仅用于核验编号、标题与链接。', note: '2026-11-25 使用 question(titleSlug) 批量查询 questionId、titleSlug、translatedTitle；没有抓取或复用题解代码。' }
];

export { SOURCES };
