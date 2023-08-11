window.onload=()=>{
  class Wujie extends HTMLElement{
     constructor(){
      super();
      let dom=this.attachShadow({mode:'open'});
      let template=document.querySelector('#wuJie') as HTMLTemplateElement;
      dom.appendChild(template.content.cloneNode(true));
      console.log(this.getAtrr('url'))
     }

     private getAtrr(attr:string){
      return this.getAttribute(attr)
     }

     //生命周期自动触发有东西插入
     connectedCallback(){
      console.log('类似于vue的mounted')
     }

     //生命周期卸载
     disconnectedCallback(){
      console.log('类似于vue的destory')
     }

     //跟watch类似
     attributeChangeCallback(name:any,oldVal:any,newVal:any){
      console.log('跟vue的watch类似，有属性发生变化自动触发')
     }
  }

  window.customElements.define('wu-jie',Wujie)
}

