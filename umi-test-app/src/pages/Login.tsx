import React,{useState} from 'react'
import { Button,NavBar } from 'antd-mobile'

function Login() {
  const [isLogin,setIsLogin] =useState(false);
  return (
    <div>
      <button onClick={()=>{
         setIsLogin(!isLogin)
      }}>{!isLogin?'登陆':'退出登录'}</button>
      <Button 
      color='primary' 
      fill='outline'
      onClick={()=>{
        setIsLogin(!isLogin)
      }}
      >
            Outline
          </Button>
          <NavBar>hhh</NavBar>
          {/* 指向临时的public目录 */}
          <img src="/img/test.png" width={100}></img>
          <div className='myLink'>测试</div>
    </div>
  )
}

export default Login