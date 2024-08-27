function merge(left,right){
  let res=[];
  let i=0;
  let j=0;
  while(i<left.length && j<right.length){
    if(left[i]<right[j]){
      res.push(left[i]);
      i+=1;
    }else{
      res.push(right(j));
      j+=1;
    }
  }

  if(i<left.length){
    res.push(...left.slice(i))
  }else{
    res.push(...right.slice(j))
  }
}

// 是数组拆到最小，然后从小到大合并
function  mergeSort(arr){
  if(arr.length<=1){
    return arr;
  }


  const  mid=Math.floor(arr.length/2);
  const left =mergeSort(arr.slice(0,mid));
  const right =mergeSort(arr.slice(mid));

  return merge(left,right)
}