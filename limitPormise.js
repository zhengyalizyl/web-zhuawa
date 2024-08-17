
async function limitPormise(urls, handler, limit) {
  let queue = [...urls];
  let promises = queue.splice(0, limit).map((url, index )=> {
    return handler(url).then(() => {
      return index
    })
  })

  return queue.reduce((prePromise, url) => {
    return prePromise.then(() => {
      return Promise.race(promises)
    }).then(firstIndex => {
      promises[firstIndex] = handler(url).then(() => {
        return firstIndex
      })
    }).catch(err => {
      console.log(err)
    })
  }, Promise.resolve)
    .then(() => {
      return Promise.all(promises)
    })
}

//方法二
async function limitPormise(urls, handler, limit) {
  let queue = [...urls];
  let promises = queue.splice(0, limit).map((url, index => {
    return handler(url).then(() => {
      return index
    })
  }))

  for (let i = 0; i < promises.length; i += 1) {
      let url=queue[i];
      let firstIndex=await Promise.race(promises);
      promises[firstIndex] = handler(url).then(() => {
        return firstIndex
      })

      if(i==queue.length-1){
         return Promise.all(promises)
      }
  }

}

function loadImg(url){
  return new Promise((resolve,reject)=>{
     const  img=new Image();
     img.onload=function(){
      console.log('一张图片加载完成');
      resolve(img)
     }
     img.onerror=function(){
       reject(new Error('can not load imag'))
     }

     img.src=url;
  })

}


limitPormise(urls,loadImg,3).then(res=>{
  console.log('图片加载完')
  console.log(res);
}).catch(errr=>console.log('图片加载失败'))