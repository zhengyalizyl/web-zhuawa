const generate = require("@babel/generator").default;
// babel 是个编译器的case
// 所以babel 的插件，可以改变代码结构的

const consolePlugin = function({ types}) {
    return {
        visitor: {
            CallExpression(path) {
                const name = generate(path.node.callee).code;
                if(['console.log', 'console.info', 'console.error'].includes(name)) {
                    const { line, column } = path.node.loc.start;
                    path.node.arguments.unshift(types.stringLiteral(`filepath: ${line} ${column}`))
                }
            }
        }
    }
}

module.exports = consolePlugin;
