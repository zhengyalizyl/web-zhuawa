// https://leetcode.cn/problems/palindrome-linked-list/description/
//234. 回文链表
// 已解答
// 简单
// 相关标签
// 相关企业
// 给你一个单链表的头节点 head ，请你判断该链表是否为
// 回文链表
// 。如果是，返回 true ；否则，返回 false 。

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
let left;
var isPalindrome = function(head) {
  left =head;
  return traverse(head)
};

function traverse(head){
    if(head==null){return true}
    let res=traverse(head.next);
    //后序位置,即res就是一个倒着输出
    res=res&&head.val==left.val;
    left =left.next;
    return res;
}