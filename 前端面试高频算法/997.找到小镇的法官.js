// 997. 找到小镇的法官
// 简单
// 相关标签
// 相关企业
// 小镇里有 n 个人，按从 1 到 n 的顺序编号。传言称，这些人中有一个暗地里是小镇法官。

// 如果小镇法官真的存在，那么：

// 小镇法官不会信任任何人。
// 每个人（除了小镇法官）都信任这位小镇法官。
// 只有一个人同时满足属性 1 和属性 2 。
// 给你一个数组 trust ，其中 trust[i] = [ai, bi] 表示编号为 ai 的人信任编号为 bi 的人。

// 如果小镇法官存在并且可以确定他的身份，请返回该法官的编号；否则，返回 -1 。

/**
 * @param {number} n
 * @param {number[][]} trust
 * @return {number}
 */
var findJudge = function(n, trust) {
  let graph =Array.from({length:n+1},()=>({
      inDegree:0,
      outDegree:0
  }))

  trust.forEach(([a,b])=>{
      graph[a].outDegree++;
      graph[b].inDegree++;
  })
  return graph.findIndex(({inDegree,outDegree},index)=>{
      return index!=0&&outDegree===0&& inDegree===n-1
  })
};


//找出入度的差值为1的人
var findJudge=function(n,trust){
  let graph=Array(n+1).fill(0);
  trust.forEach(([a,b])=>{
      graph[a]--;
      graph[b]++
  })

  return graph.findIndex((node,index)=>{
      return index!==0&&node===n-1
  })
}