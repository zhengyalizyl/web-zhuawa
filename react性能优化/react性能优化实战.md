# react性能优化实战

## encode bundle


## 性能优化

### react 常见性能优化方式
UI = render(data)
减少不必要的更新
1. purComponent
   
useMemo
<!---适用于计算大量的场景-->
父组件
const a =useMemo(()=>{return a+b},[a,b])
   
子组件
<!---传递给子组件-->
<ChildComponent a={a} b={b} />

useCallback

const renderFooter =useCallback(()=>{},[render])
{renderFooter()}
<!---适用于传递给子组件的函数-->

useMemo 和 useCallback 的区别
useMemo 返回的是计算的结果
useCallback 返回的是函数

<!--将状态的变动下发到最近的颗粒度上-->

## example
didmount didupdate

render commit

## 通用优化方式
1. scheduler usedeferred
   
HOC
```react
<Tour>
<component/>
</Tour>
```

monorepo
- apps //应用维度
   - a
     - src
         - pages
         - components
         - hooks
         - context
           - aContext.ts
       - config
       - utils 
- packages
  - pc-common
    - components
    - utils
    - consts
    - hooks
  -  h5-common
    - components
    - utils
    - consts
    - hooks
  - config
  - utils
  - tsconfig

package.json
tsconfig.json alias -> 'xxx':'@/config'

## 懒加载

## 无限滚动




