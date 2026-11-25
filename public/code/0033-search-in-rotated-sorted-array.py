class Solution:
    def search(self, nums: list[int], target: int) -> int:
        last = nums[-1]
        def seg(x):
            return 0 if x > last else 1
        def in_pre(x):
            if seg(x) != seg(target):
                return seg(x) < seg(target)
            return x <= target
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = (l + r) // 2
            if in_pre(nums[mid]):
                l = mid + 1
            else:
                r = mid - 1
        return r if r >= 0 and nums[r] == target else -1


        