//一个类，只能有一个实例
//Vue() Vue.use

const Singleton=function(){
  this.instance=null;
}

Singleton.getInstance=function(){
  if(!this.instance){
    this.instance=new Singleton();
  }
  return this.instance
}

const a=Singleton.getInstance();
const b=Singleton.getInstance();

console.log(a===b)

Loading.show();
Loading.show();

//全局单实例的loading
let fulScreenLoading;
//duration;
//cb
const loading=(options={})=>{
  const defaultOptions={};
  options=merge({},defaultOptions,options);
  if(options.fullScreen && fullScreenLoading){
    return fullScrenloading;
  }

  const loadingInstance =new LoadingConstructor({
    element:document.createElement('div'),
    data:options
  })

  if(options.fullScreen){
    fullScreenloading=loadingInstance();
  }
  return loadingInstance;

}

// react
// context 全局上下文 useContext->loading
mounted(){
  const loadingA=this.$loading({
    text:'a',
    fullScreen:true
  })
  const loadingB=this.$loading({
    text:'b',
    fullScreen:true
  })

}
