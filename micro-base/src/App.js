import React,{useState,useEffect} from 'react';
import { Button, Layout,Menu } from 'antd';
import {Link,Routes,Route} from 'react-router-dom';
import routes from './routes';
import Home from './pages/Home';
import logo from './logo.svg';
import './App.css';
import { useCallback } from 'react';
import {actions} from './index'

const { Sider, Header, Content } = Layout;
function App() {
  const currentPath = window.location.pathname;
  
  const [selectedPath, setSelectedPath] = useState(
    routes.find(item => currentPath.includes(item.key))?.key || ''
  );
  const [isLogin,setLogin] =useState(false);

  const handleStateChange=useCallback((state)=>{
    if(isLogin!==state.isLogin){
       setLogin(state.isLogin)
    }
 })

   useEffect(()=>{
        actions.onGlobalStateChange(handleStateChange);
        return ()=>{
          actions.offGlobalStateChange(handleStateChange)
        }
   },[isLogin])

   const handleToggleLoginState=()=>{
    actions.setGlobalState({
      isLogin:!isLogin
    })
   }

    // 重写函数
    const _wr = function (type) {
      const orig = (window).history[type]
      return function () {
        const rv = orig.apply(this, arguments)
        const e= new Event(type)
        e.arguments = arguments
        window.dispatchEvent(e)
        return rv
      }
    }
  
    window.history.pushState = _wr('pushState')
  
    // 在这个函数中做跳转后的逻辑
    const bindHistory = () => {
      const currentPath = window.location.pathname;
      setSelectedPath(
        routes.find(item => currentPath.includes(item.key))?.key || ''
      )
    }
  
    // 绑定事件
    window.addEventListener('pushState', bindHistory)
  
  return (
    <>
    <Layout>
    <Sider collapsedWidth="0">
      <img src={logo} className='page-logo' alt="" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['main-app']}
        selectedKeys={[selectedPath || 'main-app']}
        onClick={({ key }) => setSelectedPath(key)}
      >
        {
          routes.filter((item) => item.showMenu).map(route => {
            return (
              <Menu.Item key={route.key}>
                <Link to={route.path}>
                  {route.title}
                </Link>
              </Menu.Item>
            );
          })
        }
      </Menu>
    </Sider>
    <Layout>
      <Header style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0', height: '100%', background: '#fff', padding: '24px' }}>
      <Button onClick={handleToggleLoginState}>{!isLogin?"点击登陆":"退出登陆"}</Button>
        {/* 主应用渲染区域 */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        {/* 子应用渲染区域 */}
        <div id='sub-app'></div>
      </Content>
    </Layout>
  </Layout>
  </>
  );
}

export default App;
