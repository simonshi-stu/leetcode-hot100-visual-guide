class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        window = Counter()
        valid, j = 0, -1
        start, best = 0, len(s) + 1
        for i in range(len(s)):
            while valid < len(need) and j < len(s) - 1:
                j += 1
                window[s[j]] += 1
                if window[s[j]] == need[s[j]]:
                    valid += 1
            if valid < len(need):
                break
            if j - i + 1 < best:
                start, best = i, j - i + 1
            if window[s[i]] == need[s[i]]:
                valid -= 1
            window[s[i]] -= 1
        return "" if best > len(s) else s[start:start + best]
