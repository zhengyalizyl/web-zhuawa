import React from 'react'
import styles  from './index.module.css';

export const ButtonPropsType = [{
  name: 'text',
  type: 'input',
  default: '主按钮',
  label: '按钮文字'
}, {
  name: 'size',
  type: 'select',
  default: 'big',
  label: '文字大小',
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
}
]
const Button = ({ text, size,styleProps }) => {
  console.log(size, text)
  return (
    <button style={{...styleProps}}  className={`${styles[`button_content_size_${size}`]}`}>{text || '默认按钮'}</button>
  )
}

export default Button