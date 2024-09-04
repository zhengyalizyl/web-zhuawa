function debounce(fn,time){
  let timeId=null;

  return function(){
    if(timeId){
      clearTimeout(timeId);
    }
    timeId=setTimeout(() => {
      console.log('防抖');
      fn.apply(this,...arguments)
      timeId=null;
    }, time);
  }
}