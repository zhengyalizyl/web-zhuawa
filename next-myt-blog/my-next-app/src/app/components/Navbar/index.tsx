"use client";
import { Button, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { navs } from './config';
import { useRouter,usePathname } from 'next/navigation'; // 注意从 next/navigation 导入

const { Header } = Layout;

const NavBar = () => {
  const [isShowLogin,setIsShowLogin] =useState(false)
  const router = useRouter(); // 使用 useRouter 钩子
  const pathname = usePathname(); // 获取当前路径
  const onClick = ({ key }: { key: string }) => {
    router.push(key); // 使用 router.push 进行导航
  };
const handleGotoEditoPage = () => {
  
}

const handleLogin=()=>{
  setIsShowLogin(true)
}

const  handleClose =()=>{
  setIsShowLogin(false)
}

  return (
    <>
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        items={navs?.map(item => ({
          key: item.path,
          label: item.name
        }))}
        selectedKeys={[pathname]} // 设置当前选中的菜单项
        onClick={onClick}
        style={{ flex: 1, minWidth: 0 }}
      />
      <div className=''>
        <Button onClick={handleGotoEditoPage}  type="link">写文章</Button>
        <Button className="ml-[8px]" type="primary">登录</Button>
      </div>
    </Header>
    </>
  );
};

export default NavBar;