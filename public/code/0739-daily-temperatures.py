class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        days = []
        ans = [0] * len(temperatures)
        for i, x in enumerate(temperatures):
            while days and temperatures[days[-1]] < x:
                j = days.pop()
                ans[j] = i - j
            days.append(i)
        return ans
