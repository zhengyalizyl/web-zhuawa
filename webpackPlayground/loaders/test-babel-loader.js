const babelCore = require('@babel/core');
module.exports =function (source){
  console.log(source,'self-loader');
  console.log('options',this.getOptions());
  const options = this.getOptions();
   
  // 有些场景需要io，是异步操作，标明异步loader
  const callback =this.async();
  babelCore.transform(source,options,(err,res)=>{
     if(err){
      callback(err)
     }else{
      callback(null,res.code)
     }
  });
  return babelCore.transform(source,options).code;
}