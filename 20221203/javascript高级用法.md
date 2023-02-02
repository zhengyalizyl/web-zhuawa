# javascript高级用法(1/2)

## 原型&原型链

函数 prototype指向的是一个对象，这个对象是调用该构造函数创建的实例的原型

### 原型：每一个js对象(null除外)在创建的时候会关联另一个对象，这个对象就是原型，都会从原型上继承属性

```js
function Person(){}
const person=new Person();
console.log(person.__proto__===Person.prototype);//true
console.log(Person.prototype.constructor===Person)//true
console.log(Object.getPrototypeOf(person)===Person.prototype)//true
```

读取实例的属性时，如果找不到，就会找原型的属性，如果还找不到，就会找原型的原型，直到找到头为止

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/原型.jpeg" alt="原型" style="zoom: 67%;" />

## 词法作用域 动态作用域

作用域：定义了如何查找变量，当前执行的代码有没有权限访问变量

词法作用域又叫 静态作用域

- 词法作用域:在函数定义时确定的

- 动态作用域：在函数调用时确定的

```js
var scope='global scope';
function checkScope(){
    var scope='local scope';
    function f(){
        return  scope;
    }
    return f();
}

checkScope();//local scope


var scope='global scope';
function checkScope(){
    var scope='local scope';
    function f(){
        return  scope;
    }
    return f;
}

checkScope()();//local scope
```

## 执行上下文

在函数上下⽂中，我们⽤活动对象( activation object , AO)来表示变量对象。 

活动对象和变量对象其实是⼀个东⻄，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进⼊⼀个执⾏上下⽂中，这个执⾏上下⽂的变量对象才会被激活，所 以才叫 activation object，⽽只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。 

活动对象是在进⼊函数上下⽂时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象

```js
var  foo=function(){
    console.log('foo1')
}

foo();//foo1
var foo=function(){
    console.log('foo2')
}

foo();//foo2，因为

function foo(){
    console.log('foo1')
}
foo(); //foo2,这里function foo(){
   // console.log('foo2')
//}会将//function foo(){
   // console.log('foo1')
//}覆盖掉

function foo(){
    console.log('foo2')
}
foo();//foo2
```

execute context stack执行上下文栈，管理执行上下文(ECS)---先进后出(执行的时候才会压入栈)

![ecsstack-case1](/Volumes/F/zyl-study/web-zhuawa/20221203/ecsstack-case1.jpeg)



![](/Volumes/F/zyl-study/web-zhuawa/20221203/ecsstack-case2.jpeg)

## 变量对象

Js执行代码，会创建执行上下文

1.变量对象

2.作用域链

3.this

变量对象:是与执行上下文相关的数据作用域，存储上下文中的定义的变量和函数声明

- 全局上下文的变量

​      在js里，全局上下文的变量就是全局对象window

- 函数上下文的变量

  activation object AO 活动对象

  arguments初始化 arguments属性值就是Arguments对象

### 上下文的执过程

1.进入执行上下文

2.执行代码

执行上下文

变量对象

1.函数的形参

2.函数的声明

3.变量声明

```js
function foo(a){
    var b=2;
    function c(){}
    var d=function(){};
    b=3;
}
foo(1)

//1.进入执行上下文
AO={
    arguments:{
        0:1,
        length:1
    }，
    a:1,
    b:undefined,
    c:reference to function c(){},
    d:undefined
}

//代码执行
AO={
     arguments:{
         0:1,
        length:1
    }，
    a:1,
    b:3,
    c:reference to function c(){},
    d:reference to Functionexpress 'd'
}
```

## 作用域链

当查找变量的时候，会先从当前上下⽂的变量对象中查找，如果没有找到，就会从⽗级(词法层⾯上的⽗级)执⾏上下⽂的变量对象中查找，⼀直找到全局上下⽂的变量对象，也就是全局对象。这样由多个执⾏上下⽂的变量对象构成的链表就叫做作⽤域链。

```js
function foo(){
    function bar(){
        
    }
}

foo.[[scope]]=[
    globalContext.AO
]

bar.[[scope]]=[
    fooContext.AO
    globalContext.VO
]

//函数执行
Scope=[AO].concat([[scope]])[AO,VO]
```

## this

1.在浏览器下，全局this是window

2.函数this,例如show();//window如果是use strict,则为undefined

3.对象this：

- 作为普通函数调用，指向全局对象
- 作为构造函数调用时，this指向new出来的对象
- 作为对象方法调用时，this指向上级对象
- apply,call,bind调用this指向其绑定的对象

箭头函数this的指向是定义该函数时所在作用域指向的对象

## 闭包

闭包：指能够访问自由变量的函数

自由变量：指的是在函数中使用的，但既不是函数参数也不是函数的局部变量的变量

闭包=函数+函数能够访问的自由变量

```js
var a=1;
function foo(){
    console.log(a)
}
foo()
```

实践角度出发:

1.即使创建的上下文已经销毁了，但是仍然存在(内容函数从父函数中返回)

2.如果在代码中引用了自由变量

```js
var scope="global scope";
function checkscope(){
    var scope="local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();//local scope

fContext={
    Scope:[AO,checkScopeConext.AO,globalContext.VO]
}
```

1.进入全局代码，创建全局执行的上下文，压入全局执行上下文到上下文栈

2.初始化全局执行上下文

3.执行checkscope,创建checkscope的函数执行上下文，把checkscope的执行上下文压入执行上下文的栈

4.checkscope执行上下文初始化，创建变量对象，作用域链，this

5.执行完成，弹出checkscope

6.执行f，创建f上下文，压栈

7.f执行上下文初始化，创建变量对象，作用域链,this

8.f执行完成，f上下文弹出栈

# javascript高级用法(2/2)

函数变量提升

## 参数按值传递

ECMAscript的所有函数的参数都是按值传递

function foo(a){}

把函数外部的值赋值给函数内部的参数，把值从一个变量赋值到另一个变量一样

1.按值传递

```js
var val=1;
function foo(v){
     v=2;
    console.log(v);//2
}
foo(val);//传递的是赋值后val的结果,_val
console.log(val)//1
```

2.引用传递（传递对象的时候，传递的是地址的索引）

```js
var obj={val:1};
function foo(o){
    o.val=2;//这里没有改变o的地址，只是改变了val的值
    console.log(o.val)//2，
}
foo(obj)
console.log(obj.val);//2，因为地址并没有改变，obj的引用地址没有变化
```

```js
var obj={val:1};
function foo(o){
    o=2;//把o的地址直接变成了值
    console.log(o)//2
}
foo(obj)
console.log(obj.val);//1，obj的引用地址没有变化，变的只是o的东西
```

共享传递

传递对象的时候，传递的是地址的索引

## Js的数据类型：基本类型和引用类型

1.基本类型：存储在栈，传递的是当前的值，修改不会影响原先的值

2.引用类型：索引的引用地址，是存储在栈中，它的值存储在堆中

## 手写call和apply

1.call：使用一个指定的this的值和若干个指定的参数的值的前提下调用某个函数

```js
let foo={
 val:1
};

function bar(){
    console.log(this.val)//1
};

bar.call(foo);
```

第一步：改变this的指向,将函数设为对象的属性

第二步：执行该函数

第三步：删除该函数

```js
foo.fn=bar;
foo.fn();
delete foo.fn;
```

步骤

```js
Function.prototype.call2=function(context){
    //首先，获取调用call的函数，可以用this获取
    context.fn=this;
    context.fn();
    delete context.fn;
}
```

```js
var foo={
    value:1
};

function bar(name,age){
    console.log(name);
    console.log(age);
    console.log(this.value);
}

bar.call(foo,'zyl',18)
```

```js
var obj={
    val:1
}

function bar(name,age){
    return {
        val:this.val,
        name,
        age,
    }
}

console.log(bar.call(obj,'zyl',18))//{val: 1, name: 'zyl', age: 18}
```

```js
Function.prototype.call2=function(context,...args){
     //首先,获取调用call的函数，可以用this获取
    let context=context||window;
    context.fn=this;
    let result= context.fn(...args);
    delete conext.fn;
    return result;
}
```



```js
Function.prototype.apply=function(context,arr){
    var conext=conext||window;
    context.fn=this;
    let result;
    if(!arr){
        result=conext.fn();
    }else{
        result=conext.fn(...arr)
    }
    delete conext.fn;
    return result;
}
```

## 手写bind

bind会创建一个新的函数，当新的函数被调用时，bind()的第一个参数作为运行时的this,后续的参数作为参数

```js
var foo={
    val:1
}

function bar(){
    console.log(this.val)
}

var bindFoo=bar.bind(foo);
bindFoo();
```

```js
Function.prototype.bind2=function(context){
    var self=this;
    return function(){
        return self.apply(context)
    }
}
```



```js
var foo={
    val:1
}

function bar(name,age){
    console.log(this.val);
    console.log(name);
    console.log(age);
}

var bindFoo=bar.bind(foo,'zyl');
bindFoo('18');
```

```js
Function.prototype.bind2=function(context){
    var self=this;
    var args=Array.prototype.slice.call(arguments,1)////arguments是类数组的对象
    return function(){
        var bindArgs=Array.prototype.slice.call(arguments)//arguments指的是bind的返回结果的函数的入参
        return self.apply(context,args.concat(bindArgs))
    }
}
```

当bind返回的函数作为构造函数的时候，bind的指定this值会失效，但传入的参数会生效

```js
var value=2;
var foo={
    value:1
}

function bar(name,age){
    this.habit='shopping';
    console.log(name);
    console.log(age)
}

bar.prototype.friend='zyl';
var bindFoo=bar.bind(foo,'zyl1');
var obj=new bindFoo(12);
//undefined
//zyl1
//12
console.log(obj);//{"habit": "shopping"}
console.log(obj.habit);//shopping
console.log(obj.friend);//zyl
```



1.返回一个函数

2.可以传递参数

```js
Function.prototype.bind2=function(context){
    if(typeof this!='function'){
        throw new Error('this绑定不能为非函数的内容')
    }
    let self=this;
    let args=Array.prototype.slice.call(arguments,1);//arguments是类数组的对象
    let fnop=function(){};
    let fBound= function(){
         let bindArgs=Array.prototype.slice.call(arguments,1);//arguments指的是bind的返回结果的函数的入参
         return self.apply(this instanceof fnop?this:context，args.concat(bindArgs))//这里的this,指的是构造函数的this
    }
    fnop.prototype=this.prototype;//
    fBound.prototype=new fnop();//继承构造函数的原型,以防fBound的prototype改变会使this.prototype发生改变，故用一个空的函数来转接
    return fBound;
}

```

当bind返回的函数作为构造函数的时候，bind的指定this值会失效，但传入的参数生效

## new

1.new返回的结果是一个对象obj person.apply(obj,arguments)

2.实例的__proto__ 指向构造函数的prototype

```js
function objectFactory(){
    var obj=new Object();//创建一个空对象
    Constructor=[].shift.call(arguments);
    obj.__proto__=Constructor.prototype;//将新的对象的原型绑定到构造函数的原型上
    var ret=Constructor.apply(obj,arguments)//将构造函数this指向新新对象
    return typeof ret='object'?ret:obj;
}
```

## 类数组对象 arguments

```js
var data=[];
for(var i=0;i<3;i+=1){
    (data[i]=function(){
         console.log(arguments.callee.i)
    }).i=i;//闭包
}

data[0]();//0
data[1]();//1
data[2]();//2
```

## 创建对象的形式

### 1.工厂模式

```js
function createPerson(name){
    var  o=new Object();
    o.name=name;
    o.getName=function(){
        console.log(this.name);
    }
    return o;
}

const person1=createPerson('zyl');
const person2=createPerson('zyl1');
```

缺点：所有实例的原型都指向同一个原型，原型改变，会影响所有实例

### 2.构造函数

```js
function Person(name){
    this.name=name;
    this.getName=getName;
}

function getName(){
    console.log(this.name)
}

const person1=new Person('zyl');
const person2=new Person('zyl1');
```

### 3.原型模式

```js
function Person(name){}

Person.prototype.name='zyl';
Person.prototype.getName=function(){
    console.log(this.name)
}
const person1=new Person();
```

#### 3.1原型模式优化

```js
function Person(name){}

Person.prototype={
     constructor:Person,
     name:'zyl',
     getName:function(){
         console.log(this.name)
     }
}

const person1=new Person();
```

### 4.组合模式

```js
function Person(name){
    this.name=name;
}

Person.prototype.getName=function(){
   console.log(this.name)
}
const person1=new Person();
```

## 继承的形式

### 1.原型继承

```js
function Parent(){
    this.name='zyl';
}

Parent.prototype.getName=function(){
    console.log(this.name)
}

function Child(){}
Child.prototype=new Parent();
const child=new Child();
console.log(child.getName())//zyl
```

### 2.构造函数

```js
function Parent(){
    this.name=['zyl','zyl1'];
}

function Child(){
    Parent.call(this);
}

const child1=new Child();
child1.name.push('test');
const child2=new Child();

console.log(child1.name)//['zyl','zyl1','test']
console.log(child2.name)//['zyl','zyl1']
```

### 3.组合继承

```js
function Parent(name){
    this.name=name;
    this.colors=["red",'green','blue'];
}

Parent.prototype.getName=function(){
    console.log(this.name);
}

function Child(name,age){
    Parent.call(this,name);
    this.age=age;
}

Child.prototype=new Parent();
Child.prototype.constructor=Child;
const child1=new Child('zyl',6666);
child1.colors.push('white');

console.log(child1.name,child1.age,child1.colors)//zyl,6666,['red','green','blue','white']

const child2=new Child('zyl1',9999);

console.log(child2.name,child2.age,child2.colors)//zyl1,9999,['red','green','blue']
```

# 异步处理

https://www.yuque.com/lpldplws/atomml/gtn6hvlf3fh1gl6e?singleDoc# 《前端异步处理规范及应用》 密码：cdik

## promise

```js
let p1=new Promise((resolve,reject)=>{
    resolve('success');
    reject('fail');
});
console.log('p1',p1);
let p2=new Promise((resolve,reject)=>{
    reject('success');
    resolve('fail');
})
console.log('p2',p2);
let p3=new Promise((resolve,reject)=>{
    throw 'error';
})

console.log('p3',p3);

//p1 Promise{<fulfilled>:'success'}
//p2 Promise{<rejected>:'success'}
//p3 Promise{<rejected>:'error'}
```

1.执行resolve ->fullfilled

2.执行reject ->rejected

3.Promise 状态更改后不可改变

4.throw等同于reject

5.初始状态pending

### 实现resolve reject

```js
class MyPromise{
     constructor(executor){
         //初始状态
         this.initValue();
         //初始化this指向
         this.initBind();
         //执行传入的函数
         try{
             executor(this.resolve,this.reject); 
         }catch(e){
             this.reject(e)
         }
        
     }
    
    initValue(){
        this.PromiseResult=null;
        this.PromiseState='pending';
    }
    
    initBind(){
        this.reolve=this.resolve.bind(this);
        this.reject=this.reject.bind(this); //绑定MyPromise的实例
    }
    
    resolve(val){
        if(this.PromiseState!=='pending'){ return}
        this.PromiseResult=value;
        this.PomiseState='fullfilled'
    }
    
    reject(reason){
         if(this.PromiseState!=='pending'){ return}
         this.PromiseResult=reason;
        this.PomiseState='rejected'
    }
    
}
```

例子：

```js
const p1=new Promise((resolve,reject)=>{
    resolve('success')
}).then(res=>console.log(res),err=>console.log(err)); //success

const p2=new Promise((resolve,reject)=>{
    setTimeOut(()=>{
        reject('fail')
    },1000)
}).then(res=>console.log(res),err=>console.log(err)); //fail

const p3=new Promise((resolve,reject)=>{
    resolve(100)
}).then(res=>2*res,err=>console.log(err)).then(res=>console.log(res),err=>console.log(err)) //200

```

源码实现

```js
  then(onFulfilled,onRejected){
    //参数校验，确保一定是函数
    onFulfilled=typeof onFulfilled==='function'?onFulfilled:val=>val;
    onRejected=typeof onRejected==='function'?onRejected:reason=>{throw reason};     
if(this.PromiseState==='fulfilled'){
        //如果当前为成功状态，执行第一个回调
        onFulfilled(this.PromiseResult);
    }else if(this.PromiseState==='rejected'){
        //如果当前为失败状态，执行第二个回调
        onRejected(this.PromiseResult)
    }
  }
```

1.then接收2个回调：res,err

2.resolve->res, reject->err

3.resolve reject在定时器中执行，等定时器执行后再进行then

4.then支持链式，下次then会受到上次影响

例子：

```js
const p3=new Promise((resolve,reject)=>{resolve(100)})
.then(res=>2*res,err=>console.log(err))
.then(res=>console.log(res),err=>console.log(err));

const p4=new Promise((resolve,reject)=>{resolve(100)})
.then(res=>new Promise(resolve,reject)=>resolve(3*res),err=>console.log(err))
.then(res=>console.log(res),err=>console.log(err))


```

 then本身就会返回promise对象

 返回值为promise对象，success/fail->新的promise success/fail

 返回的值为非promise对象，返回success val

实现的源码

```js
class MyPromise {
    constructor(executor) {
        //初始状态
        this.initValue();
        //初始化this指向
        this.initBind();
        //执行传入的函数
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e)
        }

    }

    initValue() {
        this.PromiseResult = null;
        this.PromiseState = 'pending';
        this.onFulfilledCallbacks = []; //成功的回调
        this.onRejectedCallbacks = []; //失败的回调
    }

    initBind() {
        this.reolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this); //绑定MyPromise的实例
    }

    resolve(val) {
        if (this.PromiseState !== 'pending') { return }
        this.PromiseResult = value;
        this.PomiseState = 'fullfilled';

        //执行保存的成功回调
        while (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.shift()(this.PromiseResult)
        }
    }

    reject(reason) {
        if (this.PromiseState !== 'pending') { return }
        this.PromiseResult = reason;
        this.PomiseState = 'rejected';
        //执行保存的成功回调
        while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(this.PromiseResult)
        }
    }

    //如何保证then可以链式调用？返回promise对象，含有then
    then(onFulfilled, onRejected) {
        //参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        let thenPromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                const resolvePromise = (cb) => {
                    try {
                        const x = cb(this.PromiseResult);
                        if (x === thenPromise&&x) {
                            throw new Error('不能返回自身')
                        }
                        //如果返回值是Promise success->success fail->fail
                        if (x instanceof MyPromise) {
                            //等同于，只有then才知道promise返回的结果是成功还是失败
                            x.then(resolve, reject)
                        } else {
                            //返回的值是非Promise
                            resolve(x)
                        }
                    } catch (e) {
                        reject(e);
                        throw new Error(e)
                    }

                }

                if (this.PromiseState === 'fulfilled') {
                    //如果当前为成功状态，执行第一个回调
                    // onFulfilled(this.PromiseResult);
                    resolvePromise(onFulfilled)
                } else if (this.PromiseState === 'rejected') {
                    //如果当前为失败状态，执行第二个回调
                    // onRejected(this.PromiseResult)
                    resolvePromise(onRejected)
                } else if (this.PormiseState === 'pending') {
                    this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
                    this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
                }
            }, 0)
        })

        return thenPromise;
    }

```

### -all

1.接收promise数组，如果有非promise的值，返回成功

2.全部promise都成功，返回成功结果

3.如果有一个不成功，返回失败

```js
all(promiseList){
    const result=[];
    let count=0;
    return new MyPromise((resolve,reject)=>{
        const addData=(index,val)=>{
            result[index]=val;
            count+=1;
            if(count===promise.length){
                resolve(result)
            }
        };
        promiseList.forEach((promise,index)=>{
            if(promise instanceof MyPromise){
                promise.then(res=>{
                    addData(index,res)
                },err=>reject(err))
            }else {
                addData(index,promise)
            }
        })
    })
}
```

### -race

1.接收promise数组，如果有非promise的值，返回成功

2.返回最快得到结果的promise

```js
race(promiseList){
    return new MyPromise((resolve,reject)=>{
        promiseList.forEach((promise,index)=>{
            if(promise instanceof MyPromise){
                promise.then(res=>{
                    resolve(res)
                },err=>reject(err))
            }else {
              resolve(promise)
            }
        })
    })
}
```

### -allSettled

1.接收promise数组，如果有非promise的值，返回成功

2.保存所有promise的结果，返回数组

```js
allSettled(promiseList) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
        const addData = (status, val, i) => {
            result[i] = {
                status,
                val
            }
            count += 1;
            if (count === promise.length) {
                resolve(result)
            }
        };
        promiseList.forEach((promise, i) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    addData('fulfilled', res, i)
                }, err => addData('rejectd', err, i))
            } else {
                addData('fulfilled', promise, i)
            }
        })
    })
}
```

### -any

1.接收promise数组，如果有非promise的值，返回成功

2.如果有一个promise成功，返回成功结果

3.如果全部失败，报错

```js
any(promiseList) {
    let count = 0;
    return new MyPromise((resolve, reject) => {
        promiseList.forEach((promise, index) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    resolve(res)
                }, err => {
                    count += 1;
                    if (count === promise.length) {
                        reject('error')
                    }
                })
            } else {
                resolve(promise)
            }

        })
    })
}
```

https://www.yuque.com/lpldplws/atomml/gtn6hvlf3fh1gl6e?singleDoc# 《前端异步处理规范及应用》 密码：cdik

## async/await

```js
function request(num){
    return new Promise(()=>{
        setTimeout(()=>{
            console.log(num*2)//因为没有返回结果
        },1000)
    })
}

async function fn(){
    await request(1);
    await request(2);
}

fn()//只会输出2,
```

```js
function request(num){
        setTimeout(()=>{
            console.log(num*2)
        },1000)
}

async function fn(){
    await request(1);
    await request(2);
}

fn()//输出2
//输出4
```

1.如果await后面跟的不是promise，是没法实现类似异步转同步的效果

async/await

- await async一起用

- async返回的内容是promise,要不要返回值，看return

- await 接promise异步转同步，不接promise同步

- async/await 写法异步转同步

## generator

```js
function fn(num){
    console.log(num);
    return num;
}

function *gen(){
    yield fn(1);
    yield fn(2);
    yield fn(3);
    return 4
}

const g=gen();
console.log(g);//gen{<suspended>}
console.log(g.next());//{value:1,done:false}
console.log(g.next());//{value:2,done:false}
console.log(g.next());//{value:3,done:false}
console.log(g.next());//{value:4,done:true}
```



```js
function fn(num){
    return new Promise(reslove=>{
        setTimeout(()=>{
            resolve(num)
        },1000)
    })
}

function *gen(){
    yield fn(1);
    yield fn(2);
    yield fn(3);
    return 4
}

const g=gen();
console.log(g);//gen{<suspended>}
console.log(g.next());//{value:Promise,done:false}
console.log(g.next());//{value:Promise,done:false}
console.log(g.next());//{value:Promise,done:false}
console.log(g.next());//{value:4,done:true}
```

```js
function *gen(){
    const num1=yield 1;
    console.log(num1);
    const num2=yield 2;
    console.log(num2);
    return 3;
}
const g=gen();
console.log(g.next());// {value:1,done:false}
console.log(g.next(111));//111 {value:2,done:false}
console.log(g.next(222));//222 {value:3,done:true}
```

Promise &next一起用

1.yield后能跟promise

2.next可以通过函数传参

```js
function fn(nums) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(nums * 2)
        }, 1000)
    })
}

function* gen() {
    const num1 = yield fn(1);
    const num2 = yield fn(num1);
    const num3 = yield fn(num2);
    return num3
}

const g = gen();
const next1 = g.next();
next1.value.then(res1 => {
    console.log(next1); //{value: Promise(status:'fulfilled',value:2), done: false}
    console.log(res1) //2
    const next2 = g.next(res1);
    next2.value.then(res2 => {
        console.log(next2); //{value: Promise(status:'fulfilled',value:4), done: false}
        console.log(res2); //4
        const next3 = g.next(res2);
        next3.value.then(res3 => {
            console.log(next3); //{value:Promise(status:'fulfilled',value:8), done: false}
            console.log(res3); //8
            console.log(g.next(res3)); //{value:8,done:true}
        });

    })
})
```

用generator实现async/await

 ```js
 function HOC(generatorFn){
     return asyncFn
 }
 
 function *gen(){}
 const asyncFn=generatorToAsync(gen);
 console.log(asyncFn)
 ```



```js
function generatorToAsync(generatorFn) {
    return function() {
        const gen = generatorFn.apply(this, arguments);//this指向调用这个的实例
        return new Promise((resolve, reject) => {
            function go(key, arg) {
                let res;
                try {
                    res = gen[key](arg);
                } catch (err) {
                    reject(err)
                }
                console.log(res);
                const { value, done } = res;
                if (done) {
                    return resolve(value)
                } else {
                    //value可能是一个值，可能是promise,可能是成功或者失败
                    return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
                }
            }

            go('next')
        })
    }
}                         
```

# 前端模块化开发

## cmd和amd的区别

- amd是依赖前置，cmd依赖就近

- amd：返回return ,cmd：exports出去的

## esm(es module  es6)

在编译的时候，能确定模块的依赖关系，以及导入与导出

Commons amd都是运行时

## ES module和 commonjs区别

1.commonjs 可以动态加载语句，代码发生在运行时。esm是静态编译期间就确定模块的依赖，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时

2.commonjs输出的是值的拷贝，可以修改导出的值,一旦内部再修改这个值，则不会同步到外部。esm输出的是值的引用，内部修改可以同步到外部，而且导入的值，不能进行修改，也就是只读

common module.exports对象的属性

esm更多的作为静态的定义

```js
//lib.js
export let cnt=3;
export function intCnt(){
    cnt++;
}

import {cnt,intCnt} from './lib';
console.log(cnt);//3
intCnt();
console.log(cnt);//4
cnt=10;//抛出错误

//lib.js
//commonjs环境
module.exports={
     cnt:3,
     intCnt:(){
     cnt++;
 }
}
let {cnt,intCnt}=require('./lib.js');
console.log(cnt);//3
intCnt();
console.log(cnt);//3
cnt=10;//不会报错
```

## AMD

Asynchronous moule definnition

![amd结构目录](/Volumes/F/zyl-study/web-zhuawa/20221203/amd结构目录.jpg)

```js
//dataService.js
define(function(){
    let msg='zyl';
    function getMsg(){
        return msg.toUpperCase();
    }
    return {getMsg}
})


//alerter.js
define(['dataService'],function(dataService){
    let name='zyl122';
    function showMsg(){
        alert(dataService.getMsg()+','+name)
    }
    return {showMsg}
})

//main.js
(function(){
    require.config({
        baseUrl:'js/',//根级目录
        paths:{
            alerter:'./modules/alerter',
            dataService:'./modules/dataService'
        }
    })
    require(['alerter'],function(alerter){
        alerter.showMsg();
    })
})()


//index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AMD</title>
</head>
<body>
    <script data-main="js/main" src="js/libs/require.js"></script>
</body>
</html>
```

## CMD

Common module definition

Commons +amd ->sea.js

```js
define(function(require,exports,module){
    let module=require('./module');
    require.async('./module2',function(m){
        
    });
    module.showMsg();
    exports.XXX=val;
    
})
```

![cmd结构目录](/Volumes/F/zyl-study/web-zhuawa/20221203/cmd结构目录.jpg)

```js
//module1.js
define(function(require,exports,module){
    let data='zyl.com';
    function show(){
        console.log('module1 1 show'+data);
    }
    exports.show=show;
})

//module2.js
define(function(require,exports,module){
 module.exports={
     msg:'hello zyl'
 }
})

//module3.js
define(function(require,exports,module){
 const API_KEY='abc123';
    exports.API_KEY=API_KEY;
})

//module4.js
define(function(require,exports,module){
    //同步引用
  var module2=require('./module2');
    function show(){
        console.log('module2 show()'+module2.msg)
    }
    
    //异步引用
    require.async('./module3',function(m3){
        console.log('module3'+m3.API_KEY)
     
    })
    exports.show=show;
})


//main.js
define(function(require,exports,module){
 let m1=require('./module1');
    let m4=require('./module4');
    m1.show();
    m4.show();
})

//index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AMD</title>
</head>
<body>
    <script type="text/javascript" src="js/libs/sea.js"></script>
 <script type="text/javascript" >
     seajs.use('./js/modules/main.js')
     </script>
</body>
</html>
```



# 浏览器事件&请求



stopPropagation:停止事件在dom层上的事件传播，包括捕获和冒泡

preventDefault:停止点击a标签跳转url

## 手写ajax

```js
const ajax = option => {
    //0.将对象转换成字符串
    const objToString = data => {
        data.t = new Date().getTime();
        let res = [];
        for (let key in data) {
            res.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
        return res.join('&')
    }

    let str = objToString(option.data || {});

    //1.创建一个异步对象xmlHttp
    let xmlHttp, timer;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else if (xmlHttp) {
        //code for IE6,IE5
        xmlHttp = new ActiveXObject('Microsoft-xmlHttp');
    }

    //2.设置请求方式和请求地址
    if (option.type.toLowerCase() === 'get') {
        xmlHttp.open(option.type, option.urtl + '?t=' + str, true);
        //3.发送请求
        xmlHttp.send();
    } else {
        xmlHttp.open(option.type, option.url, true);
        //在post请求中，必须在open和send之间添加HTTP请求头：setREquestHeader(header,value)
        xmlHttp.setRequestHeader('Content-type', "appliaction/x-www-form-urlencoded");
        xmlHttp.send(str)
    }

    //监听状态的变化
    xmlHttp.onreadystatechange = function() {
        clearInterval(timer);
    }
    if (xmlHttp.readyState === 4) {
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304) {
            //处理返回的结果
            option.success(xmlHttp.responseText);
        } else {
            option.error(xmlHttp.responseText)
        }
    }


    if (option.timeout) {
        timer = setInterval(function() {
            xmlHttp.abort();
            clearInterval(timer)
        }, option.timeout)
    }

}
```

# JS垃圾回收与内存泄漏

## GC策略

可达性：通过某种方式能够访问或者说引用的内存地址，具有可达性的数据，不会被垃圾回收

GC：js引擎周期性的寻找不具有可达性的内存空间进行释放

周期性原因：开销太大

### 1.标记清除 mark-sweep

- 标记：针对所有的AO活动对象(被引用到的内存地址)进行标记
- 清除：把没有标记的非AO活动对象 进行清除

```js
let name='zyl';
let obj={
    name:'zyl1'
}
```

1.针对所有变量设置一个二进制的tag

2.设置两个列表：进入当前上下文的变量列表与离开当前上下文的变量列表

根对象开始遍历内存，对所有用到的对象进行标记

1.打标，初始默认设置为垃圾设置为 0

2.从根结点遍历，不是垃圾设置为1

3.清理所有为0的垃圾，销毁内存空间

4.标记为1会被重置为0

优缺点：

1.实现方式简单，二进制 tag

- first-fit:直接返回找到的第一个大于等于新建内存块大小的内存

- best-fit：遍历所有的空闲内存，返回最小的符合大小的区块

- worst-fit:遍历所有空闲内存，返回最大的，分为size+以及另一块空的内存

缺点：

- 内存碎片化

- 分配速度o(n)

## 标记整理算法：mark-compact

## 引用计数

reference counting

对象是不是不再需要 ->没有其它对象引用到它

1.声明了一个变量且将一个引用类型赋值给改变量，cnt+1

2.如果同一个值被赋值给别的变量+1

3.被其他值覆盖，引用次数 -1

4.直到为0，GC

V8对GC做了优化

分代式垃圾回收

新生代：小的，新的，存在时间短 1-8M

老生代

## 新生代的垃圾回收

- 当新生代中内存被多次复制后，会移动到老生代

- 当空闲区使用空间超过25%

## 老生代的垃圾回收

全停顿 stop-the-world GC

parallel并行回收

增量标记

三色标记 如何针对GC暂停和恢复

## 内存泄漏

```js
function fn1(){
    let test=new Array(1000).fill('zyl');
    return function(){
        return test
    }
}

let fn1Child=fn1();
fn1Child();
fn1Child=null;//不写这段代码，会出现内存泄漏
```

隐式全局变量不会主动垃圾回收

```js
function fn(){
     test1=new Array(1000).fill('zyl');
     this.test1=new Array(1000).fill('zyl');
}
test1=null;
test2=null;
```

```js
let obj={
    id:1,
}
let user={
    info:obj
}
let  set=new Set([obj]);
let map=new Map([[obj,'zyl']]);
obj=null;
console.log(user.info)//{id:1}
```

```js
let obj={
    id:1,
}
let user={
    info:obj
}
let  set=new WeakSet([obj]);
let map=new WeakMap([[obj,'zyl']]);
obj=null;
console.log(user.info)//null
```

# js运行机制

## 进程

https://www.yuque.com/lpldplws/atomml/wa93b6?singleDoc# 《阿里前端面试官带你深度模拟前端专家面试》 密码：xord

1.进程：cpu资源分配的最小单位

- 独立运行，运行中的程序
- 有自己的资源空间

2.线程

- cpu调度的最小单元

3.协程 fiber requestIdleCallback

调度和切换 线程消耗更少

- 多进程
- 多线程

## 为什么js是单线程？

操作dom ->单线程

worker线程 web worker不能操作dom

## chrome浏览器

1.browser进程

- 中控 --控制浏览器各个窗口

2.第三方插件进程

3.GPU 3D进程

4.renderer 渲染进程

4.1 GUI渲染线程：

- parser Html Css Dom CSSOM ->render tree

- repaint 重绘
- reflow 回流/重排 resize

4.2 js引擎线程 fiber

- v8引擎 执行js脚本程序 解析js，运行代码

GUI和js引擎是互斥的，相同的时间下，只能运行一个

```js
<script src="./script.js" async></script>
<scipt src="./script.js" defer></script>
```

### async和defer的区别？

- defer属性告诉浏览器不要等待脚本，浏览器回继续处理HTML,构建DOM。该脚本‘在后台’加载，然后在DOM完全构建完成后再运行。defer脚本总是在DOM准备好时执行，但在DOMContentLoaded事件之前。

```js
<p>...content before scripts...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM fully loaded and parsed after defer!"));
</script>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<p>...content after scripts...</p>


1.页面内容立即显示。
2.DOMContentLoaded事件处理程序等待defer脚本执行完之后执行
```

补充：当纯 HTML 被完全加载以及解析时，**`DOMContentLoaded`** 事件会被触发，而不必等待样式表，图片或者子框架完成加载。

- defer脚本保持相对顺序来执行，就像常规脚本一样

  ```js
  <script defer src="https://javascript.info/article/script-async-defer/long.js"></script>
  <script defer src="https://javascript.info/article/script-async-defer/small.js"></script>
  
  //这两个脚本会并行下载，small.js 可能会比long.js先下载完成，但是执行的时候依然会先执行 long.js
  ```

所以defer可用于对脚本执行顺序有严格要求的情况

- async

  - async属性意味着该脚本是完全独立的：

  - 浏览器不会阻止async脚本,async脚本不会等待其他脚本

  - DOMContentLoaded和async脚本不会互相等待

    - DOMContentLoaded可能在async脚本执行之前触发(如果async脚本在页面解析完成后完成加载)

    - 或在async脚本执行之后触发(如果async脚本很快加载完成或在HTTP缓存中)

```js
<p>...content before scripts...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM 完全加载以及解析"));
</script>

<script async src="https://javascript.info/article/script-async-defer/long.js"></script>
<script async src="https://javascript.info/article/script-async-defer/small.js"></script>

<p>...content after scripts...</p>


//页面内容立即显示：async不阻塞
//DOMContentLoaded可能发生在async之前或之后
//small.js先加载完就会在long.js之前执行，但如果long.js在之前有缓存，那么long.js先执行。
```

应用场景：将独立的第三方脚本集成到页面中时，不如及时器，广告等

总结:script是会阻碍HTML解析的，只有下载好并执行完脚本才会继续解析HTML

defer和async有一个共同点：下载此类脚本都不会阻止页面呈现(异步加载),区别在于：

- async执行与文档顺序无关，先加载哪个就先执行哪个；defer会按按照文档的中的顺序执行
- async脚本加载完成后立即执行，可以在DOM尚未完全下载完成就加载和执行；而defer脚本需要等到文档所有元素解析完成之后才执行

4.3 事件的触发线程

- setTimeout ajax ->回调事件

4.4 定时器的线程

- setTimeout setInterval

4.5 异步http请求的线程

## event loop

1.同步任务： js引擎的线程中，执行栈

2.异步任务：可以执行的异步任务 事件的触发线程 任务队列

## 宏任务和微任务

### 宏任务

1.正常代码块

2.setTimeout

3.setInterval

4.setImmediate Node

5.requestAnimationIframe 浏览器

### 微任务

在宏任务执行后立即执行的任务

macrotask ->microtask ->GUI ->macrotask

- promise.then()
- catch
- finally
- Object.observe
- MutationObserver
- process.nextTick()

# ts

对比原理：

它是javascript的一个超集，在原有的语法基础上，添加了可选的静态类型和基于类的面向对象编程

- 面向项目：

​    TS:面向于解决大型复杂项目中，架构以及代码维护复杂场景

​    JS:脚本化语言，用于面向单一简单场景

- 自主检测

  TS：编译期间，主动发现并纠正错误

  JS：运行时报错

- 类型检测

  TS:弱类型，支持对于动态和静态类型的检测

  JS:弱类型，无静态类型选项

- 运行流程

  TS:依赖编译，依赖工程化体系

  JS：直接在浏览器中运行

- 复杂特性

  TS:模块化、泛型、接口

所有类型检测和语法检测都是在编译的时候报错

```ts
enum Score{
    BAD,
    NG,
    GOOD,
    PERFECT
}

let scoNAme=Score[0]//BAD
let scoVal=Score['BAD']//0

//异构
enum Enum{
    A,//0
    B,//1
    C='C',
    D='D',
    E=6,
    F,//7
}
//指出异构的枚举值
//手写将其转化成js实现
let Enum;
function Enum;
(function(Enum){
    //正向
    Enum['A']=0;
    Enum['B']=1;
    Enum['C']='C';
    Enum['D']='D';
    Enum['E']=6;
    Enum['F']=7;
    
    //反向
    Enum[0]='A';
    Enum[1]='B';
    Enum[6]='E';
    Enum[7]='F';
})(Enum||(Enum={}))
```

## any-绕过所有类型检查=>类型检查和变异检查全部失效

```ts
let anyValue:any=123;
anyValue='anyVal';
anyValue=false;
let value1:boolean=anyValue;
```

## unkown-绕过了赋值检查=>禁止更改传递

```ts
let unknownValue:unknown;
unknownValue=true;
unknownValue=123;
unknownValue='unknwonValue';
let value1:unknown=unknownValue;//ok
let value1:any=unknownValue;
let value1:boolean=unknownValue;//报错
```

## void-声明函数的返回值

```js
function voidFunction():void{
   console.log('void function')
  }
```

## never -函数永不返回

```tsx
function error(msg:string):never{
    throw new Error(msg)
}

function longlongLoop():never{
     while(true){}
}
```

## object/{} -对象

```ts
//ts将js的object分为两个接口来定义
interface ObjectConstructor{
    create(o:object|null):any
}

const proto={};
Object.create(proto);
Object.create(null);
Object.create(undefined)//报错


//Object.prototype上属性
interface Object{
    constructor:Function'
    toString():string;
    toLocaleString():string;
    valueof():Object;
    hasOwnProperty(v:PropertyKey):boolean;
    isPrototypeOf(v:Object):boolean;
}
```

## {} -空对象定义空属性

```tsx
const obj={};
obj.prop='zyl';//报错
//可以使用Object上所有方法
obj.toString();//不会报错
```

## interface

对行为的一种抽象，具体行为由类实现

只读和js的引用是不同的

const只是地址不能改变，readonly是内容和地址都不能发生改变

因为接口的只读是编译的时候执行的，而js是运行的时候执行的

```ts
let arr:number[]=[1,2,3];
let r0:ReadonlyArray<number> =arr;

ro[0]=12;//报错
ro.push(5);//报错
ro.length=100;//报错
arr=ro;//报错
```

```tsx
interface Class{
    readOnly name:string;
    time:number;
    [propName:string]:any;
}

const c1={name:'js',time:1};
const c2={name:'browser',time:3}
const c3={name:'ts',level:1,time:2}
```

## 交叉类型

```ts
//合并冲突
interface A{
     c:string,
    d:string,
}

interface B{
    c:number,
    e:string
}

type Ab=A&B；//会把c过滤掉
let ab:AB={
    d:'class',
    e:'class'
}
```

## 断言-类型声明、转换

### 编译状态在产生作用

```ts
//尖括号形式声明
let anyValue:any='hi zyl';
let anyLength:number=(<string>anyValue).length;

//as声明
let anyValue:any='hi zyl';
let anyLength:number=(anyValue as string).length;

//非空-判断是否为空
type ClassTime=()=>number;
const start=(classTime:ClassTime|undefined)=>{
    let number=classTime?();
}
```

### 多态 - 多重状态类型

```ts
interface Teacher{
     name:string,
     courses:string[],
     score:number
}

interface Student{
    name:string,
    startTime:Date,
    score:string
}

type Class=Teacher|Student;

//in-是否包含某种属性
function startCourse(cls:Class){
    if('courses' in cls ){
        //老师
    }
    
    if('startTime' in cls){
        //学生
    }
}


//typeof /instanceof -类型分类场景下的身份确认
function startCourse(cls:Class){
    if(typeof cls.score==='number'){
        //老师
    }
    
    if(typeof cls.score==='string'){
        //学生
    }
}

function startCourse(cls:Class){
    if(cls instanceof Teacher){
        //老师
    }
    
    if(cls instanceof Student){
        //学生
    }
}

```

## 函数重载

```ts
class Class{
    start(name:number,score:number):number;
    start(name:string,score:number):string;
    start(name:string,score:number):number;
    start(name:Comnbinable,score:Comnbinable){
        if(typeof name==='number'||typeof score==='number'){
            //
        }
           if(typeof name==='string'||typeof score==='string'){
            //
        }
           if(typeof name==='string'||typeof score==='number'){
            //
        }
    }
}
```

## 泛型 -重用

```tsx
function startClass<T,U>(name:T,score:U):T{
    
}

function startClass<T,U>(name:T,score:U):string{
    
}

function startClass<T,U>(name:T,score:U):T{
    return (name+String(score)) as any as T;
}
```

## 装饰器-decorator

```ts
function ZhaoWa(target:Function):void{
    target.prototype.startClass=function():void{
        
    }
}


@ZhaoWa
class Course{
    contructor(){
        
    }
}
```

## ts实战

### webpack打包配置=>vue-cli=>webpack配置=>编译时

- entry - 入口
- extensions加上ts - 用于处理尝试的数据尾缀列表 =>面试题：如何webpack新增一种处理类型文件
- Loaders - ts-loader,增加对于ts的工具处理 =>工程化

### ts配置文件

tsconfig.json

### Vue/vuex+ts

```vue
<template>
<div>
     <vueComponent></vueComponent>
    </div>
</template>

<script lang="ts">
   //1.定义组件的方式上:形式上-extends
    //申明当前组件模块 Vue.component or Vue.extends
    import Vue from 'vue';
    const Component=Vue.extend({
        //类型推断
    })
    //2.全面拥抱面向对象 - 官方vue-class-component
    import Component from 'vue-class-component'
    //@Component本质 -类装饰器=>利用类装饰器，统一进行描述vue模版等概念
    @Component({
        components:{
            vueComponent:vueComponent
        }
    })
    export default Class myComponent extends Vue{
         message:string='Hello'
         onclick():void{
             console.log(this.message)
         }
    }
    //3.申明 - 利用ts的额外补充模块declare =>实现独立模块的声明，使之可以被独立引用
    declare module '*.vue'{
        import Vue from 'vue'
        export default Vue
    }
    declare module '/typings/vuePlugin.d.ts'{
        interface Vue{
            myProps:string
        }
    }
    
    //实例中使用
    let vm=new Vue();
    console.log(vm.myProps)
    
    //4.props 提供propType原地声明联合变量
    import {propType} from 'vue'
    interface customPayload{
        str:string,
        number:number,
        name:string
    }
    const Component=Vue.extend({
        props:{
            name:String,
            success:{
                type:string
            },
            payload:{
                type:Object as propType<customPayload>
            },
            callback:{
                type:Function as propType<()=>void>
            }
        }
    })
    
    //5.computed以及method
    computed:{
        getMsg():string{
            return this.click()+'!'
        }
    },
   methods:{
     click():string{
       return this.message+'zyl'
     }
   }
    
    //6.vuex的接入ts -声明使用
    //vue.d.ts声明模块-ComponentCustomProperties
    import {ComponentCustomProperties} from 'vue';
    declare module '@vue/runtion-core'{
        interface State{
            count:number
        }
        
        interface ComponentCustomProperties{
            $store:Store<State>
        }
    }
        
    //7.api形式编码实现-官方
      //store.ts
      import {InjectionKey} from 'vue'  
        import {createStore,Store} from 'vuex'
        export interface State{
            count:number
        }
        
        export const key:InjectionKey<Store<State>>=Symbol()
        export const store=createStore<State>({
            state:{
                count:0
            }
        })
        
        //main.ts
        import {createApp} from 'vue'
        import {store,key} from './store'
        const app=createApp({
            //传入参数
        })
        //利用provider&inject依赖注入
        app.use(store,key)//=>出入injection key
        app.mount('#app')
        //消费方
        import {useStore} from 'vuex'
        import {key} from './store'
        export default {
            const store=useStore(key);
           //store.state.count
        }
       
    //8.vuex面向对象 - 使用vuex-class工具
    import {State,Action,Getter} from 'vuex-class';
    export default class App extends Vue{
        //利用属性装饰器整合store的状态
        @State login:boolean;
        
        //利用时间装饰器，整合store方法
        @Action setInit:()=>void
        
        get isLogin:boolean;
        mounted(){
            this.setInit();
            this.isLogin=this.login;
        }
    }
</script>
```

# Esnext规范详解

const不在window中，因为const是块级作用域。而var是挂载到window中，故是全局作用域

## 死锁 -dead zone

```js
if(true){
    console.log(arg1);
    var arg1='zyl'
}
```

## let or const

```js
const obj={
    teacher:'zyl',
    leader:'zyl11'
}

obj.teacher='hhh';

//const 是常量，锁定的是栈内存
//引用类型的原理-指向地址
Obejct.freeze(obj)
//freeze的局限性=>只能冻结单层根层
function deepFreeze(obj){
    Object.freeze(obj);
    (Object.keys(obj)||[]).forEach(key=>{
         if(typeof obj[key]==='object'){
             deepFreeze(obj[key])
         }
    })
}
```

## 上下文

## 箭头函数

1.dom操作的cb

```js
const btn=document.querySelector('#btn');
btn.addEventListener('click',function(){
    this.style.color='#fff'
})
```

2.类操作，箭头函数无法构造类

3.箭头函数无法构造原型上的方法

4.箭头函数没有arguments属性

## class

class 的类型是Function

如何建立一个私有属性-闭包

```js
class Course{
     constructor(teacher,course){
         this._teacher=teacher;
         let _course='es6';
         this.getCourse=()=>{
             return _course
         }
     }
}
```

适配器模式

```js
class utils{
    constuctor(core){
        this._main=core;
        this._name='zyl'
    }
    
    get name(){
        return {
             ...this._main.name,
            name:${this._name}
        }
    }
   set  name(val){
       this._name=val;
   }
}
```

# Vue.js基础

面试题：

## 简单聊聊对于MVVM的了解？

- 发展史以及旁支

  - 语义话模版
  - MVC - model view controller
  - MVVM -  Model-view-ViewModel(vue和react)
    - 数据会绑定在viewModel层，并自动将数据渲染到页面中
    - 视图变化的时候，会通知viewModel层去更新数据

  - mvc更关注元素本身；mvvm关注整体数据层统一

## vue是如何利用mvvm思想来进行书写？

模板式渲染+数据双向绑定

- 利用花括号，构筑了数据与视图的双向绑定=>学习曲线更加平滑
- 通过视图绑定事件，来处理数据

## 生命周期

vue生命周期

beforeCreate=>created=>beforeMount=>mounted=>beforeUpdate=>updated=>beforeDestory=>destoryed

bC：new Vue() - 实例初始化挂载功能

c: data、props、methods、computed - 数据操作，不涉及到vdom和dom

bM: vDom已经更新了的，但不涉及dom

m: dom进行任何获取或者操作

bU :vDom更新了的，dom未更新

u: dom已经更新了 - 谨慎操作数据

bD: 实例vm尚未被销毁 - 清空events,reset,store,clear

d：实例vm已经被销毁 - 首尾

react是mvvm，都是操作虚拟dom

## computed和watch区别

相同点：

- 基于vue的依赖收集机制
- 都是被依赖的变化触发，进行改变进而进行处理计算

不同点：

- 入和出

  computed:  多入单出 - 多个值的变化，组成一个最终产物的变化

  watch: 单入多出 - 单个值的变化，从而影响一系列的状态变更

- 性能

  computed: 会自动diff依赖，若依赖没有变化，会改从缓存中读取当前的计算值

  watch：无论监听值变化与否，都会执行回调

- 写法上

  computed: 必须有return

  watch: 由数据变化触发了回调中内容

- 时机上

  computed: 从首次生成赋值，就开始计算运行了

  watch: 首次不会运行，除非immediate:true

## 条件

v-if & v-show & v-else & v-else-if

v-if 无dom,不会渲染实际节点及其子节点

v-show 存在实际节点及其子节点，只是不展示

## 循环

v-for和v-if循环优先级

在vue 2.x, 在同一个元素上同时使用v-if和v-for时候，v-for会优先作用

在vue3.x, v-if总是优先于v-for生效

## key的作用

- 模板编译原理 - template=>dom

  template => 正则匹配语法 -生成AST: 静态、动态 =>转换AST为可执行方法 =>render() => dom

- dom diff

  1 2 3 4 5 6

  6 5 7 3 2 1

  层级上: 只考虑单层复用，多层级的遍历实现

  顺序上：双向指针，首尾向中间移动

  替换上：移动、新增、删除；优先复用 - key =>快速识别顺序

- key的选取 - 尽可能地复用节点

  使用index id 随机数 

  使用index ：

  节点 1 2 3 4 5 6

  key  0 1 2 3 4 5

  节点 6 5 7 3 2 1

  key  0 1 2 3 4 5

  =>当节点顺序发生改变，或者插入元素导致index顺延的情况下

## 指令

v-once -只渲染一次

v-text -渲染字符串

v-html - 渲染html

v-bind - 绑定赋值

v-on - @监听

v-model -双向绑定 -语法糖： value + @input

## 面试题

{{}}的计算类型

- 绑定数据计算可以写在花括号里

  {{number+1}}

- 截断

  {{msg.slice(0,-1)}}

- 浮点数

  {{number.toFixed(2)}}

- 转整型

  {{parseInt(number,10)}}

- 函数加工

  {{calcNumber(number)}}

-  三元运算

  {{100>99?'yes':'no'}}

- 逻辑运算

  {{100>99&&100>98}}

- 取反

  {{!number}}

## 版本差异

### 数据上

对象响应式是否可以传递影响

2.x对象响应式可以被传递

3 响应式对象始终通过挂载实例获取（this）

### 模板上

2.x统一根模版

3.x支持碎片化模版

### 接口方法上

2.x 收敛到固定语法接口

3.x平铺方法，对齐js

### 生命周期

setup=>bc+c

onBeforeMount()=>bM

onMounted=>m

onBeforeUpdate=>bU

onUpdated()=>u

onBeforeUnMount()=>bD

onUnMount()=>d

# vue高级用法

## mixin

mixin灵活 提供可复用的功能

抽离公共代码，哪里需要搬哪里

vue mixin与vuex区别？

vuex抽离公共状态的管理，vuex如果有一个组件改变数据，其他引入的部分也会改变

mixin数据方法都是独立的，组件间互相不影响

mixin方式？

- 局部混入
  - mixin会和组件一起执行，但是mixin优先级更高
  - mixin的data、生命周期、methods也会跟组件一起混合使用

- 全局混入

## vue选项式合并的思路

实例化过程中的选项

https://www.yuque.com/lpldplws/web/hadz6f?singleDoc# 《Vue2源码解析（1/2）》 密码：mq90

https://www.yuque.com/lpldplws/web/xx3ygi?singleDoc# 《Vue2源码解析（2/2）》 密码：ya0n

https://www.yuque.com/lpldplws/web/gdw840?singleDoc# 《Vue3新特性&源码解析（1/3）》 密码：mmo8

https://www.yuque.com/lpldplws/web/gmptis?singleDoc# 《Vue3新特性&源码解析（2/3）》 密码：qke4

https://www.yuque.com/lpldplws/web/ty5nga?singleDoc# 《Vue3新特性&源码解析（3/3）》 密码：apwp

https://www.yuque.com/lpldplws/web/myfkf4?singleDoc# 《配套习题》 密码：oir9

https://www.yuque.com/lpldplws/web/sp3cao?singleDoc# 《配套习题》 密码：kv13

# vue-cli

https://www.yuque.com/lpldplws/web/lhptox?singleDoc# 《2. xianzao-cli》 密码：bx09

https://github.com/xianzao/xianzao-cli

## 1.目标

实现一个项目初始化cli，为后续项目提供统一初始化脚手架

## 2.知识准备&技术选型

### 2.1命令行交互

目标：通过命令式的交互，完成在日常业务开发中，封装成具有交互行为的cli

常见的命令行交互的npm包有：

- [commander](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md)：命令行完整的解决方案；
- [cac](https://github.com/cacjs/cac)：类似 Commander.js 但更轻巧、现代，支持插件；
- [chalk](https://github.com/chalk/chalk)：命令行样式处理；
- [Inquirer](https://github.com/SBoudrias/Inquirer.js/)：交互式的命令行界面；
- [minimist](https://github.com/minimistjs/minimist)：简单的命令行参数解析；
- [semver](https://github.com/semver/semver)：npm包语义化处理；
- [fs-extra](https://github.com/jprichardson/node-fs-extra)：fs包的代替，且继承了fs所有方法和为fs方法添加了promise的支持；

本次选择cac、fs-extra、inquirer、chalk开发

### 2.2开发调试

目标：方便在开发调试阶段时，实现快速开发node应用的工具类

- [nodemon](https://github.com/remy/nodemon)：监听文件更新变化，并自动重启进程；
- [cross-spawn](https://github.com/moxystudio/node-cross-spawn)：类似node.js 的子进程 (child_process) 的spawn模块，可以在调用 spawn 函数时，自动根据当前的运行平台执行指令；
- [ts-node](https://github.com/TypeStrong/ts-node)：提供TS的node运行环境，因为TS 是JS的超集，因此使用它意味着在 V8 引擎能够理解它们之前将TS 文件编译为纯JS；
- [typescript](https://github.com/microsoft/TypeScript)：给JS添加各种静态类型；

### 2.3开发标准化

- [husky](https://github.com/typicode/husky)：添加git hooks工具；
- [commitizen](https://github.com/commitizen/cz-cli)：优化commit提交规范；
- [commitlint](https://github.com/conventional-changelog/commitlint)：校验commit提交规范；
- [cz-customizable](https://github.com/leoforfree/cz-customizable)：定制commit提交规范；

## 3.开发

### 3.1目录结构

```js
|____.husky // husky配置
|____README.md
|____.gitignore
|____package-lock.json
|____package.json
|____.github // git action
|____commitlint.config.js // commit 限制
|____tsconfig.json // TS 配置
|____index.ts // 入口文件
|____build // 打包&更新package.json版本工具
|____src
| |____core
| | |____special.ts // 针对Vue3优化
| | |____husky.ts	// 针对husky配置
| | |____vscode.ts // 针对vscode配置
| | |____eslint.ts // 针对eslint配置
| | |____eslintignore.ts // eslint ignore配置
| | |____commitlint.ts // 针对commitlint配置
| |____template // 配置模板
| |____cli.ts // CLI执行入口
| |____utils // 工具类
| |____start.ts // 标准化配置执行入口
| |____interface.ts // TS interface
```

### 3.2配置项目基础内容

#### 3.2.1初始化项目

根据自己的项目配置

```js
npm init
git init
```

安装上述说明的各种依赖，配置如下：

```js
"dependencies": {
  "cac": "^6.7.14",
  "chalk": "^4.1.2",
  "cross-spawn": "^7.0.3",
  "fs-extra": "^10.1.0",
  "inquirer": "^8.2.4"
},
"devDependencies": {
  "@commitlint/cli": "^17.0.3",
  "@commitlint/config-angular": "^17.0.3",
  "@commitlint/cz-commitlint": "^17.0.3",
  "@types/cross-spawn": "^6.0.2",
  "@types/fs-extra": "^9.0.13",
  "@types/inquirer": "^9.0.2",
  "@types/node": "^18.11.0",
  "commitizen": "^4.2.4",
  "cz-customizable": "^6.9.0",
  "husky": "^8.0.1",
  "inquirer": "^8.0.0",
  "minimist": "^1.2.7",
  "nodemon": "^2.0.20",
  "ts-node": "^10.9.1",
  "typescript": "^4.8.4"
}
```

#### 3.2.2 tsconfig.json

配置esm打包，及入口文件

```js
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "./dist",
    "removeComments": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["./index.ts", "src**/*.ts"]
}

```

#### 3.3.3 package.json

配置基础的script执行指令

```js
  "scripts": {
    "dev": "nodemon ./index.ts",
    "serve": "ts-node ./index.ts",
    "tsc": "tsc"
  },
```

### 3.3 配置入口文件

#### 3.3.1 index.ts

使用inquirer完成问题配置

```ts
#!/usr/bin/env node
import inquirer from 'inquirer';
import initCli from './src/cli';
import { answerType } from './src/interface';

// export interface answerType {
//   vue3: Boolean
//   plugins: Array<String>
// }


const promptList = [
  {
    type: 'confirm',
    message: '是否是Vue3项目？', // Vue3项目需要把package.json的type: module删除
    name: 'vue3',
  },
  {
    type: 'checkbox',
    message: '选择要安装的插件(默认全选)',
    name: 'plugins',
    choices: [
      {
        name: 'eslint注册',
        value: 'eslint',
        checked: true,
      },
      {
        name: 'husky注册',
        value: 'husky',
        checked: true,
      },
      {
        name: 'commitLint注册',
        value: 'commitLint',
        checked: true,
      },
      {
        name: 'vscode格式化注册',
        value: 'vscode',
        checked: true,
      },
    ],
  },
];

const question = async () => {
  // 运行时请使用 npm run serve, 避免使用nodemon，会导致arrow key press 无效： https://github.com/SBoudrias/Inquirer.js/issues/844#issuecomment-571412210
  const answers: answerType = await inquirer.prompt(promptList);
  initCli(answers);
};

question();
```

#### 3.3.2 cli.ts

指定项目配置入口，如果没有为base设置默认值，交给cli执行脚本

```ts
// src/cli.ts

import cac from 'cac';
import { start } from './start';
import { setEnv } from './utils/env';
import { name } from '../package.json';
import { getPackageJson } from './utils/env';
import { answerType } from './interface';

const cli = cac(name);

export default async (answers: answerType) => {
  const pkgJson = await getPackageJson();
  const { version } = pkgJson;

  cli
    .command('[root]')
    .alias('alias')
    .action(async (_root, options) => {
      let base: string = options.base;
      if (!base) {
        // 项目的最终路径
        base = process.cwd();
      }
      setEnv('base', base);
      await start(base, answers);
    });

  cli.help();
  cli.version(version);
  cli.parse();
};

```

#### 3.3.3 start.ts

根据用户交互式选择的指令，执行对应依赖的安装

```ts
// src/start.ts

// 开始分析项目
import { getPackageJson, initProjectInfo } from './utils/env'
import { eslintInit } from './core/eslint'
import { huskyInit } from './core/husky'
import { eslintIgnoreInit } from './core/eslintignore'
import { commitLintInit } from './core/commitlint'
import { specialFn } from './core/special'
import { vscodeInit } from './core/vscode'
import { debugError, debugProcess, debugTxt } from './utils/debug'
import { hasElementInArray } from './utils/tool'
import { answerType } from './interface'

export const start = async (base: string, answers: answerType) => {
  const pckJson = await getPackageJson(base)

  const { vue3 = false, plugins = [] } = answers

  await initProjectInfo(pckJson)

  try {
    // 针对Vue3模板特殊处理
    vue3 && (await specialFn())

    // 安装eslint 和 prettier 并自动生成配置文件
    hasElementInArray(plugins, 'eslint') && (await eslintInit())

    // 添加eslint忽略文件
    hasElementInArray(plugins, 'eslint') && (await eslintIgnoreInit())

    // 安装 husky 并自动生成配置文件
    hasElementInArray(plugins, 'husky') && (await huskyInit())

    // 生成.vscode 配置文件 支持自动格式化代码
    hasElementInArray(plugins, 'commitLint') && (await commitLintInit())

    // 格式化VSCode格式
    hasElementInArray(plugins, 'vscode') && (await vscodeInit())

    debugProcess(
      `恭喜您，成功注册${vue3 ? 'vue3' : ''} ${hasElementInArray(plugins, 'eslint')} ${hasElementInArray(plugins, 'husky')} ${hasElementInArray(
        plugins,
        'commitLint'
      )} ${hasElementInArray(plugins, 'vscode')} 插件`
    )

    // 部分版本依赖可能有冲突，建议重新安装node modules
    debugProcess('请重新安装依赖！npm install or yarn')
    debugTxt(``)
  } catch (error) {
    debugError(JSON.stringify(error))
  }
}

```

### 3.4 执行依赖安装

#### 3.4.1 husky

指定husky及lint-staged(避免每次修改都执行一次lint,一般绑定在git pre-commit hook上)

```typescript
// src/core/husky.ts
import { writeInPkg, run } from '../utils/tool';
import fs from 'fs-extra';
import { getPackageJson } from '../utils/env';
import { getPath } from '../utils/path';
import { debugInfo, debugWarning } from '../utils/debug';
import { pathExists } from '../utils/check';

// 需要安装的依赖
const devDependencies = ['husky@^8.0.1', 'lint-staged@^12.4.1'];

export const huskyInit = async () => {
  // 检查是否有git 如果没有 需要先初始化git
  if (!(await pathExists('.git', false))) {
    debugWarning(`请先初始化git`);
    debugInfo('参考命令 git init');
    process.exit();
  }
  // 安装依赖
  await writeInPkg(devDependencies);
  // 更改package
  let pkgJson = await getPackageJson();
  pkgJson.scripts['prepare'] = 'husky install';
  pkgJson.scripts['pre-commit'] = 'lint-staged';
  pkgJson.scripts['postinstallmac'] = 'git config core.hooksPath .husky && chmod 700 .husky/*';
  pkgJson.scripts['eslint'] = 'eslint --cache --max-warnings 0  "{src,mock}/**/*.{vue,ts,js,tsx}" --fix';
  pkgJson['lint-staged'] = {
    '*.{js,ts,vue,jsx,tsx}': ['npm run eslint'],
    '*.{js,jsx,ts,tsx,md,html,css,lees,scss,sass}': 'prettier --write',
  };
  fs.writeJsonSync(getPath('package.json'), pkgJson, { spaces: 2 });

  await run('npm run prepare');
  await run('npx husky add .husky/pre-commit "npm-run-pre-commit"');
};

```

#### 3.4.2 eslint

指定eslint对应配置规范，建议可以根据自身项目进行定制化配置，相关文档看对应prettier和eslint官网配置

针对不同开发框架，进行eslint注入(包括vue2/3，React)

```typescript
// src/core/eslint.ts

import fs from 'fs-extra';
import { writeInPkg } from '../utils/tool';
import { getPackageJson, getEnv } from '../utils/env';
import { prettierrcInit } from '../template/prettierrc';
import { eslintrcFn } from '../template/eslintrc';
import { getPath } from '../utils/path';

const baseDep = [
  'eslint@^7.25.0',
  'prettier@^2.7.1',
  'eslint-friendly-formatter@^4.0.1',
  'eslint-plugin-prettier@^4.0.0',
  'eslint-plugin-html@^6.2.0',
  'eslint-config-prettier@^8.5.0',
];

export const eslintInit = async () => {
  let devDependencies: string[] = baseDep;
  if (getEnv('isVue2')) {
    devDependencies = [...baseDep, 'eslint-plugin-vue@^6.2.2'];
  }
  if (getEnv('isVue3')) {
    devDependencies = [...baseDep, 'eslint-plugin-vue@^9.2.0', '@typescript-eslint/parser@^5.30.7'];
  }
  if (getEnv('isReact')) {
    devDependencies = [
      ...baseDep,
      'eslint-plugin-react@^7.30.1',
      'eslint-plugin-jsx-a11y@^6.6.1',
      '@typescript-eslint/parser@^5.30.7',
      '@typescript-eslint/eslint-plugin@5.30.7',
    ];
  }
  // writeInPkg 只是把依赖写入到package中
  await writeInPkg(devDependencies, 'devDependencies');
  fs.outputFileSync(getPath('./.eslintrc.js'), eslintrcFn());
  fs.outputFileSync(getPath('./.prettierrc'), prettierrcInit);

  let pkgJson = await getPackageJson();
  if (pkgJson['eslintConfig']) {
    delete pkgJson.eslintConfig;
  }
  fs.writeJsonSync(getPath('package.json'), pkgJson, { spaces: 2 });
};

```

- eslintrc

  ```typescript
  // template/eslintrc.ts
  
  import { getEnv } from '../utils/env';
  
  const baseEslint = `
  'prettier/prettier': 'error',
  'accessor-pairs': 2,
  'arrow-spacing': [
    2,
    {
      before: true,
      after: true
    }
  ],
  'block-spacing': [2, 'always'],
  'brace-style': [
    2,
    '1tbs',
    {
      allowSingleLine: true
    }
  ],
  camelcase: [
    0,
    {
      properties: 'always'
    }
  ],
  'comma-dangle': [
    'error',
    {
      arrays: 'never',
      objects: 'never',
      imports: 'never',
      exports: 'never',
      functions: 'never'
    }
  ],
  'comma-spacing': [
    2,
    {
      before: false,
      after: true
    }
  ],
  'comma-style': [2, 'last'],
  'constructor-super': 2,
  curly: [2, 'multi-line'],
  'dot-location': [2, 'property'],
  'eol-last': 2,
  eqeqeq: 'off',
  'generator-star-spacing': [
    2,
    {
      before: true,
      after: true
    }
  ],
  'handle-callback-err': [2, '^(err|error)$'],
  indent: 'off',
  'key-spacing': [
    2,
    {
      beforeColon: false,
      afterColon: true
    }
  ],
  'keyword-spacing': [
    2,
    {
      before: true,
      after: true
    }
  ],
  'new-cap': [
    2,
    {
      newIsCap: true,
      capIsNew: false
    }
  ],
  'new-parens': 2,
  'no-array-constructor': 2,
  'no-caller': 2,
  'no-console': 'off',
  'no-class-assign': 2,
  'no-cond-assign': 2,
  'no-const-assign': 2,
  'no-control-regex': 0,
  'no-delete-var': 2,
  'no-dupe-args': 2,
  'no-dupe-class-members': 2,
  'no-dupe-keys': 2,
  'no-duplicate-case': 2,
  'no-empty-character-class': 2,
  'no-empty-pattern': 2,
  'no-eval': 0,
  'no-ex-assign': 2,
  'no-extend-native': 2,
  'no-extra-bind': 2,
  'no-extra-boolean-cast': 2,
  'no-extra-parens': [2, 'functions'],
  'no-fallthrough': 2,
  'no-floating-decimal': 2,
  'no-func-assign': 2,
  'no-implied-eval': 2,
  'no-inner-declarations': [2, 'functions'],
  'no-invalid-regexp': 2,
  'no-irregular-whitespace': 2,
  'no-iterator': 2,
  'no-label-var': 2,
  'no-labels': [
    2,
    {
      allowLoop: false,
      allowSwitch: false
    }
  ],
  'no-lone-blocks': 2,
  'no-mixed-spaces-and-tabs': 2,
  'no-multi-spaces': 2,
  'no-multi-str': 2,
  'no-multiple-empty-lines': [
    2,
    {
      max: 1
    }
  ],
  'no-native-reassign': 2,
  'no-negated-in-lhs': 2,
  'no-new-object': 2,
  'no-new-require': 2,
  'no-new-symbol': 2,
  'no-new-wrappers': 2,
  'no-obj-calls': 2,
  'no-octal': 2,
  'no-octal-escape': 2,
  'no-path-concat': 2,
  'no-proto': 2,
  'no-redeclare': 2,
  'no-regex-spaces': 2,
  'no-return-assign': [2, 'except-parens'],
  'no-self-assign': 2,
  'no-self-compare': 2,
  'no-sequences': 2,
  'no-shadow-restricted-names': 2,
  'no-spaced-func': 2,
  'no-sparse-arrays': 2,
  'no-this-before-super': 2,
  'no-throw-literal': 2,
  'no-trailing-spaces': 2,
  'no-undef': 2,
  'no-undef-init': 2,
  'no-unexpected-multiline': 2,
  'no-unmodified-loop-condition': 2,
  'no-unneeded-ternary': [
    2,
    {
      defaultAssignment: false
    }
  ],
  'no-unreachable': 2,
  'no-unsafe-finally': 2,
  'no-unused-vars': [
    2,
    {
      vars: 'all',
      args: 'none'
    }
  ],
  'no-useless-call': 2,
  'no-useless-computed-key': 2,
  'no-useless-constructor': 2,
  'no-useless-escape': 0,
  'no-whitespace-before-property': 2,
  'no-with': 2,
  'one-var': [
    2,
    {
      initialized: 'never'
    }
  ],
  'operator-linebreak': [
    2,
    'after',
    {
      overrides: {
        '?': 'before',
        ':': 'before'
      }
    }
  ],
  'padded-blocks': [2, 'never'],
  quotes: 'off',
  semi: 'off',
  'semi-spacing': [
    2,
    {
      before: false,
      after: true
    }
  ],
  'space-before-blocks': [2, 'always'],
  'space-before-function-paren': 'off',
  'space-in-parens': [2, 'never'],
  'space-infix-ops': 2,
  'space-unary-ops': [
    2,
    {
      words: true,
      nonwords: false
    }
  ],
  'spaced-comment': 'off',
  'template-curly-spacing': [2, 'never'],
  'use-isnan': 2,
  'valid-typeof': 2,
  'wrap-iife': [2, 'any'],
  'yield-star-spacing': [2, 'both'],
  yoda: [2, 'never'],
  'prefer-const': 2,
  'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  'object-curly-spacing': [
    0,
    'always',
    {
      objectsInObjects: false
    }
  ],
  'array-bracket-spacing': [2, 'never']
  `;
  
  export const eslintrcFn = () => {
    // vue2
    let eslintrcInit = `
  module.exports = {
      root: true,
      parserOptions: {
        ecmaVersion: 11,
        parser: 'babel-eslint',
        sourceType: 'module'
      },
      env: {
        browser: true,
        node: true,
        es6: true
      },
      plugins: ['prettier'],
      extends: ['plugin:vue/recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'vue/order-in-components': 'off',
        'vue/html-self-closing': 'off',
        'vue/require-default-prop': 'off',
        'vue/max-attributes-per-line': [
          0,
          {
            singleline: 10,
            multiline: {
              max: 1,
              allowFirstLine: false
            }
          }
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/name-property-casing': ['error', 'PascalCase'],
        'vue/no-v-html': 'off',
        ${baseEslint}
      } 
    }
    
  `;
    // vue3
    if (getEnv('isVue3')) {
      eslintrcInit = `
  module.exports = {
      root: true,
      parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
        parser: '@typescript-eslint/parser'
      },
      env: {
        browser: true,
        node: true,
        es6: true
      },
      plugins: ['prettier'],
      extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'vue/order-in-components': 'off',
        'vue/html-self-closing': 'off',
        'vue/require-default-prop': 'off',
        'vue/max-attributes-per-line': [
          0,
          {
            singleline: 10,
            multiline: {
              max: 1,
              allowFirstLine: false
            }
          }
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/name-property-casing': 'off',
        'vue/no-v-html': 'off',
        ${baseEslint}
      }
    }
    `;
    }
    if (getEnv('isReact')) {
      eslintrcInit = `
  module.exports = {
    root: true,
    parserOptions: {
      ecmaVersion: 11,
      sourceType: 'module',
      parser: '@typescript-eslint/parser'
    },
    env: {
      browser: true,
      node: true,
      es6: true
    },
    plugins: ['react', 'prettier', '@typescript-eslint/eslint-plugin', 'jsx-a11y'],
    extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'react/react-in-jsx-scope': 0,
        ${baseEslint}
      }
    }
    `;
    }
    return eslintrcInit;
  };
  
  ```

- prettierrc

  ```typescript
  export const prettierrcInit = `
  {
      "semi": false,
      "singleQuote": true,
      "printWidth": 180,
      "tabWidth": 2,
      "trailingComma": "none"
    }
    
  `;
  
  ```

#### 3.4.3 comitlint

配合husky,提供commit时的规范

```typescript
// src/core/commitlint

/**
 * husk 结合 commitlint 提交信息校验
 */
import { getPackageJson } from '../utils/env';
import { writeInPkg, run } from '../utils/tool';
import fs from 'fs-extra';
import { commitLintConfig } from '../template/commitlint.config';
import { getPath } from '../utils/path';

const devDependencies = [
  '@commitlint/cli@^17.0.3',
  '@commitlint/config-angular@^17.0.3',
  'commitizen@^4.2.4',
  'cz-customizable@^6.9.0',
  '@commitlint/cz-commitlint@^17.0.3',
  'inquirer@^8.0.0',
];

const commitMsg = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
`;

const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npm run pre-commit
`;

const commitlintPath = getPath('commitlint.config.js');

export const commitLintInit = async () => {
  await writeInPkg(devDependencies);
  await run('npx husky add .husky/commit-msg "npm-run-test"');
  let pkgJson = await getPackageJson();
  pkgJson['config'] = {
    commitizen: {
      path: '@commitlint/cz-commitlint',
    },
  };
  pkgJson.scripts['commit'] = 'git add . && git-cz';
  fs.writeJsonSync(getPath('package.json'), pkgJson, { spaces: 2 });

  if (await fs.pathExists(commitlintPath)) {
    // 删除
    fs.removeSync(commitlintPath);
  }
  fs.outputFileSync(commitlintPath, commitLintConfig);
  fs.outputFileSync(getPath('./.husky/commit-msg'), commitMsg);
  fs.outputFileSync(getPath('./.husky/pre-commit'), preCommit);
};

```

- commitline.config

配置custom-commit配置

```typescript
export const commitLintConfig = `
module.exports={
  extends: ['@commitlint/config-angular'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(.*?)(?:\\((.*)\\))?:?\\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-case': [0],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        '📦build',
        '👷ci',
        '📝docs',
        '🌟feat',
        '🐛fix',
        '🚀perf',
        '🌠refactor',
        '🔂revert',
        '💎style',
        '🚨test',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
  },
  prompt: {
    settings: {},
    skip: ['body', 'footer', 'issues'],
    messages: {
      skip: '回车直接跳过',
      max: '最大%d字符',
      min: '%d chars at least',
      emptyWarning: '内容不能为空，重新输入',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: '请选择提交类型',
        enum: {
          '🌟feat': {
            description: '增加新功能',
            title: 'Features',
            emoji: '🌟',
          },
          '🐛fix': {
            description: '修复bug',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          '📝docs': {
            description: '修改文档',
            title: 'Documentation',
            emoji: '📝',
          },
          '💎style': {
            description: '样式修改不影响逻辑',
            title: 'Styles',
            emoji: '💎',
          },
          '🌠refactor': {
            description: '功能/代码重构',
            title: 'Code Refactoring',
            emoji: '🌠',
          },
          '🚀perf': {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          '🚨test': {
            description: '增删测试',
            title: 'Tests',
            emoji: '🚨',
          },
          '📦build': {
            description: '打包',
            title: '打包',
            emoji: '📦',
          },
          '👷ci': {
            description: 'CI部署',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },

          '🔂revert': {
            description: '版本回退',
            title: 'Reverts',
            emoji: '🔂',
          },
        },
      },
      scope: {
        description: '请输入修改的范围（必填）',
      },
      subject: {
        description: '请简要描述提交（必填）',
      },
      body: {
        description: '请输入详细描述（可选）',
      },
      isBreaking: {
        description: '有什么突破性的变化吗?',
      },
      breakingBody: {
        description:
          '一个破坏性的变更提交需要一个主体。 请输入提交本身的更长的描述  ',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: '是否有未解决的问题?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: '请输入问题说明',
      },
    },
  },
}`;

```

#### 3.4.4 vue3

针对vue3,去除package.json中的type:module

src/core/special.ts

```typescript
// 一些特殊的处理
import fs from 'fs-extra';
import { env, getPackageJson } from '../utils/env';
import { getPath } from '../utils/path';

export const specialFn = async () => {
  const { isVue3 } = env;
  if (!isVue3) return;
  let pkgJson = await getPackageJson();
  if (pkgJson.type) {
    delete pkgJson.type;
  }
  fs.writeJsonSync(getPath('package.json'), pkgJson, { spaces: 2 });
  // 如果是vue3 的话 需要把package中的 type="module"去掉
};

```

#### 3.4.5 vscode

针对当前workspace,配置vscode配置，保证每个人的开发环境是一致的

```typescript
/**
 * vscode 配置
 */
import fs from 'fs-extra';
import { getPath } from '../utils/path';

export const vscodeInit = async () => {
  const haveVscodeSetting = await fs.pathExists(getPath('./vscode/settings.json'));

  let vscodeSetting = {};
  if (!haveVscodeSetting) {
    vscodeSetting = {
      // 每次保存自动格式化
      'editor.formatOnSave': true,
      // 每次保存的时候将代码按eslint格式进行修复
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': true,
      },
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      // vue文件默认格式化方式vetur
      '[vue]': {
        // "editor.defaultFormatter": "octref.vetur"
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },

      'javascript.format.insertSpaceBeforeFunctionParenthesis': true, // 函数前加上空格 只有在默认vetur的时候生效
      // js文件默认格式化方式 和vue中的js保持一致使用编辑器自带的ts格式
      '[javascript]': {
        // "editor.defaultFormatter": "vscode.typescript-language-features"
        // javascript文件默认格式化方式prettier
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
      // json文件默认格式化方式prettier
      '[json]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
      // css文件默认格式化方式prettier
      '[css]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
      // typescript文件默认格式化方式prettier
      '[typescript]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },

      // 控制折行方式 - "on" (根据视区宽度折行)
      'editor.wordWrap': 'on',
      'editor.tabSize': 2, // 换行默认以tab缩进 2个字符
      'editor.snippetSuggestions': 'top', // 将建议的代码段优先级提前选择，比如输入for第一个提示是for循环代码段。
      'files.associations': {
        // 文件关联语言的优先级配置
        '*.js': 'javascriptreact',
        '*.vue': 'vue',
        '*.cshtml': 'html',
        '*.dwt': 'html',
      },
      // "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],

      'editor.formatOnPaste': true,
    };
  } else {
    // const nowSetting = await getPackageJson('./vscode/settings.json');
    const nowSetting = fs.readJSON(getPath('./vscode/settings.json'));
    vscodeSetting = { ...nowSetting, ...vscodeSetting };
  }
  fs.outputFileSync(getPath('./.vscode/settings.json'), JSON.stringify(vscodeSetting, null, 2));
};

```

### 3.5 开发工具类

#### 3.5.1 env

提供环境读取的配置项

```typescript
// src/utils/env.ts

import path from 'path';
import fs from 'fs-extra';
import { checkVueVersion } from './check';

export const env = {
  base: '',
  isVue: false,
  isVue3: false,
  isReact: false,
  isVue2: false,
  isVueCli: false,
  isWebpack: true,
  isEslint: false,
};

type envKeys = keyof typeof env;

/**
 * @name 设置变量
 */
export const setEnv = (key: envKeys, val: any) => {
  env[key] = val as never;
};
/**
 * @name 获取变量
 */
export const getEnv = (key: envKeys) => {
  return env[key];
};

/**
 * @name 把package.json转化为json
 */
export const getPackageJson = async (base: string = getEnv('base') as string) => {
  // if (!(await pathExists('package.json'))) process.exit(0);
  const file = path.resolve(base, 'package.json');
  const json = fs.readJSON(file);
  return json;
};

export const initProjectInfo = async (pckJson: any) => {
  const deps = { ...pckJson.devDependencies, ...pckJson.dependencies };
  if (deps['vue']) {
    setEnv('isVue', true);
    if (checkVueVersion(deps['vue']) === 2) {
      setEnv('isVue2', true);
    }
    if (checkVueVersion(deps['vue']) === 3) {
      setEnv('isVue3', true);
    }
  }

  if (deps['react']) {
    setEnv('isReact', true);
  }

  if (deps['eslint']) {
    setEnv('isEslint', true);
  }
  return true;
};

```

#### 3.5.2 check

提供判断版本及文件是否存在的方法

```typescript
// 各种检测函数
import fs from 'fs-extra';
import { debugError } from './debug';
import { getEnv } from './env';

/**
 * @name 判断文件夹是否存在
 */
export const pathExists = async (name: string, ext: boolean = true): Promise<boolean | void> => {
  const base = getEnv('base') as string;
  const res = await fs.pathExists(`${base}/${name}`);
  if (!res) {
    ext && debugError(`${base}/${name}不存在`);
    return false;
  } else {
    return res;
  }
};

/**
 * @name 判断是哪个vue版本
 */
export const checkVueVersion = (version: string) => {
  const v = version.split('.')[0] as string;
  return Number(v.match(/\d+/g));
};

/**
 * @name 判断使用的是npm和yarn
 */
export const checkNpmOrYarn = async (_basePath?: string): Promise<string[]> => {
  // 如果原项目使用的是yarn进行安装的，那还是使用npm进行按照，否则就使用npm
  if (await pathExists('yarn.lock', false)) {
    return ['yarn', 'add'];
  }
  return ['npm', 'init'];
};

```

#### 3.5.3 getPath

通过env获取base路径

```typescript
import { getEnv } from './env';
import path from 'path';

export const getPath = (name: string) => {
  const basePath = getEnv('base') as string;
  return path.resolve(basePath, name);
};

```

#### 3.5.4 tools

各种读写包信息的操作

```typescript
import spawn from 'cross-spawn'
import fs from 'fs-extra'

import { getEnv, getPackageJson } from './env'
import { checkNpmOrYarn } from './check'
import { getPath } from './path'
import { debugInfo, debugWarning } from './debug'

export const hasElementInArray = (list: Array<String>, element: string) => {
  return list.indexOf(element) >= 0 ? element : ''
}

export const down = async (runName: string | string[], type: string) => {
  const basePath = getEnv('base') as string
  const [n, i] = await checkNpmOrYarn(basePath)
  if (typeof runName === 'string') {
    await spawnSync(n, i, runName, type, basePath)
    return false
  }
  runName.forEach(async (runItem) => {
    await spawnSync(n, i, runItem, type, basePath)
  })
}

export const spawnSync = (n: string, i: string, runItem: string, type: string, basePath: string) => {
  return new Promise((resolve) => {
    spawn.sync(n, [i, runItem, type], {
      stdio: 'pipe',
      cwd: basePath
    })
    debugInfo(`${runItem}✅`)

    resolve({ success: true })
  })
}

export const writeInPkg = async (devArr: string[], key: string = 'devDependencies') => {
  let pkg = await getPackageJson()
  devArr.forEach((item: string) => {
    // 为了防止安装包里面的名字有@
    const index = item.lastIndexOf('@')
    const k = index === -1 ? item : item.slice(0, index)
    const v = index === -1 ? '' : item.slice(index + 1) || ''
    pkg[key][k] = v
    debugInfo(`${item}✅`)
  })
  fs.writeJsonSync(getPath('package.json'), pkg, { spaces: 2 })
}

export const run = async (str: string) => {
  const basePath = getEnv('base') as string
  const runArr = str.split(' ')
  if (runArr.length < 2) {
    debugWarning(`运行参数错误${str}`)
    return false
  }
  const [npm, ...args] = runArr
  debugInfo(`${runArr.join(' ')}✅`)
  spawn.sync(npm, args, {
    stdio: 'pipe',
    cwd: basePath
  })
}

export const downNodeModules = async () => {
  const basePath = getEnv('base') as string
  const [n] = await checkNpmOrYarn(basePath)
  await run(`${n} install`)
}

```

#### 3.5.5 debug

根据chalk生成cli不同类型的样式

```typescript
import chalk from 'chalk';
const log = console.log;
let debugSwitch = true;

/**
 * debug开关，默认开启
 * @param debug boolean
 */
const switchDebug = (debug: boolean) => {
  debugSwitch = debug;
};

/**
 * debug 错误信息
 * @param type 类型
 * @param msg 信息
 */
const debugError = (msg: string) => {
  debugSwitch && log(chalk.hex('#646cff')(`[xianzao-cli]:`) + chalk.red(msg));
  // 如果出错就退出
  process.exit(0);
};

/**
 * debug 信息
 * @param type 类型
 * @param msg 信息
 */
const debugInfo = (msg: string) => {
  debugSwitch && log(chalk.hex('#646cff')(`[xianzao-cli]:`) + chalk.green(msg));
};

/**
 * debug 强调
 * @param type 类型
 * @param msg 信息
 */

const debugProcess = (msg: string) => {
  debugSwitch && log(chalk.hex('#646cff')(`[xianzao-cli]:`) + chalk.yellow(msg));
};
/**
 * debug warning信息
 * @param type 类型
 * @param msg 信息
 */
const debugWarning = (msg: string) => {
  log(chalk.hex('#646cff')(`[xianzao-cli]:`) + chalk.yellow(msg));
};

const debugTxt = (msg: string) => {
  log(chalk.hex('#646cff')(`[xianzao-cli]:`) + chalk.hex('#5c6d82')(msg));
};

export { switchDebug, debugInfo, debugError, debugWarning, debugProcess, debugTxt };

```

### 3.6 打包工具类

#### 3.6.1 index

根据tsconfig中指定的target及outDir配置打包

```typescript
// build/index.ts

import fs from 'fs-extra';
import { getPackageJson } from '../src/utils/env';
import { getPath } from '../src/utils/path';
const buildInit = async () => {
  const pkgJson = await getPackageJson();
  pkgJson['bin'] = {
    'xianzao-cli': 'index.js',
  };
  // 去掉husky
  delete pkgJson.scripts.prepare;
  pkgJson['main'] = 'index.js';
  fs.outputFileSync(getPath('./dist/package.json'), JSON.stringify(pkgJson));
  fs.copyFileSync(getPath('./README.md'), './dist/README.md');
};

buildInit();

```

####  3.6.2 version

支持在每次提交代码时更新patch版本

```typescript
import fs from 'fs-extra';

import { getPackageJson } from '../src/utils/env';
import { getPath } from '../src/utils/path';
import { debugInfo } from '../src/utils/debug';

const versionInit = async () => {
  // 默认为patch版本更新
  const pkgJson = await getPackageJson();
  let version = pkgJson.version.split('.');
  version[2] = Number(version[2]) + 1;

  pkgJson['version'] = version.join('.');
  fs.outputFileSync(getPath('./package.json'), JSON.stringify(pkgJson, null, 2));

  debugInfo(`当前版本升级为：${pkgJson['version']}`);
};

versionInit();

```

### 3.7 打包&发布npm

#### 3.7.1打包

在package.json中添加script

- build: 生产打包文件
- commit: 执行commit规范化
- update- version: 更新patch版本

```js
"build": "rm -rf dist && tsc && ts-node build/index.ts",
"commit": "git add . && git-cz ",
"update-version": "ts-node build/version.ts",
"commit-version": "npm run update-version && git add . && git-cz",
"prepare": "husky install",
"release": "rm -rf dist && tsc && ts-node build/index.ts"
```

#### 3.7.2 发布npm

在github上关联git  action ,需要先注册登录rpm,或者使用[publish](https://www.npmjs.com/package/publish)简化发布流程

```js
name: 发布npm
on:
  push:
    branches: [master]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: setupNode
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          registry-url: 'https://registry.npmjs.org'
      - name: 依赖安装
        run: npm install
      - name: 构建
        run: npm run build
      - run: cd ./dist && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NODE_AUTH_TOKEN }}

```

#### 3.7.3 指定package.json入口

完整的package.json如下：

```json
{
  "name": "xianzao-cli",
  "version": "1.0.0",
  "description": "项目初始化脚手架",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon ./index.ts",
    "serve": "ts-node ./index.ts",
    "tsc": "tsc",
    "build": "rm -rf dist && tsc && ts-node build/index.ts",
    "commit": "git add . && git-cz ",
    "update-version": "ts-node build/version.ts",
    "commit-version": "npm run update-version && git add . && git-cz",
    "prepare": "husky install",
    "release": "rm -rf dist && tsc && ts-node build/index.ts"
  },
  "bin": {
    "xianzao-cli": "dist/index.js"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xianzao/xianzao-cli.git"
  },
  "keywords": [
    "cli",
    "xianzao"
  ],
  "author": "xianzao",
  "license": "ISC",
  "nodemonConfig": {
    "ignore": [
      "package.json"
    ]
  },
  "bugs": {
    "url": "https://github.com/xianzao/xianzao-cli/issues"
  },
  "homepage": "https://github.com/xianzao/xianzao-cli#readme",
  "dependencies": {
    "cac": "^6.7.14",
    "chalk": "^4.1.2",
    "cross-spawn": "^7.0.3",
    "fs-extra": "^10.1.0",
    "inquirer": "^8.2.4"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.0.3",
    "@commitlint/config-angular": "^17.0.3",
    "@commitlint/cz-commitlint": "^17.0.3",
    "@types/cross-spawn": "^6.0.2",
    "@types/fs-extra": "^9.0.13",
    "@types/inquirer": "^9.0.2",
    "@types/node": "^18.11.0",
    "commitizen": "^4.2.4",
    "cz-customizable": "^6.9.0",
    "husky": "^8.0.1",
    "inquirer": "^8.0.0",
    "minimist": "^1.2.7",
    "nodemon": "^2.0.20",
    "ts-node": "^10.9.1",
    "typescript": "^4.8.4"
  }
}
```

### 3.8使用

```bash
# 1. 项目中执行
npm i xianzao-cli -D

# 2. 在package.json中添加script
"scripts": {
"xianzao-cli": "xianzao-cli",
},

# 3. 执行npm run xianzao-cli, 即会自动添加依赖
```

## 4. 总结

github：https://github.com/xianzao/xianzao-cli

- npm：https://www.npmjs.com/package/xianzao-cli
  至此，我们就实现了一个简单基础的项目初始化脚手架，包括：

- 保存代码自动格式化
- 提交前 commit 校验
- eslint + prettier 校验
- husky 自动装载
- 提交时关联git action，自动发布npm包
  后续可以根据业务需求，在此基础上实现各种优化，后续，我们也会用它来完成后面项目的初始化。

# vue2源码解析(1/2)

https://vgbixa7nr9.feishu.cn/drive/folder/fldcnuszmspfoSJwl5QFtPrsCGg

https://www.yuque.com/lpldplws/web/ck0csfxciuzol315?singleDoc# 《Vue高级用法》 密码：tczl
https://www.yuque.com/lpldplws/web/hadz6f?singleDoc# 《Vue2源码解析（1/2）》 密码：mq90
https://www.yuque.com/lpldplws/web/xx3ygi?singleDoc# 《Vue2源码解析（2/2）》 密码：ya0n
https://www.yuque.com/lpldplws/web/gdw840?singleDoc# 《Vue3新特性&源码解析（1/3）》 密码：mmo8
https://www.yuque.com/lpldplws/web/gmptis?singleDoc# 《Vue3新特性&源码解析（2/3）》 密码：qke4
https://www.yuque.com/lpldplws/web/ty5nga?singleDoc# 《Vue3新特性&源码解析（3/3）》 密码：apwp
https://www.yuque.com/lpldplws/web/myfkf4?singleDoc# 《配套习题》 密码：oir9

## 1.课程目标

掌握vue2.6(目前2.x最高版本)的核心源码

## 2.课程大纲

- 前置知识
- 数据驱动

## 3.前置知识

#### 3.1 Flow

[Flow](https://flow.org/en/docs/getting-started/) 是 facebook 出品的 JavaScript 静态类型检查工具。Vue.js 的源码利用了 Flow 做了静态类型检查，也就是文件顶部出现的

```js
/* @flow */
```

#### 3.1.2 使用Flow的原因

1. JavaScript 是动态类型语言，它的灵活性有目共睹，但是过于灵活的副作用是很容易就写出非常隐蔽的隐患代码，在编译期甚至看上去都不会报错，但在运行阶段就可能出现各种奇怪的 bug；

2. 类型检查是当前动态类型语言的发展趋势，可以帮助我们在编译期尽早发现（由类型错误引起的）bug，又不影响代码运行（不需要运行时动态检查类型），使编写 JavaScript 具有和编写 Java 等强类型语言相近的体验；

3. 项目越复杂就越需要通过工具的手段来保证项目的维护性和增强代码的可读性。 Vue.js 在做 2.0 重构的时候，在 ES2015 的基础上，除了 ESLint 保证代码风格之外，也引入了 Flow 做静态类型检查。之所以选择 Flow，主要是因为 Babel 和 ESLint 都有对应的 Flow 插件以支持语法，可以完全沿用现有的构建配置，非常小成本的改动就可以拥有静态类型检查的能力；

   [Vue2.0选用Flow的具体原因](https://www.zhihu.com/question/46397274/answer/101193678)，当然Vue3.0还是还是用TS重构了

#### 3.1.3 Flow的工作方式

通常类型检查分为2种方式：

- 类型推断：通过变量的使用上下文来推断出变量类型，然后根据这些推断来检查类型；
- 类型注释：事先注释好我们期待的类型，Flow 会基于这些注释来判断；

##### 3.1.3.1 类型判断

它不需要任何代码修改即可进行类型检查，最小化开发者的工作量。它不会强制你改变开发习惯，因为它会自动推断出变量的类型。这就是所谓的类型推断，Flow 最重要的特性之一。

通过一个简单例子说明一下：

```js
/*@flow*/

function split(str) {
  return str.split(' ')
}

split(11)
```

Flow 检查上述代码后会报错，因为函数 split 期待的参数是字符串，而我们输入了数字；

