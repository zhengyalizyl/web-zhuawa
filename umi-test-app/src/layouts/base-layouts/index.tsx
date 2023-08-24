import Nav from '@/components/nav'
import React from 'react'

const  BaseLayouts=(props:any)=>{
  return (
    <div>
      <Nav></Nav>
      {props.children}
      </div>
  )
}

export default BaseLayouts