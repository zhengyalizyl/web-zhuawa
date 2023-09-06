function  selectSort(arr){
  const len =arr.length;
  let minIdx;
  for(let i=0;i<len-1;i+=1){
    minIdx= i;
    for(let j=i;j<len;j+=1){
      if(arr[j]<arr[minIdx]){
         minIdx = j;
      }
    }
     if(minIdx!=i){
      [arr[i],arr[minIdx]] =[arr[minIdx],arr[i]]
     }
  }
  return arr;
}


const arr=[2,6,5,9,3,1,8,4,7]