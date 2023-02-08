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

### 3.1 Flow

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

##### 3.1.3.2 类型注释

如上所述，类型推断是 Flow 最有用的特性之一，不需要编写类型注释就能获取有用的反馈。但在某些特定的场景下，添加类型注释可以提供更好更明确的检查依据。
考虑如下代码：

```js
/*@flow*/

function add(x, y){
  return x + y
}

add('Hello', 11)
```

Flow 检查上述代码时检查不出任何错误，因为从语法层面考虑， + 既可以用在字符串上，也可以用在数字上，我们并没有明确指出` add()`的参数必须为数字。

在这种情况下，我们可以借助类型注释来指明期望的类型。类型注释是以冒号 : 开头，可以在函数参数，返回值，变量声明中使用。

如果我们在上段代码中添加类型注释，就会变成如下：

```js
/*@flow*/

function add(x: number, y: number): number {
  return x + y
}

add('Hello', 11)
```

现在 Flow 就能检查出错误，因为函数参数的期待类型为数字，而我们提供了字符串。

上面的例子是针对函数的类型注释。接下来我们来看看 Flow 能支持的一些常见的类型注释。

###### 3.1.3.2.1 数组

```js
/*@flow*/

var arr: Array<number> = [1, 2, 3]

arr.push('Hello')
```

数组类型注释的格式是 Array<T>，T 表示数组中每项的数据类型。在上述代码中，arr 是每项均为数字的数组。如果我们给这个数组添加了一个字符串，Flow 能检查出错误。

###### 3.1.3.2.2 类和对象

```js
/*@flow*/

class Bar {
  x: string;           // x 是字符串
  y: string | number;  // y 可以是字符串或者数字
  z: boolean;

  constructor(x: string, y: string | number) {
    this.x = x
    this.y = y
    this.z = false
  }
}

var bar: Bar = new Bar('hello', 4)

var obj: { a: string, b: number, c: Array<string>, d: Bar } = {
  a: 'hello',
  b: 11,
  c: ['hello', 'world'],
  d: new Bar('hello', 3)
}
```

类的类型注释格式如上，可以对类自身的属性做类型检查，也可以对构造函数的参数做类型检查。这里需要注意的是，属性 y 的类型中间用 | 做间隔，表示 y 的类型即可以是字符串也可以是数字。

对象的注释类型类似于类，需要指定对象属性的类型。

###### 3.1.3.2.3 Null

若想任意类型 T 可以为 null 或者 undefined，只需类似如下写成 ?T 的格式即可

```js
/*@flow*/

var foo: ?string = null
```

此时，foo 可以为字符串，也可以为 null。

目前我们只列举了 Flow 的一些常见的类型注释。如果想了解所有类型注释，请移步 Flow 的[官方文档](https://flow.org/en/docs/types/)。

#### 3.1.4 Flow在vue.js源码中的应用

有时候我们想引用第三方库，或者自定义一些类型，但 Flow 并不认识，因此检查的时候会报错。为了解决这类问题，Flow 提出了一个 libdef 的概念，可以用来识别这些第三方库或者是自定义类型，而 Vue.js 也利用了这一特性。

在 Vue.js 的主目录下有 .flowconfig 文件， 它是 Flow 的配置文件，文件内容为：

```js
flow
├── compiler.js        # 编译相关
├── component.js       # 组件数据结构
├── global-api.js      # Global API 结构
├── modules.js         # 第三方库定义
├── options.js         # 选项相关
├── ssr.js             # 服务端渲染相关
├── vnode.js           # 虚拟 node 相关
```

可以看到，Vue.js 有很多自定义类型的定义，在阅读源码的时候，如果遇到某个类型并想了解它完整的数据结构的时候，可以回来翻阅这些数据结构的定义。

### 3.2 vue目录结构设计

```js
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

#### 3.2.1 compiler

包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。

编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

#### 3.2.2 core

包含了vue.js的核心代码，包含内置组件，全局API封装，vue实例化、观察者、虚拟DOM、工具函数等等。

这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。

#### 3.2.3 platform

Vue.js 是一个跨平台的 类MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

#### 3.2.4 server

Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。

这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。

服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

#### 3.2.5 sfc

通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。

这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

#### 3.2.6 shared

Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

### 3.3 vue源码构建

Vue.js 源码是基于 [Rollup](https://github.com/rollup/rollup) 构建的，它的构建相关配置都在 scripts 目录下。

#### 3.3.1 构建脚本

Vue.js 源码构建的脚本如下：（只说跟build相关）

```js
  "build": "node scripts/build.js",
  "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
  "build:weex": "npm run build -- weex",
```

这里总共有 3 条命令，作用都是构建 Vue.js，后面 2 条是在第一条命令的基础上，添加一些环境参数。

当在命令行运行 npm run build 的时候，实际上就会执行 node scripts/build.js，接下来我们来看看它实际是怎么构建的。

#### 3.3.2 构建过程

在 scripts/build.js 中：

```js
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)
```

这段代码逻辑非常简单，先从配置文件读取配置，再通过命令行参数对构建配置做过滤，这样就可以构建出不同用途的 Vue.js 了。接下来我们看一下配置文件，在 `scripts/config.js` 中：

```js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // ...
}
```

这里列举了一些 Vue.js 构建的配置，对于单个配置，它是遵循 Rollup 的构建规则的。其中 entry 属性表示构建的入口 JS 文件地址，dest 属性表示构建后的 JS 文件地址。format 属性表示构建的格式，cjs 表示构建出来的文件遵循 [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规范，es 表示构建出来的文件遵循 [ES Module](http://exploringjs.com/es6/ch_modules.html) 规范。 umd 表示构建出来的文件遵循 [UMD](https://github.com/umdjs/umd) 规范。

以 `web-runtime-cjs-dev`配置为例，它的 entry 是 `resolve('web/entry-runtime.js')`，先来看一下 resolve 函数的定义。

源码目录：scripts/config.js

```js
const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

这里的 resolve 函数实现非常简单，它先把 resolve 函数传入的参数 p 通过 / 做了分割成数组，然后取数组第一个元素设置为 base。在我们这个例子中，参数 p 是 `web/entry-runtime.js`，那么 base 则为 web。base 并不是实际的路径，它的真实路径借助了别名的配置，我们来看一下别名配置的代码，在 scripts/alias 中：

```js
const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}

```

很显然，这里 web 对应的真实的路径是 path.resolve(__dirname, '../src/platforms/web')，这个路径就找到了 Vue.js 源码的 web 目录。然后 resolve 函数通过 `path.resolve(aliases[base], p.slice(base.length + 1))` 找到了最终路径，它就是 Vue.js 源码 web 目录下的 entry-runtime.js。因此，`web-runtime-cjs-dev` 配置对应的入口文件就找到了。

它经过 Rollup 的构建打包后，最终会在 dist 目录下生成 `dist/vue.runtime.common.dev.js`。

#### 3.3.3 Runtime Only VS Runtime + Compiler

通常我们利用 vue-cli 去初始化我们的 Vue.js 项目的时候会询问我们用 `Runtime Only` 版本的还是 `Runtime + Compiler` 版本。下面我们来对比这两个版本。

- Runtime only

  我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量；

- Runtime+Compiler

  我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：

  ```js
  // 需要编译器的版本
  new Vue({
    template: '<div>{{ hi }}</div>'
  })
  
  // 这种情况不需要
  new Vue({
    render (h) {
      return h('div', this.hi)
    }
  })
  ```

  在 Vue.js 2.0 中，最终渲染都是通过 render 函数，如果写 template 属性，则需要编译成 render 函数，那么这个编译过程会发生运行时，所以需要带有编译器的版本。

  很显然，这个编译过程对性能会有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue.js。

### 3.4 Vue入口

在 web场景下，我们来分析 Runtime + Compiler 构建出来的 Vue.js，它的入口是 `src/platforms/web/entry-runtime-with-compiler.js`：

```js
/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue

```

当我们的代码执行 import Vue from 'vue' 的时候，就是从这个入口执行代码来初始化 Vue，来源为：

import Vue from './runtime/index'`，入口在`src/platforms/web/runtime/index.js

```js
/* @flow */

import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue

```

这里关键的代码是 `import Vue from 'core/index'`，之后的逻辑都是对 Vue 这个对象做一些扩展，可以先不用看，我们来看一下真正初始化 Vue 的地方，在 `src/core/index.js` 中：

```js
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
```

这里有 2 处关键的代码，`import Vue from './instance/index' `和 `initGlobalAPI(Vue)`，初始化全局 Vue API（我们稍后介绍），我们先来看第一部分，在 `src/core/instance/index.js` 中

#### 3.4.1 vue定义

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

在这里，我们会发现，Vue实际上就是一个用 Function 实现的类，这也是为什么我们只能通过` new Vue` 去实例化它的原因。

Q：为何 Vue 不用 ES6 的 Class 去实现呢？

A：我们往后看这里有很多 xxxMixin 的函数调用，并把 Vue 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法，Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理。

#### 3.4.2 initGlobalAPI

Vue.js 在整个初始化过程中，除了给它的原型 prototype 上扩展方法，还会给 Vue 这个对象本身扩展全局的静态方法，它的定义在 src/core/global-api/index.js 中：

```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```

这里就是在 Vue 上扩展的一些全局方法的定义，Vue 官网中关于全局 API 都可以在这里找到，有一点要注意的是，`Vue.util`暴露的方法最好不要依赖，因为它可能经常会发生变化，是不稳定的。具体的全局API后面详细讲解；

### 4. 数据驱动

Vue.js 一个核心思想是数据驱动。所谓数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据。它相比我们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码量。特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护。

在 Vue.js 中我们可以采用简洁的模板语法来声明式的将数据渲染为 DOM：

```js
<div id="app">
  {{ message }}
</div>

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

最终它会在页面上渲染出`Hello Vue`。接下来，我们会从源码角度来分析 Vue 是如何实现的。在这里，先弄清楚模板和数据如何渲染成最终的 DOM。

#### 4.1 new Vue时发生什么

从入口代码开始分析，我们先来分析 new Vue 背后发生了哪些事情。我们都知道，new 关键字在 Javascript 语言中代表实例化是一个对象，而 Vue 实际上是一个类，类在 Javascript 中是用 Function 来实现的，来看一下源码，在src/core/instance/index.js 中。

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

可以看到 Vue 只能通过 new 关键字初始化，然后会调用 this._init 方法， 该方法在`initMixin(Vue)`时注入到prototype上，在 `src/core/instance/init.js`中定义。

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // a uid
  vm._uid = uid++

  let startTag, endTag
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`
    endTag = `vue-perf-end:${vm._uid}`
    mark(startTag)
  }

  // a flag to avoid this being observed
  vm._isVue = true
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
  } else {
    vm._renderProxy = vm
  }
  // expose real self
  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    vm._name = formatComponentName(vm, false)
    mark(endTag)
    measure(`vue ${vm._name} init`, startTag, endTag)
  }

  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
```

Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等等。

Vue 的初始化逻辑写的非常清楚，把不同的功能逻辑拆成一些单独的函数执行，让主线逻辑一目了然，由于我们这一章的目标是弄清楚模板和数据如何渲染成最终的 DOM，所以各种初始化逻辑我们先不看。在初始化的最后，检测到如果有 el 属性，则调用 vm.$mount 方法挂载 vm，挂载的目标就是把模板渲染成最终的 DOM，那么接下来我们来分析 Vue 的挂载过程。

#### 4.2 vue实例挂在的实现

Vue 中我们是通过 $mount 实例方法去挂载 vm 的，$mount 方法在多个文件中都有定义，如 `src/platform/web/entry-runtime-with-compiler.js`、`src/platform/web/runtime/index.js`、`src/platform/weex/runtime/index.js`。因为 $mount 这个方法的实现是和平台、构建方式都相关的。接下来我们重点分析带 compiler 版本的 $mount 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理，有助于我们对原理理解的深入。

先来看一下 `src/platform/web/entry-runtime-with-compiler.js `文件中定义：

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

这段代码首先缓存了原型上的` $mount`方法，再重新定义该方法

1. 它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上；
2. 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法。在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法；
3. 根据生成的template函数，会执行在线编译的过程，是调用 `compileToFunctions` 方法实现的，在后续的编译过程中讲解。最后，调用原先原型上的 $mount 方法挂载；

原先原型上的 $mount 方法在 `src/platform/web/runtime/index.js `中定义，之所以这么设计完全是为了复用，因为它是可以被`runtime only`版本的 Vue 直接使用的。

```js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

$mount 方法支持传入 2 个参数，第一个是 el，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，如果是字符串在浏览器环境下会调用 query 方法转换成 DOM 对象的。第二个参数是和服务端渲染相关，在浏览器环境下我们不需要传第二个参数。

$mount 方法实际上会去调用 mountComponent 方法，这个方法定义在` src/core/instance/lifecycle.js`文件中：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

这里面核心就是先实例化一个渲染Watcher，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 vm._render 方法先生成虚拟 Node，最终调用 vm._update 更新 DOM。

Watcher 在这里起到两个作用：（后面会详细讲解）

1. 初始化的时候会执行回调函数；
2. 当 vm 实例中的监测的数据发生变化的时候执行回调函数；

函数最后判断当根节点vm.$vnode为null时，执行mount初始化；接下来详细讲_render（生成VNode）和_update（更新DOM）

#### 4.3 render

Vue 的 `_render` 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 `src/core/instance/render.js` 文件中：

在`src/core/instance/init.js`中，执行`renderMixin`，注入到到Vue.prototype上：

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  // reset _rendered flag on slots for duplicate slot check
  if (process.env.NODE_ENV !== 'production') {
    for (const key in vm.$slots) {
      // $flow-disable-line
      vm.$slots[key]._rendered = false
    }
  }

  if (_parentVnode) {
    vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`)
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } else {
      vnode = vm._vnode
    }
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      warn(
        'Multiple root nodes returned from render function. Render function ' +
        'should return a single root node.',
        vm
      )
    }
    vnode = createEmptyVNode()
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

最关键的是 render 方法的调用，在之前的 mounted 方法的实现中，会把 template 编译成 render 方法，具体的编译方法在后面讲

在_render 函数中的 render 方法的调用中：

```js
vnode = render.call(vm._renderProxy, vm.$createElement)
```

render 函数中的 createElement 方法就是 vm.$createElement 方法，其中vm.$createElement的方法是在initRender中定义的，其中vm.$createElement调用了createElement，另一个方法也调用了，这个方法是被模板编译成的 render 函数使用，而 vm.$createElement 是用户手写 render 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 createElement 方法

```js
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

此方法，也是Vue中提到的render的第一个参数`createElement`

```js
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

#### 4.4 vdom

在了解createElement原理之前，先了解下Virtual DOM是什么。

在浏览器中，一个最简单的div所包含的元素也是很多的，因为浏览器的标准就把 DOM 设计的非常复杂。当我们频繁的去做 DOM 更新，会产生一定的性能问题。

```js
const div = document.createElement('div')
let str = '';
for (const key in div) str += key + ' '
```

而 Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。在 Vue.js 中，Virtual DOM 是用 VNode 这么一个 Class 去描述，它是定义在 src/core/vdom/vnode.js 中的。

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

实际上 Vue.js 中 Virtual DOM 是借鉴了一个开源库 [snabbdom](https://github.com/snabbdom/snabbdom) 的实现，然后加入了一些 Vue.js本身的东西，在后面的内容里，会在VNode的create、diff、patch等阶段讲解VNode的操作；

#### 4.5 createElement

Vue.js 利用 createElement 方法创建 VNode，它定义在 `src/core/vdom/create-element.js` 中：

```js
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn) && data.tag !== 'component') {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}

```

_createElement 方法有 5 个参数：

1. context 表示 VNode 的上下文环境，它是 Component 类型；
2. tag 表示标签，它可以是一个字符串，也可以是一个 Component；
3. data 表示 VNode 的数据，它是一个 VNodeData 类型，可以在 flow/vnode.js 中找到它的定义，这里先不展开说；
4. children 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组；
5. normalizationType 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 render 函数是编译生成的还是用户手写的。

createElement里核心的流程包含两个：

##### 4.5.1 children的规范化

由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。_createElement 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型。

这里根据 normalizationType 的不同，调用了 `normalizeChildren(children) `和 `simpleNormalizeChildren(children) `方法，它们的定义都在 `src/core/vdom/helpers/normalzie-children.js `中：

```js
export function simpleNormalizeChildren (children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}
```

- simpleNormalizeChildren：

1. 调用场景是 render 函数是编译生成的。
2. 理论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就是 functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 `Array.prototype.concat `方法把整个 children 数组打平，让它的深度只有一层。

- normalizeChildren 方法的调用场景有 2 种：

1. 一个场景是 render 函数是用户手写的，当 children 只有一个节点的时候，Vue.js 从接口层面允许用户把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 `createTextVNode` 创建一个文本节点的 VNode；
2. 另一个场景是当编译 slot、v-for 的时候会产生嵌套数组的情况，会调用 `normalizeArrayChildren` 方法；

```js
function normalizeArrayChildren (children: any, nestedIndex?: string): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    if (isUndef(c) || typeof c === 'boolean') continue
    lastIndex = res.length - 1
    last = res[lastIndex]
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c))
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}

```

normalizeArrayChildren 接收 2 个参数：

1. children：表示要规范的子节点；
2. nestedIndex：表示嵌套的索引；

因为单个 child 可能是一个数组类型。 `normalizeArrayChildren` 主要的逻辑就是遍历 children，获得单个节点 c，然后对 c 的类型判断：

1. 如果是一个数组类型，则递归调用 `normalizeArrayChildren`; 
2. 如果是基础类型，则通过 `createTextVNode` 方法转换成 VNode 类型；否则就已经是 VNode 类型了，如果 children 是一个列表并且列表还存在嵌套的情况，则根据 nestedIndex 去更新它的 key；

注意：在遍历的过程中，如果存在两个连续的 text 节点，会把它们合并成一个 text 节点

然后，children就变为了VNode的单节点或者数组了

#### 3.5.2 vnode的构建

规范完children后，需要创建一个VNode实例：

```js
let vnode, ns
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn) && data.tag !== 'component') {
      warn(
        `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
        context
      )
    }
    vnode = new VNode(
      config.parsePlatformTagName(tag), data, children,
      undefined, undefined, context
    )
  } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
```

_update 的核心就是调用 vm.__patch__ 方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的，因此在 web 平台中它的定义在 src/platforms/web/runtime/index.js 中：

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

在 web 平台上，是否是服务端渲染也会对这个方法产生影响。因为在服务端渲染中，没有真实的浏览器 DOM 环境，所以不需要把 VNode 最终转换成 DOM，因此是一个空函数，而在浏览器端渲染中，它指向了 patch 方法，它的定义在` src/platforms/web/runtime/patch.js`中：

```js
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

该方法的定义是调用 `createPatchFunction` 方法的返回值，这里传入了一个对象，包含 nodeOps 参数和 modules 参数。其中，nodeOps 封装了一系列 DOM 操作的方法，modules 定义了一些模块的钩子函数的实现，我们这里先不详细介绍，来看一下 createPatchFunction 的实现，它定义在 `src/core/vdom/patch.js` 中：

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // ...

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```

createPatchFunction 内部定义了一系列的辅助方法，最终返回了一个 patch 方法，这个方法就赋值给了 vm._update 函数里调用的 `vm.__patch__`。

Q：为何 Vue.js 源码绕了这么一大圈，把相关代码分散到各个目录？

A：

1. 因为patch 是平台相关的，在 Web 和 Weex 环境，它们把虚拟 DOM 映射到 “平台 DOM” 的方法是不同的，并且对 “DOM” 包括的属性模块创建和更新也不尽相同。因此每个平台都有各自的 `nodeOps` 和 `modules`，它们的代码需要托管在 src/platforms 这个大目录下；
2. 不同平台的 patch 的主要逻辑部分是相同的，所以这部分公共的部分托管在 core 这个大目录下。差异化部分只需要通过参数`nodeOps` 和 `modules` 来区分：

1. 1. nodeOps 表示对 “平台 DOM” 的一些操作方法；
   2. modules 表示平台的一些模块，它们会在整个 patch 过程的不同阶段执行相应的钩子函数；

回到 patch 方法本身，它接收 4个参数：

1. oldVnode 表示旧的 VNode 节点，它也可以不存在或者是一个 DOM 对象；
2. vnode 表示执行 _render 后返回的 VNode 的节点；
3. hydrating 表示是否是服务端渲染；
4. removeOnly 是给 transition-group 用的；

先来回顾我们的例子：

```js
var app = new Vue({
  el: '#app',
  render: function (createElement) {
    return createElement('div', {
      attrs: {
        id: 'app'
      },
    }, this.message)
  },
  data: {
    message: 'Hello Vue!'
  }
})
```

在 vm._update 的方法里是这么调用 patch 方法的:

```js
// initial render
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
```

结合我们的例子：

1. 我们的场景是首次渲染，所以在执行 patch 函数的时候，传入的 vm.$el 对应的是例子中 id 为 app 的 DOM 对象，这个也就是我们在 index.html 模板中写的 `<div id="app">`，vm.$el 的赋值是在之前 mountComponent 函数做的；
2. vnode 对应的是调用 render 函数的返回值；
3. hydrating 在非服务端渲染情况下为 false；
4. removeOnly 为 false；

这时候回顾patch的执行过程上

```js
const isRealElement = isDef(oldVnode.nodeType)
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
} else {
  if (isRealElement) {
    // mounting to a real element
    // check if this is server-rendered content and if we can perform
    // a successful hydration.
    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
      oldVnode.removeAttribute(SSR_ATTR)
      hydrating = true
    }
    if (isTrue(hydrating)) {
      if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
        invokeInsertHook(vnode, insertedVnodeQueue, true)
        return oldVnode
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'The client-side rendered virtual DOM tree is not matching ' +
          'server-rendered content. This is likely caused by incorrect ' +
          'HTML markup, for example nesting block-level elements inside ' +
          '<p>, or missing <tbody>. Bailing hydration and performing ' +
          'full client-side render.'
        )
      }
    }      
    // either not server-rendered, or hydration failed.
    // create an empty node and replace it
    oldVnode = emptyNodeAt(oldVnode)
  }

  // replacing existing element
  const oldElm = oldVnode.elm
  const parentElm = nodeOps.parentNode(oldElm)

  // create new node
  createElm(
    vnode,
    insertedVnodeQueue,
    // extremely rare edge case: do not insert if old element is in a
    // leaving transition. Only happens when combining transition +
    // keep-alive + HOCs. (#4590)
    oldElm._leaveCb ? null : parentElm,
    nodeOps.nextSibling(oldElm)
  )
}
```

由于我们传入的 oldVnode 实际上是一个 DOM，所以 isRealElement 为 true，接下来又通过 emptyNodeAt 方法把 oldVnode 转换成 VNode 对象，然后再调用 createElm 方法，来看一下它的实现：

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  vnode.isRootInsert = !nested // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        creatingElmInVPre++
      }
      if (isUnknownElement(vnode, creatingElmInVPre)) {
        warn(
          'Unknown custom element: <' + tag + '> - did you ' +
          'register the component correctly? For recursive components, ' +
          'make sure to provide the "name" option.',
          vnode.context
        )
      }
    }

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // ...
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

createElm 的作用是通过虚拟节点创建真实的 DOM 并插入到它的父节点中。 

1. createComponent 方法目的是尝试创建子组件，后面详细解释，在当前这个 case 下它的返回值为 false；
2. 接下来判断 vnode 是否包含 tag，如果包含，先简单对 tag 的合法性在非生产环境下做校验，看是否是一个合法标签；然后再去调用平台 DOM 的操作去创建一个占位符元素；（ns：nameSpace）

```js
vnode.elm = vnode.ns
  ? nodeOps.createElementNS(vnode.ns, tag)
  : nodeOps.createElement(tag, vnode)
```

接下来调用 createChildren 方法去创建子元素，也就是去遍历createElm的：

```js
createChildren(vnode, children, insertedVnodeQueue)

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(children)
    }
    for (let i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```

接着再调用 invokeCreateHooks 方法执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中

```js
 if (isDef(data)) {
  invokeCreateHooks(vnode, insertedVnodeQueue)
}

function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
```

最后调用 insert 方法把 DOM 插入到父节点中，因为是递归调用，子元素会优先调用 insert，所以整个 vnode 树节点的插入顺序是先子后父。来看一下 insert 方法，它的定义在 src/core/vdom/patch.js 上。

```js
insert(parentElm, vnode.elm, refElm)

function insert (parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (ref.parentNode === parent) {
        nodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      nodeOps.appendChild(parent, elm)
    }
  }
}
```

insert 调用一些 nodeOps 把子节点插入到父节点中，这些辅助方法定义在 src/platforms/web/runtime/node-ops.js 中：

```js
export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function appendChild (node: Node, child: Node) {
  node.appendChild(child)
}
```

其实在web中，就是调用原生 DOM 的 API 进行 DOM 操作；

在 `createElm` 过程中，如果 vnode 节点不包含 tag，则它有可能是一个注释或者纯文本节点，可以直接插入到父元素中。在我们这个例子中，最内层就是一个文本 vnode，它的 text 值取的就是之前的 this.message 的值 Hello Vue!。

再回到 `patch` 方法，首次渲染我们调用了 createElm 方法，这里传入的 parentElm 是 oldVnode.elm 的父元素，在我们的例子是 id 为 #app div 的父元素，也就是 Body；实际上整个过程就是递归创建了一个完整的 DOM 树并插入到 Body 上；

最后，我们根据之前递归 createElm 生成的 vnode 插入顺序队列，执行相关的 insert 钩子函数；

以上就是数据在Vue2中如何渲染成DOM的过程。

![vue2渲染dom](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2渲染dom.png)

# Vue2源码解析（2/2）

## 1.课程目标

掌握Vue2.6（目前2.X最高版本）的核心源码；

## 2.课程大纲

- vue组件化

## 3. Vue 组件化

Vue.js的一个核心思想是组件化。所谓组件化，就是把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套，接下来我们会从源码的角度来分析 Vue 的组件内部是如何工作的。

接下来我们会用 Vue-cli 初始化的代码为例，来分析一下 Vue 组件初始化的一个过程。

```js
import Vue from 'vue'
import App from './App.vue'

var app = new Vue({
  el: '#app',
  // 这里的 h 是 createElement 方法
  render: h => h(App)
})
```

这段代码相信很多同学都很熟悉，它和我们上一章相同的点也是通过 render 函数去渲染的，不同的这次通过 createElement 传的参数是一个组件而不是一个原生的标签，接下来我们就开始分析这一过程中发生了什么。

## 3.1 createComponent

上节课中，我们在createElement 的实现中讲过，它会调用 _createElement 方法，其中有一段逻辑是对参数 tag 的判断，如果是一个普通的 html 标签，会实例化一个普通的VNode节点，否则通过 createComponent 方法创建一个组件 VNode。

- src/code/vdom/create-element.js

```js
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    vnode = new VNode(
      config.parsePlatformTagName(tag), data, children,
      undefined, undefined, context
    )
  } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
```

在render函数中，我们传入的是render：h=>h(App)，是一个Component组件类型，会执行

```js
vnode = createComponent(Ctor, data, context, children, tag)
```



## vue2和vue3响应式的区别

Object.defineProperty重新定义getter和setter，为什么换proxy代理

1.对于数组长度变化

2.在对象上增删元素的操作

3.数组方法push, pop,unshift,shift

4.想支持响应式的属性$set

