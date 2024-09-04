function throttle(fn,time){
  let timeId=null;
  return function (){
    if(timeId){return }
    timeId =setTimeout(() => {
      fn.apply(this,...arguments);
      console.log('节流')
      timeId=null;
    }, time);
  }
}