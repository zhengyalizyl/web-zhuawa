//https://leetcode.cn/problems/n-queens/description/
// 51. N 皇后
// 困难
// 相关标签
// 相关企业
// 按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

// n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

// 给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。

// 每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。

/**
 * @param {number} n
 * @return {string[][]}
 */
let map = [];
let res = [];
var solveNQueens = function (n) {
  map = new Array(n);
  for (let i = 0; i < n; i++) {
    map[i] = new Array(n).fill('.')
  }
  res = [];
  help(0);
  return res;
};

function help(i) {
  const n = map.length;
  if (i == n) {
    res.push(map.map(i => i.join("")))
    return
  }
  for (let j = 0; j < n; j++) {
    //判断点（i,j）是否能放置皇后
    if (valid(i, j)) {
      //前序位置进行选择
      map[i][j] = "Q";
      help(i + 1);
      //后序位置撤销选择
      map[i][j] = "."
    }
  }

}

function valid(i, j) {
  const n = map.length;
  for (let t = 0; t < i; t++) {
    //正上方有没有皇后
    if (map[t][j] == 'Q') {
      return false
    }
  }
  for (let t = 1; i - t >= 0 && j - t >= 0; t++) {
    //左上方有没有皇后
    if (map[i - t][j - t] == 'Q') {
      return false
    }
  }

  for (let t = 1; i - t >= 0 && j + t < n; t++) {
    //右上方有没有皇后
    if (map[i - t][j + t] == 'Q') {
      return false
    }
  }
  return true
}