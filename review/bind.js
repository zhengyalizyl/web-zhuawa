//创建一个新函数
//绑定this
//可以传入参数
// let foo={
//   value:1,
// }

// function bar(){
//   console.log(this.value)
// }

// var bindFoo=bar.bind(foo)
// bindFoo();

// Function.prototype.bind2=function(context){
//   var selft =this;
//   return function (){
//     return selft.apply(context)
//   }
// }


// let foo={
//   value:1,
// }

// function bar(name,age){
//   console.log(this.value,name,age) //1 test h
// }

// var bindFoo=bar.bind(foo,'test')
// bindFoo('h');


// Function.prototype.bind2=function(context,...args){
//   var selft =this;
//   return function (...returnArgs){
//     return selft.apply(context,[...args,...returnArgs])
//   }
// }


//bind绑定函数可以使用new操作符创建对象,this值被忽略
let foo={
  value:1,
}

function bar(name,age){
  this.habit='zyl';
  console.log(this.value,name,age) //1 test h
}

bar.prototype.friend="122";
var bindFoo=bar.bind(foo,'test')
let obj=new bindFoo('h');


Function.prototype.bind2=function(context,...args){
  var selft =this;
  let fBound=function (...returnArgs){
    return selft.apply(this instanceof fBound?this: context,[...args,...returnArgs])
  }
  //为了防止原型链的影响
  let fn=function(){};
  fn.prototype=this.protptype;

  fBound.prototype=new fn();
  
   

  return  fBound
}