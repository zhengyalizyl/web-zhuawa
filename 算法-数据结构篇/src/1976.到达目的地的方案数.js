// https://leetcode.cn/problems/number-of-ways-to-arrive-at-destination/
// 1976. 到达目的地的方案数
// 中等
// 相关标签
// 相关企业
// 提示
// 你在一个城市里，城市由 n 个路口组成，路口编号为 0 到 n - 1 ，某些路口之间有 双向 道路。输入保证你可以从任意路口出发到达其他任意路口，且任意两个路口之间最多有一条路。

// 给你一个整数 n 和二维整数数组 roads ，其中 roads[i] = [ui, vi, timei] 表示在路口 ui 和 vi 之间有一条需要花费 timei 时间才能通过的道路。你想知道花费 最少时间 从路口 0 出发到达路口 n - 1 的方案数。

// 请返回花费 最少时间 到达目的地的 路径数目 。由于答案可能很大，将结果对 109 + 7 取余 后返回。



/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */

var countPaths = function(n, roads) {

  const mod = 1e9 + 7;
  //1. 建立邻接表
  //g[i] = (target, cost)
  const g = new Array(n).fill().map(() => []);
  let k=0;
  for (const [from, to, cost] of roads) {
    g[from].push([to, cost]);
    g[to].push([from, cost]);
  }
  console.log(g)
  //dist[i]: 从起点到点 i 的最短路径长度
  const dist = new Array(n).fill(Infinity);
  //f[i]: 从起点到点 i 的最短路径的条数
  const f = new Array(n).fill(0);
  //f[0]: 初始点本身就有1的计数
  f[0] = 1;
  //dist[0]: 初始点距离本身的距离为0
  dist[0] = 0;


  //2. 利用最小堆不断进行淘汰筛选，直到到达每一个点的最小值都算出来记录在dist(在整个过程中记录更新f[i])
  const pq = new MinPriorityQueue({priority: (p) => p[0]});
  pq.enqueue([0, 0]); 

  while (!pq.isEmpty()) {
    const [cost, target] = pq.dequeue().element;

    //目前的cost 大于 dist[target], 说明 到达target有另外一条更优路径, 当前的这条路径可以直接放弃
    if (cost > dist[target]) {
      continue;
    }
    for (const [nextTarget, nextCost] of g[target]) {

      if (nextTarget === target) continue;
      const sum = cost + nextCost;
      if (sum < dist[nextTarget]) {
        //发现更小路径，更新nextTarget节点的最小路径.
        dist[nextTarget] = sum;
        //target 到 nextTarget 的路线只有当前路线本身1条，于是 到达target最短路径的条数就 等效于 到达 nextTarget最短路径的条数了.
        f[nextTarget] = f[target];
        //只有到达当前目的结点最短路径 有更小值出现的时候，再把这个目的结点放入最小堆进行再次观察比较.
        pq.enqueue([sum, nextTarget]);
      } else if (sum === dist[nextTarget]) {
        //等于和大于情况 说明已经找到当前目的结点的最短路径了，不用再把这个目的结点放入最小堆进行再次观察比较了.
        f[nextTarget] = (f[nextTarget] + f[target]) % mod;
      }
    }
  }
  return f[n - 1];
};
