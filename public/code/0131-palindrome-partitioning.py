class Solution:
    def partition(self, s: str) -> list[list[str]]:
        n = len(s)
        ans, cur = [], []
        def dfs(i):
            if i == n:
                ans.append(cur[:])
                return 
            for j in range(i,n):
                piece = s[i:j+1]
                if piece == piece[::-1]:
                    cur.append(piece)
                    dfs(j + 1)
                    cur.pop()
        dfs(0)
        return ans