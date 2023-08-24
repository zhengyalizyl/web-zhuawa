class FileListPlugin{
   constructor(filename){
    this.filename =filename;
   }

   apply(compiler){
    compiler.hooks.emit.tap('FileListPlugin',(compilation)=>{
        let assets=compilation.assets;
        let content='';
        Object.entries(assets).forEach(([filename,stateObj])=>{
            content+=`文件名：${filename} 大小:${stateObj.size()}\n`;
        })
        console.log(content)
    })
   }
}

module.exports=FileListPlugin;