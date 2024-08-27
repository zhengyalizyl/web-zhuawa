//https://leetcode.cn/problems/house-robber-iii/description/
//小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 root 。

// 除了 root 之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果 两个直接相连的房子在同一天晚上被打劫 ，房屋将自动报警。

// 给定二叉树的 root 。返回 在不触动警报的情况下 ，小偷能够盗取的最高金额 。
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
 //dp[node][i]当前node能打劫到的最大值,i：0表示当前节点不偷，1表示当前节点偷
//dp[node][0] =max(dp[left][0],dp[left][1])+max(dp[right][0],dp[right][1])
//dp[node][1]=node.value+dp[left][0]+dp[right][0]
//dp[null][*]=0
var rob = function(root) {
  const [notSteal,hasSteal] =help(root);
    return Math.max(notSteal,hasSteal)
};
function help(root){
 if(!root){return [0,0]}
 const left=help(root.left);
 const right=help(root.right);
 const notSteal=Math.max(left[0],left[1])+Math.max(right[0],right[1]);
 const hasSteal=root.val+left[0]+right[0];
  return [notSteal,hasSteal]
}