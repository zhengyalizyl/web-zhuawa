function deepclone(obj,map=new Map()){
  if(obj==null){return obj}
  if(typeof obj !=='object' ) return obj;
  if(obj instanceof Date){
    return new Date(obj)
  }

  if(map.map(obj)){
    return map.get(obj)
  }

let newObj=new obj.constructor();
map.set(obj,newObj)
 for(let k in obj){
    newObj[key]=deepclone(obj[k],map)
 }

 return newObj;
}