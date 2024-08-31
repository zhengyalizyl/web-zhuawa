const obj={
   key:{
     a:1,
     b:2,
     c:'s',
     d:new Date();
   },
   key2:{
    a:1,
     b:2,
     c:'s',
     arr:[1,2,3]
   }
}

obj.a=obj;

function deepCopy(obj,map=new Map()){
  if(obj==null){ return obj}
  if(typeof obj!=='object') return obj;
  if (obj instanceof RegExp) return new RegExp(obj);
  if(obj instanceof Date){ return new Date(obj) }
  if(map.map(obj)){
    return map.get(obj)//为了解决obj.a=obj;
  }
  //  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
   let cloneObj=new obj.constructor();//为了解决有数组的问题即obj.key2.arr为数组问题
   map.set(obj,cloneObj)
   for(let key in obj){
     cloneObj[key] =deepCopy(obj[key],map)
   }
   return cloneObj
}
