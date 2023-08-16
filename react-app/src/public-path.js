//webpack在运行时生成的路径会自动拼接上这个全局变量（如果有的话）
// __webpack_public_path__ = 'http://localhost:3001'

if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}