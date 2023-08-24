import React from 'react'
import { NavLink } from 'umi';

const Nav = () => {
  return (
    <div>
      <div>
        <NavLink to="/goods/1" activeStyle={{ color: '#393' }}>商品1</NavLink>
      </div>
      <div>

        <NavLink to="/goods/2" activeStyle={{ color: '#393' }}>商品2</NavLink>
      </div>
      <div>
        <NavLink to="/goods/3" activeStyle={{ color: '#393' }}>商品3</NavLink>
      </div>
      <div>
        <NavLink to={
          {
            pathname:'/goods/4',
            search:'?a=1'
          }
        } 
        activeStyle={{ color: '#393' }}>商品4</NavLink>
      </div>
      <div>
        <NavLink to={
          {
            pathname:'/goods/5',
            query:{a:2}
          }
        } 
        activeStyle={{ color: '#393' }}>商品5</NavLink>
      </div>
    </div>
  )
}

export default Nav;