class Solution:
    def partitionLabels(self, s: str) -> list[int]:

        last = {c: i for i, c in enumerate(s)} 
        ans = []
        right = left = 0
        for i, c in enumerate(s):
            right = max(right, last[c])
            if i == right:
                ans.append(right - left + 1)
                left = i + 1
        return ans