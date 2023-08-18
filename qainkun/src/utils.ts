import { match } from 'path-to-regexp';
import { EAppStatus, IInteralAppInfo } from './types';
import { getAppList } from './appList';


export const getAppListStatus = () => {
  const actives: IInteralAppInfo[] = [];
  const unmounts: IInteralAppInfo[] = [];
  const list = getAppList() as IInteralAppInfo[];
  list.forEach(app => {
    const isActive = match(app.activeRule, { end: false })(location.pathname);
    switch (app.status) {
      case EAppStatus.NOT_FOUND:
      case EAppStatus.LOADING:
      case EAppStatus.LOADED:
      case EAppStatus.NOT_MOUNTED:
        isActive && actives.push(app);
      case EAppStatus.MOUNTED:
        !isActive&&unmounts.push(app)
    }
  })
  return {
     actives,
     unmounts
  }
};