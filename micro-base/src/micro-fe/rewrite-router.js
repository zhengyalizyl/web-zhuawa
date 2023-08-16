import { handleRouter } from "./handle-router";

let prevRoute = '';//上一个路由
let nextRoute = window.location.pathname//下一个路由

export const getPrevRoute = () => prevRoute;
export const getNextRoute = () => nextRoute;

export const rewriteRouter = () => {// hash路由 window.onhashchange
  // history路由 history.go、history.back、history.forward使用popstate事件：window.onpopstate
  window.addEventListener('popstate', () => {
    //popstate触发的时候，路由已经完成导航了
    prevRoute=nextRoute;
    nextRoute=window.location.pathname
    handleRouter();
  })

  // pushState、replaceState需要通过函数重写的方式进行劫持
  // 这种方式不行
  // window.addEventListener('pushState',()=>{
  //   console.log('pushstate')
  // })

  const rawPushState = window.history.pushState;
  window.history.pushState = (...args) => {
    prevRoute = window.location.pathname;
    //这里是因为调用了  rawPushState.apply(window.history, args);所以就能知道上一次路由
    rawPushState.apply(window.history, args);
    nextRoute = window.location.pathname;
    handleRouter();
  }

  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    prevRoute = window.location.pathname;
    rawReplaceState.apply(window.history, args);
    nextRoute = window.location.pathname;
    handleRouter();
  }

}