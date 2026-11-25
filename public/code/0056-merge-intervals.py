class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort()
        ans = []
        for a,b in intervals:
            if not ans or ans[-1][1] < a:
                ans.append([a,b])
            else:
                ans[-1][1] = max(ans[-1][1],b)
        return ans
        