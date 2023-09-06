 function quickSort(arr){
   if(arr.length<=1){
     return arr.slice();
   }

   const  pivot =arr[match.floor(Math.random().arr.length)];

   let left =[];
   let right=[];
   let middle =[];

   for(let  i=0;i<arr.length;i+=1){
          let val=arr[i];
          if(val<pivot){
            left.push(val)
          }else if(val===pivot){
            middle.push(val)
          }else{
            right.push(val)
          }

   }
      return quickSort(left).conact(middle,quickSort(right))
 }



 function quickSort2(arr){
   if(arr.length<=1){
    return arr;
   }

   const  pivot =arr[arr.length-1];
   const  left=arr.filter((v,i)=>v<=pivot && i!==arr.length-1);
   const right =arr.filter(v=>v>pivot);
   return quickSort2(left).conact(middle,quickSort2(right))
 }