class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        cnt = {0:1}
        pre = ans = 0
        for x in nums:
            pre += x
            ans += cnt.get(pre - k, 0)
            cnt[pre] = cnt.get(pre, 0) + 1
        return ans
