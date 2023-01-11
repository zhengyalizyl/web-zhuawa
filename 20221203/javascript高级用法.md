# javascript高级用法(1/2)

## 原型&原型链

函数 prototype指向的是一个对象，这个对象是调用该构造函数创建的实例的原型

### 原型：每一个js对象在创建的时候会关联另一个对象，这个对象就是原型，都会从原型上继承属性

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

多个执行上下文的变量对象构成的链表是作用域链

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

1.amd是依赖前置，cmd依赖就近

2.amd：返回return ,cmd：exports出去的

## esm(es module  es6)

在编译的时候，能确定模块的依赖关系，以及导入与导出

Commons amd都是运行时

### ES module和 commonjs区别

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



# 浏览器事件&请求

stopPropagation:停止事件在dom层上的事件传播，包括捕获和冒泡

preventDefault:停止点击a标签跳转url

# JS垃圾回收与内存泄漏

## GC策略

可达性：通过某种方式能够访问或者说引用的内存地址，具有可达性的数据，不会被垃圾回收

GC：js引擎周期性的寻找不具有可达性的内存空间进行释放

周期性原因：开销太大

### 1.标记清除 mark-sweep

- 标记：针对所有的活动对象(被引用到的内存地址)进行标记
- 清除：把没有标记的非活动对象 进行清除

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

标记整理算法：mark-compact

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

## 内存泄漏

# js运行机制

## 进程

https://www.yuque.com/lpldplws/atomml/wa93b6?singleDoc# 《阿里前端面试官带你深度模拟前端专家面试》 密码：xord

1.进程：cpu资源分配的最小单位

- 独立运行，运行中的程序
- 有自己的资源空间

线程

2.cpu调度的最小单元

3.协程

调度和切换

## 为什么js是单线程？

操作dom ->单线程

worker线程 web worker不能操作dom

## chrome浏览器

1.browser进程

2.第三方插件进程

3.GPU 3D进程

4.renderer 渲染进程

4.1 GUI渲染线程：parser Html Css Dom CSSOM ->render tree

- repaint 重绘
- reflow 回流/重排 resize

4.2 js引擎线程

- v8引擎 执行js脚本程序 解析js，远行代码

GUI和js引擎是互斥的，相同的时间下，只能运行一个

```js
<script src="./script.js" async></script>
<scipt src="./script.js" defer></script>
```

async和defer的区别？





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

# ts

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
obj.toString();
```

## interface

对行为的一种抽象，具体行为由类实现

只读和js的引用是不同的

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

- entry入口
- 













