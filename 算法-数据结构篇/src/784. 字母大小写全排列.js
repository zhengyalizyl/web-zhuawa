//https://leetcode.cn/problems/letter-case-permutation/description/
// 784. 字母大小写全排列
// 已解答
// 中等
// 相关标签
// 相关企业
// 给定一个字符串 s ，通过将字符串 s 中的每个字母转变大小写，我们可以获得一个新的字符串。

// 返回 所有可能得到的字符串集合 。以 任意顺序 返回输出。

/**
 * @param {string} s
 * @return {string[]}
 */

let res = [];
var letterCasePermutation = function (s) {
  res = [];
  dfs(s, 0, '');
  return res;
};


function dfs(s, i, tmp) {
  if (i == s.length) {
    res.push(tmp);
    return
  }
  if (isNaN(s[i])) {
    dfs(s, i + 1, tmp + s[i].toLowerCase());
    dfs(s, i + 1, tmp + s[i].toUpperCase());
  } else {
    dfs(s, i + 1, tmp + s[i]);
  }
}