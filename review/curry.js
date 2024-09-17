//只能处理二元的情况
// const curry=function(fn){
//   return function(x){
//      return function(y){
//         fn(x,y)
//      }
//   }
// }
// let fn=(x,y)=>x+y;
// let myfn=curry(fn);
// console.log(myfn(1)(2))


//多元的情况
const curry=function(fn){
  return function curridFn(...args){
     if(args.length<fn.length){
          return function(){
            return curridFn.apply(null,...args.concat([...arguments]));
          }
     }
     return fn(...args);
  }
}



const fn=(x,y,z,a)=>x+y+z+a;
const myfn=curry(fn);
console.log(myfn(1)(2)(3)(4))



