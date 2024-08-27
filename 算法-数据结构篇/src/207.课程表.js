//https://leetcode.cn/problems/course-schedule/description/
// 207. 课程表
// 中等
// 相关标签
// 相关企业
// 提示
// 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

// 在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。

// 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
// 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
let graph = [];
//visited[u]为0表示u节点还未访问，为1表示u节点在onpath上，为2表示u节点已经访问完成
let visited = [];
let res;
var canFinish = function (numCourses, prerequisites) {
    graph = [];
    res = true;
    visited = new Array(numCourses).fill(0)
    for (let i = 0; i < numCourses; i++) {
        graph.push([])
    }
    for (let [to, from] of prerequisites) {
        graph[from].push(to);////邻阶表
    }

    for (let i = 0; i < numCourses; i++) {
        if (visited[i] == 0) {
            dfs(i)
        }
    }
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
}


//排序拓扑
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
    topResult=[];
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
    if(visited[u]==1){//说明这里已经成环了
      res=false
      return
  }
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




/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
//方法二：
var canFinish = function (numCourses, prerequisites) {
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
 return topResult.length==numCourses
};
