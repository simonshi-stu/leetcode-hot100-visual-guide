class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        L, R = 0, m*n - 1
        while L <= R:
            mid = (L + R) // 2
            x = matrix[mid // n][mid % n]
            if x <= target:
                L = mid + 1
            else:
                R = mid - 1
        return R >= 0 and matrix[R // n][R % n] == target
