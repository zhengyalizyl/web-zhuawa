(function (window){

  let data="test";

  function foo(){
    console.log(data);
  }

  function bar(){
    console.log(bar);
  }

  window.myModule={
     foo,
     bar
  }
})(window)