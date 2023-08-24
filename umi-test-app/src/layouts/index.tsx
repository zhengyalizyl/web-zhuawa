import React from 'react'
import { NavLink ,useLocation} from 'umi'
import './index.less'

function index(props:any) {
  const location=useLocation();
  if(location.pathname==='/city'||location.pathname.includes('detail')){
    return props.children
  }
  return (
    <div>
      <div>layout</div>
      <ul>
        <li>
          <NavLink to="/film" activeClassName='active'>film</NavLink>
        </li>
        <li>
          <NavLink to="/center" activeClassName='active'>center</NavLink>
        </li>
        <li>
          <NavLink to="/city" activeClassName='active'>city</NavLink>
        </li>
      </ul>
      {props.children}
    </div>
  )
}

export default index