//https://leetcode.cn/problems/minimum-path-sum/description/
// 64. 最小路径和
// 已解答
// 中等
// 相关标签
// 相关企业
// 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。

// 说明：每次只能向下或者向右移动一步。

/**
 * @param {number[][]} grid
 * @return {number}
 */
//dp[i][j]代表（0,0）到（i,j）最小路径和
//dp[i][j]=min(dp[i-1][j]+grid[i][j],dp[i][j-1]+grid[i][j])
//dp[i][0]=sum(grid[0...i][0]);
//dp[0][j] =sum(gird[0][0..j])
var minPathSum = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  let dp = new Array(m);
  for (let i = 0; i < m; i++) {
    dp[i] = new Array(n)
  }
  let sum = 0;
  for (let i = 0; i < m; i++) {
    sum += grid[i][0]
    dp[i][0] = sum
  }
  sum = 0;
  for (let j = 0; j < n; j++) {
    sum += grid[0][j]
    dp[0][j] = sum
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
    }
  }
  return dp[m - 1][n - 1]
};