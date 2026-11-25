# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # ans = None
        # def dfs(node):
        #     nonlocal ans
        #     if not node:
        #         return 0
        #     cnt = dfs(node.left) + dfs(node.right)
        #     if node is p or node is q:
        #         cnt += 1
        #     if cnt == 2 and ans is None:
        #         ans = node
        #     return cnt
        # dfs(root)
        # return ans
        def dfs(node, p, q):
            if not node or node is p or node is q:
                return node
            L = dfs(node.left, p, q)
            R = dfs(node.right, p, q)
            if L and R:
                return node
            return L or R
        return dfs(root, p, q)