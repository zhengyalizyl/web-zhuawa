// https://leetcode.cn/problems/course-schedule-ii/description/
//210. 课程表 II
// 已解答
// 中等
// 相关标签
// 相关企业
// 提示
// 现在你总共有 numCourses 门课需要选，记为 0 到 numCourses - 1。给你一个数组 prerequisites ，其中 prerequisites[i] = [ai, bi] ，表示在选修课程 ai 前 必须 先选修 bi 。

// 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示：[0,1] 。
// 返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，你只要返回 任意一种 就可以了。如果不可能完成所有课程，返回 一个空数组 。

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */

 
var findOrder = function(numCourses, prerequisites) {
  let graph = [];
     let topResult=[];
     let indeg=new Array(numCourses).fill(0)
     for (let i = 0; i < numCourses; i++) {
         graph.push([])
     }
     for (let [to,from] of prerequisites) {
         graph[from].push(to);//邻阶表
         indeg[to]++;
     }
 
    const queue=new Array();
    for(let i=0;i<numCourses;i++){
      if(indeg[i]==0){
         queue.push(i)
      }
    }
    while(queue.length){
     const u= queue.shift();
     topResult.push(u)
     for(const v of graph[u]){
         indeg[v]--
         if(indeg[v] ==0){
             queue.push(v);
         }
     }
    }
    return topResult.length==numCourses?topResult:[]
 }




 /**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
let graph = [];
//visited[u]为0表示u节点还未访问，为1表示u节点在onpath上，为2表示u节点已经访问完成
let visited = [];
let res;
let topResult=[];//拓扑排序
 
var findOrder = function(numCourses, prerequisites) {
       graph = [];
    res = true;
    topResult=[];
    visited = new Array(numCourses).fill(0)
    for (let i = 0; i < numCourses; i++) {
        graph.push([])
    }
    for (let [to, from] of prerequisites) {
        graph[from].push(to);////邻接表
    }

    for (let i = 0; i < numCourses&&res; i++) {
        if (visited[i] == 0) {
            dfs(i)
        }
    }
     topResult.reverse();
    return res?topResult:[]
}

//图里面，一般u->v
function dfs(u) {
    //u点的先序位置
    //把u标记在onpath上
    visited[u] = 1;
    for (let v of graph[u]) {
        //u->v边的先序位置
        if (visited[v] == 0) {
         
            dfs(v)
            if (!res) {
                return
            }
        } else if (visited[v] == 1) {
            res = false;
            return;
        }

        //u->v边的后序位置
    }
    //u点的后序位置
    //把u标记已经访问完成
    visited[u] = 2;
     topResult.push(u)
}

