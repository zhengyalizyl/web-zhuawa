class SnapshotSandBox{
      windowSnapShot={};
      modifyPropsMap={};

      active(){
        for(const prop in window){
           this.windowSnapShot[prop] =window[prop];
        }
        Object.keys(this.modifyPropsMap).forEach((prop)=>{
          window[prop] =this.modifyPropsMap[prop];
         })
      }

      inactive(){
        for(const prop in window){
          if(window[prop]!==this.windowSnapShot[prop]){
            this.modifyPropsMap[prop] =window[prop];
            window[prop] =this.windowSnapShot[prop];
          }
        }
      }
}