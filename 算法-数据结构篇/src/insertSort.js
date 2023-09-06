function insertSort(arr){
    const  len=arr.length;
    for(let i=1;i<arr.length;i+=1){
      let j=i;
      //当前可能要插入或者要排一个数据
      let target =arr[j];
      while(j>0&&arr[j-1]>target){
        arr[j] =arr[j-1];
        j-=1;
      }
      arr[j] =target
    }
    return arr;
}