class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        st, best = [], 0
        heights.append(0)
        for i, x in enumerate(heights):
            while st and heights[st[-1]] > x:
                top = heights[st.pop()]
                left = st[-1] if st else -1
                best = max(best, top * (i - left - 1))
            st.append(i)
        return best

