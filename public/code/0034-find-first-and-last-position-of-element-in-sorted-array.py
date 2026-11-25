class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        def first(a,T):
            l,r = 0, len(nums) - 1
            while l <= r:
                mid = (l + r) // 2
                if nums[mid] < target:
                    l = mid + 1
                else:
                    r = mid - 1
            ok = l < len(nums) and nums[l] == target
            return l if ok else -1
        def last(a,T):
            l,r = 0, len(nums) - 1
            while l <= r:
                mid = (l + r) // 2
                if nums[mid] <= target:
                    l = mid + 1
                else:
                    r = mid - 1
            ok = r >= 0 and nums[r] == target
            return r if ok else -1
        return [first(nums, target), last(nums, target)]
        
        