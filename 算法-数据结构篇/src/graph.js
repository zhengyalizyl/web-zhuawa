const graph = [
  [4, 3, 1], // 表示 0 到 4 , 0 到 3 ， 0 到 1 各有一条边
  [3, 2, 4], // 表示 1 到 3 , 1 到 2 ， 1 到 4 各有一条边
  [3], // 表示 2 到 3 有一条边
  [4], // 表示 3 到 4 有一条边
  [], // 没有从4出去的边
];

let visited = []; //为了一个节点反复访问
let path = []; //记录路径
//O(V)
function dfs(graph, s) {
  if (visited[s]) {
    return;
  }
  //前序位置
  visited[s] = true;

  //进行选择
  path.push(s);
  console.log(s, path);
  for (let neightbor of graph[s]) {
    dfs(graph, neightbor);
  }
  //后序位置
  //撤销选择
  path.pop();
}

//图的框架
function dfsTemplate(graph, s) {
  //点s的前序位置
  for (let n of graph[s]) {
    //边（s->n）的前序位置
    dfsTemplate(graph, n);
     //边（s->n）的后序位置
  }
  //点s的后序位置
}




//可以搜索最短路径
function bfs(grap,s){
  const queue=[];
  queue.push(s);
  while(queue.length){
    const sz=queue.length;
    console.log('------')
    for(let i=0;i<sz;i++){
      const cur=queue.shift();
      visited[cur] =true;
      console.log(cur);
      for(let neightbor of grap[cur]){
        if(!visited[neightbor]){
          queue.push(neightbor)
        }

      }
    }
  }
}

bfs(graph,0)
