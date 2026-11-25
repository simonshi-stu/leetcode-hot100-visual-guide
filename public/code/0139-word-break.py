class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        for i in range(1, n + 1):
            for w in wordDict:
                L = len(w)
                if L <= i and dp[i - L] and s[i - L : i] == w:
                    dp[i] = True
        return dp[n]