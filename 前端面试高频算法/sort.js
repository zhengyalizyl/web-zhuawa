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



const quickSort=arr=>{
  const length =arr.length;
  if(length<2){
    return arr;
  }
  const midIndex=Math.floor(length/2);
  const valArr=arr.splice(midIndex,1);

  const midIndexVal=valArr[0];
  const left=[];//比基准点小的
  const right=[];//比基准点大的
  for(let i=0;i<arr.length;i++){
    if(arr[i]<midIndexVal){
      left.push(arr[i])
    }else{
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(midIndexVal,quickSort(right))
}


function fiber(n){
  if(n<0){return 0}
  if(n===1){
    return 1;
  }
  return fiber(n-1)+fiber(n-2);
}


function fib(n){
  if(n<0){return 0}
  if(n===1){
    return 1;
  }
 
  let arr=[0,1];
  for(let i=2;i<n;i++){
    arr[i]=arr[i-1]+arr[i-2];
  }
  return arr[n];
}

// 贪心找到当下最优解
// 背包问题

//部分背包 每个物品都有价格 体积
// f[w] =max(f[w],f[w-w[i]]) +v[i]
function knapsack(capacity,objectArr){
  const n = objectArr.length;
 const f=[];

 for(let w=0;w<=capacity;w++){
  for(let i=0;i<n;i++){
    if(w===0){
      f[w]=0;

    }else if(objectArr[i].size<=w){
      //包的大小比尺寸小
      const size = objectArr[i].size;
      const value = objectArr[i].value;
      f[w] = Math.max(f[w],f[w-size]+value);
    }else {
      f[w] = Math.max(f[w],f[w-1])
    }
  }
 }
 return f[capacity];
}


//前序遍历
const preOrderTraverse=(root)=>{
  let result=[];
  const preOrderTraverseNode=(node)=>{
    let result=[];
    if(node){
      result.push(node.value);
      preOrderTraverseNode(node.left);
      preOrderTraverseNode(node.right);
    }
  }
  preOrderTraverseNode(root);
  return result;
}

function dfs(node,nodeList){
  if(node){
    nodeList.push(node.value);
    const children = node.children;
    for(let i=0;i<children.length;i++){
      dfs(children[i],nodeList);
    }
  }
  return nodeList;
}

function bfs(node){
  const nodes=[];
  let i=0;
  if(node){
    nodes.push(node);
    bfs(node.nextSibling);  
    node=nodes[i++];
    bfs(node.firstChild);
  }
  return nodes;
}


