import { IInteralAppInfo } from "../types";
import { importEntry } from 'import-html-entry';
import { ProxySanBox } from "./proxySanBox";

const runJS=(value:string,app:IInteralAppInfo)=>{
  if(!app.proxy){
    app.proxy=new ProxySanBox();
  }
  // @ts-ignore
  window.__CURRENT_PROXY_=app.proxy.proxy;
  app.proxy.active();
   const code=`
   return (window=>{
     ${value}
     return window['${app.name}']
   })(window.__CURRENT_PROXY)`
  return new Function(code)();
}

export const loadHTML = async (app: IInteralAppInfo) => {
  const { container, entry } = app;
  const {
    template,
    assetPublicPath,
    execScripts,
    getExternalScripts,
    getExternalStyleSheets,
  } = await importEntry(entry);
  const dom = document.querySelector(container);
  if (!dom) {
    throw new Error('容器不存在')
  }
  dom.innerHTML=template;
  await getExternalStyleSheets();
  const  jscode=await getExternalScripts();
  jscode.forEach((script)=>{
    const lifeCycle=runJS(script,app);
    if(lifeCycle){
      app.bootstrap=lifeCycle.bootstrap;
      app.mount=lifeCycle.mount;
      app.unmount=lifeCycle.unmount;
    }
  })
  return app;
}