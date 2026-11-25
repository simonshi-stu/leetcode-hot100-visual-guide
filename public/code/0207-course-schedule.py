from collections import defaultdict, deque

class Solution(object):
    def canFinish(self, numCourses, prerequisites):
        """
        :type numCourses: int
        :type prerequisites: List[List[int]]
        :rtype: bool
        """
        graph = defaultdict(list)
        indegree = [0] * numCourses
        for dest, src in prerequisites:
            graph[src].append(dest)
            indegree[dest] += 1
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        learned_course = 0
        while queue:
            course = queue.popleft()
            learned_course += 1
            for next_course in graph[course]:
                indegree[next_course] -= 1
                if indegree[next_course] == 0:
                    queue.append(next_course)
        return learned_course == numCourses
        # edges = defaultdict(list)
        # visited = [0] * numCourses
        # result = list()
        # self.valid = True

        # for info in prerequisites:
        #     edges[info[1]].append(info[0])
        
        # def dfs(u):
        #     visited[u] = 1
        #     for v in edges[u]:
        #         if visited[v] == 0:
        #             dfs(v)
        #             if not self.valid:
        #                 return
        #         elif visited[v] == 1:
        #             self.valid = False
        #             return
        #     visited[u] = 2
        #     result.append(u)
        
        # for i in range(numCourses):
        #     if self.valid and not visited[i]:
        #         dfs(i)
        
        # return self.valid

        