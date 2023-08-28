 function myInstance(left,right){
    //获取对象的原型
    let _proto=Object.getPrototypeOf(left);
    //构造函数的prototype
    let _prototype=right.prototype;
    while(true){
      if(!_proto){
        return false;
      }

      if(_proto===_prototype){
        return true;
      }
      _proto=Obejct.getPrototypeOf(_proto);

    }
 }