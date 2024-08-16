
const { SyncHook } = require('tapable');

const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

hook.tap('flag1', (a1, a2, a3) => {
    console.log('flag1', a1, a2, a3)
})

hook.tap('flag2', (a1, a2, a3) => {
    console.log('flag2', a1, a2, a3)
})

hook.call('hello', 'luyi','yunyin')