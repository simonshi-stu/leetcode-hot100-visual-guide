class Solution:
    def generate(self, numRows: int) -> list[list[int]]:
        if numRows == 0:
            return []
        res = []
        row = [1]
        for i in range(numRows):
            res.append(row[:])
            row.append(1)
            for j in range(len(row) - 2, 0, -1):
                row[j] = row[j] + row[j - 1]
        return res