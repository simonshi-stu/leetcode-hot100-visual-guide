class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        n,m = len(s), len(p)
        if n < m:
            return []
        cnt_p, cnt_s = [0] * 26, [0] * 26
        for ch in p:
            cnt_p[ord(ch) - 97] += 1
        for ch in s[:m]:
            cnt_s[ord(ch) - 97] += 1
        ans = [0] if cnt_s == cnt_p else []
        for i in range(1, n-m+1):
            cnt_s[ord(s[i + m - 1]) - 97] +=1
            cnt_s[ord(s[i-1]) - 97] -= 1
            if cnt_s == cnt_p:
                ans.append(i)
        return ans
