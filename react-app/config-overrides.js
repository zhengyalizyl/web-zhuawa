// 在根目录下新增config-overrides.js文件并新增如下配置
const  {name} =require('./package.json');

module.exports={
    webpack:(config)=>{
      config.output.library = `${name}-[name]`;//也就是放在windows上面是window.react-app
      config.output.libraryTarget = "umd";
      config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
      return config;
    }
}