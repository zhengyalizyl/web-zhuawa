
import { useSyncExternalStore } from 'react';
import { createStore } from "./vanilla"

export const create = (createState) => createStateImpl(createState)


const createStateImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore=()=>useStore(api);
  return useBoundStore;
}


export function useStore(api) {
  const slice = useSyncExternalStore(api.subscribe,api.getState);
  return slice;
}
