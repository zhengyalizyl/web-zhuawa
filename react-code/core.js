function  Engine() {
  let plugins = {
    before: [],
    current: [()=>{console.log('这个是核心功能')}],
    after: []
  }
  let context = {};

  const run = () => {
    plugins.before.forEach(fn => fn(context));
    plugins.current.forEach(fn => fn(context));
    plugins.after.forEach(fn => fn(context));
  }

  const addPlugins=(status,fn)=>{
    plugins[status].push(fn);
  }

  return {
    addPlugins,
    run,
    init,
  }


}

const engine =Engine();
engine.addPlugins('before',()=>{
   console.log('before阶段')
})
engine.addPlugins('after',()=>{
   console.log('after阶段')
})

engine.run();