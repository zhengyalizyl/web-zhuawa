import React from 'react';
import styles  from './index.module.css';

export const TextPropsType=[{
  name:'string',
  type:'input',
  default:'请输入文字',
  label:"文字内容"
},{
  name:'size',
  type:'select',
  default:'big',
  label:'文字大小',
  values: [
    {
      label: '大',
      value: 'big'
    },
    {
      label: '中',
      value: 'middle'
    },

    {
      label: '小',
      value: 'small'
    },
  ]
},{
  name:'color',
  type:'color',
  default:'#000000',
  label:'文字颜色'
}
]


const  Text=({string,size,color,styleProps})=>{
  return (
   <span style={{color,...styleProps}} className={`${styles[`text_content_size_${size}`]}`}>{string||'默认文字'}</span>
  )
}

export default Text;