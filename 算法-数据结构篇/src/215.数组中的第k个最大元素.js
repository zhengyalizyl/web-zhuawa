// https://leetcode.cn/problems/kth-largest-element-in-an-array/description/

// 代码
// 测试用例
// 测试结果
// 测试结果
// 215. 数组中的第K个最大元素
// 中等
// 相关标签
// 相关企业
// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

// 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
//方法一:会超时
var findKthLargest2 = function(nums, k) {
  return help(nums,0,nums.length-1,nums.length-k)
};

function swap(arr, i, j) {
[arr[i], arr[j]] = [arr[j], arr[i]];
}

//i代表比支点小的索引,j代表比支点大的索引
function partion(arr, l, r) {
 const pivotIndex = l;
 const pivotVal = arr[pivotIndex];
 swap(arr, pivotIndex, r);
 let i = l;
 let j = l;
 while (j < r) {
   if (arr[j] < pivotVal) {
     swap(arr, i, j);
     i++
   }
   j++;
 }
 swap(arr,i,j);
 return i;
}

function help(nums,l,r,k){
 if (l == r) { return nums[k] }
 let pindex = partion(nums, l, r);
 if(pindex>=k){
 return  help(nums, l, pindex ,k);
 }else{
   return  help(nums, pindex + 1, r,k)
 }
}

//方法二
function quickselect(nums, l, r, k){
   if (l === r)
       return nums[k];
   let partition = nums[l], i = l - 1, j = r + 1;
   while (i < j) {
       do i++; while (nums[i] < partition);
       do j--; while (nums[j] > partition);
       if (i < j) {
           let tmp = nums[i];
           nums[i] = nums[j];
           nums[j] = tmp;
       }
   }
   if (k <= j) return quickselect(nums, l, j, k);
   else return quickselect(nums, j + 1, r, k);
}

function findKthLargest(nums, k) {
   return quickselect(nums, 0, nums.length - 1, nums.length - k);
}