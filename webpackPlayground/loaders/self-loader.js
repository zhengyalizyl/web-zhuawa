module.exports =function (source){
  console.log(source,'self-loader');
  console.log('options',this.getOptions());
  return source;
}