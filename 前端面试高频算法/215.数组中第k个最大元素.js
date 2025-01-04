// 215. 数组中的第K个最大元素
// 已解答
// 中等
// 相关标签
// 相关企业
// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

// 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

// **
//  * @param {number[]} nums
//  * @param {number} k
//  * @return {number}
//  */
//方法一：
var findKthLargest = function(nums, k) {
    nums.sort((a,b)=>b-a).slice(0,k);
    return nums[k-1]
};

//长度为k的桶
//快速排序 分而治之
//1. 找到一个中间的基准数拆分
// 2. 将比它的数放在右边，小的数放在左边
//3. 按照步骤1 2 继续拆分，直到找到对应的下标

//1. 创建俩个指针，指向数组的最左端 最右端
//2.找一个元素 作为基准
//3.左指针向右移动，直到遇到比基准元素大 暂停
// 4.右指针向左移动，直到遇到比基准元素小，停止
//5. 左侧的index 大于右侧指针的index
var findKthLargest = function(nums, k) {
    nums.sort((a,b)=>b-a).slice(0,k);
    return nums[k-1]
};

let quickSort=(arr)=>{
    quick(arr,0,arr.length-1)
}

let quick=(arr,left,right)=>{
    let index;
    if(left<right){
        index=parition(arr,left,right);
        if(left<index-1){
            quick(arr,left,index-1)
        }
        if(index<right){
            quick(arr,index,right)
        }
    }
}

let partition=(arr,left,right)=>{
    //选择基准值代替
    let dataum=arr[Math.floor(Math.random()*(right-left+1))+left];
    let i=left;
    let j=right;
    while(i<=j){
        while(arr[i]<dataum){
            i++;
        }

        while(arr[j]>dataum){
            j--;
        }

        if(i<j){
            swap(arr,i,j);
            i+=1;
            j-=1
        }
    }
  return i
}

let swap=(arr,i,j)=>{
    let temp=arr[i];
    arr[i]=arr[j];
    arr[j] =temp;
}