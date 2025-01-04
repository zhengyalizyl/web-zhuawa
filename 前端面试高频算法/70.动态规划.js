// 70. 爬楼梯
// 简单
// 相关标签
// 相关企业
// 提示
// 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

// 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

/**
 * @param {number} n
 * @return {number}
 */
 //动态规划
 //1. 如何拆 如何定义子问题
 //2. 执行子问题
 //3. 找到问题的边界并获取最终的问题
 // dp[n] =dp[n-1]+dp[n-2]
 //dp[0]=1 dp[1]=1
 var climbStairs = function(n) {
  let dp=[1,1];
  for(let i=2;i<=n;i+=1){
      dp[i]=dp[i-1]+dp[i-2]
  }
  return dp[n]
};