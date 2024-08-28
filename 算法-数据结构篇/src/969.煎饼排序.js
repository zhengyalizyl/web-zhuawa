// https://leetcode.cn/problems/pancake-sorting/description/
// 969. 煎饼排序
// 已解答
// 中等
// 相关标签
// 相关企业
// 给你一个整数数组 arr ，请使用 煎饼翻转 完成对数组的排序。

// 一次煎饼翻转的执行过程如下：

// 选择一个整数 k ，1 <= k <= arr.length
// 反转子数组 arr[0...k-1]（下标从 0 开始）
// 例如，arr = [3,2,1,4] ，选择 k = 3 进行一次煎饼翻转，反转子数组 [3,2,1] ，得到 arr = [1,2,3,4] 。

// 以数组形式返回能使 arr 有序的煎饼翻转操作所对应的 k 值序列。任何将数组排序且翻转次数在 10 * arr.length 范围内的有效答案都将被判断为正确。


//设想一下用锅铲翻转一堆烧饼的情景，其实是有一点限制的，我们每次只能将最上面的若干块饼子翻转：
// 我们的问题是，如何使用算法得到一个翻转序列，使得烧饼堆变得有序？
// 接下来，对于上面的这 n - 1 块饼，如何排序呢？还是先从中找到最大的一块饼，然后把这块饼放到底下，再递归调用 pancakeSort(A, n-1-1)……
// 你看，这就是递归性质，总结一下思路就是：
// 1、找到 n 个饼中最大的那个。
// 2、把这个最大的饼移到最底下。
// 3、递归调用 pancakeSort(A, n - 1)。
// base case：n == 1 时，排序 1 个饼时不需要翻转。
// 那么，最后剩下个问题，如何设法将某块烧饼翻到最后呢？
// 其实很简单，比如第 3 块饼是最大的，我们想把它换到最后，也就是换到第 n 块。可以这样操作：
// 1、用锅铲将前 3 块饼翻转一下，这样最大的饼就翻到了最上面。
// 2、用锅铲将前 n 块饼全部翻转，这样最大的饼就翻到了第 n 块，也就是最后一块。
// 以上两个流程理解之后，基本就可以写出解法了，不过题目要求我们写出具体的反转操作序列，这也很简单，只要在每次翻转烧饼时记录下来就行了。


//https://vzx6t9oio6.feishu.cn/docx/UWJzdGhinozizwxw3uQc95Aqnhg
/**
 * @param {number[]} arr
 * @return {number[]}
 */
var pancakeSort = function(arr) {
  const res = new Array();

   for (let n = arr.length; n > 0; n--) {
       const k = arr.indexOf(n)
       res.push(k + 1);//以k+1的长度做一个翻转
       action(arr, k)
       res.push(n) //以n的长度做一个翻转
       action(arr, n - 1)
   }
   return res
};
function action(arr, k) {
   for (let i = 0; i < k / 2; i++) {
       [arr[i], arr[k - i]] = [arr[k - i], arr[i]]
   }
}