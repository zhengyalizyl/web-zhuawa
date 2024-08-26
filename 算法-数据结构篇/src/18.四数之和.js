// 18. 四数之和
// 中等
// 相关标签
// 相关企业
// 给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]] （若两个四元组元素一一对应，则认为两个四元组重复）：

// 0 <= a, b, c, d < n
// a、b、c 和 d 互不相同
// nums[a] + nums[b] + nums[c] + nums[d] == target
// 你可以按 任意顺序 返回答案 。

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function(nums, target) {
  //从小到大的排序
   nums.sort((a,b)=>a-b);
 let ans=[]
 let n = nums.length
  for(let i=0;i<n;i++){
      if(nums[i]>0 &&target>0 &&nums[i]>target){ 
          break;
      }
      if (i - 1 >= 0 && nums[i] == nums[i - 1]) continue; // 遍历到重复的数，跳过    
      for(let j=i+1;j<n;j++){
        if (nums[i] + nums[j] > target && nums[i] + nums[j] > 0 && target > 0) break;
        if(j>i+1 &&nums[j]==nums[j-1]){
           continue; // 遍历到重复的数，跳过    
        }
        twosum(nums, j+1, n -1,nums[i],nums[j],target, ans);
      }
     
  }
  return ans;
};

function twosum(nums, left, right, other,other2, target,ans){
while(left<right){
  const sum= nums[left]+nums[right]+other+other2;

   if(sum==target){
      ans.push([other,other2, nums[left], nums[right]])
      while (left < right && nums[left] == nums[left + 1]) left++;
      while (left < right && nums[right] == nums[right - 1]) right--;
      left++;
      right--;
   } else if(sum<target) {
      left++;
   } else {
       right--;
   }
}
}