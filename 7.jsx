import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Menu } from 'antd'
import './App.css'
const menus = [
  {
    key: 'Home',
    label: <Link to="/">主⻚</Link>,
  },
  {
    key: 'app-vue1',
    label: <Link to="/app-vue1">vue微应⽤1</Link>,
  },
  {
    key: 'app-vue2',
    label: <Link to="/app-vue2">vue微应⽤2</Link>,
  },];
function App() {
  let style = {
    width: '100vw',
    height: '100vh',
  }
  return (
    <Router>
      <div className="App">
        <Menu
          style={{
            width: 256,
          }}
          theme="dark"
          mode="inline"
          items={menus}
        ></Menu>
        <h1>主应⽤启动成功</h1>
        <div id="micro-container" style={style}></div>
      </div>
    </Router>
  )
}


export const MicroApps = [
  {
    name: "vue1App",
    entry: "//localhost:3001",
    container: "#micro-container",
    activeRule: "/app-vue1",
  },
  {
    name: "vue2App",
    entry: "//localhost:3002",
    container: "#micro-container",
    activeRule: "/app-vue2",
  },];



import React from "react";
import ReactDOM from "react-dom/client";
import { registerMicroApps, start } from "qiankun";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MicroApps } from "./micro-app";
registerMicroApps(MicroApps);
start();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


import './public-path';
import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
let instance = null;
function render() {
  instance = new Vue({
    render: (h) => h(App),
  }).$mount('#app');
}
render();
// 独⽴运⾏时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
export async function bootstrap() {
  console.log('[vue1] vue1 app bootstraped');
}
export async function mount(props) {
  console.log('[vue1] props from main framework mount', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance = null;
}

const { name } = require("./package");
module.exports = {
  devServer: {
    // 配置下⾯内容 否则主应⽤访问会报跨域
    headers: {
      // 配置跨域请求头，解决开发环境的跨域问题
      "Access-Control-Allow-Origin": "*",
    },
    port: "3001",
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应⽤打包成 umd 库格式
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
  },
}



