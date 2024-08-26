// https://leetcode.cn/problems/3sum/description/
// 15. 三数之和
// 已解答
// 中等
// 相关标签
// 相关企业
// 提示
// 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。

// 注意：答案中不可以包含重复的三元组。
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  //从小到大的排序
  nums.sort((a, b) => a - b);
  let ans = []
  let n = nums.length
  let pre = null;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) { //如果最小的都比0大，那么往后走的数都比nums[i]大，相加只可能比0都大
      break;
    }
    if (i - 1 >= 0 && nums[i] == nums[i - 1]) continue; // 遍历到重复的数，跳过    
    // if (pre != null && pre == nums[i]) continue;//因为前面已经存储上了，遍历到重复的数，跳过
    twosum(nums, i + 1, n - 1, nums[i], ans);
    // pre = nums[i];
  }
  return ans;
};

function twosum(nums, left, right, target, ans) {
  while (left < right) {
    if (target * nums[right] > 0) break;
    const sum = nums[left] + nums[right] + target;
    if (sum == 0) {
      let res = [target, nums[left], nums[right]]
      let pre = ans.length == 0 ? null : ans[ans.length - 1]
      if (pre == null || pre[0] != res[0] || pre[1] != res[1]) {
        ans.push(res)
      }
      left++;
      right--;
    } else if (sum < 0) {
      left++;
    } else {
      right--;
    }
  }
}


//方法二：

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  //从小到大的排序
  nums.sort((a, b) => a - b);
  let ans = []
  let n = nums.length
  // let pre = null;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) { //如果最小的都比0大，那么往后走的数都比nums[i]大，相加只可能比0都大
      break;
    }
    if (i - 1 >= 0 && nums[i] == nums[i - 1]) continue; // 遍历到重复的数，跳过    
    // if (pre != null && pre == nums[i]) continue;//因为前面已经存储上了，遍历到重复的数，跳过
    twosum(nums, i + 1, n - 1, nums[i], ans);
    // pre = nums[i];
  }
  return ans;
};

function twosum(nums, left, right, other, ans) {
  while (left < right) {
    if (other * nums[right] > 0) break;
    const sum = nums[left] + nums[right] + other;
    if (sum == 0) {
      ans.push([other, nums[left], nums[right]])
      while (left < right && nums[left] == nums[left + 1]) left++;
      while (left < right && nums[right] == nums[right - 1]) right--;
      left++;
      right--;

    } else if (sum < 0) {
      left++;
    } else {
      right--;
    }
  }
}
