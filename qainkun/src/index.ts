import { getAppList, setAppList } from "./appList";
import { setLifeCycle } from "./lifeCycle";
import { hackRoute, reroute } from "./route";
import { IAppInfo, ILifeCycle } from "./types";

export const registerMicroApps = (appList: IAppInfo[], lifeCycle?: ILifeCycle) => {
  setAppList(appList);
  lifeCycle && setLifeCycle(lifeCycle)
}


export const start=()=>{
  const list=getAppList();
  if(!list.length){
    throw new Error('请先注册应用')
  }

  hackRoute();
  reroute(window.location.href)
}