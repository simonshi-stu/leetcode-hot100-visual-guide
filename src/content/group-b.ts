import Guide from '../types';

export const guides: Record<string, Guide> = {
  '560': {
    summary: '用前缀和把连续子数组的和转成两个前缀位置之差，再用哈希表统计此前出现过的目标前缀和。',
    input: '整数数组 nums 和目标整数 k。元素可以为负数，子数组必须连续且非空。',
    output: '和恰好等于 k 的子数组个数。',
    core: '令 P[j] 表示前 j 个元素之和，则 nums[i:j] 的和为 P[j] - P[i]。处理到 P[j] 时，只需查询 cnt[P[j] - k] 中此前有多少个 P[i]。',
    walkthrough: '以 nums = [1,-1,1,1,-1]、k = 2 为例。前缀位置依次为 P0=0、P1=1、P2=0、P3=1、P4=2、P5=1。P0 与 P2 都是 0，所以 P4 出现时 cnt[0]=2，分别找到 nums[0:4]=[1,-1,1,1] 和 nums[2:4]=[1,1]，答案为 2。',
    pitfalls: ['必须先查询再插入当前前缀和，否则 k=0 时会把空前缀误算成答案。', '重复前缀和要保存次数，不能只保存是否存在。', '负数使和不具备单调性，不能用普通滑动窗口。'],
    observation: '同一个前缀和在不同位置出现，就是一种“碰撞”；每个较早位置都能和当前位置配成一个候选子数组。',
    mechanism: '前缀和哈希计数。cnt 的键是前缀和，值是出现次数；pre 记录当前前缀和。',
    invariant: '每次循环开始时，cnt 恰好统计 P0 到 P[i] 的出现次数，pre=P[i]。循环内先形成 P[i+1] 并查询，再把它加入 cnt。',
    termination: '每个元素只处理一次；插入后不会删除前缀和，因此遍历完 n 个元素即得到全部以每个右端点结尾的答案。',
    counterexample: 'nums=[0,0]、k=0 时答案是 3。若先插入再查询，第一次就会把 P1-P1 这个空区间算入，结果偏大。',
    naive: '枚举所有左右端点并累加区间元素，时间 O(n²)，额外空间 O(1)；重复累加同一个区间会浪费大量计算。',
    time: 'O(n)',
    timeNote: 'n 个元素各做一次哈希查询和更新，按 Python 整数哈希的常规情况为期望 O(n)；哈希退化时理论上会变慢。',
    space: 'O(n)',
    spaceNote: 'cnt 最多保存 n+1 个不同前缀和；答案和 pre 只占 O(1)，没有切片或辅助数组。',
    keyLines: [
      { start: 3, end: 8, text: `        cnt = {0:1}
        pre = ans = 0
        for x in nums:
            pre += x
            ans += cnt.get(pre - k, 0)
            cnt[pre] = cnt.get(pre, 0) + 1` },
    ],
    challenge: {
      question: '为什么当前前缀和必须在查询之后才插入？',
      hint: '检查 k=0 时，P[j]-P[j] 对应多少个元素。',
      answer: '子数组必须非空，左前缀位置必须严格早于右前缀位置。先查询才能保证 cnt 中只有此前位置；先插入会允许 i=j 的空区间。',
    },
    similar: [
      { id: 523, title: '连续的子数组和', slug: 'continuous-subarray-sum', role: '同类巩固', reason: '同样把区间和转成前缀和之差，但只判断长度至少为 2 且和为 k 的倍数，需要额外处理取模与长度。' },
      { id: 1016, title: '和可被 K 整除的子数组', slug: 'subarray-sums-divisible-by-k', role: '同类巩固', reason: '使用前缀和取模后的同余计数；负数取模和重复余数是关键，计数口径比本题多一层。' },
      { id: 437, title: '路径总和 III', slug: 'path-sum-iii', role: '进阶挑战', reason: '把一维前缀和计数搬到树上，用递归路径上的同款哈希表统计路径和。' },
    ],
    viz: {
      family: 'prefix',
      data: { values: [1, -1, 1, 1, -1], k: 2 },
      frames: [
        {
          title: '放入空前缀',
          detail: 'P0=0 先进入 cnt，当前尚未读取元素。',
          state: { values: [1, -1, 1, 1, -1], index: -1, prefix: { P0: 0 }, answer: '0', note: 'pre=0；cnt={"0":1}；目标 k=2。' },
        },
        {
          title: '得到 P1=1',
          detail: '查询 P1-k=-1，没有匹配；随后保存 P1。',
          state: { values: [1, -1, 1, 1, -1], index: 0, prefix: { P0: 0, P1: 1 }, answer: '0', note: 'cnt={"0":1,"1":1}；本次命中 0 次。' },
        },
        {
          title: '0 发生碰撞',
          detail: 'P2=0 与 P0 相同，但 P2-k=-2 不存在；cnt[0] 增至 2。',
          state: { values: [1, -1, 1, 1, -1], index: 1, prefix: { P0: 0, P1: 1, P2: 0 }, answer: '0', note: 'cnt={"0":2,"1":1}；先记住 0 的两次出现。' },
        },
        {
          title: '1 也发生碰撞',
          detail: 'P3=1 再次出现，仍没有前缀和 -1；cnt[1] 增至 2。',
          state: { values: [1, -1, 1, 1, -1], index: 2, prefix: { P0: 0, P1: 1, P2: 0, P3: 1 }, answer: '0', note: 'cnt={"0":2,"1":2}；重复值保存次数。' },
        },
        {
          title: '一次命中两个左端点',
          detail: 'P4=2，查询 P4-k=0，命中 P0 和 P2，答案增加 2。',
          state: { values: [1, -1, 1, 1, -1], index: 3, prefix: { P0: 0, P1: 1, P2: 0, P3: 1, P4: 2 }, answer: '2', note: '命中 cnt[0]=2；对应 nums[0:4] 与 nums[2:4]。' },
        },
        {
          title: '最后一个元素不产生新答案',
          detail: 'P5=1，查询 -1 仍未命中；1 的出现次数增至 3。',
          state: { values: [1, -1, 1, 1, -1], index: 4, prefix: { P0: 0, P1: 1, P2: 0, P3: 1, P4: 2, P5: 1 }, answer: '2', note: 'cnt={"0":2,"1":3,"2":1}；统计结束。' },
        },
        {
          title: '返回计数',
          detail: '所有右端点都已查询，最终共有 2 个和为 k 的子数组。',
          state: { values: [1, -1, 1, 1, -1], index: 4, prefix: { P0: 0, P1: 1, P2: 0, P3: 1, P4: 2, P5: 1 }, answer: '2', note: '答案 [1,-1,1,1] 与 [1,1]。' },
        },
      ],
    },
  },

  '239': {
    summary: '维护一个保存下标的双端队列，让队列中的数值单调不增，队首始终是当前窗口最大值。',
    input: '整数数组 nums 和窗口长度 k，窗口从数组左端每次向右滑动一格。',
    output: '每个长度为 k 的窗口的最大值，共 n-k+1 个。',
    core: '新元素 x 入队前，从队尾删除所有值小于 x 的下标；这些下标既更旧又更小，不可能再成为答案。过期下标只从队首移除。',
    walkthrough: '在 [1,3,-1,-3,5,3,6,7]、k=3 中，读到 5 时队列 [1,2,3] 对应 [3,-1,-3]，全部小于 5，于是只剩 [4]。窗口 [5,3,6] 出现时，5 和 3 又分别被 6 从队尾淘汰。',
    pitfalls: ['队列保存的是下标，不是数值；过期判断用 dq[0] <= i-k。', '代码用严格小于弹尾，所以相等值可能同时保留。', '本提交先弹尾、再 append 当前下标、最后删除过期队首；必须同时维护单调性与删除过期项，但过期删除放在 append 前也可得到同样的最终队列。'],
    observation: '一个较小且更早的元素会被同一窗口中后来出现的较大元素永久覆盖，因此没有必要继续保存它。',
    mechanism: '单调双端队列。队列下标递增，对应 nums 值不增；左端用于取最大值和删过期项，右端用于维护单调性。',
    invariant: '每次处理完下标 i 后，队列中的下标都位于当前窗口 [max(0,i-k+1),i] 内，按递增顺序保存候选最大值，且对应值单调不增。',
    termination: '每个下标最多入队一次、从队尾或队首弹出一次；i 递增到 n-1 后所有完整窗口都已输出。',
    counterexample: 'nums=[4,1,2]、k=2。到 i=2 时必须先删掉过期下标 0，否则会返回 4；正确窗口 [1,2] 的最大值是 2。',
    naive: '对每个窗口调用 max 并重新扫描 k 个元素，时间 O(nk)。若额外构造 nums[left:right+1] 切片，还会增加 O(k) 的临时复制。',
    time: 'O(n)',
    timeNote: 'n 次入队对应至多 n 次弹出，队列均摊 O(1)；输出 n-k+1 个数还需 O(n)。',
    space: 'O(n)',
    spaceNote: '队列最多保存 k 个下标，答案列表保存 n-k+1 个数；合计 O(k)+O(n-k+1)=O(n)。',
    keyLines: [
      { start: 3, end: 11, text: `        dq, ans = deque(), []
        for i, x in enumerate(nums):
            while dq and nums[dq[-1]] < x:
                dq.pop()
            dq.append(i)
            if dq[0] <= i - k:
                dq.popleft()
            if i >= k - 1:
                ans.append(nums[dq[0]])` },
    ],
    challenge: {
      question: '为什么从队尾删除的旧元素以后不可能成为任何窗口最大值？',
      hint: '比较它们的下标新旧和数值大小。',
      answer: '被 x 弹出的元素下标更早、值还小于 x。只要旧元素仍在窗口内，x 也一定在窗口内并且更大；旧元素先过期，所以它永远不会再成为答案。',
    },
    similar: [
      { id: 739, title: '每日温度', slug: 'daily-temperatures', role: '前置练习', reason: '同样用单调栈保留下标并弹出不可能贡献答案的旧项，区别是本题从队首取窗口最大值。' },
      { id: 155, title: '最小栈', slug: 'min-stack', role: '同类巩固', reason: '用辅助栈让极值查询保持 O(1)；可对照理解为什么本题允许丢弃被覆盖的候选。' },
      { id: 892, title: '和至少为 K 的最短子数组', slug: 'shortest-subarray-with-sum-at-least-k', role: '进阶挑战', reason: '使用前缀和与单调双端队列求最短窗口，但队列比较的是前缀和，弹出条件也更复杂。' },
    ],
    viz: {
      family: 'windowHeap',
      data: { values: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
      frames: [
        {
          title: '空队列',
          detail: '尚未读入元素，窗口和答案都为空。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: -1, left: 0, right: -1, queue: [], answer: '', note: 'k=3；queue 中保存数组下标。' },
        },
        {
          title: '读入下标 0',
          detail: '1 入队，当前只有一个元素，还不输出。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 0, left: 0, right: 0, queue: [0], answer: '', note: 'nums[0]=1。' },
        },
        {
          title: '3 淘汰 1',
          detail: '队尾下标 0 的值 1 小于 3，弹出后加入下标 1。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 1, left: 0, right: 1, queue: [1], answer: '', note: 'nums[1]=3；较旧且较小的 0 已无用。' },
        },
        {
          title: '首个完整窗口',
          detail: '-1 入队，队首下标 1 给出窗口 [0,2] 的最大值 3。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 2, left: 0, right: 2, queue: [1, 2], answer: '3', note: '队列值依次为 3、-1。' },
        },
        {
          title: '窗口向右滑动',
          detail: '-3 入队，队首 1 尚未过期，窗口 [1,3] 仍返回 3。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 3, left: 1, right: 3, queue: [1, 2, 3], answer: '3,3', note: '过期线 i-k=0，队首 1>0。' },
        },
        {
          title: '5 清空更小候选',
          detail: '从队尾依次弹出 3、2、1，最后只保留下标 4。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 4, left: 2, right: 4, queue: [4], answer: '3,3,5', note: '窗口 [2,4]=[-1,-3,5]，最大值为 5。' },
        },
        {
          title: '3 排在 5 后面',
          detail: '3 小于队尾的 5，保留为下标 5；答案仍为 5。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 5, left: 3, right: 5, queue: [4, 5], answer: '3,3,5,5', note: '窗口 [3,5]=[-3,5,3]。' },
        },
        {
          title: '6 淘汰 5 和 3',
          detail: '从队尾弹出 5、4，队首变成下标 6。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 6, left: 4, right: 6, queue: [6], answer: '3,3,5,5,6', note: '窗口 [4,6]=[5,3,6]。' },
        },
        {
          title: '最后一个窗口',
          detail: '7 淘汰下标 6，输出最后一个最大值 7。',
          state: { values: [1, 3, -1, -3, 5, 3, 6, 7], index: 7, left: 5, right: 7, queue: [7], answer: '3,3,5,5,6,7', note: '窗口 [5,7]=[3,6,7]。' },
        },
      ],
    },
  },

  '76': {
    summary: '先扩展右边界直到窗口覆盖 t，再逐格移动左边界压缩窗口；valid 记录已经满足需求的不同字符数。',
    input: '字符串 s 和目标字符串 t。窗口必须包含 t 的每个字符及其所需次数。',
    output: 's 中长度最短的覆盖子串；不存在时返回空字符串。',
    core: 'window[c]==need[c] 时，该字符第一次达标；超过需求不会重复增加 valid。右边界每次只前进到刚好覆盖 t 的位置，随后左边界每次删去一个字符。',
    walkthrough: 's="ADOBECODEBANC"、t="ABC" 时，首个覆盖窗口是 ADOBEC，长度 6。代码继续推进：i=6 时删去 A 后右边界会扩展到下标 12，才重新覆盖 ABC；之后左边界逐步移动到 9，得到 BANC，长度 4。',
    pitfalls: ['valid 的目标是 len(need)，不是 len(t)；t="AAB" 时一个 A 不够。', '删除字符前先判断它是否从刚好满足变成不足。', '不要只移动右边界或只保存第一次覆盖窗口。'],
    observation: '对固定左端点 i，代码找到最小的可行右端点 j；任何更短的右端点都不覆盖 t。把 i 增加 1 后，j 不需要回退。',
    mechanism: '需求哈希表 need、窗口计数 window、达标字符数 valid，以及只增的右边界 j 和逐格外层左边界 i。',
    invariant: '进入每个 i 的循环时，j 是此前为更小左端点找到的最小覆盖右边界。窗口计数与 [i,j] 一致，valid 等于当前满足 window[c]>=need[c] 的字符种数。',
    termination: 'j 最多到达 len(s)-1；若仍未覆盖就 break。否则外层 i 每次增加 1，删去一个左端字符，直到字符串末尾或无法覆盖。',
    counterexample: 's="AA"、t="AA" 时窗口必须同时含两个 A。若把 valid 与 len(t) 比较，放入第一个 A 后 valid=1 而 len(t)=2，会永远找不到覆盖窗口。',
    naive: '枚举左右端点，对每个候选重新用 Counter 检查覆盖关系，最坏需要 O(n³) 时间；即使优化计数，检查全部 O(n²) 个子串仍太慢。',
    time: 'O(|s|+|t|)',
    timeNote: '建立 need 为 O(|t|)；i、j 各最多移动 |s| 次，计数操作按哈希表均摊 O(1)，最后切片复制答案耗时 O(best)。',
    space: 'O(|s|+|t|)',
    spaceNote: 'need 保存 t 的不同字符，window 可能保存 s 中出现过的字符（包括计数为 0 的键）；最终 s[start:start+best] 还会复制最长 best 个字符。',
    keyLines: [
      { start: 3, end: 20, text: `        need = Counter(t)
        window = Counter()
        valid, j = 0, -1
        start, best = 0, len(s) + 1
        for i in range(len(s)):
            while valid < len(need) and j < len(s) - 1:
                j += 1
                window[s[j]] += 1
                if window[s[j]] == need[s[j]]:
                    valid += 1
            if valid < len(need):
                break
            if j - i + 1 < best:
                start, best = i, j - i + 1
            if window[s[i]] == need[s[i]]:
                valid -= 1
            window[s[i]] -= 1
        return "" if best > len(s) else s[start:start + best]` },
    ],
    challenge: {
      question: '为什么某个字符数量超过需求后，valid 不会继续增加？',
      hint: '观察代码用的是 window[s[j]] == need[s[j]]。',
      answer: 'valid 表示已经达标的字符种数，不表示多余数量。第一次等于需求时加一；继续增加到大于需求时不再加一，因此一个字符不会让 valid 重复计数。',
    },
    similar: [
      { id: 3, title: '无重复字符的最长子串', slug: 'longest-substring-without-repeating-characters', role: '前置练习', reason: '练习左右边界与窗口计数同步更新；区别是它用“无重复”条件移动左边界。' },
      { id: 438, title: '找到字符串中所有字母异位词', slug: 'find-all-anagrams-in-a-string', role: '同类巩固', reason: '固定长度窗口维护字符计数，可对照本题的 need/window/valid 三件套。' },
      { id: 727, title: '最小窗口子序列', slug: 'minimum-window-subsequence', role: '进阶挑战', reason: '仍求最小覆盖窗口，但要求 t 的字符按顺序出现，通常需要动态规划或反向扫描。' },
    ],
    viz: {
      family: 'windowCounts',
      data: { values: ['A', 'D', 'O', 'B', 'E', 'C', 'O', 'D', 'E', 'B', 'A', 'N', 'C'], pattern: ['A', 'B', 'C'] },
      frames: [
        {
          title: '初始化窗口',
          detail: 'need={A:1,B:1,C:1}，right=-1，best=14 表示尚未找到答案。',
          state: { values: [...'ADOBECODEBANC'], left: 0, right: -1, counts: [], answer: '', note: 'valid=0；left 对应代码 i，right 对应 j。' },
        },
        {
          title: '首次覆盖成功',
          detail: '右边界扩展到 5，窗口 ADOBEC 第一次包含 A、B、C。',
          state: { values: [...'ADOBECODEBANC'], left: 0, right: 5, counts: [['A', 1], ['D', 1], ['O', 1], ['B', 1], ['E', 1], ['C', 1]], answer: 'ADOBEC', note: 'valid=3；best=6；start=0。' },
        },
        {
          title: '删除左端 A',
          detail: 'A 从 1 降为 0，valid 变为 2，下一次需要重新扩展右边界。',
          state: { values: [...'ADOBECODEBANC'], left: 1, right: 5, counts: [['A', 0], ['D', 1], ['O', 1], ['B', 1], ['E', 1], ['C', 1]], answer: 'ADOBEC', note: 'left 已前进到 1；valid=2。' },
        },
        {
          title: '右边界推进到 10',
          detail: '为了补回 A，j 从 5 一路走到 10；当前窗口 DOBECODEBA 虽合法但更长。',
          state: { values: [...'ADOBECODEBANC'], left: 1, right: 10, counts: [['A', 1], ['D', 2], ['O', 2], ['B', 2], ['E', 2], ['C', 1]], answer: 'ADOBEC', note: 'valid=3；长度 10，不更新 best。' },
        },
        {
          title: '删除 D 后仍合法',
          detail: 'D 不在 need 中，删去它不会减少 valid。',
          state: { values: [...'ADOBECODEBANC'], left: 2, right: 10, counts: [['A', 1], ['D', 1], ['O', 2], ['B', 2], ['E', 2], ['C', 1]], answer: 'ADOBEC', note: 'valid=3；下一次无需扩展 right。' },
        },
        {
          title: '删除 C 后再次失效',
          detail: 'i=5 时窗口 CODEBA 长度 6 与 best 相等；删去 C 后 valid=2。',
          state: { values: [...'ADOBECODEBANC'], left: 6, right: 10, counts: [['A', 1], ['D', 1], ['O', 1], ['B', 1], ['E', 1], ['C', 0]], answer: 'ADOBEC', note: '代码用严格小于更新，等长答案保留先出现者。' },
        },
        {
          title: '右边界到达末尾',
          detail: 'i=6 时先扩展到 12 补回 C，再删去 O；窗口 DEBANC 合法。',
          state: { values: [...'ADOBECODEBANC'], left: 7, right: 12, counts: [['A', 1], ['D', 1], ['O', 0], ['B', 1], ['E', 1], ['C', 1], ['N', 1]], answer: 'ADOBEC', note: 'valid=3；right 已不能再前进。' },
        },
        {
          title: '最佳长度缩到 5',
          detail: 'i=8 时窗口 EBANC 覆盖目标，best 更新为 5；删去 E 后仍合法。',
          state: { values: [...'ADOBECODEBANC'], left: 9, right: 12, counts: [['A', 1], ['D', 0], ['O', 0], ['B', 1], ['E', 0], ['C', 1], ['N', 1]], answer: 'EBANC', note: 'valid=3；start=8。' },
        },
        {
          title: '找到 BANC',
          detail: 'i=9 时窗口 BANC 长度 4，更新 best；随后删去 B，valid 降为 2。',
          state: { values: [...'ADOBECODEBANC'], left: 10, right: 12, counts: [['A', 1], ['D', 0], ['O', 0], ['B', 0], ['E', 0], ['C', 1], ['N', 1]], answer: 'BANC', note: 'start=9；best=4；当前窗口已不合法。' },
        },
        {
          title: '无法继续扩展',
          detail: 'i=10 时 j 已在末尾且 valid=2，while 不执行，外层 break。',
          state: { values: [...'ADOBECODEBANC'], left: 10, right: 12, counts: [['A', 1], ['D', 0], ['O', 0], ['B', 0], ['E', 0], ['C', 1], ['N', 1]], answer: 'BANC', note: '答案由保存的 start=9、best=4 决定。' },
        },
        {
          title: '返回保存的切片',
          detail: '返回帧重建最佳窗口 [9,12]；它不是删除 B 后的当前失效窗口。',
          state: { values: [...'ADOBECODEBANC'], left: 9, right: 12, counts: [['A', 1], ['D', 0], ['O', 0], ['B', 1], ['E', 0], ['C', 1], ['N', 1]], answer: 'BANC', note: '最终返回 s[9:13]="BANC"。' },
        },
      ],
    },
  },

  '53': {
    summary: '边扫描边维护“以当前元素结尾的最大子数组和”；旧段总和为负时直接丢弃，从当前元素重新开始。',
    input: '非空整数数组 nums，元素可正可负。',
    output: '总和最大的连续非空子数组的和。',
    core: 'cur 表示以刚处理的元素结尾的最佳和。转移为 cur=max(cur,0)+x：旧段为负时取 0，等价于只选 x；ans 保存所有 cur 的最大值。',
    walkthrough: 'nums=[-2,1,-3,4,-1,2,1,-5,4] 中，读到 4 时旧 cur=-2 被丢弃，cur=4；随后 4、-1、2、1 累计到 6。最后的 -5、4 虽让 cur 回到 5，ans 仍保持 6。',
    pitfalls: ['子数组不能为空，即使全是负数也必须选一个元素。', '循环从 nums[1:] 开始，所以 ans 初始为 nums[0]，不能初始为 0。', '重置旧段发生在加上 x 之前。'],
    observation: '对于固定的右端点，任何前缀和为负的更左段都不会帮助提高答案，可以安全截断。',
    mechanism: 'Kadane 滚动状态。cur 只依赖上一个 cur 和当前 x，ans 只依赖历史最大值。',
    invariant: '处理完前 i 个元素后，cur 是以 nums[i-1] 结尾的最大子数组和，ans 是这 i 个元素中所有非空子数组的最大和。',
    termination: '外层从第二个元素走到末尾，每个元素只做一次常数次比较和加法。',
    counterexample: 'nums=[-2,-1] 的答案是 -1。若把 cur 重置为 0 后又把 ans 与 0 比较，就会错误返回代表空子数组的 0。',
    naive: '枚举起点后不断延长终点并累加，时间 O(n²)，除答案外只需 O(1) 空间。',
    time: 'O(n)',
    timeNote: 'nums[1:] 先复制 n-1 个引用，耗时 O(n)；随后 n-1 次循环均为 O(1)，总时间仍为 O(n)。',
    space: 'O(n)',
    spaceNote: '实际提交使用 nums[1:] 切片，额外占用 O(n) 个引用；cur、ans 为 O(1)。若改成按下标遍历可把额外空间降到 O(1)。',
    keyLines: [
      { start: 3, end: 6, text: `        cur = ans = nums[0]
        for x in nums[1:]:
            cur = max(cur, 0) + x
            ans = max(ans, cur)` },
    ],
    challenge: {
      question: '为什么 max(cur,0)+x 不会漏掉以 x 结尾的最佳子数组？',
      hint: '以 x 结尾的候选要么接在旧段后，要么只有 x。',
      answer: '若旧段 cur>0，接上它一定更大；若 cur<=0，接上它不会优于只取 x。取二者较大值正好覆盖全部可能。',
    },
    similar: [
      { id: 152, title: '乘积最大子数组', slug: 'maximum-product-subarray', role: '同类巩固', reason: '同属连续子数组滚动状态；负数会让最大乘积与最小乘积互换，因此要同时维护两种状态。' },
      { id: 121, title: '买卖股票的最佳时机', slug: 'best-time-to-buy-and-sell-stock', role: '前置练习', reason: '用历史最小值与当前值的差求一次交易最大收益，可帮助理解“前缀状态截断”的思想。' },
      { id: 954, title: '环形子数组的最大和', slug: 'maximum-sum-circular-subarray', role: '进阶挑战', reason: '在线性 Kadane 上加入首尾相连的情况，需要处理全为负数和跨边界最大段。' },
    ],
    viz: {
      family: 'array',
      data: { values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
      frames: [
        {
          title: '首个元素初始化',
          detail: 'cur=-2、ans=-2，空段不能作为候选。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: -1, answer: '-2', note: '等待读取后续元素。', markers: ['cur=-2', 'ans=-2'] },
        },
        {
          title: '读取 1',
          detail: '旧 cur=-2 被丢弃，cur=max(-2,0)+1=1。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 1, answer: '1', note: '以 1 结尾的最佳和是 1。', markers: ['cur=1', 'ans=1'] },
        },
        {
          title: '读取 -3',
          detail: 'cur=1+(-3)=-2，ans 保持 1。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 2, answer: '1', note: '当前以 -3 结尾不如此前的 [1]。', markers: ['cur=-2', 'ans=1'] },
        },
        {
          title: '从 4 重新开始',
          detail: 'cur=max(-2,0)+4=4，ans 更新为 4。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 3, answer: '4', note: '负旧段被截断。', markers: ['cur=4', 'ans=4'] },
        },
        {
          title: '接上 -1',
          detail: 'cur=4-1=3，ans 仍为 4。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 4, answer: '4', note: '以 -1 结尾的最佳和是 3。', markers: ['cur=3', 'ans=4'] },
        },
        {
          title: '接上 2',
          detail: 'cur=3+2=5，ans 更新为 5。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 5, answer: '5', note: '当前最佳段为 [4,-1,2]。', markers: ['cur=5', 'ans=5'] },
        },
        {
          title: '答案达到 6',
          detail: 'cur=5+1=6，ans 更新为 6。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 6, answer: '6', note: '当前最佳段为 [4,-1,2,1]。', markers: ['cur=6', 'ans=6'] },
        },
        {
          title: '读取 -5',
          detail: 'cur=6-5=1，历史最佳仍为 6。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 7, answer: '6', note: '以 -5 结尾的最佳和只有 1。', markers: ['cur=1', 'ans=6'] },
        },
        {
          title: '读取最后的 4',
          detail: 'cur=1+4=5，没有超过 ans=6。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 8, answer: '6', note: '扫描结束。', markers: ['cur=5', 'ans=6'] },
        },
        {
          title: '返回历史最大值',
          detail: '最终答案为 6，对应连续段 [4,-1,2,1]。',
          state: { values: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], index: 8, answer: '6', note: 'cur 是当前结尾状态，ans 才是全局答案。', markers: ['cur=5', 'ans=6'] },
        },
      ],
    },
  },

  '56': {
    summary: '先按左端点排序，再顺序扫描；只与结果中的最后一个区间比较，重叠或相接时扩展其右端点。',
    input: '若干闭区间 [start,end]，初始顺序可以任意。',
    output: '合并所有重叠或相接区间后的不重叠列表。',
    core: '排序后，若当前起点 a 大于结果末区间的右端点，就另起一段；否则两段重叠或相接，右端点取二者最大值。',
    walkthrough: '输入 [[1,4],[4,5],[2,3],[8,10],[15,18]] 排序后为 [1,4]、[2,3]、[4,5]、[8,10]、[15,18]。[2,3] 被 [1,4] 包住，右端点仍为 4；[4,5] 在端点 4 相接，合并成 [1,5]。',
    pitfalls: ['相接也算重叠，因此判断新段要用 ans[-1][1] < a，不能用 <=。', '合并右端点必须取 max，防止小区间把已合并的大区间缩短。', 'intervals.sort() 会原地改变输入。'],
    observation: '按起点排序后，一个新区间只需检查结果最后一段；更早段的右端点不会重新与当前起点相交。',
    mechanism: '字典序排序加结果栈式扫描。ans[-1] 始终是目前正在构建的最后一段。',
    invariant: '扫描完排序后的前 k 个区间后，ans 中区间互不重叠且已正确合并；最后一个区间是唯一可能与下一段相交的区间。',
    termination: '排序后每个输入区间恰好扫描一次，处理完最后一个区间即得到完整结果。',
    counterexample: '[[1,4],[4,5]] 应合并为 [[1,5]]。把端点相接误判为分离会得到两个本应合并的区间。',
    naive: '不排序就对每个区间扫描所有区间求连通并集，时间最坏 O(n²)，还需要记录已访问区间和构建结果。',
    time: 'O(n log n + n)',
    timeNote: 'Python TimSort 排序为 O(n log n)，随后线性扫描；n 是区间数量。',
    space: 'O(n)',
    spaceNote: '结果 ans 最多保存 n 个区间；Python 排序本身最坏还可能需要 O(n) 辅助空间。代码没有另外复制输入，sort 原地修改 intervals。',
    keyLines: [
      { start: 3, end: 9, text: `        intervals.sort()
        ans = []
        for a,b in intervals:
            if not ans or ans[-1][1] < a:
                ans.append([a,b])
            else:
                ans[-1][1] = max(ans[-1][1],b)` },
    ],
    challenge: {
      question: '为什么新区间不会与 ans 中倒数第二个区间相交？',
      hint: '利用输入已按起点排序，以及 ans 已有的不重叠性质。',
      answer: 'ans 中相邻区间已经分离，所以倒数第二段的右端点小于最后一段的起点。新区间起点不早于最后一段起点，因此更不可能重新碰到倒数第二段。',
    },
    similar: [
      { id: 57, title: '插入区间', slug: 'insert-interval', role: '同类巩固', reason: '同样处理相接与重叠区间，但输入区间原本有序，可在 O(n) 内找到插入位置并局部合并。' },
      { id: 435, title: '无重叠区间', slug: 'non-overlapping-intervals', role: '同类巩固', reason: '按结束端点排序后做区间调度，可对照学习不同排序键如何服务不同目标。' },
      { id: 452, title: '用最少数量的箭引爆气球', slug: 'minimum-number-of-arrows-to-burst-balloons', role: '进阶挑战', reason: '把区间转成气球的左右范围，按右端点排序求最少公共点，仍依赖区间相交判断。' },
    ],
    viz: {
      family: 'array',
      data: { values: [[1, 4], [4, 5], [2, 3], [8, 10], [15, 18]] },
      frames: [
        {
          title: '原始输入',
          detail: '区间顺序杂乱，暂不能直接顺序合并。',
          state: { values: [[[1, 4], [4, 5], [2, 3], [8, 10], [15, 18]]], index: -1, answer: '', note: 'sort 将原地改变这个列表。', markers: ['未排序'] },
        },
        {
          title: '按起点排序',
          detail: '同一起点时按终点排序，本例没有同起点冲突。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: -1, answer: '', note: '准备扫描第一段。', markers: ['已排序'] },
        },
        {
          title: '加入 [1,4]',
          detail: '结果为空，直接创建第一段。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: 0, answer: '[[1,4]]', note: 'ans 只有最后一段。', markers: ['当前=[1,4]', 'append'] },
        },
        {
          title: '[2,3] 被包住',
          detail: '4<2 为假，发生重叠；max(4,3)=4，右端点不变。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: 1, answer: '[[1,4]]', note: '小区间不会缩短已有结果。', markers: ['当前=[2,3]', 'merge'] },
        },
        {
          title: '在端点 4 相接',
          detail: '[4,5] 与 [1,4] 相接，右端点扩展为 5。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: 2, answer: '[[1,5]]', note: '相接按题意需要合并。', markers: ['当前=[4,5]', 'merge'] },
        },
        {
          title: '[8,10] 另起一段',
          detail: '最后右端点 5<8，二者分离。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: 3, answer: '[[1,5],[8,10]]', note: '新段接在 ans 末尾。', markers: ['当前=[8,10]', 'append'] },
        },
        {
          title: '[15,18] 再另起一段',
          detail: '最后右端点 10<15，继续追加。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: 4, answer: '[[1,5],[8,10],[15,18]]', note: '所有区间处理完毕。', markers: ['当前=[15,18]', 'append'] },
        },
        {
          title: '返回合并结果',
          detail: '三段区间互不重叠，端点相接的区间已经合并。',
          state: { values: [[[1, 4], [2, 3], [4, 5], [8, 10], [15, 18]]], index: 4, answer: '[[1,5],[8,10],[15,18]]', note: '结果为 [[1,5],[8,10],[15,18]]。', markers: ['完成'] },
        },
      ],
    },
  },

  '189': {
    summary: '把右旋拆成“整体反转、反转前 k 个、反转剩余部分”三次原地反转。',
    input: '整数数组 nums 和非负旋转步数 k，要求原地修改。',
    output: '无返回值；nums 最终向右循环移动 k 位。',
    core: '先把尾部待移到前面的 k 个元素按相反顺序放到最左，再把前面 n-k 个元素反向放到最右；随后分别反转两段，恢复各自内部顺序。',
    walkthrough: '[1,2,3,4,5,6,7] 整体反转为 [7,6,5,4,3,2,1]；反转前 3 个得到 [5,6,7,4,3,2,1]；反转后 4 个得到 [5,6,7,1,2,3,4]。',
    pitfalls: ['k 可能大于 n，先执行 k%=n。', 'k=0 或 k 是 n 的倍数时，后两次反转区间为空，不应交换元素。', '函数返回 None，调用方必须查看 nums 本身。'],
    observation: '若目标是 A+B，右旋 k 位后应为 B+A；整体反转得到 reverse(B)+reverse(A)，再分别反转即可。',
    mechanism: '双指针原地反转。rev(l,r) 交换两端元素并向中间收缩。',
    invariant: '每次 rev 调用只改变 [l,r] 内元素；结束时该区间顺序完全反转，区间外保持不变。',
    termination: '每次交换后 r-l 至少减少 2；l>=r 时区间最多剩一个元素，反转完成。三次 rev 依次执行。',
    counterexample: 'nums=[1,2,3]、k=4 等价于右移 1 位，答案是 [3,1,2]。不取模会让反转下标越过数组边界。',
    naive: '创建 nums[-k:] 与 nums[:-k] 的切片再拼接，时间 O(n)，但切片和结果合计额外占用 O(n) 空间，且 k=0 时切片写法容易出错。',
    time: 'O(n)',
    timeNote: '三次反转合计最多交换 n 次量级；k%=n 为 O(1)。',
    space: 'O(1)',
    spaceNote: '只使用 nums 本身和常数个局部变量；嵌套函数 rev 的调用栈深度固定，没有切片或新数组。',
    keyLines: [
      { start: 6, end: 14, text: `        n = len(nums)
        k %= n
        def rev(l, r):
            while l < r:
                nums[l], nums[r] = nums[r], nums[l]
                l, r = l + 1, r - 1
        rev(0, n - 1)
        rev(0, k - 1)
        rev(k, n - 1)` },
    ],
    challenge: {
      question: '为什么三段反转的次序不能随意交换？',
      hint: '在 A+B 上分别计算三种反转后的结果。',
      answer: '这个顺序先交换 A、B 两块的位置，再修正每块内部方向。先反转单块会改变块内元素次序，后续整体反转不能恢复原来的块内顺序。',
    },
    similar: [
      { id: 344, title: '反转字符串', slug: 'reverse-string', role: '前置练习', reason: '练习最基础的双指针原地反转，是理解 rev 的最小练习。' },
      { id: 151, title: '反转字符串中的单词', slug: 'reverse-words-in-a-string', role: '同类巩固', reason: '先反转整体再分段反转，与本题的三段反转结构相近，但还要处理空格和单词边界。' },
      { id: 61, title: '旋转链表', slug: 'rotate-list', role: '进阶挑战', reason: '同样是右旋 k 位，但必须处理链表长度、断链和原地重连，不能直接复制节点值。' },
    ],
    viz: {
      family: 'array',
      data: { values: [1, 2, 3, 4, 5, 6, 7], k: 3 },
      frames: [
        {
          title: '归一化 k',
          detail: 'n=7、k=3，三次反转都将在原数组上执行。',
          state: { values: [[1, 2, 3, 4, 5, 6, 7]], index: -1, answer: '[1,2,3,4,5,6,7]', note: '准备整体反转。', markers: ['k=3', 'rev(0,6)'] },
        },
        {
          title: '整体交换两端',
          detail: '交换下标 0 与 6，1 和 7 来到数组两端。',
          state: { values: [[7, 2, 3, 4, 5, 6, 1]], index: 0, answer: '[7,2,3,4,5,6,1]', note: '第一轮整体反转。', markers: ['swap(0,6)'] },
        },
        {
          title: '继续向中间交换',
          detail: '交换下标 1 与 5，外侧元素逐步归位。',
          state: { values: [[7, 6, 3, 4, 5, 2, 1]], index: 1, answer: '[7,6,3,4,5,2,1]', note: '第一轮整体反转。', markers: ['swap(1,5)'] },
        },
        {
          title: '整体反转完成',
          detail: '交换下标 2 与 4 后，中间元素 4 无需移动。',
          state: { values: [[7, 6, 5, 4, 3, 2, 1]], index: 2, answer: '[7,6,5,4,3,2,1]', note: '接着反转前 k=3 个。', markers: ['rev(0,6) 完成'] },
        },
        {
          title: '修正前段方向',
          detail: '交换下标 0 与 2，前段从 [7,6,5] 变为 [5,6,7]。',
          state: { values: [[5, 6, 7, 4, 3, 2, 1]], index: 0, answer: '[5,6,7,4,3,2,1]', note: '第二轮 rev(0,2)。', markers: ['swap(0,2)'] },
        },
        {
          title: '修正后段外端',
          detail: '交换下标 3 与 6，后段开始恢复正序。',
          state: { values: [[5, 6, 7, 1, 3, 2, 4]], index: 3, answer: '[5,6,7,1,3,2,4]', note: '第三轮 rev(3,6)。', markers: ['swap(3,6)'] },
        },
        {
          title: '右旋完成',
          detail: '交换下标 4 与 5，得到最终顺序。',
          state: { values: [[5, 6, 7, 1, 2, 3, 4]], index: 4, answer: '[5,6,7,1,2,3,4]', note: '尾部 [5,6,7] 已移到前部。', markers: ['swap(4,5)', '完成'] },
        },
      ],
    },
  },

  '238': {
    summary: '答案数组先存每个位置左侧的前缀积，再从右向左乘上后缀积，避免除法。',
    input: '整数数组 nums，允许出现 0；题目要求不用除法。',
    output: '长度同为 n 的数组，answer[i] 等于除 nums[i] 外其余元素的乘积。',
    core: 'answer[i]=左侧所有元素乘积×右侧所有元素乘积。第一遍只乘 pre，第二遍只乘 back，两个乘积在位置 i 恰好覆盖除自身外的全部元素。',
    walkthrough: 'nums=[1,2,3,4] 的第一遍得到 [1,1,2,6]。从右往左时，back 依次为 1、4、12、24，最终变为 [24,12,8,6]。',
    pitfalls: ['pre 要在写入答案后再乘 nums[i]；back 同理。', '初始化 pre=back=1，避免首尾位置缺少空区间的乘积。', '不能先算总积再除，0 会破坏做法。'],
    observation: '“除自身”可以拆成左右两个互不重叠的方向信息；原数组保持不变，答案数组直接承担前缀积存储。',
    mechanism: '前缀积与后缀积的双向扫描，共用 ans 作为输出和中间状态。',
    invariant: '第一遍处理到 i 后，ans[0..i] 已存左侧乘积，pre 是前 i+1 个元素总积；第二遍处理到 i 后，ans[0..i] 已同时含左右乘积，back 是右侧已扫描元素总积。',
    termination: '左到右 n 次、右到左 n 次；第二遍结束后每个位置恰好被左右乘积各乘一次。',
    counterexample: 'nums=[1,0,3] 的答案是 [0,3,0]。总积为 0，用 answer[i]=total/nums[i] 会在 nums[i]=0 时除零。',
    naive: '对每个 i 重新遍历其余 n-1 个元素求积，时间 O(n²)，除输出外只需 O(1) 空间。',
    time: 'O(n)',
    timeNote: '两遍各 n 次常数次乘赋值，初始化 ans 也为 O(n)。',
    space: 'O(n)',
    spaceNote: 'ans 是题目要求的长度 n 输出；pre、back 和循环变量仅 O(1)。不计输出时额外辅助空间为 O(1)。',
    keyLines: [
      { start: 3, end: 13, text: `        n = len(nums)
        ans = [1] * n
        pre = 1
        for i in range(n):
            ans[i] *= pre
            pre *= nums[i]
        back = 1
        for i in range(n-1, -1, -1):
            ans[i] *= back
            back *= nums[i]
        return ans` },
    ],
    challenge: {
      question: 'ans[i] 在第一遍和第二遍分别代表什么？',
      hint: '区分“当前位置左侧”和“当前位置右侧”。',
      answer: '第一遍后 ans[i] 是 nums[0..i-1] 的乘积；第二遍乘入的 back 是 nums[i+1..n-1] 的乘积。两者合起来正好排除 nums[i]。',
    },
    similar: [
      { id: 42, title: '接雨水', slug: 'trapping-rain-water', role: '同类巩固', reason: '同样先保留左向右信息，再结合右向左信息，避免每个位置重复扫描。' },
      { id: 303, title: '区域和检索 - 数组不可变', slug: 'range-sum-query-immutable', role: '前置练习', reason: '用前缀和数组把重复区间求和变成 O(1)，可帮助建立前缀信息复用的直觉。' },
      { id: 724, title: '寻找数组的中心下标', slug: 'find-pivot-index', role: '同类巩固', reason: '通过总和减前缀和得到后缀信息，与本题左右信息合并的方向相反。' },
    ],
    viz: {
      family: 'array',
      data: { values: [1, 2, 3, 4] },
      frames: [
        {
          title: '答案初始化为 1',
          detail: 'ans=[1,1,1,1]，pre=1，开始前缀扫描。',
          state: { values: [[1, 2, 3, 4]], index: -1, answer: '[1,1,1,1]', note: 'ans 同时承担输出和中间状态。', markers: ['pre=1'] },
        },
        {
          title: '位置 0 的左侧乘积',
          detail: 'ans[0] 乘 1 后仍是 1，pre 变为 nums[0]=1。',
          state: { values: [[1, 2, 3, 4]], index: 0, answer: '[1,1,1,1]', note: '第一遍：前缀扫描。', markers: ['pre=1'] },
        },
        {
          title: '位置 1 的左侧乘积',
          detail: 'ans[1] 乘 pre=1，pre 随后变为 2。',
          state: { values: [[1, 2, 3, 4]], index: 1, answer: '[1,1,1,1]', note: '左侧只有 nums[0]=1。', markers: ['pre=2'] },
        },
        {
          title: '位置 2 的左侧乘积',
          detail: 'ans[2] 乘 2 得到 2，pre 变为 6。',
          state: { values: [[1, 2, 3, 4]], index: 2, answer: '[1,1,2,1]', note: '左侧乘积为 1×2。', markers: ['pre=6'] },
        },
        {
          title: '前缀扫描完成',
          detail: 'ans[3] 乘 6，pre 成为全数组乘积 24。',
          state: { values: [[1, 2, 3, 4]], index: 3, answer: '[1,1,2,6]', note: '接下来 back=1，从右向左。', markers: ['pre=24', 'back=1'] },
        },
        {
          title: '位置 3 的右侧乘积',
          detail: 'ans[3] 乘 back=1 不变，back 随后变为 4。',
          state: { values: [[1, 2, 3, 4]], index: 3, answer: '[1,1,2,6]', note: '位置 3 右侧没有元素。', markers: ['back=4'] },
        },
        {
          title: '位置 2 乘上后缀积',
          detail: 'ans[2]=2×4=8，back 随后变为 12。',
          state: { values: [[1, 2, 3, 4]], index: 2, answer: '[1,1,8,6]', note: '位置 2 的答案是 (1×2)×4。', markers: ['back=12'] },
        },
        {
          title: '位置 1 乘上后缀积',
          detail: 'ans[1]=1×12=12，back 随后变为 24。',
          state: { values: [[1, 2, 3, 4]], index: 1, answer: '[1,12,8,6]', note: '位置 1 的答案是 1×(3×4)。', markers: ['back=24'] },
        },
        {
          title: '位置 0 得到最终答案',
          detail: 'ans[0]=1×24=24，双向扫描结束。',
          state: { values: [[1, 2, 3, 4]], index: 0, answer: '[24,12,8,6]', note: '最终 answer=[24,12,8,6]。', markers: ['back=1', '完成'] },
        },
      ],
    },
  },

  '41': {
    summary: '把数组本身当作哈希表：值 x 应去下标 x-1，通过交换让范围内的正整数逐个归位，再找第一个错位。',
    input: '未排序整数数组 nums，可能含负数、0 和重复值。',
    output: '未出现的最小正整数；1 到 n 都出现时返回 n+1。',
    core: '若 1<=nums[i]<=n 且 nums[nums[i]-1]!=nums[i]，就把 x=nums[i] 交换到 x-1。重复归位直到当前值无需移动，最后 nums[i]==i+1 表示 i+1 已出现。',
    walkthrough: 'nums=[3,4,-1,1] 中，3 与 -1 交换得到 [-1,4,3,1]；4 与 1 交换后，再把 1 放到下标 0，得到 [1,-1,3,4]。最终下标 1 不是 2，所以缺失的第一个正数为 2。',
    pitfalls: ['这是按下标归位的原地哈希，不是负号标记，也不是排序。', 'while 条件先检查 x 范围，避免越界。', '重复值通过目标槽已有同值来停止交换。'],
    observation: '答案只可能是 1 到 n+1；把每个范围内的正整数放到以自身值编号的槽位，就能直接检查哪些正数缺失。',
    mechanism: '原地索引哈希。数组值 x 是键，x-1 是目标槽位；交换替代额外哈希表。',
    invariant: '已经满足 nums[t]=t+1 的槽位不会被后续交换再次破坏；while 每次交换都会把一个值永久归位。',
    termination: '每次交换至少固定一个新槽位，因此最多 n 次交换；外层 n 个位置和最终 n 次扫描均会结束。',
    counterexample: 'nums=[1,1] 中第二个 1 的目标槽已有 1，不再交换；最终 [1,1] 的第二个位置不等于 2，返回 2。',
    naive: '排序后从 1 开始检查，时间 O(n log n)，sorted 还会占用 O(n) 空间；用集合记录出现值则是期望 O(n) 时间、O(n) 空间。',
    time: 'O(n)',
    timeNote: '虽然写的是 while，但每次成功交换都会永久修正一个目标槽位，总交换次数不超过 n；其余扫描为 O(n)。',
    space: 'O(1)',
    spaceNote: '只修改输入 nums，使用 i、x 等常数变量；没有排序副本、集合或标记数组。',
    keyLines: [
      { start: 3, end: 11, text: `        n = len(nums)
        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                x = nums[i]
                nums[i], nums[x - 1] =  nums[x - 1], nums[i]
        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        return n + 1` },
    ],
    challenge: {
      question: '为什么重复值不会导致 while 无限交换？',
      hint: '检查目标槽已经等于 x 时的条件。',
      answer: '当 nums[x-1]==x 时，while 的第二个条件为假，交换停止。相同值不会来回移动；无效值也因范围检查直接跳过。',
    },
    similar: [
      { id: 448, title: '找到所有数组中消失的数字', slug: 'find-all-numbers-disappeared-in-an-array', role: '同类巩固', reason: '同样利用 1..n 与下标的对应关系，在数组内做标记；本题只要求第一个缺失值。' },
      { id: 442, title: '数组中重复的数据', slug: 'find-all-duplicates-in-an-array', role: '同类巩固', reason: '也用值对应的下标识别出现情况，但常通过负号标记处理重复值，与本题交换归位不同。' },
      { id: 287, title: '寻找重复数', slug: 'find-the-duplicate-number', role: '进阶挑战', reason: '在只读或常数额外空间要求下，把数值当图中下标使用；可对照数组内定位的多种方式。' },
      { id: 268, title: '丢失的数字', slug: 'missing-number', role: '前置练习', reason: '先练习从 0..n 中找缺失值，再扩展到本题的原地哈希和重复值处理。' },
    ],
    viz: {
      family: 'array',
      data: { values: [3, 4, -1, 1] },
      frames: [
        {
          title: '准备原地归位',
          detail: 'n=4，只处理值 1、2、3、4；-1 不应作为下标使用。',
          state: { values: [[3, 4, -1, 1]], index: -1, answer: '待扫描', note: '当前没有已归位扫描结果。', markers: ['i=0', 'x=3'] },
        },
        {
          title: '把 3 放到下标 2',
          detail: '交换 nums[0]=3 与 nums[2]=-1，3 永久归位，当前元素变成 -1。',
          state: { values: [[-1, 4, 3, 1]], index: 0, answer: '待扫描', note: 'nums[2]=3，while 因 -1 越界而停止。', markers: ['swap(0,2)'] },
        },
        {
          title: '先把 4 放到下标 3',
          detail: 'i=1 的 4 与 nums[3]=1 交换，4 归位，当前元素变为 1。',
          state: { values: [[-1, 1, 3, 4]], index: 1, answer: '待扫描', note: '继续处理换到 i=1 的值 1。', markers: ['swap(1,3)'] },
        },
        {
          title: '再把 1 放到下标 0',
          detail: '1 与 nums[0]=-1 交换，1 归位；当前 -1 停止循环。',
          state: { values: [[1, -1, 3, 4]], index: 1, answer: '待扫描', note: '下标 0、2、3 已分别等于 1、3、4。', markers: ['swap(1,0)'] },
        },
        {
          title: '下标 2 已正确',
          detail: 'i=2 的值 3 已在目标槽，while 不执行。',
          state: { values: [[1, -1, 3, 4]], index: 2, answer: '待扫描', note: '进入最终扫描前的归位检查。', markers: ['i=2', '无需交换'] },
        },
        {
          title: '下标 3 已正确',
          detail: 'i=3 的值 4 也无需交换，归位阶段结束。',
          state: { values: [[1, -1, 3, 4]], index: 3, answer: '待扫描', note: '接下来检查第一个不匹配槽位。', markers: ['i=3', '无需交换'] },
        },
        {
          title: '找到缺失值 2',
          detail: '下标 0 是 1，下标 1 是 -1 而不是 2，立即返回 2。',
          state: { values: [[1, -1, 3, 4]], index: 1, answer: '2', note: '答案 2；没有进行排序或复制数组。', markers: ['return i+1'] },
        },
      ],
    },
  },

  '73': {
    summary: '用矩阵第一行和第一列保存行列清零标记，另用两个变量记住它们原本是否含 0，最后再处理这两条边界。',
    input: 'm×n 整数矩阵 matrix，某个元素为 0 时，其所在行和列都必须全部置 0。',
    output: '无返回值；直接在 matrix 上完成原地清零。',
    core: '内部元素 matrix[i][j]==0 时写 matrix[i][0]=matrix[0][j]=0。随后用第一列决定哪些行清零、用第一行决定哪些列清零，最后依据原始标志处理第一行与第一列。',
    walkthrough: 'matrix=[[1,0,3],[4,0,6],[0,8,9]] 的原始 row_0=true、col_0=true。内部 (1,1)=0 又把第 1 行和第 1 列标为 0。清完内部后，第 0 行和第 0 列也按原始标志清零，最终全为 0。',
    pitfalls: ['必须先保存 row_0 和 col_0，否则后面用第一行、第一列作标记会覆盖原始信息。', '标记扫描只处理 i>=1、j>=1，避免把标记区再次当普通数据扫描。'],
    observation: '每行只需一个“整行清零”位，每列只需一个“整列清零”位；第一行和第一列正好提供 m+n 个无需额外数组的位置。',
    mechanism: '原地标记。第一行存列标记，第一列存行标记，两个布尔变量保存边界原始状态。',
    invariant: '扫描内部时，matrix[i][0] 和 matrix[0][j] 已记录此前遇到的零所要求清零的行列；row_0、col_0 始终保持原始值。',
    termination: '内部标记一次、内部清零一次，边界各扫描一次；所有 m×n 单元在常数轮遍历后完成。',
    counterexample: 'matrix=[[0,1],[2,3]] 应变成 [[0,0],[0,3]]。若不提前保存 row_0，第一行作为列标记后可能忘记它原本需要整行清零。',
    naive: '复制一份原矩阵，再逐格查看副本中对应行、列是否有 0；时间 O(mn)，额外空间 O(mn)。',
    time: 'O(mn)',
    timeNote: '标记内部区域、清零内部区域以及最后处理首行首列都是常数轮线性扫描。',
    space: 'O(1)',
    spaceNote: '只使用 row_0、col_0 和循环变量；首行首列复用输入矩阵，没有复制矩阵或行列表。',
    keyLines: [
      { start: 6, end: 20, text: `        m,n = len(matrix), len(matrix[0])
        row_0 = 0 in matrix[0]
        col_0 = any(matrix[i][0] == 0 for i in range(m))
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = matrix[0][j] = 0
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        if row_0:
            for j in range(n): matrix[0][j] = 0
        if col_0:
            for i in range(m): matrix[i][0] = 0` },
    ],
    challenge: {
      question: '为什么第一行和第一列必须留到最后处理？',
      hint: '它们既保存数据，又保存其他行列的标记。',
      answer: '如果提前清空第一行或第一列，就会擦除尚未使用的清零标记，导致后续行列漏清零。先保存它们的原始状态，最后再清零可兼顾两个角色。',
    },
    similar: [
      { id: 48, title: '旋转图像', slug: 'rotate-image', role: '同类巩固', reason: '同样是方阵原地变换，练习通过固定位置和循环顺序避免复制整个矩阵。' },
      { id: 36, title: '有效的数独', slug: 'valid-sudoku', role: '同类巩固', reason: '都需要同时追踪行、列和区域信息，可比较“额外集合”与“原地标记”的空间取舍。' },
      { id: 289, title: '生命游戏', slug: 'game-of-life', role: '进阶挑战', reason: '每个新状态依赖周围旧状态，需要避免原地更新互相污染；与本题先保存边界信息的思路相关。' },
    ],
    viz: {
      family: 'array',
      data: { values: [[1, 0, 3], [4, 0, 6], [0, 8, 9]] },
      frames: [
        {
          title: '原始矩阵',
          detail: '首行第 1 列、首列第 2 行以及内部 (1,1) 都是 0。',
          state: { values: [[1, 0, 3], [4, 0, 6], [0, 8, 9]], index: -1, answer: '未开始', note: 'm=3、n=3。', markers: ['原始 matrix'] },
        },
        {
          title: '保存边界标志',
          detail: 'row_0=true，col_0=true；之后首行首列可以被安全改写为标记。',
          state: { values: [[1, 0, 3], [4, 0, 6], [0, 8, 9]], index: 0, answer: '未开始', note: '两个变量保留第一行、第一列的原始状态。', markers: ['row_0=true', 'col_0=true'] },
        },
        {
          title: '记录内部零',
          detail: '发现 (1,1)=0，把 matrix[1][0] 和 matrix[0][1] 写成 0。',
          state: { values: [[1, 0, 3], [0, 0, 6], [0, 8, 9]], index: 4, answer: '标记完成', note: '第 1 行和第 1 列需要清零。', markers: ['zero at (1,1)'] },
        },
        {
          title: '清零第 1 行内部',
          detail: '第 1 行的行标记为 0，因此内部三格都变为 0。',
          state: { values: [[1, 0, 3], [0, 0, 0], [0, 8, 9]], index: 5, answer: '内部处理中', note: 'matrix[1][0] 同时是行标记。', markers: ['row 1 cleared'] },
        },
        {
          title: '清零第 2 行内部',
          detail: '第 2 行因原始首列零而需要清零，列 1 又因列标记为 0。',
          state: { values: [[1, 0, 3], [0, 0, 0], [0, 0, 0]], index: 8, answer: '内部处理完成', note: '首行与首列尚未按原始标志统一清除。', markers: ['row 2 cleared'] },
        },
        {
          title: '按原始标志清首行',
          detail: 'row_0=true，所以第一行三格全部置 0。',
          state: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], index: 0, answer: '即将完成', note: '首列原始标志仍独立保存在 col_0。', markers: ['first row cleared'] },
        },
        {
          title: '按原始标志清首列',
          detail: 'col_0=true，第一列三格置 0；本例此前已经为 0。',
          state: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], index: 6, answer: '完成', note: '原地修改结束。', markers: ['first column cleared'] },
        },
        {
          title: '最终矩阵',
          detail: '每个原始零要求的行列都已覆盖，结果为全零矩阵。',
          state: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], index: 8, answer: '完成', note: '额外空间只有两个布尔标志。', markers: ['final matrix'] },
        },
      ],
    },
  },

  '54': {
    summary: '用上、下、左、右四个边界逐层读取矩阵；每读完一条边就收紧对应边界。',
    input: '非空 m×n 矩阵 matrix，按从外到内的顺时针螺旋顺序遍历。',
    output: '包含全部 m×n 个元素的一维列表，顺序为顺时针螺旋。',
    core: '先读上边并 top++，再读右边并 right--；下边和左边只有在对应边界仍有效时才读，防止单行或单列重复。',
    walkthrough: '3×3 矩阵先读上边 1,2,3，再读右边 6,9，接着读下边 8,7，随后读左边 4。边界收缩后只剩中心 5，最后读入，得到 1,2,3,6,9,8,7,4,5。',
    pitfalls: ['上边读完后 top 已增加，右边的 range 必须从新 top 开始。', '下边和左边各有独立有效性判断，不能无条件执行。', '矩阵本身不会被修改。', '注释旧副本：原文件第 21–34 行是同一四边界算法的注释版本，没有参与执行，也不是另一套已运行的旧方案。'],
    observation: '每轮读取当前剩余矩形的四条边，并切掉最外一层；单行或单列退化成一条或两条线段。',
    mechanism: '四边界收缩。t、b、l、r 圈出尚未读取的子矩阵。',
    invariant: '每次 while 开始时，[t,b]×[l,r] 恰好是还未读取的元素；已读部分都在 res 中且顺序正确。',
    termination: '每轮至少读取一条边并收紧一个边界；当 t>b 或 l>r 时没有未读元素，循环结束。',
    counterexample: '单行 [[1,2,3]] 读上边后 top=1>b=0，若仍读下边就会重复这些元素；代码用 if t<=b 避免重复。',
    naive: '用 visited 布尔矩阵标记已读位置，再按方向模拟并撞界转向；时间 O(mn)，除结果外额外空间 O(mn)。',
    time: 'O(mn)',
    timeNote: '每个元素恰好进入 res 一次；四层循环的 range 总长度为 mn。',
    space: 'O(mn)',
    spaceNote: '结果 res 保存 mn 个元素。每次 res += 列表推导式还会短暂构造一段长最多 max(m,n) 的临时列表，因此额外峰值辅助空间为 O(max(m,n))。',
    keyLines: [
      { start: 3, end: 16, text: `        res = []
        t, b = 0, len(matrix) - 1
        l, r = 0, len(matrix[0]) - 1
        while t <= b and l <= r:
            res += [matrix[t][j] for j in range(l, r+1)]
            t += 1
            res += [matrix[i][r] for i in range(t, b+1)]
            r -= 1
            if t <= b:
                res += [matrix[b][j] for j in range(r, l - 1, - 1)]
                b -= 1
            if l <= r:
                res += [matrix[i][l] for i in range(b, t - 1, - 1)]
                l += 1` },
    ],
    challenge: {
      question: '为什么下边和左边不能像上边、右边一样无条件读取？',
      hint: '想象矩阵只剩一行或一列时，读上边或右边后发生了什么。',
      answer: '上边或右边可能已经读掉唯一剩余的行或列，使另一边为空。代码分别检查 t<=b 和 l<=r，只为仍然存在的边生成元素。',
    },
    similar: [
      { id: 59, title: '螺旋矩阵 II', slug: 'spiral-matrix-ii', role: '同类巩固', reason: '生成 1..n² 的顺时针螺旋矩阵，可把本题的读取边界反过来用于按层填数。' },
      { id: 48, title: '旋转图像', slug: 'rotate-image', role: '同类巩固', reason: '都要求按矩阵位置处理元素，但本题关注逐层边界，48 关注转置与行反转。' },
      { id: 921, title: '螺旋矩阵 III', slug: 'spiral-matrix-iii', role: '进阶挑战', reason: '从任意起点按螺旋扩展并处理越界，方向推进比固定四边界更复杂。' },
    ],
    viz: {
      family: 'array',
      data: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
      frames: [
        {
          title: '初始四边界',
          detail: 't=0、b=2、l=0、r=2，整个 3×3 矩阵尚未读取。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: -1, answer: '', note: '矩阵保持不变，markers 表示当前遍历边界。', markers: ['t=0,b=2,l=0,r=2'] },
        },
        {
          title: '读取上边',
          detail: '加入 1,2,3，top 增加到 1，避免右边重复左上角。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 2, answer: '1,2,3', note: '当前结果共 3 个元素。', markers: ['t=1,b=2,l=0,r=2'] },
        },
        {
          title: '读取右边',
          detail: '从 top=1 到 bottom=2 加入 6,9，right 减为 1。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 4, answer: '1,2,3,6,9', note: '右侧不再读取下标 2。', markers: ['t=1,b=2,l=0,r=1'] },
        },
        {
          title: '从右往左读下边',
          detail: '加入 8,7，bottom 减为 1。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 6, answer: '1,2,3,6,9,8,7', note: '底边下标已收缩到 1。', markers: ['t=1,b=1,l=0,r=1'] },
        },
        {
          title: '从下往上读左边',
          detail: '加入 4，left 增为 1，外层只剩中心。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 7, answer: '1,2,3,6,9,8,7,4', note: 't=b=1、l=r=1。', markers: ['t=1,b=1,l=1,r=1'] },
        },
        {
          title: '读取中心 5',
          detail: '上边只有 5，加入后 top=2，剩余区域失效。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 8, answer: '1,2,3,6,9,8,7,4,5', note: '九个元素已全部读取。', markers: ['t=2,b=1,l=1,r=1'] },
        },
        {
          title: '后两边为空',
          detail: '右边 range(2,2) 为空，后两个 if 也不满足，循环退出。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 8, answer: '1,2,3,6,9,8,7,4,5', note: '没有产生重复元素。', markers: ['t=2,b=1,l=1,r=0'] },
        },
        {
          title: '返回螺旋列表',
          detail: '最终结果按顺时针从外到内排列。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: 8, answer: '1,2,3,6,9,8,7,4,5', note: '原矩阵未修改。', markers: ['完成'] },
        },
      ],
    },
  },

  '48': {
    summary: '先沿主对角线转置，再把每一行左右反转，得到矩阵顺时针旋转 90°。',
    input: '非空 n×n 方阵 matrix。',
    output: '无返回值；matrix 原地变为顺时针旋转 90° 后的方阵。',
    core: '元素 (i,j) 转置后到 (j,i)，行反转后到 (j,n-1-i)，正好是顺时针 90° 的目标坐标。',
    walkthrough: '[[1,2,3],[4,5,6],[7,8,9]] 转置为 [[1,4,7],[2,5,8],[3,6,9]]；三行分别反转为 [7,4,1]、[8,5,2]、[9,6,3]。',
    pitfalls: ['转置只遍历 j>i 的上三角，避免重复交换。', 'row.reverse() 是原地反转整行；它不会返回新行。', '不要误写成逆时针旋转。'],
    observation: '顺时针旋转等价于“交换行列坐标，再翻转列坐标”；这两步都可原地完成。',
    mechanism: '主对角线对称加逐行双指针反转。',
    invariant: '转置阶段只处理上三角尚未交换的位置；全部交换后 matrix[j][i]=原 matrix[i][j]。行反转阶段只改变行内顺序。',
    termination: '转置进行 n(n-1)/2 次交换；随后 n 行各在 O(n) 内反转，全部完成后结束。',
    counterexample: '2×2 矩阵 [[1,2],[3,4]] 转置得 [[1,3],[2,4]]，行反转为 [[3,1],[4,2]]，这是正确的顺时针 90° 结果。',
    naive: '新建一个 n×n 矩阵，按 answer[j][n-1-i]=matrix[i][j] 复制，时间 O(n²)，额外空间 O(n²)。',
    time: 'O(n²)',
    timeNote: '转置访问上三角 n(n-1)/2 项，逐行反转合计访问 n² 个元素。',
    space: 'O(1)',
    spaceNote: '只交换矩阵内元素；row.reverse() 原地执行，没有复制行或构造第二份矩阵。',
    keyLines: [
      { start: 6, end: 11, text: `        n = len(matrix)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix:
            row.reverse()` },
    ],
    challenge: {
      question: '原位置 (i,j) 的元素经过两步后落到哪里？',
      hint: '先写成 (j,i)，再计算行内反转后的列下标。',
      answer: '转置把它送到 (j,i)；第 j 行长度为 n，反转后列下标变成 n-1-i，所以最终位置是 (j,n-1-i)。',
    },
    similar: [
      { id: 54, title: '螺旋矩阵', slug: 'spiral-matrix', role: '同类巩固', reason: '都是二维矩阵的顺序变换，可比较固定坐标公式与逐层边界两种分析方式。' },
      { id: 898, title: '转置矩阵', slug: 'transpose-matrix', role: '前置练习', reason: '集中练习 (i,j) 与 (j,i) 的坐标互换，是理解本题第一步的最小练习。' },
      { id: 61, title: '旋转链表', slug: 'rotate-list', role: '进阶挑战', reason: '同样涉及旋转，但数据是链式结构，必须重接指针并避免额外大数组。' },
    ],
    viz: {
      family: 'array',
      data: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
      frames: [
        {
          title: '原始方阵',
          detail: 'n=3，先执行主对角线转置。',
          state: { values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], index: -1, answer: '未开始', note: '只交换 j>i 的位置。', markers: ['transpose phase'] },
        },
        {
          title: '交换 (0,1) 与 (1,0)',
          detail: '2 和 4 交换，矩阵开始沿主对角线对称。',
          state: { values: [[1, 4, 3], [2, 5, 6], [7, 8, 9]], index: 1, answer: '转置中', note: '当前处理上三角位置 (0,1)。', markers: ['swap(0,1)'] },
        },
        {
          title: '交换 (0,2) 与 (2,0)',
          detail: '3 和 7 交换，首行变成 1,4,7。',
          state: { values: [[1, 4, 7], [2, 5, 6], [3, 8, 9]], index: 2, answer: '转置中', note: '当前处理上三角位置 (0,2)。', markers: ['swap(0,2)'] },
        },
        {
          title: '转置完成',
          detail: '交换 (1,2) 与 (2,1)，6 和 8 互换。',
          state: { values: [[1, 4, 7], [2, 5, 8], [3, 6, 9]], index: 5, answer: '转置完成', note: '接下来逐行反转。', markers: ['swap(1,2)'] },
        },
        {
          title: '反转第 0 行',
          detail: '[1,4,7] 变为 [7,4,1]。',
          state: { values: [[7, 4, 1], [2, 5, 8], [3, 6, 9]], index: 0, answer: '行反转中', note: 'row.reverse() 原地执行。', markers: ['reverse row 0'] },
        },
        {
          title: '反转第 1 行',
          detail: '[2,5,8] 变为 [8,5,2]。',
          state: { values: [[7, 4, 1], [8, 5, 2], [3, 6, 9]], index: 1, answer: '行反转中', note: '第 1 行仍保持转置后的列结构。', markers: ['reverse row 1'] },
        },
        {
          title: '旋转完成',
          detail: '最后一行变为 [9,6,3]，得到顺时针 90° 的矩阵。',
          state: { values: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], index: 2, answer: '完成', note: '最终矩阵 [[7,4,1],[8,5,2],[9,6,3]]。', markers: ['reverse row 2', 'final matrix'] },
        },
      ],
    },
  },

  '240': {
    summary: '从右上角开始；当前值偏大就左移排除一列，偏小就下移排除一行。',
    input: 'm×n 矩阵 matrix 和目标整数 target；每行从左到右递增，每列从上到下递增。',
    output: 'target 是否出现在矩阵中，返回布尔值。',
    core: '右上角元素是其所在行最大值、所在列最小值。若它大于 target，可排除当前列；若小于 target，可排除当前行；相等则直接找到。',
    walkthrough: '在 5×5 示例矩阵中找 6。从 15 开始，15、11、7 都大于 6，于是连续左移到 4；4 小于 6，下移到 5，再下移到 6，命中。',
    pitfalls: ['矩阵只是逐行、逐列有序，不能直接把它当成全局完全排序后做一次二分。', '起点必须选右上角；从左下角开始也可以，但移动规则要相应交换。'],
    observation: '每次比较都能删除一整行或一整列，同时保留剩余区域的有序结构。',
    mechanism: '阶梯搜索。i 只增加，j 只减少，形成一条从右上到左下的搜索路径。',
    invariant: '若 target 存在，它一定位于尚未排除的子矩阵：行 i..m-1、列 0..j。',
    termination: '每次循环要么返回 True，要么 i 增加或 j 减少；最多 m+n 步后 i=m 或 j=-1，返回 False。',
    counterexample: '示例矩阵中 target=6 实际存在。若从左上角 1 开始并沿用“大则左移、小则下移”，路径会是 1→2→3→10，最后越过下边界而漏掉 6。',
    naive: '遍历所有 m×n 个元素逐一比较，时间 O(mn)，额外空间 O(1)；利用每行有序可改成逐行二分，时间 O(m log n)。',
    time: 'O(m+n)',
    timeNote: 'i 最多增加 m 次，j 最多减少 n 次；每次比较 O(1)，不构造切片。',
    space: 'O(1)',
    spaceNote: '只保存 i、j 两个坐标；直接读取 matrix[i][j]，没有排序、复制或递归栈。',
    keyLines: [
      { start: 3, end: 11, text: `        i,j = 0, len(matrix[0]) - 1
        while i < len(matrix) and j >= 0:
            if matrix[i][j] > target:
                j -= 1
            elif matrix[i][j] < target:
                i += 1
            else:
                return True
        return False` },
    ],
    challenge: {
      question: '当前元素大于 target 时，为什么可以删除整个当前列？',
      hint: '看看同一列当前元素下方的数与它的大小关系。',
      answer: '列从上到下递增，所以当前元素下方的数都大于等于它，也就都大于 target。当前列不可能包含答案，可以 j--。',
    },
    similar: [
      { id: 74, title: '搜索二维矩阵', slug: 'search-a-2d-matrix', role: '同类巩固', reason: '同样搜索二维有序矩阵，但 74 还要求整体展平后完全有序，可把矩阵当长度 mn 的一维数组二分。' },
      { id: 792, title: '二分查找', slug: 'binary-search', role: '前置练习', reason: '练习每次比较排除一半搜索空间；本题利用行列结构，每次排除一整行或一整列。' },
      { id: 378, title: '有序矩阵中第 K 小的元素', slug: 'kth-smallest-element-in-a-sorted-matrix', role: '进阶挑战', reason: '同样利用行列递增，在二分值后用类似 staircase 计数判断有多少元素不超过 mid。' },
    ],
    viz: {
      family: 'array',
      data: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], target: 6 },
      frames: [
        {
          title: '从右上角出发',
          detail: '起点 (0,4)=15，目标为 6。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: -1, answer: '未找到', note: 'i=0、j=4。', markers: ['(0,4)=15'] },
        },
        {
          title: '15 大于目标',
          detail: '当前列下方的数都大于等于 15，排除第 4 列。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: 0, answer: '未找到', note: '移动到 (0,3)=11。', markers: ['j=3'] },
        },
        {
          title: '11 仍大于目标',
          detail: '继续排除第 3 列，当前候选变为 7。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: 1, answer: '未找到', note: '移动到 (0,2)=7。', markers: ['j=2'] },
        },
        {
          title: '7 仍大于目标',
          detail: '排除第 2 列，当前候选变为 4。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: 2, answer: '未找到', note: '移动到 (0,1)=4。', markers: ['j=1'] },
        },
        {
          title: '4 小于目标',
          detail: '当前行左侧的数都不超过 4，排除第 0 行。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: 3, answer: '未找到', note: '下移到 (1,1)=5。', markers: ['i=1'] },
        },
        {
          title: '5 仍小于目标',
          detail: '排除第 1 行，下移到 (2,1)=6。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: 4, answer: '未找到', note: 'i=2、j=1。', markers: ['i=2'] },
        },
        {
          title: '命中目标',
          detail: 'matrix[2][1]=6，立即返回 True。',
          state: { values: [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], index: 5, answer: 'true', note: '搜索路径为 15→11→7→4→5→6。', markers: ['found (2,1)'] },
        },
      ],
    },
  },
};

const verifiedNote = '2026-11-25 通过 leetcode.cn GraphQL 核实 questionId、translatedTitle、titleSlug；未读取或复用社区题解。';
const metadataLicense = 'LeetCode 站点条款；仅引用题号、标题和原题链接，教学文字原创。';

export const SOURCES = [
  {
    url: 'https://leetcode.cn/graphql/',
    license: 'LeetCode 公开元数据接口',
    note: '批量核实本题组原题与相似题的中文标题、题号和 slug；没有复制第三方题解或代码。',
  },
  { url: 'https://leetcode.cn/problems/subarray-sum-equals-k/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/sliding-window-maximum/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/minimum-window-substring/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/maximum-subarray/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/merge-intervals/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/rotate-array/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/product-of-array-except-self/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/first-missing-positive/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/set-matrix-zeroes/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/spiral-matrix/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/rotate-image/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/search-a-2d-matrix-ii/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/continuous-subarray-sum/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/subarray-sums-divisible-by-k/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/path-sum-iii/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/daily-temperatures/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/min-stack/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/longest-substring-without-repeating-characters/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/find-all-anagrams-in-a-string/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/minimum-window-subsequence/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/maximum-product-subarray/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/maximum-sum-circular-subarray/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/insert-interval/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/non-overlapping-intervals/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/reverse-string/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/reverse-words-in-a-string/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/rotate-list/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/trapping-rain-water/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/range-sum-query-immutable/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/find-pivot-index/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/find-all-duplicates-in-an-array/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/find-the-duplicate-number/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/missing-number/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/valid-sudoku/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/game-of-life/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/spiral-matrix-ii/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/spiral-matrix-iii/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/transpose-matrix/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/search-a-2d-matrix/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/binary-search/', license: metadataLicense, note: verifiedNote },
  { url: 'https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/', license: metadataLicense, note: verifiedNote },
];
