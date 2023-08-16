import './public-path.js'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

let root;
//将render方法用函数包裹，供后续住应用和独立运行调用
function render(props) {
  const { container } = props;
  // console.log(container)
  const dom = container ? container.querySelector('#root') : document.getElementById('root');
  root = ReactDOM.createRoot(dom);
  root.render(<BrowserRouter basename='/sub-react'>
    <App />
  </BrowserRouter>)
}

//判断是否在qiankun环境下，非qiankun环境下独立运行
if(!window.__POWERED_BY_QIANKUN__){
  render({});
}

//各个生命周期
//bootstrap只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用mount钩子，不会再重复触发bootstrap
export async function bootstrap(){
  console.log('react app bootstraped');
}

//应用每次进入都会调用mount方法，通常我们在这里触发应用的渲染方法
export async function mount(props){
  render(props)
}


//应用每次切出/卸载会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount(props){
  const { container } = props;
  const root=container ? container.querySelector('#root') : document.querySelector('#root');
  console.log(root, ReactDOM.unmountComponentAtNode,'-----root')
  // ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}

