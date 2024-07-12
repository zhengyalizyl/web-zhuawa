let foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1




Function.prototype.call2 =function(context){
  context.fn= this;
  context.fn();
  delete context.fn
}