const fs= require('fs');
const path= require('path');
const parser =require('@babel/parser');
const traverse =require('@babel/traverse').default;
const babel =require('@babel/core');


function parseModules(file){
  const entry=getModuleInfo(file);
  const temp=[entry];
  const depsGraph={};
  getDeps(temp,entry);
  temp.forEach(moduleInfo=>{
    depsGraph[moduleInfo.file]={
      deps:moduleInfo.deps,
      code:moduleInfo.code
    }
  })
  return depsGraph;
}

function getDeps(temp,{deps}){
  Object.keys(deps).forEach(key=>{
    const child =getModuleInfo(deps[key]);
    temp.push(child);
    getDeps(temp,child);
  })
}



function getModuleInfo(){
  const body =fs.readFileSync(file,'utf-8');
  const ast=parser.parse(body,{sourceType:'module'});
  const deps={};
  traverse(ast,{
    ImportDeclaration({node}){
       const dirname=path.dirname(file);
       const absPath='./'+path.join(dirname,node.source.value);
       deps[node.source.value] =absPath;
    }
  })
  const {code}=babel.transformFromAst(ast,null,{presets:["@babel/preset-env"]})
   const moduleInfo={file,deps,code};
   return moduleInfo;
}
function bundle(file){
  const depsGraph=JSON.stringify(parseModules(file));

  return `(function(graph){
      function require(file){
          var exports={};
          function absRequire(realPath){
                return require(graph[file.deps[realPath]])
          }
          (function(require,exports,code){
             eval(code)
          })(absRequire,exports,graph[file].code)
          return exports;
      }
      require('${file}')
  })(
    ${depsGraph}
  )`
}

const content =bundle('./src/index.js');
fs.writeFileSync('./dist/bundle.js',content)