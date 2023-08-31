export function Vue(options={}){
  this._init(options);
}

//initMixin
Vue.prototype._init=function(options){
  this.$options=options;
  this.$el=options.el;
  this.data=options.data;
  this.$methods=options.nethods;

  //data的处理
  proxy(this,this.$data);

  observer(this.$data);

  new Compiler(this);
}


// this.$data.msg // this.msg
function proxy(target,data){
  Object.keys(data).forEach(key=>{
    Object.defineProperty(target,key,{
       enumerable:true,
       configurable:true,
       get(){
        return data[key]
       },
       set(newVal){
         if(newVal!==data[key]){
          data[key] =newVal;
         }
       }
    })
  })
}



function observer(data){
   new Observer(data)
}

class Observer{
  constructor(data){
    this.walk(data)
  }

  walk(data){
    if(data && typeof data==='object'){
      Object.keys(data).forEach(key=>this.defineReactive(data,key,data[key]));
    }
  }

  defineReactive(obj,key,value){
     let that =this;
     this.walk(value);
     let dep =new Dep();
     Object.defineProperty(target,key,{
      enumerable:true,
      configurable:true,
      get(){
        Dep.target &&dep.add(Dep.target)
       return data[key]
      },
      set(newVal){
        if(newVal!==data[key]){
         data[key] =newVal;
         that.walk(newVal)
         dep.notify();
        }
      }
   })
  }
}


class Watcher{
  constructor(vm,key,cb){
       this.vm=vm;
       this.key=key;
       this.cb=cb;
       //此时Dep.target作为一个全局变量去理解，放的就是这个watcher
       Dep.target =  this;

       this.__old =vm[key];
      //  dep.target干掉
      Dep.target =null;
  }

  update(){
    let newVal =this.vm[this.key];
    if(newVal!==this.__old){
      this.cb(newVal)
    }
  }


}

//每一个数据，都要有一个依赖
class Dep{
    constructor(){
      this.watchers=new Set();
    }

    add(watcher){
       if(watcher && watcher.update){
         this.watchers.add(watcher)
       }
    }
    notify(){
      this.watchers.forEacher(item=>item.update())
    }
}

class Compiler{
  constructor(vm){
    this.el=vm.$el;
    this.vm=vm;
    this.methods=vm.methods;
    this.compile(vm.$sel)
  }

  compile(el){
    let childNodes=el.childNodes;
    Array.from(childNodes).forEach(node=>{
       if(node.nodeType===3){
         this.compileText(node)
       }
    })
  }

  compileText(node){
    // {{msg}}
     let reg=/\{\{(.+?)\}\}/;
     let value=node.textContent;
     if(reg.test(value)){
      let key=RegExp.$1.trim();
      node.textContent =value.replace(reg,this.vm[key]);
      new Watcher(this.vm,key,val=>{
        node.textContent =val;
      })
     }
  }
}
