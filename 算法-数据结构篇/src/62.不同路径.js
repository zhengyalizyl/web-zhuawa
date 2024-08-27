// https://leetcode.cn/problems/unique-paths/description/
// 62. 不同路径
// 中等
// 相关标签
// 相关企业
// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

// 问总共有多少条不同的路径？


/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
 //dp[i][j]代表从(0,0)->(i,j)有多少种不同路径
 //dp[i][j]=dp[i-1][j]+dp[i][j-1]
 //dp[0][*]=1;
 //dp[*][0]=1;
 var uniquePaths = function(m, n) {
  const dp=[];
  for(let i=0;i<m;i++){
      dp[i]=new Array(n)
  }
  for(let i=0;i<m;i++){
      dp[i][0]=1
  }
  for(let j=0;j<n;j++){
      dp[0][j]=1;
  }
 for(let i=1;i<m;i++){
  for(let j=1;j<n;j++){
      dp[i][j]=dp[i-1][j]+dp[i][j-1];
  }
 }
 return dp[m-1][n-1]
};

//方法二：
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
 
var uniquePaths = function(m, n) {
  if(m>n){[m,n]=[n,m]}
  const dp=new Array(n).fill(1);
  for(let i=1;i<m;i++){
    for(let j=1;j<n;j++){
        dp[j]=dp[j]+dp[j-1];
    }
  }
  return dp[n-1]
};

