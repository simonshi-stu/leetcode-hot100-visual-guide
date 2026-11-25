class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        res = []
        t, b = 0, len(matrix) - 1
        l, r = 0, len(matrix[0]) - 1
        while t <= b and l <= r:
            res += [matrix[t][j] for j in range(l, r+1)]
            t += 1
            res += [matrix[i][r] for i in range(t, b+1)]
            r -= 1
            if t <= b:
                res += [matrix[b][j] for j in range(r, l - 1, - 1)]
                b -= 1
            if l <= r:
                res += [matrix[i][l] for i in range(b, t - 1, - 1)]
                l += 1
        return res



        # res = []
        # t, b, l, r = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
        # while t <= b and l <= r:
        #     res += [matrix[t][j] for j in range(l, r + 1)]
        #     t += 1
        #     res +=[matrix[i][r] for i in range(t, b + 1)]
        #     r -= 1
        #     if t <= b:
        #         res += [matrix[b][j] for j in range(r, l - 1, -1)]
        #         b -= 1
        #     if l <= r:
        #         res += [matrix[i][l] for i in range(b, t - 1, -1)]
        #         l += 1
        # return res
        