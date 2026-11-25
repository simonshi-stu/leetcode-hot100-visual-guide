class Solution:
    def majorityElement(self, nums: list[int]) -> int:
        cand, cnt = None, 0
        for x in nums:
            if cnt == 0:
                cand = x
            if x == cand:
                cnt += 1
            else:
                cnt -= 1
        return cand