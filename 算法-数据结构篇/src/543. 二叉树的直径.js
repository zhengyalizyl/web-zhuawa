//https://leetcode.cn/problems/diameter-of-binary-tree/description/
// 543. 二叉树的直径
// 简单
// 相关标签
// 相关企业
// 给你一棵二叉树的根节点，返回该树的 直径 。

// 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。

// 两节点之间路径的 长度 由它们之间边数表示

//思路：就是所有根节点都算一下高度
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
let res=0;
var diameterOfBinaryTree = function(root) {
    res=0;
    help(root)
    return res;
};

function help(root){
  if(root==null){
    return 0
  }
  const leftHeight=help(root.left);
  const rightHeight=help(root.right);
  //后序
  const sum=leftHeight+rightHeight;
  res=Math.max(res,sum)
  return Math.max(leftHeight,rightHeight)+1;//每个节点的最高的高度
}