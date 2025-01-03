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


//选择排序
const selectionSort=arr=>{
  const length =arr.length;
  if(length<=1){
    return  arr;
  }

  let minIndex,temp;
  for(let i=0;i<length-1;i++){
    minIndex = i;
    for(let j=i+1;j<length;j++){
      if(arr[j]<arr[minIndex]){
        minIndex = j; //找到最小的索引
      }
    }
    temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}

// 空间复杂度:O(1)
// 时间复杂度：O(n^2)
// 稳定性：不稳定


//稳定性是未排序的元素的顺序 2 4 10 5 5 6 7 3





//归并排序
const mergeSort = arr =>{
   const length = arr.length;
   if(length <= 1) return arr;

   let middle =Math.floor(length/2);
   let left =arr.slice(0,middle);
   let right =arr.slice(middle,length);
   return merge(mergeSort(left),mergeSort(right));
}

const merge=(left,right)=>{
  const result=[];
  while(left.length && right.length){
    if(left[0] <= right[0]){
      result.push(left.shift());
    }else{
      result.push(right.shift());
    }
  }

  while(left.length){ result.push(left.shift());}
  while(right.length){
    result.push(right.shift());
  }
  return result
}



