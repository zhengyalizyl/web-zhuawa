function asyncToPromise(generatorFn){
  const g=generatorFn();
  function handleResult(result){
    if(result.done){
      return Promise.resolve(result.value)
    }
    return Promise.resolve(result.value).then(res=>handleResult(g.next(res)).catch(err=>handleResult(g.throw(err))))
  }


  try {
    return handleResult(g.next())
  } catch (error) {
    return Promise.reject(err)
  }
}