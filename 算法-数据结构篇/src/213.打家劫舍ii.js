//https://leetcode.cn/problems/house-robber-ii/description/
//你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都 围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。

// 给定一个代表每个房屋存放金额的非负整数数组，计算你 在不触动警报装置的情况下 ，今晚能够偷窃到的最高金额。

/**
 * @param {number[]} nums
 * @return {number}
 */
var rob1 = function (nums) {
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
var rob = function(nums) {
    if(nums.length==1){return nums[0]}
   const res1=rob1(nums.slice(1));//不打劫第一个
   const res2=rob1(nums.slice(0,nums.length-1)) //不打劫最后一个
   return Math.max(res1,res2)
};


