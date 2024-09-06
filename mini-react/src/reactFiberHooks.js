import { updateWorkInprogressHook } from "./hooks";

export function  useMemo(nextCreate,deps){
   const hook =updateWorkInprogressHook();
   const nextDeps =deps===undefined?null:deps;
   const preState=hook.memoizedstate;
   // @to-do
   if(preState!==null){
    if(nextDeps!==null){
        const preDeps=pre
    }
   }
   const nextValue=nextCreate();
   hook.memoizedstate=[nextValue,nextDeps];
   return nextValue;
}