const observers=[];
observers.push(A.update);
observers.push(B.next);
observers.push(C.change);
observers.push(D.init);

function notifyObservers(address){
  observers.forEach(observer=>observer(address));
}


import { EventBus} from './event.js';
const update =(address)=>{

}

EventBus.on('ADDRESS',update);



import { EventBus} from './event.js';
const next =(address)=>{

}

EventBus.on('ADDRESS',next);


import { EventBus} from './event.js';
const change =(address)=>{

}

EventBus.on('ADDRESS',change);


import { EventBus} from './event.js';
const init=(address)=>{

}
EventBus.on('ADDRESS',init);

