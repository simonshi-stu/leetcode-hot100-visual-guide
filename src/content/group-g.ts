import type { Guide } from '../types';

type GreedyValues = number[] | string[];
type ExtraDpData = { amount?: number; coins?: number[]; target?: number };

const greedyFrame = (
  title: string,
  note: string,
  values: GreedyValues,
  index: number,
  best: number,
  reach: number,
  answer: string,
) => ({
  title,
  detail: note,
  state: { values: [...values], index, best, reach, answer, note },
});

const dpFrame = (
  title: string,
  note: string,
  values: number[],
  index: number,
  table: number[][],
  active: number[],
  answer: string,
  dependency?: number[],
) => ({
  title,
  detail: note,
  state: {
    values: [...values],
    index,
    table: table.map((row) => [...row]),
    active: [...active],
    answer,
    note,
    ...(dependency ? { dependency: [...dependency] } : {}),
  },
});

const greedyViz = (values: GreedyValues, frames: ReturnType<typeof greedyFrame>[]) => ({
  family: 'greedy' as const,
  data: { values: [...values] },
  frames,
});

const dpViz = (
  values: number[],
  table: number[][],
  frames: ReturnType<typeof dpFrame>[],
  extra: ExtraDpData = {},
) => ({
  family: 'dp' as const,
  data: { values: [...values], table: table.map((row) => [...row]), ...extra },
  frames,
});

function stockFrames(nums: number[]) {
  const frames: ReturnType<typeof greedyFrame>[] = [];
  let minPrice = nums[0];
  let profit = 0;
  frames.push(greedyFrame('初始化', 'min_price 取首日价格，ans 为 0；此时尚未考虑任何卖出。', nums, -1, minPrice, profit, 'ans = 0'));
  for (let index = 0; index < nums.length; index += 1) {
    const price = nums[index];
    const previousMin = minPrice;
    profit = Math.max(profit, price - minPrice);
    minPrice = Math.min(minPrice, price);
    frames.push(greedyFrame(
      `处理价格 ${price}`,
      `先算 ${price} - ${previousMin} = ${price - previousMin} 的候选利润，再更新最低价为 ${minPrice}；best 表示历史最低价，reach 表示当前最大利润。`,
      nums,
      index,
      minPrice,
      profit,
      `ans = ${profit}`,
    ));
  }
  frames.push(greedyFrame('扫描结束', '所有“在后面卖、在前面买”的组合都已通过历史最低价纳入比较。', nums, nums.length, minPrice, profit, `最大利润 = ${profit}`));
  return frames;
}

function canJumpFrames(nums: number[]) {
  const frames: ReturnType<typeof greedyFrame>[] = [];
  let right = 0;
  frames.push(greedyFrame('初始化', 'right = 0，表示目前确定可达的最远下标。', nums, -1, 0, right, 'right = 0'));
  for (let index = 0; index < nums.length; index += 1) {
    if (index > right) {
      frames.push(greedyFrame('发现不可达位置', `下标 ${index} 已超过 right = ${right}，中间出现无法跨越的缺口。`, nums, index, 0, right, 'false'));
      return frames;
    }
    right = Math.max(right, index + nums[index]);
    frames.push(greedyFrame(
      `考察下标 ${index}`,
      `该位置可达，尝试跳到 ${index + nums[index]}，right 更新为 ${right}。`,
      nums,
      index,
      0,
      right,
      `right = ${right}`,
    ));
  }
  frames.push(greedyFrame('扫描结束', '每个下标都能由已可达区间衔接，最后一个下标也可达。', nums, nums.length, 0, right, 'true'));
  return frames;
}

function jumpFrames(nums: number[]) {
  const frames: ReturnType<typeof greedyFrame>[] = [];
  let answer = 0;
  let end = 0;
  let right = 0;
  frames.push(greedyFrame('初始化', 'ans 记录跳跃次数，end 是当前跳跃层的右边界，right 是下一层能到的最远位置。', nums, -1, answer, right, 'ans = 0'));
  for (let index = 0; index < nums.length - 1; index += 1) {
    right = Math.max(right, index + nums[index]);
    let note = `从下标 ${index} 更新最远可达位置为 ${right}。`;
    if (index === end) {
      answer += 1;
      end = right;
      note += ` 当前层扫描到边界，增加一次跳跃，end = ${end}。`;
    }
    frames.push(greedyFrame(
      `扫描下标 ${index}`,
      note,
      nums,
      index,
      answer,
      right,
      `ans = ${answer}, end = ${end}`,
    ));
  }
  frames.push(greedyFrame('到达终点前', '循环不处理最后一个下标；题目保证可达，因此无需在末尾额外加一跳。', nums, nums.length - 1, answer, right, `最少跳跃 = ${answer}`));
  return frames;
}

function partitionFrames(s: string) {
  const values = [...s];
  const last: Record<string, number> = {};
  values.forEach((char, index) => { last[char] = index; });
  const mapping = Object.entries(last).map(([char, index]) => `${char}→${index}`).join('，');
  const frames: ReturnType<typeof greedyFrame>[] = [];
  const lengths: number[] = [];
  let left = 0;
  let right = 0;
  frames.push(greedyFrame('建立最后出现位置', `last 映射：${mapping}。left 与 right 都从 0 开始。`, values, -1, 0, 0, '当前段 = [0,0]'));
  for (let index = 0; index < values.length; index += 1) {
    const char = values[index];
    right = Math.max(right, last[char]);
    let note = `字符 ${char} 最后出现在 ${last[char]}，当前段右边界 right = ${right}。`;
    let answer = `当前段 = [${left},${right}]；已完成 = [${lengths.join(',')}]`;
    if (index === right) {
      lengths.push(right - left + 1);
      answer = `切出 [${left},${right}]，长度 ${lengths[lengths.length - 1]}；已完成 = [${lengths.join(',')}]；下一段从 ${index + 1} 开始`;
      note += ' 扫描位置正好等于右边界，当前段可以安全切分。';
      left = index + 1;
    } else {
      note += ` 还不能切：扫描位置尚未达到 right，后面还有字符未检查。`;
    }
    frames.push(greedyFrame(`扫描字符 ${char}`, `${mapping}；${note}`, values, index, 0, right, answer));
  }
  frames.push(greedyFrame('分段完成', `last 映射保持为 ${mapping}；每个字符的所有出现都留在同一段。`, values, values.length, 0, right, `[${lengths.join(',')}]`));
  return frames;
}

function stairsFrames(n: number) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  let a = 1;
  let b = 1;
  const state = (index: number, title: string, note: string, answer: string) => dpFrame(title, note, [n], index, [[a, b]], [0, 1], answer);
  frames.push(state(-1, '初始化滚动状态', '表格只有一行两格：左格 a = 1，右格 b = 1，分别对应 0 级和 1 级的走法数。', 'a = 1, b = 1'));
  for (let index = 1; index < n; index += 1) {
    const oldA = a;
    a = b;
    b = a + oldA;
    frames.push(state(index, `计算 ${index + 1} 级`, `最后一步可以从 ${index} 级跨 1 级，或从 ${index - 1} 级跨 2 级；同时更新后 (a,b) = (${a},${b})。`, `f[${index + 1}] = ${b}`));
  }
  frames.push(state(n, '返回结果', `共执行 ${n - 1} 次滚动；n = 1 时一次也不执行。`, `${n} 级共有 ${b} 种走法`));
  return frames;
}

function pascalFrames(numRows: number) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const result: number[][] = [];
  let row = [1];
  const push = (title: string, note: string, index: number, active: number[], answer: string, dependency?: number[]) => dpFrame(title, note, [numRows], index, result, active, answer, dependency);
  frames.push(push('初始化', 'res 为空，工作行 row = [1]；values 中的 3 表示 numRows = 3。', -1, [], 'row = [1]'));
  for (let index = 0; index < numRows; index += 1) {
    result.push([...row]);
    frames.push(push(`保存第 ${index + 1} 行`, `row[:] 复制当前工作行，得到 [${result[index].join(',')}]；此后继续修改 row 不会改动已保存行。`, index, [index], `res 行数 = ${result.length}`));
    row.push(1);
    frames.push(push('为下一行补末尾 1', `先追加 1，工作行变为 [${row.join(',')}]。`, index, [], `row = [${row.join(',')}]`));
    for (let column = row.length - 2; column > 0; column -= 1) {
      const leftValue = row[column - 1];
      const oldValue = row[column];
      row[column] += row[column - 1];
      frames.push(push('从右向左累加', `更新工作行第 ${column} 格：${oldValue} + ${leftValue} = ${row[column]}，得到 [${row.join(',')}]。`, index, [], `row = [${row.join(',')}]`, [column - 1, column]));
    }
  }
  frames.push(push('生成结束', `返回的只是已复制的 ${result.length} 行；最后准备的 [${row.join(',')}] 不会被返回。`, numRows, [], JSON.stringify(result)));
  return frames;
}

function robberFrames(nums: number[]) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  let a = 0;
  let b = 0;
  const push = (index: number, title: string, note: string, answer: string) => dpFrame(title, note, nums, index, [[a, b]], [0, 1], answer, [0, 1]);
  frames.push(push(-1, '初始化', '表格一行两格记录滚动状态：a 是前两件的最优值，b 是前一件的最优值，初始都为 0。', 'a = 0, b = 0'));
  nums.forEach((value, index) => {
    const oldA = a;
    const oldB = b;
    a = b;
    b = Math.max(b, oldA + value);
    frames.push(push(index, `考虑房屋 ${value}`, `不偷得到 ${oldB}；偷这间得到 ${oldA} + ${value} = ${oldA + value}。同时滚动为 (${a},${b})。`, `前 ${index + 1} 件最优 = ${b}`));
  });
  frames.push(push(nums.length, '返回最优值', 'b 已包含全部房屋的选择结果；a 只保留再前一件的状态。', `最大金额 = ${b}`));
  return frames;
}

function squareFrames(n: number) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const dp = Array<number>(n + 1).fill(n + 1);
  dp[0] = 0;
  const push = (index: number, title: string, note: string, active: number[], answer: string, dependency?: number[]) => dpFrame(title, note, [n], index, [dp], active, answer, dependency);
  frames.push(push(-1, '初始化', `dp[0] = 0，其余位置用 n + 1 = ${n + 1} 表示“尚未找到”。表格是一行，列下标就是金额 0..${n}。`, [0], `dp = [${dp.join(',')}]`));
  for (let amount = 1; amount <= n; amount += 1) {
    const dependencies: number[] = [];
    let square = 1;
    while (square * square <= amount) {
      dependencies.push(amount - square * square);
      dp[amount] = Math.min(dp[amount], dp[amount - square * square] + 1);
      square += 1;
    }
    frames.push(push(amount, `计算 dp[${amount}]`, `依次尝试最后一个平方数 1,4,9...；依赖金额为 [${dependencies.join(',')}]，得到最少 ${dp[amount]} 个平方数。`, [amount], `dp[${amount}] = ${dp[amount]}`, dependencies));
  }
  frames.push(push(n, '返回答案', '所有小于等于 n 的金额都已按升序计算，dp[n] 已是最小平方数数量。', [n], `dp[${n}] = ${dp[n]}`));
  return frames;
}

function coinFrames(coins: number[], amount: number) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const dp = Array<number>(amount + 1).fill(amount + 1);
  dp[0] = 0;
  const push = (index: number, title: string, note: string, active: number[], answer: string, dependency?: number[]) => dpFrame(title, note, coins, index, [dp], active, answer, dependency);
  frames.push(push(-1, '初始化金额表', `表格只有一行，列从左到右表示金额 0..${amount}，不是硬币种数。dp[0] = 0，其余为哨兵 ${amount + 1}。`, [0], `dp = [${dp.join(',')}]`));
  for (let value = 1; value <= amount; value += 1) {
    const dependencies: number[] = [];
    for (const coin of coins) {
      if (coin <= value) {
        dependencies.push(value - coin);
        dp[value] = Math.min(dp[value], dp[value - coin] + 1);
      }
    }
    frames.push(push(value, `计算金额 ${value}`, `可用硬币 [${coins.filter((coin) => coin <= value).join(',')}]，读取前一金额列 [${dependencies.join(',')}]，得到 ${dp[value] === amount + 1 ? '不可达' : dp[value] + ' 枚'}。`, [value], `dp[${value}] = ${dp[value]}`, dependencies));
  }
  const answer = dp[amount] <= amount ? dp[amount] : -1;
  frames.push(push(amount, '判定并返回', `dp[${amount}] = ${dp[amount]}；只有不超过 amount 才是真实可达答案，否则返回 -1。`, [amount], `最少硬币数 = ${answer}`));
  return frames;
}

function wordBreakFrames(s: string, dictionary: string[]) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const values = [...s].map((char) => char.charCodeAt(0));
  const dp = Array<number>(s.length + 1).fill(0);
  dp[0] = 1;
  const push = (index: number, title: string, note: string, active: number[], answer: string, dependency?: number[]) => dpFrame(title, note, values, index, [dp], active, answer, dependency);
  frames.push(push(-1, '初始化前缀表', `values 是 "${s}" 的字符编码。dp[0] = 1 表示空前缀可拼接；字典为 [${dictionary.join(',')}]，其余状态为 0。`, [0], `dp = [${dp.join(',')}]`));
  for (let end = 1; end <= s.length; end += 1) {
    const dependencies: number[] = [];
    for (const word of dictionary) {
      const length = word.length;
      if (length <= end && dp[end - length] === 1 && s.slice(end - length, end) === word) {
        dp[end] = 1;
        dependencies.push(end - length);
      }
    }
    const prefix = s.slice(0, end);
    frames.push(push(end, `检查前缀 "${prefix}"`, dependencies.length ? `单词 "${s.slice(end - dependencies[dependencies.length - 1], end)}" 接在可达前缀后，dp[${end}] 置 1。` : `没有字典单词能接在任一可达前缀之后，dp[${end}] 保持 0。`, dependencies.length ? [end, ...dependencies] : [end], `dp[${end}] = ${dp[end]}`, dependencies));
  }
  frames.push(push(s.length, '返回前缀判定', `dp[${s.length}] = ${dp[s.length]}，1 表示整个字符串可以拆分。`, [s.length], dp[s.length] ? 'true' : 'false'));
  return frames;
}

function lisFrames(nums: number[]) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const dp = Array<number>(nums.length).fill(1);
  const push = (index: number, title: string, note: string, active: number[], answer: string, dependency?: number[]) => dpFrame(title, note, nums, index, [dp], active, answer, dependency);
  frames.push(push(-1, '初始化一维 dp', '每个位置至少能独自构成长度 1 的递增子序列，所以初始 dp 全为 1。表格一行，列对应 nums 下标。', [], `dp = [${dp.join(',')}]`));
  for (let index = 0; index < nums.length; index += 1) {
    const dependencies: number[] = [];
    for (let previous = 0; previous < index; previous += 1) {
      if (nums[previous] < nums[index]) {
        dependencies.push(previous);
        dp[index] = Math.max(dp[index], dp[previous] + 1);
      }
    }
    frames.push(push(index, `计算以 nums[${index}] = ${nums[index]} 结尾`, dependencies.length ? `严格更小的前驱下标为 [${dependencies.join(',')}]，最长可接成 ${dp[index]}。` : '没有严格更小的前驱，长度保持 1；相等元素不能接。', [index], `dp[${index}] = ${dp[index]}`, dependencies));
  }
  const answer = Math.max(...dp);
  frames.push(push(nums.length - 1, '取全局最大值', '最长递增子序列不一定在最后一个位置结尾，因此返回 max(dp)，不是 dp[n-1]。', [dp.indexOf(answer)], `LIS 长度 = ${answer}`, [dp.indexOf(answer)]));
  return frames;
}

function productFrames(nums: number[]) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const maximums = [nums[0]];
  const minimums = [nums[0]];
  let maximum = nums[0];
  let minimum = nums[0];
  let answer = nums[0];
  const push = (index: number, title: string, note: string, active: number[], answerText: string, dependency?: number[]) => dpFrame(title, note, nums, index, [maximums, minimums], active, answerText, dependency);
  frames.push(push(0, '初始化最大与最小乘积', `首项 ${nums[0]} 同时作为 mx、mn、ans。表格第一行记录各前缀的最大乘积，第二行记录最小乘积。`, [0], `mx = ${maximum}, mn = ${minimum}, ans = ${answer}`));
  for (let index = 1; index < nums.length; index += 1) {
    const value = nums[index];
    const fromMaximum = maximum * value;
    const fromMinimum = minimum * value;
    const nextMaximum = Math.max(fromMaximum, fromMinimum, value);
    const nextMinimum = Math.min(fromMaximum, fromMinimum, value);
    maximum = nextMaximum;
    minimum = nextMinimum;
    answer = Math.max(answer, maximum);
    maximums.push(maximum);
    minimums.push(minimum);
    frames.push(push(index, `乘以 ${value}`, `旧 mx/mn 先分别乘 ${value}，得到 ${fromMaximum}/${fromMinimum}；再与单独从 ${value} 开始比较。负号可能交换大小顺序，因此两个状态都要保留。`, [index], `mx = ${maximum}, mn = ${minimum}, ans = ${answer}`, [index - 1]));
  }
  frames.push(push(nums.length - 1, '返回历史最大值', 'ans 在每个前缀后取最大，覆盖“子数组中途结束”的情况；mn 只用于后续转移。', [maximums.indexOf(answer)], `最大乘积 = ${answer}`, [maximums.indexOf(answer)]));
  return frames;
}

function subsetFrames(nums: number[]) {
  const frames: ReturnType<typeof dpFrame>[] = [];
  const total = nums.reduce((sum, value) => sum + value, 0);
  if (total % 2 !== 0) {
    const table = [Array<number>(1).fill(1)];
    frames.push(dpFrame('总和为奇数', '无法均分，直接返回 false；此分支不进入子集和循环。', nums, -1, table, [0], 'false'));
    return frames;
  }
  const target = total / 2;
  const dp = Array<number>(target + 1).fill(0);
  dp[0] = 1;
  const push = (index: number, title: string, note: string, active: number[], answer: string, dependency?: number[]) => dpFrame(title, note, nums, index, [dp], active, answer, dependency);
  frames.push(push(-1, '初始化子集和表', `总和 ${total}，target = ${target}。表格一行的列表示和 0..${target}；布尔值用 1/0 表示，dp[0] = 1。`, [0], `dp = [${dp.join(',')}]`));
  nums.forEach((value, index) => {
    for (let sum = target; sum >= value; sum -= 1) {
      const before = dp[sum];
      const dependencyValue = dp[sum - value];
      dp[sum] = before === 1 || dependencyValue === 1 ? 1 : 0;
      frames.push(push(index, `物品 ${value}：更新和 ${sum}`, `倒序读取 dp[${sum}] = ${before} 与 dp[${sum - value}] = ${dependencyValue}，做逻辑或后写回 ${dp[sum]}。倒序保证当前物品不会在本轮被重复使用。`, [sum], `dp[${sum}] = ${dp[sum]}`, [sum, sum - value]));
    }
  });
  frames.push(push(nums.length, '检查目标和', 'dp[' + target + '] = ' + dp[target] + '；为 1 说明存在和为总数一半的子集。', [target], dp[target] ? 'true' : 'false'));
  return frames;
}

const checked = (id: number, title: string, slug: string) => ({
  url: `https://leetcode.cn/problems/${slug}/`,
  license: 'metadata-only',
  note: `2026-11-25 leetcode.cn 页面元数据核验：${id}，${title}，${slug}；仅记录题目元数据与导航，未复制第三方题解。`,
});

export const SOURCES = [
  checked(121, '买卖股票的最佳时机', 'best-time-to-buy-and-sell-stock'),
  checked(122, '买卖股票的最佳时机 II', 'best-time-to-buy-and-sell-stock-ii'),
  checked(714, '买卖股票的最佳时机含手续费', 'best-time-to-buy-and-sell-stock-with-transaction-fee'),
  checked(55, '跳跃游戏', 'jump-game'),
  checked(45, '跳跃游戏 II', 'jump-game-ii'),
  checked(1306, '跳跃游戏 III', 'jump-game-iii'),
  checked(1024, '视频拼接', 'video-stitching'),
  checked(763, '划分字母区间', 'partition-labels'),
  checked(56, '合并区间', 'merge-intervals'),
  checked(1520, '最多的不重叠子字符串', 'maximum-number-of-non-overlapping-substrings'),
  checked(70, '爬楼梯', 'climbing-stairs'),
  checked(746, '使用最小花费爬楼梯', 'min-cost-climbing-stairs'),
  checked(509, '斐波那契数', 'fibonacci-number'),
  checked(118, '杨辉三角', 'pascals-triangle'),
  checked(119, '杨辉三角 II', 'pascals-triangle-ii'),
  checked(120, '三角形最小路径和', 'triangle'),
  checked(198, '打家劫舍', 'house-robber'),
  checked(213, '打家劫舍 II', 'house-robber-ii'),
  checked(337, '打家劫舍 III', 'house-robber-iii'),
  checked(279, '完全平方数', 'perfect-squares'),
  checked(322, '零钱兑换', 'coin-change'),
  checked(518, '零钱兑换 II', 'coin-change-ii'),
  checked(139, '单词拆分', 'word-break'),
  checked(140, '单词拆分 II', 'word-break-ii'),
  checked(300, '最长递增子序列', 'longest-increasing-subsequence'),
  checked(674, '最长连续递增序列', 'longest-continuous-increasing-subsequence'),
  checked(1143, '最长公共子序列', 'longest-common-subsequence'),
  checked(152, '乘积最大子数组', 'maximum-product-subarray'),
  checked(1567, '乘积为正数的最长子数组长度', 'maximum-length-of-subarray-with-positive-product'),
  checked(713, '乘积小于 K 的子数组', 'subarray-product-less-than-k'),
  checked(416, '分割等和子集', 'partition-equal-subset-sum'),
  checked(474, '一和零', 'ones-and-zeroes'),
];

export const guides: Record<string, Guide> = {
  '121': {
    id: 121,
    title: '买卖股票的最佳时机',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: '简单',
    category: '贪心算法',
    summary: '只交易一次时，最大利润等于“某个售价减去它之前出现过的最低价”的最大值。原提交用一次遍历同时维护历史最低价和当前最大利润。',
    input: '非空整数数组 prices，prices[i] 表示第 i 天的股票价格。',
    output: '一次买入、一次卖出的最大利润；不能获利时返回 0。',
    core: 'min_price 保存已扫描前缀中的最低价格。处理价格 x 时，x - min_price 是以 x 为卖价、以历史最低价为买价的最佳候选；ans 保存所有候选的最大值。',
    walkthrough: '以 [7,1,5,3,6,4] 为例：最低价先变为 1；售价 5 给出利润 4；随后最低价仍是 1，售价 6 给出利润 5。答案不是 6-1 之前的某次局部比较，而是所有后缀售价中的最大值 5。',
    pitfalls: '不要把“全局最低价”和“全局最高价”直接相减；最高价可能出现在最低价之前。原代码先更新 ans 再更新 min_price，虽然同一天买卖差为 0，仍应保持这一顺序。输入不能按空数组处理，因为第 4 行直接读取 prices[0]。',
    observation: '固定卖出日后，最优买价一定是该日之前的最低价。因此无需记录所有买卖对，只保留一个最低价即可。',
    mechanism: '循环变量 x 依次扫描价格；ans = max(ans, x - min_price) 枚举有效卖价，min_price = min(min_price, x) 为后续日子更新买价候选。',
    invariant: '每次循环开始时，min_price 是已扫描价格的最小值，ans 是已扫描区间内只交易一次能获得的最大利润。',
    termination: 'for 循环遍历完整 prices 后结束，返回 ans；没有递归或待处理状态。',
    counterexample: '[7,5,3,1] 中最高价 7 在最低价 1 之前，直接相减会得到 -6；按题目规则应不交易，返回 0。',
    naive: '枚举每个买入日及其后的卖出日，时间 O(n²)。原提交的前缀最小值把每个卖价只比较一次。',
    time: 'O(n)',
    timeNote: 'n 个价格各进入一次常数次比较。数学假设整数运算为常数成本。',
    space: 'O(1)',
    spaceNote: '只使用 min_price、ans 和循环变量；输入数组与返回值不计入辅助空间。',
    keyLines: [
      { start: 3, end: 4, text: '        min_price = prices[0]\n        ans = 0' },
      { start: 5, end: 5, text: '        for x in prices:' },
      { start: 6, end: 6, text: '            ans = max(ans, x - min_price)' },
      { start: 7, end: 7, text: '            min_price = min(min_price, x)' },
      { start: 8, end: 8, text: '        return ans' },
    ],
    challenge: { question: '对 [3,2,6,5,0,3]，最大利润是多少？', hint: '最低价 2 对应后面的 6；更低的 0 只能对应它后面的 3。', answer: '4，即 2 买入、6 卖出。' },
    similar: [
      { id: 122, title: '买卖股票的最佳时机 II', slug: 'best-time-to-buy-and-sell-stock-ii', role: '同类巩固', reason: '仍可维护历史状态，但允许多次交易，需要把“只能一次”的利润模型改为累计每次上涨的收益。' },
      { id: 714, title: '买卖股票的最佳时机含手续费', slug: 'best-time-to-buy-and-sell-stock-with-transaction-fee', role: '进阶挑战', reason: '在多次交易状态中加入手续费，比较卖出收益是否值得支付费用。' },
    ],
    viz: greedyViz([7, 1, 5, 3, 6, 4], stockFrames([7, 1, 5, 3, 6, 4])),
  },

  '55': {
    id: 55,
    title: '跳跃游戏',
    slug: 'jump-game',
    difficulty: '中等',
    category: '贪心算法',
    summary: '把已经确定可达的位置看成一个连续前缀，只维护这个前缀的最右端 right。扫描时一旦遇到 right 之外的下标，就说明存在不可跨越的缺口。',
    input: '非空非负整数数组 nums，nums[i] 是从下标 i 向后跳的最大长度。',
    output: '布尔值：是否能够到达最后一个下标。',
    core: '若当前下标 i <= right，则 i 可达；从 i 能到达 i + nums[i]。用 right = max(right, i + nums[i]) 维护所有可达位置的最远边界。',
    walkthrough: '以 [1,1,1,1,2,3] 为例：right 依次扩展到 1、2、3、4；下标 4 可达且能跳到 6，于是最后的下标 5 也在可达区间内。',
    pitfalls: '原文件第 3～10 行是一段被注释的“到达终点就提前返回”的旧写法，真正执行的是第 11～16 行，不会提前返回。判断不可达的条件是 i > right，不是 nums[i] == 0；某些 0 位置只是终点前的最后一跳。right 可以超过数组末尾，代码允许如此。',
    observation: '从位置 i 可以跳到 i..i+nums[i] 中任意点，因此可达位置并集仍然是区间。只要没有缺口，逐个扫描就能不断扩展右边界。',
    mechanism: '外层 for 按数组顺序检查每个位置；遇到不可达位置立即返回 False，否则把当前跳跃范围并入 right。',
    invariant: '处理下标 i 之前，right 是已检查可达位置能覆盖到的最远下标；0..right 都在当前可达区间内。',
    termination: '要么在某个 i > right 时提前返回 False，要么完整扫描后返回 True；循环上界由 nums 长度决定。',
    counterexample: '[0,1] 在下标 0 就把 right 限制为 0，随后 i = 1 > right，返回 False；[1,0] 则能从 0 跳到 1，即使最后一格是 0 也返回 True。',
    naive: '递归枚举每次跳跃落点可能重复访问大量状态；即使记忆化，也通常需要保存每个位置的转移。原提交用可达区间把状态压缩为一个整数。',
    time: 'O(n)',
    timeNote: '每个下标最多扫描一次；right 的比较和更新均为常数时间。',
    space: 'O(1)',
    spaceNote: '只保存 right 与循环下标，不建立跳转图或可达集合。',
    keyLines: [
      { start: 11, end: 11, text: '        right = 0' },
      { start: 12, end: 12, text: '        for i in range(len(nums)):' },
      { start: 13, end: 14, text: '            if i > right:  # 遇到 0 卡住，且还没到终点\n                return False' },
      { start: 15, end: 15, text: '            right = max(right, i + nums[i]) # 疯狂试探最远能到哪' },
      { start: 16, end: 16, text: '        return True' },
    ],
    challenge: { question: '[2,0,0,1] 能到达末尾吗？为什么不能只看最后一格是否为 0？', hint: '先算 right 能覆盖到哪里，再判断下标 3 是否在其中。', answer: '不能。right 最多为 2，下标 3 不可达；0 是否致命取决于它之前是否已经跨过它。' },
    similar: [
      { id: 45, title: '跳跃游戏 II', slug: 'jump-game-ii', role: '进阶挑战', reason: '把本题的可达区间进一步按跳跃层划分，求最少跳跃次数。' },
      { id: 1306, title: '跳跃游戏 III', slug: 'jump-game-iii', role: '同类巩固', reason: '保留按最大跳长扩展位置的思想，但允许左右移动并把目标改为到达某个值。' },
    ],
    viz: greedyViz([1, 1, 1, 1, 2, 3], canJumpFrames([1, 1, 1, 1, 2, 3])),
  },

  '45': {
    id: 45,
    title: '跳跃游戏 II',
    slug: 'jump-game-ii',
    difficulty: '中等',
    category: '贪心算法',
    summary: '原提交把数组按“再跳一次能覆盖到哪里”分层。每扫完当前层，就增加一次跳跃，并把层边界推进到下一层的最远可达位置。',
    input: '非空非负整数数组 nums；题目保证能够到达最后一个下标。',
    output: '到达最后一个下标所需的最少跳跃次数。',
    core: 'end 表示当前跳跃次数能覆盖的层右边界；right 表示正在扫描的位置再跳一步能达到的最远下标。当 i == end 时，当前层结束，ans 加一，end 更新为 right。',
    walkthrough: '对 [2,3,0,1,4,1,0]，第 0 层只含下标 0，扫描后 right = 2，ans = 1；继续扫描下标 1、2，right 最大为 max(4,2)=4；i == end = 2 时 ans = 2，新边界为 4。扫描下标 3 后 right 仍为 4，扫描下标 4 时扩展到 8 并增加第 3 跳。最后一格无需再处理。',
    pitfalls: '循环范围是 len(nums) - 1，故意跳过最后一个下标。题目保证可达，若把不可达输入也套入此代码，ans 可能不是有意义的最短跳数。right 记录的是“下一层最远点”，不是已经跳到的位置；更新 right 与 ans 的时机不同。',
    observation: '若所有不超过 k 次跳跃能到达的位置构成 [0,R]，那么第 k+1 次跳跃能到达的最远点，只取决于 [0,R] 中哪个位置的 i + nums[i] 最大。分层扫描正好求这个最大值。',
    mechanism: '每次循环先扩展 right；只有走到当前层边界 end 才消费这一层并增加跳数。这样每一层只增加一次，不会因层内每个位置都多算一跳。',
    invariant: '进入一次迭代时，ans 是到达 end 的最少跳数，right 是从已扫描的当前层位置再跳一步能达到的最远下标。',
    termination: '下标扫描到 n-2 时停止；由于保证可达，最后一格已落在某层覆盖范围内，ans 就是最少跳数。',
    counterexample: '[1,1,1,1] 需要 3 次，而不是 4 次；如果对每个位置都增加跳数会重复计数。长度 1 的数组循环为空，正确返回 0。',
    naive: '令 dp[i] 表示到达 i 的最少跳数，枚举 i 之前所有能跳到 i 的位置，时间 O(n²)。原提交用分层区间把复杂度降到线性。',
    time: 'O(n)',
    timeNote: '除最后一格外每个下标扫描一次。O(n log n) 的二分或更复杂数据结构并非当前代码所需。',
    space: 'O(1)',
    spaceNote: 'ans、end、right 都是常数个标量。',
    keyLines: [
      { start: 3, end: 5, text: '        ans = 0\n        end = 0\n        right = 0' },
      { start: 6, end: 6, text: '        for i in range(len(nums) - 1):' },
      { start: 7, end: 7, text: '            right = max(right, nums[i] + i)' },
      { start: 8, end: 10, text: '            if i == end:\n                ans += 1\n                end = right' },
      { start: 11, end: 11, text: '        return ans' },
    ],
    challenge: { question: '[1,2,3] 为什么要跳两次，而不是看到 nums[0] + 0 = 1 就认为已经覆盖终点？', hint: '第一跳只能到 1；从 1 才能到 3。', answer: '最少 2 次：0→1→2（0 索引终点）。' },
    similar: [
      { id: 55, title: '跳跃游戏', slug: 'jump-game', role: '前置练习', reason: '先掌握 right 可达区间，再理解本题如何把区间分成跳跃层。' },
      { id: 1024, title: '视频拼接', slug: 'video-stitching', role: '进阶挑战', reason: '把跳跃位置推广为时间区间，仍按当前覆盖边界逐层扩展，但增加了区间筛选。' },
    ],
    viz: greedyViz([2, 3, 0, 1, 4, 1, 0], jumpFrames([2, 3, 0, 1, 4, 1, 0])),
  },

  '763': {
    id: 763,
    title: '划分字母区间',
    slug: 'partition-labels',
    difficulty: '中等',
    category: '贪心算法',
    summary: '一个字符在本段出现后，它的最后一次出现也必须落在本段。原提交先记录 last 映射，再向右扩展当前段边界，直到扫描位置追上边界才切分。',
    input: '由小写英文字母组成的非空字符串 s。',
    output: '整数数组，按顺序给出每个不可再合并的字母分段的长度。',
    core: 'last[c] 是字符 c 的最后下标。当前段为 [left,right]；扫描到 i 时执行 right = max(right, last[s[i]])。若 i == right，说明本段内所有字符的最后出现都已检查，可以输出长度。',
    walkthrough: '对 "ababcbac"，last 为 a→6、b→5、c→7。扫描到下标 4 的 c 时 right 扩展到 7；到 i = 6 仍不能切，直到 i = 7 才切出长度 8，因此返回 [8]。',
    pitfalls: '不要按“相邻字符是否相同”分段，也不要只统计频次；关键是最后出现位置。right 是当前段必须覆盖到的最远点，left 只在切分后移动。最后一帧的 index = n 只是扫描结束标记，段长答案仍由过程中完成的切分组成。',
    observation: '若段内某字符还有更晚的出现，当前段就必须延伸，否则同一字符会被拆到两段。反过来，当 i 达到所有段内字符最后位置的最大值时，任何更晚切分都不是必需的。',
    mechanism: '第一遍字典推导式建立 last；第二遍从左到右维护当前段。每遇到段边界，立即记录 right-left+1，并把 left 设为 i+1。',
    invariant: '扫描到 i 时，left..i 属于当前未完成段，right 是这些字符最后出现位置的最大值；right 之前不存在可以提前切开的安全位置。',
    termination: '完整扫描字符串后结束。由于 right 最大不超过 n-1，扫描到最后一个字符时一定会完成最后一段。',
    counterexample: '"abc" 的三个字符互不相邻重复，答案是 [1,1,1]；"aba" 的 a 跨首尾，答案只能是 [3]，不能拆成 [1,2]。',
    naive: '枚举所有切分点再逐段检查字符是否跨界，需要检查 O(2^(n-1)) 个切分组合。last 映射把每段合法性转化为一次右边界扩展。',
    time: 'O(n)',
    timeNote: '建立映射与扫描各 O(n)；字符集只有小写字母时，字典操作按常数规模处理。',
    space: 'O(k)',
    spaceNote: 'k 是不同字符数，k ≤ 26；不计返回答案。若严格计算输入字符串与输出，总空间还包括 O(n)。',
    keyLines: [
      { start: 4, end: 4, text: '        last = {c: i for i, c in enumerate(s)} ' },
      { start: 5, end: 6, text: '        ans = []\n        right = left = 0' },
      { start: 7, end: 7, text: '        for i, c in enumerate(s):' },
      { start: 8, end: 8, text: '            right = max(right, last[c])' },
      { start: 9, end: 11, text: '            if i == right:\n                ans.append(right - left + 1)\n                left = i + 1' },
      { start: 12, end: 12, text: '        return ans' },
    ],
    challenge: { question: '"eccbb" 为什么必须作为一个长度为 5 的段？', hint: '检查 e、c、b 的最后位置。', answer: 'e 最后在 0，c 最后在 2，b 最后在 4；任何提前切分都会把重复字符拆开。' },
    similar: [
      { id: 56, title: '合并区间', slug: 'merge-intervals', role: '同类巩固', reason: '都通过扩展右边界判断当前区间是否还能继续合并，只是一个处理字符约束，一个处理数值区间。' },
      { id: 1520, title: '最多的不重叠子字符串', slug: 'maximum-number-of-non-overlapping-substrings', role: '进阶挑战', reason: '同样关心字符最后出现位置，但优化目标变为挑选最多的不重叠子字符串。' },
    ],
    viz: greedyViz([...'ababcbac'], partitionFrames('ababcbac')),
  },

  '70': {
    id: 70,
    title: '爬楼梯',
    slug: 'climbing-stairs',
    difficulty: '简单',
    category: '动态规划',
    summary: '到第 n 级的最后一步只有两种：从 n-1 级跨 1 级，或从 n-2 级跨 2 级。原提交用两个变量滚动保存这两个子问题的答案。',
    input: '整数 n，表示要爬上的楼梯级数。',
    output: '每次可以爬 1 级或 2 级时，到达 n 级的不同走法数。',
    core: 'f(n) = f(n-1) + f(n-2)，f(0) = f(1) = 1。代码把 a、b 初始化为 1、1，每次同时更新为 (b, a+b)，最后返回 b。',
    walkthrough: 'n = 7 时，(a,b) 从 (1,1) 依次变为 (1,2)、(2,3)、(3,5)、(5,8)、(8,13)、(13,21)，共 6 次，因此答案是 b = 13。',
    pitfalls: '循环次数是 n-1，不是 n；n = 1 时不进入循环，(1,1) 的初值已经正确。a,b = b,a+b 是同时赋值，右侧使用的是旧的 a、b，不能拆成会互相覆盖的两条普通赋值。',
    observation: '走法按最后一步分类，两类互不重叠且覆盖全部可能，因此可以相加。每一级只依赖前两级，不需要保存整张表。',
    mechanism: 'a 保存前两状态，b 保存前一状态；一次循环把窗口向前滑动一格。可视化表格的一行两格就是这两个滚动变量，并非原始代码中的数组。',
    invariant: '第 k 次更新后，a = f(k)，b = f(k+1)；初始尚未更新时对应 f(0)、f(1)。',
    termination: 'range(n-1) 执行完固定次数后结束，返回 b。',
    counterexample: 'n = 1 的答案是 1；若误把循环写成 n 次会多算。n = 2 有两种走法：1+1 或 2。',
    naive: '直接递归计算 f(n-1)+f(n-2) 会重复求解同一子问题，最坏指数时间；开长度为 n 的 dp 数组则是 O(n) 空间。',
    time: 'O(n)',
    timeNote: '只滚动 n-1 次。若把大整数运算的真实位成本计入，还会随答案位数增加；常规算法分析按整数操作 O(1)。',
    space: 'O(1)',
    spaceNote: '仅两个状态变量。快速倍增法可在 O(log n) 次矩阵/数对运算求解，但原提交没有使用它。',
    keyLines: [
      { start: 3, end: 3, text: '        a, b = 1, 1' },
      { start: 4, end: 4, text: '        for _ in range(n - 1):' },
      { start: 5, end: 5, text: '            a,b = b, a+b' },
      { start: 6, end: 6, text: '        return b' },
    ],
    challenge: { question: '为什么初值用 (1,1)，而返回的是 b 而不是 a？', hint: '把 0 级也视为一种“不动”的走法，并写出 f(2)。', answer: 'a=f(0)=1、b=f(1)=1；滚动后 b=f(n)，所以返回 b。' },
    similar: [
      { id: 746, title: '使用最小花费爬楼梯', slug: 'min-cost-climbing-stairs', role: '同类巩固', reason: '同样是最后一步来自前一级或前两级，但优化目标从计数变成最小花费。' },
      { id: 509, title: '斐波那契数', slug: 'fibonacci-number', role: '前置练习', reason: '完全相同的二阶递推与滚动状态，可用来练习同时更新两个变量。' },
    ],
    viz: dpViz([7], [[1, 1]], stairsFrames(7), { amount: 7 }),
  },

  '118': {
    id: 118,
    title: '杨辉三角',
    slug: 'pascals-triangle',
    difficulty: '简单',
    category: '动态规划',
    summary: '原提交维护一条工作行，先复制进结果，再在右侧补 1，并从右向左把相邻旧格相加，从而原地生成下一行。',
    input: '非负整数 numRows，表示要生成的杨辉三角行数。',
    output: '二维数组，第 i 行是杨辉三角的第 i+1 行；numRows = 0 时返回空数组。',
    core: '已保存行为 [1]、[1,1]、[1,2,1]……。生成下一行时先 row.append(1)，再让 j 从 len(row)-2 递减到 1，执行 row[j] = row[j] + row[j-1]。',
    walkthrough: 'numRows = 3：先保存 [1]；工作行补成 [1,1] 后保存第二行；再补成 [1,1,1]，从右向左把下标 1 更新为 2，得到 [1,2,1] 并保存第三行。循环最后还会准备 [1,3,3,1]，但它不在返回结果中。',
    pitfalls: 'res.append(row[:]) 的切片复制不可省略，否则结果中的多行会指向同一列表而被后续修改。内层 j 必须从右向左；从左向右会提前覆盖下一步还要读取的旧值。numRows = 0 的提前返回也不能漏。',
    observation: '下一行第 j 个内部元素等于上一行第 j-1 与第 j 个元素之和。逆序更新保证 row[j-1] 仍是旧行值。',
    mechanism: '外层每次生成一行；先用 row[:] 浅拷贝当前工作行到 res，再原地构造下一行。浅拷贝会创建新列表但共享元素引用；本题元素都是不可变整数，因此足以保存旧行。可视化 table 的每一行就是 res 中已经保存的三角行，工作行的中间变化写在 note 中。',
    invariant: '每次保存后，res 的前 i+1 行已经是正确的杨辉三角；row 在准备下一行时，其右侧未更新部分仍保留旧行相应值。',
    termination: '外层执行 numRows 次后结束。最后一行保存后仍会多构造一条未返回的工作行，这是实际代码的行为。',
    counterexample: 'numRows = 0 返回 []；numRows = 1 返回 [[1]]。若漏掉切片，numRows = 3 时已保存行可能一起被改成最后的工作行。',
    naive: '为每一行新建列表并读取上一行两个元素，思路直接但需要同时保留上一行；原提交选择在一条工作行上逆序原地更新。',
    time: 'O(r²)',
    timeNote: 'r = numRows 时，第 i 行有 O(i) 次更新，总和为 O(r²)；复制保存行也计入。',
    space: 'O(r²)',
    spaceNote: '返回的三角表本身占 O(r²)。若只看构造过程的辅助空间，则工作行与切片为 O(r)；可视化中的 res 属于输出。',
    keyLines: [
      { start: 3, end: 6, text: '        if numRows == 0:\n            return []\n        res = []\n        row = [1]' },
      { start: 7, end: 7, text: '        for i in range(numRows):' },
      { start: 8, end: 8, text: '            res.append(row[:])' },
      { start: 9, end: 9, text: '            row.append(1)' },
      { start: 10, end: 11, text: '            for j in range(len(row) - 2, 0, -1):\n                row[j] = row[j] + row[j - 1]' },
      { start: 12, end: 12, text: '        return res' },
    ],
    challenge: { question: '若把内层更新改成从左向右，[1,1,1,1] 会变成什么，为什么错？', hint: '下标 1 先写成 2，随后下标 2 会读取这个新值。', answer: '会得到 [1,2,3,1]，因为第二步用刚更新的 2 加上旧值 1；正确逆序结果应是 [1,3,3,1]。' },
    similar: [
      { id: 119, title: '杨辉三角 II', slug: 'pascals-triangle-ii', role: '同类巩固', reason: '只返回指定一行，可继续使用逆序更新，并考虑如何进一步压缩空间。' },
      { id: 120, title: '三角形最小路径和', slug: 'triangle', role: '进阶挑战', reason: '同样按三角形行组织状态，但每格依赖上一行相邻两格，目标变成最小路径和。' },
    ],
    viz: dpViz([3], [], pascalFrames(3)),
  },

  '198': {
    id: 198,
    title: '打家劫舍',
    slug: 'house-robber',
    difficulty: '中等',
    category: '动态规划',
    summary: '每间房屋只有偷或不偷两种选择；若偷当前房屋，就不能偷上一间。原提交用 a、b 两个滚动变量保存前两间与前一间的最优金额。',
    input: '非空非负整数数组 nums，每个元素是一间房屋中的金额。',
    output: '在不偷相邻房屋的前提下能获得的最大金额。',
    core: '处理 x 时，新 b = max(旧 b, 旧 a + x)，随后 a 接管旧 b。等价于 f[i] = max(f[i-1], f[i-2] + nums[i])。',
    walkthrough: '对 [2,7,9,3,1,4]，滚动状态依次为 (0,0)→(0,2)→(2,7)→(7,11)→(11,11)→(11,12)→(12,15)。最后可选择下标 0、2、5，金额 2+9+4=15。',
    pitfalls: '必须同时更新 a、b；若先改 b 再算 a，会破坏“前两间”的含义。不能使用局部贪心，例如 [2,1,1,2] 若先偷 2 再偷 1 会错过首尾合计 4。',
    observation: '对当前房屋，不偷的最优值就是截至上一间的 b；偷的最优值是跳过上一间后的 a 加当前金额。二者取大即可。',
    mechanism: 'a,b = b,max(b,a+x) 每次把决策窗口向前滑动一间。表格只画一行两格，分别展示 a、b，不把二维方案表当成原代码。',
    invariant: '处理完前 i 间后，b 是这些房屋的最大可得金额，a 是前 i-1 间的最大可得金额。',
    termination: '遍历完全部房屋后返回 b；没有回溯或未决选择。',
    counterexample: '[2,1,1,2] 若采用“遇到大的就偷”的局部规则可能选 3，但最优是偷第一间和最后一间，共 4。',
    naive: '对每间房屋递归尝试偷或不偷会重复计算后缀，最坏指数时间；显式 dp 数组则需要 O(n) 状态空间。',
    time: 'O(n)',
    timeNote: '每间房屋只做一次加法和一次最大值比较。',
    space: 'O(1)',
    spaceNote: 'a、b 两个标量即可。原文件没有注释的其他实现需要区分。',
    keyLines: [
      { start: 3, end: 3, text: '        a, b = 0, 0' },
      { start: 4, end: 4, text: '        for x in nums:' },
      { start: 5, end: 5, text: '            a, b = b, max(b, a + x)' },
      { start: 6, end: 6, text: '        return b' },
    ],
    challenge: { question: '[2,4,5] 的最优金额为什么不是 9？', hint: '4 和 5 是相邻房屋，不能同时偷。', answer: '最大为 7，选择 2+5；9 违反相邻约束。' },
    similar: [
      { id: 213, title: '打家劫舍 II', slug: 'house-robber-ii', role: '同类巩固', reason: '房屋首尾相邻，需要把环形结构拆成两个线性打家劫舍问题。' },
      { id: 337, title: '打家劫舍 III', slug: 'house-robber-iii', role: '进阶挑战', reason: '把线性相邻约束搬到二叉树，需要为每个节点记录偷或不偷两种状态。' },
    ],
    viz: dpViz([2, 7, 9, 3, 1, 4], [[0, 0]], robberFrames([2, 7, 9, 3, 1, 4])),
  },

  '279': {
    id: 279,
    title: '完全平方数',
    slug: 'perfect-squares',
    difficulty: '中等',
    category: '动态规划',
    summary: '把“组成 n 所需的最少平方数”看成金额 n 的完全背包。原提交按金额升序填一维 dp，每次尝试减去一个平方数。',
    input: '正整数 n。',
    output: '和为 n 的完全平方数所需的最少个数。',
    core: 'dp[0] = 0；dp[i] = min(dp[i-j²]+1)，其中 j² ≤ i。dp 的列下标就是金额，未计算位置初始为 n+1。',
    walkthrough: '计算 12 时依次考虑最后一个平方数 1、4、9，读取 dp[11]、dp[8]、dp[3]，其中 dp[8] = 2（4+4），所以 dp[12] = min(dp[11]+1,dp[8]+1,dp[3]+1) = 3，对应 4+4+4。',
    pitfalls: 'dp[i-j*j] 是更小金额，必须按 i 升序计算。n+1 是“不可达/尚未找到”的哨兵，不是答案候选；j 从 1 开始，且循环条件必须包含 j² == i。原代码没有数论定理优化。',
    observation: '任意一种表示都能取出最后一个平方数 j²；去掉它后，剩余金额 i-j² 的最优表示加上当前平方数，就组成一个候选方案。枚举所有可能的最后一个平方数即可覆盖最优解。',
    mechanism: '外层 i 从 1 到 n；内层 j 从 1 增长到平方不超过 i。每次用更小金额的最优值更新当前金额。',
    invariant: '计算金额 i 前，dp[0..i-1] 都已是最少平方数；dp[i] 在内层中保存已枚举最后一个平方数的最佳候选。',
    termination: '外层到达 n 时结束，返回 dp[n]；内层 j 最终超过 sqrt(i)。',
    counterexample: 'n = 7 至少需要四个平方数：4+1+1+1，所以 dp[7] = 4；只记住“选过平方数 4”而不读取余数 3 的最优状态，会漏掉后续组合。',
    naive: '从 1 到 n 枚举平方数并递归搜索余数，可能重复探索大量表示；无记忆化的组合搜索成本很高。',
    time: 'O(n√n)',
    timeNote: '每个金额 i 尝试 O(√i) 个平方数，总和 O(n√n)。四平方定理等优化没有加入当前提交。',
    space: 'O(n)',
    spaceNote: '长度为 n+1 的 dp 数组；不含输入与返回值。',
    keyLines: [
      { start: 3, end: 3, text: '        dp = [n + 1] * (n + 1)' },
      { start: 4, end: 4, text: '        dp[0] = 0 ' },
      { start: 5, end: 6, text: '        for i in range(1, n + 1):\n            j = 1' },
      { start: 7, end: 7, text: '            while j * j <= i:' },
      { start: 8, end: 8, text: '                dp[i] = min(dp[i], dp[i - j*j] + 1)' },
      { start: 9, end: 9, text: '                j += 1' },
      { start: 10, end: 10, text: '        return dp[n]' },
    ],
    challenge: { question: 'dp[12] = 3 时，若最后一个平方数取 4，应该读取哪个余数状态？', hint: '最后一个平方数 4 会从 12 中扣除，余下 8。', answer: '读取 dp[8] = 2，再加一个 4，得到 12 = 4+4+4，共 3 个。' },
    similar: [
      { id: 322, title: '零钱兑换', slug: 'coin-change', role: '同类巩固', reason: '都是完全背包式的最少物品数；硬币集合替换为全部平方数。' },
      { id: 139, title: '单词拆分', slug: 'word-break', reason: '同样按长度或金额升序读取更小状态，但目标从最小数量变成布尔可达性。', role: '进阶挑战' },
    ],
    viz: dpViz([12], [[0, ...Array<number>(12).fill(13)]], squareFrames(12), { amount: 12 }),
  },

  '322': {
    id: 322,
    title: '零钱兑换',
    slug: 'coin-change',
    difficulty: '中等',
    category: '动态规划',
    summary: '原提交用一维数组按金额从小到大求最少硬币数。表格只有一行，列表示金额 0..amount，而不是硬币种类。',
    input: '正整数硬币数组 coins，以及非负整数 amount；每种硬币可使用任意次。',
    output: '组成 amount 所需的最少硬币数；无法组成时返回 -1。',
    core: 'dp[0] = 0，dp[i] = min(dp[i-c]+1)，对所有 c ≤ i 的硬币取最小。amount+1 作为不可达哨兵。',
    walkthrough: 'coins = [1,2,5]、amount = 11 时，dp[5] 由硬币 5 直接得到 1；dp[10] 可由 dp[5]+1 得到 2；dp[11] 取 5+5+1，得到 3。',
    pitfalls: '金额循环必须在外层，硬币循环在内层，才能保证 dp[i-c] 已计算。不是“每种硬币一行”的二维表。哨兵 amount+1 不可直接返回，要通过 dp[amount] ≤ amount 判定是否可达；amount = 0 时 dp[0] = 0。',
    observation: '拿走最后一枚硬币 c 后，剩余金额为 i-c。若剩余金额的最优表示已知，加上这枚硬币就得到一个候选。枚举最后一种硬币即可覆盖所有表示。',
    mechanism: '外层金额从 1 增长到 amount；内层遍历 coins，只使用不超过当前金额的硬币，并读取同一行中更小的金额列。',
    invariant: '计算金额 i 前，dp[0..i-1] 已是各自的最少硬币数；当前金额只读取更小列，因此不会出现循环依赖。',
    termination: '金额循环结束后检查目标列。有限硬币面额下若仍为哨兵，说明无法组合。',
    counterexample: 'coins = [2]、amount = 3 时 dp 保持不可达，应返回 -1；coins = [1,2]、amount = 2 应优先选一枚 2，而不是两枚 1。',
    naive: '枚举硬币使用数量或搜索所有组合会重复求解相同金额；按硬币逐层搜索还可能把“最少数量”误写成“是否可达”。',
    time: 'O(amount×m)',
    timeNote: 'm 是硬币种数；每个金额检查全部硬币。排序、集合优化或 BFS 都不是当前提交的一部分。',
    space: 'O(amount)',
    spaceNote: '长度为 amount+1 的一维表；coins 输入不计入辅助空间。',
    keyLines: [
      { start: 3, end: 3, text: '        dp = [amount + 1] * (amount + 1)' },
      { start: 4, end: 4, text: '        dp[0] = 0' },
      { start: 5, end: 6, text: '        for i in range(1, amount + 1):\n            for c in coins:' },
      { start: 7, end: 8, text: '                if c <= i:\n                    dp[i] = min(dp[i], dp[i - c] + 1)' },
      { start: 9, end: 9, text: '        return dp[amount] if dp[amount] <= amount else -1' },
    ],
    challenge: { question: 'coins = [2,5]、amount = 6 时，为什么不能返回 1？', hint: '只有面额 5 接近 6，但它不能与另一个 1 组合。', answer: '最少为 3 枚，2+2+2；dp[6] 从 dp[4]+1 得到 3。' },
    similar: [
      { id: 279, title: '完全平方数', slug: 'perfect-squares', role: '前置练习', reason: '把任意硬币集合换成平方数集合，练习完全背包式最少数量转移。' },
      { id: 518, title: '零钱兑换 II', slug: 'coin-change-ii', role: '同类巩固', reason: '同样遍历金额和硬币，但目标是统计组合数，且循环顺序用于避免重复计数。' },
    ],
    viz: dpViz([1, 2, 5], [[0, ...Array<number>(11).fill(12)]], coinFrames([1, 2, 5], 11), { amount: 11, coins: [1, 2, 5] }),
  },

  '139': {
    id: 139,
    title: '单词拆分',
    slug: 'word-break',
    difficulty: '中等',
    category: '动态规划',
    summary: 'dp[i] 表示前 i 个字符能否由字典单词拼接。原提交对每个前缀枚举单词，检查前驱状态和末尾子串是否同时成立。',
    input: '字符串 s 与单词列表 wordDict；单词可以重复使用，不要求全部使用。',
    output: '布尔值：s 是否能被拆成一个或多个字典单词的拼接。',
    core: 'dp[0] = True。对 i = 1..n，若存在单词 w 使 len(w) ≤ i、dp[i-len(w)] 为真且 s[i-len(w):i] == w，则 dp[i] = True。',
    walkthrough: 's = "leetcode"、字典 ["leet","code"]：i = 4 时，dp[0] 为真且前四字符等于 leet，所以 dp[4] = 1；i = 8 时，dp[4] 为真且后四字符等于 code，所以 dp[8] = 1。',
    pitfalls: 'dp 的下标是前缀长度，不是字符下标；dp[0] 必须为真。三个条件缺一不可：长度足够、前驱可达、末尾子串匹配。原代码找到匹配后不立即 break，仍继续遍历字典。可视化中的布尔值统一写成 0/1。',
    observation: '任何完整拆分都有一个最后一个单词。去掉它后，剩下的仍是较短前缀；因此枚举最后一个单词就能把问题分解为更小前缀。',
    mechanism: '外层逐个扩展前缀长度；内层遍历字典并构造末尾切片。Python 切片会生成新字符串，比较也有成本。',
    invariant: '处理完前缀 i 后，dp[0..i] 都准确表示对应前缀是否可拼接；未来状态只会读取比当前更短的列。',
    termination: '扫描到 n 后返回 dp[n]；没有递归，也没有保存具体拆分路径。',
    counterexample: 's = "catsandog"、字典 ["cats","dog","sand","and","cat"] 返回 False；虽然多个单词都能匹配局部，dp 的更长前缀最终仍不可达。',
    naive: '从每个位置递归尝试所有前缀单词，可能重复处理相同后缀；记忆化可以改善，但原提交选择前缀 DP。',
    time: 'O(nmL)',
    timeNote: 'n = len(s)，m 为单词数，L 为最长单词长度；内层包含至多 L 的切片与字符串比较。若按所有单词总长度 S 计，可写 O(nS)。字典 Trie 可减少无效枚举，但当前代码没有使用。',
    space: 'O(n)',
    spaceNote: 'dp 长度为 n+1。每次切片会临时分配 O(L) 字符串；若把输入字典本身计入则还要加其总字符数。',
    keyLines: [
      { start: 3, end: 5, text: '        n = len(s)\n        dp = [False] * (n + 1)\n        dp[0] = True' },
      { start: 6, end: 6, text: '        for i in range(1, n + 1):' },
      { start: 7, end: 7, text: '            for w in wordDict:' },
      { start: 8, end: 10, text: '                L = len(w)\n                if L <= i and dp[i - L] and s[i - L : i] == w:\n                    dp[i] = True' },
      { start: 11, end: 11, text: '        return dp[n]' },
    ],
    challenge: { question: '为什么只看“当前位置能否匹配某个单词”不够？', hint: '匹配的单词可能从不可达前缀开始。', answer: '例如 leetcode 中 code 能匹配，但若 leet 不可达，dp[4] 为假，dp[8] 也不能置真。' },
    similar: [
      { id: 140, title: '单词拆分 II', slug: 'word-break-ii', role: '进阶挑战', reason: '相同前缀状态，但还要记录并枚举所有可行拆分，需处理答案复制成本。' },
      { id: 322, title: '零钱兑换', slug: 'coin-change', role: '同类巩固', reason: '都把字符串长度或金额当作一维状态，并读取更短状态；一个是布尔匹配，一个取最小数量。' },
    ],
    viz: dpViz([...'leetcode'].map((char) => char.charCodeAt(0)), [[1, 0, 0, 0, 0, 0, 0, 0, 0]], wordBreakFrames('leetcode', ['leet', 'code'])),
  },

  '300': {
    id: 300,
    title: '最长递增子序列',
    slug: 'longest-increasing-subsequence',
    difficulty: '中等',
    category: '动态规划',
    summary: '已核验原提交是 O(n²) 的动态规划，不是 patience sorting。dp[i] 表示必须以 nums[i] 结尾的最长严格递增子序列长度。',
    input: '非空整数数组 nums，元素可重复、可正可负。',
    output: '数组中最长严格递增子序列的长度，不要求连续。',
    core: '初始 dp[i] = 1。对每个 i 枚举 j < i，若 nums[j] < nums[i]，则 dp[i] = max(dp[i], dp[j]+1)。最终答案是 max(dp)。',
    walkthrough: '对 [10,9,2,5,3,7,101,18]，dp 最终为 [1,1,1,2,2,3,4,4]。以 101 结尾时可接在长度 3 的序列后得到 4；以 18 结尾也能得到 4。',
    pitfalls: '比较必须是严格小于，不能写成 ≤，否则相等元素会被错误串起来。答案不是最后一个 dp 值，而是全表最大值。O(n log n) 的 patience sorting 只能作为补充说明，当前代码与可视化都按两层循环执行。',
    observation: '若一个递增子序列以 nums[i] 结尾，删去最后一项后，它必须以某个更早且更小的 nums[j] 结尾。枚举这些 j 就覆盖全部可能前驱。',
    mechanism: '外层固定结尾 i，内层从 0 扫到 i-1；每次严格递增时读取 dp[j] 并尝试加一。',
    invariant: '开始计算 dp[i] 时，dp[0..i-1] 已正确；dp[i] 在比较过程中始终是已检查前驱能构成的最长长度。',
    termination: '全部 i 处理完后结束，再对 dp 取最大值。',
    counterexample: '[3,3,3] 的答案是 1，不是 3；若用非严格比较会错误得到 3。',
    naive: '枚举所有子序列并逐一判断递增，最坏指数时间；只枚举子数组会漏掉不连续答案，例如 [1,3,2,4] 的最长长度是 3。',
    time: 'O(n²)',
    timeNote: '外层 n 次、内层共 n(n-1)/2 次比较。patience sorting + 二分可做到 O(n log n)，但原提交未采用，不能把该优化写成当前复杂度。',
    space: 'O(n)',
    spaceNote: '只保存长度为 n 的 dp；没有记录前驱路径，因此也不需要额外 O(n) 的父指针。',
    keyLines: [
      { start: 3, end: 3, text: '        dp = [1] * len(nums)' },
      { start: 4, end: 4, text: '        for i in range(len(nums)):' },
      { start: 5, end: 5, text: '            for j in range(i):' },
      { start: 6, end: 6, text: '                if nums[j] < nums[i]:' },
      { start: 7, end: 7, text: '                    dp[i] = max(dp[i], dp[j] + 1)' },
      { start: 8, end: 8, text: '        return max(dp)' },
    ],
    challenge: { question: '[2,2,4] 的 dp 为什么是 [1,1,2]？', hint: '两个 2 不能互相接上，但第二个 2 可以接在 4 前面。', answer: '相等元素不构成严格递增；只有某个 2 与 4 能构成长度 2。' },
    similar: [
      { id: 674, title: '最长连续递增序列', slug: 'longest-continuous-increasing-subsequence', role: '前置练习', reason: '限制子序列必须连续，状态可压缩为当前连续长度；与本题的不连续 LIS 正好对照。' },
      { id: 1143, title: '最长公共子序列', slug: 'longest-common-subsequence', role: '进阶挑战', reason: '把单个数组的结尾 DP 推广到两个序列，需要二维状态与两种跳过选择。' },
    ],
    viz: dpViz([10, 9, 2, 5, 3, 7, 101, 18], [[1, 1, 1, 1, 1, 1, 1, 1]], lisFrames([10, 9, 2, 5, 3, 7, 101, 18])),
  },

  '152': {
    id: 152,
    title: '乘积最大子数组',
    slug: 'maximum-product-subarray',
    difficulty: '中等',
    category: '动态规划',
    summary: '负数会颠倒乘积大小，因此只保留“以当前项结尾的最大乘积”不够。原提交同时维护最大 mx 与最小 mn，并在每次乘法后取历史最大答案。',
    input: '非空整数数组 nums，可包含正数、负数和 0。',
    output: '非空连续子数组的最大乘积。',
    core: '初始化 mx = mn = ans = nums[0]。对每个 x，先用旧 mx、mn 分别计算 mx*x、mn*x，再令 mx = max(两者,x)，mn = min(两者,x)，ans = max(ans,mx)。',
    walkthrough: '对 [-2,3,-2,4,-1,0,-1]，处理第二个 -2 时，旧最小值 mn=-6 乘 -2 得到 12，使 mx 从 3 翻到 12；再乘 4 得到 48。之后 -1、0、-1 都不会超过这个历史答案。',
    pitfalls: '计算两个乘积时必须使用旧的 mx、mn，代码用 a,b 临时保存。最小值不是多余状态：当前负数乘以前面的最小负乘积，可能变成最大正乘积。子数组不能为空，ans 从首项开始而不是 0。',
    observation: '连续子数组只有“从当前项重新开始”或“接在前一个子数组后”两种来源。由于符号未知，前一子数组的最大和最小乘积都可能成为当前最优前驱。',
    mechanism: '每个前缀同时保存两个极值。可视化 table 有两行：第一行是各前缀的 mx 历史，第二行是对应 mn 历史；这不是原代码中的二维数组，而是把滚动变量展开便于观察。',
    invariant: '处理到 i 后，mx 是以 i 结尾的非空子数组最大乘积，mn 是以 i 结尾的最小乘积，ans 是 0..i 中任意子数组的最大乘积。',
    termination: '遍历除首项外的所有元素后返回 ans；0 会把可接的前驱乘积归零，但单独从 0 开始仍合法。',
    counterexample: '[-2,3] 若只保留最大值会得到 3；保留最小值 -6 后，下一项 -2 可让 -6×-2=12 成为答案。',
    naive: '枚举所有左右端点并累计乘积，时间 O(n²)；逐项重乘可到 O(n³)。原提交把每个结尾的极值压缩为两个状态。',
    time: 'O(n)',
    timeNote: '按整数运算为常数成本计，nums[1:] 先复制 n-1 个引用需要 O(n)；随后除首项外每项只做两次乘法、常数次比较和一次答案更新。',
    space: 'O(n)',
    spaceNote: '滚动状态 mx、mn、ans 与临时乘积只占 O(1)，但 nums[1:] 会实际分配长度 n-1 的切片，因此这份提交的辅助空间是 O(n)。可视化的两行历史表另属教学展示。',
    keyLines: [
      { start: 3, end: 5, text: '        mx = nums[0]\n        mn = nums[0]\n        ans = nums[0]' },
      { start: 6, end: 6, text: '        for x in nums[1:]:' },
      { start: 7, end: 7, text: '            a, b = mx * x, mn * x' },
      { start: 8, end: 8, text: '            mx = max(a, b, x)' },
      { start: 9, end: 9, text: '            mn = min(a, b, x)' },
      { start: 10, end: 10, text: '            ans = max(ans, mx)' },
      { start: 11, end: 11, text: '        return ans' },
    ],
    challenge: { question: '遇到 0 后，为什么还要保留“从 0 重新开始”的候选？', hint: '子数组可以在当前项开始，0 本身也是合法子数组。', answer: '若后面出现负数，0 会阻断旧乘积；以 0 结尾的 mx、mn 都为 0，之后可重新开始或继续。' },
    similar: [
      { id: 1567, title: '乘积为正数的最长子数组长度', slug: 'maximum-length-of-subarray-with-positive-product', role: '同类巩固', reason: '同样要追踪正负状态，只是把乘积极值改为最长正乘积长度，并单独处理 0。' },
      { id: 713, title: '乘积小于 K 的子数组', slug: 'subarray-product-less-than-k', role: '进阶挑战', reason: '也处理连续子数组乘积，但用滑动窗口和除法维护窗口积，正数条件与 K 的门限不同。' },
    ],
    viz: dpViz([-2, 3, -2, 4, -1, 0, -1], [[-2], [-2]], productFrames([-2, 3, -2, 4, -1, 0, -1])),
  },

  '416': {
    id: 416,
    title: '分割等和子集',
    slug: 'partition-equal-subset-sum',
    difficulty: '中等',
    category: '动态规划',
    summary: '总和为奇数时直接不可分；否则问题变成能否从 nums 中选出若干项，使其和等于总和的一半。原提交用倒序一维布尔 DP，保证每项最多使用一次。',
    input: '非空正整数数组 nums。',
    output: '布尔值：是否能把数组分成两个元素和相等的子集。',
    core: 'target = sum(nums)//2。f[0] = True；对每个 a，令 j 从 target 递减到 a，执行 f[j] = f[j] or f[j-a]。最后返回 f[target]。',
    walkthrough: '对 [1,3,4]，总和 8，target = 4。处理 1 后只能组成 1；处理 3 后可组成 3 和 4；处理 4 时 j = 4 读取 f[0]，确认目标和可达。另一组 {1,3} 的和也是 4。',
    pitfalls: '倒序更新是 0/1 背包的关键；若正序，同一数组元素可能在本轮被重复使用。原文件第 13～27 行是注释掉的二维方案，真正执行的是第 3～12 行。源文件的返回类型注解写成 -> int，但实际返回 False/True，这里按真实返回值讲解且不改源码。布尔表在可视化中写成 0/1；奇数总和要在分配 target 前返回。',
    observation: '若总和为 T，一部分和为 T/2，则剩余元素自然也是 T/2。因此均分等价于寻找一个和为 target 的子集，不必同时枚举两半。',
    mechanism: '外层选择一个数组元素，内层从目标和向下更新。读取的 f[j-a] 是“尚未使用当前元素”的旧状态，逻辑或同时保留不选当前元素的可能。',
    invariant: '每处理完一个元素后，f[j] = 1 当且仅当已处理元素中存在和为 j 的子集；下降的 j 保证读取列尚未被本轮改写。',
    termination: '所有元素处理完后检查 f[target]；若为 0，则不存在所需子集。',
    counterexample: '[1,2,5] 总和为 8，target = 4，但没有子集和为 4，返回 False；元素 2 不能因为出现一次就被用两次。',
    naive: '枚举每个元素选或不选，最坏 O(2^n)；用二维表记录“前 i 项能否组成 j”需要 O(n×target) 空间。',
    time: 'O(n×target)',
    timeNote: 'n 是元素数，target = sum(nums)/2；每个元素最多更新 target-a+1 列。位集压缩可加速，但当前代码没有采用。',
    space: 'O(target)',
    spaceNote: '只保存一维 0/1 表。返回布尔值不占输出数组空间；若讨论输入与 target 上界，总和分析另计。',
    keyLines: [
      { start: 3, end: 3, text: '        total = sum(nums)' },
      { start: 4, end: 5, text: '        if total % 2:\n            return False' },
      { start: 6, end: 6, text: '        target = total // 2' },
      { start: 7, end: 7, text: '        f = [False] * (target + 1)' },
      { start: 8, end: 8, text: '        f[0] = True' },
      { start: 9, end: 9, text: '        for a in nums:' },
      { start: 10, end: 11, text: '            for j in range(target, a - 1, -1):\n                f[j] = f[j] or f[j-a]' },
      { start: 12, end: 12, text: '        return f[target]' },
    ],
    challenge: { question: '若把内层循环改成从 a 正向到 target，[1,2,5] 为什么会被误判为可以均分？', hint: 'target = 4；处理 2 时，正序的 j = 4 会读取本轮刚写入的 f[2]。', answer: '会把 2 用两次凑出 4，错误返回 true；原数组没有和为 4 的子集。倒序可避免本轮复用。' },
    similar: [
      { id: 474, title: '一和零', slug: 'ones-and-zeroes', role: '同类巩固', reason: '同为倒序一维 0/1 背包，但状态维度和容量约束从元素和变成 0/1 的数量。' },
      { id: 518, title: '零钱兑换 II', slug: 'coin-change-ii', role: '进阶挑战', reason: '都做和值状态转移；518 允许重复硬币且正序更新，与本题每项仅一次形成关键对照。' },
    ],
    viz: dpViz([1, 3, 4], [[1, 0, 0, 0, 0]], subsetFrames([1, 3, 4]), { target: 4 }),
  },
};
