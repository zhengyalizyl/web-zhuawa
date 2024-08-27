//https://leetcode.cn/problems/coin-change/description/
//322. 零钱兑换
// 中等
// 相关标签
// 相关企业
// 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。

// 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。

// 你可以认为每种硬币的数量是无限的。
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
 //dp[i]凑齐i元钱，需要的最小硬币数量
 //在计算dp[i]之前，已经计算出dp[0]到dp[i-1]的答案
 //dp[i]=min(dp[i-coins[0]]+1,dp[i-coins[1]]+1,...,dp[i-coins[n]]+1)，并且 i-coins[j]>=0;
 //这里的1是决策的数量，也就是dp[i]当前的这块硬币
 //dp[0] =0;//代表凑齐0元，需要的最小硬币数量为0
 //dp[1...n] =正无穷，代表无法找开
 var coinChange = function(coins, amount) {
  const dp=new Array(amount+1);
  dp[0]=0;
  for(let i=1;i<=amount;i++){
    dp[i] = Infinity;
  }

  for(let i=1;i<=amount;i++){
    for(let j=0;j<coins.length;j++){
        if(i-coins[j]>=0){
            dp[i] =Math.min(dp[i],dp[i-coins[j]]+1)
        }
    }
  }
  return dp[amount] ==Infinity?-1:dp[amount]
};

