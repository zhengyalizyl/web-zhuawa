/**
 * 
 * https://leetcode.cn/problems/smallest-k-lcci/description/
 * 面试题 17.14. 最小K个数
设计一个算法，找出数组中最小的k个数。以任意顺序返回这k个数均可。
示例：
输入： arr = [1,3,5,7,2,4,6,8], k = 4
输出： [1,2,3,4]
 */

/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
//方法一:
var smallestK = function(arr, k) {
   return  arr.sort((a,b)=>a-b).slice(0,k)
};

//方法二:
//这里还有问题
var smallestK=function(arr,k){
  return countingSort(arr,100000,k)
 }
 
 let countingSort=(arr,maxValue,k)=>{
     //将输入的数据转为键存在数组中
     let bucket=new Array(maxValue+1);
     let sortedIndex=0;
     let arrlen=arr.length;
     let bucketLen=maxValue+1;
     for(let i=0;i<arrlen;i++){
         if(!bucket[arr[i]]){
             //用0占位
             bucket[arr[i]]=0;
         }
         //新开辟的数组空间是用于占位的
         bucket[arr[i]]++;
     }
 
     //按照输入的k的长度输出不为0的元素
     let res=[];
     for(let j=0;j<bucketLen;j++){
        while(bucket[j--]>0&&sortedIndex<k){
         res[sortedIndex++] =j;
        }
        if(sortedIndex===k){
         break;
        }
     }
      return res
 }