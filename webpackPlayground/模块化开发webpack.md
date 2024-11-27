- 从0-1使用webpack进行工程搭建 vue React
- 对webpack执行过程
- 常用的plugins自定义自己的插件tapable事件机制
- 常用的loaders自定义自己的loader原理babel-loader ast
- 优化
   - 体积
   - 速度
  
## 执行过程

- entry 入口
- module 模块 一个模块对应一个文件
- chunk 代码块 多个模块可以合并成一个代码块 如果有异步模块化，会单独拆出chunk
- loader 模块转换器
- plugin 扩展插件
  
### 流程概括

  - 初始化参数：从配置文件和shell语句中读取并合并参数，得出最终的参数options
  - 开始编译 options Compiler对象，加载所有插件（事件注册）执行对象run方法，开始执行编译
  - 确定入口 entry
  - 编译模块 moduleGraph
  - chunkGraph main(moduleGraph) =>import('asyncModule')
  - 输出资源 把chunk输出到文件列表中 done emit
  

## webpack 配置
- entry
  - string './src/index.js'
  - array ["./src/index.js",""],
  - object {a:'./src/index.js',b:''} key为chunk name =>js main

- output 输出文件配置
  filename
  - id,
  - name,
  - hash '[name][hash].js' 基于整体项目构建过程生成唯一的哈希值
  - chunkhash '[name][chunkhash].js' 基于每个代码维度生成哈希
  
  - publicPath 线上资源的url前缀

   基础库 antd
  - library 导出库的名称antd
  - libraryTarget 以何种的方式导出库 commonjs module umd

- module 如何处理模块
   - rules 配置模块的读取和解析规则
      - test
      - use 默认从右到左执行 enforce
      - 可以传入参数options
  
- resolve 
   - 如何寻找模块多对应的文件

```js
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.json']
  }
```

### 总结
- entry 入口
- output 输出
- module 模块
- resolve 如何解析模块
- plugin 配置插件
- devServer 开发服务器配置

为什么对文件进行打包?

- 转换文件 更好的兼容性 babel core-js polyfill
- 产物进行优化 代码压缩 代码丑化 减少文件体积 源码安全问题
- 不同文件资源


### 如何自定义插件

webpack 运行的生命周期会广播很多事件，plugin监听事件，合适时机通过webpack提供的api改变输出结果
Compiler compilation 对象
Compiler 包含所有配置信息 options loaders plugins
Compilation 当前模块资源，编译生成的资源

#### 事件流
tapable
Compiler Compilation 继承自Tapable能够广播和监听事件

发布订阅模式的插件机制

事件注册 同步 异步
```js
 const { 
  SyncHook,
  SyncLoopHook
  } =require('tapable');

 const hook=new SyncHook(["compilation",'arg1','arg2']);

//注册事件
hook.tap('flag1',(compilation,arg1,arg2)=>{
  
})
hook.tap('flag2',(compilation,arg1,arg2)=>{

})

//调用事件
hook.call('flag1',(compilation,arg1,arg2)=>{})

export default class CusPlugin{
  constructor(option){

  }
  apply(compiler){
  }
}

```
