class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = prices[0]
        ans = 0
        for x in prices:
            ans = max(ans, x - min_price)
            min_price = min(min_price, x)
        return ans
        