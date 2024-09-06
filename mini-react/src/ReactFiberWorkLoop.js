import { updateHostComponent } from "./ReactFiberReconciler";
import { Placement, Update } from "./utils";

let wip = null;
let wipRoot=null;
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot =fiber;
}

function performUnitWork() {
 const {tag} =wip;
 switch(tag){
  case HostComponent:updateHostComponent(wip);
  break;
  default:
    break;
 }

  if (wip.child) {
    wip = wip.child;
    return;
  }
  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return
    }
    next = next.return
  }
  wip=null;
}

function workLoop(IdleDeadline) {
  while (IdleDeadline.timeRemaining > 0 && wip) {
    performUnitWork();
  }

  if(!wip && wipRoot){
    commitRoot();
  }

}

function commitRoot(){
  commitWorker(wipRoot);
  wipRoot =null;
}

function commitWorker(wip){

  if(!wip){
    return ;
  }

  //提交自己
  const {flags,stateNode} =wip;
  const parentNode = getparentNode(wip.return);
  //插入（初次渲染、更新移动位置）
  if(flags&Placement && stateNode){

    parentNode.appendChild(stateNode);
  }
  if(flags&Update && stateNode){

    updateNode(wip.stateNode,wip.alternate.props,wip.props)
  }

  //提交子节点
   commitWorker(wip.child);
   //提交兄弟
   commitWorker(wip.sibling);
}

requestIdleCallback(workLoop)

function getparentNode(wip){
  let temp=wip;
  while(temp){
    if(temp.stateNode){
       return temp.stateNode
    }
    temp=temp.return;
  }
}