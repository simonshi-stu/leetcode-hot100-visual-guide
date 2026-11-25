class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        mx = nums[0]
        mn = nums[0]
        ans = nums[0]
        for x in nums[1:]:
            a, b = mx * x, mn * x
            mx = max(a, b, x)
            mn = min(a, b, x)
            ans = max(ans, mx)
        return ans