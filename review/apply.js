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

console.log(bar.apply2(obj, ['kevin', 18]));


Function.prototype.apply2=function(context,rest){
  context=context||window;
  context.fn=this;
  let res=null;
  if(!rest){
     context.fn();
  }else{
    context.fn(...rest);
  }
  delete context.fn;
  return res;
}