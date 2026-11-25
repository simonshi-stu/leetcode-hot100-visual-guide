class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        n, ans, curr = len(nums), [], []
        def dfs(i):
            if i == n:
                ans.append(curr[:])
                return
            curr.append(nums[i])
            dfs(i + 1)
            curr.pop()
            dfs(i + 1)
        dfs(0)
        return ans