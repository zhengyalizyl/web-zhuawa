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
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function(times, n, k) {
    const graph =new Array(n+1);
    const dist =new Array(n+1);//从源点到其他点的距离
    for(let i=1;i<=n;i++){
       graph[i]=[];
       dist[i]=Infinity;//距离为无穷大
    }
     //构建图
     for(let [u,v,w] of times){
       graph[u].push([v,w])//u是源节点，v 是目标节点， w 是一个信号从源节点传递到目标节点的时间。
     }
   
     dist[k]=0;//代表从k到k的距离为0
     const queue=[];
     queue.push(k);
     while(queue.length){
       const u=queue.shift();
       for(let [v,w] of graph[u]){
            const len=dist[u]+w;//从u经过w的时间到达目标节点的时间
            if(len<dist[v]){
               dist[v]=len;
               queue.push(v);
            }
       }
     }
     let res=0;
     for(let i=1;i<=n;i++){
       res=Math.max(res,dist[i]);
     }
     return  res==Infinity?-1:res;
   };
   
   
 