import { FunctionComponent } from "./ReactWorkTags";
import { isFn, isStr, Placement } from "./utils";

export function createFiber(vnode,returnFiber){
  const fiber={
    //类型
    type:vnode.type,
    key:vnode.key,
    props:vnode.props,
    //原生标签 dom节点
    //函数组件
    //类组件 实例
    stateNode:null,
    //第一个子节点
    child:null,
    sibling:null,
    //父 fiber
    return:returnFiber,
    index:null,
    //old fiber
    alternate:null,
    flag:Placement
  }
//判断组件类型
const {type} =vnode;
  if(isStr(type)){
    fiber.tag=HostComponent;
  }else if(isFn(type)){
    //?
    fiber.tag=FunctionComponent;
  }else{

  }
  return fiber;
}