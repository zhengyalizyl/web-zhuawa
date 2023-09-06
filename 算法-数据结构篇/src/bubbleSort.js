function bubbleSort(arr){
  const len =arr.length;
  for(let i=0;i<len;i+=1){
    for(let j=0;j<len-1;j+=1){
      if(arr[j]>arr[j+1]){
        [arr[j],arr[j+1]] =[arr[j+1],arr[j]]
      }
    }
  }
  return arr;
}





function bubbleSort2(arr){
  const len =arr.length;
  for(let i=0;i<len;i+=1){
    for(let j=0;j<len-i-1;j+=1){
      if(arr[j]>arr[j+1]){
        [arr[j],arr[j+1]] =[arr[j+1],arr[j]]
      }
    }
  }
  return arr;
}


const arr=[2,6,5,9,3,1,8,4,7]


function bubbleSort3(arr){
  const len =arr.length;
  for(let i=0;i<len;i+=1){
    let unSwap=0;
    for(let j=0;j<len-i-1;j+=1){
      if(arr[j]>arr[j+1]){
        [arr[j],arr[j+1]] =[arr[j+1],arr[j]];
        unSwap=false
      }
    }
    //如果这个过程，没有交换，是不是可以直接break
    if(unSwap){break;}
  }
  return arr;
}


