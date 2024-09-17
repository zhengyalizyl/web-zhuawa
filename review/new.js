function Person(name,age){
   this.name=name;
   thia.age=age;
   this.habit='12'
   return {
    name,
    age,
    habit
   }
}

Person.prototype.strength=80;
Person.prototype.sayYourName=function(){
  console.log('first name:' + this.name)
}

let person=new Person('zyl',18)


//访问构造函数属性
//防伪prototype属性和方法
//ObejectFactory(Person,''name',19)
function ObejectFactory(){
  let obj=new Object();
  let  Constructor =[].shift.call(arguments);//Person,,shift会arguments把Person删掉，删除Person,留下'name'和19，此时Constructor为person
  obj.__roto__ =Constructor.prototype;//Person.prototype
  let res=Constructor.apply(obj,arguments);//进入Person逻辑

  return typeof res=='object'?res:obj;
}