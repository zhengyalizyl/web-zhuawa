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

它定义在 `src/core/vdom/create-component.js `文件中

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```

内容相对较多，我们只看核心的部分：`构造子类构造函数`，`安装组件钩子函数`和`实例化 VNode`。

#### 3.1.1构造子类构造函数

```js
const baseCtor = context.$options._base

// plain options object: turn it into a constructor
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}
```

在开发业务组件的时候，我们经常是使用下列方式创建：

```js
import HelloWorld from './components/HelloWorld'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
```

这里 export 的是一个对象，所以 createComponent 里的代码逻辑会执行到 baseCtor.extend(Ctor)，在这里 baseCtor 实际上就是 Vue，这个的定义是在最开始初始化 Vue 的阶段，在 src/core/global-api/index.js 中的 initGlobalAPI 里定义的：

```js
// this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
```

但是我们会发现，这里定义的是 `Vue.options`，而我们的 createComponent 取的是 `context.$options`，实际上在 `src/core/instance/init.js`里 Vue 原型上的 _init 函数中注入的这部分内容：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

这样就把 Vue 上的一些 option 扩展到了 `vm.$options` 上，所以我们也就能通过 `vm.$options._base` 拿到 Vue 这个构造函数了。mergeOptions后面详细讲解，现在只需要理解它的功能是把 Vue 构造函数的 options 和用户传入的 options 做一层合并，到 `vm.$options` 上。

在明确`baseCtor` 指向了 Vue 之后，我们来看一下 Vue.extend 函数的定义，在 `src/core/global-api/extend.js` 中：

```js
/**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
```

这里我们可以发现，Vue.extend的作用就是通过原型继承的方式，把一个继承于Vue的构造器，Sub返回，然后对Sub 这个对象本身扩展了一些属性，如扩展 options、添加全局 API 等；并且对配置中的 props 和 computed 做了初始化工作；最后对于这个 Sub 构造函数做了缓存，避免多次执行 Vue.extend 的时候对同一个子组件重复构造。
然后，当我们去实例化 Sub 的时候，就会执行 this._init 逻辑再次走到了 Vue 实例的初始化逻辑，实例化组件的方式后面说明。

```js
const Sub = function VueComponent (options) {
  this._init(options)
}
```

#### 3.1.2 安装钩子函数

```js
// install component management hooks onto the placeholder node
installComponentHooks(data
```

之前提到 Vue.js 使用的 Virtual DOM 参考的是开源库 [snabbdom](https://github.com/snabbdom/snabbdom)，它的一个特点是在 VNode 的 patch 流程中对外暴露了各种时机的钩子函数，方便我们做一些额外的事情，Vue.js 也是充分利用这一点，在初始化一个 Component 类型的 VNode 的过程中实现了几个钩子函数：

```js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}
```

整个 `installComponentHooks` 的过程就是把 `componentVNodeHooks` 的钩子函数合并到 `data.hook`中，在 VNode 执行 patch 的过程中执行相关的钩子函数，具体的执行我们在后面`patch` 过程中介绍。这里要注意的是合并策略，在合并过程中，如果某个时机的钩子已经存在 `data.hook `中，那么通过执行 `mergeHook` 函数做合并，确保两个需要合并的钩子函数都执行。

#### 3.1.3 实例化vnode

```js
const name = Ctor.options.name || tag
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data, undefined, undefined, undefined, context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)
return vnode
```

最后，我们会通过`new VNode`方式实例化一个VNode并返回，这里要注意，此时的Component VNode元素是没有children的，且前缀是`vue-component`。这块在后续的patch过程中会用到。

#### 3.1.4 总结

到这里，对组件我们完成了`createComponent`的处理，此时我们生成了组件的VNode，接下来按照正常的元素渲染，_render_已经处理完成，需要进行`_update`，也就是`patch`的逻辑。

### 3.2 patch

跟普通元素类似，`createComponent` 创建了组件 VNode，接下来会走到 v`m._update`，执行 `vm.__patch__` 去把 VNode 转换成真正的 DOM 节点。我们对比普通元素，看下patch阶段对组件元素会有何种区别：

patch 的过程会调用 `createElm` 创建元素节点，回顾一下 createElm 的实现，它的定义在 `src/core/vdom/patch.js` 中：

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
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // ...
}
```

#### 3.2.1 createComponent

上节课有说过，对于非组件元素，我们在`createComponent`会返回false，接下来看下具体实现：

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

首先对vnode.data进行判断:

```js
let i = vnode.data
if (isDef(i)) {
  // ...
  if (isDef(i = i.hook) && isDef(i = i.init)) {
    i(vnode, false /* hydrating */)
    // ...
  }
  // ..
}
```

如果 vnode 是一个组件 VNode，那么条件会满足，并且得到 i 就是 init 钩子函数，回顾上节我们在创建组件 VNode 的时候合并钩子函数中就包含 init 钩子函数，定义在 `src/core/vdom/create-component.js` 中：

```js
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
  if (
    vnode.componentInstance &&
    !vnode.componentInstance._isDestroyed &&
    vnode.data.keepAlive
  ) {
    // kept-alive components, treat as a patch
    const mountedNode: any = vnode // work around flow
    componentVNodeHooks.prepatch(mountedNode, mountedNode)
  } else {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
},
```

我们先不考虑 keepAlive 的情况，它是通过 createComponentInstanceForVnode 创建一个 Vue 的实例，然后调用 $mount 方法挂载子组件， 先来看一下 createComponentInstanceForVnode 的实现：

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

`createComponentInstanceForVnode` 函数构造的一个内部组件的参数，然后执行 `new vnode.componentOptions.Ctor(options)`。这里的`vnode.componentOptions.Ctor` 对应的就是子组件的构造函数，我们上一节分析了它实际上是继承于 Vue 的一个构造器 Sub，相当于 `new Sub(options)` 这里有几个关键参数要注意几个点，_isComponent 为 true 表示它是一个组件。

所以子组件的实例化实际上就是在这个时机执行的，并且它会执行实例的 _init 方法，这个过程有一些和之前不同的地方需要挑出来说，代码在 `src/core/instance/init.js`中：

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
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
  // ...
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  } 
}
```

首先是合并 options 的过程有变化，_isComponent 为 true，所以走到了 initInternalComponent 过程：

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

这里着重注意下：`opts.parent = options.parent`、`opts._parentVnode = parentVnode`

最后，_init执行：

```js
if (vm.$options.el) {
   vm.$mount(vm.$options.el)
}
```

此时，回顾组件的init

```js
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
  if (
    vnode.componentInstance &&
    !vnode.componentInstance._isDestroyed &&
    vnode.data.keepAlive
  ) {
    // kept-alive components, treat as a patch
    const mountedNode: any = vnode // work around flow
    componentVNodeHooks.prepatch(mountedNode, mountedNode)
  } else {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
},
```

会执行 `child.$mount(hydrating ? vnode.elm : undefined, hydrating) `。这里 hydrating 为 true 一般是服务端渲染的情况，我们只考虑客户端渲染，所以这里 $mount 相当于执行 `child.$mount(undefined, false)`，它最终会调用 mountComponent 方法，进而执行 vm._render() 方法：

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  
  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    // ...
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

这里的 `_parentVnode` 就是当前组件的父 VNode，而 render 函数生成的 vnode 当前组件的渲染 vnode，vnode 的 parent 指向了 `_parentVnode`，也就是 vm.$vnode，它们是一种父子的关系，在执行完 vm._render 生成 VNode 后，接下来就要执行 `vm._update` 去渲染 VNode 了。来看一下组件渲染的过程中有哪些需要注意的，`vm._update` 的定义在`src/core/instance/lifecycle.js` 中：

```js
export let activeInstance: any = null
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  activeInstance = vm
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  activeInstance = prevActiveInstance
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

首先，` vm._vnode = vnode `的逻辑，这个 vnode 是通过 vm._render() 返回的组件渲染 VNode，`vm._vnode` 和 `vm.$vnode` 的关系就是一种父子关系，用代码表达就是 `vm._vnode.parent === vm.$vnode`

```js
export let activeInstance: any = null
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  // ...
  const prevActiveInstance = activeInstance
  activeInstance = vm
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  activeInstance = prevActiveInstance
  // ...
}
```

这个 activeInstance 作用就是保持当前上下文的 Vue 实例，它是在 lifecycle 模块的全局变量，定义是 `export let activeInstance: any = null`，并且在之前我们调用 `createComponentInstanceForVnode` 方法的时候从 lifecycle 模块获取，并且作为参数传入的。因为实际上 JavaScript 是一个单线程，Vue 整个初始化是一个深度遍历的过程，在实例化子组件的过程中，它需要知道当前上下文的 Vue 实例是什么，并把它作为子组件的父 Vue 实例。前面我们提到过对子组件的实例化过程先会调用 `initInternalComponent(vm, options) `合并 options，把 parent 存储在 vm.$options 中，在 $mount 之前会调用 initLifecycle(vm) 方法：

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  // ...
}
```

可以看到 vm.$parent 就是用来保留当前 vm 的父实例，并且通过 parent.$children.push(vm) 来把当前的 vm 存储到父实例的 $children 中。

在 vm._update 的过程中，把当前的 vm 赋值给 activeInstance，同时通过 const prevActiveInstance = activeInstance 用 prevActiveInstance 保留上一次的 activeInstance。实际上，prevActiveInstance 和当前的 vm 是一个父子关系，当一个 vm 实例完成它的所有子树的 patch 或者 update 过程后，activeInstance 会回到它的父实例，这样就完美地保证了 `createComponentInstanceForVnode` 整个深度遍历过程中，我们在实例化子组件的时候能传入当前子组件的父 Vue 实例，并在 _init 的过程中，通过 vm.$parent 把这个父子关系保留。

那么回到 _update，最后就是调用 __patch__ 渲染 VNode：

```js
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
 
function patch (oldVnode, vnode, hydrating, removeOnly) {
  // ...
  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    // ...
  }
  // ...
}

```

之前分析过负责渲染成 DOM 的函数是 createElm，注意这里我们只传了 2 个参数，所以对应的 parentElm 是 undefined。我们再来看看它的定义：

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
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    // ...

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
    
    // ...
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

注意，这里我们传入的 vnode 是组件渲染的 vnode，也就是我们之前说的 vm._vnode，如果组件的根节点是个普通元素，那么 vm._vnode 也是普通的 vnode，这里 `createComponent(vnode, insertedVnodeQueue, parentElm, refElm)` 的返回值是 false。接下来的过程就和我们上一章一样了，先创建一个父节点占位符，然后再遍历所有子 VNode 递归调用 createElm，在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode，则重复本节开始的过程，这样通过一个递归的方式就可以完整地构建了整个组件树。

由于我们这个时候传入的 `parentElm` 是空，所以对组件的插入，在 `createComponent` 有这么一段逻辑

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    // ....
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // ...
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

在完成组件的整个 patch 过程后，最后执行 `insert(parentElm, vnode.elm, refElm) `完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那么DOM 的插入顺序是先子后父。

至此，我们就讲完了一个组件VNode是如何创建、初始化、渲染的了。

### 3.3 合并配置

我们知道，`new Vue` 的过程通常有 2 种场景，一种是外部我们的代码主动调用 `new Vue(options)` 的方式实例化一个 Vue 对象；另一种是我们上一节分析的组件过程中内部通过 `new Vue(options)`实例化子组件

两者都会执行实例的 `_init(options)` 方法，它首先会执行一个` merge options` 的逻辑，相关的代码在 `src/core/instance/init.js` 中：

```js
Vue.prototype._init = function (options?: Object) {
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
  // ...
}
```

可以发现，options有两种类型的传参，接下来会对options进行分析：
首先，我们举个简单的例子：

```js
import Vue from 'vue'

let childComp = {
  template: '<div>{{msg}}</div>',
  created() {
    console.log('child created')
  },
  mounted() {
    console.log('child mounted')
  },
  data() {
    return {
      msg: 'Hello Vue'
    }
  }
}

Vue.mixin({
  created() {
    console.log('parent created')
  }
})

let app = new Vue({
  el: '#app',
  render: h => h(childComp)
})
```

#### 3.3.1 外部调用场景

当执行 new Vue 的时候，在执行 `this._init(options) `的时候，就会执行如下逻辑去合并 options：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

通过调用 `mergeOptions` 方法来合并，它实际上就是把 `resolveConstructorOptions(vm.constructor) `的返回值和 `options` 做合并，`resolveConstructorOptions` 的实现先不考虑，在我们这个场景下，它还是简单返回 `vm.constructor.options`，相当于 Vue.options，那么这个值又是什么呢，其实在 initGlobalAPI(Vue) 的时候定义了这个值，

在 `src/core/global-api/index.js` 中：

```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)
  // ...
}
```

首先通过 `Vue.options = Object.create(null)` 创建一个空对象，然后遍历 `ASSET_TYPES`，ASSET_TYPES 的定义在 `src/shared/constants.js` 中：

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

// 遍历结果为：
Vue.options.components = {}
Vue.options.directives = {}
Vue.options.filters = {}
```

接着执行了 `Vue.options._base = Vue`；

最后通过 `extend(Vue.options.components, builtInComponents) `把一些内置组件扩展到 `Vue.options.components `上，Vue 的内置组件目前有 <keep-alive>、<transition> 和 <transition-group> 组件，这也就是为什么我们在其它组件中使用 <keep-alive> 组件不需要注册的原因，后续详细讲解。

回到 `mergeOptions` 这个函数，它的定义在 `src/core/util/options.js` 中：

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

主要功能就是把 parent 和 child 这两个对象根据一些合并策略，合并成一个新对象并返回。比较核心的几步，先递归把 extends 和 mixins 合并到 parent 上，然后遍历 parent，调用 mergeField，然后再遍历 child，如果 key 不在 parent 的自身属性上，则调用 mergeField

其中，mergeField 函数，它对不同的 key 有着不同的合并策略。举例来说，对于生命周期函数，它的合并策略是这样的：

```js
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
```

其中的 LIFECYCLE_HOOKS 的定义在 src/shared/constants.js 中：

```js
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
]

```

这里定义了 Vue.js 所有的钩子函数名称，所以对于钩子函数，他们的合并策略都是 mergeHook 函数。
而nergeHook用了一个多层 3 元运算符，逻辑就是如果不存在 childVal ，就返回 parentVal；否则再判断是否存在 parentVal，如果存在就把 childVal 添加到 parentVal 后返回新数组；否则返回 childVal 的数组。所以回到 mergeOptions 函数，一旦 parent 和 child 都定义了相同的钩子函数，那么它们会把 2 个钩子函数合并成一个数组。
其他属性的内容在src/core/util/options
通过执行 mergeField 函数，把合并后的结果保存到 options 对象中，最终返回它。
因此，在我们当前这个 case 下，执行完如下合并后：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

vm.$options 的值差不多是如下这样：

```js
vm.$options = {
  components: { },
  created: [
    function created() {
      console.log('parent created')
    }
  ],
  directives: { },
  filters: { },
  _base: function Vue(options) {
    // ...
  },
  el: "#app",
  render: function (h) {
    //...
  }
}
```

#### 3.3.2 组件场景

组件的构造函数是通过 Vue.extend 继承自 Vue 的，先回顾一下这个过程，代码定义在 src/core/global-api/extend.js 中：

```js
/**
 * Class inheritance
 */
Vue.extend = function (extendOptions: Object): Function {
  // ...
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )

  // ...
  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // ...
  return Sub
}
```

我们只保留关键逻辑，这里的 `extendOptions` 对应的就是前面定义的组件对象，它会和 Vue.options 合并到 Sub.opitons 中。

接下来我们再回忆一下子组件的初始化过程，代码定义在` src/core/vdom/create-component.js` 中：

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // ...
  return new vnode.componentOptions.Ctor(options)
}
```

这里的 `vnode.componentOptions.Ctor` 就是指向 `Vue.extend` 的返回值 Sub， 所以 执行 n`ew vnode.componentOptions.Ctor(options) `接着执行 this._init(options)，因为 `options._isComponent` 为 true，那么合并 options 的过程走到了 `initInternalComponent(vm, options)` 逻辑。在 `src/core/instance/init.js `中：

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

initInternalComponent 方法首先执行 const opts = vm.$options = Object.create(vm.constructor.options)，这里的 vm.constructor 就是子组件的构造函数 Sub，相当于 vm.$options = Object.create(Sub.options)。
接着又把实例化子组件传入的子组件父 VNode 实例 parentVnode、子组件的父 Vue 实例 parent 保存到 vm.$options 中，另外还保留了 parentVnode 配置中的如 propsData 等其它的属性。
这么看来，initInternalComponent 只是做了简单一层对象赋值，并不涉及到递归、合并策略等复杂逻辑。
因此，执行完成后

```js
initInternalComponent(vm, options)
```

Vm.$options的值大致为：

```js
vm.$options = {
  parent: Vue /*父Vue实例*/,
  propsData: undefined,
  _componentTag: undefined,
  _parentVnode: VNode /*父VNode实例*/,
  _renderChildren:undefined,
  __proto__: {
    components: { },
    directives: { },
    filters: { },
    _base: function Vue(options) {
        //...
    },
    _Ctor: {},
    created: [
      function created() {
        console.log('parent created')
      }, function created() {
        console.log('child created')
      }
    ],
    mounted: [
      function mounted() {
        console.log('child mounted')
      }
    ],
    data() {
       return {
         msg: 'Hello Vue'
       }
    },
    template: '<div>{{msg}}</div>'
  }
}
```

#### 3.3.3 总结

至此，Vue 初始化阶段对于 options 的合并过程就介绍完了，我们需要知道对于 options 的合并有 2 种方式，子组件初始化过程通过 `initInternalComponent` 方式要比外部初始化 Vue 通过 `mergeOptions` 的过程要快，合并完的结果保留在 `vm.$options` 中。

纵观一些库、框架的设计几乎都是类似的，自身定义了一些默认配置，同时又可以在初始化阶段传入一些定义配置，然后去 merge 默认配置，来达到定制化不同需求的目的，这个思路是值得借鉴的。

### 3.4 生命周期

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如需要设置数据监听、编译模板、挂载实例到 DOM、在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，给予用户机会在一些特定的场景下添加他们自己的代码。

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue生命周期.png" alt="vue生命周期" style="zoom:50%;" />

在实际项目开发过程中，会非常频繁地和 Vue 组件的生命周期打交道，接下来我们就从源码的角度来看一下这些生命周期的钩子函数是如何被执行的。

源码中最终执行生命周期的函数都是调用 callHook 方法，它的定义在 `src/core/instance/lifecycle` 中：

```js
export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```

callHooks根据传入的字符串 hook，去拿到 `vm.$options[hook]` 对应的回调函数数组，然后遍历执行，执行的时候把 vm 作为函数执行的上下文。

在上一节中，我们详细地介绍了 Vue.js 合并 options 的过程，各个阶段的生命周期的函数也被合并到 `vm.$options` 里，并且是一个数组。因此 `callhook` 函数的功能就是调用某个生命周期钩子注册的所有回调函数。

了解了生命周期的执行方式后，接下来我们会具体介绍每一个生命周期函数它的调用时机。

#### 3.4.1 beforeCreate & created

`beforeCreate` 和 `created` 函数都是在实例化 Vue 的阶段，在 _init 方法中执行的，它的定义在 `src/core/instance/init.js` 中：

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
  // ...
}
```

可以看到 `beforeCreate` 和 `created` 的钩子调用是在 `initState` 的前后，initState 的作用是初始化 props、data、methods、watch、computed 等属性，之后我们会详细分析。那么显然 beforeCreate 的钩子函数中就不能获取到 props、data 中定义的值，也不能调用 methods 中定义的函数。

在这俩个钩子函数执行的时候，并没有渲染 DOM，所以我们也不能够访问 DOM，一般来说，如果组件在加载的时候需要和后端有交互，放在这俩个钩子函数执行都可以，如果是需要访问 props、data 等数据的话，就需要使用 created 钩子函数。

#### 3.4.2 beforeMount & mounted

`beforeMount` 钩子函数发生在 `mount`，也就是 DOM 挂载之前，它的调用时机是在 `mountComponent` 函数中，定义在 `src/core/instance/lifecycle.js` 中：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // ...
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

在执行 vm._render() 函数渲染 VNode 之前，执行了 beforeMount 钩子函数，在执行完 vm._update()把 VNode patch 到真实 DOM 后，执行 mounted 钩子。注意，这里对 mounted 钩子函数执行有一个判断逻辑，vm.$vnode 如果为 null，则表明这不是一次组件的初始化过程，而是我们通过外部 new Vue 初始化过程。那么对于组件，它的 mounted 时机在哪儿呢？
之前我们提到过，组件的 VNode patch 到 DOM 后，会执行 invokeInsertHook 函数，把 insertedVnodeQueue 里保存的钩子函数依次执行一遍，它的定义在 src/core/vdom/patch.js 中：

```js
function invokeInsertHook (vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i])
    }
  }
}
```

该函数会执行 insert 这个钩子函数，对于组件而言，insert 钩子函数的定义在 `src/core/vdom/create-component.js` 中的 `componentVNodeHooks` 中：

```js
const componentVNodeHooks = {
  // ...
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    // ...
  },
}
```

我们可以看到，每个子组件都是在这个钩子函数中执行 `mounted` 钩子函数，并且我们之前分析过，`insertedVnodeQueue` 的添加顺序是先子后父，所以对于同步渲染的子组件而言，`mounted` 钩子函数的执行顺序也是先子后父。

#### 3.4.3 beforeUpdate & Updated

`beforeUpdate` 和 `updated` 的钩子函数执行时机都应该是在数据更新的时候，到目前为止，我们还没有分析 Vue 的数据双向绑定、更新相关，后续会详细介绍。

`beforeUpdate` 的执行时机是在渲染 Watcher 的 before 函数中，我们刚才提到过：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...

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
  // ...
}

```

注意这里有个判断，也就是在组件已经 mounted 之后，才会去调用这个钩子函数。
update 的执行时机是在flushSchedulerQueue 函数调用的时候，它的定义在 src/core/observer/scheduler.js 中：

```js
function flushSchedulerQueue () {
  // ...
  // 获取到 updatedQueue
  callUpdatedHooks(updatedQueue)
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```

后续详细讲到具体的响应式更新后再讲解；

#### 3.4.4 beforeDestroy & destroy

`beforeDestroy` 和 `destroyed` 钩子函数的执行时机在组件销毁的阶段，组件的销毁过程之后会详细介绍，最终会调用 `$destroy`方法，它的定义在 `src/core/instance/lifecycle.js `中：

```js
Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }

```

`beforeDestroy` 钩子函数的执行时机是在 `$destroy` 函数执行最开始的地方，接着执行了一系列的销毁动作，包括从 `parent` 的 `$children` 中删掉自身，删除 `watcher`，当前渲染的 VNode 执行销毁钩子函数等，执行完毕后再调用 `destroy` 钩子函数。

在 $destroy 的执行过程中，它又会执行 `vm.__patch__(vm._vnode, null) `触发它子组件的销毁钩子函数，这样一层层的递归调用，所以 destroy 钩子函数执行顺序是先子后父，和 mounted 过程一样。

#### 3.4.5 activated & deactivated

后续讲到`Keep-alive`时详细讲解。

### 3.5 组件注册

在 Vue.js 中，除了它内置的组件如 `keep-alive、``component`、`transition`、`transition-group` 等，其它用户自定义组件在使用前必须注册。很多同学在开发过程中可能会遇到如下报错信息：

```js
'Unknown custom element: <xxx> - did you register the component correctly?
 For recursive components, make sure to provide the "name" option.'
```

一般报这个错的原因都是我们使用了未注册的组件。Vue.js 提供了 2 种组件的注册方式，全局注册和局部注册。接下来我们从源码分析的角度来分析这两种注册方式。

#### 3.5.1 全局注册

要注册一个全局组件，可以使用 `Vue.component(tagName, options)`。例如：

```js
Vue.component('my-component', {
  // 选项
})
```

`Vue.component `的定义过程发生在最开始初始化 Vue 的全局函数的时候，代码在 s`rc/core/global-api/assets.js `中：

```js
import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

函数首先遍历 `ASSET_TYPES`，得到 type 后挂载到 Vue 上 。ASSET_TYPES 的定义在 `src/shared/constants.js` 中：

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

所以实际上 Vue 是初始化了 3 个全局函数，并且如果 type 是 `component` 且 definition 是一个对象的话，通过 `this.opitons._base.extend`， 相当于 `Vue.extend` 把这个对象转换成一个继承于 Vue 的构造函数，最后通过 `this.options[type + 's'][id] = definition` 把它挂载到 `Vue.options.components `上。

由于我们每个组件的创建都是通过 `Vue.extend` 继承而来，我们之前分析过在继承的过程中有这么一段逻辑：

```js
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
```

也就是说它会把 Vue.options 合并到 Sub.options，也就是组件的 options 上， 然后在组件的实例化阶段，会执行 `merge options` 逻辑，把 `Sub.options.components` 合并到 `vm.$options.components` 上。

然后在创建 vnode 的过程中，会执行 _createElement 方法，我们再来回顾一下这部分的逻辑，它的定义在 `src/core/vdom/create-element.js` 中：

```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // ...
  let vnode, ns
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
  // ...
}
```

这里有一个判断逻辑 `isDef(Ctor = resolveAsset(context.$options, 'components', tag))`，先来看一下 `resolveAsset` 的定义，在 `src/core/utils/options.js` 中：

```js
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```

先通过 `const assets = options[type] `拿到 assets，然后再尝试拿 assets[id]，这里有个顺序，先直接使用 id 拿，如果不存在，则把 id 变成驼峰的形式再拿，如果仍然不存在则在驼峰的基础上把首字母再变成大写的形式再拿，如果仍然拿不到则报错。这样说明了我们在使用 `Vue.component(id, definition) `全局注册组件的时候，id 可以是连字符、驼峰或首字母大写的形式。

那么回到我们的调用 `resolveAsset(context.$options, 'components', tag)`，即拿 `vm.$options.components[tag]`，这样我们就可以在 resolveAsset 的时候拿到这个组件的构造函数，并作为 `createComponent` 的钩子的参数。

#### 3.5.2 局部注册

Vue.js 也同样支持局部注册，我们可以在一个组件内部使用 components 选项做组件的局部注册，例如

```js
import HelloWorld from './components/HelloWorld'

export default {
  components: {
    HelloWorld
  }
}
```

在组件的 Vue 的实例化阶段有一个合并 `option` 的逻辑，之前我们也分析过，所以就把 `components` 合并到 `vm.$options.components` 上，这样我们就可以在 `resolveAsset` 的时候拿到这个组件的构造函数，并作为 `createComponent` 的钩子的参数。

注意，局部注册和全局注册不同的是，只有该类型的组件才可以访问局部注册的子组件，而全局注册是扩展到 `Vue.options` 下，所以在所有组件创建的过程中，都会从全局的` Vue.options.components` 扩展到当前组件的 `vm.$options.components`下，这就是全局注册的组件能被任意使用的原因。

### 3.6 异步组件

在我们平时的开发工作中，为了减少首屏代码体积，往往会把一些非首屏的组件设计成异步组件，按需加载。Vue 也原生支持了异步组件的能力，如下：

```js
Vue.component('async-example', function (resolve, reject) {
   // 这个特殊的 require 语法告诉 webpack
   // 自动将编译后的代码分割成不同的块，
   // 这些块将通过 Ajax 请求自动下载。
   require(['./my-async-component'], resolve)
})
```

我们可以看到，Vue 注册的组件不再是一个对象，而是一个工厂函数，函数有两个参数 resolve 和 reject，函数内部用 setTimout 模拟了异步，实际使用可能是通过动态请求异步组件的 JS 地址，最终通过执行 resolve 方法，它的参数就是我们的异步组件对象。

上一节我们分析了组件的注册逻辑，由于组件的定义并不是一个普通对象，所以不会执行 Vue.extend 的逻辑把它变成一个组件的构造函数，但是它仍然可以执行到 createComponent 函数，我们再来对这个函数做回顾，它的定义在 `src/core/vdom/create-component/js` 中：

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
  
  // ...

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }
}
```

由于我们这个时候传入的 Ctor 是一个函数，那么它也并不会执行 Vue.extend 逻辑，因此它的 cid 是 undefiend，进入了异步组件创建的逻辑。这里首先执行了 Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context) 方法，它的定义在 `src/core/vdom/helpers/resolve-async-component.js` 中

```js
export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>,
  context: Component
): Class<Component> | void {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context)
  } else {
    const contexts = factory.contexts = [context]
    let sync = true

    const forceRender = () => {
      for (let i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate()
      }
    }

    const resolve = once((res: Object | Class<Component>) => {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor)
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender()
      }
    })

    const reject = once(reason => {
      process.env.NODE_ENV !== 'production' && warn(
        `Failed to resolve async component: ${String(factory)}` +
        (reason ? `\nReason: ${reason}` : '')
      )
      if (isDef(factory.errorComp)) {
        factory.error = true
        forceRender()
      }
    })

    const res = factory(resolve, reject)

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject)
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject)

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor)
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor)
          if (res.delay === 0) {
            factory.loading = true
          } else {
            setTimeout(() => {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true
                forceRender()
              }
            }, res.delay || 200)
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(() => {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? `timeout (${res.timeout}ms)`
                  : null
              )
            }
          }, res.timeout)
        }
      }
    }

    sync = false
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}
```

这里面核心处理了三种异步组件的创建方法，除了上述例子，还有两种

```js
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)

const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})
Vue.component('async-example', AsyncComp)
```

接下来依次分析

#### 3.6.1 普通的一步组件

针对普通函数的情况，前面几个 if 判断可以忽略，它们是为高级组件所用，进入实际加载逻辑，定义了 forceRender、resolve 和 reject 函数，注意 resolve 和 reject 函数用 once 函数做了一层包装，它的定义在 src/shared/util.js 中：

```js
/**
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
```

once 逻辑非常简单，传入一个函数，并返回一个新函数，它非常巧妙地利用闭包和一个标志位保证了它包装的函数只会执行一次，也就是确保 `resolve` 和 `reject` 函数只执行一次。

接下来执行 `const res = factory(resolve, reject) `逻辑，这块儿就是执行我们组件的工厂函数，同时把 `resolve` 和 `reject` 函数作为参数传入，组件的工厂函数通常会先发送请求去加载我们的异步组件的 JS 文件，拿到组件定义的对象 res 后，执行 resolve(res) 逻辑，它会先执行 `factory.resolved = ensureCtor(res, baseCtor)`

```js
function ensureCtor (comp: any, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}
```

这个函数目的是为了保证能找到异步组件 JS 定义的组件对象，并且如果它是一个普通对象，则调用 Vue.extend 把它转换成一个组件的构造函数。
resolve 逻辑最后判断了 sync，显然我们这个场景下 sync 为 false，那么就会执行 forceRender 函数，它会遍历 factory.contexts，拿到每一个调用异步组件的实例 vm, 执行 vm.$forceUpdate()方法，它的定义在 src/core/instance/lifecycle.js 中：

```js
  Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }
```

`$forceUpdate` 调用渲染 watcher 的 update 方法，让渲染 watcher 对应的回调函数执行，也就是触发了组件的重新渲染。之所以这么做是因为 Vue 通常是数据驱动视图重新渲染，但是在整个异步组件加载过程中是没有数据发生变化的，所以通过执行 $forceUpdate 可以强制组件重新渲染一次。

#### 3.6.2 promise异步组件

```js
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

webpack 2+ 支持了异步加载的语法糖：`() => import('./my-async-component')`，当执行完 `res = factory(resolve, reject)`，返回的值就是 import('./my-async-component') 的返回值，它是一个 Promise 对象。接着进入 if 条件，又判断了 `typeof res.then === 'function')`，条件满足，执行：

```js
if (isUndef(factory.resolved)) {
  res.then(resolve, reject)
}
```

当组件异步加载成功后，执行 `resolve`，加载失败则执行 `reject`，这样就非常巧妙地实现了配合 webpack 2+ 的异步加载组件的方式（Promise）加载异步组件。

#### 3.6.3 高级异步组件

由于异步加载组件需要动态加载 JS，有一定网络延时，而且有加载失败的情况，所以通常我们在开发异步组件相关逻辑的时候需要设计 loading 组件和 error 组件，并在适当的时机渲染它们。Vue.js 2.3+ 支持了一种高级异步组件的方式，它通过一个简单的对象配置，帮你搞定 loading 组件和 error 组件的渲染时机，你完全不用关心细节，非常方便。接下来我们就从源码的角度来分析高级异步组件是怎么实现的。

```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})
Vue.component('async-example', AsyncComp)
```

高级异步组件的初始化逻辑和普通异步组件一样，也是执行 resolveAsyncComponent，当执行完 res = factory(resolve, reject)，返回值就是定义的组件对象，显然满足 else if (isDef(res.component) && typeof res.component.then === 'function') 的逻辑，接着执行 res.component.then(resolve, reject)，当异步组件加载成功后，执行 resolve，失败执行 reject。
因为异步组件加载是一个异步过程，它接着又同步执行了如下逻辑：

```js
if (isDef(res.error)) {
  factory.errorComp = ensureCtor(res.error, baseCtor)
}

if (isDef(res.loading)) {
  factory.loadingComp = ensureCtor(res.loading, baseCtor)
  if (res.delay === 0) {
    factory.loading = true
  } else {
    setTimeout(() => {
      if (isUndef(factory.resolved) && isUndef(factory.error)) {
        factory.loading = true
        forceRender()
      }
    }, res.delay || 200)
  }
}

if (isDef(res.timeout)) {
  setTimeout(() => {
    if (isUndef(factory.resolved)) {
      reject(
        process.env.NODE_ENV !== 'production'
        ? `timeout (${res.timeout}ms)`
        : null
      )
    }
  }, res.timeout)
}
```

先判断res.error 是否定义了 error 组件，如果有的话则赋值给 factory.errorComp。 接着判断 res.loading 是否定义了 loading 组件，如果有的话则赋值给 factory.loadingComp，如果设置了 res.delay 且为 0，则设置 factory.loading = true，否则延时 delay 的时间执行

```js
if (isUndef(factory.resolved) && isUndef(factory.error)) {
    factory.loading = true
    forceRender()
}
```

最后判断 res.timeout，如果配置了该项，则在 res.timout 时间后，如果组件没有成功加载，执行 reject。
在 resolveAsyncComponent 的最后有一段逻辑：

```js
sync = false
return factory.loading
  ? factory.loadingComp
  : factory.resolved
```

如果 delay 配置为 0，则这次直接渲染 loading 组件，否则则延时 delay 执行 forceRender，那么又会再一次执行到 `resolveAsyncComponent`。

那么这时候我们有几种情况，按逻辑的执行顺序，对不同的情况做判断：

##### 3.6.3.1 异步组件加载失败

当异步组件加载失败，会执行reject函数：

```js
const reject = once(reason => {
  process.env.NODE_ENV !== 'production' && warn(
    `Failed to resolve async component: ${String(factory)}` +
    (reason ? `\nReason: ${reason}` : '')
  )
  if (isDef(factory.errorComp)) {
    factory.error = true
    forceRender()
  }
})
```

这个时候会把 factory.error 设置为 true，同时执行 `forceRender()`再次执行到 `resolveAsyncComponent`：

```js
if (isTrue(factory.error) && isDef(factory.errorComp)) {
  return factory.errorComp
}
```

那么这个时候就返回 `factory.errorComp`，直接渲染 `error` 组件。

##### 3.6.3.2 异步组件加载成功

当异步组件加载成功，会执行resolve函数

```js
const resolve = once((res: Object | Class<Component>) => {
  factory.resolved = ensureCtor(res, baseCtor)
  if (!sync) {
    forceRender()
  }
})
```

首先把加载结果缓存到 `factory.resolved`中，这个时候因为 sync 已经为 false，则执行 `forceRender()`再次执行到 `resolveAsyncComponent`：

```js
if (isDef(factory.resolved)) {
  return factory.resolved
}
```

那么这个时候直接返回 factory.resolved,渲染成功加载的组件

##### 3.6.3.3 异步组件加载中

如果异步组件加载中并未返回，这时候会走到这个逻辑：

```js
if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
  return factory.loadingComp
}
```

那么则会返回 `factory.loadingComp`，渲染 `loading` 组件。

##### 3.6.3.4 异步组件加载超时

如果超时，则走到了 `reject` 逻辑，之后逻辑和加载失败一样，渲染 error 组件。

#### 3.6.4 异步组件patch

回到createComponent的逻辑：

```js
Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
if (Ctor === undefined) {
  return createAsyncPlaceholder(
    asyncFactory,
    data,
    context,
    children,
    tag
  )
}
```

如果是第一次执行 resolveAsyncComponent，除非使用高级异步组件 0 delay 去创建了一个 loading 组件，否则返回是 undefiend，接着通过 createAsyncPlaceholder 创建一个注释节点作为占位符。它的定义在 src/core/vdom/helpers/resolve-async-components.js中：

```js
export function createAsyncPlaceholder (
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}
```

实际上就是就是创建了一个占位的注释 `VNode`，同时把 `asyncFactory` 和 `asyncMeta` 赋值给当前 `vnode`。

当执行 `forceRender` 的时候，会触发组件的重新渲染，那么会再一次执行 `resolveAsyncComponent`，这时候就会根据不同的情况，可能返回 loading、error 或成功加载的异步组件，返回值不为 undefined，因此就走正常的组件 render、patch 过程。

#### 3.6.5 总结

通过上面部分，我们知道了 3 种异步组件的实现方式，它实现了 `loading`、`resolve`、`reject`、`timeout` 4 种状态。异步组件实现的本质是 2 次渲染，除了 `0 delay` 的高级异步组件第一次直接渲染成 `loading` 组件外，其它都是第一次渲染生成一个注释节点，当异步获取组件成功后，再通过 `forceRender` 强制重新渲染，这样就能正确渲染出我们异步加载的组件了。

# vue3新特性&源码解析（1/3）

Object.defineProperty重新定义getter和setter，为什么换proxy代理

1.对于数组长度变化

2.在对象上增删元素的操作

3.数组方法push, pop,unshift,shift

4.想支持响应式的属性$set

https://www.yuque.com/lpldplws/web/gdw840?singleDoc# 《Vue3新特性&源码解析（1/3）》 密码：mmo8

## 1.课程目标

对比Vue2，对Vue3的新特性进行学习，掌握Vue3的关键技术点，以及能够使用vue3实现组件的开发；

## 2. 课程大纲

- vue3和vue2响应式原理的对比
- vue3新特性

## 3.vue2和vue3的对比

### 3.1 响应式原理

Object.defineProperty VS Proxy

我们知道，Vue2的响应式原理是基于Object.defineProperty的方法重新定义对象的getter和setter，而Vue3是基于Proxy代理对象，拦截对象属性的访问与赋值过程。差异在于，前者并不能对诸如数组长度变化、增删元素操作已经对对象新增属性进行感知，而在Vue层面也不得不重新一些数组方法（push、pop、unshift、shift等），动态的添加响应式属性，也要使用$set方法。而Proxy则完美的解决了这些问题，不过对于不支持Proxy对象的浏览器（诸如IE，虽然已经退出历史舞台，但目前占比还是很大），如果要使用Vue3，还需要降级兼容。

- 通过Object.defineProperty中的get与set属性实现响应式

  ```js
  // 假设我们在data函数中返回的数据为initData
  const initData = { value: 1 };
  
  // 基于initData创建响应式的代理对象data
  const data = {};
  
  Object.keys(initData).forEach(key => {
    Object.defineProperty(data, key, {
      get() {
        // 此处依赖收集
        console.log('访问了', key);
        return initData[key];
      },
      set(v) {
        // 此处进行了回调更新
        console.log('修改了', key);
        initData[key] = v;
      }
    });
  });
  
  // data.value
  // 访问了value
  // 1
  // data.value = 2
  // 修改了value
  // 2
  // data
  // {} 因为只是代理，不会对data进行设置
  // initData.value2 = 2
  // 2
  // data.value2
  // undefined 未在初始时设置，无法进行依赖收集
  ```

从上述代码可以看出，initData动态添加的属性，并不能被观测到，这也是Vue.set存在的原因；

Q：Vue.set是如何实现的

A：

set 方法主要作用是向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，对象不能是 Vue 实例，或者 Vue 实例的根数据对象

Vue.set( target, key, value ) / this.$set( target, key, value )

- target：要更改的数据源(可以是对象或者数组)
- key：要更改的具体数据，或者新增的属性名
- value ：重新赋的值

set 方法会对参数中的 target 进行类型判断

1. 如果是 undefined 、null 、基本数据类型，直接报错；
2. 如果为数组，取当前数组长度与 key 这两者的最大值作为数组的新长度，然后使用数组的 splice 方法将传入的索引 key 对应的 val 值添加进数组。target 在 observe 的时候，原型链被修改了， splice 方法也已经被重写了，触发之后会再次遍历数组，进行数据劫持，也就是说当使用 splice 方法向数组内添加元素时，该元素会自动被变成响应式的；
3. 如果为对象，会先判断 key 值是否存在于对象中，如果在，则直接替换 value。如果不在，就判断 target 是不是响应式对象（其实就是判断它是否有 __ob__ 属性），接着判断如果它是不是 Vue 实例，或者是 Vue 实例的根数据对象，如果是则抛出警告并退出程序。如果 target 不是响应式对象，就直接给 target 的 key 赋值，如果 target 是响应式对象，就调用 defineReactive 将新属性的值添加到 target 上，并进行依赖收集，更新视图更新；

```js
// example:
this.$set(data, a, 1);

// 源码
function set(target: Array<any> | Object, key: any, val: any): any {
  // isUndef 是判断 target 是不是等于 undefined 或者 null 。
  // isPrimitive 是判断 target 的数据类型是不是 string、number、symbol、boolean 中的一种
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }

  // 数组的处理
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  // 对象，并且该属性原来已存在于对象中，则直接更新
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  // vue给响应式对象(比如 data 里定义的对象)都加了一个 __ob__ 属性，
  // 如果一个对象有这个 __ob__ 属性，那么就说明这个对象是响应式对象，修改对象已有属性的时候就会触发页面渲染
  // 非 data 里定义的就不是响应式对象。
  const ob = (target: any).__ob__

  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }

  // 不是响应式对象
  if (!ob) {
    target[key] = val
    return val
  }

  // 是响应式对象，进行依赖收集
  defineReactive(ob.value, key, val)

  // 触发更新视图
  ob.dep.notify()
  return val
}
```

主要根据ob.dep.notify()，这个里面放着订阅者模式里面的订阅者，通过notify来通知订阅者做处理

- Proxy 可以观测到动态添加的属性的变化，以此实现响应式；

  课上不做过多介绍，详情见MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程；

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”；

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
var proxy = new Proxy(target, handler);
```

Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

Example：

1. get：用来初始化对象或获取值时，设置自定义前置检测

   ```js
   var proxy = new Proxy({}, {
     get: function(target, propKey) {
       return 35;
     }
   });
   
   let obj = Object.create(proxy);
   obj.time // 35
   
   var person = {
     name: "张三"
   };
   
   var proxy = new Proxy(person, {
     get: function(target, propKey) {
       if (propKey in target) {
         return target[propKey];
       } else {
         throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
       }
     }
   });
   
   proxy.name // "张三"
   proxy.age // Uncaught ReferenceError: Prop name "age" does not exist.
   ```

2. Set：设置值时逻辑校验

   ```js
   let validator = {
     set: function(obj, prop, value) {
       if (prop === 'age') {
         if (!Number.isInteger(value)) {
           throw new TypeError('The age is not an integer');
         }
         if (value > 200) {
           throw new RangeError('The age seems invalid');
         }
       }
   
       // 对于满足条件的 age 属性以及其他属性，直接保存
       obj[prop] = value;
       return true;
     }
   };
   
   let person = new Proxy({}, validator);
   
   person.age = 100;
   
   person.age // 100
   person.age = 'young' // 报错
   person.age = 300 // 报错
   
   ```

   ```js
   const initData = { value: 1 };
   
   const proxy = new Proxy(initData, {
     get: function (target, key, receiver) {
       // 此处进行依赖收集
       console.log('访问了', key);
       return Reflect.get(target, key, receiver);
     },
     set: function (target, key, value, receiver) {
       // 此处执行回调更新
       console.log('修改了', key);
       return Reflect.set(target, key, value, receiver);
     }
   });
   
   // proxy.value
   // 访问了value
   // 1
   // proxy.value = 2
   // 修改了value
   // 2
   // proxy.value2 = 2
   // 修改了value2
   // 2
   // initData.value3 = 3
   // proxy.value3
   // 访问了value3
   // 3
   ```

### 3.2 vue3新特性

准备工作：安装vue3

```js
$ npm init vite-app <project-name>
$ cd <project name>
$ npm i -S
$ npm run dev

或者

$ yarn create vite-app <project-name>
$ cd <project name>
$ yarn
$ yarn dev
```

- 可以声明在入口文件内声明多个实例，实例间错误隔离，若没有阻断性错误，不会影响其他实例；
- 更好的支持单测；
- 支持不同人员并行开发；

```js
// Vue2
// 所有数据定义在data中，方法定义在methods中的，并且使用this来调用对应的数据和方法
new Vue({
});

// Vue3
createApp(App).mount('#app);
createApp(MyApp).mount('#app);
```

#### 3.2.1 Composition API

先来看个vue2的例子：

```js
<template>
  <div class="homePage">
    <p>count: {{ count }}</p>   
    <p>倍数： {{ multiple }}</p>        
    <div>
      <button style="margin-right: 10px" @click="increase">加1</button>
      <button @click="decrease">减一</button>    
    </div>      
  </div>
</template>
<script>
export default {
  data() {
    return { count: 0 };
  },
  computed: {
    multiple() {
      return 2 * this.count;
    },
  },
  methods: {
    increase() {
      this.count++;
    },
    decrease() {
      this.count--;
    },
  },
};
</script>
```

针对count的加减以及显示倍数， 就需要分别在 data、methods、computed 中进行操作，一个小的需求经常会导致在data、methods、computed中进行操作，随着业务复杂程度提升，其中内容会随之增加；

在vue2.x 版本给出的解决方案就是 Mixin, 但是使用 Mixin 也会遇到让人苦恼的问题：

1. 命名冲突问题；
2. 不清楚暴露出来的变量的作用；
3. 逻辑重用到其他 component 经常遇到问题；

 在Vue3.x 就推出了Composition API主要就是为了解决上面的问题，将零散分布的逻辑组合在一起来维护，并且还可以将单独的功能逻辑拆分成单独的文件。

##### 3.2.1.1 setup

setup() 函数是 vue3 中，专门为组件提供的新属性。它为我们使用 vue3 的 Composition API 新特性提供了统一的入口, setup 函数会在 beforeCreate 、created 之前执行, vue3也是取消了这两个钩子，统一用setup代替, 该函数相当于一个生命周期函数，vue中过去的data，methods，watch等全部都用对应的新增api写在setup()函数中

```js
setup(props, context) {
  // Attribute (非响应式对象，等同于 $attrs)
  context.attrs
  // 插槽 (非响应式对象，等同于 $slots)
  context.slots
  // 触发事件 (方法，等同于 $emit)
  context.emit
  // 暴露公共 property (函数)
  context.expose
    
  return {}
}

// example
<!-- MyBook.vue -->
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    props: {
      collectionName: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // 暴露给 template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

- props: 用来接收 props 数据, props 是响应式的，当传入新的 props 时，它将被更新；
- context 用来定义上下文, 上下文对象中包含了一些有用的属性，这些属性在 vue 2.x 中需要通过 this 才能访问到, 在 setup() 函数中无法访问到 this，是个 undefined；
- context 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 context 使用 ES6 解构；
- 返回值: return {}, 返回响应式数据, 模版中需要使用的函数；

注意： 因为 props 是响应式的， 你不能使用 ES6 解构，它会消除 prop 的响应性

```js
<script>
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup(props, context) {
  
    const { title } = toRefs(props)
    
    console.log(title.value)
    
    return {}
  }
});
</script>
```

如果 title 是可选的 prop，则传入的 props 中可能没有 title 。在这种情况下，toRefs 将不会为 title 创建一个 ref 。你需要使用 toRef 替代它:

```js
<script lang="ts">
import { defineComponent, reactive, toRef, toRefs } from 'vue';
export default defineComponent({
  setup(props, context) {
  
    const { title } = toRef(props, 'title')
    
    console.log(title.value)
    
    return {}
  }
});
</script>
```

##### 3.2.1.2 reactive(),shallowReactive()

- reactive()

函数接收一个普通对象，返回一个响应式的数据对象, 相当于 Vue 2.x 中的 Vue.observable() API，响应式转换是“深层”的——它影响所有嵌套属性。基于proxy来实现，想要使用创建的响应式数据也很简单，创建出来之后，在setup中return出去，直接在template中调用即可；

```js
setup() {
  const person = {
    name: 'xianzao',
    age: 1,
    contacts: {
      phone: 123456789,
    },
  };

  const personReactive = reactive(person);

  // 查看 reactive 实例结构
  console.log('reactive', personReactive);

  // 获取嵌套对象属性
  const contacts = personReactive.contacts;
  // 因为深层响应，所以依然有响应性
  console.log('contacts属性：', contacts);

  // 获取简单类型的属性
  let name = toRef(personReactive.name);

  // name属性是简单类型的，所以失去响应性，如果需要响应式，需要使用toRef(name)
  console.log('name属性：', name);
},
```

- shallowReactive()：创建一个响应式代理，它跟踪其自身属性的响应性shallowReactive生成非递归响应数据，只监听第一层数据的变化，但不执行嵌套对象的深层响应式转换 (暴露原始值)；

  ```js
  const personShallowReactive = shallowReactive(person);
  // 查看 reactive 实例结构
  console.log('shallow reactive', personShallowReactive);
  
  // 获取嵌套对象属性
  const shallowContacts = personShallowReactive.contacts;
  // 因为深层响应，所以依然有响应性
  console.log('shallow contacts属性：', shallowContacts);
  
  // 获取简单类型的属性
  let shallowName = personShallowReactive.name;
  
  // name属性是简单类型的，所以失去响应性，如果需要响应式，需要使用toRef(name)
  console.log('shallow name属性：', shallowName);
  ```

##### 3.2.1.3 ref(),isRef(),toRefs()

- ref() 函数用来根据给定的值创建一个响应式的数据对象，ref() 函数调用的返回值是一个对象，这个对象上只包含一个 value 属性, 只在setup函数内部访问ref函数需要加.value，其用途创建独立的原始值；

```js
<template>
    <div class="mine">
        {{count}} // 10
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const count = ref<number>(10)
    // 在js 中获取ref 中定义的值, 需要通过value属性
    console.log(count.value);
    return {
       count
    }
   }
});
</script>
```

在reactive对象中访问ref创建的响应式数据

```js
<template>
    <div class="mine">
        {{count}} -{{t}} // 10 -100
    </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const count = ref<number>(10)
    const obj = reactive({
      t: 100,
      count
    })
   
    // 通过reactive 来获取ref 的值时,不需要使用.value属性， ref 将被自动解包
    console.log(obj.count); // 10
    console.log(obj.count === count.value); // true
    
    // count 改变时，更新 `obj.count
    count.value = 12
    console.log(count.value) // 12
    console.log(obj.count) // 12
    
    // 反之，修改obj 的count 值 ，ref 也会更新
   obj.count = 20
   console.log(obj.count) // 20
   console.log(count.value) // 20
    
    return {
       ...toRefs(obj)
    }
   }
});
</script>
```

reactive 将解包所有深层的 refs，同时维持 ref 的响应性。当将 ref分配给 reactive property 时，ref 将被自动解包

- isRef()

  用来判断某个值是否为 ref() 创建出来的对象

```js
const count = ref(10);
const user = 'xianzao';

// 判断是否为ref创建出来的
console.log('user is ref? ', isRef(user));
console.log('count is ref? ', isRef(count));
```

- toRefs()

  将 reactive() 创建出来的响应式对象，转换为普通的对象，只不过，这个对象上的每个属性节点，都是 ref() 类型的响应式数据

##### 3.2.1.4 readonly()、isReadonly()、shallowReadonly()

- readonly: 传入ref或 reactive对象,并返回一个原始对象的只读代理,对象内部任何嵌套的属性也都是只读的、 并且是递归只读；
- isReadonly: 检查对象是否是由 readonly 创建的只读对象；

```js
const obj = reactive({
  t: 100,
  count,
});

// 设置obj为readonly
const objOnly = readonly(obj);
console.log('read only obj is: ', objOnly);
// obj.t = 200;
objOnly.t = 200;
console.log('changed obj is: ', obj);
console.log('changed read only obj is: ', objOnly);
console.log('changed obj is read only?: ', isReadonly(obj));
console.log('changed read only obj is read only?: ', isReadonly(objOnly), objOnly.t);
```

Q：如果设置obj.t = 200，那objonly.t是多少？

A：也是200，因为修改的非readonly，设置完readonly后的元素还是reactive的；

- shallowReadonly 作用只处理对象最外层属性的响应式（浅响应式）的只读，但不执行嵌套对象的深度只读转换 (暴露原始值)

```js
// 设置obj为shallowReadOnly
const objShallowOnly = shallowReadonly(obj);
console.log('shallow read only obj is: ', objShallowOnly);
objShallowOnly.t = 200;
objShallowOnly.userInfo.age = 777;
console.log('changed shallow read only obj is:', objShallowOnly);
```

##### 3.2.1.5 computed()、watch()、data

- computed()

  该函数用来创造计算属性，它返回的值是一个ref对象。 里面可以传方法，或者一个对象，对象中包含set()、get()方法；

```js
// 创建只读的计算属性
import { computed, defineComponent, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    const age = ref(18)

    // 根据 age 的值，创建一个响应式的计算属性 readOnlyAge,它会根据依赖的 ref 自动计算并返回一个新的 ref
    const readOnlyAge = computed(() => age.value++) // 19

    return {
      age,
      readOnlyAge
    }
  }
});
</script>

// 通过set()、get()方法创建一个可读可写的计算属性
<script>
import { computed, defineComponent, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    const age = ref<number>(18)

    const computedAge = computed({
      get: () => age.value + 1,
      set: value => age.value + value
    })
    // 为计算属性赋值的操作，会触发 set 函数, 触发 set 函数后，age 的值会被更新
    age.value = 100
    return {
      age,
      computedAge
    }
  }
});
</script>
```

- watch()

  watch 函数用来侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源数据变更时才执行回调；

```js
// 1. 监听reactive声明的数据源
<script>
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';

export default defineComponent({
  setup(props, context) {
    const state = reactive({ name: 'vue', age: 10 })

    watch(
      () => state.age,
      (age, preAge) => {
        console.log(age); // 100
        console.log(preAge); // 10
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值
    state.age = 100
    return {
      ...toRefs(state)
    }
  }
});
</script>

// 2. 监听用ref声明的数据源
<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  setup(props, context) {
    const age = ref(10);

    watch(age, () => console.log(age.value)); // 100
    
    // 修改age 时会触发watch 的回调, 打印变更后的值
    age.value = 100
    return {
      age
    }
  }
});
</script>

// 3. 同时监听多个值
<script>
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';

export default defineComponent({
  setup(props, context) {
    const state = reactive({ name: 'vue', age: 10 })

    watch(
      [() => state.name, () => state.age],
      ([newName, newAge], [oldName, oldAge]) => {
        console.log(newName);
        console.log(newAge);

        console.log(oldName);
        console.log(oldAge);
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值, 此时需要注意, 更改其中一个值, 都会执行watch的回调
    state.age = 100
    state.name = 'vue3'
    return {
      ...toRefs(state)
    }
  }
});
</script>

// 4. stop停止监听
// 在 setup() 函数内创建的 watch 监视，会在当前组件被销毁的时候自动停止。
// 如果想要明确地停止某个监视，可以调用 watch() 函数的返回值即可，语法如下：
<script>
import { set } from 'lodash';
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';

export default defineComponent({
  setup(props, context) {
    const state = reactive({ name: 'vue', age: 10 })

    const stop =  watch(
      [() => state.age, () => state.name],
      ([newName, newAge], [oldName, oldAge]) => {
        console.log(newName);
        console.log(newAge);

        console.log(oldName);
        console.log(oldAge);
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值, 此时需要注意, 更改其中一个值, 都会执行watch的回调
    state.age = 100
    state.name = 'vue3'

    setTimeout(()=> { 
      stop()
      // 此时修改时, 不会触发watch 回调
      state.age = 1000
      state.name = 'vue3-'
    }, 1000) // 1秒之后讲取消watch的监听
    
    return {
      ...toRefs(state)
    }
  }
});
</script>
```

- data

```js
// Vue3中唯一用法
data: {
  return {
    flag: true
  }
}
// Vue2中不推荐使用，但不会报错，但在Vue3中会报错
data: {
  flag: true
}
```

Q：为什么data不能使用一个对象，而是每次都返回一个函数？

A：如果是以对象中的数据返回的话，组件之中会共用同一块内存，在一个组件中修改数据，另一个组件也会受到影响；用函数 return 出去的形式，每次 return 都会alloc新的内存，各个组件中得 data 也就没有任何关系

##### 3.2.1.5 多根节点组件

多根节点允许template标签内直接出现多个子集的标签

类似React包含的<Fragment>，实际不会产生新的标签

#### 3.2.2 生命周期

详情参考官网：https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforecreate

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue3lifecycle.svg" alt="vue3lifecycle" style="zoom:50%;" />

新版的生命周期函数，可以按需导入到组件中，且只能在 setup() 函数中使用, 但是也可以在setup 外定义, 在 setup 中使用；

setup 是围绕 `beforeCreate `和 `created `生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 setup 函数中编写

https://www.yuque.com/lpldplws/web/gdw840?inner=GKD3b

| 选项式 API      | Hook inside setup |
| --------------- | ----------------- |
| beforeCreate    | Not needed*       |
| created         | Not needed*       |
| beforeMount     | onBeforeMount     |
| mounted         | onMounted         |
| beforeUpdate    | onBeforeUpdate    |
| updated         | onUpdated         |
| beforeUnmount   | onBeforeUnmount   |
| unmounted       | onUnmounted       |
| errorCaptured   | onErrorCaptured   |
| renderTracked   | onRenderTracked   |
| renderTriggered | onRenderTriggered |
| activated       | onActivated       |
| deactivated     | onDeactivated     |

注意，若要在setup中引入，需要在vue中引入对应hook

```js
import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
```

下面按照页面的生命周期进行说明：

##### 3.2.2.1 页面初始化

涉及钩子：`beforeCreate`、`created`、`beforeMount`、`renderTracked`、`mounted`；

```js
// 此时data还不可用
beforeCreate() {
  console.log('beforeCreate');
},

// data可用，DOM不可用
created() {
  console.log('created');
},
  
// 在这个钩子后，mounted生命周期钩子之前，render函数（渲染页面函数）首次被调用
beforeMount() {
  console.log('beforeMount');
},

// 页面有取值操作时（如：绑定数据，e.g. 插值语法{{ count }}）触发
renderTracked({ type, key, target, effect }) {
  console.log('renderTracked ----', { type, key, target, effect });
},

// 页面挂载完毕后触发
mounted() {
  console.log('mounted');
},
  
// 输出
beforeCreate
created
beforeMount
renderTracked ---- {type: "get", key: "count", target: {...}, effect: f}
mounted
```

Vue3.x新增生命周期renderTracked说明

官方解释：跟踪虚拟DOM重新渲染时调用（初始化渲染时也会调用）。钩子接收`debugger event`作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。

简单理解来说就是：页面上绑定了响应式数据（取值），就会触发该操作。

```js
methods: {
  addCount() {
    this.count += 1;
  },
},
```

debugger event说明

- type：操作类型，有get，has，iterate，也就是取值操作；
- key：键，简单理解就是操作数据的key，e.g.上文使用的count；
- target：响应式对象，如：data、ref、computed；
- effect：数据类型为Function，effect方法的作用是重新render视图；

##### 3.2.2.2 数据发生变化后触发

涉及钩子：renderTriggered、beforeUpdate、renderTracked、updated

```js
// 2. 数据发生改变后触发
	renderTriggered(e) {
		console.log('renderTriggered ----', e);
	},

	/*---------
  在数据发生改变后，DOM被更新之前调用。
  ----------*/
	beforeUpdate() {
		console.log('beforeUpdate');
	},

	/*---------
  DOM更新完毕之后调用。
  注意事项：updated不会保证所有子组件也都被重新渲染完毕
  ---------*/
	updated() {
		console.log('updated');
	},
    
// 输出
renderTriggered ---- {target: {...}, key: "count", type: "set", newValue: 2, effect: f, oldTarget: undefined, oldValue: 1}
beforeUpdate
update
```

Vue3.x新增生命周期renderTriggered说明

官方解释：当虚拟DOM重新渲染被触发时调用。接收debugger event作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。

简单理解：做了某件事，从而引发了页面的重新渲染。

`debugger event`说明

- type：操作类型，有set、add、clear、delete，也就是修改操作；
- key：键，简单理解就是操作数据的key。e.g.上文使用的count；
- target：响应式对象，如：data、ref、computed；
- effect：数据类型为Function。英文单词意思为唤起、执行的意思。effect方法的作用是重新render视图；
- newValue：新值；
- oldValue：旧值；
- oldTarget：旧的响应式对象；

##### 3.2.2.3 组件被卸载时触发

涉及钩子：beforeUnmount、unmounted

```js
beforeUnmount() {
  console.log("beforeUnmount");
},

// 卸载组件实例后调用。
unmounted() {
  console.log("unmounted");
}
```

##### 3.2.2.4 捕获错误时触发

涉及钩子：`errorCaptured`

错误传播规则

- 默认情况下，如果全局的 config.errorHandler 被定义，所有的错误仍会发送它，因此这些错误仍然会向单一的分析服务的地方进行汇报；
- 如果一个组件的继承链或父级链中存在多个 errorCaptured 钩子，则它们将会被相同的错误逐个唤起；
- 如果此 errorCaptured 钩子自身抛出了一个错误，则这个新错误和原本被捕获的错误都会发送给全局的 config.errorHandler；
- 一个 errorCaptured 钩子能够返回 false 以阻止错误继续向上传播。本质上是说“这个错误已经被搞定了且应该被忽略”。它会阻止其它任何会被这个错误唤起的 errorCaptured 钩子和全局的 config.errorHandler；

#### 3.2.3 全局配置

详情参考官网：https://v3.cn.vuejs.org/api/application-config.html#globalproperties
在Vue2中，我们要在全局封装通用的方法，会在入口文件中统一声明：

```js
Vue.prototype.$api = api;
Vue.prototype.$http = http;
```

可以通过在原型上定义它们使其在每个 Vue 的实例中可用，从而达到在Vue实例里使用this.$XXX访问对应方法；但是有的时候它会让其他开发者感到混乱。例如他们可能看到了`this.$http`，会觉得没有见过此功能，或者你打算去搜索如何使用它，但是搜不到结果，因为他们并没有发现这是一个 axios 的别名；

从技术上讲，Vue 2 没有“app”的概念，我们定义的应用只是通过 new Vue() 创建的根 Vue 实例。从同一个 Vue 构造函数创建的每个根实例共享相同的全局配置，因此：

1. 在测试期间，全局配置很容易意外地污染其他测试用例。用户需要仔细地存储原始全局配置；
2. 全局配置使得在同一页面上的多个“应用”在全局配置不同时共享同一个 Vue 副本非常困难；

```js
// 这会影响到所有根实例
Vue.mixin({
  /* ... */
})

const app1 = new Vue({ el: '#app-1' })
const app2 = new Vue({ el: '#app-2' })
```

在Vue3里，通过vue 实例上config来配置,包含Vue应用程序全局配置的对象。您可以在挂载应用程序之前修改下面列出的属性；

```js
const app = Vue.createApp({})

app.config = {...}
```

为组件渲染功能和观察程序期间的未捕获错误分配处理程序。错误和应用程序实例将调用处理程序；

```js
app.config.errorHandler = (err, vm, info) => {}
```

可以在应用程序内的任何组件实例中访问的全局属性，组件的属性将具有优先权。同时，可以在组件用通过 getCurrentInstance() 来获取全局globalProperties 中配置的信息,getCurrentInstance 方法获取当前组件的实例，然后通过 ctx 属性获得当前上下文，这样我们就能在setup中使用router和vuex, 通过这个属性我们就可以操作变量、全局属性、组件属性等等；

```js
const app = Vue.createApp({})

app.config.globalProperties.$http = 'xxxxxxxxs'

setup( ) {
  const { ctx } = getCurrentInstance();
  ctx.$http   
}
```

#### 3.2.4 异步组件

详情参考官网：[https://v3.cn.vuejs.org/guide/migration/suspense.html#%E4%BB%8B%E7%BB%8D](https://v3.cn.vuejs.org/guide/migration/suspense.html#介绍)

Vue3中，异步组件需要使用`defineAsyncComponent`创建

全局注册

```js
// 可以利用返回值的实例去自定义注册异步组件，在哪个应用里生效，在哪个应用里注册
const AsyncComp = defineAsyncComponent(() => import('./components/AsyncComp.vue'));

app.component('async-comp', AsyncComp);
```

局部注册

```js
// main.js
const AsyncComp = defineAsyncComponent(() => import('./components/AsyncComp.vue'));

// app.vue
import AsyncComp from './components/AsyncComp.vue';

{
  components: {'async-comp': AsyncComp}
}
```

异步组件作用：

1. 打包后不会集成在index.js中，会单独进行打包，方便后续操作，可以进行缓存，如多个页面都使用一个相同的组件，可以将打包文件缓存下来；
2. 如果组件包过大，可以使用loading代替显示；

Vue3也支持了Suspense组件

在React V16.6.0中，官方提出了lazy和suspense组件

```js
import React, { Suspense } from 'react';
 
 
const myComponent = React.lazy(() => import('./Component'));
 
 
function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <myComponent />
      </Suspense>
    </div>
  );
}
```

在Vue3中，也实现了类似功能的Suspense：

1. <suspense> 组件有两个插槽。它们都只接收一个直接子节点。default 插槽里的节点会尽可能展示出来。如果不能，则展示 fallback 插槽里的节点；
2. 异步组件不需要作为 <suspense> 的直接子节点。它可以出现在组件树任意深度的位置，且不需要出现在和 <suspense> 自身相同的模板中。只有所有的后代组件都准备就绪，该内容才会被认为解析完毕；

```js
<template>
  <Suspense>
    <template #default>
      <my-component />
    </template>
    <template #fallback>
      Loading ...
    </template>
  </Suspense>
</template>

<script lang='ts'>
 import { defineComponent, defineAsyncComponent } from "vue";
 const MyComponent = defineAsyncComponent(() => import('./Component'));

export default defineComponent({
   components: {
     MyComponent
   },
   setup() {
     return {}
   }
})
 
 
</script>
```

3. 还有一种触发 fallback 的方式是让后代组件从 setup 函数中返回一个 Promise。通常这是通过 async 实现的，而不是显式地返回一个 Promise：

```js
export default {
  async setup() {
    // 在 `setup` 内部使用 `await` 需要非常小心
    const data = await loadData()

    // 它隐性地包裹在一个 Promise 内
    // 因为函数是 `async` 的
    return {
      // ...
    }
  }
}
```

```js
export default {
  async setup() {
    // 在 `setup` 内部使用 `await` 需要非常小心
    const data = await loadData()

    // 它隐性地包裹在一个 Promise 内
    // 因为函数是 `async` 的
    return {
      // ...
    }
  }
}
```

4. 如何通过子组件触发更新&事件更新

如果根结点发生了变化，它会触发 pending 事件。然而，默认情况下，它不会更新 DOM 以展示 fallback 内容。取而代之的是，它会继续展示旧的 DOM，直到新组件准备就绪。这个行为可以通过 timeout prop 进行控制。这个值是一个毫秒数，告诉 <suspense> 组件多久之后展示 fallback。如果这个值是 0 则表示它在 <suspense> 进入等待状态时会立即显示。除了 pending 事件以外，<suspense> 组件还拥有 resolve 和 fallback 事件。resolve 事件会在 default 插槽完成新内容的解析之后被触发。fallback 事件会在 fallback 插槽的内容展示的时候被触发；

#### 3.2.5 自定义指令

详情参考官网：[https://v3.cn.vuejs.org/guide/custom-directive.html#%E7%AE%80%E4%BB%8B](https://v3.cn.vuejs.org/guide/custom-directive.html#简介)

在Vue2里，我们通过以下方式执行

```js
Vue.directive('focus', {
  bind() {},
  inserted(el) {
    el.focus()
  },
  update() {},
  componentUpdated() {},
  unbind() {}
})
```

在Vue3中有所不同，需要在`Vue.createApp({})`中使用

- 参数：

- - {string} name
  - {Function | Object} [definition]

- 返回值：

- - 如果传入 definition 参数，则返回应用实例。
  - 如果不传入 definition 参数，则返回指令定义。

- 用法：注册或检索全局指令。

##### 3.2.5.1 指令支持形式

- 全局指令

  ```js
  const app = Vue.createApp({})
  // 注册一个全局自定义指令 `v-focus`
  app.directive('focus', {
    // 当被绑定的元素挂载到 DOM 中时……
    mounted(el) {
      // 聚焦元素
      el.focus()
    }
  })
  ```

- 局部指令

```js
directives: {
  focus: {
    // 指令的定义
    mounted(el) {
      el.focus()
    }
  }
}

<input v-focus />
```

指令定义对象可以提供如下几个钩子函数 (均为可选)：

- created：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加在普通的 v-on 事件监听器调用前的事件监听器中时，这很有用；
- beforeMount：当指令第一次绑定到元素并且在挂载父组件之前调用；
- mounted：在绑定元素的父组件被挂载后调用；
- beforeUpdate：在更新包含组件的 VNode 之前调用；

- updated：在包含组件的 VNode 及其子组件的 VNode 更新后调用；
- beforeUnmount：在卸载绑定元素的父组件之前调用；
- unmounted：当指令与元素解除绑定且父组件已卸载时，只调用一次；

##### 3.2.5.2 vue3与vue2指令变化

| Vue3          | Vue2             |
| ------------- | ---------------- |
| created       |                  |
| beforeMount   | bind             |
| mounted       | inserted         |
| beforeUpdate  | update           |
| updated       | componentUpdated |
| beforeUnmount |                  |
| unmounted     | unbind           |

##### 3.2.5.3 动态指令参数

```js
// 固定到距离顶部200px位置
<div id="dynamic-arguments-example" class="demo">
  <p>Scroll down the page</p>
  <p v-pin="200">Stick me 200px from the top of the page</p>
</div>

const app = Vue.createApp({})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.value 是我们传递给指令的值——在这里是 200
    el.style.top = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')

// 固定在指定方向上指定位置
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>

const app = Vue.createApp({
  data() {
    return {
      direction: 'right'
    }
  }
})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.arg 是我们传递给指令的参数
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

##### 3.2.5.4 例子

```js
// main.js
app.directive('copy', {
	beforeMount(el, binding) {
		const success = binding.arg;
		el.targetContent = binding.value;

		el.addEventListener('click', () => {
			if (!el.targetContent) return console.warn('没有需要复制的目标内容');
			// 创建textarea标签
			const textarea = document.createElement('textarea');
			// 设置相关属性
			textarea.readOnly = 'readonly';
			textarea.style.position = 'fixed';
			textarea.style.top = '-99999px';
			// 把目标内容赋值给它的value属性
			textarea.value = el.targetContent;
			// 插入到页面
			document.body.appendChild(textarea);
			// 调用onselect()方法
			textarea.select();
			// 把目标内容复制进剪贴板, 该API会返回一个Boolean
			const res = document.execCommand('Copy');
			res && success && console.log('复制成功，剪贴板内容：' + el.targetContent);
			// 移除textarea标签
			document.body.removeChild(textarea);
		});
	},
	updated(el, binding) {
		// 实时更新最新的目标内容
		el.targetContent = binding.value;
	},
	unmounted(el) {
		el.removeEventListener('click', () => {});
	},
});

// App.vue
<button v-copy:[success]="msg">点击复制</button>
```

#### 3.2.6 teleport

详情参考官网：https://v3.cn.vuejs.org/guide/teleport.html

teleport是一种将子节点渲染到存在于父组件以外的 DOM 节点的方案

当处理某些类型的组件（如模式，通知或提示）时，模板HTML的逻辑可能位于与我们希望渲染元素的位置不同的文件中。

很多时候，与我们的Vue应用程序的DOM完全分开处理时，这些元素的管理要容易得多。 所有这些都是因为处理嵌套组件的位置，z-index和样式可能由于处理其所有父对象的范围而变得棘手。

这种情况就是 Teleport 派上用场的地方。 我们可以在逻辑所在的组件中编写模板代码，这意味着我们可以使用组件的数据或 props。 但是，然后完全将其渲染到我们Vue应用程序的范围之外。

举个例子

```js
// Dialog.vue
<template>
	<div class="portals">
		<button @click="showNotification">Trigger Notification!</button>
		<teleport to="#portal">
			<div v-if="isOpen" class="notification">
				This is rendering outside of this child component!
			</div>
		</teleport>
	</div>
</template>

<script>
import { ref } from 'vue';
export default {
	setup() {
		const isOpen = ref(false);

		var closePopup;

		const showNotification = () => {
			isOpen.value = true;

			clearTimeout(closePopup);

			closePopup = setTimeout(() => {
				isOpen.value = false;
			}, 2000);
		};

		return {
			isOpen,
			showNotification,
		};
	},
};
</script>

<style scoped>
.notification {
	font-family: myriad-pro, sans-serif;
	position: fixed;
	bottom: 20px;
	left: 20px;
	width: 300px;
	padding: 30px;
	background-color: #fff;
}
</style>

// index.html
	<div id="portal"></div>
```

Teleport具有一个必填属性- to

to 需要 prop，必须是有效的查询选择器或 HTMLElement (如果在浏览器环境中使用)。指定将在其中移动 <teleport> 内容的目标元素

与React16提出的Portals功能十分类似，都是在指定的DOM节点下添加元素，可以参考各种组件库，基本上dialog等组件在Vue3中的实现都有使用到teleport，在React组件中都有用到Portals；

#### 3.2.7 自定义hooks

Vue3的hooks其实可以参考React的自定义hooks的定义， 在 React 中，在函数组件中保留 state 数据的同时，融入生命周期函数，将组件整体作为一个钩子函数。

当组件复杂时，多个组件中一些重复的逻辑可以被抽象出来。在 Hook 诞生之前，React 和 Vue 都拥有高阶组件的设计模式，在 React 使用到 HOC，在 Vue 2 中使用到 mixin。为什么要舍弃它们而使用 Hook，使用自定义 Hook 又有哪些优点，我们先简单了解一下 HOC 和 mixin ，对比后便知。

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue自定义mixin.png" alt="vue自定义mixin" style="zoom:50%;" />

HOC 的原理是把组件作为参数传入一个函数，加入复用部分后将新的组件作为返回值，使用了装饰器模式。mixin 像是把复用的部分拆解成一个个小零件，某个组件需要时就拼接进去。

在实践中，mixin 有如下缺点：

1. 引入了隐式依赖关系。
2. 不同 mixins 之间可能会有先后顺序甚至代码冲突覆盖的问题
3. mixin 代码会导致滚雪球式的复杂性
4. 多个 mixin 导致合并项不明来源

为了避开这些问题，React 采用 HOC，但它依然存在缺陷：

1. 一个组件的state影响许多组件的props
2. 造成地狱嵌套

不过使用全新的 Hook 组件结构，可以实现平铺式调用组件的复用部分，解决了 mixin 的来源不明和 HOC 的地狱嵌套问题。

##### 3.2.7.1 例子

在点击页面时，记录鼠标的位置

```js
// src/hooks/useMousePosition.ts
import { ref, onMounted, onUnmounted, Ref } from 'vue'

function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const updateMouse = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    document.addEventListener('click', updateMouse)
  })

  onUnmounted(() => {
    document.removeEventListener('click', updateMouse)
  })

  return { x, y }
}

export default useMousePosition
```

#### 3.2.8. Provide/Inject

当我们需要从父组件向子组件传递数据时，可以使用 props。想象一下这样的结构：但对于一些深度嵌套的组件，如果仍然将 prop 沿着组件链逐级传递下去，会很麻烦。对于这种情况，我们可以使用一对 `provide `和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 provide 选项来提供数据，子组件有一个 inject 选项来开始使用这些数据。

##### 3.2.8.1 基础使用

```js
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  provide: {
    provideData: { name: "先早" },
  }
});
</script>

// 子组件
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    {{ provideData }}
  </div>
</template>

<script>
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  inject: ["provideData"],
});
</script>
```

##### 3.2.8.2. setup()中使用

在 setup() 中使用, 则需要从 vue 显式导入provide、inject方法。导入以后，我们就可以调用它来定义暴露给我们的组件方式。

provide 函数允许你通过两个参数定义属性：

- name：参数名称
- value：属性的值

```js
// 父组件
<script>
import { provide } from "vue";
import HelloWorldVue from "./components/HelloWorld.vue";
export default defineComponent({
  name: "App",
  components: {
    HelloWorld: HelloWorldVue,
  },
  setup() {
    provide("provideData", {
      name: "先早",
    });
  },
});
</script>

// 子组件
<script>
import { provide, inject } from "vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const provideData = inject("provideData");
    
    console.log(provideData); //  { name: "先早"  }

    return {
      provideData,
    };
  },
});
</script>
```

##### 3.2.8.3 传递响应数据

在 `provide `值时使用 `ref `或 `reactive`

```js
<script>
import { provide, reactive, ref } from "vue";
import HelloWorldVue from "./components/HelloWorld.vue";
export default defineComponent({
  name: "App",
  components: {
    HelloWorld: HelloWorldVue,
  },
  setup() {
    const age = ref(18);

    provide("provideData", {
      age,
      data: reactive({ name: "先早" }),
    });
  },
});
</script>


<script lang="ts">
import { inject } from "vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const provideData = inject("provideData");

    console.log(provideData);

    return {
      provideData,
    };
  },
});
</script>
```

### 3.3 一个完整的Vue3组件模板

```js
<template>
  <div class="mine" ref="elmRefs">
    <span>{{name}}</span>
    <br>
    <span>{{count}}</span>
    <div>
      <button @click="handleClick">测试按钮</button>
    </div>

    <ul>
      <li v-for="item in list" :key="item.id">{{item.name}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, PropType, reactive, ref, toRefs } from 'vue';

interface IState {
  count: number
  name: string
  list: Array<object>
}

export default defineComponent({
  name: 'demo',
  // 父组件传子组件参数
  props: {
    name: {
      type: String as PropType<null | ''>,
      default: 'vue3.x'
    },
    list: {
      type: Array as PropType<object[]>,
      default: () => []
    }
  },
  components: {
    /// TODO 组件注册
  },
  emits: ["emits-name"], // 为了提示作用
  setup (props, context) {
    console.log(props.name)
    console.log(props.list)
    
    
    const state = reactive<IState>({
      name: 'vue 3.0 组件',
      count: 0,
      list: [
        {
          name: 'vue',
          id: 1
        },
        {
          name: 'vuex',
          id: 2
        }
      ]
    })

    const a = computed(() => state.name)

    onMounted(() => {

    })

    function handleClick () {
      state.count ++
      // 调用父组件的方法
      context.emit('emits-name', state.count)
    }
  
    return {
      ...toRefs(state),
      handleClick
    }
  }
});
</script>
```

# vue3新特性&源码解析（2/3）

https://www.yuque.com/lpldplws/web/gmptis?singleDoc# 《Vue3新特性&源码解析（2/3）》 密码：qke4

## 1.课程目标

深入理解Vue3核心源码，通过精简的核心源码，更好的去掌握Vue3具体执行逻辑；

## 2.课程大纲

1. Vue3模块源码解析；
2. Vue3执行逻辑解析；

## 3. vue3模块源码解析

课程代码已经发给班班，可以咨询班班，课程代码目录结构同官方目录结构一致，可以先看懂课程上的简版代码（主要添加注释及去除环境变量等），再深入官方源码进行学习；

官方地址：https://github.com/vuejs/core/tree/main/packages

基本核心模块目录结构如下：

```js
├─compiler-core
│  │  package.json
│  │
│  ├─src
│  │  │  ast.ts
│  │  │  codegen.ts
│  │  │  compile.ts
│  │  │  index.ts
│  │  │  parse.ts
│  │  │  runtimeHelpers.ts
│  │  │  transform.ts
│  │  │  utils.ts
│  │  │
│  │  └─transforms
│  │          transformElement.ts
│  │          transformExpression.ts
│  │          transformText.ts
│  │
│  └─__tests__
│      │  codegen.spec.ts
│      │  parse.spec.ts
│      │  transform.spec.ts
│      │
│      └─__snapshots__
│              codegen.spec.ts.snap
│
├─reactivity
│  │  package.json
│  │
│  ├─src
│  │      baseHandlers.ts
│  │      computed.ts
│  │      dep.ts
│  │      effect.ts
│  │      index.ts
│  │      reactive.ts
│  │      ref.ts
│  │
│  └─__tests__
│          computed.spec.ts
│          dep.spec.ts
│          effect.spec.ts
│          reactive.spec.ts
│          readonly.spec.ts
│          ref.spec.ts
│          shallowReadonly.spec.ts
│
├─runtime-core
│  │  package.json
│  │
│  ├─src
│  │  │  .pnpm-debug.log
│  │  │  apiInject.ts
│  │  │  apiWatch.ts
│  │  │  component.ts
│  │  │  componentEmits.ts
│  │  │  componentProps.ts
│  │  │  componentPublicInstance.ts
│  │  │  componentRenderUtils.ts
│  │  │  componentSlots.ts
│  │  │  createApp.ts
│  │  │  h.ts
│  │  │  index.ts
│  │  │  renderer.ts
│  │  │  scheduler.ts
│  │  │  vnode.ts
│  │  │
│  │  └─helpers
│  │          renderSlot.ts
│  │
│  └─__tests__
│          apiWatch.spec.ts
│          componentEmits.spec.ts
│          rendererComponent.spec.ts
│          rendererElement.spec.ts
│
├─runtime-dom
│  │  package.json
│  │
│  └─src
│          index.ts
│
├─runtime-test
│  └─src
│          index.ts
│          nodeOps.ts
│          patchProp.ts
│          serialize.ts
│
├─shared
│  │  package.json
│  │
│  └─src
│          index.ts
│          shapeFlags.ts
│          toDisplayString.ts
```

### 3.1 compiler-core

Vue3的编译核心，核心作用就是将字符串转换成 抽象对象语法树AST；

 

#### 3.1.1. 目录结构 

```js
├─compiler-core
│  │  package.json
│  │
│  ├─src
│  │  │  ast.ts
│  │  │  codegen.ts
│  │  │  compile.ts
│  │  │  index.ts
│  │  │  parse.ts
│  │  │  runtimeHelpers.ts
│  │  │  transform.ts
│  │  │  utils.ts
│  │  │
│  │  └─transforms
│  │          transformElement.ts
│  │          transformExpression.ts
│  │          transformText.ts
│  │
│  └─__tests__
│      │  codegen.spec.ts
│      │  parse.spec.ts
│      │  transform.spec.ts
│      │
│      └─__snapshots__
│              codegen.spec.ts.snap
│
├─reactivity
│  │  package.json
│  │
│  ├─src
│  │      baseHandlers.ts
│  │      computed.ts
│  │      dep.ts
│  │      effect.ts
│  │      index.ts
│  │      reactive.ts
│  │      ref.ts
│  │
│  └─__tests__
│          computed.spec.ts
│          dep.spec.ts
│          effect.spec.ts
│          reactive.spec.ts
│          readonly.spec.ts
│          ref.spec.ts
│          shallowReadonly.spec.ts
│
├─runtime-core
│  │  package.json
│  │
│  ├─src
│  │  │  .pnpm-debug.log
│  │  │  apiInject.ts
│  │  │  apiWatch.ts
│  │  │  component.ts
│  │  │  componentEmits.ts
│  │  │  componentProps.ts
│  │  │  componentPublicInstance.ts
│  │  │  componentRenderUtils.ts
│  │  │  componentSlots.ts
│  │  │  createApp.ts
│  │  │  h.ts
│  │  │  index.ts
│  │  │  renderer.ts
│  │  │  scheduler.ts
│  │  │  vnode.ts
│  │  │
│  │  └─helpers
│  │          renderSlot.ts
│  │
│  └─__tests__
│          apiWatch.spec.ts
│          componentEmits.spec.ts
│          rendererComponent.spec.ts
│          rendererElement.spec.ts
│
├─runtime-dom
│  │  package.json
│  │
│  └─src
│          index.ts
│
├─runtime-test
│  └─src
│          index.ts
│          nodeOps.ts
│          patchProp.ts
│          serialize.ts
│
├─shared
│  │  package.json
│  │
│  └─src
│          index.ts
│          shapeFlags.ts
│          toDisplayString.ts
```

#### 3.1.2 compile逻辑

详细代码见课上讲解

```js
// src/index.ts
export { baseCompile } from "./compile";

// src/compiler.ts
import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformExpression } from "./transforms/transformExpression";
import { transformElement } from "./transforms/transformElement";
import { transformText } from "./transforms/transformText";

export function baseCompile(template, options) {
  // 1. 先把 template 也就是字符串 parse 成 ast
  const ast = baseParse(template);
  // 2. 给 ast 加点料（- -#）
  transform(
    ast,
    Object.assign(options, {
      nodeTransforms: [transformElement, transformText, transformExpression],
    })
  );
  
  // 3. 生成 render 函数代码
  return generate(ast);
}

```

- baseParse

```typescript
export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context, []));
}

function createParserContext(content) {
  console.log("创建 paserContext");
  return {
    source: content,
  };
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
    helpers: [],
  };
}

function parseChildren(context, ancestors) {
  console.log("开始解析 children");
  const nodes: any = [];
  
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source;
    
    if (startsWith(s, "{{")) {
      // 看看如果是 {{ 开头的话，那么就是一个插值， 那么去解析他
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (s[1] === "/") {
        // 这里属于 edge case 可以不用关心
        // 处理结束标签
        if (/[a-z]/i.test(s[2])) {
          // 匹配 </div>
          // 需要改变 context.source 的值 -> 也就是需要移动光标
          parseTag(context, TagType.End);
          // 结束标签就以为这都已经处理完了，所以就可以跳出本次循环了
          continue;
        }
      } else if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      }
    }
    
    if (!node) {
      node = parseText(context);
    }
    
    nodes.push(node);
  }
  
  return nodes;
}
```

- transfrom

```typescript
export function transform(root, options = {}) {
  // 1. 创建 context
  
  const context = createTransformContext(root, options);
  
  // 2. 遍历 node
  traverseNode(root, context);
  
  createRootCodegen(root, context);
  
  root.helpers.push(...context.helpers.keys());
}

function createTransformContext(root, options): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(name) {
      // 这里会收集调用的次数
      // 收集次数是为了给删除做处理的， （当只有 count 为0 的时候才需要真的删除掉）
      // helpers 数据会在后续生成代码的时候用到
      const count = context.helpers.get(name) || 0;
      context.helpers.set(name, count + 1);
    },
  };
  
  return context;
}

function traverseNode(node: any, context) {
  const type: NodeTypes = node.type;
  
  // 遍历调用所有的 nodeTransforms
  // 把 node 给到 transform
  // 用户可以对 node 做处理
  const nodeTransforms = context.nodeTransforms;
  const exitFns: any = [];
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    
    const onExit = transform(node, context);
    if (onExit) {
      exitFns.push(onExit);
    }
  }
  
  switch (type) {
    case NodeTypes.INTERPOLATION:
      // 插值的点，在于后续生成 render 代码的时候是获取变量的值
      context.helper(TO_DISPLAY_STRING);
      break;
      
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      
      traverseChildren(node, context);
      break;
      
    default:
      break;
  }
  
  
  
  let i = exitFns.length;
  // i-- 这个很巧妙
  // 使用 while 是要比 for 快 (可以使用 https://jsbench.me/ 来测试一下)
  while (i--) {
    exitFns[i]();
  }
}

function createRootCodegen(root: any, context: any) {
  const { children } = root;
  
  // 只支持有一个根节点
  // 并且还是一个 single text node
  const child = children[0];
  
  // 如果是 element 类型的话 ， 那么我们需要把它的 codegenNode 赋值给 root
  // root 其实是个空的什么数据都没有的节点
  // 所以这里需要额外的处理 codegenNode
  // codegenNode 的目的是专门为了 codegen 准备的  为的就是和 ast 的 node 分离开
  if (child.type === NodeTypes.ELEMENT && child.codegenNode) {
    const codegenNode = child.codegenNode;
    root.codegenNode = codegenNode;
  } else {
    root.codegenNode = child;
  }
}

```

- generate

```typescript
export function generate(ast, options = {}) {
  // 先生成 context
  const context = createCodegenContext(ast, options);
  const { push, mode } = context;
  
  // 1. 先生成 preambleContext
  
  if (mode === "module") {
    genModulePreamble(ast, context);
  } else {
    genFunctionPreamble(ast, context);
  }
  
  const functionName = "render";
  
  const args = ["_ctx"];
  
  // _ctx,aaa,bbb,ccc
  // 需要把 args 处理成 上面的 string
  const signature = args.join(", ");
  push(`function ${functionName}(${signature}) {`);
  // 这里需要生成具体的代码内容
  // 开始生成 vnode tree 的表达式
  push("return ");
  genNode(ast.codegenNode, context);
  
  push("}");
  
  return {
    code: context.code,
  };
}
```

### 3.2 reactivity

负责Vue3中响应式实现的部分

#### 3.2.1 目录结构

```js
├─src
│      baseHandlers.ts // 基本处理逻辑
│      computed.ts // computed属性处理
│      dep.ts // effect对象存储逻辑
│      effect.ts // 依赖收集机制
│      index.ts // 入口文件
│      reactive.ts // 响应式处理逻辑
│      ref.ts // ref执行逻辑
│
└─__tests__ // 测试用例
        computed.spec.ts
        dep.spec.ts
        effect.spec.ts
        reactive.spec.ts
        readonly.spec.ts
        ref.spec.ts
        shallowReadonly.spec.ts
```

#### 3.2.2 reactivity逻辑

详细代码见课上讲解

- index.ts

```typescript
export {
reactive,
  readonly,
  shallowReadonly,
  isReadonly,
  isReactive,
  isProxy,
} from "./reactive";

export { ref, proxyRefs, unRef, isRef } from "./ref";

export { effect, stop, ReactiveEffect } from "./effect";

export { computed } from "./computed";

```

- reactive.ts

```typescript
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const reactiveMap = new WeakMap();
export const readonlyMap = new WeakMap();
export const shallowReadonlyMap = new WeakMap();

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

export function reactive(target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, readonlyMap, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(
    target,
    shallowReadonlyMap,
    shallowReadonlyHandlers
  );
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
  // 如果 value 是 proxy 的话
  // 会触发 get 操作，而在 createGetter 里面会判断
  // 如果 value 是普通对象的话
  // 那么会返回 undefined ，那么就需要转换成布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function toRaw(value) {
  // 如果 value 是 proxy 的话 ,那么直接返回就可以了
  // 因为会触发 createGetter 内的逻辑
  // 如果 value 是普通对象的话，
  // 我们就应该返回普通对象
  // 只要不是 proxy ，只要是得到了 undefined 的话，那么就一定是普通对象
  // TODO 这里和源码里面实现的不一样，不确定后面会不会有问题
  if (!value[ReactiveFlags.RAW]) {
    return value;
  }
  
  return value[ReactiveFlags.RAW];
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  // 核心就是 proxy
  // 目的是可以侦听到用户 get 或者 set 的动作
  
  // 如果命中的话就直接返回就好了
  // 使用缓存做的优化点
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  
  const proxy = new Proxy(target, baseHandlers);
  
  // 把创建好的 proxy 给存起来，
  proxyMap.set(target, proxy);
  return proxy;
}

```

- ref.ts

```typescript
import { trackEffects, triggerEffects, isTracking } from "./effect";
import { createDep } from "./dep";
import { isObject, hasChanged } from "@mini-vue/shared";
import { reactive } from "./reactive";

export class RefImpl {
  private _rawValue: any;
  private _value: any;
  public dep;
  public __v_isRef = true;

  constructor(value) {
    this._rawValue = value;
    // 看看value 是不是一个对象，如果是一个对象的话
    // 那么需要用 reactive 包裹一下
    this._value = convert(value);
    this.dep = createDep();
  }

  get value() {
    // 收集依赖
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    // 当新的值不等于老的值的话，
    // 那么才需要触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      // 更新值
      this._value = convert(newValue);
      this._rawValue = newValue;
      // 触发依赖
      triggerRefValue(this);
    }
  }
}

export function ref(value) {
  return createRef(value);
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function createRef(value) {
  const refImpl = new RefImpl(value);

  return refImpl;
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep);
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

// 这个函数的目的是
// 帮助解构 ref
// 比如在 template 中使用 ref 的时候，直接使用就可以了
// 例如： const count = ref(0) -> 在 template 中使用的话 可以直接 count
// 解决方案就是通过 proxy 来对 ref 做处理

const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    // 如果里面是一个 ref 类型的话，那么就返回 .value
    // 如果不是的话，那么直接返回value 就可以了
    return unRef(Reflect.get(target, key, receiver));
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  },
};

// 这里没有处理 objectWithRefs 是 reactive 类型的时候
// TODO reactive 里面如果有 ref 类型的 key 的话， 那么也是不需要调用 ref.value 的
// （but 这个逻辑在 reactive 里面没有实现）
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

// 把 ref 里面的值拿到
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function isRef(value) {
  return !!value.__v_isRef;
}

```

- effect

```typescript
export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn);

  // 把用户传过来的值合并到 _effect 对象上去
  // 缺点就是不是显式的，看代码的时候并不知道有什么值
  extend(_effect, options);
  _effect.run();

  // 把 _effect.run 这个方法返回
  // 让用户可以自行选择调用的时机（调用 fn）
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
```

- computed

```typescript
import { createDep } from "./dep";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

export class ComputedRefImpl {
  public dep: any;
  public effect: ReactiveEffect;

  private _dirty: boolean;
  private _value

  constructor(getter) {
    this._dirty = true;
    this.dep = createDep();
    this.effect = new ReactiveEffect(getter, () => {
      // scheduler
      // 只要触发了这个函数说明响应式对象的值发生改变了
      // 那么就解锁，后续在调用 get 的时候就会重新执行，所以会得到最新的值
      if (this._dirty) return;

      this._dirty = true;
      triggerRefValue(this);
    });
  }

  get value() {
    // 收集依赖
    trackRefValue(this);
    // 锁上，只可以调用一次
    // 当数据改变的时候才会解锁
    // 这里就是缓存实现的核心
    // 解锁是在 scheduler 里面做的
    if (this._dirty) {
      this._dirty = false;
      // 这里执行 run 的话，就是执行用户传入的 fn
      this._value = this.effect.run();
    }

    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}

```

### 3.3 runtime-core

运行的核心流程，其中包括初始化流程和更新流程

#### 3.3.1 目录结构

```js
├─src
│  │  apiInject.ts	// 提供provider和inject
│  │  apiWatch.ts	// 提供watch
│  │  component.ts	// 创建组件实例
│  │  componentEmits.ts	// 执行组件props 里面的 onXXX 的函数
│  │  componentProps.ts	// 获取组件props
│  │  componentPublicInstance.ts	// 组件通用实例上的代理,如$el,$emit等
│  │  componentRenderUtils.ts	// 判断组件是否需要重新渲染的工具类
│  │  componentSlots.ts	// 组件的slot
│  │  createApp.ts	// 根据跟组件创建应用
│  │  h.ts	// 创建节点
│  │  index.ts	// 入口文件
│  │  renderer.ts	// 渲染机制,包含diff
│  │  scheduler.ts // 触发更新机制
│  │  vnode.ts	// vnode节点
│  │
│  └─helpers
│          renderSlot.ts	// 插槽渲染实现
│
└─__tests__	// 测试用例
        apiWatch.spec.ts
        componentEmits.spec.ts
        rendererComponent.spec.ts
        rendererElement.spec.ts
```

#### 3.3.2 runtime核心逻辑

详细代码见课上讲解

- provide/inject

  ```typescript
  import { getCurrentInstance } from "./component";
  
  export function provide(key, value) {
    const currentInstance = getCurrentInstance();
  
    if (currentInstance) {
      let { provides } = currentInstance;
  
      const parentProvides = currentInstance.parent?.provides;
  
      // 这里要解决一个问题
      // 当父级 key 和 爷爷级别的 key 重复的时候，对于子组件来讲，需要取最近的父级别组件的值
      // 那这里的解决方案就是利用原型链来解决
      // provides 初始化的时候是在 createComponent 时处理的，当时是直接把 parent.provides 赋值给组件的 provides 的
      // 所以，如果说这里发现 provides 和 parentProvides 相等的话，那么就说明是第一次做 provide(对于当前组件来讲)
      // 我们就可以把 parent.provides 作为 currentInstance.provides 的原型重新赋值
      // 至于为什么不在 createComponent 的时候做这个处理，可能的好处是在这里初始化的话，是有个懒执行的效果（优化点，只有需要的时候在初始化）
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
  
      provides[key] = value;
    }
  }
  
  export function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
  
    if (currentInstance) {
      const provides = currentInstance.parent?.provides;
  
      if (key in provides) {
        return provides[key];
      } else if (defaultValue) {
        if (typeof defaultValue === "function") {
          return defaultValue();
        }
        return defaultValue;
      }
    }
  }
  
  ```

- watch

```typescript
import { ReactiveEffect } from "@mini-vue/reactivity";
import { queuePreFlushCb } from "./scheduler";

// Simple effect.
export function watchEffect(effect) {
  doWatch(effect);
}

function doWatch(source) {
  // 把 job 添加到 pre flush 里面
  // 也就是在视图更新完成之前进行渲染（待确认？）
  // 当逻辑执行到这里的时候 就已经触发了 watchEffect
  const job = () => {
    effect.run();
  };

  // 这里用 scheduler 的目的就是在更新的时候
  // 让回调可以在 render 前执行 变成一个异步的行为（这里也可以通过 flush 来改变）
  const scheduler = () => queuePreFlushCb(job);

  const getter = () => {
    source();
  };

  const effect = new ReactiveEffect(getter, scheduler);

  // 这里执行的就是 getter
  effect.run();
}

```

- component创建

```typescript
export function createComponentInstance(vnode, parent) {
  const instance = {
    type: vnode.type,
    vnode,
    next: null, // 需要更新的 vnode，用于更新 component 类型的组件
    props: {},
    parent,
    provides: parent ? parent.provides : {}, //  获取 parent 的 provides 作为当前组件的初始化值 这样就可以继承 parent.provides 的属性了
    proxy: null,
    isMounted: false,
    attrs: {}, // 存放 attrs 的数据
    slots: {}, // 存放插槽的数据
    ctx: {}, // context 对象
    setupState: {}, // 存储 setup 的返回值
    emit: () => {},
  };
  
  // 在 prod 坏境下的 ctx 只是下面简单的结构
  // 在 dev 环境下会更复杂
  instance.ctx = {
    _: instance,
  };
  
  // 赋值 emit
  // 这里使用 bind 把 instance 进行绑定
  // 后面用户使用的时候只需要给 event 和参数即可
  instance.emit = emit.bind(null, instance) as any;
  
  return instance;
}

```

- createApp

```typescript
import { createVNode } from "./vnode";

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        console.log("基于根组件创建 vnode");
        const vnode = createVNode(rootComponent);
        console.log("调用 render，基于 vnode 进行开箱");
        render(vnode, rootContainer);
      },
    };

    return app;
  };
}

```

- 创建vnode节点

```typescript
import { createVNode } from "./vnode";
export const h = (type: any , props: any = null, children: string | Array<any> = []) => {
  return createVNode(type, props, children);
};

```

- 入口文件

```typescript
export * from "./h";
export * from "./createApp";
export { getCurrentInstance, registerRuntimeCompiler } from "./component";
export { inject, provide } from "./apiInject";
export { renderSlot } from "./helpers/renderSlot";
export { createTextVNode, createElementVNode } from "./vnode";
export { createRenderer } from "./renderer";
export { toDisplayString } from "@mini-vue/shared";
export {
  // core
  reactive,
  ref,
  readonly,
  // utilities
  unRef,
  proxyRefs,
  isReadonly,
  isReactive,
  isProxy,
  isRef,
  // advanced
  shallowReadonly,
  // effect
  effect,
  stop,
  computed,
} from "@mini-vue/reactivity";

```

- render

```typescript
// 具体update的Diff见下节课内容;
function updateElement(n1, n2, container, anchor, parentComponent) {
    const oldProps = (n1 && n1.props) || {};
  const newProps = n2.props || {};
  // 应该更新 element
  console.log("应该更新 element");
  console.log("旧的 vnode", n1);
  console.log("新的 vnode", n2);

  // 需要把 el 挂载到新的 vnode
  const el = (n2.el = n1.el);

  // 对比 props
  patchProps(el, oldProps, newProps);

  // 对比 children
  patchChildren(n1, n2, el, anchor, parentComponent);
}
```

- scheduler

```typescript
// 具体的调度机制见下节课内容
const queue: any[] = [];
const activePreFlushCbs: any = [];

const p = Promise.resolve();
let isFlushPending = false;

export function nextTick(fn?) {
  return fn ? p.then(fn) : p;
}

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    // 执行所有的 job
    queueFlush();
  }
}

function queueFlush() {
  // 如果同时触发了两个组件的更新的话
  // 这里就会触发两次 then （微任务逻辑）
  // 但是着是没有必要的
  // 我们只需要触发一次即可处理完所有的 job 调用
  // 所以需要判断一下 如果已经触发过 nextTick 了
  // 那么后面就不需要再次触发一次 nextTick 逻辑了
  if (isFlushPending) return;
  isFlushPending = true;
  nextTick(flushJobs);
}

export function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs);
}

function queueCb(cb, activeQueue) {
  // 直接添加到对应的列表内就ok
  // todo 这里没有考虑 activeQueue 是否已经存在 cb 的情况
  // 然后在执行 flushJobs 的时候就可以调用 activeQueue 了
  activeQueue.push(cb);

  // 然后执行队列里面所有的 job
  queueFlush()
}

function flushJobs() {
  isFlushPending = false;

  // 先执行 pre 类型的 job
  // 所以这里执行的job 是在渲染前的
  // 也就意味着执行这里的 job 的时候 页面还没有渲染
  flushPreFlushCbs();

  // 这里是执行 queueJob 的
  // 比如 render 渲染就是属于这个类型的 job
  let job;
  while ((job = queue.shift())) {
    if (job) {
      job();
    }
  }
}

function flushPreFlushCbs() {
  // 执行所有的 pre 类型的 job
  for (let i = 0; i < activePreFlushCbs.length; i++) {
    activePreFlushCbs[i]();
  }
}

```

- vnode类型定义及格式规范

```typescript
import { ShapeFlags } from "@mini-vue/shared";

export { createVNode as createElementVNode }

export const createVNode = function (
  type: any,
  props?: any,
  children?: string | Array<any>
) {
  // 注意 type 有可能是 string 也有可能是对象
  // 如果是对象的话，那么就是用户设置的 options
  // type 为 string 的时候
  // createVNode("div")
  // type 为组件对象的时候
  // createVNode(App)
  const vnode = {
    el: null,
    component: null,
    key: props?.key,
    type,
    props: props || {},
    children,
    shapeFlag: getShapeFlag(type),
  };

  // 基于 children 再次设置 shapeFlag
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }

  normalizeChildren(vnode, children);

  return vnode;
};

export function normalizeChildren(vnode, children) {
  if (typeof children === "object") {
    // 暂时主要是为了标识出 slots_children 这个类型来
    // 暂时我们只有 element 类型和 component 类型的组件
    // 所以我们这里除了 element ，那么只要是 component 的话，那么children 肯定就是 slots 了
    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
      // 如果是 element 类型的话，那么 children 肯定不是 slots
    } else {
      // 这里就必然是 component 了,
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
    }
  }
}
// 用 symbol 作为唯一标识
export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");

/**
 * @private
 */
export function createTextVNode(text: string = " ") {
  return createVNode(Text, {}, text);
}

// 标准化 vnode 的格式
// 其目的是为了让 child 支持多种格式
export function normalizeVNode(child) {
  // 暂时只支持处理 child 为 string 和 number 的情况
  if (typeof child === "string" || typeof child === "number") {
    return createVNode(Text, null, String(child));
  } else {
    return child;
  }
}

// 基于 type 来判断是什么类型的组件
function getShapeFlag(type: any) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

```

### 3.4 runtime-dom

Vue3靠虚拟dom，实现跨平台的能力，runtime-dom提供一个渲染器，这个渲染器可以渲染虚拟dom节点到指定的容器中；

#### 3.4.1 主要功能

详细代码见课上讲解

```typescript
// 源码里面这些接口是由 runtime-dom 来实现
// 这里先简单实现

import { isOn } from "@mini-vue/shared";
import { createRenderer } from "@mini-vue/runtime-core";

// 后面也修改成和源码一样的实现
function createElement(type) {
  console.log("CreateElement", type);
  const element = document.createElement(type);
  return element;
}

function createText(text) {
  return document.createTextNode(text);
}

function setText(node, text) {
  node.nodeValue = text;
}

function setElementText(el, text) {
  console.log("SetElementText", el, text);
  el.textContent = text;
}

function patchProp(el, key, preValue, nextValue) {
  // preValue 之前的值
  // 为了之后 update 做准备的值
  // nextValue 当前的值
  console.log(`PatchProp 设置属性:${key} 值:${nextValue}`);
  console.log(`key: ${key} 之前的值是:${preValue}`);

  if (isOn(key)) {
    // 添加事件处理函数的时候需要注意一下
    // 1. 添加的和删除的必须是一个函数，不然的话 删除不掉
    //    那么就需要把之前 add 的函数给存起来，后面删除的时候需要用到
    // 2. nextValue 有可能是匿名函数，当对比发现不一样的时候也可以通过缓存的机制来避免注册多次
    // 存储所有的事件函数
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[key];
    if (nextValue && existingInvoker) {
      // patch
      // 直接修改函数的值即可
      existingInvoker.value = nextValue;
    } else {
      const eventName = key.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = (invokers[key] = nextValue);
        el.addEventListener(eventName, invoker);
      } else {
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }
  } else {
    if (nextValue === null || nextValue === "") {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}

function insert(child, parent, anchor = null) {
  console.log("Insert");
  parent.insertBefore(child, anchor);
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

let renderer;

function ensureRenderer() {
  // 如果 renderer 有值的话，那么以后都不会初始化了
  return (
    renderer ||
    (renderer = createRenderer({
      createElement,
      createText,
      setText,
      setElementText,
      patchProp,
      insert,
      remove,
    }))
  );
}

export const createApp = (...args) => {
  return ensureRenderer().createApp(...args);
};

export * from "@mini-vue/runtime-core"

```

### 3.5 runtime-test

可以理解成runtime-dom的延伸，,因为runtime-test对外提供的确实是dom环境的测试，方便用于runtime-core的测试；

#### 3.5.1 目录结构

```js
──src
index.ts
nodeOps.ts
patchProp.ts
serialize.ts

```

#### 3.5.2 runtime-test 核心逻辑

详细代码见课上讲解

- index.ts

```typescript
// todo
// 实现 render 的渲染接口
// 实现序列化
import { createRenderer } from "@mini-vue/runtime-core";
import { extend } from "@mini-vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

export const { render } = createRenderer(extend({ patchProp }, nodeOps));

export * from "./nodeOps";
export * from "./serialize"
export * from '@mini-vue/runtime-core'
```

- nodeOps，节点定义及操作再runtime-core中的映射

```typescript
export const enum NodeTypes {
  ELEMENT = "element",
  TEXT = "TEXT",
}

let nodeId = 0;
// 这个函数会在 runtime-core 初始化 element 的时候调用
function createElement(tag: string) {
  // 如果是基于 dom 的话 那么这里会返回 dom 元素
  // 这里是为了测试 所以只需要反正一个对象就可以了
  // 后面的话 通过这个对象来做测试
  const node = {
    tag,
    id: nodeId++,
    type: NodeTypes.ELEMENT,
    props: {},
    children: [],
    parentNode: null,
  };

  return node;
}

function insert(child, parent) {
  parent.children.push(child);
  child.parentNode = parent;
}

function parentNode(node) {
  return node.parentNode;
}

function setElementText(el, text) {
  el.children = [
    {
      id: nodeId++,
      type: NodeTypes.TEXT,
      text,
      parentNode: el,
    },
  ];
}

export const nodeOps = { createElement, insert, parentNode, setElementText };

```

- Serialize, 序列化：把vnode处理成string

```typescript
// 把 node 给序列化
// 测试的时候好对比

import { NodeTypes } from "./nodeOps";

// 序列化： 把一个对象给处理成 string （进行流化）
export function serialize(node) {
  if (node.type === NodeTypes.ELEMENT) {
    return serializeElement(node);
  } else {
    return serializeText(node);
  }
}

function serializeText(node) {
  return node.text;
}

export function serializeInner(node) {
  // 把所有节点变成一个string
  return node.children.map((c) => serialize(c)).join(``);
}

function serializeElement(node) {
  // 把 props 处理成字符串
  // 规则：
  // 如果 value 是 null 的话 那么直接返回 ``
  // 如果 value 是 `` 的话，那么返回 key
  // 不然的话返回 key = value（这里的值需要字符串化）
  const props = Object.keys(node.props)
    .map((key) => {
      const value = node.props[key];
      return value == null
        ? ``
        : value === ``
        ? key
        : `${key}=${JSON.stringify(value)}`;
    })
    .filter(Boolean)
    .join(" ");

  console.log("node---------", node.children);
  return `<${node.tag}${props ? ` ${props}` : ``}>${serializeInner(node)}</${
    node.tag
  }>`;
}

```

### 3.6 shared

公用逻辑

#### 3.6.1 具体逻辑

```typescript
export * from '../src/shapeFlags';
export * from '../src/toDisplayString';

export const isObject = val => {
	return val !== null && typeof val === 'object';
};

export const isString = val => typeof val === 'string';

const camelizeRE = /-(\w)/g;
/**
 * @private
 * 把中划线命名方式转换成驼峰命名方式
 */
export const camelize = (str: string): string => {
	return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

export const extend = Object.assign;

// 必须是 on+一个大写字母的格式开头
export const isOn = key => /^on[A-Z]/.test(key);

export function hasChanged(value, oldValue) {
	return !Object.is(value, oldValue);
}

export function hasOwn(val, key) {
	return Object.prototype.hasOwnProperty.call(val, key);
}

/**
 * @private
 * 首字母大写
 */
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @private
 * 添加 on 前缀，并且首字母大写
 */
export const toHandlerKey = (str: string) => (str ? `on${capitalize(str)}` : ``);

// 用来匹配 kebab-case 的情况
// 比如 onTest-event 可以匹配到 T
// 然后取到 T 在前面加一个 - 就可以
// \BT 就可以匹配到 T 前面是字母的位置
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
export const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase();


// 组件的类型
export const enum ShapeFlags {
  // 最后要渲染的 element 类型
  ELEMENT = 1,
  // 组件类型
  STATEFUL_COMPONENT = 1 << 2,
  // vnode 的 children 为 string 类型
  TEXT_CHILDREN = 1 << 3,
  // vnode 的 children 为数组类型
  ARRAY_CHILDREN = 1 << 4,
  // vnode 的 children 为 slots 类型
  SLOTS_CHILDREN = 1 << 5
}

export const toDisplayString = (val) => {
  return String(val);
};

```

## 4 vue3执行逻辑解析

详情见课上讲解

### 4.1 init

​	<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue3执行逻辑init.png" alt="vue3执行逻辑init" style="zoom:50%;" />

### 4.2 update

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue3执行逻辑update.png" alt="vue3执行逻辑update" style="zoom:50%;" />

### 4.3 关键函数调用

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue3执行逻辑functionCall.png" alt="vue3执行逻辑functionCall" style="zoom:50%;" />

# vue3新特性&源码解析（3/3）

https://www.yuque.com/lpldplws/web/ty5nga?singleDoc# 《Vue3新特性&源码解析（3/3）》 密码：apwp

## 1. 课程目标

掌握面试高频考点，从理论的角度分析问题后再代入源码，保证能够完整的掌握Vue3的内容；

## 2.课程大纲

- Diff算法

## 3. Diff算法

diff算法的目的是为了找到哪些节点发生了变化，哪些节点没有发生变化可以复用。如果用最传统的diff算法，如下图所示，每个节点都要遍历另一棵树上的所有节点做比较，这就是o(n^2)的复杂度，加上更新节点时的o(n)复杂度，那就总共达到了o(n^3)的复杂度，这对于一个结构复杂节点数众多的页面，成本是非常大的。

![vue3-Diff](/Volumes/F/zyl-study/web-zhuawa/20221203/vue3-Diff.png)



实际上vue和react都对虚拟dom的diff算法做了一定的优化，将复杂度降低到了o(n)级别，具体的策略是：同层的节点才相互比较；

1. 节点比较时，如果类型不同，则对该节点及其所有子节点直接销毁新建；

2. 类型相同的子节点，使用key帮助查找，并且使用算法优化查找效率。其中react和vue2以及vue3的diff算法都不尽相同；

   ![vue3同层的diff](/Volumes/F/zyl-study/web-zhuawa/20221203/vue3同层的diff.png)

主要对比Vue2和Vue3，掌握为什么要从Vue2升级到Vue3，并代入后续代码，掌握Vue实现diff的流程；

前提：

- `mount(vnode, parent, [refNode])`: 通过`vnode`生成真实的DOM节点。parent为其父级的真实DOM节点，`refNode`为真实的DOM节点，其父级节点为parent。如果refNode不为空，vnode生成的DOM节点就会插入到refNode之前；如果refNode为空，那么vnode生成的DOM节点就作为最后一个子节点插入到parent中
- `patch(prevNode, nextNode, parent)`: 可以简单的理解为给当前DOM节点进行更新，并且调用diff算法对比自身的子节点;

### 3.1 vue2 diff-双端比较

双端比较就是新列表和旧列表两个列表的头与尾互相对比，，在对比的过程中指针会逐渐向内靠拢，直到某一个列表的节点全部遍历过，对比停止；

#### 3.1.1  patch

先判断是否是首次渲染，如果是首次渲染那么我们就直接createElm即可；如果不是就去判断新老两个节点的元素类型否一样；如果两个节点都是一样的，那么就深入检查他们的子节点。如果两个节点不一样那就说明Vnode完全被改变了，就可以直接替换oldVnode；

```js
function patch(oldVnode, vnode, hydrating, removeOnly) {
    // 判断新的vnode是否为空
    if (isUndef(vnode)) {
      // 如果老的vnode不为空 卸载所有的老vnode
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }
    let isInitialPatch = false
    // 用来存储 insert钩子函数，在插入节点之前调用
    const insertedVnodeQueue = []
    // 如果老节点不存在，直接创建新节点
    if (isUndef(oldVnode)) {
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      // 是不是元素节点
      const isRealElement = isDef(oldVnode.nodeType)
      // 当老节点不是真实的DOM节点，并且新老节点的type和key相同，进行patchVnode更新工作
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        // 如果不是同一元素节点的话
        // 当老节点是真实DOM节点的时候
        if (isRealElement) {
          // 如果是元素节点 并且在SSR环境的时候 修改SSR_ATTR属性
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            // 就是服务端渲染的，删掉这个属性
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          // 这个判断里是服务端渲染的处理逻辑
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            }
          }
          // 如果不是服务端渲染的，或者混合失败，就创建一个空的注释节点替换 oldVnode
          oldVnode = emptyNodeAt(oldVnode)
        }

        // 拿到 oldVnode 的父节点
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // 根据新的 vnode 创建一个 DOM 节点，挂载到父节点上
        createElm(
          vnode,
          insertedVnodeQueue,
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )
        // 如果新的 vnode 的根节点存在，就是说根节点被修改了，就需要遍历更新父节点
        // 递归 更新父占位符元素
        // 就是执行一遍 父节点的 destory 和 create 、insert 的 钩子函数
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          // 更新父组件的占位元素
          while (ancestor) {
            // 卸载老根节点下的全部组件
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            // 替换现有元素
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
            // 更新父节点
            ancestor = ancestor.parent
          }
        }
        // 如果旧节点还存在，就删掉旧节点
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          // 否则直接卸载 oldVnode
          invokeDestroyHook(oldVnode)
        }
      }
    }
    // 执行 虚拟 dom 的 insert 钩子函数
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    // 返回最新 vnode 的 elm ，也就是真实的 dom节点
    return vnode.elm
 }
```

### 3.1.2 patchVnode

- 如果`Vnode`和`oldVnode`指向同一个对象，则直接return即可；
- 将旧节点的真实 DOM 赋值到新节点（真实 dom 连线到新子节点）称为elm，然后遍历调用 update 更新 `oldVnode `上的所有属性，比如 class,style,attrs,domProps,events...；
- 如果新老节点都有文本节点，并且文本不相同，那么就用`vnode`.text更新文本内容。
- 如果oldVnode有子节点而`Vnode`没有，则直接删除老节点即可；
- 如果oldVnode没有子节点而`Vnode`有，则将Vnode的子节点真实化之后添加到DOM中即可。
- 如果两者都有子节点，则执行`updateChildren`函数比较子节点。

```js
function patchVnode(
    oldVnode, // 老的虚拟 DOM 节点
    vnode, // 新节点
    insertedVnodeQueue, // 插入节点队列
    ownerArray, // 节点数组
    index, // 当前节点的下标
    removeOnly
  ) {
    // 新老节点对比地址一样，直接跳过
    if (oldVnode === vnode) {
      return
    }
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
    const elm = vnode.elm = oldVnode.elm
    // 如果当前节点是注释或 v-if 的，或者是异步函数，就跳过检查异步组件
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }
    // 当前节点是静态节点的时候，key 也一样，或者有 v-once 的时候，就直接赋值返回
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }
    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }
    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      // 遍历调用 update 更新 oldVnode 所有属性，比如 class,style,attrs,domProps,events...
      // 这里的 update 钩子函数是 vnode 本身的钩子函数
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      // 这里的 update 钩子函数是我们传过来的函数
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // 如果新节点不是文本节点，也就是说有子节点
    if (isUndef(vnode.text)) {
      // 如果新老节点都有子节点
      if (isDef(oldCh) && isDef(ch)) {
        // 如果新老节点的子节点不一样，就执行 updateChildren 函数，对比子节点
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        // 如果新节点有子节点的话，就是说老节点没有子节点

        // 如果老节点是文本节点，就是说没有子节点，就清空
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 添加新节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 如果新节点没有子节点，老节点有子节点，就删除
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // 如果老节点是文本节点，就清空
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 如果老节点的文本和新节点的文本不同，就更新文本
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
 }
```

#### 3.1.3 updatChildren

为了方便理解，这里手动实现vue2中的updateChildren

##### 3.1.3.1 实现思路

我们先用四个指针指向两个列表的头尾

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[nextStartIndex],
    newEndNode = nextChildren[nextEndIndex];
}
```


根据四个指针找到四个节点，然后进行对比，那么如何对比呢？我们按照以下四个步骤进行对比

1. 使用旧列表的头一个节点`oldStartNode`与新列表的头一个节点`newStartNode`对比；
2. 使用旧列表的最后一个节点`oldEndNode`与新列表的最后一个节点`newEndNode`对比；
3. 使用旧列表的头一个节点`oldStartNode`与新列表的最后一个节点`newEndNode`对比；
4. 使用旧列表的最后一个节点`oldEndNode`与新列表的头一个节点`newStartNode`对比；

使用以上四步进行对比，去寻找key相同的可复用的节点，当在某一步中找到了则停止后面的寻找。具体对比顺序如下图：

![vue2-diff具体实现](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现.png)



对比顺序代码结构如下：

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[newStartIndex],
    newEndNode = nextChildren[newEndIndex];
  
  if (oldStartNode.key === newStartNode.key) {

  } else if (oldEndNode.key === newEndNode.key) {

  } else if (oldStartNode.key === newEndNode.key) {

  } else if (oldEndNode.key === newStartNode.key) {

  }
}
```

当对比时找到了可复用的节点，我们还是先`patch`给元素打补丁，然后将指针进行前/后移一位指针。根据对比节点的不同，我们移动的指针和方向也不同，具体规则如下：

1. 当旧列表的头一个节点`oldStartNode`与新列表的头一个节点`newStartNode`对比时key相同。那么旧列表的头指针`oldStartIndex`与新列表的头指针`newStartIndex`同时向后移动一位；
2. 当旧列表的最后一个节点`oldEndNode`与新列表的最后一个节点`newEndNode`对比时key相同。那么旧列表的尾指针oldEndIndex与新列表的尾指针`newEndIndex`同时向前移动一位；
3. 当旧列表的头一个节点`oldStartNode`与新列表的最后一个节点`newEndNode`对比时key相同。那么旧列表的头指针`oldStartIndex`向后移动一位；新列表的尾指针`newEndIndex`向前移动一位；
4. 当旧列表的最后一个节点`oldEndNode`与新列表的头一个节点`newStartNode`对比时key相同。那么旧列表的尾指针`oldEndIndex`向前移动一位；新列表的头指针`newStartIndex`向后移动一位；

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1,
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[newStartIndex],
    newEndNode = nextChildren[newEndIndex];

  if (oldStartNode.key === newStartNode.key) {
    patch(oldvStartNode, newStartNode, parent)

    oldStartIndex++
    newStartIndex++
    oldStartNode = prevChildren[oldStartIndex]
    newStartNode = nextChildren[newStartIndex]
  } else if (oldEndNode.key === newEndNode.key) {
    patch(oldEndNode, newEndNode, parent)

    oldEndIndex--
    newEndIndex--
    oldEndNode = prevChildren[oldEndIndex]
    newEndNode = nextChildren[newEndIndex]
  } else if (oldStartNode.key === newEndNode.key) {
    patch(oldStartNode, newEndNode, parent)

    oldStartIndex++
    newEndIndex--
    oldStartNode = prevChildren[oldStartIndex]
    newEndNode = nextChildren[newEndIndex]
  } else if (oldEndNode.key === newStartNode.key) {
    patch(oldEndNode, newStartNode, parent)

    oldEndIndex--
    nextStartIndex++
    oldEndNode = prevChildren[oldEndIndex]
    newStartNode = nextChildren[newStartIndex]
  }
}
```

至此整体的循环我们就全部完成了，下面我们需要考虑这样两个问题：

- 什么情况下DOM节点需要移动；
- DOM节点如何移动；

我们来解决第一个问题：什么情况下需要移动，我们还是以上图为例：

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现2.png" alt="vue2-diff具体实现2" style="zoom: 67%;" />

当我们在第一个循环时，在第四步发现旧列表的尾节点oldEndNode与新列表的头节点newStartNode的key相同，是可复用的DOM节点。通过观察我们可以发现，原本在旧列表末尾的节点，却是新列表中的开头节点，没有人比他更靠前，因为他是第一个，所以我们只需要把当前的节点移动到原本旧列表中的第一个节点之前，让它成为第一个节点即可。

```js
function vue2Diff(prevChildren, nextChildren, parent) {
 // ...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
       // ...
    } else if (oldEndNode.key === newEndNode.key) {
      // ...
    } else if (oldStartNode.key === newEndNode.key) {
      // ...
    } else if (oldEndNode.key === newStartNode.key) {
      patch(oldEndNode, newStartNode, parent)
      // 移动到旧列表头节点之前
      parent.insertBefore(oldEndNode.el, oldStartNode.el)
      
      oldEndIndex--
      newStartIndex++
      oldEndNode = prevChildren[oldEndIndex]
      newStartNode = nextChildren[newStartIndex]
    }
  }
}
```

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现3.png" alt="vue2-diff具体实现3" style="zoom:67%;" />

进入第二次循环，我们在第二步发现，旧列表的尾节点`oldEndNode`和新列表的尾节点`newEndNode`为复用节点。原本在旧列表中就是尾节点，在新列表中也是尾节点，说明该节点不需要移动，所以我们什么都不需要做。

同理，如果是旧列表的头节点`oldStartNode`和新列表的头节点`newStartNode`为复用节点，我们也什么都不需要做

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现4.png" alt="vue2-diff具体实现4" style="zoom:67%;" />

![img](https://cdn.nlark.com/yuque/0/2022/webp/2340337/1659366689365-b379cb31-3e87-4afa-a4d6-3bcf68a3c720.webp)

进入第三次循环，我们在第三部发现，旧列表的头节点`oldStartNode`和新列表的尾节点`newEndNode`为复用节点。，我们只要将DOM-A移动到DOM-B后面就可以了。

依照惯例我们还是解释一下，原本旧列表中是头节点，然后在新列表中是尾节点。那么只要在旧列表中把当前的节点移动到原本尾节点的后面，就可以了。

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  // ...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
      // ...
    } else if (oldEndNode.key === newEndNode.key) {
      // ...
    } else if (oldStartNode.key === newEndNode.key) {
      patch(oldStartNode, newEndNode, parent)
      parent.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling)

      oldStartIndex++
      newEndIndex--
      oldStartNode = prevChildren[oldStartIndex]
      newEndNode = nextChildren[newEndIndex]
    } else if (oldEndNode.key === newStartNode.key) {
     //...
    }
  }
}
```

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现5.png" alt="vue2-diff具体实现5" style="zoom:67%;" />

进入最后一个循环。在第一步旧列表头节点`oldStartNode`与新列表头节点`newStartNode`位置相同，所以啥也不用做。然后结束循环。

##### 3.1.3.2 非理想情况

上文中有一个特殊情况，当四次对比都没找到复用节点时，我们只能拿新列表的第一个节点去旧列表中找与其key相同的节点。

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现6.png" alt="vue2-diff具体实现6" style="zoom:67%;" />

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
    //...
    } else if (oldEndNode.key === newEndNode.key) {
    //...
    } else if (oldStartNode.key === newEndNode.key) {
    //...
    } else if (oldEndNode.key === newStartNode.key) {
    //...
    } else {
      // 在旧列表中找到 和新列表头节点key 相同的节点
      let newKey = newStartNode.key,
        oldIndex = prevChildren.findIndex(child => child.key === newKey);
      
    }
  }
}
```

找节点的时候其实会有两种情况：一种在旧列表中找到了，另一种情况是没找到。

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现7.png" alt="vue2-diff具体实现7" style="zoom:67%;" />

当我们在旧列表中找到对应的VNode，我们只需要将找到的节点的DOM元素，移动到开头就可以了。这里的逻辑其实和第四步的逻辑是一样的，只不过第四步是移动的尾节点，这里是移动找到的节点。DOM移动后，由我们将旧列表中的节点改为undefined，这是至关重要的一步，因为我们已经做了节点的移动了所以我们不需要进行再次的对比了。最后我们将头指针newStartIndex向后移一位。

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
    //...
    } else if (oldEndNode.key === newEndNode.key) {
    //...
    } else if (oldStartNode.key === newEndNode.key) {
    //...
    } else if (oldEndNode.key === newStartNode.key) {
    //...
    } else {
      // 在旧列表中找到 和新列表头节点key 相同的节点
      let newtKey = newStartNode.key,
        oldIndex = prevChildren.findIndex(child => child.key === newKey);
      
      if (oldIndex > -1) {
        let oldNode = prevChildren[oldIndex];
        patch(oldNode, newStartNode, parent)
        parent.insertBefore(oldNode.el, oldStartNode.el)
        prevChildren[oldIndex] = undefined
      }
      newStartNode = nextChildren[++newStartIndex]
    }
  }
}
```

如果在旧列表中没有找到复用节点，就直接创建一个新的节点放到最前面就可以了，然后后移头指针`newStartIndex`。

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现8.png" alt="vue2-diff具体实现8" style="zoom:67%;" />

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
    //...
    } else if (oldEndNode.key === newEndNode.key) {
    //...
    } else if (oldStartNode.key === newEndNode.key) {
    //...
    } else if (oldEndNode.key === newStartNode.key) {
    //...
    } else {
      // 在旧列表中找到 和新列表头节点key 相同的节点
      let newtKey = newStartNode.key,
        oldIndex = prevChildren.findIndex(child => child.key === newKey);
      
      if (oldIndex > -1) {
        let oldNode = prevChildren[oldIndex];
        patch(oldNode, newStartNode, parent)
        parent.insertBefore(oldNode.el, oldStartNode.el)
        prevChildren[oldIndex] = undefined
      } else {
      	mount(newStartNode, parent, oldStartNode.el)
      }
      newStartNode = nextChildren[++newStartIndex]
    }
  }
}
```

最后当旧列表遍历到undefind时就跳过当前节点。

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode === undefind) {
    	oldStartNode = prevChildren[++oldStartIndex]
    } else if (oldEndNode === undefind) {
    	oldEndNode = prevChildren[--oldEndIndex]
    } else if (oldStartNode.key === newStartNode.key) {
    //...
    } else if (oldEndNode.key === newEndNode.key) {
    //...
    } else if (oldStartNode.key === newEndNode.key) {
    //...
    } else if (oldEndNode.key === newStartNode.key) {
    //...
    } else {
    // ...
    }
  }
}
```

##### 3.1.3.3 添加节点

![vue2-diff具体实现9](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现9.png)



针对上述例子，几次循环都是尾节点相同，尾指针一直向前移动，直到循环结束；

![vue2-diff具体实现10](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现10.png)



此时`oldEndIndex`以及小于了`oldStartIndex`，但是新列表中还有剩余的节点，我们只需要将剩余的节点依次插入到`oldStartNode`的DOM之前就可以了。为什么是插入`oldStartNode`之前呢？原因是剩余的节点在新列表的位置是位于`oldStartNode`之前的，如果剩余节点是在`oldStartNode`之后，`oldStartNode`就会先行对比

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
  // ...
  }
  if (oldEndIndex < oldStartIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      mount(nextChildren[i], parent, prevStartNode.el)
    }
  }
}
```

##### 3.1.3.4 移除节点

当新列表的`newEndIndex`小于`newStartIndex`时，我们将旧列表剩余的节点删除即可。这里我们需要注意，旧列表的undefind。在第二小节中我们提到过，当头尾节点都不相同时，我们会去旧列表中找新列表的第一个节点，移动完DOM节点后，将旧列表的那个节点改为undefind。所以我们在最后的删除时，需要注意这些undefind，遇到的话跳过当前循环即可。

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
  // ...
  }
  if (oldEndIndex < oldStartIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      mount(nextChildren[i], parent, prevStartNode.el)
    }
  } else if (newEndIndex < newStartIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (prevChildren[i]) {
        partent.removeChild(prevChildren[i].el)
      }
    }
  }
}
```

##### 3.1.3.5 总结

```js
function vue2diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    newStartIndex = 0,
    oldStartIndex = prevChildren.length - 1,
    newStartIndex = nextChildren.length - 1,
    oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldStartIndex],
    newStartNode = nextChildren[newStartIndex],
    newEndNode = nextChildren[newStartIndex];
  while (oldStartIndex <= oldStartIndex && newStartIndex <= newStartIndex) {
    if (oldStartNode === undefined) {
      oldStartNode = prevChildren[++oldStartIndex]
    } else if (oldEndNode === undefined) {
      oldEndNode = prevChildren[--oldStartIndex]
    } else if (oldStartNode.key === newStartNode.key) {
      patch(oldStartNode, newStartNode, parent)

      oldStartIndex++
      newStartIndex++
      oldStartNode = prevChildren[oldStartIndex]
      newStartNode = nextChildren[newStartIndex]
    } else if (oldEndNode.key === newEndNode.key) {
      patch(oldEndNode, newEndNode, parent)

      oldStartIndex--
      newStartIndex--
      oldEndNode = prevChildren[oldStartIndex]
      newEndNode = nextChildren[newStartIndex]
    } else if (oldStartNode.key === newEndNode.key) {
      patch(oldStartNode, newEndNode, parent)
      parent.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling)
      oldStartIndex++
      newStartIndex--
      oldStartNode = prevChildren[oldStartIndex]
      newEndNode = nextChildren[newStartIndex]
    } else if (oldEndNode.key === newStartNode.key) {
      patch(oldEndNode, newStartNode, parent)
      parent.insertBefore(oldEndNode.el, oldStartNode.el)
      oldStartIndex--
      newStartIndex++
      oldEndNode = prevChildren[oldStartIndex]
      newStartNode = nextChildren[newStartIndex]
    } else {
      let newKey = newStartNode.key,
        oldIndex = prevChildren.findIndex(child => child && (child.key === newKey));
      if (oldIndex === -1) {
        mount(newStartNode, parent, oldStartNode.el)
      } else {
        let prevNode = prevChildren[oldIndex]
        patch(prevNode, newStartNode, parent)
        parent.insertBefore(prevNode.el, oldStartNode.el)
        prevChildren[oldIndex] = undefined
      }
      newStartIndex++
      newStartNode = nextChildren[newStartIndex]
    }
  }
  if (newStartIndex > newStartIndex) {
    while (oldStartIndex <= oldStartIndex) {
      if (!prevChildren[oldStartIndex]) {
        oldStartIndex++
        continue
      }
      parent.removeChild(prevChildren[oldStartIndex++].el)
    }
  } else if (oldStartIndex > oldStartIndex) {
    while (newStartIndex <= newStartIndex) {
      mount(nextChildren[newStartIndex++], parent, oldStartNode.el)
    }
  }
}
```

#### 3.1.4 缺点

Vue2 是全量 Diff（当数据发生变化，它就会新生成一个DOM树，并和之前的DOM树进行比较，找到不同的节点然后更新），如果层级很深，很消耗内存；

### 3.2 vue3 diff-最长递增子序列

#### 3.2.1 vue3 diff优化点

1. 静态标记 + 非全量 Diff：（Vue 3在创建虚拟DOM树的时候，会根据DOM中的内容会不会发生变化，添加一个静态标记。之后在与上次虚拟节点进行对比的时候，就只会对比这些带有静态标记的节点。）；
2. 使用最长递增子序列优化对比流程，可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作；

#### 3.2.2 实现思路

vue3的diff算法其中有两个理念。第一个是相同的前置与后置元素的预处理；第二个则是最长递增子序列

##### 3.2.2.1 前置与后置的预处理

我们看着两段文字

```js
hello xianzao
hey xianzao
```

我们会发现，这两段文字是有一部分是相同的，这些文字是不需要修改也不需要移动的，真正需要进行修改中间的几个字母，所以diff就变成以下部分

```js
text1: llo
text2: y
```

接下来换成`vnode`：

![vue2-diff具体实现11](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现11.png)

图中的被绿色框起来的节点，他们是不需要移动的，只需要进行打补丁`patch`就可以了。我们把该逻辑写成代码。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  let j = 0,
    prevEnd = prevChildren.length - 1,
    nextEnd = nextChildren.length - 1,
    prevNode = prevChildren[j],
    nextNode = nextChildren[j];
  while (prevNode.key === nextNode.key) {
    patch(prevNode, nextNode, parent)
    j++
    prevNode = prevChildren[j]
    nextNode = nextChildren[j]
  }
  
  prevNode = prevChildren[prevEnd]
  nextNode = prevChildren[nextEnd]
  
  while (prevNode.key === nextNode.key) {
    patch(prevNode, nextNode, parent)
    prevEnd--
    nextEnd--
    prevNode = prevChildren[prevEnd]
    nextNode = prevChildren[nextEnd]
  }
}
```

这时候，我们需要考虑边界情况，一种是j > prevEnd；另一种是j > nextEnd。

![vue2-diff具体实现12](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现12.png)

在上图中，此时j > prevEnd且j <= nextEnd，只需要把新列表中 j 到nextEnd之间剩下的节点插入进去就可以了。相反， 如果j > nextEnd时，把旧列表中 j 到prevEnd之间的节点删除就可以了。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  // ...
  if (j > prevEnd && j <= nextEnd) {
    let nextpos = nextEnd + 1,
      refNode = nextpos >= nextChildren.length
                ? null
                : nextChildren[nextpos].el;
    while(j <= nextEnd) mount(nextChildren[j++], parent, refNode)
    
  } else if (j > nextEnd && j <= prevEnd) {
    while(j <= prevEnd) parent.removeChild(prevChildren[j++].el)
  }
}
```

在while循环时，指针是从两端向内逐渐靠拢的，所以我们应该在循环中就应该去判断边界情况，我们使用label语法，当我们触发边界情况时，退出全部的循环，直接进入判断：

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  let j = 0,
    prevEnd = prevChildren.length - 1,
    nextEnd = nextChildren.length - 1,
    prevNode = prevChildren[j],
    nextNode = nextChildren[j];
  // label语法
  outer: {
    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      j++
      // 循环中如果触发边界情况，直接break，执行outer之后的判断
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[j]
      nextNode = nextChildren[j]
    }

    prevNode = prevChildren[prevEnd]
    nextNode = prevChildren[nextEnd]

    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      prevEnd--
      nextEnd--
      // 循环中如果触发边界情况，直接break，执行outer之后的判断
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[prevEnd]
      nextNode = prevChildren[nextEnd]
    }
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    let nextpos = nextEnd + 1,
      refNode = nextpos >= nextChildren.length
                ? null
                : nextChildren[nextpos].el;
    while(j <= nextEnd) mount(nextChildren[j++], parent, refNode)
    
  } else if (j > nextEnd && j <= prevEnd) {
    while(j <= prevEnd) parent.removeChild(prevChildren[j++].el)
  }
}
```

##### 3.2.2.2 判断是否需要移动

接下来，就是找到移动的节点，然后给他移动到正确的位置

当前/后置的预处理结束后，我们进入真正的diff环节。首先，我们先根据新列表剩余的节点数量，创建一个source数组，并将数组填满-1。

![vue2-diff具体实现13](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现13.png)



```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  outer: {
  // ...
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    // ...
  } else if (j > nextEnd && j <= prevEnd) {
    // ...
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1,     // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1);  // 创建数组，填满-1
     
  }
}
```

source是用来做新旧节点的对应关系的，我们将新节点在旧列表的位置存储在该数组中，我们在根据source计算出它的最长递增子序列用于移动DOM节点。为此，先建立一个对象存储当前新列表中的节点与index的关系，再去旧列表中去找位置。

注意：如果旧节点在新列表中没有的话，直接删除就好。除此之外，我们还需要一个数量表示记录我们已经patch过的节点，如果数量已经与新列表剩余的节点数量一样，那么剩下的旧节点我们就直接删除了就可以了

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  outer: {
  // ...
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    // ...
  } else if (j > nextEnd && j <= prevEnd) {
    // ...
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1,     // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1),  // 创建数组，填满-1
      nextIndexMap = {},                      // 新列表节点与index的映射
      patched = 0;                            // 已更新过的节点的数量
      
    // 保存映射关系  
    for (let i = nextStart; i <= nextEnd; i++) {
      let key = nextChildren[i].key
      nextIndexMap[key] = i
    } 
    
    // 去旧列表找位置
    for (let i = prevStart; i <= prevEnd; i++) {
      let prevNode = prevChildren[i],
      	prevKey = prevNode.key,
        nextIndex = nextIndexMap[prevKey];
      // 新列表中没有该节点 或者 已经更新了全部的新节点，直接删除旧节点
      if (nextIndex === undefind || patched >= nextLeft) {
        parent.removeChild(prevNode.el)
        continue
      }
      // 找到对应的节点
      let nextNode = nextChildren[nextIndex];
      patch(prevNode, nextNode, parent);
      // 给source赋值
      source[nextIndex - nextStart] = i
      patched++
    }
  }
}
```

![vue2-diff具体实现14](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现14.png)

找到位置后，我们观察这个重新赋值后的source，我们可以看出，如果是全新的节点的话，其在source数组中对应的值就是初始的-1，通过这一步我们可以区分出来哪个为全新的节点，哪个是可复用的。
其次，我们要判断是否需要移动，如果我们找到的index是一直递增的，说明不需要移动任何节点。我们通过设置一个变量来保存是否需要移动的状态。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  outer: {
  // ...
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    // ...
  } else if (j > nextEnd && j <= prevEnd) {
    // ...
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1,     // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1),  // 创建数组，填满-1
      nextIndexMap = {},                      // 新列表节点与index的映射
      patched = 0,
      move = false,                           // 是否移动
      lastIndex = 0;                          // 记录上一次的位置
      
    // 保存映射关系  
    for (let i = nextStart; i <= nextEnd; i++) {
      let key = nextChildren[i].key
      nextIndexMap[key] = i
    } 
    
    // 去旧列表找位置
    for (let i = prevStart; i <= prevEnd; i++) {
      let prevNode = prevChildren[i],
      	prevKey = prevNode.key,
        nextIndex = nextIndexMap[prevKey];
      // 新列表中没有该节点 或者 已经更新了全部的新节点，直接删除旧节点
      if (nextIndex === undefind || patched >= nextLeft) {
        parent.removeChild(prevNode.el)
        continue
      }
      // 找到对应的节点
      let nextNode = nextChildren[nextIndex];
      patch(prevNode, nextNode, parent);
      // 给source赋值
      source[nextIndex - nextStart] = i
      patched++
      
      // 递增方法，判断是否需要移动
      if (nextIndex < lastIndex) {
      	move = true
      } else {
      	lastIndex = nextIndex
      }
    }
    
    if (move) {
    
    // 需要移动
    } else {
	
    //不需要移动
    }
  }
}
```

##### 3.3.2.3 DOM如何移动

判断完是否需要移动后，我们就需要考虑如何移动了。一旦需要进行DOM移动，我们首先要做的就是找到source的最长递增子序列。vue2和vue3响应式的区别

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  if (move) {
	const seq = lis(source); // [0, 1]
  // 需要移动
  } else {

  //不需要移动
  }
}
```

最长递增子序列：给定一个数值序列，找到它的一个子序列，并且子序列中的值是递增的，子序列中的元素在原序列中不一定连续。

例如给定数值序列为：[ 0, 8, 4, 12 ]。

那么它的最长递增子序列就是：[0, 8, 12]。 

当然答案可能有多种情况，例如：[0, 4, 12] 也是可以的。

上面的代码中，我们调用lis 函数求出数组source的最长递增子序列为[ 0, 1 ]。我们知道 source 数组的值为 [2, 3, 1, -1]，很显然最长递增子序列应该是[ 2, 3 ]，计算出的结果是[ 0, 1 ]代表的是最长递增子序列中的各个元素在source数组中的位置索引，如下图所示：

![vue2-diff具体实现15](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现15.png)

我们根据source，对新列表进行重新编号，并找出了最长递增子序列。

我们从后向前进行遍历source每一项。此时会出现三种情况：

1. 当前的值为-1，这说明该节点是全新的节点，又由于我们是从后向前遍历，我们直接创建好DOM节点插入到队尾就可以了；
2. 当前的索引为最长递增子序列中的值，也就是i === seq[j]，这说说明该节点不需要移动；
3. 当前的索引不是最长递增子序列中的值，那么说明该DOM节点需要移动，这里也很好理解，我们也是直接将DOM节点插入到队尾就可以了，因为队尾是排好序的；

![vue2-diff具体实现16](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现16.png)

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  if (move) {
   // 需要移动
	const seq = lis(source); // [0, 1]
    let j = seq.length - 1;  // 最长子序列的指针
    // 从后向前遍历
    for (let i = nextLeft - 1； i >= 0; i--) {
      let pos = nextStart + i, // 对应新列表的index
        nextNode = nextChildren[pos],	// 找到vnode
      	nextPos = pos + 1，    // 下一个节点的位置，用于移动DOM
        refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el, //DOM节点
        cur = source[i];  // 当前source的值，用来判断节点是否需要移动
    
      if (cur === -1) {
        // 情况1，该节点是全新节点
      	mount(nextNode, parent, refNode)
      } else if (cur === seq[j]) {
        // 情况2，是递增子序列，该节点不需要移动
        // 让j指向下一个
        j--
      } else {
        // 情况3，不是递增子序列，该节点需要移动
        parent.insetBefore(nextNode.el, refNode)
      }
    }
 
  } else {
  //不需要移动
  
  }
}
```

说完了需要移动的情况，再说说不需要移动的情况。如果不需要移动的话，我们只需要判断是否有全新的节点给他添加进去就可以了。具体代码如下：

```js

function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  if (move) {
	const seq = lis(source); // [0, 1]
    let j = seq.length - 1;  // 最长子序列的指针
    // 从后向前遍历
    for (let i = nextLeft - 1； i >= 0; i--) {
      let pos = nextStart + i, // 对应新列表的index
        nextNode = nextChildren[pos],	// 找到vnode
      	nextPos = pos + 1，    // 下一个节点的位置，用于移动DOM
        refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el, //DOM节点
        cur = source[i];  // 当前source的值，用来判断节点是否需要移动
    
      if (cur === -1) {
        // 情况1，该节点是全新节点
      	mount(nextNode, parent, refNode)
      } else if (cur === seq[j]) {
        // 情况2，是递增子序列，该节点不需要移动
        // 让j指向下一个
        j--
      } else {
        // 情况3，不是递增子序列，该节点需要移动
        parent.insetBefore(nextNode.el, refNode)
      }
    }
  } else {
    //不需要移动
    for (let i = nextLeft - 1； i >= 0; i--) {
      let cur = source[i];  // 当前source的值，用来判断节点是否需要移动
    
      if (cur === -1) {
       let pos = nextStart + i, // 对应新列表的index
          nextNode = nextChildren[pos],	// 找到vnode
          nextPos = pos + 1，    // 下一个节点的位置，用于移动DOM
          refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el, //DOM节点
      	mount(nextNode, parent, refNode)
      }
    }
  }
}
```

#### 3.2.3 最长递增子序列

强烈建议看leetcode原题解法：https://leetcode.cn/problems/longest-increasing-subsequence/

我们以该数组为例

```js
[10,9,2,5,3,8,7,13]
```

我们可以使用动态规划的思想考虑这个问题。动态规划的思想是将一个大的问题分解成多个小的子问题，并尝试得到这些子问题的最优解，子问题的最优解有可能会在更大的问题中被利用，这样通过小问题的最优解最终求得大问题的最优解。

我们先假设只有一个值的数组[13]，那么该数组的最长递增子序列就是[13]自己本身，其长度为1。那么我们认为每一项的递增序列的长度值均为1

那么我们这次给数组增加一个值[7, 13], 由于7 < 13，所以该数组的最长递增子序列是[7, 13]，那么该长度为2。那么我们是否可以认为，当[7]小于[13]时，以[7]为头的递增序列的长度是，[7]的长度和[13]的长度的和，即1 + 1 = 2。

ok，我们基于这种思想来给计算一下该数组。我们先将每个值的初始赋值为1

![vue2-diff具体实现17](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现17.png)

首先 7 < 13 那么7对应的长度就是13的长度再加1，1 + 1 = 2

![vue2-diff具体实现18](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现18.png)



继续，我们对比8。我们首先和7比，发现不满足递增，但是没关系我们还可以继续和13比，8 < 13满足递增，那么8的长度也是13的长度在加一，长度为2

![vue2-diff具体实现19](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现19.png)



我们再对比3，我们先让其与8进行对比，3 < 8，那么3的长度是8的长度加一，此时3的长度为3。但是还没结束，我们还需要让3与7对比。同样3 < 7，此时我们需要在计算出一个长度是7的长度加一同样是3，我们对比两个长度，如果原本的长度没有本次计算出的长度值大的话，我们进行替换，反之则我们保留原本的值。由于3 === 3，我们选择不替换。最后，我们让3与13进行对比，同样的3 < 13，此时计算出的长度为2，比原本的长度3要小，我们选择保留原本的值。

![vue2-diff具体实现20](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现20.png)



![vue2-diff具体实现21](/Volumes/F/zyl-study/web-zhuawa/20221203/vue2-diff具体实现21.png)

我们从中取最大的值4，该值代表的最长递增子序列的个数。代码如下：

```js
function lis(arr) {
  let len = arr.length,
    dp = new Array(len).fill(1); // 用于保存长度
  for (let i = len - 1; i >= 0; i--) {
    let cur = arr[i]
    for(let j = i + 1; j < len; j++) {
      let next = arr[j]
      // 如果是递增 取更大的长度值
      if (cur < next) dp[i] = Math.max(dp[j]+1, dp[i])
    }
  }
  return Math.max(...dp)
}
```

在vue3.0中，我们需要的是最长递增子序列在原本数组中的索引。所以我们还需要在创建一个数组用于保存每个值的最长子序列所对应在数组中的index。具体代码如下

```js
function lis(arr) {
  let len = arr.length,
    res = [],
    dp = new Array(len).fill(1);
  // 存默认index
  for (let i = 0; i < len; i++) {
    res.push([i])
  }
  for (let i = len - 1; i >= 0; i--) {
    let cur = arr[i],
      nextIndex = undefined;
    // 如果为-1 直接跳过，因为-1代表的是新节点，不需要进行排序
    if (cur === -1) continue
    for (let j = i + 1; j < len; j++) {
      let next = arr[j]
      // 满足递增条件
      if (cur < next) {
        let max = dp[j] + 1
        // 当前长度是否比原本的长度要大
        if (max > dp[i]) {
          dp[i] = max
          nextIndex = j
        }
      }
    }
    // 记录满足条件的值，对应在数组中的index
    if (nextIndex !== undefined) res[i].push(...res[nextIndex])
  }
  let index = dp.reduce((prev, cur, i, arr) => cur > arr[prev] ? i : prev, dp.length - 1)
  // 返回最长的递增子序列的index
  return result[index]
}
```

# Vue Router 源码解析（1/2）

https://www.yuque.com/lpldplws/web/gkiov622439zf64o?singleDoc# 《Vue Router源码解析(1/2)》 密码：zdfy

## 1.课程目标

1. 掌握Vue Router的核心源码；
2. 掌握前端中一个完整的Router需要实现怎样的效果；

## 2.课程大纲

- vue router源码解析

## 3.前置内容

1. 课前准备：将Vue Router官网中[教程](https://router.vuejs.org/zh/guide/)通读一遍；
2. 版本选择：选择的Vue Router版本为[V4.0.15](https://github.com/vuejs/router/releases/tag/v4.0.15)，跟目前最新版本除了极少部分调整外无任何区别；

## 4.router.install解析

### 4.1 vue-router的使用

在介绍`router.install`之前，我们先看下vue3中是如何使用`vue-router`的：

```js
import { createApp } from 'vue'
import { createRouter } from 'vue-router'

const router = createRouter({ ... })
const app = createApp({})

app.use(router).mount('#app')
```

在执行app.use的过程中，会执行router.install,并传入app实例（即安装插件）。那么详细看一下router.install的过程

### 4.2 router.install

Router.install源码位于createRouter中，文件位置src/router.ts

```typescript
install(app: App) {
  const router = this
  app.component('RouterLink', RouterLink)
  app.component('RouterView', RouterView)

  app.config.globalProperties.$router = router
  Object.defineProperty(app.config.globalProperties, '$route', {
    enumerable: true,
    get: () => unref(currentRoute),
  })

  if (
    isBrowser &&
    !started &&
    currentRoute.value === START_LOCATION_NORMALIZED
  ) {
    started = true
    push(routerHistory.location).catch(err => {
      if (__DEV__) warn('Unexpected error when starting the router:', err)
    })
  }

  const reactiveRoute = {} as {
    [k in keyof RouteLocationNormalizedLoaded]: ComputedRef<
      RouteLocationNormalizedLoaded[k]
    >
  }
  for (const key in START_LOCATION_NORMALIZED) {
    reactiveRoute[key] = computed(() => currentRoute.value[key])
  }

  app.provide(routerKey, router)
  app.provide(routeLocationKey, reactive(reactiveRoute))
  app.provide(routerViewLocationKey, currentRoute)

  const unmountApp = app.unmount
  installedApps.add(app)
  app.unmount = function () {
    installedApps.delete(app)
    if (installedApps.size < 1) {
      pendingLocation = START_LOCATION_NORMALIZED
      removeHistoryListener && removeHistoryListener()
      removeHistoryListener = null
      currentRoute.value = START_LOCATION_NORMALIZED
      started = false
      ready = false
    }
    unmountApp()
  }

  if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
    addDevtools(app, router, matcher)
  }
}
```

在intall中，首先会注册routerLink与routerview两大组件

```js
app.component('RouterLink', RouterLink)
app.component('RouterView', RouterView)
```

然后会将当前的`router`对象赋值给`app.config.globalProperties.$router`；

同时拦截了`app.config.globalProperties.$route`的get操作，使`app.config.globalProperties.$route`始终获取`unref(currentRoute)`，`unref(currentRoute)`就是当前路由的一些信息（这里就是Vue源码中`unref`的实现，可以看上节课关于Vue源码的讲解），这里我们先不深究，在后续章节中会详细介绍。

这样一来，就可以在组件中通过`this.$router`获取router，通过`this.$route`来获取当前路由信息。

```js
app.config.globalProperties.$router = router
Object.defineProperty(app.config.globalProperties, '$route', {
  enumerable: true,
  get: () => unref(currentRoute),
})
```

紧接着会根据浏览器url地址进行第一次跳转（如果是浏览器环境）。

```js
if (
  isBrowser &&
  // 用于初始导航客户端，避免在多个应用中使用路由器时多次push
  !started &&
  currentRoute.value === START_LOCATION_NORMALIZED
) {
  started = true
  push(routerHistory.location).catch(err => {
    if (__DEV__) warn('Unexpected error when starting the router:', err)
  })
}
```

紧接着声明了一个`reactiveRoute`响应式对象，并遍历`START_LOCATION_NORMALIZED`对象，依次将`START_LOCATION_NORMALIZED`中的key复制到`reactiveRoute`中，同时将`reactiveRoute`中key对应的值变成一个计算属性。

这里`START_LOCATION_NORMALIZED`是`vue-router`提供的初始路由位置，通过`START_LOCATION_NORMALIZED`构建一个响应式的路由`reactiveRoute`，方便对路由变化进行追踪。

```js
START_LOCATION_NORMALIZED const reactiveRoute = {} as {
  [k in keyof RouteLocationNormalizedLoaded]: ComputedRef<
    RouteLocationNormalizedLoaded[k]
  >
}
for (const key in START_LOCATION_NORMALIZED) {
  reactiveRoute[key] = computed(() => currentRoute.value[key])
}

app.provide(routerKey, router)
app.provide(routeLocationKey, reactive(reactiveRoute))
app.provide(routerViewLocationKey, currentRoute)
```

这里使用`provide`又将`router`、`currentRoute`注入到app实例中，你可能会疑问，在前面过程中已经可以在组件中使用`this.$router`，`this.$route`获取到对应数据了，这里为什么又使用`provide`再次注入呢？这是因为在`setup`中式无法访问`this`的，这时通过`inject`就可以方便获取`router`及`currentRoute`。

最后会将app放入一个哈希表中，然后重写`app.unmount`。当app卸载时，首先从哈希表中删除app，然后判断哈希表的大小是否小于1，如果小于1代表已经没有实例使用`vue-router`了，那么这时就需要重置一些状态、移除一些监听。

```js
const unmountApp = app.unmount
installedApps.add(app)
app.unmount = function () {
  installedApps.delete(app)
  if (installedApps.size < 1) {
    pendingLocation = START_LOCATION_NORMALIZED
    removeHistoryListener && removeHistoryListener()
    removeHistoryListener = null
    currentRoute.value = START_LOCATION_NORMALIZED
    started = false
    ready = false
  }
  unmountApp()
}
```

## 4.3总结

通过分析，`router.install`主要做以下几件事：

1. 注册`RouterLink`、`RouterView`组件；
2. 设置全局属性`$router`、`$route`；
3. 根据地址栏进行首次的路由跳转；
4. 向app中注入一些路由相关信息，如路由实例、响应式的当前路由信息对象；
5. 拦截`app.unmount`方法，在卸载之前重置一些属性、删除一些监听函数；

## 5.createHistory 解析

在`vue-router 4.x`中创建`router`时，需要使用`createWebHistory`、`createWebHashHistory`、`createMemoryHistory`中的一个创建一个`history`，如下：

```js
```



https://www.yuque.com/lpldplws/web/mo0sqg37epmtp41w?singleDoc# 《Vue Router源码解析(2/2)》 密码：bq3h
https://www.yuque.com/lpldplws/web/qpafpkpkcfufkgtl?singleDoc# 《Vue实战》 密码：fw42

https://www.yuque.com/lpldplws/web/abbfgk?singleDoc# 《编译器》 密码：uteo

# React

https://react.iamkasong.com/

由react控制的值是受控组件，无法控制的值是非受控组件

比如

<input value={value2}>是受控组件

<input defaultValue={value2}>是非受控组件

flushSync ???





https://github.com/XiNiHa/streaming-ssr-showcase 流式渲染的例子
