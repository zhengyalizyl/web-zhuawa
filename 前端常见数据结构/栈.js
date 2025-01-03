class Stack{
  constructor(){
    this.items = []
  }

  //压栈
  push(item){
    this.items.push(item)
  }

 //出栈
  pop(){
    this.items.pop()
  }

 //找到栈底、
  peekLast(){
    return this.items[0]
  }


  peekTop(){
    return this.items[this.items.length-1]
  }

  isEmpty(){
    return this.items.length === 0
  }

}