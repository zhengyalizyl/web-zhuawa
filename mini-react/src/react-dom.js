import { createFiber } from "./createFiber";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

function ReactDomRoot(internalRoot){
  this._internalRoot=internalRoot;
}

ReactDomRoot.prototype.render=function(children){
  const root=this._internalRoot;
  updateContainer(children,root);
}

function updateContainer(element,container){
  const {containerInfo} =container
  const fiber=createFiber(element,{
    type:containerInfo.nodeName.toLocalLowerCase(),
    stateNode:containerInfo
  })
    scheduleUpdateOnFiber(fiber)
}

function createRoot(container){
  const root={containerInfo: container};
  return new ReactDomRoot;
}

export default {createRoot};