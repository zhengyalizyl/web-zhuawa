function afn(a){
  return a*2;
}

function bfn(b){
  return b*3;
}

let compose =(a,b)=>c=>a(b(c));
let myfn=compose(afn,bfn);
console.log(myfn(2));

///compose是从右到左
 compose=(...fns)=>val=>fns.reverse().reduce((acc,fn)=>fn(acc),val);


 compose=(...fns)=>val=>fns.reduceRight((acc,fn)=>fn(acc),val)