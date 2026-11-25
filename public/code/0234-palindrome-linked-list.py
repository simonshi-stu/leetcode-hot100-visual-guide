# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        def reverse(node):
            prev = None
            cur = node
            while cur:
                nxt = cur.next
                cur.next = prev
                prev = cur
                cur = nxt 
            return prev
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        second = reverse(slow)
        first = head
        while second:
            if first.val != second.val:
                return False
            first = first.next
            second = second.next
        return True