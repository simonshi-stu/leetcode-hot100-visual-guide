class Solution:
    def canJump(self, nums: list[int]) -> bool:
        # right = 0
        # for i, x in enumerate(nums):
        #     if i > right:
        #         return False
        #     right = max(right, i + x)
        #     if right >= len(nums) - 1:
        #         return True
        # return False
        right = 0
        for i in range(len(nums)):
            if i > right:  # 遇到 0 卡住，且还没到终点
                return False
            right = max(right, i + nums[i]) # 疯狂试探最远能到哪
        return True