// https://leetcode.cn/problems/maximum-subarray/description/
// 53. 最大子数组和
// 中等
// 相关标签
// 相关企业
// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 子数组
// 是数组中的一个连续部分。



// 示例 1：

// 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出：6
// 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。

/**
 * @param {number[]} nums
 * @return {number}
 */
//dp[i]表示以nums[i]结尾的连续子数组的最大的和
//dp[i] =
//        dp[i-1]+nums[i];if(dp[i-1]>=0)
//        nums[i];if(dp[i-1]<0)
//dp[0] =nums[0];
//res=max(dp[0],dp[1],...,dp[n-1])
//方法一:动态规划
var maxSubArray = function (nums) {
  const n = nums.length;
  const dp = new Array(n);
  dp[0] = nums[0];
  for (let i = 1; i < n; i++) {
    dp[i] = dp[i - 1] >= 0 ? dp[i - 1] + nums[i] : nums[i];
  }
  let res = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < n; i++) {
    res = Math.max(res, dp[i])
  }
  return res
};


//方法二：
/**
* @param {number[]} nums
* @return {number}
*/
//dp[i]表示以nums[i]结尾的连续子数组的最大的和
//dp[i] =
//        dp[i-1]+nums[i];if(dp[i-1]>=0)
//        nums[i];if(dp[i-1]<0)
//dp[0] =nums[0];
//res=max(dp[0],dp[1],...,dp[n-1])
var maxSubArray = function (nums) {
  return help(nums, 0, nums.length - 1)
};

function help(nums, left, right) {
  if (left == right) { return nums[left] }
  const mid = (left + right) >> 1;
  return Math.max(help(nums, left, mid), help(nums, mid + 1, right), cross(nums, left, mid, right))
}
function cross(nums, left, mid, right) {
  let sum = 0;
  let leftSumMax = Number.MIN_SAFE_INTEGER;
  for (let i = mid; i >= left; i--) {
    sum += nums[i];
    leftSumMax = Math.max(leftSumMax, sum)
  }

  sum = 0;
  let rightSumMax = Number.MIN_SAFE_INTEGER;
  for (let i = mid + 1; i <= right; i++) {
    sum += nums[i];
    rightSumMax = Math.max(rightSumMax, sum)
  }
  return leftSumMax + rightSumMax
}

