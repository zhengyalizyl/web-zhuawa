/** 数组结构数据 */
const arrayData = [
  { id: 2, title: '中国', parent_id: 0 },
  { id: 3, title: '广东省', parent_id: 2 },
  { id: 4, title: '广州市', parent_id: 3 },
  { id: 5, title: '天河区', parent_id: 4 },
  { id: 6, title: '湖南省', parent_id: 2 },
  { id: 1, title: '俄罗斯', parent_id: 0 }
]


/**
 * 递归查找添加children
 * @param {数组数据} data 
 * @param {存放返回结果} result 
 * @param {父id} pid 
 */

const getChild=(data,res,pid)=>{
 for(let i=0;i<data.length;i+=1){
   if(data[i].parent_id===pid){
    const newItem = { children: [], ...data[i] }
       res.push(newItem)
       getChild(data,newItem.children,data[i].id)
   }
 }
}

/**
 * 转化方法
 * @param {数组数据} data 
 * @param {父id} pid 
 * @returns 
 */

const arrayToTree=(data,pid)=>{
      
   let result=[];
   getChild(data,result,pid);
   return result;
}



const a=arrayToTree(arrayData,0);
console.log(JSON.stringify(a,null,2))





/** 树状形结构数据treeData */
const treeData = [
  {
    id: 2, title: '中国', parent_id: 0,
    children: [
      {
        id: 3, title: '广东省', parent_id: 2,
        children: [
          {
            id: 4, title: '广州市', parent_id: 3,
            children: [
              { id: 5, title: '天河区', parent_id: 4 }
            ]
          }
        ]
      },
      { id: 6, title: '湖南省', parent_id: 2 }
    ]
  },
  { id: 1, title: '俄罗斯', parent_id: 0, },
]


const treeToArray=(data,parentId)=>{
    let result=[];
    for(let i=0;i<data.length;i+=1){
      const item=data[i];
       let newItem={...item,parentId};
       result.push(newItem);
       if(node.children){
         result=[...result,treeToArray(item.children,newItem)]
       }
    }
}
