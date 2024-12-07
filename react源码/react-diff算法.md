React Diff 算法

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

## 手写Hooks实现

```js
const hooks = (function() {
  const HOOKS = [];
  let currentIndex = 0;
  const Tick = {
      render: null,
      queue: [],
      push: function(task) {
          this.queue.push(task);
      },
      nextTick: function(update) {
          this.push(update);
          Promise.resolve().then(() => {
            if (this.queue.length) { // 一次循环后，全部出栈，确保单次事件循环不会重复渲染
                this.queue.forEach(f => f()); // 依次执行队列中所有任务
                currentIndex = 0; // 重置计数
                this.queue = []; // 清空队列
                this.render && this.render(); // 更新dom
            }
        });
      }
  };

  function useState(initialState) {
      HOOKS[currentIndex] = HOOKS[currentIndex] || (typeof initialState === 'function' ? initialState() : initialState);
      const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的，需要保存本次的
      const setState = p => {
            let newState = p;
            if (typeof p === 'function') {
                newState = p(HOOKS[memoryCurrentIndex]);
            }
            if (newState === HOOKS[memoryCurrentIndex]) return;
            Tick.nextTick(() => {
                HOOKS[memoryCurrentIndex] = newState;
            });
      };
      return [HOOKS[currentIndex++], setState];
  }
  function useEffect(fn, deps) {
      const hook = HOOKS[currentIndex];
      const _deps = hook && hook._deps;
      const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
      const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的
      if (hasChange) {
          const _effect = hook && hook._effect;
          setTimeout(() => {
              typeof _effect === 'function' && _effect(); // 每次先判断一下有没有上一次的副作用需要卸载
              const ef = fn();
              HOOKS[memoryCurrentIndex] = {...HOOKS[memoryCurrentIndex], _effect: ef}; // 更新effects
          })
      }
      HOOKS[currentIndex++] = {_deps: deps, _effect: null};
  }
  function useReducer(reducer, initialState) {
      const [state, setState] = useState(initialState);
      const update = (state, action) => {
          const result = reducer(state, action);
          setState(result);
      }
      const dispatch = update.bind(null, state);
      return [state, dispatch];
  }
  function useMemo(fn, deps) {
      const hook = HOOKS[currentIndex];
      const _deps = hook && hook._deps;
      const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
      const memo = hasChange ? fn() : hook.memo;
      HOOKS[currentIndex++] = {_deps: deps, memo};
      return memo;
  }
  function useCallback(fn, deps) {
      return useMemo(() => fn, deps);
  }
  return {
    Tick, useState, useEffect, useReducer, useMemo, useCallback
  }
})();
```

## 手写防抖节流Hooks

```js
function debounce(func, ms) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            func.apply(context, args)
        }, ms);
    }
}

function throttle(func, ms) {
    let previous = 0;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > ms) {
            func.apply(context, args);
            previous = now;
        }
    }
}
```

### 防抖hook

```js
import { useEffect, useRef } from 'react'

const useDebounce = (fn, ms = 30, deps = []) => {
    let timeout = useRef()
    useEffect(() => {
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            fn()
        }, ms)
    }, deps)

    const cancel = () => {
        clearTimeout(timeout.current)
        timeout = null
    }
  
    return [cancel]
  }

export default useDebounce

// 实际使用
import { useDebounce } from 'hooks'
const Home = (props) => {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  
  const [cancel] = useDebounce(() => {
    setB(a)
  }, 2000, [a])

  const changeIpt = (e) => {
    setA(e.target.value)
  }
  return <div>
    <input type="text" onChange={changeIpt} />
    { b } { a }
  </div>
}
```

### 节流hook

```js
mport { useEffect, useRef, useState } from 'react'

const useThrottle = (fn, ms = 30, deps = []) => {
    let previous = useRef(0)
    let [time, setTime] = useState(ms)
    useEffect(() => {
        let now = Date.now();
        if (now - previous.current > time) {
            fn();
            previous.current = now;
        }
    }, deps)

    const cancel = () => {
        setTime(0)
    }
  
    return [cancel]
  }

export default useThrottle
```

### BrowserRouter核心原理实现

1.  历史操作，history.pushState、history.replaceState。**不会触发 popState**
2.  监听变更，window.addEventListener("popstate", () => {})
3.  操作，history.back()，history.forward()，history.go()，会触发 **popState**

#### 创建 router

```js
export function createBrowserRouter(
  routes: RouteObject[],
  opts?: DOMRouterOpts
): RemixRouter {
  return createRouter({
    basename: opts?.basename,
    future: {
      ...opts?.future,
      v7_prependBasename: true,
    },
    history: createBrowserHistory({ window: opts?.window }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes,
    mapRouteProperties,
  }).initialize();
}
```

router下承载history

```js
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  function createBrowserLocation(
    window: Window,
    globalHistory: Window["history"]
  ) {
    let { pathname, search, hash } = window.location;
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      (globalHistory.state && globalHistory.state.usr) || null,
      (globalHistory.state && globalHistory.state.key) || "default"
    );
  }

  function createBrowserHref(window: Window, to: To) {
    return typeof to === "string" ? to : createPath(to);
  }

  return getUrlBasedHistory(
    createBrowserLocation,
    createBrowserHref,
    null,
    options
  );
}
```

history 需要 location 定位资源

```js
function getUrlBasedHistory(
  getLocation: (window: Window, globalHistory: Window["history"]) => Location,
  createHref: (window: Window, to: To) => string,
  validateLocation: ((location: Location, to: To) => void) | null,
  options: UrlHistoryOptions = {}
): UrlHistory {
  let { window = document.defaultView!, v5Compat = false } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener: Listener | null = null;

  let index = getIndex()!;
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  function getIndex(): number {
    let state = globalHistory.state || { idx: null };
    return state.idx;
  }

  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({ action, location: history.location, delta });
    }
  }

  function push(to: To, state?: any) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);

    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);

    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }

    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 1 });
    }
  }

  function replace(to: To, state?: any) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);

    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);

    if (v5Compat && listener) {
      listener({ action, location: history.location, delta: 0 });
    }
  }

  function createURL(to: To): URL {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    let base =
      window.location.origin !== "null"
        ? window.location.origin
        : window.location.href;

    let href = typeof to === "string" ? to : createPath(to);
    invariant(
      base,
      `No window.location.(origin|href) available to create URL for href: ${href}`
    );
    return new URL(href, base);
  }

  let history: History = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn: Listener) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;

      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    },
  };

  return history;
}
```

事件处理解决后，接下来就是解决监听，我们上面提到监听 popState 以此来处理路由变更

```js
listen(fn: Listener) {
  if (listener) {
    throw new Error("A history only accepts one active listener");
  }
  window.addEventListener(PopStateEventType, handlePop);
  listener = fn;

  return () => {
    window.removeEventListener(PopStateEventType, handlePop);
    listener = null;
  };
},
```

处理 popState 逻辑

```js
function handlePop() {
    action = Action.Pop
    let nextIndex = getIndex()
    let delta = nextIndex == null ? null : nextIndex - index
    index = nextIndex
    if (listener) {
        listener({ action, location: history.location, delta })
    }
}
```

### 实现一个基础的Redux

```js
import React, { useSyncExternalStore } from "react";
import logo from "./logo.svg";
import "./App.css";
import { combineReducer, createStore } from "./lib/redux";

const initialState = {
  count: 0,
};

const countReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
};

const ageReducer = (state = { age: 18 }, action: any) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        age: state.age + 1,
      };
    default:
      return state;
  }
};

const store = createStore(
  combineReducer({ count: countReducer, age: ageReducer })
);

store.dispatch({ type: "ADD" });

function App() {
  const snapshot = useSyncExternalStore(store.subscribe, store.getState);
  return (
    <div className="App">
      <header
        className="App-header"
        onClick={() => store.dispatch({ type: "ADD" })}
      >
        {snapshot.count.count}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

```

#### 为什么React的componentWillXXX生命周期在Hooks出现后是UNSAFE的？

![react-unsafe](/Volumes/E/web-zhuawa/images/react-unsafe.png)

以上有两个Update。我们将“关闭黑夜模式”产生的Update称为u1，输入字母“I”产生的Update称为u2

其中u1先触发并进入render阶段。其优先级较低，执行时间较长。此时

```js
fiber.updateQueue = {
  baseState: {
    blackTheme: true,
    text: 'H'
  },
  firstBaseUpdate: null,
  lastBaseUpdate: null
  shared: {
    pending: u1
  },
  effects: null
};
```

在u1完成render阶段前用户通过键盘输入字母“I”，产生了u2。u2属于受控的用户输入，优先级高于u1，于是中断u1产生的render阶段。

```js
fiber.updateQueue.shared.pending === u2 ----> u1
                                     ^        |
                                     |________|
// 即
u2.next === u1;
u1.next === u2;
```

其中u2优先级高于u1。

接下来进入u2产生的render阶段。

在`processUpdateQueue`方法中，shared.pending环状链表会被剪开并拼接在baseUpdate后面。

需要明确一点，shared.pending指向最后一个pending的update，所以实际执行时update的顺序为：

```js
u1 -- u2
```

接下来遍历baseUpdate，处理优先级合适的Update（这一次处理的是更高优的u2）；

由于u2不是baseUpdate中的第一个update，在其之前的u1由于优先级不够被跳过；

update之间可能有依赖关系，所以被跳过的update及其后面所有update会成为下次更新的baseUpdate。（即u1 -- u2）;

最终u2完成render - commit阶段；

此时：

```js
fiber.updateQueue = {
  baseState: {
    blackTheme: true,
    text: 'HI'
  },
  firstBaseUpdate: u1,
  lastBaseUpdate: u2
  shared: {
    pending: null
  },
  effects: null
};
```

在commit阶段结尾会再调度一次更新。在该次更新中会基于baseState中firstBaseUpdate保存的u1，开启一次新的render阶段。

最终结果：

```js
fiber.updateQueue = {
  baseState: {
    blackTheme: false,
    text: 'HI'
  },
  firstBaseUpdate: null,
  lastBaseUpdate: null
  shared: {
    pending: null
  },
  effects: null
};
```

可以看到，u2执行了2次，相对应的render阶段的生命周期 componentWillXXX也会执行2次，这就是为什么这些生命周期会被标记为unsafe_；

# 实现一个基础的umd打包器

```js
// gulpfile.js
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');

gulp.task('clean', async function () {
  await del('lib/**');
  await del('es/**');
  await del('dist/**');
});

gulp.task('cjs', function () {
  return gulp
    .src(['./es/**/*.js'])
    .pipe(
      babel({
        configFile: '../../.babelrc',
      }),
    )
    .pipe(gulp.dest('lib/'));
});

gulp.task('es', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'ESNext',
  });
  return tsProject.src().pipe(tsProject()).pipe(babel()).pipe(gulp.dest('es/'));
});

gulp.task('declaration', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    declaration: true,
    emitDeclarationOnly: true,
  });
  return tsProject.src().pipe(tsProject()).pipe(gulp.dest('es/')).pipe(gulp.dest('lib/'));
});

gulp.task('copyReadme', async function () {
  await gulp.src('../../README.md').pipe(gulp.dest('../../packages/hooks'));
});

exports.default = gulp.series('clean', 'es', 'cjs', 'declaration', 'copyReadme');

// packages/hooks/gulpfile.js
const commonConfig = require('../../gulpfile');
const gulp = require('gulp');
const fs = require('fs');
const fse = require('fs-extra');
const fg = require('fast-glob');
const gm = require('gray-matter');

async function genDesc(mdPath) {
  if (!fs.existsSync(mdPath)) {
    return;
  }
  const mdFile = fs.readFileSync(mdPath, 'utf8');
  const { content } = gm(mdFile);
  let description =
    (content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '';

  description = description.trim();
  description = description.charAt(0).toLowerCase() + description.slice(1);
  return description;
}

async function genMetaData() {
  const metadata = {
    functions: [],
  };
  const hooks = fg
    .sync('src/use*', {
      onlyDirectories: true,
    })
    .map((hook) => hook.replace('src/', ''))
    .sort();
  await Promise.allSettled(
    hooks.map(async (hook) => {
      const description = await genDesc(`src/${hook}/index.md`);
      return {
        name: hook,
        description,
      };
    }),
  ).then((res) => {
    metadata.functions = res.map((item) => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return null;
    });
  });
  return metadata;
}

gulp.task('metadata', async function () {
  const metadata = await genMetaData();
  await fse.writeJson('metadata.json', metadata, { spaces: 2 });
});

exports.default = gulp.series(commonConfig.default, 'metadata');

```

webpack

```js
// webpack.common.js
module.exports = {
  output: {
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'production',
  resolve: {
    extensions: ['.json', '.js'],
  },
  externals: [
    {
      react: 'React',
    },
  ],
};

// packages/hooks/webpack.config.js
const merge = require('webpack-merge');
const common = require('../../webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  entry: './es/index.js',
  output: {
    filename: 'encodeHooks.js',
    library: 'encodeHooks',
    path: path.resolve(__dirname, './dist'),
  },
});

```

## React理念介绍

我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

ui = render (data) -> 单向数据流

如何提升页面响应交互？

-   CPU卡顿：大量计算操作导致的性能问题
-   IO卡顿：网络请求延时的，无法快速响应

1.  CPU卡顿

-   在浏览器刷新频率为60HZ的情况下（即1000ms / 60HZ = 16.6ms）浏览器刷新一次
-   浏览器里JS线程与GUI线程是互斥的，不可同时执行，所以JS脚本和浏览器的render、painting不能同时执行，所以执行顺序为：`JS脚本执行 ->样式布局 ->样式绘制`，JS执行时间超过16.6ms，就不会执行render与painting了

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

![react-cpu卡](/Volumes/E/web-zhuawa/images/react-cpu卡.png)

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

![react-cpu卡盾后](/Volumes/E/web-zhuawa/images/react-cpu卡盾后.png)

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

2.   CM模式会牺牲列表的更新速度，提升输入时的相应速度，重于交互

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

![react-click-button](/Volumes/E/web-zhuawa/images/react-click-button.png)

加入同步更新中断

![react-click-后](/Volumes/E/web-zhuawa/images/react-click-后.png)

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

