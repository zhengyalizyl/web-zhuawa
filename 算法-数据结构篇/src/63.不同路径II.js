//https://leetcode.cn/problems/unique-paths-ii/description/
// 63. 不同路径 II
// 相关标签
// 相关企业
// 提示
// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish”）。

// 现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？

// 网格中的障碍物和空位置分别用 1 和 0 来表示
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
  //dp[i][j]代表从(0,0)->(i,j)有多少种不同路径
 //dp[i][j]=obstacleGrid[i][j]==0?dp[i-1][j]+dp[i][j-1]:0;
 //dp[0][*]=1，如果遇到石头，则为dp[0][*]=0
 //dp[*][0]=1;如果遇到石头，则dp[*][0]=0
 var uniquePathsWithObstacles = function(obstacleGrid) {
    const m=obstacleGrid.length;
    const n=obstacleGrid[0].length
   const dp=new Array(m);
   let flag =false;//代表没有碰到石头
   for(let i=0;i<m;i++){
       dp[i]=new Array(n)
   }
   for(let i=0;i<m;i++){
       if(obstacleGrid[i][0]){
         flag =true;
     }
       dp[i][0]=flag?0:1
   }
   flag=false;
   for(let j=0;j<n;j++){
    if(obstacleGrid[0][j]){
         flag =true;
     }
       dp[0][j]=flag?0:1
   }
  for(let i=1;i<m;i++){
   for(let j=1;j<n;j++){
      dp[i][j]=obstacleGrid[i][j]==0?dp[i-1][j]+dp[i][j-1]:0
   }
  }
  return dp[m-1][n-1]
 };