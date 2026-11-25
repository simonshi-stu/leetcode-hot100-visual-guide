class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        n, ans, curr = len(nums), [], []
        used = [False] * n
        def dfs(i):
            if i == n:
                ans.append(curr[:])
                return
            for j in range(n):
                if not used[j]:
                    used[j] = True
                    curr.append(nums[j])
                    dfs(i + 1)
                    curr.pop()
                    used[j] = False
        dfs(0)
        return ans
        