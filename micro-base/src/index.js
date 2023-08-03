import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {start,registerMicroApps} from 'qiankun'
import { BrowserRouter } from 'react-router-dom'

//1.加载的子应用列表
const  apps=[
  {
  name:'sub-react',//子应用的名称
  entry:'//localhost:8080',//默认会加载这个路径下的html,解析里面的js
  activeRules:'/sub-react',//匹配的路由
  container:'#sub-app'//加载的容器
}]

//2. 注册子应用
registerMicroApps(apps,{
   beforeLoad:[async app=>console.log('before load',app.name)],
   beforeMount:[async app=>console.log('before mount',app.name)],
   afterMount:[async app=>console.log('after mount',app.name)]
})

//3. 启动微服务
start();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <App />
</BrowserRouter>
);

