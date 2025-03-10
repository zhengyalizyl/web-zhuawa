### 详细说说vite5工程化配置细节，常见配置和优化手段
webpack、parcel、rollup
vite bundleless - 少打包，浏览器 esm支持

- 模块化规范，commonjs、amd、cmd、esm、umd
- 浏览器ESM,拥抱新技术，时期都用新的产品，JQuery
- 本地生成构建提速，本地esbuild、生产rollup，可能会有生产鱼本地构建产物差异的问题(voidZero -> rolldown oxc)
- 产物构建优化，rollup优化
  
面试SOP，开放性问题的话，背景和方案(webpack、rollup、swc、turbopack、rspack、rsbuild) 来介绍

#### Vite5基础使用

脚手架，pnpm

```bash
pnpm create vite
```
脚手架和命令行工具使用以及架构和开发，企业级脚手架命令行工具项目实战


### 优化配置
- 代码压缩，有没有压缩插件gzip
- 分 chunk
  - 自动
  - 手动


#### 了解过微内核设计思想吗？Vite5的插件化设计思想是怎样完成个性化打包构建需求？

面试 SOP

- 插件化设计思想
   - 1. 插件化底座
   - 2. 插件协议、数据协议、定义方式、生命周期的钩子
- 自定义插件
  - config
  - transform
  - generateBundle
  
### 我们有rspack这类构建工具，如果让你从零到一实现Vite全生态，具体思路是什么？
- bundleless
- 统一化的ast,统一工具链描述语言
- vite -> oxc ->rolldown ->vitest 

### 概述vite打包构成
1. 初始化,vite.config.ts
2. 解析入口，俩种解析形式
   1. 应用构建,html script
   2. 子包，构建产物,build
3. 插件底座初始化，插件生命周期调用
4. 优化处理
5. 拆分
6. 输出代码
7. 资源优化




