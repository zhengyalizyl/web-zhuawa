// 347. 前 K 个高频元素
// 中等
// 相关标签
// 相关企业
// 给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。

 

// 示例 1:

// 输入: nums = [1,1,1,2,2,3], k = 2
// 输出: [1,2]
// 示例 2:

// 输入: nums = [1], k = 1
// 输出: [1]

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
//方法一：
var topKFrequent = function(nums, k) {
  // 记录频率更高的场景
  let map=new Map();
  //创建去重数组
  let arr=[...new Set(nums)];
  nums.map(num=>{
      if(map.has(num)){
          map.set(num,map.get(num)+1)
      }else{
          map.set(num,1)
      }
  })
  return arr.sort((a,b)=>map.get(b)-map.get(a)).slice(0,k)
};



//方法二：
//计数排序
//桶排序 映射关系 将nums的值分配给有限的桶，再在桶里面进行排序
// 1. map存储频率
// 2.创建数组（长度是去重的长度），index 频率针对出现频率不同的元素 放在对应的下标里
var topKFrequent = function(nums, k) {
  let map=new Map();
  let arr=[...new Set(nums)];
  nums.map(num=>{
    if(map.has(num)){
        map.set(num,map.get(num)+1)
    }else{
        map.set(num,1)
    }
  })

  //针对长度没有超过k的场景
  if(map.size<=k){
    return [...map.keys()]
  }
  return bucketSort(map,k)
};

function bucketSort(map,k){
    let arr=[];
    let res=[];

   map.forEach((value,key)=>{
    //以当前出现的频次作为index
    if(!arr[value]){
      arr[value]=[key];
    }else{
     arr[value].push(key)
    }
   })
   //倒序遍历获取出现频率最大的前k个数
    for(let i=arr.length-1;i>=0&&res.length<k;i--){
        if(arr[i]){
             res.push(...arr[i])
        }
    }
    return res;
}