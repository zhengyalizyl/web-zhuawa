//https://leetcode.cn/problems/reverse-linked-list/description/
// 206. 反转链表
// 已解答
// 简单
// 相关标签
// 相关企业
// 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if(head==null ||head.next==null){ return head}
  const last=reverseList(head.next);
  head.next.next=head;
  head.next=null;
  return last
};