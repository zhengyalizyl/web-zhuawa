# 1.课程大纲

- 什么是编译器
- 编译器的基本思路
- 一个简单的编译器的实现
# 2.什么是编译器

## 2.1 背景

在babel的官网里，最显著的内容就是：
Babel is a JavaScript compiler
那么什么是所谓的JavaScript compiler？我们应当如何学习和理解compiler？

## 2.2 编译器介绍

compiler也叫编译器，是一种电脑程序，它会将用某种编程语言写成的源代码，转换成另一种编程语言。
从维基百科的定义来看，编译器就是个将当前语言转为其他语言的过程，回到babel上，它所做的事就是语法糖之类的转换，比如ES6/ES7/JSX转为ES5或者其他指定版本，因此称之为compiler也是正确的，换言之，像我们平时开发过程中所谓的其他工具，如：

- Less/Saas
- TypeScript/coffeeScript
- Eslint
- etc...
都可以看到compiler的身影，也是通过这些工具，才使得目前的前端工程化能走入相对的深水区，以下会详细介绍下compiler的实现思路及具体demo，帮助同学们了解compiler的基本实现。
# 3.编译器的基本思路

此处主要讲解compiler的思路

## 3.1 词法分析(Lexical Analysis)

### 3.1.1 目的

将文本分割成一个个的“token”，例如：init、main、init、x、;、x、=、3、;、}等等。同时它可以去掉一些注释、空格、回车等等无效字符；

### 3.1.2 生成方式

词法分析生成token的办法有2种：

- 正则
- 有穷状态自动机
需要写大量的正则表达式，正则之间还有冲突需要处理，不容易维护，性能不高，所以正则只适合一些简单的模板语法，真正复杂的语言并不合适。并且有的语言并不一定自带正则引擎。
自动机可以很好的生成token；
有穷状态自动机（finite state machine）：在有限个输入的情况下，在这些状态中转移并期望最终达到终止状态。
![](/Volumes/E/web-zhuawa/ast/有穷状态永动机.PNG)
有穷状态自动机根据确定性可以分为：
“确定有穷状态自动机”（DFA - Deterministic finite automaton）
在输入一个状态时，只得到一个固定的状态。DFA 可以认为是一种特殊的 NFA；
“非确定有穷自动机”（NFA - Non-deterministic finite automaton）
当输入一个字符或者条件得到一个状态机的集合。JavaScript 正则采用的是 NFA 引擎，具体看后文；

## 3.2 语法分析(Syntactic Analysis)

我们日常所说的编译原理就是将一种语言转换为另一种语言。编译原理被称为形式语言，它是一类无需知道太多语言背景、无歧义的语言。而自然语言通常难以处理，主要是因为难以识别语言中哪些是名词哪些是动词哪些是形容词。例如：“进口汽车”这句话，“进口”到底是动词还是形容词？所以我们要解析一门语言，前提是这门语言有严格的语法规定的语言，而定义语言的语法规格称为。

1956年，乔姆斯基将文法按照规范的严格性分为0型、1型、2型和3型共4中文法，从0到3文法规则是逐渐增加严的。一般的计算机语言是2型，因为0和1型文法定义宽松，将大大增加解析难度、降低解析效率，而3型文法限制又多，不利于语言设计灵活性。2型文法也叫做上下文无关文法（CFG）。

 语法分析的目的就是通过词法分析器拿到的token流 + 结合文法规则，通过一定算法得到一颗抽象语法树（AST）。抽象语法树是非常重要的概念，尤其在前端领域应用很广。典型应用如babel插件，它的原理就是：es6代码 → @babel/parser → AST → @babel/traverse → 新的AST → es5代码。

 从生成AST效率和实现难度上，前人总结主要有2种解析算法：自顶向下的分析方法和自底向上的分析方法。自底向上算法分析文法范围广，但实现难度大。而自顶向下算法实现相对简单，并且能够解析文法的范围也不错，所以一般的compiler都是采用深度优先索引的方式。

## 3.3 代码转换（Transformation）

在得到AST后，我们一般会先将AST转为另一种AST，目的是生成更符合预期的AST，这一步称为代码转换。

代码转换的优势：主要是产生工程上的意义

- 易移植：与机器无关，所以它作为中间语言可以为生成多种不同型号的目标机器码服务；
- 机器无关优化：对中间码进行机器无关优化，利于提高代码质量；
- 层次清晰：将AST映射成中间代码表示，再映射成目标代码的工作分层进行，使编译算法更加清晰 ；

对于一个Compiler而言，在转换阶段通常有两种形式：
- 同语言的AST转换；

AST转换为新语言的AST；
这里有一种通用的做法是，对我们之前的AST从上至下的解析（称为traversal），然后会有个映射表（称为visitor），把对应的类型做相应的转换。

## 3.4代码生成 (Code Generation)

在实际的代码处理过程中，可能会递归的分析（）我们最终生成的AST，然后对于每种type都有个对应的函数处理，当然，这可能是最简单的做法。总之，我们的目标代码会在这一步输出，对于我们的目标语言，它就是JavaScript 了。

## 3.5完整链路(Compiler)

至此，我们就完成了一个完整的compiler的所有过程：
```js
input => tokenizer => tokens; // 词法分析
tokens => parser => ast; // 语法分析，生成AST
ast => transformer => newAst; // 中间层代码转换
newAst => generator => output; // 生成目标代码
```



# 4. 一个简单的编译器的实现

此处实现一个基础的compiler

## 4.1 前置内容

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

## 4.2词法分析

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

## 4.3语法分析

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
##  4.4代码转换

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

## 4.5代码生成

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

## 4.6 完整流程

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

# 5. 附录

- [the super tiny compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)；
- [JavaScript compiler](https://github.com/jacksplwxy/JavaScript-compiler)；

# 6.编辑器的实现完成代码及测试脚手架

课程中老师实现的编译器代码：

```js

const isStrNumber = (str) => {
    if (typeof str === 'number') return true;
    if (typeof str !== 'string') return false;
    if (str === ' ' || str === '') return false;
    return !isNaN(str);
}

const isStrLetter = (str) => {
    if (typeof str !== 'string') return false;
    if (str === ' ' || str === '') return false;
    return str.toUpperCase() !== str.toLowerCase();
};

// 词法分析器
// (add2 22222 (subtract 4 2))
const tokenizer = (input) => {
    const tokens = [];
    if (typeof input !== 'string') {
        return tokens;
    }
    for (let i = 0; i <= input.length - 1; i++) {
        const char = input[i];
        switch (true) {
            case ['(', ')'].includes(char):
                tokens.push({
                    type: 'paren',
                    value: char,
                });
                break;
            case char === ' ':
                break;
            // number
            case isStrNumber(char):
                let fullNum = char;
                let nextChar = input[++i];
                if (!isStrNumber(nextChar)) {
                    i--;
                }
                while (isStrNumber(nextChar)) {
                    fullNum += nextChar;
                    nextChar = input[++i];
                }
                tokens.push({
                    type: 'number',
                    value: fullNum
                });
                break;
            default:
                let fullStr = char;
                let nextStr = input[++i];
                if (!(isStrLetter(nextStr) || isStrNumber(nextStr))) {
                    i--;
                }
                while (isStrLetter(nextStr) || isStrNumber(nextStr)) {
                    fullStr += nextStr;
                    nextStr = input[++i];
                }
                tokens.push({
                    type: 'name',
                    value: fullStr
                })
                break;
        }
    }

    return tokens;
};

const parser = (tokens) => {
    const ast = {
        type: 'Program',
        body: []
    };

    let current = 0;

    const handler = () => {
        let item = tokens[current];
        current++;
        if (!item) {
            return;
        }
        switch (true) {
            case item.type === 'number':
                return {
                    type: 'NumberLiteral',
                    value: item.value,
                }
            case item.type === 'paren' && item.value === '(':
                item = tokens[current];
                const astNode = {
                    type: 'CallExpression',
                    name: item.value,
                    params: [],
                };
                item = tokens[++current];
                while (
                    item.type !== 'paren'
                    || item.type === 'paren' && item.value !== ')'
                ) {
                    const subItem = handler();
                    if (subItem) {
                        astNode.params.push(subItem);
                    }
                    item = tokens[current];
                }
                current++;
                return astNode;
            default:
                return;
        }
    };

    while (current <= tokens.length - 1) {
        const result = handler();
        if (result) {
            ast.body.push(result);
        }
    }
    return ast;
};

const traverser = (ast, visitor) => {
    const traverserNode = (node, parent) => {
        const enter = visitor[node.type]?.enter;
        if (enter) {
            enter(node, parent);
        }
        switch(node.type) {
            case 'Program':
                traverserArr(node.body, node);
                break;
            case 'CallExpression':
                traverserArr(node.params, node);
        }
    };
    const traverserArr = (nodes, parent) => {
        nodes.forEach(node => {
            traverserNode(node, parent);
        });
    };
    traverserNode(ast, null);
};

const transformer = (ast) => {
    const newAst = {
        type: 'Program',
        body: []
    };

    ast._context = newAst.body

    traverser(ast, {
        NumberLiteral:  {
            enter(node, parent) {
                parent?._context?.push({
                    type: 'NumberLiteral',
                    value: node.value,
                });
            }
        },
        CallExpression: {
            enter(node, parent) {
                let expression = {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: node.name,
                    },
                    arguments: []
                }
                node._context = expression.arguments;
                if (parent?.type !== 'CallExpression') {
                    expression = {
                        type: 'ExpressionStatement',
                        expression: expression
                    }
                }
                parent?._context?.push(expression);
            }
        }
    });
    return newAst;
};

const codeGenerator = (newAst) => {
    switch (newAst.type) {
        case 'NumberLiteral':
            return newAst.value;
        case 'Identifier':
            return newAst.name;
        // add(2, 4)
        case 'CallExpression':
            return [
                codeGenerator(newAst.callee),
                '(',
                newAst.arguments.map(codeGenerator).join(', '),
                ')'
            ].join('');
        case 'ExpressionStatement':
            return codeGenerator(newAst.expression) + ';';
        case 'Program':
            return newAst.body.map(codeGenerator).join('\n');
    }
};

const compiler = (input) => {
    return codeGenerator(
        transformer(
            parser(
                tokenizer(input)
            )
        )
    );
};

module.exports = {
    tokenizer,
    parser,
    transformer,
    codeGenerator,
    compiler,
};

```

测试脚手架，注意，**需要安装 assert 依赖库**：

```js
const {
  tokenizer,
    parser,
    transformer,
    codeGenerator,
    compiler,
  } = require('./utils');
  const assert = require('assert');
  
  const input  = '(add 2 (subtract 4 2))'; // lisp
  const output = 'add(2, subtract(4, 2));'; // JS
  
  const tokens = [
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'add'      },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'subtract' },
    { type: 'number', value: '4'        },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: ')'        },
    { type: 'paren',  value: ')'        }
  ];
  
  // lisp
  const ast = {
    type: 'Program',
    body: [{
      type: 'CallExpression',
      name: 'add',
      params: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        name: 'subtract',
        params: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }]
  };
  
  const newAst = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'add'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '2'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'subtract'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '4'
          }, {
            type: 'NumberLiteral',
            value: '2'
          }]
        }]
      }
    }]
  };
  
  assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');
  assert.deepStrictEqual(parser(tokens), ast, 'Parser should turn `tokens` array into `ast`');
  assert.deepStrictEqual(transformer(ast), newAst, 'Transformer should turn `ast` into a `newAst`');
  assert.deepStrictEqual(codeGenerator(newAst), output, 'Code Generator should turn `newAst` into `output` string');
  assert.deepStrictEqual(compiler(input), output, 'Compiler should turn `input` into `output`');
  
  console.log('All Passed!');
  
```