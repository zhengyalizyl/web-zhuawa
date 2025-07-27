"use client" 
import React from 'react'
import NavBar from '../Navbar'
import Footer from '../Footer'
import { Layout } from 'antd'
const { Content } = Layout;

const  BasicLayout:React.FC<{children:React.ReactNode}>=({children}) => {
  return (
    <Layout>
      <NavBar/>
     <Content style={{ padding: '24px', flex: 1 }}>
        {children}
      </Content>
      <Footer/>
    </Layout>
  )
}

export default BasicLayout