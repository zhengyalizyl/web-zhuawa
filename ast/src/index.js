const parser=require('@babel/parser');//接收源码，进行词法分析，语法分析，生成AST
const traverse=require('@babel/traverse');//接收ast会进行节点替换，删除添加节点
const generator = require('@babel/generator');//生成代码

const transToLet=(code)=>{
  const ast=parser.parse(code);

  const visitor={
    VariableDeclartion(path){
        if(path.node.type==='VariableDeclartio'){
          if(path.node.kind==='var'){
            path.node.kind='let'
          }
        }
    }
  }

  traverse.default(ast,visitor);
  const newCode=generator.default(ast,{},code).code;
  return newCode
}


const code=`
var b=2;
`;

console.log(transToLet(code))

