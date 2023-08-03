import React,{useState} from 'react';
import { Layout,Menu } from 'antd';
import {Link,Routes,Route} from 'react-router-dom';
import routes from './routes';
import Home from './pages/Home';
import logo from './logo.svg';
import './App.css';

const { Sider, Header, Content } = Layout;
function App() {
  const currentPath = window.location.pathname;
  
  const [selectedPath, setSelectedPath] = useState(
    routes.find(item => currentPath.includes(item.key))?.key || ''
  );
  
  return (
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
        {/* 主应用渲染区域 */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        {/* 子应用渲染区域 */}
        <div id='sub-app'></div>
      </Content>
    </Layout>
  </Layout>
  );
}

export default App;
