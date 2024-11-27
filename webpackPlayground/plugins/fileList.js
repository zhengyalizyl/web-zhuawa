//输出filelist.md 包含生成资源 文件名 文件数量
class FileListPlugin {
  constructor(options={}) {
    this.options = options;
    this.filename = options?.filename || 'fileList.md'
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      let fileList = '';
      for (let filename in compilation.assets) {
        fileList += `- ${filename}\n`;
      }
      compilation.assets[this.filename] = {
        source: () => fileList,
        size: () => fileList.length
      }
    })
  }
}


exports=module.exports= FileListPlugin