const bubbleSort = (arr) => {
  console.time('bubble sort time');

  const length =arr.length;
  if(length <= 1) return arr;

  for(let i=0; i<length-1; i++) {
    let hasChange = false;
    for(let j=0; j<length-i-1; j++) {
      if(arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        hasChange = true;
      }
    }
    //在length -i-1 -> length-1
    if(!hasChange) break;
  }

  console.log('sorted arr: ',arr)
  console.timeEnd('bubble sort time');
}



const insertionSort = (arr) => {
  console.time('insertion sort time');

  const length =arr.length;
  if(length <= 1) return arr;

  // 1. 先获取第一个元素，是排好序
  // 2. 取下一个，在排好序的数组中排序
  // 3.重复第二遍的过程

  let current,preIndex;

  for(let i=1;i<length;i++) {
    preIndex = i-1;//当前元素的前一个元素的下标
    current = arr[i];//当前元素
    while(preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex+1] = arr[preIndex];
      preIndex--;
    }

    if(preIndex+1 !==i){
      arr[preIndex+1] = current;
    }
  }
  return arr;
}

//空间复杂度：O(1)
//时间复杂度:O(n^2)
//稳定性：稳定

const selectionSort=arr=>{
  const length =arr.length;
  if(length<=1){
    return  arr;
  }

  let minIndex,temp;
}
