class Solution:
    def isValid(self, s: str) -> bool:
        pair = {")": "(", "}":"{", "]":"["}
        st = []
        for ch in s:
            if ch not in pair:
                st.append(ch)
            elif not st or st[-1] != pair[ch]:
                return False
            else:
                st.pop()
        return not st

        