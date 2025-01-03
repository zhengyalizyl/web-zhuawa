
class Queue {
  constructor(){
    this.items=[];
  }

  enqueue(item){
    this.items.push(item);
  }

  dequeue(){
    return this.items.shift();
  }

  front(){//查看队列第一个元素
    return this.items[0]
  }
  isEmpty(){
    return this.items.length===0
  }
  size(){
    return this.items.length
  }
  toStringt(){
   let result="";
   for(let item of this.items){
    result+=items+" ";
   }
   return result;
  }
}
class PriorityElement{
  constructor(element,priority){
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue extends Queue{
  constructor(){
    super();
  }

  enqueue(element,priority){
    const queueElement = new PriorityElement(element,priority);
    if(this.isEmpty()){
      this.items.push(queueElement);
    }else{
     let tag=false;
     for(let i=0;i<this.items.length;i++){
      if(queueElement.priority<this.items[i].priority){
        this.items.splice(i,0,queueElement);
        tag=true;
        break;
      }
     }
     if(!tag){
      this.items.push(queueElement);
     }
    }
  }

  dequeue(){
    return super.dequeue()[1];
  }

 
}