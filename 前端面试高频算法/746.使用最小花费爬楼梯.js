// 746. 使用最小花费爬楼梯
// 简单
// 相关标签
// 相关企业
// 提示
// 给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。

// 你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。

// 请你计算并返回达到楼梯顶部的最低花费

/**
 * @param {number[]} cost
 * @return {number}
 */
 // i 级台阶 i-1台阶上的一层
 //爬上i级台阶const[i] i+1 i+2 不用消费
 //dp[i] =dp[i-1]+cost[i]
 //dp[i]=dp[i-2]+cost[i]
 //dp[i]=min(dp[i-1],dp[i-2])+cost[i]
 //dp[0]=cost[0]
 //dp[1]=min(cost[0]+cost[1],cost[1])=cost[1]
 var minCostClimbingStairs = function(cost) {
  cost.push(0);
  let dp=[];
  let n=cost.length;
  dp[0]=cost[0];
  dp[1]=cost[1];
  for(let i=2;i<n;i+=1){
      dp[i]=Math.min(dp[i-1],dp[i-2])+cost[i]
  }
  return dp[n-1]
};