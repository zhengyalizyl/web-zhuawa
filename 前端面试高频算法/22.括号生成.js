// 22. 括号生成
// 中等
// 相关标签
// 相关企业
// 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有
/**
 * @param {number} n
 * @return {string[]}
 */

 //搜索判断 在当前这步不对，回到上一步
 // 在每次都尝试 添加（）
 //( ：前提：有剩余的左括号
 //):前提：不能超过已有的左括号
 var generateParenthesis = function(n) {
  const res=[];
  const dfs=(path,left,right)=>{
      if(left>n||left<right){
          return 
      }

      if(left+right===2*n){
          res.push(path);
          return 
      }

      dfs(path+'(',left+1,right);
      dfs(path+')',left,right+1)
  }
  dfs('',0,0);
  return res;
};