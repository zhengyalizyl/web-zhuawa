// https://leetcode.cn/problems/merge-k-sorted-lists/description/
// 23. 合并 K 个升序链表
// 已解答
// 困难
// 相关标签
// 相关企业
// 给你一个链表数组，每个链表都已经按升序排列。

// 请你将所有链表合并到一个升序链表中，返回合并后的链表。

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */

//比如[1,4,5],[1,3,4]排好序得到[1,1,3,4,4,5],再将[1,1,3,4,4,5]与[2,6]进行排序,即每次俩俩排序
var mergeKLists = function (lists) {
    if (lists.length === 0) {
        return null
    }

    if (lists.length === 1) {
        console.log(lists)
        return lists[0]
    }

    //剩下俩俩对比
    let head = lists[0];
    for (let i = 1; i < lists.length; i += 1) {
        head = f3(head, lists[i]);
    }
    return head;

};


//俩个链表进行排序，合并
function f(l1, l2) {
    if (l1 == null || l2 == null) {
        return l1 == null ? l2 : l1
    }
    //先比较哪个的头是小的，就返回那个小的
    let head = l1.val <= l2.val ? l1 : l2;
    let smallhead = head;
    let pre1 = new ListNode();//虚拟的
    pre1.next = head;
    let current = pre1;//
    let bighead = head === l1 ? l2 : l1;
    while (smallhead !== null && bighead !== null) {
        if (smallhead.val <= bighead.val) {
            current.next = smallhead;
            smallhead = smallhead.next;
        } else {
            current.next = bighead;
            bighead = bighead.next;
        }
        current = current.next;
    }

    current.next = smallhead !== null ? smallhead : bighead;
    return pre1.next;
}
function f2(l1, l2) {
    if (l1 == null) return l2;
    if (l2 == null) return l1;
    let hair = new ListNode();
    let small = l1.val < l2.val ? l1 : l2, big = small == l1 ? l2 : l1;
    hair.next = small;
    let pre = hair;
    while (small != null && big != null) {
        if (small.val < big.val) {
            pre.next = small;
            small = small.next;
        } else {
            pre.next = big;
            big = big.next;
        }
        pre = pre.next;
    }
    pre.next = small == null ? big : small;
    return hair.next;
}
function f3(l1, l2) {
    if (l1 == null) return l2;
    if (l2 == null) return l1;
    let head = l1.val < l2.val ? l1 : l2, p = head, q = p == l1 ? l2 : l1, next;
    // p始终是指向最小的那个,q是最大的那个
    while (p != null && q != null) {
        while (p.next != null && p.next.val < q.val) p = p.next;
        next = p.next;
        p.next = q;//因为p和p.next原先的会断，所以需要next存储原先的那个
        p = q;
        q = next;
    }
    return head;
}