class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        ans, curr = [], []
        def dfs(left, right):
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
                curr.pop()
        dfs(0,0)
        return ans
        