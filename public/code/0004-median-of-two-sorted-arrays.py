class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2
        l, r = 0, m
        while l <= r:
            i =(l + r) // 2
            j = half - i 
            al = nums1[i - 1] if i > 0 else -inf
            ar = nums1[i] if i < m else inf
            bl = nums2[j - 1] if j > 0 else -inf
            br = nums2[j] if j < n else inf
            if al <= br and bl <= ar:
                if (m + n) % 2 == 1:
                    return max(al, bl)
                return (max(al, bl) + min(ar, br)) / 2
            if al > br:
                r = i - 1
            else:
                l = i + 1
        
