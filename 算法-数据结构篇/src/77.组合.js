//https://leetcode.cn/problems/combinations/description/
// 77. 组合
// 中等
// 相关标签
// 相关企业
// 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。

// 你可以按 任何顺序 返回答案。

/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
let used=[];
let path=[];
let res=[];
var combine = function(n, k) {
 used=new Array(n);
 path=[];
 res=[];
 const nums=new Array(n);
 for(let i=0;i<n;i++){
    nums[i]=i+1;
 }
dfs(nums,0,k);
return res;
};



function dfs(nums,i,k){
     const n=nums.length;
     if(path.length==k){
     res.push([...path]);
     return 
     }

   for(let j=i;j<n;j++){//这个保证了不会重复
       if(used[j]){
           continue;
       }
       path.push(nums[j]);
       used[j]=true;
       dfs(nums,j+1,k);
        path.pop();
        used[j] =false;
   }
}