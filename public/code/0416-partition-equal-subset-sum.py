class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        f = [False] * (target + 1)
        f[0] = True
        for a in nums:
            for j in range(target, a - 1, -1):
                f[j] = f[j] or f[j-a]
        return f[target]
        # total = sum(nums)
        # if total % 2:
        #     return False
        # target, n = total // 2, len(nums)
        # dp = [[False] * (target + 1) for _ in range(n + 1)]
        # for i in range(n + 1):
        #     dp[i][0] = True
        # for i in range(1, n + 1):
        #     a = nums[i - 1]
        #     for j in range(1, target + 1):
        #         if j >= a:
        #             dp[i][j] = dp[i - 1][j] or dp[i - 1][j - a]
        #         else:
        #             dp[i][j] = dp[i-1][j]
        # return dp[n][target]