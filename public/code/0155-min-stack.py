class MinStack:

    def __init__(self):
        self.st = []
        self.mn = []

    def push(self, value: int) -> None:
        self.st.append(value)
        if not self.mn or value <= self.mn[-1]:
            self.mn.append(value)

    def pop(self) -> None:
        if self.st.pop() == self.mn[-1]:
            self.mn.pop()

    def top(self) -> int:
        return self.st[-1]

    def getMin(self) -> int:
        return self.mn[-1]


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(value)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()