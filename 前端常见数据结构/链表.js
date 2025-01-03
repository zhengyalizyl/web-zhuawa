function List() {

  let Node = function (data) {
    this.data = data;
    this.next = null;
  }

  let head = null;
  let tail = head;

  let length = 0;

  //获取当前的链表
  this.getList = function () {
    return head;
  }

  //添加节点
  this.append = function append(element) {
    let node = new Node(element);

    let p = head;
    //边界case，如果head为null,链表长度为0
    if (!head) {
      head = node;
    } else {
      while (p.next) {
        p = p.next
      }

      p.next = node;
    }

    length += 1;

  }

  //查找节点
  this.search = function search(element) {
    let p = head;
    if (!p) {
      return false;
    }
    while (p) {
      if (p.data === element) {
        return true;
      }
      p = p.next;
    }
    return false;
  }


  //插入节点
  this.insert = function insert(position, element) {
    let node = new Node(element);
    if (position >= 0 && position <= length) {
      //previous ->prev上一节点
      //current ->当前节点
      let prev = head;
      let current = head;
      let index=0;
      if (position === 0) {
        node.next = head;//新节点指向当前节点
        head = node;//head指向新节点
      } else {
          while(index<position){
            prev=current;
            current=current.next;
            index++;
          }
          prev.next=node;
          node.next=current;
      }
    } else {
      return false
    }
  }


  //删除节点
  this.delete=function remove(element){
     let p =head;
     let prev=head;
     if(!head){return }

     while(p){
      if(p.element===element){
        p=p.next;
        prev.next=p;
      }else{
        prev=p;
        p=p.next;
      }
     }
  }
}
