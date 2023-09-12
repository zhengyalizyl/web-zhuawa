function insertSort(arr){
  // 0 ~ 0 的位置上有序
  // 0 ~ 1 的位置上有序
  // 0 ~ 2 的位置上有序
  // 0 ~ 3 的位置上有序
  // 0 ~ 4 的位置上有序
  // 0 ~ n-1的位置上有序
  // 相当于后面的插入到前面有序中
    for(let i=1;i<arr.length;i+=1){
      //新来的数肯定在所在的位置上
      let j=i;
      let target =arr[j];
         //左边没有数，并且左变的数小于右边的数，就不应该循环
      while(j>0&&arr[j-1]>target){
        [arr[j],arr[j-1]] =[arr[j-1],arr[j]];
        j-=1;
      }
      arr[j] =target
    }
    return arr;
}