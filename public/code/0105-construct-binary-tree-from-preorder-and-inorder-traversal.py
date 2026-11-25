# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        idx = {v: i for i, v in enumerate(inorder)}
        def dfs(pl, pr, il, ir):
            if pl > pr:
                return None
            root = TreeNode(preorder[pl])
            k = idx[root.val]
            size = k - il
            root.left = dfs(pl + 1, pl + size, il, k - 1)
            root.right = dfs(pl + size + 1, pr, k + 1, ir)
            return root
        return dfs(0, len(preorder) - 1, 0, len(inorder) - 1)

            