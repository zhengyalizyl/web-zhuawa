// https://leetcode.cn/problems/minimum-height-trees/description/
// 树是一个无向图，其中任何两个顶点只通过一条路径连接。 换句话说，任何一个没有简单环路的连通图都是一棵树。

// 给你一棵包含 n 个节点的树，标记为 0 到 n - 1 。给定数字 n 和一个有 n - 1 条无向边的 edges 列表（每一个边都是一对标签），其中 edges[i] = [ai, bi] 表示树中节点 ai 和 bi 之间存在一条无向边。

// 可选择树中任何一个节点作为根。当选择节点 x 作为根节点时，设结果树的高度为 h 。在所有可能的树中，具有最小高度的树（即，min(h)）被称为 最小高度树 。

// 请你找到所有的 最小高度树 并按 任意顺序 返回它们的根节点标签列表。

// 树的 高度 是指根节点和叶子节点之间最长向下路径上边的数量。

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
 //edges.length == n - 1,因为这个是一个稀疏图
 //先构建graph,然后采用bfs的方式计算最短的路径
 let visited=[];
var findMinHeightTrees = function(n, edges) {
   const g=[];
   for(let i=0;i<n;i++){
    g.push([])
   }
  
   //无向图转成双向图
   for(let [from ,to] of edges){
    g[from].push(to);
    g[to].push(from);
   }

   let minHeight=Number.MAX_SAFE_INTEGER;
   let res=[];
   for(let i=0;i<n;i++){
     visited=new Array(n);
     const h=bfs(g,i);
     if(h<minHeight){
        minHeight=h;
        res=[i];
     }else if(h==minHeight){
        res.push(i)
     }
   }
   return res;
};

class myQueue{
    constructor(size){
        this.arr=new Array(size);
        this.head=0;
        this.tail=0;
    }

    get length(){
        return this.tail-this.head;
    }
    push(val){
        this.arr[this.tail%this.arr.length] =val;
        this.tail++;
    }
    shift(){
        if(this.length){
           const val= this.arr[this.head%this.arr.length];
           this.head++;
           return val
        }else{
            return 
        }
    }
}

//可以搜索最短路径
//因为有push和shift会使超出时间范围
function bfs2(grap,s){
  const queue=[];
  queue.push(s);
  let height=0;
  while(queue.length){
    const sz=queue.length;
    // console.log('------')
     height++;
    for(let i=0;i<sz;i++){
      const cur=queue.shift();
      visited[cur] =true;
    //   console.log(cur);
      for(let neightbor of grap[cur]){
        if(!visited[neightbor]){
          queue.push(neightbor)
        }
      }
    }
  }
  return height
}

//时间范围还是超出时间限制
function bfs(grap,s){
  const queue=new myQueue(1e5);
  queue.push(s);
  let height=0;
  while(queue.length){
    const sz=queue.length;
    // console.log('------')
     height++;
    for(let i=0;i<sz;i++){
      const cur=queue.shift();
      visited[cur] =true;
    //   console.log(cur);
      for(let neightbor of grap[cur]){
        if(!visited[neightbor]){
          queue.push(neightbor)
        }
      }
    }
  }
  return height
}
