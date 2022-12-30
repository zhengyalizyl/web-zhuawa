# javascript高级用法(1/2)

## 原型&原型链

函数 prototype指向的是一个对象，这个对象是调用该构造函数创建的实例的原型

原型：每一个js对象在创建的时候会关联另一个对象，这个对象就是原型，都会从原型上继承属性

读取实例的属性时，如果找不到，就会找原型的属性，如果还找不到，就会找原型的原型，直到找到为止

## 词法作用域 动态作用域

作用域：定义了如何查找变量，当前执行的代码有没有权限访问变量

词法作用域 静态作用域

-词法作用域:在函数定义时确定的

-动态作用域：在函数调用时确定的

execute context stack执行上下文栈，管理执行上下文(ECS)---先进后出(执行的时候才会压入栈)

![ecsstack-case1](/Volumes/F/zyl-study/web-zhuawa/20221203/ecsstack-case1.jpeg)



![](/Volumes/F/zyl-study/web-zhuawa/20221203/ecsstack-case2.jpeg)

变量对象

Js执行代码，会创建执行上下文

1.变量对象

2.作用域链

3.this

变量对象:是与执行上下文相关的数据作用域，存储上下文中的定义的变量

全局上下文的变量

在js里，全局上下文的变量就是全局对象window

函数上下文的变量

## 作用域链

多个执行上下文的变量对象构成的链表是作用域链

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
checkscope();
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

第一步：改变this的指向,将函数设为对象的属性

第二步：执行该函数

第三步：删除该函数

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
         return self.apply(this instanceof fBound?this:context，args.concat(bindArgs))//这里的this,指的是构造函数的this
    }
    fnop.prototype=this.prototype;//
    fBound.prototype=new fnop();//继承构造函数的原型
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

# promise规范及应用





