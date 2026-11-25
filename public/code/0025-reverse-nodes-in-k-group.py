# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseKGroup(self, head: ListNode | None, k: int) -> ListNode | None:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            end = group_prev
            for _ in range(k):
                end = end.next
                if not end:
                    return dummy.next
                nxt = end.next
                prev, cur = nxt, group_prev.next
            for _ in range(k):
                tmp = cur.next
                cur.next = prev
                prev, cur = cur, tmp
            old_head = group_prev.next
            group_prev.next = prev
            group_prev = old_head