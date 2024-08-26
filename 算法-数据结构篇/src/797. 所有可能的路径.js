// https://leetcode.cn/problems/all-paths-from-source-to-target/description/
//797. 所有可能的路径
// 中等
// 相关标签
// 相关企业
// 给你一个有 n 个节点的 有向无环图（DAG），请你找出所有从节点 0 到节点 n-1 的路径并输出（不要求按特定顺序）

//  graph[i] 是一个从节点 i 可以访问的所有节点的列表（即从节点 i 到节点 graph[i][j]存在一条有向边）

//每条数据需要访问多次
/**
 * @param {number[][]} graph
 * @return {number[][]}
 */
let path = [];
let res = []
var allPathsSourceTarget = function (graph) {
  path = [];
  res = [];
  dfs(graph, 0)
  return res;
};

function dfs(grap, s) {
  path.push(s);
  const n = grap.length;//n就是图的节点
  //已经循环到最后了
  if (s == n - 1) {
    res.push([...path])
  } else {
    for (let v of grap[s]) {
      dfs(grap, v)
    }
  }

  path.pop();
}