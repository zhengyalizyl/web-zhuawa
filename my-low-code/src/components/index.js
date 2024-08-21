import AntdRate, { AntdRatePropsType } from "./antd-rate";
import Button, { ButtonPropsType } from "./button";
import TextContent, { TextPropsType } from './text';

export const componentsList = [
  {
    name: 'button',
    component: Button,
    propsType: ButtonPropsType
  },
  {
    name: 'text',
    component: TextContent,
    propsType: TextPropsType
  },
  {
    name:'antd-rates',
    component:AntdRate,
    propsType:AntdRatePropsType
  }
]