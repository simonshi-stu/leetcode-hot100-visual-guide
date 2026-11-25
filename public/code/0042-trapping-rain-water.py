class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_most = right_most = ans = 0
        while left < right:
            left_most = max(left_most, height[left])
            right_most = max(right_most, height[right])
            if height[left] < height[right]:
                ans += left_most - height[left]
                left += 1
            else:
                ans += right_most - height[right]
                right -= 1
        return ans
