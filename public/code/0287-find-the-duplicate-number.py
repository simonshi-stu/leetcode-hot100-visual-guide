class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        slow = fast = 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        p, q = 0, slow
        while p != q:
            p, q = nums[p], nums[q]
        return p