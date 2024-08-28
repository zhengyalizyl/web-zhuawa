//https://leetcode.cn/problems/network-delay-time/description/

//743. 网络延迟时间
// 已解答
// 中等
// 相关标签
// 相关企业
// 提示
// 有 n 个网络节点，标记为 1 到 n。

// 给你一个列表 times，表示信号经过 有向 边的传递时间。 times[i] = (ui, vi, wi)，其中 ui 是源节点，vi 是目标节点， wi 是一个信号从源节点传递到目标节点的时间。

// 现在，从某个节点 K 发出一个信号。需要多久才能使所有节点都收到信号？如果不能使所有节点收到信号，返回 -1 。


/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function(times, n, k) {
  const graph =new Array(n+1);
  const dist =new Array(n+1);
  for(let i=1;i<=n;i++){
     graph[i]=[];
     dist[i]=Infinity;
  }
   
   for(let [u,v,w] of times){
     graph[u].push([v,w])
   }
 
   dist[k]=0;//代表k到k是0
   const queue=[];
   queue.push(k);
   while(queue.length){
     const u=queue.shift();
     for(let [v,w] of graph[u]){
          const len=dist[u]+w;
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
 
 