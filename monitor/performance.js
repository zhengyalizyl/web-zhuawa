// - FP(首屏渲染)
// - FCP（首次内容渲染）
// - FMP(视团队而定)
// - LCP(最大内容渲染)
// - CLS(布局偏移 Mutation Observer)
// - TTI(交互时间)

//页面加载时间
function pageLoadtime(){
  const time=performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log(time)
}

pageLoadtime();


//最大内容渲染
function lcp(){
new PerformanceObserver((entryList)=>{
   const entries =entryList.getEntries();
   const lastEntry=entries[entries.length-1];
   const lcpTime =lastEntry.startTime;
 console.log(`lcp:${lcpTime}`)
}).observe({type:"largest-contentful-paint",buffered:true})
}
lcp();


//交互时间
function tti(){
  const timeToInteractive= performance.timing.domInteractive - performance.timing.navigationStart;
}