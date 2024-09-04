let foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1

//这个相当于
// let foo={
//    value:1,
//    bar:function(){
//    console.log(this.value)
//    }
// }

//没有返回值
Function.prototype.call2=function(context,...rest){
    context =context||window;
    context.fn=this;
    context.fn(...rest);
    delete context.fn;
}


var obj = {
  value: 1
}

  function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call2(obj, 'kevin', 18));
//有返回值
Function.prototype.call2=function(context,...rest){
  context=context||window;
  context.fn=this;
  let res=context.fn(...rest);
  delete context.fn;
  return res;
}