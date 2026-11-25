class Solution:
    def decodeString(self, s: str) -> str:
        st = []
        for ch in s:
            if ch != "]":
                st.append(ch)
                continue
            sub = ''
            while st[-1] != "[":
                sub = st.pop() + sub
            st.pop()
            k = ''
            while st and st[-1].isdigit():
                k = st.pop() + k
            st.append(sub * int(k))
        return "".join(st)
