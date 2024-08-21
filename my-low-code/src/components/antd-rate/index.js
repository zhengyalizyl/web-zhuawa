import React from 'react';
import {Rate} from 'antd'


export const AntdRatePropsType=[{
   name:'allowHalf',
   type:'boolen',
   default:true,
   label:'是否允许半选',
},{
   name:'count',
   tyoe:'input',
   default:5,
   label:'star总数'
}]

const  AntdRate=(props)=>{
  return (
    <Rate {...props} style={props.styleProps}/>
  )
}

export default AntdRate