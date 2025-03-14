const isStrNumber=(str)=>{
  if(typeof str === 'number'){ return true}
  if(typeof str!=='string'){ return false }
  if(str===' '||str===''){return false};
  return !isNaN(str);
}

const isStrLetter=str=>{
  if(typeof str !=='string'){ return false}
  if(str===' '||str===''){return false};
  return str.toLowerCase() !==str.toUpperCase();
}

//词法分析器
const tokenizer =(input)=>{
  const tokens =[];
  if(typeof input !== 'string'){
    return tokens;
  }

  for(let i=0;i<input.length;i++){
    const char =input[i];
    switch(true){
       case['(',')'].includes(char):
       tokens.push({
         type:'paren',
         value:char
       })
       break;
      case char ===' ':
        break;
      case isStrNumber(char):
        let fullNum =char;
        let nextChar=input[++i];
        if(!isStrNumber(nextChar)){
          i--;
        }
        while(isStrNumber(nextChar)){
          fullNum+=nextChar;
          nextChar=input[++i];
        }
        tokens.push({
          type:'number',
          value:fullNum,
        })
        break;
      default:
        let fullStr=char;
        let nextStr=input[++i];
        if(!(isStrLetter(nextStr)||isStrNumber(nextStr))){
          i--;
        }
        while(isStrLetter(nextStr)||isStrNumber(nextStr)){
          fullStr+=nextStr;
          nextStr=input[++i];
        }
        tokens.push({
          type:'name',
          value:fullStr,
        })
        break;
    }
  }
  return tokens;
}

const  parser=(tokens)=>{
   const ast={
    type:'Program',
    body:[]
   };

   let current=0;

   const handler=()=>{
    let item =tokens[current];
    current++;
    if(!item){
      return ;
    }
    switch(true){
      case item.type==='number':
        return {
          type:'NumberLiteral',
          value: item.value
        }
        //name不是一个有效单元，只有(是一个有效单元
       case item.type==='paren' && item.value=='(':
          item =tokens[current];
          const astNode={
            type:'CallExpression',
            name:item.value,
            params:[]
          }
          item=tokens[++current];
        while(item.type!='paren'||item.type=='paren'&&item.value !==')'){
           const subItem = handler();
           if(subItem){
            astNode.params.push(subItem);
           }
           item=tokens[current];
        }
        current++;
        return astNode;
      default:
        return ;
    }
    
   }
   while(current <=tokens.length-1){
    const result =handler();
    if(result){
      ast.body.push(result);
    }
   }
   return ast
}

const traverse=(ast,visitor)=>{
  //单个节点和数组的情况 
   const  traverserNode=(node,parent)=>{
   const enter = visitor[node.type]?.enter;

    //什么时候调用enter节点
    if(enter){
      enter(node,parent);
    }
    switch(node.type){
      case 'Program':
        traverseArr(node.body,node);
       break;
      case 'CallExpression':
        traverseArr(node.params,node);
    }
   };
   const traverseArr=(nodes,parent)=>{
    nodes.forEach((node)=>{
      traverserNode(node,parent);
    })
   }
  traverserNode(ast,null);
}

const transform=(ast)=>{
  const newAst={
    type:'Program',
    body:[]
  }
  
  ast._context =newAst.body;
  traverse(ast,{
     NumberLiteral:{
       enter(node,parent){
            parent?._context?.push({
                type:'NumberLiteral',
                value:node.value
            })
       }
     },
     CallExpression:{
       enter(node,parent){
         let expression = {
            type:'CallExpression',
            callee:{
              type:'Identifier',
              name:node.name
            },
            arguments:[]
         }
         node._context=expression.arguments;
         if(parent?.type!=='CallExpression'){
            expression={
              type:'ExpressionStatement',
              expression:expression
            }
         }
         parent?._context?.push(expression);

       }
     }
  })
  console.log(JSON.stringify(ast,null,2))
  return newAst;
}


const codeGenerator =(newAst)=>{
    switch(newAst.type){
      case 'Program':
        return newAst.body.map(codeGenerator).join('\n');
      case 'CallExpression':
        return [codeGenerator(newAst.callee),
          '(',
          newAst.arguments.map(codeGenerator).join(','),
          ')'].join('');
      case 'NumberLiteral':
        return newAst.value;
      case 'Identifier':
        return newAst.name;
      case 'ExpressionStatement':
        return codeGenerator(newAst.expression)+';';
      default:
        throw new Error('unhandled node type');
    }
}

const compiler=(input)=>{
  return codeGenerator(transform(parser(tokenizer(input))));
}


module.exports = {
    tokenizer,
    parser,
    transform,
    codeGenerator,
    compiler,
}