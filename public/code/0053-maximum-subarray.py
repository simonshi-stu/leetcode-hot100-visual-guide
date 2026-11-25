class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        cur = ans = nums[0]
        for x in nums[1:]:
            cur = max(cur, 0) + x
            ans = max(ans, cur)
        return ans
            
