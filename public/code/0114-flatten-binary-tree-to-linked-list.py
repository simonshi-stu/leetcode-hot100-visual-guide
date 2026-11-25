# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def flatten(self, root: TreeNode | None) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        def dfs(node):
            if not node:
                return None
            l, r = node.left, node.right
            lt = dfs(l)
            rt = dfs(r)
            if l:
                node.right = l 
                node.left = None
                lt.right = r 
            return rt or lt or node
        dfs(root)


        