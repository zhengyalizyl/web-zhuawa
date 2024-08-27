//方法一:广度优先
//没有判断有没有环存在
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */

var canFinish = function (numCourses, prerequisites) {
  let graph = [];
  let topResult=[];
  let indeg=new Array(numCourses).fill(0)
  for (let i = 0; i < numCourses; i++) {
      graph.push([])
  }
  for (let [to, from] of prerequisites) {
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
      indeg[v]--;
      if(indeg[v] ==0){
          queue.push(v);
      }
  }
 }
};


//方法二:深度优先
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
let graph = [];
//visited[u]为0表示u节点还未访问，为1表示u节点在onpath上，为2表示u节点已经访问完成
let visited = [];
let res;
let topResult=[];//拓扑排序
var canFinish = function (numCourses, prerequisites) {
    graph = [];
    res = true;
    visited = new Array(numCourses).fill(0)
    for (let i = 0; i < numCourses; i++) {
        graph.push([])
    }
    for (let [to, from] of prerequisites) {
        graph[from].push(to);
    }

    for (let i = 0; i < numCourses; i++) {
        if (visited[i] == 0) {
            dfs(i)
        }
    }
    topResult.reverse();
    console.log(topResult)
    return res
};
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
