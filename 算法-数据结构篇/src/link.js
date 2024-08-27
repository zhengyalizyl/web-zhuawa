function traverse(header){
  if(header==null){
    return 
  }

  //前序位置，正着输出
  console.log(header.val);
  traverse(header.next);
  //后序位置,即就是一个倒着输出
}