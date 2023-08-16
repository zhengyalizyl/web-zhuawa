import { fetchResource } from "./fetch-resource";

export const importHTML = async (url) => {
  // const html = await fetch(url).then(res => res.text());
  const html = await fetchResource(url);
  const template = document.createElement('div');
  template.innerHTML = html;
  // template.innerHTML = `<p>in</p>`

  const scripts = template.querySelectorAll('script');
  // console.log(scripts)
  //获取所有script标签的代码:[代码，代码]
  function getExternalScripts() {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src');
      if (!src) {
        return Promise.resolve(script.innerHTML)
      } else {
        return fetchResource(
          src.startsWith('http') ? src : `${url}${src}`
        )
      }
    }))
  }

  //获取并执行所有的script脚本代码
  async function execScripts() {
    const tempScripts = await getExternalScripts();
    //  console.log(tempScripts)
    //手动构造一个commonjs模块环境
    const module = {
      exports: {

      }
    };
    const exports = module.exports;
    tempScripts.forEach(script =>{
      eval(script);
    })

    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts
  }
}