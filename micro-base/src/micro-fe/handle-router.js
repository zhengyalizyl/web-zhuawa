import { getApps } from ".";
import { importHTML } from "./import-html";
import { getNextRoute, getPrevRoute } from "./rewrite-router";

async function bootstrap(app){
  app.bootstrap&& (await app.bootstrap());
}
async function mount(app){
  app.mount&&(await app.mount({
    container:document.querySelector(app.container)
  }));
}
async function unmount(app){
  app.unmount&&(await app.unmount({
    container:document.querySelector(app.container)
  }));
}


export const handleRouter = async () => {
  const apps = getApps();
  //获取上一个路由
  const prevApp=apps.find(item=>getPrevRoute().startsWith(item.activeRule))
  //获取下一个路由
  let app = apps.find(item => getNextRoute().startsWith(item.activeRule));
   
  //如果有上一个应用则将上一个应用销毁
  if(prevApp){
    await unmount(prevApp)
  }

  if (!app) {
    return
  }

  // 3.加载子应用
  const { template, getExternalScripts, execScripts } =await importHTML(app.entry);
  const container = document.querySelector(app.container);
  container.appendChild(template);


  //配置全局变量，让其知道是从为微前端
  window.__POWERED_BY_QIANKUN__ = true;
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__=app.entry+'/';
  const appExports=await execScripts();
  const {bootstrap:bootstrap2,mount:mount2,unmount:unmount2} =appExports;
  app={
    ...app,
    bootstrap:bootstrap2,
    mount:mount2,
    unmount:unmount2
  }

  bootstrap(app);
  mount(app);
  unmount(app)
  // 请求获取子应用的资源：HTML、css、js
  // const html = await fetch(app.entry).then(res => res.text());
  // const container = document.querySelector(app.container);
  //客户端渲染需要执行javascript来生成
  // 浏览器通过安全考虑，innerHTML中的script不会加载执行
  // container.innerHTML = html;
  //手动加载子应用的script
  //执行script中的代码
  //eval或new Function

  // 4.渲染子应用
}
