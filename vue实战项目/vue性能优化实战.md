# vue性能优化实战

业务项目：
1-2 点 使用vue 什么技术手段 实现xxx 功能 达到了xxx 目的

- 前端测试 vitest 单元测试 快照测试 验证组件功能
- cypress 自动化验证
- i18n 多国语言处理
- css性能优化
  
 -  unocss
    即时按需的原子化css引擎   
   - 原子化css
   - 最小化css类为单位，实现高度可复用性
      .m-1 margin:1px; 
      .p-2 padding:2px;
   - scoped css module 
      html页面大小 ssr
      css文件大小 尽可能小


3-4点 亮点

- 研发提效
  - 组件库封装
  - 底层方法抽取
  - 微前端 打造主子应用 qiankun wujie
  - 使用前端编码脚手架 快速生成规范文件 -- 自定义脚手架
  - 引用前端稳定性 SDK
  - 实现自定义的hooks平台 提高开发效率 参考vueuse 能力
  
- 性能优化
  - vue2 性能优化 
    - webpack优化 速度 体积
  -  vue2 -> vue3
      -  迁移 
  -  vue3 性能优化
    - 数据指标 哪些性能指标 如何收集 p95

      - FCP：页面上呈现的第一个dom元素的时间 
      - LCP：最大内容的渲染时间
      - TTI：time to interactive可交互时间
      - TTFB: time to first byte 首字节时间 网络性能 服务器响应能力
  
      performance

    - 其他方便性能优化手段
      - 图片治理
      - 脚本治理
      - css 治理
      - ssr 首屏渲染
    
    数据支撑：
    - LCP 从多少秒提升到多少秒 提升到多少秒 提升百分比

## 自定义前端脚手架
- init 初始化 vue 定制的模版工程
- encode-cli create 创建规范文件
- fix
- scan
- 补充更多功能
- upload image 上传图片到cdn


## 前端稳定性 SDK

## 加载优化
静态资源处理
- 包体积优化 tree shaking
  vue transition
- es模块
  lodash

  rollup-plugin-visualizer

  - 代码分割
  按需或者并行加载文件
  ```js
    function loadLazy(){
      return import('./lazy.js')
    }
  ```    

  ```js
  import {defineAsyncComponent } from 'vue'
  const Foo=defineAsyncComponent(()=>import('./Foo.vue'))
  ```

## 更新优化
- 非必要不更新
 改变状态维度 props state

- 讲究props稳定性
  ```js
   <ListItem
    v-for="item in list"
    :id="item.id"
    :acitve="activeId===item.id"
   />
  ```

  - v-once
  - v-memo

### 通用的优化
- 长列表
  虚拟滚动

### 减少大型不可变数据的响应性的开销
```js
  const shallowArray=shallowRef([]);

  //不触发更新
  shallowArray.value.push(newObject);

  //会触发更新
  shallowArray.value=[...shallowArray.value,newObject]
```

### 避免不必要组件抽象