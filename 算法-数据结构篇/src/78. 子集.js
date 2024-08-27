//https://leetcode.cn/problems/subsets/description/
// 78. 子集
// 中等
// 相关标签
// 相关企业
// 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的
// 子集
// （幂集）。

// 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
//升序做剪枝
let used = [];
let path = [];
let res = [];
var subsets = function (nums) {
  const n = nums.length;
  used = new Array(n);
  path = [];
  res = [];
  dfs(nums, 0);
  return res;
};

function dfs(nums, i) {
  const n = nums.length;
  res.push([...path]);
  //    if(i==n){
  //        res.push([...path]);
  //        return 
  //    }
  for (let j = i; j < n; j++) {//这个保证了不会重复
    if (used[j]) {
      continue;
    }
    path.push(nums[j]);
    used[j] = true;
    dfs(nums, j + 1);
    path.pop();
    used[j] = false;
  }
}


//方法二:
//升序做剪枝
let path = [];
let res = [];
var subsets = function (nums) {
  path = [];
  res = [];
  dfs(nums, 0);
  return res;
};

function dfs(nums, i) {
  const n = nums.length;
  res.push([...path]);
  for (let j = i; j < n; j++) {//这个保证了不会重复
    path.push(nums[j]);
    dfs(nums, j + 1);
    path.pop();
  }
}
