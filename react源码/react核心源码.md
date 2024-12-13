# React理念介绍
我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。
ui = render (data) -> 单向数据流

如何提升页面响应交互？
- CPU卡顿：大量计算操作导致的性能问题
- IO卡顿：网络请求延时的，无法快速响应

1. CPU卡顿
  - 在浏览器刷新频率为60HZ的情况下（即1000ms / 60HZ = 16.6ms）浏览器刷新一次
  - 浏览器里JS线程与GUI线程是互斥的，不可同时执行，所以JS脚本和浏览器的render、painting不能同时执行，所以执行顺序为：JS脚本执行 ->样式布局 ->样式绘制，JS执行时间超过16.6ms，就不会执行render与painting了

```js
// index.js
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");

// ReactDOM.render(<App />, rootElement);
ReactDOM.createRoot(rootElement).render(<App />);

// APP.js
import "./styles.css";

export default function App() {
  const len = 3000;

  return (
    <ul>
      {Array(len)
        .fill(0)
        .map((_, i) => (
          <li>{i}</li>
        ))}
    </ul>
  );
}

```

![react16.8之前的图](/Volumes/E/web-zhuawa/images/react16.8之前的图.png)

React 是如何解决这个问题的？

在浏览器每一帧的时间中，预留一些时间给JS线程，React利用这部分时间更新组件（预留的初始时间是5ms）。

https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119

时间切片：把更新过程碎片化，把一个耗时长的任务分成很多小片。执行非阻塞渲染，基于优先级应用更新以及在后台预渲染内容。

在开启concurrent mode后

```js
// 通过使用ReactDOM.unstable_createRoot开启Concurrent Mode
// ReactDOM.render(<App/>, rootEl);  
ReactDOM.createRoot(rootEl).render(<App/>);
```

![react16.8之后的图](/Volumes/E/web-zhuawa/images/react16.8之后的图.png)

开启时间切片后，React长尾任务会被切到每一帧任务里，执行时间在5ms左右，就可以保障rendering与painting时间了

1.  IO卡顿

假设页面加载，是否展示loading

停留时间长：显示loading，加载完成后隐藏

停留时间短：不显示loading，用户无感知，不然loading闪一下

-   Suspense：https://17.reactjs.org/docs/concurrent-mode-suspense.html
-   useDeferredValue：https://17.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue

demo：

1.  suspense & useDeferedValue

https://codesandbox.io/s/u6o2q?file=/src/index.js

1.  CM模式会牺牲列表的更新速度，提升输入时的相应速度，重于交互

https://codesandbox.io/s/koyz664q35?file=/src/Clock.js

总结：快速响应 -> 同步的长尾更新转为可中断的异步更新

### 新老React架构对比

React15：

-   Reconciler（协调器）—— 负责找出变化的组件
-   Renderer（渲染器）—— 负责将变化的组件渲染到页面上

Reconciler：

https://zh-hans.reactjs.org/docs/codebase-overview.html#reconcilers

在React中可以通过this.setState、this.forceUpdate、ReactDOM.render等API触发更新。

每当有更新发生时，Reconciler会做如下工作：

1.  调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM
2.  将虚拟DOM和上次更新时的虚拟DOM对比
3.  通过对比找出本次更新中变化的虚拟DOM
4.  通知Renderer将变化的虚拟DOM渲染到页面上

Renderer：

https://zh-hans.reactjs.org/docs/codebase-overview.html#renderers

由于React支持跨平台，所以不同平台有不同的Renderer。我们前端最熟悉的是负责在浏览器环境渲染的Renderer —— ReactDOM。

除此之外，还有：

ReactNative：渲染App原生组件

ReactArt：渲染到Canvas, SVG 或 VML (IE8)

在每次更新发生时，Renderer接到Reconciler通知，将变化的组件渲染在当前宿主环境。

React 15架构的缺点

在Reconciler中，mount的组件会调用[mountComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498)，update的组件会调用[updateComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877)。这两个方法会递归更新子组件

递归的缺点：

1.  当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿
2.  React 15不支持用可中断的异步更新代替同步的更新

demo：

https://codesandbox.io/s/fervent-sutherland-pf7sg?file=/src/App.js

正常：

![react-click-button-1](/Volumes/E/web-zhuawa/images/react-click-button-1.png)

加入同步更新中断

![react-click-button-2](/Volumes/E/web-zhuawa/images/react-click-button-2.png)

React16：

-   Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
-   Reconciler（协调器）—— 负责找出变化的组件
-   Renderer（渲染器）—— 负责将变化的组件渲染到页面上

Scheduler（调度器）：

需要一种机制，当浏览器有剩余时间时通知我们，从而完成任务调度。

部分浏览器已经实现了这个API，这就是[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。但是由于以下因素，React放弃使用：

-   浏览器兼容性
-   触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的requestIdleCallback触发的频率会变得很低

基于以上原因，React实现了功能更完备的requestIdleCallbackpolyfill，这就是Scheduler。除了在空闲时触发回调的功能外，Scheduler还提供了多种调度优先级供任务设置。下节课详解

Reconciler（协调器）

我们知道，在React15中Reconciler是递归处理虚拟DOM的。让我们看看[React16的Reconciler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)

```js
// 更新工作从递归变成了可以中断的循环过程。每次循环都会调用shouldYield判断当前是否有剩余时间。

/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

Q：如何处理中断更新时DOM渲染不完全？

在React16中，Reconciler与Renderer不再是交替工作。当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上代表增/删/更新的标记

标记类型详情：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js

```js
export const Placement = /*             / 0b0000000000010;
export const Update = /                / 0b0000000000100;
export const PlacementAndUpdate = /    / 0b0000000000110;
export const Deletion = /              */ 0b0000000001000;
```

整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。

详细官方介绍：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js

Renderer（渲染器）

Renderer根据Reconciler为虚拟DOM打的标记，同步执行对应的DOM操作

![react-渲染器](/Volumes/E/web-zhuawa/images/react-渲染器.png)

其中红框中的步骤随时可能由于以下原因被中断：

-   有其他更高优任务需要先更新
-   当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的DOM，所以即使反复中断，用户也不会看见更新不完全的DOM

同时，由于Scheduler和Reconciler都是平台无关的，所以React为他们分别单独发布了一个包

### Fiber架构详解

fiber的核心思路：在react中遵循代数效应（algebraic effects）

代数效应是函数式编程中的一个概念，用于将副作用从函数调用中分离。

```js
function getTotalPicNum(user1, user2) {
  const picNum1 = getPicNum(user1);
  const picNum2 = getPicNum(user2);

  return picNum1 + picNum2;
}
```

假设getPickNum需要异步请求：async await？

-   破坏了上下文的一致性，需要调用它的函数也时async

假如有一个类似的try...catch语法 ------try...handle、perform、resume

```js
function getPicNum(name) {
  const picNum = perform name;
  return picNum;
}

try {
  getTotalPicNum('xianzao', 'houwan');
} handle (who) {
  switch (who) {
    case 'xianzao':
      resume with 230;
    case 'houwan':
      resume with 122;
    default:
      resume with 0;
  }
}
```

代数效应：将副作用（例子中为请求图片数量）从函数逻辑中分离，使函数关注点保持纯粹，也就是不用关心是同步还是异步

Example：Hooks，不用关心useState中state是如何保存变化的，我们只需要使用即可

Q：为什么不使用generator？

-   类似async，会影响上下文；
-   generator的执行状态时上下文关联的

```js
function* doWork(A, B, C) {
  var x = doExpensiveWorkA(A);
  yield;
  var y = x + doExpensiveWorkB(B);
  yield;
  var z = y + doExpensiveWorkC(C);
  return z;
}
```

-   单一任务中断执行：ok；
-   中间有高优先级的任务：但是当我们考虑“高优先级任务插队”的情况，如果此时已经完成doExpensiveWorkA与doExpensiveWorkB计算出x与y。此时B组件接收到一个高优更新，由于Generator执行的中间状态是上下文关联的，所以计算y时无法复用之前已经计算出的x，需要重新计算；
-   使用全局变量保存之前的中间状态，引入新的复杂度；

React Fiber

1.  定义：React内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。
2.  功能：
    1.  作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler；
    2.  作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息；
    3.  作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）；

react fiber node定义

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance，静态节点的数据结构属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber，用来链接其他fiber节点形成的fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.subtreeTag = NoSubtreeEffect;
  this.deletions = null;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 作为调度优先级的属性
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).
    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  if (__DEV__) {
    // This isn't directly used but is handy for debugging internals:
    this._debugID = debugCounter++;
    this._debugSource = null;
    this._debugOwner = null;
    this._debugNeedsRemount = false;
    this._debugHookTypes = null;
    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}
```

架构层面

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;

表示的组件结构
function App() {
  return (
    <div>
      i am
      <span>xianzao</span>
    </div>
  )
}
```

Q：为什么指向的父节点是return而不是parent？

因为作为一个工作单元，return指节点执行完completeWork后会返回的下一个节点。子Fiber节点及其兄弟节点完成工作后会返回其父级节点，所以用return指代父级节点

-   作为静态数据结构

```js
// Fiber对应组件的类型 Function/Class...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

-   作为动态工作单元

记录更新相关的信息，主要是updateQueue

Q：React Fiber 如何更新DOM？

使用“双缓存”

在内存中绘制当前的fiber dom，绘制完毕后直接替换上一帧的fiber dom，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况

在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber，正在内存中构建的Fiber树称为workInProgress Fiber，两者通过alternate连接

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React应用的根节点通过current指针指向不同的fiber dom切换，当update时，workInProgressFiber rende完成后会跟currentFiber 替换，下一次更新会将当前currentFiber（上一次的workInProgressFiber）替换

```js
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

-   mount

1.  首次执行ReactDOM.render会创建fiberRootNode（源码中叫fiberRoot）和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是<App/>所在组件树的根节点；
    1.  区分fiberRootNode与rootFiber：因为在应用中我们可以多次调用ReactDOM.render渲染不同的组件树，他们会拥有不同的rootFiber。但是整个应用的根节点只有一个，那就是fiberRootNode；
    2.  fiberRootNode的current会指向当前页面上已渲染内容对应Fiber树，即current Fiber；
    3.  因为是首次渲染，此时页面还没有挂在所有的DOM，所以rootFiber还没有子fiber dom

![current-fiber](/Volumes/E/web-zhuawa/images/current-fiber.png)

2.   render阶段，根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起构建Fiber树，被称为workInProgress Fiber；

 a. 在构建workInProgress Fiber树时会尝试复用current Fiber树中已有的Fiber节点内的属性（后续的diff），在首屏渲染时只有rootFiber存在对应的current fiber（即rootFiber.alternate）

![rootFiber](/Volumes/E/web-zhuawa/images/rootFiber.png)

3.   alternate阶段：此时workInProgress fiber已经构建完成，fiberRootNode的current指向了workInProgress fiber

     ![work-fiber](/Volumes/E/web-zhuawa/images/work-fiber.png)

-   update

1.  假设p元素更新，这会开启一次新的render阶段并构建一棵新的workInProgress Fiber 树，且会尽可能服用显有的current Fiber

![alterlate-current-fiber](/Volumes/E/web-zhuawa/images/alterlate-current-fiber.png)

2.   alternate阶段

workInProgress fiber在更换完后，fiberRootNode的current指针更换

![current-指针](/Volumes/E/web-zhuawa/images/current-指针.png)

## 前置知识

### 源码文件结构

github地址：https://github.com/facebook/react

```js
根目录
├── fixtures        # 包含一些给贡献者准备的小型 React 测试项目
├── packages        # 包含元数据（比如 package.json）和 React 仓库中所有 package 的源码（子目录 src）
├── scripts         # 各种工具链的脚本，比如git、jest、eslint等
```

主要内容在packages中

-   react：
    -   地址：https://github.com/facebook/react/tree/main/packages/react
    -   内容：全局React API，如React.createElement、React.Component等
-   scheduler：
    -   地址：https://github.com/facebook/react/tree/main/packages/scheduler
    -   内容：scheduler实现
-   Shared：
    -   地址：https://github.com/facebook/react/tree/main/packages/shared
    -   内容：其他模块中公用的方法和全局变量
-   Render相关

```j
- react-art
- react-dom                 # 注意这同时是DOM和SSR（服务端渲染）的入口
- react-native-renderer
- react-noop-renderer       # 用于debug fiber（后面会介绍fiber）
- react-test-renderer
```

-   实验性文件

```js
- react-server        # 创建自定义SSR流
- react-client        # 创建自定义的client
- react-fetch         # 用于数据请求
- react-interactions  # 用于测试交互相关的内部特性，比如React的事件模型
- react-reconciler    # Reconciler的实现，你可以用他构建自己的Renderer
```

-   辅助包

```js
- react-is       # 用于测试组件是否是某类型
- react-client   # 创建自定义的流
- react-fetch    # 用于数据请求
- react-refresh  # “热重载”的React官方实现
```

-   react-reconciler（核心关注点）
-   地址：https://github.com/facebook/react/tree/main/packages/react-reconciler
-   内容：React16核心更新内容

### 深入理解JSX

Q：

-   JSX和Fiber节点是同一个东西么？
-   React Component、React Element是同一个东西么，他们和JSX有什么关系？

JSX在编译时会被Babel编译为React.createElement方法，这也是为什么要引入`import React from 'react';`的原因

-   React.createELement

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react/src/ReactElement.js#L348

```js
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 将 config 处理后赋值给 props
    // ...省略
  }

  const childrenLength = arguments.length - 2;
  // 处理 children，会被赋值给props.children
  // ...省略

  // 处理 defaultProps
  // ...省略

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```

在全局API isValidElement里，通过$$typeof判断为REACT_ELEMENT_TYPE即为react元素，所以JSX返回的结构也是react element

```js
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

-   React Component

Q：如何判断组件为class或者function组件

Example：https://codesandbox.io/s/jsx-type-blpuo?file=/src/index.js

ClassComponent对应的Element的type字段为AppClass自身。

FunctionComponent对应的Element的type字段为AppFunc自身。

且无法根据引用类型区分

```js
AppClass instanceof Function === true;
AppFunc instanceof Function === true;
```

实际上，React根据classComponent原型上的isReactComponent判断是否为ClassComponent

```js
ClassComponent.prototype.isReactComponent; // {}
FunctionComponent.prototype.isReactComponent; // undefined
```

-   JSX与Fiber节点的关系
    -   JSX是一种描述当前组件内容的数据结构，他不包含组件schedule、reconcile、render所需的相关信息
        -   比如如下信息就不包括在JSX中：组件在更新中的优先级、组件的state、组件被打上的用于Renderer的标记
    -   Fiber更多地是一种更新机制
        -   在组件mount时，Reconciler根据JSX描述的组件内容生成组件对应的Fiber节点
        -   在update时，Reconciler将JSX与Fiber节点保存的数据对比，生成组件对应的Fiber节点，并根据对比结果为Fiber节点打上标记

## 架构篇

## render阶段

内容：Fiber节点是如何被创建并构建成render树的

### 流程概览

在render的阶段中，根据是同步还是异步，执行performSyncWorkOnRoot 和 performConcurrentWorkOnRoot

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

区别：是否调用shouldYield。如果当前浏览器帧没有剩余时间，shouldYield会中止循环，直到浏览器有空闲时间后再继续遍历

说明：

-   `workInProgress`代表当前已创建的`workInProgress fiber`；
-   `performUnitOfWork`方法会创建下一个Fiber节点并赋值给`workInProgress`，并将`workInProgress`与已创建的Fiber节点连接起来构成Fiber树；

虽然fiber reconciler是从stack reconciler重构而来，但都是通过遍历的方式实现可中断的异步递归

1.  递

首先从`rootFiber`开始向下深度优先遍历。为遍历到的每个Fiber节点调用[beginWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3058)（下面详细讲）；

-   该方法会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来；
-   当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段；

1.  归

在“归”阶段会调用[completeWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L652)（下面详细讲)处理Fiber节点。

-   当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段；
-   如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段；

“递”和“归”阶段会交错执行直到“归”到rootFiber

```js
function App() {
  return (
    <div>
      i am
      <span>text</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

```js
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "i am" Fiber beginWork
5. "i am" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork

// 没有叶子节点是因为React针对只有单一文本子节点的Fiber节点做了性能优化

// 递归的格式
function performUnitOfWork(fiber) {
  // 执行beginWork

  if (fiber.child) {
    performUnitOfWork(fiber.child);
  }

  // 执行completeWork

  if (fiber.sibling) {
    performUnitOfWork(fiber.sibling);
  }
}
```

### beginWork

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3075

beginWork的工作是传入当前Fiber节点，创建子Fiber节点

-   入参

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```

-   current：当前组件对应的Fiber节点在上一次更新时的Fiber节点，即workInProgress.alternate
-   workInProgress：当前组件对应的Fiber节点
-   renderLanes：优先级相关，后面讲

可以根据current!==null，判断组件时mount还是update

-   mount：首次渲染，当前组件的fiber节点为null；
-   update：之前已经mount，fiber节点不为null；

基于此原因，beginWork的工作可以分为两部分：

-   update时：如果current存在，在满足一定条件时可以复用current节点，（diff）这样就能克隆current.child作为workInProgress.child，而不需要新建workInProgress.child；
-   mount时：除fiberRootNode以外，current === null。会根据fiber.tag不同，创建不同类型的子Fiber节点；

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {

  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderLanes,
    );
  } else {
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...省略
    case LazyComponent: 
      // ...省略
    case FunctionComponent: 
      // ...省略
    case ClassComponent: 
      // ...省略
    case HostRoot:
      // ...省略
    case HostComponent:
      // ...省略
    case HostText:
      // ...省略
    // ...省略其他类型
  }
}
```

-   update时
    -   didReceiveUpdate = false：不需要新建fiber，可以直接复用
    -   !includesSomeLane(renderLanes, updateLanes)，即当前Fiber节点优先级不够（后面讲）

```js
if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        // 省略处理
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }
```

-   mount时
    -   根据fiber.tag不同，进入不同逻辑的fiber创建
    -   官网地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactWorkTags.js
    -   对于常见的组件（FunctionComponent、ClassComponent），会执行reconcileChildren

```js
// mount时：根据tag不同，创建不同的Fiber节点
switch (workInProgress.tag) {
  case IndeterminateComponent: 
    // ...省略
  case LazyComponent: 
    // ...省略
  case FunctionComponent: 
    // ...省略
  case ClassComponent: 
    // ...省略
  case HostRoot:
    // ...省略
  case HostComponent:
    // ...省略
  case HostText:
    // ...省略
  // ...省略其他类型
}
```

-   reconcileChildren
    -   mount组件：创建新的子Fiber节点；
    -   update组件：将当前组件与该组件在上次更新时对应的Fiber节点比较（Diff），将比较的结果生成新Fiber节点；

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

-   mountChildFibers & reconcileChildFibers
    -   都会生成新的fiber节点返回给workInProgress.child，作为本次beginWork的返回值，在下次performUnitOfWork执行时workInProgress的入参

-   effectTag
    -   render阶段的工作是在内存中进行，当工作结束后会通知Renderer需要执行的DOM操作。要执行DOM操作的具体类型就保存在fiber.effectTag中

![fiber-effectTag](/Volumes/E/web-zhuawa/images/fiber-effectTag.png)

### completeWork

-   作用：针对不同的fiber.tag调用不同的处理逻辑
-   地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L673

```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...省略
      return null;
    }
    case HostRoot: {
      // ...省略
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
      // ...省略
      return null;
    }
  // ...省略
```

-   判断update时我们还需要考虑workInProgress.stateNode != null ?（即该Fiber节点是否存在对应的DOM节点）

```js
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update的情况
    // ...省略
  } else {
    // mount的情况
    // ...省略
  }
  return null;
}
```

-   update

当update时，Fiber节点已经存在对应DOM节点，所以不需要生成DOM节点。需要做的主要是处理props，比如：

-   onClick、onChange等回调函数的注册
-   处理style prop
-   处理DANGEROUSLY_SET_INNER_HTML prop
-   处理children prop

```js
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```

-   updateHostComponent git地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L225

-   在updateHostComponent内部，被处理完的props会被赋值给workInProgress.updateQueue，并最终会在commit阶段被渲染在页面上，其中updatePayload为数组形式，他的偶数索引的值为变化的prop key，奇数索引的值为变化的prop value

```js
workInProgress.updateQueue = (updatePayload: any);
```

-   mount时
    -   为Fiber节点生成对应的DOM节点
    -   将子孙DOM节点插入刚生成的DOM节点中
    -   与update逻辑中的updateHostComponent类似的处理props的过程

```js
// mount的情况

// ...省略服务端渲染相关逻辑

const currentHostContext = getHostContext();
// 为fiber创建对应DOM节点
const instance = createInstance(
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress,
  );
// 将子孙DOM节点插入刚生成的DOM节点中
appendAllChildren(instance, workInProgress, false, false);
// DOM节点赋值给fiber.stateNode
workInProgress.stateNode = instance;

// 与update逻辑中的updateHostComponent类似的处理props的过程
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
  )
) {
  markUpdate(workInProgress);
}
```

-   effectList

Q：作为DOM操作的依据，commit阶段需要找到所有有effectTag的Fiber节点并依次执行effectTag对应操作。难道需要在commit阶段再遍历一次Fiber树寻找effectTag !== null的Fiber节点么？

completeWork在上层函数completeUnitOfWork上维护了一个单向链表

effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。

类似appendAllChildren，在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1744

```js
                      nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```

-   最后

在performSyncWorkOnRoot函数中fiberRootNode被传递给commitRoot方法，开启commit阶段工作流程。

```js
commitRoot(root);
```

![commitroot流程](/Volumes/E/web-zhuawa/images/commitroot流程.png)

## commit阶段

### 流程概览

```js
commitRoot(root);
```

在rootFiber.firstEffect上保存了一条需要执行副作用的Fiber节点的单向链表effectList，这些Fiber节点的updateQueue中保存了变化的props

这些副作用对应的DOM操作在commit阶段执行。

源码地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2001

除此之外，一些生命周期钩子（比如componentDidXXX）、hook（比如useEffect）需要在commit阶段执行。

commit阶段的主要工作（即Renderer的工作流程）分为三部分：

1.  before mutation阶段（执行DOM操作前）
2.  mutation阶段（执行DOM操作）
3.  layout阶段（执行DOM操作后）

-   before mutation

```js
do {
    // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  // root指 fiberRootNode
  // root.finishedWork指当前应用的rootFiber
  const finishedWork = root.finishedWork;

  // 凡是变量名带lane的都是优先级相关
  const lanes = root.finishedLanes;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // 重置Scheduler绑定的回调函数
  root.callbackNode = null;
  root.callbackId = NoLanes;

  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // 重置优先级相关变量
  markRootFinished(root, remainingLanes);

  // 清除已完成的discrete updates，例如：用户鼠标点击触发的更新。
  if (rootsWithPendingDiscreteUpdates !== null) {
    if (
      !hasDiscreteLanes(remainingLanes) &&
      rootsWithPendingDiscreteUpdates.has(root)
    ) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }

  // 重置全局变量
  if (root === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
  }

  // 将effectList赋值给firstEffect
  // 由于每个fiber的effectList只包含他的子孙节点
  // 所以根节点如果有effectTag则不会被包含进来
  // 所以这里将有effectTag的根节点插入到effectList尾部
  // 这样才能保证有effect的fiber都在effectList中
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有effectTag
    firstEffect = finishedWork.firstEffect;
  }
```

before mutation之前主要做一些变量赋值，状态重置的工作。

-   layout

主要包括三点内容：

1.  useEffect相关的处理：后面详细讲
2.  性能追踪相关：代码里有很多和interaction相关的变量。他们都和追踪React渲染时间、性能相关，在[Profiler API](https://zh-hans.reactjs.org/docs/profiler.html)和[DevTool](https://github.com/facebook/react-devtools/pull/1069)中使用，你可以在这里看到[interaction的定义](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16#overview)
3.  在commit阶段会触发一些生命周期钩子（如 componentDidXXX）和hook（如useLayoutEffect、useEffect）。

在这些回调方法中可能触发新的更新，新的更新会开启新的render-commit流程。

### before mutation（执行DOM前）

遍历effectList并调用commitBeforeMutationEffects函数处理。

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2104-L2127

```js
// 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// 将当前上下文标记为CommitContext，作为commit阶段的标志
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// 处理focus状态
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// beforeMutation阶段的主函数
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;
```

主要讲下 commitBeforeMutationEffects

```js
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur相关
    }

    const effectTag = nextEffect.effectTag;

    // 调用getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // 调度useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

1.  处理DOM节点渲染、删除后的autoFocus、blur等操作；
2.  调用getSnapshotBeforeUpdate
3.  调度 useEffect

-   调用getSnapshotBeforeUpdate

commitBeforeMutationEffectOnFiber是commitBeforeMutationLifeCycles的别名，在该方法内会调用getSnapshotBeforeUpdate。

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L222

因为在V16版本后，componentWillXXX钩子为UNSAFE_，所以，React提供了替代的生命周期钩子getSnapshotBeforeUpdate，getSnapshotBeforeUpdate是在commit阶段内的before mutation阶段调用的，由于commit阶段是同步的，所以不会遇到多次调用的问题

Q：为什么从Reactv16开始，componentWillXXX钩子前增加了UNSAFE_前缀？

从React15升级为React16后，源码改动如此之大，说React被重构可能更贴切些。

正是由于变动如此之大，使得一些特性在新旧版本React中表现不一致

为了让开发者能平稳从旧版本迁移到新版本，React推出了三个模式：

-   legacy模式 -- 通过ReactDOM.render创建的应用会开启该模式。这是当前React使用的方式。这个模式可能不支持一些新功能。
-   blocking模式 -- 通过ReactDOM.createBlockingRoot创建的应用会开启该模式。开启部分concurrent模式特性，作为迁移到concurrent模式的第一步。
-   concurrent模式 -- 通过ReactDOM.createRoot创建的应用会开启该模式。面向未来的开发模式。

但是在从legacy迁移到concurrent模式时，可中断的异步更新还替代了同步更新

在Stack Reconciler重构为Fiber Reconciler后，render阶段的任务可能中断/重新开始，对应的组件在render阶段的生命周期钩子（即componentWillXXX）可能触发多次。

这种行为和Reactv15不一致，所以标记为UNSAFE_。

-   componentWillMount -- componentDidMount
-   componentWillRecieveProps -- getDerivedStateFromProps
-   componentWillUpdate -- getDerivedStateFromProps

在React更新里，每次发起更新都会创建一个Update对象，同一组件的多个Update，会以链表的形式保存在updateQueue中。

-   update

    ```js
    const update: Update<*> = {
      // ...省略当前不需要关注的字段
      lane, // 表示调度优先级
      payload: null, // 更新挂载的数据，对于this.setState创建的更新，payload为this.setState的传参
      next: null // 与其他update形成链表
    };
    ```

-   updateQueue

    ```js
    const queue: UpdateQueue<State> = {
        baseState: fiber.memoizedState, // 更新基于哪个state开始
        firstBaseUpdate: null,  // 更新开始和结束的update
        lastBaseUpdate: null,
        shared: { 
          pending: null, // 更新的单个或多个update形成的链表
        },
        // 其他参数省略...
    };
    
    // baseUpdate + shared.pending会作为本次更新需要执行的Update
    ```

    假设，某个组件updateQueue 存在4个update，数字代表优先级

    ```js
    baseState = '';
    
    A1 - B2 - C1 - D2
    
    // 为了保证更新的连贯性，第一个被跳过的update（B）和后面的update会作为第二次渲染的baseUpdate
    // 为BCD
    // 首次渲染后
    baseState: ''
    Updates: [A1, C1]
    Result state: 'AC'
    
    // 第二次渲染，B在第一次渲染时被跳过，所以在他之后的C造成的渲
    // 染结果不会体现在第二次渲染的baseState中。所以baseState为A而不是上次渲染的Result state AC
    // 。这也是为了保证更新的连贯性
    baseState: 'A'  // 为了保证一致性，C不在        
    Updates: [B2, C1, D2]  
    Result state: 'ABCD'
    
    // Updates里出现了两次C
    ```

-   调度useEffect

```js
// 调度useEffect
if ((effectTag & Passive) !== NoEffect) {
  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalSchedulerPriority, () => { // scheduler提供，调度优先级的回调
      // 触发useEffect
      flushPassiveEffects(); // 具体见后文hooks
      return null;
    });
  }
}
```

在flushPassiveEffects方法内部会从全局变量rootWithPendingPassiveEffects获取effectList，就是会遍历rootWithPendingPassiveEffects（即effectList）执行effect回调函数。

Q：为什么要异步调度：

https://zh-hans.reactjs.org/docs/hooks-reference.html#timing-of-effects

与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

防止同步执行时阻塞浏览器渲染

### mutation（执行DOM中）

类似 before mutation，mutation遍历effectList执行函数。这里执行的是commitMutationEffects。

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L2091

```js
nextEffect = firstEffect;
do {
  try {
      commitMutationEffects(root, renderPriorityLevel);
    } catch (error) {
      invariant(nextEffect !== null, 'Should be working on an effect.');
      captureCommitPhaseError(nextEffect, error);
      nextEffect = nextEffect.nextEffect;
    }
} while (nextEffect !== null);
```

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历effectList
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;

    // 根据 ContentReset effectTag重置文字节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // 更新ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    const primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // 插入DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入DOM 并 更新DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

执行内容：

1.  根据ContentReset effectTag重置文字节点
2.  更新ref
3.  根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)，hydrate是SSR，不考虑

-   placement effect：插入DOM

调用：commitPlacement

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1156

实现内容：

1.  获取父DOM节点，其中finishedWork为传入的Fiber节点。

```js
const parentFiber = getHostParentFiber(finishedWork);
// 父级DOM节点
const parentStateNode = parentFiber.stateNode;
```

2.   获取fiber节点的DOM兄弟节点

```js
const before = getHostSibling(finishedWork);
```

3.   根据DOM的兄弟节点是否存在调用parentNode.insertBefore 或者 parentNode.appendChild，插入DOM

```js
// parentStateNode是否是rootFiber
if (isContainer) {
  insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
} else {
  insertOrAppendPlacementNode(finishedWork, before, parent);
}
```

Q：渲染DOM中时间复杂度最高的操作是？

getHostSibling（获取兄弟DOM节点）

当在同一个父Fiber节点下依次执行多个插入操作，getHostSibling算法的复杂度为指数级。

这是由于Fiber节点不只包括HostComponent，所以Fiber树和渲染的DOM树节点并不是一一对应的。要从Fiber节点找到DOM节点很可能跨层级遍历

```js
function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));

// Fiber树
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM树
#root ---> div ---> li

// 在div的子节点Item前加一个p
function App() {
  return (
    <div>
      <p></p>
      <Item/>
    </div>
  )
}

// Fiber树
          child      child      child
rootFiber -----> App -----> div -----> p 
                                       | sibling       child
                                       | -------> Item -----> li 
// DOM树
#root ---> div ---> p
             |
               ---> li

// 此时dom中p的兄弟节点是li
// fiber中fiberP的兄弟节点是fiberItem，fiberItem的子节点才是li
```

-   update effect

调用的方法为commitWork，他会根据Fiber.tag分别处理。

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1441

主要关注：FunctionComponent和HostComponent

1.  FunctionComponent mutation

当fiber.tag为FunctionComponent，会调用commitHookEffectListUnmount。该方法会遍历effectList，执行所有useLayoutEffect hook的销毁函数

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L314

2.   HostComponent mutation

当fiber.tag为HostComponent，会调用commitUpdate。

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-dom/src/client/ReactDOMHostConfig.js#L423

最终会在[updateDOMProperties](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-dom/src/client/ReactDOMComponent.js#L378)中将render阶段 completeWork中为Fiber节点赋值的updateQueue对应的内容渲染在页面上。

```js
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

-   deletion effect

当Fiber节点含有Deletion effectTag，意味着该Fiber节点对应的DOM节点需要从页面中删除。调用的方法为commitDeletion。

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1421

1.  递归调用Fiber节点及其子孙Fiber节点中fiber.tag为ClassComponent的componentWillUnmount生命周期钩子，从页面移除Fiber节点对应DOM节点
2.  解绑ref
3.  调度useEffect的销毁函数

### layout（执行DOM后）

之所以称为layout，因为该阶段的代码都是在DOM渲染完成（mutation阶段完成）后执行的。该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段

-   layout阶段也是遍历effectList

```js
root.current = finishedWork;

nextEffect = firstEffect;
do {
  try {
    commitLayoutEffects(root, lanes);
  } catch (error) {
    invariant(nextEffect !== null, "Should be working on an effect.");
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);

nextEffect = null;
```

-   commitLayoutEffects

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2302

```js
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 调用生命周期钩子和hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate;
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
    }

    // 赋值ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

1.  commitLayoutEffectOnFiber（调用生命周期钩子和hook相关操作）
2.  commitAttachRef（赋值 ref）

-   commitLayoutEffectOnFiber

地址：https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L459

1.  对于ClassComponent
    1.  通过current === null?区分是mount还是update，调用componentDidMount 或者componentDidUpdate
    2.  触发状态更新的this.setState如果赋值了第二个参数回调函数，也会在此时调用

```js
this.setState({ xxx: 1 }, () => {   console.log("i am update~"); }); 
```

2.   对于FunctionComponent及相关类型（如ForwardRef、React.memo或者HOC），他会调用useLayoutEffect hook的回调函数，调度useEffect的销毁与回调函数

```js
 switch (finishedWork.tag) {
    // 以下都是FunctionComponent及相关类型
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      // 执行useLayoutEffect的回调函数
      commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
      // 调度useEffect的销毁函数与回调函数
      schedulePassiveEffects(finishedWork);
      return;
    }
```

-   commitAttachRef

获取DOM实例，更新Ref

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;

    // 获取DOM实例
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    if (typeof ref === "function") {
      // 如果ref是函数形式，调用回调函数
      ref(instanceToUse);
    } else {
      // 如果ref是ref实例形式，赋值ref.current
      ref.current = instanceToUse;
    }
  }
}
```

-   current fiber切换

```js
root.current = finishedWork;
```

因为双缓存策略，workInProgress Fiber树在commit阶段完成渲染后会变为current Fiber树。这行代码的作用就是切换fiberRootNode指向的current Fiber树。

Q：双缓存切换执行时间

mutation阶段结束后，layout阶段开始前

所以

1.  componentWillUnmount在mutation阶段执行。此时current Fiber树还指向前一次更新的Fiber树，在生命周期钩子内获取的DOM还是更新前的；
2.  componentDidMount和componentDidUpdate会在layout阶段执行。此时current Fiber树已经指向更新后的Fiber树，在生命周期钩子内获取的DOM就是更新后的；

# Diff算法

## 概览

在render阶段，对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成新Fiber节点。

官网对diff算法的介绍：https://zh-hans.reactjs.org/docs/reconciliation.html#the-diffing-algorithm

1.  不同类型的元素：React拆卸原有的树，生成新的树

```js
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

 a. 卸载时：

1.  DOM节点销毁；
2.  执行componentWilUnmount()；

b.  新建时：

1.  执行UNSAFE_componentWillMount()，然后执行componentDidMount()；

2.   同一类型的元素：

```js
<div className="before" title="stuff" />
<div className="after" title="stuff" />
  
<div style={{color: 'red', fontWeight: 'bold'}} />
<div style={{color: 'green', fontWeight: 'bold'}} />
```

1.  保留DOM节点，仅对比更新有改变的属性
2.  对比同类型的组件元素：
    1.  组件更新时，组件实例保持不变，保证state不变，更新组件的props以保证与新的元素一致，调用UNSAFE_componentWillReceiveProps()、UNSAFE_componentWillUpdate() 以及 componentDidUpdate() 方法；
    2.  调用render，执行diff
        1.  React 同时遍历两个子元素的列表；当产生差异时，生成一个 mutation

在子元素列表结尾新增

```js
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li> // 只需要新增元素即可
</ul>
```

在子元素列表头部新增

```js
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

// 销毁子元素列表，新建新的子元素列表，有性能问题
<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

使用keys：直接比较key值定位，所以key传index也会有性能问题

```js
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

1.  官网总结：

>   1.  该算法不会尝试匹配不同组件类型的子树。如果你发现你在两种不同类型的组件中切换，但输出非常相似的内容，建议把它们改成同一类型。在实践中，我们没有遇到这类问题；
>   2.  Key 应该具有稳定，可预测，以及列表内唯一的特质。不稳定的 key（比如通过 Math.random() 生成的）会导致许多组件实例和 DOM 节点被不必要地重新创建，这可能导致性能下降和子组件中的状态丢失；

结合render和commit阶段，一个DOM节点最多有4个节点与之相关：

1.  current Fiber。如果该DOM节点已在页面中，current Fiber代表该DOM节点对应的Fiber节点；
2.  workInProgress Fiber。如果该DOM节点将在本次更新中渲染到页面中，workInProgress Fiber代表该DOM节点对应的Fiber节点；
3.  DOM节点本身；
4.  JSX对象。即ClassComponent的render方法的返回结果，或FunctionComponent的调用结果。JSX对象中包含描述DOM节点的信息；

diff算法：对比1 4 生成2

### Diff的瓶颈及处理方法

diff操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n^3)，其中n是树中元素的数量；如果在React中使用了该算法，那么展示1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂；

为了降低算法复杂度，React的diff会预设三个限制：

1.  只对同级元素进行diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React会忽略；
2.  两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点；
3.  开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定；

### Diff是如何实现的

Diff的入口函数是reconcileChildFibers：会根据newChild（即JSX对象）类型调用不同的处理函数

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1280

```js
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // // ...省略其他case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

根据同级的节点数量将Diff分为两类：

1.  当newChild类型为object、number、string，代表同级只有一个节点
2.  当newChild类型为Array，同级有多个节点

## 单节点Diff

以类型为object为例，执行reconcileSingleElement

```js
  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // 对象类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // ...其他case
    }
  }
```

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1141

执行流程

![单节点diff](/Volumes/E/web-zhuawa/images/单节点diff.png)

```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {

      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case
        
        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing;
          }
          
          // type不同则跳出switch
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // 创建新Fiber，并返回 ...省略
}
```

1.  先判断key是否相同，如果key相同则判断type是否相同，只有都相同时一个DOM节点才能复用；
2.  删除逻辑：
    1.  当child !== null且key相同且type不同时执行deleteRemainingChildren将child及其兄弟fiber都标记删除；
    2.  当child !== null且key不同时仅将child标记删除；

```js
// current fiber
ul > li li li
// JSX
ul > p
```

需要根据第一个li与p是否相同判断

1.  key相同type不同，当前fiber和后续sibling fiber删除；
2.  key不同，type也不同，删除当前fiber，前往下一个sibling fiber；

Example：

```js
// 更新前
<div>a</div>
// 更新后
<p>a</p>

// key为null，一致，但type不同，不能复用

// 更新前
<div key="xxx">a</div>
// 更新后
<div key="ooo">a</div>

// key不同，不需要看type，不能复用

// 更新前
<div key="xxx">a</div>
// 更新后
<p key="ooo"a</p>

// key不同，不需要看type，不能复用

// 更新前
<div key="xxx">a</div>
// 更新后
<div key="xxx">b</div>

// key type都相同，props中children不同，更新子元素
```

## 多节点Diff

对于多节点的functionComponent，reconcileChildFibers的newChild参数类型为Array，执行reconcileChildrenArray

```js
if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
}
```

### 概览

同级多个节点的diff，归纳为：

1.  节点更新

```js
// 更新前
<ul>
  <li key="0" className="before">0<li>
  <li key="1">1<li>
</ul>

// 更新后 情况1 —— 节点属性变化
<ul>
  <li key="0" className="after">0<li>
  <li key="1">1<li>
</ul>

// 更新后 情况2 —— 节点类型更新
<ul>
  <div key="0">0</div>
  <li key="1">1<li>
</ul>
```

1.  节点新增或减少

```js
// 更新前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 更新后 情况1 —— 新增节点
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
  <li key="2">2<li>
</ul>

// 更新后 情况2 —— 删除节点
<ul>
  <li key="1">1<li>
</ul>
```

1.  节点位置变化

```js
// 更新前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 更新后
<ul>
  <li key="1">1<li>
  <li key="0">0<li>
</ul>
```

1.  ### Diff思路

1.  针对节点更新
    1.  新增：执行新增逻辑
    2.  删除：执行删除逻辑
    3.  更新：执行更新逻辑

前提：操作优先级一样，但实际开发中，React团队发现，相较于新增和删除，更新组件发生的频率更高。所以Diff会优先判断当前节点是否属于更新。

Q：同级比较能否使用双指针算法提高遍历速度？

不可以

待更新对象为JSX，其中newChildren为数组格式，但current fiber 是链表格式，同级的fiber节点是由sibling指针形成的单链表，不支持双指针遍历；

newChildren[0]与fiber比较，newChildren[1]与fiber.sibling比较 

无法针对数组和链表进行比较，所以不可行

react团队提供的思路：2轮遍历

1.  处理 更新 的节点；
2.  处理非 更新 的节点；

### 第一轮遍历

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L818

1.  let i = 0，遍历newChildren，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用；
2.  如果可复用，i++，继续比较newChildren[i]与oldFiber.sibling，可以复用则继续遍历；
3.  如果不可复用，分两种情况：
    1.  key不同导致不可复用，立即跳出整个遍历，第一轮遍历结束；
    2.  key相同type不同导致不可复用，会将oldFiber标记为DELETION，并继续遍历；
4.  如果newChildren遍历完（即 i === newChildren.length - 1 ）或者oldFiber遍历完（即oldFiber.sibling === null），跳出遍历，第一轮遍历结束；

其中，3 4可以完成当前遍历

3：此时newChildren没有遍历完，oldFiber也没有遍历完

```js
// 更新前
<li key="0">0</li>
<li key="1">1</li>
<li key="2">2</li>
            
// 更新后
<li key="0">0</li>
<li key="2">1</li>
<li key="1">2</li>

// 第一个节点可复用，遍历到key === 2的节点发现key改变，不可复用
// 跳出遍历，等待第二轮遍历处理

// oldFiber: key === 1、key === 2未遍历
// newChildren剩下key === 2、key === 1未遍历
```

4：可能newChildren遍历完，或oldFiber遍历完，或他们同时遍历完

```js
// 更新前
<li key="0" className="a">0</li>
<li key="1" className="b">1</li>
            
// 更新后 情况1 —— newChildren与oldFiber都遍历完
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
            
// 更新后 情况2 —— newChildren没遍历完，oldFiber遍历完
// newChildren剩下 key==="2" 未遍历
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
<li key="2" className="cc">2</li>
            
// 更新后 情况3 —— newChildren遍历完，oldFiber没遍历完
// oldFiber剩下 key==="1" 未遍历
<li key="0" className="aa">0</li>
```

1.  ### 第二轮遍历

1.  newChildren 和 oldFiber 同时遍历完

不需要第二轮的遍历，直接进行 update，diff结束；

1.  newChildren没遍历完，oldFiber遍历完

已有的DOM节点都对比结束，这时还有新加入的节点，意味着本次更新有新节点插入，我们只需要遍历剩下的newChildren为生成的workInProgress fiber依次标记Placement；

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L869

1.  newChildren遍历完，oldFiber没遍历完

本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的oldFiber，依次标记Deletion；

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L863

1.  newChildren与oldFiber都没遍历完

意味着有节点更新了位置

### 如何处理更新后的节点

由于有节点改变了位置，所以不能再用位置索引i对比前后的节点，那么如何才能将同一个节点在两次更新中对应上呢--key

为了快速的找到key对应的oldFiber，我们将所有还未处理的oldFiber存入以key为key，oldFiber为value的Map中

```js
const existingChildren = mapRemainingChildren(returnFiber, oldFiber); 
```

接下来遍历剩余的newChildren，通过newChildren[i].key就能在existingChildren中找到key相同的oldFiber

### 标记节点是否移动

如何判断节点是否移动？参照物是什么？

我们的参照物是：最后一个可复用的节点在oldFiber中的位置索引（用变量lastPlacedIndex表示）。

本次更新中节点是按newChildren的顺序排列。在遍历newChildren过程中，每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个，即一定在lastPlacedIndex对应的可复用的节点在本次更新中位置的后面；

所以只需要比较遍历到的可复用节点在上次更新时是否也在lastPlacedIndex对应的oldFiber后面，就能知道两次更新中这两个节点的相对位置改变没有；

我们用变量oldIndex表示遍历到的可复用节点在oldFiber中的位置索引。如果oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动；

lastPlacedIndex初始为0，每遍历一个可复用的节点，如果oldIndex >= lastPlacedIndex，则lastPlacedIndex = oldIndex；

### Demo

每个字母代表一个节点，字母的值代表节点的key

demo 1

```js
// 之前
abcd

// 之后
acdb

===第一轮遍历开始===
a（之后）vs a（之前）  
key不变，可复用
此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
所以 lastPlacedIndex = 0;

继续第一轮遍历...

c（之后）vs b（之前）  
key改变，不能复用，跳出第一轮遍历
此时 lastPlacedIndex === 0;
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === cdb，没用完，不需要执行删除旧节点
oldFiber === bcd，没用完，不需要执行插入新节点

将剩余oldFiber（bcd）保存为map

// 当前oldFiber：bcd
// 当前newChildren：cdb

继续遍历剩余newChildren

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index;
此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
比较 oldIndex 与 lastPlacedIndex;

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

在例子中，oldIndex 2 > lastPlacedIndex 0，
则 lastPlacedIndex = 2;
c节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：bd
// 当前newChildren：db

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：b
// 当前newChildren：b

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index;
oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
则 b节点需要向右移动
===第二轮遍历结束===

最终acd 3个节点都没有移动，b节点被标记为移动
```

demo2

```js
// 之前
abcd

// 之后
dabc

===第一轮遍历开始===
d（之后）vs a（之前）  
key改变，不能复用，跳出遍历
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === dabc，没用完，不需要执行删除旧节点
oldFiber === abcd，没用完，不需要执行插入新节点

将剩余oldFiber（abcd）保存为map

继续遍历剩余newChildren

// 当前oldFiber：abcd
// 当前newChildren dabc

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
此时 oldIndex === 3; // 之前节点为 abcd，所以d.index === 3
比较 oldIndex 与 lastPlacedIndex;
oldIndex 3 > lastPlacedIndex 0
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：abc
// 当前newChildren abc

key === a 在 oldFiber中存在
const oldIndex = a（之前）.index; // 之前节点为 abcd，所以a.index === 0
此时 oldIndex === 0;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 0 < lastPlacedIndex 3
则 a节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：bc
// 当前newChildren bc

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index; // 之前节点为 abcd，所以b.index === 1
此时 oldIndex === 1;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 1 < lastPlacedIndex 3
则 b节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：c
// 当前newChildren c

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index; // 之前节点为 abcd，所以c.index === 2
此时 oldIndex === 2;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 2 < lastPlacedIndex 3
则 c节点需要向右移动

===第二轮遍历结束===
```

所以，尽量减少节点从后面移动到前面的操作

1.  abcd -> acdb：b移动到最右边
2.  abcd -> dabc：abc移动到最右边

1.  # 状态更新

1.  ## 概览

梳理下几个关键的节点：

1.  render阶段的开始

开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是同步更新还是异步更新，render结束完后会进入commit

1.  commit阶段的开始

开始于`commitRoot`方法的调用。其中rootFiber会作为传参

此时，状态为

```js
触发状态更新（根据场景调用不同方法）

    |
    |
    v

    ？

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

### 创建Update对象

在react里，触发状态更新的操作包括：

-   ReactDOM.render
-   this.setState
-   this.forceUpdate
-   useState
-   useReducer

Q：如何在调用场景不同的情况下，接入同一套状态管理机制？

在每次状态更新，都会创建保存一个更新状态相关的对象，称为Update，在render的beginwork中会根据Update得到新的state

### 从fiber到root

render阶段是从rootFiber开始向下遍历。那么如何从触发状态更新的fiber得到rootFiber呢？

调用markUpdateLaneFromFiberToRoot方法。

地址：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L636

该方法做的工作可以概括为：从触发状态更新的fiber一直向上遍历到rootFiber，并返回rootFiber。

### 调度更新

现在有一个rootFiber，该rootFiber对应的Fiber树中某个Fiber节点包含一个Update。

接下来通知Scheduler根据更新的优先级，决定以同步还是异步的方式调度本次更新。

这里调用的方法是ensureRootIsScheduled

地址：https://github.com/facebook/react/blob/b6df4417c79c11cfb44f965fab55b573882b1d54/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L602

ensureRootIsScheduled核心代码：

```js
if (newCallbackPriority === SyncLanePriority) {
  // 任务已经过期，需要同步执行render阶段
  newCallbackNode = scheduleSyncCallback(
    performSyncWorkOnRoot.bind(null, root)
  );
} else {
  // 根据任务优先级异步执行render阶段
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
    newCallbackPriority
  );
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

至此，状态更新的流程已经通了

```js
触发状态更新（根据场景调用不同方法）

    |
    |
    v

创建Update对象（后面详解）

    |
    |
    v

从fiber到root（`markUpdateLaneFromFiberToRoot`）

    |
    |
    v

调度更新（`ensureRootIsScheduled`）

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

## Update

### Update思路

通过代码版本控制类比

1.  同步更新

在没有代码版本控制前，我们在代码中逐步叠加功能。一切看起来井然有序，直到我们遇到了一个紧急线上bug（红色节点）

