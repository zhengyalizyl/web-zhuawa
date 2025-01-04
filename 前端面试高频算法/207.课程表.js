// 207. 课程表
// 已解答
// 中等
// 相关标签
// 相关企业
// 提示
// 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

// 在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。

// 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
// 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
 //1. 创建队列，将入度为0的节点放在队列里
 //2. 如果队列不为空，从队列里取出第一个节点 num-当前的课，将依赖这门课的所有节点的入度-1
 //  1. 如果-1后的入度为0，意味着可以直接学习
 //  2. 如果-1后入度不为0，意味着还有其他依赖，继续遍历其他节点

 var canFinish = function(numCourses, prerequisites) {
  if(prerequisites.length==0){
      return true
  }
  //维护入度的数组
  let inDegree=new Array(numCourses).fill(0);
  //创建相邻节点的map关系
  let adj=new Map();
  for(let e of prerequisites){
      inDegree[e[0]]++;//入度+1
      if(!adj.has(e[1])){
          adj.set(e[1],[])
      }
      //获取相关联的节点
      let vEdge=adj.get(e[1]);
      vEdge.push(e[0])
  }

  let queue=[];
  //将入度为0的节点入队列
  for(let i=0;i<numCourses;i+=1){
      if(inDegree[i]===0){
          queue.push(i)
      }
  }

  while(queue.length>0){
      let v=queue.shift();
      //弹出一门课程
      numCourses--;
      if(!adj.has(v)){
          continue;
      }

      for(let w of adj.get(v)){
          inDegree[w]--;
          if(inDegree[w]===0){
              queue.push(w)
          }
      }
  }

  return numCourses===0
};