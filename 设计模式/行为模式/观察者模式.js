getAddress().then((res)=>{
  const address =res.address;

  A.update(address); //更新地址具体位置
  B.next(address);//渲染商家页面
  C.change(address);
  D.init(address);
})


const observers=[];
observers.push(A.update);
observers.push(B.next);
observers.push(C.change);
observers.push(D.init);

function notifyObservers(address){
  observers.forEach(observer=>observer(address));
}