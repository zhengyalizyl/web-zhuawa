class legacySandBox{
   currentUpdatePropsValueMap=new Map();
   modifiedPropsOriginalvalueMapInSanBox =new Map();
   addedPropsMapInSandBox=new Map();
   propsWindow={};
   constructor(){
      const fakeWindow=Object.create(null);
      this.propsWindow=new Proxy(fakeWindow,{
         set:(target,prop,value)=>{
            const originalValue= window[prop];
            if(!window.hasOwnProperty(prop)){
                  this.addedPropsMapInSandBox.set(prop,value);
            }else if(!this.modifiedPropsOriginalvalueMapInSanBox.has(prop)){
                this.modifiedPropsOriginalvalueMapInSanBox.set(prop,originalValue);
                
            }
            this.currentUpdatePropsValueMap.set(prop,value);
            window[prop] =value;
            return true;
         },
         get:(target,prop)=>{
            return window[prop]
         }
      })
   }

   setWindowProp(prop,value,isToDelete?){
        if(value===undefined&&isToDelete){
         delete window[prop];
        }else{
         window[prop] =value;
        }
   }

   active(){
      this.currentUpdatePropsValueMap.forEach((value,prop)=>{
            this.setWindowProp(prop,value);   
      })
   }

   inactive(){
      this.modifiedPropsOriginalvalueMapInSanBox.forEach((value,prop)=>{
          this.setWindowProp(prop,undefined,value);
      })
   }
}