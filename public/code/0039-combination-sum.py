class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        ans, cur = [], []
        candidates.sort()
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
        dfs(0, target)
        return ans
        # candidates.sort()
        # ans, cur = [], []
        # def dfs(start, res):
        #     if res == 0:
        #         ans.append(cur[:])
        #         return
        #     for j in range(start, len(candidates)):
        #         x = candidates[j]
        #         if x > res:
        #             break
        #         cur.append(x)
        #         dfs(j, res - x)
        #         cur.pop()
        # dfs(0, target)
        # return ans