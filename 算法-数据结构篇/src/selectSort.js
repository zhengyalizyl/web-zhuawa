function selectSort(arr) {
  const len = arr.length;
  let minIdx;
  //0 ~ len-1
  //1 ~  n-1
  //2 ~ n-1
  for (let i = 0; i < len; i += 1) {
    //0 ~ len-1
    //1 ~  n-1
    //2 ~ n-1
    //i ~ n-1
    // 假设最小值是在i位置上
    minIdx = i;
    for (let j = i; j < len; j += 1) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    //需要最小的值所在的位置和i所在的位置交换
    if (minIdx != i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }
  }
  return arr;
}


const arr = [2, 6, 5, 9, 3, 1, 8, 4, 7]