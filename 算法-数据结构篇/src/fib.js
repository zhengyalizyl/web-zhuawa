function fib(n) {
  if (n < 2) {
    return n
  }
  return fib(n - 1) + fibb(n - 2)
}

//方法二：进行缓存
//O(N)
const memo = [];
function fib2(n) {
  if (memo[n] !== undefined) {
    return memo[n]
  }
  if (n < 2) {
    return memo[n] = n;
  }

  return memo[n] = fib2(n - 1) + fib2(n - 2)
}


//方法三
function fib3(n) {
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n]
}

//方法四
function fib4(n) {
  let dp0 = 0;
  let dp1 = 1;
  for (let i = 2; i <= n; i++) {
    let dp2 = dp1 + dp0;
    dp0 = dp1;
    dp1 = dp2;
  }
  return dp1;
}