import { mount, unmount, bootstrap } from '../../umi-app/src/.umi/umi';
export interface IAppInfo{
   name:string;
   entry:string;
   container:string;
   activeRule:string;
}


export type LifeCycle=(app:IAppInfo)=>Promise<any>;

export interface ILifeCycle{
   beforeLoad?:LifeCycle|LifeCycle[],
   mounted?:LifeCycle|LifeCycle[],
   unmounted?:LifeCycle|LifeCycle[]
}



export type EventType='hashchange'|'popstate';

export enum EAppStatus{
    NOT_FOUND='NOT_FOUND',
    NOT_LOADED='NOT_LOADED',
    LOADING='LOADING',
    LOADED='LOADED',
    BOOTSTRAPPING='BOOTSTAPPING',
    NOT_MOUNTED='NOT_MOUNTED',
    MOUNTEING='MOUNTEING',
    MOUNTED='MOUNTED',
    UNMOUNTED='UNMOUNTED',
    UNMOUNTING='UNMOUNTING'
}

export interface IInteralAppInfo extends IAppInfo{
   status:EAppStatus;
   bootstrap?:LifeCycle;
   mount?:LifeCycle;
   unmount?:LifeCycle;
   proxy?:any;
}