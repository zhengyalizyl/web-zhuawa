1. 类型约束
   1. js常用类型
   2. 
2. 类型定义
3. 类型操作
   1. 对象操作是一样的
   2. 类型谓词函数与类型守卫函数的区别
4.  高级用法
   1. 类型推导，infer
   2. 条件类型，extends
5. TypeScript 编译器原理
6. TypeScript 插件化实现
7. TypeScript 进阶优化
   1. go 基础，typescript-go


### interface 和 type的区别
1. 定义方式不同,interface 用于定义接口（面向对象），type 用于定义类型（面向类型）
2. interface 可以继承,type不行
3. interface 可以声明合并,type不行

使用场景
- interface 面向对象，接口继承场景
- 复杂类型，频繁派生新类型，使用 type

### 不同项目的TypeScript5使用不同，请说说在各种不同业务形态下的TypeScript5使用经验

### react
1. 基本配置
   - jsx
   - moduleResoultion
2. 特性
    - props，interface 做定义
    - 事件处理，范型
    - 