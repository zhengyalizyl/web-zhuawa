//方法一
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const p = arr[0];
  const temp = arr.slice(1);
  const left = temp.filter(i => i <= p);
  const right = temp.filter(i => i > p);
  const sortedLeft = quickSort(left);
  const sortedRight = quickSort(right)
  return [...sortedLeft, ...sortedRight]
}


//方法二
function quicksort2(arr, l, r) {
  if (l >= r) { return }
  let pindex = partion(arr, l, r)
  quicksort2(arr, l, pindex - 1);
  quicksort2(arr, pindex + 1, r)
}

function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

//i代表比支点小的索引,j代表比支点大的索引
function partion(arr, l, r) {
  const pivotIndex = l;
  const pivotVal = arr[pivotIndex];
  swap(arr, pivotIndex, r);
  let i = l;
  let j = l;
  while (j < r) {
    if (arr[j] < pivotVal) {
      swap(arr, i, j);
      i++
    }
    j++;
  }
  swap(arr,i,j);
  return i;
}


/**
 * 双边指针（挖坑法）
 * 思路：
 * 创建左右指针。
 * 记录左指针数据为分界值 pivot，
 * 此时左指针视为"坑"，里面的数据可以被覆盖。
 *
 * 首先从右向左找出比pivot小的数据，
 * 找到后立即放入左边坑中，当前位置变为新的"坑"，
 * 然后从左向右找出比pivot大的数据，
 * 找到后立即放入右边坑中，当前位置变为新的"坑"，
 *
 * 结束循环后将最开始存储的分界值放入当前的"坑"中，
 * 返回当前"坑"下标（即分界值下标）
 */
function partion2(arr, l, r) {
  const pivotIndex = l;
  const pivotVal = arr[pivotIndex];
  let i = l;
  let j = r;
  while (i<j) {
    while (i<j&&arr[j] >= pivotVal) j--;
    if(i<j){
      arr[i]=arr[r];
      i++
    }

    while(i<j&&arr[i]<pivotVal) i++;
    if(i<j){
      arr[j] =arr[i];
      j--;
    }
  }
  arr[i] =pivotVal;
  return i;
}