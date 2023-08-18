import { IInteralAppInfo } from "../types";
import { importEntry } from 'import-html-entry';

const runJS=(value:string)=>{
  return new Function(value)();
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
    const lifeCycle=runJS(script);
    if(lifeCycle){
      app.bootstrap=lifeCycle.bootstrap;
      app.mount=lifeCycle.mount;
      app.unmount=lifeCycle.unmount;
    }
  })
  return app;
}