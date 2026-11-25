class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pos = {}
        for j, x in enumerate(nums):
            need = target - x
            if need in pos:
                return [pos[need], j]
            pos[x] = j
        return []