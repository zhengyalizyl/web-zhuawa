//https://leetcode.cn/problems/permutations/description/
//46. 全排列
// 中等
// 相关标签
// 相关企业
// 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
let used=[];
let path=[];
let res=[];
var permute = function(nums) {
 const n=nums.length;
 used=new Array(n);
 path=[];
 res=[];
dfs(nums,0);
return res;
};

function dfs(nums,i){
   if(i==nums.length){
       res.push([...path]);
       return 
   }
   for(let j=0;j<nums.length;j++){
       if(used[j]){
           continue;
       }
       path.push(nums[j]);
       used[j]=true;
       dfs(nums,i+1);
        path.pop();
        used[j] =false;
   }
}