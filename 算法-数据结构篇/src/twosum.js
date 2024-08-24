//https://leetcode.cn/problems/two-sum/
// 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
// 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
// 你可以按任意顺序返回答案。
 
// 示例 1：
// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
// 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
// 示例 2：
// 输入：nums = [3,2,4], target = 6
// 输出：[1,2]
// 示例 3：
// 输入：nums = [3,3], target = 6
// 输出：[0,1]
 
// 提示：
// - 2 <= nums.length <= 10^4
// - -10^9 <= nums[i] <= 10^9
// - -10^9 <= target <= 10^9
// - 只会存在一个有效答案

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
//方式一:
var twoSum = function(nums, target) {
  const arr=nums.map((i,idx)=>({value:i,idx}))

  arr.sort((i,j)=>i.value-j.value);

  let left=0;right=nums.length-1;
  while(left<right){
     const sum=arr[left].value+arr[right].value;
     if(sum===target){
         return [arr[left].idx,arr[right].idx];
     }else if(sum<target){
         left++;
     }else{
         right--;
     }
  }
};

//方式二
var twoSum = function(nums, target) {
  //将其转换成map
  //nums = [2,7,11,15],转成map{2=>0,7=>1,11=>2,15=>3}
  //[3,3]=>{3=>{0,1}}
  const map=new Map();
  for(let index=0;index<nums.length;index++){
    let tmp=nums[index];
     let  tempIndex=map.get(tmp)?map.get(tmp):[];
      tempIndex.push(index);
      map.set(tmp,tempIndex)
  }
  for(let index=0;index<nums.length;index++){
   const  j=target-nums[index];
   const arr=map.get(j)?map.get(j):[];
   const jIdx=arr.find(t=>t!=index);
   if(jIdx){
       return [index,jIdx]
   }
  }
 return []
};