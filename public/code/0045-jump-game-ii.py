class Solution:
    def jump(self, nums: list[int]) -> int:
        ans = 0
        end = 0
        right = 0
        for i in range(len(nums) - 1):
            right = max(right, nums[i] + i)
            if i == end:
                ans += 1
                end = right
        return ans