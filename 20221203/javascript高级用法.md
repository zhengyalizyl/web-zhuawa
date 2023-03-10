

# javascript高级用法(1/2)

https://vgbixa7nr9.feishu.cn/drive/folder/fldcnuszmspfoSJwl5QFtPrsCGg

https://www.yuque.com/lpldplws/atomml/tmbe7ykqmslqszhe?singleDoc# 《JavaScript高级用法(1/2)》 密码：bwxh

## 1.原型&原型链

### 1.1 构造函数创建对象

我们先使用构造函数创建一个对象：

```js
function Person() {

}
var person = new Person();
person.name = 'xianzao';
console.log(person.name) // xianzao
```

在这个例子中，Person 就是一个构造函数，我们使用 new 创建了一个实例对象 person。

### 1.2 prototype

每个函数都有一个 `prototype` 属性，比如：

```js
function Person() {

}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'xianzao';

var person1 = new Person();
var person2 = new Person();

console.log(person1.name) // xianzao
console.log(person2.name) // xianzao
```

那这个函数的 `prototype` 属性到底指向的是什么呢？是这个函数的原型吗？

其实，函数的 `prototype` 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是这个例子中的 `person1` 和 `person2` 的原型。

那什么是原型呢？你可以这样理解：每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

用一张图表示构造函数和实例原型之间的关系：

![构造函数和实例关系](/Volumes/F/zyl-study/web-zhuawa/20221203/构造函数和实例关系.png)

这里用 Object.prototype 表示实例原型。

那么该怎么表示实例与实例原型，也就是 `person` 和 Person.`prototype` 之间的关系呢？

### 1.3  __proto__

原型：每一个js对象(null除外)在创建的时候会关联另一个对象，这个对象就是原型，都会从原型上继承属性

这是每一个JavaScript对象(除了 null )都具有的一个属性，叫`__proto__`，这个属性会指向该对象的原型。

函数 prototype指向的是一个对象，这个对象是调用该构造函数创建的实例的原型

```js
function Person() {

}
var person = new Person();

console.log(person.__proto__ === Person.prototype); // true
```

![_proto_原型指向图](/Volumes/F/zyl-study/web-zhuawa/20221203/_proto_原型指向图.png)

既然实例对象和构造函数都可以指向原型，那么原型是否有属性指向构造函数或者实例呢？

### 1.4 contructor   

指向实例倒是没有，因为一个构造函数可以生成多个实例，但是原型指向构造函数是有的：`constructor`，每个原型都有一个 `constructor` 属性指向关联的构造函数

```js
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/constructor原型指向图.png" alt="constructor原型指向图" style="zoom:67%;" />

所以，这里可以得到

```js
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true

console.log(Person.prototype.constructor == Person) // true

console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

### 1.5 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

举个例子：

```js
function Person() {

}

Person.prototype.name = 'xianzao';

var person = new Person();

person.name = 'zaoxian';
console.log(person.name) // zaoxian

delete person.name;
console.log(person.name) // xianzao
```

在这个例子中，我们给实例对象 person 添加了 name 属性，当我们打印 `person.name` 的时候，结果自然为 zaoxian。

但是当我们删除了 person 的 name 属性时，读取 `person.name`，从 person 对象中找不到 name 属性就会从 person 的原型也就是 `person.__proto__` ，也就是 `Person.prototype`中查找，结果为 `xianzao`。

### 1.6原型的原型

如果在原型上还没有找到呢？原型的原型又是什么呢？

```js
var obj = new Object();
obj.name = 'xianzao'
console.log(obj.name) // xianzao
```

其实原型对象就是通过 Object 构造函数生成的，结合之前所讲，实例的 `__proto__` 指向构造函数的 `prototype` ，所以我们再更新下关系图：

<img src="https://camo.githubusercontent.com/9a69b0f03116884e80cf566f8542cf014a4dd043fce6ce030d615040461f4e5a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065352e706e67" alt="img" style="zoom:50%;" />

其中，蓝色为原型链

### 1.8其他

#### 1.8.1 constructor

首先是contructor属性

```js
function Person() {

}
var person = new Person();

console.log(person.constructor === Person); // true
```

当获取 `person.constructor` 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，会从 person 的原型也就是 `Person.prototype` 中读取，正好原型中有该属性，所以：

```js
person.constructor === Person.prototype.constructor
```

#### 1.8.2 __proto__

绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 `Person.prototype` 中，实际上，它是来自于 `Object.prototype` ，与其说是一个属性，不如说是一个 `getter/setter`，当使用 `obj.__proto__` 时，可以理解成返回了 `Object.getPrototypeOf(obj)`。

#### 1.8.3 继承

关于继承，前面提到“每一个对象都会从原型‘继承’属性”，实际上，继承是一个十分具有迷惑性的说法，引用《你不知道的JavaScript》中的话，就是：

继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

## 2. 词法作用域和动态作用域

### 2.1 作用域

作用域是指程序源代码中定义变量的区域。

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

JavaScript 采用词法作用域`(lexical scoping`)，也就是静态作用域。

### 2.2 静态作用域和动态作用域

因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ???
```

假设JavaScript采用静态作用域，让我们分析下执行过程：

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

假设JavaScript采用动态作用域，让我们分析下执行过程：

执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。

### 2.3 动态作用域

什么语言是动态作用域？

bash 就是动态作用域，不信的话，把下面的脚本存成例如 scope.bash，然后进入相应的目录，用命令行执行 bash ./scope.bash，看看打印的值是多少。

```js
value=1
function foo () {
    echo $value;
}
function bar () {
    local value=2;
    foo;
}
bar
```

### 2.4 思考

看一下面试题：

```js
// case 1
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

// case 2
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

两段代码各自的执行结果是多少？

local scope

因为JavaScript采用的是词法作用域，函数的作用域基于函数创建的位置。

而引用《JavaScript权威指南》的回答就是：

JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。

但是在这里真正想让大家思考的是：

虽然两段代码执行的结果一样，但是两段代码究竟有哪些不同呢？

## 3.执行上下文

### 3.1 顺序执行

写过 JavaScript 的开发者都会有个直观的印象，那就是顺序执行：

```js
var foo = function () {

    console.log('foo1');

}

foo();  // foo1

var foo = function () {

    console.log('foo2');

}

foo(); // foo2
```

那这段呢？

```js
function foo() {

    console.log('foo1');

}

foo();  // foo2

function foo() {

    console.log('foo2');

}

foo(); // foo2，这里function foo(){
   // console.log('foo2')
//}会将//function foo(){
   // console.log('foo1')
//}覆盖掉

```

打印的结果却是两个 foo2。

这是因为 JavaScript 引擎并非一行一行地分析和执行程序，而是一段一段地分析执行。当执行一段代码的时候，会进行一个“准备工作”，那这个“一段一段”中的“段”究竟是怎么划分的呢？

到底JavaScript引擎遇到一段怎样的代码时才会做“准备工作”呢？

```js
console.log(add2(1,1)); //输出2
function add2(a,b){
    return a+b;
}
console.log(add1(1,1));  //报错：add1 is not a function
var add1 = function(a,b){
    return a+b;
}

// 用函数语句创建的函数add2，函数名称和函数体均被提前，在声明它之前就使用它。
// 但是使用var表达式定义函数add1，只有变量声明提前了，变量初始化代码仍然在原来的位置，没法提前执行。
```

### 2.2  可执行代码

这就要说到 JavaScript 的可执行代码(`executable code`)的类型有哪些了？

其实很简单，就三种，全局代码、函数代码、eval代码。

举个例子，当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，让我们用个更专业一点的说法，就叫做"执行上下文(`execution context`)"。

### 2.3 执行上下文栈

JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文

为了模拟执行上下文栈的行为，让我们定义执行上下文栈是一个数组：

```js
ECStack = [];
```

试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文，我们用 `globalContext` 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前， ECStack 最底部永远有个 `globalContext`：

```js
ECStack = [
    globalContext
];
```

 当JavaScript 遇到下面的这段代码了：

```js
function fun3() {
    console.log('fun3')
}

function fun2() {
    fun3();
}

function fun1() {
    fun2();
}

fun1();
```

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。知道了这样的工作原理，让我们来看看如何处理上面这段代码：

```js
// 伪代码

// fun1()
ECStack.push(<fun1> functionContext);

// fun1中竟然调用了fun2，还要创建fun2的执行上下文
ECStack.push(<fun2> functionContext);

// 擦，fun2还调用了fun3！
ECStack.push(<fun3> functionContext);

// fun3执行完毕
ECStack.pop();

// fun2执行完毕
ECStack.pop();

// fun1执行完毕
ECStack.pop();

// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```

### 2.4 回顾上文

```js
// case 1
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

// case 2
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

两段代码执行的结果一样，但是两段代码究竟有哪些不同呢？

答案就是执行上下文栈的变化不一样。

模拟第一段代码：

```js
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```

模拟第二段

```js
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```

这就是上文说到的区别。

## 4. 变量对象

### 4.1 基础

当 JavaScript 代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：

- 变量对象(`Variable object`，VO)；
- 作用域链(`Scope chain`)；
- this；

这里着重讲变量对象的内容

### 4.2 变量对象

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。

因为不同执行上下文下的变量对象稍有不同，所以我们来聊聊全局上下文下的变量对象和函数上下文下的变量对象。

### 4.3 全局上下文

1. 全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。
2. 在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。
3. 例如，当JavaScript 代码引用 parseInt() 函数时，它引用的是全局对象的 parseInt 属性。全局对象是作用域链的头，还意味着在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。

简单点说：

1. 可以通过 this 引用，在客户端 JavaScript 中，全局对象就是 Window 对象。

```js
console.log(this);
```

2. 全局对象是由 Object 构造函数实例化的一个对象。

```js
console.log(this instanceof Object);
```

3. 预定义的属性是否可用

```js
console.log(Math.random());
console.log(this.Math.random());
```

4. 作为全局变量的宿主

```js
var a = 1;
console.log(this.a);
```

5. 客户端 JavaScript 中，全局对象有 window 属性指向自身

```js
var a = 1;
console.log(window.a);

this.window.b = 2;
console.log(this.b);
```

综上，对JS而言，全局上下文中的变量对象就是全局对象。

### 4.4 函数上下文

在函数上下文中，我们用活动对象(`activation object`, AO)来表示变量对象。

活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

### 4.5 执行过程

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

1. 进入执行上下文；
2. 代码执行；

#### 4.5.1 进入执行上下文

当进入执行上下文时，这时候还没有执行代码，
变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)
   - 由名称和对应值组成的一个变量对象的属性被创建；
   - 没有实参，属性值设为 undefined；

2. 函数声明
   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建；
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性；

3. 变量声明
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性；

举个例子：

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

#### 4.5.2 代码执行

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

到这里变量对象的创建过程就介绍完了，让我们简洁的总结我们上述所说：

1. 全局上下文的变量对象初始化是全局对象；
2. 函数上下文的变量对象初始化只包括 Arguments 对象；
3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值；
4. 在代码执行阶段，会再次修改变量对象的属性值；

#### 4.5.3 思考题

```js
function foo() {
    console.log(a);
    a = 1;
}

foo(); // ???

function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
```

第一段会报错：`Uncaught ReferenceError: a is not defined`。

第二段会打印：1。

这是因为函数中的 "a" 并没有通过 var 关键字声明，所有不会被存放在 AO 中。

第一段执行 console 的时候， AO 的值是：

```js
AO = {
    arguments: {
        length: 0
    }
}
```

没有 a 的值，然后就会到全局去找，全局也没有，所以会报错。

当第二段执行 console 的时候，全局对象已经被赋予了 a 属性，这时候就可以从全局找到 a 的值，所以会打印 1。

```js
console.log(foo);

function foo(){
    console.log("foo");
}

var foo = 1;
```

会打印函数，而不是 undefined 。

这是因为在进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。

## 5. 作用域链

上文讲到，当JavaScript代码执行一段可执行代码(`executable code`)时，会创建对应的执行上下文(`execution context`)。

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

本节讲作用域链。

### 5.1 作用域链

当查找变量的时候，会先从当前上下⽂的变量对象中查找，如果没有找到，就会从⽗级(词法层⾯上的⽗级)执⾏上下⽂的变量对象中查找，⼀直找到全局上下⽂的变量对象，也就是全局对象。这样由多个执⾏上下⽂的变量对象构成的链表就叫做作⽤域链。

### 5.2 函数创建

上文的词法作用域与动态作用域中讲到，函数的作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！

举个例子：

```js
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的[[scope]]为：

```js
foo.[[scope]]=[
    globalContext.AO
]

bar.[[scope]]=[
    fooContext.AO
    globalContext.VO
]
```

### 5.3 函数激活

当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。
这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

### 5.4 总结

结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```js
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```

执行过程如下：

1. checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

```js
checkscope.[[scope]] = [
    globalContext.VO
];
```

2. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```js
ECStack = [
    checkscopeContext,
    globalContext
];
```

3. checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

```js
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4. 第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5. 第三步： 将活动对象压入 checkscope 作用域链顶端

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: [AO, [[Scope]]]
}
```

6. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: 'local scope'
    },
    Scope: [AO, [[Scope]]]
}
```

7. 查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```js
ECStack = [
  globalContext
];
```

## 6. this

对于每个执行上下文，都有三个重要属性

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

本节主要讲this

1.在浏览器下，全局this是window

2.函数this,例如show();//window如果是use strict,则为undefined

3.对象this：

- 作为普通函数调用，指向全局对象
- 作为构造函数调用时，this指向new出来的对象
- 作为对象方法调用时，this指向上级对象
- apply,call,bind调用this指向其绑定的对象

箭头函数this的指向是定义该函数时所在作用域指向的对象

### 6.1 Types

Types are further subclassified into ECMAScript language types and specification types.

An ECMAScript language type corresponds to values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Number, and Object.

A specification type corresponds to meta-values that are used within algorithms to describe the semantics of ECMAScript language constructs and ECMAScript language types. The specification types are Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, and Environment Record.

我们简单的翻译一下：

ECMAScript 的类型分为语言类型和规范类型。

ECMAScript 语言类型是开发者直接使用 ECMAScript 可以操作的。其实就是我们常说的Undefined, Null, Boolean, String, Number, 和 Object。

而规范类型相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。规范类型包括：Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。

我们只要知道在 ECMAScript 规范中还有一种只存在于规范中的类型，它们的作用是用来描述语言底层行为逻辑。

这里要讲的重点是便是其中的 Reference 类型。它与 this 的指向有着密切的关联。

### 6.2 Reference

那什么又是 Reference ？

The Reference type is used to explain the behaviour of such operators as delete, typeof, and the assignment operators.

所以 Reference 类型就是用来解释诸如 delete、typeof 以及赋值等操作行为的。

这里的 Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。

再看接下来的这段具体介绍 Reference 的内容

A Reference is a resolved name binding.
A Reference consists of three components, the base value, the referenced name and the Boolean valued strict reference flag.
The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record (10.2.1).
A base value of undefined indicates that the reference could not be resolved to a binding. The referenced name is a String.

这段讲述了 Reference 的构成，由三个组成部分，分别是：

- base value；

- referenced name；

- strict reference；

可是这些到底是什么呢？

我们简单的理解的话：

base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。

referenced name 就是属性的名称。

举个例子：

```js
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```

```js
var foo = {
    bar: function () {
        return this;
    }
};
 
foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};
```

而且规范中还提供了获取 Reference 组成部分的方法，比如 GetBase 和 IsPropertyReference。

#### 6.2.1 GetBase

GetBase(V). Returns the base value component of the reference V.

返回 reference 的 base value。

```js
var foo = 1;

var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

GetValue(fooReference) // 1;
```

GetValue 返回对象属性真正的值，但是，调用 GetValue，返回的将是具体的值，而不再是一个 Reference

#### 6.2.2 IsPropertyReference

IsPropertyReference(V). Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.

如果 base value 是一个对象，就返回true。

### 6.3 如何确定this的值

关于 Reference 讲了那么多，为什么要讲 Reference 呢？到底 Reference 跟本文的主题 this 有哪些关联呢？

- Let ref be the result of evaluating MemberExpression；
- if Type(ref) is Reference, then

- - If IsPropertyReference(ref) is true, then 
  - Let thisValue be GetBase(ref). 

- Else, the base of ref is an Environment Record 

- - Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref). 

- Else, Type(ref) is not Reference.
- Let thisValue be undefined. 

让我们描述一下：

1. 计算 MemberExpression 的结果赋值给 ref；
2. 判断 ref 是不是一个 Reference 类型；

1. 1. 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref) 
   2. 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref) 
   3. 如果 ref 不是 Reference，那么 this 的值为 undefined；

### 6.4 具体分析

 

#### 6.4.1 计算 MemberExpression 的结果赋值给 ref 

什么是 MemberExpression？看规范 11.2 Left-Hand-Side Expressions：

MemberExpression :

- PrimaryExpression // 原始表达式

- FunctionExpression // 函数定义表达式

- MemberExpression [ Expression ] // 属性访问表达式

- MemberExpression . IdentifierName // 属性访问表达式

- new MemberExpression Arguments // 对象创建表达式

举个例子：

```js
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```

所以简单理解 `MemberExpression` 其实就是()左边的部分。

#### 6.4.2 判断 ref 是不是一个 Reference 类型

关键就在于看规范是如何处理各种 `MemberExpression`，返回的结果是不是一个`Reference`类型。

```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar());
//示例2
console.log((foo.bar)());
//示例3
console.log((foo.bar = foo.bar)());
//示例4
console.log((false || foo.bar)());
//示例5
console.log((foo.bar, foo.bar)());
```

#### 6.4.3 foo.bar()

上面的demo种，`MemberExpression` 计算的结果是 `foo.bar`，那么 `foo.bar` 是不是一个 Reference 呢？

根据规范，这里展示了一个计算的过程，什么都不管了，就看最后一步：

Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

我们得知该表达式返回了一个 Reference 类型

根据之前的内容，我们知道该值为：

```js
var Reference = {   base: foo,   name: 'bar',   strict: false };
```

接下来按照流程：

1. 如果 ref 是 Reference，并且 `IsPropertyReference(ref)` 是 true, 那么 this 的值为` GetBase(ref)`

该值是 Reference 类型，那么 IsPropertyReference(ref) 的结果是多少呢？

前面我们说了IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。

base value 为 foo，是一个对象，所以 `IsPropertyReference(ref)` 结果为 true。

这个时候我们就可以确定 this 的值

```js
this = GetBase(ref)，
```

GetBase 也已经铺垫了，获得 base value 值，这个例子中就是fo，所以 this 的值就是 foo ，示例1的结果就是 2。

#### 6.4.4 (foo.bar)()

```js
console.log((foo.bar)());
```

foo.bar 被 () 包住

Return the result of evaluating Expression. This may be of type Reference.

NOTE This algorithm does not apply GetValue to the result of evaluating Expression.

实际上 () 并没有对 `MemberExpression` 进行计算，所以其实跟示例 1 的结果是一样的。

#### 6.4.5 (foo.bar=foo.bar)()

看示例3，有赋值操作符，

因为使用了 GetValue，所以返回的值不是 Reference 类型，

按照之前讲的判断逻辑，如果 ref 不是Reference，那么 this 的值为 undefined

this 为 undefined，非严格模式下，this 的值为 undefined 的时候，其值会被隐式转换为全局对象。

#### 6.4.6 (false||foo.bar)()

示例4，因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined。

#### 6.4.7 (foo.bar，foo.bar)()

看示例5，因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined。

#### 6.4.8 总结

```js

var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar()); // 2
//示例2
console.log((foo.bar)()); // 2
//示例3
console.log((foo.bar = foo.bar)()); // 1
//示例4
console.log((false || foo.bar)()); // 1
//示例5
console.log((foo.bar, foo.bar)()); // 1

```

注意：以上是在非严格模式下的结果，严格模式下因为 this 返回 undefined，所以示例 3 会报错。

## 7.执行上下文

### 7.1 思考题

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

两段代码都会打印'local scope'，在上文讲到了两者的区别在于执行上下文栈的变化不一样，本节会在此基础上，详细的解析执行上下文栈和执行上下文的具体变化过程。

### 7.2 具体执行分析

我们分析第一段代码：

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

执行过程如下：

1. 执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈

```js
 ECStack = [
      globalContext
  ];
```

2. 全局上下文初始化

```js
  globalContext = {
      VO: [global],
      Scope: [globalContext.VO],
      this: globalContext.VO
  }
```

3. 初始化的同时，checkscope 函数被创建，保存作用域链到函数的内部属性[[scope]]

```js
  checkscope.[[scope]] = [
    globalContext.VO
  ];
```

4. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```js
ECStack = [
    checkscopeContext,
    globalContext
];
```

5. checkscope 函数执行上下文初始化：
   - 复制函数 [[scope]] 属性创建作用域链；
   - 用 arguments 创建活动对象；
   - 初始化活动对象，即加入形参、函数声明、变量声明；
   - 将活动对象压入 checkscope 作用域链顶端；

同时 f 函数被创建，保存作用域链到 f 函数的内部属性[[scope]]

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope: undefined,
        f: reference to function f(){}
    },
    Scope: [AO, globalContext.VO],
    this: undefined
}
```

6. f 函数执行，沿着作用域链查找 scope 值，返回 scope 值；

7. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出；

```js
ECStack = [
    checkscopeContext,
    globalContext
];
```

8. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

```js
ECStack = [
    globalContext
];
```

## 8.闭包

MDN 对闭包的定义为：

闭包是指那些能够访问自由变量的函数。

那什么是自由变量呢？

自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。

由此，我们可以看出闭包共有两部分组成：

闭包 = 函数 + 函数能够访问的自由变量

```js
var a = 1;

function foo() {
    console.log(a);
}

foo();
```

foo 函数可以访问变量 a，但是 a 既不是 foo 函数的局部变量，也不是 foo 函数的参数，所以 a 就是自由变量。

所以在《JavaScript权威指南》中就讲到：从技术的角度讲，所有的JavaScript函数都是闭包。

但是，这是理论上的闭包，其实还有一个实践角度上的闭包。

ECMAScript中，闭包指的是：

1. 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域；
2. 从实践角度：以下函数才算是闭包：

1. 1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）；
   2. 在代码中引用了自由变量；

接下来就来讲讲实践上的闭包

### 8.1 分析

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```

先我们要分析一下这段代码中执行上下文栈和执行上下文的变化情况。

这里直接给出简要的执行过程：

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈；
2. 全局执行上下文初始化；
3. 执行 `checkscope` 函数，创建 `checkscope` 函数执行上下文，`checkscope` 执行上下文被压入执行上下文栈；
4. `checkscope` 执行上下文初始化，创建变量对象、作用域链、this等；
5. `checkscope` 函数执行完毕，`checkscope` 执行上下文从执行上下文栈中弹出；
6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈；
7. f 执行上下文初始化，创建变量对象、作用域链、this等；
8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出；

了解到这个过程，我们应该思考一个问题：

1. 当 f 函数执行的时候，checkscope 函数上下文已经被销毁了啊(即从执行上下文栈中被弹出)，怎么还会读取到 checkscope 作用域下的 scope 值呢？

当我们了解了具体的执行过程后，我们知道 f 执行上下文维护了一个作用域链：

```js
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}
```

因为这个作用域链，f 函数依然可以读取到 `checkscopeContext.AO` 的值，说明当 f 函数引用了 `checkscopeContext.AO` 中的值的时候，即使 `checkscopeContext` 被销毁了，但是 JavaScript 依然会让 `checkscopeContext.AO` 活在内存中，f 函数依然可以通过 f 函数的作用域链找到它，正是因为 JavaScript 做到了这一点，从而实现了闭包这个概念。

所以，让我们再看一遍实践角度上闭包的定义：

1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）；
2. 在代码中引用了自由变量；

### 8.2 思考题

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

答案是都是 3，让我们分析一下原因：
当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```js
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```js
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。
data[1] 和 data[2] 是一样的道理。
所以改成闭包：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();
```

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```js
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

跟没改之前一模一样。

当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

```js
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO globalContext.VO]
}
```

匿名函数执行上下文的AO为

```js
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0。

data[1] 和 data[2] 是一样的道理。

# javascript高级用法(2/2)

函数变量提升

https://www.yuque.com/lpldplws/atomml/os260aysmxgeyhhm?singleDoc# 《JavaScript高级用法(2/2)》 密码：ih4c

## 1. 参数按值传递

ECMAscript的所有函数的参数都是按值传递

function foo(a){}

把函数外部的值赋值给函数内部的参数，把值从一个变量赋值到另一个变量一样

### 1.1.按值传递

```js
var val=1;
function foo(v){
     v=2;
    console.log(v);//2
}
foo(val);//传递的是赋值后val的结果,_val
console.log(val)//1
```

很好理解，当传递 value 到函数 foo 中，相当于拷贝了一份 value，假设拷贝的这份叫 _value，函数中修改的都是 _value 的值，而不会影响原来的 value 值。

### 1.2. 共享传递

拷贝虽然很好理解，但是当值是一个复杂的数据结构的时候，拷贝会产生性能上的问题。

这里提及一种：按引用传递。

所谓按引用传递，就是传递对象的引用，函数内部对参数的任何改变都会影响该对象的值，因为两者引用的是同一个对象。

举个例子

```js
var obj={val:1};
function foo(o){
    o.val=2;//这里没有改变o的地址，只是改变了val的值
    console.log(o.val)//2，
}
foo(obj)
console.log(obj.val);//2，因为地址并没有改变，obj的引用地址没有变化
```

为什么《JavaScript高级程序设计》都说了 ECMAScript 中所有函数的参数都是按值传递的，那为什么能按"引用传递"成功呢？

```js
var obj={val:1};
function foo(o){
    o=2;//把o的地址直接变成了值
    console.log(o)//2
}
foo(obj)
console.log(obj.val);//1，obj的引用地址没有变化，变的只是o的东西
```

如果 JavaScript 采用的是引用传递，外层的值也会被修改，那这里如何解释？

这就要讲到第二种传递方式，叫按共享传递。

而共享传递是指，在传递对象的时候，传递的是地址索引。

所以修改 o.value，可以通过引用找到原值，但是直接修改 o，并不会修改原值。所以第二个和第三个例子其实都是按共享传递。

最后，你可以这样理解：

参数如果是基本类型是按值传递，如果是引用类型按共享传递。

但是因为拷贝副本也是一种值的拷贝，所以在高程中也直接认为是按值传递了。

换句话说，函数传递参数 ，传递的是参数的拷贝：

1. 指针拷贝，拷贝的是地址索引；
2. 常规类型拷贝，拷贝的是值 ；

所以，一共是两种传递方式，按值传递和按共享传递。

### 1.3 总结

javascript中数据类型分为基本类型与引用类型：

1. 基本类型值存储于栈内存中，传递的就是当前值，修改不会影响原有变量的值；
2. 引用类型值其实也存于栈内存中，只是它的值是指向堆内存当中实际值的一个地址；索引引用传递传的值是栈内存当中的引用地址，当改变时，改变了堆内存当中的实际值；

所以针对上述的内容：

```js
var value = 1;
function foo(v) {
    v = 2;
    console.log(v); //2
}
foo(value);
console.log(value) // 1
```

内存分布：

改变前：

| 栈内存 |      | 堆内存 |
| ------ | ---- | ------ |
| value  | 1    |        |
| v      | 1    |        |

改变后：

| 栈内存 |      | 堆内存 |
| ------ | ---- | ------ |
| value  | 1    |        |
| v      | 2    |        |

```js
var obj = {
value: 1
};
function foo(o) {
    o.value = 2;
    console.log(o.value); //2
}
foo(obj);
console.log(obj.value) // 2
```

改变前：

| 栈内存 |          | 堆内存     |
| ------ | -------- | ---------- |
| obj    | 指针地址 | {value: 1} |
| o      | 指针地址 | {value: 1} |

改变后：

| 栈内存 |          | 堆内存     |
| ------ | -------- | ---------- |
| obj    | 指针地址 | {value: 2} |
| o      | 指针地址 | {value: 2} |

```js
var obj = {
value: 1
};
function foo(o) {
    o = 2;
    console.log(o); //2
}
foo(obj);
console.log(obj.value) // 1
```

改变前：

| 栈内存 |          | 堆内存     |
| ------ | -------- | ---------- |
| obj    | 指针地址 | {value: 1} |
| o      | 指针地址 | {value: 1} |

改变后：

| 栈内存 |          | 堆内存     |
| ------ | -------- | ---------- |
| obj    | 指针地址 | {value: 1} |
| o      | 2        |            |

## 2. 手写call和apply

### 2.1 手写call

call() ：在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

```js
let foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

注意两点：

1. call 改变了 this 的指向，指向到 foo；
2. bar 函数执行了；

#### 2.1.1 第一步

上述方式等同于：

```js
let foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```

这个时候 this 就指向了 foo，但是这样却给 foo 对象本身添加了一个属性，所以们用 delete 再删除它即可。
所以我们模拟的步骤可以分为：

1. 将函数设为对象的属性；
2. 执行该函数；
3. 删除该函数；
   以上个例子为例，就是：

```js
// 第一步
// fn 是对象的属性名，反正最后也要删除它，所以起什么都可以。
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```

根据上述思路，提供一版：

```js
// 第一版
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}

// 测试一下
 let foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

#### 2.1.2 第二步

call除了可以指定this，还可以指定参数

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call(foo, 'kevin', 18);
// kevin
// 18
// 1

```

可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

上述代码的Arguments中取第二个到最后一个的参数

```js
// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}

// 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```

接下来使用eval拼接成一个函数

```js
eval('context.fn(' + args +')')
```

考虑到目前大部分浏览器在console中限制eval的执行，也可以使用rest

此处代码为：

```js
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    let arg = [...arguments].slice(1)
    context.fn(...arg)
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

#### 2.1.3 第三步

1. this 参数可以传 null，当为 null 的时候，视为指向 window

举个例子:

```js
var value = 1;

function bar() {
    console.log(this.value);
}

bar.call(null); // 1
```

2. 针对函数，可以实现返回值

```js
var obj = {
    value: 1
}

function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

这里

```js
// 第三版
Function.prototype.call2 = function (context) {
		var context = context || window;
    context.fn = this;

    let arg = [...arguments].slice(1)
    let result = context.fn(...arg)

    delete context.fn
  	return result
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

这边给出最简化的写法：

```js
Function.prototype.call2 = function(context, ...args) {
  // 判断是否是undefined和null
  if (typeof context === 'undefined' || context === null) {
    context = window
  }
  let fnSymbol = Symbol()
  context[fnSymbol] = this
  let fn = context[fnSymbol](...args)
  delete context[fnSymbol] 
  return fn
}
```

### 2.2	手写apply

apply 的实现跟 call 类似，只是入参不一样，apply为数组

```js
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
				result = context.fn(...arr)
    }

    delete context.fn
    return result;
}
```

最简化版方式

```js
Function.prototype.apply2 = function(context, args) {
  // 判断是否是undefined和null
  if (typeof context === 'undefined' || context === null) {
    context = window
  }
  let fnSymbol = Symbol()
  context[fnSymbol] = this
  let fn = context[fnSymbol](...args)
  delete context[fnSymbol] 
  return fn
}
```

## 3.手写bind

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

由此我们可以首先得出 bind 函数的两个特点：

1. 返回一个函数；
2. 可以传入参数；

### 3.1 返回函数的模拟实现

```js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo); 

bindFoo(); // 1
```

关于指定 this 的指向，我们可以使用 call 或者 apply 实现

```js
// 第一版
Function.prototype.bind2 = function (context) {
    var self = this;

    // 虑到绑定函数可能是有返回值的，加上return
    return function () {
        return self.apply(context);
    }

}
```

### 3.2 传参的模拟实现

接下来，关于参数的传递：

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

当需要传 name 和 age 两个参数时，可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age。
这里如果不适用rest，使用arguments进行处理：

```js
// 第二版
Function.prototype.bind2 = function (context) {

    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}
```

### 3.3 构造函数效果的模拟实现

bind 还有一个特点，就是

一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。举个例子：

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了
后文中new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。

```js
// 第三版
Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound;
}

```

### 3.4 构造函数效果的优化实现

但是在这个写法中，我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

```js
// 第四版
Function.prototype.bind2 = function (context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

### 3.5 最终版

调用 bind 的不是函数时，提示错误：

```js
if (typeof this !== "function") {
  throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
}
```

最终代码为：

```js
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

最简化版：

```js
Function.prototype.myBind = function(context) {
// 判断是否是undefined 和 null
    if (typeof context === "undefined" || context === null) {
    	context = window;
    }
    self = this;
    return function(...args) {
    	return self.apply(context, args);
    }
}
```

## 4.手写模拟new

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

先看看 new 实现了哪些功能。

```js
function Person (name, age) {
    this.name = name;
    this.age = age;

    this.habit = 'Games';
}

Person.prototype.strength = 80;

Person.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}

var person = new Person('Kevin', '18');

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60

person.sayYourName(); // I am Kevin
```

我们可以看到，实例 person 可以：

1. 访问到 Otaku 构造函数里的属性；
2. 访问到 Otaku.prototype 中的属性；

接下来，我们可以尝试着模拟一下了。

因为 new 是关键字，所以无法像 bind 函数一样直接覆盖，所以我们写一个函数，命名为 objectFactory，来模拟 new 的效果。用的时候是这样的：

```js
function Person () {
    ……
}

// 使用 new
var person = new Person(……);
// 使用 objectFactory
var person = objectFactory(Person, ……)
```

### 4.1 初步实现

因为 new 的结果是一个新对象，所以在模拟实现的时候，我们也要建立一个新对象，假设这个对象叫 obj，因为 obj 会具有 Person 构造函数里的属性，我们可以使用 `Person.apply(obj, arguments)`来给 obj 添加新的属性。

然后，实例的 __proto__ 属性会指向构造函数的 prototype，也正是因为建立起这样的关系，实例可以访问原型上的属性

```js
// 第一版代码
function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj, arguments);

    return obj;

};
```

在这一版中，我们：

1. 用new Object() 的方式新建了一个对象 obj；
2. 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数；
3. 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性；
4. 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性；
5. 返回 obj；

测试一下：

```js
function Person (name, age) {
    this.name = name;
    this.age = age;

    this.habit = 'Games';
}

Person.prototype.strength = 60;

Person.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}

function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj, arguments);
    return obj;
};

var person = objectFactory(Person, 'Kevin', '18')

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60

person.sayYourName(); // I am Kevin
```

### 4.2 最终实现

假如构造函数有返回值

```js
function Person (name, age) {
    this.strength = 60;
    this.age = age;

    return {
        name: name,
        habit: 'Games'
    }
}

var person = new Person('Kevin', '18');

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // undefined
console.log(person.age) // undefined

```

在这个例子中，构造函数返回了一个对象，在实例 person 中只能访问返回的对象中的属性。
而且还要注意一点，在这里我们是返回了一个对象，假如我们只是返回一个基本类型的值呢？
再举个例子：

```js
function Person (name, age) {
    this.strength = 60;
    this.age = age;

    return 'handsome boy';
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18
```

这次尽管有返回值，但是相当于没有返回值进行处理。

所以我们还需要判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么。

```js
// 最终版的代码
function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;

};
```

## 5.类数组对象与arguments

### 5.1类数组对象

所谓的类数组对象:

拥有一个 length 属性和若干索引属性的对象

举个例子：

```js
var array = ['name', 'age', 'sex'];

var arrayLike = {
    0: 'name',
    1: 'age',
    2: 'sex',
    length: 3
}
```

#### 5.1.1 读写

```js
console.log(array[0]); // name
console.log(arrayLike[0]); // name

array[0] = 'new name';
arrayLike[0] = 'new name';
```

#### 5.1.2 长度

```js
console.log(array.length); // 3
console.log(arrayLike.length); // 3
```

#### 5.1.3 遍历

```js
for(var i = 0, len = array.length; i < len; i++) {
   ……
}
for(var i = 0, len = arrayLike.length; i < len; i++) {
    ……
}
```

但是调用原生的数组方法会报错，如push

```js
arrayLike.push is not a function
```

#### 5.1.4 调用数组方法

只能通过 Function.call 间接调用

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

Array.prototype.join.call(arrayLike, '&'); // name&age&sex

Array.prototype.slice.call(arrayLike, 0); // ["name", "age", "sex"] 
// slice可以做到类数组转数组

Array.prototype.map.call(arrayLike, function(item){
    return item.toUpperCase();
}); 
// ["NAME", "AGE", "SEX"]
```

### 5.2 Arguments对象

Arguments 对象只定义在函数体中，包括了函数的参数和其他属性。在函数体中，arguments 指代该函数的 Arguments 对象。

举个例子:

```js
function foo(name, age, sex) {
    console.log(arguments);
}

foo('name', 'age', 'sex')
```

打印结果：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1669796564922-3f9b7f45-48af-4f09-a288-c99f27c48d7f.png)

可以看到除了类数组的索引属性和length属性之外，还有一个callee属性

#### 5.2.1 length属性

Arguments对象的length属性，表示实参的长度，举个例子：

```js
function foo(b, c, d){
    console.log("实参的长度为：" + arguments.length)
}

console.log("形参的长度为：" + foo.length)

foo(1)

// 形参的长度为：3
// 实参的长度为：1
```

#### 5.2.2. callee属性

Arguments 对象的 callee 属性，通过它可以调用函数自身。

讲个闭包经典面试题使用 callee 的解决方法：

```js
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) 
    }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

#### 5.2.3 arguments和对应参数的绑定

```js
function foo(name, age, sex, hobbit) {

    console.log(name, arguments[0]); // name name

    // 改变形参
    name = 'new name';

    console.log(name, arguments[0]); // new name new name

    // 改变arguments
    arguments[1] = 'new age';

    console.log(age, arguments[1]); // new age new age

    // 测试未传入的是否会绑定
    console.log(sex); // undefined

    sex = 'new sex';

    console.log(sex, arguments[2]); // new sex undefined

    arguments[3] = 'new hobbit';

    console.log(hobbit, arguments[3]); // undefined new hobbit

}

foo('name', 'age')
```

传入的参数，实参和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享

#### 5.2.4. 传递参数

将参数从一个函数传递到另一个函数

```js
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
   console.log(a, b, c);
}

foo(1, 2, 3)
```

#### 5.2.5 es6

使用ES6的 ... 运算符，我们可以轻松转成数组。

```js
function func(...arguments) {
    console.log(arguments); // [1, 2, 3]
}

func(1, 2, 3);
```

#### 5.2.6 应用

arguments的应用其实很多，像参数不定长、函数柯里化等等都有涉及。

## 6. 创建对象的多种方式&优缺点

### 6.1 工厂模式

```js
function createPerson(name) {
    var o = new Object();
    o.name = name;
    o.getName = function () {
        console.log(this.name);
    };

    return o;
}

var person1 = createPerson('kevin');
```

优点：简单；

缺点：对象无法识别，因为所有的实例都指向一个原型；

### 6.2 构造函数模式

```js
function Person(name) {
    this.name = name;
    this.getName = function () {
        console.log(this.name);
    };
}

var person1 = new Person('kevin');
```

优点：实例可以识别为一个特定的类型；

缺点：每次创建实例时，每个方法都要被创建一次；

#### 6.2.1 构造函数优化

```js
function Person(name) {
    this.name = name;
    this.getName = getName;
}

function getName() {
    console.log(this.name);
}

var person1 = new Person('kevin');
```

解决了每个方法都要重新创建的问题

### 6.3 原型模式

```js
function Person(name) {

}

Person.prototype.name = 'xianzao';
Person.prototype.getName = function () {
    console.log(this.name);
};

var person1 = new Person();
```

优点：方法不会重新创建；

缺点：

1. 所有的属性和方法都共享；
2. 不能初始化参数；

#### 6.3.1 原型模式优化

```js
function Person(name) {

}

Person.prototype = {
    name: 'xianzao',
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
```

优点：封装清晰点；

缺点：重写了原型，丢失了constructor属性；

#### 6.3.2 原型模式优化2

```js
function Person(name) {

}

Person.prototype = {
    constructor: Person,
    name: 'kevin',
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
```

优点：实例可以通过constructor属性找到所属构造函数；

缺点：

1. 所有的属性和方法都共享；
2. 不能初始化参数；

### 6.4 组合模式

```js
function Person(name) {
    this.name = name;
}

Person.prototype = {
    constructor: Person,
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
```

优点：该共享的共享，该私有的私有，使用最广泛的方式；

缺点：希望写在一个地方，即更好的封装性；

#### 6.4.1 动态原型模式

```js
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype.getName = function () {
            console.log(this.name);
        }
    }
}

var person1 = new Person();
```

注意：使用动态原型模式时，不能用对象字面量重写原型

```js
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }
    }
}

var person1 = new Person('xianzao');
var person2 = new Person('zaoxian');

// 报错 并没有该方法
person1.getName();

// 注释掉上面的代码，这句是可以执行的。
person2.getName();
```

开始执行`var person1 = new Person('xianzao')`

我们回顾下 new 的实现步骤：

1. 首先新建一个对象；
2. 然后将对象的原型指向 `Person.prototype`；
3. 然后 `Person.apply(obj)`；
4. 返回这个对象；

注意这个时候，回顾下 apply 的实现步骤，会执行 obj.Person 方法，这个时候就会执行 if 语句里的内容，注意构造函数的 prototype 属性指向了实例的原型，使用字面量方式直接覆盖 `Person.prototype`，并不会更改实例的原型的值，person1 依然是指向了以前的原型，而不是 `Person.prototype`。而之前的原型是没有 getName 方法的，所以就报错了。

如果你就是想用字面量方式写代码，可以尝试下这种:

```js
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }

        return new Person(name);
    }
}

var person1 = new Person('xianzao');
var person2 = new Person('zaoxian');

person1.getName(); // xianzao
person2.getName();  // zaoxian

```

## 7.继承的多种方式&优缺点

### 7.1 原型链继承

```js
function Parent () {
    this.name = 'xianzao';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {

}

Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName()) // xianzao
```

问题：引用类型的属性被所有实例共享，举个例子：

```js
function Parent () {
    this.names = ['xianzao', 'zaoxian'];
}

function Child () {

}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push('test');

console.log(child1.names); // ["xianzao", "zaoxian", "test"]

var child2 = new Child();

console.log(child2.names); // ["xianzao", "zaoxian", "test"]
```

### 7.2 借用构造函数

```js
function Parent () {
    this.names = ['xianzao', 'zaoxian'];
}

function Child () {
    Parent.call(this);
}

var child1 = new Child();

child1.names.push('test');

console.log(child1.names); // ["xianzao", "zaoxian", "test"]

var child2 = new Child();

console.log(child2.names); // ["xianzao", "zaoxian"]
```

优点：

1. 避免了引用类型的属性被所有实例共享；

2. 可以在 Child 中向 Parent 传参；

```js
function Parent (name) {
    this.name = name;
}

function Child (name) {
    Parent.call(this, name);
}

var child1 = new Child('xianzao');

console.log(child1.name); // xianzao

var child2 = new Child('zaoxian');

console.log(child2.name); // zaoxian
```

缺点：

方法都在构造函数中定义，每次创建实例都会创建一遍方法。

### 7.3 组合继承

```js
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {

    Parent.call(this, name);
    
    this.age = age;

}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('kevin', '18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

### 7.4 原型继承

```js
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
```

缺点：
包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

```js
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.friends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

### 7.5 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```js
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

# 浏览器事件模型

https://www.yuque.com/lpldplws/atomml/dh5rlaq0xygdkok5?singleDoc# 《浏览器事件模型&请求》 密码：qnyz

## 1. 课程目标

1. 掌握浏览器的事件捕获、冒泡等常见的事件模型；
2. 掌握ajax、fetch、axios的基础使用；

## 2. 课程大纲

1. 浏览器事件模型；
2. 浏览器请求；

## 3. 浏览器事件模型

### 3.1. DOM事件

DOM`(Document Object Model`，文档对象模型)是针对HTML文档和XML文档的一个API。DOM描绘了一个层次化的节点树，允许开发人员添加、移出和修改页面的某一部分，DOM 脱胎于Netscape 及微软公司创始的 DHTML（动态HTML）。但现在它已经成为表现和操作页面标记的真正跨平台、语言中立的方式。

`Netscape Navigator 4` 和 `IE4` 分别发布于 1997 年的 6 月和 10 月发布的 DHTML，由于 `IE4` 和 `Netscape Navigator4` 分别支持不同的 DHTML，为了统一标准，W3C开始制定 DOM。1998 年10 月 W3C 总结了 IE 和 Navigator4 的规范，制定了 DOMLevel 1即 DOM1，之前 IE 与 Netscape 的规范则被称为 DOMLevel 0 即 DOM0 。

#### 3.1.1 DOM0级事件

假设页面中存在一个 btn 的按钮，并且给 btn 添加一个点击事件：

```js
btn.onclick = function(){
   console.log('this is a click event')
}
```

事件就是用户或浏览器自身执行的某种操作，如click、load、mouseover等，都是事件的名字，而响应某个事件的函数就被称为事件处理程序。

##### 3.1.1.1 click事件过程

在上述的例子中，click 事件并没有像其他函数一样，必须要调用才可以执行，click 事件并不确定什么时候发生，而当浏览器发现用户点击该按钮时，浏览器就检测btn.onclick是否有值，如果有，就会执行btn.onclick.call(btn,event)，此时函数执行，call() 方法接收两个参数，第一个指向调用当前方法的对象，也就是this。
需要注意的是，指定的 this 值并不一定是该函数执行时真正的this值，如果这个函数处于[非严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，则指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象。
另一个参数则是事件对象 event，该对象也可以通过 arguments[0] 来访问，它包含了事件相关的所有信息，如本例子中，则包含了点击事件的全部信息。可以通过给函数传参来获取事件信息。

```js
btn.onclick = function(e){
   console.log('this is a click event');
   console.log(e);  //  事件对象
    
}
```

但是在 IE 中，在使用 DOM0 级方法添加事件处理程序时，event 是作 window 对象的一个属性而存在的。此时访问事件对象需要通过 window.event。

```js
btn.onclick = function(){
   console.log(window.event);  //  IE中事件对象    
}
```

在 DOM0级中，如果想要实现一个对象绑定多个函数，可以这样实现：

```js
function fn1(){
    // do something
}
function fn2(){
    // do something
}
btn.onclick = function(e){
  fn1.call(this.xxx);
  fn2.call(this.yyy);
}
```

#### 3.1.2. DOM1级事件

DOM级别1于1998年10月1日成为W3C推荐标准。1级DOM标准中并没有定义事件相关的内容，所以没有所谓的1级DOM事件模型。在2级DOM中除了定义了一些DOM相关的操作之外还定义了一个事件模型 ，这个标准下的事件模型就是我们所说的2级DOM事件模型。

#### 3.1.3 DOM2级事件

W3C 后来将 DOM1 升级为 DOM2，DOM2级规范开始尝试以一种符合逻辑的方式来标准化 DOM事件。DOM0级 可以认为 onclick 是 btn 的一个属性，DOM2级 则将属性升级为队列。

DOM2级 事件定义了两个方法，用于处理指定和删除事件处理程序的操作，`addEventListener()`和`removeEventListener()`，所有的 DOM 节点中都包含这两个方法，它们都接收 3 个参数。

1. 要处理的事件名；
2. 作为事件处理程序的函数；
3. 布尔值，true 代表在捕获阶段调用事件处理程序，false 表示在冒泡阶段调用事件处理程序，默认为 false；

```js
btn.addEventListener('click',function(){
  //  do something
})
btn.addEventListener('click',function(){
  //  do something else
})
```

`addEventListener()`将事件加入到监听队列中，当浏览器发现用户点击按钮时，click 队列中依次执行匿名函数1、匿名函数2。

```js
function fn1(){
  //  do something
}
function fn1(){
  //  do something else
}
btn.addEventListener('click',fn1)
btn.addEventListener('click',fn2)
```

如果这样写，click 队列中依次`fn1.call(btn,event)`，`fn2.call(btn,event)`。

通过`addEventListener()`添加的事件只能由`removeEventListener()`来移除，并且`removeEventListener()`只能移除具名函数，不能移除匿名函数。

课后作业：必须通读[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)上关于DOM的内容；

#### 3.1.4 IE中DOM2级事件

IE8 及之前，实现类似`addEventListener()`和`removeEventListener()`的两个方法是`attachEvent()`和`detachEvent()`，这两个方法接受相同的两个参数。

1. 要处理的事件名；
2. 作为事件处理程序的函数；

IE8 之前的只支持事件冒泡，所以通过`attachEvent()`添加的事件处理程序只能添加到冒泡阶段。

```js
btn.attachEvent('click',fn1)
btn.attachEvent('click',fn2)
```

当用户点击时，click 队列依次`fn1.call(undefined,undefined)`，`fn2.call(undefined,undefined)`。

类似的`detachEvent()`也只能移除具名函数，不能移除匿名函数。

```js
function eventHandler() {
  console.log('xianzao);
}

btn.attachEvent('onClick', eventHandler);
btn.detachEvent('onClick, eventHandler);
```

#### 3.1.5 兼容处理

```js
if(typeof btn.addEventListener === 'function'){
  btn.addEventListener('click',fn);
}else if(typeof btn.attachEvent === 'function'){
  btn.attachEvent('onclick',fn)
}else{
  btn.onclick=function(){
    // do something
  }
}
```

#### 3.1.6 总结

```js
var btn = document.getElementById('btn');

btn.onClick = () => {
  console.log('我是DOM0级事件处理程序');
}
btn.onClick = null;

btn.addEventListener('click', () => {
  console.log('我是DOM2级事件处理程序');
}, false);
btn.removeEventListener('click', handler, false)

btn.attachEvent('onclick', () => {
  console.log('我是IE事件处理程序')
})
btn.detachEvent('onclicn', handler);
```

1. DOM2级的好处是可以添加多个事件处理程序；DOM0对每个事件只支持一个事件处理程序；

2. 通过DOM2添加的匿名函数无法移除，上面写的例子就移除不了，addEventListener和removeEventListener的handler必须同名；

3. 作用域：DOM0的handler会在所属元素的作用域内运行，IE的handler会在全局作用域运行，this === window；

4. 触发顺序：添加多个事件时，DOM2会按照添加顺序执行，IE会以相反的顺序执行；

5. 跨浏览器的事件处理程序

```js
var EventUtil = {
  // element是当前元素，可以通过getElementById(id)获取
  // type 是事件类型，一般是click ,也有可能是鼠标、焦点、滚轮事件等等
  // handle 事件处理函数
  addHandler: (element, type, handler) => {
    // 先检测是否存在DOM2级方法,再检测IE的方法，最后是DOM0级方法（一般不会到这）
    if (element.addEventListener) {
      // 第三个参数false表示冒泡阶段
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent(`on${type}`, handler)
    } else {
      element[`on${type}`] = handler;
    }
  },

  removeHandler: (element, type, handler) => {
    if (element.removeEventListener) {
      // 第三个参数false表示冒泡阶段
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent(`on${type}`, handler)
    } else {
      element[`on${type}`] = null;
    }
  }
}

// 获取元素
var btn = document.getElementById('btn');
// 定义handler
var handler = function(e) {
  console.log('我被点击了');
}
// 监听事件
EventUtil.addHandler(btn, 'click', handler);
// 移除事件监听
// EventUtil.removeHandler(button1, 'click', clickEvent);
```

### 3.2 事件捕获&事件冒泡

事件流描述的是从页面中接收事件的顺序
IE 的事件流是事件冒泡流
而 `Netscape Communicator` 的事件流是事件捕获流

DOM2级事件规定的事件流包括三个阶段：

- 事件捕获阶段；
- 处于目标阶段；
- 事件冒泡阶段；

首先发生的是事件捕获，为截获事件提供了机会。
然后是实际的目标接收到事件。
最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应

![38007715-4cc457d0-327d-11e8-9fb3-667fa75fc38c.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671033844027-574f28ec-feaa-47d5-9d06-cce699bd2bc2.png)

1、当处于目标阶段，没有捕获与冒泡之分，执行顺序会按照`addEventListener`的添加顺序决定，先添加先执行；

2、使用`stopPropagation()`取消事件传播时，事件不会被传播给下一个节点，但是，同一节点上的其他listener还是会被执行；如果想要同一层级的listener也不执行，可以使用`stopImmediatePropagation()`；

```js
// list 的捕获
$list.addEventListener('click', (e) => {
  console.log('list capturing');
  e.stopPropagation();
}, true)
  
// list 捕获 2
$list.addEventListener('click', (e) => {
  console.log('list capturing2');
}, true)

// list capturing
// list capturing2
```

3、`preventDefault()`只是阻止默认行为，跟JS的事件传播一点关系都没有；

4、一旦发起了`preventDefault()`，在之后传递下去的事件里面也会有效果；

#### 3.2.1 测试

如果有以下例子：

```js
<!DOCTYPE html> 
<html> 
<head> 
 <title>Event Bubbling Example</title> 
</head> 
<body> 
 <div id="myDiv">Click Me</div> 
</body> 
</html>
```

1. 事件捕获

最不具体的节点最先收到事件，而最具体的节点最后收到事件。事件捕获实际上是为了在事件到达最终目标
前拦截事件。

如果前面的例子使用事件捕获，则点击<div>元素会以下列顺序触发 click 事件：

- document； 
- <html>；
- <body>；
- <div>；

1. 事件冒泡

在点击页面中的<div>元素后，click 事件会以如下顺序发生：

- <div>；
- <body>；
- <html>；
- document； 

<div>元素，即被点击的元素，最先触发 click 事件。然后，click 事件沿 DOM 树一路向上，在经过的每个节点上依次触发，直至到达 document 对象。

### 3.3 事件对象

DOM0和DOM2的事件处理程序都会自动传入event对象

IE中的event对象取决于指定的事件处理程序的方法。

IE的handler会在全局作用域运行，`this === window`，所以在IE中会有`window.event`、`event`两种情况，只有在事件处理程序期间，event对象才会存在，一旦事件处理程序执行完成，event对象就会被销毁

event对象里需要关心的两个属性：

1. target：target永远是被添加了事件的那个元素；
2. eventPhase：调用事件处理程序的阶段，有三个值
   1：捕获阶段；
   2：处于目标；
   3：冒泡阶段；

#### 3.3.1 preventDefault与stopPropagation

preventDefault：比如链接被点击会导航到其href指定的URL，这个就是默认行为；
stopPropagation：立即停止事件在DOM层次中的传播，包括捕获和冒泡事件；
IE中对应的属性：

- srcElement => target
- returnValue => preventDefaukt()
- cancelBubble => stopPropagation()

IE 不支持事件捕获，因而只能取消事件冒泡，但stopPropagation可以同时取消事件捕获和冒泡。
再针对上面不同类型的事件及属性进行区分：

```js
var EventUtil = {
  // element是当前元素，可以通过getElementById(id)获取
  // type 是事件类型，一般是click ,也有可能是鼠标、焦点、滚轮事件等等
  // handle 事件处理函数
  addHandler: (element, type, handler) => {
    // 先检测是否存在DOM2级方法,再检测IE的方法，最后是DOM0级方法（一般不会到这）
    if (element.addEventListener) {
      // 第三个参数false表示冒泡阶段
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent(`on${type}`, handler)
    } else {
      element[`on${type}`] = handler;
    }
  },

  removeHandler: (element, type, handler) => {
    if (element.removeEventListener) {
      // 第三个参数false表示冒泡阶段
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent(`on${type}`, handler)
    } else {
      element[`on${type}`] = null;
    }
  },
  // 获取event对象
  getEvent: (event) => {
    return event ? event : window.event
  },
  // 获取当前目标
  getTarget: (event) => {
    return event.target ? event.target : event.srcElement
  },
  // 阻止默认行为
  preventDefault: (event) => {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  // 停止传播事件
  stopPropagation: (event) => {
    if (event,stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  }
}
```

### 3.4. 事件委托

事件委托：用来解决事件处理程序过多的问题
页面结构如下

```js
<ul id="myLinks">
  <li id="goSomewhere">Go somewhere</li>
  <li id="doSomething">Do something</li>
  <li id="sayHi">Say hi</li>
</ul>
```

按照传统的做法，需要像下面这样为它们添加 3 个事 件处理程序。

```js
var item1 = document.getElementById("goSomewhere");
var item2 = document.getElementById("doSomething");
var item3 = document.getElementById("sayHi");
EventUtil.addHandler(item1, "click", function(event){
    location.href = "http://www.xianzao.com";
});
EventUtil.addHandler(item2, "click", function(event){
    document.title = "I changed the document's title";
});
EventUtil.addHandler(item3, "click", function(event){
    alert("hi");
});
```

如果在一个复杂的 Web 应用程序中，对所有可单击的元素都采用这种方式，那么结果就会有数不 清的代码用于添加事件处理程序。此时，可以利用事件委托技术解决这个问题。使用事件委托，只需在 DOM 树中尽量最高的层次上添加一个事件处理程序，如下面的例子所示

```js
var list = document.getElementById("myLinks");
EventUtil.addHandler(list, "click", function(event) {
  event = EventUtil.getEvent(event);
  var target = EventUtil.getTarget(event);
  switch(target.id) {
  case "doSomething":
      document.title = "I changed the document's title";
      break;
  case "goSomewhere":
      location.href = "http://www.wrox.com";
      break;
  case "sayHi": 9 alert("hi");
    break; 
  }
}
```

子节点的点击事件会冒泡到父节点，并被这个注册事件处理

最适合采用事件委托技术的事件包括 `click`、`mousedown`、`mouseup`、`keydown`、`keyup` 和 `keypress`。 虽然 `mouseover` 和 `mouseout` 事件也冒泡，但要适当处理它们并不容易，而且经常需要计算元素的位置。

可以考虑为 document 对象添加一个事件处理程序，用以处理页面上发生的某种特定类型的事件，需要跟踪的事件处理程序越少，移除它们就越容易（移除事件处理程序关乎内存和性能）。
只要是通过 `onload` 事件处理程序添加的东西，最后都要通过 `onunload` 事件处理程序将它们移除。

## 4.浏览器请求

在浏览器端发送网络请求的常见方式：

1. ajax；
2. fetch；
3. axios；

### 4.1 ajax

Asynchronous JavaScript And XML，翻译过来就是“异步的 Javascript 和 XML”。

ajax是js异步技术的术语，早起相关的api是XHR。

Ajax 是一个技术统称，是一个概念模型，它囊括了很多技术，并不特指某一技术，它很重要的特性之一就是让页面实现局部刷新。

特点：

- 局部刷新页面，无需重载整个页面。

简单来说，Ajax 是一种思想，`XMLHttpRequest` 只是实现 Ajax 的一种方式。其中 `XMLHttpRequest` 模块就是实现 Ajax 的一种很好的方式。

#### 4.1.1. 手写ajax

建议先阅读[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

利用 `XMLHttpRequest` 模块实现 Ajax。

##### 4.1.1.1. 创建异步对象

```javascript
let xmlHttp;
if (window.XMLHttpRequest) {
  // code for IE7+, Firefox, Chrome, Opera, Safari
  xmlHttp = new XMLHttpRequest();
} else {
  // code for IE6, IE5
  xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
}
```

通过`XMLHttpRequest`构造函数创建一个异步对象`xmlhttp`, IE6, IE5 使用ActiveXObject创建，创建的这个异步对象上有很多属性和方法，常用的有：

1. `onreadystatechange`：监听异步对象请求状态码`readyState`的改变，每当`readyState`改变时，就会触发`onreadystatechange`事件；
2. `readyState`：请求状态码

`readyState`表示异步对象目前的状态，状态码从0到4

0: 表示请求未初始化，还没有调用 `open()`；

1: 服务器连接已建立，但是还没有调用 `send()`；

2: 请求已接收，正在处理中（通常现在可以从响应中获取内容头）；

3: 请求处理中，通常响应中已有部分数据可用了，没有全部完成；

4: 当`readyState`状态码为4时，表示请求已完成；此阶段确认全部数据都已经解析完毕，可以通过异步对象的属性获取对应数据；

3. status：http状态码

http状态码表示成功的http状态码有

```
xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304
```

4. responseText：后台返回的字符串形式的响应数据；

5. responseXML：后台返回的XML形式的响应数据；

##### 4.1.1.2. 设置请求方式和请求地址

创建异步对象之后，通过`open()`方法设置ajax请求方式和请求地址 格式：

```
xmlHttp.open("GET/POST","ajax-get.txt",true)
```

第一个参数：请求的类型；GET 还是 POST；

第二个参数：表示请求的文件的地址url；

第三个参数：设置请求方法是不是异步async，true为异步， false为同步。AJAX存在的意义就是发异步请求，所以第三个参数永远传true；

注意：有个问题，就是IE中的缓存问题

在IE浏览器中，如果通过Ajax发送GET请求，那么IE浏览器认为，同一个URL只有一个结果，如果地址没有发生变化，它就会把上一次返回的结果，直接返回。这样我们不能实时的拿到变化后的数据。如果要想我们拿到实时数据，必须保证每次的URL都是不一样的，有两种方式：

1. Math.random()；
2. new Date().getTime()；

即在请求地址后面拼接上?t=随机数或者1970.01.01至当前的毫秒数 所以在IE中通过ajax发送get请求时，可以设置请求地址为：

```js
xmlHttp.open("GET","ajax-get.txt?t=" + (new Date().getTime()),true);
//或
xmlHttp.open("GET","ajax-get.txt?t=" + Math.random(),true);
```

##### 4.1.1.3. 发送请求

直接通过异步对象的send()发送请求

```javascript
xmlHttp.send();
```

特别注意的是： 如果发送POST请求，使用`setRequestHeader()`来添加 HTTP请求头，并在send()方法中传递要发送的数据：

```javascript
xmlHttp.open("POST","ajax_test.html",true); 
xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
xmlHttp.send("fname=Henry&lname=Ford");
```

##### 4.1.1.4. 通过onreadystatechange监听状态变化

当异步对象的readyState发生改变，会触发`onreadystatechange`函数，当readyState变成为4时，表示当前状态是请求完毕的状态，同时当http的响应码status为200到300之间（包括200和300）或为304时，表示ajax请求成功;当http状态码不是200到300之间的数也不是304时，表示请求不成功

```js
//4.监听状态变化
xmlHttp.onreadystatechange = () => {
 // 判断当前状态改变是请求完毕的状态吗
 if (xmlHttp.readyState === 4) {
    if (xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304) {
        console.log("成功的接收到服务器返回的数据");
    }else{
        console.log("不成功！");
    }   
 }
}  
```

##### 4.1.1.5 处理返回的结果

如果成功，可通过异步对象的`responseText`属性来获取服务器返回的字符串

接下来，我们来封装一个方法ajax()用于发送请求

封装的时候，需要注意：

1. URL当中只能出现字母 数字 下划线和ASCII码，不能出现中文，可以使用encodeURIComponent()转码；
2. 当我们利用我们的ajax放的发送一个请求到远处服务器时，我们需要等待远程服务器去响应我们的请求，等待远程服务器将响应的结果返回给我们，但是这个响应的速度是不确定的，因为响应的速度是由本地网络和远程服务器的网速等共同决定的，所以我们不可能一直等待服务器的响应。这里需要设置超时时间；

```js
ajax({
  type: 'GET',
  url: 'http://localhost:3000/posts',
  timeout: 1000,
  success: data => {
    console.log('success', data);
  },
  error: err => {
    console.log('error', err);
  },
});

```

##### 4.1.1.6 其他

至此，jQuery官方的ajax还是有一定的差异，所以还需要进一步完善

1. 传递多个参数，需要保持传递顺序。解决方案是可以改写成传递的是一个对象；因为对象里面的值，传递的是一个对象就不用考虑先后顺序，里面用的参数通过对象名.属性名的形式获取；
2. 传递请求类型的区分大小写，jQuery官方的是大小写都可以；解决方案是可以使用`toLowerCase`()或者`toUpperCase`()将类型转成大写或小写再对比；
3. 我们传递的数据用的名字是obj，jQuery官方用的是data；

```js
const ajax = option => {
  //type, url, data, timeout, success, error将所有参数换成一个对象{}

  //  0.将对象转换成字符串

  //处理obj
  const objToString = data => {
    data.t = new Date().getTime();
    let res = [];
    for (let key in data) {
      //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
      res.push(encodeURIComponent(key) + ' = ' + encodeURIComponent(data[key]));
    }
    return res.join('&');
  };

  let str = objToString(option.data || {});

  //  1.创建一个异步对象xmlHttp；
  var xmlHttp, timer;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else if (xmlHttp) {
    // code for IE6, IE5
    xmlHttp = new ActiveXObject('Microsoft.xmlHttp');
  }

  //  2.设置请求方式和请求地址；
  // 判断请求的类型是POST还是GET
  if (option.type.toLowerCase() === 'get') {
    xmlHttp.open(option.type, option.url + '?t=' + str, true);
    //  3.发送请求；
    xmlHttp.send();
  } else {
    xmlHttp.open(option.type, option.url, true);
    // 注意：在post请求中，必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //  3.发送请求；
    xmlHttp.send(str);
  }

  //  4.监听状态的变化；
  xmlHttp.onreadystatechange = function () {
    clearInterval(timer);
    debugger;
    if (xmlHttp.readyState === 4) {
      if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304) {
        //  5.处理返回的结果；
        option.success(xmlHttp.responseText); //成功后回调；
      } else {
        option.error(xmlHttp.responseText); //失败后回调；
      }
    }
  };

  //判断外界是否传入了超时时间
  if (option.timeout) {
    timer = setInterval(function () {
      xmlHttp.abort(); //中断请求
      clearInterval(timer);
    }, option.timeout);
  }
};
```

#### 4.1.2 测试

选择`json-server`启动本地服务，mock数据：

```js
{
  "posts": [
    {
      "id": 1,
      "title": "json-server",
      "author": "xianzao"
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "some comment",
      "postId": 1
    }
  ],
  "profile": {
    "name": "xianzao"
  }
}
```

执行代码：

```js
ajax({
  type: 'GET',
  url: 'http://localhost:3000/posts',
  timeout: 1000,
  success: data => {
    console.log('success', data);
  },
  error: err => {
    console.log('error', err);
  },
});

```

#### 4.1.3. 总结 

 

我们可以发现，ajax只是一种异步请求的方式，并不特指某一种具体的实现方式，但随着使用这种方式实现网络请求时内部又包含请求的情况，就会出现回调地狱，这也是XHR的诟病之一，因此，后来才催生了更加优雅的请求方式。

### 4.2 fetch

 

Fetch 是在 ES6 出现的，它使用了 ES6 提出的 Promise 对象。它是 XMLHttpRequest 的替代品。

有人把它与 Ajax 作比较，其实这是不对的，我们通常所说的 Ajax 是指使用 XMLHttpRequest 实现的 Ajax，所以真正应该和 XMLHttpRequest 作比较。

Fetch 是一个 API，它是真实存在的，它是基于 Promise 的。
建议阅读：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
以下内容摘选自：[fetch教学](https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)

fetch()的功能与 XMLHttpRequest 基本相同，但有三个差异：

1. fetch使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁；

2. fetch采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码；

3. fetch通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来；

在用法上，fetch()接受一个 URL 字符串作为参数，默认向该网址发出 GET 请求，返回一个 Promise 对象。它的基本用法如下。

```js
fetch(url)
  .then(...)
  .catch(...)
```

下面是一个demo，从服务器获取 JSON 数据。

```js
fetch('https://api.github.com/users/ruanyf')
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(err => console.log('Request Failed', err)); 
```

fetch()接收到的response是一个 [Stream 对象](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)，response.json()是一个异步操作，取出所有内容，并将其转为 JSON 对象。

Promise 可以使用 await 语法改写，使得语义更清晰。

```js
async function getJSON() {
  let url = 'https://api.github.com/users/ruanyf';
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log('Request Failed', error);
  }
}
```

上面示例中，await语句必须放在try...catch里面，这样才能捕捉异步操作中可能发生的错误。

#### 4.2.1 Response

1. Response 对象的同步属性

fetch()请求成功以后，得到的是一个 [Response 对象](https://developer.mozilla.org/en-US/docs/Web/API/Response)。它对应服务器的 HTTP 回应。

```js
const response = await fetch(url);
```

Response 包含的数据通过 Stream 接口异步读取，但是它还包含一些同步属性，对应 HTTP 回应的标头信息（Headers），可以立即读取。

```js

async function fetchText() {
  let response = await fetch('/readme.txt');
  console.log(response.status); 
  console.log(response.statusText);
}
```

response.status和response.statusText就是 Response 的同步属性，可以立即读取。

##### 4.2.1.1 标头信息

1. Response.ok

Response.ok属性返回一个布尔值，表示请求是否成功，true对应 HTTP 请求的状态码 200 到 299，false对应其他的状态码；

2. Response.status

Response.status属性返回一个数字，表示 HTTP 回应的状态码（例如200，表示成功请求）；

3. Response.statusText

Response.statusText属性返回一个字符串，表示 HTTP 回应的状态信息（例如请求成功以后，服务器返回"OK"）；

4. Response.url

Response.url属性返回请求的 URL。如果 URL 存在跳转，该属性返回的是最终 URL；

5. Response.type

Response.type属性返回请求的类型。可能的值如下：

- basic：普通请求，即同源请求；

- cors：跨域请求；

- error：网络错误，主要用于 Service Worker；

- opaque：如果fetch()请求的type属性设为no-cors，就会返回这个值。表示发出的是简单的跨域请求，类似<form>表单的那种跨域请求；

- opaqueredirect：如果fetch()请求的redirect属性设为manual，就会返回这个值；

6. Response.redirected

Response.redirected属性返回一个布尔值，表示请求是否发生过跳转。

##### 4.2.1.2 判断请求是否成功

fetch()发出请求以后，有一个很重要的注意点：只有网络错误，或者无法连接时，fetch()才会报错，其他情况都不会报错，而是认为请求成功。

这就是说，即使服务器返回的状态码是 4xx 或 5xx，fetch()也不会报错（即 Promise 不会变为 rejected状态）。

1. Response.status

Response.status属性，得到 HTTP 回应的真实状态码，才能判断请求是否成功。

```js
async function fetchText() {
  let response = await fetch('/readme.txt');
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  } else {
    throw new Error(response.statusText);
  }
}
```

response.status属性只有等于 2xx （200~299），才能认定请求成功。这里不用考虑网址跳转（状态码为 3xx），因为fetch()会将跳转的状态码自动转为 200。

2. response.ok是否为true

```js
if (response.ok) {
  // 请求成功
} else {
  // 请求失败
}
```

##### 4.2.1.3 Response.headers

Response 对象还有一个Response.headers属性，指向一个 [Headers 对象](https://developer.mozilla.org/en-US/docs/Web/API/Headers)，对应 HTTP 回应的所有标头。

Headers 对象可以使用for...of循环进行遍历。

```js
const response = await fetch(url);

for (let [key, value] of response.headers) { 
  console.log(`${key} : ${value}`);  
}

// 或者
for (let [key, value] of response.headers.entries()) { 
  console.log(`${key} : ${value}`);  
}
```

Headers 对象提供了以下方法，用来操作标头。

```js
Headers.get()：根据指定的键名，返回键值。
Headers.has()： 返回一个布尔值，表示是否包含某个标头。
Headers.set()：将指定的键名设置为新的键值，如果该键名不存在则会添加。
Headers.append()：添加标头。
Headers.delete()：删除标头。
Headers.keys()：返回一个遍历器，可以依次遍历所有键名。
Headers.values()：返回一个遍历器，可以依次遍历所有键值。
Headers.entries()：返回一个遍历器，可以依次遍历所有键值对（[key, value]）。
Headers.forEach()：依次遍历标头，每个标头都会执行一次参数函数。
```

这些方法中，最常用的是`response.headers.get()`，用于读取某个标头的值。

```js
let response =  await  fetch(url);  
response.headers.get('Content-Type')
// application/json; charset=utf-8
```

`Headers.keys()`和`Headers.values()`方法用来分别遍历标头的键名和键值

```js
// 键名
for(let key of myHeaders.keys()) {
  console.log(key);
}

// 键值
for(let value of myHeaders.values()) {
  console.log(value);
}
```

Headers.forEach()方法也可以遍历所有的键值和键名。

```js
let response = await fetch(url);
response.headers.forEach(
  (value, key) => console.log(key, ':', value)
);
```

##### 4.2.1.4. 读取内容的方法

Response对象根据服务器返回的不同类型的数据，提供了不同的读取方法。

- response.text()：得到文本字符串；
- response.json()：得到 JSON 对象；
- response.blob()：得到二进制 Blob 对象；
- response.formData()：得到 FormData 表单对象；
- response.arrayBuffer()：得到二进制 ArrayBuffer 对象；

这5个读取方法都是异步的，返回的都是 Promise 对象。必须等到异步操作结束，才能得到服务器返回的完整数据。

1. response.text()

`response.text()`可以用于获取文本数据，比如 HTML 文件。

```js
const response = await fetch('/users.html');
const body = await response.text();
document.body.innerHTML = body
```

2. response.json()

`response.json()`主要用于获取服务器返回的 JSON 数据。

3. response.formData()

`response.formData()`主要用在 Service Worker 里面，拦截用户提交的表单，修改某些数据以后，再提交给服务器。

4. response.blob()

`response.blob()`用于获取二进制文件。

```js
const response = await fetch('flower.jpg');
const myBlob = await response.blob();
const objectURL = URL.createObjectURL(myBlob);

const myImage = document.querySelector('img');
myImage.src = objectURL;
```

上面示例读取图片文件flower.jpg，显示在网页上。

5. response.arrayBuffer()

`response.arrayBuffer()`主要用于获取流媒体文件。

```js
const audioCtx = new window.AudioContext();
const source = audioCtx.createBufferSource();

const response = await fetch('song.ogg');
const buffer = await response.arrayBuffer();

const decodeData = await audioCtx.decodeAudioData(buffer);
source.buffer = buffer;
source.connect(audioCtx.destination);
source.loop = true;
```

上面示例是response.arrayBuffer()获取音频文件song.ogg，然后在线播放的例子。

##### 4.2.1.5 Response.clone

Stream 对象只能读取一次，读取完就没了。这意味着，前一节的五个读取方法，只能使用一个，否则会报错。

```js
let text =  await response.text();
let json =  await response.json();  // 报错
```

上面示例先使用了`response.text()`，就把 Stream 读完了。后面再调用`response.json()`，就没有内容可读了，所以报错。

Response 对象提供`Response.clone()`方法，创建Response对象的副本，实现多次读取。

```js
const response1 = await fetch('flowers.jpg');
const response2 = response1.clone();

const myBlob1 = await response1.blob();
const myBlob2 = await response2.blob();

image1.src = URL.createObjectURL(myBlob1);
image2.src = URL.createObjectURL(myBlob2);
```

上面示例中，`response.clone()`复制了一份 Response 对象，然后将同一张图片读取了两次。

##### 4.2.1.6 Response.body

Response.body属性是 Response 对象暴露出的底层接口，返回一个 ReadableStream 对象，供用户操作。
它可以用来分块读取内容，应用之一就是显示下载的进度。

```js
const response = await fetch('flower.jpg');
const reader = response.body.getReader();

while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```

`response.body.getReader()`方法返回一个遍历器。这个遍历器的read()方法每次返回一个对象，表示本次读取的内容块。

这个对象的done属性是一个布尔值，用来判断有没有读完；value属性是一个 arrayBuffer 数组，表示内容块的内容，而value.length属性是当前块的大小。

#### 4.2.2 定制HTTP请求

fetch()的第一个参数是 URL，还可以接受第二个参数，作为配置对象，定制发出的 HTTP 请求

```js
fetch(url, optionObj)
```

HTTP 请求的方法、标头、数据体都在这个对象里面设置。

##### 4.2.2.1 POST请求

```js
const response = await fetch(url, {
  method: 'POST',
  headers: {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  body: 'foo=bar&lorem=ipsum',
});

const json = await response.json();
```

配置对象用到了三个属性。

```js
method：HTTP 请求的方法，POST、DELETE、PUT都在这个属性设置。
headers：一个对象，用来定制 HTTP 请求的标头。
body：POST 请求的数据体。
```

注意，有些标头不能通过headers属性设置，比如`Content-Length`、Cookie、Host等等。它们是由浏览器自动生成，无法修改。

##### 4.2.2.2 提交JSON数据

```js
const user =  { name:  'John', surname:  'Smith'  };
const response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json;charset=utf-8'
  }, 
  body: JSON.stringify(user) 
});
```

标头`Content-Type`要设成`'application/json;charset=utf-8'`。因为默认发送的是纯文本，`Content-Type`的默认值是`'text/plain;charset=UTF-8'`。

##### 4.2.2.3 提交表单

```js
const form = document.querySelector('form');

const response = await fetch('/users', {
  method: 'POST',
  body: new FormData(form)
})
```

##### 4.2.2.4. 文件上传

如果表单里面有文件选择器，可以用前一个例子的写法，上传的文件包含在整个表单里面，一起提交。

另一种方法是用脚本添加文件，构造出一个表单，进行上传，请看下面的例子。

```js
const input = document.querySelector('input[type="file"]');

const data = new FormData();
data.append('file', input.files[0]);
data.append('user', 'foo');

fetch('/avatars', {
  method: 'POST',
  body: data
});
```

##### 4.2.2.5 直接上传二进制数据

fetch()也可以直接上传二进制数据，将 Blob 或 arrayBuffer 数据放在body属性里面。

```js
let blob = await new Promise(resolve =>   
  canvasElem.toBlob(resolve,  'image/png')
);

let response = await fetch('/article/fetch/post/image', {
  method:  'POST',
  body: blob
});
```

#### 4.2.3 option API

fetch()第二个参数的完整 API 如下：

```js
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors", 
  credentials: "same-origin",
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined
});
```

fetch()请求的底层用的是 [Request() 对象](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)的接口，参数完全一样，因此上面的 API 也是Request()的 API。

##### 4.2.3.1 cache

cache属性指定如何处理缓存。可能的取值如下：

- default：默认值，先在缓存里面寻找匹配的请求；
- no-store：直接请求远程服务器，并且不更新缓存；
- reload：直接请求远程服务器，并且更新缓存；
- no-cache：将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存；
- force-cache：缓存优先，只有不存在缓存的情况下，才请求远程服务器；
- only-if-cached：只检查缓存，如果缓存里面不存在，将返回504错误；

##### 4.2.3.2 mode

mode属性指定请求的模式。可能的取值如下：

- cors：默认值，允许跨域请求；
- same-origin：只允许同源请求；
- no-cors：请求方法只限于 GET、POST 和 HEAD，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求；

##### 4.2.3.3. credentials

credentials属性指定是否发送 Cookie。可能的取值如下：

- same-origin：默认值，同源请求时发送 Cookie，跨域请求时不发送；
- include：不管同源请求，还是跨域请求，一律发送 Cookie；
- omit：一律不发送；

跨域请求发送 Cookie，需要将credentials属性设为include。

```js
fetch('http://another.com', {
  credentials: "include"
});
```

##### 4.2.3.4 signal

signal属性指定一个 `AbortSignal` 实例，用于取消fetch()请求。

##### 4.2.3.5 keepalive

keepalive属性用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据。

一个典型的场景就是，用户离开网页时，脚本向服务器提交一些用户行为的统计信息。这时，如果不用keepalive属性，数据可能无法发送，因为浏览器已经把页面卸载了。

```js
window.onunload = function() {
  fetch('/analytics', {
    method: 'POST',
    body: "statistics",
    keepalive: true
  });
};
```

##### 4.2.3.6. redirect

redirect属性指定 HTTP 跳转的处理方法。可能的取值如下：

- follow：默认值，fetch()跟随 HTTP 跳转；
- error：如果发生跳转，fetch()就报错；
- manual：fetch()不跟随 HTTP 跳转，但是response.url属性会指向新的 URL，response.redirected属性会变为true，由开发者自己决定后续如何处理跳转；

##### 4.2.3.7. integrity

integrity属性指定一个哈希值，用于检查 HTTP 回应传回的数据是否等于这个预先设定的哈希值。

比如，下载文件时，检查文件的 SHA-256 哈希值是否相符，确保没有被篡改。

```js
fetch('http://site.com/file', {
  integrity: 'sha256-abcdef'
});
```

##### 4.2.3.8. referrer

referrer属性用于设定fetch()请求的referer标头。

这个属性可以为任意字符串，也可以设为空字符串（即不发送referer标头）。

```js
fetch('/page', {
  referrer: ''
});
```

##### 4.2.3.9. referrerPolicy

referrerPolicy属性用于设定Referer标头的规则。可能的取值如下：

- `no-referrer-when-downgrade`：默认值，总是发送Referer标头，除非从 HTTPS 页面请求 HTTP 资源时不发送；
- `no-referrer`：不发送Referer标头；
- `origin`：Referer标头只包含域名，不包含完整的路径；
- `origin-when-cross-origin`：同源请求Referer标头包含完整的路径，跨域请求只包含域名；
- `same-origin`：跨域请求不发送Referer，同源请求发送；
- `strict-origin`：Referer标头只包含域名，HTTPS 页面请求 HTTP 资源时不发送Referer标头；
- `strict-origin-when-cross-origin`：同源请求时Referer标头包含完整路径，跨域请求时只包含域名，HTTPS 页面请求 HTTP 资源时不发送该标头；
- `unsafe-url`：不管什么情况，总是发送Referer标头；

#### 4.2.4. fetch cancel

fetch()请求发送以后，如果中途想要取消，需要使用`AbortController`对象。

```js

let controller = new AbortController();
let signal = controller.signal;

fetch(url, {
  signal: controller.signal
});

signal.addEventListener('abort',
  () => console.log('abort!')
);

controller.abort(); // 取消

console.log(signal.aborted); // true
```

上面示例中，首先新建 AbortController 实例，然后发送fetch()请求，配置对象的signal属性必须指定接收 `AbortController` 实例发送的信号`controller.signal`。

`controller.abort()`方法用于发出取消信号。这时会触发abort事件，这个事件可以监听，也可以通过`controller.signal.aborted`属性判断取消信号是否已经发出。

下面是一个1秒后自动取消请求的例子。

```js
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/long-operation', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') {
    console.log('Aborted!');
  } else {
    throw err;
  }
}
```

#### 4.2.5 测试

针对json-server服务，只需要执行：

```js
fetch('http://localhost:3000/posts')
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });
```

有兴趣的同学可以参考：[fetch polyfill](https://github.com/github/fetch)

### 4.3 axios

[github地址](https://github.com/axios/axios)

[官网地址](https://axios-http.com/)

axios是一个用于网络请求的第三方库，是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端，它本身具有以下特征：

- 从浏览器中创建 `XMLHttpRequest`；
- 从 node.js 发出 http 请求；
- 支持 Promise API；
- 拦截请求和响应；
- 转换请求和响应数据；
- 取消请求；
- 自动转换JSON数据；
- 客户端支持防止CSRF/XSRF；

#### 4.3.1 基础使用

Axios 提供了两种不同的形式来发送 HTTP 请求：

##### 4.3.1.1. 方法

`axios(config)` 方法接收一个对象，这个对象包含了一些对请求的配置， axios 会根据这些配置来发送对应的 HTTP 请求

最基本的配置项应该包括：

1. method 请求的方法（可选值： get , post 等）；
2. url 请求的地址 （必须项）；
3. data 请求发送的数据（post等请求需要）；

默认的请求方法是get所以如果是get请求可以不设置method

```js
// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

请求响应的处理在 then 和 catch 回调中，请求正常会进入 then ，请求异常则会进 catch

```js
// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
}).then(res => {
    consloe.log(res)
}).catch(err => {
    console.log(err)
})

// 发送 GET 请求（默认的方法）
axios('/user/12345');
```

##### 4.3.1.2 请求别名

```js
// 发送GET请求
axios.get('/user?ID=12345').then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});

// 发送POST请求
发送post请求
axios.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone'
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});
```

#### 4.3.2 响应数据

其中的 data 是后端返回的数据，一般只需要关注 `response` 中的 `data` 字段就行

```js
{
  // `data` 由服务器提供的响应
  data: {},
  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,
  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',
  // `headers` 服务器响应的头
  headers: {},
   // `config` 是为请求提供的配置信息
  config: {},
 // 'request'
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

#### 4.3.3 创建实例

可以使用自定义配置新建一个 axios 实例 `axios.create([config])`：

```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

```

创建的实例中的 axios() api 改为了 request() api，使用方式是一样的，其他如请求别名等函数，都没有改变

以下是实例所拥有的方法

- request(config)；
- get(url[, config])；
- delete(url[, config])；
- head(url[, config])；
- options(url[, config])；
- post(url[, data[, config]])；
- put(url[, data[, config]])；
- patch(url[, data[, config]])；

axios会把这些 方法中的config 会和创建实例时指定的 config 合并到一起使用

#### 4.3.4 拦截器

- `axios.interceptors.request` 请求拦截器
- `axios.interceptors.response` 响应拦截器

```js

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.header["Token"] = "xxxx"
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.status === 200){
    return response.data
  } else {
    return Promise.reject(new Error('error'))
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
```

如果想要取消拦截器，可以通过使用一个变量来接收设置拦截器时返回的实例，然后使用 eject 来取消拦截器

```js
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

#### 4.3.5 完整的请求配置

```js
{
   // `url` 是用于请求的服务器 URL
  url: '/user',
  // `method` 是创建请求时使用的方法
  method: 'get', // default
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],
  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },
   // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,
   // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default
  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },
 // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
   // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default
  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default
   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default
  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
   // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },
   // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,
  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default
  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default
  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}

```

#### 4.3.6 测试

针对`json-server`服务，只需要执行：

```js
const axios = require('axios');

axios
  .get('http://localhost:3000/posts')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

```

### 4.4. 总结

1. Ajax 是`Async Javascript And Xml`的简称，它是原生JavaScript的一种请求方案，利用 XMLHttpRequest 进行异步请求数据，实现无感刷新数据；
2. Fetch 是 ES6 新推出的一套异步请求方案，它天生自带 Promise，同时也是原生的，如果在较小项目中为了项目大小着想和兼容性不是那么高的前提下不妨可以用它来进行异步请求也是不错的；
3. Axios 是基于 Ajax 和 Promise 封装的一个库，可以利用Promise来更好的管控请求回调嵌套造成的回调地狱；

# **JavaScript的垃圾回收和内存泄漏**

https://www.yuque.com/lpldplws/atomml/my01zht47ol0dh2u?singleDoc# 《JavaScript的垃圾回收和内存泄漏》 密码：kb86

## 1. 课程目标

1. 掌握JavaScript和V8中的垃圾回收机制；
2. 掌握常见的内存泄漏事件及排查方法；

## 2. 课程大纲

1. JavaScript的垃圾回收机制；
2. JavaScript的内存泄漏；

## 3. JavaScript的垃圾回收机制

### 3.1. 什么是GC

GC 即 `Garbage Collection` ，程序工作过程中会产生很多垃圾，这些垃圾是程序不用的内存或者是之前用过了，以后不会再用的内存空间，而 GC 就是负责回收垃圾的，因为他工作在引擎内部，所以对于我们前端来说，GC 过程是相对比较无感的，这一套引擎执行而对我们又相对无感的操作也就是常说的 `垃圾回收机制`。

当然也不是所有语言都有 GC，一般的高级语言里面会自带 GC，比如 Java、Python、JavaScript 等，也有无 GC 的语言，比如 C、C++ 等，那这种就需要我们程序员手动管理内存了，相对比较麻烦。

### 3.2. 垃圾产生&为何回收

我们知道写代码时创建一个基本类型、对象、函数等时都是需要占用内存的，但是我们并不关注这些，因为这是引擎为我们分配的，我们不需要显式手动的去分配内存
我们举个简单的例子：

```js
let test = {
  name: "xianzao"
};
test = [1,2,3,4,5]
```

假设它是一个完整的程序代码

我们知道 JavaScript 的引用数据类型是保存在堆内存中的，然后在栈内存中保存一个对堆内存中实际对象的引用，所以，JavaScript 中对引用数据类型的操作都是操作对象的引用而不是实际的对象。可以简单理解为，栈内存中保存了一个地址，这个地址和堆内存中的实际值是相关的。

那上面代码首先我们声明了一个变量 test，它引用了对象 {name: 'xianzao'}，接着我们把这个变量重新赋值了一个数组对象，也就变成了该变量引用了一个数组，那么之前的对象引用关系就没有了，如下图

```js
堆     	      栈
test   ->    {name: "xianzao"}
test   ->    [1,2,3,4,5]
```

没有了引用关系后，这部分内存就不会被使用了，一个两个还好，多了的话内存也会受不了，所以就需要被清理（回收）。

程序的运行需要内存，只要程序提出要求，操作系统或者运行时就必须提供内存，那么对于持续运行的服务进程，必须要及时释放内存，否则，内存占用越来越高，轻则影响系统性能，重则就会导致进程崩溃。

### 3.3. 垃圾回收策略

在 JavaScript 内存管理中有一个概念叫做 `可达性`，就是那些以某种方式可访问或者说可用的值，它们被保证存储在内存中，反之不可访问则需回收。

至于如何回收，其实就是怎样发现这些不可达的对象（垃圾）它并给予清理的问题， JavaScript 垃圾回收机制的原理就是定期找出那些不再用到的内存（变量），然后释放其内存。（不是实时的找出无用内存并释放的原因：实时开销太大了）。

#### 3.3.1. 标记清除法

##### 3.3.1.1. 策略

标记清除（`Mark-Sweep`），目前在 JavaScript引擎 里这种算法是最常用的，到目前为止的大多数浏览器的 JavaScript引擎 都在采用标记清除算法，只是各大浏览器厂商还对此算法进行了优化加工，且不同浏览器的 JavaScript引擎 在运行垃圾回收的频率上有所差异。

此算法分为 标记 和 清除 两个阶段，标记阶段即为所有活动对象做上标记，清除阶段则把没有标记（也就是非活动对象）销毁。

你可能会疑惑怎么给变量加标记？

1. 当变量进入执行环境时，反转某一位（通过一个二进制字符来表示标记）；
2. 维护进入环境变量和离开环境变量这样两个列表，可以自由的把变量从一个列表转移到另一个列表；

其实，怎样标记对我们来说并不重要，重要的是策略。

引擎在执行 GC（使用标记清除算法）时，需要从出发点去遍历内存中所有的对象去打标记，而这个出发点有很多，我们称之为一组 根 对象，而所谓的根对象，其实在浏览器环境中包括又不止于 全局Window对象、文档DOM树 等。

整个标记清除算法大致过程就像下面这样：

1. 垃圾收集器在运行时会给内存中的所有变量都加上一个标记，假设内存中所有对象都是垃圾，全标记为0；
2. 然后从各个根对象开始遍历，把不是垃圾的节点改成1；
3. 清理所有标记为0的垃圾，销毁并回收它们所占用的内存空间；
4. 最后，把所有内存中对象标记修改为0，等待下一轮垃圾回收；

##### 3.3.1.2. 优点

实现比较简单，打标记也无非打与不打两种情况，这使得一位二进制位（0和1）就可以为其标记，非常简单

##### 3.3.1.3. 缺点

在清除之后，剩余的对象内存位置是不变的，也会导致空闲内存空间是不连续的，出现了 内存碎片，并且由于剩余空闲内存不是一整块，它是由不同大小内存组成的内存列表，这就牵扯出了内存分配的问题：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092420475-d1abba3c-6ec4-40a5-92c4-1da4e53c8dfe.png)

假设我们新建对象分配内存时需要大小为 size，由于空闲内存是间断的、不连续的，则需要对空闲内存列表进行一次单向遍历找出大于等于 size 的块才能为其分配:

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092419187-0ff8a6ee-85c1-4a9c-8bc0-745843ebfd04.png)

常见包括三种分配策略找到合适的块内存：

1. `First-fit`，找到大于等于 size 的块立即返回；
2. `Best-fit`，遍历整个空闲列表，返回大于等于 size 的最小分块；
3. `Worst-fit`，遍历整个空闲列表，找到最大的分块，然后切成两部分，一部分 size 大小，并将该部分返回

这三种策略里面 `Worst-fit` 的空间利用率看起来是最合理，但实际上切分之后会造成更多的小块，形成内存碎片，所以不推荐使用，对于` First-fit` 和 `Best-fit`来说，考虑到分配的速度和效率 First-fit 是更为明智的选择

综上所述，标记清除算法或者说策略就有两个很明显的缺点：

1. 内存碎片化，空闲内存块是不连续的，容易出现很多空闲内存块，还可能会出现分配所需内存过大的对象时找不到合适的块；
2. 分配速度慢，因为即便是使用 `First-fit` 策略，其操作仍是一个 O(n) 的操作，最坏情况是每次都要遍历到最后，同时因为碎片化，大对象的分配效率会更慢；

归根结底，标记清除算法的缺点在于清除之后剩余的对象位置不变而导致的空闲内存不连续，所以只要解决这一点，两个缺点都可以完美解决了

而 标记整理（Mark-Compact）算法 就可以有效地解决，它的标记阶段和标记清除算法没有什么不同，只是标记结束后，标记整理算法会将活着的对象（即不需要清理的对象）向内存的一端移动，最后清理掉边界的内存：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092423372-e0a9490e-095c-4340-b713-b0edd65a9c65.png)

#### 3.3.2. 引用计数算法

##### 3.3.2.1. 策略

引用计数（`Reference Counting`），这其实是早先的一种垃圾回收算法，它把 对象是否不再需要 简化定义为 对象有没有其他对象引用到它，如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收，但因为它的问题很多，目前很少使用这种算法了。

它的策略是跟踪记录每个变量值被使用的次数

1. 当声明了一个变量并且将一个引用类型赋值给该变量的时候这个值的引用次数就为 1；
2. 如果同一个值又被赋给另一个变量，那么引用数加 1；
3. 如果该变量的值被其他的值覆盖了，则引用次数减 1；
4. 当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，回收空间，垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的内存；

```js
let a = new Object() 	// 此对象的引用计数为 1（a引用）
let b = a 		// 此对象的引用计数是 2（a,b引用）
a = null  		// 此对象的引用计数为 1（b引用）
b = null 	 	// 此对象的引用计数为 0（无引用）
...			// GC 回收此对象
```

虽然这种方式很简单，但是在引用计数这种算法出现没多久，就遇到了一个很严重的问题——循环引用，即对象 A 有一个指针指向对象 B，而对象 B 也引用了对象 A：

```js
function test(){
  let A = new Object()
  let B = new Object()
  
  A.b = B
  B.a = A
}
```

对象 A 和 B 通过各自的属性相互引用着，按照上文的引用计数策略，它们的引用数量都是 2，但是，在函数 test 执行完成之后，对象 A 和 B 是要被清理的，但使用引用计数则不会被清理，因为它们的引用数量不会变成 0，假如此函数在程序中被多次调用，那么就会造成大量的内存不会被释放。

我们再用标记清除的角度看一下，当函数结束后，两个对象都不在作用域中，A 和 B 都会被当作非活动对象来清除掉，相比之下，引用计数则不会释放，也就会造成大量无用内存占用，这也是后来放弃引用计数，使用标记清除的原因之一。

在 IE8 以及更早版本的 IE 中，BOM 和 DOM 对象并非是原生 JavaScript 对象，它是由 C++ 实现的 组件对象模型对象（COM，Component Object Model），而 COM 对象使用 引用计数算法来实现垃圾回收，所以即使浏览器使用的是标记清除算法，只要涉及到  COM 对象的循环引用，就还是无法被回收掉，就比如两个互相引用的 DOM 对象等等，而想要解决循环引用，需要将引用地址置为 null 来切断变量与之前引用值的关系：

不过在 IE9 及以后的 BOM 与 DOM 对象都改成了 JavaScript 对象，也就避免了上面的问题。

```js
// COM对象 
let ele = document.getElementById("xxx")
let obj = new Object() 

// 造成循环引用 
obj.ele = ele 
ele.obj = obj

// 切断引用关系 
obj.ele = null 
ele.obj = null
```

##### 3.3.2.2. 优点

1. 引用计数在引用值为 0 时，也就是在变成垃圾的那一刻就会被回收，所以它可以立即回收垃圾；
2. 标记清除算法需要每隔一段时间进行一次，那在应用程序（JS脚本）运行过程中线程就必须要暂停去执行一段时间的 GC，另外，标记清除算法需要遍历堆里的活动以及非活动对象来清除，而引用计数则只需要在引用时计数就可以了；

##### 3.3.2.3. 缺点

1. 需要一个计数器，而此计数器需要占很大的位置，因为我们也不知道被引用数量的上限；
2. 无法解决循环引用无法回收的问题；

### 3.4 V8对GC的优化

#### 3.4.1. 分代式垃圾回收

上文所说的垃圾回收策略在每次垃圾回收时都要检查内存中所有的对象，这样的话对于一些大、老、存活时间长的对象来说，同新、小、存活时间短的对象一个频率的检查很不好，因为前者需要时间长并且不需要频繁进行清理，后者恰好相反，这也是分代式的原则。

##### 3.4.1.1. 新老生代

V8 的垃圾回收策略主要基于分代式垃圾回收机制，V8 中将堆内存分为新生代和老生代两区域，采用不同的垃圾回收器也就是不同的策略管理垃圾回收。

新生代的对象为存活时间较短的对象，简单来说就是新产生的对象，通常只支持 1～8M 的容量，而老生代的对象为存活事件较长或常驻内存的对象，简单来说就是经历过新生代垃圾回收后还存活下来的对象，容量通常比较大

V8 整个堆内存的大小就等于新生代加上老生代的内存：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092423162-0bd1d171-318b-425c-b623-3a1295c3d72a.png)

对于新老两块内存区域的垃圾回收，V8 采用了两个垃圾回收器来管控，我们暂且将管理新生代的垃圾回收器叫做新生代垃圾回收器，同样的，我们称管理老生代的垃圾回收器叫做老生代垃圾回收器。

##### 3.4.1.2. 新生代垃圾回收

新生代对象是通过一个名为 `Scavenge` 的算法进行垃圾回收，在 `Scavenge`算法 的具体实现中，主要采用了一种复制式的方法即 `Cheney`算法：

`Cheney`算法 中将堆内存一分为二，一个是处于使用状态的空间我们暂且称之为 使用区，一个是处于闲置状态的空间我们称之为 空闲区：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092423947-e7c13bc1-b9f4-431a-bc36-4b56d8bd67af.png)

新加入的对象都会存放到使用区，当使用区快被写满时，就需要执行一次垃圾清理操作。

当开始进行垃圾回收时，新生代垃圾回收器会对使用区中的活动对象做标记，标记完成之后将使用区的活动对象复制进空闲区并进行排序，随后进入垃圾清理阶段，即将非活动对象占用的空间清理掉。最后进行角色互换，把原来的使用区变成空闲区，把原来的空闲区变成使用区。

当一个对象经过多次复制后依然存活，它将会被认为是生命周期较长的对象，随后会被移动到老生代中，采用老生代的垃圾回收策略进行管理。

另外还有一种情况，如果复制一个对象到空闲区时，空闲区空间占用超过了 25%，那么这个对象会被直接晋升到老生代空间中，设置为 25% 的比例的原因是，当完成 `Scavenge` 回收后，空闲区将翻转成使用区，继续进行对象内存的分配，若占比过大，将会影响后续内存分配。

##### 3.4.1.3. 老生代垃圾回收

相比于新生代，老生代的垃圾回收就比较容易理解了，上面我们说过，对于大多数占用空间大、存活时间长的对象会被分配到老生代里，因为老生代中的对象通常比较大，如果再如新生代一般分区然后复制来复制去就会非常耗时，从而导致回收执行效率不高，所以老生代垃圾回收器来管理其垃圾回收执行，它的整个流程就采用的就是标记清除了。

首先是标记阶段，从一组根元素开始，递归遍历这组根元素，遍历过程中能到达的元素称为活动对象，没有到达的元素就可以判断为非活动对象。

清除阶段老生代垃圾回收器会直接将非活动对象，也就是数据清理掉。

前面我们也提过，标记清除算法在清除后会产生大量不连续的内存碎片，过多的碎片会导致大对象无法分配到足够的连续内存，而 V8 中就采用了上文中说的标记整理算法来解决这一问题来优化空间。

分代式机制把一些新、小、存活时间短的对象作为新生代，采用一小块内存频率较高的快速清理，而一些大、老、存活时间长的对象作为老生代，使其很少接受检查，新老生代的回收机制及频率是不同的，可以说此机制的出现很大程度提高了垃圾回收机制的效率。

#### 3.4.2. 并行回收(Parallel)

先了解一个概念：全停顿（`Stop-The-World`），我们都知道 JavaScript 是一门单线程的语言，它是运行在主线程上的，那在进行垃圾回收时就会阻塞 JavaScript 脚本的执行，需等待垃圾回收完毕后再恢复脚本执行，我们把这种行为叫做 全停顿。

比如一次 GC 需要 60ms ，那我们的应用逻辑就得暂停 60ms ，假如一次 GC 的时间过长，对用户来说就可能造成页面卡顿等问题。这里，引入多个辅助线程来同时处理，以此加速垃圾回收的执行速度，因此 V8 团队引入了并行回收机制。

所谓并行，也就是同时的意思，它指的是垃圾回收器在主线程上执行的过程中，开启多个辅助线程，同时执行同样的回收工作。

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092421822-e71467b9-bb01-4bc6-a8ca-a9cb4d8c53a1.png)

简单来说，使用并行回收，假如本来是主线程一个人干活，它一个人需要 3 秒，现在叫上了 2 个辅助线程和主线程一块干活，那三个人一块干一个人干 1 秒就完事了，但是由于多人协同办公，所以需要加上一部分多人协同（同步开销）的时间我们算 0.5 秒好了，也就是说，采用并行策略后，本来要 3 秒的活现在 1.5 秒就可以干完了。

新生代对象空间就采用并行策略，在执行垃圾回收的过程中，会启动了多个线程来负责新生代中的垃圾清理操作，这些线程同时将对象空间中的数据移动到空闲区域，这个过程中由于数据地址会发生改变，所以还需要同步更新引用这些对象的指针，这就是并行回收。

#### 3.4.3. 增量标记与懒性清理

并行策略虽然可以增加垃圾回收的效率，对于新生代垃圾回收器能够有很好的优化，但是它还是一种全停顿式的垃圾回收方式，对于老生代来说，它的内部存放的都是一些比较大的对象，对于这些大的对象 GC 时哪怕我们使用并行策略依然可能会消耗大量时间。

所以为了减少全停顿的时间，在 2011 年，V8 对老生代的标记进行了优化，从全停顿标记切换到增量标记。

##### 3.4.3.1. 什么是增量

增量就是将一次 GC 标记的过程，分成了很多小步，每执行完一小步就让应用逻辑执行一会儿，这样交替多次后完成一轮 GC 标记：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092423467-06f47b6e-c3d5-4366-a8a4-0a7e71c66097.png)将一次完整的 GC 标记分次执行，那在每一小次 GC 标记执行完之后如何暂停下来去执行任务程序，而后又怎么恢复呢？那假如我们在一次完整的 GC 标记分块暂停后，执行任务程序时内存中标记好的对象引用关系被修改了又怎么办呢？

##### 3.4.3.2. 三色标记法(暂停与恢复)

我们知道老生代是采用标记清理算法，而上文的标记清理中我们说过，也就是在没有采用增量算法之前，单纯使用黑色和白色来标记数据就可以了，其标记流程即在执行一次完整的 GC 标记前，垃圾回收器会将所有的数据置为白色，然后垃圾回收器在会从一组跟对象出发，将所有能访问到的数据标记为黑色，遍历结束之后，标记为黑色的数据对象就是活动对象，剩余的白色数据对象也就是待清理的垃圾对象。

如果采用非黑即白的标记策略，那在垃圾回收器执行了一段增量回收后，暂停后启用主线程去执行了应用程序中的一段 JavaScript 代码，随后当垃圾回收器再次被启动，这时候内存中黑白色都有，我们无法得知下一步走到哪里了

为了解决这个问题，V8 团队采用了一种特殊方式： 三色标记法

三色标记法即使用每个对象的两个标记位和一个标记工作表来实现标记，两个标记位编码三种颜色：白、灰、黑

1. 白色指的是未被标记的对象；
2. 灰色指自身被标记，成员变量（该对象的引用对象）未被标记；
3. 黑色指自身和成员变量皆被标记；

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092424752-ed9ce30f-d088-48f5-97ff-10bf496e4652.png)

如上图所示，我们用最简单的表达方式来解释这一过程，最初所有的对象都是白色，意味着回收器没有标记它们，从一组根对象开始，先将这组根对象标记为灰色并推入到标记工作表中，当回收器从标记工作表中弹出对象并访问它的引用对象时，将其自身由灰色转变成黑色，并将自身的下一个引用对象转为灰色；

就这样一直往下走，直到没有可标记灰色的对象时，也就是无可达（无引用）的对象了，那么剩下的所有白色对象都是无法到达的，即等待回收（如上图中的 C、E 将要等待回收）。

采用三色标记法后我们在恢复执行时就好办多了，可以直接通过当前内存中有没有灰色节点来判断整个标记是否完成，如没有灰色节点，直接进入清理阶段，如还有灰色标记，恢复时直接从灰色的节点开始继续执行就可以。

三色标记法的 mark 操作可以渐进执行的而不需每次都扫描整个内存空间，可以很好的配合增量回收进行暂停恢复的一些操作，从而减少 全停顿 的时间。

##### 3.4.3.3. 写屏障(增量中修改引用)

一次完整的 GC 标记分块暂停后，执行任务程序时内存中标记好的对象引用关系被修改了，增量中修改引用，可能不太好理解，我们举个例子：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092425720-52f7efe6-6ccb-4e17-a1f0-d4190d4f8c9e.png)

假如我们有 A、B、C 三个对象依次引用，在第一次增量分段中全部标记为黑色（活动对象），而后暂停开始执行应用程序也就是 JavaScript 脚本，在脚本中我们将对象 B 的指向由对象 C 改为了对象 D ，接着恢复执行下一次增量分段。

这时其实对象 C 已经无引用关系了，但是目前它是黑色（代表活动对象）此一整轮 GC 是不会清理 C 的，不过我们可以不考虑这个，因为就算此轮不清理等下一轮 GC 也会清理，这对我们程序运行并没有太大影响。

我们再看新的对象 D 是初始的白色，按照我们上面所说，已经没有灰色对象了，也就是全部标记完毕接下来要进行清理了，新修改的白色对象 D 将在次轮 GC 的清理阶段被回收，还有引用关系就被回收，后面我们程序里可能还会用到对象 D 呢，这肯定是不对的。

为了解决这个问题，V8 增量回收使用 写屏障 (`Write-barrier`) 机制，即一旦有黑色对象引用白色对象，该机制会强制将引用的白色对象改为灰色，从而保证下一次增量 GC 标记阶段可以正确标记，这个机制也被称作 强三色不变性。

那在我们上图的例子中，将对象 B 的指向由对象 C 改为对象 D 后，白色对象 D 会被强制改为灰色。

##### 3.4.3.4. 懒性清理

增量标记其实只是对活动对象和非活动对象进行标记，对于真正的清理释放内存 V8 采用的是惰性清理(`Lazy Sweeping`)

增量标记完成后，惰性清理就开始了。当增量标记完成后，假如当前的可用内存足以让我们快速的执行代码，其实我们是没必要立即清理内存的，可以将清理过程稍微延迟一下，让 JavaScript 脚本代码先执行，也无需一次性清理完所有非活动对象内存，可以按需逐一进行清理直到所有的非活动对象内存都清理完毕，后面再接着执行增量标记。

##### 3.4.3.5. 增量标记与惰性清理的优缺？

增量标记与惰性清理的出现，使得主线程的停顿时间大大减少了，让用户与浏览器交互的过程变得更加流畅。但是由于每个小的增量标记之间执行了 JavaScript 代码，堆中的对象指针可能发生了变化，需要使用写屏障技术来记录这些引用关系的变化，所以增量标记缺点也很明显：

1. 并没有减少主线程的总暂停的时间，甚至会略微增加；
2. 由于写屏障机制的成本，增量标记可能会降低应用程序的吞吐量；

#### 3.4.4. 并发回收(Concurrent)

前面我们说并行回收依然会阻塞主线程，增量标记同样有增加了总暂停时间、降低应用程序吞吐量两个缺点，那么怎么才能在不阻塞主线程的情况下执行垃圾回收并且与增量相比更高效呢？

这就要说到并发回收了，它指的是主线程在执行 JavaScript 的过程中，辅助线程能够在后台完成执行垃圾回收的操作，辅助线程在执行垃圾回收的时候，主线程也可以自由执行而不会被挂起：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092425501-75560169-0fc6-4607-9d9a-cd96a03db8fe.png)

辅助线程在执行垃圾回收的时候，主线程也可以自由执行而不会被挂起，这是并发的优点，但同样也是并发回收实现的难点，因为它需要考虑主线程在执行 JavaScript  时，堆中的对象引用关系随时都有可能发生变化，这时辅助线程之前做的一些标记或者正在进行的标记就会要有所改变，所以它需要额外实现一些读写锁机制来控制这一点。

#### 3.4.4. 总结

V8 的垃圾回收策略主要基于分代式垃圾回收机制，这我们说过，关于新生代垃圾回收器，我们说使用并行回收可以很好的增加垃圾回收的效率，上述的这三种方式各有优缺点，所以在老生代垃圾回收器中这几种策略都是融合使用的：

1. 老生代主要使用并发标记，主线程在开始执行 JavaScript 时，辅助线程也同时执行标记操作（标记操作全都由辅助线程完成）；
2. 标记完成之后，再执行并行清理操作（主线程在执行清理操作时，多个辅助线程也同时执行清理操作）；
3. 清理的任务会采用增量的方式分批在各个 JavaScript 任务之间执行；

## 4. JavaScript的内存泄漏

### 4.1. 什么是内存泄漏

引擎中有垃圾回收机制，它主要针对一些程序中不再使用的对象，对其清理回收释放掉内存。

那么垃圾回收机制会把不再使用的对象（垃圾）全都回收掉吗？

其实引擎虽然针对垃圾回收做了各种优化从而尽可能的确保垃圾得以回收，但并不是说我们就可以完全不用关心这块了，我们代码中依然要主动避免一些不利于引擎做垃圾回收操作，因为不是所有无用对象内存都可以被回收的，那当不再用到的对象内存，没有及时被回收时，这种场景称之为内存泄漏（`Memory leak`）。

### 4.2. 常见的内存泄漏

#### 4.2.1. 不正当的闭包

闭包是指有权访问另一个函数作用域中的变量的函数

```javascript
function fn1(){
  let test = new Array(1000).fill('xianzao')
  return function(){
    console.log('zaoxian')
  }
}
let fn1Child = fn1()
fn1Child()
```

Q：上例是闭包吗？它造成内存泄漏了吗？

显然它是一个典型闭包，但是它并没有造成内存泄漏，因为返回的函数中并没有对 fn1 函数内部的引用，也就是说，函数 fn1 内部的 test 变量完全是可以被回收的，再来看：

```javascript
function fn2(){
  let test = new Array(1000).fill('xianzao')
  return function(){
    console.log(test)
    return test
  }
}
let fn2Child = fn2()
fn2Child()
```

Q：上例是闭包吗？它造成内存泄漏了吗？

显然它也是闭包，并且因为 return 的函数中存在函数 fn2 中的 test 变量引用，所以 test 并不会被回收，也就造成了内存泄漏。

那么怎样解决呢？

其实在函数调用后，把外部的引用关系置空就好了，如下：

```js
function fn2(){
  let test = new Array(1000).fill('xianzao')
  return function(){
    console.log(test)
    return test
  }
}
let fn2Child = fn2()
fn2Child()
fn2Child = null
```

#### 4.2.2. 隐式全局变量

JavaScript 的垃圾回收是自动执行的，垃圾回收器每隔一段时间就会找出那些不再使用的数据，并释放其所占用的内存空间。

再来看全局变量和局部变量，函数中的局部变量在函数执行结束后这些变量已经不再被需要，所以垃圾回收器会识别并释放它们。但是对于全局变量，垃圾回收器很难判断这些变量什么时候才不被需要，所以全局变量通常不会被回收，我们使用全局变量是 OK 的，但同时我们要避免一些额外的全局变量产生，如下：

```javascript
function fn(){
  // 没有声明从而制造了隐式全局变量test1
  test1 = new Array(1000).fill('xianzao')
  
  // 函数内部this指向window，制造了隐式全局变量test2
  this.test2 = new Array(1000).fill('xianzao')
}
fn()
```

调用函数 fn ，因为 没有声明 和 函数中this 的问题造成了两个额外的隐式全局变量，这两个变量不会被回收，这种情况我们要尽可能的避免，在开发中我们可以使用严格模式或者通过 lint 检查来避免这些情况的发生，从而降低内存成本。

除此之外，我们在程序中也会不可避免的使用全局变量，这些全局变量除非被取消或者重新分配之外也是无法回收的，这也就需要我们额外的关注，也就是说当我们在使用全局变量存储数据时，要确保使用后将其置空或者重新分配，当然也很简单，在使用完将其置为 null 即可，特别是在使用全局变量做持续存储大量数据的缓存时，我们一定要记得设置存储上限并及时清理，不然的话数据量越来越大，内存压力也会随之增高。

```javascript
var test = new Array(10000)

// do something

test = null
```

#### 4.2.3. 游离DOM引用

考虑到性能或代码简洁方面，我们代码中进行 DOM 时会使用变量缓存 DOM 节点的引用，但移除节点的时候，我们应该同步释放缓存的引用，否则游离的子树无法释放：

```javascript
<div id="root">
  <ul id="ul">
    <li></li>
    <li></li>
    <li id="li3"></li>
    <li></li>
  </ul>
</div>
<script>
  let root = document.querySelector('#root')
  let ul = document.querySelector('#ul')
  let li3 = document.querySelector('#li3')
  
  // 由于ul变量存在，整个ul及其子元素都不能GC
  root.removeChild(ul)
  
  // 虽置空了ul变量，但由于li3变量引用ul的子节点，所以ul元素依然不能被GC
  ul = null
  
  // 已无变量引用，此时可以GC
  li3 = null
</script>
```

如上所示，当我们使用变量缓存 DOM 节点引用后删除了节点，如果不将缓存引用的变量置空，依然进行不了 GC，也就会出现内存泄漏。

假如我们将父节点置空，但是被删除的父节点其子节点引用也缓存在变量里，那么就会导致整个父 DOM 节点树下整个游离节点树均无法清理，还是会出现内存泄漏，解决办法就是将引用子节点的变量也置空，如下图：

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092426328-6cbba7d6-1fe6-4fc9-87ea-8bb56cc29bb7.png)

#### 4.2.4. 定时器

开发时我们经常会用到计时器，也就是 `setTimeout` 和 `setInterval`，先来看一个例子：

```javascript
// 获取数据
let someResource = getData()
setInterval(() => {
  const node = document.getElementById('Node')
	if(node) {
    node.innerHTML = JSON.stringify(someResource))
	}
}, 1000)
```

代码中每隔一秒就将得到的数据放入到 Node 节点中去，但是在 `setInterval` 没有结束前，回调函数里的变量以及回调函数本身都无法被回收。

什么才叫结束呢？也就是调用了 `clearInterval`。如果没有被 clear 掉的话，就会造成内存泄漏。不仅如此，如果回调函数没有被回收，那么回调函数内依赖的变量也没法被回收。所以在上例中，`someResource` 就没法被回收。

同样，`setTiemout` 也会有同样的问题，所以，当不需要 interval 或者 timeout 时，最好调用 `clearInterval` 或者 `clearTimeout`来清除，另外，浏览器中的 `requestAnimationFrame` 也存在这个问题，我们需要在不需要的时候用 `cancelAnimationFrame` API 来取消使用。

#### 4.2.5. 事件监听器

当事件监听器在组件内挂载相关的事件处理函数，而在组件销毁时不主动将其清除时，其中引用的变量或者函数都被认为是需要的而不会进行回收，如果内部引用的变量存储了大量数据，可能会引起页面占用内存过高，这样就造成意外的内存泄漏。

我们就拿 Vue 组件来举例子，React 里也是一样的：

```javascript
<template>
  <div></div>
</template>

<script>
export default {
  created() {
    window.addEventListener("resize", this.doSomething)
  },
  beforeDestroy(){
    window.removeEventListener("resize", this.doSomething)
  },
  methods: {
    doSomething() {
      // do something
    }
  }
}
</script>
```

#### 4.2.6. Map、Set对象

当使用 Map 或 Set 存储对象时，同 Object 一致都是强引用，如果不将其主动清除引用，其同样会造成内存不自动进行回收。

如果使用 Map ，对于键为对象的情况，可以采用 WeakMap，WeakMap 对象同样用来保存键值对，对于键是弱引用（注：WeakMap 只对于键是弱引用），且必须为一个对象，而值可以是任意的对象或者原始值，由于是对于对象的弱引用，不会干扰 Js 的垃圾回收。

如果需要使用 Set 引用对象，可以采用 WeakSet，WeakSet 对象允许存储对象弱引用的唯一值，WeakSet 对象中的值同样不会重复，且只能保存对象的弱引用，同样由于是对于对象的弱引用，不会干扰 Js 的垃圾回收。

这里可能需要简单介绍下，谈弱引用，我们先来说强引用，之前我们说 JS 的垃圾回收机制是如果我们持有对一个对象的引用，那么这个对象就不会被垃圾回收，这里的引用，指的就是 强引用 ，而弱引用就是一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，因此可能在任何时刻被回收。

```javascript
// obj是一个强引用，对象存于内存，可用
let obj = {id: 1}

// 重写obj引用
obj = null 
// 对象从内存移除，回收 {id: 1} 对象
```

这是一个简单的通过重写引用来清除对象引用，使其可回收。

再看下面这个：

```javascript
let obj = {id: 1}
let user = {info: obj}
let set = new Set([obj])
let map = new Map([[obj, 'xianzao']])

// 重写obj
obj = null 

console.log(user.info) // {id: 1}
console.log(set)
console.log(map)
```

这里重写了 obj 以后，`{id: 1}` 依然会存在于内存中，因为 user 对象以及后面的 set/map 都强引用了它，Set/Map、对象、数组对象等都是强引用，所以我们仍然可以获取到` {id: 1}` ，我们想要清除那就只能重写所有引用将其置空了。

接下来我们看 WeakMap 以及 WeakSet：

```js
let obj = {id: 1}
let weakSet = new WeakSet([obj])
let weakMap = new WeakMap([[obj, 'xianzao']])

// 重写obj引用
obj = null

// {id: 1} 将在下一次 GC 中从内存中删除
```

使用了 WeakMap 以及 WeakSet 即为弱引用，将 obj 引用置为 null 后，对象 {id: 1} 将在下一次 GC 中被清理出内存。

#### 4.2.7 console 

在一些小团队中可能项目上线也不清理这些 console，殊不知这些 console 也是隐患，同时也是容易被忽略的，我们之所以在控制台能看到数据输出，是因为浏览器保存了我们输出对象的信息数据引用，也正是因此未清理的 console 如果输出了对象也会造成内存泄漏。

所以，开发环境下我们可以使用控制台输出来便于我们调试，但是在生产环境下，一定要及时清理掉输出。

### 4.3  内存泄漏排查、定位与修复 

 

首先来看个例子：

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>test</title>
  </head>

  <body>
    <button id="click">click</button>
    <h1 id="content"></h1>

    <script>
      let click = document.querySelector('#click');
      let content = document.querySelector('#content');
      let arr = [];

      function closures() {
        let test = new Array(10000).fill('xianzao');

        return function () {
          return test;
        };
      }

      click.addEventListener('click', function () {
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());
        arr.push(closures());

        content.innerHTML = arr.length;
      });
    </script>
  </body>
</html>
```

这是一个由不正当使用闭包构成的内存泄漏例子。

有一个 closures 函数，这是一个闭包函数，我们为页面中的 button 元素绑定了一个点击事件，每次点击都将执行 10 次闭包函数并将其执行结果 push 到全局数组 arr 中，由于闭包函数执行结果也是一个函数并且存在对原闭包函数内部数组 test 的引用，所以 arr 数组中每一项元素都使得其引用的闭包内部 test 数组对象无法回收，arr 数组有多少元素，也就代表着我们存在多少次闭包引用，所以此程序点击次数越多，push 的越多，内存消耗越大，页面也会越来越卡。

#### 4.3.1排查问题

 

一般我们会使用Chrome的 devTool来排查问题，通过它可以帮助我们分析程序中像性能、安全、网络等各种东西，也可以让我们快速定位到问题源。

找到 Performance 这一面板，它可以记录并分析在网站的生命周期内所发生的各类事件，我们就可以通过它监控我们程序中的各种性能情况并分析，其中就包括内存，如下图：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092426387-fd13498f-8da2-4571-938c-2212da73322f.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

先清理一下GC，点击开始录制进入录制状态，接着疯狂点击页面中 click 按钮 20 次，这时页面上的数值应该是 200，我们再点击一下小垃圾桶，手动触发一次 GC。

再次疯狂点击页面中 click 按钮 20 次，这时页面上的数值应该是 400，然后停止录制。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092427189-ee30fdbb-8922-4b70-8b1b-e3141f05e2b4.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

这时候我们可以发现：尽管我们在点击10次后执行GC，但heap并没有清空，这就是内存泄漏。

#### 4.3.2 分析定位

Chrome Devtool 还为我们提供了 Memory 面板，它可以为我们提供更多详细信息，比如记录 JS CPU 执行时间细节、显示 JS 对象和相关的DOM节点的内存消耗、记录内存的分配细节等。

其中的 Heap Profiling 可以记录当前的堆内存 heap 的快照，并生成对象的描述文件，该描述文件给出了当下 JS 运行所用的所有对象，以及这些对象所占用的内存大小、引用的层级关系等等，用它就可以定位出引起问题的具体原因以及位置。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092428730-e717c302-254c-44d6-9024-af74d36d2124.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

重新刷新下页面，清除GC，生成第一次快照：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092429079-dade0e22-6bda-48c1-bc40-4f128f5267b7.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

左侧列表中的 Snapshot 1 代表了我们生成的快照1，也就是刚刚那一刻的内存状态。

选中 Snapshot 1 后就是右侧视图表格了，表格左上方有一个下拉框，它有四个值：

1. Summary：按照构造函数进行分组，捕获对象和其使用内存的情况，可理解为一个内存摘要，用于跟踪定位DOM节点的内存泄漏；

2. Comparison：对比某个操作前后的内存快照区别，分析操作前后内存释放情况等，便于确认内存是否存在泄漏及造成原因；

3. Containment：探测堆的具体内容，提供一个视图来查看对象结构，有助分析对象引用情况，可分析闭包及更深层次的对象分析；

4. Statistics：统计视图；

该下拉默认会为我们选择 Summary ，所以下方表格展示的就是快照1中数据的内存摘要，简单理解就是快照1生成的那一刻，内存中都存了什么，包括占用内存的信息等等。

接下来来简单了解下 Summary 选项数据表格的列都表示什么

1. Constructor：显示所有的构造函数，点击每一个构造函数可以查看由该构造函数创建的所有对象；

2. Distance：显示通过最短的节点路径到根节点的距离，引用层级；

3. Shallow Size：显示对象所占内存，不包含内部引用的其他对象所占的内存；

4. Retained Size：显示对象所占的总内存，包含内部引用的其他对象所占的内存；

然后同上述操作一样，清除GC，点击一次click，再生成快照，总共生成四次快照。

接下来可以比较第三次和第四次快照中的数据对比：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092429499-bde63d56-38d2-432c-be35-a5b34d58b8e0.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

这样可以过滤很多没有变化的数据，方便对比。

其中，Constructor列是构造函数，每一个构造函数点击都可以查看由该构造函数创建的所有对象，还是要先介绍下此列中常见的构造函数大致代表什么：

1. system、system/Context 表示引擎自己创建的以及上下文创建的一些引用，这些不用太关注，不重要；

2. closure 表示一些函数闭包中的对象引用；

3. array、string、number、regexp 这一系列也能看出，就是引用了数组、字符串、数字或正则表达式的对象类型；

4. HTMLDivElement、HTMLAnchorElement、DocumentFragment等等这些其实就是你的代码中对元素的引用或者指定的 DOM 对象引用；

##### 4.3.2.1 closure

 

首先看闭包，可以发现有10次闭包，指向第20行：

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092429886-64ba3fb1-39e1-4562-a406-10dda257f282.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092429470-ecf45278-6285-4c23-bb21-bec636191efd.png?x-oss-process=image%2Fresize%2Cw_1314%2Climit_0)

说明哪怕清除GC后，还是有闭包数据导致占用内存。

##### 4.3.2.2 array

 

这里array可以发现，是由于每次执行10次arr.push(closures())导致的，数量也是10，且在GC清除后，数据内容都为上次基础之上添加的"xianzao"。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671092432872-13612ff8-d60d-4099-8321-bede17c697ed.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

##### 4.3.2.3 总结

 

至此，可以确认，错误有两点：

1. 20行的闭包引用数组造成的内存泄漏；

2. 全局变量 arr 的元素不断增多造成的内存泄漏；

#### 4.3.3 修复验证

 

在实际项目中，比如全局对象一直增大这个问题，全局对象我们无法避免，但是可以限制一下全局对象的大小，根据场景可以超出就清理一部分。

比如闭包引用的问题，不让它引用，或者执行完置空。

总之，一切都需要根据具体场景选择解决方案，解决之后重复上面排查流程看内存即可。

### 4.4 常见的前端内存问题 

 

1. 内存泄漏：主要注意上述问题；

2. 内存膨胀：即在短时间内内存占用极速上升到达一个峰值，想要避免需要使用技术手段减少对内存的占用；

3. 频繁 GC：GC 执行的特别频繁，一般出现在频繁使用大的临时变量导致新生代空间被装满的速度极快，而每次新生代装满时就会触发 GC，频繁 GC 同样会导致页面卡顿，想要避免的话就不要搞太多的临时变量，因为临时变量不用了就会被回收；

# 前端异步处理规范及应用

https://www.yuque.com/lpldplws/atomml/gtn6hvlf3fh1gl6e?singleDoc# 《前端异步处理规范及应用》 密码：cdik

## 1.课程目标

 

1. 掌握Promise、async/await及generator的定义及用法；

2. 手动实现Promise和async/await；

## 2.课程大纲

1. 简版Promise；

2. Promise/A+规范解读；

3. async/await介绍；

4. generator介绍；

 

## 3.简版Promise

### 3.1 reolve和reject

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

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1670244647596-10c599c5-b64e-46a3-99e0-31e55de924b5.png)

这里说明了Promise的四个特点：

1. 执行了resolve，Promise状态会变成fulfilled；
2. 执行了reject，Promise状态会变成rejected；
3. Promise状态不可逆，第一次成功就永久为fulfilled，第一次失败就永远状态为rejected；
4. Promise中有throw的话，就相当于执行了reject；

#### 3.1.1实现resolve reject

1. Promise的初始化状态是pending
2. 需要对resolve和reject绑定this：确定resolve和reject的this指向永远指向当前的MyPromise实例，防止随着函数执行环境的改变而改变

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

测试如下：

```js
const test1 = new MyPromise((resolve, reject) => {
    resolve('success')
})
console.log(test1) // MyPromise { PromiseState: 'fulfilled', PromiseResult: 'success' }

const test2 = new MyPromise((resolve, reject) => {
    reject('fail')
})
console.log(test2) // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }
```

#### 3.1.2 状态不可变

```js
const test1 = new MyPromise((resolve, reject) => {
    resolve('success')
    reject('fail')
})
console.log(test1) // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }
```

正确的应该是状态为fulfilled，但这里状态又变成了rejected。

Promise有三种状态：

- pending：等待中，是初始状态；
- fulfilled：成功状态；
- rejected：失败状态；

一旦状态从pending变为fulfilled或者rejected，那么此Promise实例的状态就不可以改变了。

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1670244647795-2efa2831-a1d5-4849-af3a-107ea7c701fc.png)

这步只需要:

```js
    resolve(value) {
        // state是不可变的
+        if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
    }

    reject(reason) {
        // state是不可变的
+        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
    }
```

也就是：

```js
class MyPromise {
    // 构造方法
    constructor(executor) {
        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
        // 执行传进来的函数
        executor(this.resolve, this.reject)
    }

    initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
    }

    resolve(value) {
        // state是不可变的
      	if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
    }
}
```

结果如下：

```js
const test1 = new MyPromise((resolve, reject) => {
    // 只以第一次为准
    resolve('success')
    reject('fail')
})
console.log(test1) // MyPromise { PromiseState: 'fulfilled', PromiseResult: 'success' }
```

#### 3.1.3 throw

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1670244647961-dd8a421b-4cb2-45fd-a20c-b7ce03f338b2.png)

Promise中有throw的话，就相当于执行了reject。这就要使用try catch了

```js
+        try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
+        } catch (e) {
            // 捕捉到错误直接执行reject
+            this.reject(e)
+        }
```

完整代码为：

```js
class MyPromise {
    // 构造方法
    constructor(executor) {

        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
      	try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
        } catch (e) {
            // 捕捉到错误直接执行reject
            this.reject(e)
        }
    }

    initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
    }

    resolve(value) {
        // state是不可变的
      	if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
    }
}
```

测试代码:

```js
const test3 = new MyPromise((resolve, reject) => {
    throw('fail')
})
console.log(test3) // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }
```

### 3.2 then

平时业务中then的使用一般如下：

```js
// 马上输出 ”success“
const p1 = new Promise((resolve, reject) => {
    resolve('success')
}).then(res => console.log(res), err => console.log(err))

// 1秒后输出 ”fail“
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('fail')
    }, 1000)
}).then(res => console.log(res), err => console.log(err))

// 链式调用 输出 200
const p3 = new Promise((resolve, reject) => {
    resolve(100)
}).then(res => 2 * res, err => console.log(err))
  .then(res => console.log(res), err => console.log(err))
```

根据上述代码可以确定：

1. then接收两个回调，一个是成功回调，一个是失败回调；
2. 当Promise状态为fulfilled执行成功回调，为rejected执行失败回调；
3. 如resolve或reject在定时器里，则定时器结束后再执行then；
4. then支持链式调用，下一次then执行受上一次then返回值的影响；

#### 3.2.1 实现then源码实现

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

完整代码为：

```js
class MyPromise {
    // 构造方法
    constructor(executor) {

        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
      	try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
        } catch (e) {
            // 捕捉到错误直接执行reject
            this.reject(e)
        }
    }

    initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
    }

    resolve(value) {
        // state是不可变的
      	if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
    }

    then(onFulfilled, onRejected) {
      // 接收两个回调 onFulfilled, onRejected
      
      // 参数校验，确保一定是函数
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
      onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

      if (this.PromiseState === 'fulfilled') {
          // 如果当前为成功状态，执行第一个回调
          onFulfilled(this.PromiseResult)
      } else if (this.PromiseState === 'rejected') {
          // 如果当前为失败状态，执行第二哥回调
          onRejected(this.PromiseResult)
      }

    }
}
```

测试then的结果为：

```js
// 输出 ”success“
const test = new MyPromise((resolve, reject) => {
    resolve('success')
}).then(res => console.log(res), err => console.log(err))
```

#### 3.2.2 定时器

如何保证下述代码能够在1s后执行then的回调？

```js
// 1秒后输出 ”fail“
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('fail')
    }, 1000)
}).then(res => console.log(res), err => console.log(err))
```

我们不能确保1秒后才执行then函数，但是我们可以保证1秒后再执行then里的回调（后续课程的事件循环会讲到）

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1670244647986-826eb3a0-2e61-4f55-9289-f5e335a3a16b.png)

在这1秒时间内，我们可以先把then里的两个回调保存起来，然后等到1秒过后，执行了resolve或者reject，咱们再去判断状态，并且判断要去执行刚刚保存的两个回调中的哪一个回调。

那么问题来了，我们怎么知道当前1秒还没走完甚至还没开始走呢？其实很好判断，只要状态是pending，那就证明定时器还没跑完，因为如果定时器跑完的话，那状态肯定就不是pending，而是fulfilled或者rejected

那是用什么来保存这些回调呢？建议使用数组，因为一个promise实例可能会多次then，用数组就一个一个保存了

```js
    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
+        this.onFulfilledCallbacks = [] // 保存成功回调
+        this.onRejectedCallbacks = [] // 保存失败回调
    }

    resolve(value) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
        // 执行保存的成功回调
+        while (this.onFulfilledCallbacks.length) {
+            this.onFulfilledCallbacks.shift()(this.PromiseResult)
+        }
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
        // 执行保存的失败回调
+        while (this.onRejectedCallbacks.length) {
+            this.onRejectedCallbacks.shift()(this.PromiseResult)
+        }
    }
    
    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

        if (this.PromiseState === 'fulfilled') {
            // 如果当前为成功状态，执行第一个回调
            onFulfilled(this.PromiseResult)
        } else if (this.PromiseState === 'rejected') {
            // 如果当前为失败状态，执行第二哥回调
            onRejected(this.PromiseResult)
+        } else if (this.PromiseState === 'pending') {
+            // 如果状态为待定状态，暂时保存两个回调
+            this.onFulfilledCallbacks.push(onFulfilled.bind(this))
+            this.onRejectedCallbacks.push(onRejected.bind(this))
+        }

    }

```

完整代码为：

```js
class MyPromise {
    // 构造方法
    constructor(executor) {

        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
      	try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
        } catch (e) {
            // 捕捉到错误直接执行reject
            this.reject(e)
        }
    }

    initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
      	this.onFulfilledCallbacks = [] // 保存成功回调
        this.onRejectedCallbacks = [] // 保存失败回调
    }

    resolve(value) {
        // state是不可变的
      	if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
      	// 执行保存的成功回调
      	while (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.shift()(this.PromiseResult)
        }
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
        // 执行保存的失败回调
	      while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(this.PromiseResult)
        }
    }

    then(onFulfilled, onRejected) {
      // 接收两个回调 onFulfilled, onRejected
      
      // 参数校验，确保一定是函数
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
      onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

      if (this.PromiseState === 'fulfilled') {
          // 如果当前为成功状态，执行第一个回调
          onFulfilled(this.PromiseResult)
      } else if (this.PromiseState === 'rejected') {
          // 如果当前为失败状态，执行第二哥回调
          onRejected(this.PromiseResult)
      } else if (this.PromiseState === 'pending') {
    			// 如果状态为待定状态，暂时保存两个回调
          this.onFulfilledCallbacks.push(onFulfilled.bind(this))
          this.onRejectedCallbacks.push(onRejected.bind(this))
      }
    }
}
```

看下是否能够实现定时器的功能：

```js
const test2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success') // 1秒后输出 success
    }, 1000)
}).then(res => console.log(res), err => console.log(err))
```

#### 3.3.3 链式调用

then支持链式调用，下一次then执行受上一次then返回值的影响，给大家举个例子：

```js
// 链式调用 输出 200
const p3 = new Promise((resolve, reject) => {
  resolve(100)
}).then(res => 2 * res, err => console.log(err))
  .then(res => console.log(res), err => console.log(err))

// 链式调用 输出300
const p4 = new Promise((resolve, reject) => {
  resolve(100)
}).then(res => new Promise((resolve, reject) => resolve(3 * res)), err => console.log(err))
  .then(res => console.log(res), err => console.log(err))
```

根据上文，可以得到：

1. then方法本身会返回一个新的Promise对象；

2. 如果返回值是promise对象，返回值为成功，新promise就是成功；

3. 如果返回值是promise对象，返回值为失败，新promise就是失败；

4. 如果返回值非promise对象，新promise对象就是成功，值为此返回值；

then是Promise上的方法，那如何实现then完还能再then呢？

then执行后返回一个Promise对象就行了，就能保证then完还能继续执行then；

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1670244647813-454dcadd-6378-4854-9831-22bb463de24e.png?x-oss-process=image%2Fresize%2Cw_556%2Climit_0)



```js
    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }


        var thenPromise = new MyPromise((resolve, reject) => {

            const resolvePromise = cb => {
                try {
                    const x = cb(this.PromiseResult)
                    if (x === thenPromise && x) {
                        // 不能返回自身哦
                        throw new Error('不能返回自身。。。')
                    }
                    if (x instanceof MyPromise) {
                        // 如果返回值是Promise
                        // 如果返回值是promise对象，返回值为成功，新promise就是成功
                        // 如果返回值是promise对象，返回值为失败，新promise就是失败
                        // 谁知道返回的promise是失败成功？只有then知道
                        x.then(resolve, reject)
                    } else {
                        // 非Promise就直接成功
                        resolve(x)
                    }
                } catch (err) {
                    // 处理报错
                    reject(err)
                    throw new Error(err)
                }
            }

            if (this.PromiseState === 'fulfilled') {
                // 如果当前为成功状态，执行第一个回调
                resolvePromise(onFulfilled)
            } else if (this.PromiseState === 'rejected') {
                // 如果当前为失败状态，执行第二个回调
                resolvePromise(onRejected)
            } else if (this.PromiseState === 'pending') {
                // 如果状态为待定状态，暂时保存两个回调
                // 如果状态为待定状态，暂时保存两个回调
                this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
                this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
            }
        })

        // 返回这个包装的Promise
        return thenPromise

    }
```

完整代码为：

```js
class MyPromise {
    // 构造方法
    constructor(executor) {

        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
      	try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
        } catch (e) {
            // 捕捉到错误直接执行reject
            this.reject(e)
        }
    }

    initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
      	this.onFulfilledCallbacks = [] // 保存成功回调
        this.onRejectedCallbacks = [] // 保存失败回调
    }

    resolve(value) {
        // state是不可变的
      	if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
      	// 执行保存的成功回调
      	while (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.shift()(this.PromiseResult)
        }
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
        // 执行保存的失败回调
	      while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(this.PromiseResult)
        }
    }

    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }


        var thenPromise = new MyPromise((resolve, reject) => {

            const resolvePromise = cb => {
                try {
                    const x = cb(this.PromiseResult)
                    if (x === thenPromise) {
                        // 不能返回自身哦
                        throw new Error('不能返回自身。。。')
                    }
                    if (x instanceof MyPromise) {
                        // 如果返回值是Promise
                        // 如果返回值是promise对象，返回值为成功，新promise就是成功
                        // 如果返回值是promise对象，返回值为失败，新promise就是失败
                        // 谁知道返回的promise是失败成功？只有then知道
                        x.then(resolve, reject)
                    } else {
                        // 非Promise就直接成功
                        resolve(x)
                    }
                } catch (err) {
                    // 处理报错
                    reject(err)
                    throw new Error(err)
                }
            }

            if (this.PromiseState === 'fulfilled') {
                // 如果当前为成功状态，执行第一个回调
                resolvePromise(onFulfilled)
            } else if (this.PromiseState === 'rejected') {
                // 如果当前为失败状态，执行第二个回调
                resolvePromise(onRejected)
            } else if (this.PromiseState === 'pending') {
                // 如果状态为待定状态，暂时保存两个回调
                // 如果状态为待定状态，暂时保存两个回调
                this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
                this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
            }
        })

        // 返回这个包装的Promise
        return thenPromise

    }
}
```

测试一下：

```js
const test3 = new MyPromise((resolve, reject) => {
  resolve(100) // 输出 状态：success 值： 200
}).then(res => 2 * res, err => 3 * err)
  .then(res => console.log('success', res), err => console.log('fail', err))


const test4 = new MyPromise((resolve, reject) => {
  resolve(100) // 输出 状态：fail 值：200
  }).then(res => new MyPromise((resolve, reject) => reject(2 * res)), err => new Promise((resolve, reject) => resolve(3 * err)))
    .then(res => console.log('success', res), err => console.log('fail', err))
```

#### 3.3.4 执行顺序

这里需要了解，then方法是微任务（后续课程会讲）

```js
const p = new Promise((resolve, reject) => {
    resolve(1)
}).then(res => console.log(res), err => console.log(err))

console.log(2)

输出顺序是 2 1
```

这里为了实现类似的功能，使用setTimeout代替（setTimeout为宏任务，此处主要跟在全局上的console对比）

```js
const resolvePromise = cb => {
  setTimeout(() => {
    try {
      const x = cb(this.PromiseResult)
      if (x === thenPromise) {
        // 不能返回自身哦
        throw new Error('不能返回自身。。。')
      }
      if (x instanceof MyPromise) {
        // 如果返回值是Promise
        // 如果返回值是promise对象，返回值为成功，新promise就是成功
        // 如果返回值是promise对象，返回值为失败，新promise就是失败
        // 谁知道返回的promise是失败成功？只有then知道
        x.then(resolve, reject)
      } else {
        // 非Promise就直接成功
        resolve(x)
      }
    } catch (err) {
      // 处理报错
      reject(err)
      throw new Error(err)
    }
  })
}
```

至此，完整的代码为：

```js
class MyPromise {
    // 构造方法
    constructor(executor) {

        // 初始化值
        this.initValue()
        // 初始化this指向
        this.initBind()
      	try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
        } catch (e) {
            // 捕捉到错误直接执行reject
            this.reject(e)
        }
    }

    initBind() {
        // 初始化this
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
      	this.onFulfilledCallbacks = [] // 保存成功回调
        this.onRejectedCallbacks = [] // 保存失败回调
    }

    resolve(value) {
        // state是不可变的
      	if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
      	// 执行保存的成功回调
      	while (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.shift()(this.PromiseResult)
        }
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
        // 执行保存的失败回调
	      while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(this.PromiseResult)
        }
    }

    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }


        var thenPromise = new MyPromise((resolve, reject) => {

            const resolvePromise = cb => {
              setTimeout(() => {
                try {
                  const x = cb(this.PromiseResult)
                  if (x === thenPromise) {
                    // 不能返回自身哦
                    throw new Error('不能返回自身。。。')
                  }
                  if (x instanceof MyPromise) {
                    // 如果返回值是Promise
                    // 如果返回值是promise对象，返回值为成功，新promise就是成功
                    // 如果返回值是promise对象，返回值为失败，新promise就是失败
                    // 谁知道返回的promise是失败成功？只有then知道
                    x.then(resolve, reject)
                  } else {
                    // 非Promise就直接成功
                    resolve(x)
                  }
                } catch (err) {
                  // 处理报错
                  reject(err)
                  throw new Error(err)
                }
              })
            }

            if (this.PromiseState === 'fulfilled') {
                // 如果当前为成功状态，执行第一个回调
                resolvePromise(onFulfilled)
            } else if (this.PromiseState === 'rejected') {
                // 如果当前为失败状态，执行第二个回调
                resolvePromise(onRejected)
            } else if (this.PromiseState === 'pending') {
                // 如果状态为待定状态，暂时保存两个回调
                // 如果状态为待定状态，暂时保存两个回调
                this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
                this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
            }
        })

        // 返回这个包装的Promise
        return thenPromise

    }
}
```

测试一下：

```js
const test4 = new MyPromise((resolve, reject) => {
    resolve(1)
}).then(res => console.log(res), err => console.log(err))

console.log(2)
```

### 3.3 其他方法

#### 3.3.1 all

1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
2. 如果所有Promise都成功，则返回成功结果数组；
3. 如果有一个Promise失败，则返回这个失败结果；

```js
static all(promises) {
    const result = []
    let count = 0
    return new MyPromise((resolve, reject) => {
        const addData = (index, value) => {
            result[index] = value
            count++
            if (count === promises.length) resolve(result)
        }
        promises.forEach((promise, index) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    addData(index, res)
                }, err => reject(err))
            } else {
                addData(index, promise)
            }
        })
    })
}
```

#### 3.3.2 race

1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
2. 哪个Promise最快得到结果，就返回那个结果，无论成功失败；

```js
static race(promises) {
    return new MyPromise((resolve, reject) => {
        promises.forEach(promise => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            } else {
                resolve(promise)
            }
        })
    })
}
```

#### 3.3.3 allSettled

1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
2. 把每一个Promise的结果，集合成数组后返回；

```js
static allSettled(promises) {
    return new Promise((resolve, reject) => {
        const res = []
        let count = 0
        const addData = (status, value, i) => {
            res[i] = {
                status,
                value
            }
            count++
            if (count === promises.length) {
                resolve(res)
            }
        }
        promises.forEach((promise, i) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    addData('fulfilled', res, i)
                }, err => {
                    addData('rejected', err, i)
                })
            } else {
                addData('fulfilled', promise, i)
            }
        })
    })
}
```

#### 3.3.4 any

与all相反

1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
2. 如果有一个Promise成功，则返回这个成功结果；
3. 如果所有Promise都失败，则报错；

```js
static any(promises) {
    return new Promise((resolve, reject) => {
        let count = 0
        promises.forEach((promise) => {
            promise.then(val => {
                resolve(val)
            }, err => {
                count++
                if (count === promises.length) {
                    reject(new AggregateError('All promises were rejected'))
                }
            })
        })
    })
}
}
```

### 3.4 scheduler

实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有N个。完善下面代码中的 Scheduler 类，使得以下程序能正确输出：

```js
class Scheduler {
  add(promiseCreator) { ... }
  // ...
}

const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler(n)
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// 打印顺序是：2 3 1 4
```

流程分析：

整个的完整执行流程：

1. 起始1、2两个任务开始执行；
2. 500ms时，2任务执行完毕，输出2，任务3开始执行；
3. 800ms时，3任务执行完毕，输出3，任务4开始执行；
4. 1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行；
5. 1200ms时，4任务执行完毕，输出4；

当资源不足时将任务加入等待队列，当资源足够时，将等待队列中的任务取出执行

在调度器中一般会有一个等待队列queue，存放当资源不够时等待执行的任务
具有并发数据限制，假设通过max设置允许同时运行的任务，还需要count表示当前正在执行的任务数量
当需要执行一个任务A时，先判断count==max 如果相等说明任务A不能执行，应该被阻塞，阻塞的任务放进queue中，等待任务调度器管理
如果count<max说明正在执行的任务数没有达到最大容量，那么count++执行任务A,执行完毕后count--
此时如果queue中有值，说明之前有任务因为并发数量限制而被阻塞，现在count<max，任务调度器会将对头的任务弹出执行

```js
class Scheduler {
  constructor(max) {
    this.max = max;
    this.count = 0; // 用来记录当前正在执行的异步函数
    this.queue = new Array(); // 表示等待队列
  }
  async add(promiseCreator) {
    /*
        此时count已经满了，不能执行本次add需要阻塞在这里，将resolve放入队列中等待唤醒,
        等到count<max时，从队列中取出执行resolve,执行，await执行完毕，本次add继续
        */
    if (this.count >= this.max) {
      await new Promise((resolve, reject) => this.queue.push(resolve));
    }

    this.count++;
    let res = await promiseCreator();
    this.count--;
    if (this.queue.length) {
      // 依次唤醒add
      // 若队列中有值，将其resolve弹出，并执行
      // 以便阻塞的任务，可以正常执行
      this.queue.shift()();
    }
    return res;
  }
}

const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
  //add返回一个promise，参数也是一个promise
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};
  
  addTask(1000, '1');
  addTask(500, '2');
  addTask(300, '3');
  addTask(400, '4');
  
// output: 2 3 1 4
```

## 4. Promise A+规范

上文我们实现了简版的Promise，接下来看下标准的Promise/A+的规范

- [官方地址](https://promisesaplus.com/)；
- [github地址](https://github.com/promises-aplus)；

对照的翻译如下：

一个开放、健全且通用的 JavaScript Promise 标准。由开发者制定，供开发者参考。

一个 promise 表示异步操作的最终结果。与 promise 进行交互的主要方式是通过它的方法 then。该方法通过注册回调来得到这个 promise 的最终 value ，或者为什么这个 promise 不能被 fulfilled 的 reason 。

该规范详细说明了 then 方法的行为，提供了一个可互操作的基础，因此所有符合 `Promises/A+` 的 promise 实现都可以依赖该基础。尽管 `Promises/A+` 组织可能偶尔会通过向后兼容的微小更改来修改此规范，以解决新发现的情况，但我们只有在仔细考虑、讨论和测试后才会进行大的或向后不兼容的更改。因此, 该规范应该被认为是十分稳定的 。·

从历史上看, Promises/A+ 阐明了早期 [Promises/A proposal](https://wiki.commonjs.org/wiki/Promises/A) 的条款，并将部分事实上已经实现的拓展涵盖其中，以及对某些未指定或者有问题的部分省略。

最后，`Promises/A+` 规范的核心不包括：如何 create 、fulfill 或 reject promises。而是选择专注于提供可互操作的 then 方法。不过伴随规范的未来工作可能会涉及这些主题。

这里可以看到，`Promises/A+` 规范目前的核心是规范 then 方法，并没有对如何实现 promise 以及如何改变 promise 的状态进行限制。

### 4.1 术语

1. "prmoise" 是一个拥有符合本规范的 then 方法的对象或者函数；
2. "thenable" 是一个定义了 then 方法的对象或者函数；
3. "value" 是 JavaScript 的任意合法值(包括 undefined, thenable, promise)；
4. "exception" 是一个用 throw 语句抛出的 value ；
5. "reason" 是一个表示 promise 被 rejected 的 value ；

### 4.2 要求

#### 4.2.1. promise 的状态

pormise 必须是以下三个状态之一: pending, fulfilled, rejected。

- 当 promise 处于 pending 状态时：

- - 可以转换到 fulfilled 或 rejected 状态；

- 当 promise 处于 fulfilled 状态时：

- - 不能转换到其他状态；
  - 必须有一个 value ，并且不能改变；

- 当 promise 处于 rejected 状态时：

- - 不能转换到其他状态；
  - 必须有 reason ，并且不能改变；

#### 4.2.2. then方法

promise 必须提供一个 then 方法，能由此去访问当前或最终的 value 或者 reason 。pormise 的 then 方法， 接受两个参数

```js
promise.then(onFulfilled, onRejected)
```

- onFulfilled 和 onRejected 都是可选参数：
  ○ 如果 onFulfilled 不是函数，则忽略；
  ○ 如果 onRejected 不是函数，则忽略；

- 如果 onFulfilled 是一个函数:
  ○ 它必须在 promise 被 fulfilled 后，以 promise 的 value 作为第一个参数调用；
  ○ 它不能在 promise 被 fulfilled 之前调用；
  ○ 它不能被调用多次；

- 如果 onRejected 是一个函数：
  ○ 它必须在 promise 被 rejected 后，以 promise 的 reason 作为第一个参数调用；
  ○ 它不能能在 promise 被 rejected 之前调用；
  ○ 它不能被调用多次；
  ○ 在 [execution context](https://es5.github.io/#x10.3) 栈（执行上下文栈）只包含平台代码之前， onFulfilled 或者 onRejected 不能被调用 (译者注: 异步执行回调)；

- onFulfilled 或者 onRejected 必须以函数形式调用（即不能有this值）
- then 方法可以被同一个 promise 调用多次
  ○ 如果或者当 promise 处于 fulfilled 状态， 所有自己的 onFulfilled 回调函数，必须要按照 then 注册的顺序被调用；
  ○ 如果或者当 promise 处于 rejected 状态， 所有自己的 onRejected 回调函数，必须要按照 then 注册的顺序被调用；
- then 方法必须要返回 promise

```js
promise2 = promise1.then(onFulfilled, onRejected);
```

- - 如果 onFulfilled 或者 onRejected 返回一个值 x ，则执行 Promise Resolution Procedure：`[[Resolve]](promise2, x)`；
  - 如果 onFulfilled 或者 onRejected 抛出异常 e ， promise2 必须以 e 作为 reason ，转到 rejected 状态；
  - 如果 onFulfilled 不是函数，并且 promise1 处于 fulfilled 状态 ，则 promise2 必须以与 promise1 同样的 value 被 fulfilled；
  - 如果 onRejected 不是函数，并且 promise1 处于 rejected 状态 ，则 promise2 必须以与 promise1 同样的 reason 被 rejected

#### 4.2.3 Promise Resolution Procedure

Promise Resolution Procedure 是一个抽象操作。它以一个 promise 和一个 value 作为输入，记作：`[[Resolve]](promise, x) `。 如果 x 是一个 thenable , 它会尝试让 promise 变成与 x 的一样状态 ，前提 x 是一个类似的 promise 对象。否则，它会让 promise 以 x 作为 value 转为 fulfilled 状态。

这种对 thenables 的处理允许不同的 promise 进行互操作，只要它们暴露一个符合 Promises/A+ 的 then 方法。它还允许 Promises/A+ 实现使用合理的 then 方法“同化”不一致的实现。

`[[Resolve]](promise, x)` 执行以下步骤：

- 如果 promise 和 x 引用的是同一个对象，则以一个 TypeError 作为 reason 让 promise 转为 rejeted 状态；
- 如果 x 也是一个 promise ，则让 promise 接受它的状态：

- - 如果 x 处于 pending 状态，promise 必须保持 pending 状态，直到 x 变成 fulfilled 或者 rejected 状态，promise 才同步改变；
  - 如果或者当 x 处于 fulfilled 状态， 以同样的 value 让 promise 也变成 fulfilled 状态；
  - 如果或者当 x 处于 rejected 状态， 以同样的 reason 让 promise 也变成 rejected 状态；

- 如果 x 是一个对象或者函数：

- - 令 then 等于 x.then；
  - 如果读取 x.then 抛出异常 e ， 以 e 作为 reason 让 promise 变成 rejected 状态；
  - 如果 then 是一个函数，以 x 作为 this 调用它，传入第一个参数 resolvePromise ， 第二个参数 rejectPromise ：

- - - 如果 resolvePromise 被传入 y 调用， 则执行 `[[Resolve]](promise, y)`；
    - 如果 rejectedPromise 被传入 r 调用，则用，r 作为 reason 让 promise 变成 rejected 状态；
    - 如果 resolvePromise 和 rejectPromise 都被调用了，或者被调用多次了。只有第一次调用生效，其余会被忽略；
    - 如果调用 then 抛出异常 e：

- - - - 如果 resolvepromise 或 rejectPromise 已经被调用过了，则忽略它；
      - 否则, 以 e 作为 reason 让 promise 变成 rejected 状态；

- - - 如果 then 不是一个函数，以 x 作为 value 让 promise 变成 fulfilled 状态；

- 如果 x 不是对象或函数， 以 x 作为 value 让 promise 变成 fulfilled 状态；

如果一个 promise 被一个循环的 thenable 链中的对象 resolved，而 `[[Resolve]](promise, thenable) `的递归性质又使得其被再次调用，根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励实现者检测这样的递归是否存在，并且以 TypeError 作为 reason 拒绝 promise；

## 5. async/await

[caniuse支撑程度](https://caniuse.com/?search=async await)

### 5.1. 介绍

async/await的用处：用同步方式，执行异步操作

```js
function request(num) { // 模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * 2)
    }, 1000)
  })
}

request(1).then(res1 => {
  console.log(res1) // 1秒后 输出 2

  request(2).then(res2 => {
    console.log(res2) // 2秒后 输出 4
  })
})
```

现在有一个新的要求：先请求完接口1，再拿接口1返回的数据，去当做接口2的请求参数，那我们也可以这么做：

```js
request(5).then(res1 => {
  console.log(res1) // 1秒后 输出 10

  request(res1).then(res2 => {
    console.log(res2) // 2秒后 输出 20
  })
})
```

如果嵌套的多了，这个时候就可以用async/await来解决了：

```js
async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()
```

使用async/await代替上述的内容：

```js
async function fn () {
  await request(1)
  await request(2)
  // 2秒后执行完
}
fn()
```

```js
async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()
```

在async函数中，await规定了异步操作只能一个一个排队执行，从而达到用同步方式，执行异步操作的效果。

注意：await只能在async函数中使用

刚刚上面的例子await后面都是跟着异步操作Promise，那如果不接Promise？

```js
function request(num) { // 去掉Promise
  setTimeout(() => {
    console.log(num * 2)
  }, 1000)
}

async function fn() {
  await request(1) // 2
  await request(2) // 4
  // 1秒后执行完  同时输出
}
fn()
```

可以看出，如果await后面接的不是Promise的话，其实是达不到类似同步的效果的

Q：什么是async？async是一个位于function之前的前缀，只有async函数中，才能使用await。那async执行完是返回是什么？

```js
async function fn () {}
console.log(fn) // [AsyncFunction: fn]
console.log(fn()) // Promise {<fulfilled>: undefined}
```

可以看出，async函数执行完会自动返回一个状态为fulfilled的Promise，也就是成功状态，但是值却是undefined，那要怎么才能使值不是undefined呢？只要函数有return返回值就行了。

```js
async function fn (num) {
  return num
}
console.log(fn) // [AsyncFunction: fn]
console.log(fn(10)) // Promise {<fulfilled>: 10}
fn(10).then(res => console.log(res)) // 10
```

#### 5.1.1 总结

1. await只能在async函数中使用，不然会报错；
2. async函数返回的是一个Promise对象，有无值看有无return值；
3. await后面最好是接Promise，虽然接其他值也能达到排队效；
4. async/await作用是用同步方式，执行异步操作

#### 5.1.2 语法糖

Q：async/await是一种语法糖，那么什么是语法糖呢？

A：语法糖是简化代码的一种方式，用其他方式也能达到同样的效果，但写法可能没有这么便利。

ES6的class也是语法糖，因为其实用普通function也能实现同样效果

回归正题，async/await是一种语法糖，用到的是ES6里的迭代函数——generator函数

## 6. generator

 

### 6.1 介绍

generator函数跟普通函数在写法上的区别就是，多了一个星号*，并且只有在generator函数中才能使用yield，而yield相当于generator函数执行的中途暂停点，比如下方有3个暂停点。而怎么才能暂停后继续走呢？那就得使用到next方法，next方法执行后会返回一个对象，对象中有value 和 done两个属性

- value：暂停点后面接的值，也就是yield后面接的值；

- done：是否generator函数已走完，没走完为false，走完为true；

```js
function* gen() {
  yield 1
  yield 2
  yield 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: undefined, done: true }
```

可以看到最后一个是undefined，这取决于你generator函数有无返回值

```js
function* gen() {
  yield 1
  yield 2
  yield 3
  return 4
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: 4, done: true }
```

#### 6.1.1. yield后接函数

yield后面接函数的话，到了对应暂停点yield，会马上执行此函数，并且该函数的执行返回值，会被当做此暂停点对象的value

```js
function fn(num) {
  console.log(num)
  return num
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) 
// 1
// { value: 1, done: false }
console.log(g.next())
// 2
//  { value: 2, done: false }
console.log(g.next()) 
// { value: 3, done: true }
```

#### 6.1.2 yield后接promise

```js
function fn(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num)
    }, 1000)
  })
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: 3, done: true }
```

如果想获取的是两个Promise的结果1 和 2，可以使用Promise的then

```js
const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后输出 { value: Promise { 1 }, done: false }
  console.log(res1) // 1秒后输出 1

  const next2 = g.next()
  next2.value.then(res2 => {
    console.log(next2) // 2秒后输出 { value: Promise { 2 }, done: false }
    console.log(res2) // 2秒后输出 2
    console.log(g.next()) // 2秒后输出 { value: 3, done: true }
  })
})
```

#### 6.1.3 next函数传参

generator函数可以用next方法来传参，并且可以通过yield来接收这个参数，注意两点

1. 第一次next传参是没用的，只有从第二次开始next传参才有用；
2. next传值时，要记住顺序是，先右边yield，后左边接收参数；

```js
function* gen() {
  const num1 = yield 1
  console.log(num1)
  const num2 = yield 2
  console.log(num2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next(11111))
// 11111
//  { value: 2, done: false }
console.log(g.next(22222)) 
// 22222
// { value: 3, done: true }
```

#### 6.1.4 Promise&next传参

根据上文可以知道：

1. yield后面接Promise；
2. next函数传参；

所以一起使用时的效果为：

```js
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}
const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后同时输出 { value: Promise { 2 }, done: false }
  console.log(res1) // 1秒后同时输出 2

  const next2 = g.next(res1) // 传入上次的res1
  next2.value.then(res2 => {
    console.log(next2) // 2秒后同时输出 { value: Promise { 4 }, done: false }
    console.log(res2) // 2秒后同时输出 4

    const next3 = g.next(res2) // 传入上次的res2
    next3.value.then(res3 => {
      console.log(next3) // 3秒后同时输出 { value: Promise { 8 }, done: false }
      console.log(res3) // 3秒后同时输出 8

       // 传入上次的res3
      console.log(g.next(res3)) // 3秒后同时输出 { value: 8, done: true }
    })
  })
})
```

### 6.2 实现async/await

上方的generator函数的Promise&next传参，就很像async/await了，区别在于

1. gen函数执行返回值不是Promise，asyncFn执行返回值是Promise；
2. gen函数需要执行相应的操作，才能等同于asyncFn的排队效果；
3. gen函数执行的操作是不完善的，因为并不确定有几个yield，不确定会嵌套几次；

针对这种情况，可以通过高阶函数（HOC）封装：

高阶函数：参数是函数，返回值也可以是函数。

```js
function highorderFn(函数) {
    // 一系列处理
    return 函数
}
```

根据上述代码，可以封装一个高阶函数，接收一个generator函数，并经过处理，返回一个具有async函数功能的函数：

```js
function generatorToAsync(generatorFn) {
  // 经过一系列处理
  
  return 具有async函数功能的函数
}
```

#### 6.2.1 返回值promise

```js
function* gen() {

}

const asyncFn = generatorToAsync(gen)

console.log(asyncFn()) // 期望这里输出 Promise
```

这里需要针对`generatorToAsync`进行处理：

```js
function* gen() {

}
function generatorToAsync (generatorFn) {
  return function () {
    return new Promise((resolve, reject) => {

    })
  }
}

const asyncFn = generatorToAsync(gen)

console.log(asyncFn()) // Promise
```

#### 6.2.2. 结合上述代码

把之前的处理代码，加入generatorToAsync函数中

```js
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}
function generatorToAsync(generatorFn) {
  return function () {
    return new Promise((resolve, reject) => {
      const g = generatorFn()
      const next1 = g.next()
      next1.value.then(res1 => {

        const next2 = g.next(res1) // 传入上次的res1
        next2.value.then(res2 => {

          const next3 = g.next(res2) // 传入上次的res2
          next3.value.then(res3 => {

            // 传入上次的res3
            resolve(g.next(res3).value)
          })
        })
      })
    })
  }
}

const asyncFn = generatorToAsync(gen)

asyncFn().then(res => console.log(res)) // 3秒后输出 8
```

到这里，就已经实现了async/await的初始功能了

```js
async function asyncFn() {
  const num1 = await fn(1)
  const num2 = await fn(num1)
  const num3 = await fn(num2)
  return num3
}
asyncFn().then(res => console.log(res)) // 3秒后输出 8
```

#### 6.2.3. 结合多个await方法

因为async中可以支持若干个await，await的个数是不确定的。同样类比，generator函数中，也可能有2个yield，3个yield，5个yield，所以需要对上述代码进行改造

```js
function generatorToAsync(generatorFn) {
  return function() {
    const gen = generatorFn.apply(this, arguments) // gen有可能传参

    // 返回一个Promise
    return new Promise((resolve, reject) => {

      function go(key, arg) {
        let res
        try {
          res = gen[key](arg) // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error) // 报错的话会走catch，直接reject
        }

        // 解构获得value和done
        const { value, done } = res
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value)
        } else {
          // 如果done为false，说明没走完，还得继续走

          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }

      go("next") // 第一次执行
    })
  }
}

const asyncFn = generatorToAsync(gen)

asyncFn().then(res => console.log(res))
```

#### 6.2.4 测试结果

- async/await

```js
async function asyncFn() {
  const num1 = await fn(1)
  console.log(num1) // 2
  const num2 = await fn(num1)
  console.log(num2) // 4
  const num3 = await fn(num2)
  console.log(num3) // 8
  return num3
}
const asyncRes = asyncFn()
console.log(asyncRes) // Promise
asyncRes.then(res => console.log(res)) // 8
```

- generatorToAsync

```js
function* gen() {
  const num1 = yield fn(1)
  console.log(num1) // 2
  const num2 = yield fn(num1)
  console.log(num2) // 4
  const num3 = yield fn(num2)
  console.log(num3) // 8
  return num3
}

const genToAsync = generatorToAsync(gen)
const asyncRes = genToAsync()
console.log(asyncRes) // Promise
asyncRes.then(res => console.log(res)) // 8
```

# 前端模块化

https://www.yuque.com/lpldplws/web/xhqomd?singleDoc# 《前端模块化》 密码：xnou

## 1. 课程目标

1. 学习前端模块化发展历程；
2. 掌握现代前端开发模块化的实现及实战；

## 2. 课程大纲

- 模块化理解；
- 模块化规范及总结；

## 3. 模块化的理解

在JavaScript发展初期就是为了实现简单的页面交互逻辑，而如今CPU、浏览器性能得到了极大的提升，很多页面逻辑迁移到了客户端（表单验证等），随着web2.0时代的到来，Ajax技术得到广泛应用，jQuery等前端库层出不穷，前端代码日益膨胀，此时在JS方面就会考虑使用模块化规范去管理。模块化已经发展了有十余年了，不同的工具和轮子层出不穷，但总结起来，它们解决的问题主要有三个：

1. 外部模块的管理；
2. 内部模块的组织；
3. 模块源码到目标代码的编译和转换；

以下为各个工具或者框架的诞生时间，先了解下时间节奏，方便对内容有所了解：

```js
 生态             诞生时间
 Node.js          2009年   
 NPM              2010年   
 requireJS(AMD)   2010年
 seaJS(CMD)       2011年
 broswerify       2011年
 webpack          2012年
 grunt            2012年 
 gulp             2013年
 react            2013年 
 vue              2014年
 angular          2016年
 redux            2015年 
 vite             2020年
 snowpack         2020年  
```

### 3.1 什么是模块？

- 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件)，并进行组合在一起；
- 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信；

### 3.2 模块化的进化过程

#### 3.2.1. 全局function模式

将不同的功能封装成不同的全局函数

- 编码：将不同的功能封装成不同的全局函数
- 问题：污染全局命名空间, 容易引起命名冲突或数据不安全，而且模块成员之间看不出直接关系

```js
function m1(){
  //...
}
function m2(){
  //...
}
```

#### 3.2.2 namespace模式

简单对象封装

- 作用：减少了全局变量，解决命名冲突
- 问题：数据不安全(外部可以直接修改模块内部的数据)

```js
let myModule = {
  data: 'www.baidu.com',
  foo() {
    console.log(`foo() ${this.data}`)
  },
  bar() {
    console.log(`bar() ${this.data}`)
  }
}
myModule.data = 'other data' //能直接修改模块内部的数据
myModule.foo() // foo() other data
```

这样的写法会暴露所有模块成员，内部状态可以被外部改写。

#### 3.3.3. IIFE模式

匿名函数自调用(闭包)

- 作用：数据是私有的, 外部只能通过暴露的方法操作
- 编码：将数据和行为封装到一个函数内部, 通过给window添加属性来向外暴露接口
- 问题：如果当前这个模块依赖另一个模块怎么办?

```js
// index.html文件
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
    myModule.foo()
    myModule.bar()
    console.log(myModule.data) //undefined 不能访问模块内部数据
    myModule.data = 'xxxx' //不是修改的模块内部的data
    myModule.foo() //没有改变
</script>

// module.js文件
(function(window) {
  let data = 'www.xianzao.com'
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar } //ES6写法
})(window)
```

最后得到的结果：

```js
foo() www.xianzao.com
bar() www.xianzao.com
otehrFun()
undefined
foo() www.xianzao.com
```

#### 3.3.4 IIFE模式增强

这就是现代模块实现的基石

```js
// module.js文件
(function(window, $) {
  let data = 'www.baidu.com'
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
    $('body').css('background', 'red')
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar }
})(window, jQuery)

 // index.html文件
<!-- 引入的js必须有一定顺序 -->
<script type="text/javascript" src="jquery-1.10.1.js"></script>
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
  myModule.foo()
</script>
```

上例子通过jquery方法将页面的背景颜色改成红色，所以必须先引入jQuery库，就把这个库当作参数传入。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。

### 3.3 模块化的好处

- 避免命名冲突(减少命名空间污染)；
- 更好的分离, 按需加载；
- 更高复用性；
- 高可维护性；

### 3.4. 引入多个<script>后出现出现问题

- 请求过多

首先我们要依赖多个模块，那样就会发送多个请求，导致请求过多；

- 依赖模糊

我们不知道他们的具体依赖关系是什么，也就是说很容易因为不了解他们之间的依赖关系导致加载先后顺序出错；

- 难以维护

以上两种原因就导致了很难维护，很可能出现牵一发而动全身的情况导致项目出现严重的问题。
模块化固然有多个好处，然而一个页面需要引入多个js文件，就会出现以上这些问题。而这些问题可以通过模块化规范来解决，因此才有了后续的commonjs, AMD, ES6, CMD规范。

## 4. 模块化规范

### 4.1. CommonJS

#### 4.1.1. 概念

Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

#### 4.1.2. 特点

- 所有代码都运行在模块作用域，不会污染全局作用域；
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存；
- 模块加载的顺序，按照其在代码中出现的顺序；

#### 4.1.3. 基本语法

- 暴露模块：`module.exports = value`或`exports.xxx = value`
- 引入模块：`require(xxx)`,如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

此处我们有个疑问：CommonJS暴露的模块到底是什么? CommonJS规范规定，每个模块内部，module变量代表当前模块。这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。

```javascript
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

上面代码通过module.exports输出变量x和函数addX。

```javascript
var example = require('./example.js');//如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
console.log(example.x); // 5
console.log(example.addX(1)); // 6
```

require命令用于加载模块文件。require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象。如果没有发现指定模块，会报错。

#### 4.1.4. 模块的加载机制

CommonJS模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。这点与ES6模块化有重大差异（下文会介绍），请看下面这个例子：

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量counter和改写这个变量的内部方法incCounter。

```js
// main.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，counter输出以后，lib.js模块内部的变化就影响不到counter了。这是因为counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。

#### 4.1.5 服务器端实现

1. 安装node
2. npm init

```js
|-modules
  |-module1.js
  |-module2.js
  |-module3.js
|-app.js
|-package.json
  {
    "name": "commonJS-node",
    "version": "1.0.0"
  }

```

3. 下载第三方模块

```js
npm install uniq --save // 用于数组去重
```

4. 定义模块代码

```js
//module1.js
module.exports = {
  msg: 'module1',
  foo() {
    console.log(this.msg)
  }
}

//module2.js
module.exports = function() {
  console.log('module2')
}

//module3.js
exports.foo = function() {
  console.log('foo() module3')
}
exports.arr = [1, 2, 3, 3, 2]

// app.js文件
// 引入第三方库，应该放置在最前面
let uniq = require('uniq')
let module1 = require('./modules/module1')
let module2 = require('./modules/module2')
let module3 = require('./modules/module3')

module1.foo() //module1
module2() //module2
module3.foo() //foo() module3
console.log(uniq(module3.arr)) //[ 1, 2, 3 ]
```

5. node app.js

#### 4.1.6. 浏览器端实现

使用Browserify：Browserify 会对代码进行解析，整理出代码中的所有模块依赖关系，然后把相关的模块代码都打包在一起，形成一个完整的JS文件，这个文件中不会存在 require 这类的模块化语法，变成可以在浏览器中运行的普通JS

1. 创建项目结构

```js
|-js
  |-dist //打包生成文件的目录
  |-src //源码所在的目录
    |-module1.js
    |-module2.js
    |-module3.js
    |-app.js //应用主源文件
|-index.html //运行于浏览器上
|-package.json
  {
    "name": "browserify-test",
    "version": "1.0.0"
  }
```

2. 下载browserify

- 全局: `npm install browserify -g`
- 局部: `npm install browserify --save-dev`

3. 定义模块代码

注意：index.html文件要运行在浏览器上，需要借助browserify将app.js文件打包编译，如果直接在index.html引入app.js就会报错！

4. 打包处理js

根目录下运行

```js
browserify js/src/app.js -o js/dist/bundle.js
```

5. 页面使用引入

在index.html文件中引入

```js
<script type="text/javascript" src="js/dist/bundle.js"></script>
```

### 4.2  AMD（Asynchronous Module Definition）

#### 4.2.1 概念

CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。此外AMD规范比CommonJS规范在浏览器端实现要来着早。

#### 4.2.2 基本语法

定义暴露模块

```js
//定义没有依赖的模块
define(function(){
   return 模块
})

//定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
   return 模块
})
```

引用使用模块：

```js
require(['module1', 'module2'], function(m1, m2){
   使用m1/m2
})
```

#### 4.2.3 AMD实现

通过比较是否实用AMD，来说明使用AMD实际使用的效果。

##### 4.2.3.1. 未使用AMD规范

```js
// dataService.js文件
(function (window) {
  let msg = 'www.xianzao.com'
  function getMsg() {
    return msg.toUpperCase()
  }
  window.dataService = {getMsg}
})(window)

// alerter.js文件
(function (window, dataService) {
  let name = 'xianzao'
  function showMsg() {
    alert(dataService.getMsg() + ', ' + name)
  }
  window.alerter = {showMsg}
})(window, dataService)

// main.js文件
(function (alerter) {
  alerter.showMsg()
})(alerter)

// index.html文件
<div><h1>Modular Demo 1: 未使用AMD(require.js)</h1></div>
<script type="text/javascript" src="js/modules/dataService.js"></script>
<script type="text/javascript" src="js/modules/alerter.js"></script>
<script type="text/javascript" src="js/main.js"></script>
```

最后得到的如下结果：

```js
'WWW.XIANZAO.COM', 'xianzao'
```

这种方式缺点很明显：首先会发送多个请求，其次引入的js文件顺序不能搞错，否则会报错

##### 4.2.3.2. 使用require.js

RequireJS是一个工具库，主要用于客户端的模块管理。它的模块管理遵守AMD规范，RequireJS的基本思想是，通过define方法，将代码定义为模块；通过require方法，实现代码的模块加载。


接下来介绍AMD规范在浏览器实现的步骤：

1. 下载require.js, 并引入

- 官网: http://www.requirejs.cn/
- github : https://github.com/requirejs/requirejs

然后将require.js导入项目: `js/libs/require.js`

2. 创建项目结构

```js
|-js
  |-libs
    |-require.js
  |-modules
    |-alerter.js
    |-dataService.js
  |-main.js
|-index.html
```

3. 定义require.js的模块化代码

```js
// dataService.js文件
// 定义没有依赖的模块
define(function() {
  let msg = 'www.xianzao.com'
  function getMsg() {
    return msg.toUpperCase()
  }
  return { getMsg } // 暴露模块
})

//alerter.js文件
// 定义有依赖的模块
define(['dataService'], function(dataService) {
  let name = 'xianzao'
  function showMsg() {
    alert(dataService.getMsg() + ', ' + name)
  }
  // 暴露模块
  return { showMsg }
})

// main.js文件
(function() {
  require.config({
    baseUrl: 'js/', //基本路径 出发点在根目录下
    paths: {
      //映射: 模块标识名: 路径
      alerter: './modules/alerter', //此处不能写成alerter.js,会报错
      dataService: './modules/dataService'
    }
  })
  require(['alerter'], function(alerter) {
    alerter.showMsg()
  })
})()

// index.html文件
<!DOCTYPE html>
<html>
  <head>
    <title>Modular Demo</title>
  </head>
  <body>
    <!-- 引入require.js并指定js主文件的入口 -->
    <script data-main="js/main" src="js/libs/require.js"></script>
  </body>
</html>
```

4. 页面引入require.js模块

在index.html引入

```js
<script data-main="js/main" src="js/libs/require.js"></script>
```

5. 引入第三方库

```js
// alerter.js文件
define(['dataService', 'jquery'], function(dataService, $) {
  let name = 'Tom'
  function showMsg() {
    alert(dataService.getMsg() + ', ' + name)
  }
  $('body').css('background', 'green')
  // 暴露模块
  return { showMsg }
})
```

```js
// main.js文件
(function() {
  require.config({
    baseUrl: 'js/', //基本路径 出发点在根目录下
    paths: {
      //自定义模块
      alerter: './modules/alerter', //此处不能写成alerter.js,会报错
      dataService: './modules/dataService',
      // 第三方库模块
      jquery: './libs/jquery-1.10.1' //注意：写成jQuery会报错
    }
  })
  require(['alerter'], function(alerter) {
    alerter.showMsg()
  })
})()
```

上例是在alerter.js文件中引入jQuery第三方库，main.js文件也要有相应的路径配置。

##### 4.2.3.3. 总结

 通过两者的比较，可以得出AMD模块定义的方法非常清晰，不会污染全局环境，能够清楚地显示依赖关系。AMD模式可以用于浏览器环境，并且允许非同步加载模块，也可以根据需要动态加载模块

### 4.3 CMD(Common Module Definition)

#### 4.3.1概念

CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD规范整合了CommonJS和AMD规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD模块定义规范。

#### 4.3.2 基本语法 

```js
//定义没有依赖的模块
define(function(require, exports, module){
  exports.xxx = value
  module.exports = value
})
```

```js
//定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
  //引入依赖模块(异步)
    require.async('./module3', function (m3) {
    })
  //暴露模块
  exports.xxx = value
})
```

```js
// 引入使用的模块
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

#### 4.3.3. CMD实现

1. 下载sea.js, 并引入

- 官网: http://seajs.org/
- github : https://github.com/seajs/seajs

然后将sea.js导入项目：`js/libs/sea.js`

2. 创建项目结构

```js
|-js
  |-libs
    |-sea.js
  |-modules
    |-module1.js
    |-module2.js
    |-module3.js
    |-module4.js
    |-main.js
|-index.html
```

3. 定义sea.js的模块化代码

```js
// module1.js文件
define(function (require, exports, module) {
  //内部变量数据
  var data = 'xianzao.com'
  //内部函数
  function show() {
    console.log('module1 show() ' + data)
  }
  //向外暴露
  exports.show = show
})

// module2.js文件
define(function (require, exports, module) {
  module.exports = {
    msg: 'I am xianzao'
  }
})

// module3.js文件
define(function(require, exports, module) {
  const API_KEY = 'abc123'
  exports.API_KEY = API_KEY
})

// module4.js文件
define(function (require, exports, module) {
  //引入依赖模块(同步)
  var module2 = require('./module2')
  function show() {
    console.log('module4 show() ' + module2.msg)
  }
  exports.show = show
  //引入依赖模块(异步)
  require.async('./module3', function (m3) {
    console.log('异步引入依赖模块3  ' + m3.API_KEY)
  })
})

// main.js文件
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

4. 在index.html中引入

```js
<script type="text/javascript" src="js/libs/sea.js"></script>
<script type="text/javascript">
  seajs.use('./js/modules/main')
</script>
```

最后得到结果如下：

```js
module1 show(), xianzao
module4 show() I am xianzao
异步引入依赖模块3 abc123
```

#### 4.3.4cmd和amd的区别

```js
// CMD
define(function (requie, exports, module) {
    //依赖就近书写
    var module1 = require('Module1');
    var result1 = module1.exec();
    module.exports = {
      result1: result1,
    }
});

// AMD
define(['Module1'], function (module1) {
    var result1 = module1.exec();
    return {
      result1: result1,
    }
});
```

从上面的代码比较中我们可以得出AMD规范和CMD规范的区别

1. 对依赖的处理：

- AMD推崇依赖前置，即通过依赖数组的方式提前声明当前模块的依赖；
- CMD推崇依赖就近，在编程需要用到的时候通过调用require方法动态引入；

2. 在本模块的对外输出：

- AMD推崇通过返回值的方式对外输出；
- CMD推崇通过给module.exports赋值的方式对外输出

### 4.4 ES6模块化

#### 4.4.1 概念

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。`CommonJS` 和 `AMD` 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

#### 4.4.2 基本使用

export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}
```

如上例所示，使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。

```js
// export-default.js
export default function () {
  console.log('foo');
}

// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

模块默认输出, 其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。

ES6 模块与 CommonJS 模块的差异

1. CommonJS,可以动态加载语句，代码发生在运行时, 模块输出的是一个值的拷贝,可以修改导出的值,一旦内部再修改这个值，则不会同步到外部。ES6 模块输出的是值的引用,内部修改可以同步到外部，而且导入的值，不能进行修改，也就是只读
2. Common JS 模块是运行时加载，ES6 模块是静态编译期间就确定模块的依赖，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时编译时输出接口；

第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
下面重点解释第一个差异，我们还是举上面那个CommonJS模块的加载机制例子:

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4

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



#### 4.4.3 ES6实现

简单来说就一句话：使用Babel将ES6编译为ES5代码，使用Browserify编译打包js。

1. 定义package.json文件

```js
 {
   "name" : "es6-babel-browserify",
   "version" : "1.0.0"
 }
```

2. 安装babel-cli, babel-preset-es2015和browserify

```bash
npm install babel-cli browserify -g
npm install babel-preset-es2015 --save-dev
```

3. 定义.babelrc文件

```js
  {
    "presets": ["es2015"]
  }
```

4. 定义模块代码

```js
//module1.js文件
// 分别暴露
export function foo() {
  console.log('foo() module1')
}
export function bar() {
  console.log('bar() module1')
}

//module2.js文件
// 统一暴露
function fun1() {
  console.log('fun1() module2')
}
function fun2() {
  console.log('fun2() module2')
}
export { fun1, fun2 }

//module3.js文件
// 默认暴露 可以暴露任意数据类项，暴露什么数据，接收到就是什么数据
export default () => {
  console.log('默认暴露')
}

// app.js文件
import { foo, bar } from './module1'
import { fun1, fun2 } from './module2'
import module3 from './module3'
foo()
bar()
fun1()
fun2()
module3()
```

5. 编译并在index.html中引入

- 使用Babel将ES6编译为ES5代码(但包含CommonJS语法) :` babel js/src -d js/lib`
- 使用Browserify编译js : `browserify js/lib/app.js -o js/lib/bundle.js`

然后在index.html文件中引入

```js
 <script type="text/javascript" src="js/lib/bundle.js"></script> 
```

最后得到如下结果：

```js
foo() module1
bar() module1
fun1() module2
fun2() module2
默认暴露
```

6. 引入第三方库

首先安装依赖`npm install jquery@1`，然后在app.js文件中引入

```js
//app.js文件
import { foo, bar } from './module1'
import { fun1, fun2 } from './module2'
import module3 from './module3'
import $ from 'jquery'

foo()
bar()
fun1()
fun2()
module3()
$('body').css('background', 'green')
```

### 4.5 UMD(Universal Module Defintion)

是一种javascript通用模块定义规范，让你的模块能在javascript所有运行环境中发挥作用。

意味着要同时满足CommonJS, AMD, CMD的标准，以下为实现：

```js
(function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        console.log('是commonjs模块规范，nodejs环境')
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        console.log('是AMD模块规范，如require.js')
        define(factory)
    } else if (typeof define === 'function' && define.cmd) {
        console.log('是CMD模块规范，如sea.js')
        define(function(require, exports, module) {
            module.exports = factory()
        })
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory();
    }
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```

## 5. 总结

1. CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案；
2. AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅；
3. CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行；
4. ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案；
5. UMD为同时满足CommonJS, AMD, CMD标准的实现

# **阿里前端面试官带你深度模拟前端专家面试**

https://www.yuque.com/lpldplws/atomml/wa93b6?singleDoc# 《阿里前端面试官带你深度模拟前端专家面试》 密码：xord

## 1. 模拟面试环节

### 1.1. 常见的简历内容

- 熟练使用Antd UI库构建项目 ；
- 熟练使用ajax、axios等技术；
- 熟练使用各种前端库，如Bootstrap，jQuery等 ；
- 熟练使用Charles对App页面进行调试；
- 熟悉ES6，掌握Promise、async、await的使用；
- 熟悉Vue的使用，掌握vue-router、vue cli等；
- 熟悉React的使用，掌握Redux、Mobx、React-Router的使用；
- 掌握前端开发工具，如webpack ；
- 了解MVC，MVVM设计模式 ；
- 对原型链、闭包、面向对象有一定认识 ；了解Node.js，可配合后端开发人员进行开发；
- 关注前端发展趋势；

### 1.2 建立内容

 

目标：P7

技术栈：

- 熟练：JS、CSS、TS；

- 熟练：Vue2/3、Vue-SSR、React

- 熟练：跨端（Uni-app）；

- 熟悉：Node、网络；

- 了解：Vue、React技术栈原理、RN；

- 了解：跨端小程序原理；

- 了解：linux、docker、sql；

项目：

1. 项目1：RN

2. 项目2：C端

- 封装CLI，基于Vue-cli4，支持CDN、ajax、hybrid；

- IM SDK开发；

- 技术栈：Vue3、TS、Rollup、Babel、Vite、websocket；

3. 项目3：跨端

- uni-app开发；

- 项目性能优化；

- 技术栈：Vue、Uni-app、Webpack、TS；

4. 项目4：B端

- 规范组件；

## 2.面试问题

 

### 2.1面试问题

 

1. 基础：

- 从用户输入网址到客户端展现，中间发生了什么过程？

2. 框架：

- Vue、React实现diff的区别？

- Vue 和 Uni-app在生成多端代码时的异同点？

- 组件库的设计思路？

- 跨端小程序的实现思路？

3. 项目问题：

- 项目1：
  - RN遇到最难的问题是什么？
  - 如何针对RN进行性能优化？
  - 为什么不用flutter？
  - 既然有跨端应用，为什么不转uni-app?

- 项目2：
  - CLI实现的功能？
  - 详细介绍一下IM-SDK？

- 项目3：
  - uni-app项目优化方案？

- 项目4：
  - 如何规范组件？
  - 组内如何推动？

4. 常见问题：

- 做过技术复杂度最高的项目是什么；

- 前端前沿知识有哪些了解；

 

## 3.面试常见问题&面试注意事项

### 3.1 面试常见问题

 

#### 3.1.1 从用户输入网址到客户端展现，中间发生了什么过程？ 

目的在于是否有对性能优化的实践

1. 输入网址 --- 告诉浏览器你要去哪里

2. 浏览器查找DNS --- 网络世界是IP地址的世界，DNS就是ip地址的别名。从本地DNS到最顶级DNS一步一步的网上爬，直到命中需要访问的IP地址

- DNS预解析 --- 使用CDN缓存，加快解析CDN寻找到目标地址（dns-prefetch）；

3. 客户端和服务器建立连接 --- 建立TCP的安全通道，3次握手

- CDN加速 --- 使用内容分发网络，让用户更快的获取到所要内容；

- 启用压缩 --- 在http协议中，使用类似Gzip压缩的方案（对服务器资源不足的时候进行权衡）；

- 使用HTTP/2协议 --- http2.0针对1.0优化了很多东西，包括异步连接复用，头压缩等等，使传输更快；

4. 浏览器发送http请求 --- 默认长连接（复用一个tcp通道，短连接：每次连接完就销毁）

- 减少http请求 --- 每个请求从创建到销毁都会消耗很多资源和时间，减少请求就可以相对来说更快展示内容；
  - 压缩合并js文件以及css文件
  - 针对图片，可将图片进行合并然后下载，通过css Sprites切割展示（控制大小，太大的话反而适得其反）

- 使用http缓存 --- 缓存原则：越多越好，越久越好。让客户端发送更少请求，直接从本地获取，加快性能；

- 减少cookie请求 --- 针对非必要数据（静态资源）请求，进行跨域隔离，减少传输内容大小；

- 预加载请求 --- 针对一些业务中场景可预加载的内容，提前加载，在之后的用户操作中更少的请求，更快的响应；

- 选择get和post --- 在http定义的时候，get本质上就是获取数据，post是发送数据的。get可以在一个TCP报文完成请求，但是post先发header，再发送数据。so，考虑好请求选型；

- 缓存方案选型 --- 递进式缓存更新（防止一次性丢失大量缓存，导致负载骤多）；

5. 服务器响应请求 --- tomcat、IIS等服务器通过本地映射文件关系找到地址或者通过数据库查找到数据，处理完成返回给浏览器

- 后端框架选型 --- 更快的响应，前端更快的操作；

- 数据库选型和优化 --- 更快的响应，前端更快的操作；

6. 浏览器接受响应 --- 浏览器根据报文头里面的数据进行不同的响应处理

- 解耦第三方依赖 --- 越多的第三方的不确定因素，会导致web的不稳定性和不确定性；

- 避免404资源 --- 请求资源不到浪费了从请求到接受的所有资源；

7. 浏览器渲染顺序

- HTML解析开始构建dom树；

- 外部脚本和样式表加载完毕
  - 尽快加载css，首先将CSSOM对象渲染出来，然后进行页面渲染，否则导致页面闪屏，用户体验差
  - css选择器是从右往左解析的，so类似#test a {color: #444},css解析器会查找所有a标签的祖先节点，所以效率不是那么高；
  - 在css的媒介查询中，最好不要直接和任何css规则直接相关。最好写到link标签中，告诉浏览器，只有在这个媒介下，加载指定这个css；

- 脚本在文档内解析并执行
  - 按需加载脚本，例如现在的webpack就可以打包和按需加载js脚本；
  - 将脚本标记为异步，不阻塞页面渲染，获得最佳启动，保证无关主要的脚本不会阻塞页；
  - 慎重选型框架和类库，避免只是用类库和框架的一个功能或者函数，而引用整个文件；

- HTML DOM完全构造起来
  - DOM 的多个读操作（或多个写操作），应该放在一起。原则：统一读、统一写；

- 图片和外部内容加载
  - 对多媒体内容进行适当优化，包括恰当使用文件格式，文件处理、渐进式渲染等；
  - 避免空的src，空的src仍然会发送请求到服务器；
  - 避免在html内容中缩放图片，如果你需要使用小图，则直接使用小图；

-  网页完成加载
  - 服务端渲染，特别针对首屏加载很重要的网站，可以考虑这个方案。后端渲染结束，前端接管展示；

总结一下可以做到性能优化的点：

![img](https://camo.githubusercontent.com/5956b4f3cdd26e099f73ec3bdbe73020b43224326bf1d7c6a3aff81abb996afb/68747470733a2f2f70392d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f64363137353866356630336334616231623539653635646464373264326136667e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f)



 

#### 3.1.2 前端工程化有哪些实践？ 

1. 技术选型：主要指基于什么原因，选择哪种前端框架：React、Vue、Angular（对微应用的理解）；

2. 规范统一：

- git hooks、git commit配置；

- eslint配置；

- 项目结构规范：CLI；

- UI规范：组件库的选择、开发与使用；

3. 测试：Jest的使用，与其他框架的对比；

4. 构建工具：webpack、rollup、vite的选择；

5. 部署：

- 使用Jenkins构建前端项目并部署到服务器；

- 如何使用github action 或者gitLab action关联项目；

6. 性能监控：

- 前端监控的理解与实践，performance的使用；

- 数据上报的方式；

- 如何上传错误的sourcemap；

- 无埋点；

7. 性能优化:

- 加载时性能优化：lighthouse、HTTP、CDN缓存、SSR；

- 运行时性能优化：重绘重排、长列表渲染；

8. 重构：为什么要重构，如何重构，重构的思想；

9. 微前端：针对巨石项目如何支持；

10. serverless：什么时候使用serverless；

#### 3.1.3 前端前沿知识有哪些了解？ 

 

1. 微前端；

2. low code、no code；

3. 前端工程化搭建；

4. 自动化部署；

5. 前端性能检测；

6. 跨端；

7. 前端组件化；

8. 前端稳定性建设；

9. 在线文档；

### 3.2面试注意事项

#### 3.2.1面试类型

1. 中小厂 / 国企：八股文 + 项目

- 直接是八股文的原题，最多变式（手写防抖、节流；手写call、apply；手写Promise.all、Promise.allSettled）；

- 对项目经验要求度不高，对具体实现细节考察比较少，主要考察对基础的理解程度；

2. 大厂：技术深度广度挖掘：八股文 + 项目 + 算法

- 以八股文作为切入点，扩展至类似技术栈的具体实现，可能会涉及到框架的具体实现，看候选人对技术基础的理解程度：P6居多；

- 以项目具体经验作为切入点，根据项目经验延伸至前端项目的具体落地，结合市场上比较优秀的框架对比，主要考察技术面的广度和深度，以及是否能够解决行业内某一具体细分的问题，如工程化，脚手架，CI/CD等：P7居多；

#### 3.2.2 面试流程

 

- 中小厂：一般为3轮：技术面2轮+HR面1轮；

- 国企：一般为4轮：线上笔试1轮+技术面2轮+HR面1轮；

- 大厂：一般为4~5轮：技术面3轮+（交叉面1轮）+HR面1轮；

#### 3.2.3 技术深度广度拓展 

 

![img](https://risingstars.js.org/favicon.ico)

[2021 年 JavaScript 明星项目](https://risingstars.js.org/2021/zh)



- 前端框架：React、Vue、Svelte、Angular；

- Node框架：Next、Nest、Nuxt；

- 构建工具：Vite、esbuild、webpack、rollup；

- CSS in JavaScript：Styled component、twind、CSS module；

- 测试框架：Storybook、Jest；

- 移动端开发：React Native；

- 状态管理：Zustand、Redux、Vuex、MobX；

#### 3.2.4. 大厂职级详解 

 

| 要求\级别 | 主要目标                 | 核心能力                 | 要求                                                         |
| --------- | ------------------------ | ------------------------ | ------------------------------------------------------------ |
| P5        | 从学生转变为“打工人”     | 在别人知道下完成任务     | 技术：岗位基本技术&团队常用技术 业务：熟悉业务功能的处理逻辑 管理：熟悉项目流程 |
| P6        | 成为独立自主的“项目能手” | 独立负责端到端的项目任务 | 技术：熟练掌握端到端的工作流技术 业务：熟悉某业务的所有功能 管理：项目子任务推进 |
| P7        | 成为让人信服的“团队专家” | 指挥单个团队达到目标     | 技术：精通团队相关技术 业务：关注业务的整体情况 管理：指挥10人以内的小团队 |
| P8        | 成为“跨团队指挥”         | 指挥多个团队达成目标     | 技术：精通领域相关技术 业务：熟悉多个业务或精通端到端业务 管理：核心是抓重点 |

 

#### 3.2.5. 前端Job Model 

| 类型                 | 体系职能                                                     |
| -------------------- | ------------------------------------------------------------ |
| 技术-前端-开发       | 负责人机交互层的界面开发，实现交互功能                       |
| 技术-前端-架构       | 熟悉业务领域与前端技术发展，负责前端类库框架、研发流程等基础体系的设计并推动实现，负责业务领域的前端技术选型并推动落地 |
| 技术-前端-数据可视化 | 负责常规统计图表、业务洞察分析、地理空间数据分析等相关引擎、服务、产品及生态建设 |
| 技术-前端-Node       | 基于Node进行web服务开发或工具开发                            |
| 技术-前端-图像互动   | 负责互动/游戏化业务，2D&3D图像渲染等研发工作                 |
| 前端体验             | 1. 体验度量：通过设计体验模型来度量产品体验功能 2. 体验优化：体验分析，如核心链路分析、体验验收&用户反馈等 |
| 前端工程化           | 1. 基础前端工程服务平台、前端上层链路研发平台、开发支撑平台 2. 前端研发工具，如WebIDE etc |
| 跨端技术             | 1. 跨软硬件设备，IoT、跨操作系统、跨App、跨渲染容器（最常见，如webView，weex，rn etc） 2. 跨端生态 |
| 中后台技术           | 1. 基础UI组件，研发工具 2. low Code、no Code逻辑编排 etc     |
| 前端智能化           | 1. D2C（Design to Code 设计稿转代码） 2. 分析用户特征，推荐UI排版，千人千面 |
| Serverless           | 1. 含义：Serverless = Server + less = 少/无服务器 2. FaaS：Function as a service 代码+相关依赖+配置 |
| 数据可视化           | 1. 基础前端工程服务平台、前端上层链路研发平台、开发支撑平台 2. 前端研发工具，如WebIDE etc |
| 多媒体技术           | 1. 音视频基础、流媒体播放、视频剪辑等 2. 多端（web、Hybrid、小程序）直播间 |

[2022-爪哇前端大厂工程师训练营.pdf(4.1 MB)](https://www.yuque.com/office/yuque/0/2022/pdf/2340337/1665577595901-fd8baad9-7274-4d85-b51f-21ff5c973357.pdf?from=https%3A%2F%2Fwww.yuque.com%2Flpldplws%2Fweb%2Fwa93b6%3FsingleDoc)

# js运行机制

https://www.yuque.com/lpldplws/atomml/xnudhigbps5in504?singleDoc# 《JavaScript的运行机制》 密码：zglx

## 1. 课程目标

1. 了解进程与线程的基础概念，明确在浏览器中的进程与线程机制；
2. 了解浏览器与Node中的事件循环；

## 2. 课程大纲

1. 进程与线程；
2. 事件循环；

## 3. 进程与线程

### 3.1. 什么是进程

CPU是计算机的核心，承担所有的计算任务。

官网说法，进程是CPU资源分配的最小单位。

字面意思就是进行中的程序，我将它理解为一个可以独立运行且拥有自己的资源空间的任务程序，进程包括运行中的程序和程序所使用到的内存和系统资源。

CPU可以有很多进程，我们的电脑每打开一个软件就会产生一个或多个进程，为什么电脑运行的软件多就会卡，是因为CPU给每个进程分配资源空间，但是一个CPU一共就那么多资源，分出去越多，越卡，每个进程之间是相互独立的，CPU在运行一个进程时，其他的进程处于非运行状态，CPU使用 时间片轮转调度算法 来实现同时运行多个进程。

### 3.2. 什么是线程

线程是CPU调度的最小单位。

线程是建立在进程的基础上的一次程序运行单位，通俗点解释线程就是程序中的一个执行流，一个进程可以有多个线程。

一个进程中只有一个执行流称作单线程，即程序执行时，所走的程序路径按照连续顺序排下来，前面的必须处理好，后面的才会执行。

一个进程中有多个执行流称作多线程，即在一个程序中可以同时运行多个不同的线程来执行不同的任务， 也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。

### 3.3. 进程和线程的区别

进程是操作系统分配资源的最小单位，线程是程序执行的最小单位。

一个进程由一个或多个线程组成，线程可以理解为是一个进程中代码的不同执行路线。

进程之间相互独立，但同一进程下的各个线程间共享程序的内存空间(包括代码段、数据集、堆等)及一些进程级的资源(如打开文件和信号)。

调度和切换：线程上下文切换比进程上下文切换要快得多。

### 3.4. 多进程和多线程

- 多进程：多进程指的是在同一个时间里，同一个计算机系统中如果允许两个或两个以上的进程处于运行状态。多进程带来的好处是明显的，比如大家可以在网易云听歌的同时打开编辑器敲代码，编辑器和网易云的进程之间不会相互干扰；
- 多线程：多线程是指程序中包含多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务，也就是说允许单个程序创建多个并行执行的线程来完成各自的任务；

### 3.5. JS为什么是单线程

JS的单线程，与它的用途有关。

作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

还有人说js还有Worker线程，对的，为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程是完 全受主线程控制的，而且不得操作DOM。

所以，这个标准并没有改变JavaScript是单线程的本质。

### 3.6. 浏览器

拿Chrome来说，我们每打开一个Tab页就会产生一个进程。

#### 3.6.1. 浏览器包含哪些进程

1. Browser进程

1. - 浏览器的主进程(负责协调、主控)，该进程只有一个；

2. - 负责浏览器界面显示，与用户交互。如前进，后退等；

3. - 负责各个页面的管理，创建和销毁其他进程；

4. - 将渲染(Renderer)进程得到的内存中的Bitmap(位图)，绘制到用户界面上；

5. - 网络资源的管理，下载等；

2. 第三方插件进程

1. - 每种类型的插件对应一个进程，当使用该插件时才创建；

3. GPU进程

1. - 该进程也只有一个，用于3D绘制等等；

4. 渲染进程

1. - 即通常所说的浏览器内核(Renderer进程，内部是多线程)；

2. - 每个Tab页面都有一个渲染进程，互不影响；

3. - 主要作用为页面渲染，脚本执行，事件处理等；

#### 3.6.2. 为什么浏览器要多进程

假设浏览器是单进程，那么某个Tab页崩溃了，就影响了整个浏览器，体验有多差？同理如果插件崩溃了也会影响整个浏览器。

浏览器进程有很多，每个进程又有很多线程，都会占用内存

#### 3.6.3. 渲染进程

页面的渲染，JS的执行，事件的循环，都在渲染进程内执行，所以我们要重点了解渲染进程

渲染进程是多线程的，看渲染进程的一些常用较为主要的线程：

##### 3.6.3.1. GUI渲染线程

1. 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等；

1. - 解析html代码(HTML代码本质是字符串)转化为浏览器认识的节点，生成DOM树，也就是DOM Tree；

2. - 解析css，生成CSSOM(CSS规则树)；

3. - 把DOM Tree 和CSSOM结合，生成Rendering Tree(渲染树)；

2. 当我们修改了一些元素的颜色或者背景色，页面就会重绘(Repaint)；

3. 当我们修改元素的尺寸，页面就会回流(Reflow)；

4. 当页面需要Repaing和Reflow时GUI线程执行，绘制页面；
5. 回流(Reflow)比重绘(Repaint)的成本要高，我们要尽量避免Reflow和Repaint；
6. GUI渲染线程与JS引擎线程是互斥的：

1. - 当JS引擎执行时GUI线程会被挂起(相当于被冻结了)；

2. - GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行；

##### 3.6.3.2. JS引擎线程

1. JS引擎线程就是JS内核，负责处理Javascript脚本程序(例如V8引擎)；
2. JS引擎线程负责解析Javascript脚本，运行代码；
3. JS引擎一直等待着任务队列中任务的到来，然后加以处理：

1. - 浏览器同时只能有一个JS引擎线程在运行JS程序，所以js是单线程运行的；

2. - 一个Tab页(renderer进程)中无论什么时候都只有一个JS线程在运行JS程序；

4. GUI渲染线程与JS引擎线程是互斥的，js引擎线程会阻塞GUI渲染线程 

1. - 就是我们常遇到的JS执行时间过长，造成页面的渲染不连贯，导致页面渲染加载阻塞(就是加载慢)；

2. - 例如浏览器渲染的时候遇到<script>标签，就会停止GUI的渲染，然后js引擎线程开始工作，执行里面的js代码，等js执行完毕，js引擎线程停止工作，GUI继续渲染下面的内容。所以如果js执行时间太长就会造成页面卡顿的情况；（所以有了`defer` 和 `async`标签）

##### 3.6.3.3. 事件触发线程

1. 属于浏览器而不是JS引擎，用来控制事件循环，并且管理着一个事件队列(task queue)；
2. 当js执行碰到事件绑定和一些异步操作(如setTimeOut，也可来自浏览器内核的其他线程，如鼠标点击、AJAX异步请求等)，会走事件触发线程将对应的事件添加到对应的线程中(比如定时器操作，便把定时器事件添加到定时器线程)，等异步事件有了结果，便把他们的回调操作添加到事件队列，等待js引擎线程空闲时来处理；
3. 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理；
4. 因为JS是单线程，所以这些待处理队列中的事件都得排队等待JS引擎处理；

##### 3.6.3.4. 定时触发器线程

1. setInterval与setTimeout所在线程；
2. 浏览器定时计数器并不是由JavaScript引擎计数的(因为JavaScript引擎是单线程的，如果处于阻塞线程状态就会影响记计时的准确)；
3. 通过单独线程来计时并触发定时(计时完毕后，添加到事件触发线程的事件队列中，等待JS引擎空闲后执行)，这个线程就是定时触发器线程，也叫定时器线程；
4. W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms；

#### 3.6.3.5. 异步http请求线程

1. 在XMLHttpRequest在连接后是通过浏览器新开一个线程请求；
2. 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中再由JavaScript引擎执行；
3. 简单说就是当执行到一个http异步请求时，就把异步请求事件添加到异步请求线程，等收到响应(准确来说应该是http状态变化)，再把回调函数添加到事件队列，等待js引擎线程来执行；

## 4. 事件循环(Event Loop)基础

JS分为同步任务和异步任务。同步任务都在主线程(这里的主线程就是JS引擎线程)上执行，会形成一个执行栈。

主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放一个事件回调。一旦执行栈中的所有同步任务执行完毕(也就是JS引擎线程空闲了)，系统就会读取任务队列，将可运行的异步任务(任务队列中的事件回调，只要任务队列中有事件回调，就说明可以执行)添加到执行栈中，开始执行

我们来看一段简单的代码：

```javascript
let setTimeoutCallBack = function() {
  console.log('我是定时器回调');
};
let httpCallback = function() {
  console.log('我是http请求回调');
}

// 同步任务
console.log('我是同步任务1');

// 异步定时任务
setTimeout(setTimeoutCallBack,1000);

// 异步http请求任务
ajax.get('/info',httpCallback);

// 同步任务
console.log('我是同步任务2');
```

以上代码的执行过程：

1. JS是按照顺序从上往下依次执行的，可以先理解为这段代码时的执行环境就是主线程，也就是也就是当前执行栈；
2. 首先，执行`console.log('我是同步任务1')`；
3. 接着，执行到`setTimeout`时，会移交给定时器线程，通知定时器线程 1s 后将 `setTimeoutCallBack` 这个回调交给事件触发线程处理，在 1s 后事件触发线程会收到 `setTimeoutCallBack` 这个回调并把它加入到事件触发线程所管理的事件队列中等待执行；
4. 接着，执行http请求，会移交给异步http请求线程发送网络请求，请求成功后将 `httpCallback` 这个回调交由事件触发线程处理，事件触发线程收到 httpCallback 这个回调后把它加入到事件触发线程所管理的事件队列中等待执行；
5. 再接着执行`console.log('我是同步任务2')`；
6. 至此主线程执行栈中执行完毕，JS引擎线程已经空闲，开始向事件触发线程发起询问，询问事件触发线程的事件队列中是否有需要执行的回调函数，如果有将事件队列中的回调事件加入执行栈中，开始执行回调，如果事件队列中没有回调，JS引擎线程会一直发起询问，直到有为止；

可以发现：

1. 定时触发线程只管理定时器且只关注定时不关心结果，定时结束就把回调扔给事件触发线程；
2. 异步http请求线程只管理http请求同样不关心结果，请求结束把回调扔给事件触发线程；
3. 事件触发线程只关心异步回调入事件队列；
4. JS引擎线程只会执行执行栈中的事件，执行栈中的代码执行完毕，就会读取事件队列中的事件并添加到执行栈中继续执行；
5. 反复执行，就是我们所谓的事件循环(Event Loop)；

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671096823790-ac382b71-e3e7-4796-9e30-903d7ff8662e.png)

1. 执行栈开始顺序执行；
2. 判断是否为同步，异步则进入异步线程，最终事件回调给事件触发线程的任务队列等待执行，同步继续执行；
3. 执行栈空，询问任务队列中是否有事件回调；
4. 任务队列中有事件回调则把回调加入执行栈末尾继续从第一步开始执行；
5. 任务队列中没有事件回调则不停发起询问；

# 5. 宏任务& 微任务

宏任务 -> GUI渲染 -> 宏任务 -> ... 复制代码

## 5.1. 宏任务(`macrotask`)

在ECMAScript中，`macrotask`也被称为task。

我们可以将每次执行栈执行的代码当做是一个宏任务(包括每次从事件队列中获取一个事件回调并放到执行栈中执行)， 每一个宏任务会从头到尾执行完毕，不会执行其他、

由于JS引擎线程和GUI渲染线程是互斥的关系，浏览器为了能够使宏任务和DOM任务有序的进行，会在一个宏任务执行结果后，在下一个宏任务执行前，GUI渲染线程开始工作，对页面进行渲染：

```javascript
宏任务 -> GUI渲染 -> 宏任务 -> ...
```

常见的宏任务：

1. 主代码块；
2. setTimeout；
3. setInterval；
4. setImmediate ()  -Node；
5. requestAnimationFrame () -浏览器

### 5.2. 微任务(`microtask`)

ES6新引入了Promise标准，同时浏览器实现上多了一个`microtask`微任务概念，在ECMAScript中，`microtask`也被称为jobs。

我们已经知道宏任务结束后，会执行渲染，然后执行下一个宏任务， 而微任务可以理解成在当前宏任务执行后立即执行的任务。

当一个宏任务执行完，会在渲染前，将执行期间所产生的所有微任务都执行完：

```javascript
宏任务 -> 微任务 -> GUI渲染 -> 宏任务 -> ...
```

常见微任务

1. process.nextTick () -Node；
2. Promise.then()；
3. catch；
4. finally；
5. Object.observe；
6. MutationObserver；

### 5.3. 区分宏任务&微任务

打开新的空白窗口，在console中输入以下代码

```javascript
window.open();

document.body.style = 'background:black';
document.body.style = 'background:red';
document.body.style = 'background:blue';
document.body.style = 'background:pink';
```

背景直接渲染了粉红色，根据上文里讲浏览器会先执行完一个宏任务，再执行当前执行栈的所有微任务，然后移交GUI渲染，上面四行代码均属于同一次宏任务，全部执行完才会执行渲染，渲染时GUI线程会将所有UI改动优化合并，所以视觉上，只会看到页面变成粉红色。

```javascript
document.body.style = 'background:blue';
setTimeout(()=>{
    document.body.style = 'background:black'
},200)
```

页面会先卡一下蓝色，再变成黑色背景。之所以会卡一下蓝色，是因为以上代码属于两次宏任务，第一次宏任务执行的代码是将背景变成蓝色，然后触发渲染，将页面变成蓝色，再触发第二次宏任务将背景变成黑色。

```javascript
document.body.style = 'background:blue'
console.log(1);
Promise.resolve().then(()=>{
    console.log(2);
    document.body.style = 'background:pink'
});
console.log(3);
```

输出 1 3 2 , 是因为 promise 对象的 then 方法的回调函数是异步执行，所以 2 最后输出

页面的背景色直接变成粉色，没有经过蓝色的阶段，是因为，我们在宏任务中将背景设置为蓝色，但在进行渲染前执行了微任务， 在微任务中将背景变成了粉色，然后才执行的渲染。

### 5.4. 注意点

1. 浏览器会先执行一个宏任务，紧接着执行当前执行栈产生的微任务，再进行渲染，然后再执行下一个宏任务；
2. 微任务和宏任务不在一个任务队列，不在一个任务队列：

1. - `setTimeout`是一个宏任务，它的事件回调在宏任务队列，`Promise.then()`是一个微任务，它的事件回调在微任务队列，二者并不是一个任务队列；
   - 以Chrome 为例，有关渲染的都是在渲染进程中执行，渲染进程中的任务（DOM树构建，js解析…等等）需要主线程执行的任务都会在主线程中执行，而浏览器维护了一套事件循环机制，主线程上的任务都会放到消息队列中执行，主线程会循环消息队列，并从头部取出任务进行执行，如果执行过程中产生其他任务需要主线程执行的，渲染进程中的其他线程会把该任务塞入到消息队列的尾部，消息队列中的任务都是宏任务；
   - 微任务是如何产生的呢？当执行到script脚本的时候，js引擎会为全局创建一个执行上下文，在该执行上下文中维护了一个微任务队列，当遇到微任务，就会把微任务回调放在微队列中，当所有的js代码执行完毕，在退出全局上下文之前引擎会去检查该队列，有回调就执行，没有就退出执行上下文，这也就是为什么微任务要早于宏任务，也是大家常说的，每个宏任务都有一个微任务队列（由于定时器是浏览器的API，所以定时器是宏任务，在js中遇到定时器会也是放入到浏览器的队列中）；

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671096823921-6ff3ee75-9409-4152-9337-de64a59d5493.png)

1. 首先执行一个宏任务，执行结束后判断是否存在微任务；
2. 有微任务先执行所有的微任务，再渲染，没有微任务则直接渲染；
3. 然后再接着执行下一个宏任务；

## 6. 完整的Event Loop

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671096824044-e65976eb-709e-4f37-aaf9-2c498e89fae5.png)

1. 整体的script(作为第一个宏任务)开始执行的时候，会把所有代码分为同步任务、异步任务两部分，同步任务会直接进入主线程依次执行，异步任务会再分为宏任务和微任务；
2. 宏任务进入到`Event Table`中，并在里面注册回调函数，每当指定的事件完成时，`Event Table`会将这个函数移到`Event Queue`中；
3. 微任务也会进入到另一个`Event Table`中，并在里面注册回调函数，每当指定的事件完成时，`Event Table`会将这个函数移到`Event Queue`中；
4. 当主线程内的任务执行完毕，主线程为空时，会检查微任务的`Event Queue`，如果有任务，就全部执行，如果没有就执行下一个宏任务；
5. 上述过程会不断重复，这就是Event Loop；

## 7. Promise&async/aweait

### 7.1. Promise

`new Promise(() => {}).then() `中，前面的 new Promise() 这一部分是一个构造函数，这是一个同步任务，后面的 .then() 才是一个异步微任务：

```javascript
new Promise((resolve) => {
	console.log(1)
  resolve()
}).then(()=>{
	console.log(2)
})
console.log(3)
// 上面代码输出1 3 2
```

### 7.2. async/await 函数

async/await本质上还是基于Promise的一些封装，而Promise是属于微任务的一种

所以在使用await关键字与Promise.then效果类似，await 以前的代码，相当于与 new Promise 的同步代码，await 以后的代码相当于 Promise.then的异步

```javascript
setTimeout(() => console.log(4))

async function test() {
  console.log(1)
  await Promise.resolve()
  console.log(3)
}

test()

console.log(2)
// 输出1 2 3 4
```

### 7.3. demo

```javascript
function test() {
  console.log(1)
  setTimeout(function () { 	// timer1
    console.log(2)
  }, 1000)
}

test();

setTimeout(function () { 		// timer2
  console.log(3)
})

new Promise(function (resolve) {
  console.log(4)
  setTimeout(function () { 	// timer3
    console.log(5)
  }, 100)
  resolve()
}).then(function () {
  setTimeout(function () { 	// timer4
    console.log(6)
  }, 0)
  console.log(7)
})

console.log(8)

// 输出1，4，8，7，3，6，5，2
```

1. JS是顺序从上而下执行；
2. 执行到test()，test方法为同步，直接执行`console.log(1)`打印1；
3. test方法中`setTimeout`为异步宏任务，回调我们把它记做timer1放入宏任务队列；
4. test方法下面有一个`setTimeout`为异步宏任务，回调我们把它记做timer2放入宏任务队列；
5. 执行promise，`new Promise`是同步任务，直接执行，打印4；
6. `new Promise`里面的`setTimeout`是异步宏任务，回调我们记做timer3放到宏任务队列；
7. `Promise.then`是微任务，放到微任务队列；
8. console.log(8)是同步任务，直接执行，打印8；
9. 主线程任务执行完毕，检查微任务队列中有`Promise.then`；
10. 开始执行微任务，发现有`setTimeout`是异步宏任务，记做timer4放到宏任务队列；
11. 微任务队列中的`console.log(7)`是同步任务，直接执行，打印7；
12. 微任务执行完毕，第一次循环结束；
13. 检查宏任务队列，里面有timer1、timer2、timer3、timer4，四个定时器宏任务，按照定时器延迟时间得到可以执行的顺序，即Event Queue：timer2、timer4、timer3、timer1，依次拿出放入执行栈末尾执行；
14. 执行timer2，`console.log(3)`为同步任务，直接执行，打印3；
15. 检查没有微任务，第二次Event Loop结束；
16. 执行timer4，`console.log(6)`为同步任务，直接执行，打印6；
17. 检查没有微任务，第三次Event Loop结束；
18. 执行timer3，`console.log(5)`同步任务，直接执行，打印5；
19. 检查没有微任务，第四次Event Loop结束；
20. 执行timer1，`console.log(2)`同步任务，直接执行，打印2；
21. 检查没有微任务，也没有宏任务，第五次Event Loop结束；

## 8. NodeJS中的运行机制

虽然NodeJS中的JavaScript运行环境也是V8，也是单线程，但是，还是有一些与浏览器中的表现是不一样的。

其实nodejs与浏览器的区别，就是nodejs的宏任务分好几种类型，而这好几种又有不同的任务队列，而不同的任务队列又有顺序区别，而微任务是穿插在每一种宏任务之间的。

在node环境下，process.nextTick的优先级高于Promise，可以简单理解为在宏任务结束后会先执行微任务队列中的nextTickQueue部分，然后才会执行微任务中的Promise部分。

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1671096823466-47c77129-f237-4e37-aaa2-429adc11f6d4.png)

NodeJS的Event Loop：

1. Node会先执行所有类型为 timers 的 `MacroTask`，然后执行所有的 `MicroTask`(`NextTick`例外)；
2. 进入 poll 阶段，执行几乎所有 `MacroTask`，然后执行所有的 `MicroTask`；
3. 再执行所有类型为 check 的 `MacroTask`，然后执行所有的 `MicroTask`；
4. 再执行所有类型为 `close callbacks` 的 `MacroTask`，然后执行所有的 `MicroTask`；
5. 至此，完成一个 Tick，回到 timers 阶段，重复执行；

## 9.async和defer的区别？

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

1. 事件的触发线程

- setTimeout ajax ->回调事件

2. 定时器的线程

- setTimeout setInterval

3. 异步http请求的线程

## 10. event loop

1.同步任务： js引擎的线程中，执行栈

2.异步任务：可以执行的异步任务 事件的触发线程 任务队列

## 11.宏任务和微任务

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

# Vue基础用法

https://www.yuque.com/lpldplws/web/dn72m7?singleDoc# 《Vue基础用法》 密码：xrw9

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

## 1. 课程目标

1. 入门Vue，了解常见的用法；
2. 掌握面试中Vue的基础问题；
3. 掌握Vue学习路线；

## 2. 课程大纲

1. Vue.js简介
2. Vue.js模板及指令
3. 生命周期
4. Vue.js computed 和 watch

## 3. 主要内容

注意：主要以Vue2为主，Vue3的内容后续讲解

课程时间安排：

- 前四节课：课程内容+Vue2核心源码解析
- 后续课：课程+Vue3核心源码解析

官网地址：https://v2.cn.vuejs.org/

### 3.1. Vue.js简介

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://v2.cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

- 语义化模板

- - header
  - footer
  - template

- MVC

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1647071835190-02b721bb-406d-452f-adb9-3a1af1daf22e.png)

```javascript
// model
var myapp = {}; // 创建这个应用对象

myapp.Model = function() {
  var val = 0;

  this.add = function(v) {
    if (val < 100) val += v;
  };

  this.sub = function(v) {
    if (val > 0) val -= v;
  };

  this.getVal = function() {
    return val;
  };

  ／* 观察者模式 *／
  var self = this, 
      views = [];

  this.register = function(view) {
    views.push(view);
  };

  this.notify = function() {
    for(var i = 0; i < views.length; i++) {
        views[i].render(self);
    }
  };
};

// view
myapp.View = function(controller) {
  var $num = $('#num'),
      $incBtn = $('#increase'),
      $decBtn = $('#decrease');

  this.render = function(model) {
      $num.text(model.getVal() + 'rmb');
  };

  /*  绑定事件  */
  $incBtn.click(controller.increase);
  $decBtn.click(controller.decrease);
};

// controller
myapp.Controller = function() {
  var model = null,
      view = null;

  this.init = function() {
    /* 初始化Model和View */
    model = new myapp.Model();
    view = new myapp.View(this);

    /* View向Model注册，当Model更新就会去通知View啦 */
    model.register(view);
    model.notify();
  };

  /* 让Model更新数值并通知View更新视图 */
  this.increase = function() {
    model.add(1);
    model.notify();
  };

  this.decrease = function() {
    model.sub(1);
    model.notify();
  };
};

// init
(function() {
  var controller = new myapp.Controller();
  controller.init();
})();
```

- MVVM

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1647072104508-55c6d7e4-d8c5-4f39-afab-def587496cae.png)

```javascript
// model
var data = {
    val: 0
};

// view
<div id="myapp">
    <div>
        <span>{{ val }}rmb</span>
    </div>
    <div>
        <button v-on:click="sub(1)">-</button>
        <button v-on:click="add(1)">+</button>
    </div>
</div>

// controller
new Vue({
  el: '#myapp',
  data: data,
  methods: {
    add(v) {
        if(this.val < 100) {
            this.val += v;
        }
    },
    sub(v) {
        if(this.val > 0) {
            this.val -= v;
        }
    }
  }
});

// MVVM
// 1. 数据会绑定在viewModel层并自动将数据渲染到页面中
// 2. 视图变化时，会通知viewModel层更新数据

// Vue是不是MVVM？React呢？
// 严格来讲都不是
// React：ui = render (data) 单向数据流
// Vue:   ref 直接操作DOM，跳过了ViewModel
```

### 3.2. Vue.js模板及指令

#### 3.2.1. Vue.js实例

每个 Vue 应用都是通过用 Vue 函数创建一个新的 Vue 实例开始的：

```js
var vm = new Vue({
  // 选项
})
```

在Vue2里，虽然没有完全遵循 MVVM，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用 vm (ViewModel 的缩写) 这个变量名表示 Vue 实例。

当一个 Vue 实例被创建时，它将 data 对象中的所有的 property 加入到 Vue 的响应式系统中。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

```js
// 我们的数据对象
var data = { a: 1 }

// 该对象被加入到一个 Vue 实例中
var vm = new Vue({
  data: data
})

// 获得这个实例上的 property
// 返回源数据中对应的字段
vm.a == data.a // => true

// 设置 property 也会影响到原始数据
vm.a = 2
data.a // => 2

// ……反之亦然
data.a = 3
vm.a // => 3
```

当这些数据改变时，视图会进行重渲染。值得注意的是只有当实例被创建时就已经存在于 data 中的 property 才是响应式的。也就是说如果你添加一个新的 property，比如：

```
vm.b = 'hi'
```

那么对 b 的改动将不会触发任何视图的更新。如果你知道你会在晚些时候需要一个 property，但是一开始它为空或不存在，那么你仅需要设置一些初始值。比如：

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

这里唯一的例外是使用 Object.freeze()，这会阻止修改现有的 property，也意味着响应系统无法再追踪变化。

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

除了数据 property，Vue 实例还暴露了一些有用的实例 property 与方法。它们都有前缀 $，以便与用户定义的 property 区分开来。例如：

```j s
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```

注意：具体的监听派发更新过程后续源码解析时讲解，此处会用即可

#### 3.2.2. Vue.js模板

模板引擎编译源码部分讲解，此处需要理解会用即可

Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

##### 3.2.2.1. 文本

数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值：

```
<span>Message: {{ msg }}</span>
```

Mustache 标签将会被替代为对应数据对象上 msg property 的值。无论何时，绑定的数据对象上 msg property 发生了改变，插值处的内容都会更新。

通过使用 v-once 指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。但请留心这会影响到该节点上的其它数据绑定：

```
<span v-once>这个将不会改变: {{ msg }}</span>
```

##### 3.2.2.2. 原始HTML

双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 v-html指令：

```j s
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

Using mustaches: <span style="color: red">This should be red.</span>

Using v-html directive: This should be red.

这个 span 的内容将会被替换成为 property 值 rawHtml，直接作为 HTML——会忽略解析 property 值中的数据绑定。

注意：动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。

##### 3.2.2.3. 属性

Mustache 语法不能作用在 HTML attribute 上，遇到这种情况应该使用 v-bind指令：

```
<div v-bind:id="dynamicId"></div>
```

##### 3.2.2.4. 使用 JavaScript 表达式

迄今为止，在我们的模板中，我们一直都只绑定简单的 property 键值。但实际上，对于所有的数据绑定，Vue.js 都提供了完全的 JavaScript 表达式支持。

```j s
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

这些表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。有个限制就是，每个绑定都只能包含单个表达式，所以下面的例子都不会生效。

```js
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

#### 3.2.3. Vue.js指令

指令 (Directives) 是带有 v- 前缀的特殊 attribute。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。

```
<p v-if="seen">现在你看到我了</p>
```

这里，v-if 指令将根据表达式 seen 的值的真假来插入/移除 <p> 元素。

##### 3.2.3.1. 参数

一些指令能够接收一个“参数”，在指令名称之后以冒号表示。例如，v-bind 指令可以用于响应式地更新 HTML attribute：

```
<a v-bind:href="url">...</a>
```

在这里 href 是参数，告知 v-bind 指令将该元素的 href attribute 与表达式 url 的值绑定。

另一个例子是 v-on 指令，它用于监听 DOM 事件：

```
<a v-on:click="doSomething">...</a>
```

##### 3.2.3.2. 动态参数

从 2.6.0 开始，可以用方括号括起来的 JavaScript 表达式作为一个指令的参数：

```js
<!--
注意，参数表达式的写法存在一些约束，如之后的“对动态参数表达式的约束”章节所述。
-->
<a v-bind:[attributeName]="url"> ... </a>
```

这里的 attributeName 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如，如果你的 Vue 实例有一个 data property attributeName，其值为 "href"，那么这个绑定将等价于 v-bind:href。

同样地，你可以使用动态参数为一个动态的事件名绑定处理函数：

```
<a v-on:[eventName]="doSomething"> ... </a>
```

在这个示例中，当 eventName 的值为 "focus" 时，v-on:[eventName] 将等价于 v-on:focus。

对动态参数的值的约束

动态参数预期会求出一个字符串，异常情况下值为 null。这个特殊的 null 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

对动态参数表达式的约束

动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。例如：

```js
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

##### 3.2.3.3. [修饰符](https://v2.cn.vuejs.org/v2/api/#v-on)

修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：

```
<form v-on:submit.prevent="onSubmit">...</form>
```

##### 3.2.3.4. 缩写

v- 前缀作为一种视觉提示，用来识别模板中 Vue 特定的 attribute。

- v-bind缩写

```js
<!-- 完整语法 --> 
<a v-bind:href="url">...</a> 

<!-- 缩写 -->
<a :href="url">...</a> 

<!-- 动态参数的缩写 (2.6.0+) --> 
<a :[key]="url"> ... </a>
```

- v-on缩写

```j s
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

##### 3.2.3.5. 自定义指令

除了核心功能默认内置的指令 ( v-model 和 v-show )，Vue 也允许注册自定义指令。在 Vue2.0 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。

Vue 自定义指令有全局注册和局部注册两种方式。全局注册指令的方式，通过 `Vue.directive( id, [definition] )` 方式注册全局指令。如果想注册局部指令，组件中也接受一个directives的选项。

```javascript
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 注册一个局部自定义指令 `v-focus`
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

然后我们可以在模板中任何元素上使用`v-focus` property，如下：

```javascript
<input v-focus>
```

当我们需要批量注册自定义指令时，写很多个``Vue.directive( id, [definition] ) 会导致代码冗余，所以我们可以利用Vue.use()` 的特性，完成批量注册。

批量注册指令，新建 `directives/directive.js` 文件

```javascript
// 导入指令定义文件
import debounce from './debounce'
import throttle from './throttle'
// 集成一起
const directives = {
  debounce,
  throttle,
}
//批量注册
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}
```

在 main.js 引入，并Vue.use() 调用完成批量注册。

```javascript
import Vue from 'vue'
import Directives from './directives/directive.js'
Vue.use(Directives)
```

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- bind: 只调用一次，指令第一次绑定到元素时调用，可以定义一个在绑定时执行一次的初始化动作，此时获取父节点为null。
- inserted: 被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中），此时可以获取到父节点。
- update: 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
- componentUpdated: 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind: 只调用一次， 指令与元素解绑时调用。

接下来我们来看一下钩子函数的参数 (即 el、binding、vnode 和 oldVnode)。

指令钩子函数会被传入以下参数：

- el：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含以下 property： 

- - name：指令名，不包括 v- 前缀。
  - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。

- vnode：Vue 编译生成的虚拟节点。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

###### 3.2.3.5.1. v-longpress

```javascript
// directive
const longpress = {
  bind: function (el, {value:{fn,time}}) {
    //没绑定函数直接返回
    if (typeof fn !== 'function') return
    // 定义定时器变量
    el._timer = null
    // 创建计时器（ n秒后执行函数 ）
    el._start = (e) => {
      //e.type表示触发的事件类型如mousedown,touchstart等
      //pc端: e.button表示是哪个键按下0为鼠标左键，1为中键，2为右键
      //移动端: e.touches表示同时按下的键为个数
      if (  (e.type === 'mousedown' && e.button && e.button !== 0) || 
            (e.type === 'touchstart' && e.touches && e.touches.length > 1)
      ) return;
      //定时长按n秒后执行事件
      if (el._timer === null) {
        el._timer = setTimeout(() => {
          fn()
        }, time)
        //取消浏览器默认事件，如右键弹窗
        el.addEventListener('contextmenu', function(e) {
          e.preventDefault();
        })
      }
    }
    // 如果两秒内松手，则取消计时器
    el._cancel = (e) => {
      if (el._timer !== null) {
        clearTimeout(el._timer)
        el._timer = null
      }
    }
    // 添加计时监听
    el.addEventListener('mousedown', el._start)
    el.addEventListener('touchstart', el._start)
    // 添加取消监听
    el.addEventListener('click', el._cancel)
    el.addEventListener('mouseout', el._cancel)
    el.addEventListener('touchend', el._cancel)
    el.addEventListener('touchcancel', el._cancel)
  },
  // 指令与元素解绑时，移除事件绑定
  unbind(el) {
    // 移除计时监听
    el.removeEventListener('mousedown', el._start)
    el.removeEventListener('touchstart', el._start)
    // 移除取消监听
    el.removeEventListener('click', el._cancel)
    el.removeEventListener('mouseout', el._cancel)
    el.removeEventListener('touchend', el._cancel)
    el.removeEventListener('touchcancel', el._cancel)
  },
}

export default longpress

// 引用
<template>
  <button v-longpress="{fn: longpress,time:2000}">长按</button>
</template>

<script>
export default {
  methods: {
    longpress () {
      console.log('长按指令生效')
    }
  }
}
</script>
```

###### 3.2.3.5.2. v-debounce

```javascript
const debounce = {
  inserted: function (el, {value:{fn, event, time}}) {
    //没绑定函数直接返回
    if (typeof fn !== 'function') return
    el._timer = null
    //监听点击事件，限定事件内如果再次点击则清空定时器并重新定时
    el.addEventListener(event, () => {
      if (el._timer !== null) {
        clearTimeout(el._timer)
        el._timer = null
      }
      el._timer = setTimeout(() => {
        fn()
      }, time)
    })
  },
}

export default debounce

// 引用
<template>
  <input v-debounce="{fn: debounce, event: 'input', time: 5000}" />
</template>

<script>
export default {
  methods: {
    debounce(){
      console.log('debounce 防抖')
    },
  }
}
</script>
```

###### 3.2.3.5.3. v-throttle

```javascript
const throttle = {
    bind:function (el,{value:{fn,time}}) {
        if (typeof fn !== 'function') return
        el._flag = true;//开关默认为开
        el._timer = null
        el.handler = function () {
            if (!el._flag) return;
            //执行之后开关关闭
            el._flag && fn()
            el._flag = false
            if (el._timer !== null) {
                clearTimeout(el._timer)
                el._timer = null
            }
            el._timer = setTimeout(() => {
                el._flag = true;//三秒后开关开启
            }, time);
        }
        el.addEventListener('click',el.handler)
    },
    unbind:function (el,binding) {
        el.removeEventListener('click',el.handler)
    }
}

export default throttle

// 引用
<template>
 <button v-throttle="{fn: throttle,time:3000}">throttle节流</button>
</template>

<script>
export default {
  methods: {
    throttle () {
      console.log('throttle 节流 只触发一次')
    }
  }
}
</script>
```

### 3.3. Vue.js生命周期

#### 3.3.1. 生命周期内容

| 生命周期      | 描述                               |
| ------------- | ---------------------------------- |
| beforeCreate  | 组件实例被创建之初                 |
| created       | 组件实例已经完全创建               |
| beforeMount   | 组件挂载之前                       |
| mounted       | 组件挂载到实例上去之后             |
| beforeUpdate  | 组件数据发生变化，更新之前         |
| updated       | 组件数据更新之后                   |
| beforeDestroy | 组件实例销毁之前                   |
| destroyed     | 组件实例销毁之后                   |
| activated     | keep-alive 缓存的组件激活时        |
| deactivated   | keep-alive 缓存的组件停用时调用    |
| errorCaptured | 捕获一个来自子孙组件的错误时被调用 |

#### 3.3.2. 生命周期功能

后续源码课程会讲解生命周期的实现

1. beforeCreate -> created

- - 初始化vue实例，进行数据观测

2. created

- - 完成数据观测，属性与方法的运算，watch、event事件回调的配置
  - 可调用methods中的方法，访问和修改data数据触发响应式渲染dom，可通过computed和watch完成数据计算
  - 此时vm.$el 并没有被创建

3. created -> beforeMount

- - 判断是否存在el选项，若不存在则停止编译，直到调用vm.$mount(el)才会继续编译
  - vm.el获取到的是挂载DOM的

4. beforeMount

- - 在此阶段可获取到vm.el
  - 此阶段vm.el虽已完成DOM初始化，但并未挂载在el选项上

5. beforeMount -> mounted

- - 此阶段vm.el完成挂载，vm.$el生成的DOM替换了el选项所对应的DOM

6. mounted

- - vm.el已完成DOM的挂载与渲染，此刻打印vm.$el，发现之前的挂载点及内容已被替换成新的DOM

7. beforeUpdate

- - 更新的数据必须是被渲染在模板上的（el、template、render之一）
  - 此时view层还未更新
  - 若在beforeUpdate中再次修改数据，不会再次触发更新方法

8. updated

- - 完成view层的更新
  - 若在updated中再次修改数据，会再次触发更新方法（beforeUpdate、updated）

9. beforeDestroy

- - 实例被销毁前调用，此时实例属性与方法仍可访问

10. destroyed

- - 完全销毁一个实例。可清理它与其它实例的连接，解绑它的全部指令及事件监听器
  - 并不能清除DOM，仅仅销毁实例

使用场景分析

| 生命周期      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | 执行时组件实例还未创建，通常用于插件开发中执行一些初始化任务 |
| created       | 组件初始化完毕，各种数据可以使用，常用于异步数据获取         |
| beforeMount   | 未执行渲染、更新，dom未创建                                  |
| mounted       | 初始化结束，dom已创建，可用于获取访问数据和dom元素           |
| beforeUpdate  | 更新前，可用于获取更新前各种状态                             |
| updated       | 更新后，所有状态已是最新                                     |
| beforeDestroy | 销毁前，可用于一些定时器或订阅的取消                         |
| destroyed     | 组件已销毁，作用同上                                         |

### 3.4. Vue.js computed 和 watch

#### 3.4.1. computed

```js
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

在这个地方，模板不再是简单的声明式逻辑。你必须看一段时间才能意识到，这里是想要显示变量 message 的翻转字符串。当你想要在模板中的多处包含此翻转字符串时，就会更加难以处理。

所以，对于任何复杂逻辑，你都应当使用计算属性。

```j s
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

结果：

- Original message: "Hello"
- Computed reversed message: "olleH"

##### 3.4.1.1. computed 和 method

你可能已经注意到我们可以通过在表达式中调用方法来达到同样的效果：

```js
<p>Reversed message: "{{ reversedMessage() }}"</p>
```

```js
// 在组件中
methods: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。

不同的是计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

这也同样意味着下面的计算属性将不再更新，因为 Date.now() 不是响应式依赖：

```js
computed: {
  now: function () {
    return Date.now()
  }
}
```

相比之下，每当触发重新渲染时，调用方法将总会再次执行函数。

我们为什么需要缓存？假设我们有一个性能开销比较大的计算属性 A，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 A。如果没有缓存，我们将不可避免的多次执行 A 的 getter！如果你不希望有缓存，请用方法来替代。

##### 3.4.1.2. computed vs watch

Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：侦听属性。当你有一些数据需要随着其它数据变动而变动时，你很容易滥用 watch。然而，通常更好的做法是使用计算属性而不是命令式的 watch 回调。细想一下这个例子：

```js
<div id="demo">{{ fullName }}</div>
```

```
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

上面代码是命令式且重复的。将它与计算属性的版本进行比较：

```js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

##### 3.4.1.3. computed的 setter

计算属性默认只有 getter，不过在需要时你也可以提供一个 setter：

```js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

现在再运行 `vm.fullName = 'John Doe'` 时，setter 会被调用，vm.firstName 和 vm.lastName 也会相应地被更新。

#### 3.4.2. watch

虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。

```j s
<div id="watch-example">
  <p>
    Ask a yes/no question:
  	<input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

```js
<!-- 因为 AJAX 库和通用工具的生态已经相当丰富，Vue 核心代码没有重复 -->
<!-- 提供这些功能以保持精简。这也可以让你自由选择自己更熟悉的工具。 -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
  
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer: function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Could not reach the API. ' + error
        })
    }
  }
})
  </script>
```

在这个示例中，使用 watch 选项允许我们执行异步操作 (访问一个 API)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

#### 3.4.3. 异同点

##### 3.4.3.1. 相同点

1. 基于vue的依赖收集机制；

2. 都是被依赖的变化触发，进行改变进而进行处理计算；

##### 3.4.3.2. 不同点

1. 入和出

computed：多入单出 —— 多个值变化，组成一个值的变化；

watch：单入多出 —— 单个值的变化，进而影响一系列的状态变更；

2. 性能

computed：会自动diff依赖，若依赖没有变化，会改从缓存中读取当前计算值；

watch：无论监听值变化与否，都会执行回调；

3. 写法上

computed: 必须有return返回值；

watch: 不一定；

4. 时机上

computed：从首次生成赋值，就开始计算运行了；

watch: 首次不会运行，除非——immediate：true；

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

https://www.yuque.com/lpldplws/web/xx3ygi?singleDoc# 《Vue2源码解析（2/2）》 密码：ya0n

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

双端比较就是新列表和旧列表两个列表的头与尾互相对比，在对比的过程中指针会逐渐向内靠拢，直到某一个列表的节点全部遍历过，对比停止；

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
const routerHistory = createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes: [ ... ]
}) import { createWebHistory, createRouter } from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes: [ ... ]
})
```

接下来就对着三种方法进行解析：

### 5.1 createWebHistory

`createWebHistory`源码所处位置：`src/history/html5.ts`
首先来看`createWebHistory`的参数，函数可以接受一个`base`字符串可选参数，该参数提供了一个基础路径。
在`createWebHistory`中首先会调用`normalizeBase`函数对传入的base进行标准化。

```js
base = normalizeBase(base)
```

来看下`base`标准化的过程：

```js
export function normalizeBase(base?: string): string {
  if (!base) {
      // 浏览其环境下尝试获取base标签的href属性
    if (isBrowser) {
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // 去除htttp(s)://xxx/，如https://example.com/folder/ --> /folder/
      base = base.replace(/^\w+:\/\/[^\/]+/, '')
    } else {
      base = '/'
    }
  }
  // 确保base的前导/
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base

  return removeTrailingSlash(base)
}
```

如果没有配置base的话，在浏览器环境下会尝试获取<base>标签的href属性作为base，如果没有<base>标签或<base>标签的href属性没有值，base取/，然后又对base进行了reaplce(/^\w+:\/\/[^\/]+/, '')操作，该操作是去除base的http(s)://xxx部分（如果base是https://example.com/floder/child，base最终会变成/floder/child）；非浏览器环境下，base直接取/。在最后会将base的末尾/去除，然后返回base，这样做的目的是后续我们可以通过base + fullPath的形式建立一个href。 base标准化后，会声明一个historyNavigation和historyListeners变量：

```js
const historyNavigation = useHistoryStateNavigation(base)
const historyListeners = useHistoryListeners(
  base,
  historyNavigation.state,
  historyNavigation.location,
  historyNavigation.replace
)
```

接下来看下`useHistoryStateNavigation()`、`useHistoryListeners()`的实现。

先看`useHistoryStateNavigation`：

```js
function useHistoryStateNavigation(base: string) {
  // 获取window.history、window.location
  const { history, location } = window

  const currentLocation: ValueContainer<HistoryLocation> = {
    value: createCurrentLocation(base, location),
  }
  const historyState: ValueContainer<StateEntry> = { value:  }
  // 如果history.state是空的，构建一条新的历史记录
  if (!historyState.value) {
    changeLocation(
      currentLocation.value,
      {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history.length - 1,
        replaced: true,
        scroll: null,
      },
      true
    )
  }
  // 修改历史记录
  function changeLocation(
    to: HistoryLocation,
    state: StateEntry,
    replace: boolean
  ): void {
    const hashIndex = base.indexOf('#')
    // 获取url，作为history.replaceState/pushState的参数
    // 如果hashIndex > -1，url = `{location.host && document.querySelector('base') ? base : base字符串#及后面字符}${to}`
    // 否则 url = `${location.protocol}//${location.host}${base}${to}`
    const url =
      hashIndex > -1
        ? (location.host && document.querySelector('base')
            ? base
            : base.slice(hashIndex)) + to
        : createBaseLocation() + base + to
    try {
      // 利用history.replaceState/pushState修改历史记录
      history[replace ? 'replaceState' : 'pushState'](state, '', url)
      // historyState更新为最新的历史记录
      historyState.value = state
    } catch (err) { // 如果历史记录修改过程中报错，则使用location.reaplce/assign导航到对应url
      if (__DEV__) {
        warn('Error with push/replace State', err)
      } else {
        console.error(err)
      }
      location[replace ? 'replace' : 'assign'](url)
    }
  }

  function replace(to: HistoryLocation, data?: HistoryState) {
    const state: StateEntry = assign(
      {},
      history.state,
      buildState(
        historyState.value.back,
        to,
        historyState.value.forward,
        true
      ),
      data,
      // 因为是replace操作，所以position不变
      { position: historyState.value.position }
    )

    changeLocation(to, state, true)
    // 修改当前历史为to
    currentLocation.value = to
  }

  function push(to: HistoryLocation, data?: HistoryState) {
    const currentState = assign(
      {},      historyState.value,
      history.state as Partial<StateEntry> | null,
      {
        forward: to,
        scroll: computeScrollPosition(),
      }
    )

    if (__DEV__ && !history.state) {
      warn(
        `history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
          `history.replaceState(history.state, '', url)\n\n` +
          `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`
      )
    }

    // 第一次changeLocation，使用replace刷新当前历史，目的是记录当前页面的滚动位置
    changeLocation(currentState.current, currentState, true)

    const state: StateEntry = assign(
      {},
      buildState(currentLocation.value, to, null),
      // push操作，历史记录的position+1
      { position: currentState.position + 1 },
      data
    )

    // 第二次跳转，跳转到需要跳转的位置
    changeLocation(to, state, false)
    currentLocation.value = to
  }

  return {
    location: currentLocation,
    state: historyState,

    push,
    replace,
  }
}
```

这个函数接收一个`base`参数，返回一个对象。这个对象中有四个属性：

1. `location`：一个包含`value`属性的对象，`value`值是`createCurrentLocation()`方法的返回值。那么这个`value`是什么呢？看下`createCurrentLocation`做了什么。

`createCurrentLocation`的作用是通过`window.location`创建一个规范化的`history location`，方法接收两个参数：经过标准化的`base`字符串和一个`window.location`对象。

```js
createCurrentLocation function createCurrentLocation(
  base: string,
  location: Location
): HistoryLocation {
  const { pathname, search, hash } = location
  // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
  // 从base中获取#的索引
  const hashPos = base.indexOf('#')
  // 如果base中包含#
  if (hashPos > -1) {
    // 如果hash包含base中的#后面部分，slicePos为base中#及后面字符串的的长度，否则为1
    let slicePos = hash.includes(base.slice(hashPos))
      ? base.slice(hashPos).length
      : 1
    // 从location.hash中获取path，/#add, #add
    let pathFromHash = hash.slice(slicePos)
    // 在开头加上/，形成/#的格式
    if (pathFromHash[0] !== '/') pathFromHash = '/' + pathFromHash
    // stripBase(pathname, base)：将pathname去除base部分
    return stripBase(pathFromHash, '')
  }
  // 如果base中不包含#，把pathname中的base部分删除
  const path = stripBase(pathname, base)
  return path + search + hash
}
```

可以看到`createCurrentLocation`其实就是获取`window.location`相对`base`的`location`。

举几个例子（以下几个例子的base都经过标准化）：

1. `window.location.pathname`为`/a/b/c`，`base`为`/a`，那么通过`createCurrentLocation`得到的`location`为`/b/c`；
2. 有`hash`的情况，`window.location.hash`为`#/a/b/c`，`base`为`#/a`，那么通过`createCurrentLocation`得到的`location为/b/c`；`window.location.hash`为`#/a/b/c`，`base`为`#`，那么通过`createCurrentLocation`得到的`location`为`/a/b/c`；
3. `state`：一个包含`value`属性的对象，`value`存储的是当前的`history.state`；
4. `push`：向历史记录中添加一条记录。在push过程中你会发现调用了两次`changeLocation`：第一次调用`changeLocation`时，目的是为了记录当前页面在的滚动位置，如果使用`history.back()`或浏览器回退/前进按钮回到这个页面，页面会滚动到对应位置，为了不再历史栈中保存新的记录，第一次记录使用的`reaplceState`替换当前历史记录。第二次调用`changeLocation`是会跳转到需要跳转的位置；
5. `reaplce`：替换当前历史记录；

接下来看下`useHistoryListeners`方法：

```js
function useHistoryListeners(
  base: string,
  historyState: ValueContainer<StateEntry>,
  currentLocation: ValueContainer<HistoryLocation>,
  replace: RouterHistory['replace']
) {
  let listeners: NavigationCallback[] = []
  let teardowns: Array<() => void> = []
  let pauseState: HistoryLocation | null = null

  const popStateHandler: PopStateListener = ({
    state,
  }: {
    state: StateEntry | null
  }) => {
    const to = createCurrentLocation(base, location)
    const from: HistoryLocation = currentLocation.value
    const fromState: StateEntry = historyState.value
    let delta = 0

    if (state) {
      currentLocation.value = to
      historyState.value = state

      // 如果暂停监听了，则直接return，同时pauseState赋为null
      if (pauseState && pauseState === from) {
        pauseState = null
        return
      }
      // 计算移动步数
      delta = fromState ? state.position - fromState.position : 0
    } else {
      replace(to)
    }
    // 执行监听函数列表
    listeners.forEach(listener => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta
          ? delta > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown,
      })
    })
  }

  function pauseListeners() {
    pauseState = currentLocation.value
  }

  function listen(callback: NavigationCallback) {
    listeners.push(callback)

    const teardown = () => {
      const index = listeners.indexOf(callback)
      if (index > -1) listeners.splice(index, 1)
    }

    teardowns.push(teardown)
    return teardown
  }

  function beforeUnloadListener() {
    const { history } = window
    if (!history.state) return
    // 当页面关闭时记录页面滚动位置
    history.replaceState(
      assign({}, history.state, { scroll: computeScrollPosition() }),
      ''
    )
  }

  function destroy() {
    for (const teardown of teardowns) teardown()
    teardowns = []
    window.removeEventListener('popstate', popStateHandler)
    window.removeEventListener('beforeunload', beforeUnloadListener)
  }

  window.addEventListener('popstate', popStateHandler)
  window.addEventListener('beforeunload', beforeUnloadListener)

  return {
    pauseListeners,
    listen,
    destroy,
  }
}
```

`useHistoryListeners`方法接收四个参数：

1. `base`（标准化的base）；
2. `historyState`；
3. `currentLocation`；
4. `replace`（后三个参数来自`useHistoryStateNavigation`的返回值）；

在`useHistoryListeners`中，会监听[popstate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event)、[beforeunload](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event)。

`useHistoryListeners`同样返回一个对象，该对象包含三个属性：

1. `pauseListeners`：一个暂停监听的函数；
2. `listen`：接收一个回调函数，并返回一个删除监听的函数。该回调函数会被加入`listeners`数组中，并向`teardowns`数组中添加卸载函数；
3. `destroy`：销毁函数，清空`listeners`与`teardowns`，移除`popstate`、`beforeunload`监听。

现在我们知道了`useHistoryStateNavigation`、`useHistoryListeners`的实现后。现在我们回到`createWebHistory`中，创建完`historyNavigation`、`historyListeners`之后，紧跟着声明一个`go`函数。该函数接收两个变量：`delta`历史记录移动的步数，`triggerListeners`是否触发监听：

```js
function go(delta: number, triggerListeners = true) {
  if (!triggerListeners) historyListeners.pauseListeners()
  history.go(delta)
}
```

最后创建一个routerHistory对象，并将其返回

```js
const routerHistory: RouterHistory = assign(
  {
    location: '',
    base,
    go,
    createHref: createHref.bind(null, base),
  },
  historyNavigation,
  historyListeners
)

// 拦截routerHistory.location，使routerHistory.location返回当前路由地址
Object.defineProperty(routerHistory, 'location', {
  enumerable: true,
  get: () => historyNavigation.location.value,
})

// 拦截routerHistory.state，使routerHistory.state返回当前的的history.state
Object.defineProperty(routerHistory, 'state', {
  enumerable: true,
  get: () => historyNavigation.state.value,
})

return routerHistory
```

### 5.2 createWebHashHistory

`createWebHashHistory`利用`createWebHashHistory`实现。

```js
export function createWebHashHistory(base?: string): RouterHistory {
  // 对于使用文件协议打开的页面location.host是空字符串，这时的base为''
  // 也就是说在使用文件协议打开页面时，设置了base是不生效的，因为base始终是''
  base = location.host ? base || location.pathname + location.search : ''
  // 允许中间的#: `/base/#/app`
  if (!base.includes('#')) base += '#'

  if (__DEV__ && !base.endsWith('#/') && !base.endsWith('#')) {
    warn(
      `A hash base must end with a "#":\n"${base}" should be "${base.replace(
        /#.*$/,
        '#'
      )}".`
    )
  }
  return createWebHistory(base)
}
```

### 5.3 createMemoryHistory

`createMemoryHistory`会创建一个基于内存历史记录，主要用来处理`SSR`。

```js
export function createMemoryHistory(base: string = ''): RouterHistory {
  // 用户存储监听函数的数组
  let listeners: NavigationCallback[] = []
  // 使用一个队列维护历史记录
  let queue: HistoryLocation[] = [START]
  // 当前历史记录在队列中的位置
  let position: number = 0
  // base标准化
  base = normalizeBase(base)

  // 设置记录
  function setLocation(location: HistoryLocation) {
    position++
    // 队列长度等于position时，直接push
    if (position === queue.length) {
      queue.push(location)
    } else {
      // 当历史记录在队列中的非末尾位置时，删除position及之后的记录，然后再push
      // 如果某一刻处在非结尾的历史记录时，这时要进行push或reqlace操作，此时position之后的记录就会失效
      queue.splice(position)
      queue.push(location)
    }
  }

  // 触发监听
  function triggerListeners(
    to: HistoryLocation,
    from: HistoryLocation,
    { direction, delta }: Pick<NavigationInformation, 'direction' | 'delta'>
  ): void {
    const info: NavigationInformation = {
      direction,
      delta,
      type: NavigationType.pop,
    }
    for (const callback of listeners) {
      callback(to, from, info)
    }
  }

  const routerHistory: RouterHistory = {
    location: START,
    state: {},
    base,
    createHref: createHref.bind(null, base),

    replace(to) {
      // 移除queue中索引为position的记录，并将position--
      queue.splice(position--, 1)
      // 在setLocation会对position重新++操作，所以position会恢复要之前的值
      setLocation(to)
    },

    push(to, data?: HistoryState) {
      setLocation(to)
    },

    listen(callback) {
      listeners.push(callback)
      return () => {
        const index = listeners.indexOf(callback)
        if (index > -1) listeners.splice(index, 1)
      }
    },
    destroy() {
      listeners = []
      queue = [START]
      position = 0
    },

    go(delta, shouldTrigger = true) {
      const from = this.location
      // go的方向。delta < 0 为 back，相反为 forward
      const direction: NavigationDirection =
        delta < 0 ? NavigationDirection.back : NavigationDirection.forward
      // go之后所处的position：Math.min(position + delta, queue.length - 1)保证了position<=queue.length - 1, 如果position + delta超出了数组最大索引，就取最大索引
      // Math.max(0, Math.min(position + delta, queue.length - 1))进一步保证了position>=0，如果position + delta < 0, 则取0
      position = Math.max(0, Math.min(position + delta, queue.length - 1))
      // 根据shouldTrigger决定是否触发监听函数
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta,
        })
      }
    },
  }

  Object.defineProperty(routerHistory, 'location', {
    enumerable: true,
    get: () => queue[position],
  })

  if (__TEST__) {
    routerHistory.changeURL = function (url: string) {
      const from = this.location
      queue.splice(position++ + 1, queue.length, url)
      triggerListeners(this.location, from, {
        direction: NavigationDirection.unknown,
        delta: 0,
      })
    }
  }

  return routerHistory
}
```

和`createWebHistory`、`createWebHashHistory`一样，`createMemoryHistory`同样返回一个`RouterHistory`类型的对象。与前面两个方法不同的是，`createMemoryHistory`维护一个队列`queue`和一个`position`，来保证历史记录存储的正确性。

## 6 matcher解析

### 6.1 matcher初识

在开始介绍`matcher`的实现之前，我们先了解下`matcher`是什么？它的作用是什么？
在`vue-router`中，每一个我们定义的路由都会被解析成一个对应的`matcher`（`RouteRecordMatcher`类型），路由的增删改查都会依靠`matcher`来实现。

### 6.2. createRouterMatcher

在`createRouter`中会通过`createRouterMatcher`创建一个`matcher`（`RouterMatcher`类型）。

```js
export function createRouterMatcher(
  routes: RouteRecordRaw[],
  globalOptions: PathParserOptions
): RouterMatcher {
  const matchers: RouteRecordMatcher[] = []
  const matcherMap = new Map<RouteRecordName, RouteRecordMatcher>()
  globalOptions = mergeOptions(
    { strict: false, end: true, sensitive: false } as PathParserOptions,
    globalOptions
  )

  function getRecordMatcher(name: RouteRecordName) { // ... }

  function addRoute(
    record: RouteRecordRaw,
    parent?: RouteRecordMatcher,
    originalRecord?: RouteRecordMatcher
  ) {
    // ...
  }

  function removeRoute(matcherRef: RouteRecordName | RouteRecordMatcher) { // ... }

  function getRoutes() { // ... }

  function insertMatcher(matcher: RouteRecordMatcher) { // ... }

  function resolve(
    location: Readonly<MatcherLocationRaw>,
    currentLocation: Readonly<MatcherLocation>
  ): MatcherLocation {
    // ...
  }

  routes.forEach(route => addRoute(route))

  return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher }
}
```

`createRouterMatcher`接收两个参数：`routes`、`globalOptions`。

其中`routes`为我们定义的路由表，也就是在`createRouter`时传入的`options.routes`，而`globalOptions`就是`createRouter`中的`options`。
`createRouterMatcher`中声明了两个变量`matchers`、`matcherMap`，用来存储通过路由表解析的`matcher`（`RouteRecordMatcher`类型），然后遍历`routes`，对每个元素调用`addRoute`方法。最后返回一个对象，该对象有`addRoute`、`resolve`、`removeRoute`、`getRoute`、`getRecordMatcher`几个属性，这几个属性都对应着一个函数。
接下来我们看下这几个函数：

#### 6.2.1 addRoute

addRoute函数接收三个参数：record（新增的路由）、parent（父matcher）、originalRecord（原始matcher）。

```js
function addRoute(
  record: RouteRecordRaw,
  parent?: RouteRecordMatcher,
  originalRecord?: RouteRecordMatcher
) {
  // used later on to remove by name
  const isRootAdd = !originalRecord
  // 标准化化路由记录
  const mainNormalizedRecord = normalizeRouteRecord(record)
  // aliasOf表示此记录是否是另一个记录的别名
  mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record
  const options: PathParserOptions = mergeOptions(globalOptions, record)
  // 声明一个记录的数组用来处理别名
  const normalizedRecords: typeof mainNormalizedRecord[] = [
    mainNormalizedRecord,
  ]
  // 如果record设置了别名
  if ('alias' in record) {
    // 别名数组
    const aliases =
      typeof record.alias === 'string' ? [record.alias] : record.alias!
    // 遍历别名数组，并根据别名创建记录存储到normalizedRecords中
    for (const alias of aliases) {
      normalizedRecords.push(
        assign({}, mainNormalizedRecord, {
          components: originalRecord
            ? originalRecord.record.components
            : mainNormalizedRecord.components,
          path: alias,
          // 如果有原始记录，aliasOf为原始记录，如果没有原始记录就是它自己
          aliasOf: originalRecord
            ? originalRecord.record
            : mainNormalizedRecord,
        }) as typeof mainNormalizedRecord
      )
    }
  }

  let matcher: RouteRecordMatcher
  let originalMatcher: RouteRecordMatcher | undefined

  // 遍历normalizedRecords
  for (const normalizedRecord of normalizedRecords) {
    
    // 处理normalizedRecord.path为完整的path
    const { path } = normalizedRecord
    // 如果path不是以/开头，那么说明它不是根路由，需要拼接为完整的path
    // { path: '/a', children: [ { path: 'b' } ] } -> { path: '/a', children: [ { path: '/a/b' } ] }
    if (parent && path[0] !== '/') {
      const parentPath = parent.record.path
      const connectingSlash =
        parentPath[parentPath.length - 1] === '/' ? '' : '/'
      normalizedRecord.path =
        parent.record.path + (path && connectingSlash + path)
    }

    // 提示*应使用正则表示式形式
    if (__DEV__ && normalizedRecord.path === '*') {
      throw new Error(
        'Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
          'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.'
      )
    }

    // 创建一个路由记录匹配器
    matcher = createRouteRecordMatcher(normalizedRecord, parent, options)

    // 检查是否有丢失的参数
    if (__DEV__ && parent && path[0] === '/')
      checkMissingParamsInAbsolutePath(matcher, parent)

    // 如果有originalRecord，将matcher放入原始记录的alias中，以便后续能够删除
    if (originalRecord) {
      originalRecord.alias.push(matcher)
      // 检查originalRecord与matcher中动态参数是否相同
      if (__DEV__) {
        checkSameParams(originalRecord, matcher)
      }
    } else { // 没有originalRecord
      // 因为原始记录索引为0，所以originalMatcher为有原始记录所产生的matcher
      originalMatcher = originalMatcher || matcher
      // 如果matcher不是原始记录产生的matcher，说明此时matcher是由别名记录产生的，此时将matcher放入originalMatcher.alias中
      if (originalMatcher !== matcher) originalMatcher.alias.push(matcher)
      // 如果命名并且仅用于顶部记录，则删除路由（避免嵌套调用）
      if (isRootAdd && record.name && !isAliasRecord(matcher))
        removeRoute(record.name)
    }

    // 遍历children，递归addRoute
    if ('children' in mainNormalizedRecord) {
      const children = mainNormalizedRecord.children
      for (let i = 0; i < children.length; i++) {
        addRoute(
          children[i],
          matcher,
          originalRecord && originalRecord.children[i]
        )
      }
    }

    originalRecord = originalRecord || matcher
    // 添加matcher
    insertMatcher(matcher)
  }

  // 返回一个删除原始matcher的方法
  return originalMatcher
    ? () => {
        removeRoute(originalMatcher!)
      }
    : noop
}
```

在`addRoute`中，会对`record`进行标准化处理（`normalizeRouteRecord`），如果存在原始的`matcher`，也就是`originalRecord`，说明此时要添加的路由是另一记录的别名，这时会将`originalRecord.record`存入`mainNormalizedRecord.aliasOf`中。

```js
const isRootAdd = !originalRecord
// 标准化化路由记录
const mainNormalizedRecord = normalizeRouteRecord(record)
// aliasOf表示此记录是否是另一个记录的别名
mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record
const options: PathParserOptions = mergeOptions(globalOptions, record)
// 声明一个记录的数组用来处理别名
const normalizedRecords: typeof mainNormalizedRecord[] = [
  mainNormalizedRecord,
]
```

然后会遍历`record`的别名，向`normalizedRecords`中添加由别名产生的路由：

```js
if ('alias' in record) {
  // 别名数组
  const aliases =
    typeof record.alias === 'string' ? [record.alias] : record.alias!
  // 遍历别名数组，并根据别名创建记录存储到normalizedRecords中
  for (const alias of aliases) {
    normalizedRecords.push(
      assign({}, mainNormalizedRecord, {
        components: originalRecord
          ? originalRecord.record.components
          : mainNormalizedRecord.components,
        path: alias,
        // 如果有原始记录，aliasOf为原始记录，如果没有原始记录就是它自己
        aliasOf: originalRecord
          ? originalRecord.record
          : mainNormalizedRecord,
      }) as typeof mainNormalizedRecord
    )
  }
}
```

紧接着会遍历normalizedRecords：在这个遍历过程中，会首先将path处理成完整的path，然后通过createRouteRecordMatcher方法创建一个matcher（RouteRecordMatcher类型），如果matcher是由别名产生的，那么matcher会被加入由原始记录产生的matcher中的alias属性中。然后会遍历mainNormalizedRecord的children属性，递归调用addRoute方法。在最后，调用insertMatcher添加新创建的matcher。

```js
for (const normalizedRecord of normalizedRecords) {
  
  // 处理normalizedRecord.path为完整的path
  const { path } = normalizedRecord
  // 如果path不是以/开头，那么说明它不是根路由，需要拼接为完整的path
  // { path: '/a', children: [ { path: 'b' } ] } -> { path: '/a', children: [ { path: '/a/b' } ] }
  if (parent && path[0] !== '/') {
    const parentPath = parent.record.path
    const connectingSlash =
      parentPath[parentPath.length - 1] === '/' ? '' : '/'
    normalizedRecord.path =
      parent.record.path + (path && connectingSlash + path)
  }

  // 提示*应使用正则表示式形式
  if (__DEV__ && normalizedRecord.path === '*') {
    throw new Error(
      'Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
        'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.'
    )
  }

  // 创建一个路由记录匹配器
  matcher = createRouteRecordMatcher(normalizedRecord, parent, options)

  // 检查是否有丢失的参数
  if (__DEV__ && parent && path[0] === '/')
    checkMissingParamsInAbsolutePath(matcher, parent)

  // 如果有originalRecord，将matcher放入原始记录的alias中，以便后续能够删除
  if (originalRecord) {
    originalRecord.alias.push(matcher)
    // 检查originalRecord与matcher中动态参数是否相同
    if (__DEV__) {
      checkSameParams(originalRecord, matcher)
    }
  } else { // 没有originalRecord
    // 因为原始记录索引为0，所以originalMatcher为有原始记录所产生的matcher
    originalMatcher = originalMatcher || matcher
    // 如果matcher不是原始记录产生的matcher，说明此时matcher是由别名记录产生的，此时将matcher放入originalMatcher.alias中
    if (originalMatcher !== matcher) originalMatcher.alias.push(matcher)
    // 如果存在record.name并且是顶部记录，则删除路由（避免嵌套调用）
    if (isRootAdd && record.name && !isAliasRecord(matcher))
      removeRoute(record.name)
  }

  // 遍历children，递归addRoute
  if ('children' in mainNormalizedRecord) {
    const children = mainNormalizedRecord.children
    for (let i = 0; i < children.length; i++) {
      addRoute(
        children[i],
        matcher,
        originalRecord && originalRecord.children[i]
      )
    }
  }
  // 如果originalRecord是方法传入的，那么originalRecord继续保持
  // 如果originalRecord方法未传入。由于原始的matcher总是在索引为0的位置，所以如果有别名，那么这些别名的原始matcher会始终指向索引为0的位置
  originalRecord = originalRecord || matcher
  // 添加matcher
  insertMatcher(matcher)
}
```

在最后，`addRoute`会返回一个删除原始`matcher`的方法。

在`addRoute`的过程中，会调用`createRouteRecordMatcher`方法来创建`matcher`，那么`matcher`究竟是什么？它是如何被创建的？接下来我们看下`createRouteRecordMatcher`的实现。那么在看`createRouteRecordMatcher`之前，我们先来了解`tokenizePath`、`tokensToParser`这两个函数，因为这两个函数是创建`matcher`的核心。
`tokenizePath`的作用是将`path`转为一个`token`数组。而`tokensToParser`会根据`token`数组创建一个路径解析器。这里提到了一个`token`的概念，那么什么是`token`呢？我们看下`vue-router`中`token`的类型定义：

```js
interface TokenStatic {
  type: TokenType.Static
  value: string
}

interface TokenParam {
  type: TokenType.Param
  regexp?: string
  value: string
  optional: boolean
  repeatable: boolean
}

interface TokenGroup {
  type: TokenType.Group
  value: Exclude<Token, TokenGroup>[]
}

export type Token = TokenStatic | TokenParam | TokenGroup
```

从其类型中我们可以看出token分为三种：

1. `TokenStatic`：一种静态的`token`，说明`token`不可变；
2. `TokenParam`：参数`token`，说明`token`是个参数；
3. `TokenGroup`：分组的`token`；

为了更好理解`token`，这里我们举几个例子：

1. `/one/two/three`对应的`token`数组：

```js
[
  [{ type: TokenType.Static, value: 'one' }],
  [{ type: TokenType.Static, value: 'two' }],
  [{ type: TokenType.Static, value: 'three' }]
]
```

2. `/user/:id`对应的`token`数组是：

```js
[
  [
   {
     type: TokenType.Static,
     value: 'user',
   },
  ],
  [
   {
     type: TokenType.Param,
     value: 'id',
     regexp: '',
     repeatable: false,
     optional: false,
   }
  ]
]
```

3. /:id(\\d+)new对应的token数组：

   ```js
   [
     [
    {
      type: TokenType.Param,
      value: 'id',
      regexp: '\\d+',
      repeatable: false,
      optional: false,
    },
    {
      type: TokenType.Static,
      value: 'new'
    }
     ]
   ]
   ```

从上面几个例子可以看出，`token`数组详细描述了`path`的每一级路由的组成。例如第3个例子`/:id(\\d+)new`，通过`token`数组我们能够知道他是一个一级路由`（token.lenght = 1）`，并且它的这级路由是由两部分组成，其中第一部分是参数部分，第二部分是静态的，并且在参数部分还说明了参数的正则及是否重复、是否可选的配置。

接下来我们看下`tokenizePath`是如何将`path`转为`token`的：

##### 6.2.1.1. tokenizePath

`tokenizePath`的过程就是利用[有限状态自动机](https://zh.wikipedia.org/wiki/有限状态机)生成token数组。

```js
export const enum TokenType {
  Static,
  Param,
  Group,
}

const ROOT_TOKEN: Token = {
  type: TokenType.Static,
  value: '',
}

export function tokenizePath(path: string): Array<Token[]> {
  if (!path) return [[]]
  if (path === '/') return [[ROOT_TOKEN]]
  // 如果path不是以/开头，抛出错误
  if (!path.startsWith('/')) {
    throw new Error(
      __DEV__
        ? `Route paths should start with a "/": "${path}" should be "/${path}".`
        : `Invalid path "${path}"`
    )
  }
  
  function crash(message: string) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`)
  }

  // token所处状态
  let state: TokenizerState = TokenizerState.Static
  // 前一个状态
  let previousState: TokenizerState = state
  const tokens: Array<Token[]> = []
  //  声明一个片段，该片段最终会被存入tokens中
  let segment!: Token[]

  // 添加segment至tokens中，同时segment重新变为空数组
  function finalizeSegment() {
    if (segment) tokens.push(segment)
    segment = []
  }

  let i = 0
  let char: string
  let buffer: string = ''
  // custom regexp for a param
  let customRe: string = ''

  // 消费buffer，即生成token添加到segment中
  function consumeBuffer() {
    if (!buffer) return

    if (state === TokenizerState.Static) {
      segment.push({
        type: TokenType.Static,
        value: buffer,
      })
    } else if (
      state === TokenizerState.Param ||
      state === TokenizerState.ParamRegExp ||
      state === TokenizerState.ParamRegExpEnd
    ) {
      if (segment.length > 1 && (char === '*' || char === '+'))
        crash(
          `A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`
        )
      segment.push({
        type: TokenType.Param,
        value: buffer,
        regexp: customRe,
        repeatable: char === '*' || char === '+',
        optional: char === '*' || char === '?',
      })
    } else {
      crash('Invalid state to consume buffer')
    }
    // 消费完后置空
    buffer = ''
  }

  function addCharToBuffer() {
    buffer += char
  }

  // 遍历path
  while (i < path.length) {
    char = path[i++]

    // path='/\\:'
    if (char === '\\' && state !== TokenizerState.ParamRegExp) {
      previousState = state
      state = TokenizerState.EscapeNext
      continue
    }

    switch (state) {
      case TokenizerState.Static:
        if (char === '/') {
          if (buffer) {
            consumeBuffer()
          }
          // char === /时说明已经遍历完一层路由，这时需要将segment添加到tokens中
          finalizeSegment()
        } else if (char === ':') { // char为:时，因为此时状态是TokenizerState.Static，所以:后是参数，此时要把state变为TokenizerState.Param
          consumeBuffer()
          state = TokenizerState.Param
        } else { // 其他情况拼接buffer
          addCharToBuffer()
        }
        break

      case TokenizerState.EscapeNext:
        addCharToBuffer()
        state = previousState
        break

      case TokenizerState.Param:
        if (char === '(') { // 碰到(，因为此时state为TokenizerState.Param，说明后面是正则表达式，所以修改state为TokenizerState.ParamRegExp
          state = TokenizerState.ParamRegExp
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer()
        } else { // 例如/:id/one，当遍历到第二个/时，消费buffer，state变为Static，并让i回退，回退后进入Static
          consumeBuffer()
          state = TokenizerState.Static
          if (char !== '*' && char !== '?' && char !== '+') i--
        }
        break

      case TokenizerState.ParamRegExp: 
        // it already works by escaping the closing )
        // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
        // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
        // is this really something people need since you can also write
        // /prefix_:p()_suffix
        if (char === ')') {
          // 如果是\\)的情况,customRe = customRe去掉\\ + char
          if (customRe[customRe.length - 1] == '\\')
            customRe = customRe.slice(0, -1) + char
          else state = TokenizerState.ParamRegExpEnd // 如果不是\\)说明正则表达式已经遍历完
        } else {
          customRe += char
        }
        break

      case TokenizerState.ParamRegExpEnd: // 正则表达式已经遍历完
        // 消费buffer
        consumeBuffer()
        // 重置state为Static
        state = TokenizerState.Static
        // 例如/:id(\\d+)new，当遍历到n时，使i回退，下一次进入Static分支中处理
        if (char !== '*' && char !== '?' && char !== '+') i--
        customRe = ''
        break

      default:
        crash('Unknown state')
        break
    }
  }

  // 如果遍历结束后，state还是ParamRegExp状态，说明正则是没有结束的，可能漏了)
  if (state === TokenizerState.ParamRegExp)
    crash(`Unfinished custom RegExp for param "${buffer}"`)

  // 遍历完path，进行最后一次消费buffer
  consumeBuffer()
  // 将segment放入tokens
  finalizeSegment()

  // 最后返回tokens
  return tokens
}
```

为了更好理解`tokenizePath`的过程。我们以`path = '/:id(\\d+)new'`例，我们看一下`tokenizePath`的过程：

1. 初始状态：

```js
state=TokenizerState.Static;
previousState=TokenizerState.Static;
tokens=[];
segment;
buffer='';
i=0;
char='';
customRe='';
```

2. 当`i=0`时，进入`TokenizerState.Static`分支，此时`char='/'`; `buffer='';`，不会执行`consumeBuffer`，执行`finalizeSegment`，该轮结束后发生变化的是：

```js
segment=[];
i=1;
char='/';
```

3. 当`i=1`时，进入`TokenizerState.Static`分支，此时`char=':';` `buffer='';`，执行`consumeBuffer`，因为`buffer=''`，所以`consumeBuffer`中什么都没做，最后`state=TokenizerState.Param`，该轮结束后发生变化的是：

```js
state=TokenizerState.Param;
i=2;
char=':';
```

4. 当i=2时，进入TokenizerState.Param分支，此时char='i'; buffer='';，执行addCharToBuffer，该轮结束后发生变化的是：

```js
buffer='i';
i=3;
char='i';
```

5. 当`i=3`时，过程同4，该轮结束后发生变化的是：

```js
buffer='id';
i=4;
char='d';
```

6. 当`i=4`时，进入`TokenizerState.Param`分支，此时`char='('`; `buffer='id';`，此时会将state变为`TokenizerState.ParamRegExp`，说明(后面是正则，该轮结束后发生变化的是：

```js
state=TokenizerState.ParamRegExp;
i=5;
char='(';
```

7. 当i=5时，进入TokenizerState.ParamRegExp分支，此时char='\\'; buffer='id';，执行customRe+=char，该轮结束后发生变化的是：

```js
char='\\';
i=6;
customRe='\\'
```

8. 当i=6、i=7时，过程同5，最终发生变化的是：

```js
i=8;
char='+';
customRe='\\d+'
```

9. 当i=8时，进入TokenizerState.ParamRegExp分支，此时char=')'; buffer='id'; customRe='\\d+'，state变为TokenizerState.ParamRegExpEnd，代表正则结束，该轮结束后发生变化的是：

```js
state=TokenizerState.ParamRegExpEnd;
i=9;
char=')';
```

10. 当i=9时，进入TokenizerState.ParamRegExpEnd分支，此时char='n'; buffer='id'; customRe='\\d+'，执行consumeBuffer，在consumeBuffer中会向segment添加一条token并将buffer置为空字符串，该token是{type: TokenType.Param, value: 'id', regexp: '\\d+', repeatable: false, optional: false}，执行完consumeBuffer后，state重置为Static，customRe重置为空字符串，i回退1，该轮结束后发生变化的是segment=[{...}]; 

```js
state=TokenizerState.ParamRegExpEnd;
i=9; // 注意此时i=9
char=')';
state=TokenizerState.Static;
buffer='';
customRe='';
char='n';，
```

11. 上一轮结束后i=9，进入TokenizerState.Static分支，此时此时char='n'; buffer='';，执行addCharToBuffer方法，该轮结束后发生变化的是：

```js
buffer='n';
i=10;
char='n'
```

12. 当i=10、i=11时，过程同11，结束后发生变化的是:

```js
buffer='new';
i=12;
char='w'
```
13. 当i=12，结束遍历，执行consumeBuffer，向segment添加{type: TokenType.Static, value: 'new'}一条记录并将buffer置为空字符串。然后执行finalizeSegment，将segment添加到tokens中，并将segment置为空数组。最后返回的tokens如下：

```js
[
  [
 {
   type: TokenType.Param,
   value: 'id',
   regexp: '\\d+',
   repeatable: false,
   optional: false,
 },
 {
   type: TokenType.Static,
   value: 'new'
 }
  ]
]
```
状态转移过程图示：

<img src="/Volumes/F/zyl-study/web-zhuawa/20221203/vue3-状态转移过程.png" alt="vue3-状态转移过程" style="zoom:67%;" />

##### 6.2.1.2 tokensToParser

tokensToParser函数接收一个token数组和一个可选的extraOptions，在函数中会构造出path对应的正则表达式、动态参数列表keys、token对应的分数（相当于权重，该分数在后续path的比较中会用到）、一个可以从path中提取动态参数的函数（parse）、一个可以根据传入的动态参数生成path的函数（stringify），最后将其组成一个对象返回：

```js
const enum PathScore {
  _multiplier = 10,
  Root = 9 * _multiplier, // 只有一个/时的分数
  Segment = 4 * _multiplier, // segment的基础分数
  SubSegment = 3 * _multiplier, // /multiple-:things-in-one-:segment
  Static = 4 * _multiplier, // type=TokenType.Static时的分数
  Dynamic = 2 * _multiplier, // 动态参数分数 /:someId
  BonusCustomRegExp = 1 * _multiplier, // 用户自定义正则的分数 /:someId(\\d+) 
  BonusWildcard = -4 * _multiplier - BonusCustomRegExp, // /:namedWildcard(.*) we remove the bonus added by the custom regexp
  BonusRepeatable = -2 * _multiplier, // 当正则是可重复时的分数 /:w+ or /:w*
  BonusOptional = -0.8 * _multiplier, // 当正则是可选择时的分数 /:w? or /:w*
  // these two have to be under 0.1 so a strict /:page is still lower than /:a-:b
  BonusStrict = 0.07 * _multiplier, // options.strict: true时的分数
  BonusCaseSensitive = 0.025 * _multiplier, // options.strict:true时的分数
}
const BASE_PATH_PARSER_OPTIONS: Required<_PathParserOptions> = {
  sensitive: false,
  strict: false,
  start: true,
  end: true,
}
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g
export function tokensToParser(
  segments: Array<Token[]>,
  extraOptions?: _PathParserOptions
): PathParser {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions)

  // 除了根段“/”之外，分数的数量与segments的长度相同
  const score: Array<number[]> = []
  // 正则的字符串形式
  let pattern = options.start ? '^' : ''
  // 保存路由中的动态参数
  const keys: PathParserParamKey[] = []

  for (const segment of segments) {
    // 用一个数组保存token的分数，如果segment.length为0，使用PathScore.Root
    const segmentScores: number[] = segment.length ? [] : [PathScore.Root]

    // options.strict代表是否禁止尾部/，如果禁止了pattern追加/
    if (options.strict && !segment.length) pattern += '/'
    // 开始遍历每个token
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex]
      // 当前子片段（单个token）的分数：基础分数+区分大小写 ? PathScore.BonusCaseSensitive : 0
      let subSegmentScore: number =
        PathScore.Segment +
        (options.sensitive ? PathScore.BonusCaseSensitive : 0)

      if (token.type === TokenType.Static) {
        // 在开始一个新的片段（tokenIndex !== 0）前pattern需要添加/
        if (!tokenIndex) pattern += '/'
        // 将token.value追加到pattern后。追加前token.value中的.、+、*、?、^、$等字符前面加上\\
        // 关于replace，参考MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
        pattern += token.value.replace(REGEX_CHARS_RE, '\\$&')
        subSegmentScore += PathScore.Static
      } else if (token.type === TokenType.Param) {
        const { value, repeatable, optional, regexp } = token
        // 添加参数
        keys.push({
          name: value,
          repeatable,
          optional,
        })
        const re = regexp ? regexp : BASE_PARAM_PATTERN
        // 用户自定义的正则需要验证正则的正确性
        if (re !== BASE_PARAM_PATTERN) {
          subSegmentScore += PathScore.BonusCustomRegExp
          // 使用前确保正则是正确的
          try {
            new RegExp(`(${re})`)
          } catch (err) {
            throw new Error(
              `Invalid custom RegExp for param "${value}" (${re}): ` +
                (err as Error).message
            )
          }
        }

        // /:chapters*
        // 如果是重复的，必须注意重复的前导斜杠
        let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`

        // prepend the slash if we are starting a new segment
        if (!tokenIndex)
          subPattern =
            // avoid an optional / if there are more segments e.g. /:p?-static
            // or /:p?-:p2
            optional && segment.length < 2
              ? `(?:/${subPattern})`
              : '/' + subPattern
        if (optional) subPattern += '?'

        pattern += subPattern

        subSegmentScore += PathScore.Dynamic
        if (optional) subSegmentScore += PathScore.BonusOptional
        if (repeatable) subSegmentScore += PathScore.BonusRepeatable
        if (re === '.*') subSegmentScore += PathScore.BonusWildcard
      }

      segmentScores.push(subSegmentScore)
    }

    score.push(segmentScores)
  }

  // only apply the strict bonus to the last score
  if (options.strict && options.end) {
    const i = score.length - 1
    score[i][score[i].length - 1] += PathScore.BonusStrict
  }

  // TODO: dev only warn double trailing slash
  if (!options.strict) pattern += '/?'

  if (options.end) pattern += '$'
  // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
  else if (options.strict) pattern += '(?:/|$)'

  // 根据组装好的pattern创建正则表达式，options.sensitive决定是否区分大小写
  const re = new RegExp(pattern, options.sensitive ? '' : 'i')

  // 根据path获取动态参数对象
  function parse(path: string): PathParams | null {
    const match = path.match(re)
    const params: PathParams = {}

    if (!match) return null

    for (let i = 1; i < match.length; i++) {
      const value: string = match[i] || ''
      const key = keys[i - 1]
      params[key.name] = value && key.repeatable ? value.split('/') : value
    }

    return params
  }

  // 根据传入的动态参数对象，转为对应的path
  function stringify(params: PathParams): string {
    let path = ''
    // for optional parameters to allow to be empty
    let avoidDuplicatedSlash: boolean = false
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith('/')) path += '/'
      avoidDuplicatedSlash = false

      for (const token of segment) {
        if (token.type === TokenType.Static) {
          path += token.value
        } else if (token.type === TokenType.Param) {
          const { value, repeatable, optional } = token
          const param: string | string[] = value in params ? params[value] : ''

          if (Array.isArray(param) && !repeatable)
            throw new Error(
              `Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`
            )
          const text: string = Array.isArray(param) ? param.join('/') : param
          if (!text) {
            if (optional) {
              // if we have more than one optional param like /:a?-static and there are more segments, we don't need to
              // care about the optional param
              if (segment.length < 2 && segments.length > 1) {
                // remove the last slash as we could be at the end
                if (path.endsWith('/')) path = path.slice(0, -1)
                // do not append a slash on the next iteration
                else avoidDuplicatedSlash = true
              }
            } else throw new Error(`Missing required param "${value}"`)
          }
          path += text
        }
      }
    }

    return path
  }

  return {
    re,
    score,
    keys,
    parse,
    stringify,
  }
}
```
然后我们来看createRouteRecordMatcher的实现

```js
export function createRouteRecordMatcher(
  record: Readonly<RouteRecord>,
  parent: RouteRecordMatcher | undefined,
  options?: PathParserOptions
): RouteRecordMatcher {
  // 生成parser对象
  const parser = tokensToParser(tokenizePath(record.path), options)

  // 如果有重复的动态参数命名进行提示
  if (__DEV__) {
    const existingKeys = new Set<string>()
    for (const key of parser.keys) {
      if (existingKeys.has(key.name))
        warn(
          `Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`
        )
      existingKeys.add(key.name)
    }
  }

  // 将record，parent合并到parser中，同时新增children，alias属性，默认值为空数组
  const matcher: RouteRecordMatcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: [],
  })

  if (parent) {
    // 两者都是alias或两者都不是alias
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher)
  }

  return matcher
}
```
#### 6.2.2 resolve

resolve根据传入的location进行路由匹配，找到对应的matcher的路由信息。方法接收一个location和currentLocation参数，返回一个MatcherLocation类型的对象，该对象的属性包含：name、path、params、matched、meta：

```js
function resolve(
    location: Readonly<MatcherLocationRaw>,
    currentLocation: Readonly<MatcherLocation>
  ): MatcherLocation {
    let matcher: RouteRecordMatcher | undefined
    let params: PathParams = {}
    let path: MatcherLocation['path']
    let name: MatcherLocation['name']

    if ('name' in location && location.name) { // 如果location存在name属性，可根据name从matcherMap获取matcher
      matcher = matcherMap.get(location.name)

      if (!matcher)
        throw createRouterError<MatcherError>(ErrorTypes.MATCHER_NOT_FOUND, {
          location,
        })

      name = matcher.record.name
      // 合并location.params和currentLocation中的params
      params = assign(
        paramsFromLocation(
          currentLocation.params,
          matcher.keys.filter(k => !k.optional).map(k => k.name)
        ),
        location.params
      )
      // 如果不能通过params转为path抛出错误
      path = matcher.stringify(params)
    } else if ('path' in location) { // 如果location存在path属性，根据path从matchers获取对应matcher
      path = location.path

      if (__DEV__ && !path.startsWith('/')) {
        warn(
          `The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`
        )
      }

      matcher = matchers.find(m => m.re.test(path))

      if (matcher) {
        // 通过parse函数获取params
        params = matcher.parse(path)!
        name = matcher.record.name
      }
    } else { // 如果location中没有name、path属性，就使用currentLocation的name或path获取matcher
      matcher = currentLocation.name
        ? matcherMap.get(currentLocation.name)
        : matchers.find(m => m.re.test(currentLocation.path))
      if (!matcher)
        throw createRouterError<MatcherError>(ErrorTypes.MATCHER_NOT_FOUND, {
          location,
          currentLocation,
        })
      name = matcher.record.name
      params = assign({}, currentLocation.params, location.params)
      path = matcher.stringify(params)
    }

    // 使用一个数组存储匹配到的所有路由
    const matched: MatcherLocation['matched'] = []
    let parentMatcher: RouteRecordMatcher | undefined = matcher
    while (parentMatcher) {
      // 父路由始终在数组的开头
      matched.unshift(parentMatcher.record)
      parentMatcher = parentMatcher.parent
    }

    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched),
    }
  }
```

#### 6.2.3 removeRoute

删除路由。接收一个matcherRef参数，removeRoute会将matcherRef对应的matcher从matcherMap和matchers中删除，并清空matcherRef对应matcher的children与alias属性。由于matcherRef对应的matcher被删除后，其子孙及别名也就没用了，也需要把他们从matcherMap中和matchers中删除:

```js
function removeRoute(matcherRef: RouteRecordName | RouteRecordMatcher) {
  // 如果是路由名字：string或symbol
  if (isRouteName(matcherRef)) {
    const matcher = matcherMap.get(matcherRef)
    if (matcher) {
      // 删除matcher
      matcherMap.delete(matcherRef)
      matchers.splice(matchers.indexOf(matcher), 1)
      // 清空matcher中的children与alias，
      matcher.children.forEach(removeRoute)
      matcher.alias.forEach(removeRoute)
    }
  } else {
    const index = matchers.indexOf(matcherRef)
    if (index > -1) {
      matchers.splice(index, 1)
      if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name)
      matcherRef.children.forEach(removeRoute)
      matcherRef.alias.forEach(removeRoute)
    }
  }
}
```

#### 6.2.4 getRoutes
获取所有matcher：

```js
function getRoutes() {
  return matchers
}
```

#### 6.2.5 getRecordMatcher
根据路由名获取对应matcher：

```js
function getRecordMatcher(name: RouteRecordName) {
  return matcherMap.get(name)
}
```
#### 6.2.6 insertMatcher
在添加matcher时，并不是直接matchers.add，而是根据matcher.score进行排序。比较分数时根据数组中的每一项挨个比较，不是比较总分：

```js
function insertMatcher(matcher: RouteRecordMatcher) {
  let i = 0
  while (
    i < matchers.length &&
    // matcher与matchers[i]比较，matchers[i]应该在前面
    comparePathParserScore(matcher, matchers[i]) >= 0 &&
    // matcher的path与matchers[i]不同或matcher不是matchers[i]的孩子
    (matcher.record.path !== matchers[i].record.path ||
      !isRecordChildOf(matcher, matchers[i]))
  )
    i++
  // 插入matcher
  matchers.splice(i, 0, matcher)
  // 只添加原始matcher到map中
  if (matcher.record.name && !isAliasRecord(matcher))
    matcherMap.set(matcher.record.name, matcher)
}
```

```js
// 返回0表示a与b相等；返回>0，b先排序；返回<0，a先排序
export function comparePathParserScore(a: PathParser, b: PathParser): number {
  let i = 0
  const aScore = a.score
  const bScore = b.score
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i])
    if (comp) return comp

    i++
  }

  return bScore.length - aScore.length
}

function compareScoreArray(a: number[], b: number[]): number {
  let i = 0
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i]
    // 一旦a与b对位索引对应的值有差值，直接返回
    if (diff) return diff

    i++
  }
  if (a.length < b.length) {
      // 如果a.length为1且第一个值的分数为PathScore.Static + PathScore.Segment，返回-1，表示a先排序，否则返回1，表示b先排序
    return a.length === 1 && a[0] === PathScore.Static + PathScore.Segment
      ? -1
      : 1
  } else if (a.length > b.length) {
    // 如果b.length为1且第一个值的分数为PathScore.Static + PathScore.Segment，返回-1，表示b先排序，否则返回1，表示a先排序
    return b.length === 1 && b[0] === PathScore.Static + PathScore.Segment
      ? 1
      : -1
  }

  return 0
}
```
假设matcherA是需要添加的，matchers中此时只有一个matcherB，matcherA.score=[[1, 2]]，matcherB.score=[[1,3]]，那么matcherA是怎么添加到matchers中的呢？过程如下：

1. 初始化matchers索引i=0；
2. 首先比较matcherA.score[0][0]与matcherB.score[0][0]，matcherB.score[0][0]-matcherA.score[0][0] === 0继续比较；
   matcherA.score[0][1]与matcherB.score[0][1]，因为matcherB.score[0][1]-matcherA.score[0][1] > 0，i++；
   i=1时，由于i=matchers.length，结束循环；

3. 执行matchers.splice(i, 0, matcher)，此时i=1,所以matcherA会被添加到索引为1的位置；
4. 如果matcherA.score=[[1,3,4]]呢？ 在比较时因为前两个索引对应的值都是一样的，这时会进入compareScoreArray的以下分支：

```js
if (a.length > b.length) {
  return b.length === 1 && b[0] === PathScore.Static + PathScore.Segment
    ? 1
    : -1
}
```

以上结果返回-1，matcherA会被添加索引为0的位置

如果matcherA.score=[[1]]，进入compareScoreArray的以下分支：

```js
 if (a.length < b.length) {
  return a.length === 1 && a[0] === PathScore.Static + PathScore.Segment
    ? -1
    : 1
}
```

因为matcherA.score[0].length === 1，这时就需要考虑token的类型里，假设token是个Static类型的，那么返回-1，matcherA添加到索引为0的位置。如果token不是Static类型的，返回1，matcherA添加到索引为1的位置。
所以insertMatcher，会将权重高的matcher放在matchers前面；matcherMap中只存放原始matcher。

### 6.3 总结

经过上面分析，我们知道了matcher是什么，如何实现的。
在vue-router通过matcher完成路由的匹配、增删改查等操作，其中会使用matchers和matcherMap来存储matcher。matchers中权重（分数）高的matcher优先；matcherMap中的key是注册路由时路由表的name，只存放原始matcher。
matcher中包含了路由path对应的正则re、路由的分数score、动态参数列表keys、可从path中提取动态参数的parse(path)函数、可传入参数对象将其转为对应path的stringify(param)函数、父matcher（parent）、路由的标准化版本record、子matcher（children）、由别名产生的matcher（alias）：

```typescript
export interface PathParser {
  re: RegExp
  score: Array<number[]>
  keys: PathParserParamKey[]
  parse(path: string): PathParams | null
  stringify(params: PathParams): string
}
export interface RouteRecordMatcher extends PathParser {
  record: RouteRecord
  parent: RouteRecordMatcher | undefined
  children: RouteRecordMatcher[]
  // aliases that must be removed when removing this record
  alias: RouteRecordMatcher[]
}

```

在生成matcher的过程中会将patch转换成token数组（二维数组，第一维度中每个维度代表一级路由，第二维度中每个维度代表路由的组成），路由正则的生成、动态参数的的提取、分数的计算、stringify全都依托这个token数组实现


## 7.createRouter解析
### 7.1 使用demo

```js
const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    { path: '/home', redirect: '/' },
    {
      path: '/',
      components: { default: Home, other: component },
      props: { default: to => ({ waited: to.meta.waitedFor }) },
    },
    {
      path: '/nested',
      alias: '/anidado',
      component: Nested,
      name: 'Nested',
      children: [
        {
          path: 'nested',
          alias: 'a',
          name: 'NestedNested',
          component: Nested,
          children: [
            {
              name: 'NestedNestedNested',
              path: 'nested',
              component: Nested,
            },
          ],
        },
        {
          path: 'other',
          alias: 'otherAlias',
          component: Nested,
          name: 'NestedOther',
        },
        {
          path: 'also-as-absolute',
          alias: '/absolute',
          name: 'absolute-child',
          component: Nested,
        },
      ],
    },
  ],
  async scrollBehavior(to, from, savedPosition) {
    await scrollWaiter.wait()
    if (savedPosition) {
      return savedPosition
    } else {
      if (to.matched.every((record, i) => from.matched[i] !== record))
        return { left: 0, top: 0 }
    }
    return false
  },
})

```

### 7.2 createRouter

在分析createRouter之前，先来看下它的参数类型

```typescript
 export interface _PathParserOptions {
  // 使用正则时区分大小写，默认false
  sensitive?: boolean
  // 是否禁止尾随斜杠，默认false
  strict?: boolean
  // 正则表达式前应该加^，默认true
  start?: boolean
  // 正则表达式以$结尾，默认为true
  end?: boolean
}

export type PathParserOptions = Pick<
  _PathParserOptions,
  'end' | 'sensitive' | 'strict'
  >

export interface RouterOptions extends PathParserOptions {
  history: RouterHistory
  // 路由表
  routes: RouteRecordRaw[]
  // 在页面之间导航时控制滚动行为。可以返回一个 Promise 来延迟滚动。
  scrollBehavior?: RouterScrollBehavior
  // 用于自定义如何解析query
  parseQuery?: typeof originalParseQuery
  // 用于自定义查询对象如何转为字符串
  stringifyQuery?: typeof originalStringifyQuery
  // 激活RouterLink的默认类
  linkActiveClass?: string
  // 精准激活RouterLink的默认类
  linkExactActiveClass?: string
}
```

我们来看下createRouter具体做了什么。createRouter方法共885（包含空行）行，乍一看可能会觉得方法很复杂，仔细观察，其实很大一部分代码都是声明一些函数。我们可以先暂时抛开这些函数声明看其余部分。
首先会使用createRouterMatcher方法创建了一个路由匹配器matcher，从options中提取parseQuery、stringifyQuery、history属性，如果options中没有history，抛出错误。

```typescript
const matcher = createRouterMatcher(options.routes, options)
const parseQuery = options.parseQuery || originalParseQuery
const stringifyQuery = options.stringifyQuery || originalStringifyQuery
const routerHistory = options.history
if (__DEV__ && !routerHistory)
    throw new Error(
      'Provide the "history" option when calling "createRouter()":' +
        ' https://next.router.vuejs.org/api/#history.'
    )
```

紧接着声明了一些全局守卫相关的变量，和一些关于params的处理方法，其中有关全局守卫的变量都是通过useCallbacks创建的，params相关方法通过applyToParams创建。

```js
// 全局前置守卫相关方法
const beforeGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
// 全局解析守卫相关方法
const beforeResolveGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
// 全局后置钩子方法
const afterGuards = useCallbacks<NavigationHookAfter>()

// 当前路由，浅层响应式对象
const currentRoute = shallowRef<RouteLocationNormalizedLoaded>(
  START_LOCATION_NORMALIZED
)
let pendingLocation: RouteLocation = START_LOCATION_NORMALIZED

// 如果浏览器环境下设置了scrollBehavior，那么需要防止页面自动恢复页面位置
// https://developer.mozilla.org/zh-CN/docs/Web/API/History/scrollRestoration
if (isBrowser && options.scrollBehavior && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// 标准化params，转字符串
const normalizeParams = applyToParams.bind(
  null,
  paramValue => '' + paramValue
)
// 编码param
const encodeParams = applyToParams.bind(null, encodeParam)
// 解码params
const decodeParams: (params: RouteParams | undefined) => RouteParams =
  applyToParams.bind(null, decode)

```

关于useCallbacks的实现：在useCallbacks中声明一个handlers数组用来保存所有添加的方法，useCallbacks的返回值中包括三个方法：add（添加一个handler，并返回一个删除handler的函数）、list（返回所有handler）、reset（清空所有handler）

```js
export function useCallbacks<T>() {
  let handlers: T[] = []

  function add(handler: T): () => void {
    handlers.push(handler)
    return () => {
      const i = handlers.indexOf(handler)
      if (i > -1) handlers.splice(i, 1)
    }
  }

  function reset() {
    handlers = []
  }

  return {
    add,
    list: () => handlers,
    reset,
  }
}
```
applyToParams的实现：接收一个处理函数和params对象，遍历params对象，并对每一个属性值执行fn并将结果赋给一个新的对象：

```js
export function applyToParams(
  fn: (v: string | number | null | undefined) => string,
  params: RouteParamsRaw | undefined
): RouteParams {
  const newParams: RouteParams = {}

  for (const key in params) {
    const value = params[key]
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value)
  }

  return newParams
}
```

然后声明了大量的函数，包括addRoute、removeRoute、getRoutes等，这些函数也就是我们日常使用的addRoute、removeRoute等。
在createRouter的最后创建了一个router对象，并将其返回，该对象几乎包含了声明的所有函数。

### 7.3 总结

createRouter函数中声明了一些全局钩子所需的变量和很多函数，这些函数就是我们日常使用的一些方法，如addRoute、removeRoute等，在函数的最后，声明了一个router对象，前面所声明的函数多数都会被包含在这个对象里，最终会将router返回。

## 8 createRouter内置方法解析

这里分析分析router.addRoute、router.removeRoute、router.hasRoute、router.getRoutes的实现。
### 8.1 使用

1. addRoute：当使用addRoute添加路由时，如果第一个参数为路由name，那么会添加一个嵌套路由；否则添加的是个非嵌套路由。

```js
// 添加非嵌套路由
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
// 添加嵌套路由
router.addRoute('admin', { path: 'settings', component: AdminSettings })
```

以上代码等同于：

```js
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

2. remove Router

```js
router.removeRoute('admin')
```
3. hashRoute

```js
router.hasRoute('admin')
```
- getRoutes

```js
router.getRoutes()
```
### 8.2 addRoute

addRoute可接受两个参数：parentOrRoute（父路由的name或一个新的路由，如果是父路由的name，name第二个参数是必须的）、record（要添加的路由）。返回一个删除新增路由的函数。

```js
function addRoute(
    parentOrRoute: RouteRecordName | RouteRecordRaw,
    route?: RouteRecordRaw
  ) {
    let parent: Parameters<typeof matcher['addRoute']>[1] | undefined
    let record: RouteRecordRaw
    // 如果parentOrRoute是路由名称，parent为parentOrRoute对应的matcher，被添加的route是个嵌套路由
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute)
      record = route!
    } else { // 如果parentOrRoute不是路由名称，parentOrRoute就是要添加的路由
      record = parentOrRoute
    }

    // 调用matcher.addRoute添加新的记录，返回一个移除路由的函数
    return matcher.addRoute(record, parent)
  }

```

在定义parent时，使用了一个Paramerer<Type>类型，对于该类型的使用可参考这里。在该方法中，parent的类型会取matcher.addRoute方法中的第2个参数的类型。
isRouteName：通过判断name是否为string或symbol类型，来决定是不是routeName。
```js
export function isRouteName(name: any): name is RouteRecordName {
  return typeof name === 'string' || typeof name === 'symbol'
}
```

### 8.3 removeRoute

删除路由。removeRoute接收一个name（现有路由的名称）参数。

```js
function removeRoute(name: RouteRecordName) {
  // 根据name获取对应的routeRecordMatcher
  const recordMatcher = matcher.getRecordMatcher(name)
  if (recordMatcher) {
    // 如果存在recordMatcher，调用matcher.removeRoute
    matcher.removeRoute(recordMatcher)
  } else if (__DEV__) {
    warn(`Cannot remove non-existent route "${String(name)}"`)
  }
}
```

### 8.4 hashRoute

用于判断路由是否存在。hasRoute接收一个name字符串，返回一个boolen值。
通过matcher.getRecordMatcher来获取对应的matcher，在matcher.getRecordMatcher会在matcherMap中取寻找对应的matcher，如果没有找到说明路由不存在：

```js
function hasRoute(name: RouteRecordName): boolean {
  return !!matcher.getRecordMatcher(name)
}
```

### 8.5 getRoutes

获取标准化后的路由列表。标准化后的路由会被存储到matcher.record中。

```js
function getRoutes() {
  // 遍历matchers，routeMatcher.record中存储着路由的标准化版本
  return matcher.getRoutes().map(routeMatcher => routeMatcher.record)
}
```

### 8.6总结

router.addRoute、router.removeRoute、router.hasRoute、router.getRoutes几个API全都依赖matcher实现，可见matcher是vue-router的核心。

## 9. router.resolve

### 9.1 使用

router.resolve方法返回路由地址的标准化版本。

```js

router.resolve('admin')
router.resolve({ path: '/admin' })

```
### 9.2 resolve

resolve接收两个参数：rawLocation、currentLocation（可选）。其中rawLocation是待转换的路由，rawLocation可以是个对象也可以是个字符串。currentLocation不传默认是currentRoute。
在resolve中有是两个分支：
- 如果rawLocation是string类型；
调用parseURL解析rawLocation；

```js

const locationNormalized = parseURL(
  parseQuery,
  rawLocation,
  currentLocation.path
)

```

parseURL接收三个参数：parseQuery（一个query解析函数）、location（被解析的location）、currentLocation（当前的location）。

```js

export function parseURL(
  parseQuery: (search: string) => LocationQuery,
  location: string,
  currentLocation: string = '/'
): LocationNormalized {
let path: string | undefined,
  query: LocationQuery = {},
  searchString = '',
  hash = ''

  // location中?的位置
  const searchPos = location.indexOf('?')
  // location中#的位置，如果location中有?，在?之后找#
  const hashPos = location.indexOf('#', searchPos > -1 ? searchPos : 0)
  
  // 如果
  if (searchPos > -1) {
    // 从location中截取[0, searchPos)位置的字符串作为path
    path = location.slice(0, searchPos)
    // 从location截取含search的字符串，不包含hash部分
    searchString = location.slice(
      searchPos + 1,
      hashPos > -1 ? hashPos : location.length
    )
    // 调用parseQuery生成query对象
    query = parseQuery(searchString)
  }
  // 如果location中有hash
  if (hashPos > -1) {
    path = path || location.slice(0, hashPos)
    // 从location中截取[hashPos, location.length)作为hash（包含#）
    hash = location.slice(hashPos, location.length)
  }
  
  // 解析以.开头的相对路径
  path = resolveRelativePath(path != null ? path : location, currentLocation)
  // empty path means a relative query or hash `?foo=f`, `#thing`
  
  return {
    // fullPath = path + searchString + hash
    fullPath: path + (searchString && '?') + searchString + hash,
    path,
    query,
    hash,
  }
}

```

来看下，相对路径的解析过程：

```js

export function resolveRelativePath(to: string, from: string): string {
// 如果to以/开头，说明是个绝对路径，直接返回即可
if (to.startsWith('/')) return to
// 如果from不是以/开头，那么说明from不是绝对路径，也就无法推测出to的绝对路径，此时直接返回to
if (__DEV__ && !from.startsWith('/')) {
  warn(
    `Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`
  )
  return to
}

if (!to) return from
// 使用/分割from与to
const fromSegments = from.split('/')
const toSegments = to.split('/')

// 初始化position默认为fromSegments的最后一个索引
let position = fromSegments.length - 1
let toPosition: number
let segment: string

for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
  segment = toSegments[toPosition]
    // 保证position不会小于0
    if (position === 1 || segment === '.') continue
    if (segment === '..') position--
    else break
  }
  
  return (
    fromSegments.slice(0, position).join('/') +
    '/' +
    toSegments
      .slice(toPosition - (toPosition === toSegments.length ? 1 : 0))
      .join('/')
  )
}

```

1. to=cc，from=/aa/bb，经过resolveRelativePath后：/aa/cc；
2. to=cc，from=/aa/bb/，经过resolveRelativePath后：/aa/bb/cc；
3. to=./cc，from=/aa/bb，经过resolveRelativePath后：/aa/cc；
4. to=./cc，from=/aa/bb/，经过resolveRelativePath后：/aa/bb/cc；
5. to=../cc，from=/aa/bb，经过resolveRelativePath后：/aa；
6. to=../cc，from=/aa/bb/，经过resolveRelativePath后：/aa/cc；
7. 如果from/，to=cc、to=./cc、to=../cc、to=../../cc、to=./../cc、to=.././cc经过resolveRelativePath始终返回/cc。

回到resolve中，解析完rawLocation后，调用matcher.resolve：

```js
const matchedRoute = matcher.resolve(
  { path: locationNormalized.path },
  currentLocation
)
// 使用routerHistory.createHref创建href
const href = routerHistory.createHref(locationNormalized.fullPath)

```

最后返回对象：

```js

return assign(locationNormalized, matchedRoute, {
  // 对params中的value进行decodeURIComponent
  params:decodeParams(matchedRoute.params),
  // 对hash进行decodeURIComponent
  hash: decode(locationNormalized.hash),
  redirectedFrom: undefined,
  href,
})

```

- rawLocation不是string类型

```js
let matcherLocation: MatcherLocationRaw

// 如果rawLocation中有path属性
if ('path' in rawLocation) {
  // rawLocation中的params会被忽略
  if (
    __DEV__ &&
    'params' in rawLocation &&
    !('name' in rawLocation) &&
    Object.keys(rawLocation.params).length
  ) {
    warn(
      `Path "${
        rawLocation.path
      }" was passed with params but they will be ignored. Use a named route alongside params instead.`
    )
  }
  // 处理path为绝对路径
  matcherLocation = assign({}, rawLocation, {
    path: parseURL(parseQuery, rawLocation.path, currentLocation.path).path,
  })
} else {
  // 删除空的参数
  const targetParams = assign({}, rawLocation.params)
  for (const key in targetParams) {
    if (targetParams[key] == null) {
      delete targetParams[key]
    }
  }
  // 对params进行编码
  matcherLocation = assign({}, rawLocation, {
    params: encodeParams(rawLocation.params),
  })
  // 将当前位置的params编码 当前位置的参数被解码，我们需要对它们进行编码以防匹配器合并参数
  currentLocation.params = encodeParams(currentLocation.params)
}

// 调用matcher.resolve获取路由相关信息
const matchedRoute = matcher.resolve(matcherLocation, currentLocation)
const hash = rawLocation.hash || ''

if (__DEV__ && hash && !hash.startsWith('#')) {
  warn(
    `A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`
  )
}

// 由于matcher已经合并了当前位置的参数，所以需要进行解码
matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params))

// 生成完整path
const fullPath = stringifyURL(
  stringifyQuery,
  assign({}, rawLocation, {
    hash: encodeHash(hash),
    path: matchedRoute.path,
  })
)
// routerHistory.createHref会删除#之前的任意字符
const href = routerHistory.createHref(fullPath)
if (__DEV__) {
  if (href.startsWith('//')) {
    warn(
      `Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`
    )
  } else if (!matchedRoute.matched.length) {
    warn(
      `No match found for location with path "${
        'path' in rawLocation ? rawLocation.path : rawLocation
      }"`
    )
  }
}

return assign(
  {
    fullPath,
    hash,
    query:
    // 如果query是个嵌套对象，normalizeQuery会将嵌套的对象toString，如果用户使用qs等库，我们需要保持query的状态
    // https://github.com/vuejs/router/issues/328#issuecomment-649481567
      stringifyQuery === originalStringifyQuery
        ? normalizeQuery(rawLocation.query)
        : ((rawLocation.query || {}) as LocationQuery),
  },
  matchedRoute,
  {
    redirectedFrom: undefined,
    href,
  }
)
```

## 10. Router.push 和router.replace解析

### 10.1 使用

使用`router.push`方法导航到不同的 URL。这个方法会向`history`栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL；

使用`router.replace`方法导航到不同的 URL。这个方法会在`history`栈替换历史记录；

```js
router.push('/search?name=pen')
router.push({ path: '/search', query: { name: 'pen' } })
router.push({ name: 'search', query: { name: 'pen' } })
// 以上三种方式是等效的。

router.replace('/search?name=pen')
router.replace({ path: '/search', query: { name: 'pen' } })
router.replace({ name: 'search', query: { name: 'pen' } })
// 以上三种方式是等效的。
```

### 10.2 push

`push`方法接收一个to参数，表示要跳转的路由，它可以是个字符串，也可以是个对象。在push方法中调用了一个`pushWithRedirect`函数，并返回其结果。

```js
function push(to: RouteLocationRaw | RouteLocation) {
  return pushWithRedirect(to)
}
```

`pushWithRedirect`接收两个参数：`to`、`redirectedFrom`，并返回`pushWithRedirect`的结果。其中`to`是要跳转到的路由，`redirectedFrom`代表`to`是从哪个路由重定向来的，如果多次重定向，它只是最初重定向的那个路由。

```js
function pushWithRedirect(
  to: RouteLocationRaw | RouteLocation,
  redirectedFrom?: RouteLocation
): Promise<NavigationFailure | void | undefined> {
  // ...
}
```

因为要到的`to`中可能存在重定向，所以`pushWithRedirect`中首先要处理重定向：当to中存在重定向时，递归调用`pushWithRedirect`。

```js
// 将to处理为规范化的路由
const targetLocation: RouteLocation = (pendingLocation = resolve(to))
// 当前路由
const from = currentRoute.value
// 使用 History API(history.state) 保存的状态
const data: HistoryState | undefined = (to as RouteLocationOptions).state
// force代表强制触发导航，即使与当前位置相同
const force: boolean | undefined = (to as RouteLocationOptions).force
// replace代表是否替换当前历史记录
const replace = (to as RouteLocationOptions).replace === true

// 获取要重定向的记录
const shouldRedirect = handleRedirectRecord(targetLocation)

// 如果需要重定向，递归调用pushWithRedirect方法
if (shouldRedirect)
  return pushWithRedirect(
    assign(locationAsObject(shouldRedirect), {
      state: data,
      force,
      replace,
    }),
    // 重定向的根来源
    redirectedFrom || targetLocation
  )
```

`handleRedirectRecord`函数的实现：

```js
function handleRedirectRecord(to: RouteLocation): RouteLocationRaw | void {
  // 找到匹配的路由，to.matched中的路由顺序是父路由在子路由前面，所以最后一个路由是我们的最终路由
  const lastMatched = to.matched[to.matched.length - 1]
  // 如果路由存在redirect
  if (lastMatched && lastMatched.redirect) {
    const { redirect } = lastMatched
    // 如果redirect是函数，需要执行函数
    let newTargetLocation =
      typeof redirect === 'function' ? redirect(to) : redirect

    // 如果newTargetLocation是string
    if (typeof newTargetLocation === 'string') {
      // 如果newTargetLocation中存在?或#，需要将newTargetLocation解析成一个LocationNormalized类型的对象
      newTargetLocation =
        newTargetLocation.includes('?') || newTargetLocation.includes('#')
          ? (newTargetLocation = locationAsObject(newTargetLocation))
          : { path: newTargetLocation }
      // 设置params为一个空对象
      newTargetLocation.params = {}
    }

    // 如果newTargetLocation中没有path和name属性，则无法找到重定向的路由，开发环境下进行提示
    if (
      __DEV__ &&
      !('path' in newTargetLocation) &&
      !('name' in newTargetLocation)
    ) {
      warn(
        `Invalid redirect found:\n${JSON.stringify(
          newTargetLocation,
          null,
          2
        )}\n when navigating to "${
          to.fullPath
        }". A redirect must contain a name or path. This will break in production.`
      )
      throw new Error('Invalid redirect')
    }

    return assign(
      {
        query: to.query,
        hash: to.hash,
        params: to.params,
      },
      newTargetLocation
    )
  }
}
```

处理完重定向后，接下来会检测要跳转到的路由和当前路由是否为同一个路由，如果是同一个路由并且不强制跳转，会创建一个失败函数赋给`failure`，然后处理滚动行为。

```js
const toLocation = targetLocation as RouteLocationNormalized

// 设置重定向的来源
toLocation.redirectedFrom = redirectedFrom
let failure: NavigationFailure | void | undefined

// 如果要跳转到的路由与当前路由一致并且不强制跳转
if (!force && isSameRouteLocation(stringifyQuery, from, targetLocation)) {
  // 创建一个错误信息，该错误信息代表重复的导航
  failure = createRouterError<NavigationFailure>(
    ErrorTypes.NAVIGATION_DUPLICATED,
    { to: toLocation, from }
  )
  // 处理滚动行为
  handleScroll(
    from,
    from,
    true,
    false
  )
}
```

关于handleScroll的实现如下：首先从options中找到scrollBehavior选项，如果不是浏览器环境或不存在scrollBehavior，返回一个Promise对象。相反，获取滚动位置（根据历史记录中的position和path获取），然后在下一次DOM刷新后，执行定义的滚动行为函数，滚动行为函数执行完后，将滚动行为函数结果作为最终的滚动位置将页面滚动到指定位置。

```js
function handleScroll(
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded,
  isPush: boolean,
  isFirstNavigation: boolean
): Promise<any> {
  const { scrollBehavior } = options
  if (!isBrowser || !scrollBehavior) return Promise.resolve()

  // 获取滚动位置
  const scrollPosition: _ScrollPositionNormalized | null =
    (!isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0))) ||
    ((isFirstNavigation || !isPush) &&
      (history.state as HistoryState) &&
      history.state.scroll) ||
    null

  // 下一次DOM更新后触发滚动行为，滚动行为执行完后，滚动到指定位置
  return nextTick()
    .then(() => scrollBehavior(to, from, scrollPosition))
    .then(position => position && scrollToPosition(position))
    .catch(err => triggerError(err, to, from))
}

export function getScrollKey(path: string, delta: number): string {
  // history.state.position记录着当前路由在历史记录中的位置，该位置从0开始
  const position: number = history.state ? history.state.position - delta : -1
  // key值为 在历史记录中的位置+path
  return position + path
}

export function getSavedScrollPosition(key: string) {
  // 根据key值查找滚动位置
  const scroll = scrollPositions.get(key)
  // 查完后，删除对应记录
  scrollPositions.delete(key)
  return scroll
}
```

在`pushWithRedirect`最后返回一个`Promise`。如果有`failure`，返回`failure`。如果没有`failure`则执行`navigate(toLocation, from)`。

那么`navigate`是做什么的呢？`navigate`函数接收两个参数：`to`、`from`。

`navigate`中首先调用了一个`extractChangingRecords`函数，该函数的作用是将`from`、`to`所匹配到的路由分别存到三个数组中：`from`、`to`所共有的路由放入`updatingRecords`（正在更新的路由）、`from`独有的路由放入`leavingRecords`（正要离开的路由）、`to`独有的路由放入`enteringRecords`（正在进入的新路由）。紧接着又调用了一个`extractComponentsGuards`函数，用来获取组件内的`beforeRouteLeave`钩子，注意`extractComponentsGuards`函数只能获取使用`beforeRouteLeave(){}`方式注册的函数，对于使用`onBeforeRouteLeave`注册的函数需要单独处理。

```js
const [leavingRecords, updatingRecords, enteringRecords] =
  extractChangingRecords(to, from)

guards = extractComponentsGuards(
  // 这里leavingRecords需要反转，因为matched中的顺序是父路由在子路由前，当离开时，应先离开子路由再离开父路由
  leavingRecords.reverse(),
  'beforeRouteLeave',
  to,
  from
)

// 向guards中添加使用onBeforeRouteLeave方式注册的方法
for (const record of leavingRecords) {
  record.leaveGuards.forEach(guard => {
    guards.push(guardToPromiseFn(guard, to, from))
  })
}

// 如果发生了新的导航canceledNavigationCheck可以帮助跳过后续所有的导航
const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(
  null,
  to,
  from
)

guards.push(canceledNavigationCheck)
```

`extractChangingRecords`的实现过程：如果`to`和`from`配配到的路由中有公共的，说明这些路由在跳转过程中是更新操作，将其加入`updatingRecords`中；如果是`from`所匹配到独有的路由，说明要离开这些路由，将它们放入`leavingRecords`中；相反，如果`to`匹配到的路由中，from没有匹配到，说明是新的路由，将它们放入`enteringRecords`中。

```js
function extractChangingRecords(
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded
) {
  // 要离开的路由
  const leavingRecords: RouteRecordNormalized[] = []
  // 更新的路由
  const updatingRecords: RouteRecordNormalized[] = []
  // 要进入的新的路由（在from.matched中未出现过）
  const enteringRecords: RouteRecordNormalized[] = []

  const len = Math.max(from.matched.length, to.matched.length)
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i]
    if (recordFrom) {
      // 如果recordFrom在to.matched中存在，将recordFrom加入到updatingRecords，否则加入到leavingRecords中
      if (to.matched.find(record => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom)
      else leavingRecords.push(recordFrom)
    }
    const recordTo = to.matched[i]
    if (recordTo) {
      // 如果recordTo在from.matched中找不到，说明是个新的路由，将recordTo加入到enteringRecords
      if (!from.matched.find(record => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo)
      }
    }
  }

  return [leavingRecords, updatingRecords, enteringRecords]
}
```

`extractComponentsGuards`是专门用来从路由组件中提取钩子函数的。`extractComponentsGuards`接收四个参数：

1. `matched`（从`to`、`from`中提取出的`leavingRecords`、`updatingRecords`、`enteringRecords`之一）；
2. `guardType`（钩子类型，可以取的值`beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`）；
3. `to`；
4. `from`。

返回值是一个钩子函数列表。

```js
export function extractComponentsGuards(
  matched: RouteRecordNormalized[],
  guardType: GuardType,
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded
) {
  // 声明一个数组保存钩子函数
  const guards: Array<() => Promise<void>> = []

  for (const record of matched) {
    // 遍历路由对应的组件components
    for (const name in record.components) {
      let rawComponent = record.components[name]
      // 开发环境下进行提示
      if (__DEV__) {
        // 如果组件不存在或组件不是object和function，提示不是有效的组件
        if (
          !rawComponent ||
          (typeof rawComponent !== 'object' &&
            typeof rawComponent !== 'function')
        ) {
          warn(
            `Component "${name}" in record with path "${record.path}" is not` +
              ` a valid component. Received "${String(rawComponent)}".`
          )
          // 抛出错误
          throw new Error('Invalid route component')
        } else if ('then' in rawComponent) { // 如果使用import('./xxx.vue')的方式使用组件，进行提示，并转为() => import('./xxx.vue')
          warn(
            `Component "${name}" in record with path "${record.path}" is a ` +
              `Promise instead of a function that returns a Promise. Did you ` +
              `write "import('./MyPage.vue')" instead of ` +
              `"() => import('./MyPage.vue')" ? This will break in ` +
              `production if not fixed.`
          )
          const promise = rawComponent
          rawComponent = () => promise
        } else if (
          (rawComponent as any).__asyncLoader &&
          // warn only once per component
          !(rawComponent as any).__warnedDefineAsync
        ) { // 如果使用defineAsyncComponent()方式定义的组件，进行提示
          ;(rawComponent as any).__warnedDefineAsync = true
          warn(
            `Component "${name}" in record with path "${record.path}" is defined ` +
              `using "defineAsyncComponent()". ` +
              `Write "() => import('./MyPage.vue')" instead of ` +
              `"defineAsyncComponent(() => import('./MyPage.vue'))".`
          )
        }
      }

      // 如果路由组件没有被挂载跳过update和leave钩子
      if (guardType !== 'beforeRouteEnter' && !record.instances[name]) continue

      // 如果是个路由组件
      // 路由组件需要满足：rawComponent是object || rawComponent有['displayName', 'props`、`__vccOpts`]中的任一属性
      if (isRouteComponent(rawComponent)) {
        // __vccOpts是由vue-class-component添加的
        const options: ComponentOptions =
          (rawComponent as any).__vccOpts || rawComponent
        const guard = options[guardType]
        // 向guards中添加一个异步函数
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name))
      } else {
        // 能进入这个方法的表示rawComponent是个函数；例如懒加载() => import('./xx.vue')；函数式组件() => h('div', 'HomePage')
        // 注意这个的分支只发生在调用beforeRouteEnter之前，后续过程不会进行该过程。
        // 因为在调用beforeRouteEnter钩子之前，会进行异步路由组件的解析，一旦异步路由组件解析成功，会将解析后的组件挂载至对应的components[name]下
        
        // 执行rawComponent，例如懒加载() => import('./xx.vue')；如果函数式组件未声明displayName也会进入此分支
        let componentPromise: Promise<
          RouteComponent | null | undefined | void
        > = (rawComponent as Lazy<RouteComponent>)()

        // 对于函数式组件需要添加一个displayName属性，如果没有，进行提示，并将componentPromise转为一个Promise
        if (__DEV__ && !('catch' in componentPromise)) {
          warn(
            `Component "${name}" in record with path "${record.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`
          )
          componentPromise = Promise.resolve(componentPromise as RouteComponent)
        }

        // 向guards中添加一个钩子函数，在这个钩子的执行过程中先解析异步路由组件，然后调用钩子函数
        guards.push(() =>
          componentPromise.then(resolved => {
            // 如果解析失败抛出错误
            if (!resolved)
              return Promise.reject(
                new Error(
                  `Couldn't resolve component "${name}" at "${record.path}"`
                )
              )
            // 判断解析后的组件是否为esm，如果是esm，需要取resolved.default
            const resolvedComponent = isESModule(resolved)
              ? resolved.default
              : resolved
            // 使用解析完的组件替换对应的components[name]
            record.components[name] = resolvedComponent
            const options: ComponentOptions =
              (resolvedComponent as any).__vccOpts || resolvedComponent
            // 对应的组件内的钩子
            const guard = options[guardType]
            // 钩子转promise，并执行
            return guard && guardToPromiseFn(guard, to, from, record, name)()
          })
        )
      }
    }
  }

  return guards
}
```

在`navigate`函数最后会调用`guards`中的钩子，并在`beforeRouteLeave`钩子执行完后执行了一系列操作。其实在这里就体现了`vue-router`中钩子的执行顺序：

```js
return (
  runGuardQueue(guards)
    .then(() => {
      // 调用全局beforeEach钩子
      guards = []
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from))
      }
      guards.push(canceledNavigationCheck)

      return runGuardQueue(guards)
    })
    .then(() => {
      // 获取组件中的beforeRouteUpdate钩子，以beforeRouteUpdate() {}方式声明
      guards = extractComponentsGuards(
        updatingRecords,
        'beforeRouteUpdate',
        to,
        from
      )

      // 以onBeforeRouteUpdate注册的
      for (const record of updatingRecords) {
        record.updateGuards.forEach(guard => {
          guards.push(guardToPromiseFn(guard, to, from))
        })
      }
      guards.push(canceledNavigationCheck)

      // 调用beforeRouteUpdate钩子
      return runGuardQueue(guards)
    })
    .then(() => {
      guards = []
      for (const record of to.matched) {
        // 不在重用视图上触发beforeEnter
        // 路由配置中有beforeEnter，并且from不匹配record
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from))
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from))
          }
        }
      }
      guards.push(canceledNavigationCheck)

      // 调用路由配置中的beforeEnter
      return runGuardQueue(guards)
    })
    .then(() => {

      // 清除存在的enterCallbacks 由extractComponentsGuards添加
      to.matched.forEach(record => (record.enterCallbacks = {}))

      // 获取被激活组件中的beforeRouteEnter钩子，在之前会处理异步路由组件
      guards = extractComponentsGuards(
        enteringRecords,
        'beforeRouteEnter',
        to,
        from
      )
      guards.push(canceledNavigationCheck)

      return runGuardQueue(guards)
    })
    .then(() => {
      guards = []
      // 处理全局beforeResolve钩子
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from))
      }
      guards.push(canceledNavigationCheck)

      return runGuardQueue(guards)
    })
    // 捕获任何取消的导航
    .catch(err =>
      isNavigationFailure(err, ErrorTypes.NAVIGATION_CANCELLED)
        ? err
        : Promise.reject(err)
    )
)
```

截止目前一个欠完整的导航的解析流程（包含钩子的执行顺序）如下 ：

1. 导航被触发；
2. 调用失活组件中的`beforeRouteLeave`钩子；
3. 调用全局`beforeEach`钩子；
4. 调用重用组件内的`beforeRouteUpdate`钩子；
5. 调用路由配置中的`beforeEnter`钩子；
6. 解析异步路由组件；
7. 调用激活组件中的`beforeRouteEnter`钩子；
8. 调用全局的`beforeResolve`钩子；

你可能发现了，在每放入一个周期的钩子函数之后，都会紧跟着向`guards`中添加一个`canceledNavigationCheck`函数。这个`canceledNavigationCheck`的函数作用是如果在导航期间有了新的导航，则会`reject`一个`ErrorTypes.NAVIGATION_CANCELLED`错误信息。

```js
function checkCanceledNavigationAndReject(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): Promise<void> {
  const error = checkCanceledNavigation(to, from)
  return error ? Promise.reject(error) : Promise.resolve()
}

function checkCanceledNavigation(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): NavigationFailure | void {
  if (pendingLocation !== to) {
    return createRouterError<NavigationFailure>(
      ErrorTypes.NAVIGATION_CANCELLED,
      {
        from,
        to,
      }
    )
  }
}
```

在向guards中放入钩子时，都使用了一个guardToPromiseFn，guardToPromiseFn可以将钩子函数转为promise函数。

```js
export function guardToPromiseFn(
  guard: NavigationGuard,
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  record?: RouteRecordNormalized,
  name?: string
): () => Promise<void> {
  const enterCallbackArray =
    record &&
    (record.enterCallbacks[name!] = record.enterCallbacks[name!] || [])

  return () =>
    new Promise((resolve, reject) => {
      // 这个next函数就是beforeRouteEnter中的next
      const next: NavigationGuardNext = (
        valid?: boolean | RouteLocationRaw | NavigationGuardNextCallback | Error
      ) => {
        // 如果调用next时传入的是false，取消导航
        if (valid === false)
          reject(
            createRouterError<NavigationFailure>(
              ErrorTypes.NAVIGATION_ABORTED,
              {
                from,
                to,
              }
            )
          )
        else if (valid instanceof Error) { // 如果传入了一个Error实例
          reject(valid)
        } else if (isRouteLocation(valid)) { // 如果是个路由。可以进行重定向
          reject(
            createRouterError<NavigationRedirectError>(
              ErrorTypes.NAVIGATION_GUARD_REDIRECT,
              {
                from: to,
                to: valid,
              }
            )
          )
        } else {
          // 如果valid是个函数，会将这个函数添加到record.enterCallbacks[name]中
          // 关于record.enterCallbacks的执行时机，将会在RouterView中进行分析
          if (
            enterCallbackArray &&
            // since enterCallbackArray is truthy, both record and name also are
            record!.enterCallbacks[name!] === enterCallbackArray &&
            typeof valid === 'function'
          )
            enterCallbackArray.push(valid)
          resolve()
        }
      }

      // 调用guard，绑定this为组件实例
      const guardReturn = guard.call(
        record && record.instances[name!],
        to,
        from,
        // next应该只允许被调用一次，如果使用了多次开发环境下给出提示
        __DEV__ ? canOnlyBeCalledOnce(next, to, from) : next
      )
      // 使用Promise.resolve包装guard的返回结果，以允许异步guard
      let guardCall = Promise.resolve(guardReturn)

      // 如果guard参数小于3,guardReturn会作为next的参数
      if (guard.length < 3) guardCall = guardCall.then(next)
      // 如果guard参数大于2
      if (__DEV__ && guard.length > 2) {
        const message = `The "next" callback was never called inside of ${
          guard.name ? '"' + guard.name + '"' : ''
        }:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`
        // guardReturn是个promise
        if (typeof guardReturn === 'object' && 'then' in guardReturn) {
          guardCall = guardCall.then(resolvedValue => {
            // 未调用next。如：
            // beforeRouteEnter(to, from ,next) {
            //  return Promise.resolve(11)
            // }
            if (!next._called) {
              warn(message)
              return Promise.reject(new Error('Invalid navigation guard'))
            }
            return resolvedValue
          })
          // TODO: test me!
        } else if (guardReturn !== undefined) {
          // 如果有返回值，并且未调用next。如
          // beforeRouteEnter(to, from ,next) {
          //  return 11
          // }
          if (!next._called) {
            warn(message)
            reject(new Error('Invalid navigation guard'))
            return
          }
        }
      }
      // 捕获错误
      guardCall.catch(err => reject(err))
    })
}
```

`guardToPromiseFn`中声明的的`next`方法会作为钩子函数的第三个参数。如果在使用钩子函数时，形参的数量<3，那么钩子函数的返回值会作为next函数的参数；形参数量>2时，如果钩子函数的返回值是`Promise`，但未调用`next`，会抛出错误`Invalid navigation guard`，如果钩子函数的返回值不为`undefined`，也未调用next也会抛出错误`Invalid navigation guard`。

所以如果在使用路由钩子的过程中，如果钩子函数的形参>2，也就是你的形参中有`next`，你必须要调用`next`。如果你不想自己调用`next`，那么你要保证形参<2，同时钩子函数返回某个数据，这样`vue-router`会自动调用next。这里需要注意如果传递给next的参数是个function，那么这个function会被存入`record.enterCallbacks[name]`中。关于钩子函数中`next`的使用以下是一些示例：

```js
beforeRouteEnter(from, to) {
    return false
}
// 等同于
beforeRouteEnter(from, to, next) {
    next(false)
}
// 不能写为如下
beforeRouteEnter(from, to, next) {
    return false
}

// 返回Promise
beforeRouteEnter(from, to) {
    return Promise.resolve(...)
}
// 返回function
beforeRouteEnter(from, to) {
    return function() { ... }
}
```

执行钩子列表的函数`runGuardQueue`，只有当前钩子执行完毕，才会执行下一个钩子：

```js
function runGuardQueue(guards: Lazy<any>[]): Promise<void> {
  return guards.reduce(
    (promise, guard) => promise.then(() => guard()),
    Promise.resolve()
  )
}
```

在`pushWithRedirect`函数最后，在`navigate`执行完后并没有结束，而是又进行了以下操作：

```js
// 首先判断之前的操作是否出错
// 如果出错，将failure使用Promise.resolve包装，进入.then
// 如果未出错，调用navigate()，navigate过程中失败，进入.catch，成功进入.then
// 注意这里catch发生在then之前，所以catch运行完，可能会继续进入then
return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
  .catch((error: NavigationFailure | NavigationRedirectError) =>
    isNavigationFailure(error)
      ? 
      isNavigationFailure(error, ErrorTypes.NAVIGATION_GUARD_REDIRECT)
        ? error // navigate过程中发生的重定向，进入.then
        : markAsReady(error)
      : // reject 未知的错误
      triggerError(error, toLocation, from)
  )
  .then((failure: NavigationFailure | NavigationRedirectError | void) => {
    if (failure) {
      // 如果是重定向错误
      if (
        isNavigationFailure(failure, ErrorTypes.NAVIGATION_GUARD_REDIRECT)
      ) {
        // 如果是循环的重定向（检测循环次数超过10次）
        if (
          __DEV__ &&
          // 重定向的位置与toLocation相同
          isSameRouteLocation(
            stringifyQuery,
            resolve(failure.to),
            toLocation
          ) &&
          redirectedFrom &&
          // 循环次数
          (redirectedFrom._count = redirectedFrom._count
            ? 
            redirectedFrom._count + 1
            : 1) > 10
        ) {
          warn(
            `Detected an infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`
          )
          return Promise.reject(
            new Error('Infinite redirect in navigation guard')
          )
        }

        // 递归调用pushWithRedirect，进行重定向
        return pushWithRedirect(
          // keep options
          assign(locationAsObject(failure.to), {
            state: data,
            force,
            replace,
          }),
          // preserve the original redirectedFrom if any
          redirectedFrom || toLocation
        )
      }
    } else {
      // 如果在navigate过程中没有抛出错误信息
      failure = finalizeNavigation(
        toLocation as RouteLocationNormalizedLoaded,
        from,
        true,
        replace,
        data
      )
    }
    // 触发全局afterEach钩子
    triggerAfterEach(
      toLocation as RouteLocationNormalizedLoaded,
      from,
      failure
    )
    return failure
  })
```

可以发现，如果navigate过程执行顺利的话，最后会执行一个finalizeNavigation方法，然后触发全局afterEach钩子。那么我们来看下finalizeNavigation是做什么的。

```js
function finalizeNavigation(
  toLocation: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded,
  isPush: boolean,
  replace?: boolean,
  data?: HistoryState
): NavigationFailure | void {
  // 检查是否取消了导航
  const error = checkCanceledNavigation(toLocation, from)
  if (error) return error

  // 第一次导航
  const isFirstNavigation = from === START_LOCATION_NORMALIZED
  const state = !isBrowser ? {} : history.state

  // 仅当用户进行了push/replace并且不是初始导航时才更改 URL，因为它只是反映了 url
  if (isPush) {
    // replace为true或首次导航，使用routerHistory.replace 
    if (replace || isFirstNavigation)
      routerHistory.replace(
        toLocation.fullPath,
        assign(
          {
            // 如果是第一次导航，重用history.state中的scroll
            scroll: isFirstNavigation && state && state.scroll,
          },
          data
        )
      )
    else routerHistory.push(toLocation.fullPath, data)
  }

  // toLocation成为了当前导航
  currentRoute.value = toLocation
  // 处理滚动
  handleScroll(toLocation, from, isPush, isFirstNavigation)

  // 路由相关操作准备完毕
  markAsReady()
}
```

可以看出finalizeNavigation函数的作用是确认我们的导航，它主要做两件事：改变url(如果需要改变)、处理滚动行为。在最后有个markAsReady方法，我们继续看markAsReady是做什么的。

```js
function markAsReady<E = any>(err?: E): E | void {
  // 只在ready=false时进行以下操作
  if (!ready) {
    // 如果发生错误，代表还是未准备好
    ready = !err
    // 设置监听器
    setupListeners()
    // 执行ready回调
    readyHandlers
      .list()
      .forEach(([resolve, reject]) => (err ? reject(err) : resolve()))
    // 重置ready回调列表
    readyHandlers.reset()
  }
  return err
}
```

`markAsReady`函数会标记路由的准备状态，执行通过`isReady`添加的回调。

截止到此，`push`方法也就结束了，此时一个欠完整的的导航解析流程可以更新为：

1. 导航被触发；
2. 调用失活组件中的`beforeRouteLeave`钩子；
3. 调用全局`beforeEach`钩子；
4. 调用重用组件内的`beforeRouteUpdate`钩子；
5. 调用路由配置中的`beforeEnter`钩子；
6. 解析异步路由组件；
7. 调用激活组件中的`beforeRouteEnter`钩子；
8. 调用全局的`beforeResolve`钩子；
9. 导航被确认；
10. 调用全局的`afterEach`钩子；

### 10.3 replace

`replace`与`push`作用几乎相同，如果`push`时指定`replace: true`，那么和直接使用`replace`一致。

```js
function replace(to: RouteLocationRaw | RouteLocationNormalized) {
  return push(assign(locationAsObject(to), { replace: true }))
}
```

这里调用了一个`locationAsObject`，如果`to`是`string`，会调用`parseURL`解析`to`，关于`parseURL`的实现可参考之前`router.resolve`的分析，它的主要作用是将`to`解析成一个含有`fullPath（fullPath = path + searchString + hash）`、`path`（一个绝对路径）、`query`（query对象）、`hash`（#及#之后的字符串）的对象。

```js
function locationAsObject(
  to: RouteLocationRaw | RouteLocationNormalized
): Exclude<RouteLocationRaw, string> | RouteLocationNormalized {
  return typeof to === 'string'
    ? parseURL(parseQuery, to, currentRoute.value.path)
    : assign({}, to)
}
```

### 10.4 总结

简单描述`push`的执行流程：先进行重定向的判断，如果需要重定向，立马指向重定向的路由；然后判断要跳转到的路由地址与`from`的路由地址是否相同，如果相同，在未指定`force`的情况下，会创建一个错误信息，并处理滚动行为；紧接着调用`extractChangingRecords`，将`to`与`from`所匹配到的路由进行分组，并依此提取并执行钩子函数，如果过程中不出错的话，最后会执行`finalizeNavigation`方法，在`finalizeNavigation`调用`routerHistory.reaplce/push`更新历史栈，并处理滚动，最后执行`markAsReady`，将`ready`设置为`true`，并调用通过`isReady`添加的方法。

通过分析`push`的实现过程，我们可以初步得出了一个完整的导航解析流程：

1. 导航被触发；
2. 调用失活组件中的`beforeRouteLeave`钩子；
3. 调用全局`beforeEach`钩子；
4. 调用重用组件内的`beforeRouteUpdate`钩子；
5. 调用路由配置中的`beforeEnter`钩子；
6. 解析异步路由组件；
7. 调用激活组件中的`beforeRouteEnter`钩子；
8. 调用全局的`beforeResolve`钩子；
9. 导航被确认；
10. 调用全局的`afterEach`钩子；

下面我们使用流程图来总结下整个`push`过程：

![vue3-router-push](/Volumes/F/zyl-study/web-zhuawa/20221203/vue3-router-push.png)



# Vue Router源码解析（2/2）

https://www.yuque.com/lpldplws/web/mo0sqg37epmtp41w?singleDoc# 《Vue Router源码解析(2/2)》 密码：bq3h

## 1.课程目标

1. 掌握Vue Router的核心源码；
2. 掌握前端中一个完整的Router需要实现怎样的效果；

## 2.课程大纲

- vue router源码解析

## 3.router.action解析

这里的action主要指代 `router.go`、`router.back`、`router.forward`。

#### 3.1 使用

`go`函数允许你在历史中前进或后退，指定步数如果`>0`，代表前进；`<0`代表后退。

```js
router.go(-2)

router.back()
// 等同于
router.go(-1)

router.forward()
// 等同于
router.go(1)
```

#### 3.2 go

`go`接收一个参数`delta`，表示相对当前页面，移动多少步，负数表示后退，正数表示前进。

```js
const go = (delta: number) => routerHistory.go(delta)
```

在routerHistory.go中会调用history.go，进而触发popstate监听函数。如果你看过之前createWebHistory的解析，你会知道在createWebHistory中通过useHistoryListeners创建historyListeners时，会注册一个popstate监听函数，这个监听函数在调用history.go后就会触发。

```js
// 文件位置：src/history/html5.ts useHistoryListeners方法
window.addEventListener('popstate', popStateHandler)

const popStateHandler: PopStateListener = ({
 state,
}: {
  state: StateEntry | null
}) => {
  // 当前location，字符串
  const to = createCurrentLocation(base, location)
  const from: HistoryLocation = currentLocation.value
  const fromState: StateEntry = historyState.value
  let delta = 0

  // 如果不存在state
  // 关于为什么state可能为空，可参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
  if (state) {
    currentLocation.value = to
    historyState.value = state

    // 如果暂停监听了，并且暂停时的状态是from，直接return
    if (pauseState && pauseState === from) {
      pauseState = null
      return
    }
    // 计算移动的步数
    delta = fromState ? state.position - fromState.position : 0
  } else {
    replace(to)
  }

  // 循环调用监听函数
  listeners.forEach(listener => {
    listener(currentLocation.value, from, {
      delta,
      type: NavigationType.pop,
      direction: delta
        ? delta > 0
          ? NavigationDirection.forward
          : NavigationDirection.back
        : NavigationDirection.unknown,
    })
  })
}
```

可以看到，在监听函数最后会循环调用listeners中的listener，那么listener是什么？什么时候被添加的呢？
在上节课介绍install的实现时，其中有一步非常重要的操作就是要根据地址栏的url进行第一次跳转。而个跳转是通过调用push方法完成的，因为push会调用pushWidthRedirect方法，在pushWidthRedirect中的最后会执行finalizeNavigation（不考虑中间reject错误）。而在finalizeNavigation中的最后会调用一个markAsReady方法。

```js
function markAsReady<E = any>(err?: E): E | void {
  if (!ready) {
    // still not ready if an error happened
    ready = !err
    setupListeners()
    readyHandlers
      .list()
      .forEach(([resolve, reject]) => (err ? reject(err) : resolve()))
    readyHandlers.reset()
  }
  return err
}
```

在markAsReady中调用了setupListeners的一个方法。在这个方法中会调用routerHistory.listen()添加一个函数。

```js
let removeHistoryListener: undefined | null | (() => void)
function setupListeners() {
  // 如果有removeHistoryListener，说明已经添加过listener
  if (removeHistoryListener) return
  // 调用routerHistory.listen添加监听函数，routerHistory.listen返回一个删除这个listener函数
  removeHistoryListener = routerHistory.listen((to, _from, info) => {
    const toLocation = resolve(to) as RouteLocationNormalized

    // 确定是否存在重定向
    const shouldRedirect = handleRedirectRecord(toLocation)
    if (shouldRedirect) {
      pushWithRedirect(
        assign(shouldRedirect, { replace: true }),
        toLocation
      ).catch(noop)
      return
    }

    pendingLocation = toLocation
    const from = currentRoute.value

    // 保存from滚动位置
    if (isBrowser) {
      saveScrollPosition(
        getScrollKey(from.fullPath, info.delta),
        computeScrollPosition()
      )
    }
    
    navigate(toLocation, from)
      .catch((error: NavigationFailure | NavigationRedirectError) => {
        // 导航被取消
        if (
          isNavigationFailure(
            error,
            ErrorTypes.NAVIGATION_ABORTED | ErrorTypes.NAVIGATION_CANCELLED
          )
        ) {
          return error
        }
        // 在钩子中进行了重定向
        if (
          isNavigationFailure(error, ErrorTypes.NAVIGATION_GUARD_REDIRECT)
        ) {
          pushWithRedirect(
            (error as NavigationRedirectError).to,
            toLocation
          )
            .then(failure => {
              // 钩子中的重定向过程中如果导航被取消或导航冗余，回退一步
              if (
                isNavigationFailure(
                  failure,
                  ErrorTypes.NAVIGATION_ABORTED |
                    ErrorTypes.NAVIGATION_DUPLICATED
                ) &&
                !info.delta &&
                info.type === NavigationType.pop
              ) {
                routerHistory.go(-1, false)
              }
            })
            .catch(noop)
          return Promise.reject()
        }
        // 恢复历史记录，，但不触发监听
        if (info.delta) routerHistory.go(-info.delta, false)
        // 无法识别的错误，交给全局错误处理器
        return triggerError(error, toLocation, from)
      })
      .then((failure: NavigationFailure | void) => {
        failure =
          failure ||
          finalizeNavigation(
            toLocation as RouteLocationNormalizedLoaded,
            from,
            false
          )
        
        if (failure) {
          // 如果存在错误信息，回到原始位置，但不触发监听
          if (info.delta) {
            routerHistory.go(-info.delta, false)
          } else if (
            info.type === NavigationType.pop &&
            isNavigationFailure(
              failure,
              ErrorTypes.NAVIGATION_ABORTED | ErrorTypes.NAVIGATION_DUPLICATED
            )
          ) { // 错误类型时导航被取消或冗余，回退历史记录，但不触发监听
            routerHistory.go(-1, false)
          }
        }

        // 触发全局afterEach钩子
        triggerAfterEach(
          toLocation as RouteLocationNormalizedLoaded,
          from,
          failure
        )
      })
      .catch(noop)
  })
}
```

可以看到这个监听函数和`push`的过程十分相似，与`push`不同的是，在触发监听时，一旦出现了一些错误信息（如导航被取消、导航时冗余的、位置错误），需要将历史记录回退到相应位置。

go的执行流程：

![vue3-router-go](/Volumes/F/zyl-study/web-zhuawa/20221203/vue3-router-go.png)

### 3.3 back

`back`，回退一个历史记录，相当于`go(-1)`。

```js
const router = {
  // ...
  back: () => go(-1),
  // ...
}
```

### 3.4 forward

forward，前进一个历史记录，相当于go(1)。

```js
const router = {
  // ...
  forward: () => go(1),
  // ...
}
```

### 3.5. 总结

`go`、`back`、`forward`方法最终通过调用`history.go`方法，触发`popstate`事件（`popstate`中的监听函数在第一次路由跳转时被添加），而在`popstate`事件中的过程和`push`的过程是十分相似的，与`push`不同的是，一旦出现了一些错误信息（如导航被取消、导航时冗余的、位置错误），需要将历史记录回退到相应位置。

## 4. 全局导航守卫解析

### 4.1 使用

全局导航守卫有三种：

- `beforeEach`：在任何导航之前执行。返回一个删除已注册导航守卫的函数；
- `beforeResolve`：在导航解析之前执行。返回一个删除已注册导航守卫的函数；
- `afterEach`：在任何导航之后执行。返回一个删除已注册导航守卫的函数；

```js
const router = createRouter({ // ... })

router.beforeEach = function() { // ... }
router.beforeResolve = function() { // ... }
router.afterEach = function() { // ... }
```

### 4.2 全局导航守卫实现

全局导航守卫和`onError`的实现都是通过维护一个数组进行实现。在`vue-router`中通过一个`useCallbacks`的函数可以创建一个可以重置的列表，全局钩子及`onError`就是通过`useCallbacks`实现。

```js
const beforeGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
const beforeResolveGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
const afterGuards = useCallbacks<NavigationHookAfter>()
let errorHandlers = useCallbacks<_ErrorHandler>()

const router = {
  // ...
  beforeEach: beforeGuards.add,
  beforeResolve: beforeResolveGuards.add,
  afterEach: afterGuards.add,
  onError: errorHandlers.add,
  // ...
}
```

useCallbacks

```js
export function useCallbacks<T>() {
  let handlers: T[] = []

  function add(handler: T): () => void {
    handlers.push(handler)
    return () => {
      const i = handlers.indexOf(handler)
      if (i > -1) handlers.splice(i, 1)
    }
  }

  function reset() {
    handlers = []
  }

  return {
    add,
    list: () => handlers,
    reset,
  }
}
```

`useCallbacks`返回一个对象，该对象有三个属性。其中`list`是内部维护的列表；`add`是一个添加`handler`的函数，它返回一个删除对应`handler`的函数；`reset`是个重置列表的函数。

除此之外，全局导航守卫的具体执行时机同`router.push`。

## 5. isReady解析

### 5.1 使用

```js
router.isReady()
  .then(() => {
    // 成功
  })
  .catch(() => {
    // 失败
  })
```

### 5.2 isReady

isReady不接受任何参数。如果路由器已经完成了初始化导航，那么会立即解析Promise，相反如果还没有完成初始化导航，那么会将resolve和reject放入一个数组中，并添加到一个列表中，等待初始化导航完成进行触发。

```js
let readyHandlers = useCallbacks<OnReadyCallback>()

function isReady(): Promise<void> {
  // ready为true并且当前路由不是初始路由，导航已经初始化完毕，立即解析promise
  if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
    return Promise.resolve()
  // 相反，会将resolve、reject存入一个列表
  return new Promise((resolve, reject) => {
    readyHandlers.add([resolve, reject])
  })
}
```

在之前解析的push过程中，无论过程中是否有错误信息，都会执行一个markAsReady函数。在markAsReady中会将isReady处理函数进行触发，触发完毕后，会将列表清空。

```js
function markAsReady<E = any>(err?: E): E | void {
  if (!ready) {
    // 如果存在err，说明还未准备好，如果不存在err，那么说明初始化导航已经完成，ready变为true，之后就不会再进入这个分支
    ready = !err
    // 设置popstate监听函数
    setupListeners()
    // 触发ready处理函数，有错误执行reject(err)，没有执行resolve()
    readyHandlers
      .list()
      .forEach(([resolve, reject]) => (err ? reject(err) : resolve()))
    // 执行完，清空列表
    readyHandlers.reset()
  }
  return err
}
```

## 6. onBeforeRouteLeave、onBeforeRouteUpdate解析

### 6.1 使用

`onBeforeRouteLeave`、`onBeforeRouteUpdate`是`vue-router`提供的两个`composition api`，它们只能被用于`setup`中。

```js
export default {
  setup() {
    onBeforeRouteLeave() {}
    
    onBeforeRouteUpdate() {}
  }
}
```

### 6.2 onBeforeRouteLeave

```js
export function onBeforeRouteLeave(leaveGuard: NavigationGuard) {
  // 开发模式下没有组件实例，进行提示并return
  if (__DEV__ && !getCurrentInstance()) {
    warn(
      'getCurrentInstance() returned null. onBeforeRouteLeave() must be called at the top of a setup function'
    )
    return
  }

  // matchedRouteKey是在RouterView中进行provide的，表示当前组件所匹配到到的路由记录（经过标准化处理的）
  const activeRecord: RouteRecordNormalized | undefined = inject(
    matchedRouteKey,
    // to avoid warning
    {} as any
  ).value

  if (!activeRecord) {
    __DEV__ &&
      warn(
        'No active route record was found when calling `onBeforeRouteLeave()`. Make sure you call this function inside of a component child of <router-view>. Maybe you called it inside of App.vue?'
      )
    return
  }

  // 注册钩子
  registerGuard(activeRecord, 'leaveGuards', leaveGuard)
}
```

因为`onBeforeRouteLeave`是作用在组件上的，所以`onBeforeRouteLeave`开头就需要检查当前是否有vue实例（只在开发环境下），如果没有实例进行提示并`return`。

```js
if (__DEV__ && !getCurrentInstance()) {
  warn(
    'getCurrentInstance() returned null. onBeforeRouteLeave() must be called at the top of a setup function'
  )
  return
}
```

然后使用`inject`获取一个`matchedRouteKey`，并赋给一个`activeRecord`，那么个`activeRecord`是个什么呢？

```js
const activeRecord: RouteRecordNormalized | undefined = inject(
  matchedRouteKey,
  // to avoid warning
  {} as any
).value
```

要想知道`activeRecord`是什么，我们就需要知道`matchedRouteKey`是什么时候`provide`的。因为`onBeforeRouteLeave`式作用在路由组件中的，而路由组件一定是`RouterView`的子孙组件，所以我们可以从`RouterView`中找一下答案。

在`RouterView`中的`setup`有这么几行代码：

```js
setup(props, ...) {
  // ...
  const injectedRoute = inject(routerViewLocationKey)!
  const routeToDisplay = computed(() => props.route || injectedRoute.value)
  const depth = inject(viewDepthKey, 0)
  const matchedRouteRef = computed<RouteLocationMatched | undefined>(
    () => routeToDisplay.value.matched[depth]
  )

  provide(viewDepthKey, depth + 1)
  provide(matchedRouteKey, matchedRouteRef)
  provide(routerViewLocationKey, routeToDisplay)
  // ...
}
```

可以看到就是在`RouterView`中进行了`provide(matchedRouteKey, matchedRouteRef)`的，那么`matchedRouteRef`是什么呢？

首先`matchedRouteRef`是个计算属性，它的返回值是`routeToDisplay.value.matched[depth]`。接着我们看`routeToDisplay`和`depth`，先看`routeToDisplay`，`routeToDisplay`也是个计算属性，它的值是`props.route`或`injectedRoute.value`，因为`props.route`使用户传递的，所以这里我们只看`injectedRoute.value`，`injectedRoute`也是通过`inject`获取的，获取的`key`是`routerViewLocationKey`。看到这个`key`是不是有点熟悉，在`vue-router`进行`install`中向`app`中注入了几个变量，其中就有`routerViewLocationKey`。

```js
install(app) {
  //...
  app.provide(routerKey, router)
  app.provide(routeLocationKey, reactive(reactiveRoute))
  // currentRoute路由标准化对象
  app.provide(routerViewLocationKey, currentRoute)
  //...
}
```

现在我们知道routeToDisplay是当前路由的标准化对象。接下来看depth是什么。depth也是通过inject(viewDepthKey)的方式获取的，但它有默认值，默认是0。你会发现紧跟着有一行provide(viewDepthKey, depth + 1)，RouterView又把viewDepthKey注入进去了，不过这次值加了1。为什么这么做呢？
我们知道RouterView是允许嵌套的，来看下面代码：

```js
<RouterView>
  <RouterView>
    <RouterView />
  </RouterView>
</RouterView>
```

在第一层RouterView中，因为找不到对应的viewDepthKey，所以depth是0，然后将viewDepthKey注入进去，并+1；在第二层中，我们可以找到viewDepthKey（在第一次中注入），depth为1，然后再将viewDepthKey注入，并+1，此时viewDepthKey的值会覆盖第一层的注入；在第三层中，我们也可以找到viewDepthKey（在二层中注入，并覆盖了第一层的值），此时depth为2。是不是发现了什么？depth其实代表当前RouterView在嵌套RouterView中的深度（从0开始）。
现在我们知道了routeToDisplay和depth，现在我们看routeToDisplay.value.matched[depth]。我们知道routeToDisplay.value.matched中存储的是当前路由所匹配到的路由，并且他的顺序是父路由在子路由前。那么索引为depth的路由有什么特别含义呢？我们看下面一个例子：

```js
// 注册的路由表
const router = createRouter({
  // ...
  routes: {
    path: '/parent',
    component: Parent,
    name: 'Parent',
    children: [
      {
        path: 'child',
        name: 'Child',
        component: Child,
        children: [
          {
            name: 'ChildChild',
            path: 'childchild',
            component: ChildChild,
          },
        ],
      },
    ],
  }
})
```

```js
<!-- Parent -->
<template>
  <div>
    <p>parent</p>
    <router-view></router-view>
  </div>
</template>

<!-- Child -->
<template>
  <div>
    <p>child</p>
    <router-view></router-view>
  </div>
</template>

<!-- ChildChild -->
<template>
  <div>
    <p>childchild</p>
  </div>
</template>
```

使用`router.resolve({ name: 'ChildChild' })`，打印其结果，观察matched属性。

1. 在第一层`RouterView`中，`depth`为0，`matched[0]`为`{path:'/parent', name: 'Parent', ...}`(此处只列几个关键属性)，`level`为1；
2. 在第二层`RouterView`中，`depth`为1，`matched[1]`为`{path:'/parent/child', name: 'Child', ...}`，`level`为2；
3. 在第三层`RouterView`中，`depth`为2，`matched[2]`为`{path:'/parent/child/childchild', name: 'ChildChild', ...}`，`level`为3；

通过观察，`depth`的值与路由的匹配顺序刚好一致。`matched[depth].name`恰好与当前`resolve`的`name`一致。也就是说`onBeforeRouteLeave`中的`activeRecord`当前组件所匹配到的路由。

接下来看下钩子时如何注册的？在`onBeforeRouteLeave`，会调用一个`registerGuard`函数，`registerGuard`接收三个参数：

1. `record`（所在组件所匹配到的标准化路由）；
2. `name`（钩子名，只能取leaveGuards、updateGuards之一）;
3. `guard`（待添加的导航守卫）;

```js
function registerGuard(
  record: RouteRecordNormalized,
  name: 'leaveGuards' | 'updateGuards',
  guard: NavigationGuard
) {
  // 一个删除钩子的函数
  const removeFromList = () => {
    record[name].delete(guard)
  }

  // 卸载后移除钩子
  onUnmounted(removeFromList)
  // 被keep-alive缓存的组件失活时移除钩子
  onDeactivated(removeFromList)

  // 被keep-alive缓存的组件激活时添加钩子
  onActivated(() => {
    record[name].add(guard)
  })

  // 添加钩子，record[name]是个set，在路由标准化时处理的
  record[name].add(guard)
}
```

### 6.3 onBeforeRouteUpdate

onBeforeRouteUpdate的实现与onBeforeRouteLeave的实现完全一致，只是调用registerGuard传递的参数不一样。

```js
export function onBeforeRouteUpdate(updateGuard: NavigationGuard) {
  if (__DEV__ && !getCurrentInstance()) {
    warn(
      'getCurrentInstance() returned null. onBeforeRouteUpdate() must be called at the top of a setup function'
    )
    return
  }

  const activeRecord: RouteRecordNormalized | undefined = inject(
    matchedRouteKey,
    // to avoid warning
    {} as any
  ).value

  if (!activeRecord) {
    __DEV__ &&
      warn(
        'No active route record was found when calling `onBeforeRouteUpdate()`. Make sure you call this function inside of a component child of <router-view>. Maybe you called it inside of App.vue?'
      )
    return
  }

  registerGuard(activeRecord, 'updateGuards', updateGuard)
}
```

## 7. useRoute、useRouter、useLink解析

### 7.1 使用

```typescript
<script lant="ts" setup>
  import { useRouter, useRoute } from 'vue-router'
  
  // router为创建的router实例
  const router = useRouter()
  // currentRoute当前路由
  const currentRoute = useRoute()
</script>
```

使用useLink可以自定义我们自己的RouterLink，如下面自定的MyRouterLink，如果是外部链接，我们需要让它新打开一个页面。

```typescript
<template>
  <a
    v-if="isExternalLink"
    v-bind="$attrs"
    :class="classes"
    :href="to"
    target="_blank"
  >
    <slot />
  </a>
  <a
    v-else
    v-bind="$attrs"
    :class="classes"
    :href="href"
    @click="navigate"
  >
    <slot />
  </a>
</template>

<script lang="ts">
export default {
  name: 'MyRouterLink',
}
</script>

<script lang="ts" setup>
import { useLink, useRoute, RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  // @ts-ignore
  ...RouterLink.props
})

const { route, href, navigate, isActive, isExactActive  } = useLink(props)

const isExternalLink= computed(() => typeof props.to === 'string' && props.to.startsWith('http'))

const currentRoute = useRoute()

const classes = computed(() => ({
  'router-link-active':
    isActive.value || currentRoute.path.startsWith(route.value.path),
  'router-link-exact-active':
    isExactActive.value || currentRoute.path === route.value.path,
}))
</script>
```

`MyRouterLink`使用：

```js
<my-router-link to="https://www.xxx.com">MyRouterLink External Link</my-router-link>
<my-router-link to="/home">MyRouterLink /home</my-router-link>
```

### 7.2 useRouter、useRoute

```typescript
export function useRouter(): Router {
  return inject(routerKey)!
}

export function useRoute(): RouteLocationNormalizedLoaded {
  return inject(routeLocationKey)!
}
```

useRouter和useRoute都是使用inject来进行获取对应值。对应值都是在install过程中注入的。

```js
install(app) {
  // ...
  app.provide(routerKey, router)
  app.provide(routeLocationKey, reactive(reactiveRoute))
  // ...
}
```

### 7.3 useLink

```typescript
export function useLink(props: UseLinkOptions) {
  // router实例
  const router = inject(routerKey)!
  // 当前路由地址
  const currentRoute = inject(routeLocationKey)!

  // 目标路由相关信息
  const route = computed(() => router.resolve(unref(props.to)))

  // 被激活记录的索引
  const activeRecordIndex = computed<number>(() => {
    const { matched } = route.value
    const { length } = matched
    // 目标路由所匹配到的完整路由
    const routeMatched: RouteRecord | undefined = matched[length - 1]
    const currentMatched = currentRoute.matched
    // 如果没有匹配到的目标路由或当前路由也没有匹配到的路由返回-1
    if (!routeMatched || !currentMatched.length) return -1
    // 在当前路由所匹配到的路由中寻找目标路由
    const index = currentMatched.findIndex(
      isSameRouteRecord.bind(null, routeMatched)
    )
    if (index > -1) return index
    // 目标路由匹配到的路由的父路由的path（如果父路由是由别名产生，取源路由的path）
    const parentRecordPath = getOriginalPath(
      matched[length - 2] as RouteRecord | undefined
    )
    return (
      length > 1 &&
        // 如果目标路由的父路由与
        getOriginalPath(routeMatched) === parentRecordPath &&
        // 避免将孩子与父路由比较
        currentMatched[currentMatched.length - 1].path !== parentRecordPath
        ? currentMatched.findIndex(
            isSameRouteRecord.bind(null, matched[length - 2])
          )
        : index
    )
  })

  // 当前router-link是否处于激活状态，activeRecordIndex大于-1并且，当前路由的params与目标路由的params相同
  const isActive = computed<boolean>(
    () =>
      activeRecordIndex.value > -1 &&
      includesParams(currentRoute.params, route.value.params)
  )
  // 是否完全匹配，目标路由必须和当前路由所匹配到的路由最后一个相同
  const isExactActive = computed<boolean>(
    () =>
      activeRecordIndex.value > -1 &&
      activeRecordIndex.value === currentRoute.matched.length - 1 &&
      isSameRouteLocationParams(currentRoute.params, route.value.params)
  )

  // 利用push或replace进行路由跳转
  function navigate(
    e: MouseEvent = {} as MouseEvent
  ): Promise<void | NavigationFailure> {
    // 对于一些特殊情况，不能进行跳转
    if (guardEvent(e)) {
      return router[unref(props.replace) ? 'replace' : 'push'](
        unref(props.to)
      ).catch(noop)
    }
    return Promise.resolve()
  }

  // devtools only
  if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
    // ...
  }

  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate,
  }
}
```

在进行路由跳转时，一些特殊情况下是不能跳转的，这些情况包括：

1. 按住了`window`⊞（MAC的`commond`）键、`alt`键、`ctrl`键、`shift`键中的任一键；
2. 调用过`e.preventDefault()`；
3. 右键；
4. `target='_blank'`；

```typescript
function guardEvent(e: MouseEvent) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  // @ts-expect-error getAttribute does exist
  if (e.currentTarget && e.currentTarget.getAttribute) {
    // @ts-expect-error getAttribute exists
    const target = e.currentTarget.getAttribute('target')
    if (/\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) e.preventDefault()

  return true
}
```

## 8. RouterLink解析

## 8.1使用

```js
<RouterLink
 to="/inex"
 reaplace
 custom
 activeClass="active"
 exactActiveClass="exact-active"
 ariaCurrentValue="page"
>To Index Page</RouterLink>
```

### 8.2 RouterLink

```js
export const RouterLinkImpl = /*#__PURE__*/ defineComponent({
  name: 'RouterLink',
  props: {
    // 目标路由的链接
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    // 决定是否调用router.push()还是router.replace()
    replace: Boolean,
    // 链接被激活时，用于渲染a标签的class
    activeClass: String,
    // inactiveClass: String,
    // 链接精准激活时，用于渲染a标签的class
    exactActiveClass: String,
    // 是否不应该将内容包裹在<a/>标签中
    custom: Boolean,
    // 传递给aria-current属性的值。https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
    ariaCurrentValue: {
      type: String as PropType<RouterLinkProps['ariaCurrentValue']>,
      default: 'page',
    },
  },
  useLink,

  setup(props, { slots }) {
    // 使用useLink创建router-link所需的一些属性和行为
    const link = reactive(useLink(props))
    // createRouter时传入的options
    const { options } = inject(routerKey)!

    // class对象
    const elClass = computed(() => ({
      [getLinkClass(
        props.activeClass,
        options.linkActiveClass,
        'router-link-active'
      )]: link.isActive, // 被激活时的class
      [getLinkClass(
        props.exactActiveClass,
        options.linkExactActiveClass,
        'router-link-exact-active'
      )]: link.isExactActive, // 被精准激活的class
    }))

    return () => {
      // 默认插槽
      const children = slots.default && slots.default(link)
      // 如果设置了props.custom，直接显示chldren，反之需要使用a标签包裹
      return props.custom
        ? children
        : h(
            'a',
            {
              'aria-current': link.isExactActive
                ? props.ariaCurrentValue
                : null,
              href: link.href,
              onClick: link.navigate,
              class: elClass.value,
            },
            children
          )
    }
  },
})

export const RouterLink = RouterLinkImpl as unknown as {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps &
      RouterLinkProps

    $slots: {
      default: (arg: UnwrapRef<ReturnType<typeof useLink>>) => VNode[]
    }
  }
  useLink: typeof useLink
}
```

## 9. RouterView解析

### 9.1 使用

```js
<RouterView></RouterView>
```

### 9.2 RouterView

```js
export const RouterViewImpl = /*#__PURE__*/ defineComponent({
  name: 'RouterView',
  inheritAttrs: false,
  props: {
    // 如果设置了name，渲染对应路由配置下中components下的相应组件
    name: {
      type: String as PropType<string>,
      default: 'default',
    },
    route: Object as PropType<RouteLocationNormalizedLoaded>,
  },

  // 为@vue/compat提供更好的兼容性
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },

  setup(props, { attrs, slots }) {
    // 如果<router-view>的父节点是<keep-alive>或<transition>进行提示
    __DEV__ && warnDeprecatedUsage()

    // 当前路由
    const injectedRoute = inject(routerViewLocationKey)!
    // 要展示的路由，优先取props.route
    const routeToDisplay = computed(() => props.route || injectedRoute.value)
    // router-view的深度，从0开始
    const depth = inject(viewDepthKey, 0)
    // 要展示的路由匹配到的路由
    const matchedRouteRef = computed<RouteLocationMatched | undefined>(
      () => routeToDisplay.value.matched[depth]
    )

    provide(viewDepthKey, depth + 1)
    provide(matchedRouteKey, matchedRouteRef)
    provide(routerViewLocationKey, routeToDisplay)

    const viewRef = ref<ComponentPublicInstance>()
    
    watch(
      () => [viewRef.value, matchedRouteRef.value, props.name] as const,
      ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          // 当导航到一个新的路由，更新组件实例
          to.instances[name] = instance
          // 组件实例被应用于不同路由
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards
            }
          }
        }

        // 触发beforeRouteEnter next回调
        if (
          instance &&
          to &&
          (!from || !isSameRouteRecord(to, from) || !oldInstance)
        ) {
          ;(to.enterCallbacks[name] || []).forEach(callback =>
            callback(instance)
          )
        }
      },
      { flush: 'post' }
    )

    return () => {
      const route = routeToDisplay.value
      const matchedRoute = matchedRouteRef.value
      // 需要显示的组件
      const ViewComponent = matchedRoute && matchedRoute.components[props.name]
      const currentName = props.name

      // 如果找不到对应组件，使用默认的插槽
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route })
      }

      // 路由中的定义的props
      const routePropsOption = matchedRoute!.props[props.name]
      // 如果routePropsOption为空，取null
      // 如果routePropsOption为true，取route.params
      // 如果routePropsOption是函数，取函数返回值
      // 其他情况取routePropsOption
      const routeProps = routePropsOption
        ? routePropsOption === true
          ? route.params
          : typeof routePropsOption === 'function'
          ? routePropsOption(route)
          : routePropsOption
        : null

      // 当组件实例被卸载时，删除组件实例以防止泄露
      const onVnodeUnmounted: VNodeProps['onVnodeUnmounted'] = vnode => {
        if (vnode.component!.isUnmounted) {
          matchedRoute!.instances[currentName] = null
        }
      }

      // 生成组件
      const component = h(
        ViewComponent,
        assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef,
        })
      )

      if (
        (__DEV__ || __FEATURE_PROD_DEVTOOLS__) &&
        isBrowser &&
        component.ref
      ) {
        // ...
      }

      return (
        // 有默认插槽则使用默认默认插槽，否则直接使用component
        normalizeSlot(slots.default, { Component: component, route }) ||
        component
      )
    }
  },
})
```

为了更好理解router-view的渲染过程，我们看下面的例子：
先规定我们的路由表如下：

```js
const router = createRouter({
  // ...
  // Home和Parent都是两个简单组件
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
    },
    {
      name: 'Parent',
      path: '/parent',
      component: Parent,
    },
  ]
})
```

假设我们的地址是`http://localhost:3000`。现在我们访问`http://localhost:3000`，肯定能够想到`router-view`中显示的肯定是`Home`组件。那么它是怎样渲染出来的呢？

首先我们要知道`vue-router`在进行`install`时，会进行第一次的路由跳转并立马向`app`注入一个默认的`currentRoute（START_LOCATION_NORMALIZED）`，此时`router-view`会根据这个`currentRoute`进行第一次渲染。因为这个默认的`currentRoute`中的`matched`是空的，所以第一次渲染的结果是空的。等到第一次路由跳转完毕后，会执行一个`finalizeNavigation`方法，在这个方法中更新`currentRoute`，这时在`currentRoute`中就可以找到需要渲染的组件`Home`，`router-view`完成第二次渲染。第二次完成渲染后，紧接着触发`router-view`中的`watch`，将最新的组件实例赋给`to.instance[name]`，并循环执行`to.enterCallbacks[name]`通过在钩子中使用next()添加的函数，过程结束。

然后我们从`http://localhost:3000`跳转至`http://localhost:3000/parent`，假设使用`push`进行跳转，同样在跳转完成后会执行`finalizeNavigation`，更新`currentRoute`，这时`router-view`监听到`currentRoute`的变化，找到需要渲染的组件，将其显示。在渲染前先执行旧组件卸载钩子，将路由对应的`instance`重置为`null`。渲染完成后，接着触发`watch`，将最新的组件实例赋给`to.instance[name]`，并循环执行`to.enterCallbacks[name]`，过程结束。

在之前分析`router.push`的过程中，我们曾经得到过一个欠完整的导航解析流程，那么在这里我们可以将其补齐了：

1. 导航被触发；
2. 调用失活组件中的`beforeRouteLeave`钩子；
3. 调用全局`beforeEach`钩子；
4. 调用重用组件内的`beforeRouteUpdate`钩子；
5. 调用路由配置中的`beforeEnter`钩子；
6. 解析异步路由组件；
7. 调用激活组件中的`beforeRouteEnter`钩子；
8. 调用全局的`beforeResolve`钩子；
9. 导航被确认；
10. 调用全局的`afterEach`钩子；
11. DOM更新；
12. 调用`beforeRouteEnter`守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入；

### 9.3 总结

router-view根据currentRoute及depth找到匹配到的路由，然后根据props.name、slots.default来确定需要展示的组件。



Vue2 diff 双端比较

vue3 diff 优化点

vue2全部需要比较，全量diff

vue3则是：

1. 静态标记+非全量diff
2. 最长递增子序列，对于最长递增子序列不移动位置,dom的操作变少了

# vue实战

## 1.课程目标

https://www.yuque.com/lpldplws/web/qpafpkpkcfufkgtl?singleDoc# 《Vue实战》 密码：fw42

1. 通过Vue3 + Vite实现一个完整的Vue项目；

## 2. 课程大纲

- Vue3 + Vite初始化配置；
- 项目布局设置；

## 3. vue3+vite初始化

### 3.1 创建项目

首先我们要创建一个 Vue3+Vite 项目，目前 Vue 官方创建项目时默认就是 Vite 构建了，所以直接按照官网来就可以，如下：
确保你安装了最新版本的 [Node.js](https://nodejs.org/en/)，然后在命令行中运行以下命令：

```b
npm init vue@latest

# or

pnpm create vue@latest
```

这一指令将会安装并执行 [create-vue](https://github.com/vuejs/create-vue)，它是 Vue 官方的项目脚手架工具。你将会看到一些诸如 TypeScript 和测试支持之类的可选功能提示，我们的选择如下：

```js
✔ Project name（项目名）: xianzao-vue-tools
✔ Add TypeScript（添加TS）? : No
✔ Add JSX Support（添加JSX支持）? : No
✔ Add Vue Router for Single Page Application development（添加Vue-router）? : Yes
✔ Add Pinia for state management（添加状态管理Pinia）? : Yes
✔ Add Vitest for Unit testing（为单元测试添加Vitest）? : No
✔ Add Cypress for both Unit and End-to-End testing（为单元测试与端到端测试添加Cypress）? : No
✔ Add ESLint for code quality（为代码质量添加ESLint）? : Yes
✔ Add Prettier for code formatting（为代码格式添加Prettier）? : Yes

Scaffolding project in ./tooldog...
Done.
```

到这一步就创建好了项目，按照提示执行：

```js
cd xianzao-vue-tools
npm install
npm run lint
npm run dev
```

能够正常打开页面：

![vue打开正常页面](/Volumes/F/zyl-study/web-zhuawa/20221203/vue打开正常页面.png)

如果遇到了类似的报错：

```
Error: Cannot find module'node:url'
```

原因是使用了node相对较高版本的代码：

```js
// vite.config.js 中引入 node url 模块时使用了 'node:url'
// 详见：https://nodejs.org/dist/latest-v16.x/docs/api/url.html#url
import { fileURLToPath, URL } from 'node:url'
```

Vue 官方文档上明确说了开始项目之前，请确保安装了最新版本的 NodeJS，我们的 node 版本要在 v16+ 。
这里推荐大家安装nvm和nrm，没有使用过的可以自行搜索。
nvm：npm的包版本管理工具；
nrm：设置npm源的管理工具；
常见的指令如下：

- nvm：

```js
nvm ls-remote # 查看node所有版本
nvm install node # 安装最新node可用版本
nvm version/nvm current # 查看当前nvm使用node版本
nvm list available # 查看可安装node版本
nvm list/nvm ls # 查看已安装版本
nvm install <version> # 安装指定node版本
nvm uninstall <version> # 卸载指定node版本
nvm use <version> # 切换使用指定版本node
nvm use [version] [arch] # 切换指定node版本和位数
nvm reinstall-packages <version> # 在当前版本node环境下，重新全局安装指定版本号的npm包

nvm on # 打开nodejs控制
nvm off # 关闭nodejs控制
nvm alias <name> <version> # 给不同的版本号添加别名
nvm unalias <name> # 删除已定义别名
nvm proxy # 查看设置与代理
nvm node_mirror [url] # 设置setting.txt中的node_mirror，如果不设置的默认是 https://nodejs.org/dist/
nvm npm_mirror [url] # 设置setting.txt中的npm_mirror,如果不设置的话默认的是： https://github.com/npm/npm/archive/.
nvm root [path] # 设置和查看root路径
```

补充：在软件工程中，常见的软件版本型号（也是nvm的版本型号）

```bash
Dev # 开发版，频繁出新功能，另外还修复了一些Bug和不稳定因素
Alpha # 软件或系统的内部测试版本，会有不少Bug，仅内部人员使用浏览器
Beta # 软件或系统的测试版本，这一版本一般是在Alpha版本后，会有不少新功能，同时也有很多Bug
Gamma # 软件或系统接近于成熟的版本，只须要作一些小的改进就能发行测试
RC # 发行候选版本，和Beta版最大的差别在于Beta阶段会一直加入新的功能，但是到了RC版本，几乎不会加入新功能，主要在于除错。RC版本是最终发放给用户的最接近正式版的版本，发行后改正bug就是正式版，正式版之前的最后一个测试版。
Release # 正式发布版本，最终交付用户使用的一个版本，该版本也称为标准版，也可用符号 ® 表示
GA # 也代表正式发布版本，这个版本也是正式版本，国外大多都是用GA来说明Release版本
Stable # 稳定版，在开源软件中，都有stable版，就是开源软件的最终发行版，此版本一般基于Beta版，已知Bug都被修复，一般情况下更新较慢
LTS # 长期支持版，这一版本会持续进行支持，最早用在 Ubuntu
```

所以，LTS 就是长期支持版，在 node 中它代表此版本会长期进行支持，很稳定，放心使用的意思。
而 Latest 就是字面理解的最新版本的意思。
而大家可能接触比较少的Gallium 其实就是 node 发版对应的一个代号，这个就比较随意了，就是个情怀，比如大家耳熟能详的 Vue ，扒一扒发版记录，它的每次发版都有代号：

```bash
Vue3.0 # One Piece：海贼王
Vue2.7 # Naruto：火影忍者
Vue2.6 # Macross：超时空要塞
Vue2.5 # Level E：灵异E接触
Vue2.4 # Kill la Kill：斩服少女
Vue2.3 # JoJo's Bizarre Adventure：JoJo的奇妙冒险
Vue2.2 # Initial D：头文字D 
Vue2.1 # Hunter X Hunter：全职猎人
Vue2.0 # Ghost in the Shell：攻壳机动队
Vue1.0 # Evangelion：新世纪福音战士
Vue0.12 # Dragon Ball：龙珠
Vue0.11 # Cowboy Bebop：星际牛仔
Vue0.10 # Blade Runner：银翼杀手
Vue0.9  # Animatrix：黑客帝国动画版
```

- nrm

```bash
nrm -h /nrm -help  # 查看 nrm 帮助（相关命令、信息）
nrm -V             # 查看当前 nrm 版本
nrm ls             # 查看当前 nrm 中可用的镜像源地址
nrm current        # 查看当前使用镜像源

nrm use <registry> # 切换为某个镜像源 registry-镜像源名
nrm add <registry> <url> # 添加一个镜像源 registry-镜像源名 url-镜像源地址
nrm del <registry>  # 删除一个镜像源
nrm test <registry> # 测试该镜像源下载响应时间
```

### 3.2项目配置

到此我们已经初步创建并启动了项目，其实很多人只关注代码开发相关的文件，并不会去纠结项目中和核心开发无关配置文件的作用，这是不对的，我们应该对自己的项目做到极致掌控，了解项目中每一个文件每一行代码对项目的作用，接下来就来一起看看我们创建的项目中所有文件的作用吧！

在初始化创建项目时，默认创建了很多子文件（一些组件、样式文件等等），我们先把不需要的项目无关文件删干净，需要我们处理的无用文件都在 `src` 文件夹下：

- 删除 `src/views` 下所有文件
- 删除 `src/stores` 下所有文件
- 删除 `src/components` 下所有文件
- 删除 `src/assets` 下所有文件

清除干净之后，我们在 `src/views` 文件夹下新建一个 `HomePage.vue` 文件：

```js
<script setup></script>

<template>
  <div>hello xianzao, This is home page!</div>
</template>

<style scoped></style>
```

修改一下 `router/index.js` 路由文件，删掉之前页面的路由，加上 `HomePage` 页面的路由：

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/views/HomePage.vue')
    }
  ]
})

export default router
```

修改一下项目根组件src/App.vue 的内容：

```js
<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
```

最后，项目入口文件里，有一行 css 样式的引入，删除掉

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 删除掉，css文件已经删除过了
// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

运行没有问题后，至此，实现了项目的初始化配置。

#### 3.2.1 安装组件库

这里我们用字节的 [arco.design](https://arco.design/vue/docs/start) （主要没用过，可以尝试下）。

```bash
npm install --save-dev @arco-design/web-vue

# or 

pnpm add -D @arco-design/web-vue
```

接下来，配置按需加载，我们使用 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) 和 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 这两款 `vite` 插件来开启按需加载及自动导入，插件会自动解析模板中的使用到的组件，并导入组件和对应的样式文件。

这两个插件一个是自动帮我们引入一些组件和指令（只做 `HTML` 中使用的常规组件例如各种 `.vue` 组件的引入以及指令的自动引入），另一个是自动帮我们做一些 `API` 组件的自动引入（像直接在 `script` 中引入的必须用 `API` 调用的 `Message` 组件以及后面我们还会用它做 `Vue` 的一些 `API` 自动引入等等）

```js
npm i unplugin-vue-components -D
npm i -D unplugin-auto-import

# or

pnpm add -D unplugin-vue-components
pnpm add -D unplugin-auto-import
```

在 `vite.config.js` 文件中配置使用一下插件：

```js
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

可以看到上面我们在 `unplugin-vue-components/resolvers` 中导出了一个 `ArcoResolver` ，它是什么呢？

其实，它是插件内置的解析器，像常用的组件库（`element`、`antd` 等）自动引入的一些配置都被内置了，[查看内置支持的组件库解析器](https://github.com/antfu/unplugin-vue-components#importing-from-ui-libraries)，我们只需要导出对应 UI库 的解析器用就可以了。

OK，现在组件库和自动引入都做好了，先试一试，我们在 `home` 页面分别用 `ArcoVue` 的普通按钮 `AButton` 组件和全局提示 `AMessage` 组件试一试。

```js
<script setup>
const handleClickMini = () => {
  AMessage.info("hello xianzao, click mini AButton!");
};
</script>
<template>
  <div>hello xianzao, This is home page!</div>
  <a-space>
    <a-button type="primary" size="mini" @click="handleClickMini"
      >Mini</a-button
    >
    <a-button type="primary" size="small">Small</a-button>
    <a-button type="primary">Medium</a-button>
    <a-button type="primary" size="large">Large</a-button>
  </a-space>
</template>
<style scoped lang="scss"></style>
```

接下来就可以在项目内不引入组件，随意使用组件库中的组件了

这里强烈建议大家，可以好好参考下这两个插件的实现，后续按照此类实现，就不用在项目中重复引入组件代码了。

![vue-arcoVue组件展示](/Volumes/F/zyl-study/web-zhuawa/20221203/vue-arcoVue组件展示.png)

#### 3.2.2 配置项目内组件 & api的自动引入

我们在使用 `Vue` 的过程中，每个 `script` 以及 `js` 文件中或多或少需要引入一些像 `ref`、`reactive` 等 `VueAPI`，包括 `VueRouter`、`Pinia` 等都要引入一些 API，还有我们自己写的组件也都需要我们手动去引入使用。

那既然配置了组件库自动引入，我们接下来也配置API、以及页面组件的自动引入。

还是在 `vite.config.js` 文件中进行修改：

```js
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 需要去解析的文件
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // imports 指定自动引入的包位置（名）
      imports: ["vue", "pinia", "vue-router"],
      // 生成相应的自动导入json文件。
      eslintrc: {
        // 启用
        enabled: true,
        // 生成自动导入json文件位置
        filepath: "./.eslintrc-auto-import.json",
        // 全局属性值
        globalsPropValue: true,
      },
      resolvers: [ArcoResolver()],
    }),
    Components({
      // imports 指定组件所在目录，默认为 src/components
      dirs: ["src/components/", "src/view/"],
      // 需要去解析的文件
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

如上，在 API 自动引入插件 AutoImport 中我们写了指定要去解析的文件 include 配置，然后在 import 选项中指定了自动引入的包名，并且所有自动引入的 API 在被自动引入时会添加记录到根目录的 ./.eslintrc-auto-import.json 文件中，方便我们查看都自动引入了哪些东西，后面我们使用这几个包的 API ，就不需要手动引入了，插件会帮我们在文件解析时自动引入。

同样的，在组件自动引入插件 Components 中，我们配置了指定要去解析的文件 include 配置，然后在 import 选项中指定了自动引入的组件目录，以后只要是在这几个目录下写的组件，我们在使用时都必须要手动去引入了

ok，我们来试一下。

我们在 src/components 文件夹下新建一个 HelloWorld.vue 文件，写上下面内容。

```js
<script setup>
const name = ref("xianzao");
</script>
<template>
  <div>hello {{ name }}, this is helloworld components</div>
</template>

<style scoped></style>
```

然后，直接在 `src/views/HomePage.vue` 文件中使用 `HelloWorld` 组件，不要引入，如下：

```js
<script setup>
const handleClickMini = () => {
  AMessage.info("hello xianzao, click mini AButton!");
};
</script>
<template>
  <div>hello xianzao, This is home page!</div>
  <a-space>
    <a-button type="primary" size="mini" @click="handleClickMini"
      >Mini</a-button
    >
    <a-button type="primary" size="small">Small</a-button>
    <a-button type="primary">Medium</a-button>
    <a-button type="primary" size="large">Large</a-button>
  </a-space>

  <!-- 这里 -->
  <HelloWorld />
</template>
<style scoped lang="scss"></style>
```

然后，直接在 `src/views/HomePage.vue` 文件中使用 `HelloWorld` 组件，不要引入，如下：

```js
<script setup>
const handleClickMini = () => {
  AMessage.info("hello xianzao, click mini AButton!");
};
</script>
<template>
  <div>hello xianzao, This is home page!</div>
  <a-space>
    <a-button type="primary" size="mini" @click="handleClickMini"
      >Mini</a-button
    >
    <a-button type="primary" size="small">Small</a-button>
    <a-button type="primary">Medium</a-button>
    <a-button type="primary" size="large">Large</a-button>
  </a-space>

  <!-- 这里 -->
  <HelloWorld />
</template>
<style scoped lang="scss"></style>
```

这里我们在创建的 `HelloWorld` 组件中使用了 Vue 的 `ref API`，并没有引入它，而后在 `HomePage` 页面中使用该组件也没有引入，效果如下：

![vue-arcoVue组件展示2](/Volumes/F/zyl-study/web-zhuawa/20221203/vue-arcoVue组件展示2.png)

后面我们使用 `Vue`、`VueRouter`、`Pinia`、`ArcoVue` 包括自建组件等等都不需要手动引入了。

#### 3.2.3 安装vueuse

[VueUse](https://vueuse.org/) 可以把它理解为一个基于 `Vue` 的工具库，`Vue2`、`Vue3` 都可以用，有很多实用的方法、组件包括指令，超级方便，后续我们会用到其中的一些方法，所以先装上。

##### 3.2.3.1 安装

```js
npm i @vueuse/core

// or

pnpm add @vueuse/core
```

##### 3.2.3.2 配置自动引入

`VueUse` 不止有方法，还有组件和指令，所以我们还是需要上面两个自动引入的插件去处理，那由于作者是一个人，解析器都内置在自动引入插件中了，所以我们直接导出用就可以了。

我们配置 `VueUse` 的组件和指令自动引入需要两个解析器，还是在 `vite.config.js` 配置文件中引入，如下：

```js
// ArcoVue、VueUse 组件和指令的自动引入解析器
import {
  ArcoResolver,
  VueUseComponentsResolver,
  VueUseDirectiveResolver,
} from "unplugin-vue-components/resolvers";
```

使用的话，只需要在配置文件 `plugins` 模块中之前写过的 `Components` 插件中使用一下这两个解析器就好了：

```js
Components({
  // imports 指定组件所在目录，默认为 src/components
  dirs: ["src/components/", "src/views/"],
  // 需要去解析的文件
  include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
  resolvers: [
    ArcoResolver({
      sideEffect: true,
    }),
    VueUseComponentsResolver(),
    VueUseDirectiveResolver(),
  ],
}),
```

API 方法的自动引入就很简单了，还是配置文件中只需要在之前用过的 AutoImport 插件中添加一个 VueUse 包名配置就行了：

```js
AutoImport({
  // 需要去解析的文件
  include: [
    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/, // .vue
    /\.md$/, // .md
  ],
  // 新增 '@vueuse/core'
  imports: ["vue", "pinia", "vue-router", "@vueuse/core"],
  // 生成相应的自动导入json文件。
  eslintrc: {
    // 启用
    enabled: true,
    // 生成自动导入json文件位置
    filepath: "./.eslintrc-auto-import.json",
    // 全局属性值
    globalsPropValue: true,
  },
  resolvers: [ArcoResolver()],
}),
```

这样我们就可以在项目中随时随地的使用 `VueUse` 了！

建议大家有时间可以去看看 `VueUse` 的源码实现，也并不复杂，它有很多最佳实践，可以给我们使用 `Vue3` 提供很大的帮助。

#### 3.2.4 配置Eslint和Prettier

上述内容中，我们配置了自动引入，但是大家会发现，由于之前我们给项目安装了 `ESLint` 和 `Prettier` ，虽然还没有进行配置，但是默认配置会给那些自动引入的 `API` 报红，就比如下面这样：

![img](https://cdn.nlark.com/yuque/0/2023/png/2340337/1675332162964-d31495c0-7101-46b7-9435-827659f92fd3.png)

查看当前项目中的`.eslintrc.cjs`，这是 `ESLint` 配置，当前默认如下：

```js
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
};
```

根目录下的 `.prettierrc.json` 是 `Prettier` 配置，当前默认如下

```js
{}
```

如何让我们自动引入的那些 API 不报红呢？
还记得我们自动引入配置的那个导出文件吗？我们所有自动引入的 API 都生成了记录在这个文件，你只需要将它写入 ESLint 配置的 extends 中让 Lint 工具识别下就好了，如下：

```js
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    // 这里
    './.eslintrc-auto-import.json',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
```

注意，`extends` 这个继承配置的是一个数组，最终会将所有规则项进行合并，出现冲突的时候，后面的会覆盖前面的，我们在初始化项目安装时默认给加上去了 3 个：

- `plugin:vue/vue3-essential` ：ESLint Vue3 插件扩展
- `eslint:recommended`：ESLint 官方扩展
- `@vue/eslint-config-prettier` ：Prettier NPM 扩展

我们把 Prettier 扩展放到最后面，原因是 Prettier 会格式化代码，是为了保证最终代码格式统一。



接下来，由于我们接下来要使用 `Vue3` 的 `CompositionAPI`，那 Vue3 有几个可以直接在 `<script setup> `中可用的全局 API，比如 `defineProps`、`defineEmits`、`defineExpose`，如果你使用 TS，还会用到 `withDefaults` 。

那我们的 `ESLint` 默认是识别不了这些全局 API 的，此时需要向 `ESlint` 规则中添加需要辨认的全局变量。

那 `ESLint` 配置中的 `globals` 属性就是让项目在 `lint` 执行期间访问额外的全局变量，简单说就是开发者自定义的全局变量，我们依次加上这些属性就可以了。

```js
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "./.eslintrc-auto-import.json",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  // 这里
  globals: {
    defineEmits: "readonly",
    defineProps: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
```

如上，添加全局属性时，`readonly` 代表只读，`writable` 代表可写，可写就是可以手动覆盖这个全局变量的意思，我们当然是不允许覆盖了，所以全部都设置成了 `readonly`。

我们可以看到在 `.eslintrc.cjs` 文件中第一行有个 `/* eslint-env node */`注释，它是用来指定文件为 `node` 环境的。

如果不想这样展示，只要在`eslint`中用 `node` 规则解析即可。这里我们给 `ESLint` 指定一下常用环境，即 `env` 属性配置，让 `ESLint` 自己去匹配，我们不写这个配置的话默认它只支持浏览器 `browser` 的规则解析，写上环境配置：

```js
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  // 这里
  env: {
    // 浏览器环境
    browser: true,
    // Node环境
    node: true,
    // 启用除了modules以外的所有 ECMAScript 6 特性
    es2021: true,
  },
  root: true,
  extends: [
    "./.eslintrc-auto-import.json",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  globals: {
    defineEmits: "readonly",
    defineProps: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    semi: ["warn", "never"], // 禁止尾部使用分号
    "no-debugger": "warn", // 禁止出现 debugger
  },
};
```

如上所示，我们在环境这块配置了三个：

1. browser ── 浏览器环境；
2. node ── Node 环境；
3. es6 ── 启用除了 modules 以外的所有 ECMAScript 6 特性；

都用的到，直接都开启就好。
可能我们也都发现了，我们新增了一个 rules 属性，如单词字面意思，就是规则的配置，可以配置启用一些规则及其各自的错误级别，那由于每个人的喜好不同，所以我没有过多配置，只配置了 2 个。
rules 的规则配置有三种：

1. off 或 0 关闭对该规则的校验；
2. warn 或 1 启用规则，不满足时抛出警告，不会退出编译进程；
3. error 或 2 启用规则，不满足时抛出错误，会退出编译进程；

配置完了 ESLint ，我们再来看Prettier，我这边配置了几个常用的，如下

```js
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 80,
  "trailingComma": "none",
  "arrowParens": "avoid",
  "tabWidth": 2
}
```

1. `semi` 代码结尾是否加分号；
2. `singleQuote` 是否使用单引号；
3. `printWidth` 超过多少字符强制换行；
4. `trailingComma` 代码末尾不需要逗号；
5. `arrowParens` 单个参数的箭头函数不加括号 `x => x`；
6. `tabWidth` 使用 n 个空格缩进；

Prettier 配置就比较简单，按照文档和喜好在 `.prettierrc.json` 文件中配置就可以。

#### 3.2.5 styles公共样式管理、初始化样式

接下来我们简单做一下 `CSS` 公共样式的处理，我们在项目 src 目录下新增一个 `styles` 文件夹，此文件夹我们后期可以放一些公共的样式文件。

大家都知道，`HTML` 标签是有默认样式的，一般我们在写项目时都会直接清除掉这个默认样式，也就是做个重置。

那相较于 [Eric Merer](https://meyerweb.com/eric/tools/css/reset/) 原版的清楚样式文件，`Normalize.css` 它在默认的 HTML 元素样式上提供了跨浏览器的高度一致性，是一种现代的、为 HTML5 准备的优质替代方案，所以我们直接使用它就好了。

下载 [Normalize.css](https://necolas.github.io/normalize.css/latest/normalize.css) 到 Styles 文件夹下，当然你也可以直接 npm 安装它，不过我比较喜欢直接下载下来这个文件。

下载下来之后直接在 `main.js`最上面引入一下就行了，如下

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 这里
import '@/styles/normalize.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

其他的公共 `css` 文件我们用到的时候也可以这样引入一下就可以了。

#### 3.2.6 配置Unocss

CSS 这块，我们的原则是能简单就简单，所以我们基于 ACSS 即原子化的 CSS 框架来做。

[Tailwind CSS](https://tailwindcss.com/) 大家应该都知道， [WindiCSS](https://windicss.org/) 算是他的一个超集，由于`WindiCSS` 作者们都不咋维护了，然后 [UnoCSS](https://github.com/unocss/unocss) 又这么便捷，配置文件都不需要写，直接引入 `Vite` 插件和对应的预设就可以了，所以这里选择unoCSS。

`UnoCSS`，官方说它是一个按需原子 `CSS` 引擎，它默认提供了流行实用程序优先框架 `Tailwind CSS`、`Windi CSS`、`Bootstrap`、`Tachyon` 等的通用超集，如果你习惯这些框架，依旧可以按照熟悉的方式写，无缝衔接。

这里看个人喜好了，用不用，有什么，怎么用，还是看具体个人使用。

```js
npm install --save-dev unocss @unocss/preset-uno @unocss/preset-attributify @unocss/transformer-directives

# or

pnpm i -D unocss @unocss/preset-uno @unocss/preset-attributify @unocss/transformer-directives
```

##### 3.2.6.1 安装

如上，我们装了 4 个包

1. [unocss](https://github.com/unocss/unocss) 核心插件；
2. [@unocss/preset-uno](https://github.com/unocss/unocss/tree/main/packages/preset-uno) 默认预设，`Tailwind` / `WindiCSS` 等超集；
3. [@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify) 属性预设，为其他预设和规则提供[属性模式](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode)；

- [@unocss/transformer-directives](https://github.com/unocss/unocss/blob/main/packages/transformer-directives/README.md) 指令转换器插件，允许使用 `@apply`指令在 `style` 中写原子化 css；

##### 3.2.6.2 配置

还是在 `Vite` 插件配置中，也就是 `vite.config.js` 文件中配置

```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// ...

// Unocss 插件
import Unocss from 'unocss/vite'
// Unocss 默认预设
import presetUno from '@unocss/preset-uno'
// Unocss 属性模式预设
import presetAttributify from '@unocss/preset-attributify'
// Unocss 指令转换插件
import transformerDirective from '@unocss/transformer-directives'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...

    // 新增一个 Unocss 插件配置
    Unocss({
      // 预设
      presets: [presetUno(), presetAttributify()],
      // 指令转换插件
      transformers: [transformerDirective()],
      // 自定义规则
      rules: []
    }),
  ]

  // ...
})
```

##### 3.2.6.3 使用

在使用之前我们先在入口文件 main.js中一下 UnoCSS 的 css 文件：

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/normalize.css' 

// 导入Unocss样式 
import 'uno.css' 
```

##### 3.2.6.4 基础使用

```js
<button class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600">
  Button
</button>
```

如果不熟悉，可以直接在[此文档](https://uno.antfu.me/)查看对应属性。

除此外，既然我们用的预设支持 `Tailwind / WindiCSS` ，可以参考这两个文档，了解一个大概，按照这两个东西的写法来就可以，有不会的去这两个的文档里搜

- [TailwindCSS](https://tailwindcss.com/)；
- [WindiCSS](https://windicss.org/)；

除此外，我们上面安装了 `@unocss/preset-attributify` 属性预设，所以我们也可以使用属性模式，可以将实用程序分为多个属性，这样写：

```js
<button 
  bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  border="2 rounded blue-200"
>
  Button
</button>
```

如果有人觉得原子化 CSS 全写在 HTML 中，太多的话，就可以使用指令转换器插件 @unocss/transformer-directives 。
它允许我们使用 @apply指令在 style 中写原子化 CSS ：

```js
<button class="btn-style">
  Button
</button>

<style>
.btn-style{
  @apply bg-blue-400 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200;
  @apply hover:bg-blue-500;
  @apply dark:bg-blue-500 dark:hover:bg-blue-600;
}
</style>
```

##### 3.2.6.5 其他

我们安装一下 `UnoCSS` 官方的 `VSCode` 插件，`VSCode` 扩展中搜索：`UnoCSS`。

详细的原子化CSS也会在后面的工程化&实战中介绍使用。

#### 3.2.7 Utils、Hooks、API 管理

我们在项目 `src` 目录下添加一个 `utils` 文件夹，此文件夹用于存放我们项目中用到的一些公共方法文件；

同样的，我们在项目 `src` 目录下添加一个 `hooks` 文件夹，此文件夹用于存放我们项目中用到的一些 `hooks` 文件，因为我们用 `Vue3` 的 `CompsitionAPI`，后面用多了自然会有很多 `hooks` 文件，针对一些公用的，我们统一管理在此文件夹下；

平常我们做项目，一般和请求相关的文件都统一放在一个文件夹下，所以我们在项目 `src` 目录下添加一个 `api` 文件夹，用于存放和请求相关的文件；

#### 3.2.8 其他vite配置

这里使用vite的[环境配置](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)，在 env 目录下新建下面 3 个文件
1.env 所有模式下都会加载；
2.env.development 只在开发模式下加载；
3.env.production 只在生产模式下加载；
.env 文件在所有模式下都会加载，所以这里我们可以写一些所有环境都通用的环境变量，如下：

```js
# 所有环境都会加载

# 项目标识代码
VITE_APP_CODE="XIANZAO_VUE_TOOLS"

# 项目名
VITE_APP_NAME="工具类"

# 项目描述
VITE_APP_DESCRIPTION="工具类集合"
```

注意，我们在 Vite 中配置的环境变量默认只有以 VITE_ 开头的配置，才会暴露给客户端，我们才能在项目中获取到。
开发模式 .env.development配置：

```bash
# 开发环境加载

# 环境标识
VITE_APP_ENV="development"

# 公共基础路径
VITE_BASE="/"

# 代理URL路径
VITE_BASE_URL ="/api"

# 模拟数据接口路径
VITE_BASE_MOCK_URL ="/mock-api"

# 服务端接口路径
VITE_BASE_SERVER_URL = "..."

# 打包是否使用Mock
VITE_APP_PRODMOCK=false
```

那生产环境除了环境标识 `VITE_APP_ENV` 和开发模式标识不同，其他配置项应尽量保持一致，只是配置项的内容不同而已，不一一的展示了。

接下来修改下 `package.json` 脚本命令如下：

```js
{
    "scripts": {
    "serve": "vite --mode development",
    "build": "vite build --mode production",
    "preview": "vite preview --port 8081",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore"
  }
}
```

在 serve 脚本命令配置中，我们还传了一个 mode，其实这个 mode 就是对应我们的环境文件 .env.[mode]
开发环境默认 mode 就是 development，生产环境默认 mode 就是 development，所以脚本命令这里我不传 mode 也可以，但是如果大家把开发环境文件由 .env.development 改成 .env.dev，那脚本中 mode 就得传 --mode dev，build 时也是一样的道理，如果有其他环境，那脚本命令传入对应的 mode 就可以了。
如果想要在 vite.config.js 文件中获取对应运行 mode 环境变量的配置，我们可以使用 vite 的 [loadEnv API](https://cn.vitejs.dev/guide/api-javascript.html#loadenv)。
Vite 的 defineConfig 方法也可以接收一个返回配置对象的回调函数，回调函数的参数里我们可以拿到运行脚本命令时传入的 mode 值，从而使用 loadEnv 方法去在 Vite 配置文件中获取对应 mode 下的环境变量，如下：

```js
// export default defineConfig({}) 修改

export default defineConfig(({mode}) => {
	return {}
})
```

截止到这里，我们的配置为：

```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// API自动引入插件
import AutoImport from 'unplugin-auto-import/vite'
// 组件自动引入插件
import Components from 'unplugin-vue-components/vite'
// ArcoVue、VueUse 组件和指令自动引入解析器
import {
  ArcoResolver,
  VueUseComponentsResolver,
  VueUseDirectiveResolver
} from 'unplugin-vue-components/resolvers'
// icon 插件
import Icons from 'unplugin-icons/vite'
// icon 自动引入解析器
import IconsResolver from 'unplugin-icons/resolver'
// icon 加载 loader
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
// Unocss 插件
import Unocss from 'unocss/vite'
// Unocss 默认预设
import presetUno from '@unocss/preset-uno'
// Unocss 属性模式预设
import presetAttributify from '@unocss/preset-attributify'
// Unocss 指令插件
import transformerDirective from '@unocss/transformer-directives'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, './')

  return {
    base: viteEnv.VITE_BASE,
    server: {
      host: '0.0.0.0',
      port: '8080',
      open: true,
      // 端口占用直接退出
      strictPort: true
      // 本地服务 CORS 是否开启
      // cors: true,
      // proxy: {
      //   [viteEnv.VITE_BASE_URL]: {
      //     target: viteEnv.VITE_BASE_SERVER_URL,
      //     // 允许跨域
      //     changeOrigin: true,
      //     rewrite: path => path.replace(viteEnv.VITE_BASE_URL, '/')
      //   }
      // }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static/assets',
      // sourcemap: true,
      // 规定触发警告的 chunk 大小，消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue(),
      // 使用Unocss
      Unocss({
        // 预设
        presets: [presetUno(), presetAttributify()],
        // 指令转换插件
        transformers: [transformerDirective()],
        // 自定义规则
        rules: []
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
        // 生成相应的自动导入json文件。
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        resolvers: [ArcoResolver()]
      }),
      Components({
        // imports 指定组件所在位置，默认为 src/components
        dirs: ['src/components/', 'src/view/'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ArcoResolver({
            sideEffect: true
          }),
          VueUseComponentsResolver(),
	  VueUseDirectiveResolver(),
          IconsResolver({
            // icon自动引入的组件前缀 - 为了统一组件icon组件名称格式
            prefix: 'icon',
            // 自定义的icon模块集合
            customCollections: ['user', 'home']
          })
        ]
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          // user图标集，给svg文件设置fill="currentColor"属性，使图标的颜色具有适应性
          user: FileSystemIconLoader('src/assets/svg/user', svg =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ),
          // home 模块图标集
          home: FileSystemIconLoader('src/assets/svg/home', svg =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          )
        },
        autoInstall: true
      })
    ]
  }
})
```

#### 3.2.8 添加Config配置

上面说了，环境变量默认以 `VITE_` 开头的配置，才会暴露给客户端，我们也写了几个 `VITE_` 开头的配置，所以在项目运行时，我们可以直接 `import.meta.env.VITE_XXX` 去查看配置，但是这样太麻烦了，所以我们写一个统一的配置文件去获取环境变量，包括项目后期的一些全局配置也可以写里面

项目 src 目录下新建 `config/config.js` 文件，写入下面文件：

```js
// 获取环境变量
const ENV = import.meta.env
// 配置文件
let config = {}
// 默认配置文件
const configSource = {
  appCode: ENV.VITE_APP_CODE,
  // 项目标识代码
  projectCode: `${ENV.VITE_APP_CODE}_${ENV.VITE_APP_ENV}`,
  // 项目名
  projectName: ENV.VITE_APP_NAME,
  // 项目描述
  projectDesc: ENV.VITE_APP_DESCRIPTION,
  // 资源base地址
  base: ENV.VITE_BASE,
  // 接口代理URL路径
  baseUrl: ENV.VITE_BASE_URL,
  // 模拟数据接口路径
  mockBaseUrl: ENV.VITE_BASE_MOCK_URL,
  // 服务端接口路径
  serverUrl: ENV.VITE_BASE_SERVER_URL
}

const setConfig = cfg => {
  config = Object.assign(config, cfg)
  return config
}

const resetConfig = () => {
  config = { ...configSource }
  return config
}
resetConfig()

const getConfig = key => {
  if (typeof key === 'string') {
    const arr = key.split('.')
    if (arr && arr.length) {
      let data = config
      arr.forEach(v => {
        if (data && typeof data[v] !== 'undefined') {
          data = data[v]
        } else {
          data = null
        }
      })
      return data
    }
  }
  if (Array.isArray(key)) {
    const data = config
    if (key && key.length > 1) {
      let res = {}
      key.forEach(v => {
        if (data && typeof data[v] !== 'undefined') {
          res[v] = data[v]
        } else {
          res[v] = null
        }
      })
      return res
    }
    return data[key]
  }
  return { ...config }
}

export { getConfig, setConfig, resetConfig }
```

这样，我们写入配置时，只需要在 configSource 对象中写入就可以了，项目中使用起来的话如下：

```js
import { getConfig, setConfig, resetConfig } from "@/config/config.js"

// 获取配置
getConfig("a")
getConfig("a.b")
getConfig("a.b.c")

// 动态设置
setConfig({ ... })

// 重置配置
resetConfig()
```

至此，一个Vue3 + Vite的基础项目配置就已经配置完成了，代码可以参考[此链接](https://github.com/xianzao/xianzao-vue-tools/tree/init_config)；

## 4. 项目布局

### 4.1 布局思路梳理

我们平常所说的多布局比较笼统，仔细分来其实有两种需要多布局的场景，大家可以自行匹配一下：

1. 项目有很多页面，有些页面是一样的布局，但还有些页面是另外一种布局，所以我们需要多种布局提供给不同的页面；
2. 项目有很多页面，页面都是统一的布局，但是我们需要提供多种可以自由切换的布局，让用户在生产环境自己去选择；

#### 4.1.1 多页面不同布局

如果只是需要在不同的页面使用不同的布局，那么很简单。

因为你只需要写多个不同的布局组件，然后使用二级路由通过指定父级路由的 `component` 就可以决定采用哪个布局，如下：

假如我们有 2 个布局：

```js
// layout 1
Layout1.vue

// layout 2
Layout2.vue
```

页面 `page_a` 想要使用`Layout1`布局，页面 `page_b` 想要使用 `Layout2` 布局，那么只需在配置路由时如下：

```js
{
  routes: [
    {
      path: '/layout1',
      name: 'Layout1',
      component: () => import('***/Layout1.vue'),
      redirect: '/layout1/page_a',
      children: [
        {
          path: 'page_a',
          name: 'PageA',
          component: () => import('***/PageA.vue')
        },
	
        // ...
      ]
    },
    {
      path: '/layout2',
      name: 'Layout2',
      component: () => import('***/Layout2.vue'),
      redirect: '/layout2/page_b',
      children: [
        {
          path: 'page_b',
          name: 'PageB',
          component: () => import('***/PageB.vue')
        },
	
        // ...
      ]
    }
  ]
}
```

只需要在根组件和布局组件中写上 `<router-view />`即可。

#### 4.1.2. 可动态切换的布局

再来看可以动态切换的布局，一般来说，我们使用 Vue 的 `component` 组件，通过 `is` 属性去动态的渲染布局组件就可以了，如下：

```vue
<!-- SwitchLayout.vue -->
<script setup>
  const isOneLayout = ref(true)
  import Layout1 from "./Layout1.vue"
  import Layout2 from "./Layout2.vue"
</script>

<template>
  <button @click="isOneLayout = !isOneLayout" />
  <component :is="isOneLayout ? Layout1 : Layout2" />
</template>
```

然后，我们直接在父路由中引入此页面，就可以通过改变状态来动态切换所有的子路由布局了，如下：

```js
{
  routes: [
    {
      path: '/',
      component: () => import('***/SwitchLayout.vue'),
      redirect: '/page_a',
      children: [
        {
          path: 'page_a',
          name: 'PageA',
          component: () => import('***/PageA.vue')
        },
	
        // ...
      ]
    },
}
```

### 4.2 准备工作

咱们先写一个可以动态切换的布局，首先，在项目 `src` 目录下创建一个布局文件夹 `layout` 。

接下来我们在 `src/layout` 文件下创建一个可切换布局的入口组件 `SwitchIndex.vue`，内容和上面所写的差不多，如下：

```vue
<script setup></script>

<template>
  <div class="switch-index">
    <!-- <component :is="" /> -->
  </div>
</template>

<style scoped></style>
```

`component` 组件我们暂且注释，因为目前还没有布局组件。

接下来我们创建两个布局组件，由于我们要把这两种布局的选择权交给用户，所以我们在 `layout` 文件夹下新建一个 `switch` 文件夹，把可以切换的这两个布局组件放到里面统一管理下。

创建可切换的默认布局文件：`layout/switch/DefaultLayout.vue`：

```vue
<script setup></script>

<template>
  <div>DefaultLayout</div>
</template>

<style scoped></style>
```

创建可切换的边栏布局文件：`layout/switch/SidebarLayout.vue`：

```vue
<script setup></script>

<template>
  <div>SidebarLayout</div>
</template>

<style scoped></style>
```

布局形式如下：

![img](https://cdn.nlark.com/yuque/0/2023/png/2340337/1675332168117-4e9dc9e7-4e66-44f2-b8af-fac4d9057671.png)

其实就是两种很普通很常见的布局，一种是有侧边栏的 `SidebarLayout`（ 下文叫它边栏布局）、一种无侧边栏的 `DefaultLayout`（下文叫它默认布局），先了解下格式。

### 4.3 默认布局组件 DefaultLayout

修改一下 `DefaultLayout` 组件，如下：

```vue
<script setup></script>

<template>
  <div>
    DefaultLayout
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style scoped></style>
```

然后直接在 SwitchIndex 组件引入使用这个布局，上文中我们虽然配置了组件自动引入，但是并没有配置 layout 目录，所以 layout 文件夹下的组件是不会被自动引入的，那我们还需要现在 vite.config.js 配置文件中把 layout 目录加上，如下：

```js
export default defineConfig(({ mode }) => {
  return {
     // ...

    plugins: [
      // ...

      Components({
        // 新增 'src/layout' 目录配置
        dirs: ['src/components/', 'src/view/', 'src/layout'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ArcoResolver({
            sideEffect: true
          }),
          VueUseComponentsResolver(),
          VueUseDirectiveResolver(),
          IconsResolver({
            prefix: 'icon',
            customCollections: ['user', 'home']
          })
        ]
      }),
    ]
  }
})
```

然后就可以直接在 SwitchIndex 组件中使用 DefaultLayout 布局组件了，我们写的组件是匿名组件，默认组件名即文件名，如下：

```js
<script setup></script>

<template>
  <div class="switch-index">
    <!-- <component :is="" /> -->
    <DefaultLayout />
  </div>
</template>

<style scoped></style>
```

接下来，修改下路由文件 router/index.js ，把 SwitchIndex 组件作为一级路由组件，那此路由下的所有子路由就都可以使用我们的布局了：

```js
routes: [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/SwitchIndex.vue'),
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'HomePage',
        meta: {
          title: 'TOOLSDOG'
        },
        component: () => import('@/views/HomePage.vue')
      }
    ]
  }
]
```

#### 4.3.1 设计样式

上文我们已经装好了 ArcoDesign，同样也配置了其组件自动引入，这里我们直接使用 ArcoDesign 的 layout 布局组件做一个常规的上中下三分布局即可，需要注意的是，我们给 Navbar 导航部分加了一个固钉组件 a-affix，用于固定在页面顶部。
注意：ArcoDesign 组件均以子母 a 开头。
修改 DefaultLayout 组件，如下：

```js
<script setup></script>

<template>
  <div>
    <div class="default-layout">
      <a-layout>
        <a-affix>
          <a-layout-header> Navbar </a-layout-header>
        </a-affix>
        <a-layout-content>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </a-layout-content>
        <a-layout-footer> Footer </a-layout-footer>
      </a-layout>
    </div>
  </div>
</template>

<style scoped></style>
```

注意，

1. CSS 这里我们接上文的配置，使用的是原子化 CSS 框架 [UnoCSS](https://github.com/unocss/unocss) ；
2. 由于我们想保证风格统一，对于一些颜色、字体、尺寸方面，我这边直接全使用了 `ArcoDesign` 抛出的 `CSS` 变量，没有自己去自定义一套基础变量；

这里，我们参考ArcoDesign的[设计变量](https://arco.design/react/docs/token)

![img](https://cdn.nlark.com/yuque/0/2023/png/2340337/1675332167237-8f88976e-d159-4480-a11b-f537eff8c18f.png)

如上，我们直接使用对应的 CSS 变量即可。
布局样式如下：

```vue
<script setup></script>

<template>
  <div>
    <div class="default-layout">
      <a-layout class="min-h-[calc(100vh+48px)]">
        <a-affix>
          <a-layout-header> Navbar </a-layout-header>
        </a-affix>
        <a-layout-content>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </a-layout-content>
        <a-layout-footer> Footer </a-layout-footer>
      </a-layout>
    </div>
  </div>
</template>

<style scoped>
  @apply
  .default-layout :deep(.arco-layout-header),
  .default-layout :deep(.arco-layout-footer),
  .default-layout :deep(.arco-layout-content) {
    @apply text-[var(--color-text-1)] text-14px;
  }

  .default-layout :deep(.arco-layout-header) {
    @apply w-full h-58px overflow-hidden;
    @apply bg-[var(--color-bg-3)]  border-b-[var(--color-border-1)] border-b-solid border-b-width-1px box-border;
  }
  .default-layout :deep(.arco-layout-content) {
    @apply flex flex-col justify-center items-center;
    @apply bg-[var(--color-bg-1)] relative;
  }
  .default-layout :deep(.arco-layout-footer) {
    @apply w-full flex justify-center items-center;
    @apply border-t-[var(--color-border-1)] border-t-solid border-t-width-1px box-border;
    @apply bg-[var(--color-bg-2)] text-[var(--color-text-1)] text-14px;
  }
</style>
```

如上，我们做了这样的事情：

1. 给`Navbar` 一个下边框以及 `58px` 高度；
2. 给 `Footer` 一个上边框；
3. 给 `Navbar`、`Content`、`Footer` 加了不同级别的背景颜色（`AcroDesign` 背景色 CSS 变量）；
4. 为了让 `Footer` 首页不显示出来，给 `a-layout-content` 组件加了一个最小高度，使用视口高度 `100vh` 减去 `Navbar` 的高度就是该组件的最小高度了；

#### 4.3.2 导航组件Navbar

接下来填充布局内容，先来做 Navbar 组件。

我们想要实现的两种布局都有导航栏，唯一的区别就是菜单的位置，所以我们这里把导航栏中的各个元素单独拆分作为独立的组件，使用插槽的方式在 Navbar 组件去使用，Navbar 组件相当于导航栏的一个布局组件。这样导航栏组件在哪种布局中都是可用的，避免重复代码。

在 src/layout 文件夹下新建 components 文件夹存放布局相关的公共组件。

在 src/layout/components文件夹下创建 Navbar.vue 文件，内容如下：

```vue
<template>
  <div class="w-full h-full flex px-20px box-border">
    <div class="h-full flex">
      <slot name="left" />
    </div>
    <div class="h-full flex-1">
      <slot />
      <slot name="center" />
    </div>
    <div class="h-full flex flex-shrink-0 items-center">
      <div>
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
```

如上，我们给 Navbar 组件做了三个具名插槽，采用左中右这种结构并使用 flex 布局将中间的插槽撑满，同时我们也将默认插槽放在了中间的插槽位置，这样默认会往布局中间填充内容。
注意，导航区域的高度在布局组件中已经固定写死 58px 了，导航组件这里我没有设置高度，让它自己撑满就行了。因为在任何布局下，导航栏高度是相同的。
我们在 DefaultLayout 布局组件中的 a-layout-header 标签中使用一下导航条组件，同样无需引入直接使用，如下：

```vue
<a-layout-header>
  <Navbar>
    <!-- left插槽 -->
    <template #left></template>

    <!-- 默认插槽和center插槽，默认插槽可不加template直接写内容，作用同center插槽 -->
    <template #center></template>

    <!-- right插槽 -->
    <template #right></template>
  </Navbar>
</a-layout-header>
```

由于插槽中没有写内容，所以页面上没有东西，导航条壳子搞好了，接下来我们开始填充内容。

左侧插槽我们写一个 `Logo` 组件，中间插槽就是导航菜单 Menu 组件了，右侧插槽则是一些页面小功能组件，暂定为 `Github` 组件（用来跳转 `Github` 的）、做布局切换的 `SwitchLayout` 组件。

### 4.3.3. Logo 组件

在 src/layout/components 文件夹下新建 Logo.vue 文件，写入如下内容：

```vue
<script setup>
const route = useRoute()
const title = useTitle()

watchEffect(() => {
  title.value = route.meta.title || 'TOOLSDOG'
})
</script>
<template>
  <div
    class="h-full flex items-center text-16px font-700 text-shadow-sm cursor-pointer"
    @click="$router.push('/')"
  >
    <div
      class="w-36px h-36px rounded-[50%] flex justify-center items-center mr-2px cursor-pointer"
      hover="bg-[var(--color-fill-1)]"
    >
      <icon-ri-hammer-fill class="text-18px" />
    </div>
    {{ title }}
  </div>
</template>
```

然后把 `Logo` 组件填充到我们 `DefaultLayout` 组件下 `Navbar` 组件的 左侧插槽中即可：

```vue
<Navbar>
  <template #left>
    <Logo />
  </template>
</Navbar>
```

关于 logo 我们直接在 [iconify](https://icones.js.org/) 图标库中找了一个图标用，我们这里用的是 `ri:hammer-fill` 图标，另外，点击 logo 会跳转首页。

标题直接用 Vue 的 `watchEffect` 方法监听了当前路由 `meta` 对象中的 `title` 属性并赋值给响应式变量 `title` ，这样后面我们每次跳转到某个功能页面时， `Logo` 旁边的文字信息以及浏览器 `Tab` 页签都会变成该页面路由中配置的 `title` 信息。

`useRoute` 方法是 `Vue3` 组合式 `API`，它返回一个当前页面路由的响应式对象，同样 `Vue` 的核心 API 我们都做了自动引入，所以这里没有引入。

`watchEffect` 也是 `Vue3` 的 `API`，该方法会立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。简单来说就是只要该回调中有响应式数据，这些响应式数据的依赖发生改变时就会重新执行此回调，默认会立即执行一次。那在这个场景下就比 watch 好用多了。

那响应式变量 title 是怎么来的呢？代码中我们使用了 `useTitle` 方法，同样没有引入，它不是 Vue 的 API，其实，它是 VueUse 库中的[一个方法](https://vueuse.org/core/usetitle/#usetitle)，在上文我们已经给 `VueUse` 这个库的方法做了自动引入，所以可以直接用，该方法会返回一个响应式变量，这个响应式变量在改变时会自动改变我们的网页标题，注意这里的标题指的是浏览器 Tab 标签中的标题，

#### 4.3.4 Github跳转组件

写 `Github` 跳转组件之前我们需要在 `config/index.js` 文件中配置一下 `GitHub Url` 地址。

在 `config/index.js` 文件的 `configSource` 对象中新增一个 github 属性，属性值写上我们的项目地址，如下：

```js
const configSource = {
  // ...

  github: 'https://github.com/xianzao/xianzao-vue-tools'
}
```

`Github` 跳转组件很简单，就是字面意思，我们搞一个图标放上去，然后能够点击打开一个新标签跳转到项目的 `GitHub` 地址就行了。在 `src/layout/components` 文件夹下新建 `Github.vue` 文件，写入如下内容：

```js
<script setup>
import { getConfig } from '@/config'
const openNewWindow = () => window.open(getConfig('github'), '_blank')
</script>
<template>
  <a-button type="text" @click="openNewWindow">
    <template #icon>
      <icon-mdi-github class="text-[var(--color-text-1)] text-16px" />
    </template>
  </a-button>
</template>
```

`GitHub` 的图标我们用的 `iconify` 图标库中 `mdi:github` 图标。

接着我们去使用一下，把 Github 组件填充到默认布局 `DefaultLayout` 组件下 `Navbar` 组件的右侧插槽中即可：

```vue
<Navbar>
  <template #right>
    <Github />
  </template>
</Navbar>
```

#### 4.3.5 菜单组件Menu

这里实现一个路由页面。

首先，在 `src/views` 文件夹下新建 `DemoPage.vue` 文件作为demo页面组件：

```js
<script setup></script>

<template>
  <div>demo</div>
</template>

<style scoped></style>
```

接着我们要配置一下路由，注意，由于现在写的页面路由它同时还是个菜单，所以我们把这些可以作为菜单的路由单独写一个路由文件，这样我们后期可以直接可以导出当作菜单项配置用。

在 `src/router` 文件夹下新建 `menuRouter`.js 文件，导出一个菜单路由数组，如下：

```js
export const menuRouter = []
```

在 `src/router/index.js` 中使用一下：

```vue
import { createRouter, createWebHistory } from 'vue-router'
  // 导入菜单路由
  import { menuRouter } from './menuRouter'

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/index.vue'),
        redirect: '/',
        children: [
          {
            path: '/',
            name: 'HomePage',
            meta: {
              title: 'XIANZAO VUE DASHBOARD'
            },
            component: () => import('@/views/HomePage.vue')
          },
          // 使用菜单路由
          ...menuRouter
        ]
      }
    ]
  })

  export default router
```

接下来我们配置菜单路由数组，由于我们将来可能会写到很多不同种类的功能，所以我们使用多级路由的方式给这些页面做个分类，假设demo页面属于开发工具类，所以我们给它一个 `devtools` 的父级路由，另外，在菜单路由中，每个父级菜单我们给他在 `meta` 对象中添加一个 `icon` 属性，然后导入一个图片组件作为对应 icon 的值，这样做的目的是将来要在导航菜单中给每个分类的菜单都加个图标。

修改 `menuRouter.js` 文件如下

```js
import IconMaterialSymbolsCodeBlocksOutline from '~icons/material-symbols/code-blocks-outline'

export const menuRouter = [
  {
    path: 'devtools',
    name: 'DevTools',
    meta: {
      title: '开发工具',
      icon: markRaw(IconMaterialSymbolsCodeBlocksOutline)
    },
    redirect: { name: 'DemoPage' },
    children: [
      {
        path: 'demo',
        name: 'DemoPage',
        meta: {
          title: 'demo'
        },
        component: () => import('@/views/DemoPage.vue')
      }
    ]
  }
]
```

如上，我们如果想要访问此页面，只需要访问 /devtools/demo 路由即可，那可能有些人注意到该配置中的父级路由的重定向中我们使用的是 name 来做的重定向，这里不用 path 是为了更安全，这个安全指的是由于我们单独抽离出了这个菜单路由模块，虽然目前是在把它引入并写在了 / 路由下，但是将来万一改变了一级路由，那整体的 path 都会改变，而使用 name 字段重定向就不存在这个问题，我们只需要注意下各个路由的 name 字段配置不重复即可。

注意，我们上面手动引入了 iconify 图标库中的图标，可能有人会问不是做了 iconify 的自动引入吗？为什么还要手动去引入？其实，组件的自动引入是靠解析识别组件模板中引入的组件再做的匹配，而这里我们没有在组件模板中使用，而是在 JS 中直接使用的，包括我们做项目经常会做的菜单配置，都是只存一个图标名，它是靠我们在运行时通过图标名去匹配组件，这是一个运行时动态的过程，开发时是做不了自动引入的，这类情况我们需要手动引入一下。

已经有菜单了数据了，我们去写菜单 Menu 组件。先理一下思路，通常组件库中会有 Menu 组件，当然 ArcoDesign 也不例外，我们可以直接拿过来封装一层去使用。封装什么呢？虽然我们目前只有一个路由，但是我们在应该要考虑到多级的情况，那其实解决办法就是做一个可以无限递归的菜单组件。
OK，在写菜单组件之前，路由菜单数据还需要处理下，我们写个递归方法拼接一下每个菜单的完整路由，并把每个路由菜单中的 meta 对象压平到菜单里，方便我们后面使用，还是在 src/router 文件夹下的 menuRouter.js 文件，新增一个 menuRouterFormat 方法处理菜单数据并将处理后的数据导出，如下：

```js
export const menuRouter = [
  // ...
]

/**
 * @description 菜单路由数组 format
 * @param { Array } router 路由数组
 * @param { String } parentPath 父级路由 path
 * @return { Array }
 */
export const menuRouterFormat = (router, parentPath) => {
  return router.map(item => {
    // 拼接路由，例：'devtools' -> '/devtools'  'demo' -> '/devtools/demo'
    item.path = parentPath ? `${parentPath}/${item.path}` : `/${item.path}`

    // 存在 children 属性，且 children 数组长度大于 0，开始递归
    if (item.children && item.children.length > 0) {
      item.children = menuRouterFormat(item.children, item.path)
    }

    return Object.assign({}, item, item.meta || {})
  })
}

// 解析后 路由菜单列表
export const menuRouterFormatList = menuRouterFormat([...menuRouter])
```

在 src/layout/components 文件夹下新建 Menu/index.vue 文件：

```vue
<script setup>
import { menuRouterFormatList } from '@/router/menuRouter.js'

// 菜单数据
const menuList = ref(menuRouterFormatList)

const router = useRouter()
// 子菜单点击事件
const onClickMenuItem = key => {
  router.push(key)
}

const route = useRoute()
// 当前选中菜单
const selectedKeys = computed(() => [route.path])
</script>

<template>
  <a-menu
    class="menu"
    auto-open-selected
    :selected-keys="selectedKeys"
    @menuItemClick="onClickMenuItem"
    mode="horizontal"
    :accordion="true"
  >
    <MenuItem v-for="menu of menuList" :key="menu.path" :menu="menu" />
  </a-menu>
</template>

<style scoped>
.menu.arco-menu-horizontal {
  @apply bg-[var(--color-bg-3)];
}
.menu.arco-menu-horizontal :deep(.arco-menu-icon) {
  @apply mr-4px leading-[1.2] flex-none align-inherit;
}
.menu.arco-menu-horizontal :deep(.arco-menu-pop-header) {
  @apply bg-transparent;
}
.menu.arco-menu-horizontal :deep(.arco-menu-pop-header):hover {
  @apply bg-[var(--color-fill-2)];
}
.menu :deep(.arco-menu-overflow-wrap) {
  @apply flex justify-end;
}
</style>
```

上述代码中，我们先导入了之前 `menuRouter.js `中的菜单解析后的数据 `menuRouterFormatList` 对菜单数据进行了一个初始化。

再来看模板，我们用到了 `arcoDesign` 组件库的 `a-menu` 组件。

1. `accordion` 开启手风琴效果；
2. `mode` 属性是设置菜单模式（水平或垂直），我们给它设置成水平即 `horizontal` ；
3. `menuItemClick` 子菜单点击时触发，该回调参数为 `key`；
4. `selected-keys` 选中的菜单项 `key` 数组；
5. `auto-open-selected` 默认展开选中的菜单；

子菜单点击方法中我们直接使用 router.push 传入 key 跳转路由即可。那对于 selectedKeys ，我们直接用计算属性 computed 返回了当前路由对象 route 中 path 属性值组成的数组，这样每次路由改变该方法就会被触发，selectedKeys 数组值就会响应式的改变。key 值即子菜单的唯一标识，下面我们写子菜单组件时会将每个子菜单的 key 设置为菜单对应的路由 path 。

上面我们用到了一个还没有创建的 MenuItem 组件，它其实就是我们的子菜单组件，接下来我们还是在 src/layout/components/Menu 文件夹下新建 MenuItem.vue 文件，内容如下：

```vue
<script setup>
const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
})
const { menu } = toRefs(props)
</script>

<template>
  <template v-if="!menu.children">
    <a-menu-item :key="menu.path">
      <template #icon v-if="menu?.icon">
        <component :is="menu?.icon"></component>
      </template>
      {{ menu.title }}
    </a-menu-item>
  </template>

  <a-sub-menu v-else :key="menu.path" :title="menu.title">
    <template #icon v-if="menu?.icon">
      <component :is="menu?.icon"></component>
    </template>
    <MenuItem
      v-for="menuChild of menu.children"
      :key="menuChild.path"
      :menu="menuChild"
    />
  </a-sub-menu>
</template>

<style scoped></style>
```

把 `Menu` 组件填充到默认布局 `DefaultLayout` 组件下 `Navbar` 组件的中间插槽或者默认插槽中即可：

```vue
<a-layout-header>
  <Navbar>
    <!-- ... -->

    <!-- 默认插槽和center插槽，默认插槽可不加template直接写内容，作用同center插槽 -->
    <template #center>
      <Menu />
    </template>

    <!-- ... -->
  </Navbar>
</a-layout-header>
```

到此默认布局的导航组件就写的差不多了。

#### 4.3.6 页尾组件Footer

页尾区域我们在布局组件中没有设置高度，因为页尾的高度不固定，可能随时会在页尾加个内容啥的。
由于页尾需要展示一些个人信息，所以我们统一把这些数据都放在 config/index.js 中的基础配置对象里

```js
// ...

const configSource = {
  // ...

  // 个人配置
  me: {
    name: 'xianzao',
    // github
    github: 'https://github.com/xianzao/xianzao-vue-tools'
  }
}
```

我们在 `src/components` 文件夹下新建 `Footer.vue` 文件，`Footer` 组件比较简单，暂时也没写太多内容，这里我就不会多描述了，直接看代码吧。

```vue
<script setup>
import { getConfig } from '@/config'
</script>
<template>
  <div class="w-1200px flex justify-between items-center min-h-48px">
    <div class="w-full h-48px flex justify-center items-center">
      <span> Copyright ⓒ 2022</span>
      <a-link :href="getConfig('me.github')" target="_blank">
        {{ getConfig('me.name') }}
      </a-link>
      <a-link href="<https://beian.miit.gov.cn/>" target="_blank">
        {{ getConfig('icp') }}
      </a-link>
    </div>
  </div>
</template>
```

在布局文件中使用一下：
在 DefaultLayout 默认布局组件中的 a-layout-footer 组件标签中使用一下 Footer 组件，同样无需引入直接使用，如下：

```vue
<a-layout-footer>
  <Footer />
</a-layout-footer>
```

#### 4.3.7 首页修改HomePage

打开 src/views/HomePage.vue 文件，清空当前内容，写入下面代码：

```vue
<template>
  <div class="w-full flex justify-center items-center flex-1">
    <div class="w-full h-300px flex justify-center items-center">
      <div
        class="w-150px h-150px rounded-[50%] bg-[var(--color-fill-1)] flex justify-center items-center"
      >
        <icon-ri-hammer-fill class="text-52px" />
      </div>
    </div>
  </div>
</template>
```

### 4.4 边栏布局组件 SidebarLayout

接下来就开始写边栏布局 `SidebarLayout`，这个组件在上文中已经建好了，所以无需再建。

首先我们需要修改下 `src/layout/SwitchIndex.vue` 文件，先把布局组件写死 `SidebarLayout`，如下：

```vue
<script setup></script>

<template>
  <div class="switch-index">
    <!-- <component :is="" /> -->
    <!-- <DefaultLayout /> -->
    <SidebarLayout />
  </div>
</template>

<style scoped></style>
```

接着修改 `src/layout/switch/SidebarLayout.vue` 边栏布局组件如下：

```js
<script setup></script>

<template>
  <div>
    SidebarLayout
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style scoped></style>
```

#### 4.4.1 设计样式

![img](https://cdn.nlark.com/yuque/0/2023/png/2340337/1675332168111-da1056b0-eedd-425c-af79-6093d541cfc1.png)其实就是多一个侧边栏，至于侧边栏，其实组件库中也有组件，我们可以直接使用 `ArcoDesign` 组件库中的 `a-layout-sider` 组件即可，修改 `SidebarLayout` 组件，如下：

```vue
<script setup>
// 侧边栏收缩状态
const collapsed = ref(false)

// 侧边栏收缩触发事件
const handleCollapse = (val, type) => {
  const content = type === 'responsive' ? '响应式触发' : '点击触发'
  console.log(`${content}侧边栏，当前状态：${val}`)
  collapsed.value = val
}
</script>

<template>
  <div class="sidebar-layout">
    <a-layout>
      <a-affix>
        <a-layout-header> Navbar </a-layout-header>
      </a-affix>

      <a-layout>
        <a-affix :offsetTop="58">
          <a-layout-sider
            breakpoint="lg"
            :width="220"
            height="calc(100vh-58px)"
            collapsible
            :collapsed="collapsed"
            @collapse="handleCollapse"
          >
            Menu
          </a-layout-sider>
        </a-affix>

        <a-layout>
          <a-layout-content class="min-h-[calc(100vh-58px)]">
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </a-layout-content>
          <a-layout-footer> Footer </a-layout-footer>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<style scoped>
.sidebar-layout :deep(.arco-layout-header),
.sidebar-layout :deep(.arco-layout-footer),
.sidebar-layout :deep(.arco-layout-content) {
  @apply text-[var(--color-text-1)] text-14px;
}

.sidebar-layout :deep(.arco-layout-header) {
  @apply w-full h-58px;
  @apply bg-[var(--color-bg-3)]  border-b-[var(--color-border-1)] border-b-solid border-b-width-1px box-border;
}
.sidebar-layout :deep(.arco-layout-content) {
  @apply flex flex-col items-center;
  @apply bg-[var(--color-bg-1)] relative;
}
.sidebar-layout :deep(.arco-layout-footer) {
  @apply w-full flex justify-center items-center;
  @apply border-t-[var(--color-border-1)] border-t-solid border-t-width-1px box-border;
  @apply bg-[var(--color-bg-2)] text-[var(--color-text-1)] text-14px;
}

.sidebar-layout :deep(.arco-layout-sider) {
  @apply h-[calc(100vh-58px)];
}
.sidebar-layout :deep(.arco-layout-sider),
.sidebar-layout :deep(.arco-layout-sider-trigger) {
  @apply border-r-[var(--color-border-1)] border-r-solid border-r-width-1px box-border;
}
</style>
```

接下来我们把之前写的公用组件填充一下：

```vue
<template>
  <div class="sidebar-layout">
    <a-layout>
      <a-affix>
        <a-layout-header>
          <Navbar>
            <template #left> <Logo /> </template>

            <template #right> <Github /> </template>
          </Navbar>
        </a-layout-header>
      </a-affix>

      <a-layout>
        <a-affix :offsetTop="58">
          <a-layout-sider
            breakpoint="lg"
            :width="220"
            height="calc(100vh-58px)"
            collapsible
            :collapsed="collapsed"
            @collapse="handleCollapse"
          >
            Menu
          </a-layout-sider>
        </a-affix>

        <a-layout>
          <a-layout-content class="min-h-[calc(100vh-58px)]">
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </a-layout-content>
          <a-layout-footer> <Footer /> </a-layout-footer>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>
```

其实我们之前写的 Menu 组件还是可以复用的，只需要把菜单的 `mode` 设置成垂直即 `vertical` 就行了。

#### 4.4.2 修改Menu菜单组件

修改 src/layout/components/Menu/index.vue 文件如下：

```js
<script setup>
import { menuRouterFormat, menuRouter } from '@/router/menuRouter.js'

// 新增
const props = defineProps({
  mode: {
    type: String,
    default: 'horizontal'
  }
})
// 菜单模式，horizontal 水平，vertical 垂直
const mode = toRef(props, 'mode')

const menuList = ref(menuRouterFormat(menuRouter))

const router = useRouter()
const onClickMenuItem = key => {
  router.push(key)
}

const route = useRoute()
const selectedKeys = computed(() => [route.path])
</script>
<template>
  <a-menu
    class="menu"
    auto-open-selected
    :selected-keys="selectedKeys"
    @menuItemClick="onClickMenuItem"
    :mode="mode"
    :accordion="true"
  >
    <MenuItem v-for="menu of menuList" :key="menu.path" :menu="menu" />
  </a-menu>
</template>

<style scoped>
/* 没改动，略... */
</style>
```

`Menu` 组件改完了，我们之前写的默认布局不需要改了，因为 `Menu` 目前不传参数默认就是水平菜单，那我们在侧边栏布局中使用一下 `Menu` 组件，修改 `SidebarLayout` 布局文件，在该组件的 `a-layout-sider` 标签下使用 `Menu` 组件如下：

```js
<a-affix :offsetTop="58">
  <a-layout-sider
    breakpoint="lg"
    :width="220"
    height="calc(100vh-58px)"
    collapsible
    :collapsed="collapsed"
    @collapse="handleCollapse"
  >
    <Menu mode="vertical" />
  </a-layout-sider>
</a-affix>
```

#### 4.5 动态切换布局

切换布局的思路文章开头已经说过了，还是老套路，我们先处理一下可切换的布局数据，目前我们就两个布局，接下来我们就用一种相对高级点的方式处理它。

#### 4.5.1 vite中Glob

在`webpack` 中有个 API 叫 `require.context`：

```js
require.context(directory, useSubdirectories, regExp)
```

1. directory ── 表示检索的目录；
2. useSubdirectories ── 表示是否检索子文件夹；
3. regExp ── 匹配文件的正则表达式，一般是文件名；

有经验的同学可能知道，我们在 Vue2 还在使用 webpack 的时候经常会使用 require.context 这个 API 来批量引入组件，那么 Vite 有没有类似的 API 呢？答案是有的，import.meta.glob ，可以参考 [Vite Glob](https://cn.vitejs.dev/guide/features.html#glob-import)。
那接下来我们就用 Vite Glob API 来批量处理布局组件，先解析一下各个布局组件，把他们组成我们想要的一个布局列表数据，当然，用法有很多，这里就当作给大家做个小示范吧。
在 src/layout/switch 文件夹下新建 index.js 文件，写入如下内容：

```js
const modules = import.meta.glob('./*.vue', { eager: true })

let switchLayoutList = []
for (const path in modules) {
  switchLayoutList.push(modules[path].default)
}

export default switchLayoutList
```

上文 `index.js` 文件中我们拿到这些布局组件的 `modules` 后，遍历 `modules` 将每个组件都 `push` 到了 `switchLayoutList` 布局数组列表中并导出，留待后用。

我们在`src/layout/SwitchIndex.vue` 文件中导入 `index.js` 并输出一下 `switchLayoutList` 布局数组，修改如下：

```js
<script setup>
import switchLayoutList from '@/layout/switch/index.js'
console.log(switchLayoutList)
</script>

<template>
  <div class="switch-index">
    <!-- <component :is="" /> -->
    <!-- <DefaultLayout /> -->
    <SidebarLayout />
  </div>
</template>

<style scoped></style>
```

#### 4.5.2 修改布局组件具名并填充布局信息

其实到此我们已经拿到了 `src/layout/switch` 文件夹下的所有可切换布局组件，在 `SidebarLayout` 组件文件中新增如下代码：

```js
<script>
import IconRiLayout5Fill from '~icons/ri/layout-5-fill'
export default {
  name: 'SidebarLayout',
  icon: IconRiLayout5Fill,
  title: '边栏布局'
}
</script>

<script setup>
// ...
</script>

<template>
<!-- ... -->
</template>
```

再写一下默认组件，在 组件中新增如下代码：

```js
<script>
import IconRiLayoutTopFill from '~icons/ri/layout-top-fill'
export default {
  name: 'DefaultLayout',
  icon: IconRiLayoutTopFill,
  title: '默认布局'
}
</script>
```

#### 4.5.3 Pinia共享布局状态

由于将来我们的布局组件信息需要跨页面共享，所以这里就需要用到 `Pinia` 了，`Pinia` 和 `Vuex` 具有相同的功效，是 Vue 的核心存储库，它允许我们跨 组件/页面 共享状态，所以用在这儿很合适，本身 `Pinia` 就是作为下一代 Vuex 产生的，那现在我们使用官方包创建项目都只会询问我们是否安装 `Pinia` 而不是 `Vuex` 了，那 Pinia 同时支持 `OptionsAPI` 和 `CompositionAPI` 两种语法。

初始化项目时我们就已经装了 `Pinia`， `src/stores` 文件夹就是我们的共享状态文件夹，里面有个建项目时创建的 `counter.js `文件，直接删掉即可。

接着，在 `src/stores` 文件夹下创建 `system.js` 文件，`system` 模块即项目的系统配置模块，布局相关的状态数据都放在这里即可：

```js
export const useSystemStore = defineStore('system', () => {
  // 当前可切换布局
  const currentSwitchlayout = shallowRef(null)
  // 可切换布局列表
  const switchLayoutList = shallowRef([])

    return {
      currentSwitchlayout,
      switchLayoutList
    }
})
```

如上，其实用 CompositionAPI 语法写起来和平常在 setup 中没有太大区别。
上面我们创建了当前可切换布局对象 currentSwitchlayout 默认是 null 以及可切换布局列表 switchLayoutList 默认是空数组两个响应式属性。可能大家注意到了，我们这里使用的是 shallowRef 而不是 ref，因为我们把整个布局组件都作为数据源了，如果使用 ref，它会一直递归给布局组件的各个属性做响应式，而这些我们都不需要，太消耗资源，我们只需浅层响应就可以了。
接下来我们还需要在 system 模块中写一个初始化布局的方法：

```js
export const useSystemStore = defineStore('system', () => {
  // 当前可切换布局
  const currentSwitchlayout = shallowRef(null)
  // 可切换布局列表
  const switchLayoutList = shallowRef([])

  // 初始化可切换布局方法
  const initSwitchLayout = list => {
    if (list && list.length > 0) {
      switchLayoutList.value = [...list]

      if (!currentSwitchlayout.value) {
        currentSwitchlayout.value = switchLayoutList.value[0]
      }
    }
  }

  return {
    currentSwitchlayout,
    switchLayoutList,
    initSwitchLayout
  }
})
```

初始化方法接收一个布局列表，就是为 `switchLayoutList` 赋值，然后判断当前布局组件对象 `currentSwitchlayout` 是否有值，没有的话给它一个默认值仅此而已。

那么要在哪里进行布局初始化呢？没错就是 `SwitchIndex` 组件，修改 `src/layout/SwitchIndex.vue` 文件如下：

```js
<script setup>
import switchLayoutList from '@/layout/switch/index.js'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

// 初始化布局列表
systemStore.initSwitchLayout(switchLayoutList)
</script>

<template>
  <div class="switch-index">
    <component :is="systemStore.currentSwitchlayout" />
  </div>
</template>

<style scoped></style>
```

如上，我们在 `SwitchIndex` 组件中引入了 `pinia system` 模块方法 `useSystemStore`，此方法返回一个 `systemStore` 对象，即我们 `system` 模块的 `store` 数据对象（就是上面写 `useSystemStore` 方法时 `return` 的那些数据集）。

接着使用布局初始化方法传入我们之前引入的布局组件列表 `switchLayoutList` 给布局组件进行初始化。

其实我们的当前布局对象本身就是布局组件，所以直接在模板中将当前布局组件对象 `currentSwitchlayout` 传入 `component` 组件 `is` 属性中渲染布局即可。

#### 4.5.4 切换布局组件SwitchLayout

切换布局组件还是放在导航条上哈，在 `src/layout/components` 文件夹下新建 `SwitchLayout.vue` 文件：

```vue
<script setup>
import { useSystemStore } from '@/stores/system.js'
const { currentSwitchlayout, switchLayoutList } = storeToRefs(useSystemStore())

// 下拉菜单选中事件
const handleSelect = val => (currentSwitchlayout.value = val)

const { next } = useCycleList(switchLayoutList.value, {
  initialValue: currentSwitchlayout
})
</script>

<template>
  <a-dropdown @select="handleSelect" trigger="hover" class="layout-dropdown">
    <a-button type="text" @click="next()">
      <template #icon>
        <component
          :is="currentSwitchlayout.icon"
          class="text-[var(--color-text-1)] text-16px"
        ></component>
      </template>
    </a-button>
    <template #content>
      <a-doption
        v-for="item in switchLayoutList"
        :key="item.name"
        :value="item"
      >
        <template #icon v-if="currentSwitchlayout.name === item.name">
          <icon-material-symbols-check-small class="text-[var(--color-text-1)] text-14px" />
        </template>
        <template #default>{{ item.title }}</template>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<style scoped>
.layout-dropdown .arco-dropdown-option {
  @apply flex justify-end items-center;
}
</style>
```

至于 `template` 模板内容，我们使用了一个下拉菜单组件，展示到页面上的图标就是当前布局的图标。

还记得我们写布局组件时给每个布局组件都自定义了一个 icon 属性并赋值了一个图标组件吗？这里直接使用 `Vue` 内置的 `component` 组件渲染出来就行。鼠标悬浮到当前布局图标上展示下拉菜单面板，这个面板就遍历一下布局组件列表 `switchLayoutList` 把对应的布局组件名放上去即可，除此之外还给选中的菜单项在下拉菜单中用一个 `iconify` 图标 `material-symbols:check-small` 标注了下（就是个对号图标）。

接下来使用一下 `SwitchLayout` 组件，两个布局组件都需要使用，放在 Navbar 组件右侧插槽中即可。

修改 `DefaultLayout` 组件（只展示了修改处代码）：

```js
<a-layout-header>
  <Navbar>
    <template #left> <Logo /> </template>
    <template #center> <Menu /> </template>

    <template #right>
      <SwitchLayout />
      <Github />
    </template>
  </Navbar>
</a-layout-header>
```

修改 `SidebarLayout` 组件（只展示了修改处代码）：

```vue
<a-layout-header>
  <Navbar>
    <template #left> <Logo /> </template>

    <template #right>
    <SwitchLayout />
    <Github />
    </template>
    </Navbar>
</a-layout-header>
```

### 4.6 Pinia状态持久化

虽然布局做好了，但是我们点击切换布局之后刷新页面会重新走初始化布局流程，刷新一下布局就变回原来的样子了，所以我们还需要给当前布局对象做个持久化。

其实 `Vue3` 中我们完全可以写 `Hooks` 来做一些简单的状态共享，并不一定需要 `Pinia`，之所以还使用 `Pinia`，是因为 `Pinia` 有两个好处：

1. `Pinia` 可以使用 `Vue` 浏览器插件 `Vue Devtools` 去追踪状态变化；
2. `Pinia` 有插件系统，可以使用插件处理一些东西；

那 Pinia 模块状态持久化就可以用插件很便捷的做，这里我们使用一个[开源的状态持久化插件](https://github.com/prazdevs/pinia-plugin-persistedstate)。

#### 4.6.1 安装

```js
pnpm i pinia-plugin-persistedstate

// or

npm i pinia-plugin-persistedstate
```

#### 4.6.2 使用

```js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

安装好了之后去使用一下此插件，我们是在入口文件 src/main.js 中创建的 Pinia 实例，所以要在这里使用插件，先看下目前的 main.js 文件内容：

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/normalize.css'
// 导入Unocss样式
import 'uno.css'

import { getConfig } from '@/config/index'
console.log(getConfig('projectCode'))
console.log(getConfig('projectName'))
console.log(import.meta.env.VITE_APP_ENV)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

把没有用的代码删一删，然后使用一下 `Pinia` 插件，修改 `main.js` 如下：

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 引入 Pinia 状态持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import '@/styles/normalize.css'
// 导入Unocss样式
import 'uno.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()
// 使用 Pinia 状态持久化插件
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(router)

app.mount('#app')
```

接下来去 `src/stores/system.js` 文件中做一下配置：

```js
import { getConfig } from '@/config/index'

export const useSystemStore = defineStore(
  'system',
  () => {
    // ...
  },
  // 新增第三个参数
  {
    persist: {
      key: `${getConfig('appCode')}-pinia-system`,
      enabled: true,
      storage: window.localStorage,
      paths: ['currentSwitchlayout']
    }
  }
)
```

如上，我们新增第三个参数对象，该对象中配置 `persist` 属性为 `true` 会默认开启该模块所有状态的持久化，显然我们只需要给模块中的当前布局对象 `currentSwitchlayout` 做持久化就可以了，所以我们需要将 `persist` 属性配置为一个对象，这个对象有如下几个参数：

1. `key` 属性用来配置持久化时缓存数据的 key，默认是模块名；
2. `enabled` 属性代表是否开启持久化；
3. `storage` 属性可以配置如何进行持久化存储，可以写成 `sessionStorage`，默认是使用 `localStorage` ，所以这里我们其实不写也可以；
4. `paths` 属性即配置模块中需要做持久化的状态列表，不写就是默认缓存该模块中的全部状态；
5. `serializer` 此对象可以自定义序列化方法，默认使用 `JSON.stringify/JSON.parse`做序列化；

上面我们的配置是给模块中的 `currentSwitchlayout` 持久化存储到 `localStorage` 中。

然后，修改 `src/stores/system.js`中布局初始化方法如下：

```js
const initSwitchLayout = list => {
  if (list && list.length > 0) {
    switchLayoutList.value = [...list]

    if (!currentSwitchlayout.value) {
      currentSwitchlayout.value = switchLayoutList.value[0]
    } else {
      // 通过name属性找到布局对象并赋值，因为持久化数据中没有组件渲染的render函数
      currentSwitchlayout.value = switchLayoutList.value.find(
        item => item.name === currentSwitchlayout.value.name
      )
    }
  }
}
```

至此，vue实战的基础项目就实现完成了。可以参考[此链接](https://github.com/xianzao/xianzao-vue-tools/tree/master)。

# Vue编译器

https://www.yuque.com/lpldplws/web/abbfgk?singleDoc# 《编译器》 密码：uteo

## 1.课程目标

1. 掌握编译原理的基本思路；
2. 掌握一个简单的编译器的实现；

## 2. 课程大纲

- 什么是编译器；
- 编译器的基本思路；
- 一个简单的编译器的实现；

## 3.什么是编译器

### 3.1. 背景

在babel的[官网](https://babeljs.io/)里，最显著的内容就是：

Babel is a JavaScript compiler

那么什么是所谓的JavaScript compiler？我们应当如何学习和理解compiler？

### 3.2 编译器介绍

compiler也叫编译器，是一种电脑程序，它会将用某种编程语言写成的源代码，转换成另一种编程语言。

从维基百科的定义来看，编译器就是个将当前语言转为其他语言的过程，回到babel上，它所做的事就是语法糖之类的转换，比如ES6/ES7/JSX转为ES5或者其他指定版本，因此称之为compiler也是正确的，换言之，像我们平时开发过程中所谓的其他工具，如：

- Less/Saas
- TypeScript/coffeeScript
- Eslint
- etc...

都可以看到compiler的身影，也是通过这些工具，才使得目前的前端工程化能走入相对的深水区，以下会详细介绍下compiler的实现思路及具体demo，帮助同学们了解compiler的基本实现。

## 4 编译器的基本思路

此处主要讲解compiler的思路

### 4.1 词法分析(Lexical Analysis)

#### 4.1.1 目标

将文本分割成一个个的“token”，例如：init、main、init、x、;、x、=、3、;、}等等。同时它可以去掉一些注释、空格、回车等等无效字符；

#### 4.1.2 生成方式

词法分析生成token的办法有2种：

**1. 使用正则进行词法分析**

需要写大量的正则表达式，正则之间还有冲突需要处理，不容易维护，性能不高，所以正则只适合一些简单的模板语法，真正复杂的语言并不合适。并且有的语言并不一定自带正则引擎。

**2. 使用自动机进行词法分析**

自动机可以很好的生成token；

有穷状态自动机（finite state machine）：在有限个输入的情况下，在这些状态中转移并期望最终达到终止状态。

有穷状态自动机根据确定性可以分为：

“确定有穷状态自动机”（DFA - Deterministic finite automaton）

在输入一个状态时，只得到一个固定的状态。DFA 可以认为是一种特殊的 NFA；

“非确定有穷自动机”（NFA - Non-deterministic finite automaton）

当输入一个字符或者条件得到一个状态机的集合。JavaScript 正则采用的是 NFA 引擎，具体看后文；

### 4.2 语法分析（Syntactic Analysis）

我们日常所说的编译原理就是将一种语言转换为另一种语言。编译原理被称为形式语言，它是一类无需知道太多语言背景、无歧义的语言。而自然语言通常难以处理，主要是因为难以识别语言中哪些是名词哪些是动词哪些是形容词。例如：“进口汽车”这句话，“进口”到底是动词还是形容词？所以我们要解析一门语言，前提是这门语言有严格的语法规定的语言，而定义语言的语法规格称为**文法**。

1956年，乔姆斯基将文法按照规范的严格性分为0型、1型、2型和3型共4中文法，从0到3文法规则是逐渐增加严的。一般的计算机语言是2型，因为0和1型文法定义宽松，将大大增加解析难度、降低解析效率，而3型文法限制又多，不利于语言设计灵活性。2型文法也叫做上下文无关文法（CFG）。

 语法分析的目的就是通过词法分析器拿到的token流 + 结合文法规则，通过一定算法得到一颗抽象语法树（AST）。抽象语法树是非常重要的概念，尤其在前端领域应用很广。典型应用如babel插件，它的原理就是：es6代码 → Babylon.parse → AST → babel-traverse → 新的AST → es5代码。

 从生成AST效率和实现难度上，前人总结主要有2种解析算法：自顶向下的分析方法和自底向上的分析方法。自底向上算法分析文法范围广，但实现难度大。而自顶向下算法实现相对简单，并且能够解析文法的范围也不错，所以一般的compiler都是采用深度优先索引的方式。

### 4.3 代码转换（Transformation）

在得到AST后，我们一般会先将AST转为另一种AST，目的是生成更符合预期的AST，这一步称为代码转换。

代码转换的优势：主要是产生工程上的意义

- 易移植：与机器无关，所以它作为中间语言可以为生成多种不同型号的目标机器码服务；
- 机器无关优化：对中间码进行机器无关优化，利于提高代码质量；
- 层次清晰：将AST映射成中间代码表示，再映射成目标代码的工作分层进行，使编译算法更加清晰 ；

对于一个Compiler而言，在转换阶段通常有两种形式：

同语言的AST转换；

AST转换为新语言的AST；

这里有一种通用的做法是，对我们之前的AST从上至下的解析（称为traversal），然后会有个映射表（称为visitor），把对应的类型做相应的转换。

### 4.4 代码生成（Code Generation）

在实际的代码处理过程中，可能会递归的分析（**recursive**）我们最终生成的AST，然后对于每种type都有个对应的函数处理，当然，这可能是最简单的做法。总之，我们的目标代码会在这一步输出，对于我们的目标语言，它就是HTML了。

### 4.5 完整链路(Compiler)

至此，我们就完成了一个完整的compiler的所有过程：

```js
input => tokenizer => tokens; // 词法分析
tokens => parser => ast; // 语法分析，生成AST
ast => transformer => newAst; // 中间层代码转换
newAst => generator => output; // 生成目标代码
```

## 5. 一个简单的编译器的实现

此处实现一个基础的compiler

### 5.1 前置内容

```js
/**
 * 今天我们要一起写一个编译器。但不仅仅是任何编译器......
 * 超级小的编译器！一个很小的编译器，如果你
 * 删除所有注释，这个文件只有大约 200 行实际代码。
 *
 * 我们将把一些类似语义化代码的函数调用编译成一些类似 C 的函数
 * 函数调用。
 *
 * 如果您不熟悉其中之一。我只是给你一个快速的介绍。
 *
 * 如果我们有两个函数 `add` 和 `subtract` 他们会写成这样：
 *
 * 类似 C
 *
 * 2 + 2 (加 2 2) 加 (2, 2)
 * 4 - 2 (减 4 2) 减 (4, 2)
 * 2 + (4 - 2) (加 2 (减 4 2)) 加 (2, 减 (4, 2))
 *
 *
 * 很好，因为这正是我们要编译的。虽然这
 * 不是完整的 C 语法，它的语法足以
 * 演示现代编译器的许多主要部分。
 */

/**
 * 大多数编译器分为三个主要阶段：解析、转换、
 * 和代码生成
 *
 * 1. *解析* 将原始代码转化为更抽象的代码
 * 代码的表示。
 *
 * 2. *转换* 采用这种抽象表示并进行操作
 * 无论编译器想要什么。
 *
 * 3. *代码生成*采用转换后的代码表示，并
 * 将其转换为新代码。
 */
```

```js
/**
 * 解析
 * --------
 *
 * 解析通常分为两个阶段：词法分析和
 * 句法分析。
 *
 * 1. *词法分析*获取原始代码并将其拆分成这些东西
 * 被称为标记器（或词法分析器）的东西称为标记。
 *
 * Tokens 是一组微小的对象，描述了一个孤立的部分
 * 的语法。它们可以是数字、标签、标点符号、运算符、
 *    任何。
 *
 * 2. *句法分析*获取标记并将它们重新格式化为
 * 描述语法的每个部分及其关系的表示
 *    彼此。这被称为中间表示或
 * 抽象语法树。
 *
 * 抽象语法树，简称 AST，是一个深度嵌套的对象，
 * 以一种既易于使用又能告诉我们很多信息的方式表示代码
 * 信息。
 *
 * 对于以下语法：
 *
 * (加 2 (减 4 2))
 *
 * 令牌可能看起来像这样：
 *
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 *
 * 抽象语法树 (AST) 可能如下所示：
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 */
```

```js

/**
 * 转换
 * --------------
 *
 * 编译器的下一个阶段是转换。再次，这只是
 * 从最后一步获取 AST 并对其进行更改。它可以操纵
 * 使用相同语言的 AST，或者它可以将其翻译成全新的
 * 语。
 *
 * 让我们看看如何转换 AST。
 *
 * 您可能会注意到我们的 AST 中的元素看起来非常相似。
 * 这些对象具有类型属性。这些中的每一个都被称为
 * AST 节点。这些节点在它们上定义了描述一个
 * 树的隔离部分。
 *
 * 我们可以有一个“NumberLiteral”的节点：
 *
*   {
 *     type: 'NumberLiteral',
 *     value: '2',
 *   }
 *
 * Or maybe a node for a "CallExpression":
 *
 *   {
 *     type: 'CallExpression',
 *     name: 'subtract',
 *     params: [...nested nodes go here...],
 *   }
 *
 * 转换 AST 时，我们可以通过以下方式操作节点
 * 添加/删除/替换属性，我们可以添加新节点，删除节点，或者
 * 我们可以不理会现有的 AST 并创建一个全新的基于
 * 在上面。
 *
 * 由于我们的目标是一种新语言，我们将专注于创建一个
 * 特定于目标语言的全新 AST。
 *
 * 遍历
 * ---------
 *
 * 为了浏览所有这些节点，我们需要能够
 * 遍历它们。这个遍历过程会到达 AST 中的每个节点
 * 深度优先。
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2'
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4'
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2'
 *         }]
 *       }]
 *     }]
 *   }
 *
 * 所以对于上面的 AST，我们会去：
 *
 * 1. Program - 从 AST 的顶层开始
 * 2. CallExpression (add) - 移动到程序主体的第一个元素
 * 3. NumberLiteral (2) - 移动到 CallExpression 参数的第一个元素
 * 4. CallExpression (subtract) - 移动到 CallExpression 参数的第二个元素
 * 5. NumberLiteral (4) - 移动到 CallExpression 参数的第一个元素
 * 6. NumberLiteral (2) - 移动到 CallExpression 参数的第二个元素
 *
 * 如果我们直接操作这个 AST，而不是创建一个单独的 AST，
 * 我们可能会在这里引入各种抽象。但只是参观
 * 树中的每个节点都足以完成我们正在尝试做的事情。
 *
 * 我使用“访问”这个词的原因是因为有这样的模式
 * 表示对对象结构元素的操作。
*
 * Visitors
 * --------
 *
 * 这里的基本思想是我们将创建一个“访问者”对象，
 * 具有将接受不同节点类型的方法。
 *
 *   var visitor = {
 *     NumberLiteral() {},
 *     CallExpression() {},
 *   };
 *
 * 当我们遍历我们的 AST 时，我们会在任何时候调用这个访问者的方法
 * “输入”一个匹配类型的节点。
 *
 * 为了使它有用，我们还将传递节点和引用
 * 父节点。
 *
 *   var visitor = {
 *     NumberLiteral(node, parent) {},
 *     CallExpression(node, parent) {},
 *   };
 *
 * 但是，也存在在“退出”时调用事物的可能性。想象
 * 我们之前的树形结构以列表形式：
 *
 *   - Program
 *     - CallExpression
 *       - NumberLiteral
 *       - CallExpression
 *         - NumberLiteral
 *         - NumberLiteral
 *
 * 当我们向下遍历时，我们将到达有死胡同的分支。正如我们
 * 完成我们“退出”它的树的每个分支。所以我们顺着树走
 *“进入”每个节点，然后返回我们“退出”。
 *
 *   -> Program (enter)
 *     -> CallExpression (enter)
 *       -> Number Literal (enter)
 *       <- Number Literal (exit)
 *       -> Call Expression (enter)
 *          -> Number Literal (enter)
 *          <- Number Literal (exit)
 *          -> Number Literal (enter)
 *          <- Number Literal (exit)
 *       <- CallExpression (exit)
 *     <- CallExpression (exit)
 *   <- Program (exit)
 *
 * 为了支持这一点，我们的访问者的最终形式将如下所示：
 *
 *   var visitor = {
 *     NumberLiteral: {
 *       enter(node, parent) {},
 *       exit(node, parent) {},
 *     }
 *   };
 */
```

```js
/**
 * 代码生成
 * ---------------
 *
 * 编译器的最后阶段是代码生成。有时编译器会做
 * 与转换重叠的东西，但大部分是代码
 * 生成只是意味着取出我们的 AST 和字符串化代码。
 *
 * 代码生成器有几种不同的工作方式，一些编译器会重用
 * 早期的令牌，其他人将创建一个单独的表示
 *代码，以便他们可以线性打印节点，但据我所知
 * 将使用我们刚刚创建的相同 AST，这是我们将重点关注的内容。
 *
 * 实际上，我们的代码生成器将知道如何“打印”所有不同的
 * AST的节点类型，它会递归调用自己打印嵌套
 * 节点，直到所有内容都打印成一长串代码。
 */

/**
 *就是这样！这就是编译器的所有不同部分。
 *
 * 现在这并不是说每个编译器看起来都和我在这里描述的完全一样。
 * 编译器有许多不同的用途，它们可能需要更多的步骤
 * 我有详细的。
 *
 * 但是现在您应该对大多数编译器的外观有一个大致的高级概念
 * 喜欢。
 *
 * 现在我已经解释了所有这些，你们都可以自己写了
 * 编译器对吗？
 *
 * 开个玩笑，这就是我来帮忙的：P
 *
 * 那么让我们开始吧...
 */
```

### 5.2 词法分析

```js
/**
 * ============================================================================
 *                                   (/^▽^)/
 *                                词法分析！
 * ============================================================================
 */

function tokenizer(input) {
  let current = 0;

  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '(',
      });

      current++;

      continue;
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });

      continue;
    }

    if (char === '"') {
      let value = '';

      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];

      tokens.push({ type: 'string', value });

      continue;
    }

    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'name', value });

      continue;
    }

    throw new TypeError('I dont know what this character is: ' + char);
  }
  return tokens;
}
```

### 5.3 语法分析

```js
/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE 解析!!!
 * ============================================================================
 */

function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === 'number') {
      current++;

      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];

      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      token = tokens[++current];

      while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }

    throw new TypeError(token.type);
  }

  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}
```

### 5.4 代码转换

```js
/**
 * ============================================================================
 *                                 ⌒(❀>◞౪◟<❀)⌒
 *                              代码转换方法!!!
 * ============================================================================
 */

function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;

      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      default:
        throw new TypeError(node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseNode(ast, null);
}

/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                              代码转换!!!
 * ============================================================================
 */

/**
 *
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        parent._context.push(expression);
      },
    },
  });

  return newAst;
}

```

### 5.5 代码生成

```js
/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            代码生成!!!!
 * ============================================================================
 */

function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('\n');

    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) + ';' // << (...because we like to code the *correct* way)
      );

    case 'CallExpression':
      return codeGenerator(node.callee) + '(' + node.arguments.map(codeGenerator).join(', ') + ')';

    case 'Identifier':
      return node.name;

    case 'NumberLiteral':
      return node.value;

    case 'StringLiteral':
      return '"' + node.value + '"';

    default:
      throw new TypeError(node.type);
  }
}
```

### 5.6 完整流程

```js
/**
 * ============================================================================
 *                                  (۶* ‘ヮ’)۶”
 *                         !!!!!!!!完整流程!!!!!!!!
 * ============================================================================
 */

/**
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  return output;
}
```

## 6. 附录

- [the super tiny compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)；
- [JavaScript compiler](https://github.com/jacksplwxy/JavaScript-compiler)；

## 7. 课后作业

1. 照着代码，手写一遍compiler的过程；

2. 参考xianzao-cli，自己实现一个自身业务上的cli；

# React学习路径

https://www.yuque.com/lpldplws/web/bgn3sl?singleDoc# 《react学习路径》 密码：ei05

## 1. react生态

1. 创建项目

1. 1. CRA(create react app) ：https://github.com/facebook/create-react-app
   2. Vite（2022大热）：https://github.com/vitejs/vite
   3. SSR应用：Next.js：https://github.com/vercel/next.js
   4. 静态站点：Gatsby.js：https://github.com/gatsbyjs/gatsby
   5. 新web 框架：remix：https://github.com/remix-run/remix

1. 状态管理

1. 1. react hooks
   2. redux：https://redux.js.org/
   3. Zusand（本地状态管理）：https://github.com/pmndrs/zustand

1. 远程状态管理

1. 1. React Query（REST API、GraphQL API 都有）：https://github.com/tannerlinsley/react-query
   2. Apollo Client（只有 GraphQL API）：https://www.apollographql.com/docs/react/
   3. RTK Query（结合Redux管理远程数据请求）：https://redux-toolkit.js.org/rtk-query/overview

1. 路由

1. 1. https://reactrouter.com/

1. 样式

1. 1. CSS Modules（CSS in CSS）：https://github.com/css-modules/css-modules
   2. Styled Components（CSS in JS，目前最受欢迎）:https://www.robinwieruch.de/react-styled-components/
   3. Tailwind CSS（Utility-First-CSS）：https://tailwindcss.com/
   4. clsx（条件渲染）：https://github.com/lukeed/clsx

1. 组件库

1. 1. material UI（最流行）：https://mui.com/zh/
   2. Ant Design（国内最流行）：https://ant.design/

1. 动画库

1. 1. React Transition Group
   2. Framer Motion：https://www.framer.com/motion/
   3. react-motion：https://github.com/chenglou/react-motion

1. 可视化图表

1. 1. D3：https://d3js.org/
   2. Recharts：https://recharts.org/zh-CN/
   3. react-chartjs：https://github.com/reactchartjs/react-chartjs-2

1. 表单

1. 1. react hook form：https://react-hook-form.com/

1. 类型检查

1. 1. PropTypes
   2. TS：https://www.typescriptlang.org/

1. 代码风格

1. 1. eslint：https://eslint.org/
   2. prettier：https://github.com/prettier/prettier
   3. Airbnb 代码风格指南：https://keqingrong.cn/blog/2020-05-04-code-style-guide-for-react/
   4. React 代码风格指南：https://www.robinwieruch.de/react-libraries/

1. 身份校验

1. 1. firebase：https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
   2. auth0：https://auth0.com/

1. 测试

1. 1. Jest：https://jestjs.io/zh-Hans/

1. 数据处理

1. 1. immutable.js：https://immutable-js.com/
   2. immer：https://github.com/immerjs/immer

1. i18n

1. 1. formatjs：https://github.com/formatjs/formatjs
   2. react-i18next：https://github.com/i18next/react-i18next

1. 富文本编辑

1. 1. draft：https://draftjs.org/
   2. react-quill：https://github.com/zenoamaro/react-quill

1. 时间处理

1. 1. date-fns：https://github.com/date-fns/date-fns
   2. Day.js：https://github.com/iamkun/dayjs

1. 客户端

1. 1. Electron：https://www.electronjs.org/
   2. tauri：https://github.com/tauri-apps/tauri
   3. nwjs：https://nwjs.io/

1. 移动端

1. 1. RN：https://reactnative.dev/

1. 原型设计

1. 1. sketch：https://www.sketch.com/
   2. figma：https://www.figma.com/
   3. zeplin：https://zeplin.io/

1. 文档类

1. 1. storybook：https://storybook.js.org/

1. 其他工具

1. 1. webpack
   2. babel

## 2. 工具类

1. shadowsocks
2. search

1. 1. http://google.com/
   2. https://stackoverflow.com/

1. awesome 系列

1. 1. https://github.com/enaqx/awesome-react

1. github star多的

## 3. 实践类

1. 前后端自己搭建：阿里云 ECS + OSS + mysql
2. blog：GATSBY、GitHub page

## 4. 前沿技术学习

1. 早早聊：https://www.zaozao.run/
2. D2：https://github.com/d2forum
3. Qcon：https://qcon.infoq.cn/2022/beijing
4. JSConf：https://jsconf.com/

# React基础

tauri

https://www.yuque.com/lpldplws/web/lg3g1s?singleDoc# 《React基础》 密码：tv0g

React是一个声明式，高效灵活的构建用户界面的js库,更快响应用户操作的UI库组件

UI=render(data) 单向数据流

## 1.课程目标

1. 入门React，了解常规用法；
2. 掌握面试中React的基础问题；
3. 掌握React学习路线；

## 2. 课程大纲

- React简介
- JSX模板语法
- props & state
- 生命周期
- 事件处理
- 条件渲染
- 列表
- create-react-app
- immutable 及immer

## 3.主要内容

官网地址：https://zh-hans.reactjs.org/

### 3.1 React简介

React 是一个声明式，高效且灵活的用于构建用户界面的 JavaScript 库。使用 React 可以将一些简短、独立的代码片段组合成复杂的 UI 界面，这些代码片段被称作“组件”。

ui = render (data) -> 单向数据流

- MVC

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2340337/1647071835190-02b721bb-406d-452f-adb9-3a1af1daf22e.png)

```js
// model
var myapp = {}; // 创建这个应用对象

myapp.Model = function() {
  var val = 0;

  this.add = function(v) {
    if (val < 100) val += v;
  };

  this.sub = function(v) {
    if (val > 0) val -= v;
  };

  this.getVal = function() {
    return val;
  };

  ／* 观察者模式 *／
  var self = this, 
      views = [];

  this.register = function(view) {
    views.push(view);
  };

  this.notify = function() {
    for(var i = 0; i < views.length; i++) {
        views[i].render(self);
    }
  };
};

// view
myapp.View = function(controller) {
  var $num = $('#num'),
      $incBtn = $('#increase'),
      $decBtn = $('#decrease');

  this.render = function(model) {
      $num.text(model.getVal() + 'rmb');
  };

  /*  绑定事件  */
  $incBtn.click(controller.increase);
  $decBtn.click(controller.decrease);
};

// controller
myapp.Controller = function() {
  var model = null,
      view = null;

  this.init = function() {
    /* 初始化Model和View */
    model = new myapp.Model();
    view = new myapp.View(this);

    /* View向Model注册，当Model更新就会去通知View啦 */
    model.register(view);
    model.notify();
  };

  /* 让Model更新数值并通知View更新视图 */
  this.increase = function() {
    model.add(1);
    model.notify();
  };

  this.decrease = function() {
    model.sub(1);
    model.notify();
  };
};

// init
(function() {
  var controller = new myapp.Controller();
  controller.init();
})();
```

- mvvm

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1647072104508-55c6d7e4-d8c5-4f39-afab-def587496cae.png)

### 3.2 JSX模版语法

JSX称为JS的语法扩展，将UI与逻辑层耦合在组件里，用{}标识

因为 JSX 语法上更接近 JS 而不是 HTML，所以使用 camelCase（小驼峰命名）来定义属性的名称；

JSX 里的 class 变成了 [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)，而 tabindex 则变为 [tabIndex](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)。

#### 3.2.1 jsx支持表达式

支持JS表达式，变量，方法名

```jsx
// 变量
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

// 方法
const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

#### 3.2.2 jsx指定属性

```jsx
const element = <img src={user.avatarUrl}></img>;

注意：JSX支持防注入(防止XSS攻击)
const title = response.potentiallyMaliciousInput;  // 此时只是字符串
// 直接使用是安全的： const element = <h1>{title}</h1>;

React 如何预防XSS

// 反射型 XSS

https://xxx.com/search?query=userInput

// 服务器在对此 URL 的响应中回显提供的搜索词：query=123
<p>您搜索的是: 123</p>

// https://xxx.com/search?query=<img src="empty.png" onerror ="alert('xss')">
<p>您搜索的是: <img src="empty.png" onerror ="alert('xss')"></p>
// 如果有用户请求攻击者的 URL ，则攻击者提供的脚本将在用户的浏览器中执行。

  
// 存储型 XSS，存储到目标数据库
// 评论输入，所有访问用户都能看到了
<textarea>
  <img src="empty.png" onerror ="alert('xss')">
</textarea>
  
// 部分源码
for (index = match.index; index < str.length; index++) {
  switch (str.charCodeAt(index)) {
    case 34: // "
      escape = '&quot;';
      break;
    case 38: // &
      escape = '&amp;';
      break;
    case 39: // '
      escape = '&#x27;';
      break;
    case 60: // <
      escape = '&lt;';
      break;
    case 62: // >
      escape = '&gt;';
      break;
    default:
      continue;
  }
}

// 一段恶意代码
<img src="empty.png" onerror ="alert('xss')"> 
//  React 在渲染到浏览器前进行的转义，可以看到对浏览器有特殊含义的字符都被转义了，恶意代码在渲染到 HTML 前都被转成了字符串
&lt;img src=&quot;empty.png&quot; onerror =&quot;alert(&#x27;xss&#x27;)&quot;&gt; 
  
// JSX
const element = (
  <h1 className="greeting">
      Hello, world!
  </h1>
);
  
// 通过 babel 编译后的代码
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
  
// React.createElement() 方法返回的 ReactElement
const element = {
  $$typeof: Symbol('react.element'),
  type: 'h1',
  key: null,
  props: {
    children: 'Hello, world!',
        className: 'greeting'   
  }
  ...
}
 
// 如何模拟一个Children会如何？
const storedData = `{
    "ref":null,
    "type":"body",
    "props":{
        "dangerouslySetInnerHTML":{
            "__html":"<img src=\"empty.png\" onerror =\"alert('xss')\"/>"
        }
    }
}`;
// 转成 JSON
const parsedData = JSON.parse(storedData);
// 将数据渲染到页面
render () {
    return <span> {parsedData} </span>; 
}
  
// $$typeof 是用来标记一个ReactElement的，JSON化后Symbol会丢失，React会报错
```

#### 3.2.3 jsx表示对象

```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

// 等同于React.createElement
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

#### 3.2.4 将JSX渲染为DOM

```jsx
// 使用ReactDOM.render
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));

// render只能代表当前时刻的状态
// 更新元素 只能再次 ReactDOM.render
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root')); 
}

setInterval(tick, 1000); // 不建议多次render
```

#### 3.2.5. JSX转JS

JSX可以当做语法糖，可以在babel官网中尝试，https://babeljs.io/repl

可以使用官网提供的create-react-app npm run eject 来看babelrc中的配置，主要使用

https://www.babeljs.cn/docs/babel-preset-react

```js
// 安装babel 及react 的依赖
npm install core-js @babel/core @babel/preset-env @babel/preset-react @babel/register babel-loader @babel/plugin-transform-runtime --save-dev

.babelrc
{
    "presets" : [ 
        "@babel/preset-env" ,
        "@babel/preset-es2015",
        "@babel/preset-react"
    ],
    "plugins" : [
        "@babel/plugin-transform-runtime"
    ]
}
```

### 3.3 props及state

组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

### 3.3.1 组件

- 函数式组件
- Class类组件

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

##### 3.3.1.1 渲染组件

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);

// 自定义组件使用大写字母开头
import React from 'react';

// 正确！组件需要以大写字母开头：
function Hello(props) {
  // 正确！ 这种 <div> 的使用是合法的，因为 div 是一个有效的 HTML 标签：
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 正确！React 知道 <Hello /> 是一个组件，因为它是大写字母开头的：
  return <Hello toWhat="World" />;
}
```

##### 3.3.1.2 组件的组合与拆分

```jsx
// 页面内多次引用
<div>
  <Welcome name="Sara" />
  <Welcome name="Cahal" />
  <Welcome name="Edite" />
</div>

function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

// 拆分后为
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

##### 3.3.1.3. 受控组件 与 非受控组件

- 受控组件：对某个组件状态的掌控，它的值是否只能由用户设置，而不能通过代码控制；

在HTML的表单元素中，它们通常自己维护一套state，并随着用户的输入自己进行UI上的更新，这种行为是不被我们程序所管控的。而如果将React里的state属性和表单元素的值建立依赖关系，再通过onChange事件与setState()结合更新state属性，就能达到控制用户输入过程中表单发生的操作。被React以这种方式控制取值的表单输入元素就叫做受控组件。

```jsx
// input自身维护的状态，外界无法获取数据
class TestComponent extends React.Component {
  render () {
    return <input name="username" />
  }
}

// 可以设置初始值
class TestComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { username: 'test' };
  }
  render () {
    return <input name="username" value={this.state.username} />
  }
}

// 可以读取并设置初始值
class TestComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: "test"
    }
  }
  onChange (e) {
    console.log(e.target.value);
    this.setState({
      username: e.target.value
    })
  }
  render () {
    return <input name="username" value={this.state.username} onChange={(e) => this.onChange(e)} />
  }

```

- 非受控组件：对应的，组件内的状态不由用户控制

```jsx
// 如果不想关心表单元素的值是如何变化的，只想取值，可以使用ref
import React, { Component } from 'react';

export class UnControll extends Component {
  constructor (props) {
    super(props);
    this.inputRef = React.createRef();
  }
  handleSubmit = (e) => {
    console.log('我们可以获得input内的值为', this.inputRef.current.value);
    e.preventDefault();
  }
  render () {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input defaultValue="lindaidai" ref={this.inputRef} />
        <input type="submit" value="提交" />
      </form>
    )
  }
}
```

#### 3.3.2 props

```jsx
所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。

// 错误，要像纯函数一样幂等
function withdraw(account, amount) {
  account.total -= amount;
}
```

#### 3.3.3 state

```jsx
// 使用props形式
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);

// 如何避免多次React.DOM render？

// 引用生命周期，根组件保留一个
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

```jsx
1. setState 
构造函数是唯一可以给state赋值的地方
this.setState({comment: 'Hello'});

2. state更新可能是异步的
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});

3. state更新会合并
constructor(props) {
  super(props);
  this.state = {
    posts: [],
    comments: []
  };
}

componentDidMount() {
  fetchPosts().then(response => {
    // 相当于{post: response.posts, ...otherState}
    this.setState({
      posts: response.posts
    });
  });

  fetchComments().then(response => {
    this.setState({
      comments: response.comments
    });
  });
}

4. 单向数据流
state 只在当前的组件里生效，属于组件内的属性，重复实例化相同的组件，内部的内存地址也是不一样的；
例如Clock中计时器都是独立的
```

```jsx
// setState 异步
// 异步目的：batch 处理，性能优化
//1. 合成事件
class App extends Component {
	
	state = { val: 0 }
	
	increment = () => {
		this.setState({ val: this.state.val + 1 })
		console.log(this.state.val) // 输出的是更新前的val --> 0
	}
	
	render() {
		return (
			<div onClick={this.increment}>
				{`Counter is: ${this.state.val}`}
			</div>
		)
	}
}

//2. 生命周期
class App extends Component {
	
	state = { val: 0 }
	
	componentDidMount() {
		this.setState({ val: this.state.val + 1 })
		console.log(this.state.val) // 输出的还是更新前的值 --> 0
	}
	render() {
		return (
			<div>
				{`Counter is: ${this.state.val}`}
			</div>
		)
	}
}

//3. 原生事件
class App extends Component {
	
	state = { val: 0 }
	
	changeValue = () => {
		this.setState({ val: this.state.val + 1 })
		console.log(this.state.val) // 输出的是更新后的值 --> 1
	}
	
	componentDidMount() {
		document.body.addEventListener('click', this.changeValue, false)
	}
	
	render() {
		return (
			<div>
				{`Counter is: ${this.state.val}`}
			</div>
		)
	}
}

//4. setTimeout
class App extends Component {
	
	state = { val: 0 }
	
	componentDidMount() {
		setTimeout(_ => {
			this.setState({ val: this.state.val + 1 })
			console.log(this.state.val) // 输出更新后的值 --> 1
		}, 0)
	}
	
	render() {
		return (
			<div>
				{`Counter is: ${this.state.val}`}
			</div>
		)
	}
}

//5. 批处理
class App extends Component {
	
	state = { val: 0 }
	
	batchUpdates = () => {
		this.setState({ val: this.state.val + 1 })
		this.setState({ val: this.state.val + 1 })
		this.setState({ val: this.state.val + 1 })
	}
	
	render() {
		return (
			<div onClick={this.batchUpdates}>
				{`Counter is ${this.state.val}`} // 1
			</div>
		)
	}
}

// 6. 综合
  componentDidMount() {
    // 生命周期中调用
    this.setState({ val: this.state.val + 1 });
    console.log("lifecycle: " + this.state.val);//lifecycle:0

    setTimeout(() => {
      // setTimeout中调用
      this.setState({ val: this.state.val + 1 });
      console.log("setTimeout: " + this.state.val);//setTimeout:2
    }, 0);

    document.getElementById("div2").addEventListener("click", this.increment2);
  }

  increment = () => {
    // 合成事件中调用
    this.setState({ val: this.state.val + 1 });
    console.log("react event: " + this.state.val);//react event:2
  };

  increment2 = () => {
    // 原生事件中调用
    this.setState({ val: this.state.val + 1 });
    console.log("dom event: " + this.state.val);//dom event:4
  };

  render() {
    return (
      <div className="App">
        <h2>Count: {this.state.val}</h2>
        <div id="div1" onClick={this.increment}> // 点击第一次
          click me and val + 1
        </div>
        <div id="div2">click me and val + 1</div> // 点击第二次
      </div>
    );
  }
}

export default App;
```

1. setState 只在合成事件和生命周期中是“异步”的，在原生事件和 setTimeout 中都是同步的;

2. setState的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的， 只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”， 当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。

3. setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState ， setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

### 3.4 生命周期

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1646656380983-233bbd92-6d70-4131-b4e3-5517eaf93b76.png)

#### 3.4.1. render

是class组件必需的方法

获取最新的 props 和 state

在不修改组件 state 的情况下，每次调用时都返回相同的结果

#### 3.4.2 constructor

如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。

- 通过给 this.state 赋值对象来初始化内部 state。
- 为事件处理函数绑定实例

```jsx
constructor(props) {
  super(props);
  // 不要在这里调用 this.setState()
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}

1. 不要调用 setState()
2. 避免将 props 的值复制给 state
this.state = { color: props.color }; // wrong
```

#### 3.4.3. componentDidMount

会在组件挂载后（插入 DOM 树中）立即调用

依赖于 DOM 节点的初始化应该放在这里，如需通过网络请求获取数据；

可以在此生命周期里加 setState，但发生在浏览器更新屏幕之前，会导致性能问题；

有更新在render阶段的 constructor 中 init State，但有更新可以在此方法时 setState

#### 3.4.4 componentDidUpdate

```jsx
componentDidUpdate(prevProps, prevState, snapshot)
```

会在更新后会被立即调用。首次渲染不会执行此方法。

```jsx
componentDidUpdate(prevProps) {
  // 典型用法（不要忘记比较 props）：加条件判断，不然死循环
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
如果组件实现了 getSnapshotBeforeUpdate() 生命周期，
则它的返回值将作为 componentDidUpdate() 的第三个参数 “snapshot” 参数传递。否则此参数将为 undefined。
```

如果 shouldComponentUpdate() 返回值为 false，则不会调用 componentDidUpdate()。

#### 3.4.5 componentWillUnmount

componentWillUnmount() 会在组件卸载及销毁之前直接调用。例如，清除 timer，取消网络请求；

componentWillUnmount() 中不应调用 setState()，因为该组件将永远不会重新渲染；

#### 3.4.6 shouldComponentUpdate

```jsx
shouldComponentUpdate(nextProps, nextState)
```

根据 shouldComponentUpdate() 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是 state 每次发生变化组件都会重新渲染。

作为性能优化使用，返回false可以跳过re-render

shouldComponentUpdate() 返回 false，不会调用 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()。

#### 3.4.7 getDerivedStateFromProps

（不常用）

是为了取代componentWillReceiveProps 和 componentWillUpdate设置的

根据props的变化改变state，它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

- 在使用此生命周期时，要注意把传入的 prop 值和之前传入的 prop 进行比较；
- 因为这个生命周期是静态方法，同时要保持它是纯函数，不要产生副作用；

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
    const {type} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (type !== prevState.type) {
        return {
            type,
        };
    }
    // 否则，对于state不进行任何操作
    return null;
}

Class ColorPicker extends React.Component {
    state = {
        color: '#000000'
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.color) {
            return {
                color: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作，setState({color: XXX})
    }
}

Class ColorPicker extends React.Component {
    state = {
        color: '#000000',
        prevPropColor: '' // setState 和 forceUpdate也会触发此生命周期，会覆盖
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.prevPropColor) {
            return {
                color: props.color,
                prevPropColor: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
}
```

首先看一下概念，这个生命周期是从props中获取state，实际上就是将传入的props映射到state上面。

shouldComponentUpdate(nextProps, nextState)

`getDerivedStateFromProps`是一个静态函数，也就是这个函数不能通过this访问到class的属性，也并不推荐直接访问属性。而是应该通过参数提供的nextProps以及prevState来进行判断，根据新传入的props来映射到state

getDerivedStateFromProps exists for only one purpose. It enables a component to update its internal state as the result of changes in props.

根据React官网的描述，它的目的仅仅在于让props能更新到内部的state，所以场景包含两个：

1. 无条件地根据props更新state，只要有传入props，就更新state；
2. 只有props和state不一样才更新state；

##### 3.4.7.1 无条件地根据props更新state，只要有传入props，就更新state

```jsx
class Table extends React.Component {
    state = {
        list: []
    }
    static getDerivedStateFromProps (props, state) {
        return {
            list: props.list
        }
    }
    render () {
        .... // 展示 list
    }
}
```

可以发现如果无条件从props更新state，完全没有必要使用这个声明周期，直接使用props就行

##### 3.4.7.2 只有props和state不一样才更新state

```jsx
Class ColorPicker extends React.Component {
    state = {
        color: '#000000'
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.color) {
            return {
                color: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
}
```

但如果有`setState `color的操作，会发现改变不了颜色，因为在 React 16.4^ 的版本中 `setState `和 `forceUpdate` 也会触发这个生命周期，所以内部 state 变化后，又会走 `getDerivedStateFromProps `方法，并把 state 值更新为传入的 prop；

```jsx
Class ColorPicker extends React.Component {
    state = {
        color: '#000000',
        prevPropColor: ''
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.prevPropColor) {
            return {
                color: props.color
                prevPropColor: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
}
```

可以通过保存一个之前 prop 值，我们就可以在只有 prop 变化时才去修改 state；

#### 3.4.8 getSnapshotBeforeUpdate

```jsx
getSnapshotBeforeUpdate(prevProps, prevState)
```

getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用；

此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。

```jsx
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否在 list 中添加新的 items ？
    // 捕获滚动​​位置以便我们稍后调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
    // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
    //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

#### 3.4.9. static getDerivedStateFromError

（不常用）

配合Error boundaries使用

此生命周期会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state；

#### 3.4.10. componentDidCatch

（不常用）

componentDidCatch() 会在“提交”阶段被调用，因此允许执行副作用。 它应该用于记录错误之类的情况；

```jsx
componentDidCatch(error, info)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // "组件堆栈" 例子:
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级 UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

#### 3.4.11. UNSAFE_componentWillMount

 （不建议使用）

UNSAFE_componentWillMount() 在挂载之前被调用；

它在 render() 之前调用，因此在此方法中同步调用 setState() 不会生效；

需要的话用componentDidMount替代。

#### 3.4.12. UNSAFE_componentWillReceiveProps

（不建议使用）
UNSAFE_componentWillReceiveProps() 会在已挂载的组件接收新的 props 之前被调用；

如果你需要更新状态以响应 prop 更改（例如，重置它），你可以比较 this.props 和 nextProps 并在此方法中使用 this.setState() 执行 state 转换。

#### 3.4.13. UNSAFE_componentWillUpdate

（不建议使用）

- 当组件收到新的 props 或 state 时，会在渲染之前调用 UNSAFE_componentWillUpdate()；
- 使用此作为在更新发生之前执行准备更新的机会；
- 初始渲染不会调用此方法；

如果 shouldComponentUpdate() 返回 false，则不会调用 UNSAFE_componentWillUpdate()；

### 3.5. 事件处理

#### 3.5.1. 语法格式

1. 在JSX元素上添加事件,通过on*EventType这种内联方式添加,命名采用小驼峰式(camelCase)的形式,而不是纯小写(原生HTML中对DOM元素绑定事件,事件类型是小写的)；
2. 无需调用addEventListener进行事件监听，也无需考虑兼容性，React已经封装好了一些的事件类型属性；
3. 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串；
4. 不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault；

```jsx
// DOM
<button onclick="activateLasers()">
  Activate Lasers
</button>

// React
<button onClick={activateLasers}>
  Activate Lasers
</button>

// JS
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>

// React
一般不需要使用 addEventListener 为已创建的 DOM 元素添加监听器；
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      // class 的方法默认不会绑定 this。如果没有绑定 this.handleClick 并把它传入了 onClick，
      // this 的值为 undefined。
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);

// 为什么要绑定this
function createElement(dom, params) {
  var domObj = document.createElement(dom);
  domObj.onclick = params.onclick;
  domObj.innerHTML = params.conent;
  return domObj
}
// createElement 的onClick函数是绑定到domObj上的，如果this不显式绑定，不会绑定到Toggle上

// 不显式使用bind
1.  public class fields 语法
class LoggingButton extends React.Component {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}

2. 箭头函数，问题： 每次render都会创建不同的回调函数，如果该回调函数作为props传入子组件，每次子组件都要re-render
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return (
      <button onClick={() => this.handleClick()}>
			//  <button onClick={this.handleClick().bind(this)}>
        Click me
      </button>
    );
  }
}

3. createReactClass代替
```

#### 3.5.2. 接收参数

1. 事件对象 e 会被作为第二个参数传递；
2. 通过箭头函数的方式，事件对象必须显式的进行传递；
3. 通过 Function.prototype.bind 的方式，事件对象以及更多的参数将会被隐式的进行传递；

```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

### 3.6 条件渲染

#### 3.6.1 if esle渲染

```jsx
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

#### 3.6.2 与运算符 &&

```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);

// 返回false的表达式，会跳过元素，但会返回该表达式
render() {
  const count = 0;
  return (
    <div>
      { count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```

#### 3.6.3 三元运算符

```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

#### 3.6.4 如何阻止组件渲染

```jsx
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

### 3.7 列表

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
// 若没有key，会warning a key should be provided for list items
// key可以帮助react diff，最好不用index作为key，会导致性能变差；
// 如果不指定显式的 key 值，默认使用索引用作为列表项目的 key 值；
```

#### 3.7.1 key注意点

```jsx
key要保留在map的遍历元素上

// demo1
function ListItem(props) {
  // 正确！这里不需要指定 key：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 正确！key 应该在数组的上下文中被指定
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);

// demo2
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);

// demo3
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

### 3.8. create-react-app

官方地址：https://create-react-app.dev/

github：https://github.com/facebook/create-react-app

create-react-app是一个官方支持的创建React单页应用程序的脚手架。它提供了一个零配置的现代化配置设置。

![img](https://cdn.nlark.com/yuque/0/2022/webp/2340337/1653717365380-a9a3f644-3583-4bda-8d2b-e8589c70c4d5.webp)

### 3.9. immutable 及immer

#### 3.9.1. immutable

官方地址：https://immutable-js.com/

解决的问题：

JavaScript 中的对象一般是可变的（Mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如 `foo={a: 1}; bar=foo; bar.a=2` 你会发现此时 foo.a 也被改成了 2。虽然这样做可以节约内存，但当应用复杂后，这就造成了非常大的隐患，Mutable 带来的优点变得得不偿失。为了解决这个问题，一般的做法是使用 shallowCopy（浅拷贝）或 deepCopy（深拷贝）来避免被修改，但这样做造成了 CPU 和内存的浪费。

##### 3.9.1.1 什么事immutable data

- Immutable Data 就是一旦创建，就不能再被更改的数据；
- 对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象；
- Immutable 实现的原理是 Persistent Data Structure（持久化数据结构）：也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享

![img](https://camo.githubusercontent.com/0b8366dbd9e9298f8f2521d59b6602f65e857aa5256cd7114ea0de3cf169c4ca/687474703a2f2f696d672e616c6963646e2e636f6d2f7470732f69322f5442317a7a695f4b5858585858637458465858627262384f5658582d3631332d3537352e676966)

#### 3.9.1.2. immutable.js

Facebook 工程师 Lee Byron 花费 3 年时间打造，与 React 同期出现，但没有被默认放到 React 工具集里（React 提供了简化的 Helper）。它内部实现了一套完整的 Persistent Data Structure，还有很多易用的数据类型。像 Collection、List、Map、Set、Record、Seq。有非常全面的map、filter、groupBy、reduce``find函数式操作方法。同时 API 也尽量与 Object 或 Array 类似。

```jsx
// 原来的写法
let foo = {a: {b: 1}};
let bar = foo;
bar.a.b = 2;
console.log(foo.a.b);  // 打印 2
console.log(foo === bar);  //  打印 true

// 使用 immutable.js 后
import Immutable from 'immutable';
foo = Immutable.fromJS({a: {b: 1}});
bar = foo.setIn(['a', 'b'], 2);   // 使用 setIn 赋值
console.log(foo.getIn(['a', 'b']));  // 使用 getIn 取值，打印 1
console.log(foo === bar);  //  打印 false
```

##### 3.9.1.3. immmutable.js 优点

1. 降低了mutable带来的复杂性

   ```jsx
   function touchAndLog(touchFn) {
     let data = { key: 'value' };
     touchFn(data);
     console.log(data.key);
     // 因为不知道touchFn进行了什么操作，所以无法预料，但使用immutable，肯定是value
   }
   ```

2. 节省开支

会尽量复用内存，甚至以前使用的对象也可以再次被复用。没有被引用的对象会被垃圾回收。

```jsx
import { Map} from 'immutable';
let a = Map({
  select: 'users',
  filter: Map({ name: 'Cam' })
})
let b = a.set('select', 'people');

a === b; // false
a.get('filter') === b.get('filter'); // true
```

1. Undo/Redo，Copy/Paste

因为每次数据都是不一样的，所有可以存储在数组里，想回退到哪里就拿出对应数据即可

##### 3.9.1.4. immutable.js缺点

1. 需要学习新的API
2. 容易与原生对象混淆

虽然 Immutable.js 尽量尝试把 API 设计的原生对象类似，有的时候还是很难区别到底是 Immutable 对象还是原生对象，容易混淆操作。

1. Immutable 中的 Map 和 List 虽对应原生 Object 和 Array，但操作非常不同，比如你要用 map.get('key') 而不是 map.key，array.get(0) 而不是 array[0]。另外 Immutable 每次修改都会返回新对象，也很容易忘记赋值；
2. 当使用外部库的时候，一般需要使用原生对象，也很容易忘记转换。

下面给出一些办法来避免类似问题发生：

1. 使用TypeScript 这类有静态类型检查的工具；
2. 约定变量命名规则：如所有 Immutable 类型对象以 $$ 开头；
3. 使用 Immutable.fromJS 而不是 Immutable.Map 或 Immutable.List 来创建对象，这样可以避免 Immutable 和原生对象间的混用；

##### 3.9.1.5 immutable.is & cursor

- immutable.is

  ```jsx
  // 两个 immutable 对象可以使用 === 来比较，这样是直接比较内存地址，性能最好。
  // 但即使两个对象的值是一样的，也会返回 false：
  
  let map1 = Immutable.Map({a:1, b:1, c:1});
  let map2 = Immutable.Map({a:1, b:1, c:1});
  map1 === map2;             // false
  
  // 为了直接比较对象的值，immutable.js 提供了 Immutable.is 来做『值比较』，结果如下：
  
  Immutable.is(map1, map2);  // true
  Immutable.is 
  // 比较的是两个对象的 hashCode 或 valueOf（对于 JavaScript 对象）。
  // 由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 hashCode 相等，值就是一样的。
  // 这样的算法避免了深度遍历比较，性能非常好。
  ```

- cursor

由于 Immutable 数据一般嵌套非常深，为了便于访问深层数据，Cursor 提供了可以直接访问这个深层数据的引用。

 ```jsx
 import Immutable from 'immutable';
 import Cursor from 'immutable/contrib/cursor';
 
 let data = Immutable.fromJS({ a: { b: { c: 1 } } });
 // 让 cursor 指向 { c: 1 }
 let cursor = Cursor.from(data, ['a', 'b'], newData => {
   // 当 cursor 或其子 cursor 执行 update 时调用
   console.log(newData);
 });
 
 cursor.get('c'); // 1
 cursor = cursor.update('c', x => x + 1);
 cursor.get('c'); // 2
 ```

##### 3.9.1.6. 使用immutable.js优化react

1. React可以使用 shouldComponentUpdate()进行性能优化，但它默认返回 true，即始终会执行 render() 方法，然后做 Virtual DOM 比较，并得出是否需要做真实 DOM 更新；
2. 可以在shouldComponentUpdate 周期里执行deepCopy 和 deepCompare 避免无意义的render，但deepFn也很耗时；

```jsx
import { is } from 'immutable';

shouldComponentUpdate: (nextProps = {}, nextState = {}) => {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }

  for (const key in nextProps) {
    if (!is(thisProps[key], nextProps[key])) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key] && !is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
}
```

#### 3.9.2 immer

官方地址：https://immerjs.github.io/immer/zh-CN/

先来看一个问题

```jsx
let currentState = {
  p: {
    x: [2],
  },
}

// 下列哪些currentState被修改了
// Q1
let o1 = currentState;
o1.p = 1;
o1.p.x = 1;

// Q2
fn(currentState);
function fn(o) {
  o.p1 = 1;
  return o;
};

// Q3
let o3 = {
  ...currentState
};
o3.p.x = 1;

// Q4
let o4 = currentState;
o4.p.x.push(1);

// 结果：都被修改了
```

如何解决引用类型对象被修改？

1. 深度拷贝，但是深拷贝的成本较高，会影响性能；
2. [ImmutableJS](https://github.com/facebook/immutable-js)，非常棒的一个不可变数据结构的库，可以解决上面的问题，但跟 Immer 比起来，ImmutableJS 有两个较大的不足：
   a. 需要使用者学习它的数据结构操作方式，没有 Immer 提供的使用原生对象的操作方式简单、易用；
   b. 它的操作结果需要通过toJS方法才能得到原生对象，这使得在操作一个对象的时候，时刻要主要操作的是原生对象还是 ImmutableJS 的返回结果，稍不注意，就会产生问题；

```jsx
// 如何使用immer解决上述问题

// Q1 Q3
import produce from 'immer';
let o1 = produce(currentState, draft => {
  draft.p.x = 1;
})

// Q2
import produce from 'immer';
fn(currentState);
function fn(o) {
  return produce(o, draft => {
    draft.p1 = 1;
  })
};

// Q4
import produce from 'immer';
let o4 = produce(currentState, draft => {
  draft.p.x.push(1);
})
```

##### 3.9.2.2 概念说明

- currentState：被操作对象的最初状态
- draftState：根据 currentState 生成的草稿状态，它是 currentState 的代理，对 draftState 所做的任何修改都将被记录并用于生成 nextState 。在此过程中，currentState 将不受影响
- nextState：根据 draftState 生成的最终状态
- produce：用来生成 nextState 或 producer 的函数
- producer：通过 produce 生成，用来生产 nextState ，每次执行相同的操作
- recipe：用来操作 draftState 的函数

##### 3.9.2.3 produce的使用

1. produce(currentState, recipe: (draftState) => void | draftState, ?PatchListener): nextState

```jsx
// Q1
let nextState = produce(currentState, (draft) => {

})

currentState === nextState; // true

// Q2
let currentState = {
  a: [],
  p: {
    x: 1
  }
}

let nextState = produce(currentState, (draft) => {
  draft.a.push(2);
})

currentState.a === nextState.a; // false
currentState.p === nextState.p; // true
```

1. a. 对 draftState 的修改都会反应到 nextState;

2. b. Immer 使用的结构是共享的，nextState 在结构上又与 currentState 共享未修改的部分；

immer支持自动冻结：通过produce生产的nextState是被Object.freeze的

```jsx
const currentState = {
  p: {
    x: [2],
  },
};
const nextState = produce(currentState, draftState => {
    draftState.p.x.push(3);
});
console.log(nextState.p.x); // [2, 3]
nextState.p.x = 4;
console.log(nextState.p.x); // [2, 3]
nextState.p.x.push(5); // 报错
```

2. produce(recipe: (draftState) => void | draftState, ?PatchListener)(currentState): nextState

利用高阶函数的特点，提前生成一个producer

```jsx
let producer = produce((draft) => {
  draft.x = 2
});
let nextState = producer(currentState);
```

##### 3.9.2.4 使用immer优化react

```jsx
// 定义state
state = {
  members: [
    {
      name: 'ronffy',
      age: 30
    }
  ]
}

// 如何给member中第一个元素的age+1

// error
this.state.members[0].age++;

// setState
const { members } = this.state;
this.setState({
  members: [
    {
      ...members[0],
      age: members[0].age + 1,
    },
    ...members.slice(1),
  ]
})

// 使用reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_AGE':
      const { members } = state;
      return {
        ...state,
        members: [
          {
            ...members[0],
            age: members[0].age + 1,
          },
          ...members.slice(1),
        ]
      }
    default:
      return state
  }
}


// 使用immer
this.setState(produce(draft => {
  draft.members[0].age++;
}))

// 使用immer结合reduce
// 注意： produce 内的 recipe 回调函数的第2个参数与obj对象是指向同一块内存
let obj = {};

let producer = produce((draft, arg) => {
  obj === arg; // true
});
let nextState = producer(currentState, obj);

const reducer = (state, action) => produce(state, draft => {
  switch (action.type) {
    case 'ADD_AGE':
      draft.members[0].age++;
  }
})
```

# React高级用法

https://www.yuque.com/lpldplws/web/bcocaq?singleDoc# 《React高级用法》 密码：acr1

## 1. 课程目标

P6：

1. 1. 会用React写项目，较熟练使用React配套技术栈，有一定实际开发经验；
   2. 能够针对复杂的业务场景制定出较为规范的逻辑架构；

P6+~P7：

1. 1. 基于实际开发场景，搭建配套脚手架，能够基于当前实际开发场景优化架构设计，制定团队规范；
   2. 对前沿技术有足够的敏感度，保证项目的可扩展性与健壮性；
   3. 精通一个框架的底层设计，熟悉多个框架的实际设计及对比；

其他目标：

1. 1. 深入了解React技术栈相关的知识点，知道React生态中发展现状，能够对面试所提的问题举一反三；

## 2.课程大纲

1. 高阶组件的用法及封装
2. Hooks详解
3. 异步组件
4. React 18 新特性

## 3.主要内容

### 3.1. 高阶组件用法及封装

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

简单点说，就是组件作为参数，返回值也是组件的函数，它是纯函数，不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件包装在容器组件中来组成新组件。HOC 是纯函数，没有副作用。

#### 3.1.1 使用HOC的原因

1. 抽取重复代码，实现组件复用：相同功能组件复用
2. 条件渲染，控制组件的渲染逻辑（渲染劫持）：权限控制。
3. 捕获/劫持被处理组件的生命周期，常见场景：组件渲染性能追踪、日志打点。

#### 3.1.2 HOC实现方式

##### 3.1.2.1 属性代理

使用组合的方式，将组件包装在容器上，依赖父子组件的生命周期关系来；

1. 返回stateless的函数组件
2. 返回class组件

- 操作props

```js
// 可以通过属性代理，拦截父组件传递过来的porps并进行处理。

// 返回一个无状态的函数组件
function HOC(WrappedComponent) {
  const newProps = { type: 'HOC' };
  return props => <WrappedComponent {...props} {...newProps}/>;
}

// 返回一个有状态的 class 组件
function HOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      const newProps = { type: 'HOC' };
      return <WrappedComponent {...this.props} {...newProps}/>;
    }
  };
}
```

- 抽象state

```js
// 通过属性代理无法直接操作原组件的state，可以通过props和cb抽象state
function HOC(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: '',
      };
      this.onChange = this.onChange.bind(this);
    }
    
    onChange = (event) => {
      this.setState({
        name: event.target.value,
      })
    }
    
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onChange,
        },
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}

// 使用
@HOC
class Example extends Component {
  render() {
    return <input name="name" {...this.props.name} />;
  }
}
```

- 通过props实现条件渲染

```js
// 通过props来控制是否渲染及传入数据
import * as React from 'react';

function HOC (WrappedComponent) {
  return (props) => (
  <div>
    {
      props.isShow ? (
        <WrappedComponent
          {...props}
        />
      ) : <div>暂无数据</div>
    }
  </div>
  );
}

export default HOC;
```

- 其他元素wrapper传入的组件

```js
function withBackgroundColor(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <div style={{ backgroundColor: '#ccc' }}>
            <WrappedComponent {...this.props} {...newProps} />
        </div>
      );
    }
  };
}
```

##### 3.1.2.2 反向继承

使用一个函数接受一个组件作为参数传入，并返回一个继承了该传入组件的类组件，且在返回组件的 render() 方法中返回 super.render() 方法

```js
const HOC = (WrappedComponent) => {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  }
}
```

1. 允许HOC通过this访问到原组件，可以直接读取和操作原组件的state/ref等；
2. 可以通过super.render()获取传入组件的render，可以有选择的渲染劫持；
3. 劫持原组件生命周期方法

```js
function HOC(WrappedComponent){
  const didMount = WrappedComponent.prototype.componentDidMount;
  
  // 继承了传入组件
  return class HOC extends WrappedComponent {
    async componentDidMount(){
      // 劫持 WrappedComponent 组件的生命周期
      if (didMount) {
        await didMount.apply(this);
      }
      ...
    }

    render(){
      //使用 super 调用传入组件的 render 方法
      return super.render();
    }
  }
}
```

- 读取/操作原组件的state

```js
function HOC(WrappedComponent){
  const didMount = WrappedComponent.prototype.componentDidMount;
  // 继承了传入组件
  return class HOC extends WrappedComponent {
    async componentDidMount(){
      if (didMount) {
        await didMount.apply(this);
      }
      // 将 state 中的 number 值修改成 2
      this.setState({ number: 2 });
    }

    render(){
      //使用 super 调用传入组件的 render 方法
      return super.render();
    }
  }
}
```

- 条件渲染

```js
const HOC = (WrappedComponent) =>
  class extends WrappedComponent {
    render() {
      if (this.props.isRender) {
        return super.render();
      } else {
        return <div>暂无数据</div>;
      }
    }
  }
```

- 修改react树

```js
// 修改返回render结果
function HigherOrderComponent(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      const tree = super.render();
      const newProps = {};
      if (tree && tree.type === 'input') {
        newProps.value = 'something here';
      }
      const props = {
        ...tree.props,
        ...newProps,
      };
      const newTree = React.cloneElement(tree, props, tree.props.children);
      return newTree;
    }
  };
}
```

#### 3.1.3 属性代理和反向继承对比

1. 属性代理：从“组合”角度出发，有利于从外部操作wrappedComp，可以操作props，或者在wrappedComp 外加一些拦截器（如条件渲染等）；
2. 反向继承：从“继承”角度出发，从内部操作wrappedComp，可以操作组件内部的state，生命周期和render等，功能能加强大；

#### 3.1.4 举个例子

- 页面复用（属性代理）

```jsx
// views/PageA.js
import React from 'react';
import fetchMovieListByType from '../lib/utils';
import MovieList from '../components/MovieList';

class PageA extends React.Component {
  state = {
    movieList: [],
  }
  /* ... */
  async componentDidMount() {
    const movieList = await fetchMovieListByType('comedy');
    this.setState({
      movieList,
    });
  }
  
  render() {
    return <MovieList data={this.state.movieList} emptyTips="暂无喜剧"/>
  }
}
export default PageA;


// views/PageB.js
import React from 'react';
import fetchMovieListByType from '../lib/utils';
import MovieList from '../components/MovieList';

class PageB extends React.Component {
  state = {
    movieList: [],
  }
  // ...
  async componentDidMount() {
    const movieList = await fetchMovieListByType('action');
    this.setState({
      movieList,
    });
  }
  render() {
    return <MovieList data={this.state.movieList} emptyTips="暂无动作片"/>
  }
}
export default PageB;


// 冗余代码过多
// HOC
import React from 'react';

const withFetchingHOC = (WrappedComponent, fetchingMethod, defaultProps) => {
  return class extends React.Component {
    async componentDidMount() {
      const data = await fetchingMethod();
      this.setState({
        data,
      });
    }
    
    render() {
      return (
        <WrappedComponent 
          data={this.state.data} 
          {...defaultProps} 
          {...this.props} 
        />
      );
    }
  }
}

// 使用：
// views/PageA.js
import React from 'react';
import withFetchingHOC from '../hoc/withFetchingHOC';
import fetchMovieListByType from '../lib/utils';
import MovieList from '../components/MovieList';

const defaultProps = {emptyTips: '暂无喜剧'}

export default withFetchingHOC(MovieList, fetchMovieListByType('comedy'), defaultProps);

// views/PageB.js
import React from 'react';
import withFetchingHOC from '../hoc/withFetchingHOC';
import fetchMovieListByType from '../lib/utils';
import MovieList from '../components/MovieList';

const defaultProps = {emptyTips: '暂无动作片'}

export default withFetchingHOC(MovieList, fetchMovieListByType('action'), defaultProps);;

// views/PageOthers.js
import React from 'react';
import withFetchingHOC from '../hoc/withFetchingHOC';
import fetchMovieListByType from '../lib/utils';
import MovieList from '../components/MovieList';
const defaultProps = {...}
export default withFetchingHOC(MovieList, fetchMovieListByType('some-other-type'), defaultProps);
```

更符合 里氏代换原则(Liskov Substitution Principle LSP)，任何基类可以出现的地方，子类一定可以出现。LSP是继承复用的基石，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为

- 权限控制（属性代理）

```jsx
import React from 'react';
import { whiteListAuth } from '../lib/utils'; // 鉴权方法

function AuthWrapper(WrappedComponent) {
  return class AuthWrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        permissionDenied: -1,
      };
    }
    
    async componentDidMount() {
      try {
        await whiteListAuth(); // 请求鉴权接口
        this.setState({
          permissionDenied: 0,
        });
      } catch (err) {
        this.setState({
          permissionDenied: 1,
        });
      }
    }
    
    render() {
      if (this.state.permissionDenied === -1) {
        return null; // 鉴权接口请求未完成
      }
      if (this.state.permissionDenied) {
        return <div>功能即将上线，敬请期待~</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
}

export default AuthWrapper;
```

- 组件渲染性能(反向继承)

如何计算一个组件render期间的渲染耗时？

```jsx
import React from 'react';
// Home 组件
class Home extends React.Component {
  render () {
    return (<h1>Hello World.</h1>);
  }
}

// HOC
function withTiming (WrappedComponent) {
  let start, end;

  return class extends WrappedComponent {
    constructor (props) {
      super(props);
      start = 0;
      end = 0;
    }
    componentWillMount () {
      if (super.componentWillMount) {
        super.componentWillMount();
      }
      start = +Date.now();
    }
    componentDidMount () {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
      end = +Date.now();
      console.error(`${WrappedComponent.name} 组件渲染时间为 ${end - start} ms`);
    }
    render () {
      return super.render();
    }
  };
}

export default withTiming(Home);
```

#### 3.1.5 HOC缺点

- 黑盒问题，增加理解成本
- 属性冲突
- HOC 可以劫持 props，存在相同名称的 props，则存在覆盖问题在不遵守约定的情况下也可能造成冲突，而且 react 并不会报错。

```jsx
function Login (props){
    return <div>{props.user}</div>
}

function HOCAddUserName(WrappedComponent){
    return class extends Component{
        render(){
            return <WrappedComponent user='写死的user名称'/>
        }
    }
}

function HOCAddAnotherUserName(WrappedComponent){
       return class extends Component{
        render(){
            return <WrappedComponent user='写死另一个的user名称'/>
        }
    }
}

const TwoHoc=HOCAddAnotherUserName(HOCAddUserName(Login)) //生效的是HOCAddUserName
```

#### Function 里面用error boundary

```jsx
function Catch (Wrapcomponent,errorHandler){
    return class extends Component {
         state={
             error:undefined
         }
    }
    static getDerivedStateFromError(error){
        return {error}
    }
    
    componentDidCatch(error){
        errorHandler&&errorHandler(error)
    }
    render(){
        return WrapComponent(this.props,this.state.error)
    }
}
```

### 3.2 hooks详解

Hooks是react16.8以后新增的钩子API；

目的：增加代码的可复用性，逻辑性，弥补无状态组件没有生命周期，没有数据管理状态state的缺陷。

为什么要使用Hooks？

1. 开发友好，可扩展性强，抽离公共的方法或组件，Hook 使你在无需修改组件结构的情况下复用状态逻辑；
2. 函数式编程，将组件中相互关联的部分根据业务逻辑拆分成更小的函数；
3. class更多作为语法糖，没有稳定的提案，且在开发过程中会出现不必要的优化点，Hooks无需学习复杂的函数式或响应式编程技术；

官网react hooks介绍：https://zh-hans.reactjs.org/docs/hooks-intro.html

#### 3.2.1 常见Hooks

##### 3.2.1.1 useState

```js
const [number, setNumber] = useState(0);
```

1. setState支持stateless组件有自己的state；
2. 入参：具体值或一个函数；
3. 返回值：数组，第一项是state值，第二项负责派发数据更新，组件渲染；

注意：setState会让组件重新执行，所以一般需要配合useMemo或useCallback；

```js
const DemoState = (props) => {
   /* number为此时state读取值 ，setNumber为派发更新的函数 */
   const [number, setNumber] = useState(0) /* 0为初始值 */
   return (
     <div>
       <span>{ number }</span>
       <button onClick={ ()=> {
         setNumber(number + 1)
         console.log(number) /* 这里的number是不能够即使改变的，返回0  */
         }}
        />
     </div>
    )
}
// 当更新函数之后，state的值是不能即时改变的，只有当下一次上下文执行的时候，state值才随之改变

——————————————————————————————————————————

const a =1 
const DemoState = (props) => {
   /*  useState 第一个参数如果是函数 则处理复杂的逻辑，返回值为初始值 */
   let [number, setNumber] = useState(()=>{
      // number
      return a === 1 ? 1 : 2
   }) /* 1为初始值 */
   return (<div>
       <span>{ number }</span>
       <button onClick={ ()=>setNumber(number+1) } ></button>
   </div>)
}
```

##### 3.1.1.2 useEffect

1. 使用条件：当组件init、dom render完成、操纵dom、请求数据（如componentDidMount）等；
2. 不限制条件，组件每次更新都会触发useEffect --> componentDidUpdate 与 componentwillreceiveprops；
3. useEffect 第一个参数为处理事件，第二个参数接收数组，为限定条件，当数组变化时触发事件，为[]只在组件初始化时触发；
4. useEffect第一个参数有返回时，一般用来消除副作用（如去除定时器、事件绑定等）；

```js
* 模拟数据交互 */
function getUserInfo(a)
  return new Promise((resolve)=>{
    setTimeout(()=>{ 
       resolve({
           name:a,
           age:16,
       }) 
    },500)
  })
}

const Demo = ({ a }) => {
  const [ userMessage , setUserMessage ] = useState({})
  const [number, setNumber] = useState(0)
  
  const div= useRef()
  
  const handleResize =()=>{}

  useEffect(()=>{
     getUserInfo(a).then(res=>{
         setUserMessage(res)
     })
     console.log(div.current) /* div */
      window.addEventListener('resize', handleResize)
  /* 
     只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，
     如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount
  */
  },[ a ,number ])

  return (<div ref={div} >
      <span>{ userMessage.name }</span>
      <span>{ userMessage.age }</span>
      <div onClick={ ()=> setNumber(1) } >{ number }</div>
  </div>)
}


————————————————————————————————————————————————
const Demo = ({ a }) => {
    const handleResize =()=>{}
    useEffect(()=>{
       const timer = setInterval(()=>console.log(666),1000)
       window.addEventListener('resize', handleResize)
      
       /* 此函数用于清除副作用 */
       return function(){
           clearInterval(timer) 
           window.removeEventListener('resize', handleResize)
       }
    },[ a ])
    return (<div></div>)
}
```

注意：useEffect无法直接使用async await，

```js
// Bad
useEffect(async ()=>{
  /* 请求数据 */
  const res = await getUserInfo(payload)
},[ a ,number ])
————————————————————————————————————————————————

useEffect(() => {
  // declare the async data fetching function
  const fetchData = async () => {
    const data = await fetch('https://xxx.com');
    const json = await data.json();
    return json;
  }

  // call the function
  const result = fetchData()
    .catch(console.error);

  // ❌ 无效
  setData(result);
}, [])

// 改进版
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch('https://xxx.com');
    const json = await response.json();

    setData(json);
  }

  // call the function
  fetchData()
    // make sure to catch any error
    .catch(console.error);;
}, [])
```

##### 3.2.1.3. useLayoutEffect

 

渲染更新之前的 useEffect

useEffect： 组件更新挂载完成 -> 浏览器dom 绘制完成 -> 执行useEffect回调 ；

useLayoutEffect ： 组件更新挂载完成 -> 执行useLayoutEffect回调-> 浏览器dom 绘制完成；

渲染组件

1. useEffect：闪动；

2. useLayoutEffect：卡顿；

```js
const DemoUseLayoutEffect = () => {
  const target = useRef()
  useLayoutEffect(() => {
      /*我们需要在dom绘制之前，移动dom到制定位置*/
      const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
      animate(target.current,{ x,y })
  }, []);
  return (
    <div >
      <span ref={ target } className="animate"></span>
    </div>
  )
}
```

##### 3.2.1.4 useRef

用来获取元素、缓存数据；

入参可以作为初始值

```js
// 获取元素
const DemoUseRef = ()=>{
  const dom= useRef(null)
  const handerSubmit = ()=>{
    /*  <div >表单组件</div>  dom 节点 */
    console.log(dom.current)
  }
  return <div>
    <div ref={dom} >表单组件</div>
    <button onClick={()=>handerSubmit()} >提交</button> 
  </div>
}

// 缓存数据，小技巧
// 不同于useState，useRef改变值不会使comp re-render
const currenRef = useRef(InitialData)
currenRef.current = newValue
```

##### 3.2.1.5 useConext

用来获取父级组件传递过来的context值，这个当前值就是最近的父级组件 Provider 的value；

从parent comp获取ctx方式；

1. useContext(Context)；
2. Context.Consumer；

```js
/* 用useContext方式 */
const DemoContext = ()=> {
  const value = useContext(Context);
  /* my name is aaa */
  return <div> my name is { value.name }</div>
}

/* 用Context.Consumer 方式 */
const DemoContext1 = ()=>{
  return <Context.Consumer>
    {/*  my name is aaa  */}
    { (value)=> <div> my name is { value.name }</div> }
  </Context.Consumer>
}

export default ()=>{
  return <div>
    <Context.Provider value={{ name:'aaa' }} >
      <DemoContext />
      <DemoContext1 />
    </Context.Provider>
  </div>
}
```

##### 3.2.1.6. useReducer

入参：

1. 第一个为函数，可以视为reducer，包括state 和 action，返回值为根据action的不同而改变后的state；
2. 第二个为state的初始值；

出参：

1. 第一个更新后的state值；
2. 第二个是派发更新的dispatch函数；执行dispatch会导致组件re-render；（另一个是useState）

```js
const DemoUseReducer = ()=>{
  /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
  const [ number , dispatchNumbner ] = useReducer((state, action) => {
    const { payload , name  } = action
    /* return的值为新的state */
    switch(name) {
     case 'a':
         return state + 1
     case 'b':
         return state - 1 
     case 'c':
       return payload       
    }
    return state
   }, 0)
   return <div>
      当前值：{ number }
      { /* 派发更新 */ }
      <button onClick={()=>dispatchNumbner({ name: 'a' })} >增加</button>
      <button onClick={()=>dispatchNumbner({ name: 'b' })} >减少</button>
      <button onClick={()=>dispatchNumbner({ name: 'c' , payload:666 })} >赋值</button>
      { /* 把dispatch 和 state 传递给子组件  */ }
      <MyChildren  dispatch={ dispatchNumbner } State={{ number }} />
   </div>
}
```

业务中经常将 useReducer+useContext 代替Redux

##### 3.2.1.7 useMemo

用来根据useMemo的第二个参数deps（数组）判定是否满足当前的限定条件来决定是否执行第一个cb；

```js
// selectList 不更新时，不会重新渲染，减少不必要的循环渲染
useMemo(() => (
  <div>{
    selectList.map((i, v) => (
      <span
        className={style.listSpan}
        key={v} >
        {i.patentName} 
      </span>
    ))}
  </div>
), [selectList])

————————————————————————————————————————————————————
// listshow, cacheSelectList 不更新时，不会重新渲染子组件
useMemo(() => (
  <Modal
    width={'70%'}
    visible={listshow}
    footer={[
      <Button key="back" >取消</Button>,
      <Button
          key="submit"
          type="primary"
       >
          确定
      </Button>
    ]}
  > 
    { /* 减少了PatentTable组件的渲染 */ }
    <PatentTable
      getList={getList}
      selectList={selectList}
      cacheSelectList={cacheSelectList}
      setCacheSelectList={setCacheSelectList}
    />
  </Modal>
 ), [listshow, cacheSelectList])
 ————————————————————————————————————————————————————
 
 // 减少组件更新导致函数重新声明
 const DemoUseMemo = () => {
  /* 用useMemo 包裹之后的log函数可以避免了每次组件更新再重新声明 ，可以限制上下文的执行 */
  const newLog = useMemo(() => {
    const log = () => {
      console.log(123)
    }
    return log
  }, [])
  return <div onClick={()=> newLog() } ></div>
}

————————————————————————————————————————————————————
// 如果没有加相关的更新条件，是获取不到更新之后的state的值的
const DemoUseMemo = () => {
  const [ number ,setNumber ] = useState(0)
  const newLog = useMemo(() => {
    const log = () => {
      /* 点击span之后 打印出来的number 不是实时更新的number值 */
      console.log(number)
    }
    return log
    /* [] 没有 number */  
  }, [])
  return <div>
    <div onClick={() => newLog()} >打印</div>
    <span onClick={ () => setNumber( number + 1 )  } >增加</span>
  </div>
}
```

##### 3.2.1.8 useCallback

useMemo返回cb的运行结果；

useCallback返回cb的函数；

```js
import React, { useState, useCallback } from 'react'

function Button(props) {
  const { handleClick, children } = props;
  console.log('Button -> render');
  return (
      <button onClick={handleClick}>{children}</button>
  )
}

const MemoizedButton = React.memo(Button);

export default function Index() {
  const [clickCount, increaseCount] = useState(0);

  const handleClick = () => {
      console.log('handleClick');
      increaseCount(clickCount + 1);
  }
  return (
      <div>
          <p>{clickCount}</p>
          <MemoizedButton handleClick={handleClick}>Click</MemoizedButton>
      </div>
  )
}

// MemoizedButton还是重新渲染了
// Index组件state发生变化，导致组件重新渲染；
// 每次渲染导致重新创建内部函数handleClick ，
// 进而导致子组件Button也重新渲染。

import React, { useState, useCallback } from 'react'

function Button(props) {
  const { handleClick, children } = props;
  console.log('Button -> render');
  return (
      <button onClick={handleClick}>{children}</button>
  )
}

const MemoizedButton = React.memo(Button);

export default function Index() {
  const [clickCount, increaseCount] = useState(0);
  // 这里使用了`useCallback`
  const handleClick = useCallback(() => {
      console.log('handleClick');
      increaseCount(clickCount + 1);
  }, [])

  return (
      <div>
          <p>{clickCount}</p>
          <MemoizedButton handleClick={handleClick}>Click</MemoizedButton>
      </div>
  )
}
```

#### 3.2.2 Hooks实战

##### 3.2.2.1 所有依赖都必须放在依赖数组中么？

useEffect 中，默认有个共识： useEffect 中使用到外部变量，都应该放到第二个数组参数中。

```js
// 当props.count 和 count 变化时，上报数据
function Demo(props) {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [a, setA] = useState('');
  
  useEffect(() => {
    monitor(props.count, count, text, a);
  }, [props.count, count]);
  
  return (
    <div>
      <button
        onClick={() => setCount(count => count + 1)}
      >
        click
      </button>
      <input value={text} onChange={e => setText(e.target.value)} />
      <input value={a} onChange={e => setA(e.target.value)} />
    </div>
  )
}
```

此时，text 和 a 变量没有放在dps 数组中

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976346957-7870c08c-7450-4e5f-80f7-dd9a46a02ed2.png)

如果把text 和 a 也引入deps中，当text 和 a改变时，也触发了函数执行

Solution：

1. 不要使用 eslint-plugin-react-hooks 插件，或者可以选择性忽略该插件的警告；
2. 只有一种情况，需要把变量放到 deps 数组中，那就是当该变量变化时，需要触发 useEffect 函数执行。而不是因为 useEffect 中用到了这个变量！

##### 3.2.2.2 尽量不要用useCallback

1. useCallback 大部分场景没有提升性能
2.  useCallback让代码可读性变差

```js
Example 1
const someFunc = useCallback(()=> {
   doSomething();
}, []);
return <ExpensiveComponent func={someFunc} />

const ExpensiveComponent = ({ func }) => {
  return (
    <div onClick={func}>
     hello
    </div>
  )
}

// 必须用React.memo wrapper 住子组件，才能避免在参数不变的情况下，不重复渲染
// 所以一般项目中不建议使用useCallback
const ExpensiveComponent = React.memo(({ func }) => {
  return (
    <div onClick={func}>
     hello
    </div>
  )
}

// Example 2
const someFuncA = useCallback((d, g, x, y)=> {
   doSomething(a, b, c, d, g, x, y);
}, [a, b, c]);

const someFuncB = useCallback(()=> {
   someFuncA(d, g, x, y);
}, [someFuncA, d, g, x, y]);

useEffect(()=>{
  someFuncB();
}, [someFuncB]);

// 依赖层层传递，最终要找到哪些出发了useEffect执行，所以直接引用就好
const someFuncA = (d, g, x, y)=> {
   doSomething(a, b, c, d, g, x, y);
};

const someFuncB = ()=> {
   someFuncA(d, g, x, y);
};

useEffect(()=>{
  someFuncB();
}, [...]);
```

##### 3.2.2.3. useMemo建议适当使用

在deps不变，且非简单的基础类型运算的情况下建议使用

```js
// 没有使用 useMemo
const memoizedValue = computeExpensiveValue(a, b);
// 使用 useMemo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 如果没有使用 useMemo，computeExpensiveValue 会在每一次渲染的时候执行;
// 如果使用了 useMemo，只有在 a 和 b 变化时，才会执行一次 computeExpensiveValue。

const a = 1;
const b = 2;
const c = useMemo(()=> a + b, [a, b]);
const c = a + b; // 内存消耗少
```

##### 3.2.2.4 updateState的正确使用姿势

1. 能用其他状态计算出来就不用单独声明状态。一个 state 必须不能通过其它 state/props 直接计算出来，否则就不用定义 state

2. 保证数据源唯一，在项目中同一个数据，保证只存储在一个地方

3. useState 适当合并

```js
// Example 1
const SomeComponent = (props) => {
  const [source, setSource] = useState([
      {type: 'done', value: 1},
      {type: 'doing', value: 2},
  ])
  const [doneSource, setDoneSource] = useState([])
  const [doingSource, setDoingSource] = useState([])
  useEffect(() => {
    setDoingSource(source.filter(item => item.type === 'doing'))
    setDoneSource(source.filter(item => item.type === 'done'))
  }, [source])
  return (
    <div>
       .....
    </div>
  )
}

const SomeComponent = (props) => {
  const [source, setSource] = useState([
      {type: 'done', value: 1},
      {type: 'doing', value: 2},
    ])
  const doneSource = useMemo(()=> source.filter(item => item.type === 'done'), [source]);
  const doingSource = useMemo(()=> source.filter(item => item.type === 'doing'), [source]);
  return (
    <div>
       .....
    </div>
  )
}

// 避免props层层传递，在CR中很难看清楚

// Example 2
function SearchBox({ data }) {
  const [searchKey, setSearchKey] = useState(getQuery('key'));
  
  const handleSearchChange = e => {
    const key = e.target.value;
    setSearchKey(key);
    history.push(`/movie-list?key=${key}`);
  }
  
  return (
    <input
      value={searchKey}
      placeholder="Search..."
      onChange={handleSearchChange}
    />
  );
}

function SearchBox({ data }) {
  const searchKey = parse(localtion.search)?.key;
  
  const handleSearchChange = e => {
    const key = e.target.value;
    history.push(`/movie-list?key=${key}`);
  }
  
  return (
    <input
      value={searchKey}
      placeholder="Search..."
      onChange={handleSearchChange}
    />
  );
}

// url params 和 state重复了

// Example 3
const [firstName, setFirstName] = useState();
const [lastName, setLastName] = useState();
const [school, setSchool] = useState();
const [age, setAge] = useState();
const [address, setAddress] = useState();
const [weather, setWeather] = useState();
const [room, setRoom] = useState();

const [userInfo, setUserInfo] = useState({
  firstName,
  lastName,
  school,
  age,
  address
});
const [weather, setWeather] = useState();
const [room, setRoom] = useState();

// 更新一个时
setUserInfo(s=> ({
  ...s,
  fristName,
}))
```

#### 3.2.3. 自定义Hooks

注意：自定义Hooks本质上还是实现一个函数，关键在于实现逻辑
一般实现效果如：

```js
const [ a[, b, c...] ] = useXXX(arg1[, arg2, ...])
```

##### 3.2.3.1 setTitle hook

```js
import { useEffect } from 'react'

const useTitle = (title) => {
  useEffect(() => {
    document.title = title
  }, [])

  return
}

export default useTitle

const App = () => {
  useTitle('new title')
  return <div>home</div>
}
```

##### 3.2.3.2 update hook

```js
import { useState } from 'react'

const useUpdate = () => {
  const [, setFlag] = useState()
  const update = () => {
    setFlag(Date.now())
  }
  return update
}

export default useUpdate

// 实际使用
const App = (props) => {
  // ...
  const update = useUpdate()
  return <div>
    {Date.now()}
    <div><button onClick={update}>update</button></div>
  </div>
}
```

##### 3.2.3.3 useScroll hooks

```js
import { useState, useEffect } from 'react'

const useScroll = (scrollRef) => {
  const [pos, setPos] = useState([0,0])

  useEffect(() => {
    function handleScroll(e){
      setPos([scrollRef.current.scrollLeft, scrollRef.current.scrollTop])
    }
    scrollRef.current.addEventListener('scroll', handleScroll)
    return () => {
      scrollRef.current.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return pos
}

export default useScroll

// 用法
import React, { useRef } from 'react'
import { useScroll } from 'hooks'

const Home = (props) => {
  const scrollRef = useRef(null)
  const [x, y] = useScroll(scrollRef)

  return <div>
      <div ref={scrollRef}>
        <div className="innerBox"></div>
      </div>
      <div>{ x }, { y }</div>
    </div>
}
```

#### 3.2.4 Hooks vs HOC

1. Hook最典型的就是取代掉生命周期中大多数的功能，可以把更相关的逻辑放在一起，而非零散在各个生命周期方法中；
2.  高阶组件可以将外部的属性功能到一个基础 Component 中，更多作为扩展能力的插件（如 react-swipeable-views中的 autoPlay 高阶组件，通过注入状态化的 props 的方式对组件进行功能扩展，而不是直接将代码写在主库中）；
3. Hook 的写法可以让代码更加紧凑，更适合做 Controller 或者需要内聚的相关逻辑，一般与目标组件内强依赖，HOC更强调对原先组件能力的扩展；
4. 目前 Hook 还处于相对早期阶段（React 16.8.0 才正式发布Hook 稳定版本），一些第三方的库可能还暂时无法兼容 Hook；

### 3.3 异步组件

随着项目的增长，代码包也会随之增长，尤其是在引入第三方的库的情况下，要避免因体积过大导致加载时间过长。

React16.6中，引入了 React.lazy 和 React.Suspense 两个API，再配合动态 import() 语法就可以实现组件代码打包分割和异步加载。

传统模式：渲染组件-> 请求数据 -> 再渲染组件

异步模式：请求数据-> 渲染组件；

```js
// demo
import React, { lazy, Suspense } from 'react';
// lazy 和 Suspense 配套使用，react原生支持代码分割
const About = lazy(() => import(/* webpackChunkName: "about" */'./About'));
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <Suspense fallback={<div>loading</div>}>
          <About />
        </Suspense>
      </div>
    );
  }
}
export default App;
```

#### 3.3.1 前置基础

1. 动态import

相对于静态import的 `import XX from XXX`，动态import指在运行时加载

```js
import('./test.js').then(test => {
    // ...
});
// 可见，是实现了Promsie规范的，回调函数为返回的模块
```

1. 错误边界

React V 16中引入，部分UI的JS错误不会导致整个应用崩溃；

错误边界是一种 React 组件，错误边界在 渲染期间、生命周期方法和整个组件树的构造函数 中捕获错误，且会渲染出备用UI而不是崩溃的组件。

```jsx
// comp ErrorBoundary 
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log(error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
        // 你可以自定义降级后的 UI 并渲染
        return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary

// comp App
import React, from 'react';
import ErrorBoundary from './ErrorBoundary'
class App extends React.Component {
  state = {
      count: 1
  }
  render() {
    const { count } = this.state
    if (count === 3) {
        throw new Error('I crashed!');
    }
    return (
      <ErrorBoundary>
        <h1>App</h1>
        <p>{count}</p>
        <button onClick={() => this.setState({ count: count + 1 })}>add</button>
      </ErrorBoundary>
    )
  }
}
export default App;
```

#### 3.3.2 手写异步组件

Suspense组件需要等待异步组件加载完成再渲染异步组件的内容。

1. lazy wrapper住异步组件，React第一次加载组件的时候，异步组件会发起请求，并且抛出异常，终止渲染；
2. Suspense里有componentDidCatch生命周期函数，异步组件抛出异常会触发这个函数，然后改变状态使其渲染fallback参数传入的组件；
3. 异步组件的请求成功返回之后，Suspense组件再次改变状态使其渲染正常子组件（即异步组件）；

```jsx
// comp About
const About = lazy(() => new Promise(resolve => {
  setTimeout(() => {
    resolve({
      default: <div>component content</div>
    })
  }, 1000)
}))

// comp Suspense
import React from 'react'
class Suspense extends React.PureComponent {
  /**
   * isRender 异步组件是否就绪，可以渲染
   */
  state = {
    isRender: true
  }
  componentDidCatch(e) {
    this.setState({ isRender: false })
    e.promise.then(() => {
      /* 数据请求后，渲染真实组件 */
      this.setState({ isRender: true })
    })
  }
  render() {
    const { fallback, children } = this.props
    const { isRender } = this.state
    return isRender ? children : fallback
  }
}

export default Suspense

// comp lazy
import React, { useEffect } from 'react'
export function lazy(fn) {
  const fetcher = {
    status: 'pending',
    result: null,
    promise: null,
  }
  return function MyComponent() {
    const getDataPromise = fn()
    fetcher.promise = getDataPromise
    getDataPromise.then(res => {
      fetcher.status = 'resolved'
      fetcher.result = res.default
    })
    useEffect(() => {
      if (fetcher.status === 'pending') {
          throw fetcher
      }
    }, [])
    if (fetcher.status === 'resolved') {
      return fetcher.result
    }
    return null
  }
}

// 实现的效果与React支持内容保持一致
import React, {Suspese, lazy} from 'react'

const About= lazy(() => { import('../About') });

class App extends React.Component {
  render() {
    /**
     * 1. 使用 React.Lazy 和 import() 来引入组件
     * 2. 使用<React.Suspense></React.Suspense>来做异步组件的父组件，并使用 fallback 来实现组件未加载完成时展示信息
     * 3. fallback 可以传入html，也可以自行封装一个统一的提示组件
     */
    return (
      <div>
        <Suspense
          fallback={
            <Loading />
          }
        >
          <About />
        </Suspense>
      </div>
    )
  }
}
export default ReactComp;
```

### 3.4 React18新特性

2021.11.15 React 18 升级到了beat版本，当前 17.0.2

发布节奏：

- 库的 Alpha 版本：当天可用
- 公开的 Beta 版：至少几个月
- RC 版本：至少在 Beta 版发布后的几周
- 正式版：至少在 RC 版本发布之后的几周

主要改动包括：

1. Automatic batching（自动批量更新）
2. startTransition
3. 支持 React.lazy 的SSR架构
4. Concurrent Mode （并发渲染、可选）

#### 3.4.1 Automatic batching

将多个状态更新合并成一个重新渲染以取得更好的性能的一种优化方式；

1. V18前

默认不batching的scene:

1. promise；
2. setTimeout；
3. 原生事件处理（native event handlers）；

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Does not re-render yet
    setFlag(f => !f); // Does not re-render yet
    // React will only re-render once at the end (that's batching!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}

————————————————————————————————————————————————

function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 17 and earlier does NOT batch these because
      // they run *after* the event in a callback, not *during* it
      setCount(c => c + 1); // Causes a re-render
      setFlag(f => !f); // Causes a re-render
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

2. v18

​	所有更新自动batching

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 18 and later DOES batch these:
      setCount(c => c + 1);
      setFlag(f => !f);
      // React will only re-render once at the end (that's batching!)
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

若不想batching?

```jsx
import { flushSync } from 'react-dom'; // Note: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

batching 对hooks及class的影响

```jsx
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));
 		// V18前 { count: 1, flag: false }
    // V18中 { count: 0, flag: false }，除非使用flushSync
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};


// 在一些react库中，如react-dom， unstable_batchedUpdates 实现类似功能
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
});
```

#### 3.4.2 startTransition

可以让我们的页面在多数据更新里保持响应。这个API通过标记某些更新为"transitions"，来提高用户交互；

实际：可以让我们的页面在展示时时刻保持re-render；

Example：我们更新input的value的同时用这个value去更新了一个有30000个item的list。然而这种多数据更新让页面无法及时响应，也让用户输入或者其他用户交互感觉很慢。

Solution：

```jsx
// 紧急的更新：展示用户的输入 
setInputValue(e.target.value); 
 
// 非紧急的更新： 展示结果 
setContent(e.target.value); 
```

V18前：update的优先级一样；

V18：支持优先级手动设置；

```jsx
import { startTransition } from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});

// 等同于
先setInputValue(e.target.value) 后执行 setContent(e.target.value); 
```

react中的upate：

- Urgent updates：reflect direct interaction, like typing, clicking, pressing, and so on；
- Transition updates：transition the UI from one view to another；

* 误区

1. 与setTimeout的区别
   	直接看起来结果类似：

```jsx
// debounce 和 throttle 经常使用
// Show what you typed
setInputValue(input);

// Show the results
setTimeout(() => {
  setSearchQuery(input);
}, 0);
```

区别：

1. 1. startTransition不会被放到下一次event loop，是同步立即执行的，这也就意味着，比timeout update更早，低端机体验明显;

使用场景

1. slow rendering：re-render需要耗费大量的工作量；
2. slow network：需要较长时间等待response的情况；

#### 3.4.3 支持React.lazy的ssr架构

SSR场景

react的SSR（server side render）

1. server：获取数据；
2. server：组装返回带有HTML的接口；
3. client：加载 JavaScript；
4. client：hydration，将客户端的JS与服务端的HTML结合；

- V18前：按序执行；
- V18：支持拆解应用为独立单元，不影响其他模块；

正常加载界面

<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976346932-bc6e620f-1333-44e4-a3e5-1e1dbd3830fa.png" alt="img" style="zoom:50%;" />

不使用SSR界面，带个loading

<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976346915-60354f9a-d390-4219-b185-7c28550cd369.png" alt="img" style="zoom:50%;" />

使用SSR

<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976346944-179c0ca0-f780-4963-ae3c-fe444e727f28.png" alt="img" style="zoom:50%;" />

hydration后

<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976346935-3eb17305-da08-4c21-b91a-c3c123ec3c8e.png" alt="img" style="zoom:50%;" />

SSR问题

1. server：获取数据； --> 按序执行，必须在服务端返回所有HTML；
2. client：加载 JavaScript； --> 必须JS加载完成；
3. client：hydration，将客户端的JS与服务端的HTML结合； --> hydrate后才能交互；

流式 HTML&选择性hydrate

1. 流式HTML
2. client进行选择性的 hydration：<Suspense>

```jsx
<Layout>
  <NavBar />
  <Sidebar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}> // 假设HTML加载很慢，分批
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
————————————————————————————————————————————————
// HTML返回过来在加载
<div hidden id="comments">
  <!-- Comments -->
  <p>First comment</p>
  <p>Second comment</p>
</div>
<script>
  // This implementation is slightly simplified
  document.getElementById('sections-spinner').replaceChildren(
    document.getElementById('comments')
  );
</script>
```

<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976347792-c772a553-0e84-4723-a094-1c06be64839d.png" alt="img" style="zoom:50%;" /><img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976349091-d6ef0cfb-717b-4c39-9bbe-83351f51daf9.png" alt="img" style="zoom:50%;" />

1. JS选择性加载

```jsx
import { lazy } from 'react';

const Comments = lazy(() => import('./Comments.js'));

// ...

<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976350368-04b7fc43-104d-401b-a2da-904deba5283f.png)<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976351265-705ce1db-1c4c-4ad8-9c89-a152f7c28002.png" alt="img" style="zoom:50%;" />

2. hydration 之前要求交互

<img src="https://cdn.nlark.com/yuque/0/2022/png/2340337/1644976351427-4cbf4d55-4720-4566-853a-6a2041d23e84.png" alt="img" style="zoom:50%;" />

记录操作行为，并优先执行Urgent comp的hydration；

#### 3.4.4. Concurrent Mode（并发模式）

 

Concurrent Mode（以下简称CM）

什么是 CM 和 suspense？

在2019年 react conf提出了实验性的版本来支持CM 和 Suspense（可以理解为等待代码加载，且指定加载界面）

- CM：

​	可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。

​	阻塞渲染：如UI update，需要先执行对应视图操作，如更新DOM；

solution：

adebounce：输入完成后响应，输入时不会更新；

bthrottle：功率低场景卡顿；

可中断渲染（CM）：

aCPU-bound update： (例如创建新的 DOM 节点和运行组件中的代码)：中断当前渲染，切换更高优先级；

bIO-bound update： (例如从网络加载代码或数据)：response前先在内存进行渲染；

-  suspense

​	以声明的方式来“等待”任何内容，包括数据

```jsx
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 尝试读取用户信息，尽管该数据可能尚未加载
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 尝试读取博文信息，尽管该部分数据可能尚未加载
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

*误区：Suspense 不是一个数据请求的库，而是一个机制。这个机制是用来给数据请求库向 React 通信说明某个组件正在读取的数据当前仍不可用

- 什么不是suspense

1. 1. 不是数据获取方式；
   2. 不是一个可以直接用于数据获取的客户端；
   3. 它不使数据获取与视图层代码耦合；

- Suspense 可以做什么

1. 1. 能让数据获取库与 React 紧密整合；
   2. 能让你有针对性地安排加载状态的展示；
   3. 能够消除 race conditions

DEMO：

目前fetch data方式：

● Fetch-on-render（渲染之后获取数据，如：在 useEffect 中 fetch）

```jsx
// 在函数组件中：
useEffect(() => {
  fetchSomething();
}, []);

// 或者，在 class 组件里：
componentDidMount() {
  fetchSomething();
}
————————————————————————————————————————————————

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

// 结果：只有在fetch user 后才会fetch post，请求被串行发出
```

- Fetch-then-render（接收到全部数据之后渲染，如：不使用 Suspense 的 Relay）

```jsx
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
————————————————————————————————————————————————

// 尽早开始获取数据
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// 子组件不再触发数据请求
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

// fetch 完 user 和 post 后再render
```

- Render-as-you-fetch（获取数据之后渲染，如：使用了 Suspense 的 Relay）

```jsx
同 Fetch-then-render 区别：
fetch-then-render：  开始获取数据 -> 结束获取数据 -> 开始渲染
render-as-you-fetch：开始获取数据 -> 开始渲染 -> 结束获取数据

————————————————————————————————————————————————

// 这不是一个 Promise。这是一个支持 Suspense 的特殊对象。
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 尝试读取用户信息，尽管信息可能未加载完毕
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 尝试读取博文数据，尽管数据可能未加载完毕
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

// 一开始fetch data, 渲染 ProfileDetails 和 ProfileTimeline
// 依次渲染可渲染comp，没有可渲染comp，此时fallback，渲染h1

```

注意点：

- suspense要求尽早获取数据

```jsx
// 一早就开始数据获取，在渲染之前！
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // 尝试读取用户信息
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

// 若无法保证在init时fetch data，而不是组件render后fetch data，可以根据props获取数据
// 开始获取数据，越快越好
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // 再次获取数据：用户点击时
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

- 如何解决race condition

```jsx
// useEffect race condition
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

// race condition: 快速切换时，某个ProfileTimeline fetch 请求延时过高后，旧的response会覆盖新的state

————————————————————————————————————————————————
// suspense，开始获取数据 -> 开始渲染 -> 结束获取数据，获取完数据，立马setState

const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

// 原因：
// hooks里，setState需要在合理的时间设置；
// suspense里，获取完数据，立马setState
```

为什么没有在V18中加上 CM 和 suspense ？

1. 虽然React 18没有将Concurrent Mode（以下简称CM）列为版本18升级的核心特性，但也将其作为可选项集成在18版本中，为什么不作为必选项？

A：

1. 1. CM和suspense更适合针对库作者，日常应用的开发者更多的可以作为借鉴；
   2. react当前核心会放在迁移和解决兼容性的问题；

- - Fragments、Context、Hook开箱即用
  - concurrent得引入新的语义

```jsx
// legacy 模式：最常见的版本
ReactDOM.render(<App />, rootNode)
// blocking 模式：作为从legacy迁移到cm的版本
ReactDOM.createBlockingRoot(rootNode).render(<App />)
// concurrent 模式：后续CM上stable版本后作为默认方式 
ReactDOM.createRoot(rootNode).render(<App />)
```

1. 

1.为什么能够在半天内完成V18的升级

1. a. React团队对于opt-in（可选）做了足够的兼容，如果不用CM的特性，是不会触发CM的，相当于React团队为你做了兜底；「concurrent rendering will only be enabled for updates triggered by one of the new features.」；

2. b.18引入了新的Root API ReactDOM.createRoot 来与旧的 ReactDOM.render区分，使用旧的API会继续在legacy mode （可以理解为传统模式）下运行，用新 API，就会跑在 "Concurrency opt-in" roots 下；

# react路由

https://www.yuque.com/lpldplws/web/bcagsz?singleDoc# 《React路由详解》 密码：hmp3

## 1. 课程目标

1. 学习业界内RouterV6的实现原理，达到手写Router的水平；
2. 学习React Router V6原理与源码，知其然且知其所以然，达到源码的水平；

## 2. 课程大纲

- React Router 使用用法
- 手写一个简单的react-router
- React Router 原理解析
- React Router 源码解析

## 3. 主要内容

### 3.1. React Router使用用法

React Router官网地址：https://reactrouter.com/

React Router中文Gitbook：https://react-guide.github.io/react-router-cn/

#### 3.1.1. React Router 功能介绍

React Router 是React生态库之一，是可以在CSR和SSR环境下，为了React而设计的路由库

- 客户端：React环境
- 服务端：node、RN

以最新版V6为例：

##### 3.1.1.1. 安装介绍

1. 基本安装

npm：npm install react-router-dom@6

yarn：yarn add react-router-dom@6

2. create react app 安装 

```js
// src/index.js
import * as React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// src/App.js
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

// App.js
function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}
```

3. webpack安装

   ```js
   import {
     BrowserRouter,
     Routes,
     Route,
   } from "react-router-dom";
   
   function App() {
     return (
       <BrowserRouter>
         <div>
           <h1>Hello, React Router!</h1>
           <Routes>
             <Route path="/" element={<Home />} />
           </Routes>
         </div>
       </BrowserRouter>
     );
   }
   ```

4. html script 安装

   不建议使用：以上在业务代码中都建议使用，但使用<script>不建议，因为会加载所有的组件集合，没法使用如webpack的按需加载

```js
  <!-- Other HTML for your app goes here -->

  <!-- The node we will use to put our app in the document -->
  <div id="root"></div>

  <!-- Note: When deploying to production, replace "development.js"
       with "production.min.js" in each of the following tags -->

  <!-- Load React and React DOM -->
  <!-- See https://reactjs.org/docs/add-react-to-a-website.html to learn more -->
  <script src="https://unpkg.com/react@>=16.8/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@>=16.8/umd/react-dom.development.js" crossorigin></script>

  <!-- Load history -->
  <script src="https://unpkg.com/history@5/umd/history.development.js" crossorigin></script>

  <!-- Load React Router and React Router DOM -->
  <script src="https://unpkg.com/react-router@6/umd/react-router.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-router-dom@6/umd/react-router-dom.development.js" crossorigin></script>

  <!-- A simple example app -->
  <script>
  var e = React.createElement;
  var Router = ReactRouterDOM.BrowserRouter;
  var Routes = ReactRouterDOM.Routes;
  var Route = ReactRouterDOM.Route;

  ReactDOM.render(
    (
      e(Router, null, (
        e(Routes, null, (
          e(Route, {
            element: e('div', null, 'Hello, React Router!')
          })
        ))
      ))
    ),
    document.getElementById('root')
  );
  </script>

</body>
```

##### 3.1.1.2 基本用法

- 配置路由

```js
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
// import your route components too

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
```

在先前版本的React Router中，针对多个匹配到的router，我们需要声明出具体的匹配逻辑，但V6相对更“智能”

- teams/111：匹配<Team />
- teams.new：匹配下面的<NewTeamForm />

```js
<Route path="teams/:teamId" element={<Team />} />
<Route path="teams/new" element={<NewTeamForm />} />
```

- Navigation/Link

我们可以使用以上两种方式修改url

```js
// Link
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="about">About</Link>
      </nav>
    </div>
  );
}

// useNavigate，更多用于JS操作后跳转使用
import { useNavigate } from "react-router-dom";

function Invoices() {
  let navigate = useNavigate();
  return (
    <div>
      <NewInvoiceForm
        onSubmit={async (event) => {
          let newInvoice = await createInvoice(
            event.target
          );
          navigate(`/invoices/${newInvoice.id}`);
        }}
      />
    </div>
  );
}
```

- 使用url的路径参数，常用于匹配path 参数后fetch数据

```js
import { Routes, Route, useParams } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="invoices/:invoiceId"
        element={<Invoice />}
      />
    </Routes>
  );
}

function Invoice() {
  let params = useParams();
  return <h1>Invoice {params.invoiceId}</h1>;
}

// example
function Invoice() {
  let { invoiceId } = useParams();
  let invoice = useFakeFetch(`/api/invoices/${invoiceId}`);
  return invoice ? (
    <div>
      <h1>{invoice.customerName}</h1>
    </div>
  ) : (
    <Loading />
  );
}
```

- 嵌套路由

路由路径 匹配 url路径

```js
function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}
```

以上提供三种路由

- "/invoices"

- "/invoices/sent"
- "/invoices/:invoiceId"

```js
// /invoices/sent
<App>
  <Invoices>
    <SentInvoices />
  </Invoices>
</App>

// /invoices/123
<App>
  <Invoices>
    <Invoice />
  </Invoices>
</App>

// 父router中子router可以用<Outlet>表示
import { Routes, Route, Outlet } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}

function Invoices() {
  return (
    <div>
      <h1>Invoices</h1>
      <Outlet /> // 匹配对应的<Invoice /> 或者 <SentInvoices />
    </div>
  );
}

function Invoice() {
  let { invoiceId } = useParams();
  return <h1>Invoice {invoiceId}</h1>;
}

function SentInvoices() {
  return <h1>Sent Invoices</h1>;
}

// 在跟router中添加Link 跳转
import {
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <nav>
        <Link to="invoices">Invoices</Link> |{" "}
        <Link to="dashboard">Dashboard</Link>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function Invoices() {
  return <h1>Invoices</h1>;
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

- Index routes

```js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Activity />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <GlobalNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// 如果是 "/"
<App>
  <Layout>
    <Activity />
  </Layout>
</App>
```

- relative  links

link to 指向的是相同级别的路由

```js
import {
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

function Home() {
  return <h1>Home</h1>;
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="invoices">Invoices</Link> // /dashboard/invoices
        <Link to="team">Team</Link> // dashboard/team
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function Invoices() {
  return <h1>Invoices</h1>;
}

function Team() {
  return <h1>Team</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="team" element={<Team />} />
      </Route>
    </Routes>
  );
}
```

- 兜底routes

```js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

- 多个routes集成在一个组件

```js
function App() {
  return (
    <div>
      <Sidebar>
        <Routes>
          <Route path="/" element={<MainNav />} />
          <Route
            path="dashboard"
            element={<DashboardNav />}
          />
        </Routes>
      </Sidebar>

      <MainContent>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="about" element={<About />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="invoices" element={<Invoices />} />
            <Route path="team" element={<Team />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
    </div>
  );
}
```

- 后代中使用Routes

```js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

function Dashboard() {
  return (
    <div>
      <p>Look, more routes!</p>
      <Routes>
        <Route path="/" element={<DashboardGraphs />} /> // dashboard
        <Route path="invoices" element={<InvoiceList />} /> // /dashboard/invoices
      </Routes>
    </div>
  );
}
```

##### 3.1.1.3 升级到v6的一些问题汇总

1. 为什么withRouter没了

withRouter用处

将一个组件包裹进Route里面, 然后react-router的三个对象history, location, match就会被放进这个组件的props属性中，可以实现对应的功能

```js
import React from 'react'
import './nav.css'
import {
    NavLink,
    withRouter
} from "react-router-dom"

class Nav extends React.Component{
    handleClick = () => {
        // Route 的 三个对象将会被放进来, 对象里面的方法可以被调用
        console.log(this.props);
    }
    render() {
        return (
            <div className={'nav'}>
                <span className={'logo'} onClick={this.handleClick}>掘土社区</span>
                <li><NavLink to="/" exact>首页</NavLink></li>
                <li><NavLink to="/activities">动态</NavLink></li>
                <li><NavLink to="/topic">话题</NavLink></li>
                <li><NavLink to="/login">登录</NavLink></li>
            </div>
        );
    }
}

// 导出的是 withRouter(Nav) 函数执行
export default withRouter(Nav)
```

React Router的V6中，更多的使用hooks语法，而withRouter的用法更多的用在Class组件里，只要可以将类组件转为函数组件即可：

```js
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}
```

2. 在V6以下的版本里，支持<Route component>和<Route render>，为什么V6中只支持<Route element>?

1. a. 参考React 中Suspense的用法，<Suspense fallback={<Spinner />}>，传入的是React 元素，而非组件，可以将props更容易的传入到对应的元素内（社区推荐）

2. b. 可以隐式的传递props到元素内

3. c. V6以下形式的包版本体积过大

```js
// V6以下
<Route path=":userId" component={Profile} />
  
<Route
  path=":userId"
  render={routeProps => (
    <Profile routeProps={routeProps} animate={true} />
  )}
/>

<Route
  path=":userId"
  children={({ match }) => (
    match ? (
      <Profile match={match} animate={true} />
    ) : (
      <NotFound />
    )
  )}
/>

// V6
<Route path=":userId" element={<Profile />} />

<Route path=":userId" element={<Profile animate={true} />} />

function Profile({ animate }) {
  // 使用hooks，在元素定义内处理逻辑
  let params = useParams();
  let location = useLocation();
}
```

3. 如何在树形结构里嵌套路由

```js
// V6以下
<Switch>
  <Route path="/users" component={Users} />
</Switch>;

// and now deeper in the tree
function Users() {
  return (
    <div>
      <h1>Users</h1>
      <Switch>
        <Route path="/users/account" component={Account} />
      </Switch>
    </div>
  );
}

// V6
// somewhere up the tree
<Routes>
  <Route path="/users/*" element={<Users />} />
</Routes>;

// and now deeper in the tree
function Users() {
  return (
    <div>
      <h1>Users</h1>
      <Routes>
        <Route path="account" element={<Account />} />
      </Routes>
    </div>
  );
}
```

4. 为什么取消正则路由
   1. a. 正则路由为V6版本的路由排序带来很多问题，比如，如果定义一个正则的优先级？

   2. b. 正则路由占据了React Router近1/3的体积

   3. c. 正则路由能表达的，V6版本都支持

```js
// V5
function App() {
  return (
    <Switch>
      <Route path={/(en|es|fr)/} component={Lang} />
    </Switch>
  );
}

function Lang({ params }) {
  let lang = params[0];
  let translations = I81n[lang];
  // ...
}

// V6
function App() {
  return (
    <Routes>
      <Route path="en" element={<Lang lang="en" />} />
      <Route path="es" element={<Lang lang="es" />} />
      <Route path="fr" element={<Lang lang="fr" />} />
    </Routes>
  );
}

function Lang({ lang }) {
  let translations = I81n[lang];
  // ...
}

// V5
function App() {
  return (
    <Switch>
      <Route path={/users\/(\d+)/} component={User} />
    </Switch>
  );
}

function User({ params }) {
  let id = params[0];
  // ...
}

// V6
function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<ValidateUser />} />
      <Route path="/users/*" element={<NotFound />} />
    </Routes>
  );
}

function ValidateUser() {
  let params = useParams();
  let userId = params.id.match(/\d+/);
  if (!userId) {
    return <NotFound />;
  }
  return <User id={params.userId} />;
}

function User(props) {
  let id = props.id;
  // ...
}
```

#### 3.1.2 React Router Api

API详情请参考：https://reactrouter.com/docs/en/v6/routers/browser-router

1. routers

1. 1. browserRouter：浏览器router，web开发首选；
   2. hashRouter：在不能使用browserRouter时使用，常见SPA的B端项目
   3. HistoryRouter：使用history库作为入参，这允许您在非 React context中使用history实例作为全局变量，标记为unstable_HistoryRouter，后续可能会被修改，不建议直接引用，可以从react-router中引入不建议使用；
   4. MemoryRouter：不依赖于外界（如 browserRouter的 history 堆栈），常用于测试用例；
   5. NativeRouter：RN环境下使用的router，不作过多介绍；
   6. Router：可以视为所有其他router的基类；
   7. StaticRouter：node环境下使用的router，不作过多介绍；

2. components

1. 1. Link：在react-router-dom中，Link被渲染为有真实href的<a />，同时，Link to 支持相对路径路由；
   2. Link（RN）：不作过多介绍；
   3. NavLink：有“active”标的Link，尝被用于导航栏等场景；
   4. Navigate：可以理解为被useNavigate包裹的组件，作用通Link类似；
   5. Outlet：类似slot，向下传递route；
   6. Routes & Route：URL变化时，Routes匹配出最符合要求的Routes渲染；

3. Hooks

1. 1. useHref：被用作返回Link to 指定的URL；
   2. useInRouterContext ：返回是否在<Router>的context中；
   3. useLinkClickHandler：在使用自定义<Link>后返回点击事件；
   4. useLinkPressHandler：类似useLinkClickHandler，用于RN；
   5. useLocation：返回当前的location对象；
   6. useMatch：返回当前path匹配到的route；
   7. useNavigate：类似于Navigate，显示声明使用；
   8. useNavigationType：pop、push、replace；
   9. useOutlet；获取此route层级的子router元素；
   10. useOutletContext：用于向子route传递context；
   11. useParams：匹配当前路由path；
   12. useResolvedPath：返回当前路径的完整路径名，主要用于相对子route中；
   13. useRoutes：等同于<Routes>，但要接收object形式；
   14. useSearchParams：用于查询和修改location 中query字段；
   15. useSearchParams（RN）：RN中使用；

4. utilities：

1. 1. createRoutesFromChildren ：将<Route>转为route object形式；
   2. createSearchParams：类似useSearchParams；
   3. generatePath：将通配符和动态路由和参数转为真实path；
   4. Location：用于hostory router，声明Location的interface；
   5. matchPath：类似useMatch，返回匹配到的route path；
   6. matchRoutes：返回匹配到的route 对象；
   7. renderMatches：返回matchRoutes的react元素；
   8. resolvePath：将Link to的值转为带有绝对路径的真实的path对象；

最后，看一下实际运行的代码案例：

1. 基础：https://stackblitz.com/edit/github-agqlf5?file=src%2FApp.jsx

### 3.2 手写一个简单的react-router

1. SPA（单页应用）

单页面应用的特点是:只会在首次加载的时候，向服务器请求资源以加载页面，后续跳转页面是不会再向服务器请求资源，并且不会重新加载页面，会以切换组件重新渲染来达到页面跳转的目的

1. 页面刷新的场景

1. 1. 在js中发起页面跳转，改变浏览器的url
   2. 用户通过点击浏览器的前进或后退按钮发生页面跳转
   3. 用户修改浏览器url导致重新加载页面

2. History API（对访问页面堆栈的操作）：可以修改浏览器的url，但是不会重新加载页面

1. 1. pushState: 创建一个新的url，并跳转至该url；
   2. replaceState：修改当前url；
   3. back：返回后一个url；
   4. forward：返回前一个url；
   5. go：跳转到指定页面的url；（在调用go方法时，如果没有传参则会与调用location.reload()一样，会重新加载页面）

3. 监听用户点击浏览器前进和后退按钮

1. 1. 通过监听popstate实现；
   2. 调用 history.pushState() 或者 history.replaceState() 不会触发popstate事件. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法)，此外，a 标签的锚点也会触发该事件；

参考：

- window.history API：https://developer.mozilla.org/zh-CN/docs/Web/API/History
- window.location API：https://developer.mozilla.org/zh-CN/docs/Web/API/Location

#### 3.2.2 实现一个BrowserRouter

```js
// browserRouter
function BrowserRouter(props) {
  const RouterContext = createContext();
  const HistoryContext = createContext();

   const [path, setPath] = useState(() => {
     // 首次渲染，获取到对应的路由
     const {pathname} = window.location;
     return pathname || '/';
   });
  
    useEffect(() => {
    // 监听用户点击浏览器的前进，后退按钮跳转页面
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    }
  }, []);
  
  const handlePopstate = function(event) {
    const {pathname} = window.location;
    setPath(pathname);
  }
  
  // 点击ui跳转页面
  const push = function(path) {
    setPath(path);
    window.history.pushState({path}, null, path);
  }

  const goBack = function() {
    window.history.go(-1);
  }

  return (
   <RouterContext.Provider value={path}>
      <HistoryContext.Provider value={{
        push,
        goBack
      }}>
        {props.children}
      </HistoryContext.Provider>
    </RouterContext.Provider>
  );
}

export default BrowserRouter;

// Route
export function Route(props) {
  const {component: Component, path: componentPath} = props;
  
  return (
    <RouterContext.Consumer>
      {(path) => {
        return componentPath === path ? <Component /> : null;
      }}
    </RouterContext.Consumer>
  );
}


// 为什么不使用useContext？
// 因为每当路由变化时，我们都需要重新渲染一个对应的组件，需要监听path的变化
```

#### 3.2.3 实现一个HashRouter

```js
import {useEffect, useState} from 'react';
import RouterContext from './routerContext';
import HistoryContext from './historyContext';

// 自定义HashRouter
function HashRouter(props) {
  const [path, setPath] = useState(() => {
    const {hash} = window.location;
    if(hash) {
      return hash.slice(1);
    }
    return '/#/';
  });

  useEffect(() => {
    // 监听用户点击浏览器的前进，后退按钮跳转页面
    window.addEventListener('hashchange', handlePopstate);
    
    return () => {
      window.removeEventListener('hashchange', handlePopstate);
    }
  }, []);

  const handlePopstate = function(event) {
    const {hash} = window.location;
    setPath(hash.slice(1));
  }

  //history Api: https://developer.mozilla.org/zh-CN/docs/Web/API/History_API

  // 点击ui跳转页面
  const push = function(path) {
    window.location.hash = path;
  }

  const goBack = function() {
    window.history.go(-1);
  }

  return (
    <RouterContext.Provider value={path}>
      <HistoryContext.Provider value={{
        push,
        goBack
      }}>
        {props.children}
      </HistoryContext.Provider>
    </RouterContext.Provider>
  );
}

export default HashRouter;

// Route
export function Route(props) {
  const {component: Component, path: componentPath} = props;
  
  return (
    <RouterContext.Consumer>
      {(path) => {
        return componentPath === path ? <Component /> : null;
      }}
    </RouterContext.Consumer>
  );
}
```

### 3.3 React Router原理解析

核心功能：

1. 订阅和操作history堆栈
2. 将 URL 与router匹配
3. 渲染与router相匹配的UI

#### 3.3.1 概念定义

- URL：地址栏中的URL；
- Location：由React Router基于浏览器内置的window.location对象封装而成的特定对象，它代表“用户在哪里”，基本代表了URL；
- Location State：不在URL中，但代表了Location的状态；
- History Stack：随着用户操作导航，浏览器会保留location的堆栈，可以通过返回前进按钮操作；
- Client Side Routing (CSR) ：一个纯 HTML 文档可以通过history stack来链接到其他文档，CSR使我的能够操作浏览器历史堆栈，而无需向服务器发出文档请求；
- History：一个object，它允许 React Router 订阅 URL 中的更改，并提供 API 以编程方式操作浏览器历史堆栈；
- History Action ：包括POP, PUSH, 或者 REPLACE

- - push：将新的入口添加到history stack（点击链接或者navigation）
  - replace：代替当前的堆栈信息，而不是新push
  - pop：当用户点击后推或者前进按钮

- Segment ：/ 字符之间的 URL 或 path pattern部分。例如，“/users/123”有两个segment；
- Path Pattern：看起来像 URL，但可以具有用于将 URL 与路由匹配的特殊字符，例如动态段 ("/users/:userId") 或通配符 ("/docs/*")。它们不是 URL，它们是 React Router 将匹配的模式。
- Dynamic Segment：动态的path pattern，例如，/users/:userId 将会匹配 /user/123；
- URL Params ： 动态段匹配的 URL 的解析值；
- Router ：使所有其他组件和hooks工作的有状态的最高层的组件；
- Route Config：将当前路径进行匹配，通过排序和匹配创建一个树状的routes对象；
- Route：通常具有 { path, element } 或 <Route path element> 的路由元素。path是 pattern。当路径模式与当前 URL 匹配时展示；
- Route Element： 也就是 <Route>，<Routes> 读取该元素的 props 以创建路由；
- Nested Routes： 因为路由可以有子路由，并且每个路由通过segment定义 URL 的一部分，所以单个 URL 可以匹配树的嵌套“分支”中的多个路由。这可以通过outlet、relative links等实现自动布局嵌套；
- Relative links：不以 / 开头的链接，继承渲染它们的最近路径。在无需知道和构建整个路径的情况下，就可以实现更深层的url macth；
- Match：当路由匹配 URL 时保存信息的对象，例如匹配的 url params和path name；
- Matches：与当前位置匹配的路由数组，此结构用于nested routes；
- Parent Route：带有子路由的父路由节点；
- Outlet： 匹配match中的下一个匹配项的组件；
- Index Route ：当没有path时，在父路由的outlet中匹配；
- Layout Route： 专门用于在特定布局内对子路由进行分组；

#### 3.3.2 history 和location

React Router 的前提是：它必须能够订阅浏览器history stack中的更改；

浏览器在用户浏览时维护自己的历史堆栈。这就是后退和前进按钮的工作方式。在传统网站（没有 JavaScript 的 HTML 文档）中，每次用户单击链接、提交表单或单击后退和前进按钮时，浏览器都会向服务器发出请求。

例如，假设用户：

- 点击 /dashboard的链接；
- 点击 /accounts 的链接；
- 点击 /customers/123 的链接；
- 点击后退按钮；
- 点击指向 /dashboard 的链接；

history stack是如何的？

- /dashboard
- /dashboard, /accounts
- /dashboard, /accounts, /customers/123

1. /dashboard, /accounts, /customers/123
2. /dashboard, /accounts, /dashboard

##### 3.3.2.1 history object

通过客户端路由(CSR)，我们可以通过代码操纵浏览器历史记录栈。

例如，我们可以写一些这样的代码来改变URL，而不需要浏览器向服务器发出请求的默认行为

```js
<a
  href="/contact"
  onClick={(event) => {
    // 阻止默认事件
    event.preventDefault();
    // push 并将 URL转想/contact
    window.history.pushState({}, undefined, "/contact");
  }}
/>
```

以上代码会修改URL，但不会渲染任何UI的变化，我们需要监听变化，并通过代码修改页面UI

```js
window.addEventListener("popstate", () => {
  // URL changed!
});
```

但此类事件只在点击前进后退按钮才生效，对window.history.pushState 或者 window.history.replaceState无效

因此，React Router使用history对象来监听事件的变化，如POP, PUSH, 或者REPLACE

```js
let history = createBrowserHistory();
history.listen(({ location, action }) => {
  // this is called whenever new locations come in
  // the action is POP, PUSH, or REPLACE
});
```

在开发环境中，我们不需要关系history object，这些在React Router底层实现了，React Router提供监听history stack的变化，最终在URL变化时更新其状态，并重新渲染。

##### 3.3.2.2 Location

React Router 声明了自己的location模块，大致为

```js
{
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram",
  hash: "#menu",
  state: null,
  key: "aefz24ie"
}
```

pathname、search、hash大致同window.location一致，三者拼接起来等同于URL

```js
location.pathname + location.search + location.hash;
// /bbq/pig-pickins?campaign=instagram#menu
```

注意：我们可以使用urlSearchParams来获取对应的search内容

```js
// given a location like this:
let location = {
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram&popular=true",
  hash: "",
  state: null,
  key: "aefz24ie",
};

// we can turn the location.search into URLSearchParams
let params = new URLSearchParams(location.search);
params.get("campaign"); // "instagram"
params.get("popular"); // "true"
params.toString(); // "campaign=instagram&popular=true",
```

- location state

You may have wondered why the window.history.pushState() API is called "push state". State? Aren't we just changing the [URL](https://reactrouter.com/docs/en/v6/getting-started/concepts#url)? Shouldn't it be history.push? Well, we weren't in the room when the API was designed, so we're not sure why "state" was the focus, but it is a cool feature of browsers nonetheless.

```js
// 通过pushState注入堆栈，goback()时，退出一层堆栈
window.history.pushState("look ma!", undefined, "/contact");
window.history.state; // "look ma!"
// user clicks back
window.history.state; // undefined
// user clicks forward
window.history.state; // "look ma!"
```

可以将location.state 当做跟URL变动而变动的属性，只是一般用于开发者使用

在React Router中，我们可以通过Link 或者Navigate 来设置state，并使用useLocation获取state

```js
<Link to="/pins/123" state={{ fromDashboard: true }} />;

let navigate = useNavigate();
navigate("/users/123", { state: partialUser });

let location = useLocation();
location.state;
```

- location key

  一般用于定位滚动距离，或者客户端数据缓存等，因为每个堆栈都有唯一的key值，可以通过Map或者localStorage来标识指定的堆栈信息。

```js
// 根据location.key缓存数据

let cache = new Map();

function useFakeFetch(URL) {
  let location = useLocation();
  let cacheKey = location.key + URL;
  let cached = cache.get(cacheKey);

  let [data, setData] = useState(() => {
    // initialize from the cache
    return cached || null;
  });

  let [state, setState] = useState(() => {
    // avoid the fetch if cached
    return cached ? "done" : "loading";
  });

  useEffect(() => {
    if (state === "loading") {
      let controller = new AbortController();
      fetch(URL, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (controller.signal.aborted) return;
          // set the cache
          cache.set(cacheKey, data);
          setData(data);
        });
      return () => controller.abort();
    }
  }, [state, cacheKey]);

  useEffect(() => {
    setState("loading");
  }, [URL]);

  return data;
}
```

#### 3.3.3 匹配

在初始渲染时，当历史堆栈发生变化时，React Router 会将位置与您的路由配置进行匹配，以提供一组要渲染的匹配项

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>

// 对应的routes，可以使用 useRoutes(routesGoHere)获取
let routes = [
  {
    element: <App />,
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "teams",
        element: <Teams />,
        children: [
          {
            index: true,
            element: <LeagueStandings />,
          },
          {
            path: ":teamId",
            element: <Team />,
          },
          {
            path: ":teamId/edit",
            element: <EditTeam />,
          },
          {
            path: "new",
            element: <NewTeamForm />,
          },
        ],
      },
    ],
  },
  {
    element: <PageLayout />,
    children: [
      {
        element: <Privacy />,
        path: "/privacy",
      },
      {
        element: <Tos />,
        path: "/tos",
      },
    ],
  },
  {
    element: <Contact />,
    path: "/contact-us",
  },
];

```

- 匹配参数 & routes 排序

上述路由config为

```js
[
  "/",
  "/teams",
  "/teams/:teamId",
  "/teams/:teamId/edit",
  "/teams/new",
  "/privacy",
  "/tos",
  "/contact-us",
];
```

/teams/:teamId 可以匹配 /teams/123 或者 /teams/aaa

针对 / teams/new，有 "/teams/:teamId"、 "/teams/new", 匹配，V6支持相对智能的匹配，在匹配时，React Router 会根据所有的segment、静态segment、动态segment、通配符模式等进行排序，并选择最具体的匹配项

- 路由匹配

```js
<Route path=":teamId" element={<Team/>}/>
  
等价于

{
  pathname: "/teams/firebirds", // 匹配出与此路由匹配的URL部分
  params: {
    teamId: "firebirds" // 用来存储对应关系
  },
  route: {
    element: <Team />,
    path: ":teamId"
  }
}
```

因为routes是树状结构，因此，一个单一的URL可以匹配所有的树中的“分支”

```js
/teams/firebirds

// 针对下列路由
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>

// 匹配出的routes为：
[
  {
    pathname: "/",
    params: null,
    route: {
      element: <App />,
      path: "/",
    },
  },
  {
    pathname: "/teams",
    params: null,
    route: {
      element: <Teams />,
      path: "teams",
    },
  },
  {
    pathname: "/teams/firebirds",
    params: {
      teamId: "firebirds",
    },
    route: {
      element: <Team />,
      path: ":teamId",
    },
  },
];
```

#### 3.3.4 渲染

<Routes>将把位置与你的路由配置相匹配，得到一组匹配的内容，然后像这样呈现一个React元素树。

```js
// 假设代码为

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
      <Route element={<PageLayout />}>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Tos />} />
      </Route>
      <Route path="contact-us" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);

// 匹配 /teams/firebirds

<App>
  <Teams>
    <Team />
  </Teams>
</App>
```

- outlets

很像slot,<outlet>应该在父路由元素中使用以呈现子路由元素，以此让嵌套的子路由展示，当匹配到子路由的路径后，会展示或不展示

```js
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This element will render either <DashboardMessages> when the URL is
          "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
      */}
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route
          path="messages"
          element={<DashboardMessages />}
        />
        <Route path="tasks" element={<DashboardTasks />} />
      </Route>
    </Routes>
  );
}
```

- index  routes

```js
// /teams/firebirds
<Route path="teams" element={<Teams />}>
  <Route path=":teamId" element={<Team />} />
  <Route path="new" element={<NewTeamForm />} />
  <Route index element={<LeagueStandings />} />
</Route>

<App>
  <Teams>
    <Team />
  </Teams>
</App>

// /teams
<App>
  <Teams>
    <LeagueStandings />
  </Teams>
</App>

```

index routes会将父route的outlet渲染出来，一般会在持久化导航的父路由节点上展示默认的子路由信息

- layout routes

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

加入要匹配/privacy，会匹配到的结果为：

```js
<App>
  <PageLayout>
    <Privacy />
  </PageLayout>
</App>
```

实际上，layout routes（布局路由），本身不参与匹配，但其子route参与，如果不这样实现，上述代码会很冗余

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route
    path="/privacy"
    element={
      <PageLayout>
        <Privacy />
      </PageLayout>
    }
  />
  <Route
    path="/tos"
    element={
      <PageLayout>
        <Tos />
      </PageLayout>
    }
  />
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

#### 3.3.5 导航函数

可以使用useNavigate方法

```js
let navigate = useNavigate();
useEffect(() => {
  setTimeout(() => {
    navigate("/logout");
  }, 30000);
}, []);
```

要注意，不要随意使用navigate，这样会增加程序的复杂性

```js
<li onClick={() => navigate("/somewhere")} />
// 使用 <Link to="sonewhere" />
```

#### 3.3.6 数据获取

```js
let location = useLocation();
let urlParams = useParams();
let [urlSearchParams] = useSearchParams();
```

### 3.4 React Router源码解析

React Router github：https://github.com/remix-run/react-router

React Router基于monorepo的架构（指在一个项目仓库(repo)中管理多个模块/包(package)）

- react-router：React Router的核心基本功能，为react-router-dom 和 react-router-native服务；
- react-router-dom：在web应用使用React Router的方法；
- react-router-native：在RN中使用React Router的方法；
- react-router-dom-v5-compat：V5迁移至V6的垫片；

本次主要讲解react-router核心库

#### 3.4.1 react-router

与运行环境无关，几乎所有与运行平台无关的方法、组件和hooks都是在这里定义的

- index.ts: 入口文件，且标识了三个不安全的api,要使用的话，不要单独从lib/context.ts引入，要从react-router的入口文件引入（虽然一般开发中用不到）

```js
/** @internal */
export {
  NavigationContext as UNSAFE_NavigationContext,
  LocationContext as UNSAFE_LocationContext,
  RouteContext as UNSAFE_RouteContext,
};
```

##### 3.4.1.1 router

Router在react-router内部主要用于提供全局的路由导航对象（一般由history库提供）以及当前的路由导航状态，在项目中使用时一般是必须并且唯一的，不过一般不会直接使用，更多会使用已经封装好路由导航对象的BrowserRouter(react-router-dom包引入)、HashRouter(react-router-dom包引入)和MemoryRouter(react-router包引入)

- router context

  ```js
  import React from 'react'
  import type {
    History,
    Location,
  } from "history";
  import {
    Action as NavigationType,
  } from "history";
  
  // 只包含，go、push、replace、createHref 四个方法的 History 对象，用于在 react-router 中进行路由跳转
  export type Navigator = Pick<History, "go" | "push" | "replace" | "createHref">;
  
  interface NavigationContextObject {
    basename: string;
    navigator: Navigator;
    static: boolean;
  }
  
  /**
   * 内部含有 navigator 对象的全局上下文，官方不推荐在外直接使用
   */
  const NavigationContext = React.createContext<NavigationContextObject>(null!);
  
  
  interface LocationContextObject {
    location: Location;
    navigationType: NavigationType;
  }
  /**
   * 内部含有当前 location 与 action 的 type，一般用于在内部获取当前 location，官方不推荐在外直接使用
   */
  const LocationContext = React.createContext<LocationContextObject>(null!);
  
  // 这是官方对于上面两个 context 的导出，可以看到都是被定义为不安全的，并且可能会有着重大更改，强烈不建议使用
  /** @internal */
  export {
    NavigationContext as UNSAFE_NavigationContext,
    LocationContext as UNSAFE_LocationContext,
  };
  ```

- Hooks：基于LocationConext的三个hooks

- - useInRouterContext

- - useNavigationType
  - useLocation

- ```tsx
  /**
  * 断言方法
  */
  function invariant(cond: any, message: string): asserts cond {
    if (!cond) throw new Error(message);
  }
  
  /**
  * 判断当前组件是否在一个 Router 中
  */
  export function useInRouterContext(): boolean {
    return React.useContext(LocationContext) != null;
  }
  /**
  * 获取当前的跳转的 action type
  */
  export function useNavigationType(): NavigationType {
    return React.useContext(LocationContext).navigationType;
  }
  /**
  * 获取当前跳转的 location
  */
  export function useLocation(): Location {
    // useLocation 必须在 Router 提供的上下文中使用
    invariant(
      useInRouterContext(),
      // TODO: This error is probably because they somehow have 2 versions of the
      // router loaded. We can help them understand how to avoid that.
      `useLocation() may be used only in the context of a <Router> component.`
    );
    
    return React.useContext(LocationContext).location;
  }
  ```

- 定义Router组件

  传入context与外部传入的location

```tsx
// 接上面，这里额外还从 history 中引入了 parsePath 方法
import {
  parsePath
} from "history";

export interface RouterProps {
  // 路由前缀
  basename?: string;
  children?: React.ReactNode;
  // 必传，当前 location
  /*
      interface Location {
            pathname: string;
            search: string;
            hash: string;
            state: any;
            key: string;
      }
  */
  location: Partial<Location> | string;
  // 当前路由跳转的类型，有 POP，PUSH 与 REPLACE 三种
  navigationType?: NavigationType;
  // 必传，history 中的导航对象，我们可以在这里传入统一外部的 history
  navigator: Navigator;
  // 是否为静态路由（ssr）
  static?: boolean;
}

/**
 * 提供渲染 Route 的上下文，但是一般不直接使用这个组件，会包装在 BrowserRouter 等二次封装的路由中
 * 整个应用程序应该只有一个 Router
 * Router 的作用就是格式化传入的原始 location 并渲染全局上下文 NavigationContext、LocationContext
 */
export function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = NavigationType.Pop,
  navigator,
  static: staticProp = false
}: RouterProps): React.ReactElement | null {
  // 断言，Router 不能在其余 Router 内部，否则抛出错误
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>.` +
      ` You should never have more than one in your app.`
  );
  // 格式化 basename，去掉 url 中多余的 /，比如 /a//b 改为 /a/b
  let basename = normalizePathname(basenameProp);
  // 全局的导航上下文信息，包括路由前缀，导航对象等
  let navigationContext = React.useMemo(
    () => ({ basename, navigator, static: staticProp }),
    [basename, navigator, staticProp]
  );

  // 转换 location，传入 string 将转换为对象
  if (typeof locationProp === "string") {
    // parsePath 用于将 locationProp 转换为 Path 对象，都是 history 库引入的
    /*
        interface Path {
              pathname: string;
              search: string;
              hash: string;
        }
    */
    locationProp = parsePath(locationProp);
  }

  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;

  // 经过抽离 base 后的真正的 location，如果抽离 base 失败返回 null
  let location = React.useMemo(() => {
    // stripBasename 用于去除 pathname 前面 basename 部分
    let trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname == null) {
      return null;
    }

    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key
    };
  }, [basename, pathname, search, hash, state, key]);

  if (location == null) {
    return null;
  }

  return (
    // 唯一传入 location 的地方
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider
        children={children}
        value={{ location, navigationType }}
      />
    </NavigationContext.Provider>
  );
}
  
// 格式化方法
/**
 * 格式化 pathname
 * @param pathname
 * @returns
 */
const normalizePathname = (pathname: string): string =>
  pathname.replace(/\/+$/, "").replace(/^\/*/, "/");

/**
 *
 * 抽离 basename，获取纯粹的 path，如果没有匹配到则返回 null
 * @param pathname
 * @param basename
 * @returns
 */
function stripBasename(pathname: string, basename: string): string | null {
  if (basename === "/") return pathname;

  // 如果 basename 与 pathname 不匹配，返回 null
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  // 上面只验证了是否 pathname 包含 basename，这里还需要验证包含 basename 后第一个字母是否为 /，不为 / 证明并不是该 basename 下的路径，返回 null
  let nextChar = pathname.charAt(basename.length);
  if (nextChar && nextChar !== "/") {
    return null;
  }

  // 返回去除掉 basename 的 path
  return pathname.slice(basename.length) || "/";
}
```

- memory router 封装

其实就是将history库与我们声明的Router组件绑定起来，当history.listen监听到路由改变后重新设置当前的location与action。

```tsx
import type { InitialEntry, MemoryHistory } from 'history';
import { createMemoryHistory } from 'history';

export interface MemoryRouterProps {
  // 路由前缀
  basename?: string;
  children?: React.ReactNode;
  // 与 createMemoryHistory 返回的 history 对象参数相对应，代表的是自定义的页面栈与索引
  initialEntries?: InitialEntry[];
  initialIndex?: number;
}

/**
 * react-router 里面只有 MemoryRouter，其余的 router 在 react-router-dom 里
 */
export function MemoryRouter({
  basename,
  children,
  initialEntries,
  initialIndex
}: MemoryRouterProps): React.ReactElement {
  // history 对象的引用
  let historyRef = React.useRef<MemoryHistory>();
  if (historyRef.current == null) {
    // 创建 memoryHistory
    historyRef.current = createMemoryHistory({ initialEntries, initialIndex });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });

  // 监听 history 改变，改变后重新 setState
  React.useLayoutEffect(() => history.listen(setState), [history]);

  // 简单的初始化并将相应状态与 React 绑定
  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
```

- 总结：

  a. Router组件是react-router应用中必不可少的，一般直接写在应用最外层，它提供了一系列关于路由跳转和状态的上下文属性和方法

  b. 一般不会直接使用Router组件，而是使用react-router内部提供的高阶Router组件，而这些高阶组件实际上就是将history库中提供的导航对象与Router组件连接起来，进而控制应用的导航状态

##### 3.4.1.2 route

列个例子

```jsx
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
// 这几个页面不用管它
import App from "./App";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/invoices" element={<Invoices />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
```

- props

route在react-router中只是提供命令式的路由配置方式

```tsx
// Route 有三种 props 类型，这里先了解内部参数的含义，下面会细讲
export interface PathRouteProps {
  caseSensitive?: boolean;
  // children 代表子路由
  children?: React.ReactNode;
  element?: React.ReactNode | null;
  index?: false;
  path: string;
}

export interface LayoutRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode | null;
}

export interface IndexRouteProps {
  element?: React.ReactNode | null;
  index: true;
}

/**
 * Route 组件内部没有进行任何操作，仅仅只是定义 props，而我们就是为了使用它的 props
 */
export function Route(
  _props: PathRouteProps | LayoutRouteProps | IndexRouteProps
): React.ReactElement | null {
  // 这里可以看出 Route 不能够被渲染出来，渲染会直接抛出错误，证明 Router 拿到 Route 后也不会在内部操作
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, ` +
      `never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
```

- 总结

  a. Route可以被看做一个挂载用户传入参数的对象，它不会在页面中渲染，而是会被Routes接受并解析

##### 3.4.1.3 routes

```tsx
export interface RoutesProps {
  children?: React.ReactNode;
  // 用户传入的 location 对象，一般不传，默认用当前浏览器的 location
  location?: Partial<Location> | string;
}

/**
 * 所有的 Route 都需要 Routes 包裹，用于渲染 Route（拿到 Route 的 props 的值，不渲染真实的 DOM 节点）
 */
export function Routes({
  children,
  location
}: RoutesProps): React.ReactElement | null {
  return useRoutes(createRoutesFromChildren(children), location);
}
```

- createRoutesFromChildren

```tsx
// 路由配置对象
export interface RouteObject {
  // 路由 path 是否匹配大小写
  caseSensitive?: boolean;
  // 子路由
  children?: RouteObject[];
  // 要渲染的组件
  element?: React.ReactNode;
  // 是否是索引路由
  index?: boolean;
  path?: string;
}

/**
 * 将 Route 组件转换为 route 对象，提供给 useRoutes 使用
 */
export function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[] {
  let routes: RouteObject[] = [];

  // 内部逻辑很简单，就是递归遍历 children，获取 <Route /> props 上的所有信息，然后格式化后推入 routes 数组中
  React.Children.forEach(children, element => {
    if (!React.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    // 空节点，忽略掉继续往下遍历
    if (element.type === React.Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children)
      );
      return;
    }

    // 不要传入其它组件，只能传 Route
    invariant(
      element.type === Route,
      `[${
        typeof element.type === "string" ? element.type : element.type.name
      }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );

    let route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path
    };

    // 递归
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}
```

- useRoutes:声明式配置路由，下面详细介绍

- 总结

  a. react-router在路由定义时包含两种方式

  - 指令式：<routes><route></route></routes>，指令式内部也是声明式形式
  - 声明式：useRoutes

  b. Routes与Route强绑定，有Routes则必定要传入且只能传入Route

##### 3.4.1.4 useRoutes

假如我们代码里使用

```jsx
import { useRoutes } from "react-router-dom";

// 此时 App 返回的就是已经渲染好的路由元素了
function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "/messages",
          element: <DashboardMessages />
        },
        { path: "/tasks", element: <DashboardTasks /> }
      ]
    },
    { path: "/team", element: <AboutPage /> }
  ]);

  return element;
}
```

- RouteContext

```tsx
/**
 * 动态参数的定义
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export interface RouteMatch<ParamKey extends string = string> {
  // params 参数，比如 :id 等
  params: Params<ParamKey>;
  // 匹配到的 pathname
  pathname: string;
  /**
   * 子路由匹配之前的路径 url，这里可以把它看做是只要以 /* 结尾路径（这是父路由的路径）中 /* 之前的部分
   */
  pathnameBase: string;
  // 定义的路由对象
  route: RouteObject;
}

interface RouteContextObject {
  // 一个 ReactElement，内部包含有所有子路由组成的聚合组件，其实 Outlet 组件内部就是它
  outlet: React.ReactElement | null;
  // 一个成功匹配到的路由数组，索引从小到大层级依次变深
  matches: RouteMatch[];
}
/**
 * 包含全部匹配到的路由，官方不推荐在外直接使用
 */
const RouteContext = React.createContext<RouteContextObject>({
  outlet: null,
  matches: []
});

/** @internal */
export {
  RouteContext as UNSAFE_RouteContext
};
```

- 拆解useRoutes

```tsx
/**
 * 1.该 hooks 不是只调用一次，每次重新匹配到路由时就会重新调用渲染新的 element
 * 2.当多次调用 useRoutes 时需要解决内置的 route 上下文问题，继承外层的匹配结果
 * 3.内部通过计算所有的 routes 与当前的 location 关系，经过路径权重计算，得到 matches 数组，然后将 matches 数组重新渲染为嵌套结构的组件
 */
export function useRoutes(
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
): React.ReactElement | null {
  // useRoutes 必须最外层有 Router 包裹，不然报错
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );

  // 1.当此 useRoutes 为第一层级的路由定义时，matches 为空数组（默认值）
  // 2.当该 hooks 在一个已经调用了 useRoutes 的渲染环境中渲染时，matches 含有值（也就是有 Routes 的上下文环境嵌套）
  let { matches: parentMatches } = React.useContext(RouteContext);
  // 最后 match 到的 route（深度最深），该 route 将作为父 route，我们后续的 routes 都是其子级
  let routeMatch = parentMatches[parentMatches.length - 1];
  // 下面是父级 route 的参数，我们会基于以下参数操作，如果项目中只在一个地方调用了 useRoutes，一般都会是默认值
  let parentParams = routeMatch ? routeMatch.params : {};
  // 父路由的完整 pathname，比如路由设置为 /foo/*，当前导航是 /foo/1，那么 parentPathname 就是 /foo/1
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  // 同上面的 parentPathname，不过是 /* 前的部分，也就是 /foo
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  // 获取上下文环境中的 location
  let locationFromContext = useLocation();

  // 判断是否手动传入了 location，否则用默认上下文的 location
  let location;
  if (locationArg) {
    // 格式化为 Path 对象
    let parsedLocationArg =
      typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    // 如果传入了 location，判断是否与父级路由匹配（作为子路由存在）
    invariant(
      parentPathnameBase === "/" ||
        parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
        `the location pathname must begin with the portion of the URL pathname that was ` +
        `matched by all parent routes. The current pathname base is "${parentPathnameBase}" ` +
        `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );

    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  let pathname = location.pathname || "/";
  // 剩余的 pathname，整体 pathname 减掉父级已经匹配的 pathname，才是本次 routes 要匹配的 pathname（适用于 parentMatches 匹配不为空的情况）
  let remainingPathname =
    parentPathnameBase === "/"
      ? pathname
      : pathname.slice(parentPathnameBase.length) || "/";
  // 匹配当前路径，注意是移除了 parentPathname 的相关路径后的匹配
  
  // 通过传入的 routes 配置项与当前的路径，匹配对应渲染的路由
  let matches = matchRoutes(routes, { pathname: remainingPathname });

  // 参数为当前匹配到的 matches 路由数组和外层 useRoutes 的 matches 路由数组
  // 返回的是 React.Element，渲染所有的 matches 对象
  return _renderMatches(
    // 没有 matches 会返回 null
    matches &&
      matches.map(match =>
        // 合并外层调用 useRoutes 得到的参数，内部的 Route 会有外层 Route（其实这也叫父 Route） 的所有匹配属性。
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          // joinPaths 函数用于合并字符串
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase:
            match.pathnameBase === "/"
              ? parentPathnameBase
              : joinPaths([parentPathnameBase, match.pathnameBase])
        })
      ),
    // 外层 parentMatches 部分，最后会一起加入最终 matches 参数中
    parentMatches
  );
}

/**
 * 将多个 path 合并为一个
 * @param paths path 数组
 * @returns
 */
const joinPaths = (paths: string[]): string =>
  paths.join("/").replace(/\/\/+/g, "/");
```

- 总结： 

  a. 获取上下文中调用useRoutes后的信息，如果证明此次调用时作为子路由使用的，需要合并父路由的匹配信息；

  b. 移除父路由已经匹配完毕的pathname前缀后，调用matchRoutes与当前传入的routes配置相匹配，返回匹配到的matches数组；

  c. 调用_renderMatches方法，渲染上一步得倒的matches数组;

也就对应着：路由上下文解析阶段，路由匹配阶段(matchRoutes),路由渲染阶段(_renderMatches)

- matchRoutes

  ```tsx
  /**
   * 通过 routes 与 location 得到 matches 数组
   */
  export function matchRoutes(
    // 用户传入的 routes 对象
    routes: RouteObject[],
    // 当前匹配到的 location，注意这在 useRoutes 内部是先有过处理的
    locationArg: Partial<Location> | string,
    // 这个参数在 useRoutes 内部是没有用到的，但是该方法是对外暴露的，用户可以使用这个参数来添加统一的路径前缀
    basename = "/"
  ): RouteMatch[] | null {
    // 先格式化为 Path 对象
    let location =
      typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  
    // 之前提到过，抽离 basename，获取纯粹的 pathname
    let pathname = stripBasename(location.pathname || "/", basename);
    
    // basename 匹配失败，返回 null
    if (pathname == null) {
      return null;
    }
  
    // 1.扁平化 routes，将树状的 routes 对象根据 path 扁平为一维数组，同时包含当前路由的权重值
    let branches = flattenRoutes(routes);
    // 2.传入扁平化后的数组，根据内部匹配到的权重排序
    rankRouteBranches(branches);
  
    let matches = null;
    // 3.这里就是权重比较完成后的解析顺序，权重高的在前面，先进行匹配，然后是权重低的匹配
    // branches 中有一个匹配到了就终止循环，或者全都没有匹配到
    for (let i = 0; matches == null && i < branches.length; ++i)   {
      // 遍历扁平化的 routes，查看每个 branch 的路径匹配规则是否能匹配到 pathname
      matches = matchRouteBranch(branches[i], pathname);
    }
  
    return matches;
  }
  ```

- 主要方面：

  a. flattenRoutes: 扁平化

  b. rankRouteBranches：排序

  c. matchRouteBranch：路由匹配

  - flattenRoutes:将树形结构转为一维数组

    ```tsx
    // 保存在 branch 中的路由信息，后续路由匹配时会用到
    interface RouteMeta {
      /**
       * 路由的相对路径（刨除与父路由重复部分）
       */
      relativePath: string;
      caseSensitive: boolean;
      /**
       * 用户在 routes 数组中定义的索引位置（相对其兄弟 route 而言）
       */
      childrenIndex: number;
      route: RouteObject;
    }
    
    // 扁平化的路由对象，包含当前路由对象对应的完整 path，权重得分与用于匹配的路由信息
    interface RouteBranch {
      /**
       * 完整的 path（合并了父路由的，下面会引入相对路由的概念）
       */
      path: string;
      /**
       * 权重，用于排序
       */
      score: number;
      /**
       * 路径 meta，依次为从父级到子级的路径规则，最后一个是路由自己
       */
      routesMeta: RouteMeta[];
    }
    
    /**
     * 扁平化路由，会将所有路由扁平为一个数组，用于比较权重
     * @param routes 第一次在外部调用只需要传入该值，用于转换的 routes 数组
     * @param branches
     * @param parentsMeta
     * @param parentPath
     * @returns
     */
    function flattenRoutes(
      routes: RouteObject[],
      // 除了 routes，下面三个都是递归的时候使用的
      branches: RouteBranch[] = [],
      parentsMeta: RouteMeta[] = [],
      parentPath = ""
    ): RouteBranch[] {
      routes.forEach((route, index) => {
        // 当前 branch 管理的 route meta
        let meta: RouteMeta = {
          // 只保存相对路径，这里的值下面会进行处理
          relativePath: route.path || "",
          caseSensitive: route.caseSensitive === true,
          // index 是用户给出的 routes 顺序，会一定程度影响 branch 的排序（当为同一层级 route 时）
          childrenIndex: index,
          // 当前 route 对象
          route
        };
    
        // 如果 route 以 / 开头，那么它应该完全包含父 route 的 path，否则报错
        if (meta.relativePath.startsWith("/")) {
          invariant(
            meta.relativePath.startsWith(parentPath),
            `Absolute route path "${meta.relativePath}" nested under path ` +
              `"${parentPath}" is not valid. An absolute child route path ` +
              `must start with the combined path of all its parent routes.`
          );
    
          // 把父路由前缀去除，只要相对路径
          meta.relativePath = meta.relativePath.slice(parentPath.length);
        }
    
        // 完整的 path，合并了父路由的 path
        let path = joinPaths([parentPath, meta.relativePath]);
        // 第一次使用 parentsMeta 为空数组，从外到内依次推入 meta 到该数组中
        let routesMeta = parentsMeta.concat(meta);
    
        // 开始递归
        if (route.children && route.children.length > 0) {
          // 如果是 index route，报错，因为 index route 不能有 children
          invariant(
            route.index !== true,
            `Index routes must not have child routes. Please remove ` +
              `all child routes from route path "${path}".`
          );
    
          flattenRoutes(route.children, branches, routesMeta, path);
        }
    
        // 没有路径的路由（之前提到过的布局路由）不参与路由匹配，除非它是索引路由
        /* 
          注意：递归是在前面进行的，也就是说布局路由的子路由是会参与匹配的
          而子路由会有布局路由的路由信息，这也是布局路由能正常渲染的原因。
        */
        if (route.path == null && !route.index) {
          return;
        }
    
        // routesMeta，包含父 route 到自己的全部 meta 信息
        // computeScore 是计算权值的方法，我们后面再说
        branches.push({ path, score: computeScore(path, route.index), routesMeta });
      });
    
      return branches;
    }
    ```

  - rankRouteBranches

    ```tsx
    // 动态路由权重，比如 /foo/:id
    const dynamicSegmentValue = 3;
    // 索引路由权重，也就是加了 index 为 true 属性的路由
    const indexRouteValue = 2;
    // 空路由权重，当一段路径值为空时匹配，只有最后的路径以 / 结尾才会用到它
    const emptySegmentValue = 1;
    // 静态路由权重
    const staticSegmentValue = 10;
    // 路由通配符权重，为负的，代表当我们写 * 时实际会降低权重
    const splatPenalty = -2;
    
    // 判断是否有动态参数，比如 :id 等
    const paramRe = /^:\w+$/;
    // 判断是否为 *
    const isSplat = (s: string) => s === "*";
    
    /**
     * 计算路由权值，根据权值大小匹配路由
     * 静态值 > params 动态参数
     * @param path 完整的路由路径，不是相对路径
     * @param index
     * @returns
     */
    function computeScore(path: string, index: boolean | undefined): number {
      let segments = path.split("/");
      // 初始化权重值，有几段路径就是几，路径多的初始权值高
      let initialScore = segments.length;
      // 有一个 * 权重减 2
      if (segments.some(isSplat)) {
        initialScore += splatPenalty;
      }
    
      // 用户传了 index，index 是布尔值，代表 IndexRouter，权重 +2
      if (index) {
        initialScore += indexRouteValue;
      }
    
      // 在过滤出非 * 的部分
      return segments
        .filter(s => !isSplat(s))
        .reduce(
          (score, segment) =>
            score +
            // 如果有动态参数
            (paramRe.test(segment)
              ? // 动态参数权重 3
                dynamicSegmentValue
              : segment === ""
              ? // 空值权重为 1，这个其实只有一种情况，path 最后面多一个 /，比如 /foo 与 /foo/ 的区别
                emptySegmentValue
              : // 静态值权重最高为 10
                staticSegmentValue),
          initialScore
        );
    }
    
    /**
     * 排序，比较权重值
     * @param branches
     */
    function rankRouteBranches(branches: RouteBranch[]): void {
      branches.sort((a, b) =>
        a.score !== b.score
          // 排序，权值大的在前面
          ? b.score - a.score
          : // 如果 a.score === b.score
            compareIndexes(
              // routesMeta 是一个从最外层路由到子路由的数组
              // childrenIndex 是按照 routes 中 route 传入的顺序传值的，写在后面的 index 更大（注意是同级）
              a.routesMeta.map(meta => meta.childrenIndex),
              b.routesMeta.map(meta => meta.childrenIndex)
            )
      );
    }
    
    
    /**
     * 比较子 route 的 index，判断是否为兄弟 route，如果不是则返回 0，比较没有意义，不做任何操作
     * @param a
     * @param b
     * @returns
     */
    function compareIndexes(a: number[], b: number[]): number {
      // 是否为兄弟 route
      let siblings =
        // 这里是比较除了最后一个 route 的 path，需要全部一致才是兄弟 route
        a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
    
      return siblings
        ? 
          // 如果是兄弟节点，按照传入的顺序排序 a.length - 1 和 b.length - 1 是相等的，只是内部的值不同
          a[a.length - 1] - b[b.length - 1]
        : 
          // 只比较兄弟节点，如果不是兄弟节点，则权重相同
          0;
    }
    ```

  - matchRouteBranch

  ```tsx
  /**
   * 通过 branch 和当前的 pathname 得到真正的 matches 数组
   * @param branch
   * @param routesArg
   * @param pathname
   * @returns
   */
  function matchRouteBranch<ParamKey extends string = string>(
    branch: RouteBranch,
    pathname: string
  ): RouteMatch<ParamKey>[] | null {
    let { routesMeta } = branch;
  
    // 初始化匹配到的值
    let matchedParams = {};
    let matchedPathname = "/";
    // 最终的 matches 数组
    let matches: RouteMatch[] = [];
    // 遍历 routesMeta 数组，最后一项是自己的 route，前面是 parentRoute
    for (let i = 0; i < routesMeta.length; ++i) {
      let meta = routesMeta[i];
      // 是否为最后一个 route
      let end = i === routesMeta.length - 1;
      // pathname 匹配过父 route 后的剩余的路径名
      let remainingPathname =
        matchedPathname === "/"
          ? pathname
          : pathname.slice(matchedPathname.length) || "/";
      // 使用的相对路径规则匹配剩余的值
      let match = matchPath(
        // 在匹配时只有最后一个 route 的 end 才会是 true，其余都是 false，这里的 end 意味路径最末尾的 /
        { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
        remainingPathname
      );
  
      // 没匹配上，直接返回 null，整个 route 都匹配失败
      if (!match) return null;
  
      // 匹配上了合并 params，注意这里是改变的 matchedParams，所以所有 route 的 params 都是同一个
      Object.assign(matchedParams, match.params);
  
      let route = meta.route;
  
      // 匹配上了就把路径再补全
      matches.push({
        params: matchedParams,
        pathname: joinPaths([matchedPathname, match.pathname]),
        pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
        route
      });
  
      // 更改 matchedPathname，已经匹配上的 pathname 前缀，用作后续子 route 的循环
      if (match.pathnameBase !== "/") {
        matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
      }
    }
  
    return matches;
  }
  ```

- _renderMatches

  ![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1653642757557-b4892d92-ac95-4d3a-bc26-63bdc9d88633.png)

```tsx
/**
 * 其实就是渲染 RouteContext.Provider 组件（包括多个嵌套的 Provider）
 */
function _renderMatches(
  matches: RouteMatch[] | null,
  // 如果在已有 match 的 route 内部调用，会合并父 context 的 match
  parentMatches: RouteMatch[] = []
): React.ReactElement | null {
  if (matches == null) return null;

  // 生成 outlet 组件，注意这里是从后往前 reduce，所以索引在前的 match 是最外层，也就是父路由对应的 match 是最外层
  /**
   *  可以看到 outlet 是通过不断递归生成的组件，最外层的 outlet 递归层数最多，包含有所有的内层组件，
   *  所以我们在外层使用的 <Outlet /> 是包含有所有子组件的聚合组件
   * */
  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouteContext.Provider
        // 如果有 element 就渲染 element，如果没有填写 element，则默认是 <Outlet />，继续渲染内嵌的 <Route />
        children={
          match.route.element !== undefined ? match.route.element : <Outlet />
        }
        // 代表当前 RouteContext 匹配到的值，matches 并不是全局状态一致的，会根据层级不同展示不同的值，最后一个层级是完全的 matches，这也是之前提到过的不要在外部使用 RouteContext 的原因
        value={{
          outlet,
          matches: parentMatches.concat(matches.slice(0, index + 1))
        }}
      />
    );
    // 最内层的 outlet 为 null，也就是最后的子路由
  }, null as React.ReactElement | null);
}
```

- 总结

  a. useRoutes是react-router中核心，用户不管是直接使用useRoutes还是用Routes与Route组件结合最终都会转换为它。该hook拥有三个阶段：路由上下文解析阶段、路由匹配阶段、路由渲染阶段；

  b. useRoutes在上下文解析阶段会解析在外层是否已经调用过useRoutes，如果调用过会先获取外层的上下文数据，最后将外层数据与用户传入的routes数组结合，生成最终结果；

  c. useRoutes在匹配阶段会将传入的routes与当前的location（可手动传入，但内部会做校验）做一层匹配，通过对route中声明的path的权重计算，拿到当前pathname所能匹配到的最佳matches数组，索引从小到大层数关系从外到内；

  d. useRoutes在渲染阶段会将matches数组渲染为一个聚合的React Element，该元素整体是许多 RouteContext.Provider的嵌套，从外到内依次是【父 => 子 => 孙子】这样的关系，每个 Provider包含两个值，与该级别对应的matches数组（最后的元素时该级别的route自身）与outlet元素，outlet元素就是嵌套RouteContext.Provider存放的地方，每个RouteContext.Provider的children就是route的element属性；

  e. 每次使用outlet实际上都是渲染的内置的路由关系（如果当前route没有element属性，则默认渲染outlet，这也是为什么可以直接写不带element的<Route/>组件嵌套的原因），我们可以在当前级别route的element中任意地方使用outlet来渲染子路由;

##### 3.4.1.5 Navigate

```tsx
// useNavigate 返回的 navigate 函数定义，可以传入 to 或者传入数字控制浏览器页面栈的显示
export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}

export interface NavigateOptions {
  // 是否替换当前栈
  replace?: boolean;
  // 当前导航的 state
  state?: any;
}

/**
 * 返回的 navigate 函数可以传和文件夹相同的路径规则
 */
export function useNavigate(): NavigateFunction {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  
  // Router 提供的 navigator，本质是 history 对象
  let { basename, navigator } = React.useContext(NavigationContext);
  // 当前路由层级的 matches 对象（我们在前面说了，不同的 RouteContext.Provider 层级不同该值不同）
  let { matches } = React.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();

  // 依次匹配到的子路由之前的路径（/* 之前）
  let routePathnamesJson = JSON.stringify(
    matches.map(match => match.pathnameBase)
  );

  // 是否已经初始化完毕（useEffect），这里是要让页面不要在一渲染的时候就跳转，应该在 useEffect 后才能跳转，也就是说如果一渲染就要跳转页面应该写在 useEffect 中
  let activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  // 返回的跳转函数
  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      if (!activeRef.current) return;

      // 如果是数字
      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      // 实际路径的获取，这个方法比较复杂，我们下面单独说
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname
      );

      // 有 basename，加上 basename
      if (basename !== "/") {
        path.pathname = joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state
      );
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );

  return navigate;
}

import type { To } from 'history';

export interface NavigateProps {
  // To 从 history 中引入
  /*
    export declare type To = string | PartialPath;
  */
  to: To;
  replace?: boolean;
  state?: any;
}

/**
 * 组件式导航，当页面渲染后立刻调用 navigate 方法，很简单的封装
 */
export function Navigate({ to, replace, state }: NavigateProps): null {
  // 必须在 Router 上下文中
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    `<Navigate> may be used only in the context of a <Router> component.`
  );

  let navigate = useNavigate();
  React.useEffect(() => {
    navigate(to, { replace, state });
  });

  return null;
}
```

- 总结：Navigate内部还是调用的useNavigate，而useNavigate内部则是对用户传入的路径做处理，获取到最终的路径值，再传递给NavigationContext提供navigator对象；

#### 3.4.2 react-router-dom

主要介绍在react-router-dom中引用的BrowserRouter 、 hashRouter 以及 historyRouter

BrowserRouter 和 HashRouter的区别，是区分链接还是hash，从history库中取到

```tsx
import { createBrowserHistory, createHashHistory } from "history";
```

##### 3.4.2.1 BrowserRouter

```tsx
export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
export function BrowserRouter({
  basename,
  children,
  window,
}: BrowserRouterProps) {
  let historyRef = React.useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
```

##### 3.4.2.2 hashRouter

```tsx
export interface HashRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
export function HashRouter({ basename, children, window }: HashRouterProps) {
  let historyRef = React.useRef<HashHistory>();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory({ window });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
```

##### 3.4.2.3 HistoryRouter

```tsx
export interface HistoryRouterProps {
  basename?: string;
  children?: React.ReactNode;
  history: History;
}

/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 */
function HistoryRouter({ basename, children, history }: HistoryRouterProps) {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}

if (__DEV__) {
  HistoryRouter.displayName = "unstable_HistoryRouter";
}

export { HistoryRouter as unstable_HistoryRouter };
```

## 4. 学习react-router的依赖库--history库

https://www.yuque.com/lpldplws/web/yr5hmd?singleDoc# 《配套习题》 密码：fggd

地址：https://github.com/remix-run/history

react-router v6 相比 v5 的api 有着很大的变动，代码包体积也减少了一半多（20k => 8k），源码行数缩减到了 1600 行，基本可以当做reafactor了一遍，下面主要讲解其依赖的history库究竟完成了什么样的功能

### 4.1 定义

The history library lets you easily manage session history anywhere JavaScript runs. A history object abstracts away the differences in various environments and provides a minimal API that lets you manage the history stack, navigate, and persist state between sessions.

history库可让您在 JavaScript 运行的任何地方轻松管理会话历史记录。history 实例基于环境中的差异，抽象出了一个最小的 API，让您可以管理历史堆栈、导航和保持会话之间的状态。

1. createBrowserHistory：基于浏览器history对象最新 api；

2. createHashHistory：基于浏览器 url 的 hash 参数；

3. createMemoryHistory：基于内存栈，不依赖任何平台；

上面三种方法创建的history对象在react-router中作为三种主要路由的导航器使用：

- BrowserRouter对应createBrowserHistory，由react-router-dom提供

- HashRouter对应createHashHistory，由react-router-dom提供

- MemoryRouter对应createMemoryHistory，由react-router提供，主要用于react-native等基于内存的路由系统

react-router-native是MemoryRouter 换了层皮

```tsx
export interface NativeRouterProps extends MemoryRouterProps {}

/**
 * NativeRouter 就是 react-router 里的 MemoryRouter，使用内存做导航
 * A <Router> that runs on React Native.
 */
export function NativeRouter(props: NativeRouterProps) {
  return <MemoryRouter {...props} />;
}
```

StaticRouter 用于SSR，不依赖history，只对props进行校验

```tsx
import { StaticRouter } from 'react-router-dom/server'
```

### 4.2 路由切换时Action

history定义了三类action：

```tsx
export enum Action {
  Pop = 'POP',
  Push = 'PUSH',
  Replace = 'REPLACE'
}

```

### 4.3 抽象Path与Location

在一次url跳转中，history抽象了两层：Path 和 Location

#### 4.3.1 Path

```tsx
// 下面三个分别是对 url 的 path，query 与 hash 部分的类型别名
export type Pathname = string;
export type Search = string;
export type Hash = string;

// 一次跳转 url 对应的对象
export interface Path {
  pathname: Pathname;
  search: Search;
  hash: Hash;
}

/**
 *  pathname + search + hash 创建完整 url
 */
export function createPath({
  pathname = '/',
  search = '',
  hash = ''
}: Partial<Path>) {
  if (search && search !== '?')
    pathname += search.charAt(0) === '?' ? search : '?' + search;
  if (hash && hash !== '#')
    pathname += hash.charAt(0) === '#' ? hash : '#' + hash;
  return pathname;
}

/**
 * 解析 url，将其转换为 Path 对象
 */
export function parsePath(path: string): Partial<Path> {
  let parsedPath: Partial<Path> = {};

  if (path) {
    let hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    let searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}
```

#### 4.3.2 Location

记录url变化时上下文（state）以及唯一值key

```ts
// 唯一字符串，与每次跳转的 location 匹配
export type Key = string;

// 路由跳转抽象化的导航对象
export interface Location extends Path {
  // 与当前 location 关联的 state 值，可以是任意手动传入的值
  state: unknown;
  // 当前 location 的唯一 key，一般都是自动生成
  key: Key;
}

/**
 * 创建唯一 key
 */
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
```

### 4.4 学习History对象

createBrowserHistory、createHashHistory 以及 createMemoryHistory是基于一个基类的History创建的

#### 4.4.1 base history

一个基类的history包含：

- action（跳转行为）、location（导航对象）
- utils：createHref：将history定义的Path转为url

```ts
history.createHref({
    pathname: '/home',
    search: 'the=query',
    hash:'hash'
}) // 输出: /home?the=query#hash
```

- 路由的跳转方法：push、replace、go、back与forward

```ts
// 将一个新的历史导航推入历史栈，并且移动当前指针到该历史导航
history.push('/home');
// 将当前的路由使用新传入的历史导航替换
history.replace('/home');

// 此方法可以传入一个 Path 对象，同时也可以接收第二个参数 state，可用于保存在内存中的历史导航上下文信息
history.push({
  pathname: '/home',
  search: '?the=query'
}, {
  some: state
});

// replace 方法同上
history.replace({
  pathname: '/home',
  search: '?the=query'
}, {
  some: state
});

// 返回上一个历史导航
history.go(-1);
history.back();

// 去往下一个历史导航
history.go(1);
history.forward();
```

- 路由监听方法：listen、block
  - history.listen：类似后置守卫，在跳转后监听
  - history.block：类似前置钩子，跳转前监听；

- ```ts
  // 开始监听路由跳转
  let unlisten = history.listen(({ action, location }) => {
    // The current location changed.
  });
  
  // 取消监听
  unlisten();
  
  // 开始阻止路由跳转
  let unblock = history.block(({ action, location, retry }) => {
    // retry 方法可以让我们重新进入被阻止跳转的路由
    // 取消监听，如果想要 retry 生效，必须要在先取消掉所有 block 监听，否则 retry 后依然会被拦截然后进入 block 监听中
    unblock();
    retry();
  });
  ```

- History对象的接口定义

```ts
// listen 回调的参数，包含有更新的行为 Action 和 Location 对象
export interface Update {
  action: Action; // 上面提到的 Action
  location: Location; // 上面提到的 Location
}

// 监听函数 listener 的定义
export interface Listener {
  (update: Update): void;
}


// block 回调的参数，除了包含有 listen 回调参数的所有值外还有一个 retry 方法
// 如果阻止了页面跳转（blocker 监听），可以使用 retry 重新进入页面
export interface Transition extends Update {
  /**
   * 重新进入被 block 的页面
   */
  retry(): void;
}

/**
 * 页面跳转失败后拿到的 Transition 对象
 */
export interface Blocker {
  (tx: Transition): void;
}

// 跳转链接，可以是完整的 url，也可以是 Path 对象
export type To = string | Partial<Path>;

export interface History {
  // 最后一次浏览器跳转的行为，可变
  readonly action: Action;

  // 挂载有当前的 location 可变
  readonly location: Location;

  // 工具方法，把 to 对象转化为 url 字符串，其实内部就是对之前提到的 createPath 函数的封装
  createHref(to: To): string;

  // 推入一个新的路由到路由栈中
  push(to: To, state?: any): void;
  // 替换当前路由
  replace(to: To, state?: any): void;
  // 将当前路由指向路由栈中第 delta 个位置的路由
  go(delta: number): void;
  // 将当前路由指向当前路由的前一个路由
  back(): void;
  // 将当前路由指向当前路由的后一个路由
  forward(): void;

  // 页面跳转后触发，相当于后置钩子
  listen(listener: Listener): () => void;

  // 也是监听器，但是会阻止页面跳转，相当于前置钩子，注意只能拦截当前 history 对象的钩子，也就是说如果 history 对象不同，是不能够拦截到的
  block(blocker: Blocker): () => void;
}
```

#### 4.4.2 History对象的创建

- createBrowserHistory

用于给用户提供的创建基于浏览器 history API 的History对象，适用于绝大多数现代浏览器（除了少部分不支持 HTML5 新加入的 history API 的浏览器，也就是浏览器的history对象需要具有pushState、replaceState和state等属性和方法），同时在生产环境需要服务端的重定向配置才能正常使用；

- createHashHistory

用于给用户提供基于浏览器 url hash 值的History对象，一般来说使用这种方式可以兼容几乎所有的浏览器，但是考虑到目前浏览器的发展，在5.x版本内部其实同createBrowserHistory，也是使用最新的 history API 实现路由跳转的（如果你确实需要兼容旧版本浏览器，应该选择使用4.x版本），同时由于浏览器不会将 url 的 hash 值发送到服务端，前端发送的路由 url 都是一致的，就不用服务端做额外配置了；

- createMemoryHistory

用于给用户提供基于内存系统的History对象，适用于所有可以运行 JavaScript 的环境（包括 Node），内部的路由系统完全由用户支配

```ts
export interface BrowserHistory extends History {}
export interface HashHistory extends History {}
export interface MemoryHistory extends History {
  readonly index: number;
}
```

- BrowserHistory与HashHistory的类型就是我们之前提到的History对象的类型；
- MemoryHistory还有一个index属性，因为是基于内存的路由系统，所以我们可以清楚知道当前路由在历史栈中的位置，这个属性就是告诉用户目前的内存历史栈索引的；
- createBrowserHistory

```tsx
// 可以传入指定的 window 对象作为参数，默认为当前 window 对象
export type BrowserHistoryOptions = { window?: Window };

export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  let { window = document.defaultView! } = options;
  // 拿到浏览器的 history 对象，后续会基于此对象封装方法
  let globalHistory = window.history;
  // 初始化 action 与 location
  let action = Action.Pop;
  let [index, location] = getIndexAndLocation(); // 获取当前路由的 index 和 location

  // 省略其余代码
  
  let history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
       // 省略其余代码
    },
    block(blocker) {
       // 省略其余代码
    }
  };

  return history;
}
```

- createHashHistory

```tsx
// 这里同 BrowserRouter
export type HashHistoryOptions = { window?: Window };

export function createHashHistory(
options: HashHistoryOptions = {}
): HashHistory {
  let { window = document.defaultView! } = options;
       // 浏览器本身就有 history 对象，只是 HTML5 新加入了几个有关 state 的 api
       let globalHistory = window.history;
       let action = Action.Pop;
       let [index, location] = getIndexAndLocation();
  
  // 省略其余代码
  
  let history: HashHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      // 省略其余代码
    },
    block(blocker) {
      // 省略其余代码
    }
  };
  
  return history;
}
```

- createMemoryHistory

```ts
// 这里与 BrowserRouter 和 HashRouter 相比有略微不同，因为没有浏览器的参与，所以我们需要模拟历史栈
// 用户提供的描述历史栈的对象
export type InitialEntry = string | Partial<Location>;// 上面提到的 Location 

// 因为不是真实的路由，所以不需要 window 对象，取而代之的是
export type MemoryHistoryOptions = {
  // 初始化的历史栈
  initialEntries?: InitialEntry[];
  // 初始化的 index
  initialIndex?: number;
};


// 判断上下限值
function clamp(n: number, lowerBound: number, upperBound: number) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): MemoryHistory {
  let { initialEntries = ['/'], initialIndex } = options;
  // 将用户传入的 initialEntries 转换为包含 Location 对象数组，会在之后用到
  let entries: Location[] = initialEntries.map((entry) => {
    // readOnly 就是调用 Object.freeze 冻结对象，这里做了个开发模式的封装，遇到都可以直接跳过
    let location = readOnly<Location>({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createKey(),
      ...(typeof entry === 'string' ? parsePath(entry) : entry)
    });
    return location;
  });
  // 这里的 location 与 index 的获取方式不同了，是直接从初始化的 entries 中取的
  let action = Action.Pop;
  let location = entries[index];
  // clamp 函数用于取上下限值，如果 没有传 initialIndex 默认索引为最后一个 location
  // 这这里调用是为了规范初始化的 initialIndex 的值
  let index = clamp(
    initialIndex == null ? entries.length - 1 : initialIndex,
    0,
    entries.length - 1
  );

  // 省略其余代码
  let history: MemoryHistory = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
       // 省略其余代码
    },
    block(blocker) {
       // 省略其余代码
    }
  };

  return history;
}
```

##### 4.4.2.1 action、location与index

除了createMemoryHistory，其余两个方法的index和location都是通过getIndexAndLocation()获取的。下面是getIndexAndLocation()方法的内部逻辑：

- createBrowserHistory

```ts
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

  /**
   * 拿到当前的 state 的 idx 和 location 对象
   */
  function getIndexAndLocation(): [number, Location] {
    let { pathname, search, hash } = window.location;
    // 获取当前浏览器的 state
    let state = globalHistory.state || {};
    // 可以看到下面很多属性都是保存到了 history api 的 state 中
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }
  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  
  // 初始化 index
  if (index == null) {
    index = 0;
    // 调用的是 history api 提供的 replaceState 方法传入 index，这里只是初始化浏览器中保存的 state，没有改变 url
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  //...

  let history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    }
    // ...
  };

  return history;
}
```

- createHashHistory

```ts
export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

 function getIndexAndLocation(): [number, Location] {
    // 注意这里和 browserHistory 不同了，拿的是 hash，其余逻辑是一样的
    // parsePath 方法前面有讲到过，解析 url 为 Path 对象
    let {
      pathname = '/',
      search = '',
      hash = ''
    } = parsePath(window.location.hash.substr(1));
    let state = globalHistory.state || {};
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();

 if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }
  //...

  let history: HashHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    }
    // ...
  };

  return history;
}
```

##### 4.4.2.2 createHref

主要用于将history内部定义的To对象（type To = string | Partial<Path>）转回为 url 字符串

- createBrowserHistory

```ts
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
   // ...
   // BrowserHistory 只需要简单判断一下类型就可以了
  function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to); // createPath见上文
  }
  // ...
  let history: BrowserHistory = {
      // ...
      createHref
      // ...
  }
  return history
}
```

- createHashHistory

```ts
export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
   // ...
   /**
   * 查看是否有 base 标签，如果有则取 base 的 url（不是从 base 标签获取，是从 window.location.href 获取）
   */
  function getBaseHref() {
    let base = document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      let url = window.location.href;
      let hashIndex = url.indexOf('#');
      // 拿到去除了 # 的 url
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }
  // HashHistory 需要额外拿到当前页面的 base url
  function createHref(to: To) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
  }

  // ...

  let history: HashHistory = {
      // ...
      createHref
      // ...
  }
  return history
}
```

- createMemoryHistory

```ts
export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): MemoryHistory {
   // ...
   // 同 BrowserHistory
  function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to);
  }
  // ...

  let history: MemoryHistory = {
      // ...
      createHref
      // ...
  }
  return history
}
```

##### 4.4.2.3 listen

本质上是事件的发布订阅模式

```ts
/**
 * 事件对象
 */
type Events<F> = {
  length: number;
  push: (fn: F) => () => void;
  call: (arg: any) => void;
};

/**
 * 内置的发布订阅事件模型
 */
function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = [];

  return {
    get length() {
      return handlers.length;
    },
    // push 时返回对应的 clear 语句
    push(fn: F) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    call(arg) {
      handlers.forEach((fn) => fn && fn(arg));
    }
  };
}

export interface Update {
  action: Action;
  location: Location;
}
// Listener 类型在之前有提到过，可以往回看看
export interface Listener {
  (update: Update): void;
}

export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  // ...
  let listeners = createEvents<Listener>();
  // ...
  let history: BrowserHistory = {
    // ...
    listen(listener) {
      return listeners.push(listener);
    },
    // ...
  };

  return history;
}

export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
  // ...
  let listeners = createEvents<Listener>();
  // ...
  let history: HashHistory = {
    // ...
    listen(listener) {
      return listeners.push(listener);
    },
    // ...
  };

  return history;
}

export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): MemoryHistory {
  // ...
  let listeners = createEvents<Listener>();
  // ...
  let history: MemoryHistory = {
    // ...
    listen(listener) {
      return listeners.push(listener);
    },
    // ...
  };

  return history;
}
```

##### 4.4.2.5 block

与listen类似，只是BrowserHistory和HashHistory内部额外对于浏览器的beforeunload事件做了监听

```ts
export interface Update {
  action: Action;
  location: Location;
}
export interface Transition extends Update {
  retry(): void;
}

// Blocker 我们之前也提到过
export interface Blocker {
  (tx: Transition): void;
}

const BeforeUnloadEventType = 'beforeunload';

export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  // ...
  let blockers = createEvents<Blocker>();
  // ...
  let history: BrowserHistory = {
    // ...
    block(blocker) {
      let unblock = blockers.push(blocker);

      // 当我们需要监听跳转失败时才加入，并且只需要一个事件来阻止页面关闭
      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock();
        // 当没有 blocker 监听时应该删除 beforeunload 事件的监听
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
    // ...
  };

  return history;
}

export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
  // ...
  let blockers = createEvents<Blocker>();
  // ...
  let history: HashHistory = {
    // ...
    block(blocker) {
      let unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock();
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
    // ...
  };
  return history;
}

// MemoryHistory 这里同 listen 方法一样
export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): MemoryHistory {
  // ...
  let blockers = createEvents<Blocker>();
  // ...
  let history: MemoryHistory = {
    // ...
    // 这里就没有监听浏览器的 beforeunload 事件了
    block(blocker) {
      return blockers.push(blocker);
    }
    // ...
  };

  return history;
}
```

##### 4.4.2.5 push & replace

push和replace除了需要封装将新的导航推入到历史栈的功能外，还需要同时改变当前的action与location，并且判断并调用相应的监听方法

- createBrowserHistory 和 createHasHistory

```ts
function push(to: To, state?: any) {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);

    /**
     * 重新执行 push 操作
     */
    function retry() {
      push(to, state);
    }

    // 当没有 block 监听时 allowTx 返回 true，否则都是返回 false，不会推送新的导航
    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // try...catch 是因为 ios 限制最多调用 100 次 pushState 方法，否则会报错
      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // push 失败后就没有 state 了，直接使用 href 跳转
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
}

function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    // 同 push 函数，否则不会替换新的导航
    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      globalHistory.replaceState(historyState, '', url);

      applyTx(nextAction);
    }
}
```

- createMemoryHistory

```ts
function push(to: To, state?: any) {
  let nextAction = Action.Push;
  let nextLocation = getNextLocation(to, state);
  function retry() {
    push(to, state);
  }

  if (allowTx(nextAction, nextLocation, retry)) {
    // 修改 index 与 entries 历史栈数组
    index += 1;
    // 添加一个新的 location，删除原来 index 往后的栈堆
    entries.splice(index, entries.length, nextLocation);
    applyTx(nextAction, nextLocation);
  }
}

function replace(to: To, state?: any) {
  let nextAction = Action.Replace;
  let nextLocation = getNextLocation(to, state);
  function retry() {
    replace(to, state);
  }

  if (allowTx(nextAction, nextLocation, retry)) {
    // 覆盖掉原来的 location
    entries[index] = nextLocation;
    applyTx(nextAction, nextLocation);
  }
}
```

##### 4.4.2.6 浏览器popstate事件

在浏览器环境下，除了手动调用 history.push 与 history.replace 外，用户还可以通过浏览器的前进和后退按钮改变导航历史，这样的行为在history中则对应着Action的POP，同时浏览器也提供了对应的事件popstate，需要在createBrowserHistory和createHashHistory 事件下处理

```ts
const HashChangeEventType = 'hashchange';
const PopStateEventType = 'popstate';

export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
   //...

  let blockedPopTx: Transition | null = null;
  /**
   * 事件监听回调函数
   * 如果设置了 blocker 的监听器，该函数会执行两次，第一次是跳回到原来的页面，第二次是执行 blockers 的所有回调
   * 这个函数用于监听浏览器的前进后退，因为我们封装的 push 函数已经被我们拦截了
   */
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = Action.Pop;
      let [nextIndex, nextLocation] = getIndexAndLocation();

      // 如果有前置钩子
      if (blockers.length) {
        if (nextIndex != null) {
          // 计算跳转层数
          let delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              // 恢复页面栈，也就是 nextIndex 的页面栈
              retry() {
                go(delta * -1);
              }
            };
            // 跳转回去（index 原本的页面栈）
            go(delta);
          }
        } else {
          // asset
          // nextIndex 如果为 null 会进入该分支打警告信息，这里就先不管它
        }
      } else {
        // 改变当前 action，调用所有的 listener
        applyTx(nextAction);
      }
    }
  }

  // 可以看到在创建 History 对象的时候就进行监听了
  window.addEventListener(PopStateEventType, handlePop);
  //...
}


export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
   //...

  // 下面和 createBrowserHistory 一样
  let blockedPopTx: Transition | null = null;
  function handlePop() {
    //...
  }
  
    
  // 下面额外监听了 hashchange 事件
  window.addEventListener(PopStateEventType, handlePop);
  // 低版本兼容，监听 hashchange 事件
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event
  window.addEventListener(HashChangeEventType, () => {
    let [, nextLocation] = getIndexAndLocation();

    // 如果支持 popstate 事件这里就会相等，因为会先执行 popstate 的回调
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });
  //...
}
```

##### 4.4.2.7 go、back、forward

- createBrowserHistory 与 createHashHistory 

```ts
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  // ...
  function go(delta: number) {
    globalHistory.go(delta);
  }
  // ...
  let history: BrowserHistory = {
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    // ...
  };

  return history;
}

export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
  // ...
  function go(delta: number) {
    globalHistory.go(delta);
  }
  // ...
  let history: HashHistory = {
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    // ...
  };

  return history;
}
```

- createMemoryHistory

```ts
export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): HashHistory {
  // ...
  function go(delta: number) {
    // 跳转到原来的 location
    let nextIndex = clamp(index + delta, 0, entries.length - 1);
    let nextAction = Action.Pop;
    let nextLocation = entries[nextIndex];
    function retry() {
      go(delta);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }
  // ...
  let history: MemoryHistory = {
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    // ...
  };

  return history;
}
```

# React SSR & 同构

https://www.yuque.com/lpldplws/web/qbadd9?singleDoc# 《React SSR & 同构》 密码：wg39

https://www.gatsbyjs.com/     --ssr

## 1. 课程目标

1. 掌握CSR与SSR的区别，掌握SSR的基本用法；
2. 学会在React中如何使用SSR；
3. 实战中掌握SSR里，router、redux、api的封装；

## 2. 课程大纲

1. SSR定义
2. SSR由来
3. 服务端渲染的利弊
4. 同构
5. SSR实战

## 3.SSR 定义

页面的渲染流程：

1. 浏览器通过请求得到一个HTML文本
2. 渲染进程解析HTML文本，构建DOM树
3. 解析HTML的同时，如果遇到内联样式或者样式脚本，则下载并构建样式规则（stytle rules），若遇到JavaScript脚本，则会下载执行脚本。
4. DOM树和样式规则构建完成之后，渲染进程将两者合并成渲染树（render tree）
5. 渲染进程开始对渲染树进行布局，生成布局树（layout tree）
6. 渲染进程对布局树进行绘制，生成绘制记录
7. 渲染进程的对布局树进行分层，分别栅格化每一层，并得到合成帧
8. 渲染进程将合成帧信息发送给GPU进程显示到页面中

![img](https://cdn.nlark.com/yuque/0/2022/png/2340337/1658411852170-3f0d3576-b151-42e5-95da-9572124b6fd6.png)



可以看到，页面的渲染其实就是浏览器将HTML文本转化为页面帧的过程。而如今我们大部分WEB应用都是使用 JavaScript 框架（Vue、React、Angular）进行页面渲染的，也就是说，在执行 JavaScript 脚本的时候，HTML页面已经开始解析并且构建DOM树了，JavaScript 脚本只是动态的改变 DOM 树的结构，使得页面成为希望成为的样子，这种渲染方式叫动态渲染，也可以叫客户端渲染（client side rende）；

那么什么是服务端渲染（server side render）？顾名思义，服务端渲染就是在浏览器请求页面URL的时候，服务端将我们需要的HTML文本组装好，并返回给浏览器，这个HTML文本被浏览器解析之后，不需要经过 JavaScript 脚本的执行，即可直接构建出希望的 DOM 树并展示到页面中。这个服务端组装HTML的过程，叫做服务端渲染；

![img](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731165404271.png)

## 4.SSR由来

### 4.1 web1.0

在没有AJAX的时候，也就是web1.0时代，几乎所有应用都是服务端渲染（此时服务器渲染非现在的服务器渲染），那个时候的页面渲染大概是这样的，浏览器请求页面URL，然后服务器接收到请求之后，到数据库查询数据，将数据丢到后端的组件模板（php、asp、jsp等）中，并渲染成HTML片段，接着服务器在组装这些HTML片段，组成一个完整的HTML，最后返回给浏览器，这个时候，浏览器已经拿到了一个完整的被服务器动态组装出来的HTML文本，然后将HTML渲染到页面中，过程没有任何JavaScript代码的参与。

[![img](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731115513579.png)](https://raw.githubusercontent.com/yacan8/blog/master/images/服务端渲染原理/image-20200731115513579.png)

### 4.2 客户端渲染

在WEB1.0时代，服务端渲染看起来是一个当时的最好的渲染方式，但是随着业务的日益复杂和后续AJAX的出现，也渐渐开始暴露出了WEB1.0服务器渲染的缺点。

- 每次更新页面的一小的模块，都需要重新请求一次页面，重新查一次数据库，重新组装一次HTML
- 前端JavaScript代码和后端（jsp、php、jsp）代码混杂在一起，使得日益复杂的WEB应用难以维护

而且那个时候，根本就没有前端工程师这一职位，前端js的活一般都由后端同学 jQuery 一把梭。但是随着前端页面渐渐地复杂了之后，后端开始发现js好麻烦，虽然很简单，但是坑太多了，于是让公司招聘了一些专门写js的人，也就是前端，这个时候，前后端的鄙视链就出现了，后端鄙视前端，因为后端觉得js太简单，无非就是写写页面的特效（JS），切切图（CSS），根本算不上是真正的程序员。

随之 nodejs 的出现，前端看到了翻身的契机，为了摆脱后端的指指点点，前端开启了一场前后端分离的运动，希望可以脱离后端独立发展。前后端分离，表面上看上去是代码分离，实际上是为了前后端人员分离，也就是前后端分家，前端不再归属于后端团队。

前后端分离之后，网页开始被当成了独立的应用程序（SPA，Single Page Application），前端团队接管了所有页面渲染的事，后端团队只负责提供所有数据查询与处理的API，大体流程是这样的：首先浏览器请求URL，前端服务器直接返回一个空的静态HTML文件（不需要任何查数据库和模板组装），这个HTML文件中加载了很多渲染页面需要的 JavaScript 脚本和 CSS 样式表，浏览器拿到 HTML 文件后开始加载脚本和样式表，并且执行脚本，这个时候脚本请求后端服务提供的API，获取数据，获取完成后将数据通过JavaScript脚本动态的将数据渲染到页面中，完成页面显示。

[![img](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731142605631.png)](https://raw.githubusercontent.com/yacan8/blog/master/images/服务端渲染原理/image-20200731142605631.png)

这一个前后端分离的渲染模式，也就是客户端渲染（CSR）。

### 4.3 服务端渲染

随着单页应用（SPA）的发展，程序员们渐渐发现 SEO（Search Engine Optimazition，即搜索引擎优化）出了问题，而且随着应用的复杂化，JavaScript 脚本也不断的臃肿起来，使得首屏渲染相比于 Web1.0时候的服务端渲染，也慢了不少。

自己选的路，跪着也要走下去。于是前端团队选择了使用 nodejs 在服务器进行页面的渲染，进而再次出现了服务端渲染。大体流程与客户端渲染有些相似，首先是浏览器请求URL，前端服务器接收到URL请求之后，根据不同的URL，前端服务器向后端服务器请求数据，请求完成后，前端服务器会组装一个携带了具体数据的HTML文本，并且返回给浏览器，浏览器得到HTML之后开始渲染页面，同时，浏览器加载并执行 JavaScript 脚本，给页面上的元素绑定事件，让页面变得可交互，当用户与浏览器页面进行交互，如跳转到下一个页面时，浏览器会执行 JavaScript 脚本，向后端服务器请求数据，获取完数据之后再次执行 JavaScript 代码动态渲染页面。

[![img](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731172929911.png)](https://raw.githubusercontent.com/yacan8/blog/master/images/服务端渲染原理/image-20200731172929911.png)

## 5. 服务端渲染的利弊

相比于客户端渲染，服务端渲染有什么优势？

### 5.1. 好处

- 利于SEO

有利于SEO，其实就是有利于爬虫来爬你的页面，然后在别人使用搜索引擎搜索相关的内容时，你的网页排行能靠得更前，这样你的流量就有越高。那为什么服务端渲染更利于爬虫爬你的页面呢？其实，爬虫也分低级爬虫和高级爬虫。

- - 低级爬虫：只请求URL，URL返回的HTML是什么内容就爬什么内容。
  - 高级爬虫：请求URL，加载并执行JavaScript脚本渲染页面，爬JavaScript渲染后的内容。

也就是说，低级爬虫对客户端渲染的页面来说，简直无能为力，因为返回的HTML是一个空壳，它需要执行 JavaScript 脚本之后才会渲染真正的页面。而目前像百度、谷歌、微软等公司，有一部分年代老旧的爬虫还属于低级爬虫，使用服务端渲染，对这些低级爬虫更加友好一些。

- 白屏时间更短

相对于客户端渲染，服务端渲染在浏览器请求URL之后已经得到了一个带有数据的HTML文本，浏览器只需要解析HTML，直接构建DOM树就可以。而客户端渲染，需要先得到一个空的HTML页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。

[![img](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731165404271.png?date=1677586921182)

### 5.2. 缺点 

并不是所有的WEB应用都必须使用SSR，这需要开发者自己来权衡，因为服务端渲染会带来以下问题：

- 代码复杂度增加。为了实现服务端渲染，应用代码中需要兼容服务端和客户端两种运行情况，而一部分依赖的外部扩展库却只能在客户端运行，需要对其进行特殊处理，才能在服务器渲染应用程序中运行。

- 需要更多的服务器负载均衡。由于服务器增加了渲染HTML的需求，使得原本只需要输出静态资源文件的nodejs服务，新增了数据获取的IO和渲染HTML的CPU占用，如果流量突然暴增，有可能导致服务器down机，因此需要使用响应的缓存策略和准备相应的服务器负载。

- 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。

 

# 6.同构

在服务端渲染中，有两种页面渲染的方式：

- 前端服务器通过请求后端服务器获取数据并组装 HTML 返回给浏览器，浏览器直接解析 HTML 后渲染页面

- 浏览器在交互过程中，请求新的数据并动态更新渲染页面

这两种渲染方式有一个不同点就是，一个是在服务端中组装 html 的，一个是在客户端中组装 html 的，运行环境是不一样的。所谓同构，就是让一份代码，既可以在服务端中执行，也可以在客户端中执行，并且执行的效果都是一样的，都是完成这个 html 的组装，正确的显示页面。也就是说，一份代码，既可以客户端渲染，也可以服务端渲染。

![img](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731175841011.png?date=1677587030193)

## 7. SSR实战 

完成同构SPA的SSR应用

1. 基本功能

2. router

3. redux

4. api

# React组件库设计

https://www.yuque.com/lpldplws/web/fab8hw?singleDoc# 《React组件库设计》 密码：iol1

## 1.课程目标

P6~P6+：

1. 学习React组件库设计原理；
2. 掌握常见组件库架构设计分析；

P7~P7+：

1. 能够结合业务从0~1完成组件库开发搭建；
2. 熟悉现有市场上组件库方案，能够结合业务完成组件库的落地；

## 2. 课程大纲

- 项目初始化；
- 开发调试；
- 编译打包；
- 标准化发布流程；

## 3. 主要内容

### 3.1 项目初始化

主要安装项目依赖文件

### 3.1.1 初始化npm包

```ts
mkdir xianzao-ui

cd xianzao-ui

npm init --y // 默认跳过或者自定义完成初始化
```

#### 3.1.2 代码规范

多人项目里代码规范是，基于时间原因，直接使用现成的 [@umijs/fabric](https://github.com/umijs/fabric) 的配置。

```ts
npm i @umijs/fabric prettier -D // 因为@umijs/fabric没有将prettier作为依赖 所以我们需要手动安装
```

如果不想使用这套规范，可以自定义配置

- [EditorConfig](https://editorconfig.org/)：不同编辑器和IDE之间定义和维护一致的代码风格；.editorconfig；

```bash
# http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
```

- [ESlint](https://github.com/eslint/eslint)：代码检查工具； .eslintrc.js；

ESLint 是一个Javascript Linter，帮助我们规范代码质量，提高团队开发效率。

社区比较知名的代码规范，eslint 配合这些代码规范，能够检测出代码潜在问题，从而提高代码质量。

- [standardjs](https://standardjs.com/readme-zhcn.html)
- [airbnb](https://github.com/airbnb/javascript)

```bash
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "babel-eslint", // 解析器
  extends: [], // 扩展
  plugins: [], // 插件
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {},
};
```

- [prettier](https://prettier.io/docs/en/)：一个 Opinionated 的代码格式化工具； .prettierrc；

eslint 虽然能帮助我们提高代码质量，但并不能完全统一编码风格，因为这些代码规范的重点并不在代码风格上，虽然有一定的限制。prettier 是一个能够统一团队编码风格的工具，能够极大的提高团队执行效率，统一的编码风格能很好的保证代码的可读性。

```bash
{
  "quotes": true,
  "semi": true,
  "tabWidth": 2
}
```

- [husky](https://github.com/typicode/husky/)：一个让配置 git hooks 变得更简单的工具； .huskyrc；

原理：husky会根据 package.json里的配置，在.git/hooks目录生成的 hook 脚本（如果你已经自定义了一个hook脚本，husky不会覆盖它）；

```bash
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

- [lint-staged](https://github.com/okonet/lint-staged)：只对 git 中变更的文件进行 lint 操作；.lintstagedrc；

针对暂存的 git 文件运行 linters，不要让不符合规则的代码溜进代码库。lint-staged总是将 所有暂存文件的列表传递给任务，忽略任何文件都应该在任务本身中配置，比如：.prettierignore / .eslintignore 。lint-stage 总是配合 husky一起使用。

```bash
{
  "src/**/*.js": [
    "eslint --fix",
    "prettier --write",
    "git add"
  ]
}
```

#### 3.1.3 commit lint

进行pre-commit代码规范检测；

```bash
npm i husky lint-staged -D
```

```ts
"lint-staged": {
  "src/**/*.ts?(x)": [
    "prettier --write",
    "eslint --fix",
    "git add"
  ],
  "src/**/*.less": [
    "stylelint --syntax less --fix",
    "git add"
  ]
},
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

进行`commit message`检测：

```bash
npm i @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog -D
```

- [commintlint](https://commitlint.js.org/#/)：结合git commit 完成commit message的标准校验；

新增`.commitlintrc.js`写入以下内容：

```bash
module.exports = { extends: ['@commitlint/config-conventional'] };
```

- `commitizen` `cz-conventional-changelog`可以用来生成标准的changeLog；

```bash
"scripts": {
  "commit": "git-cz",
},
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    "pre-commit": "lint-staged"
  }
},
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

后续就可以使用`npm run commit`生成标准的changeLog了；

可以git init初始化git项目

#### 3.1.4 typescript



https://react.iamkasong.com/

https://www.yuque.com/lpldplws/atomml/tmbe7ykqmslqszhe?singleDoc# 《JavaScript高级用法(1/2)》 密码：bwxh
https://www.yuque.com/lpldplws/atomml/os260aysmxgeyhhm?singleDoc# 《JavaScript高级用法(2/2)》 密码：ih4c

（建议有时间的同学可以精读一下，对理解JS有很大的帮助）：http://es5.github.io/#x8.7

https://www.yuque.com/lpldplws/atomml/dh5rlaq0xygdkok5?singleDoc# 《浏览器事件模型&请求》 密码：qnyz

https://www.yuque.com/lpldplws/atomml/my01zht47ol0dh2u?singleDoc# 《JavaScript的垃圾回收和内存泄漏》 密码：kb86

https://www.yuque.com/lpldplws/atomml/xnudhigbps5in504?singleDoc# 《JavaScript的运行机制》 密码：zglx

https://www.yuque.com/lpldplws/atomml/gtn6hvlf3fh1gl6e?singleDoc# 《前端异步处理规范及应用》 密码：cdik

https://www.yuque.com/lpldplws/web/dn72m7?singleDoc# 《Vue基础用法》 密码：xrw9
https://www.yuque.com/lpldplws/web/ck0csfxciuzol315?singleDoc# 《Vue高级用法》 密码：tczl
https://www.yuque.com/lpldplws/web/hadz6f?singleDoc# 《Vue2源码解析（1/2）》 密码：mq90
https://www.yuque.com/lpldplws/web/xx3ygi?singleDoc# 《Vue2源码解析（2/2）》 密码：ya0n
https://www.yuque.com/lpldplws/web/gdw840?singleDoc# 《Vue3新特性&源码解析（1/3）》 密码：mmo8
https://www.yuque.com/lpldplws/web/myfkf4?singleDoc# 《配套习题》 密码：oir9
https://www.yuque.com/lpldplws/web/gmptis?singleDoc# 《Vue3新特性&源码解析（2/3）》 密码：qke4
https://www.yuque.com/lpldplws/web/ty5nga?singleDoc# 《Vue3新特性&源码解析（3/3）》 密码：apwp
https://www.yuque.com/lpldplws/web/sp3cao?singleDoc# 《配套习题》 密码：kv13

https://github.com/XiNiHa/streaming-ssr-showcase 流式渲染的例子

https://www.yuque.com/lpldplws/web/xhqomd?singleDoc# 《前端模块化》 密码：xnou

https://www.yuque.com/lpldplws/web/xpzv1mgsqh7s7b0a?singleDoc# 《函数式编程》 密码：hcu6

https://www.yuque.com/lpldplws/web/lg3g1s?singleDoc# 《React基础》 密码：tv0g
https://www.yuque.com/lpldplws/web/ai228r?singleDoc# 《配套习题》 密码：xnvm
https://www.yuque.com/lpldplws/web/bcocaq?singleDoc# 《React高级用法》 密码：acr1
https://www.yuque.com/lpldplws/web/agvv1m?singleDoc# 《配套习题》 密码：ex5l

https://2022.stateofjs.com/zh-hans/

https://www.yuque.com/lpldplws/web/apczyp?singleDoc# 《React核心源码解析（1/2）》 密码：iwfp
https://www.yuque.com/lpldplws/web/oqnqc7?singleDoc# 《React核心源码解析（2/2）》 密码：xmq3
https://www.yuque.com/lpldplws/web/tmbe7ykqmslqszhe?singleDoc# 《JavaScript高级用法(1/2)》 密码：bwxh

# React源码

https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceLongTaskTiming 性能分析

react理念

卡顿：

1. cpu卡顿：大量计算操作
2. IO 卡顿: 网络请求导致的卡顿

- JSX和 fiber的区别

JSX是渲染在页面的一种视图数据结构

Fiber 是双缓存的结构，是用户来作为更新机制的判断逻辑

Jsx->js->VDOM->fiber

1. render：fiber是如何被创建，并且传给renderer ，异步,对应着scheduler和reconciler

2. commit:接收effect,全部指向，进行对应的更新，同步,对应着render

### render

- beginWork：开始接收第一个fiber节点，并找到所有的fiber节点
- completeWork: 收录effect，并且维护一个effect队列

### commit

 effect队列，去执行对应的vdom的操作

1. effectList: 维护的fiber节点的单向链表
2. updateQueue: 里面每个fiber所含有的更新的内容

- before mutation：DOM更新之前
- mutation：DOM更新中的阶段
- layout：DOM更新后的阶段



https://react.iamkasong.com/img/beginWork.png





# 2023前端面试&框架高频考点解析

## 前端常见的认知误区

Job Model

- 前端开发
- 前端架构（比如prettier,eslint）
- 可视化 echarts
- node
- 图像互动： 2d 3d
- 前端体验 前端数据度量水平 & 体验
- 前端工程化 ci/cd
- 跨端应用 weex rn  flutter ->编译原理electron->tar
- 后台应用 form ui库 low code
- 多媒体流

写页面 ->更高的水平

- prettier

- editor
- eslint
- tsconfig
- husky
- create react app
- vite template

封装成团队统一的规范 cli+ 按需引入ui +埋点

## 面试常见的问题

如果项目有特点，反而八股文问的比较少

A同学 3-5年

- pc web  小程序 electron

- react vue 业务内容

- 权限管理

- CI/CD
- 推动CR脚手架 规范代码风格
- github star

jest 定制化代码规范 SSR DNS CDN

eslint npm

中小厂：提升自己的核心竞争力

大厂： 某个领域处于专家的水平 1个正式+N个外包

外企/国企：

就业城市

1-3：p5 20k+

3-5:  p6 25k-30k+

5+:   p7 35k+ +股票

## 前端框架中的函数式编程思想

react: hooks

vue: vue composition api

