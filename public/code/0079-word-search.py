class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        m,n = len(board), len(board[0])
        def dfs(i, j, k):
            if not(0 <= i < m and 0 <= j < n) or board[i][j] != word[k]:
                return False
            if k == len(word) - 1:
                return True
            board[i][j] = '#'
            found = (dfs(i + 1, j, k + 1) or dfs(i - 1, j, k + 1) or dfs(i, j + 1, k + 1) or dfs(i, j-1, k+1))
            board[i][j] = word[k]
            return found
        return any(dfs(i,j,0) for i in range(m) for j in range(n)) 