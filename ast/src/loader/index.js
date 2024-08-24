const parser=require('@babel/parser');
const traverse =require('@babel/traverse').default;
const generator=require('@babel/generator').default;
const t=require('@babel/types');

// 单一原则，每个loader只做一件事情
//支持链式调用
//统一原则，输入和输出均为字符串，各个loader完全独立，即插即用
module.exports=function (source){
  const ast=parser.parse(source,{sourceType:'module'});
  traverse(ast,{
    CallExpression(path){
      if(t.isMemberExpression(path.node.callee)&&t.isIdentifier(path.node.callee.object,{name:'console'})){
        path.remove();
      }
    }
  })

  const  output=generator(ast,{},source);
  return  output.code;
}