class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        st = set()
        j = -1
        n = len(s)
        ans = 0
        for i in range(n):
            while j < n - 1 and s[j + 1] not in st:
                st.add(s[j+1])
                j += 1
            ans = max(ans, j - i + 1)
            st.remove(s[i])
        return ans
            

        