export const createStore=(createState)=>{
  let state;
  const listeners=new Set();
  const setState=(partial,replace)=>{
       const nextState=typeof partial ==='function'?partial(state):partial;
       if(!Object.is(nextState,state)){
        const preState=state;
        state=replace||typeof nextState!='object'?nextState:Object.assign({},state,nextState);
        listeners.forEach(listener=>listener(state,preState));
       }
  }
  const getState=()=>state;

  const subscribe=(listener)=>{
      listeners.add(listener);
      return ()=>listeners.delete(listener)
  };
  const destroy=()=>{
     listeners.clear();
  };

  const api={
    getState,
    setState,
    destroy,
    subscribe
  }

  state =createState(setState,getState,api)

  return api
}