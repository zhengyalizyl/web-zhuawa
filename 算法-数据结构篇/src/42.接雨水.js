// https://leetcode.cn/problems/trapping-rain-water/description/
// 42. 接雨水
// 尝试过
// 困难
// 相关标签
// 相关企业
// 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水
//方法一:时间超出限制
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  const n = height.length;
  let sum = 0;

  //i代表第几个柱子，因为右边的柱子i=n-1,没有右边的最大值,i=0,左边的没有最大值
  for (let i = 1; i < n - 1; i++) {
    let leftMax = 0; //i左边的波峰
    for (let j = 0; j < i; j++) {
      leftMax = Math.max(leftMax, height[j]);
    }
    let rightMax = 0; //i右边的柱子
    for (let j = i + 1; j < n; j++) {
      rightMax = Math.max(rightMax, height[j]);
    }
    //取当前节点左边最高的柱子，和右边最高的柱子，取最小值 再减去当前柱子的高度
    sum += Math.max(Math.min(leftMax, rightMax) - height[i], 0);
  }
  return sum;
};



//方法二：
//先把leftMax，rightMax缓存起来
var trap = function (height) {
  const n = height.length;
  let sum = 0;
  const leftMaxList = new Array(n);
  const rightMaxList = new Array(n);
  leftMaxList[0] = 0;
  for (let i = 1; i < n; i++) {
    leftMaxList[i] = Math.max(leftMaxList[i - 1], height[i - 1]);
  }

  rightMaxList[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    rightMaxList[i] = Math.max(rightMaxList[i + 1], height[i + 1])
  }

  //i代表第几个柱子，因为右边的柱子i=n-1,没有右边的最大值,i=0,左边的没有最大值
  for (let i = 1; i < n - 1; i++) {
    let leftMax = leftMaxList[i];
    let rightMax = rightMaxList[i];
    sum += Math.max(Math.min(leftMax, rightMax) - height[i], 0)
  }
  return sum
}