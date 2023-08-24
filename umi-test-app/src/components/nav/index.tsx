import React from 'react'
import { NavLink } from 'umi';

const  Nav=()=>{
  return (
    <div>
      <NavLink to="/goods" activeStyle={{color:'#393'}}>商品</NavLink>|
      <NavLink to="/login" activeStyle={{color:'#393'}}>登陆</NavLink>|
      <NavLink to="/reg" activeStyle={{color:'#393'}}>注册</NavLink>
    </div>
  )
}

export default Nav;