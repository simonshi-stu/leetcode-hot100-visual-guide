class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        cnt = Counter(nums)
        heap = []
        for x,c in cnt.items():
            heapq.heappush(heap, (c, x))
            if len(heap) > k:
                heapq.heappop(heap)
        return [x for c, x in heap]