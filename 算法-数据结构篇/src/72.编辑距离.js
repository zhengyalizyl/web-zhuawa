//https://leetcode.cn/problems/edit-distance/description/
// 72. 编辑距离
// 中等
// 相关标签
// 相关企业
// 给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。

// 你可以对一个单词进行如下三种操作：

// 插入一个字符
// 删除一个字符
// 替换一个字符
 

// 示例 1：

// 输入：word1 = "horse", word2 = "ros"
// 输出：3
// 解释：
// horse -> rorse (将 'h' 替换为 'r')
// rorse -> rose (删除 'r')
// rose -> ros (删除 'e')
// 示例 2：

// 输入：word1 = "intention", word2 = "execution"
// 输出：5
// 解释：
// intention -> inention (删除 't')
// inention -> enention (将 'i' 替换为 'e')
// enention -> exention (将 'n' 替换为 'x')
// exention -> exection (将 'n' 替换为 'c')
// exection -> execution (插入 'u')

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
 //dp[i][j] word1[0...i）转化成word2[0...j）所需要的最小操作
 //dp[i][j] =dp[i-1][j-1]当word1[i-1]==word2[j-1];
 //dp[i][j]=min(dp[i][j-1]+1,dp[i-1][j]+1,dp[i-1][j-1]+1),当word1[i-1]!=word2[j-1];
 //dp[i][0]=i;
 //dp[0][j]=j;
 var minDistance = function(word1, word2) {
  const m=word1.length+1;
  const n=word2.length+1;
  const dp=new Array(m);

for(let i=0;i<m;i++){
  dp[i] =new Array(n)
}

for(let i=0;i<m;i++){
  dp[i][0]=i
}

for(let j=0;j<n;j++){
  dp[0][j]=j;
}


for(let i=1;i<m;i++){
  for(let j=1;j<n;j++){
      if(word1[i-1]==word2[j-1]){
          dp[i][j]=dp[i-1][j-1];
      }else{
          dp[i][j]=Math.min(dp[i][j-1]+1,dp[i-1][j]+1,dp[i-1][j-1]+1);
          
      }
  }
}

return dp[word1.length][word2.length]
};





