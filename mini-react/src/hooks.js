import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";


let currentlyRenderingFiber = null;
let workInprogressHook = null;
export function renderWithHooks(wip) {

  currentlyRenderingFiber = wip;
  currentlyRenderingFiber.memorizedState = null;
}
export function useReducer(reducer, initalState) {
  const hook = updateWorkInprogressHook();
  if (!currentlyRenderingFiber.alternate) {
    hook.memorizedState = initalState
  }
  const dispatch = () => {
    //修改状态值
    hook.memorizedState = reducer(hook.memorizedState);

    //更新组件
    currentlyRenderingFiber.alternate = { ...currentlyRenderingFiber };
    scheduleUpdateOnFiber(currentlyRenderingFiber)
  }

  return [hook.memorizedState, dispatch]
}


//hook={memorizedState:null,next:null}
function updateWorkInprogressHook() {
  let hook;

  const current = currentlyRenderingFiber.alternate;
  if (current) {
    //组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState;
    if (workInprogressHook) {
      workInprogressHook = hook = workInprogressHook.next;
    } else {
      workInprogressHook = hook = currentlyRenderingFiber.memorizedState;
    }
  } else {
    //组件初次渲染
    hook = { memorizedState: null, next: null };
    if (workInprogressHook) {
      workInprogressHook = workInprogressHook.next = hook;
    } else {
      //hook0
      workInprogressHook = currentlyRenderingFiber.memorizedState = hook;
    }
  }
  return hook;
}