// - 内存溢出
// - 白屏
//   - MutationObserver
// - 资源加载异常
//   - img资源
//   - font资源
// - js执行异常
//   - 异常监听
// - 异步处理异常
//   - promise，unhandledrejection
// - 网络异常
//   - ajax
//   - fetch

//资源异常
window.addEventListener('error',event=>{
  console.log("资源异常",event)
})

//js执行异常
window.onerror=(message,source,lineno,colno,error)=>{
  console.log('js执行异常',message,source,lineno,colno,error)
}