//https://leetcode.cn/problems/subsets-ii/description/
// 90. 子集 II
// 中等
// 相关标签
// 相关企业
// 给你一个整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的 
// 子集
// （幂集）。

// 解集 不能 包含重复的子集。返回的解集中，子集可以按 任意顺序 排列。
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
let path = [];
let res = [];
var subsetsWithDup = function(nums) {
  path = [];
  res = [];
  nums.sort((i,j)=>i-j)
  dfs(nums, 0);
  return res;
};

function dfs(nums, i) {
  const n = nums.length;
  res.push([...path]);
  for (let j = i; j < n; j++) {//这个保证了不会重复
  if(j>i&&nums[j]==nums[j-1]){continue}
    path.push(nums[j]);
    dfs(nums, j + 1);
    path.pop();
  }
}
