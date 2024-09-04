async function limitPormise(urls,handler,limit){
  const  queue =[...urls];
  const promises=queue.slice(0,limit).map((url,index)=>{
     return handler(url).then(()=>{
       return  index
     })
  })

  for(let  i=0;i<queue.length;i+=1){
    const url=queue[i]
   const firstIndex= await Promise.race(promises);
   promises[firstIndex]=handler(url).then(()=>{
      return firstIndex;
   })
   if(i==queue.length-1){
    return Promise.all(promises)
   }
  }
}