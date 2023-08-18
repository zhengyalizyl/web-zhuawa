import { loadHTML } from '../loader';
import { EAppStatus, IAppInfo, IInteralAppInfo, ILifeCycle } from '../types';
let lifeCycles:ILifeCycle={};

export const setLifeCycle=(lifeCycles:ILifeCycle)=>{
   lifeCycles=lifeCycles
}


export const getLifeCycle=()=>{
   return lifeCycles
}


export const  runLifeCycle =async(name:keyof ILifeCycle,app:IAppInfo)=>{
  const fn=lifeCycles[name];
  if(Array.isArray(fn)){
    await Promise.all(fn.map(item=>item(app)))
  }else{
    await fn?.(app);
  }
}

export const runMounted=async (app:IInteralAppInfo)=>{
  app.status=EAppStatus.MOUNTEING;
  await app.mount?.(app);
  app.status=EAppStatus.MOUNTED;
  await runLifeCycle("mounted",app)
}
export const runUnMounted=async (app:IInteralAppInfo)=>{
  app.status=EAppStatus.UNMOUNTING;
  await app.unmount?.(app);
  app.status=EAppStatus.UNMOUNTED;
  await runLifeCycle("unmounted",app)
}
export const runBootStrap=async (app:IInteralAppInfo)=>{
 if(app.status!==EAppStatus.LOADED){
  return app
 }

 app.status=EAppStatus.BOOTSTRAPPING;
 await app.bootstrap?.(app);
 app.status=EAppStatus.NOT_MOUNTED
}

export const runBeforeLoad=async(app:IInteralAppInfo)=>{
   app.status=EAppStatus.LOADED;
   await runLifeCycle('beforeLoad',app);
   await loadHTML(app);
   app.status=EAppStatus.LOADED;
}
