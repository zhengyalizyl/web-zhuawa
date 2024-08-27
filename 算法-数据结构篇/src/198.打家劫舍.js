// https://leetcode.cn/problems/house-robber/description/
// 198. 打家劫舍
// 中等
// 相关标签
// 相关企业
// 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

// 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

//方法一:
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
  const n = nums.length;
  if (n == 0) { return 0 }
  if (n == 1) { return nums[0] }
  return Math.max(
    rob(nums.slice(0, n - 1)),
    rob(nums.slice(0, n - 2)) + nums[n - 1]);
};


//方法二：
/**
 * @param {number[]} nums
 * @return {number}
 */
let memo = [];
var rob = function (nums) {
  memo = new Array(nums.length + 1);
  const res = help(nums);
  return res
};
function help(nums) {
  const n = nums.length;
  if (memo[n] != undefined) { return memo[n] }
  if (n == 0) { return memo[n] = 0 }
  if (n == 1) { return memo[n] = nums[0] }
  return memo[n] = Math.max(
    help(nums.slice(0, n - 1)),
    help(nums.slice(0, n - 2)) + nums[n - 1]);
}


//方法三
/**
 * @param {number[]} nums
 * @return {number}
 */
//dp[i]代表 假如面前只有前i个房子所能偷盗的最高金额
//dp[i] =max(nums[i-1]+dp[i-2],dp[i-1])
//dp[0]=0;
//dp[1]=nums[i]
var rob = function (nums) {
  return help(nums)
};
function help(nums) {
  let n = nums.length;
  let dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = nums[0]
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
  }
  return dp[n]
}


//方法三：
var rob = function (nums) {
  return help(nums)
};
function help(nums) {
  let dp0 = 0;
  let dp1 = nums[0];
  for (let i = 2; i <= nums.length; i++) {
    let temp = Math.max(dp1, dp0 + nums[i - 1]);
    dp0 = dp1;
    dp1 = temp

  }
  return dp1
}


