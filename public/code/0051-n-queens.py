class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        ans, queens = [], []
        cols, d1, d2 = set(), set(), set()
        def dfs(r):
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
                d2.remove(r+c)
        dfs(0)
        return ans

        