import { eventNames, listeners } from "process";
import { EventType } from "../types";
import { getAppList } from "../appList";
import { getAppListStatus } from "../utils";
import { runBeforeLoad, runBootStrap, runMounted, runUnMounted } from "../lifeCycle";

const originalPush = window.history.pushState;
const originalReplace = window.history.replaceState;
let lastUrl: string | null = null;

let historyEvent: PopStateEvent | null = null;

const capturedListeners: Record<EventType, Function[]> = {
  hashchange: [],
  popstate: []
}

const callCpturedListeners = () => {
  if (historyEvent) {
    Object.keys(capturedListeners).forEach(eventName => {
      const listeners = capturedListeners[eventName];
      if (listeners.length) {
        listeners.forEach(listener => {
          listener.call(this, historyEvent)
        })
      }
    })
  }
}

export const reroute = (url: string) => {
  if (url !== lastUrl) {
    const { actives, unmounts } = getAppListStatus();
    Promise.all(unmounts.map(async (app) => {
      await runUnMounted(app);
    }).concat(actives.map(async (app) => {
      await runBeforeLoad(app);
      await runBootStrap(app);
      await runMounted(app);
    }))).then(() => {
      callCpturedListeners();
      historyEvent = null;
    });
    lastUrl = url || location.href;
  }
}


const handleUrlChange = () => {
  reroute(location.href);
}


export const hackRoute = () => {
  window.history.pushState = (...args) => {
    originalPush.apply(window.history, args);
    historyEvent = new PopStateEvent('popstate')
    args[2] && reroute(args[2] as string)
  }
  window.history.replaceState = (...args) => {
    originalReplace.apply(window.history, args);
    historyEvent = new PopStateEvent('popstate')
    args[2] && reroute(args[2] as string)
  }

  window.addEventListener('hashchange', handleUrlChange);
  window.addEventListener('popstate', handleUrlChange);
  window.addEventListener = hackEventListener(window.addEventListener);
  window.removeEventListener = hackEventListener(window.removeEventListener)
}

const hasListeners = (name: EventType, fn: Function) => {
  return capturedListeners[name].filter(listener => listener === fn).length
}

const hackEventListener = (func: Function): any => {
  return function (name: string, fn: Function) {
    if (name === 'hashchange' || name === 'popstate') {
      if (!hasListeners(name, fn)) {
        capturedListeners[name].push(fn);
        return
      } else {
        capturedListeners[name] = capturedListeners[name].filter(listener => listener !== fn);
      }
    }
    return func.apply(window, arguments)
  }
}